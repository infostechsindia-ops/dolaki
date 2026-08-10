import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { CouponsModule } from './coupons/coupons.module';
import { FladoModule } from './flado/flado.module';
import { SduiModule } from './sdui/sdui.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { AuditModule } from './audit/audit.module';
import { IdempotencyModule } from './idempotency/idempotency.module';
import { CategoriesModule } from './categories/categories.module';
import { InventoryModule } from './inventory/inventory.module';
import { PricingModule } from './pricing/pricing.module';
import { DeliveryModule } from './delivery/delivery.module';
import { CartModule } from './cart/cart.module';
import { CheckoutModule } from './checkout/checkout.module';
import { PaymentsModule } from './payments/payments.module';
import { SubstitutionsModule } from './substitutions/substitutions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { VendorsModule } from './vendors/vendors.module';
import { SupportModule } from './support/support.module';
import { BrandsModule } from './brands/brands.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { JwtAuthGuard, RolesGuard } from './auth/guards';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import * as entities from './database/entities';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CommonModule } from './common/common.module';

const isProd = process.env.NODE_ENV === 'production';
const hasPostgres = !!(process.env.DB_HOST || process.env.DATABASE_URL);

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: parseInt(process.env.THROTTLE_TTL || '60000', 10),
        limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
      },
    ]),
    TypeOrmModule.forRoot({
      type: (hasPostgres ? 'postgres' : 'sqlite') as any,
      entities: Object.values(entities).filter((e) => typeof e === 'function') as any,
      synchronize: !isProd, // disable auto-sync in production for data safety
      logging: !isProd,
      // Migrations: explicit, idempotent data migrations
      migrations: [
        join(__dirname, 'database/migrations/*{.ts,.js}'),
      ],
      // In production, migrations are executed as an explicit release step (npm run migration:run)
      // to prevent multi-instance race conditions in horizontally scaled deployments.
      migrationsRun: false,
      ...(hasPostgres
        ? {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USER || 'postgres',
            // No default — if DB_PASSWORD is unset the connection fails loudly in prod
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'auramart',
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
            extra: {
              max: parseInt(process.env.DB_POOL_MAX || '20', 10),
              idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS || '30000', 10),
            },
          }
        : {
            database: process.env.NODE_ENV === 'test' ? ':memory:' : 'auramart.db',
            extra: { busyTimeout: 5000 },
          }),
    }),
    CommonModule,
    AuditModule,
    IdempotencyModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    InventoryModule,
    PricingModule,
    DeliveryModule,
    CartModule,
    CheckoutModule,
    PaymentsModule,
    SubstitutionsModule,
    NotificationsModule,
    VendorsModule,
    SupportModule,
    BrandsModule,
    OrdersModule,
    CouponsModule,
    FladoModule,
    SduiModule,
    CampaignsModule,
    RecommendationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global rate limiting guard: applies to all routes, overridable via @Throttle / @SkipThrottle
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Global default-deny: all endpoints require JWT unless decorated @Public()
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Global role enforcement: endpoints decorated @Roles() enforce role restrictions
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
