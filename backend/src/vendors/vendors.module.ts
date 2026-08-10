import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Vendor,
  SellerListing,
  Inventory,
  Order,
  OrderItem,
  Product,
  ProductVariant,
  Category,
  ProductImage,
  StockHistory,
  PriceHistory,
  OrderTrackingEvent,
  ReturnRequest,
  ReturnTrackingEvent,
  VendorSettlementLedger,
  VendorPayout,
  VendorStaff,
  VendorInvitation,
  VendorActivityLog,
  User,
} from '../database/entities';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Vendor,
      SellerListing,
      Inventory,
      Order,
      OrderItem,
      Product,
      ProductVariant,
      Category,
      ProductImage,
      StockHistory,
      PriceHistory,
      OrderTrackingEvent,
      ReturnRequest,
      ReturnTrackingEvent,
      VendorSettlementLedger,
      VendorPayout,
      VendorStaff,
      VendorInvitation,
      VendorActivityLog,
      User,
    ]),
  ],
  controllers: [VendorsController],
  providers: [VendorsService],
  exports: [VendorsService],
})
export class VendorsModule {}
