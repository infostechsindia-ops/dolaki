import { FladoShop } from '../../database/entities';

/**
 * CMD-006: Public shop DTO — safe for unauthenticated callers.
 *
 * Fields EXCLUDED from public responses:
 *   - ownerPhone     (PII — owner's mobile number)
 *   - ownerUserId    (internal user ID)
 *   - approvalNote   (internal admin note)
 *   - approvedByAdminId (internal admin identity)
 *   - verifiedByAgentId (internal agent identity)
 *   - verifiedAt     (internal verification timestamp)
 *   - isPhysicallyVerified (internal audit flag)
 */
export interface PublicShopDto {
  id: string;
  ownerName: string; // First name only shown if configured; full name for now (no PII reduction needed per CMD-006)
  shopName: string;
  shopDescription: string;
  shopBannerUrl: string;
  shopLogoUrl: string;
  categoriesJson: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  deliveryRadiusKm: number;
  deliveryFeeType: string;
  deliveryFeeAmount: number;
  isOpen: boolean;
  approvalStatus: string;
  rating: number;
  totalRatings: number;
  ownerStory: string;
  shopPhotosJson: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Strip sensitive internal fields from a FladoShop entity for public API responses. */
export function toPublicShopDto(
  shop: FladoShop & Record<string, unknown>,
): PublicShopDto {
  return {
    id: shop.id,
    ownerName: shop.ownerName,
    shopName: shop.shopName,
    shopDescription: shop.shopDescription,
    shopBannerUrl: shop.shopBannerUrl,
    shopLogoUrl: shop.shopLogoUrl,
    categoriesJson: shop.categoriesJson,
    address: shop.address,
    city: shop.city,
    state: shop.state,
    lat: shop.lat,
    lng: shop.lng,
    deliveryRadiusKm: shop.deliveryRadiusKm,
    deliveryFeeType: shop.deliveryFeeType,
    deliveryFeeAmount: shop.deliveryFeeAmount,
    isOpen: shop.isOpen,
    approvalStatus: shop.approvalStatus,
    rating: shop.rating,
    totalRatings: shop.totalRatings,
    ownerStory: shop.ownerStory,
    shopPhotosJson: shop.shopPhotosJson,
    createdAt: shop.createdAt,
    updatedAt: shop.updatedAt,
  };
}

/** Strip verificationOtp from any order object for non-admin responses. */
export function toSafeOrderDto<T extends { verificationOtp?: string }>(order: T): Omit<T, 'verificationOtp'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { verificationOtp, ...safeOrder } = order as Record<string, unknown> & T;
  return safeOrder as Omit<T, 'verificationOtp'>;
}
