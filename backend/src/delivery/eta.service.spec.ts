import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EtaService, ETA_CONFIG } from './eta.service';
import { FladoShop, Order } from '../database/entities';

describe('EtaService (CMD-055 Server-Authoritative ETA Engine)', () => {
  let service: EtaService;

  const mockShopRepo = { findOne: jest.fn() };
  const mockOrderRepo = { find: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EtaService,
        { provide: getRepositoryToken(FladoShop), useValue: mockShopRepo },
        { provide: getRepositoryToken(Order), useValue: mockOrderRepo },
      ],
    }).compile();

    service = module.get<EtaService>(EtaService);
  });

  describe('calculateQuickCommerceEta()', () => {
    it('1. & 2. should calculate deterministic server ETA for a valid Quick-Commerce fulfillment source', () => {
      const mockShop = {
        id: 'shop-101',
        shopName: 'Bandra Express Darkstore',
        deliveryRadiusKm: 5,
        isOpen: true,
      } as FladoShop;

      // 2 km distance, 2 active orders queue, 1 item
      const result = service.calculateQuickCommerceEta(mockShop, 2.0, 2, 1);

      expect(result.isAvailable).toBe(true);
      expect(result.surface).toBe('QUICK_COMMERCE');
      expect(result.reasonCode).toBe('SERVICEABLE');
      expect(result.fulfillmentSourceId).toBe('shop-101');
      expect(result.fulfillmentSourceName).toBe('Bandra Express Darkstore');
      expect(result.minMinutes).toBeGreaterThan(0);
      expect(result.maxMinutes).toBeGreaterThan(result.minMinutes!);
      expect(result.estimatedDeliveryText).toMatch(/^\d+–\d+ mins$/);
      expect(result.deliveryBadgeText).toMatch(/^\d+ MINS$/);
      expect(result.confidence).toBe('HIGH');
      expect(result.ttlSeconds).toBe(300);
      expect(result.calculatedAt).toBeDefined();
      expect(result.expiresAt).toBeDefined();
    });

    it('6. & 8. should deterministically adjust ETA range when darkstore workload increases', () => {
      const mockShop = { id: 'shop-101', shopName: 'Bandra Express Darkstore' } as FladoShop;

      const lowWorkloadResult = service.calculateQuickCommerceEta(mockShop, 1.5, 0, 1);
      const highWorkloadResult = service.calculateQuickCommerceEta(mockShop, 1.5, 10, 1);

      expect(highWorkloadResult.minMinutes!).toBeGreaterThan(lowWorkloadResult.minMinutes!);
      expect(highWorkloadResult.breakdown?.workloadQueueMinutes).toBeGreaterThan(
        lowWorkloadResult.breakdown?.workloadQueueMinutes!,
      );
    });

    it('10. & 11. should provide freshness TTL metadata and produce deterministic results for same inputs', () => {
      const mockShop = { id: 'shop-101', shopName: 'Bandra Express Darkstore' } as FladoShop;

      const res1 = service.calculateQuickCommerceEta(mockShop, 3.0, 1, 2);
      const res2 = service.calculateQuickCommerceEta(mockShop, 3.0, 1, 2);

      expect(res1.minMinutes).toBe(res2.minMinutes);
      expect(res1.maxMinutes).toBe(res2.maxMinutes);
      expect(res1.ttlSeconds).toBe(ETA_CONFIG.quickCommerce.ttlSeconds);
    });
  });

  describe('calculateMarketplaceEta()', () => {
    it('9. & 10. should calculate Marketplace ETA using handling days & transit configuration', () => {
      const result = service.calculateMarketplaceEta('400001', 1);

      expect(result.isAvailable).toBe(true);
      expect(result.surface).toBe('MARKETPLACE');
      expect(result.estimatedDeliveryText).toMatch(/Delivered in \d+–\d+ business days/);
      expect(result.deliveryBadgeText).toMatch(/\d+–\d+ DAYS/);
      expect(result.ttlSeconds).toBe(ETA_CONFIG.marketplace.ttlSeconds);
    });
  });
});
