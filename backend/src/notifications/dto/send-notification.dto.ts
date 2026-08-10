import { IsNotEmpty, IsString, IsOptional, IsObject, IsIn } from 'class-validator';

export class SendNotificationDto {
  @IsNotEmpty()
  @IsString()
  targetUserId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsNotEmpty()
  @IsIn(['TRANSACTIONAL', 'ORDER', 'DELIVERY', 'REFUND', 'RETURN', 'PROMOTION', 'QUICK_DELIVERY'])
  category: 'TRANSACTIONAL' | 'ORDER' | 'DELIVERY' | 'REFUND' | 'RETURN' | 'PROMOTION' | 'QUICK_DELIVERY';

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;
}
