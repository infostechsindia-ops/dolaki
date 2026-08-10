import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard, ShopOwnerGuard, RiderShopGuard, Public } from './guards';
import { Role } from './roles';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FladoShop, Rider, VendorStaff } from '../database/entities';

// ─── Test Helpers ─────────────────────────────────────────────────────────────

function makeExecutionContext(overrides: {
  user?: any;
  roles?: Role[];
  params?: Record<string, string>;
  isPublic?: boolean;
}): ExecutionContext {
  const reflector = {
    getAllAndOverride: jest.fn((key: string) => {
      if (key === 'isPublic') return overrides.isPublic ?? false;
      if (key === 'roles') return overrides.roles ?? null;
      return null;
    }),
  };

  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({
        user: overrides.user ?? null,
        params: overrides.params ?? {},
      }),
    }),
  } as unknown as ExecutionContext;
}

// ─── RolesGuard Tests ─────────────────────────────────────────────────────────

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesGuard, Reflector],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should allow when no roles are required', () => {
    const context = makeExecutionContext({
      user: { userId: 'u1', role: Role.CUSTOMER },
      roles: [],
    });
    // Override reflector
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow when user role matches required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.SUPER_ADMIN]);
    const context = makeExecutionContext({
      user: { userId: 'u1', role: Role.SUPER_ADMIN },
    });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException when user role does not match', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.SUPER_ADMIN]);
    const context = makeExecutionContext({
      user: { userId: 'u1', role: Role.CUSTOMER },
    });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should throw UnauthorizedException when no user on request', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.CUSTOMER]);
    const context = makeExecutionContext({ user: null, roles: [Role.CUSTOMER] });
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should allow MERCHANT_OWNER when MERCHANT_OWNER is in required roles', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.MERCHANT_OWNER, Role.SUPER_ADMIN]);
    const context = makeExecutionContext({
      user: { userId: 'u1', role: Role.MERCHANT_OWNER },
    });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny CUSTOMER attempting merchant endpoint', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.MERCHANT_OWNER, Role.SUPER_ADMIN]);
    const context = makeExecutionContext({
      user: { userId: 'u1', role: Role.CUSTOMER },
    });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});

// ─── ShopOwnerGuard Tests ─────────────────────────────────────────────────────

describe('ShopOwnerGuard', () => {
  let guard: ShopOwnerGuard;
  let shopRepo: any;

  const mockShop = { id: 'shop-1', ownerUserId: 'owner-user-1' };

  beforeEach(async () => {
    shopRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShopOwnerGuard,
        Reflector,
        {
          provide: getRepositoryToken(FladoShop),
          useValue: shopRepo,
        },
        {
          provide: getRepositoryToken(VendorStaff),
          useValue: { findOne: jest.fn() },
        },
      ],
    }).compile();

    guard = module.get<ShopOwnerGuard>(ShopOwnerGuard);
  });

  it('should allow SUPER_ADMIN to bypass ownership check', async () => {
    const context = makeExecutionContext({
      user: { userId: 'admin-id', role: Role.SUPER_ADMIN },
      params: { shopId: 'shop-1' },
    });
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    // Shop repo should NOT be called (SUPER_ADMIN bypasses lookup)
    expect(shopRepo.findOne).not.toHaveBeenCalled();
  });

  it('should allow shop owner to manage their own shop', async () => {
    shopRepo.findOne.mockResolvedValue(mockShop);
    const context = makeExecutionContext({
      user: { userId: 'owner-user-1', role: Role.MERCHANT_OWNER },
      params: { shopId: 'shop-1' },
    });
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should deny different user from managing the shop', async () => {
    shopRepo.findOne.mockResolvedValue(mockShop);
    const context = makeExecutionContext({
      user: { userId: 'intruder-user', role: Role.MERCHANT_OWNER },
      params: { shopId: 'shop-1' },
    });
    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('should deny if shop ownerUserId is null (fail closed)', async () => {
    shopRepo.findOne.mockResolvedValue({ id: 'shop-1', ownerUserId: null });
    const context = makeExecutionContext({
      user: { userId: 'any-user', role: Role.MERCHANT_OWNER },
      params: { shopId: 'shop-1' },
    });
    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('should throw NotFoundException if shop does not exist', async () => {
    shopRepo.findOne.mockResolvedValue(null);
    const context = makeExecutionContext({
      user: { userId: 'any-user', role: Role.MERCHANT_OWNER },
      params: { shopId: 'nonexistent' },
    });
    await expect(guard.canActivate(context)).rejects.toThrow(NotFoundException);
  });

  it('should throw UnauthorizedException if no user on request', async () => {
    const context = makeExecutionContext({ user: null, params: { shopId: 'shop-1' } });
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });
});

// ─── RiderShopGuard Tests ─────────────────────────────────────────────────────

describe('RiderShopGuard', () => {
  let guard: RiderShopGuard;
  let riderRepo: any;
  let shopRepo: any;

  beforeEach(async () => {
    riderRepo = { findOne: jest.fn() };
    shopRepo = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RiderShopGuard,
        Reflector,
        { provide: getRepositoryToken(Rider), useValue: riderRepo },
        { provide: getRepositoryToken(FladoShop), useValue: shopRepo },
      ],
    }).compile();

    guard = module.get<RiderShopGuard>(RiderShopGuard);
  });

  it('should allow SUPER_ADMIN bypass', async () => {
    const context = makeExecutionContext({
      user: { userId: 'admin', role: Role.SUPER_ADMIN },
      params: { id: 'rider-1' },
    });
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    expect(riderRepo.findOne).not.toHaveBeenCalled();
  });

  it('should allow shop owner to manage their rider', async () => {
    riderRepo.findOne.mockResolvedValue({ id: 'rider-1', shopId: 'shop-1' });
    shopRepo.findOne.mockResolvedValue({ id: 'shop-1', ownerUserId: 'owner-1' });
    const context = makeExecutionContext({
      user: { userId: 'owner-1', role: Role.MERCHANT_OWNER },
      params: { id: 'rider-1' },
    });
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should deny cross-shop rider management', async () => {
    riderRepo.findOne.mockResolvedValue({ id: 'rider-1', shopId: 'shop-other' });
    shopRepo.findOne.mockResolvedValue({ id: 'shop-other', ownerUserId: 'owner-2' });
    const context = makeExecutionContext({
      user: { userId: 'owner-1', role: Role.MERCHANT_OWNER },
      params: { id: 'rider-1' },
    });
    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('should deny if rider not found', async () => {
    riderRepo.findOne.mockResolvedValue(null);
    const context = makeExecutionContext({
      user: { userId: 'owner-1', role: Role.MERCHANT_OWNER },
      params: { id: 'nonexistent' },
    });
    await expect(guard.canActivate(context)).rejects.toThrow(NotFoundException);
  });

  it('should deny if shop ownerUserId is null (fail closed)', async () => {
    riderRepo.findOne.mockResolvedValue({ id: 'rider-1', shopId: 'shop-1' });
    shopRepo.findOne.mockResolvedValue({ id: 'shop-1', ownerUserId: null });
    const context = makeExecutionContext({
      user: { userId: 'anyone', role: Role.MERCHANT_OWNER },
      params: { id: 'rider-1' },
    });
    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });
});
