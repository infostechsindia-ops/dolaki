import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Roles('CUSTOMER', 'VENDOR', 'ADMIN')
  findAll() {
    return this.ordersService.findAll();
  }

  @Post()
  @Roles('CUSTOMER')
  createOrder() {
    return this.ordersService.create();
  }
}
