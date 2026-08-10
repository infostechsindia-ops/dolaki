export interface QuickFeeLineDto {
  code: 'DELIVERY_FEE' | 'SMALL_BASKET_FEE' | 'HANDLING_FEE' | 'SURGE_FEE';
  label: string;
  amountMinor: number;
  formattedAmount: string;
  isWaived: boolean;
  waiverReason?: string;
  description?: string;
}

export interface FreeDeliveryThresholdInfo {
  thresholdMinor: number;
  formattedThreshold: string;
  remainingForFreeDeliveryMinor: number;
  formattedRemainingForFreeDelivery: string;
  isEligibleForFreeDelivery: boolean;
}

export interface MinimumOrderPolicyInfo {
  minimumOrderAmountMinor: number;
  formattedMinimumOrderAmount: string;
  isMet: boolean;
}

export interface QuickFeesResultDto {
  surface: 'QUICK_COMMERCE' | 'MARKETPLACE';
  fulfillmentSourceId: string;
  fulfillmentSourceName: string;
  subtotalMinor: number;
  formattedSubtotal: string;
  feeLines: QuickFeeLineDto[];
  totalFeesMinor: number;
  formattedTotalFees: string;
  grandTotalMinor: number;
  formattedGrandTotal: string;
  freeDeliveryThreshold?: FreeDeliveryThresholdInfo | null;
  minimumOrderPolicy?: MinimumOrderPolicyInfo | null;
}
