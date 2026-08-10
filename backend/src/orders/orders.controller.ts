import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  Request,
  Body,
  ForbiddenException,
  UseInterceptors,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles';
import { IdempotencyInterceptor } from '../idempotency/idempotency.interceptor';
import { Idempotent } from '../idempotency/idempotency.decorator';

/**
 * CMD-006, CMD-009, CMD-047: Orders controller authorization, idempotency, and history search.
 */
@Controller('orders')
@Roles(Role.CUSTOMER, Role.VENDOR_OWNER, Role.VENDOR_STAFF, Role.SUPER_ADMIN, Role.OPERATIONS)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(Role.CUSTOMER, Role.SUPER_ADMIN, Role.OPERATIONS)
  @Get('summary')
  getOrderSummary(@Request() req: any) {
    return this.ordersService.getOrderSummary(req.user);
  }

  @Roles(Role.VENDOR_OWNER, Role.VENDOR_STAFF, Role.SUPER_ADMIN, Role.OPERATIONS)
  @Get('vendor/queue')
  getVendorQueue(@Request() req: any) {
    return this.ordersService.getVendorOrderQueue(req.user?.vendorId || 'vendor-1');
  }

  @Get()
  findAll(@Request() req: any, @Query() query: any) {
    return this.ordersService.findAll(req.user, query);
  }

  @Get(':id/invoice')
  getInvoice(@Param('id') id: string, @Request() req: any) {
    return this.ordersService.getInvoice(req.user, id);
  }

  /**
   * GET /orders/:id/tracking — Authoritative Order Tracking Event timeline (CMD-048)
   */
  @Get(':id/tracking')
  getOrderTracking(@Param('id') id: string, @Request() req: any) {
    return this.ordersService.getOrderTracking(req.user, id);
  }

  /**
   * POST /orders/:id/tracking/events — Server-side tracking event recording for ops/vendors/riders (CMD-048)
   */
  @Roles(Role.SUPER_ADMIN, Role.OPERATIONS, Role.VENDOR_OWNER, Role.VENDOR_STAFF, Role.RIDER)
  @Post(':id/tracking/events')
  recordTrackingEvent(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: any,
  ) {
    return this.ordersService.recordTrackingEvent(req.user, id, body);
  }

  @Roles(Role.CUSTOMER)
  @Idempotent({ operation: 'REORDER' })
  @Post(':id/reorder')
  reorder(@Param('id') id: string, @Request() req: any) {
    return this.ordersService.reorder(req.user, id);
  }

  /**
   * POST /orders/:id/cancel/preview — Authoritative Cancellation Preview (CMD-049)
   */
  @Roles(Role.CUSTOMER)
  @Post(':id/cancel/preview')
  cancelPreview(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: any,
  ) {
    return this.ordersService.cancelPreview(req.user, id, body);
  }

  /**
   * POST /orders/:id/cancel — Authoritative Order Cancellation Execution (CMD-049)
   */
  @Roles(Role.CUSTOMER)
  @Idempotent({ operation: 'CANCEL_ORDER' })
  @Post(':id/cancel')
  cancelOrder(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: any,
  ) {
    return this.ordersService.cancelOrder(req.user, id, body);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.ordersService.findOne(id, req.user);
  }

  /**
   * POST /orders — place an order. Only CUSTOMER may initiate.
   */
  @Roles(Role.CUSTOMER)
  @Idempotent({ operation: 'CREATE_ORDER' })
  @Post()
  createOrder(@Request() req: any, @Body() body: any) {
    if (body.paymentIntentId) {
      return this.ordersService.placeOrder(req.user, body);
    }
    return this.ordersService.create(req.user, body);
  }

  /**
   * POST /orders/place — authoritative order placement from paymentIntentId (CMD-046).
   */
  @Roles(Role.CUSTOMER)
  @Idempotent({ operation: 'PLACE_ORDER' })
  @Post('place')
  placeOrder(@Request() req: any, @Body() body: any) {
    return this.ordersService.placeOrder(req.user, body);
  }

  /**
   * PUT /orders/:id/status — lifecycle update.
   */
  @Roles(Role.SUPER_ADMIN, Role.VENDOR_OWNER, Role.VENDOR_STAFF, Role.RIDER, Role.OPERATIONS, Role.MERCHANT_OWNER, Role.MERCHANT_MANAGER)
  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.ordersService.updateStatus(id, body.status, req.user);
  }

  /**
   * POST /orders/:id/assign-rider — assign delivery rider to order.
   */
  @Roles(Role.SUPER_ADMIN, Role.VENDOR_OWNER, Role.VENDOR_STAFF, Role.MERCHANT_OWNER, Role.MERCHANT_MANAGER, Role.OPERATIONS)
  @Post(':id/assign-rider')
  assignRider(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.ordersService.assignRider(id, body, req.user);
  }

  /**
   * POST /orders/:id/verify-handoff — verify rider pickup OTP.
   */
  @Roles(Role.SUPER_ADMIN, Role.VENDOR_OWNER, Role.VENDOR_STAFF, Role.MERCHANT_OWNER, Role.MERCHANT_MANAGER, Role.OPERATIONS)
  @Post(':id/verify-handoff')
  verifyHandoff(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.ordersService.verifyRiderHandoff(id, body, req.user);
  }

  /**
   * POST /orders/:id/return/preview — read-only return policy preview. CUSTOMER only.
   */
  @Roles(Role.CUSTOMER)
  @Post(':id/return/preview')
  returnPreview(@Param('id') id: string, @Request() req: any) {
    return this.ordersService.returnPreview(req.user, id);
  }

  /**
   * POST /orders/:id/return — request a return. CUSTOMER only.
   */
  @Roles(Role.CUSTOMER)
  @Idempotent({ operation: 'CREATE_RETURN' })
  @Post(':id/return')
  createReturn(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: any,
  ) {
    return this.ordersService.createReturn(id, req.user.userId, body);
  }

  @Get(':id/return')
  getReturnStatus(@Param('id') id: string, @Request() req: any) {
    return this.ordersService.getReturnStatus(id, req.user);
  }
}

@Controller('returns')
@UseInterceptors(IdempotencyInterceptor)
@Roles(Role.SUPER_ADMIN, Role.VENDOR_OWNER, Role.OPERATIONS)
export class ReturnsController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(Role.SUPER_ADMIN, Role.OPERATIONS, Role.CUSTOMER)
  @Get(':id')
  getReturnDetails(@Param('id') id: string, @Request() req: any) {
    return this.ordersService.getReturnStatus(id, req.user);
  }

  @Roles(Role.SUPER_ADMIN, Role.OPERATIONS)
  @Put(':id/qc')
  updateReturnQc(@Param('id') id: string, @Request() req: any, @Body() body: any) {
    return this.ordersService.updateReturnQc(id, req.user, body);
  }

  @Roles(Role.SUPER_ADMIN, Role.OPERATIONS)
  @Idempotent({ operation: 'APPROVE_RETURN' })
  @Put(':id/approve')
  approveReturn(@Param('id') id: string, @Body() body: any) {
    return this.ordersService.approveReturn(id, body?.refundAmount);
  }

  @Roles(Role.SUPER_ADMIN, Role.OPERATIONS)
  @Put(':id/reject')
  rejectReturn(@Param('id') id: string, @Body() body: any) {
    return this.ordersService.rejectReturn(id, body?.reasonText);
  }
}
