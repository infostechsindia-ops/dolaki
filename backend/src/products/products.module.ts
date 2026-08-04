import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController, AdminController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, Category, Inventory, Vendor, ProductReview, AuditLog } from '../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Inventory, Vendor, ProductReview, AuditLog])],
  controllers: [ProductsController, AdminController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
