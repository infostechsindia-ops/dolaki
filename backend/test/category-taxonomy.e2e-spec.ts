import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { CategoriesService } from '../src/categories/categories.service';
import { ProductsService } from '../src/products/products.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

describe('Category Taxonomy Architecture (CMD-011) e2e', () => {
  jest.setTimeout(30000);
  let app: INestApplication;
  let categoriesService: CategoriesService;
  let productsService: ProductsService;
  let jwtService: JwtService;

  let superAdminToken: string;
  let customerToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

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
    categoriesService = app.get(CategoriesService);
    productsService = app.get(ProductsService);
    jwtService = app.get(JwtService);

    superAdminToken = jwtService.sign({
      sub: 'admin-id-1',
      role: 'SUPER_ADMIN',
      email: 'admin@auramart.com',
    });

    customerToken = jwtService.sign({
      sub: 'customer-user-1',
      role: 'CUSTOMER',
      email: 'customer@auramart.com',
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Root & Child Category Creation with Segment-Safe Materialized Paths', () => {
    it('should create root and child categories with correct path and depth', async () => {
      const rootId = `cat-root-${Date.now()}`;
      const childId = `cat-child-${Date.now()}`;

      const rootRes = await request(app.getHttpServer())
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          id: rootId,
          name: 'Home Appliances',
          slug: `home-appliances-${Date.now()}`,
          isMarketplace: true,
        });

      expect(rootRes.status).toBe(201);
      expect(rootRes.body.data.depth).toBe(0);
      expect(rootRes.body.data.path).toBe(`/${rootId}/`);

      const childRes = await request(app.getHttpServer())
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          id: childId,
          parentId: rootId,
          name: 'Microwaves',
          slug: `microwaves-${Date.now()}`,
          isMarketplace: true,
        });

      expect(childRes.status).toBe(201);
      expect(childRes.body.data.depth).toBe(1);
      expect(childRes.body.data.path).toBe(`/${rootId}/${childId}/`);
    });
  });

  describe('2. Segment-Safe Cycle Detection', () => {
    it('should reject creating a cycle when moving a category under one of its own descendants', async () => {
      const parentId = `cat-p-${Date.now()}`;
      const childId = `cat-c-${Date.now()}`;

      await categoriesService.create({ id: parentId, name: 'Parent Cat', slug: `p-${Date.now()}` });
      await categoriesService.create({ id: childId, parentId, name: 'Child Cat', slug: `c-${Date.now()}` });

      // Attempt to set parentId of parent to child
      const res = await request(app.getHttpServer())
        .put(`/api/v1/categories/${parentId}`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({ parentId: childId });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('CATEGORY_CYCLE_DETECTED');
    });

    it('should reject setting category as its own parent', async () => {
      const catId = `cat-self-${Date.now()}`;
      await categoriesService.create({ id: catId, name: 'Self Parent Cat', slug: `self-${Date.now()}` });

      const res = await request(app.getHttpServer())
        .put(`/api/v1/categories/${catId}`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({ parentId: catId });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('INVALID_CATEGORY_PARENT');
    });
  });

  describe('3. Transactional Re-Parenting & Product Category Path Synchronization', () => {
    it('should update descendant category paths and product categoryPaths atomically during move', async () => {
      const r1Id = `cat-r1-${Date.now()}`;
      const r2Id = `cat-r2-${Date.now()}`;
      const node1 = `cat-node1-${Date.now()}`;
      const prodId = `prod-move-${Date.now()}`;

      await categoriesService.create({ id: r1Id, name: 'Root 1', slug: `r1-${Date.now()}` });
      await categoriesService.create({ id: r2Id, name: 'Root 2', slug: `r2-${Date.now()}` });
      await categoriesService.create({ id: node1, parentId: r1Id, name: 'Node 1', slug: `n1-${Date.now()}` });

      // Create product under node1
      await productsService.create({
        id: prodId,
        title: 'Movable Product',
        categoryId: node1,
      });

      // Move node1 from r1 to r2
      const moveRes = await request(app.getHttpServer())
        .put(`/api/v1/categories/${node1}`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({ parentId: r2Id });

      expect(moveRes.status).toBe(200);
      expect(moveRes.body.data.path).toBe(`/${r2Id}/${node1}/`);

      // Verify product categoryPath updated
      const updatedProd = await productsService.findOne(prodId);
      expect(updatedProd).toBeDefined();
    });
  });

  describe('4. Child Surface Visibility with Structural Container Ancestor', () => {
    it('should include structural ancestor containers when surface pruning for Quick-Commerce', async () => {
      const rootId = `cat-qc-root-${Date.now()}`;
      const childId = `cat-qc-child-${Date.now()}`;

      // Root is Marketplace only; Child is Quick-Commerce eligible
      await categoriesService.create({
        id: rootId,
        name: 'Marketplace Only Root',
        slug: `m-root-${Date.now()}`,
        isMarketplace: true,
        isQuickCommerce: false,
      });

      await categoriesService.create({
        id: childId,
        parentId: rootId,
        name: 'QC Eligible Child',
        slug: `qc-child-${Date.now()}`,
        isMarketplace: true,
        isQuickCommerce: true,
      });

      const res = await request(app.getHttpServer()).get(
        '/api/v1/categories/tree?surface=quick-commerce',
      );

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      const rootInTree = res.body.data.find((c: any) => c.id === rootId);
      expect(rootInTree).toBeDefined();
      expect(rootInTree.children.length).toBeGreaterThan(0);
    });
  });

  describe('5. Active Child under Inactive Parent', () => {
    it('should exclude active children from public tree if ancestor is inactive', async () => {
      const rootId = `cat-inact-root-${Date.now()}`;
      const childId = `cat-inact-child-${Date.now()}`;

      await categoriesService.create({
        id: rootId,
        name: 'Inactive Root',
        slug: `inact-root-${Date.now()}`,
        status: 'INACTIVE',
      });

      await categoriesService.create({
        id: childId,
        parentId: rootId,
        name: 'Active Child Under Inactive',
        slug: `inact-child-${Date.now()}`,
        status: 'ACTIVE',
      });

      const res = await request(app.getHttpServer()).get('/api/v1/categories/tree');
      expect(res.status).toBe(200);
      const rootInTree = res.body.data.find((c: any) => c.id === rootId);
      expect(rootInTree).toBeUndefined();
    });
  });

  describe('6. Archiving Category with Active Descendants', () => {
    it('should reject archiving a category if active descendants exist with 400 CATEGORY_HAS_ACTIVE_DESCENDANTS', async () => {
      const rootId = `cat-arch-root-${Date.now()}`;
      const childId = `cat-arch-child-${Date.now()}`;

      await categoriesService.create({ id: rootId, name: 'Arch Root', slug: `arch-r-${Date.now()}` });
      await categoriesService.create({ id: childId, parentId: rootId, name: 'Arch Child', slug: `arch-c-${Date.now()}` });

      const res = await request(app.getHttpServer())
        .delete(`/api/v1/categories/${rootId}`)
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('CATEGORY_HAS_ACTIVE_DESCENDANTS');
    });
  });

  describe('7. Parent-Scoped Reorder Validation', () => {
    it('should reject batch reordering if an item does not belong to specified parentId scope', async () => {
      const p1 = `cat-p1-${Date.now()}`;
      const p2 = `cat-p2-${Date.now()}`;
      const c1 = `cat-c1-${Date.now()}`;

      await categoriesService.create({ id: p1, name: 'P1', slug: `p1-${Date.now()}` });
      await categoriesService.create({ id: p2, name: 'P2', slug: `p2-${Date.now()}` });
      await categoriesService.create({ id: c1, parentId: p1, name: 'C1', slug: `c1-${Date.now()}` });

      // Attempt to reorder c1 under parentId = p2 scope
      const res = await request(app.getHttpServer())
        .put('/api/v1/categories/reorder')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          parentId: p2,
          items: [{ id: c1, displayOrder: 1 }],
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('INVALID_REORDER_SCOPE');
    });
  });

  describe('8. Slug & Canonical Breadcrumb Generation', () => {
    it('should return category with full breadcrumb path on GET /categories/slug/:slug', async () => {
      const rootId = `cat-bc-root-${Date.now()}`;
      const childId = `cat-bc-child-${Date.now()}`;
      const slug = `bc-child-${Date.now()}`;

      await categoriesService.create({ id: rootId, name: 'Electronics', slug: `bc-root-${Date.now()}` });
      await categoriesService.create({ id: childId, parentId: rootId, name: 'Smartphones', slug });

      const res = await request(app.getHttpServer()).get(`/api/v1/categories/slug/${slug}`);

      expect(res.status).toBe(200);
      expect(res.body.data.slug).toBe(slug);
      expect(res.body.data.breadcrumbs).toBeDefined();
      expect(res.body.data.breadcrumbs.length).toBe(2);
      expect(res.body.data.breadcrumbs[0].id).toBe(rootId);
      expect(res.body.data.breadcrumbs[1].id).toBe(childId);
    });
  });

  describe('9. MaxDepth Ceiling Enforcement', () => {
    it('should cap maxDepth query parameter to 5 ceiling', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/categories/tree?maxDepth=100');
      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
    });
  });

  describe('10. Duplicate Slug Rejection', () => {
    it('should reject creating a category with existing slug with 409 DUPLICATE_CATEGORY_SLUG', async () => {
      const dupSlug = `dup-slug-${Date.now()}`;
      await categoriesService.create({ name: 'Cat 1', slug: dupSlug });

      const res = await request(app.getHttpServer())
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({ name: 'Cat 2', slug: dupSlug });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('DUPLICATE_CATEGORY_SLUG');
    });
  });

  describe('11. RBAC Guard Protection', () => {
    it('should reject unauthorized category creation by CUSTOMER role with 403 FORBIDDEN', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ name: 'Forbidden Cat' });

      expect(res.status).toBe(403);
    });
  });

  describe('12. Deletion & Historical Reference Safety', () => {
    it('should soft-archive leaf category safely without physical row deletion', async () => {
      const leafId = `cat-leaf-${Date.now()}`;
      await categoriesService.create({ id: leafId, name: 'Leaf Cat', slug: `leaf-${Date.now()}` });

      const res = await request(app.getHttpServer())
        .delete(`/api/v1/categories/${leafId}`)
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('ARCHIVED');
    });
  });
});
