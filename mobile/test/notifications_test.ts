import assert from 'node:assert';
import { test, describe } from 'node:test';
import { handleDeepLink, registerPushToken, unregisterPushToken } from '../src/services/notifications.ts';
import { apiClient, ApiError } from '../src/api/client.ts';
import { getFullApiUrl } from '../src/config/env.ts';

describe('CMD-069 Mobile Push & Deep Link Security Tests', () => {
  test('1. Notification API endpoint URL construction', () => {
    const url = getFullApiUrl('/notifications/devices');
    assert.ok(url.endsWith('/api/v1/notifications/devices'));
  });

  test('2. Authenticated device token registration & refresh contract', async () => {
    const mockDeviceResponse = {
      id: 'dev-1',
      userId: 'user-777',
      token: 'ExponentPushToken[abc123xyz]',
      platform: 'ANDROID',
      isEnabled: true,
    };

    const globalFetch = global.fetch;
    global.fetch = (async (url: string, opts: any) => {
      assert.ok(url.includes('/notifications/devices'));
      assert.strictEqual(opts.method, 'POST');
      const body = JSON.parse(opts.body);
      assert.strictEqual(body.token, 'ExponentPushToken[abc123xyz]');
      assert.strictEqual(body.platform, 'ANDROID');
      return {
        ok: true,
        status: 201,
        headers: { get: () => 'application/json' },
        json: async () => mockDeviceResponse,
      };
    }) as any;

    try {
      const res: any = await registerPushToken('ExponentPushToken[abc123xyz]', 'ANDROID');
      assert.strictEqual(res.id, 'dev-1');
      assert.strictEqual(res.token, 'ExponentPushToken[abc123xyz]');
      assert.strictEqual(res.isEnabled, true);
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('3. Unregister device token on logout contract', async () => {
    const globalFetch = global.fetch;
    global.fetch = (async (url: string, opts: any) => {
      assert.ok(url.includes('/notifications/devices/ExponentPushToken%5Babc123xyz%5D'));
      assert.strictEqual(opts.method, 'DELETE');
      return {
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: true }),
      };
    }) as any;

    try {
      const ok = await unregisterPushToken('ExponentPushToken[abc123xyz]');
      assert.strictEqual(ok, true);
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('4. Product Deep Link navigation', () => {
    let navigatedPath = '';
    const mockRouter = { push: (p: string) => { navigatedPath = p; } };

    const handled = handleDeepLink({ type: 'product', id: 'prod-42' }, mockRouter);
    assert.strictEqual(handled, true);
    assert.strictEqual(navigatedPath, '/products/prod-42');
  });

  test('5. Category Deep Link navigation', () => {
    let navigatedPath = '';
    const mockRouter = { push: (p: string) => { navigatedPath = p; } };

    const handled = handleDeepLink({ type: 'category', id: 'electronics' }, mockRouter);
    assert.strictEqual(handled, true);
    assert.strictEqual(navigatedPath, '/products?category=electronics');
  });

  test('6. Order Deep Link navigation', () => {
    let navigatedPath = '';
    const mockRouter = { push: (p: string) => { navigatedPath = p; } };

    const handled = handleDeepLink({ type: 'order', id: 'ord-101' }, mockRouter);
    assert.strictEqual(handled, true);
    assert.strictEqual(navigatedPath, '/orders/ord-101');
  });

  test('7. Refund Deep Link navigation', () => {
    let navigatedPath = '';
    const mockRouter = { push: (p: string) => { navigatedPath = p; } };

    const handled = handleDeepLink({ type: 'refund', id: 'ord-101' }, mockRouter);
    assert.strictEqual(handled, true);
    assert.strictEqual(navigatedPath, '/orders/ord-101');
  });

  test('8. Promotion Deep Link navigation', () => {
    let navigatedPath = '';
    const mockRouter = { push: (p: string) => { navigatedPath = p; } };

    const handled = handleDeepLink({ type: 'promotion', id: 'summer-sale' }, mockRouter);
    assert.strictEqual(handled, true);
    assert.strictEqual(navigatedPath, '/products?campaign=summer-sale');
  });

  test('9. Quick Tracking Deep Link navigation', () => {
    let navigatedPath = '';
    const mockRouter = { push: (p: string) => { navigatedPath = p; } };

    const handled = handleDeepLink({ type: 'quick_tracking', id: 'flado-ord-99' }, mockRouter);
    assert.strictEqual(handled, true);
    assert.strictEqual(navigatedPath, '/tracking/flado-ord-99');
  });

  test('10. Malformed/untrusted payload rejection guard', () => {
    let navigatedPath = '';
    const mockRouter = { push: (p: string) => { navigatedPath = p; } };

    // Null/undefined payloads
    assert.strictEqual(handleDeepLink(null as any, mockRouter), false);

    // Missing ID or non-string ID
    assert.strictEqual(handleDeepLink({ type: 'product' }, mockRouter), false);
    assert.strictEqual(handleDeepLink({ type: 'order', id: '' }, mockRouter), false);
    assert.strictEqual(handleDeepLink({ type: 'order', id: 12345 as any }, mockRouter), false);

    // Non-whitelisted deep link type (e.g. attempt arbitrary route injection)
    assert.strictEqual(handleDeepLink({ type: 'admin_eval' as any, id: 'admin' }, mockRouter), false);

    // Verify no navigation was performed for malformed payloads
    assert.strictEqual(navigatedPath, '');
  });

  test('11. Get notification preferences API contract', async () => {
    const globalFetch = global.fetch;
    global.fetch = (async (url: string, opts: any) => {
      assert.ok(url.includes('/notifications/preferences'));
      assert.strictEqual(opts.method, 'GET');
      return {
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({
          orders: true,
          refunds: true,
          promotions: false,
          quickDelivery: true,
        }),
      };
    }) as any;

    try {
      const { getNotificationPreferences } = await import('../src/services/notifications.ts');
      const prefs = await getNotificationPreferences();
      assert.strictEqual(prefs.orders, true);
      assert.strictEqual(prefs.promotions, false);
      assert.strictEqual(prefs.quickDelivery, true);
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('13. Get & Patch notification preferences via /users/notification-preferences API contract', async () => {
    const globalFetch = global.fetch;
    let requestedUrl = '';
    global.fetch = (async (url: string, opts: any) => {
      requestedUrl = url;
      return {
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({
          orders: true,
          delivery: true,
          refunds: true,
          returns: true,
          promotions: false,
          quickDelivery: true,
        }),
      };
    }) as any;

    try {
      const { getNotificationPreferences, updateNotificationPreferences } = await import('../src/services/notifications.ts');
      const prefs = await getNotificationPreferences();
      assert.ok(requestedUrl.includes('/users/notification-preferences'));
      assert.strictEqual(prefs.promotions, false);

      const updated = await updateNotificationPreferences({ promotions: true });
      assert.ok(requestedUrl.includes('/users/notification-preferences'));
    } finally {
      global.fetch = globalFetch;
    }
  });
});
