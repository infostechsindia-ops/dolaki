import { IsOptional, IsString, IsNumber, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { DeliveryPromiseResult } from '../../delivery/delivery.service';
import {
  QuickHomeShopDto,
  QuickHomeCategoryDto,
  QuickHomeProductDto,
} from './quick-home.dto';

export class QuickCatalogQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lat?: number;

  @IsOptional()
  @Type(() => Number)
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
  categorySlug?: string;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  sort?: 'relevance' | 'price_asc' | 'price_desc' | string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  shopId?: string;
}

export interface QuickCatalogPaginationDto {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface QuickCatalogResponseDto {
  deliveryPromise: DeliveryPromiseResult;
  activeShop: QuickHomeShopDto | null;
  categories: QuickHomeCategoryDto[];
  products: QuickHomeProductDto[];
  pagination: QuickCatalogPaginationDto;
  query: {
    q?: string;
    categorySlug?: string;
    sort: string;
  };
}
