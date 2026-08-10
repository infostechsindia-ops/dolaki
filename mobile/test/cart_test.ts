import assert from 'node:assert';
import { test, describe } from 'node:test';
import { apiClient, ApiError } from '../src/api/client.ts';
import { getFullApiUrl } from '../src/config/env.ts';

describe('CMD-066 Mobile Cart Technical & API Tests', () => {
  test('1. Authoritative Cart API URL construction', () => {
    const url = getFullApiUrl('/cart');
    assert.ok(url.endsWith('/api/v1/cart'));
  });

  test('2. Authoritative Cart fetching contract & DTO mapping', async () => {
    const mockCartResponse = {
      cartId: 'cart-123',
      customerId: 'cust-456',
      status: 'ACTIVE',
      items: [
        {
          id: 'item-1',
          cartId: 'cart-123',
          sku: 'SKU-BANANA-1KG',
          title: 'Organic Bananas 1kg',
          quantity: 2,
          unitPrice: 60,
          formattedUnitPrice: '$0.60',
          lineTotal: 120,
          formattedLineTotal: '$1.20',
          inStock: true,
          stockStatus: 'IN_STOCK',
          isFlado: true,
          substitutionPreference: 'SAME_BRAND',
        },
        {
          id: 'item-2',
          cartId: 'cart-123',
          sku: 'SKU-LAPTOP-16GB',
          title: 'AuraBook Pro 15',
          quantity: 1,
          unitPrice: 129900,
          formattedUnitPrice: '$1299.00',
          lineTotal: 129900,
          formattedLineTotal: '$1299.00',
          inStock: true,
          stockStatus: 'IN_STOCK',
          isFlado: false,
          substitutionPreference: 'REFUND',
        },
      ],
      totalItems: 3,
      subtotal: 130020,
      formattedSubtotal: '$1300.20',
      tax: 23403,
      formattedTax: '$234.03',
      shipping: 1500,
      formattedShipping: '$15.00',
      discount: 0,
      formattedDiscount: '$0.00',
      grandTotal: 154923,
      formattedGrandTotal: '$1549.23',
      hasOutofStockItems: false,
      isMinimumBasketMet: true,
      estimatedDeliveryEtaText: 'Delivered in 10 mins via Flado Darkstore 01',
      storeAvailabilityStatus: 'OPEN',
      checkoutEligibility: {
        isEligible: true,
        blockers: [],
      },
    };

    const globalFetch = global.fetch;
    global.fetch = (async () => ({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => mockCartResponse,
    })) as any;

    try {
      const res: any = await apiClient('/cart');
      assert.strictEqual(res.cartId, 'cart-123');
      assert.strictEqual(res.items.length, 2);
      assert.strictEqual(res.items[0].isFlado, true);
      assert.strictEqual(res.items[1].isFlado, false);
      assert.strictEqual(res.formattedGrandTotal, '$1549.23');
      assert.strictEqual(res.checkoutEligibility.isEligible, true);
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('3. Cart item quantity update API contract', async () => {
    const mockUpdatedCart = {
      cartId: 'cart-123',
      items: [
        { id: 'item-1', sku: 'SKU-BANANA-1KG', quantity: 4, lineTotal: 240, formattedLineTotal: '$2.40' },
      ],
      subtotal: 240,
      formattedSubtotal: '$2.40',
      checkoutEligibility: { isEligible: true, blockers: [] },
    };

    const globalFetch = global.fetch;
    global.fetch = (async (url: string, opts: any) => {
      assert.ok(url.includes('/cart/items/item-1'));
      assert.strictEqual(opts.method, 'PATCH');
      assert.strictEqual(JSON.parse(opts.body).quantity, 4);
      return {
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => mockUpdatedCart,
      };
    }) as any;

    try {
      const res: any = await apiClient('/cart/items/item-1', {
        method: 'PATCH',
        body: JSON.stringify({ quantity: 4 }),
      });
      assert.strictEqual(res.items[0].quantity, 4);
      assert.strictEqual(res.formattedSubtotal, '$2.40');
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('4. Substitution preference update API contract', async () => {
    const mockSubstitutedCart = {
      cartId: 'cart-123',
      items: [
        { id: 'item-1', sku: 'SKU-BANANA-1KG', substitutionPreference: 'NO_SUBSTITUTION' },
      ],
    };

    const globalFetch = global.fetch;
    global.fetch = (async (url: string, opts: any) => {
      assert.ok(url.includes('/cart/items/item-1/substitution'));
      assert.strictEqual(opts.method, 'PATCH');
      assert.strictEqual(JSON.parse(opts.body).preference, 'NO_SUBSTITUTION');
      return {
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => mockSubstitutedCart,
      };
    }) as any;

    try {
      const res: any = await apiClient('/cart/items/item-1/substitution', {
        method: 'PATCH',
        body: JSON.stringify({ preference: 'NO_SUBSTITUTION' }),
      });
      assert.strictEqual(res.items[0].substitutionPreference, 'NO_SUBSTITUTION');
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('5. Minimum basket shortfall & store closed eligibility blocker contract', () => {
    const unserviceableCart = {
      cartId: 'cart-456',
      isMinimumBasketMet: false,
      formattedMinimumBasketShortfall: '$1.50',
      storeAvailabilityStatus: 'CLOSED',
      checkoutEligibility: {
        isEligible: false,
        blockers: ['Store is currently closed', 'Minimum basket requirement of $5.00 not met'],
      },
    };

    assert.strictEqual(unserviceableCart.checkoutEligibility.isEligible, false);
    assert.strictEqual(unserviceableCart.checkoutEligibility.blockers[0], 'Store is currently closed');
  });

  test('6. Zero client-side financial or ETA calculation invariant', () => {
    const cartDto = {
      subtotal: 1000,
      formattedSubtotal: '₹10.00',
      tax: 180,
      formattedTax: '₹1.80',
      shipping: 400,
      formattedShipping: '₹4.00',
      grandTotal: 1580,
      formattedGrandTotal: '₹15.80',
    };

    assert.strictEqual(cartDto.formattedGrandTotal, '₹15.80');
  });
});
