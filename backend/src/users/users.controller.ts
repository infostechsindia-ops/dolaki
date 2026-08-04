import { Controller, Get, Post, Delete, Param, Body, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
      }
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

  @Get('wishlist')
  getWishlist(@Request() req: any) {
    return this.usersService.getWishlist(req.user.userId);
  }

  @Post('wishlist')
  addToWishlist(@Request() req: any, @Body('productId') productId: string) {
    return this.usersService.addToWishlist(req.user.userId, productId);
  }

  @Delete('wishlist/:productId')
  removeFromWishlist(@Request() req: any, @Param('productId') productId: string) {
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

  @Get()
  @Roles('ADMIN')
  findAllUsers() {
    return this.usersService.findAll();
  }
}
