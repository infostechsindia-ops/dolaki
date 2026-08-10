import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { FladoService, calculateCodFee, generateSecurePickupOtp, hashOtpSecret, sanitizeCsvField } from './flado.service';
import { DeliveryService, evaluateSchedule } from '../delivery/delivery.service';
import { AuditService } from '../audit/audit.service';
import {
  Darkstore,
  Product,
  Order,
  OrderItem,
  Inventory,
  FladoShop,
  ShopSubscription,
  ShopCredit,
  CreditTransaction,
  Rider,
  ShopHours,
  User,
  Address,
  Banner,
  Vendor,
  VendorStaff,
  VendorInvitation,
  VendorActivityLog,
  StockHistory,
  PriceHistory,
  Category,
  OrderTrackingEvent,
} from '../database/entities';

const mockRepo = () => ({
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn(),
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest
    .fn()
    .mockImplementation((entity) =>
      Promise.resolve({ id: 'mock-id', ...entity }),
    ),
  delete: jest.fn(),
  count: jest.fn().mockResolvedValue(0),
});

const mockDeliveryService = {
  evaluateServiceability: jest.fn(),
};

describe('FladoService', () => {
  let service: FladoService;

  beforeEach(async () => {
    jest.clearAllMocks();

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
        { provide: getRepositoryToken(Rider), useValue: mockRepo() },
        { provide: getRepositoryToken(ShopHours), useValue: mockRepo() },
        { provide: getRepositoryToken(User), useValue: mockRepo() },
        { provide: getRepositoryToken(Address), useValue: mockRepo() },
        { provide: getRepositoryToken(Banner), useValue: mockRepo() },
        { provide: getRepositoryToken(Vendor), useValue: mockRepo() },
        { provide: getRepositoryToken(VendorStaff), useValue: mockRepo() },
        { provide: getRepositoryToken(VendorInvitation), useValue: mockRepo() },
        { provide: getRepositoryToken(VendorActivityLog), useValue: mockRepo() },
        { provide: getRepositoryToken(StockHistory), useValue: mockRepo() },
        { provide: getRepositoryToken(PriceHistory), useValue: mockRepo() },
        { provide: getRepositoryToken(Category), useValue: mockRepo() },
        { provide: getRepositoryToken(OrderTrackingEvent), useValue: mockRepo() },
        { provide: AuditService, useValue: { log: jest.fn() } },
        { provide: DeliveryService, useValue: mockDeliveryService },
      ],
    }).compile();

    service = module.get<FladoService>(FladoService);
  });

  describe('CMD-083 to CMD-091 Quick-Commerce Merchant, Picking, Handoff, Reports & Staff Tests', () => {
    const mockShop: any = {
      id: 'shop-flado-001',
      name: 'AuraMart Heritage Darkstore 01',
      ownerUserId: 'merchant-owner-101',
      vendorId: 'vendor-101',
      approvalStatus: 'APPROVED',
      isOpen: true,
      deliveryRadiusKm: 3.0,
      deliveryFeeType: 'FREE',
      deliveryFeeAmount: 0,
      createdAt: new Date(),
    };

    test('1. Cross-darkstore denial: staff assigned to Store A cannot access Store B (throws ForbiddenException)', async () => {
      const shopRepo = service['shopRepository'];
      jest.spyOn(shopRepo, 'findOne').mockResolvedValue(mockShop);

      const staffRepo = service['staffRepository'];
      jest.spyOn(staffRepo, 'findOne').mockResolvedValue({
        id: 'staff-1',
        vendorId: 'vendor-101',
        userId: 'fulfillment-user-99',
        vendorRole: 'FULFILLMENT_STAFF',
        status: 'ACTIVE',
        assignedShopIdsJson: JSON.stringify(['shop-flado-002']), // Assigned to store 2, not store 1!
      } as any);

      await expect(
        service.verifyShopOperatorPermission('shop-flado-001', 'fulfillment-user-99'),
      ).rejects.toThrow(ForbiddenException);
    });

    test('2. Role matrix restriction: FULFILLMENT_STAFF blocked from MANAGER/OWNER operations (throws ForbiddenException)', async () => {
      const shopRepo = service['shopRepository'];
      jest.spyOn(shopRepo, 'findOne').mockResolvedValue(mockShop);

      const staffRepo = service['staffRepository'];
      jest.spyOn(staffRepo, 'findOne').mockResolvedValue({
        id: 'staff-1',
        vendorId: 'vendor-101',
        userId: 'fulfillment-user-99',
        vendorRole: 'FULFILLMENT_STAFF',
        status: 'ACTIVE',
        assignedShopIdsJson: JSON.stringify(['shop-flado-001']),
      } as any);

      await expect(
        service.verifyShopOperatorPermission('shop-flado-001', 'fulfillment-user-99', 'MANAGER'),
      ).rejects.toThrow(ForbiddenException);
    });

    test('3. Immediate access revocation: INACTIVE staff is denied access on next call (throws ForbiddenException)', async () => {
      const shopRepo = service['shopRepository'];
      jest.spyOn(shopRepo, 'findOne').mockResolvedValue(mockShop);

      const staffRepo = service['staffRepository'];
      jest.spyOn(staffRepo, 'findOne').mockResolvedValue(null); // No active staff found!

      await expect(
        service.verifyShopOperatorPermission('shop-flado-001', 'deactivated-user-5', 'FULFILLMENT_STAFF'),
      ).rejects.toThrow(ForbiddenException);
    });

    test('4. Last-owner protection: Demoting last darkstore owner throws BadRequestException', async () => {
      const shopRepo = service['shopRepository'];
      jest.spyOn(shopRepo, 'findOne').mockResolvedValue(mockShop);

      const staffRepo = service['staffRepository'];
      const mockStaff = {
        id: 'staff-owner-1',
        vendorId: 'vendor-101',
        userId: 'owner-user-1',
        vendorRole: 'OWNER',
        status: 'ACTIVE',
      };
      jest.spyOn(staffRepo, 'findOne').mockResolvedValue(mockStaff as any);
      jest.spyOn(staffRepo, 'find').mockResolvedValue([mockStaff] as any);

      await expect(
        service.updateStaffRoleOrStatus('shop-flado-001', 'staff-owner-1', { vendorRole: 'FULFILLMENT_STAFF' }, 'merchant-owner-101'),
      ).rejects.toThrow(BadRequestException);
    });

    test('5. Multi-store assignment updates assignedShopIdsJson and logs DARKSTORE_STAFF_ASSIGNED', async () => {
      const shopRepo = service['shopRepository'];
      jest.spyOn(shopRepo, 'findOne').mockResolvedValue(mockShop);

      const staffRepo = service['staffRepository'];
      const mockStaff = {
        id: 'staff-1',
        vendorId: 'vendor-101',
        userId: 'staff-user-1',
        email: 'staff@auramart.com',
        vendorRole: 'FULFILLMENT_STAFF',
        status: 'ACTIVE',
        assignedShopIdsJson: JSON.stringify(['shop-flado-001']),
      };
      jest.spyOn(staffRepo, 'findOne').mockResolvedValue(mockStaff as any);
      jest.spyOn(staffRepo, 'save').mockImplementation((entity: any) => Promise.resolve(entity));
      jest.spyOn(staffRepo, 'find').mockResolvedValue([mockStaff] as any);

      const activityRepo = service['activityRepository'];

      const res = await service.assignStaffToDarkstore('shop-flado-001', 'staff-1', 'shop-flado-002', 'merchant-owner-101');

      expect(activityRepo.save).toHaveBeenCalled();
      expect(mockStaff.assignedShopIdsJson).toContain('shop-flado-002');
    });
  });
});
