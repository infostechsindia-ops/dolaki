import { MigrationInterface, QueryRunner } from 'typeorm';

export class SyncOrderAndShopFulfillmentColumns1723400000000
  implements MigrationInterface
{
  name = 'SyncOrderAndShopFulfillmentColumns1723400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Add Quick-Commerce picking & rider handoff columns to orders table
    await queryRunner.query(`
      ALTER TABLE "orders" ADD COLUMN "pickerUserId" varchar;
    `);
    await queryRunner.query(`
      ALTER TABLE "orders" ADD COLUMN "pickerName" varchar;
    `);
    await queryRunner.query(`
      ALTER TABLE "orders" ADD COLUMN "pickingStatus" varchar NOT NULL DEFAULT ('NOT_STARTED');
    `);
    await queryRunner.query(`
      ALTER TABLE "orders" ADD COLUMN "pickingStartedAt" datetime;
    `);
    await queryRunner.query(`
      ALTER TABLE "orders" ADD COLUMN "pickingCompletedAt" datetime;
    `);

    await queryRunner.query(`
      ALTER TABLE "orders" ADD COLUMN "riderName" varchar;
    `);
    await queryRunner.query(`
      ALTER TABLE "orders" ADD COLUMN "riderPhone" varchar;
    `);
    await queryRunner.query(`
      ALTER TABLE "orders" ADD COLUMN "pickupOtpHash" varchar;
    `);
    await queryRunner.query(`
      ALTER TABLE "orders" ADD COLUMN "pickupOtpExpiresAt" datetime;
    `);
    await queryRunner.query(`
      ALTER TABLE "orders" ADD COLUMN "pickupOtpAttemptCount" integer NOT NULL DEFAULT (0);
    `);
    await queryRunner.query(`
      ALTER TABLE "orders" ADD COLUMN "pickupOtpLocked" boolean NOT NULL DEFAULT (0);
    `);
    await queryRunner.query(`
      ALTER TABLE "orders" ADD COLUMN "pickupOtpUsedAt" datetime;
    `);
    await queryRunner.query(`
      ALTER TABLE "orders" ADD COLUMN "handoffCompletedAt" datetime;
    `);

    // 2. Add Quick-Commerce picking & substitution columns to order_items table
    await queryRunner.query(`
      ALTER TABLE "order_items" ADD COLUMN "fulfillmentSourceId" varchar;
    `);
    await queryRunner.query(`
      ALTER TABLE "order_items" ADD COLUMN "substitutionPreference" varchar NOT NULL DEFAULT ('ALLOW_SUBSTITUTION');
    `);
    await queryRunner.query(`
      ALTER TABLE "order_items" ADD COLUMN "inventoryId" varchar;
    `);

    // 3. Add operational & fee columns to flado_shops table
    await queryRunner.query(`
      ALTER TABLE "flado_shops" ADD COLUMN "activeOrderCapacity" integer NOT NULL DEFAULT (15);
    `);
    await queryRunner.query(`
      ALTER TABLE "flado_shops" ADD COLUMN "minBasketAmountMinor" bigint NOT NULL DEFAULT (0);
    `);
    await queryRunner.query(`
      ALTER TABLE "flado_shops" ADD COLUMN "baseDeliveryFeeMinor" bigint NOT NULL DEFAULT (2500);
    `);
    await queryRunner.query(`
      ALTER TABLE "flado_shops" ADD COLUMN "isSurgeActive" boolean NOT NULL DEFAULT (0);
    `);
    await queryRunner.query(`
      ALTER TABLE "flado_shops" ADD COLUMN "surgeFeeMinor" bigint NOT NULL DEFAULT (0);
    `);

    // 4. Create shop_hours table if not exists
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "shop_hours" (
        "id" varchar PRIMARY KEY NOT NULL,
        "shopId" varchar NOT NULL,
        "dayOfWeek" integer NOT NULL,
        "openTime" varchar NOT NULL,
        "closeTime" varchar NOT NULL,
        "isOpen" boolean NOT NULL DEFAULT (1),
        "createdAt" datetime NOT NULL DEFAULT (datetime('now'))
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_shop_hours_shop" ON "shop_hours" ("shopId");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "shop_hours";`);
  }
}
