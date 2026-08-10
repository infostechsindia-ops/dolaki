import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import crypto from 'crypto';
import {
  SellerListing,
  SellerListingPriceOverride,
  Promotion,
  TaxCategory,
  ProductVariant,
  Product,
  InventoryLocation,
  Vendor,
  Coupon,
} from '../database/entities';
import {
  CalculatePriceDto,
  PriceCalculationResultDto,
  PriceBreakdownItemDto,
  PriceSummaryDto,
  AppliedRuleDto,
  CreatePromotionDto,
  CreatePriceOverrideDto,
} from './pricing.dto';
import { Role } from '../auth/roles';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class PriceEngineService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(SellerListing)
    private readonly listingRepository: Repository<SellerListing>,
    @InjectRepository(SellerListingPriceOverride)
    private readonly overrideRepository: Repository<SellerListingPriceOverride>,
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    @InjectRepository(TaxCategory)
    private readonly taxCategoryRepository: Repository<TaxCategory>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(InventoryLocation)
    private readonly locationRepository: Repository<InventoryLocation>,
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
    private readonly auditService: AuditService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedTaxCategories();
  }

  private async seedTaxCategories() {
    const count = await this.taxCategoryRepository.count();
    if (count === 0) {
      const defaults = [
        { code: 'STANDARD', name: 'Standard Rate GST/VAT', rateBasisPoints: 500 },
        { code: 'ZERO', name: 'Zero Rated', rateBasisPoints: 0 },
        { code: 'EXEMPT', name: 'Exempt', rateBasisPoints: 0 },
      ];
      for (const d of defaults) {
        const cat = this.taxCategoryRepository.create(d as any);
        await this.taxCategoryRepository.save(cat);
      }
    }
  }

  async calculatePrice(
    dto: CalculatePriceDto,
    reqUser?: any,
  ): Promise<PriceCalculationResultDto> {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Pricing calculation requires at least one line item');
    }

    // 1. Single Authoritative Pricing Timestamp
    const pricingInstant = dto.pricingInstant
      ? new Date(dto.pricingInstant)
      : new Date();
    const isTaxInclusive = dto.isTaxInclusive !== false; // Default: tax-inclusive

    // 2. Fetch tax categories for lookup
    const taxCategories = await this.taxCategoryRepository.find();
    const taxMap = new Map<string, number>();
    taxCategories.forEach((tc) => taxMap.set(tc.code, tc.rateBasisPoints));

    const breakdownItems: PriceBreakdownItemDto[] = [];
    const appliedRules: AppliedRuleDto[] = [];

    let totalItemsSubtotalMinor = 0;
    let totalItemDiscountMinor = 0;

    // 3. Process line items
    for (const itemDto of dto.items) {
      const listing = await this.listingRepository.findOne({
        where: { id: itemDto.sellerListingId },
      });
      if (!listing) {
        throw new NotFoundException(`Seller listing ${itemDto.sellerListingId} not found`);
      }

      const variant = await this.variantRepository.findOne({
        where: { id: listing.variantId },
      });
      if (!variant) {
        throw new NotFoundException(`Variant ${listing.variantId} not found`);
      }

      const product = await this.productRepository.findOne({
        where: { id: variant.productId },
      });

      // Resolve base price (SellerListing.priceMinor)
      let basePriceMinor = listing.priceMinor || 0;

      // Check Location Price Override if locationId specified
      const targetLocationId = itemDto.locationId || dto.locationId;
      if (targetLocationId) {
        const location = await this.locationRepository.findOne({
          where: { id: targetLocationId },
        });
        if (location) {
          // TENANT INVARIANT: Validate location belongs to listing tenant
          const isCompatibleVendor = listing.vendorId && location.vendorId === listing.vendorId;
          const isCompatibleShop = listing.shopId && location.shopId === listing.shopId;
          if (!isCompatibleVendor && !isCompatibleShop) {
            throw new BadRequestException({
              code: 'INCOMPATIBLE_LOCATION_PRICE_OVERRIDE',
              message: `Location ${targetLocationId} does not belong to listing seller/shop tenant`,
            });
          }

          const override = await this.overrideRepository.findOne({
            where: {
              sellerListingId: listing.id,
              locationId: targetLocationId,
              status: 'ACTIVE',
            },
          });

          if (override) {
            const isWindowActive =
              (!override.startsAt || override.startsAt <= pricingInstant) &&
              (!override.endsAt || override.endsAt >= pricingInstant);
            if (isWindowActive && override.priceMinor > 0) {
              basePriceMinor = override.priceMinor;
            }
          }
        }
      }

      // If priceMinor is 0 and variant has referenceMsrpMinor, fall back for reference
      const referenceMsrpMinor = Math.round(variant.referenceMsrp * 100) || basePriceMinor;
      if (basePriceMinor === 0 && referenceMsrpMinor > 0) {
        basePriceMinor = referenceMsrpMinor;
      }

      // 4. Evaluate Eligible Promotions (Deterministic Precedence & Anti-Stacking)
      const surfaceFilter = dto.surface || 'ALL';
      const eligiblePromos = await this.promotionRepository.find({
        where: {
          isActive: true,
          startsAt: LessThanOrEqual(pricingInstant),
          endsAt: MoreThanOrEqual(pricingInstant),
        },
      });

      let bestPromo: Promotion | null = null;
      let maxPromoSavingsMinor = 0;

      for (const promo of eligiblePromos) {
        // Surface check
        if (promo.surface !== 'ALL' && promo.surface !== surfaceFilter) continue;

        // Vendor scope check (Vendor promos must match seller)
        if (promo.vendorId && promo.vendorId !== listing.vendorId) continue;

        // Target check
        let isMatch = false;
        if (promo.targetType === 'ALL') isMatch = true;
        else if (promo.targetType === 'SELLER_LISTING' && promo.targetId === listing.id) isMatch = true;
        else if (promo.targetType === 'VARIANT' && promo.targetId === variant.id) isMatch = true;
        else if (promo.targetType === 'BRAND' && product && promo.targetId === product.brandId) isMatch = true;
        else if (promo.targetType === 'CATEGORY' && product && promo.targetId === product.categoryId) isMatch = true;

        if (!isMatch) continue;

        // Calculate potential savings for this promotion
        let promoSavingsMinor = 0;
        if (promo.discountType === 'PERCENT') {
          promoSavingsMinor = Math.round((basePriceMinor * promo.discountValue) / 10000);
        } else if (promo.discountType === 'FLAT_AMOUNT') {
          promoSavingsMinor = promo.discountValue;
        }

        promoSavingsMinor = Math.min(basePriceMinor, Math.max(0, promoSavingsMinor));

        // Deterministic Selection: Maximum Savings > Priority DESC > ID ASC
        if (
          !bestPromo ||
          promoSavingsMinor > maxPromoSavingsMinor ||
          (promoSavingsMinor === maxPromoSavingsMinor && promo.priority > bestPromo.priority) ||
          (promoSavingsMinor === maxPromoSavingsMinor && promo.priority === bestPromo.priority && promo.id < bestPromo.id)
        ) {
          bestPromo = promo;
          maxPromoSavingsMinor = promoSavingsMinor;
        }
      }

      const itemDiscountMinor = maxPromoSavingsMinor;
      const effectiveUnitPriceMinor = Math.max(0, basePriceMinor - itemDiscountMinor);
      const lineSubtotalMinor = effectiveUnitPriceMinor * itemDto.quantity;

      if (bestPromo && itemDiscountMinor > 0) {
        appliedRules.push({
          ruleId: bestPromo.id,
          ruleType: bestPromo.type,
          title: bestPromo.title,
          discountMinor: itemDiscountMinor * itemDto.quantity,
        });
      }

      // Tax calculation
      const taxClass = product?.taxClass || 'STANDARD';
      const rateBasisPoints = taxMap.get(taxClass) ?? 500;
      let taxAmountMinor = 0;
      let taxableSubtotalMinor = lineSubtotalMinor;

      if (isTaxInclusive) {
        // Tax-inclusive: extract tax from lineSubtotal
        taxableSubtotalMinor = Math.round((lineSubtotalMinor * 10000) / (10000 + rateBasisPoints));
        taxAmountMinor = lineSubtotalMinor - taxableSubtotalMinor;
      } else {
        // Tax-exclusive: add tax on top of lineSubtotal
        taxAmountMinor = Math.round((lineSubtotalMinor * rateBasisPoints) / 10000);
        taxableSubtotalMinor = lineSubtotalMinor;
      }

      totalItemsSubtotalMinor += lineSubtotalMinor;
      totalItemDiscountMinor += itemDiscountMinor * itemDto.quantity;

      breakdownItems.push({
        sellerListingId: listing.id,
        variantId: variant.id,
        sku: variant.sku,
        title: `${product?.title || 'Product'} (${variant.title})`,
        vendorId: listing.vendorId,
        shopId: listing.shopId || null,
        quantity: itemDto.quantity,
        referenceMsrpMinor,
        basePriceMinor,
        effectiveUnitPriceMinor,
        itemDiscountMinor,
        lineSubtotalMinor,
        taxableSubtotalMinor,
        taxClass,
        taxAmountMinor,
        formattedUnitPrice: (effectiveUnitPriceMinor / 100).toFixed(2),
        formattedLineSubtotal: (lineSubtotalMinor / 100).toFixed(2),
      });
    }

    // 5. Read-Only Order-Level Coupon Evaluation
    let couponDiscountMinor = 0;
    if (dto.couponCode) {
      const coupon = await this.couponRepository.findOne({
        where: { code: dto.couponCode.toUpperCase(), isActive: true },
      });

      if (coupon) {
        const couponMinAmount = coupon.minOrderAmountMinor || Math.round(coupon.minOrderAmount * 100);
        if (totalItemsSubtotalMinor >= couponMinAmount && !coupon.isRedeemed && coupon.usedCount < coupon.maxUses) {
          let calculatedCouponDiscount = 0;
          const couponValMinor = coupon.valueMinor || Math.round(coupon.value * 100);

          if (coupon.type === 'FLAT') {
            calculatedCouponDiscount = couponValMinor;
          } else if (coupon.type === 'PERCENT' || coupon.discountPercent > 0) {
            const pct = coupon.discountPercent || coupon.value;
            calculatedCouponDiscount = Math.round((totalItemsSubtotalMinor * pct) / 100);
          }

          if (coupon.maxDiscountAmountMinor && coupon.maxDiscountAmountMinor > 0) {
            calculatedCouponDiscount = Math.min(calculatedCouponDiscount, coupon.maxDiscountAmountMinor);
          }

          couponDiscountMinor = Math.min(totalItemsSubtotalMinor, Math.max(0, calculatedCouponDiscount));

          if (couponDiscountMinor > 0) {
            appliedRules.push({
              ruleId: coupon.id,
              ruleType: 'COUPON',
              title: `Coupon ${coupon.code}`,
              discountMinor: couponDiscountMinor,
            });
          }
        }
      }
    }

    // 6. Tax & Fee Summaries
    const taxTotalMinor = breakdownItems.reduce((acc, item) => acc + item.taxAmountMinor, 0);
    const deliveryFeeMinor = 0; // Explicit placeholder - fees deferred
    const deliveryFeeStatus = 'NOT_IMPLEMENTED_DEFERRED';

    const netItemTotalMinor = Math.max(0, totalItemsSubtotalMinor - couponDiscountMinor);
    const finalTotalMinor = isTaxInclusive
      ? netItemTotalMinor + deliveryFeeMinor
      : netItemTotalMinor + taxTotalMinor + deliveryFeeMinor;

    const summary: PriceSummaryDto = {
      itemsSubtotalMinor: totalItemsSubtotalMinor,
      totalItemDiscountMinor,
      couponDiscountMinor,
      taxTotalMinor,
      deliveryFeeMinor,
      deliveryFeeStatus,
      finalTotalMinor,
      currency: breakdownItems[0]?.sellerListingId ? 'INR' : 'INR',
      formattedFinalTotal: (finalTotalMinor / 100).toFixed(2),
    };

    // 7. Cryptographic Snapshot Hash for Checkout Validation
    const snapshotPayload = JSON.stringify({
      instant: pricingInstant.toISOString(),
      items: breakdownItems.map((i) => ({ s: i.sellerListingId, q: i.quantity, p: i.effectiveUnitPriceMinor })),
      summary: { total: finalTotalMinor, coupon: couponDiscountMinor },
    });

    const pricingSnapshotHash = crypto.createHash('sha256').update(snapshotPayload).digest('hex');

    return {
      items: breakdownItems,
      summary,
      appliedRules,
      pricingInstant: pricingInstant.toISOString(),
      pricingSnapshotHash,
    };
  }

  async createPromotion(dto: CreatePromotionDto, reqUser: any): Promise<Promotion> {
    let vendorId: string | null = null;

    if (reqUser?.role === Role.VENDOR_OWNER || reqUser?.role === Role.VENDOR_STAFF) {
      const vendor = await this.vendorRepository.findOne({
        where: { userId: reqUser.userId },
      });
      if (!vendor) {
        throw new ForbiddenException('Vendor account not found for user');
      }
      vendorId = vendor.id;

      // Vendor A cannot create promo for Vendor B
      if (dto.targetType === 'SELLER_LISTING' && dto.targetId) {
        const listing = await this.listingRepository.findOne({
          where: { id: dto.targetId },
        });
        if (!listing || listing.vendorId !== vendorId) {
          throw new ForbiddenException('Vendor can only create promotions for their own seller listings');
        }
      }
    } else if (reqUser?.role !== Role.SUPER_ADMIN && reqUser?.role !== Role.OPERATIONS) {
      throw new ForbiddenException('Only vendors, ops, or super admins can create promotions');
    }

    const promotion = this.promotionRepository.create({
      ...dto,
      startsAt: new Date(dto.startsAt),
      endsAt: new Date(dto.endsAt),
      vendorId,
      priority: dto.priority || 0,
      isActive: true,
    });

    const saved = await this.promotionRepository.save(promotion);

    await this.auditService.log({
      actorId: reqUser.userId,
      actorRole: reqUser.role,
      action: 'PROMOTION_CREATED',
      resourceType: 'Promotion',
      resourceId: saved.id,
      vendorId: vendorId || undefined,
      details: { title: saved.title, type: saved.type, discountValue: saved.discountValue },
    });

    return saved;
  }

  async createPriceOverride(
    dto: CreatePriceOverrideDto,
    reqUser: any,
  ): Promise<SellerListingPriceOverride> {
    const listing = await this.listingRepository.findOne({
      where: { id: dto.sellerListingId },
    });
    if (!listing) {
      throw new NotFoundException(`Seller listing ${dto.sellerListingId} not found`);
    }

    // Ownership authorization
    if (reqUser?.role === Role.VENDOR_OWNER || reqUser?.role === Role.VENDOR_STAFF) {
      const vendor = await this.vendorRepository.findOne({
        where: { userId: reqUser.userId },
      });
      if (!vendor || listing.vendorId !== vendor.id) {
        throw new ForbiddenException('Vendor cannot set price override on another seller listing');
      }
    } else if (reqUser?.role !== Role.SUPER_ADMIN && reqUser?.role !== Role.OPERATIONS) {
      throw new ForbiddenException('Unauthorized to set price override');
    }

    // Location tenant compatibility check
    if (dto.locationId) {
      const location = await this.locationRepository.findOne({
        where: { id: dto.locationId },
      });
      if (!location) {
        throw new NotFoundException(`Location ${dto.locationId} not found`);
      }

      const isCompatibleVendor = listing.vendorId && location.vendorId === listing.vendorId;
      const isCompatibleShop = listing.shopId && location.shopId === listing.shopId;
      if (!isCompatibleVendor && !isCompatibleShop) {
        throw new BadRequestException({
          code: 'INCOMPATIBLE_LOCATION_PRICE_OVERRIDE',
          message: `Location ${dto.locationId} does not belong to listing seller/shop tenant`,
        });
      }
    }

    const override = this.overrideRepository.create({
      sellerListingId: dto.sellerListingId,
      locationId: dto.locationId || null,
      priceMinor: dto.priceMinor,
      compareAtPriceMinor: dto.compareAtPriceMinor || null,
      startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
      endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
      status: 'ACTIVE',
    });

    const saved = await this.overrideRepository.save(override);

    await this.auditService.log({
      actorId: reqUser.userId,
      actorRole: reqUser.role,
      action: 'SELLER_LISTING_PRICE_OVERRIDE_CREATED',
      resourceType: 'SellerListingPriceOverride',
      resourceId: saved.id,
      vendorId: listing.vendorId || undefined,
      shopId: listing.shopId || undefined,
      details: { priceMinor: saved.priceMinor, locationId: saved.locationId },
    });

    return saved;
  }
}
