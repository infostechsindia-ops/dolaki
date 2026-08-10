import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SubstitutionsService } from './substitutions.service';
import {
  Order,
  OrderItem,
  OrderItemSubstitution,
  Inventory,
  Product,
  ProductVariant,
  OrderTrackingEvent,
} from '../database/entities';
import { AuditService } from '../audit/audit.service';
import { RefundsService } from '../payments/refunds.service';

describe('SubstitutionsService (CMD-056 Substitution Domain)', () => {
  let service: SubstitutionsService;

  const mockOrderRepo = { findOne: jest.fn() };
  const mockOrderItemRepo = { findOne: jest.fn() };
  const mockSubRepo = { findOne: jest.fn(), create: jest.fn((dto) => ({ id: 'sub-1', ...dto })), save: jest.fn((x) => Promise.resolve({ id: 'sub-1', ...x })) };
  const mockInventoryRepo = { find: jest.fn(), findOne: jest.fn() };
  const mockProductRepo = { find: jest.fn() };
  const mockVariantRepo = { findOne: jest.fn() };
  const mockTrackingRepo = { create: jest.fn((dto) => dto), save: jest.fn((x) => Promise.resolve(x)) };
  const mockAuditService = { log: jest.fn().mockResolvedValue(true) };
  const mockRefundsService = { initiateRefund: jest.fn().mockResolvedValue({ id: 'ref-1' }) };
  const mockDataSource = {
    transaction: jest.fn((cb) => cb({
      findOne: jest.fn((entity, opts) => {
        if (entity === Order) return Promise.resolve({ id: 'ord-1', customerId: 'cust-1', status: 'PROCESSING', fulfillmentSourceId: 'shop-1' });
        if (entity === OrderItemSubstitution) return Promise.resolve({
          id: 'sub-1',
          orderId: 'ord-1',
          orderItemId: 'item-1',
          customerId: 'cust-1',
          substituteVariantId: 'v-sub-1',
          substituteSku: 'v-sub-1',
          fulfillmentSourceId: 'shop-1',
          status: 'AWAITING_CUSTOMER',
          priceDifferenceMinor: -100,
          originalUnitPriceMinor: 399,
          substituteUnitPriceMinor: 299,
        });
        if (entity === Inventory) return Promise.resolve({ shopId: 'shop-1', variantId: 'v-sub-1', stockQuantity: 10, reservedQuantity: 2 });
        return Promise.resolve(null);
      }),
      save: jest.fn((entity, obj) => Promise.resolve({ id: 'sub-1', ...obj })),
      create: jest.fn((entity, obj) => obj),
    })),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubstitutionsService,
        { provide: getRepositoryToken(Order), useValue: mockOrderRepo },
        { provide: getRepositoryToken(OrderItem), useValue: mockOrderItemRepo },
        { provide: getRepositoryToken(OrderItemSubstitution), useValue: mockSubRepo },
        { provide: getRepositoryToken(Inventory), useValue: mockInventoryRepo },
        { provide: getRepositoryToken(Product), useValue: mockProductRepo },
        { provide: getRepositoryToken(ProductVariant), useValue: mockVariantRepo },
        { provide: getRepositoryToken(OrderTrackingEvent), useValue: mockTrackingRepo },
        { provide: AuditService, useValue: mockAuditService },
        { provide: RefundsService, useValue: mockRefundsService },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<SubstitutionsService>(SubstitutionsService);
  });

  describe('getCandidatesAndStatus()', () => {
    it('1. & 19. should return NO_SUBSTITUTION and empty candidates list when customer opted out (read-only)', async () => {
      mockOrderRepo.findOne.mockResolvedValue({
        id: 'ord-1',
        customerId: 'cust-1',
        items: [{ id: 'item-1', substitutionPreference: 'NO_SUBSTITUTION', variantId: 'v-1' }],
      });
      mockOrderItemRepo.findOne.mockResolvedValue({
        id: 'item-1',
        substitutionPreference: 'NO_SUBSTITUTION',
        variantId: 'v-1',
      });

      const result = await service.getCandidatesAndStatus('ord-1', 'item-1', 'cust-1');

      expect(result.preference).toBe('NO_SUBSTITUTION');
      expect(result.reasonCode).toBe('SUBSTITUTION_NOT_ALLOWED');
      expect(result.candidates).toEqual([]);
    });

    it('4. & 8. should isolate candidate query to the SAME darkstore fulfillment source', async () => {
      mockOrderRepo.findOne.mockResolvedValue({
        id: 'ord-1',
        customerId: 'cust-1',
        shopId: 'shop-active-101',
        items: [{ id: 'item-1', substitutionPreference: 'CONTACT_ME', fulfillmentSourceId: 'shop-active-101', variantId: 'v-orig', price: 3.99 }],
      });
      mockOrderItemRepo.findOne.mockResolvedValue({
        id: 'item-1',
        substitutionPreference: 'CONTACT_ME',
        fulfillmentSourceId: 'shop-active-101',
        variantId: 'v-orig',
        price: 3.99,
      });

      mockInventoryRepo.find.mockResolvedValue([
        { shopId: 'shop-active-101', variantId: 'v-sub-1', stockQuantity: 5, reservedQuantity: 0 },
      ]);

      mockProductRepositoryFind();

      const result = await service.getCandidatesAndStatus('ord-1', 'item-1', 'cust-1');

      expect(result.preference).toBe('CONTACT_ME');
      expect(result.candidates.length).toBeGreaterThan(0);
      expect(result.candidates[0].fulfillmentSourceId).toBe('shop-active-101');
    });

    it('9. should enforce customer IDOR protection when viewing candidates', async () => {
      mockOrderRepo.findOne.mockResolvedValue({
        id: 'ord-1',
        customerId: 'cust-owner',
        items: [{ id: 'item-1' }],
      });

      await expect(
        service.getCandidatesAndStatus('ord-1', 'item-1', 'cust-attacker'),
      ).rejects.toThrow();
    });
  });

  describe('proposeSubstitution()', () => {
    it('2. & 14. should create proposal with AWAITING_CUSTOMER status for CONTACT_ME preference', async () => {
      mockOrderRepo.findOne.mockResolvedValue({
        id: 'ord-1',
        customerId: 'cust-1',
        fulfillmentSourceId: 'shop-1',
        items: [{ id: 'item-1', substitutionPreference: 'CONTACT_ME', variantId: 'v-orig', price: 3.99 }],
      });

      mockInventoryRepo.findOne.mockResolvedValue({
        shopId: 'shop-1',
        variantId: 'v-sub-1',
        stockQuantity: 10,
        reservedQuantity: 0,
      });

      const res = await service.proposeSubstitution('ord-1', 'item-1', 'merchant-1', {
        substituteVariantId: 'v-sub-1',
      });

      expect(res.status).toBe('AWAITING_CUSTOMER');
      expect(mockTrackingRepo.save).toHaveBeenCalled();
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'SUBSTITUTION_PROPOSE' }),
      );
    });

    it('3. & 16. should require customer approval if substitute is higher-priced even under ALLOW_SUBSTITUTION', async () => {
      mockOrderRepo.findOne.mockResolvedValue({
        id: 'ord-1',
        customerId: 'cust-1',
        fulfillmentSourceId: 'shop-1',
        items: [{ id: 'item-1', substitutionPreference: 'ALLOW_SUBSTITUTION', variantId: 'v-orig', price: 1.99 }], // $1.99 orig vs $2.99 sub
      });

      mockInventoryRepo.findOne.mockResolvedValue({
        shopId: 'shop-1',
        variantId: 'v-sub-1',
        stockQuantity: 10,
        reservedQuantity: 0,
      });

      const res = await service.proposeSubstitution('ord-1', 'item-1', 'merchant-1', {
        substituteVariantId: 'v-sub-1',
      });

      expect(res.status).toBe('AWAITING_CUSTOMER'); // Must await customer approval due to higher price
    });
  });

  describe('approveSubstitution()', () => {
    it('12. & 17. should approve substitution, revalidate inventory, and issue refund if cheaper', async () => {
      const res = await service.approveSubstitution('cust-1', 'ord-1', 'item-1', 'sub-1');

      expect(res.status).toBe('APPROVED');
      expect(mockRefundsService.initiateRefund).toHaveBeenCalled();
    });
  });

  describe('rejectSubstitution()', () => {
    it('14. & 15. should reject substitution and log tracking event', async () => {
      mockOrderRepo.findOne.mockResolvedValue({ id: 'ord-1', customerId: 'cust-1' });
      mockSubRepo.findOne.mockResolvedValue({ id: 'sub-1', orderId: 'ord-1', orderItemId: 'item-1', status: 'AWAITING_CUSTOMER' });

      const res = await service.rejectSubstitution('cust-1', 'ord-1', 'item-1', 'sub-1');

      expect(res.status).toBe('REJECTED');
      expect(mockTrackingRepo.save).toHaveBeenCalled();
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'SUBSTITUTION_REJECT' }),
      );
    });
  });

  function mockProductRepositoryFind() {
    mockProductRepo.find.mockResolvedValue([
      { id: 'v-sub-1', title: 'Organic Spinach Substitute', isQuickCommerce: true } as any,
    ]);
  }
});
