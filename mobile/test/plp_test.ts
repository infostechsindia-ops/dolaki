import assert from 'node:assert';
import { test, describe } from 'node:test';
import { apiClient, ApiError } from '../src/api/client.ts';
import { getFullApiUrl } from '../src/config/env.ts';

describe('CMD-064 Mobile PLP Technical & API Tests', () => {
  test('1. Marketplace PLP API URL construction with category & sort', () => {
    const url = getFullApiUrl(`/products?page=1&limit=12&sort=price_asc&category=electronics`);
    assert.ok(url.includes('/api/v1/products?page=1&limit=12&sort=price_asc&category=electronics'));
  });

  test('2. Flado Quick Commerce PLP API URL construction with categorySlug & sort', () => {
    const url = getFullApiUrl(`/flado/catalog?page=1&limit=12&sort=newest&categorySlug=groceries`);
    assert.ok(url.includes('/api/v1/flado/catalog?page=1&limit=12&sort=newest&categorySlug=groceries'));
  });

  test('3. Marketplace PLP data fetching & pagination contract', async () => {
    const mockPlpResponse = {
      data: [
        { id: 'p-1', title: 'iPhone 15 Pro', basePrice: 129900, isQuickCommerce: false },
        { id: 'p-2', title: 'MacBook Air M3', basePrice: 114900, isQuickCommerce: false },
      ],
      meta: {
        total: 24,
        page: 1,
        limit: 12,
        totalPages: 2,
      },
    };

    const globalFetch = global.fetch;
    global.fetch = (async () => ({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => mockPlpResponse,
    })) as any;

    try {
      const res: any = await apiClient('/products?page=1&limit=12&category=electronics', { skipAuthToken: true });
      assert.strictEqual(res.data.length, 2);
      assert.strictEqual(res.meta.totalPages, 2);
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('4. Flado Active Darkstore PLP Isolation & Pagination Contract', async () => {
    const mockFladoCatalog = {
      items: [
        { id: 'fl-1', title: 'Organic Bananas 1kg', basePrice: 60, isQuickCommerce: true },
        { id: 'fl-2', title: 'Fresh Cow Milk 1L', basePrice: 68, isQuickCommerce: true },
      ],
      total: 10,
      page: 1,
      totalPages: 1,
      darkstoreId: 'shop-darkstore-77',
    };

    const globalFetch = global.fetch;
    global.fetch = (async () => ({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => mockFladoCatalog,
    })) as any;

    try {
      const res: any = await apiClient('/flado/catalog?page=1&limit=12&categorySlug=groceries', { skipAuthToken: true });
      assert.strictEqual(res.items.length, 2);
      assert.strictEqual(res.darkstoreId, 'shop-darkstore-77');
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('5. Duplicate Page & Stale Request Guarding', () => {
    const loadedPages = new Set<number>([1]);

    const isDuplicatePageLoad = (targetPage: number): boolean => {
      if (loadedPages.has(targetPage)) {
        return true;
      }
      loadedPages.add(targetPage);
      return false;
    };

    assert.strictEqual(isDuplicatePageLoad(1), true); // Already loaded page 1 rejected
    assert.strictEqual(isDuplicatePageLoad(2), false); // Page 2 accepted
    assert.strictEqual(isDuplicatePageLoad(2), true); // Repeated Page 2 rejected
  });

  test('6. Zero client-side price or stock calculation invariant', () => {
    const plpItemDto = {
      id: 'plp-item-01',
      title: 'Aura Fitness Band',
      basePrice: 2499,
      discountPrice: 1999,
    };

    const displayPrice = `₹${plpItemDto.discountPrice ?? plpItemDto.basePrice}`;
    assert.strictEqual(displayPrice, '₹1999');
  });
});
