import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../src/auth/roles';
import { DataSource } from 'typeorm';
import {
  User,
  Vendor,
  Category,
  Product,
  ProductVariant,
  SellerListing,
  InventoryLocation,
  Coupon,
  Promotion,
  SellerListingPriceOverride,
  Order,
} from '../src/database/entities';

describe('CMD-014 — Price Engine (E2E)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  let superAdminToken: string;
  let customerToken: string;
  let vendorAToken: string;
  let vendorBToken: string;

  let vendorAId: string;
  let vendorBId: string;
  let locationAId: string;
  let locationBId: string;

  let categoryId: string;
  let productId: string;
  let variantId: string;

  let listingAId: string;
  let listingBId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);

    // Clean tables before running tests
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.query('DELETE FROM "seller_listing_price_overrides"');
    await queryRunner.query('DELETE FROM "promotions"');
    await queryRunner.query('DELETE FROM "order_items"');
    await queryRunner.query('DELETE FROM "orders"');
    await queryRunner.query('DELETE FROM "inventory_reservation_items"');
    await queryRunner.query('DELETE FROM "inventory_reservations"');
    await queryRunner.query('DELETE FROM "inventory_balances"');
    await queryRunner.query('DELETE FROM "inventory_locations"');
    await queryRunner.query('DELETE FROM "seller_listings"');
    await queryRunner.query('DELETE FROM "product_variants"');
    await queryRunner.query('DELETE FROM "products"');
    await queryRunner.query('DELETE FROM "categories"');
    await queryRunner.query('DELETE FROM "coupons"');
    await queryRunner.query('DELETE FROM "vendors"');
    await queryRunner.query('DELETE FROM "users"');
    await queryRunner.release();

    const userRepo = dataSource.getRepository(User);
    const vendorRepo = dataSource.getRepository(Vendor);
    const locRepo = dataSource.getRepository(InventoryLocation);
    const catRepo = dataSource.getRepository(Category);
    const prodRepo = dataSource.getRepository(Product);
    const varRepo = dataSource.getRepository(ProductVariant);
    const listingRepo = dataSource.getRepository(SellerListing);
    const jwtService = moduleFixture.get(JwtService);

    // 1. Seed Users
    const adminUser = await userRepo.save(
      userRepo.create({
        id: 'usr-price-admin',
        email: 'priceadmin@auramart.com',
        fullName: 'Price Admin',
        role: Role.SUPER_ADMIN,
      }),
    );
    superAdminToken = jwtService.sign({ sub: adminUser.id, email: adminUser.email, role: adminUser.role });

    const custUser = await userRepo.save(
      userRepo.create({
        id: 'usr-price-customer',
        email: 'pricecustomer@auramart.com',
        fullName: 'Price Customer',
        role: Role.CUSTOMER,
      }),
    );
    customerToken = jwtService.sign({ sub: custUser.id, email: custUser.email, role: custUser.role });

    const vendAUser = await userRepo.save(
      userRepo.create({
        id: 'usr-vendor-a',
        email: 'vendora@auramart.com',
        fullName: 'Vendor A Owner',
        role: Role.VENDOR_OWNER,
      }),
    );
    vendorAToken = jwtService.sign({ sub: vendAUser.id, email: vendAUser.email, role: vendAUser.role });

    const vendBUser = await userRepo.save(
      userRepo.create({
        id: 'usr-vendor-b',
        email: 'vendorb@auramart.com',
        fullName: 'Vendor B Owner',
        role: Role.VENDOR_OWNER,
      }),
    );
    vendorBToken = jwtService.sign({ sub: vendBUser.id, email: vendBUser.email, role: vendBUser.role });

    // 2. Seed Vendors
    const vendorA = await vendorRepo.save(
      vendorRepo.create({
        id: 'vnd-price-a',
        userId: vendAUser.id,
        storeName: 'Vendor A Store',
        slug: 'vendor-a-store',
        status: 'APPROVED',
      } as any),
    );
    vendorAId = (vendorA as any).id;

    const vendorB = await vendorRepo.save(
      vendorRepo.create({
        id: 'vnd-price-b',
        userId: vendBUser.id,
        storeName: 'Vendor B Store',
        slug: 'vendor-b-store',
        status: 'APPROVED',
      } as any),
    );
    vendorBId = (vendorB as any).id;

    // 3. Seed Locations
    const locA = await locRepo.save(
      locRepo.create({
        id: 'loc-price-a',
        name: 'Vendor A Warehouse',
        code: 'LOC-VEND-A',
        type: 'VENDOR_WAREHOUSE' as const,
        vendorId: vendorAId,
        status: 'ACTIVE',
      }),
    );
    locationAId = locA.id;

    const locB = await locRepo.save(
      locRepo.create({
        id: 'loc-price-b',
        name: 'Vendor B Warehouse',
        code: 'LOC-VEND-B',
        type: 'VENDOR_WAREHOUSE' as const,
        vendorId: vendorBId,
        status: 'ACTIVE',
      }),
    );
    locationBId = locB.id;

    // 4. Seed Catalog Items
    const category = await catRepo.save({
      id: 'cat-electronics',
      name: 'Electronics',
      slug: 'electronics',
    });
    categoryId = category.id;

    const product = await prodRepo.save({
      id: 'prod-watch',
      title: 'Smart Watch',
      slug: 'smart-watch',
      categoryId,
      vendorId: vendorAId,
      taxClass: 'STANDARD',
      basePrice: 150.0,
    });
    productId = product.id;

    const variant = await varRepo.save({
      id: 'var-watch-black',
      productId,
      sku: 'SKU-WATCH-001',
      title: 'Black Edition',
      referenceMsrp: 200.0,
    });
    variantId = variant.id;

    // 5. Seed Seller Listings for Vendor A and Vendor B on same variant
    const listingA = await listingRepo.save({
      id: 'lst-price-a',
      variantId,
      vendorId: vendorAId,
      priceMinor: 15000, // ₹150.00
      compareAtPriceMinor: 20000, // ₹200.00
      currency: 'INR',
      isAvailable: true,
    });
    listingAId = listingA.id;

    const listingB = await listingRepo.save({
      id: 'lst-price-b',
      variantId,
      vendorId: vendorBId,
      priceMinor: 14000, // ₹140.00 (Competitive pricing)
      currency: 'INR',
      isAvailable: true,
    });
    listingBId = listingB.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. BIGINT & Minor-Unit Serialization', () => {
    it('should store and convert BIGINT values safely without precision loss', async () => {
      const res = await request(app.getHttpServer())
        .post('/pricing/calculate')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          items: [{ sellerListingId: listingAId, quantity: 2 }],
        });

      expect(res.status).toBe(201);
      expect(res.body.items[0].basePriceMinor).toBe(15000);
      expect(res.body.items[0].lineSubtotalMinor).toBe(30000);
      expect(res.body.summary.itemsSubtotalMinor).toBe(30000);
      expect(res.body.summary.formattedFinalTotal).toBe('300.00');
    });
  });

  describe('2. Tax-Inclusive vs Tax-Exclusive Behavior & Rounding', () => {
    it('should correctly extract tax for tax-inclusive pricing without zero-sum discrepancy', async () => {
      const res = await request(app.getHttpServer())
        .post('/pricing/calculate')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          items: [{ sellerListingId: listingAId, quantity: 1 }],
          isTaxInclusive: true, // Standard 5% GST tax-inclusive
        });

      expect(res.status).toBe(201);
      const item = res.body.items[0];
      // lineSubtotal = 15000. 5% GST. taxable = Math.round((15000 * 10000) / 10500) = 14286. tax = 15000 - 14286 = 714.
      expect(item.taxableSubtotalMinor).toBe(14286);
      expect(item.taxAmountMinor).toBe(714);
      expect(item.taxableSubtotalMinor + item.taxAmountMinor).toBe(item.lineSubtotalMinor);
    });

    it('should correctly compute tax for tax-exclusive pricing', async () => {
      const res = await request(app.getHttpServer())
        .post('/pricing/calculate')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          items: [{ sellerListingId: listingAId, quantity: 1 }],
          isTaxInclusive: false,
        });

      expect(res.status).toBe(201);
      const item = res.body.items[0];
      // lineSubtotal = 15000. 5% GST = 750. finalTotal = 15000 + 750 = 15750.
      expect(item.taxAmountMinor).toBe(750);
      expect(res.body.summary.finalTotalMinor).toBe(15750);
    });
  });

  describe('3. Single Timestamp & Deterministic Rounding', () => {
    it('should use single pricingInstant consistently across multi-item calculation', async () => {
      const fixedInstant = '2026-08-05T12:00:00.000Z';
      const res = await request(app.getHttpServer())
        .post('/pricing/calculate')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          items: [
            { sellerListingId: listingAId, quantity: 1 },
            { sellerListingId: listingBId, quantity: 1 },
          ],
          pricingInstant: fixedInstant,
        });

      expect(res.status).toBe(201);
      expect(res.body.pricingInstant).toBe(fixedInstant);
      expect(res.body.pricingSnapshotHash).toBeDefined();
    });
  });

  describe('4. Tenant & Vendor Authorization Enforcement', () => {
    it('should reject Vendor A attempting to set price override on Vendor B listing', async () => {
      const res = await request(app.getHttpServer())
        .post(`/pricing/seller-listings/${listingBId}/override`)
        .set('Authorization', `Bearer ${vendorAToken}`)
        .set('x-idempotency-key', 'IDEMP-OVERRIDE-ERR-001')
        .send({
          sellerListingId: listingBId,
          priceMinor: 12000,
        });

      expect(res.status).toBe(403);
    });

    it('should reject Vendor A attempting to create promotion targeting Vendor B listing', async () => {
      const res = await request(app.getHttpServer())
        .post('/pricing/promotions')
        .set('Authorization', `Bearer ${vendorAToken}`)
        .send({
          title: 'Illegal Promo',
          type: 'SELLER_PROMO',
          discountType: 'FLAT_AMOUNT',
          discountValue: 2000,
          startsAt: '2026-08-01T00:00:00Z',
          endsAt: '2026-08-30T00:00:00Z',
          targetType: 'SELLER_LISTING',
          targetId: listingBId,
        });

      expect(res.status).toBe(403);
    });

    it('should reject location price override on incompatible tenant location', async () => {
      const res = await request(app.getHttpServer())
        .post(`/pricing/seller-listings/${listingAId}/override`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .set('x-idempotency-key', 'IDEMP-OVERRIDE-ERR-002')
        .send({
          sellerListingId: listingAId,
          locationId: locationBId, // Location B belongs to Vendor B, while Listing A belongs to Vendor A
          priceMinor: 13000,
        });

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('INCOMPATIBLE_LOCATION_PRICE_OVERRIDE');
    });

    it('should allow Vendor A to set price override on their own listing and compatible location', async () => {
      const res = await request(app.getHttpServer())
        .post(`/pricing/seller-listings/${listingAId}/override`)
        .set('Authorization', `Bearer ${vendorAToken}`)
        .set('x-idempotency-key', 'IDEMP-OVERRIDE-OK-001')
        .send({
          sellerListingId: listingAId,
          locationId: locationAId,
          priceMinor: 13500, // ₹135.00 override
        });

      expect(res.status).toBe(201);
      expect(res.body.priceMinor).toBe(13500);
    });
  });

  describe('5. Read-Only Coupon Evaluation & Order Redemption Boundary', () => {
    let couponCode = 'SAVE1000';

    beforeAll(async () => {
      await dataSource.getRepository(Coupon).save({
        code: couponCode,
        description: 'Save 1000 paise',
        discountPercent: 0,
        type: 'FLAT',
        value: 10.0,
        valueMinor: 1000,
        minOrderAmount: 100.0,
        minOrderAmountMinor: 10000,
        maxUses: 5,
        usedCount: 0,
        isRedeemed: false,
      });
    });

    it('should evaluate coupon in POST /pricing/calculate WITHOUT incrementing usedCount', async () => {
      const calcRes = await request(app.getHttpServer())
        .post('/pricing/calculate')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          items: [{ sellerListingId: listingAId, quantity: 1 }],
          couponCode,
        });

      expect(calcRes.status).toBe(201);
      expect(calcRes.body.summary.couponDiscountMinor).toBe(1000);

      // Verify DB coupon usedCount remains 0
      const couponInDb = await dataSource.getRepository(Coupon).findOne({ where: { code: couponCode } });
      expect(couponInDb?.usedCount).toBe(0);
    });

    it('should redeem coupon atomically when creating order in OrdersService.create', async () => {
      const orderRes = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          items: [
            {
              sellerListingId: listingAId,
              productId,
              variantId,
              quantity: 1,
            },
          ],
          couponCode,
          shippingAddress: '123 Test Street',
          billingAddress: '123 Test Street',
          paymentMethod: 'COD',
        });

      expect(orderRes.status).toBe(201);
      expect(orderRes.body.discountAmountMinor).toBe(1000);

      // Verify DB coupon usedCount incremented to 1
      const couponInDb = await dataSource.getRepository(Coupon).findOne({ where: { code: couponCode } });
      expect(couponInDb?.usedCount).toBe(1);
    });
  });

  describe('6. Promotion Precedence & Tie Determinism', () => {
    it('should select promotion yielding maximum savings and break ties by priority DESC', async () => {
      // Create Promo 1: 10% off (Savings = 1500 minor)
      await dataSource.getRepository(Promotion).save({
        title: 'Promo 10%',
        type: 'FLASH_SALE',
        discountType: 'PERCENT',
        discountValue: 1000, // 10%
        startsAt: new Date('2026-08-01'),
        endsAt: new Date('2026-08-30'),
        surface: 'ALL',
        targetType: 'ALL',
        priority: 1,
        isActive: true,
      });

      // Create Promo 2: Flat 2000 minor off (Savings = 2000 minor -> HIGHER SAVINGS)
      await dataSource.getRepository(Promotion).save({
        title: 'Promo 2000 Flat',
        type: 'FLASH_SALE',
        discountType: 'FLAT_AMOUNT',
        discountValue: 2000, // ₹20.00
        startsAt: new Date('2026-08-01'),
        endsAt: new Date('2026-08-30'),
        surface: 'ALL',
        targetType: 'ALL',
        priority: 0,
        isActive: true,
      });

      const res = await request(app.getHttpServer())
        .post('/pricing/calculate')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          items: [{ sellerListingId: listingBId, quantity: 1 }], // Base price = 14000
        });

      expect(res.status).toBe(201);
      expect(res.body.appliedRules.length).toBe(1);
      expect(res.body.appliedRules[0].title).toBe('Promo 2000 Flat');
      expect(res.body.items[0].effectiveUnitPriceMinor).toBe(12000);
    });
  });

  describe('7. Immutable Historical Order Pricing Snapshot', () => {
    it('should preserve historical order pricing snapshot after future promotion changes', async () => {
      // 1. Create order
      const orderRes = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          items: [{ sellerListingId: listingBId, productId, variantId, quantity: 1 }],
          shippingAddress: '123 Main St',
          billingAddress: '123 Main St',
          paymentMethod: 'COD',
        });

      expect(orderRes.status).toBe(201);
      const orderId = orderRes.body.id;
      const initialTotalMinor = orderRes.body.totalAmountMinor;

      // 2. Change active promotions and listing base price
      await dataSource.getRepository(SellerListing).update({ id: listingBId }, { priceMinor: 99000 });
      await dataSource.getRepository(Promotion).update({}, { isActive: false });

      // 3. Fetch order from DB and verify pricing snapshot remains unchanged
      const savedOrder = await dataSource.getRepository(Order).findOne({ where: { id: orderId } });
      expect(savedOrder?.totalAmountMinor).toBe(initialTotalMinor);
      expect(savedOrder?.pricingSnapshotJson).toBeDefined();
      const snapshot = JSON.parse(savedOrder?.pricingSnapshotJson || '{}');
      expect(snapshot.summary.finalTotalMinor).toBe(initialTotalMinor);
    });
  });

  describe('8. Rejection of Client-Submitted Price Overrides', () => {
    it('should ignore client-submitted totalAmount and unitPrice during order creation', async () => {
      const orderRes = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          items: [
            {
              sellerListingId: listingBId,
              productId,
              variantId,
              quantity: 1,
              unitPrice: 1.0, // Client tries to pay ₹1.00
            },
          ],
          totalAmount: 1.0, // Client tries to set order total to ₹1.00
          shippingAddress: '123 Main St',
          billingAddress: '123 Main St',
          paymentMethod: 'COD',
        });

      expect(orderRes.status).toBe(201);
      // Backend must calculate price from listingB (price 99000 paise = ₹990.00)
      expect(orderRes.body.totalAmountMinor).toBe(99000);
      expect(orderRes.body.totalAmount).toBe(990.0);
    });
  });
});
