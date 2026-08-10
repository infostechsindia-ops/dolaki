import { IsOptional, IsString, IsNumber } from 'class-validator';
import { DeliveryPromiseResult } from '../../delivery/delivery.service';

export class QuickHomeQueryDto {
  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsOptional()
  @IsString()
  pincode?: string;

  @IsOptional()
  @IsString()
  addressId?: string;

  @IsOptional()
  @IsString()
  shopId?: string;
}

export interface QuickHomeShopDto {
  id: string;
  shopName: string;
  shopDescription?: string | null;
  deliveryRadiusKm: number;
  deliveryFeeType: string;
  deliveryFeeAmount: number;
  minimumOrderAmount?: number | null;
  isOpen: boolean;
  operatingHoursJson?: string | null;
}

export interface QuickHomeCategoryDto {
  name: string;
  slug: string;
  icon: string;
  itemCount: number;
}

export interface QuickHomeProductDto {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  priceMinor: number;
  originalPriceMinor?: number | null;
  unit?: string | null;
  availableStock: number;
  categorySlug?: string | null;
  shopId?: string | null;
}

export interface QuickHomeOfferDto {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  imageUrl?: string | null;
  backgroundColor?: string | null;
}

export interface QuickHomeBrandDto {
  name: string;
  slug: string;
  logoUrl?: string | null;
}

export interface QuickHomeFeedDto {
  deliveryPromise: DeliveryPromiseResult;
  activeShop: QuickHomeShopDto | null;
  categories: QuickHomeCategoryDto[];
  reorderItems: QuickHomeProductDto[];
  offers: QuickHomeOfferDto[];
  popularNearby: QuickHomeProductDto[];
  essentials: QuickHomeProductDto[];
  brands: QuickHomeBrandDto[];
}
