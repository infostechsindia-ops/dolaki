import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentIntent, PaymentAttempt, Refund, RefundItem, RefundAttempt, Order } from '../database/entities';
import { CheckoutModule } from '../checkout/checkout.module';
import { PaymentsService } from './payments.service';
import { RefundsService } from './refunds.service';
import { PaymentsController } from './payments.controller';
import { CodPaymentProvider } from './providers/cod-payment.provider';
import { GenericGatewayProvider } from './providers/generic-gateway.provider';
import { StripePaymentProvider } from './providers/stripe-payment.provider';
import { RazorpayPaymentProvider } from './providers/razorpay-payment.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentIntent, PaymentAttempt, Refund, RefundItem, RefundAttempt, Order]),
    CheckoutModule,
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    RefundsService,
    CodPaymentProvider,
    GenericGatewayProvider,
    StripePaymentProvider,
    RazorpayPaymentProvider,
    {
      provide: 'PAYMENT_PROVIDERS',
      useFactory: (
        cod: CodPaymentProvider,
        generic: GenericGatewayProvider,
        stripe: StripePaymentProvider,
        razorpay: RazorpayPaymentProvider,
      ) => {
        const map = new Map();
        map.set('COD', cod);
        map.set('GENERIC', generic);
        map.set('STRIPE', stripe);
        map.set('RAZORPAY', razorpay);
        return map;
      },
      inject: [CodPaymentProvider, GenericGatewayProvider, StripePaymentProvider, RazorpayPaymentProvider],
    },
  ],
  exports: [PaymentsService, RefundsService, 'PAYMENT_PROVIDERS'],
})
export class PaymentsModule {}
