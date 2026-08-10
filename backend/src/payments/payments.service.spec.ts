import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, ForbiddenException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CodPaymentProvider } from './providers/cod-payment.provider';
import { GenericGatewayProvider } from './providers/generic-gateway.provider';
import { StripePaymentProvider } from './providers/stripe-payment.provider';
import { RazorpayPaymentProvider } from './providers/razorpay-payment.provider';
import { CheckoutService } from '../checkout/checkout.service';
import { PaymentIntent, PaymentAttempt, User } from '../database/entities';

describe('PaymentsService — CMD-045 Payment Orchestration', () => {
  let service: PaymentsService;
  let intentRepo: jest.Mocked<Repository<PaymentIntent>>;
  let attemptRepo: jest.Mocked<Repository<PaymentAttempt>>;
  let checkoutService: jest.Mocked<CheckoutService>;

  const MOCK_CUSTOMER_ID = 'cust-123';
  const MOCK_OTHER_CUSTOMER = 'cust-999';

  const MOCK_ELIGIBLE_PREVIEW = {
    cartId: 'cart-1',
    customerId: MOCK_CUSTOMER_ID,
    addresses: [],
    selectedAddress: { id: 'addr-1' } as any,
    deliveryOptions: [],
    selectedDeliveryOption: { id: 'del-std' } as any,
    paymentMethods: [
      { id: 'pay-upi', type: 'UPI' as const, label: 'UPI', description: 'UPI', isEligible: true, isSelected: true },
      { id: 'pay-card', type: 'CARD' as const, label: 'Card', description: 'Card', isEligible: true, isSelected: false },
      { id: 'pay-cod', type: 'COD' as const, label: 'COD', description: 'COD', isEligible: true, isSelected: false },
    ],
    selectedPaymentMethod: 'pay-upi',
    items: [],
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

  beforeEach(async () => {
    const mockRepoFactory = () => ({
      create: jest.fn((dto) => ({ id: `uuid-${Math.random()}`, createdAt: new Date(), updatedAt: new Date(), ...dto })),
      save: jest.fn((entity) => Promise.resolve({ ...entity, id: entity.id || 'uuid-saved' })),
      findOne: jest.fn(),
      find: jest.fn().mockResolvedValue([]),
    });

    const mockCheckoutService = {
      getPreview: jest.fn().mockResolvedValue(MOCK_ELIGIBLE_PREVIEW),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        CodPaymentProvider,
        GenericGatewayProvider,
        StripePaymentProvider,
        RazorpayPaymentProvider,
        { provide: getRepositoryToken(PaymentIntent), useFactory: mockRepoFactory },
        { provide: getRepositoryToken(PaymentAttempt), useFactory: mockRepoFactory },
        { provide: getRepositoryToken(User), useFactory: mockRepoFactory },
        { provide: CheckoutService, useValue: mockCheckoutService },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    intentRepo = module.get(getRepositoryToken(PaymentIntent));
    attemptRepo = module.get(getRepositoryToken(PaymentAttempt));
    checkoutService = module.get(CheckoutService);
  });

  // ── 1. Create Payment Intent (Authoritative Revalidation) ─────────────────

  it('T01: creates online PaymentIntent with REQUIRES_ACTION and clientSecret', async () => {
    intentRepo.findOne.mockResolvedValue(null);

    const result = await service.createIntent(MOCK_CUSTOMER_ID, {
      paymentMethod: 'pay-upi',
    });

    expect(checkoutService.getPreview).toHaveBeenCalledWith(MOCK_CUSTOMER_ID, {
      addressId: undefined,
      deliveryOptionId: undefined,
      paymentMethod: 'pay-upi',
    });
    expect(result.amountMinor).toBe(6400); // Server-authoritative grand total
    expect(result.formattedAmount).toBe('$64.00');
    expect(result.status).toBe('REQUIRES_ACTION');
    expect(result.clientSecret).toBeDefined();
    expect(attemptRepo.save).toHaveBeenCalled();
  });

  it('T02: creates COD PaymentIntent with immediate SUCCEEDED state when eligible', async () => {
    intentRepo.findOne.mockResolvedValue(null);
    checkoutService.getPreview.mockResolvedValueOnce({
      ...MOCK_ELIGIBLE_PREVIEW,
      paymentMethods: [
        { id: 'pay-cod', type: 'COD', label: 'COD', description: 'COD', isEligible: true, isSelected: true },
      ],
      selectedPaymentMethod: 'pay-cod',
    });

    const result = await service.createIntent(MOCK_CUSTOMER_ID, {
      paymentMethod: 'pay-cod',
    });

    expect(result.status).toBe('SUCCEEDED');
    expect(result.provider).toBe('COD');
    expect(attemptRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'SUCCESS' })
    );
  });

  it('T03: rejects intent creation when checkout is not eligible', async () => {
    checkoutService.getPreview.mockResolvedValueOnce({
      ...MOCK_ELIGIBLE_PREVIEW,
      checkoutEligibility: { isEligible: false, blockers: ['Shipping address selection required'] },
    });

    await expect(
      service.createIntent(MOCK_CUSTOMER_ID, { paymentMethod: 'pay-upi' })
    ).rejects.toThrow(BadRequestException);
  });

  it('T04: rejects intent creation when selected payment method is ineligible', async () => {
    checkoutService.getPreview.mockResolvedValueOnce({
      ...MOCK_ELIGIBLE_PREVIEW,
      grandTotal: 150000, // Exceeds $1000 COD limit
      paymentMethods: [
        { id: 'pay-cod', type: 'COD', label: 'COD', description: 'COD', isEligible: false, isSelected: true, uneligibleReason: 'COD unavailable over $1,000' },
      ],
    });

    await expect(
      service.createIntent(MOCK_CUSTOMER_ID, { paymentMethod: 'pay-cod' })
    ).rejects.toThrow(BadRequestException);
  });

  // ── 2. Idempotency ────────────────────────────────────────────────────────

  it('T05: returns existing active intent when idempotencyKey matches', async () => {
    const existingIntent: Partial<PaymentIntent> = {
      id: 'intent-existing-1',
      customerId: MOCK_CUSTOMER_ID,
      cartId: 'cart-1',
      amountMinor: 6400,
      currency: 'USD',
      paymentMethod: 'pay-upi',
      provider: 'GENERIC',
      status: 'REQUIRES_ACTION',
      idempotencyKey: 'idemp-key-99',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    intentRepo.findOne.mockResolvedValue(existingIntent as PaymentIntent);

    const result = await service.createIntent(
      MOCK_CUSTOMER_ID,
      { paymentMethod: 'pay-upi', idempotencyKey: 'idemp-key-99' },
      'idemp-key-99'
    );

    expect(result.id).toBe('intent-existing-1');
    expect(checkoutService.getPreview).not.toHaveBeenCalled();
  });

  // ── 3. IDOR Protection ───────────────────────────────────────────────────

  it('T06: getIntent enforces customer ownership (IDOR check)', async () => {
    intentRepo.findOne.mockResolvedValue({
      id: 'intent-100',
      customerId: MOCK_CUSTOMER_ID,
      amountMinor: 5000,
      currency: 'USD',
      paymentMethod: 'pay-upi',
      provider: 'GENERIC',
      status: 'REQUIRES_ACTION',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as PaymentIntent);

    // Matching customer -> OK
    const okResult = await service.getIntent(MOCK_CUSTOMER_ID, 'intent-100');
    expect(okResult.id).toBe('intent-100');

    // Other customer -> ForbiddenException
    await expect(service.getIntent(MOCK_OTHER_CUSTOMER, 'intent-100')).rejects.toThrow(ForbiddenException);
  });

  // ── 4. Confirm Intent & State Machine ──────────────────────────────────────

  it('T07: confirms intent and updates status to SUCCEEDED', async () => {
    const mockIntent: Partial<PaymentIntent> = {
      id: 'intent-200',
      customerId: MOCK_CUSTOMER_ID,
      amountMinor: 6400,
      currency: 'USD',
      paymentMethod: 'pay-upi',
      provider: 'GENERIC',
      status: 'REQUIRES_ACTION',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    intentRepo.findOne.mockResolvedValue(mockIntent as PaymentIntent);

    const result = await service.confirmIntent(MOCK_CUSTOMER_ID, 'intent-200', {});

    expect(result.status).toBe('SUCCEEDED');
    expect(attemptRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'SUCCESS' })
    );
  });

  it('T08: handles simulated payment failure cleanly without throwing raw crash', async () => {
    const mockIntent: Partial<PaymentIntent> = {
      id: 'intent-201',
      customerId: MOCK_CUSTOMER_ID,
      amountMinor: 6400,
      currency: 'USD',
      paymentMethod: 'pay-card',
      provider: 'GENERIC',
      status: 'REQUIRES_ACTION',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    intentRepo.findOne.mockResolvedValue(mockIntent as PaymentIntent);

    const result = await service.confirmIntent(MOCK_CUSTOMER_ID, 'intent-201', {
      providerPayload: { simulateFailure: true, failureCode: 'CARD_DECLINED', failureMessage: 'Insufficient funds' },
    });

    expect(result.status).toBe('FAILED');
    expect(attemptRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'FAILURE', failureCode: 'CARD_DECLINED' })
    );
  });

  it('T09: rejects confirming terminal CANCELLED intent', async () => {
    intentRepo.findOne.mockResolvedValue({
      id: 'intent-202',
      customerId: MOCK_CUSTOMER_ID,
      status: 'CANCELLED',
    } as PaymentIntent);

    await expect(
      service.confirmIntent(MOCK_CUSTOMER_ID, 'intent-202', {})
    ).rejects.toThrow(BadRequestException);
  });

  // ── 5. Cancel Intent ─────────────────────────────────────────────────────

  it('T10: cancels active intent but rejects canceling SUCCEEDED intent', async () => {
    intentRepo.findOne.mockResolvedValueOnce({
      id: 'intent-300',
      customerId: MOCK_CUSTOMER_ID,
      status: 'REQUIRES_ACTION',
      paymentMethod: 'pay-upi',
    } as PaymentIntent);

    const cancelled = await service.cancelIntent(MOCK_CUSTOMER_ID, 'intent-300');
    expect(cancelled.status).toBe('CANCELLED');

    intentRepo.findOne.mockResolvedValueOnce({
      id: 'intent-301',
      customerId: MOCK_CUSTOMER_ID,
      status: 'SUCCEEDED',
    } as PaymentIntent);

    await expect(service.cancelIntent(MOCK_CUSTOMER_ID, 'intent-301')).rejects.toThrow(BadRequestException);
  });

  // ── 6. Webhook Verification ──────────────────────────────────────────────

  it('T11: webhook signature validation rejects invalid signature', async () => {
    await expect(
      service.handleWebhook('GENERIC', 'invalid_sig', { event: 'payment_intent.succeeded' })
    ).rejects.toThrow(UnauthorizedException);
  });
});
