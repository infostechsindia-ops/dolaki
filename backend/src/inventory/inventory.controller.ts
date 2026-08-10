import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  InventoryService,
  CreateLocationDto,
  CreateBalanceDto,
  AdjustStockDto,
} from './inventory.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles';
import { Public } from '../auth/guards';
import { Idempotent } from '../idempotency/idempotency.decorator';

@Controller('api/v1/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('locations')
  @Roles(
    Role.SUPER_ADMIN,
    Role.OPERATIONS,
    Role.VENDOR_OWNER,
    Role.VENDOR_STAFF,
    Role.MERCHANT_OWNER,
    Role.MERCHANT_MANAGER,
    Role.MERCHANT_PICKER,
  )
  async getLocations(
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('surface') surface?: string,
    @Req() req?: any,
  ) {
    const locations = await this.inventoryService.getLocations(
      { type, status, surface },
      req.user,
    );
    return { data: locations };
  }

  @Post('locations')
  @Roles(Role.SUPER_ADMIN, Role.VENDOR_OWNER, Role.MERCHANT_OWNER)
  @Idempotent({ operation: 'inventory_create_location', required: false })
  async createLocation(@Body() dto: CreateLocationDto, @Req() req: any) {
    const location = await this.inventoryService.createLocation(dto, req.user);
    return { data: location };
  }

  @Get('locations/:id')
  @Roles(
    Role.SUPER_ADMIN,
    Role.OPERATIONS,
    Role.VENDOR_OWNER,
    Role.VENDOR_STAFF,
    Role.MERCHANT_OWNER,
    Role.MERCHANT_MANAGER,
    Role.MERCHANT_PICKER,
  )
  async getLocationById(@Param('id') id: string, @Req() req: any) {
    const location = await this.inventoryService.getLocationById(id, req.user);
    return { data: location };
  }

  @Delete('locations/:id')
  @Roles(Role.SUPER_ADMIN, Role.VENDOR_OWNER, Role.MERCHANT_OWNER)
  async archiveLocation(@Param('id') id: string, @Req() req: any) {
    const location = await this.inventoryService.archiveLocation(id, req.user);
    return { data: location };
  }

  @Get('balances')
  @Roles(
    Role.SUPER_ADMIN,
    Role.OPERATIONS,
    Role.VENDOR_OWNER,
    Role.VENDOR_STAFF,
    Role.MERCHANT_OWNER,
    Role.MERCHANT_MANAGER,
    Role.MERCHANT_PICKER,
  )
  async getBalances(
    @Query('locationId') locationId?: string,
    @Query('variantId') variantId?: string,
    @Query('sellerListingId') sellerListingId?: string,
    @Req() req?: any,
  ) {
    const balances = await this.inventoryService.getBalances(
      { locationId, variantId, sellerListingId },
      req.user,
    );
    return { data: balances };
  }

  @Post('balances')
  @Roles(
    Role.SUPER_ADMIN,
    Role.VENDOR_OWNER,
    Role.MERCHANT_OWNER,
    Role.MERCHANT_MANAGER,
  )
  @Idempotent({ operation: 'inventory_create_balance', required: false })
  async createBalance(@Body() dto: CreateBalanceDto, @Req() req: any) {
    const balance = await this.inventoryService.createBalance(dto, req.user);
    return { data: balance };
  }

  @Post('balances/:id/adjust')
  @HttpCode(HttpStatus.OK)
  @Roles(
    Role.SUPER_ADMIN,
    Role.VENDOR_OWNER,
    Role.MERCHANT_OWNER,
    Role.MERCHANT_MANAGER,
  )
  @Idempotent({ operation: 'inventory_adjust_stock', required: false })
  async adjustStock(
    @Param('id') id: string,
    @Body() dto: AdjustStockDto,
    @Req() req: any,
  ) {
    const balance = await this.inventoryService.adjustStock(id, dto, req.user);
    return { data: balance };
  }

  @Get('public/variant/:variantId')
  @Public()
  async getPublicVariantStock(@Param('variantId') variantId: string) {
    const stock = await this.inventoryService.getPublicVariantStock(variantId);
    return { data: stock };
  }

  // ─────────────────────────────────────────────
  // CMD-013 ATOMIC INVENTORY RESERVATION ENDPOINTS
  // ─────────────────────────────────────────────

  @Post('reservations')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.CUSTOMER, Role.SUPER_ADMIN)
  @Idempotent({ operation: 'INVENTORY_RESERVE', required: true })
  async createReservation(@Body() dto: any, @Req() req: any) {
    const reservation = await this.inventoryService.createReservation(dto, req.user);
    return { data: reservation };
  }

  @Get('reservations/:idOrToken')
  @Roles(Role.CUSTOMER, Role.SUPER_ADMIN, Role.OPERATIONS)
  async getReservationByToken(
    @Param('idOrToken') idOrToken: string,
    @Req() req: any,
  ) {
    const reservation = await this.inventoryService.getReservationByToken(
      idOrToken,
      req.user,
    );
    return { data: reservation };
  }

  @Post('reservations/:idOrToken/release')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.CUSTOMER, Role.SUPER_ADMIN, Role.OPERATIONS)
  async releaseReservation(
    @Param('idOrToken') idOrToken: string,
    @Body() body: any,
    @Req() req: any,
  ) {
    const result = await this.inventoryService.releaseReservation(
      idOrToken,
      req.user,
      body?.reason,
    );
    return { data: result };
  }

  @Post('reservations/:idOrToken/consume')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.SUPER_ADMIN, Role.OPERATIONS)
  async consumeReservation(
    @Param('idOrToken') idOrToken: string,
    @Req() req: any,
  ) {
    const result = await this.inventoryService.consumeReservation(
      idOrToken,
      req.user,
    );
    return { data: result };
  }

  @Post('reservations/sweep-expired')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.SUPER_ADMIN, Role.OPERATIONS)
  async sweepExpiredReservations() {
    const result = await this.inventoryService.sweepExpiredReservations();
    return { data: result };
  }
}
