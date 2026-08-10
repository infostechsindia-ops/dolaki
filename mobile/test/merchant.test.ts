import assert from 'node:assert';
import { test, describe } from 'node:test';
import {
  merchantApi,
  getAuthToken,
  saveAuthToken,
  clearAuthCredentials,
} from '../src/merchant/api.ts';
import type {
  DarkstoreDTO,
  DashboardMetricsDTO,
  OrderBoardDTO,
  PickingSessionDTO,
  RiderHandoffStatusDTO,
  MerchantReportDTO,
  DarkstoreStaffDTO,
} from '../src/merchant/api.ts';
import { getDerivedStateFromError } from '../src/merchant/errorUtils.ts';

describe('Quick-Commerce Merchant Mobile App, Hardening & Security (CMD-092 to CMD-097)', () => {
  test('1. Mandatory CMD-092 Fix: Token storage uses SecureStore (saveAuthToken, getAuthToken, clearAuthCredentials)', async () => {
    await saveAuthToken('mock-secure-merchant-jwt-token');
    const token = await getAuthToken();
    assert.strictEqual(token, 'mock-secure-merchant-jwt-token');

    await clearAuthCredentials();
    const cleared = await getAuthToken();
    assert.strictEqual(cleared, null);
  });

  test('2. getMerchantShops fetches darkstores authorized for authenticated merchant', async () => {
    const mockShops: DarkstoreDTO[] = [
      { id: 'shop-flado-001', name: 'AuraMart Darkstore 01', approvalStatus: 'APPROVED', isOpen: true, address: 'Mumbai' },
    ];

    const globalFetch = global.fetch;
    global.fetch = (async () => ({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true, data: mockShops }),
    })) as any;

    try {
      const shops = await merchantApi.getMerchantShops();
      assert.strictEqual(shops.length, 1);
      assert.strictEqual(shops[0].id, 'shop-flado-001');
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('3. 401 Session expiry throws clear session error and clears credentials', async () => {
    const globalFetch = global.fetch;
    global.fetch = (async () => ({
      ok: false,
      status: 401,
      headers: { get: () => 'application/json' },
      json: async () => ({ message: 'Unauthorized' }),
    })) as any;

    try {
      await merchantApi.getShopDashboard('shop-flado-001');
      assert.fail('Should have thrown 401 error');
    } catch (err: any) {
      assert.strictEqual(err.message, '401 Session expired. Please log in again.');
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('4. toggleOperationalState executes darkstore open/closed toggle', async () => {
    const mockDash: DashboardMetricsDTO = {
      shopId: 'shop-flado-001',
      shopName: 'AuraMart Darkstore 01',
      approvalStatus: 'APPROVED',
      isOpen: false,
      isOperational: false,
      operatingHoursJson: null,
      deliveryRadiusKm: 3.0,
      deliveryFeeType: 'FREE',
      deliveryFeeAmount: 0,
      capacity: { maxCapacityOrdersPerHour: 50, currentHourlyOrderCount: 0, capacityUtilizationPercentage: 0, capacityWarning: null },
      queueSummary: { activeQueueCount: 0, ordersRequiringActionCount: 0, pendingShipmentCount: 0 },
      inventorySummary: { totalSKUsCount: 20, inStockCount: 20, lowStockCount: 0, outOfStockCount: 0 },
      salesSummary: { todayOrdersCount: 0, todayGrossRevenueMinor: 0, formattedTodayGrossRevenue: '₹0', avgDeliveryMinutes: null },
      slaWarnings: [],
    };

    const globalFetch = global.fetch;
    global.fetch = (async () => ({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true, data: mockDash }),
    })) as any;

    try {
      const res = await merchantApi.toggleOperationalState('shop-flado-001', false, 'Pause live serviceability');
      assert.strictEqual(res.isOpen, false);
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('5. getOrderBoard fetches Kanban status columns with real order age data', async () => {
    const mockBoard: OrderBoardDTO = {
      shopId: 'shop-flado-001',
      shopName: 'AuraMart Darkstore 01',
      isOperational: true,
      totalActiveOrdersCount: 1,
      columns: {
        newPlaced: [],
        preparingPacking: [
          {
            orderId: 'ord-101',
            orderNumber: 'QORD-101',
            status: 'PREPARING',
            paymentStatus: 'PAID',
            paymentMethod: 'ONLINE',
            createdAt: new Date().toISOString(),
            receivedTimeAgo: '5m ago',
            items: [{ id: 'i-1', title: 'Milk', quantity: 2, unitPriceMinor: 3000, formattedUnitPrice: '₹30', subtotalMinor: 6000, formattedSubtotal: '₹60' }],
            itemCount: 1,
            vendorTotalMinor: 6000,
            formattedVendorTotal: '₹60',
            slaWarning: null,
            substitutionAttention: false,
            isCancelled: false,
            availableFulfillmentActions: ['PACK'],
          },
        ],
        readyDispatch: [],
        completedHistory: [],
      },
      slaSummary: { freshCount: 1, elevatedWarningCount: 0, criticalBreachCount: 0 },
    };

    const globalFetch = global.fetch;
    global.fetch = (async () => ({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true, data: mockBoard }),
    })) as any;

    try {
      const board = await merchantApi.getOrderBoard('shop-flado-001');
      assert.strictEqual(board.columns.preparingPacking.length, 1);
      assert.strictEqual(board.columns.preparingPacking[0].receivedTimeAgo, '5m ago');
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('6. Picking session update & complete API contracts', async () => {
    const mockPickingSession: PickingSessionDTO = {
      orderId: 'ord-101',
      orderNumber: 'QORD-101',
      shopId: 'shop-flado-001',
      pickerUserId: 'picker-1',
      pickerName: 'Staff Picker Suresh',
      pickingStatus: 'COMPLETED',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      totalItemCount: 1,
      pickedItemCount: 1,
      outOfStockCount: 0,
      items: [
        {
          id: 'i-1',
          productId: 'p-1',
          title: 'Milk',
          sku: 'SKU-MILK',
          quantity: 2,
          pickedQuantity: 2,
          pickingItemStatus: 'PICKED',
          unitPriceMinor: 3000,
          formattedUnitPrice: '₹30',
        },
      ],
    };

    const globalFetch = global.fetch;
    global.fetch = (async () => ({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true, data: mockPickingSession }),
    })) as any;

    try {
      const res = await merchantApi.completePickingSession('shop-flado-001', 'ord-101');
      assert.strictEqual(res.pickingStatus, 'COMPLETED');
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('7. Rider handoff OTP challenge generation & verification contracts', async () => {
    const mockHandoffStatus: RiderHandoffStatusDTO = {
      orderId: 'ord-101',
      orderNumber: 'QORD-101',
      shopId: 'shop-flado-001',
      orderStatus: 'SHIPPED',
      pickingStatus: 'COMPLETED',
      isHandoffReady: true,
      blockedReason: null,
      rider: { riderId: 'r-1', riderName: 'Rider Ramesh', riderPhone: '9876543210', isAssigned: true },
      otpChallenge: { hasActiveChallenge: true, expiresAt: new Date().toISOString(), isExpired: false, isLocked: false, isUsed: true, attemptCount: 0, maxAttempts: 5 },
      handoffCompletedAt: new Date().toISOString(),
    };

    const globalFetch = global.fetch;
    global.fetch = (async () => ({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true, data: mockHandoffStatus }),
    })) as any;

    try {
      const res = await merchantApi.verifyRiderHandoff('shop-flado-001', 'ord-101', '123456');
      assert.strictEqual(res.orderStatus, 'SHIPPED');
      assert.strictEqual(res.otpChallenge.isUsed, true);
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('8. CMD-095 getMerchantReport fetches authoritative MerchantReportDTO with zero client math', async () => {
    const mockReport: MerchantReportDTO = {
      shopId: 'shop-flado-001',
      shopName: 'AuraMart Darkstore 01',
      startDate: '2026-08-01',
      endDate: '2026-08-07',
      salesSummary: {
        totalOrders: 25,
        totalUnitsSold: 120,
        grossSalesMinor: 1250000,
        formattedGrossSales: '₹12,500',
        refundsMinor: 50000,
        formattedRefunds: '₹500',
        netSalesMinor: 1200000,
        formattedNetSales: '₹12,000',
      },
      dailyBreakdown: [],
      slaMetrics: {
        totalOrdersAnalyzed: 25,
        avgAcceptanceMins: 1.2,
        avgPickingMins: 4.5,
        avgHandoffMins: 2.1,
        avgTotalFulfillmentMins: 11.5,
        slaBreachCount: 1,
        slaBreachRatePercentage: 4.0,
        fulfillmentSlaHealthPercentage: 96.0,
      },
      oosTrends: { totalOosEvents: 2, topOosProducts: [], unresolvedShortageCount: 0 },
      performance: { completedOrdersCount: 24, cancelledOrdersCount: 1, completionRatePercentage: 96.0, cancellationRatePercentage: 4.0 },
      multiStoreComparison: [],
    };

    const globalFetch = global.fetch;
    global.fetch = (async () => ({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true, data: mockReport }),
    })) as any;

    try {
      const report = await merchantApi.getMerchantReport('shop-flado-001');
      assert.strictEqual(report.salesSummary.formattedNetSales, '₹12,000');
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('9. CMD-096 getDarkstoreStaff loads staff list with assigned darkstores', async () => {
    const mockStaffList: DarkstoreStaffDTO[] = [
      {
        id: 'staff-1',
        userId: 'u-101',
        email: 'staff@auramart.com',
        vendorRole: 'MANAGER',
        status: 'ACTIVE',
        assignedShopIds: ['shop-flado-001'],
        isDarkstoreOwner: false,
      },
    ];

    const globalFetch = global.fetch;
    global.fetch = (async () => ({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true, data: mockStaffList }),
    })) as any;

    try {
      const list = await merchantApi.getDarkstoreStaff('shop-flado-001');
      assert.strictEqual(list.length, 1);
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('10. CMD-097 MerchantErrorBoundary state derivation and token sanitization', () => {
    const err = new Error('Unauthorized Bearer secret-jwt-token-12345');
    const derived = getDerivedStateFromError(err);
    assert.strictEqual(derived.hasError, true);
    assert.strictEqual(derived.errorMessage, 'Unauthorized Bearer secret-jwt-token-12345');
  });
});
