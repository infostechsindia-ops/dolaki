import { MigrationInterface, QueryRunner } from 'typeorm';

export class NormalizeCategories1722950000000 implements MigrationInterface {
  name = 'NormalizeCategories1722950000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Safe column additions to categories if missing
    try {
      await queryRunner.query(`ALTER TABLE "categories" ADD COLUMN "path" varchar DEFAULT '/'`);
    } catch (e) {}
    try {
      await queryRunner.query(`ALTER TABLE "categories" ADD COLUMN "depth" integer DEFAULT 0`);
    } catch (e) {}
    try {
      await queryRunner.query(`ALTER TABLE "categories" ADD COLUMN "displayOrder" integer DEFAULT 0`);
    } catch (e) {}
    try {
      await queryRunner.query(`ALTER TABLE "categories" ADD COLUMN "status" varchar DEFAULT 'ACTIVE'`);
    } catch (e) {}
    try {
      await queryRunner.query(`ALTER TABLE "categories" ADD COLUMN "migrationStatus" varchar DEFAULT 'OK'`);
    } catch (e) {}
    try {
      await queryRunner.query(`ALTER TABLE "categories" ADD COLUMN "isMarketplace" boolean DEFAULT (1)`);
    } catch (e) {}
    try {
      await queryRunner.query(`ALTER TABLE "categories" ADD COLUMN "isQuickCommerce" boolean DEFAULT (0)`);
    } catch (e) {}
    try {
      await queryRunner.query(`ALTER TABLE "categories" ADD COLUMN "iconUrl" varchar`);
    } catch (e) {}
    try {
      await queryRunner.query(`ALTER TABLE "categories" ADD COLUMN "bannerUrl" varchar`);
    } catch (e) {}
    try {
      await queryRunner.query(`ALTER TABLE "categories" ADD COLUMN "metaTitle" varchar`);
    } catch (e) {}
    try {
      await queryRunner.query(`ALTER TABLE "categories" ADD COLUMN "metaDescription" text`);
    } catch (e) {}
    try {
      await queryRunner.query(`ALTER TABLE "categories" ADD COLUMN "keywords" varchar`);
    } catch (e) {}
    try {
      await queryRunner.query(`ALTER TABLE "categories" ADD COLUMN "updatedAt" datetime DEFAULT (datetime('now'))`);
    } catch (e) {}

    // 2. Create CategoryAttributeKeys table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "category_attribute_keys" (
        "categoryId" varchar NOT NULL,
        "attributeKeyId" varchar NOT NULL,
        "isFilterable" boolean NOT NULL DEFAULT (1),
        "isRequired" boolean NOT NULL DEFAULT (0),
        PRIMARY KEY ("categoryId", "attributeKeyId")
      )
    `);

    // 3. Add categoryPath to products
    try {
      await queryRunner.query(`ALTER TABLE "products" ADD COLUMN "categoryPath" varchar`);
    } catch (e) {}

    // 4. Create Indexes
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_CATEGORIES_PARENT_ORDER" ON "categories" ("parentId", "displayOrder")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_CATEGORIES_PATH" ON "categories" ("path")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_CATEGORIES_STATUS_SURFACE" ON "categories" ("status", "isMarketplace", "isQuickCommerce")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_PRODUCTS_CATEGORY_PATH" ON "products" ("categoryPath")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_PRODUCTS_CATEGORY_PATH"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_CATEGORIES_STATUS_SURFACE"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_CATEGORIES_PATH"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_CATEGORIES_PARENT_ORDER"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "category_attribute_keys"`);
  }
}
