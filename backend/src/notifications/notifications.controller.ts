import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { UpdateNotificationPreferencesDto } from './dto/update-preferences.dto';
import { SendNotificationDto } from './dto/send-notification.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Roles(Role.CUSTOMER)
  @Post('devices')
  @HttpCode(HttpStatus.CREATED)
  async registerDevice(@Request() req: any, @Body() dto: RegisterDeviceDto) {
    return this.notificationsService.registerDevice(req.user.userId, dto);
  }

  @Roles(Role.CUSTOMER)
  @Delete('devices/:token')
  @HttpCode(HttpStatus.OK)
  async unregisterDevice(@Request() req: any, @Param('token') token: string) {
    return this.notificationsService.unregisterDevice(req.user.userId, token);
  }

  @Roles(Role.CUSTOMER)
  @Get('preferences')
  async getPreferences(@Request() req: any) {
    return this.notificationsService.getPreferences(req.user.userId);
  }

  @Roles(Role.CUSTOMER)
  @Patch('preferences')
  async updatePreferences(
    @Request() req: any,
    @Body() dto: UpdateNotificationPreferencesDto,
  ) {
    return this.notificationsService.updatePreferences(req.user.userId, dto);
  }

  @Roles(Role.SUPER_ADMIN, Role.OPERATIONS)
  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendNotification(@Body() dto: SendNotificationDto) {
    return this.notificationsService.sendNotification(dto);
  }
}
