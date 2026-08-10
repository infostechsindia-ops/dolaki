import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { Public } from '../auth/guards';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles';

/**
 * BrandsController — FEAT-003 Dynamic Brand Catalog & Filter Engine
 *
 * Authorization model:
 *  - Public reads: @Public() — brand list, brand detail
 *  - Create/Update: SUPER_ADMIN, CATALOG_ADMIN
 *  - Deactivate (soft delete): SUPER_ADMIN
 */
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  /**
   * GET /brands
   * List all active brands with optional search + pagination.
   * Admins may pass ?includeInactive=true to see all brands.
   * @Public() — no auth required for customer catalog browsing.
   */
  @Public()
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('search') search?: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    return this.brandsService.findAll({
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 50,
      search: search || undefined,
      includeInactive: includeInactive === 'true',
    });
  }

  /**
   * GET /brands/:slug
   * Get brand detail by slug with product count.
   * @Public() — required for brand store pages.
   */
  @Public()
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.brandsService.findBySlug(slug);
  }

  /**
   * POST /brands
   * Create a new brand. Admin-only.
   */
  @Roles(Role.SUPER_ADMIN, Role.CATALOG_ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: any) {
    return this.brandsService.create(body);
  }

  /**
   * PUT /brands/:slug
   * Update brand name, logo, description, or isActive status. Admin-only.
   */
  @Roles(Role.SUPER_ADMIN, Role.CATALOG_ADMIN)
  @Put(':slug')
  update(@Param('slug') slug: string, @Body() body: any) {
    return this.brandsService.update(slug, body);
  }

  /**
   * DELETE /brands/:slug
   * Soft-deactivate a brand (sets isActive=false). SUPER_ADMIN only.
   */
  @Roles(Role.SUPER_ADMIN)
  @Delete(':slug')
  deactivate(@Param('slug') slug: string) {
    return this.brandsService.deactivate(slug);
  }
}
