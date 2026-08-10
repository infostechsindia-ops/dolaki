import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CheckoutService } from './checkout.service';
import { CheckoutPreviewDto, CheckoutPreviewResponseDto } from './dto/checkout-preview.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('preview')
  @Roles(Role.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  async getPreview(
    @Req() req: any,
    @Body() dto: CheckoutPreviewDto,
  ): Promise<CheckoutPreviewResponseDto> {
    const customerId = req.user.userId;
    return this.checkoutService.getPreview(customerId, dto);
  }
}
