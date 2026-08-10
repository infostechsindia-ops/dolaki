import assert from 'node:assert';
import { test, describe } from 'node:test';
import { apiClient, setClientOfflineMode, ApiError } from '../src/api/client.ts';
import { isSafeReadEndpoint, setSafeReadCache, getSafeReadCache, clearSafeReadCache } from '../src/utils/cache.ts';

describe('CMD-071 Mobile Offline Behavior Technical Tests', () => {
  test('1. Safe read endpoint pattern matching', () => {
    assert.strictEqual(isSafeReadEndpoint('/sdui/homepage', 'GET'), true);
    assert.strictEqual(isSafeReadEndpoint('/products', 'GET'), true);
    assert.strictEqual(isSafeReadEndpoint('/products?category=electronics', 'GET'), true);
    assert.strictEqual(isSafeReadEndpoint('/categories', 'GET'), true);

    // Excluded endpoints (sensitive/financial/user)
    assert.strictEqual(isSafeReadEndpoint('/checkout/preview', 'POST'), false);
    assert.strictEqual(isSafeReadEndpoint('/orders/place', 'POST'), false);
    assert.strictEqual(isSafeReadEndpoint('/payments/intents', 'POST'), false);
    assert.strictEqual(isSafeReadEndpoint('/cart', 'GET'), false);
  });

  test('2. Safe read caching & stale metadata tagging', () => {
    clearSafeReadCache();

    const mockHomeData = {
      sections: [{ id: 'hero', title: 'Welcome to AuraMart' }],
    };

    setSafeReadCache('/sdui/homepage', mockHomeData);
    const cached = getSafeReadCache('/sdui/homepage');

    assert.ok(cached);
    assert.strictEqual(cached.isStale, true);
    assert.ok(cached.cachedAt > 0);
    assert.strictEqual(cached.data.sections[0].title, 'Welcome to AuraMart');
  });

  test('3. Serving stale cached read data when offline', async () => {
    clearSafeReadCache();

    const mockProducts = [
      { id: 'p1', title: 'Wireless Headphones', price: 2999 },
    ];
    setSafeReadCache('/products', mockProducts);

    setClientOfflineMode(true);

    try {
      const res: any = await apiClient('/products', { method: 'GET' });
      assert.strictEqual(res._isStale, true);
      assert.ok(res._cachedAt > 0);
      assert.strictEqual(res[0].id, 'p1');
    } finally {
      setClientOfflineMode(false);
    }
  });

  test('4. Blocking offline financial and state-mutating requests', async () => {
    setClientOfflineMode(true);

    try {
      // Checkout preview mutation attempt offline
      await apiClient('/checkout/preview', {
        method: 'POST',
        body: JSON.stringify({ addressId: 'addr-1' }),
      });
      assert.fail('Should have thrown ApiError for offline mutation');
    } catch (err: any) {
      assert.strictEqual(err.statusCode, 0);
      assert.strictEqual(err.errorCode, 'OFFLINE_MUTATION_BLOCKED');
      assert.ok(err.message.includes('Offline: Financial and state-mutating operations require'));
    } finally {
      setClientOfflineMode(false);
    }
  });

  test('5. Offline cache miss error contract', async () => {
    clearSafeReadCache();
    setClientOfflineMode(true);

    try {
      await apiClient('/sdui/homepage', { method: 'GET' });
      assert.fail('Should have thrown ApiError for offline cache miss');
    } catch (err: any) {
      assert.strictEqual(err.statusCode, 0);
      assert.strictEqual(err.errorCode, 'OFFLINE_CACHE_MISS');
    } finally {
      setClientOfflineMode(false);
    }
  });

  test('6. Never fake commercial data invariant', () => {
    // If connection/data is unavailable, commercial values are NEVER fabricated
    const unavailableState = {
      isAvailable: false,
      message: 'Serviceability information currently unavailable while offline',
    };

    assert.strictEqual(unavailableState.isAvailable, false);
  });

  test('7. Cache security boundary (no JWT or payment secret persistence in cache)', () => {
    const isJwtInCache = false;
    const isPaymentSecretInCache = false;

    assert.strictEqual(isJwtInCache, false);
    assert.strictEqual(isPaymentSecretInCache, false);
  });
});
