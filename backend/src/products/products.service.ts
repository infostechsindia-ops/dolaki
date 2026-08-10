import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import {
  Product,
  ProductVariant,
  Brand,
  Category,
  AttributeKey,
  AttributeValue,
  ProductVariantAttribute,
  ProductImage,
  VariantImage,
  SellerListing,
  Inventory,
  Vendor,
  ProductReview,
  AuditLog,
  Order,
  OrderItem,
} from '../database/entities';
import { AuditService } from '../audit/audit.service';
import { BrandsService } from '../brands/brands.service';
import { MASTER_CATEGORIES, MASTER_BRANDS } from '../database/master_seed_data';
import { CatalogSeeder } from '../database/catalog_seeder';

@Injectable()
export class ProductsService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(AttributeKey)
    private readonly attributeKeyRepository: Repository<AttributeKey>,
    @InjectRepository(AttributeValue)
    private readonly attributeValueRepository: Repository<AttributeValue>,
    @InjectRepository(ProductVariantAttribute)
    private readonly variantAttributeRepository: Repository<ProductVariantAttribute>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @InjectRepository(VariantImage)
    private readonly variantImageRepository: Repository<VariantImage>,
    @InjectRepository(SellerListing)
    private readonly sellerListingRepository: Repository<SellerListing>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(ProductReview)
    private readonly reviewRepository: Repository<ProductReview>,
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly auditService: AuditService,
    private readonly brandsService: BrandsService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedInitialData();
  }

  /**
   * Helper: Generate a deterministic canonical attribute signature for a variant.
   * Format: sorted pairs of keyId:valId joined by '|' e.g. "key1:val1|key2:val2"
   * Also verifies:
   * 1. Each attributeValueId belongs to attributeKeyId.
   * 2. No duplicate attributeKeyId in the variant.
   */
  async computeAttributeSignature(
    attributes?: Array<{ attributeKeyId: string; attributeValueId: string }>,
  ): Promise<string> {
    if (!attributes || attributes.length === 0) {
      return '';
    }

    const seenKeyIds = new Set<string>();
    const sortedPairs: Array<{ attributeKeyId: string; attributeValueId: string }> = [];

    for (const attr of attributes) {
      if (!attr.attributeKeyId || !attr.attributeValueId) {
        throw new BadRequestException({
          code: 'INVALID_ATTRIBUTE_PAIR',
          message: 'Both attributeKeyId and attributeValueId must be specified.',
        });
      }

      if (seenKeyIds.has(attr.attributeKeyId)) {
        throw new BadRequestException({
          code: 'DUPLICATE_ATTRIBUTE_KEY',
          message: 'Variant cannot have multiple values for the same attribute key.',
        });
      }
      seenKeyIds.add(attr.attributeKeyId);

      // Verify attributeValue belongs to attributeKey
      const valRecord = await this.attributeValueRepository.findOne({
        where: { id: attr.attributeValueId },
      });

      if (!valRecord || valRecord.attributeKeyId !== attr.attributeKeyId) {
        throw new BadRequestException({
          code: 'ATTRIBUTE_VALUE_KEY_MISMATCH',
          message: `AttributeValue '${attr.attributeValueId}' does not belong to AttributeKey '${attr.attributeKeyId}'.`,
        });
      }

      sortedPairs.push({
        attributeKeyId: attr.attributeKeyId,
        attributeValueId: attr.attributeValueId,
      });
    }

    sortedPairs.sort((a, b) => a.attributeKeyId.localeCompare(b.attributeKeyId));
    return sortedPairs.map((p) => `${p.attributeKeyId}:${p.attributeValueId}`).join('|');
  }

  /**
   * Helper: Project normalized product and variants into legacy backward-compatible DTO
   */
  projectLegacyProductDto(product: Product, variants: ProductVariant[] = []): any {
    const defaultVariant = variants.find((v) => v.isDefault) || variants[0];
    const primarySku = defaultVariant?.sku || product.sku || `SKU-${product.id}`;
    const basePrice = defaultVariant?.referenceMsrp ?? product.basePrice ?? 0.0;
    const discountPrice =
      defaultVariant?.referenceDiscountPrice ?? product.discountPrice ?? null;

    const colors = Array.from(
      new Set(
        variants
          .map((v) => v.title)
          .filter((t) => t && t !== 'Default'),
      ),
    );

    return {
      id: product.id,
      brandId: product.brandId,
      categoryId: product.categoryId,
      title: product.title,
      slug: product.slug || `slug-${product.id}`,
      description: product.description,
      status: product.status || 'ACTIVE',
      migrationStatus: product.migrationStatus || 'OK',
      isQuickCommerce: product.isQuickCommerce,
      isFlado: product.isQuickCommerce,
      rating: product.rating,
      reviewCount: product.reviewCount,
      taxClass: product.taxClass || 'STANDARD',
      imageUrl: product.imageUrl,

      // DEPRECATED BACKWARD COMPATIBILITY PROJECTIONS (Read-Only for clients)
      vendorId: product.vendorId || product.legacyVendorId,
      sku: primarySku,
      basePrice,
      discountPrice,
      colorsJson: product.colorsJson || JSON.stringify(colors),
      sizesJson: product.sizesJson || JSON.stringify([]),

      // NORMALIZED VARIANTS
      variants: variants.map((v) => ({
        id: v.id,
        productId: v.productId,
        sku: v.sku,
        gtin: v.gtin,
        title: v.title,
        attributeSignature: v.attributeSignature,
        referenceMsrp: v.referenceMsrp,
        referenceDiscountPrice: v.referenceDiscountPrice,
        netQuantity: v.netQuantity,
        unitOfMeasure: v.unitOfMeasure,
        quantityPerPack: v.quantityPerPack,
        weightKg: v.weightKg,
        isDefault: v.isDefault,
        status: v.status,
      })),
    };
  }

  async seedInitialData() {
    const productCount = await this.productRepository.count();
    if (productCount < 100) {
      // Clear old seed data safely
      await this.variantAttributeRepository.delete({});
      await this.attributeValueRepository.delete({});
      await this.attributeKeyRepository.delete({});
      await this.variantImageRepository.delete({});
      await this.productImageRepository.delete({});
      await this.sellerListingRepository.delete({});
      await this.variantRepository.delete({});
      await this.inventoryRepository.delete({});
      await this.reviewRepository.delete({});
      await this.productRepository.delete({});
      await this.brandRepository.delete({});
      await this.categoryRepository.delete({});

      // 1. Seed Master Brands (50 Brands)
      const brandMap = new Map<string, string>();
      for (const b of MASTER_BRANDS) {
        const brand = this.brandRepository.create({
          name: b.name,
          slug: b.slug,
          logoUrl: b.logoUrl,
          description: b.description,
          isActive: true,
        });
        const saved = await this.brandRepository.save(brand);
        brandMap.set(b.slug, saved.id);
      }

      // 2. Seed Master Categories (24 Categories)
      const categoryMap = new Map<string, string>();
      for (const cat of MASTER_CATEGORIES) {
        const category = this.categoryRepository.create({
          name: cat.name,
          slug: cat.slug,
          iconUrl: cat.icon,
          imageUrl: cat.imageUrl,
          status: 'ACTIVE',
          isMarketplace: true,
          isQuickCommerce: cat.isQuickCommerce || false,
        });
        const savedCat = await this.categoryRepository.save(category);
        categoryMap.set(cat.slug, savedCat.id);
      }

      // 3. Seed Default Vendor
      const vendorCount = await this.vendorRepository.count();
      let defaultVendorId = '';
      if (vendorCount === 0) {
        const vendor = this.vendorRepository.create({
          userId: 'admin-user-id-placeholder',
          storeName: 'AuraMart Flagship Store',
          storeDescription: 'Official AuraMart flagship vendor store',
          gstNumber: '29AAAAA1111A1Z1',
          isVerified: true,
          performanceScore: 4.9,
        });
        const savedVendor = await this.vendorRepository.save(vendor);
        defaultVendorId = savedVendor.id;
      } else {
        const v = await this.vendorRepository.find();
        defaultVendorId = v[0].id;
      }

      // 4. Seed 180 Master Products & Normalized Variants
      const masterProducts = CatalogSeeder.getMasterProducts();
      for (const prodData of masterProducts) {
        const catId = categoryMap.get(prodData.categorySlug) || categoryMap.get('electronics');
        const brandId = brandMap.get(prodData.brandSlug) || brandMap.get('auratech');

        const prod = this.productRepository.create({
          id: prodData.id,
          title: prodData.title,
          slug: prodData.slug,
          description: prodData.description,
          basePrice: prodData.basePrice,
          discountPrice: prodData.discountPrice || prodData.basePrice,
          sku: prodData.sku,
          isQuickCommerce: prodData.isQuickCommerce,
          imageUrl: prodData.imageUrl,
          categoryId: catId,
          brandId: brandId,
          vendorId: defaultVendorId,
          legacyVendorId: defaultVendorId,
          rating: prodData.rating || 4.5,
          reviewCount: prodData.reviewCount || 25,
          status: 'ACTIVE',
          migrationStatus: 'OK',
          colorsJson: JSON.stringify(prodData.attributes?.Color ? [prodData.attributes.Color] : []),
          sizesJson: JSON.stringify(prodData.attributes?.Size ? [prodData.attributes.Size] : []),
        });
        const savedProd = await this.productRepository.save(prod);

        // Create default variant
        const variant = this.variantRepository.create({
          productId: savedProd.id,
          sku: savedProd.sku || `SKU-${savedProd.id}`,
          title: savedProd.title,
          referenceMsrp: savedProd.basePrice,
          referenceDiscountPrice: savedProd.discountPrice,
          netQuantity: prodData.quantityPerPack || 1,
          unitOfMeasure: prodData.unitOfMeasure || 'unit',
          quantityPerPack: prodData.quantityPerPack || 1,
          isDefault: true,
          status: 'ACTIVE',
        });
        const savedVariant = await this.variantRepository.save(variant);

        // Add SellerListing
        const listing = this.sellerListingRepository.create({
          variantId: savedVariant.id,
          vendorId: defaultVendorId,
          isAvailable: true,
        });
        const savedListing = await this.sellerListingRepository.save(listing);

        // Add Inventory
        const inv = this.inventoryRepository.create({
          listingId: savedListing.id,
          variantId: savedVariant.id,
          productId: savedProd.id,
          vendorId: defaultVendorId,
          variantName: savedVariant.title,
          stockQuantity: prodData.stock || (prodData.isQuickCommerce ? 50 : 25),
          lowStockThreshold: 5,
          migrationStatus: 'OK',
        });
        await this.inventoryRepository.save(inv);
      }

      // 5. Seed Customer Reviews
      const masterReviews = CatalogSeeder.getMasterReviews();
      for (const rev of masterReviews) {
        const review = this.reviewRepository.create({
          productId: rev.productId,
          customerId: 'cust-seed-user',
          customerName: rev.customerName,
          title: rev.title,
          comment: rev.comment,
          rating: rev.rating,
          isVerifiedPurchase: rev.isVerifiedPurchase,
          helpfulCount: rev.helpfulCount,
          reportCount: 0,
          isApproved: true,
          status: 'APPROVED',
          mediaUrlsJson: JSON.stringify(rev.mediaUrls || []),
        });
        await this.reviewRepository.save(review);
      }
      console.log(`[ProductsService] Seeded ${MASTER_CATEGORIES.length} Categories, ${MASTER_BRANDS.length} Brands, ${masterProducts.length} Products & Reviews successfully.`);
    }
  }

  async findAll(query?: any): Promise<{ data: any[]; meta: any }> {
    const page = Math.max(1, Number(query?.page) || 1);
    const rawPageSize = Number(query?.pageSize || query?.limit) || 20;
    const pageSize = Math.min(100, Math.max(1, rawPageSize));

    const filters: any = {};

    // Category filter (by slug or id) — skips if 'all'
    if (query?.category && query.category !== 'all') {
      const cat = await this.categoryRepository.findOne({
        where: [{ slug: query.category }, { id: query.category }],
      });
      if (cat) {
        filters.categoryId = cat.id;
      } else {
        return { data: [], meta: { total: 0, page, pageSize, hasNextPage: false } };
      }
    }

    // Brand filter (by slug or id)
    if (query?.brand && query.brand !== 'all') {
      const b = await this.brandRepository.findOne({
        where: [{ slug: query.brand, isActive: true }, { id: query.brand, isActive: true }],
      });
      if (b) {
        filters.brandId = b.id;
      } else {
        return { data: [], meta: { total: 0, page, pageSize, hasNextPage: false } };
      }
    }

    if (query?.isQuickCommerce !== undefined) {
      filters.isQuickCommerce = query.isQuickCommerce === 'true' || query.isQuickCommerce === true;
    }

    // Default to ACTIVE products only unless admin explicitly requests others
    if (!query?.status) {
      filters.status = 'ACTIVE';
    } else if (query.status !== 'ALL') {
      filters.status = query.status;
    }

    // Dynamic order clauses
    let orderClause: any = { createdAt: 'DESC' };
    const sortParam = (query?.sort || query?.sortBy || '').toLowerCase();
    if (sortParam === 'featured' || sortParam === 'trending') {
      orderClause = { rating: 'DESC', reviewCount: 'DESC' };
    } else if (sortParam === 'bestseller' || sortParam === 'bestsellers' || sortParam === 'best_sellers') {
      orderClause = { reviewCount: 'DESC' };
    } else if (sortParam === 'rating') {
      orderClause = { rating: 'DESC' };
    } else if (sortParam === 'newest') {
      orderClause = { createdAt: 'DESC' };
    } else if (sortParam === 'price_asc' || sortParam === 'price-low') {
      orderClause = { basePrice: 'ASC' };
    } else if (sortParam === 'price_desc' || sortParam === 'price-high') {
      orderClause = { basePrice: 'DESC' };
    }

    const [list, total] = await this.productRepository.findAndCount({
      where: filters,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: orderClause,
    });

    const projectedList = await Promise.all(
      list.map(async (prod) => {
        const variants = await this.variantRepository.find({
          where: { productId: prod.id },
        });
        return this.projectLegacyProductDto(prod, variants);
      }),
    );

    return {
      data: projectedList,
      meta: {
        total,
        page,
        pageSize,
        hasNextPage: page * pageSize < total,
      },
    };
  }

  async findOne(id: string): Promise<any> {
    const prod = await this.productRepository.findOne({ where: { id } });
    if (!prod) throw new NotFoundException('Product not found');

    const variants = await this.variantRepository.find({
      where: { productId: prod.id },
    });

    return this.projectLegacyProductDto(prod, variants);
  }

  async create(data: any): Promise<any> {
    const productId = data.id || `prod-${Date.now()}`;
    const slug =
      data.slug ||
      (data.title
        ? `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${productId}`
        : productId);

    let categoryPath = '/uncategorized/';
    if (data.categoryId) {
      const cat = await this.categoryRepository.findOne({ where: { id: data.categoryId } });
      if (cat) categoryPath = cat.path;
    }

    // Validate brandId before product creation (FEAT-003 server-authoritative brand enforcement)
    if (data.brandId) {
      await this.brandsService.validateBrandId(data.brandId);
    }

    const product = this.productRepository.create({
      id: productId,
      brandId: data.brandId || null,
      categoryId: data.categoryId || 'uncategorized',
      categoryPath,
      title: data.title || 'Untitled Product',
      slug,
      description: data.description || '',
      status: data.status || 'ACTIVE',
      migrationStatus: 'OK',
      isQuickCommerce: !!data.isQuickCommerce,
      rating: data.rating || 4.5,
      reviewCount: data.reviewCount || 0,
      taxClass: data.taxClass || 'STANDARD',
      legacyVendorId: data.vendorId || null,
      vendorId: data.vendorId || null,
      imageUrl: data.imageUrl || null,
      subCategory: data.subCategory || null,
      basePrice: data.basePrice || 0,
      discountPrice: data.discountPrice || null,
      sku: data.sku || `SKU-${productId}`,
    });

    const savedProduct = await this.productRepository.save(product);
    const createdVariants: ProductVariant[] = [];

    if (data.variants && Array.isArray(data.variants) && data.variants.length > 0) {
      for (const vData of data.variants) {
        const signature = await this.computeAttributeSignature(vData.attributes);

        // Check duplicate signature under product
        const existingSig = await this.variantRepository.findOne({
          where: { productId: savedProduct.id, attributeSignature: signature },
        });
        if (existingSig) {
          throw new ConflictException({
            code: 'DUPLICATE_VARIANT_COMBINATION',
            message:
              'A variant with this exact attribute combination already exists for this product.',
          });
        }

        // Check duplicate SKU
        const vSku = vData.sku || `SKU-${savedProduct.id}-${Date.now()}-${Math.random()}`;
        const existingSku = await this.variantRepository.findOne({
          where: { sku: vSku },
        });
        if (existingSku) {
          throw new ConflictException({
            code: 'DUPLICATE_SKU',
            message: `A variant with SKU '${vSku}' already exists.`,
          });
        }

        const variant = this.variantRepository.create({
          productId: savedProduct.id,
          sku: vSku,
          gtin: vData.gtin || null,
          title: vData.title || 'Default',
          attributeSignature: signature,
          referenceMsrp: vData.referenceMsrp ?? vData.basePrice ?? savedProduct.basePrice ?? 0,
          referenceDiscountPrice:
            vData.referenceDiscountPrice ?? vData.discountPrice ?? null,
          netQuantity: vData.netQuantity || null,
          unitOfMeasure: vData.unitOfMeasure || null,
          quantityPerPack: vData.quantityPerPack || 1,
          weightKg: vData.weightKg || null,
          isDefault: !!vData.isDefault,
          status: vData.status || 'ACTIVE',
        });

        const savedVariant = await this.variantRepository.save(variant);

        // Map variant attributes
        if (vData.attributes && Array.isArray(vData.attributes)) {
          for (const attrPair of vData.attributes) {
            const pvAttr = this.variantAttributeRepository.create({
              variantId: savedVariant.id,
              attributeKeyId: attrPair.attributeKeyId,
              attributeValueId: attrPair.attributeValueId,
            });
            await this.variantAttributeRepository.save(pvAttr);
          }
        }

        createdVariants.push(savedVariant);
      }
    } else {
      // Auto-generate single Default Variant
      const defaultVariant = this.variantRepository.create({
        productId: savedProduct.id,
        sku: savedProduct.sku || `SKU-${savedProduct.id}`,
        title: savedProduct.title,
        referenceMsrp: savedProduct.basePrice || 0,
        referenceDiscountPrice: savedProduct.discountPrice || undefined,
        isDefault: true,
        status: 'ACTIVE',
      } as any);
      const savedVariant = await this.variantRepository.save(defaultVariant);
      createdVariants.push(Array.isArray(savedVariant) ? savedVariant[0] : savedVariant);
    }

    // Default Inventory & Listing
    const vendorId = savedProduct.vendorId || 'flagship-store-id';
    const primaryVariant = createdVariants[0];

    const listing = this.sellerListingRepository.create({
      variantId: primaryVariant.id,
      vendorId,
      isAvailable: true,
    });
    const savedListing = await this.sellerListingRepository.save(listing);

    const inv = this.inventoryRepository.create({
      listingId: savedListing.id,
      variantId: primaryVariant.id,
      productId: savedProduct.id,
      vendorId,
      stockQuantity: data.isQuickCommerce ? 50 : 20,
      migrationStatus: 'OK',
    });
    await this.inventoryRepository.save(inv);

    await this.auditService.log({
      action: 'PRODUCT_CREATE',
      resourceType: 'Product',
      resourceId: savedProduct.id,
      details: { title: savedProduct.title, variantsCount: createdVariants.length },
    });

    return this.projectLegacyProductDto(savedProduct, createdVariants);
  }

  async update(id: string, data: any): Promise<any> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    // Validate new brandId before applying update (FEAT-003)
    if (data.brandId !== undefined && data.brandId !== product.brandId) {
      await this.brandsService.validateBrandId(data.brandId);
    }

    Object.assign(product, data);
    const updated = await this.productRepository.save(product);

    const variants = await this.variantRepository.find({
      where: { productId: updated.id },
    });

    await this.auditService.log({
      action: 'PRODUCT_UPDATE',
      resourceType: 'Product',
      resourceId: updated.id,
      details: { title: updated.title },
    });

    return this.projectLegacyProductDto(updated, variants);
  }

  async remove(id: string): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    // Soft archive product instead of physical deletion if order history safety applies
    product.status = 'ARCHIVED';
    await this.productRepository.save(product);

    // Also soft archive associated variants
    const variants = await this.variantRepository.find({ where: { productId: id } });
    for (const v of variants) {
      v.status = 'ARCHIVED';
      await this.variantRepository.save(v);
    }
  }

  // ─── Variant Management APIs ────────────────────────────────────────────────

  async getVariants(productId: string): Promise<ProductVariant[]> {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    return this.variantRepository.find({ where: { productId } });
  }

  async createVariant(productId: string, data: any): Promise<ProductVariant> {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    const signature = await this.computeAttributeSignature(data.attributes);

    // Duplicate combination check
    if (signature) {
      const existingSig = await this.variantRepository.findOne({
        where: { productId, attributeSignature: signature },
      });
      if (existingSig) {
        throw new ConflictException({
          code: 'DUPLICATE_VARIANT_COMBINATION',
          message:
            'A variant with this exact attribute combination already exists for this product.',
        });
      }
    }

    // Duplicate SKU check
    const vSku = data.sku || `SKU-${productId}-${Date.now()}`;
    const existingSku = await this.variantRepository.findOne({
      where: { sku: vSku },
    });
    if (existingSku) {
      throw new ConflictException({
        code: 'DUPLICATE_SKU',
        message: `A variant with SKU '${vSku}' already exists.`,
      });
    }

    const variant = this.variantRepository.create({
      productId,
      sku: vSku,
      gtin: data.gtin || null,
      title: data.title || 'Variant',
      attributeSignature: signature,
      referenceMsrp: data.referenceMsrp ?? data.basePrice ?? product.basePrice ?? 0,
      referenceDiscountPrice: data.referenceDiscountPrice ?? data.discountPrice ?? null,
      netQuantity: data.netQuantity || null,
      unitOfMeasure: data.unitOfMeasure || null,
      quantityPerPack: data.quantityPerPack || 1,
      weightKg: data.weightKg || null,
      isDefault: !!data.isDefault,
      status: data.status || 'ACTIVE',
    });

    const saved = await this.variantRepository.save(variant);

    if (data.attributes && Array.isArray(data.attributes)) {
      for (const attrPair of data.attributes) {
        const pvAttr = this.variantAttributeRepository.create({
          variantId: saved.id,
          attributeKeyId: attrPair.attributeKeyId,
          attributeValueId: attrPair.attributeValueId,
        });
        await this.variantAttributeRepository.save(pvAttr);
      }
    }

    await this.auditService.log({
      action: 'VARIANT_CREATE',
      resourceType: 'ProductVariant',
      resourceId: saved.id,
      details: { sku: saved.sku, productId },
    });

    return saved;
  }

  async updateVariant(variantId: string, data: any): Promise<ProductVariant> {
    const variant = await this.variantRepository.findOne({ where: { id: variantId } });
    if (!variant) throw new NotFoundException('Variant not found');

    if (data.attributes) {
      const signature = await this.computeAttributeSignature(data.attributes);
      const existingSig = await this.variantRepository.findOne({
        where: { productId: variant.productId, attributeSignature: signature },
      });
      if (existingSig && existingSig.id !== variantId) {
        throw new ConflictException({
          code: 'DUPLICATE_VARIANT_COMBINATION',
          message:
            'A variant with this exact attribute combination already exists for this product.',
        });
      }
      variant.attributeSignature = signature;
    }

    if (data.sku && data.sku !== variant.sku) {
      const existingSku = await this.variantRepository.findOne({
        where: { sku: data.sku },
      });
      if (existingSku) {
        throw new ConflictException({
          code: 'DUPLICATE_SKU',
          message: `A variant with SKU '${data.sku}' already exists.`,
        });
      }
    }

    Object.assign(variant, data);
    const updated = await this.variantRepository.save(variant);

    await this.auditService.log({
      action: 'VARIANT_UPDATE',
      resourceType: 'ProductVariant',
      resourceId: updated.id,
      details: { sku: updated.sku },
    });

    return updated;
  }

  // ─── Categories & Brands ────────────────────────────────────────────────────

  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async createCategory(data: Partial<Category>): Promise<Category> {
    const cat = this.categoryRepository.create(data);
    return this.categoryRepository.save(cat);
  }

  async getBrands(): Promise<Brand[]> {
    // Only return active brands to public catalog callers
    return this.brandRepository.find({ where: { isActive: true }, order: { name: 'ASC' } });
  }

  async createBrand(data: Partial<Brand>): Promise<Brand> {
    const brand = this.brandRepository.create(data);
    return this.brandRepository.save(brand);
  }

  // ─── Attribute Management APIs ──────────────────────────────────────────────

  async getAttributeKeys(): Promise<AttributeKey[]> {
    return this.attributeKeyRepository.find();
  }

  async createAttributeKey(data: { name: string; code: string }): Promise<AttributeKey> {
    const key = this.attributeKeyRepository.create(data);
    return this.attributeKeyRepository.save(key);
  }

  async getAttributeValues(attributeKeyId: string): Promise<AttributeValue[]> {
    return this.attributeValueRepository.find({ where: { attributeKeyId } });
  }

  async createAttributeValue(data: {
    attributeKeyId: string;
    value: string;
    code: string;
  }): Promise<AttributeValue> {
    const val = this.attributeValueRepository.create(data);
    return this.attributeValueRepository.save(val);
  }

  // ─── Reviews & Rating Aggregation (CMD-037) ──────────────────────────────────

  async getReviews(productId: string) {
    const reviews = await this.reviewRepository.find({
      where: [{ productId, isApproved: true }, { productId, status: 'APPROVED' }],
      order: { createdAt: 'DESC' },
    });

    return reviews.map((r) => ({
      ...r,
      mediaUrls: r.mediaUrlsJson ? JSON.parse(r.mediaUrlsJson) : [],
    }));
  }

  async getRatingSummary(productId: string) {
    const reviews = await this.reviewRepository.find({
      where: [{ productId, isApproved: true }, { productId, status: 'APPROVED' }],
    });

    const totalReviews = reviews.length;
    if (totalReviews === 0) {
      return {
        averageRating: 0.0,
        formattedAverageRating: '0.0',
        totalReviews: 0,
        totalRatings: 0,
        distribution: [
          { stars: 5, count: 0, percentage: 0 },
          { stars: 4, count: 0, percentage: 0 },
          { stars: 3, count: 0, percentage: 0 },
          { stars: 2, count: 0, percentage: 0 },
          { stars: 1, count: 0, percentage: 0 },
        ],
      };
    }

    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;

    for (const r of reviews) {
      const star = Math.max(1, Math.min(5, r.rating || 5));
      counts[star] = (counts[star] || 0) + 1;
      sum += star;
    }

    const avg = Math.round((sum / totalReviews) * 10) / 10;

    return {
      averageRating: avg,
      formattedAverageRating: avg.toFixed(1),
      totalReviews,
      totalRatings: totalReviews,
      distribution: [5, 4, 3, 2, 1].map((stars) => {
        const count = counts[stars] || 0;
        const percentage = Math.round((count / totalReviews) * 100);
        return { stars, count, percentage };
      }),
    };
  }

  async addReview(
    productId: string,
    customerId: string,
    customerName: string,
    data: any,
  ) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product '${productId}' not found`);
    }

    const rating = Number(data.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be an integer between 1 and 5');
    }

    // Check verified purchase status against customer's completed orders
    const userOrders = await this.orderRepository.find({
      where: [
        { customerId, status: 'DELIVERED' },
        { customerId, status: 'SHIPPED' },
      ],
    });

    let isVerifiedPurchase = false;
    if (userOrders.length > 0) {
      const orderIds = userOrders.map((o) => o.id);
      const matchingItem = await this.orderItemRepository.findOne({
        where: { orderId: In(orderIds), productId },
      });
      if (matchingItem) {
        isVerifiedPurchase = true;
      }
    }

    const mediaUrls = Array.isArray(data.mediaUrls) ? data.mediaUrls : [];

    const review = this.reviewRepository.create({
      productId,
      customerId,
      customerName: customerName || data.customerName || 'Verified Buyer',
      title: data.title || null,
      rating,
      comment: data.comment || data.description || '',
      isVerifiedPurchase,
      mediaUrlsJson: JSON.stringify(mediaUrls),
      helpfulCount: 0,
      reportCount: 0,
      isApproved: true,
      status: 'APPROVED',
    });

    const savedReview = await this.reviewRepository.save(review);

    // Recalculate product aggregate review metrics
    const summary = await this.getRatingSummary(productId);
    product.reviewCount = summary.totalReviews;
    product.rating = summary.averageRating;
    await this.productRepository.save(product);

    return {
      ...savedReview,
      mediaUrls,
    };
  }

  async voteHelpful(reviewId: string) {
    const review = await this.reviewRepository.findOne({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');
    review.helpfulCount = (review.helpfulCount || 0) + 1;
    return this.reviewRepository.save(review);
  }

  async reportReview(reviewId: string, reason?: string) {
    const review = await this.reviewRepository.findOne({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');
    review.reportCount = (review.reportCount || 0) + 1;
    if (review.reportCount >= 3) {
      review.status = 'FLAGGED';
    }
    return this.reviewRepository.save(review);
  }

  async addVendorResponse(reviewId: string, vendorId: string, responseText: string) {
    const review = await this.reviewRepository.findOne({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');
    review.vendorId = vendorId;
    review.vendorResponseText = responseText;
    review.vendorRespondedAt = new Date();
    return this.reviewRepository.save(review);
  }

  async approveReview(reviewId: string) {
    const review = await this.reviewRepository.findOne({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');
    review.isApproved = true;
    review.status = 'APPROVED';
    return this.reviewRepository.save(review);
  }

  async getAuditLogs() {
    return this.auditLogRepository.find({
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  // CONTENT-003: PDP Buying Guides
  async getBuyingGuide(categorySlug: string) {
    const guides: Record<string, any> = {
      electronics: {
        category: 'Electronics',
        title: 'Laptop & Tech Buying Guide 2026',
        subtitle: 'Everything you need to know about processor generations, RAM capacity, and display specs.',
        bannerUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200',
        sections: [
          { title: '1. Choose the Right Processor', text: 'Intel Core Ultra 7 or AMD Ryzen 7 for heavy multitasking, Intel Core i5 for everyday browsing.' },
          { title: '2. Memory & Storage', text: '16GB RAM is recommended for 2026 applications; 512GB NVMe SSD is the baseline standard.' },
          { title: '3. Battery & Display', text: 'Look for OLED or IPS anti-glare displays with 400+ nits brightness and 8+ hours real battery life.' },
        ],
        faqs: [
          { question: 'What is the standard warranty period?', answer: 'All laptops come with 1-Year Manufacturer Warranty + 7-Day AuraMart Replacement Guarantee.' },
        ],
      },
      fashion: {
        category: 'Fashion',
        title: 'Apparel Fit & Fabric Care Guide',
        subtitle: 'Sizing standards, cotton weight ratios, and laundry instructions for premium garments.',
        bannerUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200',
        sections: [
          { title: '1. Sizing Precision', text: 'Measure chest width and sleeve length against our standard fit chart before ordering.' },
          { title: '2. Fabric Quality', text: '100% Combed Organic Cotton provides maximum breathability for summer wear.' },
        ],
        faqs: [
          { question: 'What if the size does not fit?', answer: 'We offer free door-step size exchange within 7 days of delivery.' },
        ],
      },
    };
    return guides[categorySlug] || guides.electronics;
  }

  // CONTENT-003: Product Comparison Engine
  async compareProducts(productIds: string[]) {
    if (!productIds || productIds.length === 0) return { products: [] };
    const idsToFetch = productIds.slice(0, 4);
    const products = await Promise.all(idsToFetch.map((id) => this.findOne(id).catch(() => null)));
    const valid = products.filter(Boolean);

    return {
      total: valid.length,
      products: valid.map((p) => ({
        id: p.id,
        title: p.title || p.name,
        brand: p.brand,
        price: p.discountPrice || p.basePrice || p.price,
        mrp: p.basePrice || p.originalPrice,
        rating: p.rating,
        imageUrl: p.imageUrl || p.image,
        specifications: p.specifications || {},
        inStock: (p.inventoryQuantity ?? 10) > 0,
      })),
    };
  }

  // CONTENT-003: Frequently Bought Together Bundles
  async getBundles(productId: string) {
    const mainProd = await this.findOne(productId).catch(() => null);
    if (!mainProd) return { bundle: null };

    const allProds = await this.findAll({ limit: 10 });
    const addOns = (allProds.data || [])
      .filter((p: any) => p.id !== productId)
      .slice(0, 2);

    const items = [mainProd, ...addOns];
    const totalMRP = items.reduce((acc, item: any) => acc + (item.originalPrice || item.basePrice || item.price || 0), 0);
    const totalPrice = items.reduce((acc, item: any) => acc + (item.price || item.discountPrice || item.basePrice || 0), 0);
    const bundleDiscount = Math.round((totalPrice * 0.95)); // 5% extra bundle discount

    return {
      bundle: {
        id: `bndl-${productId}`,
        title: 'Frequently Bought Together',
        items,
        totalMRP,
        totalPrice,
        bundleDiscountPrice: bundleDiscount,
        savingsAmount: totalMRP - bundleDiscount,
      },
    };
  }

  // CONTENT-003: Recommendation Resolvers
  async getRecommendations(productId: string, type: string = 'RELATED') {
    const allProds = await this.findAll({ limit: 20 });
    const list = (allProds.data || []).filter((p: any) => p.id !== productId);

    // Support RECOMMENDED_AI placeholder
    let result = list;
    if (type === 'BUDGET_ALTERNATIVES') {
      result = list.filter((p: any) => (p.price || 0) < 2000);
    } else if (type === 'PREMIUM_ALTERNATIVES') {
      result = list.filter((p: any) => (p.price || 0) >= 2000);
    }

    return {
      resolverType: type,
      total: result.length,
      products: result.slice(0, 10),
    };
  }

  // CONTENT-003: Q&A Engine
  private qnaStore: Record<string, any[]> = {};

  async getQna(productId: string) {
    if (!this.qnaStore[productId]) {
      this.qnaStore[productId] = [
        {
          id: `q-${productId}-1`,
          question: 'Does this product come with official brand warranty?',
          askedBy: 'Rahul M.',
          askedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          answers: [
            {
              id: `a-${productId}-1`,
              answer: 'Yes, 100% authentic product with 1-Year Official Brand Warranty included.',
              answeredBy: 'AuraMart Seller Support',
              isOfficial: true,
              answeredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
              helpfulCount: 14,
            },
          ],
        },
      ];
    }
    return { questions: this.qnaStore[productId] };
  }

  async addQuestion(productId: string, userId: string, text: string) {
    if (!this.qnaStore[productId]) this.qnaStore[productId] = [];
    const newQ = {
      id: `q-${Date.now()}`,
      question: text,
      askedBy: userId || 'Verified Buyer',
      askedAt: new Date().toISOString(),
      answers: [],
    };
    this.qnaStore[productId].unshift(newQ);
    return newQ;
  }

  // CONTENT-003: Serviceability & PIN Code Checker
  async checkServiceability(productId: string, pincode: string) {
    const cleanPincode = (pincode || '').trim();
    if (!/^\d{6}$/.test(cleanPincode)) {
      return {
        serviceable: false,
        pincode: cleanPincode,
        message: 'Invalid 6-digit Indian PIN Code',
      };
    }

    const prod = await this.findOne(productId).catch(() => null);
    const isFlado = prod?.isQuickCommerce || false;

    if (isFlado) {
      const isExpressZone = ['110001', '400001', '560001', '842001', '275101'].includes(cleanPincode);
      return {
        serviceable: true,
        pincode: cleanPincode,
        deliveryType: 'FLADO_EXPRESS',
        etaMessage: isExpressZone ? '⚡ Express 10-Minute Delivery Available!' : '📦 Standard 2-Hour Grocery Delivery Available',
        codAvailable: true,
        freeDelivery: true,
      };
    }

    return {
      serviceable: true,
      pincode: cleanPincode,
      deliveryType: 'STANDARD_MARKETPLACE',
      etaMessage: '🚚 Delivery by Tomorrow, 5:00 PM',
      codAvailable: true,
      freeDelivery: true,
    };
  }

  // CONTENT-004: Enterprise Search & Discovery Engine
  private searchAnalyticsLog: Array<{ query: string; resultCount: number; timestamp: string }> = [];

  async searchProducts(queryStr: string, filters?: any, sortBy: string = 'relevance', page: number = 1, limit: number = 20) {
    const cleanQuery = (queryStr || '').toLowerCase().trim();
    const allProds = await this.findAll({ limit: 100 });
    let list = allProds.data || [];

    // Query filtering
    if (cleanQuery) {
      list = list.filter((p: any) => {
        const title = (p.title || p.name || '').toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        return title.includes(cleanQuery) || brand.includes(cleanQuery) || cat.includes(cleanQuery) || desc.includes(cleanQuery);
      });
    }

    // Facet filtering
    if (filters?.category) {
      list = list.filter((p: any) => p.category === filters.category);
    }
    if (filters?.brand) {
      const brandsArr = Array.isArray(filters.brand) ? filters.brand : [filters.brand];
      list = list.filter((p: any) => brandsArr.includes(p.brand));
    }
    if (filters?.minPrice) {
      list = list.filter((p: any) => (p.price || 0) >= Number(filters.minPrice));
    }
    if (filters?.maxPrice) {
      list = list.filter((p: any) => (p.price || 0) <= Number(filters.maxPrice));
    }
    if (filters?.minRating) {
      list = list.filter((p: any) => (p.rating || 0) >= Number(filters.minRating));
    }

    // Server-authoritative sorting
    if (sortBy === 'price_asc') {
      list.sort((a: any, b: any) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price_desc') {
      list.sort((a: any, b: any) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'rating') {
      list.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'newest') {
      list.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    // Record analytics
    if (cleanQuery) {
      this.recordSearchAnalytics(cleanQuery, list.length);
    }

    return {
      query: cleanQuery,
      total: list.length,
      page,
      limit,
      totalPages: Math.ceil(list.length / limit),
      products: paginated,
    };
  }

  async getSearchSuggestions(queryStr: string) {
    const q = (queryStr || '').toLowerCase().trim();
    if (!q) {
      return {
        trending: ['AirPods Pro', 'MacBook Air M3', 'Nike Pegasus', 'Organic Milk', 'OLED TV'],
        categories: ['electronics', 'fashion', 'beauty', 'groceries', 'home'],
        brands: ['Apple', 'Samsung', 'Nike', 'Sony', 'boAt'],
        products: [],
      };
    }

    const allProds = await this.findAll({ limit: 100 });
    const list = allProds.data || [];

    const productMatches = list
      .filter((p: any) => (p.title || p.name || '').toLowerCase().includes(q) || (p.brand || '').toLowerCase().includes(q))
      .slice(0, 5)
      .map((p: any) => ({ id: p.id, title: p.title || p.name, category: p.category, price: p.price, imageUrl: p.imageUrl || p.image }));

    const categoryMatches = Array.from(new Set(list.filter((p: any) => (p.category || '').toLowerCase().includes(q)).map((p: any) => p.category))).slice(0, 3);
    const brandMatches = Array.from(new Set(list.filter((p: any) => (p.brand || '').toLowerCase().includes(q)).map((p: any) => p.brand))).slice(0, 3);

    return {
      query: q,
      categories: categoryMatches,
      brands: brandMatches,
      products: productMatches,
    };
  }

  async getCategoryFacets(categorySlug: string) {
    const allProds = await this.findAll({ limit: 100 });
    const list = (allProds.data || []).filter((p: any) => p.category === categorySlug);

    const brands = Array.from(new Set(list.map((p: any) => p.brand).filter(Boolean)));
    const prices = list.map((p: any) => p.price || 0);
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 100000;

    return {
      category: categorySlug,
      totalProducts: list.length,
      facets: {
        brands: brands.map((b) => ({ name: b, count: list.filter((p: any) => p.brand === b).length })),
        priceRange: { min: minPrice, max: maxPrice },
        ratings: [
          { label: '4★ & above', value: 4, count: list.filter((p: any) => (p.rating || 0) >= 4).length },
          { label: '3★ & above', value: 3, count: list.filter((p: any) => (p.rating || 0) >= 3).length },
        ],
        availability: {
          inStockCount: list.filter((p: any) => (p.inventoryQuantity ?? 10) > 0).length,
          fladoExpressCount: list.filter((p: any) => p.isQuickCommerce).length,
        },
      },
    };
  }

  async recordSearchAnalytics(query: string, resultCount: number) {
    this.searchAnalyticsLog.unshift({
      query,
      resultCount,
      timestamp: new Date().toISOString(),
    });
    if (this.searchAnalyticsLog.length > 100) this.searchAnalyticsLog.pop();
    return { success: true };
  }
}
