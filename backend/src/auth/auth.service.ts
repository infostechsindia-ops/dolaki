import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, LessThan } from 'typeorm';
import { OtpToken, User, RefreshToken } from '../database/entities';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(OtpToken)
    private readonly otpRepository: Repository<OtpToken>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
  ) {}

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private isTestPhone(phone: string): boolean {
    const isDev = process.env.NODE_ENV !== 'production';
    const isDemoEnabled = process.env.ENABLE_DEMO_FIXTURES === 'true';
    if (!isDev || !isDemoEnabled) {
      return false;
    }
    const testPhonesEnv = process.env.TEST_PHONE_NUMBERS || '';
    const testPhones = testPhonesEnv.split(',').map((p) => p.trim());
    return testPhones.includes(phone);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.passwordHash) {
      const isMatch = await bcrypt.compare(pass, user.passwordHash);
      if (isMatch) {
        const { passwordHash, ...result } = user;
        return result;
      }
    }
    await this.auditService.log({
      action: 'AUTH_LOGIN_FAILED',
      resourceType: 'User',
      details: { email },
    });
    return null;
  }

  async login(user: any, ipAddress?: string, userAgent?: string) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    
    // Generate secure random refresh token
    const rawRefreshToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawRefreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Explicit 7 days lifetime

    const refreshTokenRecord = this.refreshTokenRepository.create({
      userId: user.id,
      tokenHash,
      expiresAt,
      ipAddress,
      userAgent,
    });
    await this.refreshTokenRepository.save(refreshTokenRecord);

    // Record audit event for successful login
    await this.auditService.log({
      actorId: user.id,
      actorRole: user.role,
      action: 'AUTH_LOGIN_SUCCESS',
      resourceType: 'User',
      resourceId: user.id,
      details: { email: user.email },
      ipAddress,
      userAgent,
    });

    // Garbage Collection: Delete expired refresh tokens for this user
    try {
      await this.refreshTokenRepository.delete({
        userId: user.id,
        expiresAt: LessThan(new Date()),
      });
    } catch (e) {
      // Ignore background GC failures
    }

    return {
      access_token: accessToken,
      refresh_token: rawRefreshToken,
      token: accessToken, // for client compatibility
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async register(data: {
    email: string;
    pass: string;
    fullName: string;
    phone?: string;
  }, ipAddress?: string, userAgent?: string) {
    const existing = await this.usersService.findOneByEmail(data.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.pass, salt);

    const user = await this.usersService.create({
      email: data.email,
      passwordHash,
      fullName: data.fullName,
      role: 'CUSTOMER',
      phone: data.phone,
      isActive: true,
    });

    return this.login(user, ipAddress, userAgent);
  }

  async registerVendor(data: {
    email: string;
    pass: string;
    fullName: string;
    phone?: string;
  }, ipAddress?: string, userAgent?: string) {
    const existing = await this.usersService.findOneByEmail(data.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.pass, salt);

    const user = await this.usersService.create({
      email: data.email,
      passwordHash,
      fullName: data.fullName,
      role: 'VENDOR_OWNER',
      phone: data.phone,
      isActive: true,
    });

    return this.login(user, ipAddress, userAgent);
  }

  async sendOtp(phone: string) {
    // Cooldown check: 60 seconds
    const latestOtp = await this.otpRepository.findOne({
      where: { phone },
      order: { createdAt: 'DESC' },
    });

    if (latestOtp) {
      const timeSinceLast = Date.now() - latestOtp.createdAt.getTime();
      if (timeSinceLast < 60000) {
        throw new HttpException(
          'Please wait 60 seconds before requesting another OTP.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes expiry

    const otpRecord = this.otpRepository.create({
      phone,
      otp,
      purpose: 'LOGIN',
      expiresAt,
      attempts: 0,
    });
    await this.otpRepository.save(otpRecord);

    // Development/Test config check
    if (this.isTestPhone(phone)) {
      console.log(`[DEV/TEST ONLY] OTP for ${phone} is ${otp}`);
    }

    // Never return OTP in response body
    return { success: true, message: 'OTP sent successfully' };
  }

  async verifyOtp(phone: string, otp: string, ipAddress?: string, userAgent?: string) {
    const otpRecord = await this.otpRepository.findOne({
      where: { phone, purpose: 'LOGIN', usedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });

    if (!otpRecord || otpRecord.expiresAt < new Date() || otpRecord.attempts >= 3) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Verify mock OTP if phone is allowed test identity in non-production
    const isMockBypass = otp === '123456' && this.isTestPhone(phone);
    const isMatch = otpRecord.otp === otp || isMockBypass;

    if (!isMatch) {
      otpRecord.attempts += 1;
      if (otpRecord.attempts >= 3) {
        otpRecord.expiresAt = new Date(0); // Invalidate token immediately
      }
      await this.otpRepository.save(otpRecord);
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // One-time consumption
    otpRecord.usedAt = new Date();
    await this.otpRepository.save(otpRecord);

    let user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      const email = `${phone}@auramart-temp.com`;
      user = await this.usersService.create({
        email,
        phone,
        fullName: 'AuraMart User',
        role: 'CUSTOMER',
        isActive: true,
      });
    }

    return this.login(user, ipAddress, userAgent);
  }

  async refreshToken(token: string, ipAddress?: string, userAgent?: string) {
    const tokenHash = this.hashToken(token);
    const tokenRecord = await this.refreshTokenRepository.findOne({
      where: { tokenHash },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (tokenRecord.isRevoked) {
      // Concurrency/Race Condition Grace Period (15 seconds)
      if (
        tokenRecord.rotatedAt &&
        Date.now() - tokenRecord.rotatedAt.getTime() < 15000
      ) {
        // Concurrency grace period: issue new Access Token but do NOT rotate refresh token again
        const user = await this.userRepository.findOne({
          where: { id: tokenRecord.userId },
        });
        if (!user || !user.isActive) {
          throw new UnauthorizedException('Invalid refresh token');
        }
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
          access_token: this.jwtService.sign(payload),
          token: this.jwtService.sign(payload),
        };
      }

      // Beyond grace period -> assume replay attack -> revoke all user sessions
      await this.refreshTokenRepository.update(
        { userId: tokenRecord.userId },
        { isRevoked: true },
      );
      throw new UnauthorizedException('Token reuse detected. All sessions revoked.');
    }

    // Token is valid and active: rotate it
    const user = await this.userRepository.findOne({
      where: { id: tokenRecord.userId },
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const rawRefreshToken = crypto.randomBytes(32).toString('hex');
    const newHash = this.hashToken(rawRefreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Update old token to indicate rotation
    tokenRecord.isRevoked = true;
    tokenRecord.rotatedAt = new Date();
    tokenRecord.replacedByTokenHash = newHash;
    await this.refreshTokenRepository.save(tokenRecord);

    // Save new refresh token record
    const newRecord = this.refreshTokenRepository.create({
      userId: user.id,
      tokenHash: newHash,
      expiresAt,
      ipAddress,
      userAgent,
    });
    await this.refreshTokenRepository.save(newRecord);

    // Garbage Collection: Delete expired refresh tokens for this user
    try {
      await this.refreshTokenRepository.delete({
        userId: user.id,
        expiresAt: LessThan(new Date()),
      });
    } catch (e) {
      // Ignore background GC failures
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: rawRefreshToken,
      token: this.jwtService.sign(payload),
    };
  }

  async logout(token: string) {
    const tokenHash = this.hashToken(token);
    await this.refreshTokenRepository.update({ tokenHash }, { isRevoked: true });
    return { success: true };
  }

  async logoutAll(userId: string) {
    await this.refreshTokenRepository.update({ userId }, { isRevoked: true });
    return { success: true };
  }

  async getSessions(userId: string) {
    const activeSessions = await this.refreshTokenRepository.find({
      where: { userId, isRevoked: false, expiresAt: LessThan(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) },
      order: { createdAt: 'DESC' },
    });

    // filter manually to ensure expired tokens are skipped
    const now = new Date();
    return activeSessions
      .filter((s) => s.expiresAt > now)
      .map((s) => ({
        id: s.id,
        ipAddress: s.ipAddress,
        userAgent: s.userAgent,
        createdAt: s.createdAt,
        expiresAt: s.expiresAt,
      }));
  }

  // CONTENT-006: Customer Profile Management
  async updateProfile(userId: string, updateDto: any) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User profile not found');

    if (updateDto.fullName) user.fullName = updateDto.fullName.trim();
    if (updateDto.phone) user.phone = updateDto.phone.trim();
    if (updateDto.email) user.email = updateDto.email.trim();

    await this.userRepository.save(user);

    return {
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  async updatePassword(userId: string, passwordDto: { currentPassword?: string; newPassword?: string }) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (passwordDto.newPassword) {
      user.passwordHash = await bcrypt.hash(passwordDto.newPassword, 10);
      await this.userRepository.save(user);
    }

    return { success: true, message: 'Password updated successfully' };
  }
}
