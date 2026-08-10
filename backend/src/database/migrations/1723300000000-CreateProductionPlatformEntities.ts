import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductionPlatformEntities1723300000000
  implements MigrationInterface
{
  name = 'CreateProductionPlatformEntities1723300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create stock_history table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "stock_history" (
        "id" varchar PRIMARY KEY NOT NULL,
        "inventoryId" varchar NOT NULL,
        "vendorId" varchar NOT NULL,
        "variantId" varchar,
        "shopId" varchar,
        "adjustmentType" varchar NOT NULL,
        "previousQuantity" integer NOT NULL DEFAULT (0),
        "newQuantity" integer NOT NULL DEFAULT (0),
        "deltaQuantity" integer NOT NULL DEFAULT (0),
        "reasonNote" text,
        "actorUserId" varchar,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now'))
      );
    `);

    // 2. Create price_history table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "price_history" (
        "id" varchar PRIMARY KEY NOT NULL,
        "productId" varchar NOT NULL,
        "variantId" varchar NOT NULL,
        "vendorId" varchar NOT NULL,
        "previousPriceMinor" bigint NOT NULL DEFAULT (0),
        "newPriceMinor" bigint NOT NULL DEFAULT (0),
        "previousCompareAtPriceMinor" bigint,
        "newCompareAtPriceMinor" bigint,
        "promoStartDate" datetime,
        "promoEndDate" datetime,
        "reasonNote" text,
        "actorUserId" varchar,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now'))
      );
    `);

    // 3. Create vendor_settlement_ledger table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "vendor_settlement_ledger" (
        "id" varchar PRIMARY KEY NOT NULL,
        "vendorId" varchar NOT NULL,
        "sourceType" varchar NOT NULL,
        "sourceId" varchar NOT NULL,
        "grossAmountMinor" bigint NOT NULL DEFAULT (0),
        "commissionAmountMinor" bigint NOT NULL DEFAULT (0),
        "taxWithholdingMinor" bigint NOT NULL DEFAULT (0),
        "netAmountMinor" bigint NOT NULL DEFAULT (0),
        "direction" varchar NOT NULL DEFAULT ('CREDIT'),
        "currency" varchar NOT NULL DEFAULT ('INR'),
        "description" text,
        "payoutId" varchar,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now'))
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_vendor_settlement_vendor" ON "vendor_settlement_ledger" ("vendorId");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_vendor_settlement_source" ON "vendor_settlement_ledger" ("sourceId");
    `);

    // 4. Create vendor_payouts table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "vendor_payouts" (
        "id" varchar PRIMARY KEY NOT NULL,
        "vendorId" varchar NOT NULL,
        "amountMinor" bigint NOT NULL DEFAULT (0),
        "currency" varchar NOT NULL DEFAULT ('INR'),
        "status" varchar NOT NULL DEFAULT ('PENDING'),
        "periodStart" datetime,
        "periodEnd" datetime,
        "bankAccountNumberMasked" varchar,
        "bankIfsc" varchar,
        "failureReason" text,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_vendor_payouts_vendor" ON "vendor_payouts" ("vendorId");
    `);

    // 5. Create vendor_staff table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "vendor_staff" (
        "id" varchar PRIMARY KEY NOT NULL,
        "vendorId" varchar NOT NULL,
        "userId" varchar NOT NULL,
        "email" varchar NOT NULL,
        "vendorRole" varchar NOT NULL DEFAULT ('FULFILLMENT_STAFF'),
        "status" varchar NOT NULL DEFAULT ('ACTIVE'),
        "invitedByUserId" varchar,
        "assignedShopIdsJson" text,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now'))
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_vendor_staff_vendor" ON "vendor_staff" ("vendorId");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_vendor_staff_user" ON "vendor_staff" ("userId");
    `);

    // 6. Create vendor_invitations table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "vendor_invitations" (
        "id" varchar PRIMARY KEY NOT NULL,
        "vendorId" varchar NOT NULL,
        "email" varchar NOT NULL,
        "vendorRole" varchar NOT NULL DEFAULT ('FULFILLMENT_STAFF'),
        "tokenHash" varchar NOT NULL,
        "status" varchar NOT NULL DEFAULT ('PENDING'),
        "expiresAt" datetime NOT NULL,
        "invitedByUserId" varchar NOT NULL,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now'))
      );
    `);

    // 7. Create vendor_activity_logs table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "vendor_activity_logs" (
        "id" varchar PRIMARY KEY NOT NULL,
        "vendorId" varchar NOT NULL,
        "actorUserId" varchar,
        "actorEmail" varchar,
        "action" varchar NOT NULL,
        "metadataJson" text,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now'))
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_vendor_activity_vendor" ON "vendor_activity_logs" ("vendorId");
    `);

    // 8. Create device_tokens & notification_preferences tables
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "device_tokens" (
        "id" varchar PRIMARY KEY NOT NULL,
        "userId" varchar NOT NULL,
        "token" varchar UNIQUE NOT NULL,
        "platform" varchar NOT NULL,
        "deviceModel" varchar,
        "isActive" boolean NOT NULL DEFAULT (1),
        "lastUsedAt" datetime NOT NULL DEFAULT (datetime('now')),
        "createdAt" datetime NOT NULL DEFAULT (datetime('now'))
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "notification_preferences" (
        "id" varchar PRIMARY KEY NOT NULL,
        "userId" varchar UNIQUE NOT NULL,
        "orderUpdates" boolean NOT NULL DEFAULT (1),
        "promotions" boolean NOT NULL DEFAULT (1),
        "merchantAlerts" boolean NOT NULL DEFAULT (1),
        "emailNotifications" boolean NOT NULL DEFAULT (1),
        "pushNotifications" boolean NOT NULL DEFAULT (1),
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "stock_history";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "price_history";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "vendor_settlement_ledger";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "vendor_payouts";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "vendor_staff";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "vendor_invitations";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "vendor_activity_logs";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "device_tokens";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "notification_preferences";`);
  }
}
