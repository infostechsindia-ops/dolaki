import { Controller, Get, Patch, Post, Put, Delete, Body, Request, UseGuards, Query, Param } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/roles.decorator';
import {
  VendorsService,
  VendorDashboardSummary,
  VendorOnboardingStateDTO,
  SaveOnboardingDraftDTO,
  CreateVendorProductDTO,
  UpdateVendorProductDTO,
  UpdateVendorPricingDTO,
  VendorProductDTO,
  AdjustInventoryDTO,
  VendorInventoryDTO,
  StockHistoryDTO,
  PriceHistoryDTO,
  VendorOrderSummaryDTO,
  VendorOrderDetailDTO,
  FulfillOrderDTO,
  PackingSlipDTO,
  VendorReturnSummaryDTO,
  VendorReturnDetailDTO,
  VendorReturnDecisionDTO,
  SettlementSummaryDTO,
  StatementDTO,
  VendorAnalyticsDTO,
  VendorStaffDTO,
  VendorInvitationDTO,
  VendorActivityLogDTO,
} from './vendors.service';
import { VendorPayout } from '../database/entities';

@Controller('vendors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Get('dashboard')
  @Roles('VENDOR_OWNER', 'VENDOR_STAFF', 'SUPER_ADMIN', 'OPERATIONS')
  async getDashboard(@Request() req: any): Promise<VendorDashboardSummary> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.getDashboardSummary(vendor.id);
  }

  // --- CMD-082 Vendor Staff & Activity Audit Endpoints ---

  @Get('staff')
  @Roles('VENDOR_OWNER', 'VENDOR_STAFF', 'SUPER_ADMIN', 'OPERATIONS')
  async getVendorStaffList(@Request() req: any): Promise<VendorStaffDTO[]> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.getVendorStaffList(vendor.id);
  }

  @Post('staff/invite')
  @Roles('VENDOR_OWNER')
  async inviteVendorStaff(
    @Request() req: any,
    @Body() body: { email: string; vendorRole: 'OWNER' | 'MANAGER' | 'FULFILLMENT_STAFF' },
  ): Promise<VendorInvitationDTO> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.inviteVendorStaff(vendor.id, body, req.user.userId);
  }

  @Get('staff/invitations')
  @Roles('VENDOR_OWNER', 'VENDOR_STAFF', 'SUPER_ADMIN', 'OPERATIONS')
  async getVendorInvitations(@Request() req: any): Promise<VendorInvitationDTO[]> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.getVendorInvitations(vendor.id);
  }

  @Post('staff/invitations/:id/revoke')
  @Roles('VENDOR_OWNER')
  async revokeVendorInvitation(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.revokeVendorInvitation(vendor.id, id, req.user.userId);
  }

  @Post('staff/invitations/accept')
  async acceptVendorInvitation(
    @Request() req: any,
    @Body('token') token: string,
  ): Promise<VendorStaffDTO> {
    return this.vendorsService.acceptVendorInvitation(token, req.user.userId, req.user.email || 'staff@vendor.com');
  }

  @Patch('staff/:id/role')
  @Roles('VENDOR_OWNER')
  async updateVendorStaffRole(
    @Request() req: any,
    @Param('id') id: string,
    @Body('newRole') newRole: 'OWNER' | 'MANAGER' | 'FULFILLMENT_STAFF',
  ): Promise<VendorStaffDTO> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.updateVendorStaffRole(vendor.id, id, newRole, req.user.userId);
  }

  @Patch('staff/:id/status')
  @Roles('VENDOR_OWNER')
  async updateVendorStaffStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body('status') status: 'ACTIVE' | 'INACTIVE',
  ): Promise<VendorStaffDTO> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.updateVendorStaffStatus(vendor.id, id, status, req.user.userId);
  }

  @Delete('staff/:id')
  @Roles('VENDOR_OWNER')
  async removeVendorStaff(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.removeVendorStaff(vendor.id, id, req.user.userId);
  }

  @Get('staff/activity')
  @Roles('VENDOR_OWNER', 'VENDOR_STAFF', 'SUPER_ADMIN', 'OPERATIONS')
  async getVendorActivityLogs(@Request() req: any): Promise<VendorActivityLogDTO[]> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.getVendorActivityLogs(vendor.id);
  }

  // --- CMD-081 Vendor Analytics Endpoints ---

  @Get('analytics')
  @Roles('VENDOR_OWNER', 'VENDOR_STAFF', 'SUPER_ADMIN', 'OPERATIONS')
  async getVendorAnalytics(
    @Request() req: any,
    @Query('period') period?: string,
  ): Promise<VendorAnalyticsDTO> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.getVendorAnalytics(vendor.id, { period });
  }

  // --- CMD-080 Vendor Settlements & Payouts Endpoints ---

  @Get('settlements')
  @Roles('VENDOR_OWNER', 'VENDOR_STAFF', 'SUPER_ADMIN', 'OPERATIONS')
  async getVendorSettlements(@Request() req: any): Promise<SettlementSummaryDTO> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.getVendorSettlements(vendor.id);
  }

  @Post('settlements/payout')
  @Roles('VENDOR_OWNER', 'SUPER_ADMIN', 'OPERATIONS')
  async triggerVendorPayout(@Request() req: any): Promise<VendorPayout> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.triggerVendorPayout(vendor.id, req.user.userId);
  }

  @Post('settlements/payouts/:id/confirm')
  @Roles('SUPER_ADMIN', 'OPERATIONS')
  async confirmVendorPayout(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { action: 'CONFIRM' | 'FAIL'; failureReason?: string },
  ): Promise<VendorPayout> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.confirmVendorPayout(vendor.id, id, body.action, body.failureReason);
  }

  @Get('settlements/:id/statement')
  @Roles('VENDOR_OWNER', 'VENDOR_STAFF', 'SUPER_ADMIN', 'OPERATIONS')
  async getVendorStatement(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<StatementDTO> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.getVendorStatement(vendor.id, id);
  }

  // --- CMD-079 Vendor Returns Endpoints ---

  @Get('returns')
  @Roles('VENDOR_OWNER', 'VENDOR_STAFF', 'SUPER_ADMIN', 'OPERATIONS')
  async getVendorReturns(
    @Request() req: any,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ): Promise<VendorReturnSummaryDTO[]> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.getVendorReturns(vendor.id, { search, status });
  }

  @Get('returns/:id')
  @Roles('VENDOR_OWNER', 'VENDOR_STAFF', 'SUPER_ADMIN', 'OPERATIONS')
  async getVendorReturnById(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<VendorReturnDetailDTO> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.getVendorReturnById(vendor.id, id);
  }

  @Post('returns/:id/decision')
  @Roles('VENDOR_OWNER', 'VENDOR_STAFF')
  async processVendorReturnDecision(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: VendorReturnDecisionDTO,
  ): Promise<VendorReturnDetailDTO> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.processVendorReturnDecision(vendor.id, id, dto, req.user.userId);
  }

  // --- CMD-078 Vendor Orders & Fulfillment Endpoints ---

  @Get('orders')
  @Roles('VENDOR_OWNER', 'VENDOR_STAFF', 'SUPER_ADMIN', 'OPERATIONS')
  async getVendorOrders(
    @Request() req: any,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ): Promise<VendorOrderSummaryDTO[]> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.getVendorOrders(vendor.id, { search, status });
  }

  @Get('orders/:id')
  @Roles('VENDOR_OWNER', 'VENDOR_STAFF', 'SUPER_ADMIN', 'OPERATIONS')
  async getVendorOrderById(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<VendorOrderDetailDTO> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.getVendorOrderById(vendor.id, id);
  }

  @Post('orders/:id/fulfill')
  @Roles('VENDOR_OWNER', 'VENDOR_STAFF')
  async fulfillVendorOrder(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: FulfillOrderDTO,
  ): Promise<VendorOrderDetailDTO> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.fulfillVendorOrder(vendor.id, id, dto, req.user.userId);
  }

  @Get('orders/:id/packing-slip')
  @Roles('VENDOR_OWNER', 'VENDOR_STAFF', 'SUPER_ADMIN', 'OPERATIONS')
  async getVendorPackingSlip(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<PackingSlipDTO> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.getVendorPackingSlip(vendor.id, id);
  }

  // --- CMD-077 Vendor Pricing Endpoints ---

  @Put('products/:id/pricing')
  @Roles('VENDOR_OWNER', 'VENDOR_STAFF')
  async updateVendorPricing(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateVendorPricingDTO,
  ): Promise<VendorProductDTO> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.updateVendorPricing(vendor.id, id, dto, req.user.userId);
  }

  @Get('products/:id/pricing/history')
  @Roles('VENDOR_OWNER', 'VENDOR_STAFF', 'SUPER_ADMIN', 'OPERATIONS')
  async getVendorPriceHistory(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<PriceHistoryDTO[]> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.getVendorPriceHistory(vendor.id, id);
  }

  // --- CMD-076 Vendor Inventory Endpoints ---

  @Get('inventory')
  @Roles('VENDOR_OWNER', 'VENDOR_STAFF', 'SUPER_ADMIN', 'OPERATIONS')
  async getVendorInventoryList(
    @Request() req: any,
    @Query('search') search?: string,
    @Query('shopId') shopId?: string,
    @Query('isLowStock') isLowStock?: string,
  ): Promise<VendorInventoryDTO[]> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.getVendorInventoryList(vendor.id, {
      search,
      shopId,
      isLowStock: isLowStock === 'true',
    });
  }

  @Post('inventory/:id/adjust')
  @Roles('VENDOR_OWNER', 'VENDOR_STAFF')
  async adjustVendorInventory(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: AdjustInventoryDTO,
  ): Promise<VendorInventoryDTO> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.adjustVendorInventory(vendor.id, id, dto, req.user.userId);
  }

  @Get('inventory/:id/history')
  @Roles('VENDOR_OWNER', 'VENDOR_STAFF', 'SUPER_ADMIN', 'OPERATIONS')
  async getInventoryHistory(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<StockHistoryDTO[]> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.getInventoryHistory(vendor.id, id);
  }

  // --- CMD-075 Vendor Catalog Endpoints ---

  @Get('products')
  @Roles('VENDOR_OWNER', 'VENDOR_STAFF', 'SUPER_ADMIN', 'OPERATIONS')
  async getVendorProducts(
    @Request() req: any,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('status') status?: string,
  ): Promise<VendorProductDTO[]> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.getVendorProducts(vendor.id, { search, categoryId, status });
  }

  @Get('products/:id')
  @Roles('VENDOR_OWNER', 'VENDOR_STAFF', 'SUPER_ADMIN', 'OPERATIONS')
  async getVendorProductById(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<VendorProductDTO> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.getVendorProductById(vendor.id, id);
  }

  @Post('products')
  @Roles('VENDOR_OWNER', 'VENDOR_STAFF')
  async createVendorProduct(
    @Request() req: any,
    @Body() dto: CreateVendorProductDTO,
  ): Promise<VendorProductDTO> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.createVendorProduct(vendor.id, dto);
  }

  @Put('products/:id')
  @Roles('VENDOR_OWNER', 'VENDOR_STAFF')
  async updateVendorProduct(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateVendorProductDTO,
  ): Promise<VendorProductDTO> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.updateVendorProduct(vendor.id, id, dto);
  }

  @Post('products/:id/media')
  @Roles('VENDOR_OWNER', 'VENDOR_STAFF')
  async addProductMedia(
    @Request() req: any,
    @Param('id') id: string,
    @Body('imageUrl') imageUrl: string,
  ): Promise<VendorProductDTO> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.addProductMedia(vendor.id, id, imageUrl);
  }

  @Delete('products/:id')
  @Roles('VENDOR_OWNER')
  async deleteVendorProduct(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.deleteVendorProduct(vendor.id, id);
  }

  // --- CMD-074 Vendor Onboarding Endpoints ---

  @Get('onboarding')
  @Roles('VENDOR_OWNER', 'VENDOR_STAFF', 'SUPER_ADMIN', 'OPERATIONS')
  async getOnboardingState(@Request() req: any): Promise<VendorOnboardingStateDTO> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.getOnboardingState(vendor.id);
  }

  @Patch('onboarding/draft')
  @Roles('VENDOR_OWNER')
  async saveOnboardingDraft(
    @Request() req: any,
    @Body() dto: SaveOnboardingDraftDTO,
  ): Promise<VendorOnboardingStateDTO> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.saveOnboardingDraft(vendor.id, dto);
  }

  @Post('onboarding/submit')
  @Roles('VENDOR_OWNER')
  async submitOnboarding(@Request() req: any): Promise<VendorOnboardingStateDTO> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.submitOnboarding(vendor.id);
  }

  @Post('onboarding/documents')
  @Roles('VENDOR_OWNER')
  async uploadDocumentMetadata(
    @Request() req: any,
    @Body() body: { documentType: string; storageKey: string; fileName: string; mimeType: string },
  ): Promise<VendorOnboardingStateDTO> {
    const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
    return this.vendorsService.uploadDocumentMetadata(vendor.id, body);
  }

  @Post('onboarding/review')
  @Roles('SUPER_ADMIN', 'OPERATIONS')
  async reviewOnboarding(
    @Query('vendorId') vendorId: string,
    @Body() body: { action: 'APPROVE' | 'REJECT'; rejectionReason?: string },
  ): Promise<VendorOnboardingStateDTO> {
    return this.vendorsService.reviewOnboarding(vendorId, body.action, body.rejectionReason);
  }
}
