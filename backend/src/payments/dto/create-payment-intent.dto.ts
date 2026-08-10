import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsOptional()
  @IsString()
  addressId?: string;

  @IsOptional()
  @IsString()
  deliveryOptionId?: string;

  @IsNotEmpty()
  @IsString()
  paymentMethod: string; // 'pay-upi' | 'pay-card' | 'pay-cod' | 'UPI' | 'CARD' | 'COD'

  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}
