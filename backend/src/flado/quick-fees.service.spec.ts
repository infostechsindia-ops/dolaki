import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QuickFeesService, QUICK_FEES_CONFIG } from './quick-fees.service';
import { FladoShop, Order, User } from '../database/entities';

describe('QuickFeesService (CMD-057 Quick Fees Engine)', () => {
  let service: QuickFeesService;

  const mockShopRepo = { findOne: jest.fn() };
  const mockOrderRepo = { count: jest.fn() };
  const mockUserRepo = { findOne: jest.fn().mockResolvedValue(null) };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuickFeesService,
        { provide: getRepositoryToken(FladoShop), useValue: mockShopRepo },
        { provide: getRepositoryToken(Order), useValue: mockOrderRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<QuickFeesService>(QuickFeesService);
  });

  describe('calculateQuickFees()', () => {
    it('1. & 4. should calculate configured delivery fee and authoritative fee breakdown', async () => {
      mockShopRepo.findOne.mockResolvedValue({
        id: 'shop-101',
        shopName: 'Bandra Express Darkstore',
        deliveryFeeType: 'PAID',
        deliveryFeeAmount: 2.5, // $2.50 base delivery fee
        minimumOrderAmount: 10.0, // $10.00 min order
        maxActiveOrders: 20,
      });
      mockOrderRepo.count.mockResolvedValue(2); // Low capacity

      const result = await service.calculateQuickFees('shop-101', 1200); // $12.00 subtotal (threshold met)

      expect(result.surface).toBe('QUICK_COMMERCE');
      expect(result.fulfillmentSourceId).toBe('shop-101');
      expect(result.subtotalMinor).toBe(1200);
      expect(result.feeLines.length).toBeGreaterThan(0);
      expect(result.freeDeliveryThreshold?.isEligibleForFreeDelivery).toBe(true);
      expect(result.minimumOrderPolicy?.isMet).toBe(true);
    });

    it('2. should waive delivery fee when free delivery threshold is met', async () => {
      mockShopRepo.findOne.mockResolvedValue({
        id: 'shop-101',
        shopName: 'Bandra Express Darkstore',
        deliveryFeeType: 'PAID',
        deliveryFeeAmount: 3.0,
      });
      mockOrderRepo.count.mockResolvedValue(0);

      const result = await service.calculateQuickFees('shop-101', 600); // $6.00 subtotal (>= $5.00 threshold)
      const deliveryFeeLine = result.feeLines.find((f) => f.code === 'DELIVERY_FEE');

      expect(deliveryFeeLine?.isWaived).toBe(true);
      expect(deliveryFeeLine?.amountMinor).toBe(0);
      expect(deliveryFeeLine?.formattedAmount).toBe('FREE');
    });

    it('3. should apply small-basket fee when subtotal is below minimum order amount', async () => {
      mockShopRepo.findOne.mockResolvedValue({
        id: 'shop-101',
        shopName: 'Bandra Express Darkstore',
        deliveryFeeType: 'FREE',
        deliveryFeeAmount: 0,
        minimumOrderAmount: 15.0, // $15.00 min order
      });
      mockOrderRepo.count.mockResolvedValue(0);

      const result = await service.calculateQuickFees('shop-101', 400); // $4.00 subtotal (< $15.00 min)
      const smallBasketLine = result.feeLines.find((f) => f.code === 'SMALL_BASKET_FEE');

      expect(result.minimumOrderPolicy?.isMet).toBe(false);
      expect(smallBasketLine).toBeDefined();
      expect(smallBasketLine?.amountMinor).toBe(QUICK_FEES_CONFIG.smallBasketFeeMinor);
    });

    it('4. & 6. should apply high-demand surge fee when store active orders reach 75% capacity', async () => {
      mockShopRepo.findOne.mockResolvedValue({
        id: 'shop-101',
        shopName: 'Bandra Express Darkstore',
        deliveryFeeType: 'FREE',
        deliveryFeeAmount: 0,
        maxActiveOrders: 20,
      });
      mockOrderRepo.count.mockResolvedValue(16); // 16 >= 15 (75% of 20)

      const result = await service.calculateQuickFees('shop-101', 1000);
      const surgeLine = result.feeLines.find((f) => f.code === 'SURGE_FEE');

      expect(surgeLine).toBeDefined();
      expect(surgeLine?.amountMinor).toBe(QUICK_FEES_CONFIG.surgeFeeMinor);
    });

    it('8. should isolate Marketplace surface and return standard zero quick fees', async () => {
      const result = await service.calculateQuickFees('wh-1', 5000, 'MARKETPLACE');

      expect(result.surface).toBe('MARKETPLACE');
      expect(result.totalFeesMinor).toBe(0);
      expect(result.formattedTotalFees).toBe('FREE');
    });
  });
});
