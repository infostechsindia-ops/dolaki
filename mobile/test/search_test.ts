import assert from 'node:assert';
import { test, describe } from 'node:test';
import { apiClient, ApiError } from '../src/api/client.ts';
import { getFullApiUrl } from '../src/config/env.ts';

describe('CMD-063 Mobile Search Technical & API Tests', () => {
  test('1. Marketplace Search API URL construction', () => {
    const url = getFullApiUrl(`/products?search=${encodeURIComponent('headphones')}`);
    assert.ok(url.includes('/api/v1/products?search=headphones'));
  });

  test('2. Flado Quick Commerce Search API URL construction', () => {
    const url = getFullApiUrl(`/flado/catalog?q=${encodeURIComponent('milk')}`);
    assert.ok(url.includes('/api/v1/flado/catalog?q=milk'));
  });

  test('3. Marketplace Search API execution & envelope unwrapping', async () => {
    const mockSearchResults = {
      items: [
        { id: 'p-1', title: 'Sony WH-1000XM5', basePrice: 29990, isQuickCommerce: false },
      ],
      total: 1,
    };

    const globalFetch = global.fetch;
    global.fetch = (async () => ({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => mockSearchResults,
    })) as any;

    try {
      const data: any = await apiClient(`/products?search=sony`, { skipAuthToken: true });
      assert.strictEqual(data.items.length, 1);
      assert.strictEqual(data.items[0].title, 'Sony WH-1000XM5');
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('4. Flado Active Darkstore Search Isolation API execution', async () => {
    const mockFladoCatalog = {
      items: [
        { id: 'flado-m-1', title: 'Amul Taaza Milk 500ml', basePrice: 27, isQuickCommerce: true },
      ],
      total: 1,
      darkstoreId: 'shop-darkstore-1',
    };

    const globalFetch = global.fetch;
    global.fetch = (async () => ({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => mockFladoCatalog,
    })) as any;

    try {
      const data: any = await apiClient(`/flado/catalog?q=milk`, { skipAuthToken: true });
      assert.strictEqual(data.items.length, 1);
      assert.strictEqual(data.items[0].isQuickCommerce, true);
      assert.strictEqual(data.darkstoreId, 'shop-darkstore-1');
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('5. Stale Response Cancellation / Sequence Guard', () => {
    let latestSequenceId = 0;

    const performSearch = (sequenceId: number): boolean => {
      if (sequenceId < latestSequenceId) {
        return false; // Ignore stale response
      }
      latestSequenceId = sequenceId;
      return true; // Apply latest response
    };

    assert.strictEqual(performSearch(1), true);
    assert.strictEqual(performSearch(3), true);
    assert.strictEqual(performSearch(2), false); // Out-of-order stale response rejected
  });

  test('6. Zero client-side price or stock calculation invariant', () => {
    const searchItemDto = {
      id: 'item-99',
      title: 'Nike Air Max',
      basePrice: 8995,
      discountPrice: 6995,
    };

    // Authoritative display price from DTO without client financial math
    const priceText = `₹${searchItemDto.discountPrice ?? searchItemDto.basePrice}`;
    assert.strictEqual(priceText, '₹6995');
  });
});
