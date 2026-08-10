import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FladoShop, Order, User } from '../database/entities';
import {
  QuickFeesResultDto,
  QuickFeeLineDto,
  FreeDeliveryThresholdInfo,
  MinimumOrderPolicyInfo,
} from './dto/quick-fees.dto';

export const QUICK_FEES_CONFIG = {
  defaultFreeDeliveryThresholdMinor: 500, // $5.00 threshold for free delivery
  smallBasketFeeMinor: 150,               // $1.50 small basket surcharge
  handlingFeeMinor: 100,                  // $1.00 platform handling fee
  surgeFeeMinor: 200,                     // $2.00 surge fee when store capacity >= 75%
  surgeCapacityThresholdRatio: 0.75,
};

@Injectable()
export class QuickFeesService {
  constructor(
    @InjectRepository(FladoShop)
    private readonly shopRepository: Repository<FladoShop>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Calculates server-authoritative Quick-Commerce fees for a given darkstore & cart subtotal.
   */
  async calculateQuickFees(
    shopId: string,
    subtotalMinor: number,
    surface: 'QUICK_COMMERCE' | 'MARKETPLACE' = 'QUICK_COMMERCE',
    userId?: string,
  ): Promise<QuickFeesResultDto> {
    // Marketplace order isolation: Quick fees do NOT apply to Marketplace
    if (surface === 'MARKETPLACE') {
      return {
        surface: 'MARKETPLACE',
        fulfillmentSourceId: 'wh-regional-1',
        fulfillmentSourceName: 'AuraMart Regional Warehouse',
        subtotalMinor,
        formattedSubtotal: `$${(subtotalMinor / 100).toFixed(2)}`,
        feeLines: [
          {
            code: 'DELIVERY_FEE',
            label: 'Standard Nationwide Shipping',
            amountMinor: 0,
            formattedAmount: 'FREE',
            isWaived: true,
            waiverReason: 'Standard marketplace shipping included',
          },
        ],
        totalFeesMinor: 0,
        formattedTotalFees: 'FREE',
        grandTotalMinor: subtotalMinor,
        formattedGrandTotal: `$${(subtotalMinor / 100).toFixed(2)}`,
        freeDeliveryThreshold: null,
        minimumOrderPolicy: null,
      };
    }

    const shop = await this.shopRepository.findOne({ where: { id: shopId } });
    if (!shop) {
      throw new NotFoundException(`Flado shop ${shopId} not found for fee evaluation`);
    }

    // Evaluate VIP Membership server-side
    let isVip = false;
    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (user && user.isVip) {
        const now = new Date();
        if (user.vipExpiresAt && user.vipExpiresAt.getTime() > now.getTime()) {
          isVip = true;
        }
      }
    }

    const feeLines: QuickFeeLineDto[] = [];
    let totalFeesMinor = 0;

    // 1. Delivery Fee & Free Delivery Threshold
    const baseDeliveryFeeMinor = shop.deliveryFeeType === 'PAID'
      ? Math.round((shop.deliveryFeeAmount || 0) * 100)
      : 0;

    const freeDeliveryThresholdMinor = QUICK_FEES_CONFIG.defaultFreeDeliveryThresholdMinor;
    const isFreeThresholdMet = isVip || subtotalMinor >= freeDeliveryThresholdMinor;
    const remainingForFreeDeliveryMinor = isVip ? 0 : Math.max(0, freeDeliveryThresholdMinor - subtotalMinor);

    let deliveryFeeLineAmount = baseDeliveryFeeMinor;
    let isDeliveryWaived = false;
    let waiverReason: string | undefined = undefined;

    if (isVip) {
      deliveryFeeLineAmount = 0;
      isDeliveryWaived = true;
      waiverReason = 'FLADO_VIP';
    } else if (isFreeThresholdMet && baseDeliveryFeeMinor > 0) {
      deliveryFeeLineAmount = 0;
      isDeliveryWaived = true;
      waiverReason = 'Free delivery threshold met';
    }

    feeLines.push({
      code: 'DELIVERY_FEE',
      label: '10-Minute Express Delivery',
      amountMinor: deliveryFeeLineAmount,
      formattedAmount: deliveryFeeLineAmount === 0 ? 'FREE' : `$${(deliveryFeeLineAmount / 100).toFixed(2)}`,
      isWaived: isDeliveryWaived,
      waiverReason,
    });

    totalFeesMinor += deliveryFeeLineAmount;

    // 2. Minimum Order Amount & Small Basket Surcharge
    let minimumOrderPolicy: MinimumOrderPolicyInfo | null = null;
    if (shop.minimumOrderAmount != null && shop.minimumOrderAmount > 0) {
      const minOrderMinor = Math.round(shop.minimumOrderAmount * 100);
      const isMet = subtotalMinor >= minOrderMinor;

      minimumOrderPolicy = {
        minimumOrderAmountMinor: minOrderMinor,
        formattedMinimumOrderAmount: `$${(minOrderMinor / 100).toFixed(2)}`,
        isMet,
      };

      if (!isMet) {
        const smallBasketFee = QUICK_FEES_CONFIG.smallBasketFeeMinor;
        feeLines.push({
          code: 'SMALL_BASKET_FEE',
          label: 'Small Basket Surcharge',
          amountMinor: smallBasketFee,
          formattedAmount: `$${(smallBasketFee / 100).toFixed(2)}`,
          isWaived: false,
          description: `Applies when order subtotal is below minimum ($${shop.minimumOrderAmount.toFixed(2)})`,
        });
        totalFeesMinor += smallBasketFee;
      }
    }

    // 3. Handling & Packaging Fee (Waived for VIP members)
    const baseHandlingFee = QUICK_FEES_CONFIG.handlingFeeMinor;
    const handlingFee = isVip ? 0 : baseHandlingFee;
    feeLines.push({
      code: 'HANDLING_FEE',
      label: 'Handling & Cold Chain Fee',
      amountMinor: handlingFee,
      formattedAmount: handlingFee === 0 ? 'FREE' : `$${(handlingFee / 100).toFixed(2)}`,
      isWaived: isVip,
      waiverReason: isVip ? 'FLADO_VIP' : undefined,
    });
    totalFeesMinor += handlingFee;

    // 4. Surge / High Workload Operational Surcharge
    const activeOrderCount = await this.orderRepository.count({
      where: { shopId, status: 'PREPARING' },
    });

    const maxActiveOrders = shop.maxActiveOrders || 20;
    if (activeOrderCount >= Math.ceil(maxActiveOrders * QUICK_FEES_CONFIG.surgeCapacityThresholdRatio)) {
      const surgeFee = QUICK_FEES_CONFIG.surgeFeeMinor;
      feeLines.push({
        code: 'SURGE_FEE',
        label: 'High Demand Surge Fee',
        amountMinor: surgeFee,
        formattedAmount: `$${(surgeFee / 100).toFixed(2)}`,
        isWaived: false,
        description: 'Applies during peak darkstore order volume',
      });
      totalFeesMinor += surgeFee;
    }

    const freeDeliveryThresholdInfo: FreeDeliveryThresholdInfo = {
      thresholdMinor: freeDeliveryThresholdMinor,
      formattedThreshold: `$${(freeDeliveryThresholdMinor / 100).toFixed(2)}`,
      remainingForFreeDeliveryMinor,
      formattedRemainingForFreeDelivery: `$${(remainingForFreeDeliveryMinor / 100).toFixed(2)}`,
      isEligibleForFreeDelivery: isFreeThresholdMet,
    };

    const grandTotalMinor = subtotalMinor + totalFeesMinor;

    return {
      surface: 'QUICK_COMMERCE',
      fulfillmentSourceId: shop.id,
      fulfillmentSourceName: shop.shopName,
      subtotalMinor,
      formattedSubtotal: `$${(subtotalMinor / 100).toFixed(2)}`,
      feeLines,
      totalFeesMinor,
      formattedTotalFees: totalFeesMinor === 0 ? 'FREE' : `$${(totalFeesMinor / 100).toFixed(2)}`,
      grandTotalMinor,
      formattedGrandTotal: `$${(grandTotalMinor / 100).toFixed(2)}`,
      freeDeliveryThreshold: freeDeliveryThresholdInfo,
      minimumOrderPolicy,
    };
  }
}
