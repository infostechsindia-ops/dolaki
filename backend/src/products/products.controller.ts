import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/roles.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get('categories')
  getCategories() {
    return this.productsService.getCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get(':id/reviews')
  getReviews(@Param('id') id: string) {
    return this.productsService.getReviews(id);
  }

  @Post(':id/reviews')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  addReview(@Param('id') id: string, @Request() req: any, @Body() body: any) {
    return this.productsService.addReview(id, req.user.userId, req.user.fullName || 'Customer', body);
  }

  @Put(':id/reviews/:reviewId/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  approveReview(@Param('reviewId') reviewId: string) {
    return this.productsService.approveReview(reviewId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDOR', 'ADMIN')
  create(@Body() body: any) {
    return this.productsService.create(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDOR', 'ADMIN')
  update(@Param('id') id: string, @Body() body: any) {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('audit-log')
  @Roles('ADMIN')
  getAuditLogs() {
    return this.productsService.getAuditLogs();
  }
}
