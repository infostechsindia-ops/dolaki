export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontFamily: string;
}

export type LayoutType = 'masonry' | 'grid' | 'carousel';

export interface BreakpointConfig {
  mobile: number;
  tablet: number;
  desktop: number;
}

export interface LayoutConfig {
  type: LayoutType;
  columns?: BreakpointConfig;
  itemsVisible?: BreakpointConfig;
  gap?: string;
  autoPlay?: boolean;
}

export interface SponsorshipMetadata {
  isSponsored: boolean;
  sponsorName?: string;
  sponsorLogoUrl?: string;
  trackingId?: string;
}

export interface BaseBannerData {
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface HeroBannerData extends BaseBannerData {
  banners?: BaseBannerData[];
}

export interface PromoBannerData extends BaseBannerData {
  bgColor?: string;
  timerEnd?: string;
}

export interface BrandData {
  id: string;
  name: string;
  logoUrl: string;
  link: string;
}

export interface BrandCarouselData {
  title: string;
  brands: BrandData[];
}

export interface ProductSummary {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export interface ProductListingData {
  title: string;
  productIds: string[]; // List of product IDs to render
}

export interface MasonryItemData {
  id: string;
  imageUrl: string;
  link?: string;
}

export interface ContentMasonryData {
  title: string;
  items: MasonryItemData[];
}

export interface BaseCategoryBlock {
  id: string;
  order: number;
  layout?: LayoutConfig;
  sponsorship?: SponsorshipMetadata;
}

export interface HeroBannerBlock extends BaseCategoryBlock {
  type: 'HERO_BANNER';
  data: HeroBannerData;
}

export interface PromoBannerBlock extends BaseCategoryBlock {
  type: 'PROMOTIONAL_BANNER';
  data: PromoBannerData;
}

export interface BrandCarouselBlock extends BaseCategoryBlock {
  type: 'BRAND_CAROUSEL';
  data: BrandCarouselData;
}

export interface ProductListingBlock extends BaseCategoryBlock {
  type: 'PRODUCT_LISTING';
  data: ProductListingData;
}

export interface ContentMasonryBlock extends BaseCategoryBlock {
  type: 'CONTENT_MASONRY';
  data: ContentMasonryData;
}

export type CategoryBlock =
  | HeroBannerBlock
  | PromoBannerBlock
  | BrandCarouselBlock
  | ProductListingBlock
  | ContentMasonryBlock;

export interface CategoryThemeConfig {
  categoryId: string;
  title: string;
  theme: ThemeConfig;
  blocks: CategoryBlock[];
}

export const categoryThemesData: CategoryThemeConfig[] = [
  {
    categoryId: 'electronics',
    title: 'Electronics & Wearables',
    theme: {
      primaryColor: '#8B5CF6', // AuraMart Violet
      secondaryColor: '#F5F3FF',
      backgroundColor: '#FAFAFA',
      fontFamily: 'Outfit, sans-serif'
    },
    blocks: [
      {
        id: 'ele-hero',
        type: 'HERO_BANNER',
        order: 1,
        sponsorship: {
          isSponsored: true,
          sponsorName: 'AuraSound',
          sponsorLogoUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&auto=format&fit=crop&q=80'
        },
        data: {
          title: 'Future of Sound is Here',
          subtitle: 'Check out standard-setting ANC Earbuds & Wearables',
          imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1200&auto=format&fit=crop&q=80',
          ctaText: 'Shop AuraPods Pro',
          ctaLink: '/products/ele-1',
          banners: [
            {
              title: 'Future of Sound is Here',
              subtitle: 'Check out standard-setting ANC Earbuds & Wearables',
              imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1200&auto=format&fit=crop&q=80',
              ctaText: 'Shop Now',
              ctaLink: '/products/ele-1'
            },
            {
              title: 'Elite Smartwatches',
              subtitle: 'Up to 30% Off on Wearable tech and gadgets',
              imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=1200&auto=format&fit=crop&q=80',
              ctaText: 'Explore Watches',
              ctaLink: '/products/ele-2'
            }
          ]
        }
      },
      {
        id: 'ele-brands',
        type: 'BRAND_CAROUSEL',
        order: 2,
        layout: {
          type: 'carousel',
          itemsVisible: { mobile: 3.5, tablet: 4.5, desktop: 6 },
          autoPlay: true
        },
        data: {
          title: 'Partner Brands',
          brands: [
            { id: 'b1', name: 'Apple', logoUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100&auto=format&fit=crop&q=80', link: '#' },
            { id: 'b2', name: 'Samsung', logoUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&auto=format&fit=crop&q=80', link: '#' },
            { id: 'b3', name: 'Sony', logoUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=100&auto=format&fit=crop&q=80', link: '#' }
          ]
        }
      },
      {
        id: 'ele-products-grid',
        type: 'PRODUCT_LISTING',
        order: 3,
        layout: {
          type: 'grid',
          columns: { mobile: 2, tablet: 3, desktop: 4 },
          gap: '20px'
        },
        data: {
          title: 'Top Gadgets This Week',
          productIds: ['ele-1', 'ele-2', 'ele-3', 'ele-4', 'ele-5', 'ele-6']
        }
      }
    ]
  },
  {
    categoryId: 'fashion',
    title: 'Fashion & Apparel',
    theme: {
      primaryColor: '#8B5CF6',
      secondaryColor: '#F5F3FF',
      backgroundColor: '#FFFFFF',
      fontFamily: 'Inter, sans-serif'
    },
    blocks: [
      {
        id: 'fas-hero',
        type: 'HERO_BANNER',
        order: 1,
        data: {
          title: 'Elevate Your Wardrobe',
          subtitle: 'Experience pure Supima cotton & fine loomed silks',
          imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop&q=80',
          ctaText: 'Explore Styles',
          ctaLink: '/products/fas-3'
        }
      },
      {
        id: 'fas-lookbook',
        type: 'CONTENT_MASONRY',
        order: 2,
        layout: {
          type: 'masonry',
          columns: { mobile: 1, tablet: 2, desktop: 3 },
          gap: '16px'
        },
        data: {
          title: 'Trending Lookbooks',
          items: [
            { id: 'look-1', imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80' },
            { id: 'look-2', imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format&fit=crop&q=80' },
            { id: 'look-3', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80' }
          ]
        }
      },
      {
        id: 'fas-products-carousel',
        type: 'PRODUCT_LISTING',
        order: 3,
        layout: {
          type: 'carousel',
          itemsVisible: { mobile: 2, tablet: 3.5, desktop: 4.5 },
          gap: '16px',
          autoPlay: true
        },
        data: {
          title: 'Editor\'s Picks',
          productIds: ['fas-1', 'fas-2', 'fas-3', 'fas-4', 'fas-5', 'fas-6']
        }
      }
    ]
  },
  {
    categoryId: 'beauty',
    title: 'Beauty & Skincare',
    theme: {
      primaryColor: '#EC4899', // Pink theme accent for Beauty
      secondaryColor: '#FDF2F8',
      backgroundColor: '#FAF5F7',
      fontFamily: 'Outfit, sans-serif'
    },
    blocks: [
      {
        id: 'be-hero',
        type: 'HERO_BANNER',
        order: 1,
        data: {
          title: 'Glow from Within',
          subtitle: 'Sulfate-free, dermatologically tested serums & creams',
          imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=1200&auto=format&fit=crop&q=80',
          ctaText: 'Shop Vitamin C Serum',
          ctaLink: '/products/be-1'
        }
      },
      {
        id: 'be-products',
        type: 'PRODUCT_LISTING',
        order: 2,
        layout: {
          type: 'grid',
          columns: { mobile: 2, tablet: 3, desktop: 4 },
          gap: '24px'
        },
        data: {
          title: 'Best Selling Beauty Formulas',
          productIds: ['be-1', 'be-2', 'be-3', 'be-4', 'be-5', 'be-6']
        }
      }
    ]
  },
  {
    categoryId: 'home',
    title: 'Home & Kitchen Essentials',
    theme: {
      primaryColor: '#0F172A', // Sleek slate black for Home
      secondaryColor: '#F1F5F9',
      backgroundColor: '#FCFCFC',
      fontFamily: 'Outfit, sans-serif'
    },
    blocks: [
      {
        id: 'hom-hero',
        type: 'HERO_BANNER',
        order: 1,
        data: {
          title: 'Curate Your Space',
          subtitle: 'Premium furniture, lighting, and designer appliances',
          imageUrl: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=1200&auto=format&fit=crop&q=80',
          ctaText: 'View Furniture',
          ctaLink: '/products/hom-3'
        }
      },
      {
        id: 'hom-products-grid',
        type: 'PRODUCT_LISTING',
        order: 2,
        layout: {
          type: 'grid',
          columns: { mobile: 2, tablet: 3, desktop: 4 },
          gap: '20px'
        },
        data: {
          title: 'Elevate Your Home',
          productIds: ['hom-1', 'hom-2', 'hom-3', 'hom-4', 'hom-5', 'hom-6']
        }
      }
    ]
  },
  {
    categoryId: 'groceries',
    title: 'Flado Groceries',
    theme: {
      primaryColor: '#059669', // Emerald green accent for Groceries
      secondaryColor: '#ECFDF5',
      backgroundColor: '#F9FAFB',
      fontFamily: 'Inter, sans-serif'
    },
    blocks: [
      {
        id: 'gro-hero',
        type: 'HERO_BANNER',
        order: 1,
        data: {
          title: 'Farm Fresh to Door in 10-Mins',
          subtitle: 'Experience instant delivery with Flado',
          imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=1200&auto=format&fit=crop&q=80',
          ctaText: 'Browse Vegetables',
          ctaLink: '/flado'
        }
      },
      {
        id: 'gro-products-grid',
        type: 'PRODUCT_LISTING',
        order: 2,
        layout: {
          type: 'grid',
          columns: { mobile: 2, tablet: 3, desktop: 4 },
          gap: '16px'
        },
        data: {
          title: 'Daily Essentials',
          productIds: ['gro-1', 'gro-2', 'gro-3', 'gro-4', 'gro-5', 'gro-6']
        }
      }
    ]
  },
  {
    categoryId: 'sports',
    title: 'Sports & Active Gear',
    theme: {
      primaryColor: '#F59E0B',
      secondaryColor: '#FEF3C7',
      backgroundColor: '#FAFAF9',
      fontFamily: 'Outfit, sans-serif'
    },
    blocks: [
      {
        id: 'spo-hero',
        type: 'HERO_BANNER',
        order: 1,
        data: {
          title: 'Pro Match Equipment',
          subtitle: 'Unleash your potential with high-traction gear',
          imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80',
          ctaText: 'View Match Ball',
          ctaLink: '/products/spo-1'
        }
      },
      {
        id: 'spo-products-grid',
        type: 'PRODUCT_LISTING',
        order: 2,
        layout: {
          type: 'grid',
          columns: { mobile: 2, tablet: 3, desktop: 4 },
          gap: '20px'
        },
        data: {
          title: 'Premium Sports Gear',
          productIds: ['spo-1', 'spo-2', 'fas-3']
        }
      }
    ]
  },
  {
    categoryId: 'appliances',
    title: 'Smart Home Appliances',
    theme: {
      primaryColor: '#6366F1',
      secondaryColor: '#EEF2FF',
      backgroundColor: '#FAFBFD',
      fontFamily: 'Outfit, sans-serif'
    },
    blocks: [
      {
        id: 'app-hero',
        type: 'HERO_BANNER',
        order: 1,
        data: {
          title: 'Next-Gen Intelligent Home',
          subtitle: 'Cyclonic HEPA vacuum cleaners and automatic gadgets',
          imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=1200&auto=format&fit=crop&q=80',
          ctaText: 'View Vacuum',
          ctaLink: '/products/app-1'
        }
      },
      {
        id: 'app-products-grid',
        type: 'PRODUCT_LISTING',
        order: 2,
        layout: {
          type: 'grid',
          columns: { mobile: 2, tablet: 3, desktop: 4 },
          gap: '24px'
        },
        data: {
          title: 'Featured Home Appliances',
          productIds: ['app-1', 'hom-1', 'hom-2']
        }
      }
    ]
  },
  {
    categoryId: 'toys',
    title: 'Toys & Building Blocks',
    theme: {
      primaryColor: '#EF4444',
      secondaryColor: '#FEE2E2',
      backgroundColor: '#FAF9F9',
      fontFamily: 'Inter, sans-serif'
    },
    blocks: [
      {
        id: 'toy-hero',
        type: 'HERO_BANNER',
        order: 1,
        data: {
          title: 'Build Beyond Imagination',
          subtitle: 'Official LEGO building sets and collectible space models',
          imageUrl: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=1200&auto=format&fit=crop&q=80',
          ctaText: 'Explore LEGO Sets',
          ctaLink: '/products/toy-1'
        }
      },
      {
        id: 'toy-products-grid',
        type: 'PRODUCT_LISTING',
        order: 2,
        layout: {
          type: 'grid',
          columns: { mobile: 2, tablet: 3, desktop: 4 },
          gap: '20px'
        },
        data: {
          title: 'Creative Play & Modeling',
          productIds: ['toy-1', 'ele-3']
        }
      }
    ]
  }
];

