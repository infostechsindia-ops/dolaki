import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController, ReturnsController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order, OrderItem, Payment, UserWallet, Inventory, ReturnRequest, LoyaltyTransaction } from '../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Payment, UserWallet, Inventory, ReturnRequest, LoyaltyTransaction])],
  controllers: [OrdersController, ReturnsController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
