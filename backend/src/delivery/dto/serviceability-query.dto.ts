import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, Min } from 'class-validator';

export enum DeliverySurface {
  MARKETPLACE = 'MARKETPLACE',
  QUICK_COMMERCE = 'QUICK_COMMERCE',
}

export class ServiceabilityQueryDto {
  @IsString()
  @IsNotEmpty()
  variantId: string;

  @IsEnum(DeliverySurface)
  surface: DeliverySurface;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsString()
  pincode?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  shopId?: string;

  @IsOptional()
  @IsString()
  addressId?: string;
}
