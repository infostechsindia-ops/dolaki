import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SduiService } from './sdui.service';
import { RolesGuard, Public } from '../auth/guards';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles';

/**
 * CMD-006: SDUI controller authorization model.
 *
 * GET endpoints: @Public() — SDUI layout reads are public catalog data (unauthenticated clients fetch them)
 * POST endpoints: @Roles(SUPER_ADMIN) — CMS writes require super admin
 *
 * CMD-007 (CMS extension) will add CATALOG_ADMIN to write roles and introduce
 * full content management RBAC. For now, SUPER_ADMIN is the only write role.
 */
@Controller('sdui')
export class SduiController {
  constructor(private readonly sduiService: SduiService) {}

  @Public()
  @Get('homepage')
  getHomepage() {
    return this.sduiService.getHomepageLayout();
  }

  /**
   * POST /sdui/homepage — CMS write; requires SUPER_ADMIN or CATALOG_ADMIN
   */
  @Roles(Role.SUPER_ADMIN, Role.CATALOG_ADMIN)
  @Post('homepage')
  saveHomepage(@Body() config: any) {
    return this.sduiService.saveHomepageLayout(config);
  }

  @Roles(Role.SUPER_ADMIN, Role.CATALOG_ADMIN)
  @Get('revisions')
  getRevisions() {
    return this.sduiService.getRevisions();
  }

  @Roles(Role.SUPER_ADMIN, Role.CATALOG_ADMIN)
  @Post('revisions/restore/:version')
  restoreRevision(@Param('version') version: number) {
    return this.sduiService.restoreRevision(version);
  }

  @Public()
  @Post('analytics/track')
  trackEvent(@Body() body: { sectionId: string; eventType: 'view' | 'click' | 'order'; revenuePaise?: number }) {
    return this.sduiService.recordAnalyticsEvent(body);
  }

  @Roles(Role.SUPER_ADMIN, Role.CATALOG_ADMIN, Role.OPERATIONS)
  @Get('analytics/summary')
  getAnalyticsSummary() {
    return this.sduiService.getAnalyticsSummary();
  }

  @Public()
  @Get('flado')
  getFlado() {
    return this.sduiService.getFladoLayout();
  }

  /**
   * POST /sdui/flado — CMS write; requires SUPER_ADMIN or CATALOG_ADMIN
   */
  @Roles(Role.SUPER_ADMIN, Role.CATALOG_ADMIN)
  @Post('flado')
  saveFlado(@Body() config: any) {
    return this.sduiService.saveFladoLayout(config);
  }

  @Public()
  @Get('category/:slug')
  getCategory(@Param('slug') slug: string) {
    return this.sduiService.getCategoryLayout(slug);
  }
}
