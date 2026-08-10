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
import {
  InventoryLocation,
  InventoryBalance,
  SellerListing,
  ProductVariant,
  Vendor,
  FladoShop,
  InventoryReservation,
  InventoryReservationItem,
  IdempotencyKey,
} from '../src/database/entities';

describe('Atomic Inventory Reservation Architecture (CMD-013) e2e', () => {
  jest.setTimeout(30000);
  let app: INestApplication;
  let inventoryService: InventoryService;
  let jwtService: JwtService;

  let customer1Token: string;
  let customer2Token: string;
  let superAdminToken: string;

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

    app.use((req: Request, res: Response, next: NextFunction) => {
      (req as any).id = `req-res-test-${Date.now()}`;
      next();
    });

    await app.init();

    inventoryService = moduleFixture.get<InventoryService>(InventoryService);
    jwtService = moduleFixture.get<JwtService>(JwtService);

    customer1Token = jwtService.sign({
      sub: 'cust-user-1',
      role: Role.CUSTOMER,
      email: 'customer1@example.com',
    });

    customer2Token = jwtService.sign({
      sub: 'cust-user-2',
      role: Role.CUSTOMER,
      email: 'customer2@example.com',
    });

    superAdminToken = jwtService.sign({
      sub: 'admin-user-1',
      role: Role.SUPER_ADMIN,
      email: 'admin@example.com',
    });

    // Seed test fixtures
    const locRepo = app.get('InventoryLocationRepository');
    const balRepo = app.get('InventoryBalanceRepository');
    const listingRepo = app.get('SellerListingRepository');
    const resRepo = app.get('InventoryReservationRepository');
    const itemRepo = app.get('InventoryReservationItemRepository');
    const idempotencyRepo = app.get('IdempotencyKeyRepository');

    await itemRepo.query('DELETE FROM inventory_reservation_items');
    await resRepo.query('DELETE FROM inventory_reservations');
    await idempotencyRepo.query('DELETE FROM idempotency_keys');
    await balRepo.query('DELETE FROM inventory_balances');
    await locRepo.query('DELETE FROM inventory_locations');

    // Seed location
    await locRepo.save([
      {
        id: 'loc-test-wh1',
        tenantType: 'VENDOR',
        tenantId: 'vnd-1',
        code: 'WH-TEST-1',
        name: 'Test Warehouse 1',
        type: 'VENDOR_WAREHOUSE',
        status: 'ACTIVE',
        vendorId: 'vnd-1',
      },
      {
        id: 'loc-test-darkstore1',
        tenantType: 'MERCHANT',
        tenantId: 'shp-1',
        code: 'DS-TEST-1',
        name: 'Test Darkstore 1',
        type: 'DARK_STORE',
        status: 'ACTIVE',
        shopId: 'shp-1',
      },
      {
        id: 'loc-test-inactive',
        tenantType: 'VENDOR',
        tenantId: 'vnd-1',
        code: 'WH-INACTIVE',
        name: 'Inactive Warehouse',
        type: 'VENDOR_WAREHOUSE',
        status: 'INACTIVE',
        vendorId: 'vnd-1',
      },
    ]);

    // Seed seller listings
    await listingRepo.save([
      { id: 'lst-res-1', variantId: 'var-honey-500g', vendorId: 'vnd-1', isAvailable: true },
      { id: 'lst-res-2', variantId: 'var-honey-1kg', vendorId: 'vnd-1', isAvailable: true },
    ]);

    // Seed balances
    await balRepo.save([
      {
        id: 'bal-res-1',
        locationId: 'loc-test-wh1',
        sellerListingId: 'lst-res-1',
        variantId: 'var-honey-500g',
        vendorId: 'vnd-1',
        onHand: 10,
        reserved: 0,
        damaged: 0,
        safetyStock: 0,
      },
      {
        id: 'bal-res-2',
        locationId: 'loc-test-wh1',
        sellerListingId: 'lst-res-2',
        variantId: 'var-honey-1kg',
        vendorId: 'vnd-1',
        onHand: 5,
        reserved: 0,
        damaged: 0,
        safetyStock: 0,
      },
      {
        id: 'bal-res-darkstore',
        locationId: 'loc-test-darkstore1',
        sellerListingId: 'lst-res-1',
        variantId: 'var-honey-500g',
        vendorId: 'vnd-1',
        shopId: 'shp-1',
        onHand: 20,
        reserved: 0,
        damaged: 0,
        safetyStock: 2,
      },
      {
        id: 'bal-res-inactive',
        locationId: 'loc-test-inactive',
        sellerListingId: 'lst-res-1',
        variantId: 'var-honey-500g',
        vendorId: 'vnd-1',
        onHand: 100,
        reserved: 0,
        damaged: 0,
        safetyStock: 0,
      },
    ]);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Idempotency & Creation Validation', () => {
    it('should reject reservation creation without Idempotency-Key with 400 IDEMPOTENCY_KEY_REQUIRED', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/inventory/reservations')
        .set('Authorization', `Bearer ${customer1Token}`)
        .send({
          items: [{ balanceId: 'bal-res-1', quantity: 2 }],
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('IDEMPOTENCY_KEY_REQUIRED');
    });

    it('should create an active reservation with cryptographically safe UUID token when valid', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/inventory/reservations')
        .set('Authorization', `Bearer ${customer1Token}`)
        .set('Idempotency-Key', `ik-res-create-1-${Date.now()}`)
        .send({
          items: [{ balanceId: 'bal-res-1', quantity: 2 }],
          ttlSeconds: 900,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.reservationToken).toMatch(/^RES-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      expect(res.body.data.customerId).toBe('cust-user-1');
      expect(res.body.data.status).toBe('ACTIVE');

      // Verify DB stock reserved incremented
      const bal = await app.get('InventoryBalanceRepository').findOne({ where: { id: 'bal-res-1' } });
      expect(bal.reserved).toBe(2);
    });

    it('should replay original cached response when retried with SAME Idempotency-Key', async () => {
      const ik = `ik-res-retry-test-${Date.now()}`;
      const payload = { items: [{ balanceId: 'bal-res-1', quantity: 1 }] };

      const res1 = await request(app.getHttpServer())
        .post('/api/v1/inventory/reservations')
        .set('Authorization', `Bearer ${customer1Token}`)
        .set('Idempotency-Key', ik)
        .send(payload);

      expect(res1.status).toBe(201);
      const token1 = res1.body.data.reservationToken;

      const res2 = await request(app.getHttpServer())
        .post('/api/v1/inventory/reservations')
        .set('Authorization', `Bearer ${customer1Token}`)
        .set('Idempotency-Key', ik)
        .send(payload);

      expect(res2.status).toBe(201);
      expect(res2.body.data.reservationToken).toBe(token1);
    });

    it('should canonicalize duplicate balanceId line items into a single combined quantity', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/inventory/reservations')
        .set('Authorization', `Bearer ${customer1Token}`)
        .set('Idempotency-Key', `ik-res-canon-${Date.now()}`)
        .send({
          items: [
            { balanceId: 'bal-res-2', quantity: 1 },
            { balanceId: 'bal-res-2', quantity: 2 },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.data.items.length).toBe(1);
      expect(res.body.data.items[0].quantity).toBe(3);

      const bal = await app.get('InventoryBalanceRepository').findOne({ where: { id: 'bal-res-2' } });
      expect(bal.reserved).toBe(3);
    });

    it('should reject reservation targeting INACTIVE location with 400 LOCATION_NOT_ELIGIBLE_FOR_RESERVATION', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/inventory/reservations')
        .set('Authorization', `Bearer ${customer1Token}`)
        .set('Idempotency-Key', `ik-res-inact-${Date.now()}`)
        .send({
          items: [{ balanceId: 'bal-res-inactive', quantity: 1 }],
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('LOCATION_NOT_ELIGIBLE_FOR_RESERVATION');
    });

    it('should reject reservation when quantity exceeds available stock with 400 INSUFFICIENT_INVENTORY', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/inventory/reservations')
        .set('Authorization', `Bearer ${customer1Token}`)
        .set('Idempotency-Key', `ik-res-exceed-${Date.now()}`)
        .send({
          items: [{ balanceId: 'bal-res-1', quantity: 100 }],
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('INSUFFICIENT_INVENTORY');
    });
  });

  describe('2. All-Or-Nothing Transactional Multi-Line Rollback', () => {
    it('should roll back entire reservation batch if any single line item lacks stock', async () => {
      const bal1Before = await app.get('InventoryBalanceRepository').findOne({ where: { id: 'bal-res-1' } });

      const res = await request(app.getHttpServer())
        .post('/api/v1/inventory/reservations')
        .set('Authorization', `Bearer ${customer1Token}`)
        .set('Idempotency-Key', `ik-res-multi-fail-${Date.now()}`)
        .send({
          items: [
            { balanceId: 'bal-res-1', quantity: 1 },
            { balanceId: 'bal-res-2', quantity: 999 }, // Excessive
          ],
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('INSUFFICIENT_INVENTORY');

      // Verify bal-res-1 reserved stock remains UNCHANGED
      const bal1After = await app.get('InventoryBalanceRepository').findOne({ where: { id: 'bal-res-1' } });
      expect(bal1After.reserved).toBe(bal1Before.reserved);
    });
  });

  describe('3. Concurrency & Last-Unit Race Conditions', () => {
    it('should allow exactly ONE customer to succeed when two race for the last unit', async () => {
      // Create a fresh test balance with exactly 1 available unit
      const listingRepo = app.get('SellerListingRepository');
      await listingRepo.save({
        id: 'lst-race-last-unit',
        variantId: 'var-race-1',
        vendorId: 'vnd-1',
        isAvailable: true,
      });

      const balRepo = app.get('InventoryBalanceRepository');
      await balRepo.save({
        id: 'bal-race-last-unit',
        locationId: 'loc-test-wh1',
        sellerListingId: 'lst-race-last-unit',
        variantId: 'var-race-1',
        vendorId: 'vnd-1',
        onHand: 1,
        reserved: 0,
        damaged: 0,
        safetyStock: 0,
      });

      const res1 = await request(app.getHttpServer())
        .post('/api/v1/inventory/reservations')
        .set('Authorization', `Bearer ${customer1Token}`)
        .set('Idempotency-Key', `ik-race-cust1-${Date.now()}`)
        .send({ items: [{ balanceId: 'bal-race-last-unit', quantity: 1 }] });

      const res2 = await request(app.getHttpServer())
        .post('/api/v1/inventory/reservations')
        .set('Authorization', `Bearer ${customer2Token}`)
        .set('Idempotency-Key', `ik-race-cust2-${Date.now()}`)
        .send({ items: [{ balanceId: 'bal-race-last-unit', quantity: 1 }] });

      const statuses = [res1.status, res2.status].sort();
      expect(statuses).toEqual([201, 400]);

      const failedRes = res1.status === 400 ? res1 : res2;
      expect(failedRes.body.error.code).toBe('INSUFFICIENT_INVENTORY');

      const balFinal = await balRepo.findOne({ where: { id: 'bal-race-last-unit' } });
      expect(balFinal.reserved).toBe(1);
    });
  });

  describe('4. Pre-Mutation Ownership & Release Invariants', () => {
    it('should reject Customer 2 attempting to release Customer 1 reservation with 403 FORBIDDEN before state mutation', async () => {
      // Create reservation as Customer 1
      const createRes = await request(app.getHttpServer())
        .post('/api/v1/inventory/reservations')
        .set('Authorization', `Bearer ${customer1Token}`)
        .set('Idempotency-Key', `ik-own-rel-${Date.now()}`)
        .send({ items: [{ balanceId: 'bal-res-darkstore', quantity: 2 }] });

      const token = createRes.body.data.reservationToken;

      // Customer 2 attempts to release Customer 1's reservation
      const relRes = await request(app.getHttpServer())
        .post(`/api/v1/inventory/reservations/${token}/release`)
        .set('Authorization', `Bearer ${customer2Token}`)
        .send({ reason: 'MALICIOUS_RELEASE' });

      expect(relRes.status).toBe(403);

      // Verify reservation remains ACTIVE and reserved stock unchanged
      const getRes = await request(app.getHttpServer())
        .get(`/api/v1/inventory/reservations/${token}`)
        .set('Authorization', `Bearer ${customer1Token}`);

      expect(getRes.body.data.status).toBe('ACTIVE');
    });

    it('should release active reservation and free reserved stock exactly ONCE', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/api/v1/inventory/reservations')
        .set('Authorization', `Bearer ${customer1Token}`)
        .set('Idempotency-Key', `ik-rel-once-${Date.now()}`)
        .send({ items: [{ balanceId: 'bal-res-darkstore', quantity: 2 }] });

      const token = createRes.body.data.reservationToken;
      const balBefore = await app.get('InventoryBalanceRepository').findOne({ where: { id: 'bal-res-darkstore' } });

      // First release succeeds
      const rel1 = await request(app.getHttpServer())
        .post(`/api/v1/inventory/reservations/${token}/release`)
        .set('Authorization', `Bearer ${customer1Token}`)
        .send({ reason: 'USER_CANCELLED' });

      expect(rel1.status).toBe(200);
      expect(rel1.body.data.status).toBe('RELEASED');

      const balAfter = await app.get('InventoryBalanceRepository').findOne({ where: { id: 'bal-res-darkstore' } });
      expect(balAfter.reserved).toBe(balBefore.reserved - 2);

      // Second release fails with 409 INVALID_RESERVATION_STATE and does NOT decrement reserved stock again
      const rel2 = await request(app.getHttpServer())
        .post(`/api/v1/inventory/reservations/${token}/release`)
        .set('Authorization', `Bearer ${customer1Token}`)
        .send({ reason: 'RETRY_CANCEL' });

      expect(rel2.status).toBe(409);
      expect(rel2.body.error.code).toBe('INVALID_RESERVATION_STATE');

      const balFinal = await app.get('InventoryBalanceRepository').findOne({ where: { id: 'bal-res-darkstore' } });
      expect(balFinal.reserved).toBe(balAfter.reserved);
    });
  });

  describe('5. RBAC & Consumption Invariants', () => {
    it('should reject CUSTOMER role attempting to directly call consume with 403 FORBIDDEN', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/api/v1/inventory/reservations')
        .set('Authorization', `Bearer ${customer1Token}`)
        .set('Idempotency-Key', `ik-cust-consume-${Date.now()}`)
        .send({ items: [{ balanceId: 'bal-res-darkstore', quantity: 1 }] });

      const token = createRes.body.data.reservationToken;

      const consumeRes = await request(app.getHttpServer())
        .post(`/api/v1/inventory/reservations/${token}/consume`)
        .set('Authorization', `Bearer ${customer1Token}`);

      expect(consumeRes.status).toBe(403);
    });

    it('should allow SUPER_ADMIN to consume an active reservation, decrementing onHand and reserved stock', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/api/v1/inventory/reservations')
        .set('Authorization', `Bearer ${customer1Token}`)
        .set('Idempotency-Key', `ik-admin-consume-${Date.now()}`)
        .send({ items: [{ balanceId: 'bal-res-darkstore', quantity: 1 }] });

      const token = createRes.body.data.reservationToken;
      const balBefore = await app.get('InventoryBalanceRepository').findOne({ where: { id: 'bal-res-darkstore' } });

      const consumeRes = await request(app.getHttpServer())
        .post(`/api/v1/inventory/reservations/${token}/consume`)
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(consumeRes.status).toBe(200);
      expect(consumeRes.body.data.status).toBe('CONSUMED');

      const balAfter = await app.get('InventoryBalanceRepository').findOne({ where: { id: 'bal-res-darkstore' } });
      expect(balAfter.onHand).toBe(balBefore.onHand - 1);
      expect(balAfter.reserved).toBe(balBefore.reserved - 1);
    });
  });

  describe('6. Expiration & Multi-Worker Sweeper Safety', () => {
    it('should reject consume call on expired ACTIVE reservation with 400 RESERVATION_EXPIRED and trigger lazy expiration', async () => {
      const resRepo = app.get('InventoryReservationRepository');
      const itemRepo = app.get('InventoryReservationItemRepository');
      const balRepo = app.get('InventoryBalanceRepository');

      // Create an expired active reservation manually (10 minutes in the past)
      const pastDate = new Date(Date.now() - 600000);
      const expiredRes = await resRepo.save({
        reservationToken: `RES-EXPIRED-${Date.now()}`,
        customerId: 'cust-user-1',
        status: 'ACTIVE',
        ttlSeconds: 60,
        expiresAt: pastDate,
      });

      const fetched = await resRepo.findOne({ where: { id: expiredRes.id } });
      process.stderr.write(`FETCHED ROW: status=${fetched.status}, expiresAt=${fetched.expiresAt} (${typeof fetched.expiresAt})\n`);

      await itemRepo.save({
        reservationId: expiredRes.id,
        balanceId: 'bal-res-darkstore',
        quantity: 1,
      });

      // Increment reserved stock to simulate active reservation
      await balRepo.query('UPDATE inventory_balances SET reserved = reserved + 1 WHERE id = "bal-res-darkstore"');
      const balBefore = await balRepo.findOne({ where: { id: 'bal-res-darkstore' } });

      const consumeRes = await request(app.getHttpServer())
        .post(`/api/v1/inventory/reservations/${expiredRes.id}/consume`)
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(consumeRes.status).toBe(400);
      expect(consumeRes.body.error.code).toBe('RESERVATION_EXPIRED');

      // Verify lazy expiration transitioned reservation to EXPIRED and freed reserved stock
      const checkRes = await resRepo.findOne({ where: { id: expiredRes.id } });
      expect(checkRes.status).toBe('EXPIRED');

      const balAfter = await balRepo.findOne({ where: { id: 'bal-res-darkstore' } });
      expect(balAfter.reserved).toBe(balBefore.reserved - 1);
    });

    it('should process multi-worker sweeper execution safely freeing stock exactly once', async () => {
      const resRepo = app.get('InventoryReservationRepository');
      const itemRepo = app.get('InventoryReservationItemRepository');
      const balRepo = app.get('InventoryBalanceRepository');

      const pastDate = new Date(Date.now() - 600000);
      const expiredRes = await resRepo.save({
        reservationToken: `RES-SWEEP-${Date.now()}`,
        customerId: 'cust-user-1',
        status: 'ACTIVE',
        ttlSeconds: 60,
        expiresAt: pastDate,
      });

      await itemRepo.save({
        reservationId: expiredRes.id,
        balanceId: 'bal-res-darkstore',
        quantity: 2,
      });

      await balRepo.query('UPDATE inventory_balances SET reserved = reserved + 2 WHERE id = "bal-res-darkstore"');
      const balBefore = await balRepo.findOne({ where: { id: 'bal-res-darkstore' } });

      // Simulate two concurrent sweeper calls
      const worker1 = inventoryService.sweepExpiredReservations();
      const worker2 = inventoryService.sweepExpiredReservations();

      const [res1, res2] = await Promise.all([worker1, worker2]);

      const totalSwept = res1.sweptCount + res2.sweptCount;
      expect(totalSwept).toBe(1);

      const balAfter = await balRepo.findOne({ where: { id: 'bal-res-darkstore' } });
      expect(balAfter.reserved).toBe(balBefore.reserved - 2);
    });
  });

  describe('7. Quick-Commerce & Location Isolation', () => {
    it('should reserve stock for a specific Flado darkstore location', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/inventory/reservations')
        .set('Authorization', `Bearer ${customer1Token}`)
        .set('Idempotency-Key', `ik-flado-res-${Date.now()}`)
        .send({
          items: [{ balanceId: 'bal-res-darkstore', quantity: 1 }],
          ttlSeconds: 600,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.reservationToken).toBeDefined();
    });
  });
});
