import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FladoController } from './flado.controller';
import { FladoService } from './flado.service';
import {
  Darkstore, Product, Order, OrderItem, Inventory,
  FladoShop, ShopSubscription, ShopCredit, CreditTransaction, Category, Rider, ShopHours,
} from '../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Darkstore, Product, Order, OrderItem, Inventory,
      FladoShop, ShopSubscription, ShopCredit, CreditTransaction, Category, Rider, ShopHours,
    ]),
  ],
  controllers: [FladoController],
  providers: [FladoService],
  exports: [FladoService],
})
export class FladoModule {}
