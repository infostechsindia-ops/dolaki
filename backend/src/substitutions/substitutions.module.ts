import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubstitutionsController } from './substitutions.controller';
import { SubstitutionsService } from './substitutions.service';
import {
  Order,
  OrderItem,
  OrderItemSubstitution,
  Inventory,
  Product,
  ProductVariant,
  OrderTrackingEvent,
} from '../database/entities';
import { AuditModule } from '../audit/audit.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      OrderItemSubstitution,
      Inventory,
      Product,
      ProductVariant,
      OrderTrackingEvent,
    ]),
    AuditModule,
    PaymentsModule,
  ],
  controllers: [SubstitutionsController],
  providers: [SubstitutionsService],
  exports: [SubstitutionsService],
})
export class SubstitutionsModule {}
