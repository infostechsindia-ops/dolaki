import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { IdempotencyService } from '../src/idempotency/idempotency.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

describe('Idempotency Infrastructure (CMD-009) e2e', () => {
  jest.setTimeout(30000);
  let app: INestApplication;
  let idempotencyService: IdempotencyService;
  let jwtService: JwtService;

  let customer1Token: string;
  let customer2Token: string;
  let adminToken: string;

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
    idempotencyService = app.get(IdempotencyService);
    jwtService = app.get(JwtService);

    // Wipe idempotency keys table for clean test execution
    const idempotencyKeyRepo = app.get('IdempotencyKeyRepository');
    await idempotencyKeyRepo.query('DELETE FROM idempotency_keys');

    customer1Token = jwtService.sign({
      sub: 'cust-id-111',
      role: 'CUSTOMER',
      email: 'customer1@example.com',
    });

    customer2Token = jwtService.sign({
      sub: 'cust-id-222',
      role: 'CUSTOMER',
      email: 'customer2@example.com',
    });

    adminToken = jwtService.sign({
      sub: 'admin-id-999',
      role: 'SUPER_ADMIN',
      email: 'admin@example.com',
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Key Validation & Scoping', () => {
    it('should validate key format and reject invalid/oversized keys with 400 IDEMPOTENCY_KEY_INVALID', async () => {
      expect(idempotencyService.isValidKeyFormat('valid-key-123_456')).toBe(
        true,
      );
      expect(idempotencyService.isValidKeyFormat('')).toBe(false);
      expect(
        idempotencyService.isValidKeyFormat('invalid key with spaces!'),
      ).toBe(false);

      const oversizedKey = 'k'.repeat(130);
      const res = await request(app.getHttpServer())
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${customer1Token}`)
        .set('Idempotency-Key', oversizedKey)
        .send({
          items: [{ productId: 'p1', quantity: 1, price: 100 }],
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('IDEMPOTENCY_KEY_INVALID');
    });

    it('should scope keys deterministically per actor and operation', () => {
      const scope1 = idempotencyService.buildScopedKey(
        'user-1',
        'CREATE_ORDER',
        'key-abc',
      );
      const scope2 = idempotencyService.buildScopedKey(
        'user-2',
        'CREATE_ORDER',
        'key-abc',
      );
      const scope3 = idempotencyService.buildScopedKey(
        'user-1',
        'GRANT_CREDIT',
        'key-abc',
      );

      expect(scope1).toBe('user-1:CREATE_ORDER:key-abc');
      expect(scope2).toBe('user-2:CREATE_ORDER:key-abc');
      expect(scope3).toBe('user-1:GRANT_CREDIT:key-abc');
      expect(scope1).not.toEqual(scope2);
      expect(scope1).not.toEqual(scope3);
    });

    it('should compute deterministic canonical request fingerprints', () => {
      const fp1 = idempotencyService.computeFingerprint(
        'POST',
        '/api/v1/orders',
        {},
        {},
        { b: 2, a: 1 },
      );
      const fp2 = idempotencyService.computeFingerprint(
        'POST',
        '/api/v1/orders',
        {},
        {},
        { a: 1, b: 2 },
      );
      const fp3 = idempotencyService.computeFingerprint(
        'POST',
        '/api/v1/orders',
        {},
        {},
        { a: 1, b: 3 },
      );

      expect(fp1).toEqual(fp2); // Key order normalization
      expect(fp1).not.toEqual(fp3); // Different value
    });
  });

  describe('2. End-to-End Idempotent Mutation Lifecycle', () => {
    const key = `order-idemp-${Date.now()}`;
    const orderPayload = {
      items: [{ productId: 'gro-1', title: 'Fresh Milk', quantity: 2, unitPrice: 50 }],
      totalAmount: 100,
      paymentMethod: 'COD',
      shippingAddress: '123 Test Street, Mumbai',
    };

    it('First request executes business logic and returns order response', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${customer1Token}`)
        .set('Idempotency-Key', key)
        .send(orderPayload);

      expect(res.status).toBe(201);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.customerId).toBe('cust-id-111');
    });

    it('Identical retry replays original cached response envelope without duplicate execution', async () => {
      const res1 = await request(app.getHttpServer())
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${customer1Token}`)
        .set('Idempotency-Key', key)
        .send(orderPayload);

      const res2 = await request(app.getHttpServer())
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${customer1Token}`)
        .set('Idempotency-Key', key)
        .send(orderPayload);

      expect(res2.status).toBe(201);
      expect(res2.body.data.id).toEqual(res1.body.data.id);
    });

    it('Retry with SAME key but DIFFERENT payload returns 409 IDEMPOTENCY_PAYLOAD_MISMATCH', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${customer1Token}`)
        .set('Idempotency-Key', key)
        .send({
          items: [{ productId: 'gro-1', title: 'Fresh Milk', quantity: 99, unitPrice: 50 }],
          totalAmount: 4950,
          paymentMethod: 'COD',
          shippingAddress: 'Different Address',
        });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('IDEMPOTENCY_PAYLOAD_MISMATCH');
    });
  });

  describe('3. Concurrency & DB-Atomic Lock Protection', () => {
    it('Concurrent request attempting key in PROCESSING state returns 409 IDEMPOTENCY_CONCURRENT_REQUEST', async () => {
      const concKey = `conc-key-${Date.now()}`;
      const scopedKey = idempotencyService.buildScopedKey(
        'cust-id-111',
        'CREATE_ORDER',
        concKey,
      );

      // Manually claim key in PROCESSING state
      await idempotencyService.claimKey(
        scopedKey,
        'cust-id-111',
        'CREATE_ORDER',
        concKey,
        'fake-hash',
      );

      const res = await request(app.getHttpServer())
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${customer1Token}`)
        .set('Idempotency-Key', concKey)
        .send({ items: [{ productId: 'p1', title: 'P1', quantity: 1, unitPrice: 10 }], totalAmount: 10, paymentMethod: 'COD' });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('IDEMPOTENCY_CONCURRENT_REQUEST');

      // Cleanup manual key
      await idempotencyService.deleteKey(scopedKey);
    });
  });

  describe('4. Failure Recovery & Ambiguous Post-Mutation Protection', () => {
    it('Client validation error (400) releases key so caller can fix input and retry', async () => {
      const failKey = `val-fail-${Date.now()}`;
      const invalidPayload = { invalidField: true };

      const res1 = await request(app.getHttpServer())
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${customer1Token}`)
        .set('Idempotency-Key', failKey)
        .send(invalidPayload);

      expect(res1.status).toBe(400);

      // Retry with fixed valid payload
      const res2 = await request(app.getHttpServer())
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${customer1Token}`)
        .set('Idempotency-Key', failKey)
        .send({ items: [{ productId: 'p1', title: 'P1', quantity: 1, unitPrice: 10 }], totalAmount: 10, paymentMethod: 'COD' });

      expect(res2.status).toBe(201);
    });

    it('Ambiguous post-mutation failure marks key FAILED and prevents duplicate execution on retry', async () => {
      const failedStateKey = `failed-state-${Date.now()}`;
      const scopedKey = idempotencyService.buildScopedKey(
        'cust-id-111',
        'CREATE_ORDER',
        failedStateKey,
      );

      // Simulate key in FAILED state (e.g. side effect committed but network dropped)
      await idempotencyService.claimKey(
        scopedKey,
        'cust-id-111',
        'CREATE_ORDER',
        failedStateKey,
        'hash123',
      );
      await idempotencyService.failKey(
        scopedKey,
        500,
        { error: 'Post-commit network timeout' },
      );

      const res = await request(app.getHttpServer())
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${customer1Token}`)
        .set('Idempotency-Key', failedStateKey)
        .send({ items: [{ productId: 'p1', title: 'P1', quantity: 1, unitPrice: 10 }], totalAmount: 10, paymentMethod: 'COD' });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('IDEMPOTENCY_FAILED_STATE');

      await idempotencyService.deleteKey(scopedKey);
    });
  });

  describe('5. Actor & Tenant Isolation', () => {
    it('Different users using the same raw Idempotency-Key execute independently', async () => {
      const sharedKey = `shared-key-${Date.now()}`;
      const payload = { items: [{ productId: 'p1', title: 'P1', quantity: 1, unitPrice: 20 }], totalAmount: 20, paymentMethod: 'COD' };

      const res1 = await request(app.getHttpServer())
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${customer1Token}`)
        .set('Idempotency-Key', sharedKey)
        .send(payload);

      const res2 = await request(app.getHttpServer())
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${customer2Token}`)
        .set('Idempotency-Key', sharedKey)
        .send(payload);

      expect(res1.status).toBe(201);
      expect(res2.status).toBe(201);
      expect(res1.body.data.id).not.toEqual(res2.body.data.id);
      expect(res1.body.data.customerId).toBe('cust-id-111');
      expect(res2.body.data.customerId).toBe('cust-id-222');
    });
  });

  describe('6. Authorization Precedence Before Replay', () => {
    it('Unauthenticated request is rejected with 401 UNAUTHORIZED before idempotency replay', async () => {
      const key = `auth-test-${Date.now()}`;
      const payload = { items: [{ productId: 'p1', title: 'P1', quantity: 1, unitPrice: 10 }], totalAmount: 10, paymentMethod: 'COD' };

      // Create initial order
      await request(app.getHttpServer())
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${customer1Token}`)
        .set('Idempotency-Key', key)
        .send(payload);

      // Attempt replay without Authorization token
      const res = await request(app.getHttpServer())
        .post('/api/v1/orders')
        .set('Idempotency-Key', key)
        .send(payload);

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });
  });
});
