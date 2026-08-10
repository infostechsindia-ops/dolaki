import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInventoryLocations1723000000000 implements MigrationInterface {
  name = 'CreateInventoryLocations1723000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create inventory_locations table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "inventory_locations" (
        "id" varchar PRIMARY KEY NOT NULL,
        "tenantType" varchar NOT NULL DEFAULT ('PLATFORM'),
        "tenantId" varchar NOT NULL DEFAULT ('PLATFORM'),
        "code" varchar NOT NULL,
        "name" varchar NOT NULL,
        "type" varchar NOT NULL,
        "status" varchar NOT NULL DEFAULT ('ACTIVE'),
        "vendorId" varchar,
        "shopId" varchar,
        "address" text,
        "city" varchar,
        "state" varchar,
        "country" varchar NOT NULL DEFAULT ('AE'),
        "postalCode" varchar,
        "lat" float,
        "lng" float,
        "isMarketplace" boolean NOT NULL DEFAULT (1),
        "isQuickCommerce" boolean NOT NULL DEFAULT (0),
        "isFulfillmentCenter" boolean NOT NULL DEFAULT (0),
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
        CONSTRAINT "FK_inv_loc_vendor" FOREIGN KEY ("vendorId") REFERENCES "vendors" ("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_inv_loc_shop" FOREIGN KEY ("shopId") REFERENCES "flado_shops" ("id") ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_inv_loc_tenant_code" ON "inventory_locations" ("tenantType", "tenantId", "code")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_inv_loc_vendor_status" ON "inventory_locations" ("vendorId", "status")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_inv_loc_shop_status" ON "inventory_locations" ("shopId", "status")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_inv_loc_type_status" ON "inventory_locations" ("type", "status")
    `);

    // 2. Create inventory_balances table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "inventory_balances" (
        "id" varchar PRIMARY KEY NOT NULL,
        "locationId" varchar NOT NULL,
        "sellerListingId" varchar NOT NULL,
        "variantId" varchar NOT NULL,
        "vendorId" varchar NOT NULL,
        "shopId" varchar,
        "onHand" integer NOT NULL DEFAULT (0),
        "reserved" integer NOT NULL DEFAULT (0),
        "damaged" integer NOT NULL DEFAULT (0),
        "safetyStock" integer NOT NULL DEFAULT (0),
        "lowStockThreshold" integer NOT NULL DEFAULT (5),
        "migrationStatus" varchar NOT NULL DEFAULT ('OK'),
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
        CONSTRAINT "FK_inv_bal_location" FOREIGN KEY ("locationId") REFERENCES "inventory_locations" ("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_inv_bal_listing" FOREIGN KEY ("sellerListingId") REFERENCES "seller_listings" ("id") ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_inv_bal_loc_listing" ON "inventory_balances" ("locationId", "sellerListingId")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_inv_bal_variant_loc" ON "inventory_balances" ("variantId", "locationId")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_inv_bal_vendor_loc" ON "inventory_balances" ("vendorId", "locationId")
    `);

    // 3. Create system holding location (LEGACY_UNASSIGNED)
    await queryRunner.query(`
      INSERT INTO "inventory_locations" (
        "id", "tenantType", "tenantId", "code", "name", "type", "status",
        "isMarketplace", "isQuickCommerce", "isFulfillmentCenter"
      ) VALUES (
        'loc-legacy-unassigned', 'PLATFORM', 'PLATFORM', 'LEGACY_UNASSIGNED',
        'Legacy Unassigned Holding Location', 'MARKETPLACE_WAREHOUSE', 'INACTIVE',
        0, 0, 0
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "inventory_balances"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "inventory_locations"`);
  }
}
