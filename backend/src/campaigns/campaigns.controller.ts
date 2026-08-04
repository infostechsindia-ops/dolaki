import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/roles.decorator';

@Controller()
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get('flash-sales/active')
  getActiveFlashSales() {
    return this.campaignsService.getActiveFlashSales();
  }

  @Post('admin/flash-sales')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  createFlashSale(@Body() body: any) {
    return this.campaignsService.createFlashSale(body);
  }

  @Put('admin/flash-sales/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateFlashSale(@Param('id') id: string, @Body() body: any) {
    return this.campaignsService.updateFlashSale(id, body);
  }

  @Get('banners')
  getActiveBanners(@Query('position') position?: string, @Query('city') city?: string) {
    return this.campaignsService.getActiveBanners(position, city);
  }

  @Post('admin/banners')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  createBanner(@Body() body: any) {
    return this.campaignsService.createBanner(body);
  }

  @Delete('admin/banners/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  deleteBanner(@Param('id') id: string) {
    return this.campaignsService.deleteBanner(id);
  }
}
