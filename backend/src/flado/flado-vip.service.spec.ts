import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FladoVipService, VIP_PLANS, addMonths } from './flado-vip.service';
import { QuickFeesService } from './quick-fees.service';
import { FladoVipSubscription, User, PaymentIntent, FladoShop, Order } from '../database/entities';

describe('FladoVipService & QuickFees Integration', () => {
  let vipService: FladoVipService;
  let quickFeesService: QuickFeesService;

  let subRepoMock: any;
  let userRepoMock: any;
  let intentRepoMock: any;
  let shopRepoMock: any;
  let orderRepoMock: any;

  const mockUser = {
    id: 'user-vip-1',
    email: 'vip@auramart.com',
    fullName: 'VIP User',
    isVip: false,
    vipExpiresAt: null,
  };

  const mockShop = {
    id: 'shop-darkstore-1',
    shopName: 'Flado Darkstore Express',
    deliveryFeeType: 'PAID',
    deliveryFeeAmount: 2.50, // $2.50
    minimumOrderAmount: 10.00,
    maxActiveOrders: 20,
  };

  beforeEach(async () => {
    subRepoMock = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn((dto) => ({ id: 'sub-uuid-1', ...dto })),
      save: jest.fn((entity) => Promise.resolve(entity)),
    };

    userRepoMock = {
      findOne: jest.fn().mockResolvedValue({ ...mockUser }),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    intentRepoMock = {
      findOne: jest.fn(),
      create: jest.fn((dto) => ({ id: 'intent-uuid-1', ...dto })),
      save: jest.fn((entity) => Promise.resolve(entity)),
    };

    shopRepoMock = {
      findOne: jest.fn().mockResolvedValue({ ...mockShop }),
    };

    orderRepoMock = {
      count: jest.fn().mockResolvedValue(0),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FladoVipService,
        QuickFeesService,
        { provide: getRepositoryToken(FladoVipSubscription), useValue: subRepoMock },
        { provide: getRepositoryToken(User), useValue: userRepoMock },
        { provide: getRepositoryToken(PaymentIntent), useValue: intentRepoMock },
        { provide: getRepositoryToken(FladoShop), useValue: shopRepoMock },
        { provide: getRepositoryToken(Order), useValue: orderRepoMock },
      ],
    }).compile();

    vipService = module.get<FladoVipService>(FladoVipService);
    quickFeesService = module.get<QuickFeesService>(QuickFeesService);
  });

  describe('Calendar-Safe Date Calculations', () => {
    it('calculates +1 month correctly for normal dates', () => {
      const start = new Date(2026, 4, 15); // May 15, 2026
      const end = addMonths(start, 1);
      expect(end.getMonth()).toBe(5); // June
      expect(end.getDate()).toBe(15);
    });

    it('handles January 31 edge case (clamps to Feb 28 on non-leap year)', () => {
      const jan31 = new Date(2025, 0, 31); // Jan 31, 2025
      const febEnd = addMonths(jan31, 1);
      expect(febEnd.getMonth()).toBe(1); // Feb
      expect(febEnd.getDate()).toBe(28); // Feb 28
    });

    it('handles Leap-Year February 29 edge case when adding 1 year', () => {
      const leapFeb29 = new Date(2024, 1, 29); // Feb 29, 2024
      const nextYear = addMonths(leapFeb29, 12);
      expect(nextYear.getFullYear()).toBe(2025);
      expect(nextYear.getMonth()).toBe(1); // Feb
      expect(nextYear.getDate()).toBe(28); // Feb 28, 2025
    });
  });

  describe('Subscription Plan Specifications', () => {
    it('resolves Monthly plan price as 399 minor units ($3.99)', async () => {
      subRepoMock.findOne.mockResolvedValue(null);
      const res = await vipService.subscribe('user-1', 'MONTHLY');
      expect(res.subscription.priceMinor).toBe(399);
      expect(res.paymentIntent.formattedAmount).toBe('$3.99');
    });

    it('resolves Quarterly plan price as 999 minor units ($9.99)', async () => {
      subRepoMock.findOne.mockResolvedValue(null);
      const res = await vipService.subscribe('user-1', 'QUARTERLY');
      expect(res.subscription.priceMinor).toBe(999);
      expect(res.paymentIntent.formattedAmount).toBe('$9.99');
    });

    it('resolves Annual plan price as 2999 minor units ($29.99)', async () => {
      subRepoMock.findOne.mockResolvedValue(null);
      const res = await vipService.subscribe('user-1', 'ANNUAL');
      expect(res.subscription.priceMinor).toBe(2999);
      expect(res.paymentIntent.formattedAmount).toBe('$29.99');
    });

    it('rejects invalid plan identifiers', async () => {
      await expect(vipService.subscribe('user-1', 'LIFETIME')).rejects.toThrow(BadRequestException);
    });
  });

  describe('Subscription Lifecycle & Payment Activation', () => {
    it('creates new subscriptions with PENDING_PAYMENT status', async () => {
      subRepoMock.findOne.mockResolvedValue(null);
      const res = await vipService.subscribe('user-1', 'MONTHLY');
      expect(res.subscription.status).toBe('PENDING_PAYMENT');
      expect(res.subscription.amountPaidMinor).toBe(0);
    });

    it('does not grant active VIP status while subscription is PENDING_PAYMENT', async () => {
      subRepoMock.findOne.mockResolvedValue(null);
      const isActive = await vipService.isVipActive('user-1');
      expect(isActive).toBe(false);
    });

    it('activates subscription upon successful payment confirmation', async () => {
      const pendingSub = {
        id: 'sub-1',
        userId: 'user-1',
        plan: 'MONTHLY',
        status: 'PENDING_PAYMENT',
        paymentIntentId: 'intent-1',
        priceMinor: 399,
      };

      const mockIntent = {
        id: 'intent-1',
        amountMinor: 399,
        amountCapturedMinor: 399,
        status: 'REQUIRES_ACTION',
      };

      subRepoMock.findOne.mockResolvedValue(pendingSub);
      intentRepoMock.findOne.mockResolvedValue(mockIntent);

      const confirmedSub = await vipService.confirmPayment('user-1', 'sub-1');

      expect(confirmedSub.status).toBe('ACTIVE');
      expect(confirmedSub.amountPaidMinor).toBe(399);
      expect(confirmedSub.activatedAt).toBeDefined();
      expect(confirmedSub.expiresAt).toBeDefined();
      expect(userRepoMock.update).toHaveBeenCalledWith(
        { id: 'user-1' },
        expect.objectContaining({ isVip: true }),
      );
    });

    it('prevents duplicate active subscription purchase', async () => {
      const activeSub = {
        id: 'sub-active',
        userId: 'user-1',
        plan: 'MONTHLY',
        status: 'ACTIVE',
        activatedAt: new Date(),
        expiresAt: new Date(Date.now() + 864000000),
      };

      subRepoMock.findOne.mockResolvedValue(activeSub);

      await expect(vipService.subscribe('user-1', 'QUARTERLY')).rejects.toThrow(BadRequestException);
    });

    it('handles subscription cancellation gracefully by setting cancelAtPeriodEnd', async () => {
      const activeSub = {
        id: 'sub-active',
        userId: 'user-1',
        plan: 'MONTHLY',
        status: 'ACTIVE',
        activatedAt: new Date(),
        expiresAt: new Date(Date.now() + 864000000),
        cancelAtPeriodEnd: false,
      };

      subRepoMock.findOne.mockResolvedValue(activeSub);

      const cancelled = await vipService.cancelSubscription('user-1');
      expect(cancelled.cancelAtPeriodEnd).toBe(true);
      expect(cancelled.cancelledAt).toBeDefined();
    });
  });

  describe('QuickFeesService Server-Authoritative Fee Waiver', () => {
    it('calculates standard fees for non-VIP customer', async () => {
      userRepoMock.findOne.mockResolvedValue({ id: 'user-non-vip', isVip: false });

      const fees = await quickFeesService.calculateQuickFees(
        mockShop.id,
        1500, // $15.00 subtotal
        'QUICK_COMMERCE',
        'user-non-vip',
      );

      const deliveryFeeLine = fees.feeLines.find((f) => f.code === 'DELIVERY_FEE');
      const handlingFeeLine = fees.feeLines.find((f) => f.code === 'HANDLING_FEE');

      expect(deliveryFeeLine?.amountMinor).toBe(0); // Subtotal >= threshold ($5.00)
      expect(deliveryFeeLine?.waiverReason).toBe('Free delivery threshold met');
      expect(handlingFeeLine?.amountMinor).toBe(100); // Standard $1.00 handling fee
    });

    it('waives both delivery and handling fees for active VIP customer', async () => {
      const futureDate = new Date(Date.now() + 864000000);
      userRepoMock.findOne.mockResolvedValue({
        id: 'user-vip',
        isVip: true,
        vipExpiresAt: futureDate,
      });

      const fees = await quickFeesService.calculateQuickFees(
        mockShop.id,
        400, // $4.00 subtotal (below standard threshold)
        'QUICK_COMMERCE',
        'user-vip',
      );

      const deliveryFeeLine = fees.feeLines.find((f) => f.code === 'DELIVERY_FEE');
      const handlingFeeLine = fees.feeLines.find((f) => f.code === 'HANDLING_FEE');

      expect(deliveryFeeLine?.amountMinor).toBe(0);
      expect(deliveryFeeLine?.isWaived).toBe(true);
      expect(deliveryFeeLine?.waiverReason).toBe('FLADO_VIP');

      expect(handlingFeeLine?.amountMinor).toBe(0);
      expect(handlingFeeLine?.isWaived).toBe(true);
      expect(handlingFeeLine?.waiverReason).toBe('FLADO_VIP');
    });

    it('does not grant VIP fee waivers if VIP pass is expired', async () => {
      const pastDate = new Date(Date.now() - 86400000); // Expired yesterday
      userRepoMock.findOne.mockResolvedValue({
        id: 'user-expired',
        isVip: true,
        vipExpiresAt: pastDate,
      });

      const fees = await quickFeesService.calculateQuickFees(
        mockShop.id,
        300, // $3.00 subtotal
        'QUICK_COMMERCE',
        'user-expired',
      );

      const deliveryFeeLine = fees.feeLines.find((f) => f.code === 'DELIVERY_FEE');
      const handlingFeeLine = fees.feeLines.find((f) => f.code === 'HANDLING_FEE');

      expect(deliveryFeeLine?.amountMinor).toBe(250); // Standard darkstore delivery fee $2.50
      expect(handlingFeeLine?.amountMinor).toBe(100); // Standard $1.00 handling fee
    });
  });
});
