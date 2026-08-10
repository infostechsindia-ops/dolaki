import assert from 'node:assert';
import { test, describe, beforeEach } from 'node:test';
import { ENV, getFullApiUrl } from '../src/config/env.ts';
import {
  setSecureItem,
  getSecureItem,
  removeSecureItem,
  clearAuthSessionTokens,
  SECURE_KEYS,
} from '../src/storage/secureStore.ts';
import { apiClient, registerUnauthorizedHandler, ApiError } from '../src/api/client.ts';
import { MARKETPLACE_THEME, FLADO_QUICK_THEME, getThemeForSurface } from '../src/constants/theme.ts';

describe('CMD-060 Mobile Foundation Technical Tests', () => {
  beforeEach(async () => {
    await clearAuthSessionTokens();
  });

  test('1. API Base URL and Full URL Construction', () => {
    assert.strictEqual(typeof ENV.apiBaseUrl, 'string');
    assert.ok(ENV.apiBaseUrl.length > 0);
    assert.strictEqual(getFullApiUrl('/products'), `${ENV.apiBaseUrl}/api/v1/products`);
    assert.strictEqual(getFullApiUrl('cart'), `${ENV.apiBaseUrl}/api/v1/cart`);
  });

  test('2. Secure Token Storage & Retrieval without AsyncStorage leakage', async () => {
    await setSecureItem(SECURE_KEYS.ACCESS_TOKEN, 'test-jwt-token-123');
    const token = await getSecureItem(SECURE_KEYS.ACCESS_TOKEN);
    assert.strictEqual(token, 'test-jwt-token-123');

    await removeSecureItem(SECURE_KEYS.ACCESS_TOKEN);
    const cleared = await getSecureItem(SECURE_KEYS.ACCESS_TOKEN);
    assert.strictEqual(cleared, null);
  });

  test('3. Session Clearing on Logout', async () => {
    await setSecureItem(SECURE_KEYS.ACCESS_TOKEN, 'jwt-1');
    await setSecureItem(SECURE_KEYS.REFRESH_TOKEN, 'refresh-1');
    await setSecureItem(SECURE_KEYS.USER_SESSION, JSON.stringify({ userId: 'u1' }));

    await clearAuthSessionTokens();

    assert.strictEqual(await getSecureItem(SECURE_KEYS.ACCESS_TOKEN), null);
    assert.strictEqual(await getSecureItem(SECURE_KEYS.REFRESH_TOKEN), null);
    assert.strictEqual(await getSecureItem(SECURE_KEYS.USER_SESSION), null);
  });

  test('4. Authorization Header Injection from SecureStore', async () => {
    await setSecureItem(SECURE_KEYS.ACCESS_TOKEN, 'token-abc-789');

    let capturedHeaders: any = null;
    const globalFetch = global.fetch;

    global.fetch = (async (url: string, init?: RequestInit) => {
      capturedHeaders = init?.headers;
      return {
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: true, data: { status: 'OK' } }),
      } as any;
    }) as any;

    try {
      await apiClient('/test');
      assert.strictEqual(capturedHeaders['Authorization'], 'Bearer token-abc-789');
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('5. Global 401 Unauthorized Session Clearing & Handler Dispatch', async () => {
    await setSecureItem(SECURE_KEYS.ACCESS_TOKEN, 'expired-token');
    let unauthorizedDispatched = false;
    registerUnauthorizedHandler(() => {
      unauthorizedDispatched = true;
    });

    const globalFetch = global.fetch;
    global.fetch = (async () => ({
      ok: false,
      status: 401,
      headers: { get: () => 'application/json' },
      json: async () => ({ message: 'Unauthorized' }),
    })) as any;

    try {
      await apiClient('/protected');
      assert.fail('Should have thrown ApiError');
    } catch (err: any) {
      assert.ok(err instanceof ApiError);
      assert.strictEqual(err.statusCode, 401);
      assert.strictEqual(unauthorizedDispatched, true);
      assert.strictEqual(await getSecureItem(SECURE_KEYS.ACCESS_TOKEN), null);
    } finally {
      global.fetch = globalFetch;
      registerUnauthorizedHandler(() => {});
    }
  });

  test('6. Surface Theme Configurations', () => {
    const marketplace = getThemeForSurface('MARKETPLACE');
    const quick = getThemeForSurface('QUICK_COMMERCE');

    assert.strictEqual(marketplace.primary, MARKETPLACE_THEME.primary);
    assert.strictEqual(quick.primary, FLADO_QUICK_THEME.primary);
    assert.notStrictEqual(marketplace.primary, quick.primary);
  });
});
