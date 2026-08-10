import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * CMD-006 — Role Migration: Rename legacy roles to CMD-006 role system.
 *
 * UP (apply):
 *   VENDOR   → VENDOR_OWNER
 *   ADMIN    → SUPER_ADMIN
 *   DELIVERY → RIDER
 *
 * DOWN (rollback):
 *   VENDOR_OWNER → VENDOR
 *   SUPER_ADMIN  → ADMIN
 *   RIDER        → DELIVERY
 *
 * Verification query (run after up()):
 *   SELECT role, COUNT(*) as count FROM users GROUP BY role;
 *   Expected: No rows with role IN ('VENDOR', 'ADMIN', 'DELIVERY')
 *
 * NOTE: This migration only updates data. The schema (varchar column) is unchanged.
 * It is idempotent — running it twice is safe; the WHERE clauses match only
 * the old values, and after the first run those values no longer exist.
 */
export class RenameUserRoles1722825600000 implements MigrationInterface {
  name = 'RenameUserRoles1722825600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasUsersTable = await queryRunner.hasTable('users');
    if (!hasUsersTable) {
      console.log('[Migration RenameUserRoles] `users` table does not exist yet. Skipping role migration.');
      return;
    }

    // Step 1: Rename VENDOR → VENDOR_OWNER
    await queryRunner.query(
      `UPDATE "users" SET "role" = 'VENDOR_OWNER' WHERE "role" = 'VENDOR'`,
    );

    // Step 2: Rename ADMIN → SUPER_ADMIN
    await queryRunner.query(
      `UPDATE "users" SET "role" = 'SUPER_ADMIN' WHERE "role" = 'ADMIN'`,
    );

    // Step 3: Rename DELIVERY → RIDER
    await queryRunner.query(
      `UPDATE "users" SET "role" = 'RIDER' WHERE "role" = 'DELIVERY'`,
    );

    // Verification: log affected role distribution
    const roleCounts = await queryRunner.query(
      `SELECT "role", COUNT(*) as "count" FROM "users" GROUP BY "role"`,
    );
    console.log(
      '[Migration RenameUserRoles] Post-migration role distribution:',
      roleCounts,
    );

    // Assert no legacy roles remain
    const legacyRows = await queryRunner.query(
      `SELECT COUNT(*) as "count" FROM "users" WHERE "role" IN ('VENDOR', 'ADMIN', 'DELIVERY')`,
    );
    const remaining = parseInt(legacyRows[0]?.count ?? '0', 10);
    if (remaining > 0) {
      throw new Error(
        `[Migration RenameUserRoles] ${remaining} row(s) still have legacy roles after migration. Aborting.`,
      );
    }
    console.log('[Migration RenameUserRoles] ✓ All legacy roles renamed successfully.');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('users'))) return;
    // Rollback: reverse the three renames
    await queryRunner.query(
      `UPDATE "users" SET "role" = 'VENDOR' WHERE "role" = 'VENDOR_OWNER'`,
    );
    await queryRunner.query(
      `UPDATE "users" SET "role" = 'ADMIN' WHERE "role" = 'SUPER_ADMIN'`,
    );
    await queryRunner.query(
      `UPDATE "users" SET "role" = 'DELIVERY' WHERE "role" = 'RIDER'`,
    );
    console.log('[Migration RenameUserRoles] ✓ Rollback complete — legacy roles restored.');
  }
}
