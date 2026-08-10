import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { OtpToken, User, RefreshToken } from '../database/entities';
import { UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let otpRepo: any;
  let userRepo: any;
  let refreshRepo: any;
  let jwtService: any;
  let usersService: any;

  beforeEach(async () => {
    otpRepo = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
      findOne: jest.fn(),
    };

    userRepo = {
      findOne: jest.fn(),
    };

    refreshRepo = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
      findOne: jest.fn(),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    usersService = {
      findOneByEmail: jest.fn(),
      create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'user-1', ...dto })),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-access-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(OtpToken), useValue: otpRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: getRepositoryToken(RefreshToken), useValue: refreshRepo },
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: (require('../audit/audit.service').AuditService), useValue: { log: jest.fn().mockResolvedValue(undefined), logAction: jest.fn().mockResolvedValue(undefined) } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('sendOtp() Cooldown and Security', () => {
    it('should generate an OTP and log it in non-production environment, but not leak in response', async () => {
      process.env.NODE_ENV = 'development';
      process.env.ENABLE_DEMO_FIXTURES = 'true';
      process.env.TEST_PHONE_NUMBERS = '+919999999999';

      otpRepo.findOne.mockResolvedValue(null);

      const result = await service.sendOtp('+919999999999');
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect((result as any).otp).toBeUndefined(); // OTP must never be returned in body
    });

    it('should enforce 60s resend cooldown', async () => {
      // Mock recent OTP sent 10 seconds ago
      otpRepo.findOne.mockResolvedValue({
        createdAt: new Date(Date.now() - 10000),
      });
      
      await expect(service.sendOtp('+919999999999')).rejects.toThrow(
        new HttpException(
          'Please wait 60 seconds before requesting another OTP.',
          HttpStatus.TOO_MANY_REQUESTS,
        ),
      );
    });
  });

  describe('verifyOtp() Attempt Limits', () => {
    it('should fail validation on invalid OTP, increment attempts, and invalidate token on 3 failures', async () => {
      process.env.NODE_ENV = 'development';
      process.env.ENABLE_DEMO_FIXTURES = 'true';
      process.env.TEST_PHONE_NUMBERS = '+919999999999';

      const mockOtpRecord = {
        phone: '+919999999999',
        otp: '654321',
        expiresAt: new Date(Date.now() + 600000),
        attempts: 0,
      };
      otpRepo.findOne.mockResolvedValue(mockOtpRecord);
      
      // 1st invalid verify
      await expect(service.verifyOtp('+919999999999', 'wrong-otp')).rejects.toThrow(UnauthorizedException);
      expect(mockOtpRecord.attempts).toBe(1);

      // 2nd invalid verify
      await expect(service.verifyOtp('+919999999999', 'wrong-otp')).rejects.toThrow(UnauthorizedException);
      expect(mockOtpRecord.attempts).toBe(2);

      // 3rd invalid verify should fail and set expiresAt to past
      await expect(service.verifyOtp('+919999999999', 'wrong-otp')).rejects.toThrow(UnauthorizedException);
      expect(mockOtpRecord.attempts).toBe(3);
      expect(mockOtpRecord.expiresAt.getTime()).toBe(0);
    });

    it('should allow 123456 bypass only for configured test phone numbers in development environment', async () => {
      process.env.NODE_ENV = 'development';
      process.env.ENABLE_DEMO_FIXTURES = 'true';
      process.env.TEST_PHONE_NUMBERS = '+919999999999';

      const mockOtpRecord = {
        phone: '+919999999999',
        otp: '654321',
        expiresAt: new Date(Date.now() + 600000),
        attempts: 0,
      };
      otpRepo.findOne.mockResolvedValue(mockOtpRecord);
      userRepo.findOne.mockResolvedValue({ id: 'user-1', phone: '+919999999999', email: 'test@auramart.com', fullName: 'Test User', role: 'CUSTOMER' });

      const result = await service.verifyOtp('+919999999999', '123456');
      expect(result.access_token).toBe('mock-jwt-access-token');
    });
  });

  describe('Refresh Token Rotation (RTR) and Grace Period', () => {
    it('should rotate valid refresh tokens and hash them in DB', async () => {
      const user = { id: 'user-123', email: 'seller@auramart.com', fullName: 'Seller', role: 'VENDOR_OWNER', isActive: true };
      userRepo.findOne.mockResolvedValue(user);

      // Mock active token lookup
      const mockTokenRecord = {
        userId: 'user-123',
        tokenHash: 'somehash',
        expiresAt: new Date(Date.now() + 600000),
        isRevoked: false,
      };
      refreshRepo.findOne.mockResolvedValue(mockTokenRecord);

      const refreshResult = await service.refreshToken('raw-token');
      expect(refreshResult.access_token).toBe('mock-jwt-access-token');
      expect(refreshResult.refresh_token).toBeDefined();
    });

    it('should handle concurrency grace period (15s) by returning new access token without rotating again', async () => {
      const user = { id: 'user-123', email: 'seller@auramart.com', fullName: 'Seller', role: 'VENDOR_OWNER', isActive: true };
      userRepo.findOne.mockResolvedValue(user);

      // Mock recently rotated token
      const mockTokenRecord = {
        userId: 'user-123',
        tokenHash: 'somehash',
        expiresAt: new Date(Date.now() + 600000),
        isRevoked: true,
        rotatedAt: new Date(Date.now() - 5000), // rotated 5 seconds ago (grace period)
      };
      refreshRepo.findOne.mockResolvedValue(mockTokenRecord);

      const refreshResult = await service.refreshToken('raw-token');
      expect(refreshResult.access_token).toBe('mock-jwt-access-token');
      expect(refreshResult.refresh_token).toBeUndefined(); // Grace period returns no new refresh token
    });

    it('should revoke all user sessions if reuse occurs outside grace period', async () => {
      const user = { id: 'user-123', email: 'seller@auramart.com', fullName: 'Seller', role: 'VENDOR_OWNER', isActive: true };
      userRepo.findOne.mockResolvedValue(user);

      // Mock expired/old rotated token
      const mockTokenRecord = {
        userId: 'user-123',
        tokenHash: 'somehash',
        expiresAt: new Date(Date.now() + 600000),
        isRevoked: true,
        rotatedAt: new Date(Date.now() - 20000), // 20s ago (outside grace period)
      };
      refreshRepo.findOne.mockResolvedValue(mockTokenRecord);

      await expect(service.refreshToken('raw-token')).rejects.toThrow(UnauthorizedException);
      expect(refreshRepo.update).toHaveBeenCalledWith(
        { userId: 'user-123' },
        { isRevoked: true },
      );
    });
  });
});
