import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ProductVariant, Inventory, FladoShop, Product, Order } from '../database/entities';
import { ServiceabilityQueryDto, DeliverySurface } from './dto/serviceability-query.dto';

export type ServiceabilityReasonCode =
  | 'SERVICEABLE'
  | 'LOCATION_REQUIRED'
  | 'STORE_NOT_APPROVED'
  | 'STORE_CLOSED'
  | 'OUTSIDE_SERVICE_AREA'
  | 'AT_CAPACITY'
  | 'OUT_OF_STOCK'
  | 'INSUFFICIENT_STOCK'
  | 'NO_ELIGIBLE_FULFILLMENT_SOURCE';

export interface DeliveryPromiseResult {
  isServiceable: boolean;
  status: 'SERVICEABLE' | 'UNSERVICEABLE' | 'ESTIMATE_UNAVAILABLE';
  reasonCode: ServiceabilityReasonCode;
  unserviceableReason?: string | null;
  nextOpeningText?: string | null;
  deliveryBadgeText?: string | null;
  estimatedDeliveryText?: string | null;
  minDeliveryMinutes?: number;
  maxDeliveryMinutes?: number;
  shippingFeeText?: string | null;
  freeShippingThresholdRemainingText?: string | null;
  cutoffTimeText?: string | null;
  fulfillmentSourceId?: string | null;
  fulfillmentSourceName?: string | null;
  fulfillmentNodeName?: string | null;
}

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface DaySchedule {
  open: string;  // e.g. "08:00"
  close: string; // e.g. "22:00"
}

interface OperatingHours {
  mon?: DaySchedule;
  tue?: DaySchedule;
  wed?: DaySchedule;
  thu?: DaySchedule;
  fri?: DaySchedule;
  sat?: DaySchedule;
  sun?: DaySchedule;
  [key: string]: DaySchedule | undefined;
}

const DAY_NAMES = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DAY_LABELS: Record<string, string> = {
  sun: 'Sunday',
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
};

function parseTimeMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function isTimeWithinWindow(currentMinutes: number, openMinutes: number, closeMinutes: number): boolean {
  if (closeMinutes >= openMinutes) {
    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  } else {
    // Overnight window (e.g. 20:00 to 04:00)
    return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
  }
}

export function evaluateSchedule(operatingHoursJson?: string | null, now: Date = new Date()): { isScheduledOpen: boolean; nextOpeningText: string | null } {
  if (!operatingHoursJson) {
    return { isScheduledOpen: true, nextOpeningText: null };
  }

  try {
    const schedule: OperatingHours = JSON.parse(operatingHoursJson);
    const dayIndex = now.getDay();
    const currentDayKey = DAY_NAMES[dayIndex];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const todaySchedule = schedule[currentDayKey];
    if (todaySchedule && todaySchedule.open && todaySchedule.close) {
      const openMin = parseTimeMinutes(todaySchedule.open);
      const closeMin = parseTimeMinutes(todaySchedule.close);
      if (isTimeWithinWindow(currentMinutes, openMin, closeMin)) {
        return { isScheduledOpen: true, nextOpeningText: null };
      }
    }

    // Currently closed — compute next opening
    for (let offset = 0; offset < 7; offset++) {
      const checkDayIndex = (dayIndex + offset) % 7;
      const checkDayKey = DAY_NAMES[checkDayIndex];
      const daySched = schedule[checkDayKey];
      if (daySched && daySched.open) {
        const openMin = parseTimeMinutes(daySched.open);
        if (offset === 0 && currentMinutes < openMin) {
          return {
            isScheduledOpen: false,
            nextOpeningText: `Opens today at ${daySched.open}`,
          };
        } else if (offset > 0) {
          const dayNameLabel = offset === 1 ? 'tomorrow' : `on ${DAY_LABELS[checkDayKey]}`;
          return {
            isScheduledOpen: false,
            nextOpeningText: `Opens ${dayNameLabel} at ${daySched.open}`,
          };
        }
      }
    }

    return { isScheduledOpen: false, nextOpeningText: null };
  } catch (e) {
    return { isScheduledOpen: true, nextOpeningText: null };
  }
}

