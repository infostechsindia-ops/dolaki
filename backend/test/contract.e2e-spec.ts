import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { Request, Response, NextFunction } from 'express';

describe('API Contract Standard (CMD-007) e2e', () => {
  let app: INestApplication;
  let customerToken: string;

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
    const reflector = new Reflector();
    app.useGlobalInterceptors(new TransformInterceptor(reflector));

    await app.init();

    // Authenticate a customer for protected route tests
    const registerRes = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'contract-customer@example.com',
        password: 'Password123!',
        fullName: 'Contract Customer',
        phone: '+919876543210',
      });

    if (registerRes.body.data && registerRes.body.data.access_token) {
      customerToken = registerRes.body.data.access_token;
    } else {
      const loginRes = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'contract-customer@example.com',
          password: 'Password123!',
        });
      customerToken = loginRes.body.data.access_token;
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Response Envelopes & Versioning', () => {
    it('GET /api/v1/products/categories returns collection envelope { data: [...] }', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/products/categories')
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('GET /api/v1/products/:id returns single resource envelope { data: {...} }', async () => {
      const listRes = await request(app.getHttpServer()).get(
        '/api/v1/products',
      );
      const firstProduct = listRes.body.data[0];

      const res = await request(app.getHttpServer())
        .get(`/api/v1/products/${firstProduct.id}`)
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data.id).toBe(firstProduct.id);
    });

    it('GET /api/products (legacy route) rewrites seamlessly to /api/v1/products', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/products')
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('2. Pagination & Maximum PageSize Enforcement', () => {
    it('GET /api/v1/products returns pagination metadata in envelope { data: [...], meta: {...} }', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/products?page=1&pageSize=5')
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('meta');
      expect(res.body.meta).toEqual({
        total: expect.any(Number),
        page: 1,
        pageSize: 5,
        hasNextPage: expect.any(Boolean),
      });
      expect(res.body.data.length).toBeLessThanOrEqual(5);
    });

    it('GET /api/v1/products?pageSize=9999 is rejected by ValidationPipe with 400 VALIDATION_ERROR for exceeding max limit of 100', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/products?pageSize=9999')
        .expect(400);

      expect(res.body).toHaveProperty('error');
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('GET /api/v1/products?pageSize=100 succeeds with maximum allowed pageSize of 100', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/products?pageSize=100')
        .expect(200);

      expect(res.body.meta.pageSize).toBe(100);
    });
  });

  describe('3. Machine-Readable Errors & Validation', () => {
    it('POST /api/v1/auth/login with invalid email returns 400 with VALIDATION_ERROR code', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'not-an-email',
          password: '123',
        })
        .expect(400);

      expect(res.body).toHaveProperty('error');
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toBeDefined();
    });

    it('POST /api/v1/auth/login with unknown/forbidden request properties is rejected by ValidationPipe', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'valid@example.com',
          password: 'Password123!',
          hackedProperty: 'malicious',
        })
        .expect(400);

      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(JSON.stringify(res.body.error)).toContain(
        'property hackedProperty should not exist',
      );
    });

    it('GET /api/v1/orders without authentication token returns 401 UNAUTHORIZED', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/orders')
        .expect(401);

      expect(res.body).toHaveProperty('error');
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('POST /api/v1/products with CUSTOMER token returns 403 FORBIDDEN', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          title: 'Forbidden Product',
          basePrice: 100,
          sku: 'SKU-FORBIDDEN',
        })
        .expect(403);

      expect(res.body).toHaveProperty('error');
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('GET /api/v1/products/non-existent-id-99999 returns 404 NOT_FOUND', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/products/non-existent-id-99999')
        .expect(404);

      expect(res.body).toHaveProperty('error');
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('4. Protected Fields Non-Exposure (CMD-005 / CMD-006 Invariants)', () => {
    it('GET /api/v1/orders does not leak verificationOtp in order responses', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('data');
      if (res.body.data.length > 0) {
        for (const order of res.body.data) {
          expect(order).not.toHaveProperty('verificationOtp');
        }
      }
    });
  });
});
