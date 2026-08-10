import { Injectable, NotFoundException, BadRequestException, ForbiddenException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import * as crypto from 'crypto';
import {
  Darkstore, Product, Order, OrderItem, Inventory,
  FladoShop, ShopSubscription, ShopCredit, CreditTransaction, Category, Rider, ShopHours,
  User, VendorStaff, VendorInvitation, VendorActivityLog, StockHistory, PriceHistory, OrderTrackingEvent,
} from '../database/entities';

export interface QuickMerchantDashboardDTO {
  shopId: string;
  shopName: string;
  approvalStatus: string;
  isOpen: boolean;
  isOperational: boolean;
  operatingHoursJson: string | null;
  deliveryRadiusKm: number;
  deliveryFeeType: string;
  deliveryFeeAmount: number;
  capacity: {
    maxCapacityOrdersPerHour: number;
    currentHourlyOrderCount: number;
    capacityUtilizationPercentage: number;
    capacityWarning: string | null;
  };
  queueSummary: {
    activeQueueCount: number;
    ordersRequiringActionCount: number;
    pendingShipmentCount: number;
  };
  inventorySummary: {
    totalSKUsCount: number;
    inStockCount: number;
    lowStockCount: number;
    outOfStockCount: number;
  };
  salesSummary: {
    todayOrdersCount: number;
    todayGrossRevenueMinor: number;
    formattedTodayGrossRevenue: string;
    avgDeliveryMinutes: number | null;
  };
  slaWarnings: Array<{
    code: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    message: string;
  }>;
}

export interface DarkstoreInventoryItemDTO {
  id: string;
  productId: string | null;
  productTitle: string;
  sku: string;
  stockQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  categoryId?: string | null;
  tags?: string[];
  isFeatured?: boolean;
  featuredPriority?: number;
  fulfillmentSource: string;
  updatedAt: Date;
}

export interface QuickOrderQueueItemDTO {
  orderId: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: Date;
  receivedTimeAgo: string;
  items: Array<{
    id: string;
    productId: string;
    sku: string;
    title: string;
    quantity: number;
    cancelledQuantity: number;
    unitPriceMinor: number;
    formattedUnitPrice: string;
    subtotalMinor: number;
    formattedSubtotal: string;
  }>;
  itemCount: number;
  vendorTotalMinor: number;
  formattedVendorTotal: string;
  slaWarning: {
    code: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    message: string;
  } | null;
  substitutionAttention: boolean;
  isCancelled: boolean;
  availableFulfillmentActions: Array<'ACCEPT' | 'PACK' | 'SHIP'>;
}

export interface QuickOrderBoardDTO {
  shopId: string;
  shopName: string;
  isOperational: boolean;
  totalActiveOrdersCount: number;
  columns: {
    newPlaced: QuickOrderQueueItemDTO[];
    preparingPacking: QuickOrderQueueItemDTO[];
    readyDispatch: QuickOrderQueueItemDTO[];
    completedHistory: QuickOrderQueueItemDTO[];
  };
  slaSummary: {
    freshCount: number;
    elevatedWarningCount: number;
    criticalBreachCount: number;
  };
}

export interface PickingSessionItemDTO {
  itemId: string;
  productId: string;
  title: string;
  sku: string;
  orderedQuantity: number;
  cancelledQuantity: number;
  pickedQuantity: number;
  pickingItemStatus: 'PENDING' | 'PICKED' | 'OUT_OF_STOCK' | 'SUBSTITUTED';
  substitutionPreference?: string;
}

export interface PickingSessionDTO {
  orderId: string;
  orderNumber: string;
  shopId: string;
  pickerUserId: string | null;
  pickerName: string | null;
  pickingStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'PARTIAL_OOS';
  startedAt: Date | null;
  completedAt: Date | null;
  totalItemCount: number;
  pickedItemCount: number;
  outOfStockCount: number;
  items: PickingSessionItemDTO[];
}

export interface RiderHandoffStatusDTO {
  orderId: string;
  orderNumber: string;
  shopId: string;
  orderStatus: string;
  pickingStatus: string;
  isHandoffReady: boolean;
  blockedReason: string | null;
  rider: {
    riderId: string | null;
    riderName: string | null;
    riderPhone: string | null;
    isAssigned: boolean;
  };
  otpChallenge: {
    hasActiveChallenge: boolean;
    expiresAt: Date | null;
    isExpired: boolean;
    isLocked: boolean;
    isUsed: boolean;
    attemptCount: number;
    maxAttempts: number;
  };
  handoffCompletedAt: Date | null;
  rawOtpForMerchantDisplay?: string;
}

export interface DailySalesSummaryDTO {
  date: string;
  orderCount: number;
  grossSalesMinor: number;
  formattedGrossSales: string;
  refundsMinor: number;
  formattedRefunds: string;
  netSalesMinor: number;
  formattedNetSales: string;
  totalUnitsSold: number;
}

export interface SlaPerformanceMetricsDTO {
  totalOrdersAnalyzed: number;
  avgAcceptanceMins: number | null;
  avgPickingMins: number | null;
  avgHandoffMins: number | null;
  avgTotalFulfillmentMins: number | null;
  slaBreachCount: number;
  slaBreachRatePercentage: number;
  fulfillmentSlaHealthPercentage: number;
}

export interface OosProductTrendDTO {
  productId: string;
  title: string;
  sku: string;
  oosCount: number;
  substitutionAcceptedCount: number;
  substitutionRejectedCount: number;
  shortageRefundCount: number;
}

export interface MultiStoreComparisonDTO {
  shopId: string;
  shopName: string;
  orderCount: number;
  grossSalesMinor: number;
  formattedGrossSales: string;
  slaBreachRatePercentage: number;
  oosEventCount: number;
}

export interface DarkstoreStaffDTO {
  id: string;
  userId: string;
  email: string;
  vendorRole: 'OWNER' | 'MANAGER' | 'FULFILLMENT_STAFF';
  status: 'ACTIVE' | 'INACTIVE';
  assignedShopIds: string[];
  isDarkstoreOwner: boolean;
}

export interface MerchantReportDTO {
  shopId: string;
  shopName: string;
  startDate: string;
  endDate: string;
  salesSummary: {
    totalOrders: number;
    totalUnitsSold: number;
    grossSalesMinor: number;
    formattedGrossSales: string;
    refundsMinor: number;
    formattedRefunds: string;
    netSalesMinor: number;
    formattedNetSales: string;
  };
  dailyBreakdown: DailySalesSummaryDTO[];
  slaMetrics: SlaPerformanceMetricsDTO;
  oosTrends: {
    totalOosEvents: number;
    topOosProducts: OosProductTrendDTO[];
    unresolvedShortageCount: number;
  };
  performance: {
    completedOrdersCount: number;
    cancelledOrdersCount: number;
    completionRatePercentage: number;
    cancellationRatePercentage: number;
  };
  multiStoreComparison: MultiStoreComparisonDTO[];
}

export function sanitizeCsvField(value: any): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function generateSecurePickupOtp(): string {
  const otpNumber = crypto.randomInt(100000, 1000000);
  return otpNumber.toString();
}

export function hashOtpSecret(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function calculateCodFee(orderAmount: number): number {
  const fee = orderAmount * 0.01;
  return Math.min(Math.round(fee), 10);
}

@Injectable()
export class FladoService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Darkstore)
    private readonly darkstoreRepository: Repository<Darkstore>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(FladoShop)
    private readonly shopRepository: Repository<FladoShop>,
    @InjectRepository(ShopSubscription)
    private readonly subscriptionRepository: Repository<ShopSubscription>,
    @InjectRepository(ShopCredit)
    private readonly creditRepository: Repository<ShopCredit>,
    @InjectRepository(CreditTransaction)
    private readonly creditTxRepository: Repository<CreditTransaction>,
    @InjectRepository(Rider)
    private readonly riderRepository: Repository<Rider>,
    @InjectRepository(ShopHours)
    private readonly hoursRepository: Repository<ShopHours>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(VendorStaff)
    private readonly staffRepository: Repository<VendorStaff>,
    @InjectRepository(VendorInvitation)
    private readonly invitationRepository: Repository<VendorInvitation>,
    @InjectRepository(VendorActivityLog)
    private readonly activityRepository: Repository<VendorActivityLog>,
    @InjectRepository(StockHistory)
    private readonly stockHistoryRepository: Repository<StockHistory>,
    @InjectRepository(PriceHistory)
    private readonly priceHistoryRepository: Repository<PriceHistory>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(OrderTrackingEvent)
    private readonly trackingRepository: Repository<OrderTrackingEvent>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedMockShops();
  }

  async seedMockShops() {
    try {
      const shopCount = await this.shopRepository.count();
      if (shopCount === 0) {
        const mockShop = this.shopRepository.create({
          id: 'shop-flado-001',
          shopName: 'AuraMart Heritage Darkstore 01',
          ownerName: 'AuraMart Admin',
          ownerPhone: '9876543210',
          address: 'Bandra West, Mumbai',
          lat: 19.0596,
          lng: 72.8295,
          approvalStatus: 'APPROVED',
          isOpen: true,
          deliveryRadiusKm: 3.0,
          deliveryFeeType: 'FREE',
          deliveryFeeAmount: 0,
        });
        await this.shopRepository.save(mockShop);
      }
    } catch (err) {
      // Ignored during test environment setup
    }
  }

  async getQuickHomeFeed(userId?: string, query?: any): Promise<any> {
    const shops = await this.shopRepository.find({ where: { approvalStatus: 'APPROVED', isOpen: true } });
    let activeShop: FladoShop | null = shops[0] || null;

    const featuredItems: any[] = [];
    if (activeShop) {
      const invItems = await this.inventoryRepository.find({ where: { shopId: activeShop.id, isFeatured: true } });
      for (const inv of invItems) {
        const availableQuantity = Math.max(0, inv.stockQuantity - (inv.reservedQuantity || 0));
        // Out-of-stock featured exclusion rule
        if (availableQuantity > 0) {
          const prod = inv.productId ? await this.productRepository.findOne({ where: { id: inv.productId } }) : null;
          if (prod) {
            featuredItems.push({
              id: prod.id,
              title: prod.title,
              sku: prod.slug || inv.variantId || inv.id,
              price: prod.basePrice || 0,
              formattedPrice: `₹${prod.basePrice || 0}`,
              availableQuantity,
              featuredPriority: inv.featuredPriority || 0,
            });
          }
        }
      }
      // Sort featured items by featuredPriority DESC
      featuredItems.sort((a, b) => b.featuredPriority - a.featuredPriority);
    }

    return {
      serviceability: {
        isServiceable: !!activeShop,
        shopId: activeShop?.id || null,
        shopName: activeShop?.shopName || 'AuraMart Quick',
        estimatedEtaMinutes: activeShop ? 12 : 0,
        deliveryFeeAmount: activeShop?.deliveryFeeAmount || 0,
        formattedDeliveryFee: activeShop?.deliveryFeeType === 'FREE' ? 'FREE' : `₹${activeShop?.deliveryFeeAmount || 0}`,
      },
      categories: [],
      trendingProducts: featuredItems,
      featuredItems,
      offers: [],
      topBrands: [],
      reorderItems: [],
    };
  }

  async registerShop(dto: Partial<FladoShop>): Promise<FladoShop> {
    const shop = this.shopRepository.create({
      shopName: dto.shopName || 'New Flado Darkstore',
      ownerName: dto.ownerName || 'Darkstore Owner',
      ownerPhone: dto.ownerPhone || '9999999999',
      ownerUserId: dto.ownerUserId,
      address: dto.address || 'Registered Darkstore Address',
      lat: dto.lat || 19.076,
      lng: dto.lng || 72.8777,
      approvalStatus: 'PENDING',
      isOpen: true,
      deliveryRadiusKm: dto.deliveryRadiusKm || 3.0,
      deliveryFeeType: 'PAID',
      deliveryFeeAmount: 25,
    });
    return this.shopRepository.save(shop);
  }

  async getNearbyShops(lat: number, lng: number, category?: string, city?: string): Promise<FladoShop[]> {
    const shops = await this.shopRepository.find({ where: { approvalStatus: 'APPROVED', isOpen: true } });
    if (!lat || !lng) return shops;
    return shops.filter((s) => {
      if (s.lat && s.lng) {
        const dist = calculateDistance(lat, lng, s.lat, s.lng);
        return dist <= (s.deliveryRadiusKm || 3.0);
      }
      return true;
    });
  }

  async getShopById(shopId: string): Promise<FladoShop> {
    return this.getShopEntity(shopId);
  }

  async getShopByPhone(phone: string): Promise<FladoShop | null> {
    return this.shopRepository.findOne({ where: { ownerPhone: phone } });
  }

  async getShopEntity(shopId: string): Promise<FladoShop> {
    const shop = await this.shopRepository.findOne({ where: { id: shopId } });
    if (!shop) throw new NotFoundException(`Shop ${shopId} not found`);
    return shop;
  }

  async updateShopProfile(shopId: string, dto: Partial<FladoShop>): Promise<FladoShop> {
    const shop = await this.getShopEntity(shopId);
    Object.assign(shop, dto);
    return this.shopRepository.save(shop);
  }

  async toggleShopOpen(shopId: string, isOpen: boolean): Promise<{ isOpen: boolean }> {
    const shop = await this.getShopEntity(shopId);
    shop.isOpen = isOpen;
    await this.shopRepository.save(shop);
    return { isOpen };
  }

  async updateDeliveryFee(shopId: string, deliveryFeeType: 'FREE' | 'PAID', deliveryFeeAmount: number): Promise<FladoShop> {
    const shop = await this.getShopEntity(shopId);
    shop.deliveryFeeType = deliveryFeeType;
    shop.deliveryFeeAmount = deliveryFeeType === 'PAID' ? deliveryFeeAmount : 0;
    return this.shopRepository.save(shop);
  }

  async updateDeliveryRadius(shopId: string, radiusKm: number): Promise<FladoShop> {
    if (radiusKm < 0.5 || radiusKm > 3.0) {
      throw new BadRequestException('Delivery radius must be between 0.5 km and 3 km.');
    }
    const shop = await this.getShopEntity(shopId);
    shop.deliveryRadiusKm = radiusKm;
    return this.shopRepository.save(shop);
  }

  async getPendingShops(): Promise<FladoShop[]> {
    return this.shopRepository.find({ where: { approvalStatus: 'PENDING' } });
  }

  async getAllShops(status?: string): Promise<FladoShop[]> {
    if (status) {
      return this.shopRepository.find({ where: { approvalStatus: status as any } });
    }
    return this.shopRepository.find();
  }

  async approveShop(shopId: string, adminId: string, monthlyFee: number, note?: string): Promise<FladoShop> {
    const shop = await this.getShopEntity(shopId);
    shop.approvalStatus = 'APPROVED';
    shop.approvedByAdminId = adminId;
    shop.approvalNote = note || '';
    shop.approvedAt = new Date();
    return this.shopRepository.save(shop);
  }

  async rejectShop(shopId: string, adminId: string, note: string): Promise<FladoShop> {
    const shop = await this.getShopEntity(shopId);
    shop.approvalStatus = 'REJECTED';
    shop.approvedByAdminId = adminId;
    shop.approvalNote = note;
    return this.shopRepository.save(shop);
  }

  async getShopProducts(shopId: string) {
    return this.inventoryRepository.find({ where: { shopId } });
  }

  async addShopProduct(shopId: string, dto: any) {
    const inv = this.inventoryRepository.create({
      shopId,
      productId: dto.productId,
      stockQuantity: dto.stockQuantity || 10,
      reservedQuantity: 0,
      lowStockThreshold: 5,
    });
    return this.inventoryRepository.save(inv);
  }

  async updateShopProduct(shopId: string, productId: string, dto: any) {
    const inv = await this.inventoryRepository.findOne({ where: { shopId, productId } });
    if (!inv) throw new NotFoundException('Inventory not found');
    if (dto.stockQuantity !== undefined) inv.stockQuantity = dto.stockQuantity;
    return this.inventoryRepository.save(inv);
  }

  async deleteShopProduct(shopId: string, productId: string) {
    await this.inventoryRepository.delete({ shopId, productId });
    return { success: true };
  }

  // ─── CMD-083 & CMD-084 Quick-Commerce Merchant Dashboard & Catalog ───────────

  async getMerchantShops(userId: string): Promise<FladoShop[]> {
    const ownedShops = await this.shopRepository.find({ where: { ownerUserId: userId } });
    if (ownedShops.length > 0) return ownedShops;

    const staffList = await this.staffRepository.find({ where: { userId, status: 'ACTIVE' } });
    if (staffList.length > 0) {
      const vendorIds = Array.from(new Set(staffList.map((s) => s.vendorId)));
      const staffShops = await this.shopRepository.find({ where: { vendorId: In(vendorIds) } });
      return staffShops;
    }

    return this.shopRepository.find();
  }

  async verifyShopOperatorPermission(
    shopId: string,
    userId: string,
    requiredMinRole?: 'FULFILLMENT_STAFF' | 'MANAGER' | 'OWNER',
  ): Promise<FladoShop> {
    const shop = await this.shopRepository.findOne({ where: { id: shopId } });
    if (!shop) {
      throw new NotFoundException(`Shop / Darkstore ${shopId} not found`);
    }

    if (shop.ownerUserId === userId) {
      return shop;
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user && (user.role === 'SUPER_ADMIN' || user.role === 'OPERATIONS')) {
      return shop;
    }

    if (shop.vendorId) {
      const staff = await this.staffRepository.findOne({ where: { vendorId: shop.vendorId, userId, status: 'ACTIVE' } });
      if (staff) {
        // Specific Darkstore Store Access Scoping Check
        let hasStoreAccess = false;
        if (staff.vendorRole === 'OWNER' || staff.vendorRole === 'MANAGER') {
          hasStoreAccess = true;
        } else if (staff.assignedShopIdsJson) {
          try {
            const assignedIds: string[] = JSON.parse(staff.assignedShopIdsJson);
            if (Array.isArray(assignedIds) && assignedIds.includes(shopId)) {
              hasStoreAccess = true;
            }
          } catch (e) {
            hasStoreAccess = false;
          }
        }

        if (!hasStoreAccess) {
          throw new ForbiddenException(`Access denied: Staff member ${userId} is not assigned to darkstore ${shopId}`);
        }

        // Role Permission Scoping Check
        if (requiredMinRole === 'OWNER' && staff.vendorRole !== 'OWNER') {
          throw new ForbiddenException(`Access denied: Operation requires OWNER role (current role: ${staff.vendorRole})`);
        }
        if (requiredMinRole === 'MANAGER' && staff.vendorRole === 'FULFILLMENT_STAFF') {
          throw new ForbiddenException(`Access denied: Operation requires MANAGER role or above (current role: ${staff.vendorRole})`);
        }

        return shop;
      }
    }

    throw new ForbiddenException(`Access denied: User ${userId} is not authorized for darkstore ${shopId}`);
  }

  async getQuickMerchantDashboard(shopId: string, userId: string): Promise<QuickMerchantDashboardDTO> {
    const shop = await this.verifyShopOperatorPermission(shopId, userId);

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentOrders = await this.orderRepository.find({ where: { shopId: shop.id } });
    const hourlyOrders = recentOrders.filter((o) => new Date(o.createdAt).getTime() >= oneHourAgo.getTime());
    
    const maxCapacityOrdersPerHour = 50;
    const currentHourlyOrderCount = hourlyOrders.length;
    const capacityUtilizationPercentage = Math.min(100, Math.round((currentHourlyOrderCount / maxCapacityOrdersPerHour) * 100));

    let capacityWarning: string | null = null;
    if (capacityUtilizationPercentage >= 80) {
      capacityWarning = `HIGH CAPACITY WARNING: Darkstore operating at ${capacityUtilizationPercentage}% hourly capacity utilization.`;
    }

    const activeOrders = recentOrders.filter((o) => o.status === 'PLACED' || o.status === 'PREPARING' || o.status === 'SHIPPED' || o.status === 'OUT_FOR_DELIVERY');
    const ordersRequiringActionCount = recentOrders.filter((o) => o.status === 'PLACED').length;
    const pendingShipmentCount = recentOrders.filter((o) => o.status === 'PREPARING' || o.status === 'SHIPPED').length;

    const inventoryItems = await this.inventoryRepository.find({ where: { shopId: shop.id } });
    const totalSKUsCount = inventoryItems.length;
    let inStockCount = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    for (const inv of inventoryItems) {
      const avail = Math.max(0, inv.stockQuantity - (inv.reservedQuantity || 0));
      if (avail === 0) {
        outOfStockCount++;
      } else if (avail <= (inv.lowStockThreshold || 5)) {
        lowStockCount++;
      } else {
        inStockCount++;
      }
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayOrders = recentOrders.filter((o) => new Date(o.createdAt).getTime() >= startOfToday.getTime());
    const todayGrossRevenueMinor = todayOrders.reduce((sum, o) => sum + Number(o.totalAmountMinor || Math.round(o.totalAmount * 100)), 0);

    // Non-fabricated avgDeliveryMinutes calculation (CMD-084 safety check)
    const completedOrders = recentOrders.filter(
      (o) => o.status === 'DELIVERED' && o.createdAt && o.updatedAt,
    );
    let avgDeliveryMinutes: number | null = null;
    if (completedOrders.length > 0) {
      let totalMins = 0;
      let validCount = 0;
      for (const ord of completedOrders) {
        const mins = Math.round(
          (new Date(ord.updatedAt).getTime() - new Date(ord.createdAt).getTime()) / (1000 * 60),
        );
        if (mins >= 0 && mins <= 180) {
          totalMins += mins;
          validCount++;
        }
      }
      if (validCount > 0) {
        avgDeliveryMinutes = Math.round(totalMins / validCount);
      }
    }

    const slaWarnings: Array<{ code: string; severity: 'INFO' | 'WARNING' | 'CRITICAL'; message: string }> = [];

    if (!shop.isOpen) {
      slaWarnings.push({
        code: 'STORE_CLOSED',
        severity: 'CRITICAL',
        message: 'STORE CLOSED: Darkstore operational state is set to OFF. Serviceability is currently inactive.',
      });
    }

    if (capacityWarning) {
      slaWarnings.push({
        code: 'HIGH_CAPACITY',
        severity: 'WARNING',
        message: capacityWarning,
      });
    }

    if (ordersRequiringActionCount > 0) {
      const oldestActionable = todayOrders.find((o) => o.status === 'PLACED');
      if (oldestActionable) {
        const elapsedMins = (Date.now() - new Date(oldestActionable.createdAt).getTime()) / (1000 * 60);
        if (elapsedMins > 15) {
          slaWarnings.push({
            code: 'URGENT_PACKING',
            severity: 'CRITICAL',
            message: `URGENT: ${ordersRequiringActionCount} order(s) awaiting packing confirmation (>15m SLA warning).`,
          });
        }
      }
    }

    return {
      shopId: shop.id,
      shopName: shop.shopName,
      approvalStatus: shop.approvalStatus,
      isOpen: shop.isOpen,
      isOperational: shop.isOpen && shop.approvalStatus === 'APPROVED',
      operatingHoursJson: shop.operatingHoursJson || null,
      deliveryRadiusKm: shop.deliveryRadiusKm,
      deliveryFeeType: shop.deliveryFeeType,
      deliveryFeeAmount: shop.deliveryFeeAmount,
      capacity: {
        maxCapacityOrdersPerHour,
        currentHourlyOrderCount,
        capacityUtilizationPercentage,
        capacityWarning,
      },
      queueSummary: {
        activeQueueCount: activeOrders.length,
        ordersRequiringActionCount,
        pendingShipmentCount,
      },
      inventorySummary: {
        totalSKUsCount,
        inStockCount,
        lowStockCount,
        outOfStockCount,
      },
      salesSummary: {
        todayOrdersCount: todayOrders.length,
        todayGrossRevenueMinor,
        formattedTodayGrossRevenue: this.formatINR(todayGrossRevenueMinor),
        avgDeliveryMinutes,
      },
      slaWarnings,
    };
  }

  async getDarkstoreInventory(
    shopId: string,
    userId: string,
    query?: { search?: string; isLowStock?: boolean },
  ): Promise<DarkstoreInventoryItemDTO[]> {
    await this.verifyShopOperatorPermission(shopId, userId);

    const inventoryItems = await this.inventoryRepository.find({ where: { shopId } });
    const result: DarkstoreInventoryItemDTO[] = [];

    for (const inv of inventoryItems) {
      const prod = inv.productId ? await this.productRepository.findOne({ where: { id: inv.productId } }) : null;
      const productTitle = prod?.title || inv.variantName || 'Quick Commerce SKU';
      const sku = prod?.slug || inv.variantId || inv.id;

      if (query?.search && !productTitle.toLowerCase().includes(query.search.toLowerCase()) && !sku.toLowerCase().includes(query.search.toLowerCase())) {
        continue;
      }

      const availableQuantity = Math.max(0, inv.stockQuantity - (inv.reservedQuantity || 0));
      const isLowStock = availableQuantity <= (inv.lowStockThreshold || 5) && availableQuantity > 0;
      const isOutOfStock = availableQuantity === 0;

      if (query?.isLowStock && !isLowStock) {
        continue;
      }

      let parsedTags: string[] = [];
      if (inv.tagsJson) {
        try { parsedTags = JSON.parse(inv.tagsJson); } catch (e) {}
      }

      result.push({
        id: inv.id,
        productId: inv.productId || null,
        productTitle,
        sku,
        stockQuantity: inv.stockQuantity,
        reservedQuantity: inv.reservedQuantity || 0,
        availableQuantity,
        lowStockThreshold: inv.lowStockThreshold || 5,
        isLowStock,
        isOutOfStock,
        categoryId: inv.categoryId || prod?.categoryId || null,
        tags: parsedTags,
        isFeatured: !!inv.isFeatured,
        featuredPriority: inv.featuredPriority || 0,
        fulfillmentSource: shopId,
        updatedAt: inv.updatedAt || new Date(),
      });
    }

    return result;
  }

  async getQuickOrderQueue(
    shopId: string,
    userId: string,
    query?: { status?: string },
  ): Promise<QuickOrderQueueItemDTO[]> {
    await this.verifyShopOperatorPermission(shopId, userId);

    const allOrders = await this.orderRepository.find({ where: { shopId }, order: { createdAt: 'DESC' } });
    const result: QuickOrderQueueItemDTO[] = [];

    for (const ord of allOrders) {
      if (query?.status && ord.status !== query.status.toUpperCase()) {
        continue;
      }

      const itemsForOrder = await this.orderItemRepository.find({ where: { orderId: ord.id } });
      const itemsDTO = itemsForOrder.map((i) => {
        const unitPriceMinor = Math.round((i.unitPrice || 0) * 100);
        const subtotalMinor = Math.round((i.subtotal || 0) * 100);
        return {
          id: i.id,
          productId: i.productId,
          sku: i.productId,
          title: i.productId,
          quantity: i.quantity,
          cancelledQuantity: i.cancelledQuantity || 0,
          unitPriceMinor,
          formattedUnitPrice: this.formatINR(unitPriceMinor),
          subtotalMinor,
          formattedSubtotal: this.formatINR(subtotalMinor),
        };
      });

      const vendorTotalMinor = itemsDTO.reduce((sum, item) => sum + item.subtotalMinor, 0);
      const elapsedMins = Math.round((Date.now() - new Date(ord.createdAt).getTime()) / (1000 * 60));

      let slaWarning: { code: string; severity: 'INFO' | 'WARNING' | 'CRITICAL'; message: string } | null = null;
      if (ord.status === 'PLACED' && elapsedMins > 15) {
        slaWarning = {
          code: 'URGENT_PACKING',
          severity: 'CRITICAL',
          message: `URGENT: Order awaiting packing confirmation (${elapsedMins}m elapsed).`,
        };
      }

      const availableActions: Array<'ACCEPT' | 'PACK' | 'SHIP'> = [];
      if (ord.status === 'PLACED') availableActions.push('ACCEPT', 'PACK');
      else if (ord.status === 'PREPARING') availableActions.push('PACK', 'SHIP');

      result.push({
        orderId: ord.id,
        orderNumber: ord.orderNumber || `QORD-${ord.id.substring(0, 8)}`,
        status: ord.status,
        paymentStatus: ord.paymentStatus,
        paymentMethod: ord.paymentMethod || 'ONLINE',
        createdAt: ord.createdAt,
        receivedTimeAgo: `${elapsedMins}m ago`,
        items: itemsDTO,
        itemCount: itemsDTO.length,
        vendorTotalMinor,
        formattedVendorTotal: this.formatINR(vendorTotalMinor),
        slaWarning,
        substitutionAttention: false,
        isCancelled: ord.status === 'CANCELLED',
        availableFulfillmentActions: availableActions,
      });
    }

    return result;
  }

  async updateStoreOperationalState(
    shopId: string,
    userId: string,
    dto: { isOpen: boolean; reason?: string },
  ): Promise<{ isOpen: boolean; shopId: string }> {
    const shop = await this.verifyShopOperatorPermission(shopId, userId);

    if (shop.vendorId) {
      const staff = await this.staffRepository.findOne({ where: { vendorId: shop.vendorId, userId, status: 'ACTIVE' } });
      if (staff && staff.vendorRole === 'FULFILLMENT_STAFF') {
        throw new ForbiddenException('Access denied: Changing darkstore operational open/closed state requires MANAGER or OWNER role.');
      }
    }

    shop.isOpen = dto.isOpen;
    await this.shopRepository.save(shop);

    if (shop.vendorId) {
      const log = this.activityRepository.create({
        vendorId: shop.vendorId,
        actorUserId: userId,
        action: 'DARKSTORE_OPERATIONAL_STATE_TOGGLED',
        metadataJson: JSON.stringify({ shopId: shop.id, isOpen: dto.isOpen, reason: dto.reason || null }),
      });
      await this.activityRepository.save(log);
    }

    return { shopId: shop.id, isOpen: shop.isOpen };
  }

  // ─── CMD-084 Darkstore Catalog & Inventory Management ──────────────────────

  async adjustDarkstoreInventory(
    shopId: string,
    inventoryId: string,
    dto: { stockQuantity?: number; lowStockThreshold?: number; reason?: string },
    userId: string,
  ): Promise<DarkstoreInventoryItemDTO> {
    const shop = await this.verifyShopOperatorPermission(shopId, userId);

    const inventory = await this.inventoryRepository.findOne({ where: { id: inventoryId } });
    if (!inventory) {
      throw new NotFoundException(`Inventory item ${inventoryId} not found`);
    }

    if (inventory.shopId && inventory.shopId !== shopId) {
      throw new ForbiddenException(`Access denied: Inventory item ${inventoryId} does not belong to darkstore ${shopId}`);
    }

    if (dto.stockQuantity !== undefined) {
      if (dto.stockQuantity < 0) {
        throw new BadRequestException('Stock quantity cannot be negative.');
      }

      const reserved = inventory.reservedQuantity || 0;
      if (dto.stockQuantity < reserved) {
        throw new BadRequestException(`Cannot reduce physical stock (${dto.stockQuantity}) below currently reserved stock (${reserved}).`);
      }

      const quantityChange = dto.stockQuantity - inventory.stockQuantity;

      const history = this.stockHistoryRepository.create({
        inventoryId: inventory.id,
        vendorId: shop.vendorId || shopId,
        shopId: shopId,
        adjustmentType: quantityChange >= 0 ? 'MANUAL_INCREASE' : 'MANUAL_DECREASE',
        previousQuantity: inventory.stockQuantity,
        newQuantity: dto.stockQuantity,
        deltaQuantity: quantityChange,
        reasonNote: dto.reason || 'MANUAL_ADJUSTMENT',
        actorUserId: userId,
      });
      await this.stockHistoryRepository.save(history);

      inventory.stockQuantity = dto.stockQuantity;
    }

    if (dto.lowStockThreshold !== undefined) {
      if (dto.lowStockThreshold < 0) {
        throw new BadRequestException('Low stock threshold cannot be negative.');
      }
      inventory.lowStockThreshold = dto.lowStockThreshold;
    }

    const saved = await this.inventoryRepository.save(inventory);

    const prod = saved.productId ? await this.productRepository.findOne({ where: { id: saved.productId } }) : null;
    const availableQuantity = Math.max(0, saved.stockQuantity - (saved.reservedQuantity || 0));

    return {
      id: saved.id,
      productId: saved.productId || null,
      productTitle: prod?.title || saved.variantName || 'Quick Commerce SKU',
      sku: prod?.slug || saved.variantId || saved.id,
      stockQuantity: saved.stockQuantity,
      reservedQuantity: saved.reservedQuantity || 0,
      availableQuantity,
      lowStockThreshold: saved.lowStockThreshold || 5,
      isLowStock: availableQuantity <= (saved.lowStockThreshold || 5) && availableQuantity > 0,
      isOutOfStock: availableQuantity === 0,
      fulfillmentSource: shopId,
      updatedAt: saved.updatedAt || new Date(),
    };
  }

  async updateDarkstoreProductPrice(
    shopId: string,
    inventoryId: string,
    dto: { priceMinor: number; reason?: string },
    userId: string,
  ): Promise<{ success: boolean; newPriceMinor: number; formattedPrice: string }> {
    const shop = await this.verifyShopOperatorPermission(shopId, userId);

    if (shop.vendorId) {
      const staff = await this.staffRepository.findOne({ where: { vendorId: shop.vendorId, userId, status: 'ACTIVE' } });
      if (staff && staff.vendorRole === 'FULFILLMENT_STAFF') {
        throw new ForbiddenException('Access denied: Updating product pricing requires MANAGER or OWNER role.');
      }
    }

    if (dto.priceMinor <= 0) {
      throw new BadRequestException('Product price must be greater than zero.');
    }

    const inventory = await this.inventoryRepository.findOne({ where: { id: inventoryId } });
    if (!inventory) {
      throw new NotFoundException(`Inventory item ${inventoryId} not found`);
    }

    if (inventory.shopId && inventory.shopId !== shopId) {
      throw new ForbiddenException(`Access denied: Inventory item ${inventoryId} does not belong to darkstore ${shopId}`);
    }

    if (!inventory.productId) {
      throw new BadRequestException('Inventory item has no linked product for price update.');
    }

    const product = await this.productRepository.findOne({ where: { id: inventory.productId } });
    if (!product) {
      throw new NotFoundException(`Product ${inventory.productId} not found`);
    }

    const previousPriceMinor = Math.round((product.basePrice || 0) * 100);
    const newPriceRupees = dto.priceMinor / 100;

    const priceHistory = this.priceHistoryRepository.create({
      productId: product.id,
      vendorId: shop.vendorId || shopId,
      previousPriceMinor,
      newPriceMinor: dto.priceMinor,
      reasonNote: dto.reason || 'MANUAL_DARKSTORE_PRICE_UPDATE',
      actorUserId: userId,
    });
    await this.priceHistoryRepository.save(priceHistory);

    product.basePrice = newPriceRupees;
    await this.productRepository.save(product);

    return {
      success: true,
      newPriceMinor: dto.priceMinor,
      formattedPrice: this.formatINR(dto.priceMinor),
    };
  }

  async toggleDarkstoreProductAvailability(
    shopId: string,
    inventoryId: string,
    isAvailable: boolean,
    userId: string,
  ): Promise<DarkstoreInventoryItemDTO> {
    await this.verifyShopOperatorPermission(shopId, userId);

    const inventory = await this.inventoryRepository.findOne({ where: { id: inventoryId } });
    if (!inventory) {
      throw new NotFoundException(`Inventory item ${inventoryId} not found`);
    }

    if (inventory.shopId && inventory.shopId !== shopId) {
      throw new ForbiddenException(`Access denied: Inventory item ${inventoryId} does not belong to darkstore ${shopId}`);
    }

    if (!isAvailable) {
      inventory.stockQuantity = 0;
    }

    const saved = await this.inventoryRepository.save(inventory);
    const prod = saved.productId ? await this.productRepository.findOne({ where: { id: saved.productId } }) : null;
    const availableQuantity = Math.max(0, saved.stockQuantity - (saved.reservedQuantity || 0));

    return {
      id: saved.id,
      productId: saved.productId || null,
      productTitle: prod?.title || saved.variantName || 'Quick Commerce SKU',
      sku: prod?.slug || saved.variantId || saved.id,
      stockQuantity: saved.stockQuantity,
      reservedQuantity: saved.reservedQuantity || 0,
      availableQuantity,
      lowStockThreshold: saved.lowStockThreshold || 5,
      isLowStock: availableQuantity <= (saved.lowStockThreshold || 5) && availableQuantity > 0,
      isOutOfStock: availableQuantity === 0,
      fulfillmentSource: shopId,
      updatedAt: saved.updatedAt || new Date(),
    };
  }

  async addDarkstoreProduct(
    shopId: string,
    dto: {
      productId: string;
      initialStock?: number;
      lowStockThreshold?: number;
      categoryId?: string;
      tags?: string[];
      isFeatured?: boolean;
      featuredPriority?: number;
    },
    userId: string,
  ): Promise<DarkstoreInventoryItemDTO> {
    const shop = await this.verifyShopOperatorPermission(shopId, userId);

    if (shop.vendorId) {
      const staff = await this.staffRepository.findOne({ where: { vendorId: shop.vendorId, userId, status: 'ACTIVE' } });
      if (staff && staff.vendorRole === 'FULFILLMENT_STAFF') {
        throw new ForbiddenException('Access denied: Adding products to darkstore catalog requires MANAGER or OWNER role.');
      }
    }

    const product = await this.productRepository.findOne({ where: { id: dto.productId } });
    if (!product) {
      throw new NotFoundException(`Product ${dto.productId} not found`);
    }

    if (dto.categoryId) {
      const category = await this.categoryRepository.findOne({ where: { id: dto.categoryId } });
      if (!category) {
        throw new BadRequestException(`Category ${dto.categoryId} does not exist.`);
      }
    }

    let parsedTags: string[] = [];
    if (dto.tags) {
      parsedTags = Array.from(
        new Set(
          dto.tags
            .map((t) => t.trim().toLowerCase())
            .filter((t) => t.length > 0 && t.length <= 30),
        ),
      ).slice(0, 10);
    }

    let inventory = await this.inventoryRepository.findOne({ where: { shopId, productId: dto.productId } });
    if (!inventory) {
      inventory = this.inventoryRepository.create({
        shopId,
        productId: dto.productId,
        vendorId: shop.vendorId || shopId,
        stockQuantity: dto.initialStock || 10,
        reservedQuantity: 0,
        lowStockThreshold: dto.lowStockThreshold || 5,
        categoryId: dto.categoryId || product.categoryId || undefined,
        tagsJson: JSON.stringify(parsedTags),
        isFeatured: !!dto.isFeatured,
        featuredPriority: dto.featuredPriority || 0,
      });
    } else {
      inventory.stockQuantity = dto.initialStock ?? inventory.stockQuantity;
      if (dto.categoryId !== undefined) inventory.categoryId = dto.categoryId;
      if (dto.tags !== undefined) inventory.tagsJson = JSON.stringify(parsedTags);
      if (dto.isFeatured !== undefined) inventory.isFeatured = dto.isFeatured;
      if (dto.featuredPriority !== undefined) inventory.featuredPriority = dto.featuredPriority;
    }

    const saved = await this.inventoryRepository.save(inventory);

    const history = this.stockHistoryRepository.create({
      inventoryId: saved.id,
      vendorId: shop.vendorId || shopId,
      shopId: shopId,
      adjustmentType: 'DARKSTORE_ALLOCATION',
      previousQuantity: 0,
      newQuantity: saved.stockQuantity,
      deltaQuantity: saved.stockQuantity,
      reasonNote: 'INITIAL_DARKSTORE_ASSIGNMENT',
      actorUserId: userId,
    });
    await this.stockHistoryRepository.save(history);

    const availableQuantity = Math.max(0, saved.stockQuantity - (saved.reservedQuantity || 0));

    return {
      id: saved.id,
      productId: saved.productId,
      productTitle: product.title,
      sku: product.slug || product.id,
      stockQuantity: saved.stockQuantity,
      reservedQuantity: saved.reservedQuantity || 0,
      availableQuantity,
      lowStockThreshold: saved.lowStockThreshold || 5,
      isLowStock: availableQuantity <= (saved.lowStockThreshold || 5) && availableQuantity > 0,
      isOutOfStock: availableQuantity === 0,
      categoryId: saved.categoryId || product.categoryId || null,
      tags: parsedTags,
      isFeatured: !!saved.isFeatured,
      featuredPriority: saved.featuredPriority || 0,
      fulfillmentSource: shopId,
      updatedAt: saved.updatedAt || new Date(),
    };
  }

  async deleteDarkstoreProduct(
    shopId: string,
    inventoryId: string,
    userId: string,
  ): Promise<{ success: boolean }> {
    const shop = await this.verifyShopOperatorPermission(shopId, userId, 'MANAGER');

    if (shop.vendorId) {
      const staff = await this.staffRepository.findOne({ where: { vendorId: shop.vendorId, userId, status: 'ACTIVE' } });
      if (staff && staff.vendorRole === 'FULFILLMENT_STAFF') {
        throw new ForbiddenException('Access denied: Removing products from darkstore catalog requires MANAGER or OWNER role.');
      }
    }

    const inventory = await this.inventoryRepository.findOne({ where: { id: inventoryId } });
    if (!inventory) {
      throw new NotFoundException(`Inventory item ${inventoryId} not found`);
    }

    if (inventory.shopId && inventory.shopId !== shopId) {
      throw new ForbiddenException(`Access denied: Inventory item ${inventoryId} does not belong to darkstore ${shopId}`);
    }

    await this.inventoryRepository.delete({ id: inventoryId });
    return { success: true };
  }

  // ─── CMD-085 Darkstore Store Configuration ──────────────────────────────────

  async updateDarkstoreConfiguration(
    shopId: string,
    dto: {
      shopName?: string;
      shopDescription?: string;
      shopBannerUrl?: string;
      shopLogoUrl?: string;
      address?: string;
      city?: string;
      state?: string;
      deliveryRadiusKm?: number;
      deliveryFeeType?: 'FREE' | 'PAID';
      deliveryFeeAmount?: number;
      minimumOrderAmount?: number;
      maxActiveOrders?: number;
      operatingHoursJson?: string;
      isOpen?: boolean;
      approvalStatus?: string;
    },
    userId: string,
  ): Promise<FladoShop> {
    const shop = await this.verifyShopOperatorPermission(shopId, userId);

    if (shop.vendorId) {
      const staff = await this.staffRepository.findOne({ where: { vendorId: shop.vendorId, userId, status: 'ACTIVE' } });
      if (staff && staff.vendorRole === 'FULFILLMENT_STAFF') {
        throw new ForbiddenException('Access denied: FULFILLMENT_STAFF role cannot modify darkstore configuration.');
      }
    }

    // Platform approval protection: Merchants cannot self-approve
    if (dto.approvalStatus !== undefined && dto.approvalStatus !== shop.approvalStatus) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'OPERATIONS')) {
        throw new ForbiddenException('Access denied: Platform approval status can only be modified by platform admins.');
      }
      shop.approvalStatus = dto.approvalStatus as any;
    }

    const previousConfig = {
      shopName: shop.shopName,
      deliveryRadiusKm: shop.deliveryRadiusKm,
      deliveryFeeType: shop.deliveryFeeType,
      deliveryFeeAmount: shop.deliveryFeeAmount,
      minimumOrderAmount: shop.minimumOrderAmount,
      maxActiveOrders: shop.maxActiveOrders,
      isOpen: shop.isOpen,
      operatingHoursJson: shop.operatingHoursJson,
    };

    // Store Profile Updates
    if (dto.shopName !== undefined) {
      if (!dto.shopName.trim()) {
        throw new BadRequestException('Shop name cannot be empty.');
      }
      shop.shopName = dto.shopName.trim();
    }
    if (dto.shopDescription !== undefined) shop.shopDescription = dto.shopDescription;
    if (dto.shopBannerUrl !== undefined) shop.shopBannerUrl = dto.shopBannerUrl;
    if (dto.shopLogoUrl !== undefined) shop.shopLogoUrl = dto.shopLogoUrl;
    if (dto.address !== undefined) shop.address = dto.address;
    if (dto.city !== undefined) shop.city = dto.city;
    if (dto.state !== undefined) shop.state = dto.state;

    // Delivery Configuration & Geofencing Boundaries
    if (dto.deliveryRadiusKm !== undefined) {
      if (dto.deliveryRadiusKm < 0.5 || dto.deliveryRadiusKm > 5.0) {
        throw new BadRequestException('Delivery radius must be between 0.5 km and 5.0 km.');
      }
      shop.deliveryRadiusKm = dto.deliveryRadiusKm;
    }

    // Minimum Basket Validation
    if (dto.minimumOrderAmount !== undefined) {
      if (dto.minimumOrderAmount < 0) {
        throw new BadRequestException('Minimum order amount cannot be negative.');
      }
      shop.minimumOrderAmount = dto.minimumOrderAmount;
    }

    // Capacity Configuration
    if (dto.maxActiveOrders !== undefined) {
      if (dto.maxActiveOrders < 1 || dto.maxActiveOrders > 200) {
        throw new BadRequestException('Maximum concurrent active order capacity must be between 1 and 200 orders.');
      }
      shop.maxActiveOrders = dto.maxActiveOrders;
    }

    // Fee Configuration Validation (CMD-057 integration)
    if (dto.deliveryFeeType !== undefined) {
      if (dto.deliveryFeeType !== 'FREE' && dto.deliveryFeeType !== 'PAID') {
        throw new BadRequestException('Delivery fee type must be FREE or PAID.');
      }
      shop.deliveryFeeType = dto.deliveryFeeType;
    }
    if (dto.deliveryFeeAmount !== undefined) {
      if (dto.deliveryFeeAmount < 0) {
        throw new BadRequestException('Delivery fee amount cannot be negative.');
      }
      shop.deliveryFeeAmount = shop.deliveryFeeType === 'PAID' ? dto.deliveryFeeAmount : 0;
    }

    // Operating Schedule & Open State Updates (CMD-052 integration)
    if (dto.operatingHoursJson !== undefined) {
      if (dto.operatingHoursJson) {
        try {
          const parsed = JSON.parse(dto.operatingHoursJson);
          for (const day of Object.keys(parsed)) {
            const sched = parsed[day];
            if (sched && !sched.closed && sched.open && sched.close) {
              const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
              if (!timeRegex.test(sched.open) || !timeRegex.test(sched.close)) {
                throw new Error(`Invalid time format for ${day}. Expected HH:MM 24h format.`);
              }
            }
          }
        } catch (err: any) {
          throw new BadRequestException(`Malformed operating hours schedule JSON: ${err.message}`);
        }
      }
      shop.operatingHoursJson = dto.operatingHoursJson;
    }

    if (dto.isOpen !== undefined) {
      shop.isOpen = dto.isOpen;
    }

    const savedShop = await this.shopRepository.save(shop);

    if (savedShop.vendorId) {
      const log = this.activityRepository.create({
        vendorId: savedShop.vendorId,
        actorUserId: userId,
        action: 'DARKSTORE_CONFIG_UPDATED',
        metadataJson: JSON.stringify({
          shopId: savedShop.id,
          previousConfig,
          newConfig: {
            shopName: savedShop.shopName,
            deliveryRadiusKm: savedShop.deliveryRadiusKm,
            deliveryFeeType: savedShop.deliveryFeeType,
            deliveryFeeAmount: savedShop.deliveryFeeAmount,
            minimumOrderAmount: savedShop.minimumOrderAmount,
            maxActiveOrders: savedShop.maxActiveOrders,
            isOpen: savedShop.isOpen,
            operatingHoursJson: savedShop.operatingHoursJson,
          },
        }),
      });
      await this.activityRepository.save(log);
    }

    return savedShop;
  }

  // ─── CMD-086 Darkstore Assortment, Category Mapping & Tagging ───────────────

  async updateDarkstoreAssortmentItem(
    shopId: string,
    inventoryId: string,
    dto: { categoryId?: string; tags?: string[]; isFeatured?: boolean; featuredPriority?: number },
    userId: string,
  ): Promise<DarkstoreInventoryItemDTO> {
    const shop = await this.verifyShopOperatorPermission(shopId, userId);

    if (shop.vendorId) {
      const staff = await this.staffRepository.findOne({ where: { vendorId: shop.vendorId, userId, status: 'ACTIVE' } });
      if (staff && staff.vendorRole === 'FULFILLMENT_STAFF') {
        throw new ForbiddenException('Access denied: FULFILLMENT_STAFF role cannot modify darkstore assortment or category mapping.');
      }
    }

    const inventory = await this.inventoryRepository.findOne({ where: { id: inventoryId } });
    if (!inventory) {
      throw new NotFoundException(`Inventory item ${inventoryId} not found`);
    }

    if (inventory.shopId && inventory.shopId !== shopId) {
      throw new ForbiddenException(`Access denied: Inventory item ${inventoryId} does not belong to darkstore ${shopId}`);
    }

    // Category Mapping & Validation
    if (dto.categoryId !== undefined) {
      if (dto.categoryId) {
        const category = await this.categoryRepository.findOne({ where: { id: dto.categoryId } });
        if (!category) {
          throw new BadRequestException(`Category ${dto.categoryId} does not exist.`);
        }
      }
      inventory.categoryId = dto.categoryId || undefined;
    }

    // Tag Normalization, Trimming, Deduplication & Limiting
    if (dto.tags !== undefined) {
      const normalizedTags = Array.from(
        new Set(
          dto.tags
            .map((t) => t.trim().toLowerCase())
            .filter((t) => t.length > 0 && t.length <= 30),
        ),
      ).slice(0, 10);
      inventory.tagsJson = JSON.stringify(normalizedTags);
    }

    // Featured Item Priority & Status
    if (dto.isFeatured !== undefined) {
      inventory.isFeatured = dto.isFeatured;
    }
    if (dto.featuredPriority !== undefined) {
      inventory.featuredPriority = dto.featuredPriority;
    }

    const saved = await this.inventoryRepository.save(inventory);

    if (shop.vendorId) {
      const log = this.activityRepository.create({
        vendorId: shop.vendorId,
        actorUserId: userId,
        action: 'DARKSTORE_ASSORTMENT_UPDATED',
        metadataJson: JSON.stringify({
          shopId,
          inventoryId: saved.id,
          categoryId: saved.categoryId || null,
          tagsJson: saved.tagsJson || '[]',
          isFeatured: saved.isFeatured,
          featuredPriority: saved.featuredPriority,
        }),
      });
      await this.activityRepository.save(log);
    }

    const prod = saved.productId ? await this.productRepository.findOne({ where: { id: saved.productId } }) : null;
    const availableQuantity = Math.max(0, saved.stockQuantity - (saved.reservedQuantity || 0));
    let parsedTags: string[] = [];
    if (saved.tagsJson) {
      try { parsedTags = JSON.parse(saved.tagsJson); } catch (e) {}
    }

    return {
      id: saved.id,
      productId: saved.productId || null,
      productTitle: prod?.title || saved.variantName || 'Quick Commerce SKU',
      sku: prod?.slug || saved.variantId || saved.id,
      stockQuantity: saved.stockQuantity,
      reservedQuantity: saved.reservedQuantity || 0,
      availableQuantity,
      lowStockThreshold: saved.lowStockThreshold || 5,
      isLowStock: availableQuantity <= (saved.lowStockThreshold || 5) && availableQuantity > 0,
      isOutOfStock: availableQuantity === 0,
      categoryId: saved.categoryId || prod?.categoryId || null,
      tags: parsedTags,
      isFeatured: !!saved.isFeatured,
      featuredPriority: saved.featuredPriority || 0,
      fulfillmentSource: shopId,
      updatedAt: saved.updatedAt || new Date(),
    };
  }

  // ─── CMD-087 Darkstore Live Order Board ─────────────────────────────────────

  async getQuickOrderBoard(
    shopId: string,
    userId: string,
  ): Promise<QuickOrderBoardDTO> {
    const shop = await this.verifyShopOperatorPermission(shopId, userId);

    const allQueueItems = await this.getQuickOrderQueue(shopId, userId);

    const columns = {
      newPlaced: [] as QuickOrderQueueItemDTO[],
      preparingPacking: [] as QuickOrderQueueItemDTO[],
      readyDispatch: [] as QuickOrderQueueItemDTO[],
      completedHistory: [] as QuickOrderQueueItemDTO[],
    };

    let freshCount = 0;
    let elevatedWarningCount = 0;
    let criticalBreachCount = 0;

    for (const item of allQueueItems) {
      const elapsedMins = parseInt(item.receivedTimeAgo) || 0;
      if (elapsedMins < 5) freshCount++;
      else if (elapsedMins <= 10) elevatedWarningCount++;
      else criticalBreachCount++;

      if (item.status === 'PLACED') {
        columns.newPlaced.push(item);
      } else if (item.status === 'PREPARING') {
        columns.preparingPacking.push(item);
      } else if (item.status === 'SHIPPED' || item.status === 'OUT_FOR_DELIVERY') {
        columns.readyDispatch.push(item);
      } else {
        columns.completedHistory.push(item);
      }
    }

    const totalActiveOrdersCount =
      columns.newPlaced.length + columns.preparingPacking.length + columns.readyDispatch.length;

    return {
      shopId,
      shopName: shop.shopName,
      isOperational: shop.isOpen && shop.approvalStatus === 'APPROVED',
      totalActiveOrdersCount,
      columns,
      slaSummary: {
        freshCount,
        elevatedWarningCount,
        criticalBreachCount,
      },
    };
  }

  async transitionQuickOrderStatus(
    shopId: string,
    orderId: string,
    action: 'ACCEPT' | 'PACK' | 'SHIP' | 'DELIVER',
    userId: string,
  ): Promise<QuickOrderQueueItemDTO> {
    const shop = await this.verifyShopOperatorPermission(shopId, userId);

    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    if (order.shopId && order.shopId !== shopId) {
      throw new ForbiddenException(`Access denied: Order ${orderId} does not belong to darkstore ${shopId}`);
    }

    if (order.status === 'DELIVERED' || order.status === 'CANCELLED' || order.status === 'RETURNED') {
      throw new BadRequestException(`Cannot perform fulfillment action on order in terminal status: ${order.status}`);
    }

    let targetStatus: 'PLACED' | 'PREPARING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' = order.status;
    let trackingTitle = '';
    let trackingDesc = '';

    if (action === 'ACCEPT') {
      if (order.status !== 'PLACED') {
        throw new BadRequestException(`Order cannot be accepted from current status ${order.status}`);
      }
      targetStatus = 'PREPARING';
      trackingTitle = 'Order Accepted';
      trackingDesc = 'Darkstore merchant accepted order and initiated picking.';
    } else if (action === 'PACK') {
      if (order.status !== 'PLACED' && order.status !== 'PREPARING') {
        throw new BadRequestException(`Order cannot be packed from current status ${order.status}`);
      }
      targetStatus = 'PREPARING';
      trackingTitle = 'Items Packed';
      trackingDesc = 'Order line items packed and verified for dispatch.';
    } else if (action === 'SHIP') {
      if (order.status !== 'PREPARING') {
        throw new BadRequestException(`Order cannot be shipped directly from status ${order.status}. Order picking and packing must be completed in PREPARING status first.`);
      }
      if (order.pickingStatus && order.pickingStatus !== 'COMPLETED') {
        throw new BadRequestException(`Cannot ship order ${orderId}: Picking session status is ${order.pickingStatus}. Picking must be COMPLETED before dispatch.`);
      }
      targetStatus = 'SHIPPED';
      trackingTitle = 'Order Dispatched';
      trackingDesc = 'Order handed over for rider express delivery.';
    } else if (action === 'DELIVER') {
      if (order.status !== 'SHIPPED' && order.status !== 'OUT_FOR_DELIVERY') {
        throw new BadRequestException(`Order cannot be delivered from current status ${order.status}`);
      }
      targetStatus = 'DELIVERED';
      trackingTitle = 'Order Delivered';
      trackingDesc = 'Order successfully delivered to customer.';
    } else {
      throw new BadRequestException(`Invalid fulfillment action ${action}`);
    }

    order.status = targetStatus;
    const savedOrder = await this.orderRepository.save(order);

    const trackingEvent = this.trackingRepository.create({
      orderId: savedOrder.id,
      eventType: targetStatus,
      statusText: trackingTitle,
      description: trackingDesc,
      fulfillmentSourceId: shopId,
      occurredAt: new Date(),
    });
    await this.trackingRepository.save(trackingEvent);

    if (shop.vendorId) {
      const log = this.activityRepository.create({
        vendorId: shop.vendorId,
        actorUserId: userId,
        action: 'QUICK_ORDER_STATUS_TRANSITIONED',
        metadataJson: JSON.stringify({
          shopId,
          orderId: savedOrder.id,
          action,
          previousStatus: order.status,
          newStatus: targetStatus,
        }),
      });
      await this.activityRepository.save(log);
    }

    const queueItems = await this.getQuickOrderQueue(shopId, userId);
    const updatedDTO = queueItems.find((i) => i.orderId === orderId);
    if (updatedDTO) return updatedDTO;

    const elapsedMins = Math.round((Date.now() - new Date(savedOrder.createdAt).getTime()) / (1000 * 60));
    return {
      orderId: savedOrder.id,
      orderNumber: savedOrder.orderNumber || `QORD-${savedOrder.id.substring(0, 8)}`,
      status: savedOrder.status,
      paymentStatus: savedOrder.paymentStatus,
      paymentMethod: savedOrder.paymentMethod || 'ONLINE',
      createdAt: savedOrder.createdAt,
      receivedTimeAgo: `${elapsedMins}m ago`,
      items: [],
      itemCount: 0,
      vendorTotalMinor: Math.round((savedOrder.totalAmount || 0) * 100),
      formattedVendorTotal: this.formatINR(Math.round((savedOrder.totalAmount || 0) * 100)),
      slaWarning: null,
      substitutionAttention: false,
      isCancelled: savedOrder.status === 'CANCELLED',
      availableFulfillmentActions: [],
    };
  }

  // ─── CMD-088 Quick-Commerce Picking Session Workflow ────────────────────────

  async getPickingSession(
    shopId: string,
    orderId: string,
    userId: string,
  ): Promise<PickingSessionDTO> {
    const shop = await this.verifyShopOperatorPermission(shopId, userId);

    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    if (order.shopId && order.shopId !== shopId) {
      throw new ForbiddenException(`Access denied: Order ${orderId} does not belong to darkstore ${shopId}`);
    }

    const items = await this.orderItemRepository.find({ where: { orderId } });
    let pickedItemCount = 0;
    let outOfStockCount = 0;

    const itemsDTO: PickingSessionItemDTO[] = items.map((i) => {
      const pQty = i.pickedQuantity || 0;
      const status = (i.pickingItemStatus as any) || (pQty >= i.quantity ? 'PICKED' : 'PENDING');
      if (status === 'PICKED' || status === 'SUBSTITUTED') pickedItemCount++;
      if (status === 'OUT_OF_STOCK') outOfStockCount++;

      return {
        itemId: i.id,
        productId: i.productId,
        title: i.productId,
        sku: i.productId,
        orderedQuantity: i.quantity,
        cancelledQuantity: i.cancelledQuantity || 0,
        pickedQuantity: pQty,
        pickingItemStatus: status,
        substitutionPreference: i.substitutionPreference || 'ALLOW_SUBSTITUTION',
      };
    });

    return {
      orderId: order.id,
      orderNumber: order.orderNumber || `QORD-${order.id.substring(0, 8)}`,
      shopId,
      pickerUserId: order.pickerUserId || null,
      pickerName: order.pickerName || null,
      pickingStatus: order.pickingStatus || 'NOT_STARTED',
      startedAt: order.pickingStartedAt || null,
      completedAt: order.pickingCompletedAt || null,
      totalItemCount: itemsDTO.length,
      pickedItemCount,
      outOfStockCount,
      items: itemsDTO,
    };
  }

  async assignPicker(
    shopId: string,
    orderId: string,
    pickerUserId: string,
    userId: string,
  ): Promise<PickingSessionDTO> {
    const shop = await this.verifyShopOperatorPermission(shopId, userId);

    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    if (order.shopId && order.shopId !== shopId) {
      throw new ForbiddenException(`Access denied: Order ${orderId} does not belong to darkstore ${shopId}`);
    }

    let pickerName = 'Assigned Staff';
    if (shop.vendorId) {
      const staff = await this.staffRepository.findOne({ where: { vendorId: shop.vendorId, userId: pickerUserId, status: 'ACTIVE' } });
      if (staff) {
        pickerName = staff.email;
      } else if (pickerUserId !== userId) {
        throw new ForbiddenException(`Access denied: User ${pickerUserId} is not active staff of this merchant darkstore`);
      }
    }

    order.pickerUserId = pickerUserId;
    order.pickerName = pickerName;
    if (!order.pickingStatus || order.pickingStatus === 'NOT_STARTED') {
      order.pickingStatus = 'IN_PROGRESS';
      order.pickingStartedAt = new Date();
      order.status = 'PREPARING';
    }

    await this.orderRepository.save(order);

    const trackingEvent = this.trackingRepository.create({
      orderId: order.id,
      eventType: 'PICKER_ASSIGNED',
      statusText: 'Packer Assigned',
      description: `Order assigned to packer ${pickerName}`,
      fulfillmentSourceId: shopId,
      occurredAt: new Date(),
    });
    await this.trackingRepository.save(trackingEvent);

    if (shop.vendorId) {
      const log = this.activityRepository.create({
        vendorId: shop.vendorId,
        actorUserId: userId,
        action: 'PICKER_ASSIGNED',
        metadataJson: JSON.stringify({
          shopId,
          orderId: order.id,
          pickerUserId,
          pickerName,
        }),
      });
      await this.activityRepository.save(log);
    }

    return this.getPickingSession(shopId, orderId, userId);
  }

  async updatePickingItem(
    shopId: string,
    orderId: string,
    itemId: string,
    dto: { pickedQuantity?: number; pickingItemStatus?: 'PENDING' | 'PICKED' | 'OUT_OF_STOCK' | 'SUBSTITUTED' },
    userId: string,
  ): Promise<PickingSessionDTO> {
    const shop = await this.verifyShopOperatorPermission(shopId, userId);

    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    if (order.shopId && order.shopId !== shopId) {
      throw new ForbiddenException(`Access denied: Order ${orderId} does not belong to darkstore ${shopId}`);
    }

    const item = await this.orderItemRepository.findOne({ where: { id: itemId, orderId } });
    if (!item) {
      throw new NotFoundException(`Order item ${itemId} not found in order ${orderId}`);
    }

    // Overpick Prevention
    if (dto.pickedQuantity !== undefined) {
      if (dto.pickedQuantity < 0) {
        throw new BadRequestException('Picked quantity cannot be negative.');
      }
      if (dto.pickedQuantity > item.quantity) {
        throw new BadRequestException(`Picked quantity (${dto.pickedQuantity}) cannot exceed ordered quantity (${item.quantity}).`);
      }
      item.pickedQuantity = dto.pickedQuantity;
      if (item.pickedQuantity === item.quantity) {
        item.pickingItemStatus = 'PICKED';
      } else {
        item.pickingItemStatus = 'PENDING';
      }
    }

    if (dto.pickingItemStatus === 'OUT_OF_STOCK') {
      item.pickingItemStatus = 'OUT_OF_STOCK';
      item.pickedQuantity = 0;

      const trackingEvent = this.trackingRepository.create({
        orderId: order.id,
        eventType: 'ITEM_OUT_OF_STOCK',
        statusText: 'Item Out of Stock',
        description: `Line item ${item.title || item.productId} marked out of stock by picker`,
        fulfillmentSourceId: shopId,
        occurredAt: new Date(),
      });
      await this.trackingRepository.save(trackingEvent);
    } else if (dto.pickingItemStatus) {
      item.pickingItemStatus = dto.pickingItemStatus;
    }

    await this.orderItemRepository.save(item);

    if (order.pickingStatus === 'NOT_STARTED') {
      order.pickingStatus = 'IN_PROGRESS';
      order.pickingStartedAt = new Date();
      order.status = 'PREPARING';
      await this.orderRepository.save(order);
    }

    return this.getPickingSession(shopId, orderId, userId);
  }

  async completePickingSession(
    shopId: string,
    orderId: string,
    userId: string,
  ): Promise<PickingSessionDTO> {
    const shop = await this.verifyShopOperatorPermission(shopId, userId);

    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    if (order.shopId && order.shopId !== shopId) {
      throw new ForbiddenException(`Access denied: Order ${orderId} does not belong to darkstore ${shopId}`);
    }

    const items = await this.orderItemRepository.find({ where: { orderId } });

    // Completion Guard Check
    const unhandledItems = items.filter((i) => {
      const status = i.pickingItemStatus || 'PENDING';
      const pickedQty = i.pickedQuantity || 0;
      return status === 'PENDING' && pickedQty < i.quantity;
    });

    if (unhandledItems.length > 0) {
      throw new BadRequestException(`Cannot complete picking session: ${unhandledItems.length} item(s) remain unhandled. All items must be picked, substituted, or marked out of stock.`);
    }

    const hasOosItems = items.some((i) => i.pickingItemStatus === 'OUT_OF_STOCK');
    order.pickingStatus = hasOosItems ? 'PARTIAL_OOS' : 'COMPLETED';
    order.pickingCompletedAt = new Date();
    order.status = 'PREPARING'; // Packed & ready for express dispatch!

    await this.orderRepository.save(order);

    const trackingEvent = this.trackingRepository.create({
      orderId: order.id,
      eventType: 'PICKING_COMPLETED',
      statusText: 'Order Picking Completed',
      description: `Order items verified and packed. Ready for rider dispatch.`,
      fulfillmentSourceId: shopId,
      occurredAt: new Date(),
    });
    await this.trackingRepository.save(trackingEvent);

    if (shop.vendorId) {
      const log = this.activityRepository.create({
        vendorId: shop.vendorId,
        actorUserId: userId,
        action: 'PICKING_COMPLETED',
        metadataJson: JSON.stringify({
          shopId,
          orderId: order.id,
          pickingStatus: order.pickingStatus,
          itemCount: items.length,
        }),
      });
      await this.activityRepository.save(log);
    }

    return this.getPickingSession(shopId, orderId, userId);
  }

  // ─── CMD-089 Quick-Commerce Rider Handoff & Dispatch Verification ────────────

  async getRiderHandoffStatus(
    shopId: string,
    orderId: string,
    userId: string,
  ): Promise<RiderHandoffStatusDTO> {
    const shop = await this.verifyShopOperatorPermission(shopId, userId);

    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    if (order.shopId && order.shopId !== shopId) {
      throw new ForbiddenException(`Access denied: Order ${orderId} does not belong to darkstore ${shopId}`);
    }

    const items = await this.orderItemRepository.find({ where: { orderId } });

    // Handoff Readiness Evaluation & Audit 1 Semantics
    let isHandoffReady = true;
    let blockedReason: string | null = null;

    if (!order.pickingStatus || (order.pickingStatus !== 'COMPLETED' && order.pickingStatus !== 'PARTIAL_OOS')) {
      isHandoffReady = false;
      blockedReason = 'Order picking and packing has not been completed.';
    } else {
      const unhandledPending = items.some((i) => (i.pickingItemStatus || 'PENDING') === 'PENDING' && (i.pickedQuantity || 0) < i.quantity);
      if (unhandledPending) {
        isHandoffReady = false;
        blockedReason = 'Order items checklist has unhandled pending items.';
      } else {
        const unresolvedOos = items.some((i) => i.pickingItemStatus === 'OUT_OF_STOCK');
        if (unresolvedOos) {
          isHandoffReady = false;
          blockedReason = 'Order has unresolved out-of-stock items requiring customer substitution or shortage refund.';
        }
      }
    }

    const attempts = order.pickupOtpAttemptCount || 0;
    const isLocked = !!order.pickupOtpLocked || attempts >= 5;
    const isExpired = order.pickupOtpExpiresAt ? new Date() > new Date(order.pickupOtpExpiresAt) : false;
    const isUsed = order.pickupOtpUsedAt !== null && order.pickupOtpUsedAt !== undefined;

    return {
      orderId: order.id,
      orderNumber: order.orderNumber || `QORD-${order.id.substring(0, 8)}`,
      shopId,
      orderStatus: order.status,
      pickingStatus: order.pickingStatus || 'NOT_STARTED',
      isHandoffReady,
      blockedReason,
      rider: {
        riderId: order.riderId || null,
        riderName: order.riderName || null,
        riderPhone: order.riderPhone || null,
        isAssigned: !!order.riderId,
      },
      otpChallenge: {
        hasActiveChallenge: !!order.pickupOtpHash,
        expiresAt: order.pickupOtpExpiresAt || null,
        isExpired,
        isLocked,
        isUsed,
        attemptCount: attempts,
        maxAttempts: 5,
      },
      handoffCompletedAt: order.handoffCompletedAt || null,
    };
  }

  async assignRiderToOrder(
    shopId: string,
    orderId: string,
    riderId: string,
    userId: string,
  ): Promise<RiderHandoffStatusDTO> {
    const shop = await this.verifyShopOperatorPermission(shopId, userId);

    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    if (order.shopId && order.shopId !== shopId) {
      throw new ForbiddenException(`Access denied: Order ${orderId} does not belong to darkstore ${shopId}`);
    }

    const rider = await this.riderRepository.findOne({ where: { id: riderId } });
    if (!rider || rider.isAvailable === false) {
      throw new BadRequestException(`Rider ${riderId} is invalid, unavailable, or not authorized for this darkstore.`);
    }

    order.riderId = rider.id;
    order.riderName = rider.name;
    order.riderPhone = rider.phone;
    await this.orderRepository.save(order);

    const trackingEvent = this.trackingRepository.create({
      orderId: order.id,
      eventType: 'RIDER_ASSIGNED',
      statusText: 'Rider Assigned to Order',
      description: `Express rider ${rider.name} (${rider.phone}) assigned for pickup.`,
      fulfillmentSourceId: shopId,
      riderId: rider.id,
      occurredAt: new Date(),
    });
    await this.trackingRepository.save(trackingEvent);

    if (shop.vendorId) {
      const log = this.activityRepository.create({
        vendorId: shop.vendorId,
        actorUserId: userId,
        action: 'RIDER_ASSIGNED',
        metadataJson: JSON.stringify({
          shopId,
          orderId: order.id,
          riderId: rider.id,
          riderName: rider.name,
        }),
      });
      await this.activityRepository.save(log);
    }

    return this.getRiderHandoffStatus(shopId, orderId, userId);
  }

  async generatePickupChallenge(
    shopId: string,
    orderId: string,
    userId: string,
  ): Promise<RiderHandoffStatusDTO> {
    const statusDTO = await this.getRiderHandoffStatus(shopId, orderId, userId);
    if (!statusDTO.isHandoffReady) {
      throw new BadRequestException(`Cannot generate pickup OTP: ${statusDTO.blockedReason}`);
    }

    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    // Audit 3: Lockout Regeneration Safeguard
    if (order.pickupOtpLocked) {
      if (order.pickupOtpExpiresAt && (new Date().getTime() - new Date(order.pickupOtpExpiresAt).getTime() < 5 * 60 * 1000)) {
        throw new BadRequestException('Pickup OTP challenge is locked due to excessive failed attempts. Please wait 5 minutes before generating a new challenge.');
      }
    }

    const rawOtp = generateSecurePickupOtp();
    const hashedSecret = hashOtpSecret(rawOtp);

    order.pickupOtpHash = hashedSecret;
    order.pickupOtpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    order.pickupOtpAttemptCount = 0;
    order.pickupOtpLocked = false;
    order.pickupOtpUsedAt = null;

    await this.orderRepository.save(order);

    const trackingEvent = this.trackingRepository.create({
      orderId: order.id,
      eventType: 'HANDOFF_OTP_GENERATED',
      statusText: 'Pickup Challenge Generated',
      description: 'Cryptographically secure 6-digit pickup OTP generated for rider verification.',
      fulfillmentSourceId: shopId,
      occurredAt: new Date(),
    });
    await this.trackingRepository.save(trackingEvent);

    const updatedDTO = await this.getRiderHandoffStatus(shopId, orderId, userId);
    updatedDTO.rawOtpForMerchantDisplay = rawOtp;
    return updatedDTO;
  }

  async verifyRiderHandoff(
    shopId: string,
    orderId: string,
    otp: string,
    userId: string,
  ): Promise<RiderHandoffStatusDTO> {
    const shop = await this.verifyShopOperatorPermission(shopId, userId);

    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    if (order.shopId && order.shopId !== shopId) {
      throw new ForbiddenException(`Access denied: Order ${orderId} does not belong to darkstore ${shopId}`);
    }

    // Audit 2: Mandatory Assigned Rider Check
    if (!order.riderId) {
      throw new BadRequestException('Rider must be assigned to order before verifying handoff challenge.');
    }

    const statusDTO = await this.getRiderHandoffStatus(shopId, orderId, userId);
    if (!statusDTO.isHandoffReady) {
      throw new BadRequestException(`Cannot verify rider handoff: ${statusDTO.blockedReason}`);
    }

    if (statusDTO.otpChallenge.isUsed) {
      throw new BadRequestException('Pickup OTP has already been used and consumed. Single-use verification challenge.');
    }

    if (statusDTO.otpChallenge.isLocked) {
      throw new BadRequestException('Pickup OTP is locked due to excessive failed attempts. Please generate a new challenge.');
    }

    if (!order.pickupOtpHash || !order.pickupOtpExpiresAt || statusDTO.otpChallenge.isExpired) {
      throw new BadRequestException('Pickup OTP has expired or is invalid. Please generate a new challenge.');
    }

    const inputHash = hashOtpSecret(otp ? otp.trim() : '');
    if (inputHash !== order.pickupOtpHash) {
      const attempts = (order.pickupOtpAttemptCount || 0) + 1;
      order.pickupOtpAttemptCount = attempts;
      if (attempts >= 5) {
        order.pickupOtpLocked = true;
      }
      await this.orderRepository.save(order);

      const trackingEvent = this.trackingRepository.create({
        orderId: order.id,
        eventType: 'HANDOFF_FAILED',
        statusText: 'Pickup OTP Verification Failed',
        description: `Incorrect OTP attempt (${attempts}/5).`,
        fulfillmentSourceId: shopId,
        occurredAt: new Date(),
      });
      await this.trackingRepository.save(trackingEvent);

      throw new BadRequestException(`Invalid pickup OTP code. Remaining attempts: ${Math.max(0, 5 - attempts)}`);
    }

    // SUCCESSFUL VERIFICATION MATCH
    order.pickupOtpUsedAt = new Date();
    order.handoffCompletedAt = new Date();
    order.status = 'SHIPPED'; // Authoritative transition to express delivery!

    await this.orderRepository.save(order);

    const trackingEvent = this.trackingRepository.create({
      orderId: order.id,
      eventType: 'RIDER_HANDOFF_COMPLETED',
      statusText: 'Rider Handoff Verified',
      description: `Express rider ${order.riderName || 'Rider'} verified OTP challenge and picked up order package.`,
      fulfillmentSourceId: shopId,
      riderId: order.riderId || undefined,
      occurredAt: new Date(),
    });
    await this.trackingRepository.save(trackingEvent);

    if (shop.vendorId) {
      const log = this.activityRepository.create({
        vendorId: shop.vendorId,
        actorUserId: userId,
        action: 'RIDER_HANDOFF_COMPLETED',
        metadataJson: JSON.stringify({
          shopId,
          orderId: order.id,
          riderId: order.riderId,
          riderName: order.riderName,
        }),
      });
      await this.activityRepository.save(log);
    }

    return this.getRiderHandoffStatus(shopId, orderId, userId);
  }

  // ─── CMD-090 Quick-Commerce Merchant Reports & CSV Export ────────────────────

  async getMerchantReport(
    shopId: string,
    startDateStr?: string,
    endDateStr?: string,
    userId?: string,
  ): Promise<MerchantReportDTO> {
    if (userId) {
      await this.verifyShopOperatorPermission(shopId, userId);
    }

    const shop = await this.shopRepository.findOne({ where: { id: shopId } });
    if (!shop) {
      throw new NotFoundException(`Darkstore ${shopId} not found`);
    }

    const end = endDateStr ? new Date(endDateStr) : new Date();
    const start = startDateStr ? new Date(startDateStr) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const orders = await this.orderRepository.find({
      where: { shopId },
    });

    const filteredOrders = orders.filter((o) => {
      const created = new Date(o.createdAt);
      return created >= start && created <= end;
    });

    let totalUnitsSold = 0;
    let grossSalesMinor = 0;
    let refundsMinor = 0;
    let completedOrdersCount = 0;
    let cancelledOrdersCount = 0;

    let acceptanceDurationsSum = 0;
    let acceptanceCount = 0;
    let pickingDurationsSum = 0;
    let pickingCount = 0;
    let handoffDurationsSum = 0;
    let handoffCount = 0;
    let totalFulfillmentSum = 0;
    let totalFulfillmentCount = 0;
    let slaBreachCount = 0;

    const dailyMap = new Map<string, { date: string; orderCount: number; grossSalesMinor: number; refundsMinor: number; units: number }>();

    for (const ord of filteredOrders) {
      const dayKey = new Date(ord.createdAt).toISOString().split('T')[0];
      const existingDay = dailyMap.get(dayKey) || { date: dayKey, orderCount: 0, grossSalesMinor: 0, refundsMinor: 0, units: 0 };

      const ordGross = Math.round((ord.totalAmount || 0) * 100);
      existingDay.orderCount += 1;
      existingDay.grossSalesMinor += ordGross;
      grossSalesMinor += ordGross;

      if (ord.status === 'CANCELLED') {
        cancelledOrdersCount += 1;
        refundsMinor += ordGross;
        existingDay.refundsMinor += ordGross;
      } else {
        completedOrdersCount += 1;
      }

      // Compute SLA timestamp intervals if available
      const createdMs = new Date(ord.createdAt).getTime();
      if (ord.pickingStartedAt) {
        const startMs = new Date(ord.pickingStartedAt).getTime();
        if (startMs >= createdMs) {
          acceptanceDurationsSum += (startMs - createdMs) / (1000 * 60);
          acceptanceCount += 1;
        }

        if (ord.pickingCompletedAt) {
          const compMs = new Date(ord.pickingCompletedAt).getTime();
          if (compMs >= startMs) {
            pickingDurationsSum += (compMs - startMs) / (1000 * 60);
            pickingCount += 1;
          }

          if (ord.handoffCompletedAt) {
            const handMs = new Date(ord.handoffCompletedAt).getTime();
            if (handMs >= compMs) {
              handoffDurationsSum += (handMs - compMs) / (1000 * 60);
              handoffCount += 1;
            }

            const totalMins = (handMs - createdMs) / (1000 * 60);
            totalFulfillmentSum += totalMins;
            totalFulfillmentCount += 1;
            if (totalMins > 15) {
              slaBreachCount += 1;
            }
          }
        }
      }

      dailyMap.set(dayKey, existingDay);
    }

    const dailyBreakdown: DailySalesSummaryDTO[] = Array.from(dailyMap.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((d) => {
        const net = d.grossSalesMinor - d.refundsMinor;
        return {
          date: d.date,
          orderCount: d.orderCount,
          grossSalesMinor: d.grossSalesMinor,
          formattedGrossSales: this.formatINR(d.grossSalesMinor),
          refundsMinor: d.refundsMinor,
          formattedRefunds: this.formatINR(d.refundsMinor),
          netSalesMinor: net,
          formattedNetSales: this.formatINR(net),
          totalUnitsSold: d.units,
        };
      });

    const netSalesMinor = grossSalesMinor - refundsMinor;

    const avgAcceptanceMins = acceptanceCount > 0 ? Number((acceptanceDurationsSum / acceptanceCount).toFixed(1)) : null;
    const avgPickingMins = pickingCount > 0 ? Number((pickingDurationsSum / pickingCount).toFixed(1)) : null;
    const avgHandoffMins = handoffCount > 0 ? Number((handoffDurationsSum / handoffCount).toFixed(1)) : null;
    const avgTotalFulfillmentMins = totalFulfillmentCount > 0 ? Number((totalFulfillmentSum / totalFulfillmentCount).toFixed(1)) : null;
    const slaBreachRatePercentage = totalFulfillmentCount > 0 ? Number(((slaBreachCount / totalFulfillmentCount) * 100).toFixed(1)) : 0;
    const fulfillmentSlaHealthPercentage = Number((100 - slaBreachRatePercentage).toFixed(1));

    // Audit OOS tracking events
    const oosTrackingEvents = await this.trackingRepository.find({
      where: { fulfillmentSourceId: shopId, eventType: 'ITEM_OUT_OF_STOCK' },
    });

    const totalOrdersCount = filteredOrders.length;
    const completionRatePercentage = totalOrdersCount > 0 ? Number(((completedOrdersCount / totalOrdersCount) * 100).toFixed(1)) : 100;
    const cancellationRatePercentage = totalOrdersCount > 0 ? Number(((cancelledOrdersCount / totalOrdersCount) * 100).toFixed(1)) : 0;

    // Multi-store comparison if merchant operates multiple darkstores
    const merchantShops = shop.vendorId ? await this.shopRepository.find({ where: { vendorId: shop.vendorId } }) : [shop];
    const multiStoreComparison: MultiStoreComparisonDTO[] = merchantShops.map((s) => ({
      shopId: s.id,
      shopName: s.shopName || s.id,
      orderCount: s.id === shopId ? filteredOrders.length : 0,
      grossSalesMinor: s.id === shopId ? grossSalesMinor : 0,
      formattedGrossSales: this.formatINR(s.id === shopId ? grossSalesMinor : 0),
      slaBreachRatePercentage: s.id === shopId ? slaBreachRatePercentage : 0,
      oosEventCount: s.id === shopId ? oosTrackingEvents.length : 0,
    }));

    return {
      shopId,
      shopName: shop.shopName || shop.id,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      salesSummary: {
        totalOrders: totalOrdersCount,
        totalUnitsSold,
        grossSalesMinor,
        formattedGrossSales: this.formatINR(grossSalesMinor),
        refundsMinor,
        formattedRefunds: this.formatINR(refundsMinor),
        netSalesMinor,
        formattedNetSales: this.formatINR(netSalesMinor),
      },
      dailyBreakdown,
      slaMetrics: {
        totalOrdersAnalyzed: totalFulfillmentCount,
        avgAcceptanceMins,
        avgPickingMins,
        avgHandoffMins,
        avgTotalFulfillmentMins,
        slaBreachCount,
        slaBreachRatePercentage,
        fulfillmentSlaHealthPercentage,
      },
      oosTrends: {
        totalOosEvents: oosTrackingEvents.length,
        topOosProducts: [],
        unresolvedShortageCount: 0,
      },
      performance: {
        completedOrdersCount,
        cancelledOrdersCount,
        completionRatePercentage,
        cancellationRatePercentage,
      },
      multiStoreComparison,
    };
  }

  async exportMerchantReportCsv(
    shopId: string,
    startDateStr?: string,
    endDateStr?: string,
    userId?: string,
  ): Promise<string> {
    const report = await this.getMerchantReport(shopId, startDateStr, endDateStr, userId);

    const headers = [
      'Date',
      'Order Count',
      'Gross Sales (INR)',
      'Refunds (INR)',
      'Net Sales (INR)',
      'SLA Breach Rate (%)',
      'Fulfillment Health (%)',
    ];

    const rows = report.dailyBreakdown.map((d) => [
      sanitizeCsvField(d.date),
      sanitizeCsvField(d.orderCount),
      sanitizeCsvField((d.grossSalesMinor / 100).toFixed(2)),
      sanitizeCsvField((d.refundsMinor / 100).toFixed(2)),
      sanitizeCsvField((d.netSalesMinor / 100).toFixed(2)),
      sanitizeCsvField(report.slaMetrics.slaBreachRatePercentage),
      sanitizeCsvField(report.slaMetrics.fulfillmentSlaHealthPercentage),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    return csvContent;
  }

  // ─── CMD-091 Quick-Commerce Merchant Staff Management ─────────────────────────

  async getDarkstoreStaff(shopId: string, userId: string): Promise<DarkstoreStaffDTO[]> {
    const shop = await this.verifyShopOperatorPermission(shopId, userId, 'MANAGER');
    if (!shop.vendorId) {
      return [];
    }

    const staffList = await this.staffRepository.find({ where: { vendorId: shop.vendorId } });

    return staffList.map((s) => {
      let assignedIds: string[] = [];
      if (s.assignedShopIdsJson) {
        try {
          assignedIds = JSON.parse(s.assignedShopIdsJson);
        } catch (e) {
          assignedIds = [];
        }
      }

      return {
        id: s.id,
        userId: s.userId,
        email: s.email,
        vendorRole: s.vendorRole,
        status: s.status,
        assignedShopIds: assignedIds,
        isDarkstoreOwner: s.vendorRole === 'OWNER',
      };
    });
  }

  async assignStaffToDarkstore(
    shopId: string,
    staffId: string,
    targetShopId: string,
    userId: string,
  ): Promise<DarkstoreStaffDTO[]> {
    const shop = await this.verifyShopOperatorPermission(shopId, userId, 'OWNER');

    const staff = await this.staffRepository.findOne({ where: { id: staffId, vendorId: shop.vendorId } });
    if (!staff) {
      throw new NotFoundException(`Staff member ${staffId} not found`);
    }

    let assignedIds: string[] = [];
    if (staff.assignedShopIdsJson) {
      try {
        assignedIds = JSON.parse(staff.assignedShopIdsJson);
      } catch (e) {
        assignedIds = [];
      }
    }

    if (!assignedIds.includes(targetShopId)) {
      assignedIds.push(targetShopId);
      staff.assignedShopIdsJson = JSON.stringify(assignedIds);
      await this.staffRepository.save(staff);

      if (shop.vendorId) {
        const log = this.activityRepository.create({
          vendorId: shop.vendorId,
          actorUserId: userId,
          action: 'DARKSTORE_STAFF_ASSIGNED',
          metadataJson: JSON.stringify({
            shopId: targetShopId,
            staffId: staff.id,
            staffUserId: staff.userId,
          }),
        });
        await this.activityRepository.save(log);
      }
    }

    return this.getDarkstoreStaff(shopId, userId);
  }

  async removeStaffFromDarkstore(
    shopId: string,
    staffId: string,
    targetShopId: string,
    userId: string,
  ): Promise<DarkstoreStaffDTO[]> {
    const shop = await this.verifyShopOperatorPermission(shopId, userId, 'OWNER');

    const staff = await this.staffRepository.findOne({ where: { id: staffId, vendorId: shop.vendorId } });
    if (!staff) {
      throw new NotFoundException(`Staff member ${staffId} not found`);
    }

    // Last-Owner Protection Check
    if (staff.vendorRole === 'OWNER') {
      const allStaff = await this.staffRepository.find({ where: { vendorId: shop.vendorId, status: 'ACTIVE' } });
      const activeOwners = allStaff.filter((s) => s.vendorRole === 'OWNER');
      if (activeOwners.length <= 1 && shop.ownerUserId === staff.userId) {
        throw new BadRequestException('Cannot revoke darkstore access for the last owner.');
      }
    }

    let assignedIds: string[] = [];
    if (staff.assignedShopIdsJson) {
      try {
        assignedIds = JSON.parse(staff.assignedShopIdsJson);
      } catch (e) {
        assignedIds = [];
      }
    }

    if (assignedIds.includes(targetShopId)) {
      assignedIds = assignedIds.filter((id) => id !== targetShopId);
      staff.assignedShopIdsJson = JSON.stringify(assignedIds);
      await this.staffRepository.save(staff);

      if (shop.vendorId) {
        const log = this.activityRepository.create({
          vendorId: shop.vendorId,
          actorUserId: userId,
          action: 'DARKSTORE_STAFF_REMOVED',
          metadataJson: JSON.stringify({
            shopId: targetShopId,
            staffId: staff.id,
            staffUserId: staff.userId,
          }),
        });
        await this.activityRepository.save(log);
      }
    }

    return this.getDarkstoreStaff(shopId, userId);
  }

  async updateStaffRoleOrStatus(
    shopId: string,
    staffId: string,
    dto: { vendorRole?: 'OWNER' | 'MANAGER' | 'FULFILLMENT_STAFF'; status?: 'ACTIVE' | 'INACTIVE' },
    userId: string,
  ): Promise<DarkstoreStaffDTO[]> {
    const shop = await this.verifyShopOperatorPermission(shopId, userId, 'OWNER');

    const staff = await this.staffRepository.findOne({ where: { id: staffId, vendorId: shop.vendorId } });
    if (!staff) {
      throw new NotFoundException(`Staff member ${staffId} not found`);
    }

    // Last-Owner Protection Check
    if (staff.vendorRole === 'OWNER' && (dto.vendorRole && dto.vendorRole !== 'OWNER' || dto.status === 'INACTIVE')) {
      const allStaff = await this.staffRepository.find({ where: { vendorId: shop.vendorId, status: 'ACTIVE' } });
      const activeOwners = allStaff.filter((s) => s.vendorRole === 'OWNER');
      if (activeOwners.length <= 1) {
        throw new BadRequestException('Cannot demote or deactivate the last darkstore owner.');
      }
    }

    if (dto.vendorRole) staff.vendorRole = dto.vendorRole;
    if (dto.status) staff.status = dto.status;
    await this.staffRepository.save(staff);

    if (shop.vendorId) {
      const log = this.activityRepository.create({
        vendorId: shop.vendorId,
        actorUserId: userId,
        action: 'STAFF_ROLE_CHANGED',
        metadataJson: JSON.stringify({
          shopId,
          staffId: staff.id,
          newRole: staff.vendorRole,
          newStatus: staff.status,
        }),
      });
      await this.activityRepository.save(log);
    }

    return this.getDarkstoreStaff(shopId, userId);
  }

  async getDarkstoreStaffActivity(shopId: string, userId: string): Promise<any[]> {
    const shop = await this.verifyShopOperatorPermission(shopId, userId, 'MANAGER');
    if (!shop.vendorId) return [];

    const logs = await this.activityRepository.find({
      where: { vendorId: shop.vendorId },
      order: { createdAt: 'DESC' },
      take: 50,
    });

    return logs.map((l) => {
      let meta: any = {};
      try {
        meta = JSON.parse(l.metadataJson || '{}');
      } catch (e) {
        meta = {};
      }

      // Sanitize metadata to strip secrets/hashes/PII
      delete meta.tokenHash;
      delete meta.password;
      delete meta.jwt;
      delete meta.otp;
      delete meta.bankAccount;

      return {
        id: l.id,
        action: l.action,
        actorUserId: l.actorUserId,
        metadata: meta,
        createdAt: l.createdAt,
      };
    });
  }

  async inviteStaff(
    shopId: string,
    email: string,
    vendorRole: 'OWNER' | 'MANAGER' | 'FULFILLMENT_STAFF',
    userId: string,
  ): Promise<any> {
    const shop = await this.verifyShopOperatorPermission(shopId, userId, 'OWNER');
    if (!shop.vendorId) {
      throw new BadRequestException('Darkstore is not associated with a vendor.');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invitation = this.invitationRepository.create({
      vendorId: shop.vendorId,
      email: email.toLowerCase().trim(),
      vendorRole,
      tokenHash,
      status: 'PENDING',
      invitedByUserId: userId,
      expiresAt,
    });

    await this.invitationRepository.save(invitation);

    const log = this.activityRepository.create({
      vendorId: shop.vendorId,
      actorUserId: userId,
      action: 'STAFF_INVITED',
      metadataJson: JSON.stringify({
        invitationId: invitation.id,
        email: invitation.email,
        vendorRole: invitation.vendorRole,
      }),
    });
    await this.activityRepository.save(log);

    return {
      id: invitation.id,
      email: invitation.email,
      vendorRole: invitation.vendorRole,
      status: invitation.status,
      expiresAt: invitation.expiresAt,
      createdAt: invitation.createdAt,
    };
  }

  async getDarkstoreInvitations(shopId: string, userId: string): Promise<any[]> {
    const shop = await this.verifyShopOperatorPermission(shopId, userId, 'MANAGER');
    if (!shop.vendorId) return [];

    const invitations = await this.invitationRepository.find({
      where: { vendorId: shop.vendorId, status: 'PENDING' },
      order: { createdAt: 'DESC' },
    });

    return invitations.map((inv) => ({
      id: inv.id,
      email: inv.email,
      vendorRole: inv.vendorRole,
      status: inv.status,
      expiresAt: inv.expiresAt,
      createdAt: inv.createdAt,
    }));
  }

  async revokeInvitation(shopId: string, invitationId: string, userId: string): Promise<any[]> {
    const shop = await this.verifyShopOperatorPermission(shopId, userId, 'OWNER');
    if (!shop.vendorId) return [];

    const inv = await this.invitationRepository.findOne({
      where: { id: invitationId, vendorId: shop.vendorId },
    });

    if (inv) {
      inv.status = 'REVOKED';
      await this.invitationRepository.save(inv);

      const log = this.activityRepository.create({
        vendorId: shop.vendorId,
        actorUserId: userId,
        action: 'STAFF_INVITATION_REVOKED',
        metadataJson: JSON.stringify({
          invitationId: inv.id,
          email: inv.email,
        }),
      });
      await this.activityRepository.save(log);
    }

    return this.getDarkstoreInvitations(shopId, userId);
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
