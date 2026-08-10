import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController, AdminController } from './products.controller';
import { ProductsService } from './products.service';
import { BrandsModule } from '../brands/brands.module';
import {
  Product,
  ProductVariant,
  Brand,
  Category,
  AttributeKey,
  AttributeValue,
  ProductVariantAttribute,
  ProductImage,
  VariantImage,
  SellerListing,
  Inventory,
  Vendor,
  ProductReview,
  AuditLog,
  Order,
  OrderItem,
} from '../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductVariant,
      Brand,
      Category,
      AttributeKey,
      AttributeValue,
      ProductVariantAttribute,
      ProductImage,
      VariantImage,
      SellerListing,
      Inventory,
      Vendor,
      ProductReview,
      AuditLog,
      Order,
      OrderItem,
    ]),
    BrandsModule,
  ],
  controllers: [ProductsController, AdminController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
