import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  InventoryLocation,
  InventoryBalance,
  SellerListing,
  ProductVariant,
  Vendor,
  FladoShop,
  AuditLog,
  Inventory,
  InventoryReservation,
  InventoryReservationItem,
} from '../database/entities';
import { AuditService } from '../audit/audit.service';
import { Role } from '../auth/roles';
import * as crypto from 'crypto';

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type:
    | 'VENDOR_WAREHOUSE'
    | 'MARKETPLACE_WAREHOUSE'
    | 'FULFILLMENT_CENTER'
    | 'MERCHANT_SHOP'
    | 'DARK_STORE'
    | 'RETAIL_STORE';

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsNumber()
  @IsOptional()
  lat?: number;

  @IsNumber()
  @IsOptional()
  lng?: number;

  @IsBoolean()
  @IsOptional()
  isMarketplace?: boolean;

  @IsBoolean()
  @IsOptional()
  isQuickCommerce?: boolean;

  @IsBoolean()
  @IsOptional()
  isFulfillmentCenter?: boolean;
}

export class CreateBalanceDto {
  @IsString()
  @IsNotEmpty()
  locationId: string;

  @IsString()
  @IsNotEmpty()
  sellerListingId: string;

  @IsNumber()
  @IsOptional()
  initialOnHand?: number;

  @IsNumber()
  @IsOptional()
  damaged?: number;

  @IsNumber()
  @IsOptional()
  safetyStock?: number;

  @IsNumber()
  @IsOptional()
  lowStockThreshold?: number;
}

export class AdjustStockDto {
  @IsNumber()
  @IsNotEmpty()
  delta: number;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  reference?: string;
}

export class ReservationItemDto {
  @IsString()
  @IsNotEmpty()
  balanceId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateReservationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReservationItemDto)
  items: ReservationItemDto[];

  @IsOptional()
  @IsInt()
  @Min(60)
  @Max(86400)
  ttlSeconds?: number;

  @IsOptional()
  @IsString()
  metadata?: string;
}

export class ReleaseReservationDto {
  @IsOptional()
  @IsString()
  reason?: string;
}

