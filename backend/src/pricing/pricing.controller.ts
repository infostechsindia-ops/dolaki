import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { PriceEngineService } from './pricing.service';
import {
  CalculatePriceDto,
  CreatePromotionDto,
  CreatePriceOverrideDto,
} from './pricing.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles';
import { Public } from '../auth/guards';
import { Idempotent } from '../idempotency/idempotency.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant, SellerListing, Product } from '../database/entities';

@Controller('pricing')
export class PricingController {
  constructor(
    private readonly priceEngineService: PriceEngineService,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
    @InjectRepository(SellerListing)
    private readonly listingRepository: Repository<SellerListing>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  @Post('calculate')
  @Roles(
    Role.CUSTOMER,
    Role.VENDOR_OWNER,
    Role.VENDOR_STAFF,
    Role.MERCHANT_OWNER,
    Role.MERCHANT_MANAGER,
    Role.SUPER_ADMIN,
    Role.OPERATIONS,
  )
  async calculatePrice(@Body() dto: CalculatePriceDto, @Req() req: any) {
    return this.priceEngineService.calculatePrice(dto, req.user);
  }

  @Public()
  @Get('catalog/:variantId')
  async getCatalogPriceProjection(@Param('variantId') variantId: string) {
    const variant = await this.variantRepository.findOne({
      where: { id: variantId },
    });
    if (!variant) {
      throw new NotFoundException(`Variant ${variantId} not found`);
    }

    const listing = await this.listingRepository.findOne({
      where: { variantId, isAvailable: true },
      order: { createdAt: 'ASC' },
    });

    const basePriceMinor = listing?.priceMinor || Math.round(variant.referenceMsrp * 100);

    return {
      variantId: variant.id,
      sku: variant.sku,
      title: variant.title,
      referenceMsrpMinor: Math.round(variant.referenceMsrp * 100),
      basePriceMinor,
      currency: listing?.currency || 'INR',
      formattedBasePrice: (basePriceMinor / 100).toFixed(2),
    };
  }

  @Post('promotions')
  @Roles(Role.SUPER_ADMIN, Role.OPERATIONS, Role.VENDOR_OWNER, Role.VENDOR_STAFF)
  async createPromotion(@Body() dto: CreatePromotionDto, @Req() req: any) {
    return this.priceEngineService.createPromotion(dto, req.user);
  }

  @Post('seller-listings/:id/override')
  @Roles(Role.SUPER_ADMIN, Role.OPERATIONS, Role.VENDOR_OWNER, Role.MERCHANT_OWNER)
  @Idempotent({ operation: 'PRICE_UPDATE' })
  async createPriceOverride(
    @Param('id') sellerListingId: string,
    @Body() dto: CreatePriceOverrideDto,
    @Req() req: any,
  ) {
    return this.priceEngineService.createPriceOverride(
      { ...dto, sellerListingId },
      req.user,
    );
  }
}
