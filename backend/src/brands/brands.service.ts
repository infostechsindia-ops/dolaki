import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Brand, Product } from '../database/entities';

export interface BrandDto {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string | null;
  isActive: boolean;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // ─── Project Brand to DTO (with product count) ────────────────────────────
  private async projectBrandDto(brand: Brand): Promise<BrandDto> {
    const productCount = await this.productRepository.count({
      where: { brandId: brand.id, status: 'ACTIVE', isActive: true },
    });
    return {
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      logoUrl: brand.logoUrl ?? null,
      description: brand.description ?? null,
      isActive: brand.isActive,
      productCount,
      createdAt: brand.createdAt,
      updatedAt: brand.updatedAt,
    };
  }

  /**
   * List active brands with optional search, category filtering, pagination.
   * Only isActive=true brands are returned to the public.
   * Admins can pass includeInactive=true.
   */
  async findAll(query?: {
    page?: number;
    pageSize?: number;
    search?: string;
    includeInactive?: boolean;
  }): Promise<{ data: BrandDto[]; meta: any }> {
    const page = Math.max(1, Number(query?.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(query?.pageSize) || 50));

    const where: any = {};

    // Only active brands unless explicitly requesting inactive (admin only)
    if (!query?.includeInactive) {
      where.isActive = true;
    }

    // Search by name (case-insensitive)
    let brands: Brand[];
    let total: number;

    if (query?.search) {
      // ILike for case-insensitive partial match
      [brands, total] = await this.brandRepository.findAndCount({
        where: [
          { ...where, name: ILike(`%${query.search}%`) },
        ],
        order: { name: 'ASC' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
    } else {
      [brands, total] = await this.brandRepository.findAndCount({
        where,
        order: { name: 'ASC' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
    }

    const data = await Promise.all(brands.map((b) => this.projectBrandDto(b)));

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
   * Get brand by slug with product count.
   * Returns 404 if brand is inactive (unless admin override).
   */
  async findBySlug(slug: string, allowInactive = false): Promise<BrandDto> {
    const brand = await this.brandRepository.findOne({ where: { slug } });

    if (!brand) {
      throw new NotFoundException({
        code: 'BRAND_NOT_FOUND',
        message: `Brand '${slug}' not found.`,
      });
    }

    if (!allowInactive && !brand.isActive) {
      throw new NotFoundException({
        code: 'BRAND_INACTIVE',
        message: `Brand '${slug}' is not active.`,
      });
    }

    return this.projectBrandDto(brand);
  }

  /**
   * Get brand by ID (used internally for validation).
   */
  async findById(id: string): Promise<Brand | null> {
    return this.brandRepository.findOne({ where: { id } });
  }

  /**
   * Validate that a brandId is valid and active.
   * Throws BadRequestException if invalid or inactive.
   */
  async validateBrandId(brandId: string | null | undefined): Promise<void> {
    if (!brandId) return; // null brandId is allowed (product without brand)

    const brand = await this.brandRepository.findOne({ where: { id: brandId } });

    if (!brand) {
      throw new BadRequestException({
        code: 'INVALID_BRAND_ID',
        message: `Brand '${brandId}' does not exist.`,
      });
    }

    if (!brand.isActive) {
      throw new BadRequestException({
        code: 'BRAND_INACTIVE',
        message: `Brand '${brandId}' is inactive and cannot be assigned to products.`,
      });
    }
  }

  /**
   * Create a new brand. Slug must be unique.
   */
  async create(data: {
    name: string;
    slug: string;
    logoUrl?: string;
    description?: string;
    isActive?: boolean;
  }): Promise<BrandDto> {
    if (!data.name || !data.slug) {
      throw new BadRequestException({
        code: 'BRAND_MISSING_FIELDS',
        message: 'Brand name and slug are required.',
      });
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(data.slug)) {
      throw new BadRequestException({
        code: 'BRAND_INVALID_SLUG',
        message: 'Brand slug must contain only lowercase letters, digits, and hyphens.',
      });
    }

    // Unique slug check
    const existing = await this.brandRepository.findOne({ where: { slug: data.slug } });
    if (existing) {
      throw new ConflictException({
        code: 'BRAND_SLUG_CONFLICT',
        message: `A brand with slug '${data.slug}' already exists.`,
      });
    }

    const brand = this.brandRepository.create({
      name: data.name,
      slug: data.slug,
      logoUrl: data.logoUrl ?? null,
      description: data.description ?? null,
      isActive: data.isActive !== false, // default true
    } as Partial<Brand>);

    const saved = await this.brandRepository.save(brand);
    return this.projectBrandDto(saved);
  }

  /**
   * Update a brand by slug.
   */
  async update(
    slug: string,
    data: {
      name?: string;
      logoUrl?: string;
      description?: string;
      isActive?: boolean;
    },
  ): Promise<BrandDto> {
    const brand = await this.brandRepository.findOne({ where: { slug } });
    if (!brand) {
      throw new NotFoundException({
        code: 'BRAND_NOT_FOUND',
        message: `Brand '${slug}' not found.`,
      });
    }

    if (data.name !== undefined) brand.name = data.name;
    if (data.logoUrl !== undefined) brand.logoUrl = data.logoUrl;
    if (data.description !== undefined) brand.description = data.description;
    if (data.isActive !== undefined) brand.isActive = data.isActive;

    const saved = await this.brandRepository.save(brand);
    return this.projectBrandDto(saved);
  }

  /**
   * Soft-deactivate a brand by slug.
   * Does NOT delete the brand. Sets isActive=false.
   * Products under the brand remain but brand is hidden from public listing.
   */
  async deactivate(slug: string): Promise<{ message: string }> {
    const brand = await this.brandRepository.findOne({ where: { slug } });
    if (!brand) {
      throw new NotFoundException({
        code: 'BRAND_NOT_FOUND',
        message: `Brand '${slug}' not found.`,
      });
    }

    brand.isActive = false;
    await this.brandRepository.save(brand);

    return { message: `Brand '${slug}' has been deactivated.` };
  }
}
