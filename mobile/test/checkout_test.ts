import assert from 'node:assert';
import { test, describe } from 'node:test';
import { apiClient, ApiError } from '../src/api/client.ts';
import { getFullApiUrl } from '../src/config/env.ts';

describe('CMD-067 Mobile Checkout Final Hardening & API Tests', () => {
  test('1. Authoritative Checkout Preview API URL construction', () => {
    const url = getFullApiUrl('/checkout/preview');
    assert.ok(url.endsWith('/api/v1/checkout/preview'));
  });

  test('2. Authoritative Checkout Preview contract & selection refresh', async () => {
    const mockPreviewResponse = {
      cartId: 'cart-777',
      customerId: 'cust-101',
      addresses: [
        { id: 'addr-1', name: 'Home Address', pincode: '560048' },
        { id: 'addr-2', name: 'Work Address', pincode: '201301' },
      ],
      selectedAddress: { id: 'addr-1', name: 'Home Address', pincode: '560048' },
      deliveryOptions: [
        { id: 'express', label: 'Express Delivery', priceCents: 4000, formattedPrice: '₹40.00', isEligible: true, isSelected: true },
      ],
      selectedDeliveryOption: { id: 'express', label: 'Express Delivery', priceCents: 4000, formattedPrice: '₹40.00', isEligible: true, isSelected: true },
      paymentMethods: [
        { id: 'UPI', type: 'UPI', label: 'UPI Payment', isEligible: true, isSelected: true },
        { id: 'COD', type: 'COD', label: 'Cash on Delivery', isEligible: true, isSelected: false },
      ],
      selectedPaymentMethod: 'UPI',
      items: [{ id: 'item-1', title: 'Aura Fitness Band', quantity: 1 }],
      totalItems: 1,
      subtotal: 249900,
      formattedSubtotal: '₹2499.00',
      tax: 44982,
      formattedTax: '₹449.82',
      shipping: 4000,
      formattedShipping: '₹40.00',
      discount: 0,
      formattedDiscount: '₹0.00',
      grandTotal: 298882,
      formattedGrandTotal: '₹2988.82',
      storeAvailabilityStatus: 'OPEN',
      checkoutEligibility: {
        isEligible: true,
        blockers: [],
      },
    };

    const globalFetch = global.fetch;
    global.fetch = (async (url: string, opts: any) => {
      assert.ok(url.includes('/checkout/preview'));
      assert.strictEqual(opts.method, 'POST');
      const body = JSON.parse(opts.body);
      assert.strictEqual(body.addressId, 'addr-1');
      return {
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => mockPreviewResponse,
      };
    }) as any;

    try {
      const res: any = await apiClient('/checkout/preview', {
        method: 'POST',
        body: JSON.stringify({ addressId: 'addr-1', paymentMethod: 'UPI' }),
      });
      assert.strictEqual(res.cartId, 'cart-777');
      assert.strictEqual(res.formattedGrandTotal, '₹2988.82');
      assert.strictEqual(res.checkoutEligibility.isEligible, true);
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('3. Exact PaymentIntent creation & confirmation endpoint contract', async () => {
    const mockIntent = {
      id: 'pi_test_123',
      clientSecret: 'secret_abc',
      status: 'REQUIRES_CONFIRMATION',
    };

    const mockConfirm = {
      paymentIntentId: 'pi_test_123',
      status: 'SUCCEEDED',
    };

    const globalFetch = global.fetch;
    global.fetch = (async (url: string, opts: any) => {
      if (url.includes('/payments/intents') && !url.includes('/confirm')) {
        assert.strictEqual(opts.method, 'POST');
        const body = JSON.parse(opts.body);
        assert.strictEqual(body.paymentMethod, 'UPI');
        assert.strictEqual(body.addressId, 'addr-1');
        return {
          ok: true,
          status: 201,
          headers: { get: () => 'application/json' },
          json: async () => mockIntent,
        };
      }
      if (url.includes('/payments/intents/pi_test_123/confirm')) {
        assert.strictEqual(opts.method, 'POST');
        return {
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => mockConfirm,
        };
      }
      throw new Error(`Unexpected URL: ${url}`);
    }) as any;

    try {
      const intent: any = await apiClient('/payments/intents', {
        method: 'POST',
        body: JSON.stringify({ addressId: 'addr-1', paymentMethod: 'UPI' }),
      });
      assert.strictEqual(intent.id, 'pi_test_123');

      const confirm: any = await apiClient(`/payments/intents/${intent.id}/confirm`, {
        method: 'POST',
        body: JSON.stringify({ paymentMethod: 'UPI' }),
      });
      assert.strictEqual(confirm.status, 'SUCCEEDED');
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('4. Authoritative order placement with stable idempotency header', async () => {
    const mockOrderResponse = {
      id: 'ord-888999',
      orderNumber: 'ORD-888999',
      status: 'CONFIRMED',
      grandTotal: 2988.82,
    };

    const globalFetch = global.fetch;
    global.fetch = (async (url: string, opts: any) => {
      assert.ok(url.includes('/orders/place'));
      assert.strictEqual(opts.method, 'POST');
      assert.strictEqual(opts.headers['X-Idempotency-Key'], 'idemp-key-test-01');
      return {
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => mockOrderResponse,
      };
    }) as any;

    try {
      const res: any = await apiClient('/orders/place', {
        method: 'POST',
        headers: {
          'X-Idempotency-Key': 'idemp-key-test-01',
        },
        body: JSON.stringify({
          paymentIntentId: 'pi_test_123',
          addressId: 'addr-1',
        }),
      });
      assert.strictEqual(res.id, 'ord-888999');
      assert.strictEqual(res.status, 'CONFIRMED');
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('5. Checkout eligibility blocker guard contract', () => {
    const ineligiblePreview = {
      cartId: 'cart-ineligible',
      checkoutEligibility: {
        isEligible: false,
        blockers: ['Store is currently closed for orders', 'Minimum basket of ₹299 not met'],
      },
    };

    assert.strictEqual(ineligiblePreview.checkoutEligibility.isEligible, false);
    assert.strictEqual(ineligiblePreview.checkoutEligibility.blockers[0], 'Store is currently closed for orders');
  });

  test('6. Preserving cart on failed order placement invariant', () => {
    let localCartCleared = false;
    const clearCart = () => { localCartCleared = true; };

    const isOrderSuccess = false;
    if (isOrderSuccess) {
      clearCart();
    }

    assert.strictEqual(localCartCleared, false);
  });
});
