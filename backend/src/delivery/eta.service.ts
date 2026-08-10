import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { FladoShop, Order } from '../database/entities';
import { EtaResult } from './dto/eta-response.dto';

export const ETA_CONFIG = {
  quickCommerce: {
    basePickPackMinutes: 3,
    perItemPrepMinutes: 0.5,
    workloadMultiplierMinutes: 2,
    travelMinutesPerKm: 2.5,
    minTravelMinutes: 3,
    bufferMinutes: 2,
    ttlSeconds: 300, // 5-minute freshness TTL for pre-order ETA
  },
  marketplace: {
    baseHandlingDays: 1,
    transitDaysStandardMin: 3,
    transitDaysStandardMax: 5,
    cutoffHourLocal: 14, // 2 PM dispatch cutoff
    ttlSeconds: 1800, // 30-minute freshness TTL for Marketplace
  },
};

@Injectable()
export class EtaService {
  constructor(
    @InjectRepository(FladoShop)
    private readonly shopRepository: Repository<FladoShop>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  /**
   * Calculates deterministic server-authoritative ETA for Quick-Commerce fulfillment.
   */
  calculateQuickCommerceEta(
    shop: FladoShop,
    distanceKm: number,
    activeWorkloadCount: number,
    itemCount: number = 1,
  ): EtaResult {
    const config = ETA_CONFIG.quickCommerce;
    const now = new Date();

    const pickPackMinutes = Math.ceil(config.basePickPackMinutes + Math.max(0, itemCount - 1) * config.perItemPrepMinutes);
    const workloadQueueMinutes = activeWorkloadCount * config.workloadMultiplierMinutes;
    const travelMinutes = Math.max(config.minTravelMinutes, Math.ceil(distanceKm * config.travelMinutesPerKm));
    const bufferMinutes = config.bufferMinutes;

    const totalMinMinutes = pickPackMinutes + workloadQueueMinutes + travelMinutes + bufferMinutes;
    const totalMaxMinutes = totalMinMinutes + 4;

    const confidence: 'HIGH' | 'MEDIUM' | 'LOW' =
      activeWorkloadCount < 5 ? 'HIGH' : activeWorkloadCount < 15 ? 'MEDIUM' : 'LOW';

    const calculatedAt = now.toISOString();
    const expiresAt = new Date(now.getTime() + config.ttlSeconds * 1000).toISOString();

    return {
      isAvailable: true,
      surface: 'QUICK_COMMERCE',
      reasonCode: 'SERVICEABLE',
      minMinutes: totalMinMinutes,
      maxMinutes: totalMaxMinutes,
      estimatedDeliveryText: `${totalMinMinutes}–${totalMaxMinutes} mins`,
      deliveryBadgeText: `${totalMinMinutes} MINS`,
      fulfillmentSourceId: shop.id,
      fulfillmentSourceName: shop.shopName,
      distanceKm: Math.round(distanceKm * 10) / 10,
      calculatedAt,
      expiresAt,
      ttlSeconds: config.ttlSeconds,
      confidence,
      breakdown: {
        pickPackMinutes,
        workloadQueueMinutes,
        travelMinutes,
        bufferMinutes,
      },
    };
  }

  /**
   * Calculates deterministic server-authoritative ETA for Marketplace fulfillment.
   */
  calculateMarketplaceEta(pincode?: string, handlingDays?: number): EtaResult {
    const config = ETA_CONFIG.marketplace;
    const now = new Date();
    const currentHour = now.getHours();

    const baseHandling = handlingDays != null ? handlingDays : config.baseHandlingDays;
    const dispatchDays = currentHour >= config.cutoffHourLocal ? baseHandling + 1 : baseHandling;

    const minDays = dispatchDays + config.transitDaysStandardMin;
    const maxDays = dispatchDays + config.transitDaysStandardMax;

    const calculatedAt = now.toISOString();
    const expiresAt = new Date(now.getTime() + config.ttlSeconds * 1000).toISOString();

    return {
      isAvailable: true,
      surface: 'MARKETPLACE',
      reasonCode: 'SERVICEABLE',
      minMinutes: minDays * 24 * 60,
      maxMinutes: maxDays * 24 * 60,
      estimatedDeliveryText: `Delivered in ${minDays}–${maxDays} business days`,
      deliveryBadgeText: `${minDays}–${maxDays} DAYS`,
      fulfillmentSourceId: 'wh-regional-1',
      fulfillmentSourceName: 'AuraMart Regional Warehouse',
      calculatedAt,
      expiresAt,
      ttlSeconds: config.ttlSeconds,
      confidence: 'HIGH',
    };
  }
}
