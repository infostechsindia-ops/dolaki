import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/roles.decorator';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  findAll() {
    return this.couponsService.findAll();
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.couponsService.findOneByCode(code);
  }

  @Post('validate')
  validate(@Body() body: any) {
    return this.couponsService.validateAndRedeem(body.code, body.amount);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() body: any) {
    return this.couponsService.create(body);
  }
}
