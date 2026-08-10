import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Category, Product, CategoryAttributeKey } from '../database/entities';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(CategoryAttributeKey)
    private readonly categoryAttributeKeyRepository: Repository<CategoryAttributeKey>,
    private readonly auditService: AuditService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Helper: Segment-safe path check whether candidatePath is inside parentPath
   */
  isSegmentSubpath(candidatePath: string, parentPath: string): boolean {
    return candidatePath.startsWith(parentPath);
  }

  /**
   * GET /categories/tree — Returns public nested category tree with safety limits
   */
  async getCategoriesTree(query?: {
    surface?: 'marketplace' | 'quick-commerce';
    maxDepth?: number;
  }): Promise<any[]> {
    const rawMaxDepth = Number(query?.maxDepth);
    const maxDepth = Math.min(5, Math.max(0, isNaN(rawMaxDepth) ? 3 : rawMaxDepth));
    const surface = query?.surface || 'marketplace';

    // Fetch all active categories sorted by level & display order
    const allCategories = await this.categoryRepository.find({
      where: { status: 'ACTIVE' },
      order: { depth: 'ASC', displayOrder: 'ASC', name: 'ASC' },
    });

    const categoryMap = new Map<string, Category>();
    allCategories.forEach((c) => categoryMap.set(c.id, c));

    // Filter categories whose complete ancestor chain is ACTIVE
    const validCategories = allCategories.filter((c) => {
      const segments = c.path.split('/').filter(Boolean);
      return segments.every((id) => {
        const ancestor = categoryMap.get(id);
        return ancestor && ancestor.status === 'ACTIVE';
      });
    });

    // Surface pruning logic
    const surfaceMap = new Set<string>();
    validCategories.forEach((c) => {
      const isEligible =
        surface === 'quick-commerce' ? c.isQuickCommerce : c.isMarketplace;

      if (isEligible) {
        // Add item and all ancestor IDs to surfaceMap so structural containers are retained
        const segments = c.path.split('/').filter(Boolean);
        segments.forEach((id) => surfaceMap.add(id));
      }
    });

    const surfaceFilteredCategories = validCategories.filter((c) =>
      surfaceMap.has(c.id),
    );

    // Build nested tree recursively up to maxDepth
    const buildNodes = (parentId: string | null, currentDepth: number): any[] => {
      if (currentDepth > maxDepth) return [];

      return surfaceFilteredCategories
        .filter((c) => (c.parentId || null) === parentId && c.depth === currentDepth)
        .map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          path: c.path,
          depth: c.depth,
          displayOrder: c.displayOrder,
          iconUrl: c.iconUrl,
          imageUrl: c.imageUrl,
          bannerUrl: c.bannerUrl,
          isMarketplace: c.isMarketplace,
          isQuickCommerce: c.isQuickCommerce,
          children: buildNodes(c.id, currentDepth + 1),
        }));
    };

    return buildNodes(null, 0);
  }

  /**
   * GET /categories/:slug — Single category detail with breadcrumb path
   */
  async getCategoryBySlug(slug: string): Promise<any> {
    const category = await this.categoryRepository.findOne({ where: { slug } });
    if (!category) throw new NotFoundException(`Category with slug '${slug}' not found.`);

    // Build breadcrumbs path from path segments
    const segments = category.path.split('/').filter(Boolean);
    const breadcrumbs: Array<{ id: string; name: string; slug: string }> = [];

    for (const id of segments) {
      const ancestor = await this.categoryRepository.findOne({ where: { id } });
      if (ancestor) {
        breadcrumbs.push({
          id: ancestor.id,
          name: ancestor.name,
          slug: ancestor.slug,
        });
      }
    }

    const children = await this.categoryRepository.find({
      where: { parentId: category.id, status: 'ACTIVE' },
      order: { displayOrder: 'ASC', name: 'ASC' },
    });

    return {
      ...category,
      breadcrumbs,
      children: children.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        iconUrl: c.iconUrl,
        imageUrl: c.imageUrl,
      })),
    };
  }

  /**
   * GET /categories — Paginated collection envelope
   */
  async findAll(query?: any): Promise<{ data: Category[]; meta: any }> {
    const page = Math.max(1, Number(query?.page) || 1);
    const rawPageSize = Number(query?.pageSize) || 20;
    const pageSize = Math.min(100, Math.max(1, rawPageSize));

    const where: any = {};
    if (query?.status) where.status = query.status;
    if (query?.parentId !== undefined)
      where.parentId = query.parentId === 'null' ? null : query.parentId;

    const [data, total] = await this.categoryRepository.findAndCount({
      where,
      order: { depth: 'ASC', displayOrder: 'ASC', name: 'ASC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        hasNextPage: page * pageSize < total,
      },
    };
  }

  /**
   * POST /categories — Admin category creation
   */
  async create(data: Partial<Category>): Promise<Category> {
    if (!data.name) throw new BadRequestException('Category name is required.');

    const slug =
      data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existingSlug = await this.categoryRepository.findOne({ where: { slug } });
    if (existingSlug) {
      throw new ConflictException({
        code: 'DUPLICATE_CATEGORY_SLUG',
        message: `Category slug '${slug}' already exists.`,
      });
    }

    let parentPath = '/';
    let parentDepth = -1;

    if (data.parentId) {
      const parent = await this.categoryRepository.findOne({
        where: { id: data.parentId },
      });
      if (!parent)
        throw new NotFoundException(`Parent category '${data.parentId}' not found.`);
      parentPath = parent.path;
      parentDepth = parent.depth;
    }

    const categoryId = data.id || `cat-${Date.now()}`;
    const path = `${parentPath}${categoryId}/`;
    const depth = parentDepth + 1;

    const category = this.categoryRepository.create({
      ...data,
      id: categoryId,
      slug,
      path,
      depth,
      status: data.status || 'ACTIVE',
      migrationStatus: 'OK',
      isMarketplace: data.isMarketplace !== undefined ? data.isMarketplace : true,
      isQuickCommerce: data.isQuickCommerce !== undefined ? data.isQuickCommerce : false,
      displayOrder: data.displayOrder || 0,
    });

    const saved = await this.categoryRepository.save(category);

    await this.auditService.log({
      action: 'CATEGORY_CREATE',
      resourceType: 'Category',
      resourceId: saved.id,
      details: { name: saved.name, slug: saved.slug, path: saved.path },
    });

    return saved;
  }

  /**
   * PUT /categories/:id — Admin category update & transactional move
   */
  async update(id: string, data: Partial<Category>): Promise<Category> {
    if (data.parentId !== undefined) {
      return this.moveCategory(id, data.parentId || null, data);
    }

    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException(`Category '${id}' not found.`);

    if (data.slug && data.slug !== category.slug) {
      const existingSlug = await this.categoryRepository.findOne({
        where: { slug: data.slug },
      });
      if (existingSlug) {
        throw new ConflictException({
          code: 'DUPLICATE_CATEGORY_SLUG',
          message: `Category slug '${data.slug}' already exists.`,
        });
      }
    }

    Object.assign(category, data);
    const updated = await this.categoryRepository.save(category);

    await this.auditService.log({
      action: 'CATEGORY_UPDATE',
      resourceType: 'Category',
      resourceId: updated.id,
      details: { name: updated.name, status: updated.status },
    });

    return updated;
  }

  /**
   * Segment-safe Transactional Re-Parenting Engine
   */
  async moveCategory(
    categoryId: string,
    newParentId: string | null,
    extraData?: Partial<Category>,
  ): Promise<Category> {
    return await this.dataSource.transaction(async (manager) => {
      const category = await manager.findOne(Category, { where: { id: categoryId } });
      if (!category) throw new NotFoundException(`Category '${categoryId}' not found.`);

      // Segment-safe self parent check
      if (newParentId === categoryId) {
        throw new BadRequestException({
          code: 'INVALID_CATEGORY_PARENT',
          message: 'A category cannot be its own parent.',
        });
      }

      let newPath = `/${categoryId}/`;
      let newDepth = 0;

      if (newParentId) {
        const newParent = await manager.findOne(Category, {
          where: { id: newParentId },
        });
        if (!newParent)
          throw new NotFoundException(`Target parent category '${newParentId}' not found.`);

        // Segment-safe cycle check using slash boundaries
        if (newParent.path.includes(`/${categoryId}/`)) {
          throw new BadRequestException({
            code: 'CATEGORY_CYCLE_DETECTED',
            message: 'Cannot move category under one of its own descendants.',
          });
        }

        newPath = `${newParent.path}${categoryId}/`;
        newDepth = newParent.depth + 1;
      }

      const oldPath = category.path;
      category.parentId = newParentId;
      category.path = newPath;
      category.depth = newDepth;
      if (extraData) Object.assign(category, extraData);

      const savedCategory = await manager.save(category);

      // Rewriting descendant paths & depths
      const descendants = await manager
        .createQueryBuilder(Category, 'c')
        .where('c.path LIKE :oldPathPrefix', { oldPathPrefix: `${oldPath}%` })
        .andWhere('c.id != :id', { id: categoryId })
        .getMany();

      for (const desc of descendants) {
        desc.path = desc.path.replace(oldPath, newPath);
        desc.depth = (desc.path.match(/\//g) || []).length - 2;
        await manager.save(desc);
      }

      // Sync derived product categoryPath projections
      await manager
        .createQueryBuilder()
        .update(Product)
        .set({ categoryPath: () => `REPLACE(categoryPath, '${oldPath}', '${newPath}')` })
        .where('categoryPath LIKE :oldPathPrefix', { oldPathPrefix: `${oldPath}%` })
        .execute();

      await this.auditService.log({
        action: 'CATEGORY_MOVE',
        resourceType: 'Category',
        resourceId: categoryId,
        details: { oldPath, newPath, newParentId },
      });

      return savedCategory;
    });
  }

  /**
   * PUT /categories/reorder — Parent-scoped batch reordering
   */
  async reorderCategories(
    parentId: string | null,
    items: Array<{ id: string; displayOrder: number }>,
  ): Promise<{ success: boolean }> {
    if (!items || !Array.isArray(items)) {
      throw new BadRequestException('Items array is required for reordering.');
    }

    const normParentId = parentId === 'null' ? null : parentId;

    // Verify all reordered items belong to specified parentId scope
    for (const item of items) {
      const cat = await this.categoryRepository.findOne({ where: { id: item.id } });
      if (!cat) throw new NotFoundException(`Category '${item.id}' not found.`);

      if ((cat.parentId || null) !== normParentId) {
        throw new BadRequestException({
          code: 'INVALID_REORDER_SCOPE',
          message: `Category '${item.id}' does not belong to parentId scope '${normParentId}'.`,
        });
      }

      cat.displayOrder = item.displayOrder;
      await this.categoryRepository.save(cat);
    }

    await this.auditService.log({
      action: 'CATEGORY_REORDER',
      resourceType: 'Category',
      resourceId: normParentId || 'root',
      details: { itemsCount: items.length },
    });

    return { success: true };
  }

  /**
   * DELETE /categories/:id — Admin soft-archive with descendant safety check
   */
  async archiveCategory(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException(`Category '${id}' not found.`);

    // Rejection of active descendants
    const activeChildren = await this.categoryRepository.count({
      where: { parentId: id, status: In(['ACTIVE', 'DRAFT']) },
    });

    if (activeChildren > 0) {
      throw new BadRequestException({
        code: 'CATEGORY_HAS_ACTIVE_DESCENDANTS',
        message:
          'Cannot archive a category with active descendants. Re-parent or archive child categories first.',
      });
    }

    category.status = 'ARCHIVED';
    const saved = await this.categoryRepository.save(category);

    await this.auditService.log({
      action: 'CATEGORY_ARCHIVE',
      resourceType: 'Category',
      resourceId: id,
      details: { name: saved.name },
    });

    return saved;
  }
}
