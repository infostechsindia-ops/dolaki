export interface EtaBreakdown {
  pickPackMinutes: number;
  workloadQueueMinutes: number;
  travelMinutes: number;
  bufferMinutes: number;
}

export interface EtaResult {
  isAvailable: boolean;
  surface: 'QUICK_COMMERCE' | 'MARKETPLACE';
  reasonCode: string;
  minMinutes?: number;
  maxMinutes?: number;
  estimatedDeliveryText?: string;
  deliveryBadgeText?: string;
  fulfillmentSourceId?: string;
  fulfillmentSourceName?: string;
  distanceKm?: number;
  calculatedAt: string;
  expiresAt: string;
  ttlSeconds: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  breakdown?: EtaBreakdown;
}
