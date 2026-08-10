import { IsOptional, IsString, IsObject } from 'class-validator';

export class ConfirmPaymentIntentDto {
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsObject()
  providerPayload?: Record<string, any>;
}
