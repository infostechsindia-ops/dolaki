import { MigrationInterface, QueryRunner } from 'typeorm';

export class NormalizeProductVariants1722900000000 implements MigrationInterface {
  name = 'NormalizeProductVariants1722900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create Brands table if not exists
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "brands" (
        "id" varchar PRIMARY KEY NOT NULL,
        "name" varchar NOT NULL,
        "slug" varchar NOT NULL UNIQUE,
        "logoUrl" varchar,
        "description" text,
        "isActive" boolean NOT NULL DEFAULT (1),
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);

    // 2. Create ProductVariants table if not exists
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "product_variants" (
        "id" varchar PRIMARY KEY NOT NULL,
        "productId" varchar NOT NULL,
        "sku" varchar NOT NULL UNIQUE,
        "gtin" varchar,
        "title" varchar NOT NULL DEFAULT 'Default',
        "attributeSignature" varchar NOT NULL DEFAULT '',
        "referenceMsrp" float NOT NULL DEFAULT 0,
        "referenceDiscountPrice" float,
        "netQuantity" float,
        "unitOfMeasure" varchar,
        "quantityPerPack" integer NOT NULL DEFAULT 1,
        "weightKg" float,
        "isDefault" boolean NOT NULL DEFAULT (0),
        "status" varchar NOT NULL DEFAULT 'ACTIVE',
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_PRODUCT_VARIANT_SIGNATURE" 
      ON "product_variants" ("productId", "attributeSignature")
    `);

    // 3. Create Attribute Keys & Values & Mapping tables
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "attribute_keys" (
        "id" varchar PRIMARY KEY NOT NULL,
        "name" varchar NOT NULL,
        "code" varchar NOT NULL UNIQUE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "attribute_values" (
        "id" varchar PRIMARY KEY NOT NULL,
        "attributeKeyId" varchar NOT NULL,
        "value" varchar NOT NULL,
        "code" varchar NOT NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "product_variant_attributes" (
        "variantId" varchar NOT NULL,
        "attributeKeyId" varchar NOT NULL,
        "attributeValueId" varchar NOT NULL,
        PRIMARY KEY ("variantId", "attributeKeyId", "attributeValueId")
      )
    `);

    // 4. Create Product & Variant Image tables
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "product_images" (
        "id" varchar PRIMARY KEY NOT NULL,
        "productId" varchar NOT NULL,
        "imageUrl" varchar NOT NULL,
        "displayOrder" integer NOT NULL DEFAULT 0,
        "isPrimary" boolean NOT NULL DEFAULT (0),
        "altText" varchar
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "variant_images" (
        "id" varchar PRIMARY KEY NOT NULL,
        "variantId" varchar NOT NULL,
        "imageUrl" varchar NOT NULL,
        "displayOrder" integer NOT NULL DEFAULT 0,
        "isPrimary" boolean NOT NULL DEFAULT (0)
      )
    `);

    // 5. Create SellerListings table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "seller_listings" (
        "id" varchar PRIMARY KEY NOT NULL,
        "variantId" varchar NOT NULL,
        "vendorId" varchar NOT NULL,
        "shopId" varchar,
        "isAvailable" boolean NOT NULL DEFAULT (1),
        "createdAt" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);

    // 6. Safe non-destructive column additions to existing tables if missing
    try {
      await queryRunner.query(`ALTER TABLE "products" ADD COLUMN "brandId" varchar`);
    } catch (e) {}
    try {
      await queryRunner.query(`ALTER TABLE "products" ADD COLUMN "slug" varchar`);
    } catch (e) {}
    try {
      await queryRunner.query(`ALTER TABLE "products" ADD COLUMN "status" varchar DEFAULT 'ACTIVE'`);
    } catch (e) {}
    try {
      await queryRunner.query(`ALTER TABLE "products" ADD COLUMN "migrationStatus" varchar DEFAULT 'OK'`);
    } catch (e) {}
    try {
      await queryRunner.query(`ALTER TABLE "products" ADD COLUMN "taxClass" varchar DEFAULT 'STANDARD'`);
    } catch (e) {}
    try {
      await queryRunner.query(`ALTER TABLE "products" ADD COLUMN "legacyVendorId" varchar`);
    } catch (e) {}

    try {
      await queryRunner.query(`ALTER TABLE "inventory" ADD COLUMN "listingId" varchar`);
    } catch (e) {}
    try {
      await queryRunner.query(`ALTER TABLE "inventory" ADD COLUMN "variantId" varchar`);
    } catch (e) {}
    try {
      await queryRunner.query(`ALTER TABLE "inventory" ADD COLUMN "shopId" varchar`);
    } catch (e) {}
    try {
      await queryRunner.query(`ALTER TABLE "inventory" ADD COLUMN "migrationStatus" varchar DEFAULT 'OK'`);
    } catch (e) {}

    try {
      await queryRunner.query(`ALTER TABLE "order_items" ADD COLUMN "variantId" varchar`);
    } catch (e) {}
    try {
      await queryRunner.query(`ALTER TABLE "order_items" ADD COLUMN "sku" varchar`);
    } catch (e) {}
    try {
      await queryRunner.query(`ALTER TABLE "order_items" ADD COLUMN "title" varchar`);
    } catch (e) {}
    try {
      await queryRunner.query(`ALTER TABLE "order_items" ADD COLUMN "variantTitle" varchar`);
    } catch (e) {}
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_PRODUCT_VARIANT_SIGNATURE"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "seller_listings"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "variant_images"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "product_images"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "product_variant_attributes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "attribute_values"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "attribute_keys"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "product_variants"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "brands"`);
  }
}
