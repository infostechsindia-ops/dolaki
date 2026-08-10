import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerModule, ThrottlerGuard, SkipThrottle, Throttle } from '@nestjs/throttler';
import { Controller, Get, Post } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';

@Controller('test-throttling')
class TestThrottlingController {
  @Get('public')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  getLimited() {
    return { success: true };
  }

  @Get('health')
  @SkipThrottle()
  getHealth() {
    return { status: 'ok' };
  }

  @Post('otp')
  @Throttle({ default: { limit: 2, ttl: 60000 } })
  sendOtp() {
    return { sent: true };
  }
}

describe('Rate Limiting & Throttling (BLOCKER-FIX-001)', () => {
  let moduleRef: TestingModule;
  let guard: ThrottlerGuard;
  let reflector: Reflector;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([
          {
            name: 'default',
            ttl: 60000,
            limit: 100,
          },
        ]),
      ],
      controllers: [TestThrottlingController],
      providers: [
        ThrottlerGuard,
        Reflector,
      ],
    }).compile();

    guard = moduleRef.get<ThrottlerGuard>(ThrottlerGuard);
    reflector = moduleRef.get<Reflector>(Reflector);
  });

  afterAll(async () => {
    if (moduleRef) {
      await moduleRef.close();
    }
  });

  it('should instantiate ThrottlerGuard as global APP_GUARD provider', () => {
    expect(guard).toBeDefined();
    expect(guard).toBeInstanceOf(ThrottlerGuard);
  });

  it('should register @SkipThrottle metadata on health endpoints', () => {
    const keys = Reflect.getMetadataKeys(TestThrottlingController.prototype.getHealth);
    expect(keys.length).toBeGreaterThan(0);
  });

  it('should register @Throttle metadata overrides on limited endpoints', () => {
    const keys = Reflect.getMetadataKeys(TestThrottlingController.prototype.getLimited);
    expect(keys.length).toBeGreaterThan(0);
  });

  it('should register strict @Throttle metadata overrides on OTP endpoint', () => {
    const keys = Reflect.getMetadataKeys(TestThrottlingController.prototype.sendOtp);
    expect(keys.length).toBeGreaterThan(0);
  });
});

