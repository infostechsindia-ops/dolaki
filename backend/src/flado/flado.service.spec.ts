import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FladoService, calculateCodFee } from './flado.service';
import {
  Darkstore, Product, Order, OrderItem, Inventory,
  FladoShop, ShopSubscription, ShopCredit, CreditTransaction,
} from '../database/entities';

const mockRepo = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest.fn().mockImplementation((entity) => Promise.resolve({ id: 'mock-id', ...entity })),
  delete: jest.fn(),
});

describe('FladoService', () => {
  let service: FladoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FladoService,
        { provide: getRepositoryToken(Darkstore), useValue: mockRepo() },
        { provide: getRepositoryToken(Product), useValue: mockRepo() },
        { provide: getRepositoryToken(Order), useValue: mockRepo() },
        { provide: getRepositoryToken(OrderItem), useValue: mockRepo() },
        { provide: getRepositoryToken(Inventory), useValue: mockRepo() },
        { provide: getRepositoryToken(FladoShop), useValue: mockRepo() },
        { provide: getRepositoryToken(ShopSubscription), useValue: mockRepo() },
        { provide: getRepositoryToken(ShopCredit), useValue: mockRepo() },
        { provide: getRepositoryToken(CreditTransaction), useValue: mockRepo() },
      ],
    }).compile();

    service = module.get<FladoService>(FladoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── COD Fee Tests ─────────────────────────────────────────────────────────

  describe('calculateCodFee()', () => {
    it('should return 1% of the order amount', () => {
      expect(calculateCodFee(200)).toBe(2);
      expect(calculateCodFee(500)).toBe(5);
    });

    it('should cap the fee at ₹10 for large orders', () => {
      expect(calculateCodFee(1500)).toBe(10);
      expect(calculateCodFee(5000)).toBe(10);
    });

    it('should return 0 for zero-value orders', () => {
      expect(calculateCodFee(0)).toBe(0);
    });
  });

  describe('calculateCodFee (service method)', () => {
    it('should return fee and message for a COD order', () => {
      const result = service.calculateCodFee(320);
      expect(result.fee).toBe(3);
      expect(result.message).toContain('₹3 COD fee');
      expect(result.message).toContain('Pay online to remove');
    });

    it('should return no surcharge message for zero amount', () => {
      const result = service.calculateCodFee(0);
      expect(result.fee).toBe(0);
      expect(result.message).toBe('No COD fee.');
    });
  });

  // ─── Geo-Filter Tests ──────────────────────────────────────────────────────

  describe('getNearbyShops()', () => {
    it('should return only approved open shops within delivery radius', async () => {
      const mockShops = [
        {
          id: '1',
          shopName: 'Rahul Kirana Store',
          lat: 26.1209,
          lng: 85.3647,
          deliveryRadiusKm: 2.0,
          approvalStatus: 'APPROVED',
          isOpen: true,
          categoriesJson: '["Grocery","Dairy"]',
          deliveryFeeType: 'FREE',
        },
        {
          id: '2',
          shopName: 'Far Away Shop',
          lat: 26.2000,
          lng: 85.4000,
          deliveryRadiusKm: 1.0,
          approvalStatus: 'APPROVED',
          isOpen: true,
          categoriesJson: '["Grocery"]',
          deliveryFeeType: 'PAID',
        },
      ];

      const shopRepo = service['shopRepository'];
      jest.spyOn(shopRepo, 'find').mockResolvedValue(mockShops as any);

      // User stands at Muzaffarpur city centre — shop 1 is ~0 km away, shop 2 is ~10+ km away
      const result = await service.getNearbyShops(26.1209, 85.3647);
      expect(result.length).toBe(1);
      expect(result[0].shopName).toBe('Rahul Kirana Store');
      expect(result[0].distance).toBe(0);
    });

    it('should filter by category when provided', async () => {
      const mockShops = [
        {
          id: '1', shopName: 'Kirana Store', lat: 26.1209, lng: 85.3647,
          deliveryRadiusKm: 2.0, approvalStatus: 'APPROVED', isOpen: true,
          categoriesJson: '["Grocery"]', deliveryFeeType: 'FREE',
        },
      ];
      const shopRepo = service['shopRepository'];
      jest.spyOn(shopRepo, 'find').mockResolvedValue(mockShops as any);

      const result = await service.getNearbyShops(26.1209, 85.3647, 'Meat');
      expect(result.length).toBe(0); // Shop does not have Meat category
    });
  });
});
