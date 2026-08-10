import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { AuditService } from '../src/audit/audit.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

describe('Audit Logging (CMD-008) e2e', () => {
  let app: INestApplication;
  let auditService: AuditService;
  let adminToken: string;
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
    const reflector = app.get(Reflector);
    app.useGlobalInterceptors(new TransformInterceptor(reflector));

    await app.init();
    auditService = app.get(AuditService);
    const jwtService = app.get(JwtService);

    adminToken = jwtService.sign({
      sub: 'admin-id-123',
      role: 'SUPER_ADMIN',
      email: 'admin@auramart.com',
    });

    customerToken = jwtService.sign({
      sub: 'customer-id-456',
      role: 'CUSTOMER',
      email: 'customer@auramart.com',
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('AuditService Unit Logic & Sensitive Data Redaction', () => {
    it('should redact sensitive keys recursively in audit log details', () => {
      const input = {
        email: 'user@example.com',
        password: 'SuperSecret123!',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        verificationOtp: '123456',
        secretKey: 'my-secret',
        nested: {
          refreshToken: 'refresh-xyz',
          cvv: '999',
          safeField: 'Hello World',
        },
        items: [
          { name: 'Item 1', passCode: 'pass123' },
          { name: 'Item 2', jwt: 'header.payload.sig' },
        ],
      };

      const redacted = auditService.redactSensitiveFields(input);

      expect(redacted.email).toBe('user@example.com');
      expect(redacted.password).toBe('[REDACTED]');
      expect(redacted.token).toBe('[REDACTED]');
      expect(redacted.verificationOtp).toBe('[REDACTED]');
      expect(redacted.secretKey).toBe('[REDACTED]');
      expect(redacted.nested.refreshToken).toBe('[REDACTED]');
      expect(redacted.nested.cvv).toBe('[REDACTED]');
      expect(redacted.nested.safeField).toBe('Hello World');
      expect(redacted.items[0].passCode).toBe('[REDACTED]');
      expect(redacted.items[1].jwt).toBe('[REDACTED]');
    });

    it('should log audit record to DB without blocking execution', async () => {
      const record = await auditService.log({
        actorId: 'test-user-id',
        actorRole: 'CUSTOMER',
        action: 'TEST_AUDIT_ACTION',
        resourceType: 'TestResource',
        resourceId: 'res-123',
        details: { password: 'should-be-redacted', safe: 'value' },
      });

      expect(record).toBeDefined();
      expect(record.id).toBeDefined();
      expect(record.action).toBe('TEST_AUDIT_ACTION');
      const details = typeof record.details === 'string' ? JSON.parse(record.details) : record.details;
      expect(details).toEqual({
        password: '[REDACTED]',
        safe: 'value',
      });
    });
  });

  describe('Audit Log Endpoint Authorization (GET /admin/audit-logs)', () => {
    it('should return 401 Unauthorized for unauthenticated requests', async () => {
      const res = await request(app.getHttpServer()).get(
        '/api/v1/admin/audit-logs',
      );
      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 403 Forbidden for non-admin user (CUSTOMER)', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/admin/audit-logs')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(403);
      expect(res.body.error).toBeDefined();
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('should return 200 OK with paginated list envelope for SUPER_ADMIN', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/admin/audit-logs?page=1&pageSize=10')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toBeDefined();
      expect(res.body.meta.page).toBe(1);
      expect(res.body.meta.pageSize).toBe(10);
      expect(typeof res.body.meta.total).toBe('number');
      expect(typeof res.body.meta.hasNextPage).toBe('boolean');
    });

    it('should support action query filter on GET /admin/audit-logs', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/admin/audit-logs?action=TEST_AUDIT_ACTION')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      const logs = res.body.data;
      expect(logs.every((l: any) => l.action === 'TEST_AUDIT_ACTION')).toBe(
        true,
      );
    });
  });

  describe('Automated Audit Event Creation on Authentication', () => {
    it('should record AUTH_LOGIN_SUCCESS event on valid login', async () => {
      const email = `audit-success-${Date.now()}-${Math.floor(Math.random() * 1000)}@example.com`;
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email,
          password: 'Password123!',
          fullName: 'Audit User',
          phone: `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        });

      const loginRes = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email, password: 'Password123!' });
      expect(loginRes.status).toBe(200);

      const auditRes = await request(app.getHttpServer())
        .get('/api/v1/admin/audit-logs?action=AUTH_LOGIN_SUCCESS&limit=100')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(auditRes.status).toBe(200);
      expect(auditRes.body.data.length).toBeGreaterThan(0);
      const match = auditRes.body.data.find((log: any) => {
        const d = typeof log.details === 'string' ? JSON.parse(log.details) : log.details;
        return d?.email?.toLowerCase() === email.toLowerCase();
      });
      expect(match).toBeDefined();
      expect(match.action).toBe('AUTH_LOGIN_SUCCESS');
      const details = typeof match.details === 'string' ? JSON.parse(match.details) : match.details;
      // Ensure password was not captured in details
      expect(details.password).toBeUndefined();
    });

    it('should record AUTH_LOGIN_FAILED event on bad password', async () => {
      const failEmail = `fail-${Date.now()}@example.com`;
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: failEmail, password: 'wrongpassword' });

      const auditRes = await request(app.getHttpServer())
        .get('/api/v1/admin/audit-logs?action=AUTH_LOGIN_FAILED&limit=100')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(auditRes.status).toBe(200);
      expect(auditRes.body.data.length).toBeGreaterThan(0);
      const match = auditRes.body.data.find((log: any) => {
        const d = typeof log.details === 'string' ? JSON.parse(log.details) : log.details;
        return d?.email?.toLowerCase() === failEmail.toLowerCase();
      });
      expect(match).toBeDefined();
      expect(match.action).toBe('AUTH_LOGIN_FAILED');
      const details = typeof match.details === 'string' ? JSON.parse(match.details) : match.details;
      expect(details.password).toBeUndefined();
    });
  });
});
