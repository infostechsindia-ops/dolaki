import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { EtaService } from './eta.service';
import { ProductVariant, Product, Inventory, FladoShop, Order, Address } from '../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductVariant, Product, Inventory, FladoShop, Order, Address]),
  ],
  controllers: [DeliveryController],
  providers: [DeliveryService, EtaService],
  exports: [DeliveryService, EtaService],
})
export class DeliveryModule {}
