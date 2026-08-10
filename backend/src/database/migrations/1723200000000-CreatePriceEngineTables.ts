import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePriceEngineTables1723200000000
  implements MigrationInterface
{
  name = 'CreatePriceEngineTables1723200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create seller_listing_price_overrides table
    await queryRunner.query(`
      CREATE TABLE "seller_listing_price_overrides" (
        "id" varchar PRIMARY KEY NOT NULL,
        "sellerListingId" varchar NOT NULL,
        "locationId" varchar,
        "priceMinor" bigint NOT NULL,
        "compareAtPriceMinor" bigint,
        "startsAt" datetime,
        "endsAt" datetime,
        "status" varchar NOT NULL DEFAULT ('ACTIVE'),
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
      );
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_seller_listing_location_override" 
      ON "seller_listing_price_overrides" ("sellerListingId", "locationId");
    `);

    // 2. Create promotions table
    await queryRunner.query(`
      CREATE TABLE "promotions" (
        "id" varchar PRIMARY KEY NOT NULL,
        "title" varchar NOT NULL,
        "type" varchar NOT NULL,
        "discountType" varchar NOT NULL,
        "discountValue" integer NOT NULL,
        "startsAt" datetime NOT NULL,
        "endsAt" datetime NOT NULL,
        "surface" varchar NOT NULL DEFAULT ('ALL'),
        "targetType" varchar NOT NULL DEFAULT ('ALL'),
        "targetId" varchar,
        "vendorId" varchar,
        "priority" integer NOT NULL DEFAULT (0),
        "isActive" boolean NOT NULL DEFAULT (1),
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_promotions_window" 
      ON "promotions" ("isActive", "startsAt", "endsAt");
    `);

    // 3. Create tax_categories table
    await queryRunner.query(`
      CREATE TABLE "tax_categories" (
        "id" varchar PRIMARY KEY NOT NULL,
        "code" varchar UNIQUE NOT NULL,
        "name" varchar NOT NULL,
        "rateBasisPoints" integer NOT NULL DEFAULT (0),
        "createdAt" datetime NOT NULL DEFAULT (datetime('now'))
      );
    `);

    // Seed default Tax Categories
    await queryRunner.query(`
      INSERT INTO "tax_categories" ("id", "code", "name", "rateBasisPoints") VALUES
      ('tax-std', 'STANDARD', 'Standard Rate GST/VAT', 500),
      ('tax-zero', 'ZERO', 'Zero Rated', 0),
      ('tax-exempt', 'EXEMPT', 'Exempt', 0);
    `);

    // 4. Add minor-unit money columns to seller_listings
    await queryRunner.query(`
      ALTER TABLE "seller_listings" ADD COLUMN "priceMinor" bigint NOT NULL DEFAULT (0);
    `);
    await queryRunner.query(`
      ALTER TABLE "seller_listings" ADD COLUMN "compareAtPriceMinor" bigint;
    `);
    await queryRunner.query(`
      ALTER TABLE "seller_listings" ADD COLUMN "currency" varchar NOT NULL DEFAULT ('INR');
    `);

    // 5. Add minor-unit columns to coupons
    await queryRunner.query(`
      ALTER TABLE "coupons" ADD COLUMN "valueMinor" bigint NOT NULL DEFAULT (0);
    `);
    await queryRunner.query(`
      ALTER TABLE "coupons" ADD COLUMN "minOrderAmountMinor" bigint NOT NULL DEFAULT (0);
    `);
    await queryRunner.query(`
      ALTER TABLE "coupons" ADD COLUMN "maxDiscountAmountMinor" bigint;
    `);

    // Backfill coupon minor units from existing floats
    await queryRunner.query(`
      UPDATE "coupons" SET 
        "valueMinor" = CAST(ROUND("value" * 100) AS INTEGER),
        "minOrderAmountMinor" = CAST(ROUND("minOrderAmount" * 100) AS INTEGER);
    `);

    // 6. Add minor-unit columns & pricing snapshot JSON to orders
    await queryRunner.query(`
      ALTER TABLE "orders" ADD COLUMN "itemsSubtotalMinor" bigint NOT NULL DEFAULT (0);
    `);
    await queryRunner.query(`
      ALTER TABLE "orders" ADD COLUMN "discountAmountMinor" bigint NOT NULL DEFAULT (0);
    `);
    await queryRunner.query(`
      ALTER TABLE "orders" ADD COLUMN "taxAmountMinor" bigint NOT NULL DEFAULT (0);
    `);
    await queryRunner.query(`
      ALTER TABLE "orders" ADD COLUMN "feeAmountMinor" bigint NOT NULL DEFAULT (0);
    `);
    await queryRunner.query(`
      ALTER TABLE "orders" ADD COLUMN "totalAmountMinor" bigint NOT NULL DEFAULT (0);
    `);
    await queryRunner.query(`
      ALTER TABLE "orders" ADD COLUMN "pricingSnapshotJson" text;
    `);

    // 7. Add minor-unit columns to order_items
    await queryRunner.query(`
      ALTER TABLE "order_items" ADD COLUMN "unitPriceMinor" bigint NOT NULL DEFAULT (0);
    `);
    await queryRunner.query(`
      ALTER TABLE "order_items" ADD COLUMN "discountMinor" bigint NOT NULL DEFAULT (0);
    `);
    await queryRunner.query(`
      ALTER TABLE "order_items" ADD COLUMN "subtotalMinor" bigint NOT NULL DEFAULT (0);
    `);
    await queryRunner.query(`
      ALTER TABLE "order_items" ADD COLUMN "taxAmountMinor" bigint NOT NULL DEFAULT (0);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "seller_listing_price_overrides";`);
    await queryRunner.query(`DROP TABLE "promotions";`);
    await queryRunner.query(`DROP TABLE "tax_categories";`);
  }
}
