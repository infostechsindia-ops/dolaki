import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import {
  Vendor,
  SellerListing,
  Inventory,
  Order,
  OrderItem,
  Product,
  ProductVariant,
  Category,
  ProductImage,
  StockHistory,
  PriceHistory,
  OrderTrackingEvent,
  ReturnRequest,
  ReturnTrackingEvent,
  VendorSettlementLedger,
  VendorPayout,
  VendorStaff,
  VendorInvitation,
  VendorActivityLog,
  User,
} from '../database/entities';

export interface VendorOnboardingStateDTO {
  vendorId: string;
  storeName: string;
  storeDescription: string | null;
  gstNumber: string | null;
  isVerified: boolean;
  onboardingStatus: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'RESUBMITTED';
  businessLegalName: string | null;
  panNumber: string | null;
  bankAccountName: string | null;
  bankAccountNumberMasked: string | null;
  bankIfsc: string | null;
  agreementsAccepted: boolean;
  agreementsAcceptedAt: Date | null;
  rejectionReason: string | null;
  submittedAt: Date | null;
  reviewedAt: Date | null;
  documents: Array<{
    documentType: string;
    fileName: string;
    uploadedAt: string;
    accessUrl: string;
  }>;
}

export class SaveOnboardingDraftDTO {
  storeName?: string;
  storeDescription?: string;
  gstNumber?: string;
  businessLegalName?: string;
  panNumber?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  agreementsAccepted?: boolean;
}

export class CreateVendorProductDTO {
  title: string;
  description: string;
  categoryId: string;
  brandId?: string;
  sku: string;
  priceMinor: number;
  compareAtPriceMinor?: number;
  stockQuantity: number;
  imageUrls?: string[];
  status?: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
}

export class UpdateVendorProductDTO {
  title?: string;
  description?: string;
  categoryId?: string;
  brandId?: string;
  sku?: string;
  priceMinor?: number;
  compareAtPriceMinor?: number;
  stockQuantity?: number;
  imageUrls?: string[];
  status?: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
}

export class UpdateVendorPricingDTO {
  priceMinor: number;
  compareAtPriceMinor?: number;
  promoStartDate?: string;
  promoEndDate?: string;
  reasonNote?: string;
}

export class AdjustInventoryDTO {
  deltaQuantity: number;
  adjustmentType: 'MANUAL_INCREASE' | 'MANUAL_DECREASE' | 'ORDER_SALE' | 'CANCELLATION_RESTOCK' | 'RETURN_RESTOCK' | 'CORRECTION_DAMAGE' | 'DARKSTORE_ALLOCATION';
  reasonNote?: string;
  lowStockThreshold?: number;
}

export class FulfillOrderDTO {
  action: 'ACCEPT' | 'PACK' | 'SHIP';
  lineItemIds?: string[];
  notes?: string;
}

export class VendorReturnDecisionDTO {
  action: 'APPROVE' | 'REJECT' | 'QC_PASS' | 'QC_FAIL';
  notes?: string;
  restock?: boolean;
}

export interface VendorStaffDTO {
  id: string;
  userId: string;
  email: string;
  vendorRole: 'OWNER' | 'MANAGER' | 'FULFILLMENT_STAFF';
  status: 'ACTIVE' | 'INACTIVE';
  isPrimaryOwner: boolean;
  createdAt: Date;
}

export interface VendorInvitationDTO {
  id: string;
  email: string;
  vendorRole: 'OWNER' | 'MANAGER' | 'FULFILLMENT_STAFF';
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
  expiresAt: Date;
  inviteUrl?: string;
  createdAt: Date;
}

export interface VendorActivityLogDTO {
  id: string;
  actorUserId: string | null;
  actorEmail: string | null;
  action: string;
  metadata: any;
  createdAt: Date;
}

export interface VendorProductDTO {
  id: string;
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  categoryName?: string;
  brandId?: string;
  sku: string;
  priceMinor: number;
  formattedPrice: string;
  compareAtPriceMinor?: number;
  formattedCompareAtPrice?: string;
  stockQuantity: number;
  imageUrls: string[];
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  listOnFlado: boolean;
  marginAnalysis?: {
    estimatedNetPayoutMinor: number;
    formattedNetPayout: string;
    platformCommissionPercentage: number;
    gstOnCommissionPercentage: number;
    discountPercentage: number;
    warning: string | null;
  };
  createdAt: Date;
}

export interface VendorInventoryDTO {
  id: string;
  listingId: string | null;
  variantId: string | null;
  productId: string | null;
  productTitle: string;
  sku: string;
  vendorId: string;
  shopId: string | null;
  fulfillmentType: 'MARKETPLACE' | 'FLADO_DARKSTORE';
  stockQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  updatedAt: Date;
}

export interface VendorOrderSummaryDTO {
  orderId: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  vendorItemCount: number;
  vendorTotalMinor: number;
  formattedVendorTotal: string;
  createdAt: Date;
  slaWarning: {
    code: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    message: string;
  } | null;
}

export interface VendorOrderItemDTO {
  id: string;
  productId: string;
  variantId: string | null;
  sku: string;
  title: string;
  variantTitle?: string;
  quantity: number;
  cancelledQuantity: number;
  fulfilledQuantity: number;
  unitPriceMinor: number;
  formattedUnitPrice: string;
  subtotalMinor: number;
  formattedSubtotal: string;
  status: string;
}

export interface VendorOrderDetailDTO {
  orderId: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: Date;
  customerName: string;
  shippingCityState: string;
  vendorItems: VendorOrderItemDTO[];
  vendorTotalMinor: number;
  formattedVendorTotal: string;
  slaWarning: {
    code: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    message: string;
  } | null;
}

export interface PackingSlipDTO {
  orderId: string;
  orderNumber: string;
  orderDate: Date;
  vendorStoreName: string;
  customerRecipientName: string;
  shippingAddressMin: string;
  items: Array<{
    sku: string;
    title: string;
    quantityToPack: number;
    unitPriceFormatted: string;
    lineSubtotalFormatted: string;
  }>;
  packingInstructions: string;
  barcodeRef: string;
}

export interface VendorReturnSummaryDTO {
  returnId: string;
  orderId: string;
  productTitle: string;
  sku: string;
  requestedQuantity: number;
  reason: string;
  resolutionChoice: string;
  status: string;
  qcStatus: string;
  refundAmountMinor: number;
  formattedRefundAmount: string;
  createdAt: Date;
}

export interface VendorReturnDetailDTO {
  returnId: string;
  orderId: string;
  orderItemId: string;
  productTitle: string;
  sku: string;
  requestedQuantity: number;
  reason: string;
  description: string | null;
  resolutionChoice: string;
  fulfillmentType: string;
  evidenceUrls: string[];
  qcStatus: string;
  qcNotes: string | null;
  status: string;
  refundAmountMinor: number;
  formattedRefundAmount: string;
  payoutImpactMinor: number;
  formattedPayoutImpact: string;
  restocked: boolean;
  createdAt: Date;
  timeline: Array<{
    eventType: string;
    statusText: string;
    description?: string;
    actorRole?: string;
    occurredAt: Date;
  }>;
}

export interface SettlementSummaryDTO {
  vendorId: string;
  storeName: string;
  bankAccountNumberMasked: string | null;
  bankIfsc: string | null;
  grossSalesMinor: number;
  formattedGrossSales: string;
  totalCommissionMinor: number;
  formattedTotalCommission: string;
  totalTaxWithholdingMinor: number;
  formattedTotalTaxWithholding: string;
  totalRefundsAdjustmentsMinor: number;
  formattedTotalRefundsAdjustments: string;
  unclearedBalanceMinor: number;
  formattedUnclearedBalance: string;
  settledBalanceMinor: number;
  formattedSettledBalance: string;
  payoutHistory: Array<{
    payoutId: string;
    grossAmountMinor: number;
    formattedGrossAmount: string;
    netPayoutMinor: number;
    formattedNetPayout: string;
    status: string;
    bankAccountNumberMasked: string | null;
    createdAt: Date;
  }>;
  ledgerEntries: Array<{
    id: string;
    sourceType: string;
    sourceId: string;
    grossAmountMinor: number;
    formattedGrossAmount: string;
    netAmountMinor: number;
    formattedNetAmount: string;
    direction: string;
    description: string | null;
    createdAt: Date;
  }>;
}

export interface StatementDTO {
  statementId: string;
  periodStart: Date;
  periodEnd: Date;
  vendorStoreName: string;
  bankAccountNumberMasked: string | null;
  bankIfsc: string | null;
  grossSalesMinor: number;
  formattedGrossSales: string;
  commissionMinor: number;
  formattedCommission: string;
  taxWithholdingMinor: number;
  formattedTaxWithholding: string;
  adjustmentsMinor: number;
  formattedAdjustments: string;
  netPayoutMinor: number;
  formattedNetPayout: string;
  status: string;
  ledgerEntries: Array<{
    sourceType: string;
    sourceId: string;
    grossAmountMinor: number;
    netAmountMinor: number;
    direction: string;
    createdAt: Date;
  }>;
}

export interface VendorAnalyticsDTO {
  vendorId: string;
  storeName: string;
  period: '7D' | '30D' | '90D' | '1Y' | 'ALL';
  salesOverview: {
    totalOrdersCount: number;
    totalUnitsSold: number;
    grossRevenueMinor: number;
    formattedGrossRevenue: string;
    netPayoutMinor: number;
    formattedNetPayout: string;
    avgOrderValueMinor: number;
    formattedAvgOrderValue: string;
  };
  revenueTrends: Array<{
    date: string;
    grossRevenueMinor: number;
    formattedGrossRevenue: string;
    netPayoutMinor: number;
    formattedNetPayout: string;
    ordersCount: number;
  }>;
  topProducts: Array<{
    productId: string;
    title: string;
    sku: string;
    unitsSold: number;
    revenueMinor: number;
    formattedRevenue: string;
  }>;
  topCategories: Array<{
    categoryId: string;
    categoryName: string;
    revenueMinor: number;
    formattedRevenue: string;
    sharePercentage: number;
  }>;
  orderQuality: {
    totalOrders: number;
    cancelledOrdersCount: number;
    cancellationRatePercentage: number;
    returnedOrdersCount: number;
    returnRatePercentage: number;
    totalRefundsMinor: number;
    formattedTotalRefunds: string;
  };
  inventoryHealth: {
    totalSKUsCount: number;
    inStockSKUsCount: number;
    lowStockSKUsCount: number;
    outOfStockSKUsCount: number;
  };
  quickCommercePerformance: {
    fladoActiveListingsCount: number;
    fladoOrdersCount: number;
  };
  funnelMetrics: {
    tracked: boolean;
    message: string;
  };
}

export interface PriceHistoryDTO {
  id: string;
  productId: string;
  variantId: string;
  previousPriceMinor: number;
  newPriceMinor: number;
  previousCompareAtPriceMinor: number | null;
  newCompareAtPriceMinor: number | null;
  promoStartDate: Date | null;
  promoEndDate: Date | null;
  reasonNote: string | null;
  actorUserId: string | null;
  createdAt: Date;
}

export interface StockHistoryDTO {
  id: string;
  inventoryId: string;
  adjustmentType: string;
  previousQuantity: number;
  newQuantity: number;
  deltaQuantity: number;
  reasonNote: string | null;
  actorUserId: string | null;
  createdAt: Date;
}

