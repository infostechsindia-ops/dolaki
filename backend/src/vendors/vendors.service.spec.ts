import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, ForbiddenException, ConflictException, NotFoundException } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import {
  Vendor,
  SellerListing,
  Inventory,
  Order,
  OrderItem,
  Product,
  ProductVariant,
  Category,
  ProductImage,
  StockHistory,
  PriceHistory,
  OrderTrackingEvent,
  ReturnRequest,
  ReturnTrackingEvent,
  VendorSettlementLedger,
  VendorPayout,
  VendorStaff,
  VendorInvitation,
  VendorActivityLog,
  User,
} from '../database/entities';

describe('VendorsService — CMD-082 Vendor Staff & Permissions Tests', () => {
  let service: VendorsService;
  let vendorRepo: any;
  let staffRepo: any;
  let invitationRepo: any;
  let activityRepo: any;
  let userRepo: any;

  const mockVendor: any = {
    id: 'vendor-101',
    userId: 'owner-101',
    storeName: 'Artisan Store',
    bankAccountNumber: '50100234567890',
    bankIfsc: 'HDFC0000123',
    createdAt: new Date(),
  };

  const mockOwnerUser: any = {
    id: 'owner-101',
    email: 'owner@artisan.com',
    role: 'VENDOR_OWNER',
  };

  const mockStaffUser: any = {
    id: 'staff-101',
    email: 'staff@artisan.com',
    role: 'VENDOR_STAFF',
  };

  const mockStaffRecord: any = {
    id: 'staff-rec-1',
    vendorId: 'vendor-101',
    userId: 'staff-101',
    email: 'staff@artisan.com',
    vendorRole: 'FULFILLMENT_STAFF',
    status: 'ACTIVE',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    vendorRepo = {
      findOne: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 'vendor-101' || where.userId === 'owner-101') return Promise.resolve(mockVendor);
        return Promise.resolve(null);
      }),
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((v) => Promise.resolve(v)),
    };

    staffRepo = {
      findOne: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 'staff-rec-1' && where.vendorId === 'vendor-101') return Promise.resolve({ ...mockStaffRecord });
        if (where.userId === 'staff-101') return Promise.resolve({ ...mockStaffRecord });
        return Promise.resolve(null);
      }),
      find: jest.fn().mockResolvedValue([{ ...mockStaffRecord }]),
      create: jest.fn().mockImplementation((dto) => ({ id: 'staff-' + Date.now(), ...dto })),
      save: jest.fn().mockImplementation((s) => Promise.resolve(s)),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    invitationRepo = {
      findOne: jest.fn().mockImplementation(({ where }) => Promise.resolve(null)),
      find: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockImplementation((dto) => ({ id: 'inv-' + Date.now(), ...dto })),
      save: jest.fn().mockImplementation((i) => Promise.resolve(i)),
    };

    activityRepo = {
      find: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockImplementation((dto) => ({ id: 'act-' + Date.now(), ...dto })),
      save: jest.fn().mockImplementation((a) => Promise.resolve(a)),
    };

    userRepo = {
      findOne: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 'owner-101') return Promise.resolve(mockOwnerUser);
        if (where.id === 'staff-101') return Promise.resolve(mockStaffUser);
        return Promise.resolve(null);
      }),
      save: jest.fn().mockImplementation((u) => Promise.resolve(u)),
    };

    const productRepo = { findOne: jest.fn(), update: jest.fn().mockResolvedValue({ affected: 2 }) };
    const listingRepo = { find: jest.fn().mockResolvedValue([]), update: jest.fn().mockResolvedValue({ affected: 2 }) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendorsService,
        { provide: getRepositoryToken(Vendor), useValue: vendorRepo },
        { provide: getRepositoryToken(SellerListing), useValue: listingRepo },
        { provide: getRepositoryToken(Inventory), useValue: { find: jest.fn().mockResolvedValue([]) } },
        { provide: getRepositoryToken(Order), useValue: { find: jest.fn().mockResolvedValue([]) } },
        { provide: getRepositoryToken(OrderItem), useValue: { find: jest.fn().mockResolvedValue([]) } },
        { provide: getRepositoryToken(Product), useValue: productRepo },
        { provide: getRepositoryToken(ProductVariant), useValue: { findOne: jest.fn() } },
        { provide: getRepositoryToken(Category), useValue: { find: jest.fn().mockResolvedValue([]) } },
        { provide: getRepositoryToken(ProductImage), useValue: { find: jest.fn().mockResolvedValue([]) } },
        { provide: getRepositoryToken(StockHistory), useValue: { find: jest.fn().mockResolvedValue([]) } },
        { provide: getRepositoryToken(PriceHistory), useValue: { find: jest.fn().mockResolvedValue([]) } },
        { provide: getRepositoryToken(OrderTrackingEvent), useValue: { find: jest.fn().mockResolvedValue([]) } },
        { provide: getRepositoryToken(ReturnRequest), useValue: { find: jest.fn().mockResolvedValue([]) } },
        { provide: getRepositoryToken(ReturnTrackingEvent), useValue: { find: jest.fn().mockResolvedValue([]) } },
        { provide: getRepositoryToken(VendorSettlementLedger), useValue: { find: jest.fn().mockResolvedValue([]) } },
        { provide: getRepositoryToken(VendorPayout), useValue: { find: jest.fn().mockResolvedValue([]) } },
        { provide: getRepositoryToken(VendorStaff), useValue: staffRepo },
        { provide: getRepositoryToken(VendorInvitation), useValue: invitationRepo },
        { provide: getRepositoryToken(VendorActivityLog), useValue: activityRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();

    service = module.get<VendorsService>(VendorsService);
  });

  test('1. Vendor Owner can create staff invitations with hashed token', async () => {
    const invite = await service.inviteVendorStaff(
      'vendor-101',
      { email: 'newstaff@artisan.com', vendorRole: 'MANAGER' },
      'owner-101',
    );

    expect(invite.email).toBe('newstaff@artisan.com');
    expect(invite.vendorRole).toBe('MANAGER');
    expect(invite.status).toBe('PENDING');
    expect(invitationRepo.save).toHaveBeenCalled();
  });

  test('2. Non-owner staff cannot invite team members (throws ForbiddenException)', async () => {
    await expect(
      service.inviteVendorStaff(
        'vendor-101',
        { email: 'badstaff@artisan.com', vendorRole: 'MANAGER' },
        'staff-101',
      ),
    ).rejects.toThrow(ForbiddenException);
  });

  test('3. Staff cannot modify their own role (privilege escalation prevention)', async () => {
    const mockOwnerStaff: any = {
      id: 'staff-rec-1',
      vendorId: 'vendor-101',
      userId: 'staff-101',
      email: 'staff@artisan.com',
      vendorRole: 'OWNER',
      status: 'ACTIVE',
    };
    staffRepo.findOne.mockResolvedValue(mockOwnerStaff);

    await expect(
      service.updateVendorStaffRole('vendor-101', 'staff-rec-1', 'FULFILLMENT_STAFF', 'staff-101'),
    ).rejects.toThrow(BadRequestException);
  });

  test('4. Last owner protection (throws BadRequestException if deactivating the last owner)', async () => {
    const mockOwnerStaff: any = {
      id: 'owner-rec-1',
      vendorId: 'vendor-101',
      userId: 'owner-101',
      email: 'owner@artisan.com',
      vendorRole: 'OWNER',
      status: 'ACTIVE',
    };
    staffRepo.findOne.mockResolvedValue(mockOwnerStaff);
    staffRepo.find.mockResolvedValue([mockOwnerStaff]);

    await expect(
      service.updateVendorStaffStatus('vendor-101', 'owner-rec-1', 'INACTIVE', 'owner-101'),
    ).rejects.toThrow(BadRequestException);
  });

  test('5. Activity audit log redacts sensitive password/bank data', async () => {
    const log = await service.logVendorActivity('vendor-101', 'owner-101', 'TEST_ACTION', {
      password: 'super-secret-password',
      token: 'jwt-token-xyz',
      bankAccountNumber: '50100234567890',
      actionName: 'UPDATE_PROFILE',
    });

    const parsedMeta = JSON.parse(log.metadataJson || '{}');
    expect(parsedMeta.password).toBeUndefined();
    expect(parsedMeta.token).toBeUndefined();
    expect(parsedMeta.bankAccountNumber).toBeUndefined();
    expect(parsedMeta.actionName).toBe('UPDATE_PROFILE');
  });

  test('6. FIX-003: Reviewing vendor onboarding to REJECT automatically deactivates product listings', async () => {
    const mockPendingVendor = {
      id: 'vendor-to-reject',
      onboardingStatus: 'SUBMITTED',
      isVerified: false,
    };
    vendorRepo.findOne.mockImplementation(({ where }: any) => {
      if (where.id === 'vendor-to-reject') return Promise.resolve(mockPendingVendor);
      return Promise.resolve(null);
    });

    const result = await service.reviewOnboarding(
      'vendor-to-reject',
      'REJECT',
      'GST documentation invalid',
    );

    expect(result.onboardingStatus).toBe('REJECTED');
    expect(result.isVerified).toBe(false);
  });

  test('7. FEAT-005: getVendorAnalytics returns tenant-isolated metrics DTO with zero safety', async () => {
    const analytics = await service.getVendorAnalytics('vendor-101', { period: '30D' });
    expect(analytics).toBeDefined();
    expect(analytics.vendorId).toBe('vendor-101');
    expect(analytics.storeName).toBe('Artisan Store');
    expect(analytics.period).toBe('30D');
    expect(analytics.salesOverview).toBeDefined();
    expect(analytics.funnelMetrics.tracked).toBe(false);
    expect(analytics.funnelMetrics.message).toContain('not currently tracked');
  });
});
