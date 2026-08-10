import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { RefundsService } from './refunds.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { ConfirmPaymentIntentDto } from './dto/confirm-payment-intent.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles';
import { Public } from '../auth/guards';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly refundsService: RefundsService,
  ) {}

  @Roles(Role.CUSTOMER)
  @Post('intents')
  @HttpCode(HttpStatus.CREATED)
  async createIntent(
    @Request() req: any,
    @Body() dto: CreatePaymentIntentDto,
    @Headers('x-idempotency-key') idempotencyHeader?: string,
  ) {
    return this.paymentsService.createIntent(
      req.user.userId,
      dto,
      idempotencyHeader,
    );
  }

  @Roles(Role.CUSTOMER)
  @Get('intents/:id')
  async getIntent(
    @Request() req: any,
    @Param('id') intentId: string,
  ) {
    return this.paymentsService.getIntent(req.user.userId, intentId);
  }

  @Roles(Role.CUSTOMER)
  @Post('intents/:id/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmIntent(
    @Request() req: any,
    @Param('id') intentId: string,
    @Body() dto: ConfirmPaymentIntentDto,
  ) {
    return this.paymentsService.confirmIntent(
      req.user.userId,
      intentId,
      dto,
    );
  }

  @Roles(Role.CUSTOMER)
  @Post('intents/:id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancelIntent(
    @Request() req: any,
    @Param('id') intentId: string,
  ) {
    return this.paymentsService.cancelIntent(req.user.userId, intentId);
  }

  @Roles(Role.CUSTOMER, Role.SUPER_ADMIN, Role.OPERATIONS)
  @Get('refunds/:id')
  async getRefundDetails(
    @Request() req: any,
    @Param('id') refundId: string,
  ) {
    return this.refundsService.getRefundDetails(req.user, refundId);
  }

  @Roles(Role.CUSTOMER, Role.SUPER_ADMIN, Role.OPERATIONS)
  @Get('orders/:id/refunds')
  async getRefundsForOrder(
    @Request() req: any,
    @Param('id') orderId: string,
  ) {
    return this.refundsService.getRefundsForOrder(req.user, orderId);
  }

  @Public()
  @Post('webhooks/:provider')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Param('provider') provider: string,
    @Headers('x-signature') signature: string,
    @Body() body: any,
  ) {
    if (body?.event === 'refund.succeeded' || body?.event === 'refund.failed') {
      const ref = body?.refundReference || body?.data?.object?.id || body?.id;
      const status = body?.event === 'refund.succeeded' ? 'SUCCEEDED' : 'FAILED';
      return this.refundsService.processWebhookRefundEvent(ref, status, body?.failureMessage);
    }
    return this.paymentsService.handleWebhook(provider, signature, body);
  }
}