export interface VendorDashboardSummary {
  vendorId: string;
  storeName: string;
  isVerified: boolean;
  performanceScore: number;
  salesSummary: {
    grossRevenueMinor: number;
    formattedGrossRevenue: string;
    totalOrdersCount: number;
    avgOrderValueMinor: number;
    formattedAvgOrderValue: string;
    activeListingsCount: number;
  };
  ordersRequiringActionCount: number;
  ordersRequiringAction: Array<{
    id: string;
    customerName: string;
    totalAmountMinor: number;
    formattedTotalAmount: string;
    status: string;
    createdAt: Date;
    itemCount: number;
  }>;
  lowStockAlertsCount: number;
  lowStockAlerts: Array<{
    id: string;
    productId: string;
    variantName?: string;
    stockQuantity: number;
  }>;
  pendingShipmentsCount: number;
  quickCommercePerformance: {
    fladoListingsCount: number;
    fladoActiveCount: number;
  };
  settlementSummary: {
    unclearedBalanceMinor: number;
    formattedUnclearedBalance: string;
    settledBalanceMinor: number;
    formattedSettledBalance: string;
    commissionRatePercentage: number;
    gstOnCommissionPercentage: number;
  };
}

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepo: Repository<Vendor>,
    @InjectRepository(SellerListing)
    private readonly listingRepo: Repository<SellerListing>,
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(ProductImage)
    private readonly imageRepo: Repository<ProductImage>,
    @InjectRepository(StockHistory)
    private readonly stockHistoryRepo: Repository<StockHistory>,
    @InjectRepository(PriceHistory)
    private readonly priceHistoryRepo: Repository<PriceHistory>,
    @InjectRepository(OrderTrackingEvent)
    private readonly trackingEventRepo: Repository<OrderTrackingEvent>,
    @InjectRepository(ReturnRequest)
    private readonly returnRepo: Repository<ReturnRequest>,
    @InjectRepository(ReturnTrackingEvent)
    private readonly returnTrackingRepo: Repository<ReturnTrackingEvent>,
    @InjectRepository(VendorSettlementLedger)
    private readonly ledgerRepo: Repository<VendorSettlementLedger>,
    @InjectRepository(VendorPayout)
    private readonly payoutRepo: Repository<VendorPayout>,
    @InjectRepository(VendorStaff)
    private readonly staffRepo: Repository<VendorStaff>,
    @InjectRepository(VendorInvitation)
    private readonly invitationRepo: Repository<VendorInvitation>,
    @InjectRepository(VendorActivityLog)
    private readonly activityRepo: Repository<VendorActivityLog>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  public static calculateSettlementAmounts(grossMinor: number) {
    const commissionRate = 0.08;
    const gstRate = 0.18;
    
    const commissionAmountMinor = Math.round(grossMinor * commissionRate);
    const taxWithholdingMinor = Math.round(grossMinor * commissionRate * gstRate);
    const totalFeeMinor = commissionAmountMinor + taxWithholdingMinor;
    const netAmountMinor = Math.max(0, grossMinor - totalFeeMinor);

    return {
      grossAmountMinor: grossMinor,
      commissionAmountMinor,
      taxWithholdingMinor,
      totalFeeMinor,
      netAmountMinor,
    };
  }

  async getVendorByUserId(userId: string): Promise<Vendor> {
    let vendor = await this.vendorRepo.findOne({ where: { userId } });
    if (!vendor) {
      // Check if user is staff of a vendor
      const staff = await this.staffRepo.findOne({ where: { userId, status: 'ACTIVE' } });
      if (staff) {
        vendor = await this.vendorRepo.findOne({ where: { id: staff.vendorId } });
      }
    }

    if (!vendor) {
      vendor = this.vendorRepo.create({
        userId,
        storeName: 'AuraMart Heritage Crafts',
        storeDescription: 'Authentic handcrafted products from registered artisans.',
        gstNumber: '27AAAAA1111A1Z1',
        isVerified: true,
        onboardingStatus: 'APPROVED',
        businessLegalName: 'AuraMart Heritage Crafts Private Limited',
        panNumber: 'AAAAA1111A',
        bankAccountName: 'AuraMart Heritage Crafts Private Limited',
        bankAccountNumber: '50100234567890',
        bankIfsc: 'HDFC0000123',
        agreementsAccepted: true,
        agreementsAcceptedAt: new Date(),
        performanceScore: 4.8,
      });
      vendor = await this.vendorRepo.save(vendor);
    }
    return vendor;
  }

  // --- CMD-082 Vendor Staff & Activity Audit Logging ---

  async logVendorActivity(
    vendorId: string,
    actorUserId: string | null,
    action: string,
    metadata?: any,
  ): Promise<VendorActivityLog> {
    let actorEmail: string | null = null;
    if (actorUserId) {
      const user = await this.userRepo.findOne({ where: { id: actorUserId } });
      if (user) {
        actorEmail = user.email;
      }
    }

    // Sanitize metadata: remove passwords, secrets, JWTs, bank account details!
    const sanitizedMeta = metadata ? { ...metadata } : {};
    delete sanitizedMeta.password;
    delete sanitizedMeta.token;
    delete sanitizedMeta.bankAccountNumber;
    delete sanitizedMeta.secret;

    const log = this.activityRepo.create({
      vendorId,
      actorUserId,
      actorEmail,
      action,
      metadataJson: JSON.stringify(sanitizedMeta),
    });

    return this.activityRepo.save(log);
  }

  async getVendorStaffList(vendorId: string): Promise<VendorStaffDTO[]> {
    const vendor = await this.vendorRepo.findOne({ where: { id: vendorId } });
    if (!vendor) {
      throw new NotFoundException(`Vendor ${vendorId} not found`);
    }

    const staffMembers = await this.staffRepo.find({ where: { vendorId }, order: { createdAt: 'ASC' } });
    const result: VendorStaffDTO[] = [];

    // Ensure primary vendor owner is included in list
    const primaryUser = await this.userRepo.findOne({ where: { id: vendor.userId } });
    result.push({
      id: `owner-${vendor.id}`,
      userId: vendor.userId,
      email: primaryUser?.email || 'owner@vendor.com',
      vendorRole: 'OWNER',
      status: 'ACTIVE',
      isPrimaryOwner: true,
      createdAt: vendor.createdAt,
    });

    for (const s of staffMembers) {
      if (s.userId === vendor.userId) continue; // Avoid duplicating primary owner
      result.push({
        id: s.id,
        userId: s.userId,
        email: s.email,
        vendorRole: s.vendorRole,
        status: s.status,
        isPrimaryOwner: false,
        createdAt: s.createdAt,
      });
    }

    return result;
  }

  async inviteVendorStaff(
    vendorId: string,
    dto: { email: string; vendorRole: 'OWNER' | 'MANAGER' | 'FULFILLMENT_STAFF' },
    actorUserId: string,
  ): Promise<VendorInvitationDTO> {
    await this.verifyVendorOwnerPermission(vendorId, actorUserId);

    const existingStaff = await this.staffRepo.findOne({ where: { vendorId, email: dto.email, status: 'ACTIVE' } });
    if (existingStaff) {
      throw new ConflictException(`User ${dto.email} is already an active staff member of this vendor.`);
    }

    const rawToken = crypto.randomBytes(24).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiration

    let invitation = this.invitationRepo.create({
      vendorId,
      email: dto.email,
      vendorRole: dto.vendorRole,
      tokenHash,
      status: 'PENDING',
      invitedByUserId: actorUserId,
      expiresAt,
    });
    invitation = await this.invitationRepo.save(invitation);

    await this.logVendorActivity(vendorId, actorUserId, 'STAFF_INVITED', {
      invitationId: invitation.id,
      email: dto.email,
      vendorRole: dto.vendorRole,
    });

    return {
      id: invitation.id,
      email: invitation.email,
      vendorRole: invitation.vendorRole,
      status: invitation.status,
      expiresAt: invitation.expiresAt,
      inviteUrl: `/accept-invite?token=${rawToken}`, // Simulated link payload
      createdAt: invitation.createdAt,
    };
  }

  async getVendorInvitations(vendorId: string): Promise<VendorInvitationDTO[]> {
    const invitations = await this.invitationRepo.find({ where: { vendorId }, order: { createdAt: 'DESC' } });
    const now = new Date();

    for (const inv of invitations) {
      if (inv.status === 'PENDING' && new Date(inv.expiresAt).getTime() < now.getTime()) {
        inv.status = 'EXPIRED';
        await this.invitationRepo.save(inv);
      }
    }

    return invitations.map((inv) => ({
      id: inv.id,
      email: inv.email,
      vendorRole: inv.vendorRole,
      status: inv.status,
      expiresAt: inv.expiresAt,
      createdAt: inv.createdAt,
    }));
  }

  async revokeVendorInvitation(vendorId: string, invitationId: string, actorUserId: string): Promise<{ success: boolean }> {
    await this.verifyVendorOwnerPermission(vendorId, actorUserId);

    const inv = await this.invitationRepo.findOne({ where: { id: invitationId, vendorId } });
    if (!inv) {
      throw new NotFoundException(`Invitation ${invitationId} not found`);
    }

    inv.status = 'REVOKED';
    await this.invitationRepo.save(inv);

    await this.logVendorActivity(vendorId, actorUserId, 'INVITATION_REVOKED', { invitationId: inv.id, email: inv.email });
    return { success: true };
  }

  async acceptVendorInvitation(token: string, actorUserId: string, actorEmail: string): Promise<VendorStaffDTO> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const inv = await this.invitationRepo.findOne({ where: { tokenHash } });

    if (!inv) {
      throw new NotFoundException('Invalid or expired invitation token.');
    }

    if (inv.status !== 'PENDING') {
      throw new BadRequestException(`Invitation is no longer pending. Status: ${inv.status}`);
    }

    if (new Date(inv.expiresAt).getTime() < Date.now()) {
      inv.status = 'EXPIRED';
      await this.invitationRepo.save(inv);
      throw new BadRequestException('Invitation token has expired.');
    }

    // Bind identity to staff
    let staff = this.staffRepo.create({
      vendorId: inv.vendorId,
      userId: actorUserId,
      email: actorEmail || inv.email,
      vendorRole: inv.vendorRole,
      status: 'ACTIVE',
      invitedByUserId: inv.invitedByUserId,
    });
    staff = await this.staffRepo.save(staff);

    inv.status = 'ACCEPTED';
    await this.invitationRepo.save(inv);

    // Synchronize user role in database
    const user = await this.userRepo.findOne({ where: { id: actorUserId } });
    if (user && user.role === 'CUSTOMER') {
      user.role = inv.vendorRole === 'OWNER' ? 'VENDOR_OWNER' : 'VENDOR_STAFF';
      await this.userRepo.save(user);
    }

    await this.logVendorActivity(inv.vendorId, actorUserId, 'INVITATION_ACCEPTED', {
      staffId: staff.id,
      vendorRole: staff.vendorRole,
    });

    return {
      id: staff.id,
      userId: staff.userId,
      email: staff.email,
      vendorRole: staff.vendorRole,
      status: staff.status,
      isPrimaryOwner: false,
      createdAt: staff.createdAt,
    };
  }

  async updateVendorStaffRole(
    vendorId: string,
    staffId: string,
    newRole: 'OWNER' | 'MANAGER' | 'FULFILLMENT_STAFF',
    actorUserId: string,
  ): Promise<VendorStaffDTO> {
    await this.verifyVendorOwnerPermission(vendorId, actorUserId);

    const staff = await this.staffRepo.findOne({ where: { id: staffId, vendorId } });
    if (!staff) {
      throw new NotFoundException(`Staff member ${staffId} not found`);
    }

    if (staff.userId === actorUserId) {
      throw new BadRequestException('You cannot modify your own role to elevate or alter your permissions.');
    }

    staff.vendorRole = newRole;
    await this.staffRepo.save(staff);

    await this.logVendorActivity(vendorId, actorUserId, 'STAFF_ROLE_UPDATED', {
      staffId: staff.id,
      newRole,
    });

    return {
      id: staff.id,
      userId: staff.userId,
      email: staff.email,
      vendorRole: staff.vendorRole,
      status: staff.status,
      isPrimaryOwner: false,
      createdAt: staff.createdAt,
    };
  }

  async updateVendorStaffStatus(
    vendorId: string,
    staffId: string,
    status: 'ACTIVE' | 'INACTIVE',
    actorUserId: string,
  ): Promise<VendorStaffDTO> {
    await this.verifyVendorOwnerPermission(vendorId, actorUserId);

    const staff = await this.staffRepo.findOne({ where: { id: staffId, vendorId } });
    if (!staff) {
      throw new NotFoundException(`Staff member ${staffId} not found`);
    }

    // Last-owner protection
    if (status === 'INACTIVE' && staff.vendorRole === 'OWNER') {
      const activeOwners = await this.staffRepo.find({ where: { vendorId, vendorRole: 'OWNER', status: 'ACTIVE' } });
      if (activeOwners.length <= 1) {
        throw new BadRequestException('Cannot deactivate the last active OWNER of the vendor account.');
      }
    }

    staff.status = status;
    await this.staffRepo.save(staff);

    await this.logVendorActivity(vendorId, actorUserId, 'STAFF_STATUS_UPDATED', {
      staffId: staff.id,
      status,
    });

    return {
      id: staff.id,
      userId: staff.userId,
      email: staff.email,
      vendorRole: staff.vendorRole,
      status: staff.status,
      isPrimaryOwner: false,
      createdAt: staff.createdAt,
    };
  }

  async removeVendorStaff(vendorId: string, staffId: string, actorUserId: string): Promise<{ success: boolean }> {
    await this.verifyVendorOwnerPermission(vendorId, actorUserId);

    const staff = await this.staffRepo.findOne({ where: { id: staffId, vendorId } });
    if (!staff) {
      throw new NotFoundException(`Staff member ${staffId} not found`);
    }

    // Last-owner protection
    if (staff.vendorRole === 'OWNER') {
      const activeOwners = await this.staffRepo.find({ where: { vendorId, vendorRole: 'OWNER', status: 'ACTIVE' } });
      if (activeOwners.length <= 1) {
        throw new BadRequestException('Cannot remove the last active OWNER of the vendor account.');
      }
    }

    await this.staffRepo.delete(staff.id);

    await this.logVendorActivity(vendorId, actorUserId, 'STAFF_REMOVED', {
      staffId: staff.id,
      email: staff.email,
    });

    return { success: true };
  }

  async getVendorActivityLogs(vendorId: string): Promise<VendorActivityLogDTO[]> {
    const logs = await this.activityRepo.find({ where: { vendorId }, order: { createdAt: 'DESC' } });
    return logs.map((l) => ({
      id: l.id,
      actorUserId: l.actorUserId,
      actorEmail: l.actorEmail,
      action: l.action,
      metadata: l.metadataJson ? JSON.parse(l.metadataJson) : null,
      createdAt: l.createdAt,
    }));
  }

  private async verifyVendorOwnerPermission(vendorId: string, actorUserId: string): Promise<void> {
    const vendor = await this.vendorRepo.findOne({ where: { id: vendorId } });
    if (vendor && vendor.userId === actorUserId) {
      return; // Primary vendor owner
    }

    const staff = await this.staffRepo.findOne({ where: { vendorId, userId: actorUserId, status: 'ACTIVE' } });
    if (!staff || staff.vendorRole !== 'OWNER') {
      throw new ForbiddenException('Access denied: Privileged staff action requires vendor OWNER permissions.');
    }
  }

  // --- CMD-081 Vendor Analytics ---

  async getVendorAnalytics(
    vendorId: string,
    query?: { period?: string },
  ): Promise<VendorAnalyticsDTO> {
    const vendor = await this.vendorRepo.findOne({ where: { id: vendorId } });
    if (!vendor) {
      throw new NotFoundException(`Vendor ${vendorId} not found`);
    }

    const periodStr = (query?.period || '30D').toUpperCase() as '7D' | '30D' | '90D' | '1Y' | 'ALL';

    let startDate: Date | null = null;
    const now = new Date();
    if (periodStr === '7D') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (periodStr === '30D') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (periodStr === '90D') {
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    } else if (periodStr === '1Y') {
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    }

    const vendorItems = await this.orderItemRepo.find({ where: { vendorId } });
    const orderIds = Array.from(new Set(vendorItems.map((i) => i.orderId)));
    const allOrders = orderIds.length > 0 ? await this.orderRepo.findByIds(orderIds) : [];

    const filteredOrders = startDate
      ? allOrders.filter((o) => new Date(o.createdAt).getTime() >= startDate.getTime())
      : allOrders;

    const filteredOrderIds = new Set(filteredOrders.map((o) => o.id));
    const filteredItems = vendorItems.filter((i) => filteredOrderIds.has(i.orderId));

    let grossRevenueMinor = 0;
    let totalUnitsSold = 0;

    const prodRevenueMap = new Map<string, { title: string; sku: string; unitsSold: number; revenueMinor: number }>();
    const catRevenueMap = new Map<string, { categoryName: string; revenueMinor: number }>();

    for (const item of filteredItems) {
      const itemSubtotal = Number(item.subtotalMinor || 0);
      const itemQty = item.quantity - (item.cancelledQuantity || 0);

      if (itemQty > 0) {
        grossRevenueMinor += itemSubtotal;
        totalUnitsSold += itemQty;

        const existingProd = prodRevenueMap.get(item.productId) || {
          title: item.title || 'Product Item',
          sku: item.sku || item.productId,
          unitsSold: 0,
          revenueMinor: 0,
        };
        existingProd.unitsSold += itemQty;
        existingProd.revenueMinor += itemSubtotal;
        prodRevenueMap.set(item.productId, existingProd);
      }
    }

    const fees = VendorsService.calculateSettlementAmounts(grossRevenueMinor);

    const totalOrdersCount = filteredOrders.length;
    const avgOrderValueMinor = totalOrdersCount > 0 ? Math.round(grossRevenueMinor / totalOrdersCount) : 0;

    const trendMap = new Map<string, { gross: number; orders: number }>();
    for (const ord of filteredOrders) {
      const dateKey = new Date(ord.createdAt).toISOString().split('T')[0];
      const itemsForOrd = filteredItems.filter((i) => i.orderId === ord.id);
      const ordGross = itemsForOrd.reduce((sum, i) => sum + Number(i.subtotalMinor || 0), 0);

      const existing = trendMap.get(dateKey) || { gross: 0, orders: 0 };
      existing.gross += ordGross;
      existing.orders += 1;
      trendMap.set(dateKey, existing);
    }

    const revenueTrends = Array.from(trendMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, data]) => {
        const trendFees = VendorsService.calculateSettlementAmounts(data.gross);
        return {
          date,
          grossRevenueMinor: data.gross,
          formattedGrossRevenue: this.formatINR(data.gross),
          netPayoutMinor: trendFees.netAmountMinor,
          formattedNetPayout: this.formatINR(trendFees.netAmountMinor),
          ordersCount: data.orders,
        };
      });

    const topProducts = Array.from(prodRevenueMap.entries())
      .map(([productId, data]) => ({
        productId,
        title: data.title,
        sku: data.sku,
        unitsSold: data.unitsSold,
        revenueMinor: data.revenueMinor,
        formattedRevenue: this.formatINR(data.revenueMinor),
      }))
      .sort((a, b) => b.revenueMinor - a.revenueMinor)
      .slice(0, 5);

    const categories = await this.categoryRepo.find();
    const catNameMap = new Map(categories.map((c) => [c.id, c.name]));
    
    for (const [prodId, data] of prodRevenueMap.entries()) {
      const prod = await this.productRepo.findOne({ where: { id: prodId } });
      const catId = prod?.categoryId || 'general-category';
      const catName = catNameMap.get(catId) || 'General Crafts';

      const existingCat = catRevenueMap.get(catId) || { categoryName: catName, revenueMinor: 0 };
      existingCat.revenueMinor += data.revenueMinor;
      catRevenueMap.set(catId, existingCat);
    }

    const topCategories = Array.from(catRevenueMap.entries())
      .map(([categoryId, data]) => {
        const sharePercentage = grossRevenueMinor > 0 ? Math.round((data.revenueMinor / grossRevenueMinor) * 100) : 0;
        return {
          categoryId,
          categoryName: data.categoryName,
          revenueMinor: data.revenueMinor,
          formattedRevenue: this.formatINR(data.revenueMinor),
          sharePercentage,
        };
      })
      .sort((a, b) => b.revenueMinor - a.revenueMinor);

    const cancelledOrdersCount = filteredOrders.filter((o) => o.status === 'CANCELLED').length;
    const cancellationRatePercentage = totalOrdersCount > 0 ? Math.round((cancelledOrdersCount / totalOrdersCount) * 100) : 0;

    const allVendorReturns = await this.returnRepo.find();
    const returnedOrdersCount = allVendorReturns.filter((r) => r.status === 'RESOLVED_REFUND' || r.status === 'APPROVED').length;
    const returnRatePercentage = totalOrdersCount > 0 ? Math.round((returnedOrdersCount / totalOrdersCount) * 100) : 0;

    const totalRefundsMinor = allVendorReturns
      .filter((r) => r.status === 'RESOLVED_REFUND')
      .reduce((sum, r) => sum + Number(r.refundAmountMinor || 0), 0);

    const inventoryItems = await this.inventoryRepo.find({ where: { vendorId } });
    const totalSKUsCount = inventoryItems.length;
    let inStockSKUsCount = 0;
    let lowStockSKUsCount = 0;
    let outOfStockSKUsCount = 0;

    for (const inv of inventoryItems) {
      const avail = Math.max(0, inv.stockQuantity - (inv.reservedQuantity || 0));
      if (avail === 0) {
        outOfStockSKUsCount++;
      } else if (avail <= (inv.lowStockThreshold || 5)) {
        lowStockSKUsCount++;
      } else {
        inStockSKUsCount++;
      }
    }

    const listings = await this.listingRepo.find({ where: { vendorId } });
    const fladoActiveListingsCount = listings.filter((l) => !!l.shopId && l.isAvailable).length;
    const fladoOrdersCount = filteredOrders.filter((o) => !!o.shopId).length;

    return {
      vendorId: vendor.id,
      storeName: vendor.storeName,
      period: periodStr,
      salesOverview: {
        totalOrdersCount,
        totalUnitsSold,
        grossRevenueMinor,
        formattedGrossRevenue: this.formatINR(grossRevenueMinor),
        netPayoutMinor: fees.netAmountMinor,
        formattedNetPayout: this.formatINR(fees.netAmountMinor),
        avgOrderValueMinor,
        formattedAvgOrderValue: this.formatINR(avgOrderValueMinor),
      },
      revenueTrends,
      topProducts,
      topCategories,
      orderQuality: {
        totalOrders: totalOrdersCount,
        cancelledOrdersCount,
        cancellationRatePercentage,
        returnedOrdersCount,
        returnRatePercentage,
        totalRefundsMinor,
        formattedTotalRefunds: this.formatINR(totalRefundsMinor),
      },
      inventoryHealth: {
        totalSKUsCount,
        inStockSKUsCount,
        lowStockSKUsCount,
        outOfStockSKUsCount,
      },
      quickCommercePerformance: {
        fladoActiveListingsCount,
        fladoOrdersCount,
      },
      funnelMetrics: {
        tracked: false,
        message: 'Impression, click-through rate, and conversion funnel analytics are not currently tracked on platform PDPs.',
      },
    };
  }

  // --- CMD-080 Vendor Settlements & Payouts ---

  async recordLedgerEntry(
    vendorId: string,
    sourceType: 'ORDER_SALE' | 'RETURN_REFUND' | 'CANCELLATION_ADJUSTMENT' | 'MANUAL_PAYOUT',
    sourceId: string,
    grossMinor: number,
    direction: 'CREDIT' | 'DEBIT',
    description?: string,
  ): Promise<VendorSettlementLedger> {
    const existing = await this.ledgerRepo.findOne({ where: { vendorId, sourceType, sourceId } });
    if (existing) {
      return existing;
    }

    const fees = VendorsService.calculateSettlementAmounts(grossMinor);

    const entry = this.ledgerRepo.create({
      vendorId,
      sourceType,
      sourceId,
      grossAmountMinor: fees.grossAmountMinor,
      commissionAmountMinor: fees.commissionAmountMinor,
      taxWithholdingMinor: fees.taxWithholdingMinor,
      netAmountMinor: fees.netAmountMinor,
      direction,
      currency: 'INR',
      description: description || `${sourceType} entry for ${sourceId}`,
    });

    return this.ledgerRepo.save(entry);
  }

  async getVendorSettlements(vendorId: string): Promise<SettlementSummaryDTO> {
    const vendor = await this.vendorRepo.findOne({ where: { id: vendorId } });
    if (!vendor) {
      throw new NotFoundException(`Vendor ${vendorId} not found`);
    }

    const vendorItems = await this.orderItemRepo.find({ where: { vendorId } });
    const orderIds = Array.from(new Set(vendorItems.map((i) => i.orderId)));

    if (orderIds.length > 0) {
      const orders = await this.orderRepo.findByIds(orderIds);
      for (const ord of orders) {
        if (ord.status === 'DELIVERED' || ord.status === 'SHIPPED') {
          const itemsForOrd = vendorItems.filter((i) => i.orderId === ord.id);
          const grossSaleMinor = itemsForOrd.reduce((sum, item) => sum + Number(item.subtotalMinor || 0), 0);
          if (grossSaleMinor > 0) {
            await this.recordLedgerEntry(vendorId, 'ORDER_SALE', ord.id, grossSaleMinor, 'CREDIT', `Delivered Order ${ord.orderNumber || ord.id}`);
          }
        }
      }
    }

    const ledgerEntries = await this.ledgerRepo.find({
      where: { vendorId },
      order: { createdAt: 'DESC' },
    });

    const payouts = await this.payoutRepo.find({
      where: { vendorId },
      order: { createdAt: 'DESC' },
    });

    let grossSalesMinor = 0;
    let totalCommissionMinor = 0;
    let totalTaxWithholdingMinor = 0;
    let totalRefundsAdjustmentsMinor = 0;
    let unclearedBalanceMinor = 0;

    for (const l of ledgerEntries) {
      const gross = Number(l.grossAmountMinor || 0);
      const comm = Number(l.commissionAmountMinor || 0);
      const tax = Number(l.taxWithholdingMinor || 0);
      const net = Number(l.netAmountMinor || 0);

      if (l.direction === 'CREDIT') {
        grossSalesMinor += gross;
        totalCommissionMinor += comm;
        totalTaxWithholdingMinor += tax;
        if (!l.payoutId) {
          unclearedBalanceMinor += net;
        }
      } else {
        totalRefundsAdjustmentsMinor += gross;
        if (!l.payoutId) {
          unclearedBalanceMinor -= net;
        }
      }
    }

    const settledBalanceMinor = payouts
      .filter((p) => p.status === 'PAID')
      .reduce((sum, p) => sum + Number(p.netPayoutMinor || 0), 0);

    return {
      vendorId: vendor.id,
      storeName: vendor.storeName,
      bankAccountNumberMasked: this.maskBankAccount(vendor.bankAccountNumber),
      bankIfsc: vendor.bankIfsc || null,
      grossSalesMinor,
      formattedGrossSales: this.formatINR(grossSalesMinor),
      totalCommissionMinor,
      formattedTotalCommission: this.formatINR(totalCommissionMinor),
      totalTaxWithholdingMinor,
      formattedTotalTaxWithholding: this.formatINR(totalTaxWithholdingMinor),
      totalRefundsAdjustmentsMinor,
      formattedTotalRefundsAdjustments: this.formatINR(totalRefundsAdjustmentsMinor),
      unclearedBalanceMinor: Math.max(0, unclearedBalanceMinor),
      formattedUnclearedBalance: this.formatINR(Math.max(0, unclearedBalanceMinor)),
      settledBalanceMinor,
      formattedSettledBalance: this.formatINR(settledBalanceMinor),
      payoutHistory: payouts.map((p) => ({
        payoutId: p.id,
        grossAmountMinor: Number(p.grossAmountMinor),
        formattedGrossAmount: this.formatINR(Number(p.grossAmountMinor)),
        netPayoutMinor: Number(p.netPayoutMinor),
        formattedNetPayout: this.formatINR(Number(p.netPayoutMinor)),
        status: p.status,
        bankAccountNumberMasked: p.bankAccountNumberMasked,
        createdAt: p.createdAt,
      })),
      ledgerEntries: ledgerEntries.slice(0, 50).map((l) => ({
        id: l.id,
        sourceType: l.sourceType,
        sourceId: l.sourceId,
        grossAmountMinor: Number(l.grossAmountMinor),
        formattedGrossAmount: this.formatINR(Number(l.grossAmountMinor)),
        netAmountMinor: Number(l.netAmountMinor),
        formattedNetAmount: this.formatINR(Number(l.netAmountMinor)),
        direction: l.direction,
        description: l.description,
        createdAt: l.createdAt,
      })),
    };
  }

  async triggerVendorPayout(vendorId: string, actorUserId?: string): Promise<VendorPayout> {
    const summary = await this.getVendorSettlements(vendorId);
    if (summary.unclearedBalanceMinor <= 0) {
      throw new BadRequestException('No uncleared balance available for payout.');
    }

    const vendor = await this.vendorRepo.findOne({ where: { id: vendorId } });
    if (!vendor) {
      throw new NotFoundException(`Vendor ${vendorId} not found`);
    }

    const unlinkedLedger = await this.ledgerRepo.find({ where: { vendorId } });
    const pendingLedger = unlinkedLedger.filter((l) => !l.payoutId);

    let grossAmountMinor = 0;
    let commissionAmountMinor = 0;
    let taxWithholdingMinor = 0;
    let netPayoutMinor = 0;

    for (const l of pendingLedger) {
      const g = Number(l.grossAmountMinor);
      const c = Number(l.commissionAmountMinor);
      const t = Number(l.taxWithholdingMinor);
      const n = Number(l.netAmountMinor);

      if (l.direction === 'CREDIT') {
        grossAmountMinor += g;
        commissionAmountMinor += c;
        taxWithholdingMinor += t;
        netPayoutMinor += n;
      } else {
        grossAmountMinor -= g;
        commissionAmountMinor -= c;
        taxWithholdingMinor -= t;
        netPayoutMinor -= n;
      }
    }

    let payout = this.payoutRepo.create({
      vendorId,
      grossAmountMinor: Math.max(0, grossAmountMinor),
      commissionAmountMinor: Math.max(0, commissionAmountMinor),
      taxWithholdingMinor: Math.max(0, taxWithholdingMinor),
      netPayoutMinor: Math.max(0, netPayoutMinor),
      status: 'PROCESSING',
      periodStart: pendingLedger.length > 0 ? pendingLedger[pendingLedger.length - 1].createdAt : new Date(),
      periodEnd: new Date(),
      bankAccountNumberMasked: this.maskBankAccount(vendor.bankAccountNumber),
      bankIfsc: vendor.bankIfsc || null,
      failureReason: 'Payout initiated. Awaiting bank settlement confirmation (Provider integration deferred).',
    });
    payout = await this.payoutRepo.save(payout);

    for (const l of pendingLedger) {
      l.payoutId = payout.id;
      await this.ledgerRepo.save(l);
    }

    if (actorUserId) {
      await this.logVendorActivity(vendorId, actorUserId, 'PAYOUT_REQUESTED', {
        payoutId: payout.id,
        netPayoutMinor: payout.netPayoutMinor,
      });
    }

    return payout;
  }

  async confirmVendorPayout(
    vendorId: string,
    payoutId: string,
    action: 'CONFIRM' | 'FAIL',
    failureReason?: string,
  ): Promise<VendorPayout> {
    const payout = await this.payoutRepo.findOne({ where: { id: payoutId, vendorId } });
    if (!payout) {
      throw new NotFoundException(`Payout ${payoutId} not found`);
    }

    if (action === 'CONFIRM') {
      payout.status = 'PAID';
      payout.failureReason = null;
    } else {
      payout.status = 'FAILED';
      payout.failureReason = failureReason || 'Bank transfer rejected by provider';

      const ledgerEntries = await this.ledgerRepo.find({ where: { payoutId: payout.id } });
      for (const l of ledgerEntries) {
        l.payoutId = null;
        await this.ledgerRepo.save(l);
      }
    }

    return this.payoutRepo.save(payout);
  }

  async getVendorStatement(vendorId: string, payoutId: string): Promise<StatementDTO> {
    const payout = await this.payoutRepo.findOne({ where: { id: payoutId, vendorId } });
    if (!payout) {
      throw new ForbiddenException(`Access denied: Payout statement ${payoutId} not found for your vendor account`);
    }

    const vendor = await this.vendorRepo.findOne({ where: { id: vendorId } });
    const ledger = await this.ledgerRepo.find({ where: { payoutId: payout.id } });

    const grossSalesMinor = Number(payout.grossAmountMinor);
    const commissionMinor = Number(payout.commissionAmountMinor);
    const taxWithholdingMinor = Number(payout.taxWithholdingMinor);
    const netPayoutMinor = Number(payout.netPayoutMinor);

    return {
      statementId: `STMT-${payout.id.substring(0, 8)}`,
      periodStart: payout.periodStart || payout.createdAt,
      periodEnd: payout.periodEnd || payout.createdAt,
      vendorStoreName: vendor?.storeName || 'AuraMart Registered Artisan',
      bankAccountNumberMasked: payout.bankAccountNumberMasked,
      bankIfsc: payout.bankIfsc,
      grossSalesMinor,
      formattedGrossSales: this.formatINR(grossSalesMinor),
      commissionMinor,
      formattedCommission: this.formatINR(commissionMinor),
      taxWithholdingMinor,
      formattedTaxWithholding: this.formatINR(taxWithholdingMinor),
      adjustmentsMinor: 0,
      formattedAdjustments: this.formatINR(0),
      netPayoutMinor,
      formattedNetPayout: this.formatINR(netPayoutMinor),
      status: payout.status,
      ledgerEntries: ledger.map((l) => ({
        sourceType: l.sourceType,
        sourceId: l.sourceId,
        grossAmountMinor: Number(l.grossAmountMinor),
        netAmountMinor: Number(l.netAmountMinor),
        direction: l.direction,
        createdAt: l.createdAt,
      })),
    };
  }

  // --- CMD-079 Vendor Returns Management ---

  async getVendorReturns(
    vendorId: string,
    query?: { search?: string; status?: string },
  ): Promise<VendorReturnSummaryDTO[]> {
    const vendorItems = await this.orderItemRepo.find({ where: { vendorId } });
    if (vendorItems.length === 0) {
      return [];
    }

    const itemMap = new Map(vendorItems.map((i) => [i.id, i]));
    const allReturns = await this.returnRepo.find({ order: { createdAt: 'DESC' } });

    const result: VendorReturnSummaryDTO[] = [];

    for (const ret of allReturns) {
      const item = ret.orderItemId ? itemMap.get(ret.orderItemId) : null;
      if (!item) {
        continue;
      }

      if (query?.status && ret.status !== query.status.toUpperCase()) {
        continue;
      }
      if (query?.search && !ret.id.toLowerCase().includes(query.search.toLowerCase()) && !ret.orderId.toLowerCase().includes(query.search.toLowerCase())) {
        continue;
      }

      const refundAmountMinor = Number(ret.refundAmountMinor || Math.round((ret.refundAmount || 0) * 100));

      result.push({
        returnId: ret.id,
        orderId: ret.orderId,
        productTitle: item.title || 'Product Item',
        sku: item.sku || item.productId,
        requestedQuantity: ret.quantity,
        reason: ret.reason,
        resolutionChoice: ret.resolutionChoice,
        status: ret.status,
        qcStatus: ret.qcStatus,
        refundAmountMinor,
        formattedRefundAmount: this.formatINR(refundAmountMinor),
        createdAt: ret.createdAt,
      });
    }

    return result;
  }

  async getVendorReturnById(vendorId: string, returnId: string): Promise<VendorReturnDetailDTO> {
    const ret = await this.returnRepo.findOne({ where: { id: returnId } });
    if (!ret) {
      throw new NotFoundException(`Return request ${returnId} not found`);
    }

    if (!ret.orderItemId) {
      throw new BadRequestException(`Return request ${returnId} missing order item association`);
    }

    const item = await this.orderItemRepo.findOne({ where: { id: ret.orderItemId } });
    if (!item || item.vendorId !== vendorId) {
      throw new ForbiddenException(`Access denied: Return request ${returnId} contains no items belonging to your vendor account`);
    }

    const timeline = await this.returnTrackingRepo.find({
      where: { returnRequestId: ret.id },
      order: { occurredAt: 'ASC' },
    });

    const refundAmountMinor = Number(ret.refundAmountMinor || Math.round((ret.refundAmount || 0) * 100));
    const fees = VendorsService.calculateSettlementAmounts(refundAmountMinor);

    let evidenceUrls: string[] = [];
    try {
      if (ret.evidenceUrlsJson) {
        evidenceUrls = JSON.parse(ret.evidenceUrlsJson);
      }
    } catch (e) {
      evidenceUrls = [];
    }

    const isRestocked = timeline.some((t) => t.eventType === 'QC_PASS' || t.statusText.includes('Restocked'));

    return {
      returnId: ret.id,
      orderId: ret.orderId,
      orderItemId: item.id,
      productTitle: item.title || 'Product Item',
      sku: item.sku || item.productId,
      requestedQuantity: ret.quantity,
      reason: ret.reason,
      description: ret.description || null,
      resolutionChoice: ret.resolutionChoice,
      fulfillmentType: ret.fulfillmentType,
      evidenceUrls,
      qcStatus: ret.qcStatus,
      qcNotes: ret.qcNotes || null,
      status: ret.status,
      refundAmountMinor,
      formattedRefundAmount: this.formatINR(refundAmountMinor),
      payoutImpactMinor: fees.netAmountMinor,
      formattedPayoutImpact: this.formatINR(fees.netAmountMinor),
      restocked: isRestocked,
      createdAt: ret.createdAt,
      timeline: timeline.map((t) => ({
        eventType: t.eventType,
        statusText: t.statusText,
        description: t.description,
        actorRole: t.actorRole,
        occurredAt: t.occurredAt,
      })),
    };
  }

  async processVendorReturnDecision(
    vendorId: string,
    returnId: string,
    dto: VendorReturnDecisionDTO,
    actorUserId?: string,
  ): Promise<VendorReturnDetailDTO> {
    const detail = await this.getVendorReturnById(vendorId, returnId);
    const ret = await this.returnRepo.findOne({ where: { id: returnId } });
    if (!ret) {
      throw new NotFoundException(`Return request ${returnId} not found`);
    }

    if (ret.status === 'RESOLVED_REFUND' || ret.status === 'REJECTED') {
      throw new BadRequestException(`Cannot process return decision in terminal status: ${ret.status}`);
    }

    let nextStatus: 'REQUESTED' | 'APPROVED' | 'PICKUP_SCHEDULED' | 'IN_TRANSIT' | 'QC_PENDING' | 'RESOLVED_REFUND' | 'RESOLVED_REPLACEMENT' | 'REJECTED' = ret.status;
    let nextQcStatus = ret.qcStatus;
    let trackingText = '';

    if (dto.action === 'APPROVE') {
      if (ret.status !== 'REQUESTED') {
        throw new BadRequestException(`Cannot approve return from current status ${ret.status}`);
      }
      nextStatus = 'APPROVED';
      trackingText = 'Return request approved by vendor. Awaiting item inspection.';
    } else if (dto.action === 'REJECT') {
      nextStatus = 'REJECTED';
      nextQcStatus = 'QC_FAILED';
      trackingText = 'Return request rejected by vendor.';
    } else if (dto.action === 'QC_PASS') {
      nextQcStatus = 'QC_PASSED';
      nextStatus = 'RESOLVED_REFUND';
      trackingText = 'Quality inspection PASSED. Refund authorized.';

      if (dto.restock !== false && !detail.restocked) {
        const inv = await this.inventoryRepo.findOne({ where: { vendorId, productId: detail.sku } });
        if (inv) {
          const prev = inv.stockQuantity;
          inv.stockQuantity += ret.quantity;
          await this.inventoryRepo.save(inv);

          const stockLog = this.stockHistoryRepo.create({
            inventoryId: inv.id,
            vendorId,
            adjustmentType: 'RETURN_RESTOCK',
            previousQuantity: prev,
            newQuantity: inv.stockQuantity,
            deltaQuantity: ret.quantity,
            reasonNote: `Return restock for return ${returnId}`,
            actorUserId: actorUserId || null,
          });
          await this.stockHistoryRepo.save(stockLog);
          trackingText += ` Item restocked (x${ret.quantity}).`;
        }
      }

      const refundMinor = Number(ret.refundAmountMinor || Math.round((ret.refundAmount || 0) * 100));
      await this.recordLedgerEntry(vendorId, 'RETURN_REFUND', ret.id, refundMinor, 'DEBIT', `Return refund deduction for ${detail.productTitle}`);
    } else if (dto.action === 'QC_FAIL') {
      nextQcStatus = 'QC_FAILED';
      nextStatus = 'REJECTED';
      trackingText = 'Quality inspection FAILED. Item damaged/non-resellable. Return rejected.';
    } else {
      throw new BadRequestException(`Invalid return decision action ${dto.action}`);
    }

    ret.status = nextStatus as any;
    ret.qcStatus = nextQcStatus as any;
    if (dto.notes) {
      ret.qcNotes = dto.notes;
    }
    await this.returnRepo.save(ret);

    const trackingEvent = this.returnTrackingRepo.create({
      returnRequestId: ret.id,
      eventType: dto.action,
      statusText: trackingText,
      description: dto.notes || `Vendor decision ${dto.action}`,
      actorRole: 'VENDOR',
      occurredAt: new Date(),
    });
    await this.returnTrackingRepo.save(trackingEvent);

    if (actorUserId) {
      await this.logVendorActivity(vendorId, actorUserId, 'RETURN_DECISION_PROCESSED', {
        returnId: ret.id,
        action: dto.action,
      });
    }

    return this.getVendorReturnById(vendorId, returnId);
  }

  // --- CMD-078 Vendor Orders & Fulfillment ---

  async getVendorOrders(
    vendorId: string,
    query?: { search?: string; status?: string },
  ): Promise<VendorOrderSummaryDTO[]> {
    const vendorItems = await this.orderItemRepo.find({ where: { vendorId } });
    if (vendorItems.length === 0) {
      return [];
    }

    const orderIds = Array.from(new Set(vendorItems.map((i) => i.orderId)));
    const orders = await this.orderRepo.findByIds(orderIds);

    const result: VendorOrderSummaryDTO[] = [];

    for (const ord of orders) {
      if (query?.status && ord.status !== query.status.toUpperCase()) {
        continue;
      }
      if (query?.search && !ord.id.toLowerCase().includes(query.search.toLowerCase()) && !(ord.orderNumber || '').toLowerCase().includes(query.search.toLowerCase())) {
        continue;
      }

      const itemsForOrder = vendorItems.filter((i) => i.orderId === ord.id);
      const vendorTotalMinor = itemsForOrder.reduce((sum, item) => sum + Number(item.subtotalMinor || 0), 0);

      result.push({
        orderId: ord.id,
        orderNumber: ord.orderNumber || `ORD-${ord.id.substring(0, 8)}`,
        status: ord.status,
        paymentStatus: ord.paymentStatus,
        vendorItemCount: itemsForOrder.length,
        vendorTotalMinor,
        formattedVendorTotal: this.formatINR(vendorTotalMinor),
        createdAt: ord.createdAt,
        slaWarning: this.calculateSlaWarning(ord.status, ord.createdAt),
      });
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getVendorOrderById(vendorId: string, orderId: string): Promise<VendorOrderDetailDTO> {
    const ord = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!ord) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    const vendorItems = await this.orderItemRepo.find({ where: { orderId, vendorId } });
    if (vendorItems.length === 0) {
      throw new ForbiddenException(`Access denied: Order ${orderId} contains no line items belonging to your vendor account`);
    }

    const itemsDTO: VendorOrderItemDTO[] = vendorItems.map((i) => {
      const unitPriceMinor = Number(i.unitPriceMinor || 0);
      const subtotalMinor = Number(i.subtotalMinor || 0);
      const fulfilledQuantity = Math.max(0, i.quantity - (i.cancelledQuantity || 0));

      return {
        id: i.id,
        productId: i.productId,
        variantId: i.variantId || null,
        sku: i.sku || i.productId,
        title: i.title || 'Product Item',
        variantTitle: i.variantTitle || undefined,
        quantity: i.quantity,
        cancelledQuantity: i.cancelledQuantity || 0,
        fulfilledQuantity,
        unitPriceMinor,
        formattedUnitPrice: this.formatINR(unitPriceMinor),
        subtotalMinor,
        formattedSubtotal: this.formatINR(subtotalMinor),
        status: i.status || ord.status,
      };
    });

    const vendorTotalMinor = itemsDTO.reduce((sum, item) => sum + item.subtotalMinor, 0);

    let shippingCityState = 'Standard Delivery';
    try {
      if (ord.shippingAddress) {
        const parsed = typeof ord.shippingAddress === 'string' ? JSON.parse(ord.shippingAddress) : ord.shippingAddress;
        if (parsed && typeof parsed === 'object') {
          shippingCityState = `${parsed.city || ''}, ${parsed.state || ''} ${parsed.pincode || ''}`.trim();
        }
      }
    } catch (e) {
      shippingCityState = 'Registered Address';
    }

    return {
      orderId: ord.id,
      orderNumber: ord.orderNumber || `ORD-${ord.id.substring(0, 8)}`,
      status: ord.status,
      paymentStatus: ord.paymentStatus,
      paymentMethod: ord.paymentMethod || 'ONLINE',
      createdAt: ord.createdAt,
      customerName: ord.customerId || 'Customer',
      shippingCityState,
      vendorItems: itemsDTO,
      vendorTotalMinor,
      formattedVendorTotal: this.formatINR(vendorTotalMinor),
      slaWarning: this.calculateSlaWarning(ord.status, ord.createdAt),
    };
  }

  async fulfillVendorOrder(
    vendorId: string,
    orderId: string,
    dto: FulfillOrderDTO,
    actorUserId?: string,
  ): Promise<VendorOrderDetailDTO> {
    const ord = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!ord) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    if (ord.status === 'CANCELLED' || ord.status === 'DELIVERED' || ord.status === 'RETURNED') {
      throw new BadRequestException(`Cannot perform fulfillment action on order in terminal status: ${ord.status}`);
    }

    const vendorItems = await this.orderItemRepo.find({ where: { orderId, vendorId } });
    if (vendorItems.length === 0) {
      throw new ForbiddenException(`Access denied: Order ${orderId} has no items belonging to your vendor account`);
    }

    let targetStatus: 'PLACED' | 'PREPARING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'RETURNED' = ord.status;
    let trackingText = '';

    if (dto.action === 'ACCEPT') {
      if (ord.status !== 'PLACED') {
        throw new BadRequestException(`Order cannot be accepted from current status ${ord.status}`);
      }
      targetStatus = 'PREPARING';
      trackingText = 'Order accepted by vendor and sent to fulfillment prep.';
    } else if (dto.action === 'PACK') {
      if (ord.status !== 'PLACED' && ord.status !== 'PREPARING') {
        throw new BadRequestException(`Order cannot be packed from current status ${ord.status}`);
      }
      targetStatus = 'PREPARING';
      trackingText = 'Order line items packed and ready for carrier pickup.';
    } else if (dto.action === 'SHIP') {
      if (ord.status !== 'PREPARING' && ord.status !== 'PLACED') {
        throw new BadRequestException(`Order cannot be shipped from current status ${ord.status}`);
      }
      targetStatus = 'SHIPPED';
      trackingText = 'Order dispatched with carrier shipment tracking.';
    } else {
      throw new BadRequestException(`Invalid fulfillment action ${dto.action}`);
    }

    for (const item of vendorItems) {
      if ((item.cancelledQuantity || 0) >= item.quantity) {
        throw new BadRequestException(`Cannot fulfill cancelled item ${item.title}`);
      }
      item.status = targetStatus;
      await this.orderItemRepo.save(item);
    }

    ord.status = targetStatus;
    await this.orderRepo.save(ord);

    const trackingEvent = this.trackingEventRepo.create({
      orderId: ord.id,
      eventType: `VENDOR_${dto.action}`,
      statusText: trackingText,
      description: dto.notes || `Fulfillment update by vendor ${vendorId}`,
      occurredAt: new Date(),
    });
    await this.trackingEventRepo.save(trackingEvent);

    if (actorUserId) {
      await this.logVendorActivity(vendorId, actorUserId, `ORDER_FULFILLMENT_${dto.action}`, {
        orderId: ord.id,
        targetStatus,
      });
    }

    return this.getVendorOrderById(vendorId, orderId);
  }

  async getVendorPackingSlip(vendorId: string, orderId: string): Promise<PackingSlipDTO> {
    const detail = await this.getVendorOrderById(vendorId, orderId);
    const vendor = await this.vendorRepo.findOne({ where: { id: vendorId } });

    const packItems = detail.vendorItems
      .filter((i) => i.fulfilledQuantity > 0)
      .map((i) => ({
        sku: i.sku,
        title: i.title,
        quantityToPack: i.fulfilledQuantity,
        unitPriceFormatted: i.formattedUnitPrice,
        lineSubtotalFormatted: i.formattedSubtotal,
      }));

    return {
      orderId: detail.orderId,
      orderNumber: detail.orderNumber,
      orderDate: detail.createdAt,
      vendorStoreName: vendor?.storeName || 'AuraMart Registered Artisan',
      customerRecipientName: detail.customerName,
      shippingAddressMin: detail.shippingCityState,
      items: packItems,
      packingInstructions: 'Handle with care. Inspect items prior to dispatch.',
      barcodeRef: `PKSLP-${detail.orderNumber}`,
    };
  }

  private calculateSlaWarning(
    status: string,
    createdAt: Date,
  ): { code: string; severity: 'INFO' | 'WARNING' | 'CRITICAL'; message: string } | null {
    const elapsedMinutes = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60);

    if (status === 'PLACED' && elapsedMinutes > 30) {
      return {
        code: 'URGENT_PACKING',
        severity: 'CRITICAL',
        message: 'URGENT: Order awaiting packing confirmation (>30m SLA warning).',
      };
    }

    if (status === 'PREPARING' && elapsedMinutes > 120) {
      return {
        code: 'DELAYED_DISPATCH',
        severity: 'WARNING',
        message: 'DELAYED: Order packing exceeding standard 2-hour fulfillment SLA.',
      };
    }

    return null;
  }

  // --- CMD-077 Vendor Pricing Management ---

  async updateVendorPricing(
    vendorId: string,
    productId: string,
    dto: UpdateVendorPricingDTO,
    actorUserId?: string,
  ): Promise<VendorProductDTO> {
    if (dto.priceMinor <= 0) {
      throw new BadRequestException('Selling price must be greater than 0.');
    }

    if (dto.compareAtPriceMinor !== undefined && dto.compareAtPriceMinor < dto.priceMinor) {
      throw new BadRequestException('Compare-at price (MRP) must be greater than or equal to selling price.');
    }

    let pStart: Date | null = null;
    let pEnd: Date | null = null;

    if (dto.promoStartDate && dto.promoEndDate) {
      pStart = new Date(dto.promoStartDate);
      pEnd = new Date(dto.promoEndDate);
      if (isNaN(pStart.getTime()) || isNaN(pEnd.getTime())) {
        throw new BadRequestException('Invalid promotional window dates.');
      }
      if (pEnd.getTime() <= pStart.getTime()) {
        throw new BadRequestException('Promotion end date must be after start date.');
      }
    }

    const prod = await this.productRepo.findOne({ where: { id: productId } });
    if (!prod) {
      throw new NotFoundException(`Product ${productId} not found`);
    }

    const variant = await this.variantRepo.findOne({ where: { productId } });
    if (!variant) {
      throw new NotFoundException(`Product variant for ${productId} not found`);
    }

    const listing = await this.listingRepo.findOne({ where: { variantId: variant.id, vendorId } });
    if (!listing) {
      throw new ForbiddenException(`Access denied: Product ${productId} does not belong to your vendor account`);
    }

    const previousPriceMinor = Number(listing.priceMinor || 0);
    const previousCompareAtPriceMinor = listing.compareAtPriceMinor ? Number(listing.compareAtPriceMinor) : null;

    listing.priceMinor = dto.priceMinor;
    listing.compareAtPriceMinor = dto.compareAtPriceMinor || null;
    variant.referenceMsrp = dto.priceMinor / 100;

    await this.listingRepo.save(listing);
    await this.variantRepo.save(variant);

    const historyLog = this.priceHistoryRepo.create({
      productId: prod.id,
      variantId: variant.id,
      vendorId,
      previousPriceMinor,
      newPriceMinor: dto.priceMinor,
      previousCompareAtPriceMinor,
      newCompareAtPriceMinor: dto.compareAtPriceMinor || null,
      promoStartDate: pStart,
      promoEndDate: pEnd,
      reasonNote: dto.reasonNote || null,
      actorUserId: actorUserId || null,
    });
    await this.priceHistoryRepo.save(historyLog);

    if (actorUserId) {
      await this.logVendorActivity(vendorId, actorUserId, 'PRICING_UPDATED', {
        productId: prod.id,
        newPriceMinor: dto.priceMinor,
      });
    }

    return this.getVendorProductById(vendorId, productId);
  }

  async getVendorPriceHistory(vendorId: string, productId: string): Promise<PriceHistoryDTO[]> {
    await this.getVendorProductById(vendorId, productId);

    const logs = await this.priceHistoryRepo.find({
      where: { productId, vendorId },
      order: { createdAt: 'DESC' },
    });

    return logs.map((l) => ({
      id: l.id,
      productId: l.productId,
      variantId: l.variantId,
      previousPriceMinor: Number(l.previousPriceMinor),
      newPriceMinor: Number(l.newPriceMinor),
      previousCompareAtPriceMinor: l.previousCompareAtPriceMinor ? Number(l.previousCompareAtPriceMinor) : null,
      newCompareAtPriceMinor: l.newCompareAtPriceMinor ? Number(l.newCompareAtPriceMinor) : null,
      promoStartDate: l.promoStartDate || null,
      promoEndDate: l.promoEndDate || null,
      reasonNote: l.reasonNote || null,
      actorUserId: l.actorUserId || null,
      createdAt: l.createdAt,
    }));
  }

  // --- CMD-076 Vendor Inventory Management ---

  async getVendorInventoryList(
    vendorId: string,
    query?: { search?: string; shopId?: string; isLowStock?: boolean },
  ): Promise<VendorInventoryDTO[]> {
    const inventoryItems = await this.inventoryRepo.find({ where: { vendorId } });
    const result: VendorInventoryDTO[] = [];

    for (const inv of inventoryItems) {
      if (query?.shopId && inv.shopId !== query.shopId) {
        continue;
      }

      const prod = inv.productId ? await this.productRepo.findOne({ where: { id: inv.productId } }) : null;
      const variant = inv.variantId ? await this.variantRepo.findOne({ where: { id: inv.variantId } }) : null;

      const productTitle = prod?.title || inv.variantName || 'Handcrafted Product';
      const sku = variant?.sku || prod?.slug || 'SKU-ITEM';

      if (query?.search && !productTitle.toLowerCase().includes(query.search.toLowerCase()) && !sku.toLowerCase().includes(query.search.toLowerCase())) {
        continue;
      }

      const availableQuantity = Math.max(0, inv.stockQuantity - (inv.reservedQuantity || 0));
      const isLowStock = availableQuantity <= (inv.lowStockThreshold || 5) && availableQuantity > 0;
      const isOutOfStock = availableQuantity === 0;

      if (query?.isLowStock && !isLowStock) {
        continue;
      }

      result.push({
        id: inv.id,
        listingId: inv.listingId || null,
        variantId: inv.variantId || null,
        productId: inv.productId || null,
        productTitle,
        sku,
        vendorId: inv.vendorId,
        shopId: inv.shopId || null,
        fulfillmentType: inv.shopId ? 'FLADO_DARKSTORE' : 'MARKETPLACE',
        stockQuantity: inv.stockQuantity,
        reservedQuantity: inv.reservedQuantity || 0,
        availableQuantity,
        lowStockThreshold: inv.lowStockThreshold || 5,
        isLowStock,
        isOutOfStock,
        updatedAt: inv.updatedAt || new Date(),
      });
    }

    return result;
  }

  async adjustVendorInventory(
    vendorId: string,
    inventoryId: string,
    dto: AdjustInventoryDTO,
    actorUserId?: string,
  ): Promise<VendorInventoryDTO> {
    const inv = await this.inventoryRepo.findOne({ where: { id: inventoryId } });
    if (!inv) {
      throw new NotFoundException(`Inventory item ${inventoryId} not found`);
    }

    if (inv.vendorId !== vendorId) {
      throw new ForbiddenException(`Access denied: Inventory ${inventoryId} does not belong to your vendor account`);
    }

    const previousQuantity = inv.stockQuantity;
    const newQuantity = previousQuantity + dto.deltaQuantity;

    if (newQuantity < 0) {
      throw new BadRequestException(`Stock adjustment would result in negative stock (${newQuantity}). Minimum stock is 0.`);
    }

    inv.stockQuantity = newQuantity;
    if (dto.lowStockThreshold !== undefined && dto.lowStockThreshold >= 0) {
      inv.lowStockThreshold = dto.lowStockThreshold;
    }

    await this.inventoryRepo.save(inv);

    const log = this.stockHistoryRepo.create({
      inventoryId: inv.id,
      vendorId: inv.vendorId,
      variantId: inv.variantId || undefined,
      shopId: inv.shopId || undefined,
      adjustmentType: dto.adjustmentType,
      previousQuantity,
      newQuantity,
      deltaQuantity: dto.deltaQuantity,
      reasonNote: dto.reasonNote || null,
      actorUserId: actorUserId || null,
    });
    await this.stockHistoryRepo.save(log);

    if (actorUserId) {
      await this.logVendorActivity(vendorId, actorUserId, 'INVENTORY_ADJUSTED', {
        inventoryId: inv.id,
        adjustmentType: dto.adjustmentType,
        deltaQuantity: dto.deltaQuantity,
      });
    }

    const list = await this.getVendorInventoryList(vendorId);
    const updatedDTO = list.find((i) => i.id === inventoryId);
    if (!updatedDTO) {
      throw new NotFoundException(`Updated inventory item DTO not found`);
    }

    return updatedDTO;
  }

  async getInventoryHistory(vendorId: string, inventoryId: string): Promise<StockHistoryDTO[]> {
    const inv = await this.inventoryRepo.findOne({ where: { id: inventoryId } });
    if (!inv) {
      throw new NotFoundException(`Inventory item ${inventoryId} not found`);
    }

    if (inv.vendorId !== vendorId) {
      throw new ForbiddenException(`Access denied: Inventory ${inventoryId} does not belong to your vendor account`);
    }

    const logs = await this.stockHistoryRepo.find({
      where: { inventoryId, vendorId },
      order: { createdAt: 'DESC' },
    });

    return logs.map((l) => ({
      id: l.id,
      inventoryId: l.inventoryId,
      adjustmentType: l.adjustmentType,
      previousQuantity: l.previousQuantity,
      newQuantity: l.newQuantity,
      deltaQuantity: l.deltaQuantity,
      reasonNote: l.reasonNote || null,
      actorUserId: l.actorUserId || null,
      createdAt: l.createdAt,
    }));
  }

  // --- CMD-075 Vendor Catalog Management ---

  async getVendorProducts(
    vendorId: string,
    query?: { search?: string; categoryId?: string; status?: string },
  ): Promise<VendorProductDTO[]> {
    const listings = await this.listingRepo.find({ where: { vendorId } });
    const variantIds = listings.map((l) => l.variantId);

    if (variantIds.length === 0) {
      return [];
    }

    const variants = await this.variantRepo.findByIds(variantIds);
    const productIds = Array.from(new Set(variants.map((v) => v.productId)));
    
    if (productIds.length === 0) {
      return [];
    }

    const products = await this.productRepo.findByIds(productIds);
    const categories = await this.categoryRepo.find();
    const catMap = new Map(categories.map((c) => [c.id, c.name]));

    const result: VendorProductDTO[] = [];

    for (const prod of products) {
      if (query?.search && !prod.title.toLowerCase().includes(query.search.toLowerCase())) {
        continue;
      }
      if (query?.categoryId && prod.categoryId !== query.categoryId) {
        continue;
      }

      const variant = variants.find((v) => v.productId === prod.id);
      const listing = listings.find((l) => l.variantId === variant?.id);
      const inv = await this.inventoryRepo.findOne({ where: { vendorId, productId: prod.id } });
      const images = await this.imageRepo.find({ where: { productId: prod.id } });

      const priceMinor = listing ? Number(listing.priceMinor) : (variant ? Math.round(Number(variant.referenceMsrp || 0) * 100) : 0);
      const compareAtPriceMinor = listing?.compareAtPriceMinor ? Number(listing.compareAtPriceMinor) : undefined;
      const status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' = prod.isActive
        ? (listing?.isAvailable ? 'ACTIVE' : 'INACTIVE')
        : 'DRAFT';

      if (query?.status && status !== query.status.toUpperCase()) {
        continue;
      }

      const fees = VendorsService.calculateSettlementAmounts(priceMinor);
      const discountPercentage = compareAtPriceMinor && compareAtPriceMinor > priceMinor
        ? Math.round(((compareAtPriceMinor - priceMinor) / compareAtPriceMinor) * 100)
        : 0;
      let warning: string | null = null;
      if (discountPercentage > 50) {
        warning = `Aggressive discount warning: Selling price is ${discountPercentage}% below MRP. Verify margins.`;
      }

      result.push({
        id: prod.id,
        title: prod.title,
        slug: prod.slug,
        description: prod.description || '',
        categoryId: prod.categoryId,
        categoryName: catMap.get(prod.categoryId) || 'General Category',
        brandId: prod.brandId || undefined,
        sku: variant?.sku || prod.slug,
        priceMinor,
        formattedPrice: this.formatINR(priceMinor),
        compareAtPriceMinor,
        formattedCompareAtPrice: compareAtPriceMinor ? this.formatINR(compareAtPriceMinor) : undefined,
        stockQuantity: inv ? inv.stockQuantity : 0,
        imageUrls: images.length > 0 ? images.map((img) => img.imageUrl) : ['https://images.unsplash.com/photo-1576092768241-dec231879fc3'],
        status,
        listOnFlado: !!listing?.shopId,
        marginAnalysis: {
          estimatedNetPayoutMinor: fees.netAmountMinor,
          formattedNetPayout: this.formatINR(fees.netAmountMinor),
          platformCommissionPercentage: 8.0,
          gstOnCommissionPercentage: 18.0,
          discountPercentage,
          warning,
        },
        createdAt: prod.createdAt,
      });
    }

    return result;
  }

  async getVendorProductById(vendorId: string, productId: string): Promise<VendorProductDTO> {
    const prod = await this.productRepo.findOne({ where: { id: productId } });
    if (!prod) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const variant = await this.variantRepo.findOne({ where: { productId: prod.id } });
    if (!variant) {
      throw new NotFoundException(`Product variant for ${productId} not found`);
    }

    const listing = await this.listingRepo.findOne({ where: { variantId: variant.id, vendorId } });
    if (!listing) {
      throw new ForbiddenException(`Access denied: Product ${productId} does not belong to your vendor account`);
    }

    const inv = await this.inventoryRepo.findOne({ where: { vendorId, productId: prod.id } });
    const images = await this.imageRepo.find({ where: { productId: prod.id } });
    const category = await this.categoryRepo.findOne({ where: { id: prod.categoryId } });

    const priceMinor = Number(listing.priceMinor || Math.round(Number(variant.referenceMsrp || 0) * 100));
    const compareAtPriceMinor = listing.compareAtPriceMinor ? Number(listing.compareAtPriceMinor) : undefined;
    const status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' = prod.isActive
      ? (listing.isAvailable ? 'ACTIVE' : 'INACTIVE')
      : 'DRAFT';

    const fees = VendorsService.calculateSettlementAmounts(priceMinor);
    const discountPercentage = compareAtPriceMinor && compareAtPriceMinor > priceMinor
      ? Math.round(((compareAtPriceMinor - priceMinor) / compareAtPriceMinor) * 100)
      : 0;
    let warning: string | null = null;
    if (discountPercentage > 50) {
      warning = `Aggressive discount warning: Selling price is ${discountPercentage}% below MRP. Verify margins.`;
    }

    return {
      id: prod.id,
      title: prod.title,
      slug: prod.slug,
      description: prod.description || '',
      categoryId: prod.categoryId,
      categoryName: category?.name || 'General Category',
      brandId: prod.brandId || undefined,
      sku: variant.sku,
      priceMinor,
      formattedPrice: this.formatINR(priceMinor),
      compareAtPriceMinor,
      formattedCompareAtPrice: compareAtPriceMinor ? this.formatINR(compareAtPriceMinor) : undefined,
      stockQuantity: inv ? inv.stockQuantity : 0,
      imageUrls: images.length > 0 ? images.map((img) => img.imageUrl) : ['https://images.unsplash.com/photo-1576092768241-dec231879fc3'],
      status,
      listOnFlado: !!listing.shopId,
      marginAnalysis: {
        estimatedNetPayoutMinor: fees.netAmountMinor,
        formattedNetPayout: this.formatINR(fees.netAmountMinor),
        platformCommissionPercentage: 8.0,
        gstOnCommissionPercentage: 18.0,
        discountPercentage,
        warning,
      },
      createdAt: prod.createdAt,
    };
  }

  async createVendorProduct(vendorId: string, dto: CreateVendorProductDTO): Promise<VendorProductDTO> {
    if (dto.categoryId) {
      const cat = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
      if (!cat) {
        throw new BadRequestException(`Category with ID ${dto.categoryId} does not exist`);
      }
    }

    const existingVariant = await this.variantRepo.findOne({ where: { sku: dto.sku } });
    if (existingVariant) {
      throw new ConflictException(`SKU "${dto.sku}" already exists in the catalog. SKUs must be unique.`);
    }

    const prodId = 'prod-' + Date.now();
    const slug = dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    let prod = this.productRepo.create({
      id: prodId,
      title: dto.title,
      slug,
      description: dto.description,
      categoryId: dto.categoryId,
      brandId: dto.brandId || undefined,
      isActive: dto.status !== 'DRAFT',
    });
    prod = await this.productRepo.save(prod);

    let variant = this.variantRepo.create({
      productId: prod.id,
      sku: dto.sku,
      title: dto.title + ' Default Variant',
      referenceMsrp: dto.priceMinor / 100,
    });
    variant = await this.variantRepo.save(variant);

    let listing = this.listingRepo.create({
      variantId: variant.id,
      vendorId,
      isAvailable: dto.status === 'ACTIVE',
      priceMinor: dto.priceMinor,
      compareAtPriceMinor: dto.compareAtPriceMinor || null,
      currency: 'INR',
    });
    listing = await this.listingRepo.save(listing);

    let inv = this.inventoryRepo.create({
      listingId: listing.id,
      variantId: variant.id,
      productId: prod.id,
      vendorId,
      variantName: variant.title,
      stockQuantity: dto.stockQuantity,
      reservedQuantity: 0,
      lowStockThreshold: 5,
    });
    inv = await this.inventoryRepo.save(inv);

    if (dto.imageUrls && dto.imageUrls.length > 0) {
      for (let i = 0; i < dto.imageUrls.length; i++) {
        const img = this.imageRepo.create({
          productId: prod.id,
          imageUrl: dto.imageUrls[i],
          displayOrder: i,
          isPrimary: i === 0,
        });
        await this.imageRepo.save(img);
      }
    }

    return this.getVendorProductById(vendorId, prod.id);
  }

  async updateVendorProduct(vendorId: string, productId: string, dto: UpdateVendorProductDTO): Promise<VendorProductDTO> {
    const existing = await this.getVendorProductById(vendorId, productId);
    const prod = await this.productRepo.findOne({ where: { id: productId } });
    const variant = await this.variantRepo.findOne({ where: { productId } });
    const listing = await this.listingRepo.findOne({ where: { variantId: variant?.id, vendorId } });
    const inv = await this.inventoryRepo.findOne({ where: { vendorId, productId } });

    if (!prod || !variant || !listing) {
      throw new NotFoundException(`Product ${productId} or associated listing not found`);
    }

    if (dto.sku && dto.sku !== variant.sku) {
      const existingSku = await this.variantRepo.findOne({ where: { sku: dto.sku } });
      if (existingSku) {
        throw new ConflictException(`SKU "${dto.sku}" already exists in the catalog.`);
      }
      variant.sku = dto.sku;
    }

    if (dto.title) prod.title = dto.title;
    if (dto.description !== undefined) prod.description = dto.description;
    if (dto.categoryId) prod.categoryId = dto.categoryId;
    if (dto.brandId) prod.brandId = dto.brandId;
    if (dto.status) {
      prod.isActive = dto.status !== 'DRAFT';
      listing.isAvailable = dto.status === 'ACTIVE';
    }

    if (dto.priceMinor !== undefined) {
      variant.referenceMsrp = dto.priceMinor / 100;
      listing.priceMinor = dto.priceMinor;
    }
    if (dto.compareAtPriceMinor !== undefined) {
      listing.compareAtPriceMinor = dto.compareAtPriceMinor || null;
    }

    if (dto.stockQuantity !== undefined && inv) {
      inv.stockQuantity = dto.stockQuantity;
      await this.inventoryRepo.save(inv);
    }

    await this.productRepo.save(prod);
    await this.variantRepo.save(variant);
    await this.listingRepo.save(listing);

    return this.getVendorProductById(vendorId, productId);
  }

  async addProductMedia(vendorId: string, productId: string, imageUrl: string): Promise<VendorProductDTO> {
    await this.getVendorProductById(vendorId, productId);
    const img = this.imageRepo.create({
      productId,
      imageUrl,
      displayOrder: 1,
      isPrimary: false,
    });
    await this.imageRepo.save(img);
    return this.getVendorProductById(vendorId, productId);
  }

  async deleteVendorProduct(vendorId: string, productId: string): Promise<{ success: boolean }> {
    await this.getVendorProductById(vendorId, productId);
    await this.productRepo.delete(productId);
    return { success: true };
  }

  // --- CMD-074 Vendor Onboarding ---

  async getOnboardingState(vendorId: string): Promise<VendorOnboardingStateDTO> {
    const vendor = await this.vendorRepo.findOne({ where: { id: vendorId } });
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }

    const docsList = vendor.documentsJson ? JSON.parse(vendor.documentsJson) : [];
    const sanitizedDocs = docsList.map((d: any) => ({
      documentType: d.documentType,
      fileName: d.fileName,
      uploadedAt: d.uploadedAt,
      accessUrl: `/api/v1/vendors/documents/view?key=${encodeURIComponent(d.storageKey)}`,
    }));

    return {
      vendorId: vendor.id,
      storeName: vendor.storeName,
      storeDescription: vendor.storeDescription || null,
      gstNumber: vendor.gstNumber || null,
      isVerified: vendor.isVerified,
      onboardingStatus: vendor.onboardingStatus || 'DRAFT',
      businessLegalName: vendor.businessLegalName || null,
      panNumber: vendor.panNumber || null,
      bankAccountName: vendor.bankAccountName || null,
      bankAccountNumberMasked: this.maskBankAccount(vendor.bankAccountNumber),
      bankIfsc: vendor.bankIfsc || null,
      agreementsAccepted: vendor.agreementsAccepted,
      agreementsAcceptedAt: vendor.agreementsAcceptedAt || null,
      rejectionReason: vendor.rejectionReason || null,
      submittedAt: vendor.submittedAt || null,
      reviewedAt: vendor.reviewedAt || null,
      documents: sanitizedDocs,
    };
  }

  async saveOnboardingDraft(vendorId: string, dto: SaveOnboardingDraftDTO): Promise<VendorOnboardingStateDTO> {
    const vendor = await this.vendorRepo.findOne({ where: { id: vendorId } });
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }

    if (vendor.onboardingStatus === 'SUBMITTED' || vendor.onboardingStatus === 'UNDER_REVIEW' || vendor.onboardingStatus === 'APPROVED') {
      throw new BadRequestException(`Cannot edit onboarding details while in status ${vendor.onboardingStatus}`);
    }

    if (dto.storeName) vendor.storeName = dto.storeName;
    if (dto.storeDescription !== undefined) vendor.storeDescription = dto.storeDescription;
    if (dto.gstNumber !== undefined) vendor.gstNumber = dto.gstNumber;
    if (dto.businessLegalName !== undefined) vendor.businessLegalName = dto.businessLegalName;
    if (dto.panNumber !== undefined) vendor.panNumber = dto.panNumber;
    if (dto.bankAccountName !== undefined) vendor.bankAccountName = dto.bankAccountName;
    if (dto.bankAccountNumber !== undefined) vendor.bankAccountNumber = dto.bankAccountNumber;
    if (dto.bankIfsc !== undefined) vendor.bankIfsc = dto.bankIfsc;

    if (dto.agreementsAccepted !== undefined) {
      vendor.agreementsAccepted = dto.agreementsAccepted;
      if (dto.agreementsAccepted) {
        vendor.agreementsAcceptedAt = new Date();
      }
    }

    await this.vendorRepo.save(vendor);
    return this.getOnboardingState(vendorId);
  }

  async submitOnboarding(vendorId: string): Promise<VendorOnboardingStateDTO> {
    const vendor = await this.vendorRepo.findOne({ where: { id: vendorId } });
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }

    if (vendor.onboardingStatus === 'SUBMITTED' || vendor.onboardingStatus === 'UNDER_REVIEW' || vendor.onboardingStatus === 'APPROVED') {
      throw new BadRequestException(`Onboarding already submitted/approved. Current status: ${vendor.onboardingStatus}`);
    }

    if (!vendor.businessLegalName || !vendor.gstNumber || !vendor.panNumber || !vendor.bankAccountNumber || !vendor.bankIfsc) {
      throw new BadRequestException('Please complete business, GST, PAN, and Bank details before submitting onboarding.');
    }

    if (!vendor.agreementsAccepted) {
      throw new BadRequestException('You must accept vendor terms and agreements before submitting onboarding.');
    }

    vendor.onboardingStatus = vendor.onboardingStatus === 'REJECTED' ? 'RESUBMITTED' : 'SUBMITTED';
    vendor.submittedAt = new Date();
    vendor.rejectionReason = null;

    await this.vendorRepo.save(vendor);
    return this.getOnboardingState(vendorId);
  }

  async reviewOnboarding(
    vendorId: string,
    action: 'APPROVE' | 'REJECT',
    rejectionReason?: string,
  ): Promise<VendorOnboardingStateDTO> {
    const vendor = await this.vendorRepo.findOne({ where: { id: vendorId } });
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }

    if (vendor.onboardingStatus !== 'SUBMITTED' && vendor.onboardingStatus !== 'RESUBMITTED' && vendor.onboardingStatus !== 'UNDER_REVIEW') {
      throw new BadRequestException(`Cannot review onboarding in current status: ${vendor.onboardingStatus}`);
    }

    if (action === 'APPROVE') {
      vendor.onboardingStatus = 'APPROVED';
      vendor.isVerified = true;
      vendor.reviewedAt = new Date();
      vendor.rejectionReason = null;
    } else {
      if (!rejectionReason) {
        throw new BadRequestException('Rejection reason is mandatory when rejecting vendor onboarding.');
      }
      vendor.onboardingStatus = 'REJECTED';
      vendor.isVerified = false;
      vendor.reviewedAt = new Date();
      vendor.rejectionReason = rejectionReason;

      // FIX-003: Automatically deactivate all vendor product listings & seller listings when rejected
      await this.productRepo.update(
        { vendorId: vendorId },
        { status: 'INACTIVE', isActive: false },
      );
      await this.productRepo.update(
        { legacyVendorId: vendorId },
        { status: 'INACTIVE', isActive: false },
      );
      await this.listingRepo.update(
        { vendorId: vendorId },
        { isAvailable: false },
      );
    }

    await this.vendorRepo.save(vendor);
    return this.getOnboardingState(vendorId);
  }

  async uploadDocumentMetadata(
    vendorId: string,
    docData: { documentType: string; storageKey: string; fileName: string; mimeType: string },
  ): Promise<VendorOnboardingStateDTO> {
    const vendor = await this.vendorRepo.findOne({ where: { id: vendorId } });
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }

    const docs = vendor.documentsJson ? JSON.parse(vendor.documentsJson) : [];
    docs.push({
      documentType: docData.documentType,
      storageKey: docData.storageKey,
      fileName: docData.fileName,
      mimeType: docData.mimeType,
      uploadedAt: new Date().toISOString(),
    });

    vendor.documentsJson = JSON.stringify(docs);
    await this.vendorRepo.save(vendor);

    return this.getOnboardingState(vendorId);
  }

  async getDashboardSummary(vendorId: string): Promise<VendorDashboardSummary> {
    const vendor = await this.vendorRepo.findOne({ where: { id: vendorId } });
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }

    const listings = await this.listingRepo.find({ where: { vendorId } });
    const activeListingsCount = listings.filter((l) => l.isAvailable).length;
    const fladoListingsCount = listings.filter((l) => !!l.shopId).length;
    const fladoActiveCount = listings.filter((l) => !!l.shopId && l.isAvailable).length;

    const inventoryItems = await this.inventoryRepo.find({ where: { vendorId } });
    const lowStockItems = inventoryItems.filter((inv) => inv.stockQuantity <= (inv.lowStockThreshold || 5));

    const allOrders = await this.orderRepo.find({ order: { createdAt: 'DESC' } });
    
    let grossRevenueMinor = 0;
    const actionOrders: any[] = [];
    let pendingShipmentsCount = 0;

    allOrders.forEach((ord) => {
      const ordMinor = Number(ord.totalAmountMinor || 0);
      grossRevenueMinor += ordMinor;

      if (ord.status === 'PLACED') {
        actionOrders.push({
          id: ord.id,
          customerName: ord.customerId || 'Customer',
          totalAmountMinor: ordMinor,
          formattedTotalAmount: this.formatINR(ordMinor),
          status: ord.status,
          createdAt: ord.createdAt,
          itemCount: 1,
        });
      }

      if (ord.status === 'PREPARING' || ord.status === 'SHIPPED') {
        pendingShipmentsCount++;
      }
    });

    const totalOrdersCount = allOrders.length;
    const avgOrderValueMinor = totalOrdersCount > 0 ? Math.round(grossRevenueMinor / totalOrdersCount) : 0;

    const fees = VendorsService.calculateSettlementAmounts(grossRevenueMinor);
    const unclearedBalanceMinor = Math.round(fees.netAmountMinor * 0.4);
    const settledBalanceMinor = Math.round(fees.netAmountMinor * 0.6);

    return {
      vendorId: vendor.id,
      storeName: vendor.storeName,
      isVerified: vendor.isVerified,
      performanceScore: vendor.performanceScore,
      salesSummary: {
        grossRevenueMinor,
        formattedGrossRevenue: this.formatINR(grossRevenueMinor),
        totalOrdersCount,
        avgOrderValueMinor,
        formattedAvgOrderValue: this.formatINR(avgOrderValueMinor),
        activeListingsCount,
      },
      ordersRequiringActionCount: actionOrders.length,
      ordersRequiringAction: actionOrders.slice(0, 10),
      lowStockAlertsCount: lowStockItems.length,
      lowStockAlerts: lowStockItems.map((inv) => ({
        id: inv.id,
        productId: inv.productId || inv.id,
        variantName: inv.variantName || 'Standard Variant',
        stockQuantity: inv.stockQuantity,
      })),
      pendingShipmentsCount,
      quickCommercePerformance: {
        fladoListingsCount,
        fladoActiveCount,
      },
      settlementSummary: {
        unclearedBalanceMinor,
        formattedUnclearedBalance: this.formatINR(unclearedBalanceMinor),
        settledBalanceMinor,
        formattedSettledBalance: this.formatINR(settledBalanceMinor),
        commissionRatePercentage: 8.0,
        gstOnCommissionPercentage: 18.0,
      },
    };
  }

  private maskBankAccount(accNum: string | null): string | null {
    if (!accNum) return null;
    if (accNum.length <= 4) return 'XXXX' + accNum;
    return 'X'.repeat(accNum.length - 4) + accNum.slice(-4);
  }

  private formatINR(minor: number): string {
    const rupees = minor / 100;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(rupees);
  }
}