import { EtaService } from './eta.service';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(FladoShop)
    private readonly shopRepository: Repository<FladoShop>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly etaService: EtaService,
  ) {}

  async evaluateServiceability(dto: ServiceabilityQueryDto): Promise<DeliveryPromiseResult> {
    const qty = dto.quantity && dto.quantity > 0 ? dto.quantity : 1;

    // Validate variant/product SKU existence
    const variant = await this.variantRepository.findOne({
      where: [{ id: dto.variantId }, { sku: dto.variantId }],
    });

    const product = !variant
      ? await this.productRepository.findOne({ where: { id: dto.variantId } })
      : null;

    if (!variant && !product) {
      return {
        isServiceable: false,
        status: 'UNSERVICEABLE',
        reasonCode: 'OUT_OF_STOCK',
        unserviceableReason: `Variant or Product identifier '${dto.variantId}' does not exist`,
      };
    }

    const resolvedVariantId = variant ? variant.id : dto.variantId;

    if (dto.surface === DeliverySurface.QUICK_COMMERCE) {
      return this.evaluateFladoServiceability(resolvedVariantId, qty, dto);
    } else {
      return this.evaluateMarketplaceServiceability(resolvedVariantId, qty, dto);
    }
  }

  private async evaluateMarketplaceServiceability(
    variantId: string,
    quantity: number,
    dto: ServiceabilityQueryDto,
  ): Promise<DeliveryPromiseResult> {
    // 1. Check stock availability across vendor inventories
    const inventories = await this.inventoryRepository.find({
      where: { variantId },
    });

    const totalAvailableStock = inventories.reduce(
      (sum, inv) => sum + Math.max(0, (inv.stockQuantity || 0) - (inv.reservedQuantity || 0)),
      0,
    );

    if (inventories.length > 0 && totalAvailableStock < quantity) {
      return {
        isServiceable: false,
        status: 'UNSERVICEABLE',
        reasonCode: totalAvailableStock <= 0 ? 'OUT_OF_STOCK' : 'INSUFFICIENT_STOCK',
        unserviceableReason: 'Requested quantity exceeds available stock',
        fulfillmentSourceId: 'wh-regional-1',
        fulfillmentSourceName: 'AuraMart Regional Warehouse',
        fulfillmentNodeName: 'AuraMart Regional Warehouse',
      };
    }

    // 2. Validate location requirement
    const hasPincode = Boolean(dto.pincode && dto.pincode.trim().length > 0);
    const hasCoords = dto.latitude != null && dto.longitude != null;

    if (!hasPincode && !hasCoords) {
      return {
        isServiceable: false,
        status: 'UNSERVICEABLE',
        reasonCode: 'LOCATION_REQUIRED',
        unserviceableReason: 'Destination location (pincode or coordinates) is required',
        fulfillmentSourceId: 'wh-regional-1',
        fulfillmentSourceName: 'AuraMart Regional Warehouse',
        fulfillmentNodeName: 'AuraMart Regional Warehouse',
      };
    }

    const eta = this.etaService.calculateMarketplaceEta(dto.pincode);

    return {
      isServiceable: true,
      status: 'SERVICEABLE',
      reasonCode: 'SERVICEABLE',
      unserviceableReason: null,
      deliveryBadgeText: eta.deliveryBadgeText,
      estimatedDeliveryText: eta.estimatedDeliveryText,
      minDeliveryMinutes: eta.minMinutes,
      maxDeliveryMinutes: eta.maxMinutes,
      shippingFeeText: 'FREE',
      freeShippingThresholdRemainingText: null,
      cutoffTimeText: 'Order before 2 PM for same-day dispatch',
      fulfillmentSourceId: 'wh-regional-1',
      fulfillmentSourceName: 'AuraMart Regional Warehouse',
      fulfillmentNodeName: 'AuraMart Regional Warehouse',
    };
  }

  private async evaluateFladoServiceability(
    variantId: string,
    quantity: number,
    dto: ServiceabilityQueryDto,
  ): Promise<DeliveryPromiseResult> {
    const hasCoords = dto.latitude != null && dto.longitude != null;

    if (!hasCoords && !dto.shopId) {
      return {
        isServiceable: false,
        status: 'UNSERVICEABLE',
        reasonCode: 'LOCATION_REQUIRED',
        unserviceableReason: 'Customer coordinates (latitude and longitude) or shopId are required for Flado Quick-Commerce',
      };
    }

    // Fetch candidate shops
    let candidateShops: { shop: FladoShop; distanceKm: number }[] = [];

    if (dto.shopId) {
      const targetShop = await this.shopRepository.findOne({ where: { id: dto.shopId } });
      if (targetShop) {
        const dist = hasCoords && targetShop.lat != null && targetShop.lng != null
          ? calculateDistanceKm(dto.latitude!, dto.longitude!, targetShop.lat, targetShop.lng)
          : 0;
        const radius = targetShop.deliveryRadiusKm || 5.0;
        if (!hasCoords || dist <= radius) {
          candidateShops.push({ shop: targetShop, distanceKm: dist });
        }
      }
    } else if (hasCoords) {
      const allShops = await this.shopRepository.find();
      for (const shop of allShops) {
        if (shop.lat != null && shop.lng != null) {
          const dist = calculateDistanceKm(dto.latitude!, dto.longitude!, shop.lat, shop.lng);
          if (dist <= (shop.deliveryRadiusKm || 5.0)) {
            candidateShops.push({ shop, distanceKm: dist });
          }
        }
      }
      // Sort candidates by distance (closest first)
      candidateShops.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    if (candidateShops.length === 0) {
      return {
        isServiceable: false,
        status: 'UNSERVICEABLE',
        reasonCode: 'OUTSIDE_SERVICE_AREA',
        unserviceableReason: 'Location is outside Flado quick-commerce delivery zone',
      };
    }

    // Evaluate eligibility pipeline for each candidate store
    let primaryFailureReason: { reasonCode: ServiceabilityReasonCode; message: string; shopName: string; shopId: string; nextOpeningText: string | null } | null = null;

    for (const candidate of candidateShops) {
      const shop = candidate.shop;

      // 1. Approval Status
      if (shop.approvalStatus !== 'APPROVED') {
        if (!primaryFailureReason) {
          primaryFailureReason = {
            reasonCode: 'STORE_NOT_APPROVED',
            message: 'Flado store is pending verification/approval',
            shopName: shop.shopName,
            shopId: shop.id,
            nextOpeningText: null,
          };
        }
        continue;
      }

      // 2. Operational isOpen Toggle
      if (!shop.isOpen) {
        const { nextOpeningText } = evaluateSchedule(shop.operatingHoursJson);
        if (!primaryFailureReason) {
          primaryFailureReason = {
            reasonCode: 'STORE_CLOSED',
            message: 'Flado store is currently closed',
            shopName: shop.shopName,
            shopId: shop.id,
            nextOpeningText,
          };
        }
        continue;
      }

      // 3. Operating Schedule Check
      const scheduleEval = evaluateSchedule(shop.operatingHoursJson);
      if (!scheduleEval.isScheduledOpen) {
        if (!primaryFailureReason) {
          primaryFailureReason = {
            reasonCode: 'STORE_CLOSED',
            message: 'Flado store is outside operating hours',
            shopName: shop.shopName,
            shopId: shop.id,
            nextOpeningText: scheduleEval.nextOpeningText,
          };
        }
        continue;
      }

      // 4. Active Order Capacity Check
      const activeOrders = await this.orderRepository.find({
        where: {
          shopId: shop.id,
          status: In(['PLACED', 'ACCEPTED', 'PREPARING', 'RIDER_ASSIGNED', 'PICKED_UP', 'NEAR_CUSTOMER']),
        },
      });
      const maxActive = shop.maxActiveOrders || 20;
      if (activeOrders.length >= maxActive) {
        if (!primaryFailureReason) {
          primaryFailureReason = {
            reasonCode: 'AT_CAPACITY',
            message: 'Flado darkstore is currently at maximum capacity',
            shopName: shop.shopName,
            shopId: shop.id,
            nextOpeningText: null,
          };
        }
        continue;
      }

      // 5. SKU Inventory Check
      const shopInventories = await this.inventoryRepository.find({
        where: { variantId, shopId: shop.id },
      });
      const shopAvailableStock = shopInventories.reduce(
        (sum, inv) => sum + Math.max(0, (inv.stockQuantity || 0) - (inv.reservedQuantity || 0)),
        0,
      );

      if (shopInventories.length > 0 && shopAvailableStock < quantity) {
        const code: ServiceabilityReasonCode = shopAvailableStock <= 0 ? 'OUT_OF_STOCK' : 'INSUFFICIENT_STOCK';
        if (!primaryFailureReason) {
          primaryFailureReason = {
            reasonCode: code,
            message: `Item is ${code === 'OUT_OF_STOCK' ? 'out of stock' : 'insufficient'} at darkstore`,
            shopName: shop.shopName,
            shopId: shop.id,
            nextOpeningText: null,
          };
        }
        continue;
      }

      // Fully Eligible Candidate Found! Calculate server-authoritative ETA.
      const eta = this.etaService.calculateQuickCommerceEta(
        shop,
        candidate.distanceKm,
        activeOrders.length,
        quantity,
      );

      return {
        isServiceable: true,
        status: 'SERVICEABLE',
        reasonCode: 'SERVICEABLE',
        unserviceableReason: null,
        nextOpeningText: null,
        deliveryBadgeText: eta.deliveryBadgeText,
        estimatedDeliveryText: eta.estimatedDeliveryText,
        minDeliveryMinutes: eta.minMinutes,
        maxDeliveryMinutes: eta.maxMinutes,
        shippingFeeText: shop.deliveryFeeType === 'FREE' ? 'FREE' : `$${shop.deliveryFeeAmount}`,
        freeShippingThresholdRemainingText: null,
        cutoffTimeText: null,
        fulfillmentSourceId: shop.id,
        fulfillmentSourceName: shop.shopName,
        fulfillmentNodeName: shop.shopName,
      };
    }

    // No fully eligible store found among candidates
    const failure = primaryFailureReason || {
      reasonCode: 'NO_ELIGIBLE_FULFILLMENT_SOURCE' as ServiceabilityReasonCode,
      message: 'No eligible Flado store available for delivery',
      shopName: candidateShops[0]?.shop.shopName || 'Flado Store',
      shopId: candidateShops[0]?.shop.id || '',
      nextOpeningText: null,
    };

    return {
      isServiceable: false,
      status: 'UNSERVICEABLE',
      reasonCode: failure.reasonCode,
      unserviceableReason: failure.message,
      nextOpeningText: failure.nextOpeningText,
      fulfillmentSourceId: failure.shopId,
      fulfillmentSourceName: failure.shopName,
      fulfillmentNodeName: failure.shopName,
    };
  }
}

