/**
 * CMD-006 RBAC Integration Tests
 *
 * Tests that the global guard infrastructure correctly enforces authorization
 * across key endpoints without spinning up a real DB (uses jest mocks).
 *
 * For a full end-to-end suite with a real DB, run against a test postgres instance.
 * This suite verifies the HTTP contract: correct status codes for auth scenarios.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard, RolesGuard } from '../src/auth/guards';
import { JwtStrategy } from '../src/auth/jwt.strategy';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { Roles } from '../src/auth/roles.decorator';
import { Public } from '../src/auth/guards';
import { Role } from '../src/auth/roles';
import * as jwt from 'jsonwebtoken';

// ─── Mini test app ─────────────────────────────────────────────────────────────
// We build a minimal NestJS app with the real global guards for HTTP-level testing.
// This avoids DB dependencies while exercising the actual guard chain.

const TEST_SECRET = 'test-jwt-secret';

@Controller('test')
class TestController {
  @Public()
  @Get('public')
  publicRoute() {
    return { message: 'public' };
  }

  @Get('authenticated')
  authenticatedRoute() {
    return { message: 'authenticated' };
  }

  @Roles(Role.SUPER_ADMIN)
  @Get('admin-only')
  adminRoute() {
    return { message: 'admin' };
  }

  @Roles(Role.CUSTOMER)
  @Get('customer-only')
  customerRoute() {
    return { message: 'customer' };
  }

  @Roles(Role.MERCHANT_OWNER, Role.SUPER_ADMIN)
  @Get('merchant-only')
  merchantRoute() {
    return { message: 'merchant' };
  }
}

// ─── Token helpers ─────────────────────────────────────────────────────────────

function makeToken(payload: { sub: string; role: Role; email?: string }) {
  return jwt.sign(
    { sub: payload.sub, role: payload.role, email: payload.email ?? 'test@test.com' },
    TEST_SECRET,
    { expiresIn: '1h' },
  );
}

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('RBAC Integration (CMD-006)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: TEST_SECRET,
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [TestController],
      providers: [
        JwtStrategy,
        Reflector,
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
      ],
    })
      // Override JwtStrategy to use test secret
      .overrideProvider(JwtStrategy)
      .useFactory({
        factory: () => {
          process.env.JWT_SECRET = TEST_SECRET;
          return new JwtStrategy();
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ─── Default Deny ───────────────────────────────────────────────────────────

  it('GET /test/authenticated → 401 without token (global default-deny)', async () => {
    const response = await request(app.getHttpServer()).get('/test/authenticated');
    expect(response.status).toBe(401);
  });

  it('GET /test/admin-only → 401 without token', async () => {
    const response = await request(app.getHttpServer()).get('/test/admin-only');
    expect(response.status).toBe(401);
  });

  // ─── @Public() Opt-Out ──────────────────────────────────────────────────────

  it('GET /test/public → 200 without token (@Public() bypass)', async () => {
    const response = await request(app.getHttpServer()).get('/test/public');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('public');
  });

  // ─── Authenticated Access ────────────────────────────────────────────────────

  it('GET /test/authenticated → 200 with valid JWT', async () => {
    const token = makeToken({ sub: 'u1', role: Role.CUSTOMER });
    const response = await request(app.getHttpServer())
      .get('/test/authenticated')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  // ─── Role Enforcement ────────────────────────────────────────────────────────

  it('GET /test/admin-only → 403 for CUSTOMER role', async () => {
    const token = makeToken({ sub: 'u1', role: Role.CUSTOMER });
    const response = await request(app.getHttpServer())
      .get('/test/admin-only')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(403);
  });

  it('GET /test/admin-only → 200 for SUPER_ADMIN role', async () => {
    const token = makeToken({ sub: 'admin1', role: Role.SUPER_ADMIN });
    const response = await request(app.getHttpServer())
      .get('/test/admin-only')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it('GET /test/customer-only → 403 for MERCHANT_OWNER', async () => {
    const token = makeToken({ sub: 'merchant1', role: Role.MERCHANT_OWNER });
    const response = await request(app.getHttpServer())
      .get('/test/customer-only')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(403);
  });

  it('GET /test/merchant-only → 403 for CUSTOMER', async () => {
    const token = makeToken({ sub: 'u1', role: Role.CUSTOMER });
    const response = await request(app.getHttpServer())
      .get('/test/merchant-only')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(403);
  });

  it('GET /test/merchant-only → 200 for MERCHANT_OWNER', async () => {
    const token = makeToken({ sub: 'merchant1', role: Role.MERCHANT_OWNER });
    const response = await request(app.getHttpServer())
      .get('/test/merchant-only')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it('GET /test/merchant-only → 200 for SUPER_ADMIN (multi-role endpoint)', async () => {
    const token = makeToken({ sub: 'admin1', role: Role.SUPER_ADMIN });
    const response = await request(app.getHttpServer())
      .get('/test/merchant-only')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  // ─── Expired Token ───────────────────────────────────────────────────────────

  it('GET /test/authenticated → 401 with expired token', async () => {
    const expiredToken = jwt.sign(
      { sub: 'u1', role: Role.CUSTOMER, email: 'test@test.com' },
      TEST_SECRET,
      { expiresIn: '-1s' }, // already expired
    );
    const response = await request(app.getHttpServer())
      .get('/test/authenticated')
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(response.status).toBe(401);
  });

  // ─── Invalid Token ───────────────────────────────────────────────────────────

  it('GET /test/authenticated → 401 with tampered token', async () => {
    const tampered = 'Bearer totally.invalid.token';
    const response = await request(app.getHttpServer())
      .get('/test/authenticated')
      .set('Authorization', tampered);
    expect(response.status).toBe(401);
  });
});
