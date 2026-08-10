import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpToken, User, RefreshToken, FladoShop, Product, Vendor, VendorStaff, Rider } from '../database/entities';
import { ThrottlerModule } from '@nestjs/throttler';
import {
  JwtAuthGuard,
  RolesGuard,
  ShopOwnerGuard,
  ProductOwnerGuard,
  RiderShopGuard,
} from './guards';

@Module({
  imports: [
    // Entity repos needed by guards
    TypeOrmModule.forFeature([
      OtpToken,
      User,
      RefreshToken,
      FladoShop,    // ShopOwnerGuard, RiderShopGuard
      Product,      // ProductOwnerGuard
      Vendor,       // ProductOwnerGuard
      VendorStaff,  // ShopOwnerGuard
      Rider,        // RiderShopGuard
    ]),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' }, // 15 minutes expiration for access token
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 20, // default global rate limit
    }]),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthService,
    JwtAuthGuard,
    RolesGuard,
    ShopOwnerGuard,
    ProductOwnerGuard,
    RiderShopGuard,
  ],
  exports: [
    JwtModule,
    AuthService,
    JwtAuthGuard,
    RolesGuard,
    ShopOwnerGuard,
    ProductOwnerGuard,
    RiderShopGuard,
  ],
})
export class AuthModule {}
