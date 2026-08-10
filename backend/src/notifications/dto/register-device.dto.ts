import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';

export class RegisterDeviceDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsIn(['IOS', 'ANDROID', 'WEB'])
  platform: 'IOS' | 'ANDROID' | 'WEB';

  @IsOptional()
  @IsString()
  deviceId?: string;
}
