import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  InventoryLocation,
  InventoryBalance,
  SellerListing,
  ProductVariant,
  Vendor,
  FladoShop,
  Inventory,
  AuditLog,
  InventoryReservation,
  InventoryReservationItem,
} from '../database/entities';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { AuditModule } from '../audit/audit.module';
import { IdempotencyModule } from '../idempotency/idempotency.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InventoryLocation,
      InventoryBalance,
      SellerListing,
      ProductVariant,
      Vendor,
      FladoShop,
      Inventory,
      AuditLog,
      InventoryReservation,
      InventoryReservationItem,
    ]),
    AuditModule,
    IdempotencyModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
