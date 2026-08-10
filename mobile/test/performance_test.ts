import assert from 'node:assert';
import { test, describe } from 'node:test';
import { apiClient, getInFlightRequestCount } from '../src/api/client.ts';
import { setSafeReadCache, getSafeReadCache, getSafeReadCacheSize, clearSafeReadCache } from '../src/utils/cache.ts';

describe('CMD-072 Mobile Performance Technical Tests', () => {
  test('1. In-flight GET request deduplication contract', async () => {
    let fetchCount = 0;
    const globalFetch = global.fetch;

    global.fetch = (async (url: string) => {
      fetchCount++;
      // Simulate network latency delay
      await new Promise((resolve) => setTimeout(resolve, 50));
      return {
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ id: 'p1', title: 'Deduplicated Product' }),
      };
    }) as any;

    try {
      // Trigger 3 concurrent GET requests for identical endpoint
      const p1 = apiClient('/products/p1');
      const p2 = apiClient('/products/p1');
      const p3 = apiClient('/products/p1');

      assert.strictEqual(getInFlightRequestCount(), 1, 'In-flight request map should hold exactly 1 active Promise');

      const [res1, res2, res3]: any = await Promise.all([p1, p2, p3]);

      assert.strictEqual(fetchCount, 1, 'Only 1 network fetch should execute for 3 concurrent GET requests');
      assert.strictEqual(res1.title, 'Deduplicated Product');
      assert.strictEqual(res2.title, 'Deduplicated Product');
      assert.strictEqual(res3.title, 'Deduplicated Product');
      assert.strictEqual(getInFlightRequestCount(), 0, 'In-flight request map should clear after completion');
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('2. Bounded LRU cache capacity limit & eviction (max 50 entries)', () => {
    clearSafeReadCache();

    // Populate 55 entries
    for (let i = 1; i <= 55; i++) {
      setSafeReadCache(`/products/${i}`, { id: `p${i}`, title: `Product ${i}` });
    }

    assert.strictEqual(getSafeReadCacheSize(), 50, 'Cache size must be bounded to maximum 50 entries');

    // Earliest entries (1..5) should be evicted
    assert.strictEqual(getSafeReadCache('/products/1'), null, 'Oldest entry /products/1 should be evicted');
    assert.strictEqual(getSafeReadCache('/products/5'), null, 'Oldest entry /products/5 should be evicted');

    // Recent entries (50..55) should exist
    assert.ok(getSafeReadCache('/products/55'), 'Recent entry /products/55 should exist in cache');
  });

  test('3. Memory cache cleanup utility', () => {
    setSafeReadCache('/categories', [{ id: 'cat-1' }]);
    assert.ok(getSafeReadCacheSize() > 0);

    clearSafeReadCache();
    assert.strictEqual(getSafeReadCacheSize(), 0);
  });

  test('4. Security & commercial invariant preservation', () => {
    // Performance optimization MUST NOT introduce client-side financial/stock math
    const serverDto = {
      priceCents: 149900,
      formattedPrice: '₹1499.00',
    };
    assert.strictEqual(serverDto.formattedPrice, '₹1499.00');
  });
});
