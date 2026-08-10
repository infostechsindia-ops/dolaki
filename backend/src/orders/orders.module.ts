import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController, ReturnsController } from './orders.controller';
import { OrdersService } from './orders.service';
import {
  Order,
  OrderItem,
  Payment,
  UserWallet,
  Inventory,
  ReturnRequest,
  LoyaltyTransaction,
  Coupon,
  Cart,
  OrderTrackingEvent,
  Rider,
  OrderCancellation,
  ReturnTrackingEvent,
} from '../database/entities';
import { PricingModule } from '../pricing/pricing.module';
import { CartModule } from '../cart/cart.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Payment,
      UserWallet,
      Inventory,
      ReturnRequest,
      LoyaltyTransaction,
      Coupon,
      Cart,
      OrderTrackingEvent,
      Rider,
      OrderCancellation,
      ReturnTrackingEvent,
    ]),
    PricingModule,
    CartModule,
    CheckoutModule,
    PaymentsModule,
  ],
  controllers: [OrdersController, ReturnsController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
