import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsEnum,
  IsInt,
  Min,
  ValidateNested,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CalculatePriceItemDto {
  @IsString()
  @IsNotEmpty()
  sellerListingId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  locationId?: string;
}

export class CalculatePriceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CalculatePriceItemDto)
  items: CalculatePriceItemDto[];

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsEnum(['ALL', 'MARKETPLACE', 'QUICK_COMMERCE'])
  surface?: 'ALL' | 'MARKETPLACE' | 'QUICK_COMMERCE';

  @IsOptional()
  @IsString()
  locationId?: string;

  @IsOptional()
  @IsDateString()
  pricingInstant?: string;

  @IsOptional()
  @IsBoolean()
  isTaxInclusive?: boolean;
}

export class CreatePromotionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(['FLASH_SALE', 'CATEGORY_DISCOUNT', 'BRAND_DISCOUNT', 'SELLER_PROMO'])
  type: 'FLASH_SALE' | 'CATEGORY_DISCOUNT' | 'BRAND_DISCOUNT' | 'SELLER_PROMO';

  @IsEnum(['PERCENT', 'FLAT_AMOUNT'])
  discountType: 'PERCENT' | 'FLAT_AMOUNT';

  @IsInt()
  @Min(1)
  discountValue: number;

  @IsDateString()
  startsAt: string;

  @IsDateString()
  endsAt: string;

  @IsOptional()
  @IsEnum(['ALL', 'MARKETPLACE', 'QUICK_COMMERCE'])
  surface?: 'ALL' | 'MARKETPLACE' | 'QUICK_COMMERCE';

  @IsOptional()
  @IsEnum(['ALL', 'CATEGORY', 'BRAND', 'VARIANT', 'SELLER_LISTING'])
  targetType?: 'ALL' | 'CATEGORY' | 'BRAND' | 'VARIANT' | 'SELLER_LISTING';

  @IsOptional()
  @IsString()
  targetId?: string;

  @IsOptional()
  @IsInt()
  priority?: number;
}

export class CreatePriceOverrideDto {
  @IsString()
  @IsNotEmpty()
  sellerListingId: string;

  @IsOptional()
  @IsString()
  locationId?: string;

  @IsInt()
  @Min(0)
  priceMinor: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  compareAtPriceMinor?: number;

  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;
}

export class PriceBreakdownItemDto {
  sellerListingId: string;
  variantId: string;
  sku: string;
  title: string;
  vendorId: string;
  shopId: string | null;
  quantity: number;
  referenceMsrpMinor: number;
  basePriceMinor: number;
  effectiveUnitPriceMinor: number;
  itemDiscountMinor: number;
  lineSubtotalMinor: number;
  taxableSubtotalMinor: number;
  taxClass: string;
  taxAmountMinor: number;
  formattedUnitPrice: string;
  formattedLineSubtotal: string;
}

export class AppliedRuleDto {
  ruleId: string;
  ruleType: string;
  title: string;
  discountMinor: number;
}

export class PriceSummaryDto {
  itemsSubtotalMinor: number;
  totalItemDiscountMinor: number;
  couponDiscountMinor: number;
  taxTotalMinor: number;
  deliveryFeeMinor: number;
  deliveryFeeStatus: string;
  finalTotalMinor: number;
  currency: string;
  formattedFinalTotal: string;
}

export class PriceCalculationResultDto {
  items: PriceBreakdownItemDto[];
  summary: PriceSummaryDto;
  appliedRules: AppliedRuleDto[];
  pricingInstant: string;
  pricingSnapshotHash: string;
}
