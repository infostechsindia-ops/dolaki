import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { FladoService } from './flado.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/roles.decorator';

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

  @Put('shops/:shopId/products/:productId/stock')
  updateStockQuantity(
    @Param('shopId') shopId: string,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.fladoService.updateStockQuantity(shopId, productId, quantity);
  }

  @Delete('shops/:shopId/products/:productId')
  deleteShopProduct(
    @Param('shopId') shopId: string,
    @Param('productId') productId: string,
  ) {
    return this.fladoService.deleteShopProduct(shopId, productId);
  }

  // ─── Orders ────────────────────────────────────────────────────────────────

  @Post('orders')
  createFladoOrder(@Body() body: any) {
    return this.fladoService.createFladoOrder(body);
  }

  @Get('orders/customer/:phone')
  getFladoCustomerOrders(@Param('phone') phone: string) {
    return this.fladoService.getFladoCustomerOrders(phone);
  }

  @Get('shops/:shopId/orders')
  getShopOrders(@Param('shopId') shopId: string, @Query('status') status?: string) {
    return this.fladoService.getShopOrders(shopId, status);
  }

  @Put('shops/:shopId/orders/:orderId/status')
  updateOrderStatus(
    @Param('shopId') shopId: string,
    @Param('orderId') orderId: string,
    @Body('status') status: any,
  ) {
    return this.fladoService.updateOrderStatus(shopId, orderId, status);
  }

  @Put('orders/:id/assign-rider')
  assignRiderToOrder(@Param('id') id: string, @Body('riderId') riderId: string) {
    return this.fladoService.assignRiderToOrder(id, riderId);
  }

  // ─── Riders & Hours ─────────────────────────────────────────────────────────

  @Post('shops/:shopId/riders')
  addRider(@Param('shopId') shopId: string, @Body() body: any) {
    return this.fladoService.addRider(shopId, body);
  }

  @Get('shops/:shopId/riders')
  getShopRiders(@Param('shopId') shopId: string) {
    return this.fladoService.getShopRiders(shopId);
  }

  @Put('riders/:id/availability')
  toggleRiderAvailability(@Param('id') id: string, @Body('isAvailable') isAvailable: boolean) {
    return this.fladoService.toggleRiderAvailability(id, isAvailable);
  }

  @Get('shops/:shopId/hours')
  getShopHours(@Param('shopId') shopId: string) {
    return this.fladoService.getShopHours(shopId);
  }

  @Put('shops/:shopId/hours')
  upsertShopHours(@Param('shopId') shopId: string, @Body() body: any[]) {
    return this.fladoService.upsertShopHours(shopId, body);
  }

  // ─── COD Fee ───────────────────────────────────────────────────────────────

  /**
   * GET /flado/cod-fee?amount=320
   * Returns the COD fee for a given order amount
   */
  @Get('cod-fee')
  getCodFee(@Query('amount') amount: string) {
    return this.fladoService.calculateCodFee(Number(amount));
  }

  // ─── Admin APIs ─────────────────────────────────────────────────────────────

  /**
   * GET /flado/admin/shops/pending
   * Admin fetches all pending shop applications
   */
  @Get('admin/shops/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getPendingShops() {
    return this.fladoService.getPendingShops();
  }

  /**
   * GET /flado/admin/shops?status=APPROVED
   */
  @Get('admin/shops')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getAllShops(@Query('status') status?: string) {
    return this.fladoService.getAllShops(status);
  }

  /**
   * POST /flado/admin/shops/:shopId/approve
   * body: { adminId, monthlyFee, note }
   * Admin approves a shop and sets the subscription fee
   */
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

  /**
   * POST /flado/admin/shops/:shopId/reject
   * body: { adminId, reason }
   */
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

  /**
   * POST /flado/admin/shops/:shopId/verify
   * Field agent physically verifies the shop
   */
  @Post('admin/shops/:shopId/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  verifyShop(@Param('shopId') shopId: string, @Body('agentId') agentId: string) {
    return this.fladoService.verifyShopPhysically(shopId, agentId || 'agent');
  }

  // ─── Credit (Udhaar) APIs ──────────────────────────────────────────────────

  /**
   * POST /flado/shops/:shopId/credits
   * Shop owner grants credit to a customer
   * body: { customerPhone, customerName, creditLimit, notes?, repaymentDeadline? }
   */
  @Post('shops/:shopId/credits')
  grantCredit(@Param('shopId') shopId: string, @Body() body: any) {
    return this.fladoService.grantCredit({ shopId, ...body });
  }

  /**
   * GET /flado/shops/:shopId/credits
   * Shop owner views all customers with active credit
   */
  @Get('shops/:shopId/credits')
  getShopCreditLedger(@Param('shopId') shopId: string) {
    return this.fladoService.getShopCreditLedger(shopId);
  }

  /**
   * GET /flado/shops/:shopId/credits/:phone
   * Customer fetches their credit balance at a specific shop
   */
  @Get('shops/:shopId/credits/:phone')
  getCustomerCredit(@Param('shopId') shopId: string, @Param('phone') phone: string) {
    return this.fladoService.getCustomerCreditForShop(shopId, phone);
  }

  /**
   * PUT /flado/shops/:shopId/credits/:phone/freeze
   */
  @Put('shops/:shopId/credits/:phone/freeze')
  freezeCredit(@Param('shopId') shopId: string, @Param('phone') phone: string) {
    return this.fladoService.freezeCredit(shopId, phone);
  }

  /**
   * PUT /flado/shops/:shopId/credits/:phone/restore
   */
  @Put('shops/:shopId/credits/:phone/restore')
  restoreCredit(@Param('shopId') shopId: string, @Param('phone') phone: string) {
    return this.fladoService.restoreCredit(shopId, phone);
  }

  /**
   * POST /flado/shops/:shopId/credits/:phone/remind
   */
  @Post('shops/:shopId/credits/:phone/remind')
  sendCreditReminder(@Param('shopId') shopId: string, @Param('phone') phone: string) {
    return this.fladoService.sendCreditReminder(shopId, phone);
  }

  /**
   * POST /flado/shops/:shopId/credits/:phone/repay
   * body: { amount, note? }
   */
  @Post('shops/:shopId/credits/:phone/repay')
  repayCredit(
    @Param('shopId') shopId: string,
    @Param('phone') phone: string,
    @Body('amount') amount: number,
    @Body('note') note?: string,
  ) {
    return this.fladoService.repayCredit(shopId, phone, amount, note);
  }

  /**
   * GET /flado/shops/:shopId/credits/:phone/transactions
   */
  @Get('shops/:shopId/credits/:phone/transactions')
  getCreditTransactions(@Param('shopId') shopId: string, @Param('phone') phone: string) {
    return this.fladoService.getCreditTransactions(shopId, phone);
  }

  /**
   * GET /flado/shops/:shopId/subscription
   */
  @Get('shops/:shopId/subscription')
  getShopSubscription(@Param('shopId') shopId: string) {
    return this.fladoService.getShopSubscription(shopId);
  }

  // ─── Legacy Darkstore Endpoints (kept for backward compat) ────────────────

  @Get('darkstores')
  getDarkstores() {
    return this.fladoService.getDarkstores();
  }

  @Get('stores/nearby')
  getNearbyStores(@Query('lat') lat: string, @Query('lng') lng: string) {
    return this.fladoService.getNearbyStores(Number(lat || 19.0596), Number(lng || 72.8295));
  }

  @Post('stores/register')
  registerStore(@Body() body: any) {
    const { vendorId, ...storeData } = body;
    return this.fladoService.registerStore(vendorId || 'vendor-custom', storeData);
  }

  @Get('stores/vendor/:vendorId')
  getStoreByVendor(@Param('vendorId') vendorId: string) {
    return this.fladoService.getStoreByVendor(vendorId);
  }

  @Put('stores/vendor/:vendorId/range')
  updateStoreRange(
    @Param('vendorId') vendorId: string,
    @Body() body: { rangeKm: number; lat?: number; lng?: number },
  ) {
    return this.fladoService.updateStoreRange(vendorId, body.rangeKm, body.lat, body.lng);
  }

  @Get('products')
  getProducts(@Query('vendorId') vendorId?: string) {
    return this.fladoService.getQcProducts(vendorId);
  }

  @Get('eta')
  calculateEta(@Query('lat') lat: number, @Query('lng') lng: number) {
    return this.fladoService.calculateEta(Number(lat || 0), Number(lng || 0));
  }

  @Post('stores/vendor/:vendorId/products')
  addStoreProduct(@Param('vendorId') vendorId: string, @Body() body: any) {
    return this.fladoService.addStoreProduct(vendorId, body);
  }

  @Put('stores/vendor/:vendorId/products/:productId')
  updateStoreProduct(
    @Param('vendorId') vendorId: string,
    @Param('productId') productId: string,
    @Body() body: any,
  ) {
    return this.fladoService.updateStoreProduct(vendorId, productId, body);
  }

  @Delete('stores/vendor/:vendorId/products/:productId')
  deleteStoreProduct(
    @Param('vendorId') vendorId: string,
    @Param('productId') productId: string,
  ) {
    return this.fladoService.deleteStoreProduct(vendorId, productId);
  }

  @Get('stores/vendor/:vendorId/orders')
  getOrdersForVendor(@Param('vendorId') vendorId: string) {
    return this.fladoService.getOrdersForVendor(vendorId);
  }

  @Put('stores/vendor/:vendorId/orders/:orderId/status')
  updateVendorOrderStatus(
    @Param('vendorId') vendorId: string,
    @Param('orderId') orderId: string,
    @Body('status') status: string,
  ) {
    return this.fladoService.updateOrderStatus(vendorId, orderId, status as any);
  }
}
