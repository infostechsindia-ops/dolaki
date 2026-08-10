import { DeliveryPromiseResult } from '../../delivery/delivery.service';
import { QuickHomeShopDto } from './quick-home.dto';

export interface QuickReorderItemDto {
  productId: string;
  variantId: string;
  sku: string;
  title: string;
  description?: string;
  imageUrl?: string | null;
  historicalPriceMinor: number;
  currentPriceMinor: number;
  formattedCurrentPrice: string;
  isAvailable: boolean;
  availableStock: number;
  unavailableReasonCode?: string | null;
  unavailableReason?: string | null;
  fulfillmentSourceId: string;
  lastOrderedAt?: string;
}

export interface QuickReorderResponseDto {
  deliveryPromise: DeliveryPromiseResult;
  activeShop: QuickHomeShopDto | null;
  reorderItems: QuickReorderItemDto[];
  totalReorderableCount: number;
}

export class AddQuickReorderItemsDto {
  orderId?: string;
  variantIds?: string[];
  shopId?: string;
}
