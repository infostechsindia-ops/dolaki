// CategoryThemeConfig.ts

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

export interface ProductData {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

export interface ProductListingData {
  title: string;
  products: ProductData[];
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

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontFamily: string;
}

export interface CategoryThemeConfig {
  categoryId: string;
  title: string;
  theme: ThemeConfig;
  blocks: CategoryBlock[];
}

export const sampleCategoryThemeConfig: CategoryThemeConfig = {
  "categoryId": "electronics",
  "title": "Electronics & Gadgets",
  "theme": {
    "primaryColor": "#2563eb",
    "secondaryColor": "#eff6ff",
    "backgroundColor": "#ffffff",
    "fontFamily": "Roboto, sans-serif"
  },
  "blocks": [
    {
      "id": "blk-hero-promo",
      "type": "HERO_BANNER",
      "order": 1,
      "sponsorship": {
        "isSponsored": true,
        "sponsorName": "Samsung",
        "sponsorLogoUrl": "https://via.placeholder.com/100x40?text=Samsung",
        "trackingId": "samsung-summer-promo"
      },
      "data": {
        "title": "Galaxy Unpacked Event",
        "subtitle": "Discover the new Galaxy S27 Series",
        "imageUrl": "https://via.placeholder.com/1200x400/2563eb/ffffff?text=Galaxy+S27",
        "ctaText": "Pre-order Now",
        "ctaLink": "/brand/samsung/s27"
      }
    },
    {
      "id": "blk-top-brands",
      "type": "BRAND_CAROUSEL",
      "order": 2,
      "layout": {
        "type": "carousel",
        "itemsVisible": {
          "mobile": 3.5,
          "tablet": 5.5,
          "desktop": 8
        },
        "autoPlay": true
      },
      "data": {
        "title": "Top Electronics Brands",
        "brands": [
          { "id": "b1", "name": "Apple", "logoUrl": "https://via.placeholder.com/100/000000/ffffff?text=Apple", "link": "/brand/apple" },
          { "id": "b2", "name": "Sony", "logoUrl": "https://via.placeholder.com/100/000000/ffffff?text=Sony", "link": "/brand/sony" },
          { "id": "b3", "name": "LG", "logoUrl": "https://via.placeholder.com/100/000000/ffffff?text=LG", "link": "/brand/lg" }
        ]
      }
    },
    {
      "id": "blk-promotional-flash",
      "type": "PROMOTIONAL_BANNER",
      "order": 3,
      "data": {
        "title": "Midnight Tech Deal",
        "subtitle": "Flat 30% Off on Laptops",
        "imageUrl": "https://via.placeholder.com/1200x200/dc2626/ffffff?text=Laptop+Sale",
        "bgColor": "#dc2626",
        "timerEnd": "2026-12-31T23:59:59Z",
        "ctaText": "Shop Laptops",
        "ctaLink": "/category/laptops"
      }
    },
    {
      "id": "blk-trending-gadgets",
      "type": "PRODUCT_LISTING",
      "order": 4,
      "layout": {
        "type": "grid",
        "columns": {
          "mobile": 2,
          "tablet": 3,
          "desktop": 4
        },
        "gap": "16px"
      },
      "data": {
        "title": "Trending Gadgets",
        "products": [
          { "id": "p1", "name": "Noise Cancelling Headphones", "price": 14999 },
          { "id": "p2", "name": "Smart Home Hub", "price": 4999 }
        ]
      }
    },
    {
      "id": "blk-inspiration-masonry",
      "type": "CONTENT_MASONRY",
      "order": 5,
      "layout": {
        "type": "masonry",
        "columns": {
          "mobile": 1,
          "tablet": 2,
          "desktop": 3
        },
        "gap": "20px"
      },
      "data": {
        "title": "Tech Setups",
        "items": [
          { "id": "look-1", "imageUrl": "https://via.placeholder.com/400x300?text=Minimalist+Desk" },
          { "id": "look-2", "imageUrl": "https://via.placeholder.com/400x600?text=Gaming+Rig" },
          { "id": "look-3", "imageUrl": "https://via.placeholder.com/400x500?text=Creator+Studio" }
        ]
      }
    }
  ]
};
