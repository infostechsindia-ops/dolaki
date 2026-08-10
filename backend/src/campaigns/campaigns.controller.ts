import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { Public } from '../auth/guards';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles';

@Controller()
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Public()
  @Get('flash-sales/active')
  getActiveFlashSales() {
    return this.campaignsService.getActiveFlashSales();
  }

  @Roles(Role.SUPER_ADMIN)
  @Post('admin/flash-sales')
  createFlashSale(@Body() body: any) {
    return this.campaignsService.createFlashSale(body);
  }

  @Roles(Role.SUPER_ADMIN)
  @Put('admin/flash-sales/:id')
  updateFlashSale(@Param('id') id: string, @Body() body: any) {
    return this.campaignsService.updateFlashSale(id, body);
  }

  @Public()
  @Get('banners')
  getActiveBanners(
    @Query('position') position?: string,
    @Query('city') city?: string,
  ) {
    return this.campaignsService.getActiveBanners(position, city);
  }

  @Roles(Role.SUPER_ADMIN)
  @Post('admin/banners')
  createBanner(@Body() body: any) {
    return this.campaignsService.createBanner(body);
  }

  @Roles(Role.SUPER_ADMIN)
  @Public()
  @Get('campaigns')
  getCampaigns(@Query('enabledOnly') enabledOnly?: string) {
    return this.campaignsService.getSeasonalCampaigns({ enabledOnly: enabledOnly === 'true' });
  }

  @Public()
  @Get('campaigns/:slug')
  getCampaignBySlug(@Param('slug') slug: string) {
    return this.campaignsService.getCampaignBySlug(slug);
  }

  @Roles(Role.SUPER_ADMIN, Role.CATALOG_ADMIN)
  @Post('admin/campaigns')
  createCampaign(@Body() body: any) {
    return this.campaignsService.createCampaign(body);
  }

  @Roles(Role.SUPER_ADMIN, Role.CATALOG_ADMIN)
  @Put('admin/campaigns/:id')
  updateCampaign(@Param('id') id: string, @Body() body: any) {
    return this.campaignsService.updateCampaign(id, body);
  }
}
