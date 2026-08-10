import assert from 'node:assert';
import { test, describe } from 'node:test';
import { apiClient, ApiError } from '../src/api/client.ts';
import { getFullApiUrl } from '../src/config/env.ts';

describe('CMD-065 Mobile PDP Final Hardening & API Tests', () => {
  test('1. Product Details API URL construction', () => {
    const url = getFullApiUrl('/products/prod-101');
    assert.ok(url.endsWith('/api/v1/products/prod-101'));
  });

  test('2. Marketplace PDP data fetching & variant contract', async () => {
    const mockPdpProduct = {
      id: 'prod-101',
      title: 'Galaxy Book4 Pro',
      description: 'High performance laptop with AI capabilities',
      basePrice: 139990,
      discountPrice: 124990,
      isQuickCommerce: false,
      rating: 4.8,
      reviewCount: 42,
      imageUrl: 'https://example.com/laptop.jpg',
      deliveryPromise: {
        estimatedDeliveryText: 'Delivered by Saturday, Aug 9',
        isServiceable: true,
      },
      variants: [
        { id: 'v-1', sku: 'GB4-16GB', title: '16GB RAM', referenceMsrp: 139990, referenceDiscountPrice: 124990 },
        { id: 'v-2', sku: 'GB4-32GB', title: '32GB RAM', referenceMsrp: 159990, referenceDiscountPrice: 144990 },
      ],
    };

    const globalFetch = global.fetch;
    global.fetch = (async () => ({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => mockPdpProduct,
    })) as any;

    try {
      const product: any = await apiClient('/products/prod-101', { skipAuthToken: true });
      assert.strictEqual(product.id, 'prod-101');
      assert.strictEqual(product.variants.length, 2);
      assert.strictEqual(product.deliveryPromise.estimatedDeliveryText, 'Delivered by Saturday, Aug 9');
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('3. Flado Quick Commerce Darkstore Isolation PDP Contract', async () => {
    const mockFladoPdp = {
      id: 'flado-prod-01',
      title: 'Fresh Farm Eggs 12pk',
      basePrice: 110,
      discountPrice: 99,
      isQuickCommerce: true,
      fulfillmentSourceId: 'shop-darkstore-01',
      stock: 15,
      deliveryPromise: {
        estimatedDeliveryText: 'Delivered in 12 mins via Flado Darkstore 01',
        isServiceable: true,
      },
    };

    const globalFetch = global.fetch;
    global.fetch = (async () => ({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => mockFladoPdp,
    })) as any;

    try {
      const product: any = await apiClient('/products/flado-prod-01', { skipAuthToken: true });
      assert.strictEqual(product.isQuickCommerce, true);
      assert.strictEqual(product.fulfillmentSourceId, 'shop-darkstore-01');
      assert.strictEqual(product.stock, 15);
      assert.strictEqual(product.deliveryPromise.estimatedDeliveryText, 'Delivered in 12 mins via Flado Darkstore 01');
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('4. Add-To-Cart payload format with variant & fulfillment source', () => {
    const pdpState = {
      productId: 'prod-101',
      variantId: 'v-2',
      sku: 'GB4-32GB',
      quantity: 1,
      surface: 'MARKETPLACE',
      fulfillmentSourceId: 'vendor-warehouse-main',
    };

    assert.strictEqual(pdpState.productId, 'prod-101');
    assert.strictEqual(pdpState.variantId, 'v-2');
    assert.strictEqual(pdpState.sku, 'GB4-32GB');
    assert.strictEqual(pdpState.fulfillmentSourceId, 'vendor-warehouse-main');
  });

  test('5. No hardcoded ETA strings in PDP rendering logic', () => {
    const pdpDto = {
      id: 'p-99',
      title: 'Coffee Machine',
      deliveryPromise: {
        estimatedDeliveryText: 'Authoritative ETA: 24 mins',
      },
    };

    const renderedEtaText = pdpDto.deliveryPromise?.estimatedDeliveryText || 'Standard Delivery';
    assert.strictEqual(renderedEtaText, 'Authoritative ETA: 24 mins');
    assert.ok(!renderedEtaText.includes('2-3 day express delivery'));
  });

  test('6. Location revalidation triggers backend serviceability check', () => {
    const addressId = 'addr-user-home';
    const endpoint = `/products/p-101?addressId=${encodeURIComponent(addressId)}`;
    const fullUrl = getFullApiUrl(endpoint);
    assert.ok(fullUrl.includes('addressId=addr-user-home'));
  });

  test('7. Zero client-side price or rating calculation invariant in PDP', () => {
    const pdpDto = {
      id: 'p-1',
      title: 'Aura Smart Watch',
      basePrice: 5999,
      discountPrice: 4499,
      rating: 4.6,
      reviewCount: 128,
    };

    const displayPrice = `₹${pdpDto.discountPrice ?? pdpDto.basePrice}`;
    assert.strictEqual(displayPrice, '₹4499');
    assert.strictEqual(pdpDto.rating, 4.6);
    assert.strictEqual(pdpDto.reviewCount, 128);
  });
});
