import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { DeliveryModule } from '../delivery/delivery.module';
import { Cart, CartItem, ProductVariant, Product, Inventory, FladoShop, Coupon, User } from '../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
      CartItem,
      ProductVariant,
      Product,
      Inventory,
      FladoShop,
      Coupon,
      User,
    ]),
    DeliveryModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
