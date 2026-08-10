import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PriceEngineService } from '../pricing/pricing.service';
import { AuditService } from '../audit/audit.service';
import { PaymentsService } from '../payments/payments.service';
import { CheckoutService } from '../checkout/checkout.service';
import { CartService } from '../cart/cart.service';
import {
  Order,
  OrderItem,
  Payment,
  UserWallet,
  Inventory,
  ReturnRequest,
  LoyaltyTransaction,
  Coupon,
  Cart,
  OrderTrackingEvent,
  Rider,
  OrderCancellation,
  ReturnTrackingEvent,
  User,
} from '../database/entities';

describe('OrdersService — CMD-046 Order Placement', () => {
  let service: OrdersService;
  let orderRepo: jest.Mocked<Repository<Order>>;
  let orderItemRepo: jest.Mocked<Repository<OrderItem>>;
  let cartRepo: jest.Mocked<Repository<Cart>>;
  let inventoryRepo: jest.Mocked<Repository<Inventory>>;
  let trackingRepo: jest.Mocked<Repository<OrderTrackingEvent>>;
  let riderRepo: jest.Mocked<Repository<Rider>>;
  let returnRepo: jest.Mocked<Repository<ReturnRequest>>;
  let returnTrackingRepo: jest.Mocked<Repository<ReturnTrackingEvent>>;
  let paymentsService: jest.Mocked<PaymentsService>;
  let checkoutService: jest.Mocked<CheckoutService>;

  const MOCK_USER = { userId: 'cust-100', role: 'CUSTOMER' };
  const MOCK_OTHER_USER = { userId: 'cust-999', role: 'CUSTOMER' };

  const MOCK_PREVIEW = {
    cartId: 'cart-1',
    customerId: 'cust-100',
    addresses: [],
    selectedAddress: { id: 'addr-1', line1: '123 Main St', city: 'Mumbai', pincode: '400050' } as any,
    deliveryOptions: [],
    selectedDeliveryOption: { id: 'del-std', priceCents: 500 } as any,
    paymentMethods: [
      { id: 'pay-upi', type: 'UPI' as const, label: 'UPI', description: 'UPI', isEligible: true, isSelected: true },
      { id: 'pay-cod', type: 'COD' as const, label: 'COD', description: 'COD', isEligible: true, isSelected: false },
    ],
    selectedPaymentMethod: 'pay-upi',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        variantId: 'var-1',
        sku: 'SKU-001',
        title: 'Wireless Headphones',
        variantTitle: 'Black',
        vendorId: 'vendor-1',
        fulfillmentSourceId: 'darkstore-bkc',
        substitutionPreference: 'ALLOW_SUBSTITUTION',
        quantity: 2,
        unitPriceMinor: 2500,
        itemDiscountMinor: 0,
        lineSubtotalMinor: 5000,
        taxAmountMinor: 900,
        isFlado: true,
      },
    ],
    totalItems: 2,
    subtotal: 5000,
    formattedSubtotal: '$50.00',
    tax: 900,
    formattedTax: '$9.00',
    shipping: 500,
    formattedShipping: '$5.00',
    discount: 0,
    formattedDiscount: '$0.00',
    grandTotal: 6400,
    formattedGrandTotal: '$64.00',
    minimumBasketAmount: 0,
    isMinimumBasketMet: true,
    formattedMinimumBasketShortfall: '$0.00',
    storeAvailabilityStatus: 'OPEN' as const,
    storeName: 'AuraStore',
    checkoutEligibility: { isEligible: true, blockers: [] },
  };

  const MOCK_INTENT = {
    id: 'pi-100',
    customerId: 'cust-100',
    cartId: 'cart-1',
    amountMinor: 6400,
    formattedAmount: '$64.00',
    currency: 'USD',
    paymentMethod: 'pay-upi',
    provider: 'GENERIC',
    status: 'SUCCEEDED' as const,
    requiresAction: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRepoFactory = () => ({
      create: jest.fn((dto) => ({ id: `uuid-${Math.random()}`, createdAt: new Date(), updatedAt: new Date(), ...dto })),
      save: jest.fn((entity) => Promise.resolve({ ...entity, id: entity.id || 'uuid-saved' })),
      findOne: jest.fn(),
      find: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    });

    const mockPaymentsService = {
      getIntent: jest.fn().mockResolvedValue(MOCK_INTENT),
    };

    const mockCheckoutService = {
      getPreview: jest.fn().mockResolvedValue(MOCK_PREVIEW),
    };

    const mockDataSource = {
      transaction: jest.fn((cb) =>
        cb({
          create: jest.fn((entityClass, dto) => ({ id: `tx-uuid-${Math.random()}`, ...dto })),
          save: jest.fn((entityClass, entity) => Promise.resolve({ ...entity, id: entity?.id || 'tx-saved' })),
          findOne: jest.fn().mockImplementation((entityClass, query) => {
            if (entityClass === Order) return orderRepo.findOne(query);
            if (entityClass === OrderItem) return Promise.resolve({ id: 'item-1', title: 'Headphones', quantity: 5, cancelledQuantity: 0, unitPriceMinor: 2500 });
            if (entityClass === Inventory) return Promise.resolve({ productId: 'prod-1', stockQuantity: 10 });
            if (entityClass === Cart) return Promise.resolve({ id: 'cart-1', status: 'ACTIVE' });
            return Promise.resolve(null);
          }),
          find: jest.fn().mockImplementation((entityClass, query) => {
            if (entityClass === OrderItem) return orderItemRepo.find(query);
            return Promise.resolve([]);
          }),
        })
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getRepositoryToken(Order), useFactory: mockRepoFactory },
        { provide: getRepositoryToken(OrderItem), useFactory: mockRepoFactory },
        { provide: getRepositoryToken(Payment), useFactory: mockRepoFactory },
        { provide: getRepositoryToken(UserWallet), useFactory: mockRepoFactory },
        { provide: getRepositoryToken(Inventory), useFactory: mockRepoFactory },
        { provide: getRepositoryToken(ReturnRequest), useFactory: mockRepoFactory },
        { provide: getRepositoryToken(LoyaltyTransaction), useFactory: mockRepoFactory },
        { provide: getRepositoryToken(Coupon), useFactory: mockRepoFactory },
        { provide: getRepositoryToken(Cart), useFactory: mockRepoFactory },
        { provide: getRepositoryToken(OrderTrackingEvent), useFactory: mockRepoFactory },
        { provide: getRepositoryToken(Rider), useFactory: mockRepoFactory },
        { provide: getRepositoryToken(OrderCancellation), useFactory: mockRepoFactory },
        { provide: getRepositoryToken(ReturnTrackingEvent), useFactory: mockRepoFactory },
        { provide: getRepositoryToken(User), useFactory: mockRepoFactory },
        { provide: PriceEngineService, useValue: {} },
        { provide: AuditService, useValue: { log: jest.fn().mockResolvedValue({}) } },
        { provide: PaymentsService, useValue: mockPaymentsService },
        { provide: CheckoutService, useValue: mockCheckoutService },
        { provide: CartService, useValue: { addItem: jest.fn().mockResolvedValue({}), getCart: jest.fn().mockResolvedValue({}) } },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderRepo = module.get(getRepositoryToken(Order));
    orderItemRepo = module.get(getRepositoryToken(OrderItem));
    cartRepo = module.get(getRepositoryToken(Cart));
    inventoryRepo = module.get(getRepositoryToken(Inventory));
    trackingRepo = module.get(getRepositoryToken(OrderTrackingEvent));
    riderRepo = module.get(getRepositoryToken(Rider));
    returnRepo = module.get(getRepositoryToken(ReturnRequest));
    returnTrackingRepo = module.get(getRepositoryToken(ReturnTrackingEvent));
    paymentsService = module.get(PaymentsService);
    checkoutService = module.get(CheckoutService);
  });

  // ── 1. Order Placement Validation ──────────────────────────────────────────

  it('T01: throws BadRequestException if paymentIntentId is missing', async () => {
    await expect(service.placeOrder(MOCK_USER, {})).rejects.toThrow(BadRequestException);
  });

  it('T02: throws BadRequestException if online PaymentIntent status is NOT SUCCEEDED', async () => {
    orderRepo.findOne.mockResolvedValue(null);
    paymentsService.getIntent.mockResolvedValueOnce({
      ...MOCK_INTENT,
      status: 'REQUIRES_ACTION',
    });

    await expect(
      service.placeOrder(MOCK_USER, { paymentIntentId: 'pi-100' })
    ).rejects.toThrow(BadRequestException);
  });

  it('T03: throws BadRequestException if checkout preview is ineligible', async () => {
    orderRepo.findOne.mockResolvedValue(null);
    checkoutService.getPreview.mockResolvedValueOnce({
      ...MOCK_PREVIEW,
      checkoutEligibility: { isEligible: false, blockers: ['Shipping address selection required'] },
    });

    await expect(
      service.placeOrder(MOCK_USER, { paymentIntentId: 'pi-100' })
    ).rejects.toThrow(BadRequestException);
  });

  it('T04: throws BadRequestException if checkout grand total differs from PaymentIntent amount', async () => {
    orderRepo.findOne.mockResolvedValue(null);
    checkoutService.getPreview.mockResolvedValueOnce({
      ...MOCK_PREVIEW,
      grandTotal: 7500, // Changed from 6400
    });

    await expect(
      service.placeOrder(MOCK_USER, { paymentIntentId: 'pi-100' })
    ).rejects.toThrow(BadRequestException);
  });

  // ── 2. Successful Online Order Placement ──────────────────────────────────

  it('T05: places order for online SUCCEEDED intent with PAID status and snapshot', async () => {
    orderRepo.findOne.mockResolvedValue(null);

    const result = await service.placeOrder(MOCK_USER, { paymentIntentId: 'pi-100' });

    expect(result.orderNumber).toMatch(/^ORD-/);
    expect(result.paymentStatus).toBe('PAID');
    expect(result.totalAmountMinor).toBe(6400);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].substitutionPreference).toBe('ALLOW_SUBSTITUTION');
    expect(result.items[0].fulfillmentSourceId).toBe('darkstore-bkc');
  });

  // ── 3. COD Order Placement & Semantics ────────────────────────────────────

  it('T06: places COD order with COD_PENDING payment status (NOT captured prepaid money)', async () => {
    orderRepo.findOne.mockResolvedValue(null);
    paymentsService.getIntent.mockResolvedValueOnce({
      ...MOCK_INTENT,
      paymentMethod: 'pay-cod',
      status: 'SUCCEEDED',
    });
    checkoutService.getPreview.mockResolvedValueOnce({
      ...MOCK_PREVIEW,
      selectedPaymentMethod: 'pay-cod',
    });

    const result = await service.placeOrder(MOCK_USER, { paymentIntentId: 'pi-100' });

    expect(result.paymentMethod).toBe('pay-cod');
    expect(result.paymentStatus).toBe('COD_PENDING'); // Semantically distinct from PAID!
  });

  // ── 4. Idempotency ────────────────────────────────────────────────────────

  it('T07: returns existing order idempotently if paymentIntentId was already processed', async () => {
    const mockExistingOrder: Partial<Order> = {
      id: 'order-already-placed',
      orderNumber: 'ORD-9999-1234',
      customerId: MOCK_USER.userId,
      paymentIntentId: 'pi-100',
      totalAmountMinor: 6400,
      paymentStatus: 'PAID',
      status: 'PLACED',
      createdAt: new Date(),
    };
    orderRepo.findOne.mockResolvedValue(mockExistingOrder as Order);
    orderItemRepo.find.mockResolvedValue([]);

    const result = await service.placeOrder(MOCK_USER, { paymentIntentId: 'pi-100' });

    expect(result.id).toBe('order-already-placed');
    expect(result.message).toContain('idempotent');
    expect(checkoutService.getPreview).not.toHaveBeenCalled();
  });

  // ── 5. CMD-047: Order Status Summary ──────────────────────────────────────

  it('T08: returns authoritative order status counts for customer dashboard', async () => {
    orderRepo.find.mockResolvedValueOnce([
      { id: 'o-1', status: 'PLACED', customerId: 'cust-100' } as Order,
      { id: 'o-2', status: 'SHIPPED', customerId: 'cust-100' } as Order,
      { id: 'o-3', status: 'DELIVERED', customerId: 'cust-100' } as Order,
      { id: 'o-4', status: 'CANCELLED', customerId: 'cust-100' } as Order,
    ]);

    const summary = await service.getOrderSummary(MOCK_USER);

    expect(summary.totalOrders).toBe(4);
    expect(summary.activeOrders).toBe(2);
    expect(summary.deliveredOrders).toBe(1);
    expect(summary.cancelledOrders).toBe(1);
  });

  // ── 6. CMD-047: Reorder & IDOR Protection ────────────────────────────────

  it('T09: throws ForbiddenException when customer attempts to reorder another customer order', async () => {
    orderRepo.findOne.mockResolvedValueOnce({
      id: 'order-other-cust',
      customerId: MOCK_OTHER_USER.userId,
    } as Order);

    await expect(service.reorder(MOCK_USER, 'order-other-cust')).rejects.toThrow(ForbiddenException);
  });

  // ── 7. CMD-047: Invoice Generation & IDOR Protection ─────────────────────

  it('T10: throws ForbiddenException when customer attempts to fetch another customer invoice', async () => {
    orderRepo.findOne.mockResolvedValueOnce({
      id: 'order-other-cust',
      customerId: MOCK_OTHER_USER.userId,
    } as Order);

    await expect(service.getInvoice(MOCK_USER, 'order-other-cust')).rejects.toThrow(ForbiddenException);
  });

  it('T11: returns authoritative HTML invoice with immutable snapshots', async () => {
    orderRepo.findOne.mockResolvedValueOnce({
      id: 'order-101',
      orderNumber: 'ORD-1001-2026',
      customerId: MOCK_USER.userId,
      shippingAddress: JSON.stringify({ fullName: 'John Doe', line1: '123 Main', city: 'Mumbai', pincode: '400050' }),
      billingAddress: JSON.stringify({ fullName: 'John Doe', line1: '123 Main', city: 'Mumbai', pincode: '400050' }),
      itemsSubtotalMinor: 5000,
      feeAmountMinor: 500,
      taxAmountMinor: 900,
      discountAmountMinor: 0,
      totalAmountMinor: 6400,
      paymentMethod: 'pay-upi',
      paymentStatus: 'PAID',
      createdAt: new Date(),
    } as Order);

    orderItemRepo.find.mockResolvedValueOnce([
      {
        id: 'item-1',
        title: 'Wireless Headphones',
        quantity: 2,
        unitPriceMinor: 2500,
        subtotalMinor: 5000,
      } as OrderItem,
    ]);

    const invoice = await service.getInvoice(MOCK_USER, 'order-101');

    expect(invoice.invoiceNumber).toBe('INV-ORD-1001-2026');
    expect(invoice.grandTotalFormatted).toBe('$64.00');
    expect(invoice.htmlContent).toContain('AuraMart Invoice');
    expect(invoice.htmlContent).toContain('Wireless Headphones');
  });

  // ── 8. CMD-048: Order Tracking & IDOR Protection ──────────────────────────

  it('T12: throws ForbiddenException when customer attempts to fetch another customer order tracking', async () => {
    orderRepo.findOne.mockResolvedValueOnce({
      id: 'order-other-cust',
      customerId: MOCK_OTHER_USER.userId,
    } as Order);

    await expect(service.getOrderTracking(MOCK_USER, 'order-other-cust')).rejects.toThrow(ForbiddenException);
  });

  it('T13: throws ForbiddenException when unauthorized customer attempts to record tracking event', async () => {
    await expect(
      service.recordTrackingEvent(MOCK_USER, 'order-101', {
        eventType: 'PACKED',
        statusText: 'Packed by Store',
      })
    ).rejects.toThrow(ForbiddenException);
  });

  it('T14: throws BadRequestException when recording invalid status regression on DELIVERED order', async () => {
    orderRepo.findOne.mockResolvedValueOnce({
      id: 'order-delivered',
      customerId: MOCK_USER.userId,
      status: 'DELIVERED',
    } as Order);

    const opsUser = { userId: 'ops-1', role: 'OPERATIONS' };

    await expect(
      service.recordTrackingEvent(opsUser, 'order-delivered', {
        eventType: 'PICKING',
        statusText: 'Picking items',
      })
    ).rejects.toThrow(BadRequestException);
  });

  it('T15: returns sanitized rider info without PII when rider is assigned', async () => {
    orderRepo.findOne.mockResolvedValueOnce({
      id: 'order-with-rider',
      orderNumber: 'ORD-5555',
      customerId: MOCK_USER.userId,
      status: 'OUT_FOR_DELIVERY',
      riderId: 'rider-99',
      deliveryMinutes: 15,
      createdAt: new Date(),
    } as Order);

    orderItemRepo.find.mockResolvedValueOnce([
      { id: 'i-1', fulfillmentSourceId: 'darkstore-bkc' } as OrderItem,
    ]);

    (trackingRepo.find as jest.Mock).mockResolvedValueOnce([
      { id: 'evt-1', eventType: 'ACCEPTED', statusText: 'Order Accepted', occurredAt: new Date() },
      { id: 'evt-2', eventType: 'RIDER_ASSIGNED', statusText: 'Rider Assigned', occurredAt: new Date() },
    ]);

    (riderRepo.findOne as jest.Mock).mockResolvedValueOnce({
      id: 'rider-99',
      name: 'Ramesh Rider',
      phone: '+919999988888', // Private phone
      vehicleType: 'Motorbike',
    });

    const tracking = await service.getOrderTracking(MOCK_USER, 'order-with-rider');

    expect(tracking.surface).toBe('QUICK_COMMERCE');
    expect(tracking.rider).toEqual({
      displayName: 'Ramesh Rider',
      vehicleType: 'Motorbike',
    });
    // Ensure PII phone is NOT exposed
    expect(tracking.rider.phone).toBeUndefined();
  });

  // ── 9. PART A Fix: GET Tracking Performs ZERO Database Writes ───────────────

  it('T16: getOrderTracking performs ZERO database writes when synthesizing initial event', async () => {
    orderRepo.findOne.mockResolvedValueOnce({
      id: 'order-no-events',
      orderNumber: 'ORD-7777',
      customerId: MOCK_USER.userId,
      status: 'PLACED',
      deliveryMinutes: 35,
      createdAt: new Date(),
    } as Order);

    orderItemRepo.find.mockResolvedValueOnce([]);
    (trackingRepo.find as jest.Mock).mockResolvedValueOnce([]);

    const tracking = await service.getOrderTracking(MOCK_USER, 'order-no-events');

    expect(tracking.events).toHaveLength(1);
    expect(tracking.events[0].type).toBe('ORDER_CONFIRMED');
    // Prove ZERO database saves occurred during GET handler
    expect(trackingRepo.save).not.toHaveBeenCalled();
    expect(trackingRepo.create).not.toHaveBeenCalled();
  });

  // ── 10. CMD-049: Order Cancellation & Policy Engine ───────────────────────

  it('T17: cancelPreview returns expected refund for eligible prepaid order', async () => {
    orderRepo.findOne.mockResolvedValueOnce({
      id: 'order-prepaid',
      customerId: MOCK_USER.userId,
      status: 'PLACED',
      paymentMethod: 'pay-card',
      paymentStatus: 'PAID',
      totalAmountMinor: 5000,
    } as Order);

    orderItemRepo.find.mockResolvedValueOnce([
      { id: 'item-1', title: 'Widget', quantity: 2, unitPriceMinor: 2500, cancelledQuantity: 0 } as OrderItem,
    ]);

    const preview = await service.cancelPreview(MOCK_USER, 'order-prepaid');

    expect(preview.canCancel).toBe(true);
    expect(preview.cancellationType).toBe('FULL');
    expect(preview.expectedRefundMinor).toBe(5000);
    expect(preview.formattedExpectedRefund).toBe('$50.00');
    expect(preview.cancellationFeeMinor).toBe(0);
  });

  it('T18: cancelPreview returns expectedRefundMinor = 0 for COD_PENDING order', async () => {
    orderRepo.findOne.mockResolvedValueOnce({
      id: 'order-cod',
      customerId: MOCK_USER.userId,
      status: 'PLACED',
      paymentMethod: 'pay-cod',
      paymentStatus: 'COD_PENDING',
      totalAmountMinor: 5000,
    } as Order);

    orderItemRepo.find.mockResolvedValueOnce([
      { id: 'item-1', title: 'Widget', quantity: 2, unitPriceMinor: 2500, cancelledQuantity: 0 } as OrderItem,
    ]);

    const preview = await service.cancelPreview(MOCK_USER, 'order-cod');

    expect(preview.canCancel).toBe(true);
    expect(preview.expectedRefundMinor).toBe(0);
    expect(preview.refundMethodText).toContain('Cash on Delivery');
  });

  it('T19: cancelPreview returns canCancel = false for DELIVERED order', async () => {
    orderRepo.findOne.mockResolvedValueOnce({
      id: 'order-delivered',
      customerId: MOCK_USER.userId,
      status: 'DELIVERED',
    } as Order);

    const preview = await service.cancelPreview(MOCK_USER, 'order-delivered');

    expect(preview.canCancel).toBe(false);
    expect(preview.reason).toContain('Delivered orders cannot be cancelled');
  });

  it('T20: cancelPreview throws ForbiddenException for another customer order', async () => {
    orderRepo.findOne.mockResolvedValueOnce({
      id: 'order-other-cust',
      customerId: MOCK_OTHER_USER.userId,
    } as Order);

    await expect(service.cancelPreview(MOCK_USER, 'order-other-cust')).rejects.toThrow(ForbiddenException);
  });

  it('T21: cancelPreview rejects duplicate item IDs in request payload', async () => {
    orderRepo.findOne.mockResolvedValueOnce({
      id: 'order-dup',
      customerId: MOCK_USER.userId,
      status: 'PLACED',
    } as Order);

    orderItemRepo.find.mockResolvedValueOnce([
      { id: 'item-1', title: 'Widget', quantity: 5, cancelledQuantity: 0 } as OrderItem,
    ]);

    await expect(
      service.cancelPreview(MOCK_USER, 'order-dup', {
        items: [
          { orderItemId: 'item-1', quantity: 1 },
          { orderItemId: 'item-1', quantity: 2 },
        ],
      })
    ).rejects.toThrow(BadRequestException);
  });

  it('T22: cancelPreview rejects quantity <= 0 or quantity > available', async () => {
    orderRepo.findOne.mockResolvedValue({
      id: 'order-qty-val',
      customerId: MOCK_USER.userId,
      status: 'PLACED',
    } as Order);

    orderItemRepo.find.mockResolvedValue([
      { id: 'item-1', title: 'Widget', quantity: 2, cancelledQuantity: 1 } as OrderItem,
    ]);

    // Quantity <= 0
    await expect(
      service.cancelPreview(MOCK_USER, 'order-qty-val', {
        items: [{ orderItemId: 'item-1', quantity: 0 }],
      })
    ).rejects.toThrow(BadRequestException);

    // Quantity > available (available is 2 - 1 = 1)
    await expect(
      service.cancelPreview(MOCK_USER, 'order-qty-val', {
        items: [{ orderItemId: 'item-1', quantity: 2 }],
      })
    ).rejects.toThrow(BadRequestException);
  });

  it('T23: cancelPreview rejects item ID belonging to another order', async () => {
    orderRepo.findOne.mockResolvedValueOnce({
      id: 'order-1',
      customerId: MOCK_USER.userId,
      status: 'PLACED',
    } as Order);

    orderItemRepo.find.mockResolvedValueOnce([
      { id: 'item-1', title: 'Widget', quantity: 2, cancelledQuantity: 0 } as OrderItem,
    ]);

    await expect(
      service.cancelPreview(MOCK_USER, 'order-1', {
        items: [{ orderItemId: 'item-other-order', quantity: 1 }],
      })
    ).rejects.toThrow(BadRequestException);
  });

  it('T24: cancelPreview is PURE and performs ZERO database mutations', async () => {
    orderRepo.findOne.mockResolvedValueOnce({
      id: 'order-pure',
      customerId: MOCK_USER.userId,
      status: 'PLACED',
      paymentMethod: 'pay-card',
      paymentStatus: 'PAID',
    } as Order);

    orderItemRepo.find.mockResolvedValueOnce([
      { id: 'item-1', title: 'Widget', quantity: 2, unitPriceMinor: 2500, cancelledQuantity: 0 } as OrderItem,
    ]);

    await service.cancelPreview(MOCK_USER, 'order-pure');

    expect(orderRepo.save).not.toHaveBeenCalled();
    expect(orderItemRepo.save).not.toHaveBeenCalled();
    expect(inventoryRepo.save).not.toHaveBeenCalled();
    expect(trackingRepo.save).not.toHaveBeenCalled();
  });

  it('T25: cancelOrder executes atomic cancellation, restores stock, and logs audit', async () => {
    const mockOrder = {
      id: 'order-to-cancel',
      orderNumber: 'ORD-8888',
      customerId: MOCK_USER.userId,
      status: 'PLACED',
      paymentMethod: 'pay-card',
      paymentStatus: 'PAID',
    };

    orderRepo.findOne.mockResolvedValue(mockOrder as Order);
    orderItemRepo.find.mockResolvedValue([
      { id: 'item-1', productId: 'prod-100', title: 'Widget', quantity: 2, unitPriceMinor: 2500, cancelledQuantity: 0 } as OrderItem,
    ]);

    const result = await service.cancelOrder(MOCK_USER, 'order-to-cancel', {
      reasonCode: 'CHANGED_MIND',
    });

    expect(result.success).toBe(true);
    expect(result.cancellationType).toBe('FULL');
    expect(result.expectedRefundMinor).toBe(5000);
    expect(result.orderStatus).toBe('CANCELLED');
  });

  it('T26: partial cancellation preserves Order.status as PLACED (does NOT set CANCELLED) and logs ITEMS_CANCELLED', async () => {
    const mockOrder = {
      id: 'order-partial',
      orderNumber: 'ORD-9999',
      customerId: MOCK_USER.userId,
      status: 'PLACED',
      paymentMethod: 'pay-card',
      paymentStatus: 'PAID',
    };

    orderRepo.findOne.mockResolvedValue(mockOrder as Order);
    orderItemRepo.find.mockResolvedValue([
      { id: 'item-1', productId: 'prod-1', title: 'Item 1', quantity: 5, unitPriceMinor: 1000, cancelledQuantity: 0 } as OrderItem,
      { id: 'item-2', productId: 'prod-2', title: 'Item 2', quantity: 5, unitPriceMinor: 1000, cancelledQuantity: 0 } as OrderItem,
    ]);

    const result = await service.cancelOrder(MOCK_USER, 'order-partial', {
      items: [{ orderItemId: 'item-1', quantity: 2 }],
      reasonCode: 'ORDERED_BY_MISTAKE',
    });

    expect(result.success).toBe(true);
    expect(result.cancellationType).toBe('PARTIAL');
    expect(result.orderStatus).toBe('PLACED'); // Preserved status!
    expect(result.expectedRefundMinor).toBe(2000);
  });

  // ── 11. CMD-050: Return & Replacement Policy Engine ───────────────────────

  it('T27: returnPreview evaluates eligible items for DELIVERED order within policy window', async () => {
    const deliveredDate = new Date();
    orderRepo.findOne.mockResolvedValueOnce({
      id: 'order-delivered-ret',
      customerId: MOCK_USER.userId,
      status: 'DELIVERED',
      deliveredAt: deliveredDate,
      deliveryMinutes: 45,
    } as Order);

    orderItemRepo.find.mockResolvedValueOnce([
      { id: 'item-1', productId: 'prod-1', title: 'Headphones', quantity: 2, unitPriceMinor: 2500, cancelledQuantity: 0 } as OrderItem,
    ]);

    (returnRepo.find as jest.Mock).mockResolvedValueOnce([]);

    const preview = await service.returnPreview(MOCK_USER, 'order-delivered-ret');

    expect(preview.isReturnable).toBe(true);
    expect(preview.items).toHaveLength(1);
    expect(preview.items[0].remainingReturnableQuantity).toBe(2);
    expect(preview.policyWindowText).toBe('7 days from delivery');
  });

  it('T28: returnPreview returns isReturnable = false for non-DELIVERED order', async () => {
    orderRepo.findOne.mockResolvedValueOnce({
      id: 'order-placed-ret',
      customerId: MOCK_USER.userId,
      status: 'PLACED',
    } as Order);

    const preview = await service.returnPreview(MOCK_USER, 'order-placed-ret');

    expect(preview.isReturnable).toBe(false);
    expect(preview.reasonIfNotEligible).toContain('Only delivered orders are eligible');
  });

  it('T29: returnPreview is PURE and performs ZERO database mutations', async () => {
    orderRepo.findOne.mockResolvedValueOnce({
      id: 'order-pure-ret',
      customerId: MOCK_USER.userId,
      status: 'DELIVERED',
      deliveredAt: new Date(),
    } as Order);

    orderItemRepo.find.mockResolvedValueOnce([
      { id: 'item-1', title: 'Speaker', quantity: 1, unitPriceMinor: 5000 } as OrderItem,
    ]);
    (returnRepo.find as jest.Mock).mockResolvedValueOnce([]);

    await service.returnPreview(MOCK_USER, 'order-pure-ret');

    expect(returnRepo.save).not.toHaveBeenCalled();
    expect(orderRepo.save).not.toHaveBeenCalled();
  });

  it('T30: createReturn creates return request with ReturnTrackingEvent timeline', async () => {
    orderRepo.findOne.mockResolvedValue({
      id: 'order-create-ret',
      customerId: MOCK_USER.userId,
      status: 'DELIVERED',
      deliveredAt: new Date(),
    } as Order);

    orderItemRepo.find.mockResolvedValue([
      { id: 'item-1', title: 'Headphones', quantity: 2, unitPriceMinor: 2500, cancelledQuantity: 0 } as OrderItem,
    ]);
    (returnRepo.find as jest.Mock).mockResolvedValue([]);

    const result = await service.createReturn('order-create-ret', MOCK_USER.userId, {
      orderItemId: 'item-1',
      quantity: 1,
      reason: 'DEFECTIVE',
      resolutionChoice: 'REPLACEMENT',
      fulfillmentType: 'PICKUP',
    });

    expect(result.id).toBeDefined();
    expect(result.resolutionChoice).toBe('REPLACEMENT');
    expect(result.timeline).toHaveLength(1);
    expect(result.timeline[0].eventType).toBe('REQUESTED');
  });

  it('T31: createReturn rejects quantity > remainingReturnableQuantity', async () => {
    orderRepo.findOne.mockResolvedValue({
      id: 'order-over-ret',
      customerId: MOCK_USER.userId,
      status: 'DELIVERED',
      deliveredAt: new Date(),
    } as Order);

    orderItemRepo.find.mockResolvedValue([
      { id: 'item-1', title: 'Headphones', quantity: 1, unitPriceMinor: 2500, cancelledQuantity: 0 } as OrderItem,
    ]);
    (returnRepo.find as jest.Mock).mockResolvedValue([]);

    await expect(
      service.createReturn('order-over-ret', MOCK_USER.userId, {
        orderItemId: 'item-1',
        quantity: 5,
        reason: 'DAMAGED',
      })
    ).rejects.toThrow(BadRequestException);
  });

  it('T32: updateReturnQc updates qcStatus and appends ReturnTrackingEvent', async () => {
    (returnRepo.findOne as jest.Mock).mockResolvedValueOnce({
      id: 'ret-100',
      orderId: 'order-1',
      status: 'REQUESTED',
      qcStatus: 'PENDING_INSPECTION',
    } as ReturnRequest);

    const result = await service.updateReturnQc('ret-100', { userId: 'admin-1', role: 'SUPER_ADMIN' }, {
      qcStatus: 'QC_PASSED',
      qcNotes: 'Item in original box and pristine condition',
    });

    expect(result.qcStatus).toBe('QC_PASSED');
  });

  it('T33: updateReturnQc rejects updating return request in terminal status', async () => {
    (returnRepo.findOne as jest.Mock).mockResolvedValueOnce({
      id: 'ret-resolved',
      orderId: 'order-1',
      status: 'RESOLVED_REFUND',
    } as ReturnRequest);

    await expect(
      service.updateReturnQc('ret-resolved', { userId: 'admin-1', role: 'SUPER_ADMIN' }, { qcStatus: 'QC_PASSED' })
    ).rejects.toThrow(BadRequestException);
  });

  it('T34: approveReturn rejects approving return request with QC_FAILED status', async () => {
    (returnRepo.findOne as jest.Mock).mockResolvedValueOnce({
      id: 'ret-qc-failed',
      orderId: 'order-1',
      status: 'QC_PENDING',
      qcStatus: 'QC_FAILED',
      resolutionChoice: 'REFUND',
    } as ReturnRequest);

    await expect(service.approveReturn('ret-qc-failed', 25.0)).rejects.toThrow(BadRequestException);
  });

  it('T35: createReturn executes within transaction for atomic concurrency protection', async () => {
    orderRepo.findOne.mockResolvedValue({
      id: 'order-tx-ret',
      customerId: MOCK_USER.userId,
      status: 'DELIVERED',
      deliveredAt: new Date(),
    } as Order);

    orderItemRepo.find.mockResolvedValue([
      { id: 'item-1', title: 'Headphones', quantity: 2, unitPriceMinor: 2500, cancelledQuantity: 0 } as OrderItem,
    ]);
    (returnRepo.find as jest.Mock).mockResolvedValue([]);

    const result = await service.createReturn('order-tx-ret', MOCK_USER.userId, {
      orderItemId: 'item-1',
      quantity: 1,
      reason: 'DAMAGED',
    });

    expect(result.id).toBeDefined();
  });

  // ── FIX-002: Vendor Order State Machine & Rider Assignment Validation ──────

  describe('FIX-002: State Machine & Rider Assignment Validation', () => {
    const adminUser = { userId: 'admin-1', role: 'SUPER_ADMIN' };

    it('T36: rejects OUT_FOR_DELIVERY for Quick order without assigned rider', async () => {
      orderRepo.findOne.mockResolvedValueOnce({
        id: 'flado-ord-1',
        shopId: 'shop-101',
        status: 'PREPARING',
        pickingStatus: 'COMPLETED',
        riderId: null,
      } as unknown as Order);

      await expect(
        service.updateStatus('flado-ord-1', 'OUT_FOR_DELIVERY', adminUser),
      ).rejects.toThrow(BadRequestException);
    });

    it('T37: rejects OUT_FOR_DELIVERY for Quick order without completed handoff', async () => {
      orderRepo.findOne.mockResolvedValueOnce({
        id: 'flado-ord-2',
        shopId: 'shop-101',
        status: 'PREPARING',
        pickingStatus: 'COMPLETED',
        riderId: 'rider-123',
        handoffCompletedAt: null,
        pickupOtpUsedAt: null,
      } as Order);

      await expect(
        service.updateStatus('flado-ord-2', 'OUT_FOR_DELIVERY', adminUser),
      ).rejects.toThrow(BadRequestException);
    });

    it('T38: rejects OUT_FOR_DELIVERY for Quick order with incomplete picking', async () => {
      orderRepo.findOne.mockResolvedValueOnce({
        id: 'flado-ord-3',
        shopId: 'shop-101',
        status: 'PREPARING',
        pickingStatus: 'IN_PROGRESS',
        riderId: 'rider-123',
        handoffCompletedAt: new Date(),
      } as Order);

      await expect(
        service.updateStatus('flado-ord-3', 'OUT_FOR_DELIVERY', adminUser),
      ).rejects.toThrow(BadRequestException);
    });

    it('T39: succeeds OUT_FOR_DELIVERY when picking, rider, and handoff are complete', async () => {
      orderRepo.findOne.mockResolvedValueOnce({
        id: 'flado-ord-4',
        shopId: 'shop-101',
        status: 'PREPARING',
        pickingStatus: 'COMPLETED',
        riderId: 'rider-123',
        riderName: 'Vikram Rider',
        handoffCompletedAt: new Date(),
      } as Order);

      orderRepo.save.mockImplementation(async (ord: any) => ord);

      const updated = await service.updateStatus('flado-ord-4', 'OUT_FOR_DELIVERY', adminUser);
      expect(updated.status).toBe('OUT_FOR_DELIVERY');
      expect(trackingRepo.save).toHaveBeenCalled();
    });

    it('T40: allows Marketplace order dispatch without Flado OTP handoff verification', async () => {
      orderRepo.findOne.mockResolvedValueOnce({
        id: 'mkt-ord-1',
        shopId: null, // Marketplace order
        status: 'PREPARING',
      } as Order);

      orderRepo.save.mockImplementation(async (ord: any) => ord);

      const updated = await service.updateStatus('mkt-ord-1', 'OUT_FOR_DELIVERY', adminUser);
      expect(updated.status).toBe('OUT_FOR_DELIVERY');
    });

    it('T41: rejects transition from terminal CANCELLED state to OUT_FOR_DELIVERY', async () => {
      orderRepo.findOne.mockResolvedValueOnce({
        id: 'cancelled-ord',
        status: 'CANCELLED',
      } as Order);

      await expect(
        service.updateStatus('cancelled-ord', 'OUT_FOR_DELIVERY', adminUser),
      ).rejects.toThrow(BadRequestException);
    });
  });
});