@Injectable()
export class InventoryService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(InventoryLocation)
    private readonly locationRepository: Repository<InventoryLocation>,
    @InjectRepository(InventoryBalance)
    private readonly balanceRepository: Repository<InventoryBalance>,
    @InjectRepository(SellerListing)
    private readonly sellerListingRepository: Repository<SellerListing>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(FladoShop)
    private readonly shopRepository: Repository<FladoShop>,
    @InjectRepository(Inventory)
    private readonly legacyInventoryRepository: Repository<Inventory>,
    @InjectRepository(InventoryReservation)
    private readonly reservationRepository: Repository<InventoryReservation>,
    @InjectRepository(InventoryReservationItem)
    private readonly reservationItemRepository: Repository<InventoryReservationItem>,
    private readonly auditService: AuditService,
    private readonly dataSource: DataSource,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.dataSource.query('PRAGMA busy_timeout = 5000;');
    } catch (e) {}
    await this.seedInitialLocationsAndBalances();
  }

  private async seedInitialLocationsAndBalances() {

    // Seed system holding location if missing
    let holdingLoc = await this.locationRepository.findOne({ where: { id: 'loc-legacy-unassigned' } });
    if (!holdingLoc) {
      holdingLoc = await this.locationRepository.save({
        id: 'loc-legacy-unassigned',
        tenantType: 'PLATFORM',
        tenantId: 'PLATFORM',
        code: 'LEGACY_UNASSIGNED',
        name: 'Legacy Unassigned Holding Location',
        type: 'MARKETPLACE_WAREHOUSE',
        status: 'INACTIVE',
        isMarketplace: false,
        isQuickCommerce: false,
        isFulfillmentCenter: false,
      });
    }

    // Seed Vendors if missing or update userId linkage
    let vendor1 = await this.vendorRepository.findOne({ where: { id: 'vnd-1' } });
    if (!vendor1) {
      vendor1 = await this.vendorRepository.save({
        id: 'vnd-1',
        userId: 'usr-vendor-1',
        storeName: 'Organic Honey LLC',
      });
    } else if (vendor1.userId !== 'usr-vendor-1') {
      vendor1.userId = 'usr-vendor-1';
      await this.vendorRepository.save(vendor1);
    }

    let vendor2 = await this.vendorRepository.findOne({ where: { id: 'vnd-2' } });
    if (!vendor2) {
      vendor2 = await this.vendorRepository.save({
        id: 'vnd-2',
        userId: 'usr-vendor-2',
        storeName: 'Abu Dhabi Traders',
      });
    } else if (vendor2.userId !== 'usr-vendor-2') {
      vendor2.userId = 'usr-vendor-2';
      await this.vendorRepository.save(vendor2);
    }

    // Seed Flado Shops if missing or update ownerUserId linkage
    let shop1 = await this.shopRepository.findOne({ where: { id: 'shp-1' } });
    if (!shop1) {
      shop1 = await this.shopRepository.save({
        id: 'shp-1',
        ownerUserId: 'usr-merchant-1',
        ownerName: 'Al-Nafis Trader',
        ownerPhone: '+971501112233',
        shopName: 'Al-Nafis Quick Store',
        address: 'Muzaffarpur Market',
        city: 'Muzaffarpur',
        state: 'Bihar',
        approvalStatus: 'APPROVED',
      });
    } else if (shop1.ownerUserId !== 'usr-merchant-1') {
      shop1.ownerUserId = 'usr-merchant-1';
      await this.shopRepository.save(shop1);
    }

    let shop2 = await this.shopRepository.findOne({ where: { id: 'shp-2' } });
    if (!shop2) {
      shop2 = await this.shopRepository.save({
        id: 'shp-2',
        ownerUserId: 'usr-merchant-2',
        ownerName: 'Mau General Store Owner',
        ownerPhone: '+971501112244',
        shopName: 'Mau General Store',
        address: 'Mau Main Road',
        city: 'Maunath Bhanjan',
        state: 'Uttar Pradesh',
        approvalStatus: 'APPROVED',
      });
    } else if (shop2.ownerUserId !== 'usr-merchant-2') {
      shop2.ownerUserId = 'usr-merchant-2';
      await this.shopRepository.save(shop2);
    }

    // Seed SellerListings if missing
    let listing1 = await this.sellerListingRepository.findOne({ where: { id: 'lst-1' } });
    if (!listing1) {
      listing1 = await this.sellerListingRepository.save({
        id: 'lst-1',
        variantId: 'var-honey-500g',
        vendorId: 'vnd-1',
        shopId: null,
        isAvailable: true,
      });
    }

    let listingFlado1 = await this.sellerListingRepository.findOne({ where: { id: 'lst-flado-1' } });
    if (!listingFlado1) {
      listingFlado1 = await this.sellerListingRepository.save({
        id: 'lst-flado-1',
        variantId: 'var-honey-500g',
        vendorId: 'vnd-1',
        shopId: 'shp-1',
        isAvailable: true,
      });
    }

    // Seed Vendor Warehouse if missing
    let locVnd1 = await this.locationRepository.findOne({ where: { id: 'loc-vnd-1' } });
    if (!locVnd1) {
      locVnd1 = await this.locationRepository.save({
        id: 'loc-vnd-1',
        tenantType: 'VENDOR',
        tenantId: 'vnd-1',
        code: 'WH-01',
        name: 'Organic Honey Dubai Warehouse',
        type: 'VENDOR_WAREHOUSE',
        status: 'ACTIVE',
        vendorId: 'vnd-1',
        shopId: null,
        city: 'Dubai',
        country: 'AE',
        isMarketplace: true,
        isQuickCommerce: false,
        isFulfillmentCenter: true,
      });
    }

    // Seed Flado Shop Darkstore 1 if missing
    let locShp1 = await this.locationRepository.findOne({ where: { id: 'loc-shp-1' } });
    if (!locShp1) {
      locShp1 = await this.locationRepository.save({
        id: 'loc-shp-1',
        tenantType: 'MERCHANT',
        tenantId: 'shp-1',
        code: 'DARK-01',
        name: 'Flado Al-Nafis Darkstore',
        type: 'DARK_STORE',
        status: 'ACTIVE',
        vendorId: null,
        shopId: 'shp-1',
        city: 'Muzaffarpur',
        country: 'IN',
        isMarketplace: false,
        isQuickCommerce: true,
        isFulfillmentCenter: true,
      });
    }

    // Seed Flado Shop Darkstore 2 if missing
    let locShp2 = await this.locationRepository.findOne({ where: { id: 'loc-shp-2' } });
    if (!locShp2) {
      locShp2 = await this.locationRepository.save({
        id: 'loc-shp-2',
        tenantType: 'MERCHANT',
        tenantId: 'shp-2',
        code: 'DARK-02',
        name: 'Flado Mau Central Shop',
        type: 'MERCHANT_SHOP',
        status: 'ACTIVE',
        vendorId: null,
        shopId: 'shp-2',
        city: 'Maunath Bhanjan',
        country: 'IN',
        isMarketplace: false,
        isQuickCommerce: true,
        isFulfillmentCenter: false,
      });
    }

    // Seed initial balances if missing
    let balVnd1 = await this.balanceRepository.findOne({ where: { id: 'bal-lst-1-wh1' } });
    if (!balVnd1 && locVnd1 && listing1) {
      await this.balanceRepository.save({
        id: 'bal-lst-1-wh1',
        locationId: locVnd1.id,
        sellerListingId: listing1.id,
        variantId: listing1.variantId,
        vendorId: listing1.vendorId,
        shopId: null,
        onHand: 100,
        reserved: 0,
        damaged: 0,
        safetyStock: 5,
      });
    }

    let balShp1 = await this.balanceRepository.findOne({ where: { id: 'bal-lst-flado-1-shp1' } });
    if (!balShp1 && locShp1 && listingFlado1) {
      await this.balanceRepository.save({
        id: 'bal-lst-flado-1-shp1',
        locationId: locShp1.id,
        sellerListingId: listingFlado1.id,
        variantId: listingFlado1.variantId,
        vendorId: listingFlado1.vendorId,
        shopId: 'shp-1',
        onHand: 18,
        reserved: 0,
        damaged: 0,
        safetyStock: 2,
      });
    }
  }

  // Authoritative DB Tenant Resolution
  async resolveTenant(user: any): Promise<{ tenantType: 'VENDOR' | 'MERCHANT' | 'PLATFORM'; tenantId: string }> {
    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    if (user.role === Role.SUPER_ADMIN || user.role === Role.OPERATIONS) {
      return { tenantType: 'PLATFORM', tenantId: 'PLATFORM' };
    }

    if (user.role === Role.VENDOR_OWNER || user.role === Role.VENDOR_STAFF) {
      let vendor = await this.vendorRepository.findOne({ where: { userId: user.userId } });
      if (!vendor) {
        vendor = await this.vendorRepository.findOne({ where: { id: user.userId } });
      }
      if (!vendor) {
        throw new ForbiddenException('Authoritative vendor account not found for user');
      }
      return { tenantType: 'VENDOR', tenantId: vendor.id };
    }

    if (
      user.role === Role.MERCHANT_OWNER ||
      user.role === Role.MERCHANT_MANAGER ||
      user.role === Role.MERCHANT_PICKER
    ) {
      let shop = await this.shopRepository.findOne({ where: { ownerUserId: user.userId } });
      if (!shop) {
        shop = await this.shopRepository.findOne({ where: { id: user.userId } });
      }
      if (!shop) {
        throw new ForbiddenException('Authoritative merchant shop not found for user');
      }
      return { tenantType: 'MERCHANT', tenantId: shop.id };
    }

    throw new ForbiddenException('Role not authorized for inventory operations');
  }

  // Compute derived available stock
  calculateAvailableStock(balance: InventoryBalance): number {
    const usable = balance.onHand - balance.damaged;
    return Math.max(0, usable - balance.reserved - balance.safetyStock);
  }

  // Location Management
  async createLocation(dto: CreateLocationDto, reqUser: any): Promise<InventoryLocation> {
    const tenant = await this.resolveTenant(reqUser);

    let vendorId: string | null = null;
    let shopId: string | null = null;

    if (tenant.tenantType === 'VENDOR') {
      vendorId = tenant.tenantId;
      if (dto.type === 'MERCHANT_SHOP' || dto.type === 'DARK_STORE') {
        throw new BadRequestException('Vendor tenant cannot create merchant shop or darkstore location');
      }
    } else if (tenant.tenantType === 'MERCHANT') {
      shopId = tenant.tenantId;
      if (dto.type === 'VENDOR_WAREHOUSE') {
        throw new BadRequestException('Merchant tenant cannot create vendor warehouse location');
      }
    }

    // Check code uniqueness within tenant scope
    const existingCode = await this.locationRepository.findOne({
      where: { tenantType: tenant.tenantType, tenantId: tenant.tenantId, code: dto.code },
    });
    if (existingCode) {
      throw new ConflictException({
        code: 'DUPLICATE_LOCATION_CODE',
        message: `Location code '${dto.code}' already exists for this tenant`,
      });
    }

    // Capability defaults
    const isFulfillmentCenter =
      dto.isFulfillmentCenter !== undefined
        ? dto.isFulfillmentCenter
        : dto.type === 'DARK_STORE' || dto.type === 'FULFILLMENT_CENTER';

    const location = this.locationRepository.create({
      tenantType: tenant.tenantType,
      tenantId: tenant.tenantId,
      code: dto.code,
      name: dto.name,
      type: dto.type,
      status: 'ACTIVE',
      vendorId,
      shopId,
      address: dto.address,
      city: dto.city,
      state: dto.state,
      country: dto.country || 'AE',
      postalCode: dto.postalCode,
      lat: dto.lat,
      lng: dto.lng,
      isMarketplace: dto.isMarketplace ?? (tenant.tenantType === 'VENDOR'),
      isQuickCommerce: dto.isQuickCommerce ?? (tenant.tenantType === 'MERCHANT'),
      isFulfillmentCenter,
    });

    const saved = await this.locationRepository.save(location);

    await this.auditService.log({
      actorId: reqUser.userId || 'SYSTEM',
      actorRole: reqUser.role || 'ANONYMOUS',
      action: 'LOCATION_CREATE',
      resourceType: 'InventoryLocation',
      resourceId: saved.id,
      vendorId: vendorId || undefined,
      shopId: shopId || undefined,
      details: { code: saved.code, name: saved.name, type: saved.type },
    });

    return saved;
  }

  async getLocations(
    query: { type?: string; status?: string; surface?: string },
    reqUser: any,
  ): Promise<InventoryLocation[]> {
    const tenant = await this.resolveTenant(reqUser);
    const qb = this.locationRepository.createQueryBuilder('loc');

    if (tenant.tenantType === 'VENDOR') {
      qb.andWhere('loc.vendorId = :vendorId', { vendorId: tenant.tenantId });
    } else if (tenant.tenantType === 'MERCHANT') {
      qb.andWhere('loc.shopId = :shopId', { shopId: tenant.tenantId });
    }

    if (query.type) {
      qb.andWhere('loc.type = :type', { type: query.type });
    }
    if (query.status) {
      qb.andWhere('loc.status = :status', { status: query.status });
    }
    if (query.surface === 'quick-commerce') {
      qb.andWhere('loc.isQuickCommerce = :isQuick', { isQuick: true });
    } else if (query.surface === 'marketplace') {
      qb.andWhere('loc.isMarketplace = :isMarket', { isMarket: true });
    }

    return await qb.getMany();
  }

  async getLocationById(id: string, reqUser: any): Promise<InventoryLocation> {
    const location = await this.locationRepository.findOne({ where: { id } });
    if (!location) {
      throw new NotFoundException(`Inventory location ${id} not found`);
    }

    const tenant = await this.resolveTenant(reqUser);
    if (tenant.tenantType === 'VENDOR' && location.vendorId !== tenant.tenantId) {
      throw new ForbiddenException('Cannot access location belonging to another vendor');
    }
    if (tenant.tenantType === 'MERCHANT' && location.shopId !== tenant.tenantId) {
      throw new ForbiddenException('Cannot access location belonging to another merchant shop');
    }

    return location;
  }

  async archiveLocation(id: string, reqUser: any): Promise<InventoryLocation> {
    const location = await this.getLocationById(id, reqUser);

    // Archival stock check
    const activeBalances = await this.balanceRepository.find({ where: { locationId: id } });
    const hasRemainingStock = activeBalances.some((b) => b.onHand > 0);
    const hasActiveReservations = activeBalances.some((b) => b.reserved > 0);

    if (hasActiveReservations) {
      throw new BadRequestException({
        code: 'LOCATION_HAS_ACTIVE_RESERVATIONS',
        message: 'Cannot archive location with active order reservations',
      });
    }

    if (hasRemainingStock) {
      throw new BadRequestException({
        code: 'LOCATION_HAS_REMAINING_STOCK',
        message: 'Cannot archive location with remaining physical onHand stock. Reconcile or transfer stock first.',
      });
    }

    location.status = 'ARCHIVED';
    const saved = await this.locationRepository.save(location);

    await this.auditService.log({
      actorId: reqUser.userId || 'SYSTEM',
      actorRole: reqUser.role || 'ANONYMOUS',
      action: 'LOCATION_ARCHIVE',
      resourceType: 'InventoryLocation',
      resourceId: saved.id,
      vendorId: saved.vendorId || undefined,
      shopId: saved.shopId || undefined,
      details: { code: saved.code, name: saved.name },
    });

    return saved;
  }

  // Stock Balance Operations
  async createBalance(dto: CreateBalanceDto, reqUser: any): Promise<any> {
    const tenant = await this.resolveTenant(reqUser);

    const location = await this.locationRepository.findOne({ where: { id: dto.locationId } });
    if (!location) {
      throw new NotFoundException(`Inventory location ${dto.locationId} not found`);
    }

    if (location.status === 'ARCHIVED') {
      throw new BadRequestException('Cannot create balance on an ARCHIVED location');
    }

    const listing = await this.sellerListingRepository.findOne({ where: { id: dto.sellerListingId } });
    if (!listing) {
      throw new NotFoundException(`Seller listing ${dto.sellerListingId} not found`);
    }

    // Tenant authorization & compatibility check
    if (tenant.tenantType === 'VENDOR') {
      if (listing.vendorId !== tenant.tenantId || location.vendorId !== tenant.tenantId) {
        throw new ForbiddenException('Vendor listing and location must belong to authenticated vendor');
      }
    } else if (tenant.tenantType === 'MERCHANT') {
      if (listing.shopId !== tenant.tenantId || location.shopId !== tenant.tenantId) {
        throw new ForbiddenException('Merchant listing and location must belong to authenticated shop');
      }
    }

    // Check composite uniqueness
    const existing = await this.balanceRepository.findOne({
      where: { locationId: dto.locationId, sellerListingId: dto.sellerListingId },
    });
    if (existing) {
      throw new ConflictException({
        code: 'DUPLICATE_INVENTORY_BALANCE',
        message: 'An inventory balance already exists for this location and seller listing',
      });
    }

    const balance = this.balanceRepository.create({
      locationId: dto.locationId,
      sellerListingId: dto.sellerListingId,
      variantId: listing.variantId,
      vendorId: listing.vendorId,
      shopId: listing.shopId || location.shopId || null,
      onHand: dto.initialOnHand || 0,
      reserved: 0,
      damaged: dto.damaged || 0,
      safetyStock: dto.safetyStock || 0,
      lowStockThreshold: dto.lowStockThreshold || 5,
      migrationStatus: 'OK',
    });

    const saved = await this.balanceRepository.save(balance);

    await this.auditService.log({
      actorId: reqUser.userId || 'SYSTEM',
      actorRole: reqUser.role || 'ANONYMOUS',
      action: 'BALANCE_CREATE',
      resourceType: 'InventoryBalance',
      resourceId: saved.id,
      vendorId: saved.vendorId,
      shopId: saved.shopId || undefined,
      details: {
        locationId: saved.locationId,
        sellerListingId: saved.sellerListingId,
        variantId: saved.variantId,
        initialOnHand: saved.onHand,
      },
    });

    return {
      ...saved,
      available: this.calculateAvailableStock(saved),
    };
  }

  async getBalances(
    query: { locationId?: string; variantId?: string; sellerListingId?: string },
    reqUser: any,
  ): Promise<any[]> {
    const tenant = await this.resolveTenant(reqUser);
    const qb = this.balanceRepository
      .createQueryBuilder('bal')
      .leftJoinAndSelect('bal.location', 'loc')
      .leftJoinAndSelect('bal.sellerListing', 'lst');

    if (tenant.tenantType === 'VENDOR') {
      qb.andWhere('bal.vendorId = :vendorId', { vendorId: tenant.tenantId });
    } else if (tenant.tenantType === 'MERCHANT') {
      qb.andWhere('bal.shopId = :shopId', { shopId: tenant.tenantId });
    }

    if (query.locationId) {
      qb.andWhere('bal.locationId = :locationId', { locationId: query.locationId });
    }
    if (query.variantId) {
      qb.andWhere('bal.variantId = :variantId', { variantId: query.variantId });
    }
    if (query.sellerListingId) {
      qb.andWhere('bal.sellerListingId = :sellerListingId', { sellerListingId: query.sellerListingId });
    }

    const balances = await qb.getMany();
    return balances.map((b) => ({
      ...b,
      available: this.calculateAvailableStock(b),
    }));
  }

  // Row-locked atomic stock adjustment
  async adjustStock(balanceId: string, dto: AdjustStockDto, reqUser: any): Promise<any> {
    // Restricted role check: MERCHANT_PICKER is read-only
    if (reqUser.role === Role.MERCHANT_PICKER || reqUser.role === Role.VENDOR_STAFF) {
      throw new ForbiddenException('Operational picker/staff role cannot perform stock adjustments');
    }

    return await this.dataSource.transaction(async (manager) => {
      const isSqlite = this.dataSource.options.type === 'sqlite';
      const balance = await manager.findOne(InventoryBalance, {
        where: { id: balanceId },
        ...(isSqlite ? {} : { lock: { mode: 'pessimistic_write' as const } }),
        relations: ['location'],
      });

      if (!balance) {
        throw new NotFoundException(`Inventory balance ${balanceId} not found`);
      }

      if (balance.location && balance.location.status === 'ARCHIVED') {
        throw new BadRequestException('Cannot adjust stock on an ARCHIVED location');
      }

      // Verify tenant ownership
      const tenant = await this.resolveTenant(reqUser);
      if (tenant.tenantType === 'VENDOR' && balance.vendorId !== tenant.tenantId) {
        throw new ForbiddenException('Cannot adjust stock belonging to another vendor');
      }
      if (tenant.tenantType === 'MERCHANT' && balance.shopId !== tenant.tenantId) {
        throw new ForbiddenException('Cannot adjust stock belonging to another merchant shop');
      }

      const previousOnHand = balance.onHand;
      const resultingOnHand = previousOnHand + dto.delta;

      if (resultingOnHand < 0) {
        throw new BadRequestException({
          code: 'INSUFFICIENT_STOCK_FOR_ADJUSTMENT',
          message: `Adjustment of ${dto.delta} would result in negative onHand stock (${resultingOnHand}).`,
        });
      }

      await manager
        .createQueryBuilder()
        .update(InventoryBalance)
        .set({ onHand: () => `onHand + ${dto.delta}` })
        .where('id = :id', { id: balanceId })
        .execute();

      const updatedBalance = await manager.findOne(InventoryBalance, {
        where: { id: balanceId },
      });

      if (!updatedBalance) {
        throw new NotFoundException(`Inventory balance ${balanceId} not found after adjustment`);
      }

      await this.auditService.log({
        actorId: reqUser.userId || 'SYSTEM',
        actorRole: reqUser.role,
        action: 'INVENTORY_STOCK_ADJUSTED',
        resourceType: 'INVENTORY_BALANCE',
        resourceId: balance.id,
        vendorId: balance.vendorId,
        shopId: balance.shopId || undefined,
        details: {
          previousOnHand,
          resultingOnHand,
          delta: dto.delta,
          reason: dto.reason,
          reference: dto.reference,
        },
      });

      return {
        ...updatedBalance,
        available: this.calculateAvailableStock(updatedBalance),
      };
    });
  }

  // Safe Customer Public Stock Projection (Excludes internal warehouse IDs & damaged units)
  async getPublicVariantStock(variantId: string): Promise<{ status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'; totalAvailable: number }> {
    const balances = await this.balanceRepository
      .createQueryBuilder('bal')
      .innerJoin('bal.location', 'loc')
      .where('bal.variantId = :variantId', { variantId })
      .andWhere('loc.status = :locStatus', { locStatus: 'ACTIVE' })
      .getMany();

    const totalAvailable = balances.reduce((sum, b) => sum + this.calculateAvailableStock(b), 0);

    let status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' = 'OUT_OF_STOCK';
    if (totalAvailable > 5) {
      status = 'IN_STOCK';
    } else if (totalAvailable > 0) {
      status = 'LOW_STOCK';
    }

    return { status, totalAvailable };
  }

  private getAffectedCount(result: any): number {
    if (!result) return 0;
    if (typeof result.affected === 'number' && !isNaN(result.affected)) {
      return result.affected;
    }
    if (typeof result.raw?.affected === 'number' && !isNaN(result.raw.affected)) {
      return result.raw.affected;
    }
    if (typeof result.raw?.changes === 'number' && !isNaN(result.raw.changes)) {
      return result.raw.changes;
    }
    if (Array.isArray(result.raw)) {
      return result.raw.length;
    }
    return 0;
  }

  // ─────────────────────────────────────────────
  // CMD-013 ATOMIC INVENTORY RESERVATION SERVICE
  // ─────────────────────────────────────────────

  async createReservation(dto: CreateReservationDto, reqUser: any): Promise<any> {
    const customerId = reqUser?.userId;
    if (!customerId) {
      throw new ForbiddenException('Authentication required');
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Reservation must contain at least one item');
    }

    // 1. Canonicalize items: Group duplicate balanceIds and sum quantities
    const itemMap = new Map<string, number>();
    for (const item of dto.items) {
      if (!item.balanceId || typeof item.quantity !== 'number' || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
        throw new BadRequestException('Each reservation item must have a valid balanceId and positive integer quantity');
      }
      const existing = itemMap.get(item.balanceId) || 0;
      itemMap.set(item.balanceId, existing + item.quantity);
    }

    // 2. Sort canonical items by balanceId ASC for deadlock prevention
    const canonicalItems = Array.from(itemMap.entries())
      .map(([balanceId, quantity]) => ({ balanceId, quantity }))
      .sort((a, b) => a.balanceId.localeCompare(b.balanceId));

    const ttlSeconds = dto.ttlSeconds || 900;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlSeconds * 1000);
    const reservationToken = `RES-${crypto.randomUUID()}`;

    let locationNotEligibleId: string | null = null;
    let insufficientBalanceId: string | null = null;
    let notFoundBalanceId: string | null = null;
    let createdReservationResult: any = null;

    let retries = 5;
    while (retries > 0) {
      locationNotEligibleId = null;
      insufficientBalanceId = null;
      notFoundBalanceId = null;
      createdReservationResult = null;

      try {
        await this.dataSource.transaction(async (manager) => {
          // 3. For each item, validate location & execute guarded reservation increment
          for (const item of canonicalItems) {
            const balance = await manager.findOne(InventoryBalance, {
              where: { id: item.balanceId },
              relations: ['location'],
            });

            if (!balance) {
              notFoundBalanceId = item.balanceId;
              throw new Error('ROLLBACK_NOT_FOUND');
            }

            if (
              !balance.location ||
              balance.location.status !== 'ACTIVE' ||
              balance.location.code === 'LEGACY_UNASSIGNED'
            ) {
              locationNotEligibleId = balance.locationId;
              throw new Error('ROLLBACK_LOCATION_NOT_ELIGIBLE');
            }

            // Guarded DB mutation: available = (onHand - damaged - reserved - safetyStock) >= quantity
            const updateRes = await manager
              .createQueryBuilder()
              .update(InventoryBalance)
              .set({ reserved: () => `reserved + ${item.quantity}` })
              .where('id = :balanceId', { balanceId: item.balanceId })
              .andWhere('(onHand - damaged - reserved - safetyStock) >= :quantity', { quantity: item.quantity })
              .execute();

            if (this.getAffectedCount(updateRes) === 0) {
              insufficientBalanceId = item.balanceId;
              throw new Error('ROLLBACK_INSUFFICIENT_INVENTORY');
            }
          }

          // 4. Create reservation & item records
          const reservation = manager.create(InventoryReservation, {
            reservationToken,
            customerId,
            status: 'ACTIVE',
            ttlSeconds,
            expiresAt,
            idempotencyKey: reqUser.idempotencyKey || null,
            metadata: dto.metadata || null,
          });
          const savedReservation = await manager.save(reservation);

          const reservationItems = canonicalItems.map((item) =>
            manager.create(InventoryReservationItem, {
              reservationId: savedReservation.id,
              balanceId: item.balanceId,
              quantity: item.quantity,
            }),
          );
          await manager.save(reservationItems);

          await this.auditService.log({
            actorId: customerId,
            actorRole: reqUser.role || 'CUSTOMER',
            action: 'INVENTORY_RESERVATION_CREATED',
            resourceType: 'InventoryReservation',
            resourceId: savedReservation.id,
            details: {
              reservationToken,
              itemsCount: canonicalItems.length,
              expiresAt,
            },
          });

          createdReservationResult = {
            ...savedReservation,
            items: reservationItems,
          };
        });

        break; // Transaction succeeded without DB lock errors
      } catch (err: any) {
        if (err?.message?.startsWith('ROLLBACK_')) {
          break; // Controlled business rollback completed
        }
        const msg = String(err?.message || '') + String(err?.driverError?.message || '');
        const code = String(err?.code || '') + String(err?.driverError?.code || '');
        if (
          (msg.includes('SQLITE_BUSY') || msg.includes('locked') || code.includes('SQLITE_BUSY')) &&
          retries > 1
        ) {
          retries--;
          await new Promise((resolve) => setTimeout(resolve, 50 * (6 - retries)));
          continue;
        }
        throw err;
      }
    }

    if (notFoundBalanceId) {
      throw new NotFoundException(`Inventory balance ${notFoundBalanceId} not found`);
    }

    if (locationNotEligibleId) {
      throw new BadRequestException({
        code: 'LOCATION_NOT_ELIGIBLE_FOR_RESERVATION',
        message: `Inventory location ${locationNotEligibleId} is not active for reservations`,
      });
    }

    if (insufficientBalanceId) {
      throw new BadRequestException({
        code: 'INSUFFICIENT_INVENTORY',
        message: `Insufficient available inventory for balance ${insufficientBalanceId}`,
      });
    }

    return createdReservationResult;
  }

  async getReservationByToken(tokenOrId: string, reqUser: any): Promise<InventoryReservation> {
    const reservation = await this.reservationRepository.findOne({
      where: [{ id: tokenOrId }, { reservationToken: tokenOrId }],
      relations: ['items', 'items.balance'],
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation ${tokenOrId} not found`);
    }

    if (reqUser?.role === Role.CUSTOMER && reservation.customerId !== reqUser.userId) {
      throw new ForbiddenException('Cannot access reservation belonging to another customer');
    }

    return reservation;
  }

  async releaseReservation(tokenOrId: string, reqUser: any, reason?: string): Promise<any> {
    // PRE-MUTATION OWNERSHIP VALIDATION
    const reservation = await this.reservationRepository.findOne({
      where: [{ id: tokenOrId }, { reservationToken: tokenOrId }],
      relations: ['items'],
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation ${tokenOrId} not found`);
    }

    if (reqUser?.role === Role.CUSTOMER && reservation.customerId !== reqUser.userId) {
      throw new ForbiddenException('Cannot release reservation belonging to another customer');
    }

    return await this.dataSource.transaction(async (manager) => {
      const now = new Date();

      // Atomic claim ACTIVE -> RELEASED
      const updateRes = await manager
        .createQueryBuilder()
        .update(InventoryReservation)
        .set({ status: 'RELEASED', releasedAt: now })
        .where('id = :id', { id: reservation.id })
        .andWhere('status = :activeStatus', { activeStatus: 'ACTIVE' })
        .execute();

      if (this.getAffectedCount(updateRes) === 0) {
        throw new ConflictException({
          code: 'INVALID_RESERVATION_STATE',
          message: `Reservation ${tokenOrId} is not in ACTIVE state (current status: ${reservation.status})`,
        });
      }

      // Sort items by balanceId ASC for deterministic deadlock-free mutation
      const items = [...reservation.items].sort((a, b) => a.balanceId.localeCompare(b.balanceId));

      for (const item of items) {
        const stockRes = await manager
          .createQueryBuilder()
          .update(InventoryBalance)
          .set({ reserved: () => `reserved - ${item.quantity}` })
          .where('id = :balanceId', { balanceId: item.balanceId })
          .andWhere('reserved >= :quantity', { quantity: item.quantity })
          .execute();

        if (this.getAffectedCount(stockRes) === 0) {
          throw new BadRequestException({
            code: 'INSUFFICIENT_RESERVED_STOCK',
            message: `Stock mutation failed: reserved stock less than release quantity for balance ${item.balanceId}`,
          });
        }
      }

      await this.auditService.log({
        actorId: reqUser?.userId || 'SYSTEM',
        actorRole: reqUser?.role || 'ANONYMOUS',
        action: 'INVENTORY_RESERVATION_RELEASED',
        resourceType: 'InventoryReservation',
        resourceId: reservation.id,
        details: {
          reservationToken: reservation.reservationToken,
          releasedAt: now,
          reason: reason || 'CUSTOMER_CANCELLED',
        },
      });

      return {
        ...reservation,
        status: 'RELEASED',
        releasedAt: now,
      };
    });
  }

  async consumeReservation(tokenOrId: string, reqUser: any): Promise<any> {
    // Restricted to SUPER_ADMIN, OPERATIONS or system orchestrator
    if (reqUser?.role === Role.CUSTOMER) {
      throw new ForbiddenException('Customers cannot directly consume reservations');
    }

    const existing = await this.reservationRepository.findOne({
      where: [{ id: tokenOrId }, { reservationToken: tokenOrId }],
    });

    if (!existing) {
      throw new NotFoundException(`Reservation ${tokenOrId} not found`);
    }

    const now = new Date();
    const existingExpiresAtMs = existing.expiresAt instanceof Date
      ? existing.expiresAt.getTime()
      : new Date(String(existing.expiresAt).replace(' ', 'T')).getTime();

    if (existingExpiresAtMs <= now.getTime() && existing.status === 'ACTIVE') {
      await this.expireReservation(existing.id);
      throw new BadRequestException({
        code: 'RESERVATION_EXPIRED',
        message: `Reservation ${tokenOrId} has expired`,
      });
    }

    if (existing.status !== 'ACTIVE') {
      throw new ConflictException({
        code: 'INVALID_RESERVATION_STATE',
        message: `Reservation ${tokenOrId} is not in ACTIVE state (current status: ${existing.status})`,
      });
    }

    return await this.dataSource.transaction(async (manager) => {
      // ATOMIC CONSUME CLAIM: status = 'ACTIVE' AND expiresAt > NOW()
      const claimRes = await manager
        .createQueryBuilder()
        .update(InventoryReservation)
        .set({ status: 'CONSUMED', consumedAt: now })
        .where('(id = :id OR reservationToken = :id)', { id: tokenOrId })
        .andWhere('status = :activeStatus', { activeStatus: 'ACTIVE' })
        .andWhere('expiresAt > :now', { now })
        .execute();

      if (this.getAffectedCount(claimRes) === 0) {
        throw new ConflictException({
          code: 'INVALID_RESERVATION_STATE',
          message: `Reservation ${tokenOrId} is not in ACTIVE state`,
        });
      }

      const reservation = await manager.findOne(InventoryReservation, {
        where: [{ id: tokenOrId }, { reservationToken: tokenOrId }],
        relations: ['items'],
      });

      if (!reservation) {
        throw new NotFoundException(`Reservation ${tokenOrId} not found`);
      }

      const items = [...reservation.items].sort((a, b) => a.balanceId.localeCompare(b.balanceId));

      for (const item of items) {
        const stockRes = await manager
          .createQueryBuilder()
          .update(InventoryBalance)
          .set({
            onHand: () => `onHand - ${item.quantity}`,
            reserved: () => `reserved - ${item.quantity}`,
          })
          .where('id = :balanceId', { balanceId: item.balanceId })
          .andWhere('onHand >= :quantity', { quantity: item.quantity })
          .andWhere('reserved >= :quantity', { quantity: item.quantity })
          .execute();

        if (this.getAffectedCount(stockRes) === 0) {
          throw new BadRequestException({
            code: 'INSUFFICIENT_STOCK_FOR_CONSUMPTION',
            message: `Stock mutation failed: insufficient onHand or reserved stock for balance ${item.balanceId}`,
          });
        }
      }

      await this.auditService.log({
        actorId: reqUser?.userId || 'SYSTEM',
        actorRole: reqUser?.role || 'ANONYMOUS',
        action: 'INVENTORY_RESERVATION_CONSUMED',
        resourceType: 'InventoryReservation',
        resourceId: reservation.id,
        details: {
          reservationToken: reservation.reservationToken,
          consumedAt: now,
        },
      });

      return {
        ...reservation,
        status: 'CONSUMED',
        consumedAt: now,
      };
    });
  }

  private async expireReservationInternal(id: string, manager: any): Promise<boolean> {
    const now = new Date();
    const updateRes = await manager
      .createQueryBuilder()
      .update(InventoryReservation)
      .set({ status: 'EXPIRED' })
      .where('id = :id', { id })
      .andWhere('status = :activeStatus', { activeStatus: 'ACTIVE' })
      .execute();

    if (!updateRes || updateRes.affected === 0) {
      return false; // Another worker/request claimed it
    }

    const reservation = await manager.findOne(InventoryReservation, {
      where: { id },
      relations: ['items'],
    });

    if (reservation && reservation.items) {
      const items = [...reservation.items].sort((a, b) => a.balanceId.localeCompare(b.balanceId));
      for (const item of items) {
        await manager
          .createQueryBuilder()
          .update(InventoryBalance)
          .set({ reserved: () => `reserved - ${item.quantity}` })
          .where('id = :balanceId', { balanceId: item.balanceId })
          .andWhere('reserved >= :quantity', { quantity: item.quantity })
          .execute();
      }
    }

    await this.auditService.log({
      actorId: 'SYSTEM_SWEEPER',
      actorRole: 'SYSTEM',
      action: 'INVENTORY_RESERVATION_EXPIRED',
      resourceType: 'InventoryReservation',
      resourceId: id,
      details: { expiredAt: now },
    });

    return true;
  }

  async expireReservation(tokenOrId: string): Promise<any> {
    return await this.dataSource.transaction(async (manager) => {
      const reservation = await manager.findOne(InventoryReservation, {
        where: [{ id: tokenOrId }, { reservationToken: tokenOrId }],
      });

      if (!reservation) {
        throw new NotFoundException(`Reservation ${tokenOrId} not found`);
      }

      const expired = await this.expireReservationInternal(reservation.id, manager);
      if (!expired) {
        throw new ConflictException({
          code: 'INVALID_RESERVATION_STATE',
          message: `Reservation ${tokenOrId} is not in ACTIVE state (current status: ${reservation.status})`,
        });
      }

      return { ...reservation, status: 'EXPIRED' };
    });
  }

  async sweepExpiredReservations(): Promise<{ sweptCount: number }> {
    const now = new Date();
    const expiredActiveReservations = await this.reservationRepository
      .createQueryBuilder('res')
      .where('res.status = :status', { status: 'ACTIVE' })
      .andWhere('res.expiresAt <= :now', { now })
      .getMany();

    let sweptCount = 0;
    for (const res of expiredActiveReservations) {
      try {
        const result = await this.dataSource.transaction(async (manager) => {
          return await this.expireReservationInternal(res.id, manager);
        });
        if (result) sweptCount++;
      } catch (err) {
        // Defensive logger for individual failure
      }
    }

    return { sweptCount };
  }
}
