import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FladoController } from './flado.controller';
import { FladoService } from './flado.service';
import { QuickFeesService } from './quick-fees.service';
import { FladoVipService } from './flado-vip.service';
import { FladoVipController } from './flado-vip.controller';
import {
  Darkstore,
  Product,
  Order,
  OrderItem,
  Inventory,
  FladoShop,
  ShopSubscription,
  ShopCredit,
  CreditTransaction,
  Category,
  Rider,
  ShopHours,
  User,
  Address,
  Banner,
  Vendor,
  VendorStaff,
  VendorInvitation,
  VendorActivityLog,
  StockHistory,
  PriceHistory,
  OrderTrackingEvent,
  FladoVipSubscription,
  PaymentIntent,
} from '../database/entities';
import { DeliveryModule } from '../delivery/delivery.module';
import { CampaignsModule } from '../campaigns/campaigns.module';

@Module({
  imports: [
    DeliveryModule,
    CampaignsModule,
    TypeOrmModule.forFeature([
      Darkstore,
      Product,
      Order,
      OrderItem,
      Inventory,
      FladoShop,
      ShopSubscription,
      ShopCredit,
      CreditTransaction,
      Category,
      Rider,
      ShopHours,
      User,
      Address,
      Banner,
      Vendor,
      VendorStaff,
      VendorInvitation,
      VendorActivityLog,
      StockHistory,
      PriceHistory,
      OrderTrackingEvent,
      FladoVipSubscription,
      PaymentIntent,
    ]),
  ],
  controllers: [FladoController, FladoVipController],
  providers: [FladoService, QuickFeesService, FladoVipService],
  exports: [FladoService, QuickFeesService, FladoVipService],
})
export class FladoModule {}
