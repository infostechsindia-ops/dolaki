import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInventoryReservations1723100000000
  implements MigrationInterface
{
  name = 'CreateInventoryReservations1723100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create inventory_reservations table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "inventory_reservations" (
        "id" varchar PRIMARY KEY NOT NULL,
        "reservationToken" varchar NOT NULL,
        "customerId" varchar NOT NULL,
        "status" varchar NOT NULL DEFAULT ('ACTIVE'),
        "ttlSeconds" integer NOT NULL DEFAULT (900),
        "expiresAt" datetime NOT NULL,
        "consumedAt" datetime,
        "releasedAt" datetime,
        "idempotencyKey" varchar,
        "metadata" text,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
        CONSTRAINT "UQ_inventory_reservations_token" UNIQUE ("reservationToken")
      );
    `);

    // Indices for inventory_reservations
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_inv_res_customer" ON "inventory_reservations" ("customerId");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_inv_res_status_expires" ON "inventory_reservations" ("status", "expiresAt");
    `);

    // 2. Create inventory_reservation_items table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "inventory_reservation_items" (
        "id" varchar PRIMARY KEY NOT NULL,
        "reservationId" varchar NOT NULL,
        "balanceId" varchar NOT NULL,
        "quantity" integer NOT NULL CHECK ("quantity" > 0),
        CONSTRAINT "FK_inv_res_items_reservation" FOREIGN KEY ("reservationId") REFERENCES "inventory_reservations" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_inv_res_items_balance" FOREIGN KEY ("balanceId") REFERENCES "inventory_balances" ("id") ON DELETE RESTRICT
      );
    `);

    // Indices for inventory_reservation_items
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_inv_res_items_res" ON "inventory_reservation_items" ("reservationId");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_inv_res_items_bal" ON "inventory_reservation_items" ("balanceId");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_inv_res_items_bal";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_inv_res_items_res";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "inventory_reservation_items";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_inv_res_status_expires";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_inv_res_customer";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "inventory_reservations";`);
  }
}
