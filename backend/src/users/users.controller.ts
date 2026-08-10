import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UpdateNotificationPreferencesDto } from '../notifications/dto/update-preferences.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get('profile')
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findOneById(req.user.userId);
    const wallet = await this.usersService.getWallet(req.user.userId);
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      wallet: {
        balance: wallet.balance,
        rewardPoints: wallet.rewardPoints,
      },
    };
  }

  @Get('addresses')
  getAddresses(@Request() req: any) {
    return this.usersService.getAddresses(req.user.userId);
  }

  @Post('addresses')
  addAddress(@Request() req: any, @Body() body: any) {
    return this.usersService.addAddress(req.user.userId, body);
  }

  @Delete('addresses/:id')
  deleteAddress(@Request() req: any, @Param('id') addressId: string) {
    return this.usersService.deleteAddress(req.user.userId, addressId);
  }

  @Patch('addresses/:id')
  updateAddress(
    @Request() req: any,
    @Param('id') addressId: string,
    @Body() body: any,
  ) {
    return this.usersService.updateAddress(req.user.userId, addressId, body);
  }

  @Patch('addresses/:id/default')
  setDefaultAddress(
    @Request() req: any,
    @Param('id') addressId: string,
  ) {
    return this.usersService.setDefaultAddress(req.user.userId, addressId);
  }

  @Get('wishlist')
  getWishlist(@Request() req: any) {
    return this.usersService.getWishlist(req.user.userId);
  }

  @Post('wishlist')
  addToWishlist(@Request() req: any, @Body('productId') productId: string) {
    return this.usersService.addToWishlist(req.user.userId, productId);
  }

  @Delete('wishlist/:productId')
  removeFromWishlist(
    @Request() req: any,
    @Param('productId') productId: string,
  ) {
    return this.usersService.removeFromWishlist(req.user.userId, productId);
  }

  @Get('wallet')
  getWalletBalance(@Request() req: any) {
    return this.usersService.getWallet(req.user.userId);
  }

  @Get('wallet/transactions')
  getWalletTransactions(@Request() req: any) {
    return this.usersService.getWalletTransactions(req.user.userId);
  }

  @Roles(Role.CUSTOMER)
  @Get('notification-preferences')
  getNotificationPreferences(@Request() req: any) {
    return this.notificationsService.getPreferences(req.user.userId);
  }

  @Roles(Role.CUSTOMER)
  @Patch('notification-preferences')
  updateNotificationPreferences(
    @Request() req: any,
    @Body() dto: UpdateNotificationPreferencesDto,
  ) {
    return this.notificationsService.updatePreferences(req.user.userId, dto);
  }

  @Roles(Role.SUPER_ADMIN)
  @Get()
  findAllUsers() {
    return this.usersService.findAll();
  }
}
