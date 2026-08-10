import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  Req,
  Res,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';
import { CmsAssetsService, UploadAssetDto } from './cms-assets.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles';
import { Public } from '../auth/guards';

@Controller('admin/cms/assets')
export class CmsAssetsController {
  constructor(private readonly cmsAssetsService: CmsAssetsService) {}

  /**
   * POST /api/v1/admin/cms/assets — Upload a CMS media asset
   * Requires SUPER_ADMIN or CATALOG_ADMIN
   */
  @Roles(Role.SUPER_ADMIN, Role.CATALOG_ADMIN)
  @Post()
  async uploadAsset(@Body() body: UploadAssetDto, @Req() req: any) {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      throw new ForbiddenException('User authentication identity required');
    }
    return this.cmsAssetsService.uploadAsset(body, userId);
  }

  /**
   * GET /api/v1/admin/cms/assets — List CMS media assets (Paginated)
   * Accessible by Admin Roles
   */
  @Roles(Role.SUPER_ADMIN, Role.CATALOG_ADMIN, Role.OPERATIONS, Role.SUPPORT)
  @Get()
  async getAssets(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('assetType') assetType?: string,
  ) {
    return this.cmsAssetsService.getAssets({ page, limit, search, assetType });
  }

  /**
   * GET /api/v1/admin/cms/assets/:id — Get specific asset metadata
   */
  @Roles(Role.SUPER_ADMIN, Role.CATALOG_ADMIN, Role.OPERATIONS, Role.SUPPORT)
  @Get(':id')
  async getAssetById(@Param('id') id: string) {
    return this.cmsAssetsService.getAssetById(id);
  }

  /**
   * DELETE /api/v1/admin/cms/assets/:id — Delete unreferenced asset
   * Requires SUPER_ADMIN or CATALOG_ADMIN
   */
  @Roles(Role.SUPER_ADMIN, Role.CATALOG_ADMIN)
  @Delete(':id')
  async deleteAsset(@Param('id') id: string) {
    return this.cmsAssetsService.deleteAsset(id);
  }

  /**
   * Public file delivery endpoint for local development upload assets
   * GET /api/v1/admin/cms/assets/file/:key
   */
  @Public()
  @Get('file/:key')
  async serveFile(@Param('key') key: string, @Res() res: any) {
    const { filePath, mimeType } = await this.cmsAssetsService.getAssetFilePath(key);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.sendFile(filePath);
  }
}
