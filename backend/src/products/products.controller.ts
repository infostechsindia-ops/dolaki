import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Throttle } from '@nestjs/throttler';
import { ProductOwnerGuard, Public } from '../auth/guards';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles';
import { PageQueryDto } from '../common/dto/pagination.dto';

/**
 * CMD-006: Products controller authorization model.
 *
 * Public reads (catalog browsing): @Public()
 * Review submission: CUSTOMER only
 * Review approval: SUPER_ADMIN / CATALOG_ADMIN only
 * Product create/update: VENDOR_OWNER + ProductOwnerGuard (ownership check)
 *   SUPER_ADMIN may create/update without ownership check (bypassed in ProductOwnerGuard)
 * Product delete: SUPER_ADMIN / CATALOG_ADMIN only (destructive)
 */
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  findAll(@Query() query: PageQueryDto) {
    return this.productsService.findAll(query);
  }

  @Public()
  @Get('categories')
  getCategories() {
    return this.productsService.getCategories();
  }

  @Public()
  @Get('brands')
  getBrands() {
    return this.productsService.getBrands();
  }

  @Public()
  @Get('search')
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  searchProducts(
    @Query('q') q?: string,
    @Query('category') category?: string,
    @Query('brand') brand?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('minRating') minRating?: number,
    @Query('sortBy') sortBy?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.productsService.searchProducts(q || '', { category, brand, minPrice, maxPrice, minRating }, sortBy || 'relevance', page || 1, limit || 20);
  }

  @Public()
  @Get('search/suggestions')
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  getSearchSuggestions(@Query('q') q?: string) {
    return this.productsService.getSearchSuggestions(q || '');
  }

  @Public()
  @Get('facets/:category')
  getCategoryFacets(@Param('category') category: string) {
    return this.productsService.getCategoryFacets(category);
  }

  @Public()
  @Post('search/analytics')
  recordSearchAnalytics(@Body() body: { query: string; resultCount: number }) {
    return this.productsService.recordSearchAnalytics(body?.query || '', body?.resultCount || 0);
  }

  @Public()
  @Get('buying-guides/:category')
  getBuyingGuide(@Param('category') category: string) {
    return this.productsService.getBuyingGuide(category);
  }

  @Public()
  @Post('compare')
  compareProducts(@Body() body: { productIds: string[] }) {
    return this.productsService.compareProducts(body?.productIds || []);
  }

  @Public()
  @Get(':id/bundles')
  getBundles(@Param('id') id: string) {
    return this.productsService.getBundles(id);
  }

  @Public()
  @Get(':id/recommendations')
  getRecommendations(@Param('id') id: string, @Query('type') type?: string) {
    return this.productsService.getRecommendations(id, type);
  }

  @Public()
  @Get(':id/qna')
  getQna(@Param('id') id: string) {
    return this.productsService.getQna(id);
  }

  @Roles(Role.CUSTOMER)
  @Post(':id/qna/question')
  addQuestion(@Param('id') id: string, @Request() req: any, @Body() body: { question: string }) {
    return this.productsService.addQuestion(id, req.user?.userId || 'Customer', body?.question || '');
  }

  @Public()
  @Post(':id/serviceability')
  checkServiceability(@Param('id') id: string, @Body() body: { pincode: string }) {
    return this.productsService.checkServiceability(id, body?.pincode || '');
  }

  @Public()
  @Get('attributes/keys')
  getAttributeKeys() {
    return this.productsService.getAttributeKeys();
  }

  @Public()
  @Get('attributes/keys/:keyId/values')
  getAttributeValues(@Param('keyId') keyId: string) {
    return this.productsService.getAttributeValues(keyId);
  }

  @Roles(Role.SUPER_ADMIN, Role.CATALOG_ADMIN)
  @Post('attributes/keys')
  createAttributeKey(@Body() body: any) {
    return this.productsService.createAttributeKey(body);
  }

  @Roles(Role.SUPER_ADMIN, Role.CATALOG_ADMIN)
  @Post('attributes/values')
  createAttributeValue(@Body() body: any) {
    return this.productsService.createAttributeValue(body);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Public()
  @Get(':id/variants')
  getVariants(@Param('id') id: string) {
    return this.productsService.getVariants(id);
  }

  @Roles(Role.VENDOR_OWNER, Role.SUPER_ADMIN, Role.CATALOG_ADMIN)
  @UseGuards(ProductOwnerGuard)
  @Post(':id/variants')
  createVariant(@Param('id') id: string, @Body() body: any) {
    return this.productsService.createVariant(id, body);
  }

  @Roles(Role.VENDOR_OWNER, Role.SUPER_ADMIN, Role.CATALOG_ADMIN)
  @UseGuards(ProductOwnerGuard)
  @Put(':id/variants/:variantId')
  updateVariant(
    @Param('id') id: string,
    @Param('variantId') variantId: string,
    @Body() body: any,
  ) {
    return this.productsService.updateVariant(variantId, body);
  }

  @Public()
  @Get(':id/reviews')
  getReviews(@Param('id') id: string) {
    return this.productsService.getReviews(id);
  }

  @Public()
  @Get(':id/reviews/summary')
  getRatingSummary(@Param('id') id: string) {
    return this.productsService.getRatingSummary(id);
  }

  @Roles(Role.CUSTOMER)
  @Post(':id/reviews')
  addReview(@Param('id') id: string, @Request() req: any, @Body() body: any) {
    return this.productsService.addReview(
      id,
      req.user.userId,
      req.user.fullName || 'Customer',
      body,
    );
  }

  @Roles(Role.CUSTOMER)
  @Post(':id/reviews/:reviewId/vote')
  voteHelpful(@Param('reviewId') reviewId: string) {
    return this.productsService.voteHelpful(reviewId);
  }

  @Public()
  @Post(':id/reviews/:reviewId/report')
  reportReview(@Param('reviewId') reviewId: string, @Body() body: any) {
    return this.productsService.reportReview(reviewId, body?.reason);
  }

  @Roles(Role.VENDOR_OWNER, Role.MERCHANT_OWNER, Role.SUPER_ADMIN)
  @Post(':id/reviews/:reviewId/response')
  addVendorResponse(@Param('reviewId') reviewId: string, @Request() req: any, @Body() body: any) {
    return this.productsService.addVendorResponse(
      reviewId,
      req.user.userId,
      body?.responseText || body?.response || '',
    );
  }

  @Roles(Role.SUPER_ADMIN, Role.CATALOG_ADMIN, Role.OPERATIONS)
  @Put(':id/reviews/:reviewId/approve')
  approveReview(@Param('reviewId') reviewId: string) {
    return this.productsService.approveReview(reviewId);
  }

  @Roles(Role.VENDOR_OWNER, Role.SUPER_ADMIN)
  @UseGuards(ProductOwnerGuard)
  @Post()
  create(@Body() body: any) {
    return this.productsService.create(body);
  }

  @Roles(Role.VENDOR_OWNER, Role.SUPER_ADMIN, Role.CATALOG_ADMIN)
  @UseGuards(ProductOwnerGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.productsService.update(id, body);
  }

  @Roles(Role.SUPER_ADMIN, Role.CATALOG_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}

@Controller('admin')
export class AdminController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(Role.SUPER_ADMIN, Role.OPERATIONS)
  @Get('audit-log')
  getAuditLogs() {
    return this.productsService.getAuditLogs();
  }
}
