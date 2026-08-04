import { Controller, Get, Post, Put, Param, Request, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.ordersService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.ordersService.findOne(id, req.user);
  }

  @Post()
  @Roles('CUSTOMER')
  createOrder(@Request() req: any, @Body() body: any) {
    return this.ordersService.create(req.user, body);
  }

  @Put(':id/status')
  @Roles('ADMIN', 'VENDOR', 'DELIVERY')
  updateStatus(@Param('id') id: string, @Body() body: any) {
    return this.ordersService.updateStatus(id, body.status);
  }

  @Post(':id/return')
  @Roles('CUSTOMER')
  createReturn(@Param('id') id: string, @Request() req: any, @Body() body: any) {
    return this.ordersService.createReturn(id, req.user.userId, body);
  }

  @Get(':id/return')
  getReturnStatus(@Param('id') id: string) {
    return this.ordersService.getReturnStatus(id);
  }
}

@Controller('returns')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReturnsController {
  constructor(private readonly ordersService: OrdersService) {}

  @Put(':id/approve')
  @Roles('ADMIN', 'VENDOR')
  approveReturn(@Param('id') id: string, @Body() body: any) {
    return this.ordersService.approveReturn(id, body.refundAmount);
  }

  @Put(':id/reject')
  @Roles('ADMIN', 'VENDOR')
  rejectReturn(@Param('id') id: string) {
    return this.ordersService.rejectReturn(id);
  }
}
