import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeliveryService } from './delivery.service';
import { ProductVariant, Product, Inventory, FladoShop, Order } from '../database/entities';
import { DeliverySurface } from './dto/serviceability-query.dto';

import { EtaService } from './eta.service';

describe('DeliveryService', () => {
  let service: DeliveryService;

  const mockVariantRepo = { findOne: jest.fn() };
  const mockProductRepo = { findOne: jest.fn() };
  const mockInventoryRepo = { find: jest.fn() };
  const mockShopRepo = { find: jest.fn(), findOne: jest.fn() };
  const mockOrderRepo = { find: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryService,
        EtaService,
        { provide: getRepositoryToken(ProductVariant), useValue: mockVariantRepo },
        { provide: getRepositoryToken(Product), useValue: mockProductRepo },
        { provide: getRepositoryToken(Inventory), useValue: mockInventoryRepo },
        { provide: getRepositoryToken(FladoShop), useValue: mockShopRepo },
        { provide: getRepositoryToken(Order), useValue: mockOrderRepo },
      ],
    }).compile();

    service = module.get<DeliveryService>(DeliveryService);

    // Default mock behavior
    mockOrderRepo.find.mockResolvedValue([]);
  });

  describe('Malformed / Invalid Identifiers', () => {
    it('should return unserviceable result with reasonCode OUT_OF_STOCK when variant/product ID does not exist', async () => {
      mockVariantRepo.findOne.mockResolvedValue(null);
      mockProductRepo.findOne.mockResolvedValue(null);

      const result = await service.evaluateServiceability({
        variantId: 'non-existent-id',
        surface: DeliverySurface.MARKETPLACE,
        pincode: '400001',
      });

      expect(result.isServiceable).toBe(false);
      expect(result.status).toBe('UNSERVICEABLE');
      expect(result.reasonCode).toBe('OUT_OF_STOCK');
    });
  });

  describe('Marketplace Serviceability', () => {
    it('should return INSUFFICIENT_STOCK when requested quantity exceeds available stock', async () => {
      mockVariantRepo.findOne.mockResolvedValue({ id: 'v-1', sku: 'SKU-1' });
      mockInventoryRepo.find.mockResolvedValue([
        { variantId: 'v-1', stockQuantity: 5, reservedQuantity: 3 }, // 2 available
      ]);

      const result = await service.evaluateServiceability({
        variantId: 'v-1',
        surface: DeliverySurface.MARKETPLACE,
        quantity: 5,
        pincode: '400001',
      });

      expect(result.isServiceable).toBe(false);
      expect(result.reasonCode).toBe('INSUFFICIENT_STOCK');
    });

    it('should return LOCATION_REQUIRED when pincode/coords missing', async () => {
      mockVariantRepo.findOne.mockResolvedValue({ id: 'v-1', sku: 'SKU-1' });
      mockInventoryRepo.find.mockResolvedValue([
        { variantId: 'v-1', stockQuantity: 10, reservedQuantity: 0 },
      ]);

      const result = await service.evaluateServiceability({
        variantId: 'v-1',
        surface: DeliverySurface.MARKETPLACE,
        quantity: 1,
      });

      expect(result.isServiceable).toBe(false);
      expect(result.reasonCode).toBe('LOCATION_REQUIRED');
    });
  });

  describe('Flado Quick-Commerce Candidate Selection & Reason Codes', () => {
    it('should return LOCATION_REQUIRED when coordinates & shopId are missing', async () => {
      mockVariantRepo.findOne.mockResolvedValue({ id: 'v-1', sku: 'SKU-1' });

      const result = await service.evaluateServiceability({
        variantId: 'v-1',
        surface: DeliverySurface.QUICK_COMMERCE,
      });

      expect(result.isServiceable).toBe(false);
      expect(result.reasonCode).toBe('LOCATION_REQUIRED');
    });

    it('should return OUTSIDE_SERVICE_AREA when customer is outside radius', async () => {
      mockVariantRepo.findOne.mockResolvedValue({ id: 'v-1', sku: 'SKU-1' });
      mockShopRepo.find.mockResolvedValue([
        { id: 'shop-1', shopName: 'Far Store', lat: 19.0, lng: 72.0, deliveryRadiusKm: 5, isOpen: true, approvalStatus: 'APPROVED' },
      ]);

      const result = await service.evaluateServiceability({
        variantId: 'v-1',
        surface: DeliverySurface.QUICK_COMMERCE,
        latitude: 25.0,
        longitude: 80.0,
      });

      expect(result.isServiceable).toBe(false);
      expect(result.reasonCode).toBe('OUTSIDE_SERVICE_AREA');
    });

    it('should return STORE_NOT_APPROVED when shop is pending approval', async () => {
      mockVariantRepo.findOne.mockResolvedValue({ id: 'v-1', sku: 'SKU-1' });
      mockShopRepo.find.mockResolvedValue([
        { id: 'shop-1', shopName: 'Pending Shop', lat: 19.0, lng: 72.0, deliveryRadiusKm: 10, isOpen: true, approvalStatus: 'PENDING' },
      ]);

      const result = await service.evaluateServiceability({
        variantId: 'v-1',
        surface: DeliverySurface.QUICK_COMMERCE,
        latitude: 19.01,
        longitude: 72.01,
      });

      expect(result.isServiceable).toBe(false);
      expect(result.reasonCode).toBe('STORE_NOT_APPROVED');
    });

    it('should return STORE_CLOSED with nextOpeningText when store is closed by schedule', async () => {
      mockVariantRepo.findOne.mockResolvedValue({ id: 'v-1', sku: 'SKU-1' });
      const closedSchedule = JSON.stringify({ mon: { open: '08:00', close: '22:00' } });
      mockShopRepo.find.mockResolvedValue([
        { id: 'shop-1', shopName: 'Night Closed Shop', lat: 19.0, lng: 72.0, deliveryRadiusKm: 10, isOpen: false, approvalStatus: 'APPROVED', operatingHoursJson: closedSchedule },
      ]);

      const result = await service.evaluateServiceability({
        variantId: 'v-1',
        surface: DeliverySurface.QUICK_COMMERCE,
        latitude: 19.01,
        longitude: 72.01,
      });

      expect(result.isServiceable).toBe(false);
      expect(result.reasonCode).toBe('STORE_CLOSED');
    });

    it('should return AT_CAPACITY when active order count reaches maxActiveOrders', async () => {
      mockVariantRepo.findOne.mockResolvedValue({ id: 'v-1', sku: 'SKU-1' });
      mockShopRepo.find.mockResolvedValue([
        { id: 'shop-busy', shopName: 'Busy Shop', lat: 19.0, lng: 72.0, deliveryRadiusKm: 10, isOpen: true, approvalStatus: 'APPROVED', maxActiveOrders: 2 },
      ]);
      mockOrderRepo.find.mockResolvedValue([
        { id: 'ord-1', status: 'PREPARING' },
        { id: 'ord-2', status: 'RIDER_ASSIGNED' },
      ]);

      const result = await service.evaluateServiceability({
        variantId: 'v-1',
        surface: DeliverySurface.QUICK_COMMERCE,
        latitude: 19.01,
        longitude: 72.01,
      });

      expect(result.isServiceable).toBe(false);
      expect(result.reasonCode).toBe('AT_CAPACITY');
    });

    it('should select the 2nd closest store if 1st store is out of stock', async () => {
      mockVariantRepo.findOne.mockResolvedValue({ id: 'v-1', sku: 'SKU-1' });
      mockShopRepo.find.mockResolvedValue([
        { id: 'shop-close-empty', shopName: 'Close Empty Shop', lat: 19.01, lng: 72.01, deliveryRadiusKm: 10, isOpen: true, approvalStatus: 'APPROVED', deliveryFeeType: 'FREE' },
        { id: 'shop-far-stocked', shopName: 'Far Stocked Shop', lat: 19.05, lng: 72.05, deliveryRadiusKm: 10, isOpen: true, approvalStatus: 'APPROVED', deliveryFeeType: 'FREE' },
      ]);
      mockInventoryRepo.find.mockImplementation((query) => {
        if (query.where.shopId === 'shop-close-empty') return Promise.resolve([{ variantId: 'v-1', stockQuantity: 0, reservedQuantity: 0 }]);
        if (query.where.shopId === 'shop-far-stocked') return Promise.resolve([{ variantId: 'v-1', stockQuantity: 50, reservedQuantity: 0 }]);
        return Promise.resolve([]);
      });

      const result = await service.evaluateServiceability({
        variantId: 'v-1',
        surface: DeliverySurface.QUICK_COMMERCE,
        latitude: 19.0,
        longitude: 72.0,
      });

      expect(result.isServiceable).toBe(true);
      expect(result.reasonCode).toBe('SERVICEABLE');
      expect(result.fulfillmentSourceId).toBe('shop-far-stocked');
      expect(result.fulfillmentSourceName).toBe('Far Stocked Shop');
    });
  });

  describe('Explicit shopId Trust-Boundary & Geofence Radius Enforcement', () => {
    it('A. should allow explicit shopId when inside delivery radius', async () => {
      mockVariantRepo.findOne.mockResolvedValue({ id: 'v-1', sku: 'SKU-1' });
      mockShopRepo.findOne.mockResolvedValue({
        id: 'shop-in-radius',
        shopName: 'In-Radius Shop',
        lat: 19.01,
        lng: 72.01,
        deliveryRadiusKm: 5,
        isOpen: true,
        approvalStatus: 'APPROVED',
        deliveryFeeType: 'FREE',
      });
      mockInventoryRepo.find.mockResolvedValue([
        { variantId: 'v-1', stockQuantity: 10, reservedQuantity: 0 },
      ]);

      const result = await service.evaluateServiceability({
        variantId: 'v-1',
        surface: DeliverySurface.QUICK_COMMERCE,
        latitude: 19.0,
        longitude: 72.0,
        shopId: 'shop-in-radius',
      });

      expect(result.isServiceable).toBe(true);
      expect(result.reasonCode).toBe('SERVICEABLE');
      expect(result.fulfillmentSourceId).toBe('shop-in-radius');
    });

    it('B. & C. should reject explicit shopId with OUTSIDE_SERVICE_AREA when outside delivery radius', async () => {
      mockVariantRepo.findOne.mockResolvedValue({ id: 'v-1', sku: 'SKU-1' });
      mockShopRepo.findOne.mockResolvedValue({
        id: 'shop-distant',
        shopName: 'Distant Shop',
        lat: 25.0, // ~600 km away
        lng: 80.0,
        deliveryRadiusKm: 5,
        isOpen: true,
        approvalStatus: 'APPROVED',
      });
      mockInventoryRepo.find.mockResolvedValue([
        { variantId: 'v-1', stockQuantity: 100, reservedQuantity: 0 },
      ]);

      const result = await service.evaluateServiceability({
        variantId: 'v-1',
        surface: DeliverySurface.QUICK_COMMERCE,
        latitude: 19.0,
        longitude: 72.0,
        shopId: 'shop-distant',
      });

      expect(result.isServiceable).toBe(false);
      expect(result.reasonCode).toBe('OUTSIDE_SERVICE_AREA');
    });

    it('D. explicit closed shop should remain STORE_CLOSED even if shopId is provided', async () => {
      mockVariantRepo.findOne.mockResolvedValue({ id: 'v-1', sku: 'SKU-1' });
      mockShopRepo.findOne.mockResolvedValue({
        id: 'shop-closed-explicit',
        shopName: 'Explicit Closed Shop',
        lat: 19.01,
        lng: 72.01,
        deliveryRadiusKm: 5,
        isOpen: false,
        approvalStatus: 'APPROVED',
      });

      const result = await service.evaluateServiceability({
        variantId: 'v-1',
        surface: DeliverySurface.QUICK_COMMERCE,
        latitude: 19.0,
        longitude: 72.0,
        shopId: 'shop-closed-explicit',
      });

      expect(result.isServiceable).toBe(false);
      expect(result.reasonCode).toBe('STORE_CLOSED');
    });

    it('E. explicit at-capacity shop should remain AT_CAPACITY even if shopId is provided', async () => {
      mockVariantRepo.findOne.mockResolvedValue({ id: 'v-1', sku: 'SKU-1' });
      mockShopRepo.findOne.mockResolvedValue({
        id: 'shop-busy-explicit',
        shopName: 'Explicit Busy Shop',
        lat: 19.01,
        lng: 72.01,
        deliveryRadiusKm: 5,
        isOpen: true,
        approvalStatus: 'APPROVED',
        maxActiveOrders: 1,
      });
      mockOrderRepo.find.mockResolvedValue([{ id: 'ord-1', status: 'PREPARING' }]);

      const result = await service.evaluateServiceability({
        variantId: 'v-1',
        surface: DeliverySurface.QUICK_COMMERCE,
        latitude: 19.0,
        longitude: 72.0,
        shopId: 'shop-busy-explicit',
      });

      expect(result.isServiceable).toBe(false);
      expect(result.reasonCode).toBe('AT_CAPACITY');
    });

    it('F. explicit insufficient-stock shop should remain INSUFFICIENT_STOCK even if shopId is provided', async () => {
      mockVariantRepo.findOne.mockResolvedValue({ id: 'v-1', sku: 'SKU-1' });
      mockShopRepo.findOne.mockResolvedValue({
        id: 'shop-low-stock',
        shopName: 'Low Stock Shop',
        lat: 19.01,
        lng: 72.01,
        deliveryRadiusKm: 5,
        isOpen: true,
        approvalStatus: 'APPROVED',
      });
      mockInventoryRepo.find.mockResolvedValue([
        { variantId: 'v-1', stockQuantity: 2, reservedQuantity: 0 },
      ]);

      const result = await service.evaluateServiceability({
        variantId: 'v-1',
        surface: DeliverySurface.QUICK_COMMERCE,
        quantity: 5,
        latitude: 19.0,
        longitude: 72.0,
        shopId: 'shop-low-stock',
      });

      expect(result.isServiceable).toBe(false);
      expect(result.reasonCode).toBe('INSUFFICIENT_STOCK');
    });

    it('G. explicit unapproved shop should remain STORE_NOT_APPROVED even if shopId is provided', async () => {
      mockVariantRepo.findOne.mockResolvedValue({ id: 'v-1', sku: 'SKU-1' });
      mockShopRepo.findOne.mockResolvedValue({
        id: 'shop-unapproved',
        shopName: 'Unapproved Shop',
        lat: 19.01,
        lng: 72.01,
        deliveryRadiusKm: 5,
        isOpen: true,
        approvalStatus: 'PENDING',
      });

      const result = await service.evaluateServiceability({
        variantId: 'v-1',
        surface: DeliverySurface.QUICK_COMMERCE,
        latitude: 19.0,
        longitude: 72.0,
        shopId: 'shop-unapproved',
      });

      expect(result.isServiceable).toBe(false);
      expect(result.reasonCode).toBe('STORE_NOT_APPROVED');
    });
  });
});


