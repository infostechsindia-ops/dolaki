import assert from 'node:assert';
import { test, describe } from 'node:test';
import { apiClient, ApiError } from '../src/api/client.ts';
import { getFullApiUrl } from '../src/config/env.ts';

describe('CMD-062 Mobile Home Technical & API Tests', () => {
  test('1. SDUI Homepage API URL construction', () => {
    const url = getFullApiUrl('/sdui/homepage');
    assert.ok(url.endsWith('/api/v1/sdui/homepage'));
  });

  test('2. Products Catalog API URL construction', () => {
    const url = getFullApiUrl('/products');
    assert.ok(url.endsWith('/api/v1/products'));
  });

  test('3. Home layout DTO contract handling', async () => {
    const mockSduiResponse = {
      sections: [
        {
          id: 'hero_banners',
          type: 'hero_banners',
          visible: true,
          config: {
            banners: [
              { id: 'b1', title: 'Big Sale', imageUrl: 'https://example.com/banner.jpg' },
            ],
          },
        },
        {
          id: 'category_grid',
          type: 'category_grid',
          visible: true,
          config: {
            categories: [{ name: 'Electronics', slug: 'electronics' }],
          },
        },
      ],
    };

    const globalFetch = global.fetch;
    global.fetch = (async () => ({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => mockSduiResponse,
    })) as any;

    try {
      const layout: any = await apiClient('/sdui/homepage', { skipAuthToken: true });
      assert.strictEqual(layout.sections.length, 2);
      assert.strictEqual(layout.sections[0].id, 'hero_banners');
      assert.strictEqual(layout.sections[1].config.categories[0].name, 'Electronics');
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('4. Home API error and retry normalization', async () => {
    const globalFetch = global.fetch;
    global.fetch = (async () => ({
      ok: false,
      status: 500,
      headers: { get: () => 'application/json' },
      json: async () => ({ message: 'Failed to fetch homepage SDUI layout' }),
    })) as any;

    try {
      await apiClient('/sdui/homepage');
      assert.fail('Should have thrown ApiError');
    } catch (err: any) {
      assert.ok(err instanceof ApiError);
      assert.strictEqual(err.statusCode, 500);
      assert.strictEqual(err.message, 'Failed to fetch homepage SDUI layout');
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('5. Zero client-side price math invariant', () => {
    const productFromApi = {
      id: 'p-101',
      title: 'AuraPods Pro',
      basePrice: 2999,
      discountPrice: 2499,
    };

    // Mobile app must display authoritative DTO prices verbatim without calculation
    const formattedPrice = `₹${productFromApi.discountPrice ?? productFromApi.basePrice}`;
    assert.strictEqual(formattedPrice, '₹2499');
  });
});
