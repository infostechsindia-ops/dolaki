import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Public } from '../auth/guards';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles';
import { PageQueryDto } from '../common/dto/pagination.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get('tree')
  getCategoriesTree(
    @Query('surface') surface?: 'marketplace' | 'quick-commerce',
    @Query('maxDepth') maxDepth?: number,
  ) {
    return this.categoriesService.getCategoriesTree({ surface, maxDepth });
  }

  @Public()
  @Get('slug/:slug')
  getCategoryBySlug(@Param('slug') slug: string) {
    return this.categoriesService.getCategoryBySlug(slug);
  }

  @Public()
  @Get()
  findAll(@Query() query: PageQueryDto) {
    return this.categoriesService.findAll(query);
  }

  @Roles(Role.SUPER_ADMIN, Role.CATALOG_ADMIN)
  @Post()
  create(@Body() body: any) {
    return this.categoriesService.create(body);
  }

  @Roles(Role.SUPER_ADMIN, Role.CATALOG_ADMIN)
  @Put('reorder')
  reorderCategories(@Body() body: { parentId?: string | null; items: any[] }) {
    return this.categoriesService.reorderCategories(body.parentId || null, body.items);
  }

  @Roles(Role.SUPER_ADMIN, Role.CATALOG_ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.categoriesService.update(id, body);
  }

  @Roles(Role.SUPER_ADMIN, Role.CATALOG_ADMIN)
  @Delete(':id')
  archiveCategory(@Param('id') id: string) {
    return this.categoriesService.archiveCategory(id);
  }
}
