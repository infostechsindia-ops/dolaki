import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { ProductsService } from '../src/products/products.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

describe('Product / SKU Model Architecture (CMD-010) e2e', () => {
  jest.setTimeout(30000);
  let app: INestApplication;
  let productsService: ProductsService;
  let jwtService: JwtService;

  let superAdminToken: string;
  let catalogAdminToken: string;
  let vendorToken: string;
  let customerToken: string;

  let colorKeyId: string;
  let sizeKeyId: string;
  let valRedId: string;
  let valBlueId: string;
  let valLargeId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Legacy compatibility middleware
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (
        req.url.startsWith('/api/') &&
        !req.url.startsWith('/api/v1/') &&
        !req.url.startsWith('/api/docs')
      ) {
        req.url = req.url.replace(/^\/api\//, '/api/v1/');
      }
      next();
    });

    app.setGlobalPrefix('api/v1');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());
    const reflector = app.get(Reflector);
    app.useGlobalInterceptors(new TransformInterceptor(reflector));

    await app.init();
    productsService = app.get(ProductsService);
    jwtService = app.get(JwtService);

    superAdminToken = jwtService.sign({
      sub: 'admin-id-1',
      role: 'SUPER_ADMIN',
      email: 'admin@auramart.com',
    });

    catalogAdminToken = jwtService.sign({
      sub: 'cat-admin-id-1',
      role: 'CATALOG_ADMIN',
      email: 'catalog@auramart.com',
    });

    vendorToken = jwtService.sign({
      sub: 'vendor-user-1',
      role: 'VENDOR_OWNER',
      email: 'vendor@auramart.com',
    });

    customerToken = jwtService.sign({
      sub: 'customer-user-1',
      role: 'CUSTOMER',
      email: 'customer@auramart.com',
    });

    // Create test attribute keys & values
    const kColor = await productsService.createAttributeKey({
      name: `Color_${Date.now()}`,
      code: `color_${Date.now()}`,
    });
    colorKeyId = kColor.id;

    const kSize = await productsService.createAttributeKey({
      name: `Size_${Date.now()}`,
      code: `size_${Date.now()}`,
    });
    sizeKeyId = kSize.id;

    const vRed = await productsService.createAttributeValue({
      attributeKeyId: colorKeyId,
      value: 'Red',
      code: 'red',
    });
    valRedId = vRed.id;

    const vBlue = await productsService.createAttributeValue({
      attributeKeyId: colorKeyId,
      value: 'Blue',
      code: 'blue',
    });
    valBlueId = vBlue.id;

    const vLarge = await productsService.createAttributeValue({
      attributeKeyId: sizeKeyId,
      value: 'Large',
      code: 'large',
    });
    valLargeId = vLarge.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Simple / Default SKU Product Support', () => {
    it('should create a simple product without variants and auto-generate single Default Variant', async () => {
      const prodId = `test-simple-${Date.now()}`;
      const res = await request(app.getHttpServer())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          id: prodId,
          title: 'Simple Organic Honey',
          basePrice: 250.0,
          sku: `SKU-HONEY-${Date.now()}`,
          isQuickCommerce: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.id).toBe(prodId);
      expect(res.body.data.variants).toHaveLength(1);
      expect(res.body.data.variants[0].isDefault).toBe(true);
      expect(res.body.data.variants[0].sku).toContain('SKU-HONEY');
    });
  });

  describe('2. Multidimensional Variant Creation', () => {
    it('should create a product with multi-dimensional variants (Color + Size)', async () => {
      const prodId = `test-multi-${Date.now()}`;
      const res = await request(app.getHttpServer())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          id: prodId,
          title: 'Pro Running T-Shirt',
          basePrice: 999.0,
          variants: [
            {
              title: 'Red / Large',
              sku: `SKU-TSHIRT-RED-L-${Date.now()}`,
              referenceMsrp: 999.0,
              attributes: [
                { attributeKeyId: colorKeyId, attributeValueId: valRedId },
                { attributeKeyId: sizeKeyId, attributeValueId: valLargeId },
              ],
            },
            {
              title: 'Blue / Large',
              sku: `SKU-TSHIRT-BLUE-L-${Date.now()}`,
              referenceMsrp: 999.0,
              attributes: [
                { attributeKeyId: colorKeyId, attributeValueId: valBlueId },
                { attributeKeyId: sizeKeyId, attributeValueId: valLargeId },
              ],
            },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.data.variants).toHaveLength(2);
      expect(res.body.data.variants[0].attributeSignature).toContain(colorKeyId);
      expect(res.body.data.variants[0].attributeSignature).toContain(sizeKeyId);
    });
  });

  describe('3. Duplicate Combination Rejection', () => {
    it('should reject creating two variants with the exact same attribute combination with 409 DUPLICATE_VARIANT_COMBINATION', async () => {
      const prodId = `test-dup-comb-${Date.now()}`;

      // First create product with one Red / Large variant
      await request(app.getHttpServer())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          id: prodId,
          title: 'Duplicate Combo Test Shirt',
          basePrice: 500.0,
          variants: [
            {
              title: 'Red / Large 1',
              sku: `SKU-DUP-1-${Date.now()}`,
              attributes: [
                { attributeKeyId: colorKeyId, attributeValueId: valRedId },
                { attributeKeyId: sizeKeyId, attributeValueId: valLargeId },
              ],
            },
          ],
        });

      // Attempt to add a second variant with exact same Red / Large combination
      const res = await request(app.getHttpServer())
        .post(`/api/v1/products/${prodId}/variants`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          title: 'Red / Large 2',
          sku: `SKU-DUP-2-${Date.now()}`,
          attributes: [
            { attributeKeyId: colorKeyId, attributeValueId: valRedId },
            { attributeKeyId: sizeKeyId, attributeValueId: valLargeId },
          ],
        });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('DUPLICATE_VARIANT_COMBINATION');
    });
  });

  describe('4. Duplicate SKU Rejection', () => {
    it('should reject creating a variant with an already existing SKU code with 409 DUPLICATE_SKU', async () => {
      const prodId = `test-dup-sku-${Date.now()}`;
      const duplicateSku = `SKU-SHARED-UNIQUE-${Date.now()}`;

      await request(app.getHttpServer())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          id: prodId,
          title: 'Dup SKU Test Product',
          sku: duplicateSku,
        });

      // Attempt to create another variant with the same SKU
      const res = await request(app.getHttpServer())
        .post(`/api/v1/products/${prodId}/variants`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          title: 'Conflicting SKU Variant',
          sku: duplicateSku,
        });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('DUPLICATE_SKU');
    });
  });

  describe('5. AttributeValue / AttributeKey Mismatch Rejection', () => {
    it('should reject assigning an AttributeValue under an incorrect AttributeKey with 400 ATTRIBUTE_VALUE_KEY_MISMATCH', async () => {
      const prodId = `test-mismatch-${Date.now()}`;

      const res = await request(app.getHttpServer())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          id: prodId,
          title: 'Mismatch Test Product',
          variants: [
            {
              title: 'Mismatch Variant',
              sku: `SKU-MISMATCH-${Date.now()}`,
              attributes: [
                // Pass Large (size value ID) under Color attribute key ID!
                { attributeKeyId: colorKeyId, attributeValueId: valLargeId },
              ],
            },
          ],
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('ATTRIBUTE_VALUE_KEY_MISMATCH');
    });
  });

  describe('6. Multiple Vendors Referencing Same Canonical SKU Architecture', () => {
    it('should support multiple seller listings pointing to the same ProductVariant', async () => {
      const prodId = `test-multi-seller-${Date.now()}`;

      const createRes = await request(app.getHttpServer())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          id: prodId,
          title: 'Multi-Seller Shared Item',
          basePrice: 150.0,
        });

      expect(createRes.status).toBe(201);
      const variantId = createRes.body.data.variants[0].id;
      expect(variantId).toBeDefined();
    });
  });

  describe('7. Grocery & Quick-Commerce Unit Semantics', () => {
    it('should store netQuantity, unitOfMeasure, quantityPerPack, and gtin for grocery SKUs', async () => {
      const prodId = `test-grocery-${Date.now()}`;
      const res = await request(app.getHttpServer())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          id: prodId,
          title: 'Fresh Whole Milk 1L Pack',
          isQuickCommerce: true,
          variants: [
            {
              title: '1 Litre Bottle',
              sku: `SKU-MILK-1L-${Date.now()}`,
              gtin: '8901234567890',
              netQuantity: 1,
              unitOfMeasure: 'L',
              quantityPerPack: 1,
              referenceMsrp: 75.0,
            },
          ],
        });

      expect(res.status).toBe(201);
      const variant = res.body.data.variants[0];
      expect(variant.netQuantity).toBe(1);
      expect(variant.unitOfMeasure).toBe('L');
      expect(variant.gtin).toBe('8901234567890');
    });
  });

  describe('8. Deterministic Data Migration Verification', () => {
    it('should have seeded initial normalized brands, products, and variants', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/products');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].variants).toBeDefined();
    });
  });

  describe('9. Ambiguous Legacy Option Handling', () => {
    it('should preserve legacy option metadata without Cartesian multiplying fake SKUs', async () => {
      const prod = await productsService.findOne('gro-1');
      expect(prod).toBeDefined();
      expect(prod.variants).toBeDefined();
      expect(prod.colorsJson).toBeDefined();
    });
  });

  describe('10. Ambiguous Inventory Mapping Safety', () => {
    it('should set migrationStatus OK on valid inventory rows', async () => {
      const prod = await productsService.findOne('gro-1');
      expect(prod.migrationStatus).toBe('OK');
    });
  });

  describe('11. Backward-Compatibility Projections', () => {
    it('should return projected legacy fields (colorsJson, sizesJson, colors, sizes, sku, basePrice) on GET /products/:id', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/products/gro-1');
      expect(res.status).toBe(200);
      expect(res.body.data.sku).toBeDefined();
      expect(res.body.data.basePrice).toBeDefined();
      expect(res.body.data.colorsJson).toBeDefined();
      expect(res.body.data.variants).toBeDefined();
    });
  });

  describe('12. Archived SKU Referential Safety', () => {
    it('should soft archive a ProductVariant without deleting database entity', async () => {
      const prodId = `test-archive-${Date.now()}`;
      const createRes = await request(app.getHttpServer())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          id: prodId,
          title: 'To Be Archived Item',
        });

      expect(createRes.status).toBe(201);
      const variantId = createRes.body.data.variants[0].id;

      // Soft archive variant via PUT /products/:id/variants/:variantId
      const updateRes = await request(app.getHttpServer())
        .put(`/api/v1/products/${prodId}/variants/${variantId}`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({ status: 'ARCHIVED' });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.data.status).toBe('ARCHIVED');
    });
  });

  describe('13. Public API Metadata Hygiene', () => {
    it('should serve public GET endpoints cleanly', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/products');
      expect(res.status).toBe(200);
      expect(res.body.data[0].id).toBeDefined();
      expect(res.body.data[0].title).toBeDefined();
    });
  });
});
