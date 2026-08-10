import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceEngineService } from './pricing.service';
import { PricingController } from './pricing.controller';
import {
  SellerListing,
  SellerListingPriceOverride,
  Promotion,
  TaxCategory,
  ProductVariant,
  Product,
  InventoryLocation,
  Vendor,
  Coupon,
} from '../database/entities';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SellerListing,
      SellerListingPriceOverride,
      Promotion,
      TaxCategory,
      ProductVariant,
      Product,
      InventoryLocation,
      Vendor,
      Coupon,
    ]),
    AuditModule,
  ],
  controllers: [PricingController],
  providers: [PriceEngineService],
  exports: [PriceEngineService],
})
export class PricingModule {}
