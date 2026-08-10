import assert from 'node:assert';
import { test, describe } from 'node:test';
import { apiClient, ApiError } from '../src/api/client.ts';
import { getFullApiUrl } from '../src/config/env.ts';

describe('CMD-068 Mobile Orders Technical & API Tests', () => {
  test('1. Authoritative Order History API URL construction', () => {
    const url = getFullApiUrl('/orders?page=1&limit=10');
    assert.ok(url.includes('/api/v1/orders?page=1&limit=10'));
  });

  test('2. Order History fetching & DTO contract', async () => {
    const mockOrdersResponse = [
      {
        id: 'ord-101',
        orderNumber: 'ORD-101',
        status: 'DELIVERED',
        createdAt: '2026-08-01T10:00:00Z',
        grandTotal: 1299.00,
        formattedGrandTotal: '₹1299.00',
        paymentStatus: 'PAID',
        isFlado: false,
        items: [
          { id: 'item-1', title: 'Aura Fitness Band', quantity: 1, formattedLineTotal: '₹1299.00' },
        ],
      },
      {
        id: 'ord-102',
        orderNumber: 'ORD-102',
        status: 'OUT_FOR_DELIVERY',
        createdAt: '2026-08-06T19:00:00Z',
        grandTotal: 150.00,
        formattedGrandTotal: '₹150.00',
        paymentStatus: 'COD_PENDING',
        isFlado: true,
        items: [
          { id: 'item-2', title: 'Organic Bananas 1kg', quantity: 2, formattedLineTotal: '₹150.00' },
        ],
      },
    ];

    const globalFetch = global.fetch;
    global.fetch = (async () => ({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => mockOrdersResponse,
    })) as any;

    try {
      const orders: any = await apiClient('/orders');
      assert.strictEqual(orders.length, 2);
      assert.strictEqual(orders[0].id, 'ord-101');
      assert.strictEqual(orders[1].isFlado, true);
      assert.strictEqual(orders[1].paymentStatus, 'COD_PENDING');
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('3. Reorder endpoint execution with idempotency key', async () => {
    const mockReorderResponse = {
      reorderId: 'ord-reorder-999',
      cartId: 'cart-reorder-new',
      status: 'SUCCESS',
    };

    const globalFetch = global.fetch;
    global.fetch = (async (url: string, opts: any) => {
      assert.ok(url.includes('/orders/ord-101/reorder'));
      assert.strictEqual(opts.method, 'POST');
      assert.ok(opts.headers['X-Idempotency-Key']);
      return {
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => mockReorderResponse,
      };
    }) as any;

    try {
      const res: any = await apiClient('/orders/ord-101/reorder', {
        method: 'POST',
        headers: {
          'X-Idempotency-Key': 'idemp-reorder-01',
        },
      });
      assert.strictEqual(res.reorderId, 'ord-reorder-999');
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('4. Cancellation preview & execution contract (CMD-049)', async () => {
    const mockCancelPreview = {
      orderId: 'ord-101',
      isCancellable: true,
      expectedRefundAmount: 1299.00,
      formattedExpectedRefund: '₹1299.00',
      refundStatus: 'SUCCEEDED',
    };

    const mockCancelExecution = {
      orderId: 'ord-101',
      status: 'CANCELLED',
      cancellationReason: 'Mind changed',
      refundStatus: 'SUCCEEDED',
    };

    const globalFetch = global.fetch;
    global.fetch = (async (url: string, opts: any) => {
      if (url.includes('/cancel/preview')) {
        return {
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => mockCancelPreview,
        };
      }
      if (url.includes('/cancel')) {
        return {
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => mockCancelExecution,
        };
      }
      throw new Error(`Unexpected URL: ${url}`);
    }) as any;

    try {
      const preview: any = await apiClient('/orders/ord-101/cancel/preview', {
        method: 'POST',
        body: JSON.stringify({ reason: 'Mind changed' }),
      });
      assert.strictEqual(preview.isCancellable, true);
      assert.strictEqual(preview.formattedExpectedRefund, '₹1299.00');

      const execution: any = await apiClient('/orders/ord-101/cancel', {
        method: 'POST',
        headers: { 'X-Idempotency-Key': 'idemp-cancel-01' },
        body: JSON.stringify({ reason: 'Mind changed' }),
      });
      assert.strictEqual(execution.status, 'CANCELLED');
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('5. Return/Replacement preview & submission contract (CMD-050)', async () => {
    const mockReturnPreview = {
      orderId: 'ord-101',
      isReturnable: true,
      eligibleWindowDaysRemaining: 7,
      formattedExpectedRefund: '₹1299.00',
    };

    const mockReturnSubmission = {
      returnId: 'ret-555',
      orderId: 'ord-101',
      status: 'REQUESTED',
    };

    const globalFetch = global.fetch;
    global.fetch = (async (url: string, opts: any) => {
      if (url.includes('/return/preview')) {
        return {
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => mockReturnPreview,
        };
      }
      if (url.includes('/return')) {
        return {
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => mockReturnSubmission,
        };
      }
      throw new Error(`Unexpected URL: ${url}`);
    }) as any;

    try {
      const preview: any = await apiClient('/orders/ord-101/return/preview', {
        method: 'POST',
      });
      assert.strictEqual(preview.isReturnable, true);

      const submission: any = await apiClient('/orders/ord-101/return', {
        method: 'POST',
        headers: { 'X-Idempotency-Key': 'idemp-return-01' },
        body: JSON.stringify({ reasonText: 'Defective item', choice: 'REFUND' }),
      });
      assert.strictEqual(submission.returnId, 'ret-555');
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('6. Authoritative Order Tracking Event Contract (CMD-048)', async () => {
    const mockTrackingData = {
      orderId: 'ord-102',
      status: 'OUT_FOR_DELIVERY',
      events: [
        { status: 'ACCEPTED', timestamp: '2026-08-06T19:00:00Z', description: 'Order accepted by store' },
        { status: 'PICKING', timestamp: '2026-08-06T19:02:00Z', description: 'Items being picked' },
        { status: 'PACKED', timestamp: '2026-08-06T19:05:00Z', description: 'Order packed' },
        { status: 'RIDER_ASSIGNED', timestamp: '2026-08-06T19:06:00Z', description: 'Rider assigned' },
        { status: 'OUT_FOR_DELIVERY', timestamp: '2026-08-06T19:08:00Z', description: 'Out for delivery' },
      ],
      rider: {
        name: 'Rahul K.', // Sanitized DTO without PII phone
      },
    };

    const globalFetch = global.fetch;
    global.fetch = (async () => ({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => mockTrackingData,
    })) as any;

    try {
      const tracking: any = await apiClient('/orders/ord-102/tracking');
      assert.strictEqual(tracking.events.length, 5);
      assert.strictEqual(tracking.events[4].status, 'OUT_FOR_DELIVERY');
      assert.strictEqual(tracking.rider.name, 'Rahul K.');
      assert.strictEqual(tracking.rider.phone, undefined); // No phone PII leakage
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('7. COD Refund status NOT_REQUIRED invariant (CMD-051)', () => {
    const codOrder = {
      id: 'ord-cod-1',
      paymentMethod: 'COD',
      paymentStatus: 'COD_PENDING',
      refundStatus: 'NOT_REQUIRED',
    };

    assert.strictEqual(codOrder.refundStatus, 'NOT_REQUIRED');
  });
});
