import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards';
import { FladoVipService } from './flado-vip.service';

@Controller('flado/vip')
@UseGuards(JwtAuthGuard)
export class FladoVipController {
  constructor(private readonly vipService: FladoVipService) {}

  @Get('status')
  async getStatus(@Request() req: any) {
    return this.vipService.getStatus(req.user.userId);
  }

  @Post('subscribe')
  async subscribe(
    @Request() req: any,
    @Body() body: { plan: string },
    @Headers('x-idempotency-key') idempotencyKey?: string,
  ) {
    return this.vipService.subscribe(req.user.userId, body.plan, idempotencyKey);
  }

  @Post('confirm-payment')
  async confirmPayment(
    @Request() req: any,
    @Body() body: { subscriptionId: string },
  ) {
    return this.vipService.confirmPayment(req.user.userId, body.subscriptionId);
  }

  @Post('cancel')
  async cancel(@Request() req: any) {
    return this.vipService.cancelSubscription(req.user.userId);
  }
}
