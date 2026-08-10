import { Controller, Get, Post, Put, Patch, Delete, Param, Query, Body, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import { FladoService } from './flado.service';
import { JwtAuthGuard, RolesGuard, ShopOwnerGuard } from '../auth/guards';
import { Roles } from '../auth/roles.decorator';

const MERCHANT_OPERATOR_ROLES = ['SUPER_ADMIN', 'OPERATIONS', 'MERCHANT_OWNER', 'MERCHANT_STAFF', 'VENDOR_OWNER', 'VENDOR_STAFF'];

@Controller('flado')
export class FladoController {
  constructor(private readonly fladoService: FladoService) {}

  // ─── Customer Discovery ────────────────────────────────────────────────────

  /**
   * GET /flado/shops/nearby?lat=26.12&lng=85.36&category=Grocery&city=Muzaffarpur
   * Returns all approved, open shops within delivery radius of the customer.
   */
  @Get('shops/nearby')
  getNearbyShops(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('category') category?: string,
    @Query('city') city?: string,
  ) {
    return this.fladoService.getNearbyShops(Number(lat), Number(lng), category, city);
  }

  /**
   * GET /flado/shops/:shopId
   * Returns full shop detail (catalog page)
   */
  @Get('shops/:shopId')
  getShopById(@Param('shopId') shopId: string) {
    return this.fladoService.getShopById(shopId);
  }

  // ─── Vendor / FladoVendor App APIs ────────────────────────────────────────

  /**
   * POST /flado/shops/register
   * Shop owner registers their shop (goes to PENDING approval)
   */
  @Post('shops/register')
  registerShop(@Body() body: any) {
    return this.fladoService.registerShop(body);
  }

  /**
   * GET /flado/shops/vendor/:phone
   * FladoVendor app fetches the shop for the logged-in owner
   */
  @Get('shops/vendor/:phone')
  getShopByPhone(@Param('phone') phone: string) {
    return this.fladoService.getShopByPhone(phone);
  }

  /**
   * PUT /flado/shops/:shopId/profile
   * Update shop name, description, banner, story, categories, etc.
   */
  @Put('shops/:shopId/profile')
  updateShopProfile(@Param('shopId') shopId: string, @Body() body: any) {
    return this.fladoService.updateShopProfile(shopId, body);
  }

  /**
   * PUT /flado/shops/:shopId/toggle
   * Shop open/close toggle — body: { isOpen: true|false }
   */
  @Put('shops/:shopId/toggle')
  toggleShopOpen(@Param('shopId') shopId: string, @Body('isOpen') isOpen: boolean) {
    return this.fladoService.toggleShopOpen(shopId, isOpen);
  }

  /**
   * PUT /flado/shops/:shopId/delivery-fee
   * body: { deliveryFeeType: "FREE"|"PAID", deliveryFeeAmount: 20 }
   */
  @Put('shops/:shopId/delivery-fee')
  updateDeliveryFee(
    @Param('shopId') shopId: string,
    @Body('deliveryFeeType') deliveryFeeType: 'FREE' | 'PAID',
    @Body('deliveryFeeAmount') deliveryFeeAmount: number,
  ) {
    return this.fladoService.updateDeliveryFee(shopId, deliveryFeeType, deliveryFeeAmount || 0);
  }

  /**
   * PUT /flado/shops/:shopId/radius
   * body: { radiusKm: 1.5 }
   */
  @Put('shops/:shopId/radius')
  updateDeliveryRadius(@Param('shopId') shopId: string, @Body('radiusKm') radiusKm: number) {
    return this.fladoService.updateDeliveryRadius(shopId, radiusKm);
  }

  // ─── CMD-084 Darkstore Catalog & Inventory Management Endpoints ──────────────

  @Patch('shops/:shopId/inventory/:inventoryId/adjust')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  adjustDarkstoreInventory(
    @Req() req: any,
    @Param('shopId') shopId: string,
    @Param('inventoryId') inventoryId: string,
    @Body() body: { stockQuantity?: number; lowStockThreshold?: number; reason?: string },
  ) {
    return this.fladoService.adjustDarkstoreInventory(shopId, inventoryId, body, req.user.userId);
  }

  @Put('shops/:shopId/inventory/:inventoryId/price')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  updateDarkstoreProductPrice(
    @Req() req: any,
    @Param('shopId') shopId: string,
    @Param('inventoryId') inventoryId: string,
    @Body() body: { priceMinor: number; reason?: string },
  ) {
    return this.fladoService.updateDarkstoreProductPrice(shopId, inventoryId, body, req.user.userId);
  }

  @Patch('shops/:shopId/inventory/:inventoryId/availability')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  toggleDarkstoreProductAvailability(
    @Req() req: any,
    @Param('shopId') shopId: string,
    @Param('inventoryId') inventoryId: string,
    @Body('isAvailable') isAvailable: boolean,
  ) {
    return this.fladoService.toggleDarkstoreProductAvailability(shopId, inventoryId, isAvailable, req.user.userId);
  }

  @Post('shops/:shopId/products/add')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  addDarkstoreProduct(
    @Req() req: any,
    @Param('shopId') shopId: string,
    @Body() body: { productId: string; initialStock?: number; lowStockThreshold?: number },
  ) {
    return this.fladoService.addDarkstoreProduct(shopId, body, req.user.userId);
  }

  @Delete('shops/:shopId/inventory/:inventoryId')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  deleteDarkstoreProduct(
    @Req() req: any,
    @Param('shopId') shopId: string,
    @Param('inventoryId') inventoryId: string,
  ) {
    return this.fladoService.deleteDarkstoreProduct(shopId, inventoryId, req.user.userId);
  }

  // ─── CMD-085 Darkstore Store Configuration ──────────────────────────────────

  @Put('shops/:shopId/config')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  updateDarkstoreConfiguration(
    @Req() req: any,
    @Param('shopId') shopId: string,
    @Body() body: any,
  ) {
    return this.fladoService.updateDarkstoreConfiguration(shopId, body, req.user.userId);
  }

  // ─── CMD-086 Darkstore Assortment, Category Mapping & Tagging ───────────────

  @Patch('shops/:shopId/inventory/:inventoryId/assortment')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  updateDarkstoreAssortmentItem(
    @Req() req: any,
    @Param('shopId') shopId: string,
    @Param('inventoryId') inventoryId: string,
    @Body() body: { categoryId?: string; tags?: string[]; isFeatured?: boolean; featuredPriority?: number },
  ) {
    return this.fladoService.updateDarkstoreAssortmentItem(shopId, inventoryId, body, req.user.userId);
  }

  // ─── CMD-087 Darkstore Live Order Board ─────────────────────────────────────

  @Get('shops/:shopId/orders/board')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  getQuickOrderBoard(
    @Req() req: any,
    @Param('shopId') shopId: string,
  ) {
    return this.fladoService.getQuickOrderBoard(shopId, req.user.userId);
  }

  @Post('shops/:shopId/orders/:orderId/transition')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  transitionQuickOrderStatus(
    @Req() req: any,
    @Param('shopId') shopId: string,
    @Param('orderId') orderId: string,
    @Body() body: { action: 'ACCEPT' | 'PACK' | 'SHIP' | 'DELIVER' },
  ) {
    return this.fladoService.transitionQuickOrderStatus(shopId, orderId, body.action, req.user.userId);
  }

  // ─── CMD-088 Quick-Commerce Picking Session Workflow ────────────────────────

  @Get('shops/:shopId/orders/:orderId/picking')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  getPickingSession(
    @Req() req: any,
    @Param('shopId') shopId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.fladoService.getPickingSession(shopId, orderId, req.user.userId);
  }

  @Post('shops/:shopId/orders/:orderId/picking/assign')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  assignPicker(
    @Req() req: any,
    @Param('shopId') shopId: string,
    @Param('orderId') orderId: string,
    @Body() body: { pickerUserId: string },
  ) {
    return this.fladoService.assignPicker(shopId, orderId, body.pickerUserId, req.user.userId);
  }

  @Patch('shops/:shopId/orders/:orderId/picking/items/:itemId')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  updatePickingItem(
    @Req() req: any,
    @Param('shopId') shopId: string,
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
    @Body() body: { pickedQuantity?: number; pickingItemStatus?: 'PENDING' | 'PICKED' | 'OUT_OF_STOCK' | 'SUBSTITUTED' },
  ) {
    return this.fladoService.updatePickingItem(shopId, orderId, itemId, body, req.user.userId);
  }

  @Post('shops/:shopId/orders/:orderId/picking/complete')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  completePickingSession(
    @Req() req: any,
    @Param('shopId') shopId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.fladoService.completePickingSession(shopId, orderId, req.user.userId);
  }

  // ─── CMD-089 Quick-Commerce Rider Handoff & Dispatch Verification ────────────

  @Get('shops/:shopId/orders/:orderId/handoff')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  getRiderHandoffStatus(
    @Req() req: any,
    @Param('shopId') shopId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.fladoService.getRiderHandoffStatus(shopId, orderId, req.user.userId);
  }

  @Post('shops/:shopId/orders/:orderId/handoff/assign-rider')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  assignRiderToOrder(
    @Req() req: any,
    @Param('shopId') shopId: string,
    @Param('orderId') orderId: string,
    @Body() body: { riderId: string },
  ) {
    return this.fladoService.assignRiderToOrder(shopId, orderId, body.riderId, req.user.userId);
  }

  @Post('shops/:shopId/orders/:orderId/handoff/challenge')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  generatePickupChallenge(
    @Req() req: any,
    @Param('shopId') shopId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.fladoService.generatePickupChallenge(shopId, orderId, req.user.userId);
  }

  @Post('shops/:shopId/orders/:orderId/handoff/verify')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  verifyRiderHandoff(
    @Req() req: any,
    @Param('shopId') shopId: string,
    @Param('orderId') orderId: string,
    @Body() body: { otp: string },
  ) {
    return this.fladoService.verifyRiderHandoff(shopId, orderId, body.otp, req.user.userId);
  }

  // ─── CMD-090 Quick-Commerce Merchant Reports & Export ──────────────────────

  @Get('shops/:shopId/reports')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  getMerchantReport(
    @Req() req: any,
    @Param('shopId') shopId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.fladoService.getMerchantReport(shopId, startDate, endDate, req.user.userId);
  }

  @Get('shops/:shopId/reports/export')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  async exportMerchantReportCsv(
    @Req() req: any,
    @Res() res: any,
    @Param('shopId') shopId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const csvData = await this.fladoService.exportMerchantReportCsv(shopId, startDate, endDate, req.user.userId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=darkstore-${shopId}-report.csv`);
    return res.status(200).send(csvData);
  }

  // ─── CMD-091 Quick-Commerce Merchant Staff Management ─────────────────────────

  @Get('shops/:shopId/staff')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  getDarkstoreStaff(
    @Req() req: any,
    @Param('shopId') shopId: string,
  ) {
    return this.fladoService.getDarkstoreStaff(shopId, req.user.userId);
  }

  @Post('shops/:shopId/staff/:staffId/assign-shop')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  assignStaffToDarkstore(
    @Req() req: any,
    @Param('shopId') shopId: string,
    @Param('staffId') staffId: string,
    @Body() body: { targetShopId: string },
  ) {
    return this.fladoService.assignStaffToDarkstore(shopId, staffId, body.targetShopId, req.user.userId);
  }

  @Delete('shops/:shopId/staff/:staffId/assign-shop/:targetShopId')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  removeStaffFromDarkstore(
    @Req() req: any,
    @Param('shopId') shopId: string,
    @Param('staffId') staffId: string,
    @Param('targetShopId') targetShopId: string,
  ) {
    return this.fladoService.removeStaffFromDarkstore(shopId, staffId, targetShopId, req.user.userId);
  }

  @Patch('shops/:shopId/staff/:staffId/role-status')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  updateStaffRoleOrStatus(
    @Req() req: any,
    @Param('shopId') shopId: string,
    @Param('staffId') staffId: string,
    @Body() body: { vendorRole?: 'OWNER' | 'MANAGER' | 'FULFILLMENT_STAFF'; status?: 'ACTIVE' | 'INACTIVE' },
  ) {
    return this.fladoService.updateStaffRoleOrStatus(shopId, staffId, body, req.user.userId);
  }

  @Get('shops/:shopId/staff/activity')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  getDarkstoreStaffActivity(
    @Req() req: any,
    @Param('shopId') shopId: string,
  ) {
    return this.fladoService.getDarkstoreStaffActivity(shopId, req.user.userId);
  }

  @Post('shops/:shopId/staff/invite')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  inviteStaff(
    @Req() req: any,
    @Param('shopId') shopId: string,
    @Body() body: { email: string; vendorRole: 'OWNER' | 'MANAGER' | 'FULFILLMENT_STAFF' },
  ) {
    return this.fladoService.inviteStaff(shopId, body.email, body.vendorRole, req.user.userId);
  }

  @Get('shops/:shopId/staff/invitations')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  getDarkstoreInvitations(
    @Req() req: any,
    @Param('shopId') shopId: string,
  ) {
    return this.fladoService.getDarkstoreInvitations(shopId, req.user.userId);
  }

  @Delete('shops/:shopId/staff/invitations/:invitationId')
  @Roles(...MERCHANT_OPERATOR_ROLES)
  @UseGuards(ShopOwnerGuard)
  revokeInvitation(
    @Req() req: any,
    @Param('shopId') shopId: string,
    @Param('invitationId') invitationId: string,
  ) {
    return this.fladoService.revokeInvitation(shopId, invitationId, req.user.userId);
  }

  // ─── Inventory ─────────────────────────────────────────────────────────────

  @Get('shops/:shopId/products')
  getShopProducts(@Param('shopId') shopId: string) {
    return this.fladoService.getShopProducts(shopId);
  }

  @Post('shops/:shopId/products')
  addShopProduct(@Param('shopId') shopId: string, @Body() body: any) {
    return this.fladoService.addShopProduct(shopId, body);
  }

  @Put('shops/:shopId/products/:productId')
  updateShopProduct(
    @Param('shopId') shopId: string,
    @Param('productId') productId: string,
    @Body() body: any,
  ) {
    return this.fladoService.updateShopProduct(shopId, productId, body);
  }

  @Delete('shops/:shopId/products/:productId')
  deleteShopProduct(
    @Param('shopId') shopId: string,
    @Param('productId') productId: string,
  ) {
    return this.fladoService.deleteShopProduct(shopId, productId);
  }

  // ─── Admin APIs ─────────────────────────────────────────────────────────────

  @Get('admin/shops/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getPendingShops() {
    return this.fladoService.getPendingShops();
  }

  @Get('admin/shops')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getAllShops(@Query('status') status?: string) {
    return this.fladoService.getAllShops(status);
  }

  @Post('admin/shops/:shopId/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  approveShop(
    @Param('shopId') shopId: string,
    @Body('adminId') adminId: string,
    @Body('monthlyFee') monthlyFee: number,
    @Body('note') note?: string,
  ) {
    return this.fladoService.approveShop(shopId, adminId || 'admin', monthlyFee, note);
  }

  @Post('admin/shops/:shopId/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  rejectShop(
    @Param('shopId') shopId: string,
    @Body('adminId') adminId: string,
    @Body('reason') reason: string,
  ) {
    return this.fladoService.rejectShop(shopId, adminId || 'admin', reason);
  }

  @Get('shops/:shopId/subscription')
  getShopSubscription(@Param('shopId') shopId: string) {
    return { shopId, status: 'ACTIVE', planName: 'FLADO_PRO', monthlyFee: 999 };
  }
}
