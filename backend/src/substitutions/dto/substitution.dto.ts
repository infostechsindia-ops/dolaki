import { IsOptional, IsString } from 'class-validator';

export class ProposeSubstitutionDto {
  @IsString()
  substituteVariantId: string;

  @IsOptional()
  @IsString()
  reasonCode?: string;
}

export interface SubstitutionCandidateDto {
  productId: string;
  variantId: string;
  sku: string;
  title: string;
  description?: string;
  imageUrl?: string | null;
  priceMinor: number;
  formattedPrice: string;
  formattedPriceDifference: string;
  priceDifferenceMinor: number;
  availableStock: number;
  fulfillmentSourceId: string;
}

export interface OrderItemSubstitutionResponseDto {
  orderItemId: string;
  preference: 'ALLOW_SUBSTITUTION' | 'CONTACT_ME' | 'NO_SUBSTITUTION';
  reasonCode: string;
  candidates: SubstitutionCandidateDto[];
  activeSubstitution?: {
    id: string;
    substituteProductId: string;
    substituteVariantId?: string;
    substituteSku: string;
    status: string;
    formattedOriginalPrice: string;
    formattedSubstitutePrice: string;
    formattedPriceDifference: string;
    priceDifferenceMinor: number;
    proposedAt?: string;
    decidedAt?: string;
  } | null;
}
