export interface PersonalizedShelf {
  id: string;
  title: string;
  subtitle?: string;
  productIds: string[];
}

export interface CustomerInsightsSummary {
  segment: string;
  favoriteCategory: string;
  favoriteBrand: string;
  totalOrders: number;
  totalSavedFormatted: string;
  auraCoinsBalance: number;
  vipPassActive: boolean;
}

export class PersonalizationService {
  getPersonalizedShelves(segment = 'RETURNING_CUSTOMER'): PersonalizedShelf[] {
    return [
      {
        id: 'recommended_for_you',
        title: 'Recommended For You',
        subtitle: 'Curated based on your browsing & order history',
        productIds: ['p1', 'p3', 'p5', 'p8'],
      },
      {
        id: 'buy_again',
        title: 'Buy Again',
        subtitle: 'Quick re-order your frequent purchases',
        productIds: ['prod-milk-1', 'p2', 'p10'],
      },
      {
        id: 'trending_near_you',
        title: 'Trending Near You',
        subtitle: 'Popular in your local delivery area',
        productIds: ['p4', 'p6', 'p7'],
      },
    ];
  }

  getCustomerInsights(): CustomerInsightsSummary {
    return {
      segment: 'VIP_MEMBER',
      favoriteCategory: 'Electronics',
      favoriteBrand: 'Apple',
      totalOrders: 14,
      totalSavedFormatted: '₹4,850',
      auraCoinsBalance: 450,
      vipPassActive: true,
    };
  }
}

export const personalizationService = new PersonalizationService();
