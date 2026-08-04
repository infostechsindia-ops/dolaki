import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { CouponsModule } from './coupons/coupons.module';
import { FladoModule } from './flado/flado.module';
import { SduiModule } from './sdui/sdui.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import * as entities from './database/entities';

const isProd = process.env.NODE_ENV === 'production';
const hasPostgres = !!(process.env.DB_HOST || process.env.DATABASE_URL);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: (hasPostgres ? 'postgres' : 'sqlite') as any,
      entities: Object.values(entities),
      synchronize: !isProd, // disable auto-sync in production for data safety
      logging: !isProd,
      ...(hasPostgres ? {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'auramart',
      } : {
        database: 'auramart.db',
      }),
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    CouponsModule,
    FladoModule,
    SduiModule,
    CampaignsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
