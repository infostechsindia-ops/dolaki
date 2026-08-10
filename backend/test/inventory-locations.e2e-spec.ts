import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { InventoryService } from '../src/inventory/inventory.service';
import { Role } from '../src/auth/roles';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { Request, Response, NextFunction } from 'express';

describe('Inventory Locations & Stock Balances Architecture (CMD-012) e2e', () => {
  jest.setTimeout(30000);
  let app: INestApplication;
  let inventoryService: InventoryService;
  let jwtService: JwtService;

  let vendor1Token: string;
  let vendor2Token: string;
  let merchant1OwnerToken: string;
  let merchant1PickerToken: string;
  let superAdminToken: string;
  let customerToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new HttpExceptionFilter());
    const reflector = app.get(Reflector);
    app.useGlobalInterceptors(new TransformInterceptor(reflector));
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
      }),
    );

    // Mock Express Request correlation ID
    app.use((req: Request, res: Response, next: NextFunction) => {
      (req as any).id = `req-inv-test-${Date.now()}`;
      next();
    });

    await app.init();

    inventoryService = moduleFixture.get<InventoryService>(InventoryService);
    jwtService = moduleFixture.get<JwtService>(JwtService);

    // Explicitly seed User, Vendor, FladoShop, SellerListing, Location & Balance for E2E tests
    const userRepo = moduleFixture.get('UserRepository');
    const vendorRepo = moduleFixture.get('VendorRepository');
    const shopRepo = moduleFixture.get('FladoShopRepository');
    const listingRepo = moduleFixture.get('SellerListingRepository');
    const locRepo = moduleFixture.get('InventoryLocationRepository');
    const balRepo = moduleFixture.get('InventoryBalanceRepository');

    // Users
    await userRepo.save([
      { id: 'usr-vendor-1', email: 'vendor1@auramart.com', fullName: 'Vendor One', role: Role.VENDOR_OWNER },
      { id: 'usr-vendor-2', email: 'vendor2@auramart.com', fullName: 'Vendor Two', role: Role.VENDOR_OWNER },
      { id: 'usr-merchant-1', email: 'merchant1@flado.com', fullName: 'Merchant One', role: Role.MERCHANT_OWNER },
      { id: 'usr-merchant-2', email: 'merchant2@flado.com', fullName: 'Merchant Two', role: Role.MERCHANT_OWNER },
      { id: 'usr-admin-1', email: 'admin@auramart.com', fullName: 'Super Admin', role: Role.SUPER_ADMIN },
    ]);

    // Vendors
    await vendorRepo.save([
      { id: 'vnd-1', userId: 'usr-vendor-1', storeName: 'Organic Honey LLC' },
      { id: 'vnd-2', userId: 'usr-vendor-2', storeName: 'Abu Dhabi Traders' },
    ]);

    // Flado Shops
    await shopRepo.save([
      {
        id: 'shp-1',
        ownerUserId: 'usr-merchant-1',
        ownerName: 'Al-Nafis Trader',
        ownerPhone: '+971501112233',
        shopName: 'Al-Nafis Quick Store',
        address: 'Muzaffarpur Market',
        city: 'Muzaffarpur',
        state: 'Bihar',
        approvalStatus: 'APPROVED',
      },
      {
        id: 'shp-2',
        ownerUserId: 'usr-merchant-2',
        ownerName: 'Mau General Store Owner',
        ownerPhone: '+971501112244',
        shopName: 'Mau General Store',
        address: 'Mau Main Road',
        city: 'Maunath Bhanjan',
        state: 'Uttar Pradesh',
        approvalStatus: 'APPROVED',
      },
    ]);

    // Seller Listings
    await listingRepo.save([
      { id: 'lst-1', variantId: 'var-honey-500g', vendorId: 'vnd-1', shopId: null, isAvailable: true },
      { id: 'lst-flado-1', variantId: 'var-honey-500g', vendorId: 'vnd-1', shopId: 'shp-1', isAvailable: true },
    ]);

    // Clear existing balances, locations, and idempotency keys for clean test execution
    await balRepo.query('DELETE FROM idempotency_keys');
    await balRepo.query('DELETE FROM inventory_reservation_items');
    await balRepo.query('DELETE FROM inventory_reservations');
    await balRepo.query('DELETE FROM inventory_balances');
    await locRepo.query('DELETE FROM inventory_locations');

    // Inventory Locations
    await locRepo.save([
      {
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
      },
      {
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
      },
      {
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
      },
    ]);

    // Inventory Balances
    await balRepo.save([
      {
        id: 'bal-lst-1-wh1',
        locationId: 'loc-vnd-1',
        sellerListingId: 'lst-1',
        variantId: 'var-honey-500g',
        vendorId: 'vnd-1',
        shopId: null,
        onHand: 100,
        reserved: 0,
        damaged: 0,
        safetyStock: 5,
      },
      {
        id: 'bal-lst-flado-1-shp1',
        locationId: 'loc-shp-1',
        sellerListingId: 'lst-flado-1',
        variantId: 'var-honey-500g',
        vendorId: 'vnd-1',
        shopId: 'shp-1',
        onHand: 18,
        reserved: 0,
        damaged: 0,
        safetyStock: 2,
      },
    ]);

    // Generate JWT tokens for test roles
    vendor1Token = jwtService.sign({
      sub: 'usr-vendor-1',
      email: 'vendor1@auramart.com',
      role: Role.VENDOR_OWNER,
    });

    vendor2Token = jwtService.sign({
      sub: 'usr-vendor-2',
      email: 'vendor2@auramart.com',
      role: Role.VENDOR_OWNER,
    });

    merchant1OwnerToken = jwtService.sign({
      sub: 'usr-merchant-1',
      email: 'merchant1@flado.com',
      role: Role.MERCHANT_OWNER,
    });

    merchant1PickerToken = jwtService.sign({
      sub: 'usr-merchant-1',
      email: 'picker1@flado.com',
      role: Role.MERCHANT_PICKER,
    });

    superAdminToken = jwtService.sign({
      sub: 'usr-admin-1',
      email: 'admin@auramart.com',
      role: Role.SUPER_ADMIN,
    });

    customerToken = jwtService.sign({
      sub: 'usr-customer-1',
      email: 'customer@auramart.com',
      role: Role.CUSTOMER,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Authoritative DB Tenant Resolution & Scoped Code Uniqueness', () => {
    it('should allow Vendor 1 to create a location with code WH-NEW-1', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/inventory/locations')
        .set('Authorization', `Bearer ${vendor1Token}`)
        .set('x-idempotency-key', `ik-vnd1-loc1-${Date.now()}`)
        .send({
          code: 'WH-NEW-1',
          name: 'Vendor 1 Primary Warehouse',
          type: 'VENDOR_WAREHOUSE',
          city: 'Dubai',
        });

      if (res.status !== 201) {
        console.log('TEST 1 FAILURE BODY:', JSON.stringify(res.body, null, 2));
      }

      expect(res.status).toBe(201);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.vendorId).toBe('vnd-1');
      expect(res.body.data.code).toBe('WH-NEW-1');
    });

    it('should allow Vendor 2 to independently use code WH-NEW-1 without collision', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/inventory/locations')
        .set('Authorization', `Bearer ${vendor2Token}`)
        .set('x-idempotency-key', `ik-vnd2-loc1-${Date.now()}`)
        .send({
          code: 'WH-NEW-1',
          name: 'Vendor 2 Primary Warehouse',
          type: 'VENDOR_WAREHOUSE',
          city: 'Abu Dhabi',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.vendorId).toBe('vnd-2');
      expect(res.body.data.code).toBe('WH-NEW-1');
    });

    it('should reject duplicate code WH-NEW-1 for Vendor 1 with 409 DUPLICATE_LOCATION_CODE', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/inventory/locations')
        .set('Authorization', `Bearer ${vendor1Token}`)
        .set('x-idempotency-key', `ik-vnd1-loc2-${Date.now()}`)
        .send({
          code: 'WH-NEW-1',
          name: 'Vendor 1 Secondary Warehouse',
          type: 'VENDOR_WAREHOUSE',
        });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('DUPLICATE_LOCATION_CODE');
    });
  });

  describe('2. Invalid Location Tenant Combination Rejection', () => {
    it('should reject a Vendor trying to create a MERCHANT_SHOP location', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/inventory/locations')
        .set('Authorization', `Bearer ${vendor1Token}`)
        .set('x-idempotency-key', `ik-vnd1-badtype-${Date.now()}`)
        .send({
          code: 'SHP-99',
          name: 'Fake Merchant Shop',
          type: 'MERCHANT_SHOP',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('3. Controlled Balance Creation & Tenant Compatibility', () => {
    it('should allow Vendor 1 to create an inventory balance for their own seller listing and location', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/inventory/balances')
        .set('Authorization', `Bearer ${vendor1Token}`)
        .set('x-idempotency-key', `ik-vnd1-bal1-${Date.now()}`)
        .send({
          locationId: 'loc-vnd-1',
          sellerListingId: 'lst-1',
          initialOnHand: 50,
          safetyStock: 5,
        });

      // bal-lst-1-wh1 was seeded during bootstrap, so creating it again returns 409
      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('DUPLICATE_INVENTORY_BALANCE');
    });

    it('should reject Vendor 1 trying to create a balance on Vendor 2 location with 403 FORBIDDEN', async () => {
      const locsRes = await request(app.getHttpServer())
        .get('/api/v1/inventory/locations')
        .set('Authorization', `Bearer ${vendor2Token}`);

      const vendor2LocId = locsRes.body.data.find((l: any) => l.vendorId === 'vnd-2')?.id;
      expect(vendor2LocId).toBeDefined();

      const res = await request(app.getHttpServer())
        .post('/api/v1/inventory/balances')
        .set('Authorization', `Bearer ${vendor1Token}`)
        .set('x-idempotency-key', `ik-vnd1-badbal-${Date.now()}`)
        .send({
          locationId: vendor2LocId,
          sellerListingId: 'lst-1',
          initialOnHand: 10,
        });

      expect(res.status).toBe(403);
    });

    it('should reject creating a duplicate balance for the same location and seller listing with 409 DUPLICATE_INVENTORY_BALANCE', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/inventory/balances')
        .set('Authorization', `Bearer ${vendor1Token}`)
        .set('x-idempotency-key', `ik-dup-bal-${Date.now()}`)
        .send({
          locationId: 'loc-vnd-1',
          sellerListingId: 'lst-1',
          initialOnHand: 20,
        });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('DUPLICATE_INVENTORY_BALANCE');
    });
  });

  describe('4. Row-Locked Atomic Stock Adjustment & Idempotency', () => {
    it('should execute atomic stock adjustment and return updated available quantity', async () => {
      const balancesRes = await request(app.getHttpServer())
        .get('/api/v1/inventory/balances?locationId=loc-vnd-1')
        .set('Authorization', `Bearer ${vendor1Token}`);

      const balanceId = balancesRes.body.data[0].id;
      const initialOnHand = balancesRes.body.data[0].onHand;

      const adjustRes = await request(app.getHttpServer())
        .post(`/api/v1/inventory/balances/${balanceId}/adjust`)
        .set('Authorization', `Bearer ${vendor1Token}`)
        .set('Idempotency-Key', `ik-test-adj-1-${Date.now()}`)
        .send({
          delta: 15,
          reason: 'STOCK_RECEIPT',
          reference: 'PO-9918',
        });

      expect(adjustRes.status).toBe(200);
      expect(adjustRes.body.data.onHand).toBe(initialOnHand + 15);
    });

    it('should reject stock adjustment that results in negative onHand with 400 INSUFFICIENT_STOCK_FOR_ADJUSTMENT', async () => {
      const balancesRes = await request(app.getHttpServer())
        .get('/api/v1/inventory/balances?locationId=loc-vnd-1')
        .set('Authorization', `Bearer ${vendor1Token}`);

      const balanceId = balancesRes.body.data[0].id;

      const adjustRes = await request(app.getHttpServer())
        .post(`/api/v1/inventory/balances/${balanceId}/adjust`)
        .set('Authorization', `Bearer ${vendor1Token}`)
        .set('Idempotency-Key', `ik-test-adj-neg-${Date.now()}`)
        .send({
          delta: -1000,
          reason: 'CORRECTION',
        });

      expect(adjustRes.status).toBe(400);
      expect(adjustRes.body.error.code).toBe('INSUFFICIENT_STOCK_FOR_ADJUSTMENT');
    });

    it('should preserve both deltas under concurrent adjustments with different keys', async () => {
      const balancesRes = await request(app.getHttpServer())
        .get('/api/v1/inventory/balances?locationId=loc-vnd-1')
        .set('Authorization', `Bearer ${vendor1Token}`);

      const balanceId = balancesRes.body.data[0].id;
      const initialOnHand = balancesRes.body.data[0].onHand;

      const req1 = request(app.getHttpServer())
        .post(`/api/v1/inventory/balances/${balanceId}/adjust`)
        .set('Authorization', `Bearer ${vendor1Token}`)
        .set('Idempotency-Key', `ik-concurrent-1-${Date.now()}`)
        .send({ delta: 10, reason: 'BATCH_1' });

      const req2 = request(app.getHttpServer())
        .post(`/api/v1/inventory/balances/${balanceId}/adjust`)
        .set('Authorization', `Bearer ${vendor1Token}`)
        .set('Idempotency-Key', `ik-concurrent-2-${Date.now()}`)
        .send({ delta: 5, reason: 'BATCH_2' });

      const [res1, res2] = await Promise.all([req1, req2]);

      expect(res1.status).toBe(200);
      expect(res2.status).toBe(200);

      const finalCheck = await request(app.getHttpServer())
        .get('/api/v1/inventory/balances?locationId=loc-vnd-1')
        .set('Authorization', `Bearer ${vendor1Token}`);

      expect(finalCheck.body.data[0].onHand).toBe(initialOnHand + 15);
    });
  });

  describe('5. CMD-006 Merchant Role Alignment & Least Privilege', () => {
    it('should allow MERCHANT_OWNER to create a balance on darkstore', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/inventory/balances')
        .set('Authorization', `Bearer ${merchant1OwnerToken}`)
        .set('x-idempotency-key', `ik-merch-bal1-${Date.now()}`)
        .send({
          locationId: 'loc-shp-1',
          sellerListingId: 'lst-flado-1',
          initialOnHand: 25,
        });

      // bal-lst-flado-1-shp1 was seeded during beforeAll so duplicate creation returns 409
      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('DUPLICATE_INVENTORY_BALANCE');
    });

    it('should reject MERCHANT_PICKER from performing stock adjustment with 403 FORBIDDEN', async () => {
      const balancesRes = await request(app.getHttpServer())
        .get('/api/v1/inventory/balances?locationId=loc-shp-1')
        .set('Authorization', `Bearer ${merchant1OwnerToken}`);

      const balanceId = balancesRes.body.data[0].id;

      const res = await request(app.getHttpServer())
        .post(`/api/v1/inventory/balances/${balanceId}/adjust`)
        .set('Authorization', `Bearer ${merchant1PickerToken}`)
        .set('x-idempotency-key', `ik-picker-adj-${Date.now()}`)
        .send({
          delta: 5,
          reason: 'PICKER_ADJUST',
        });

      expect(res.status).toBe(403);
    });

    it('should allow MERCHANT_PICKER to view balances (read-only picking access)', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/inventory/balances?locationId=loc-shp-1')
        .set('Authorization', `Bearer ${merchant1PickerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
    });
  });

  describe('6. Archival Safety Rules', () => {
    it('should reject archiving a location with remaining physical onHand stock with 400 LOCATION_HAS_REMAINING_STOCK', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/v1/inventory/locations/loc-vnd-1')
        .set('Authorization', `Bearer ${vendor1Token}`);

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('LOCATION_HAS_REMAINING_STOCK');
    });
  });

  describe('7. Conservative Migration Holding Strategy & Customer Projection Hygiene', () => {
    it('should exclude LEGACY_UNASSIGNED holding location stock from public available stock API', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/inventory/public/variant/var-honey-500g');

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('IN_STOCK');
      expect(res.body.data.totalAvailable).toBeGreaterThan(0);
      // Ensure private warehouse details are NOT exposed
      expect(res.body.data.locationId).toBeUndefined();
      expect(res.body.data.damaged).toBeUndefined();
    });
  });
});
