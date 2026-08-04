import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { OtpToken, User } from '../database/entities';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(OtpToken)
    private readonly otpRepository: Repository<OtpToken>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.passwordHash) {
      const isMatch = await bcrypt.compare(pass, user.passwordHash);
      if (isMatch) {
        const { passwordHash, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      }
    };
  }

  async register(data: { email: string; pass: string; fullName: string; phone?: string }) {
    const existing = await this.usersService.findOneByEmail(data.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.pass, salt);

    // Hardcode CUSTOMER role to prevent self-role escalation security vulnerability
    const user = await this.usersService.create({
      email: data.email,
      passwordHash,
      fullName: data.fullName,
      role: 'CUSTOMER',
      phone: data.phone,
      isActive: true,
    });

    return this.login(user);
  }

  async registerVendor(data: { email: string; pass: string; fullName: string; phone?: string }) {
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
      role: 'VENDOR',
      phone: data.phone,
      isActive: true,
    });

    return this.login(user);
  }

  async sendOtp(phone: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    const otpRecord = this.otpRepository.create({
      phone,
      otp,
      purpose: 'LOGIN',
      expiresAt,
    });
    await this.otpRepository.save(otpRecord);

    // Placeholder for mTalkz SMS integration
    // await this.smsService.send(phone, `Your AuraMart OTP is ${otp}`);

    return { success: true, message: 'OTP sent successfully', otp }; // Returning OTP for now as requested
  }

  async verifyOtp(phone: string, otp: string) {
    const otpRecord = await this.otpRepository.findOne({
      where: { phone, otp, purpose: 'LOGIN', usedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    otpRecord.usedAt = new Date();
    await this.otpRepository.save(otpRecord);

    let user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      // Find or create logic: need an email so generate a dummy one
      const email = `${phone}@auramart-temp.com`;
      user = await this.usersService.create({
        email,
        phone,
        fullName: 'AuraMart User',
        role: 'CUSTOMER',
        isActive: true,
      });
    }

    return this.login(user);
  }

  async refreshToken(oldToken: string) {
    try {
      const decoded = this.jwtService.verify(oldToken, { ignoreExpiration: true });
      const user = await this.userRepository.findOne({ where: { id: decoded.sub } });
      if (!user || !user.isActive) throw new UnauthorizedException('Invalid token');
      
      const payload = { email: user.email, sub: user.id, role: user.role };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
