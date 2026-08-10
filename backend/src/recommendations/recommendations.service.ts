import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductReview, Order } from '../database/entities';

export interface RecommendationProvider {
  name: string;
  getRecommendations(context: {
    userId?: string;
    productId?: string;
    category?: string;
    limit?: number;
    segment?: string;
  }): Promise<Product[]>;
}

@Injectable()
export class RuleBasedRecommendationProvider implements RecommendationProvider {
  name = 'RuleBasedRecommendationProvider';

  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async getRecommendations(context: {
    userId?: string;
    productId?: string;
    category?: string;
    limit?: number;
    segment?: string;
  }): Promise<Product[]> {
    const limit = context.limit || 8;
    const query = this.productRepo.createQueryBuilder('product');

    if (context.category) {
      query.where('product.category = :category', { category: context.category });
    }

    query.orderBy('product.rating', 'DESC').addOrderBy('product.reviewCount', 'DESC').take(limit);

    return query.getMany();
  }
}

export type CustomerSegment =
  | 'GUEST'
  | 'FIRST_ORDER'
  | 'RETURNING_CUSTOMER'
  | 'VIP_MEMBER'
  | 'HIGH_VALUE_CUSTOMER'
  | 'GROCERY_SHOPPER'
  | 'FASHION_SHOPPER'
  | 'ELECTRONICS_SHOPPER'
  | 'FREQUENT_BUYER';

@Injectable()
export class PersonalizationService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async detectSegment(userId?: string): Promise<CustomerSegment> {
    if (!userId) return 'GUEST';

    const count = await this.orderRepo.count({ where: { customerId: userId } });
    if (count === 0) return 'FIRST_ORDER';
    if (count > 5) return 'FREQUENT_BUYER';
    return 'RETURNING_CUSTOMER';
  }
}

@Injectable()
export class RecommendationService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly provider: RuleBasedRecommendationProvider,
    private readonly personalizationService: PersonalizationService,
  ) {}

  async getHomeRecommendations(userId?: string) {
    const segment = await this.personalizationService.detectSegment(userId);
    const recommended = await this.provider.getRecommendations({ segment, limit: 10 });
    const trending = await this.productRepo.find({ order: { rating: 'DESC' }, take: 8 });
    const newArrivals = await this.productRepo.find({ order: { createdAt: 'DESC' }, take: 8 });

    return {
      segment,
      shelves: [
        { id: 'ai-recommended', title: 'Recommended For You', resolver: 'AI_RECOMMENDED', items: recommended },
        { id: 'trending-near-you', title: 'Trending Near You', resolver: 'TRENDING', items: trending },
        { id: 'new-arrivals', title: 'New For You', resolver: 'NEW', items: newArrivals },
      ],
    };
  }

  async getProductRecommendations(productId: string) {
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    const related = await this.productRepo.find({
      where: { categoryId: product.categoryId },
      take: 6,
    });
    const accessories = await this.productRepo.find({ take: 4 });

    return {
      productId,
      relatedProducts: related.filter((p) => p.id !== productId),
      frequentlyBoughtTogether: related.slice(0, 2),
      accessories,
    };
  }

  async getCartRecommendations(userId?: string) {
    const crossSell = await this.productRepo.find({ take: 6 });
    return {
      crossSellItems: crossSell,
      frequentlyBoughtTogether: crossSell.slice(0, 3),
    };
  }

  async getAccountInsights(userId?: string) {
    return {
      favoriteCategory: 'Electronics',
      favoriteBrand: 'Apple',
      mostPurchasedItem: 'AuraPods Pro ANC Earbuds',
      averageBasketValue: 2499,
      lifetimeSavingsCents: 15400,
      vipSavingsCents: 4800,
      auraCoinsEarned: 750,
      shoppingStreakDays: 3,
    };
  }

  async trackEvent(userId: string | undefined, event: any) {
    return { success: true, eventLogged: event?.type || 'GENERIC' };
  }
}
