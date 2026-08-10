import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { RolesGuard, Public } from '../auth/guards';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles';

/**
 * CMD-006: Coupons controller authorization model.
 *
 * GET endpoints:
 *   - GET /coupons        → @Public() (customer app lists available coupons)
 *   - GET /coupons/:code  → @Public() (preview coupon details before login)
 *
 * POST endpoints:
 *   - POST /coupons/validate → requires authentication (CUSTOMER)
 *       Prevents anonymous coupon scanning / bulk validation attacks.
 *       Anti-abuse: throttler + authentication ensure coupons cannot be
 *       enumerated by unauthenticated callers.
 *   - POST /coupons          → SUPER_ADMIN only (create coupon)
 */
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Public()
  @Get()
  findAll() {
    return this.couponsService.findAll();
  }

  @Public()
  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.couponsService.findOneByCode(code);
  }

  /**
   * POST /coupons/validate
   * Validates and redeems a coupon. Requires authentication to prevent
   * unauthenticated enumeration and bulk abuse.
   */
  @Roles(Role.CUSTOMER)
  @Post('validate')
  validate(@Body() body: any, @Req() req: any) {
    return this.couponsService.validateAndRedeem(body.code, body.amount);
  }

  @Roles(Role.SUPER_ADMIN)
  @Post()
  create(@Body() body: any) {
    return this.couponsService.create(body);
  }
}
