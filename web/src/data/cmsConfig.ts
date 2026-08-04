/**
 * AuraMart CMS Configuration — Server-Driven UI Engine
 *
 * This is the single source of truth for homepage layout on both
 * the Web storefront and Mobile app. Admin can edit any section's
 * content, toggle visibility, and reorder sections from the Admin CMS panel.
 */

export interface CMSHeroBanner {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  backgroundColor: string;
}

export interface CMSCategory {
  name: string;
  slug: string;
  icon: string;
  color: string;
}

export interface CMSFlashDeal {
  productId: string;
  label: string;
  discount: number;
  expiresAt: string;
}

export interface CMSBrand {
  name: string;
  logoUrl: string;
  bannerUrl: string;
  slug: string;
  tagline: string;
  badgeColor: string;
}

export interface CMSSponsorBrand {
  name: string;
  logoUrl: string;
  discountText: string;
  slug: string;
}

export interface CMSCollectionCard {
  title: string;
  subtitle: string;
  imageUrl: string;
  slug: string;
  tag?: string;
}

export interface CMSLookbookItem {
  id: string;
  imageUrl: string;
  title: string;
  tags: string[]; // e.g. ["Retro Jeans", "Aura Sunglasses"]
}

export interface CMSProductStrip {
  title: string;
  subtitle: string;
  productIds: string[];
  ctaText: string;
  ctaUrl: string;
  accentColor: string;
}

export interface CMSLiveDeal {
  productId: string;
  productName: string;
  productImage: string;
  originalPrice: number;
  livePrice: number;
  expiresAt: string;
  watchersCount: number;
  hostName: string;
}

export interface CMSSection {
  id: string;
  type:
    | 'hero_banners'
    | 'top_announcement'
    | 'category_grid'
    | 'flash_sale'
    | 'flado_banner'
    | 'product_strip'
    | 'brand_spotlight'
    | 'live_deal'
    | 'promo_banner'
    | 'sponsor_strip'
    | 'new_launches'
    | 'trending_now'
    | 'collection_cards'
    | 'look_book'
    | 'buy_again'
    | 'campaign_spotlight'
    | 'promo_strip';
  visible: boolean;
  order: number;
  title?: string;
  config: any;
}

export interface CMSConfig {
  sections: CMSSection[];
  lastUpdated: string;
  publishedBy: string;
  version: number;
}

// ─── Default CMS Configuration ───────────────────────────────────────────────
export const DEFAULT_CMS_CONFIG: CMSConfig = {
  version: 2,
  lastUpdated: new Date().toISOString(),
  publishedBy: 'Admin',
  sections: [
    // 1. Top Announcement Bar
    {
      id: 'top_announcement',
      type: 'top_announcement',
      visible: true,
      order: 0,
      config: {
        text: '🎉 Big Billion Aura Sale is Live! Flat 10% Off with HDFC Cards | Free Express Delivery on order above ₹499',
        link: '/deals',
        backgroundColor: '#7C3AED',
        textColor: '#FFFFFF',
      },
    },

    // 2. Hero Banners Carousel
    {
      id: 'hero_banners',
      type: 'hero_banners',
      visible: true,
      order: 1,
      title: 'Hero Carousel',
      config: {
        autoPlayInterval: 4000,
        banners: [
          {
            id: 'b1',
            imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
            title: 'Epic Brand Drops',
            subtitle: 'Unbelievable 50-70% discounts on Nike, Apple, Clinique & boAt!',
            ctaText: 'Explore Offers',
            ctaUrl: '/deals',
            backgroundColor: '#4C1D95',
          },
          {
            id: 'b2',
            imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
            title: 'New Generation Sneakers',
            subtitle: 'Steal deals on Nike & AuraWear starts at just ₹1,999!',
            ctaText: 'View Kicks',
            ctaUrl: '/categories/fashion',
            backgroundColor: '#1D4ED8',
          },
          {
            id: 'b3',
            imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&auto=format&fit=crop&q=80',
            title: 'The Premium Tech Hub',
            subtitle: 'Noise Cancelling Earbuds & Smartwatches with AuraPay Cashbacks.',
            ctaText: 'Browse Gadgets',
            ctaUrl: '/categories/electronics',
            backgroundColor: '#065F46',
          },
        ] as CMSHeroBanner[],
      },
    },

    // 2.5 Campaigns Spotlight Strips
    {
      id: 'campaign_spotlight',
      type: 'campaign_spotlight',
      visible: true,
      order: 2,
      config: {}
    },

    // 3. Category Grid Icons
    {
      id: 'category_grid',
      type: 'category_grid',
      visible: true,
      order: 2,
      title: 'Shop by Category',
      config: {
        categories: [
          { name: 'Electronics', slug: 'electronics', icon: '📱', color: '#EDE9FE' },
          { name: 'Fashion', slug: 'fashion', icon: '👗', color: '#FCE7F3' },
          { name: 'Beauty', slug: 'beauty', icon: '💄', color: '#FEF3C7' },
          { name: 'Home & Kitchen', slug: 'home', icon: '🏠', color: '#D1FAE5' },
          { name: 'Groceries', slug: 'groceries', icon: '🛒', color: '#DBEAFE' },
          { name: 'Sports', slug: 'sports', icon: '⚽', color: '#FEE2E2' },
          { name: 'Appliances', slug: 'appliances', icon: '📺', color: '#E0E7FF' },
          { name: 'Toys', slug: 'toys', icon: '🎮', color: '#FEF9C3' },
        ] as CMSCategory[],
      },
    },

    // 4. Flash Sale Strip
    {
      id: 'flash_sale',
      type: 'flash_sale',
      visible: true,
      order: 3,
      title: 'Flash Sale',
      config: {
        title: '⚡ Hourly Lightning Deals',
        subtitle: 'Unmatched prices, closing real fast!',
        expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        deals: [
          { productId: 'ele-1', label: 'AuraPods Pro', discount: 30 },
          { productId: 'be-1', label: 'Vit C Serum', discount: 33 },
          { productId: 'spo-1', label: 'Match Football', discount: 33 },
          { productId: 'hom-1', label: 'Smart Coffee Maker', discount: 37 },
        ] as CMSFlashDeal[],
      },
    },

    // 5. Flado Quick Commerce Gate
    {
      id: 'flado_banner',
      type: 'flado_banner',
      visible: true,
      order: 4,
      title: 'Flado Quick Commerce Banner',
      config: {
        title: '⚡ Flado 10-Minute Delivery',
        subtitle: 'Groceries, fresh fruits & daily essentials delivered instantly!',
        ctaText: 'Order Now on Flado',
        ctaUrl: '/flado',
        backgroundColor: '#059669',
        accentColor: '#D1FAE5',
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
        badgeText: 'Instant Delivery: Bandra West',
      },
    },

    // 6. Sponsored Brand Logos Strip
    {
      id: 'sponsor_strip',
      type: 'sponsor_strip',
      visible: true,
      order: 5,
      title: 'Sponsored Brands',
      config: {
        title: '⭐ Featured Brand Deals',
        brands: [
          { name: 'Nike', logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80', discountText: 'Up to 40% Off', slug: 'nike' },
          { name: 'Sony', logoUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=100&auto=format&fit=crop&q=80', discountText: 'No Cost EMI', slug: 'sony' },
          { name: 'Dyson', logoUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=100&auto=format&fit=crop&q=80', discountText: 'Extra ₹1,500 Off', slug: 'dyson' },
          { name: 'LEGO', logoUrl: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=100&auto=format&fit=crop&q=80', discountText: 'Flat 15% Off', slug: 'lego' },
        ] as CMSSponsorBrand[]
      }
    },

    // 7. New Launches Section
    {
      id: 'new_launches',
      type: 'new_launches',
      visible: true,
      order: 6,
      title: 'New Launches',
      config: {
        title: '🚀 Hot New Launches',
        subtitle: 'Latest tech, fresh fashion, and new arrivals on the block',
        productIds: ['toy-1', 'spo-2', 'ele-2'],
      }
    },

    // 8. Brand Spotlight mall cards
    {
      id: 'brand_spotlight',
      type: 'brand_spotlight',
      visible: true,
      order: 7,
      title: 'Official Brand Stores',
      config: {
        title: '🏆 Exclusive Brand Spotlight',
        subtitle: 'Shop directly from officially authorized flagships',
        brands: [
          {
            name: 'Nike Premium Store',
            logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80',
            bannerUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
            slug: 'nike',
            tagline: 'Just Do It. Premium Sportswear Flagship Store.',
            badgeColor: '#111827',
          },
          {
            name: 'boAt Official Store',
            logoUrl: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=100&auto=format&fit=crop&q=80',
            bannerUrl: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600&auto=format&fit=crop&q=80',
            slug: 'boat',
            tagline: 'Plug into Nirvana. Sleek sound tech & wear.',
            badgeColor: '#EF4444',
          },
          {
            name: 'Clinique Organics',
            logoUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=100&auto=format&fit=crop&q=80',
            bannerUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80',
            slug: 'clinique',
            tagline: 'Allergy tested. 100% Fragrance Free skin health.',
            badgeColor: '#047857',
          },
        ] as CMSBrand[],
      },
    },

    // 9. Curated Collection Cards
    {
      id: 'collection_cards',
      type: 'collection_cards',
      visible: true,
      order: 8,
      title: 'Curated Collections',
      config: {
        title: '🎨 Curated Lifestyle Collections',
        collections: [
          { title: 'The Monsoon Setup', subtitle: 'Dry gear & rain protective wear', imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80', slug: 'sports', tag: 'Monsoon Sale' },
          { title: 'Ultimate Desk Vibe', subtitle: 'Ergonomic layouts & sound setups', imageUrl: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=600&auto=format&fit=crop&q=80', slug: 'home', tag: 'Work From Home' },
          { title: 'Gen-Z Style Book', subtitle: 'Trending street looks & oversized tees', imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80', slug: 'fashion', tag: 'New Drops' }
        ] as CMSCollectionCard[]
      }
    },

    // 10. Trending Now products
    {
      id: 'trending_now',
      type: 'trending_now',
      visible: true,
      order: 9,
      title: 'Trending Now',
      config: {
        title: '🔥 Trending on AuraMart',
        subtitle: 'Top trending items based on real-time clicks & purchases',
        productIds: ['ele-1', 'fas-1', 'be-1', 'spo-1', 'app-1'],
      }
    },

    // 11. Myntra-Style Lookbook/Studio Section
    {
      id: 'look_book',
      type: 'look_book',
      visible: true,
      order: 10,
      title: 'AuraStudio Lookbook',
      config: {
        title: '📸 Style Studio & Lookbooks',
        subtitle: 'Swipe for styling inspiration from top fashion influencers',
        items: [
          { id: 'l1', imageUrl: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=400&auto=format&fit=crop&q=80', title: 'Street Casual', tags: ['Denim Jacket', 'Run Pro Sneakers'] },
          { id: 'l2', imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&auto=format&fit=crop&q=80', title: 'Summer Breeze', tags: ['Linen Dress', 'AuraGlow Serum'] }
        ] as CMSLookbookItem[]
      }
    },

    // 12. Mid-Page Strip Promo Banner
    {
      id: 'promo_strip_1',
      type: 'promo_strip',
      visible: true,
      order: 11,
      config: {
        imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
        title: '⚡ AuraPlus membership: Extra 5% coins on every purchase & unlimited free shipping! ⚡',
        ctaUrl: '/profile',
        backgroundColor: '#F59E0B',
        textColor: '#1E293B'
      }
    },

    // 13. AuraLive Deal Card (active by default)
    {
      id: 'live_deal',
      type: 'live_deal',
      visible: true,
      order: 12,
      title: 'AuraLive Deal',
      config: {
        productId: 'ele-1',
        productName: 'AuraPods Pro ANC Earbuds',
        productImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
        originalPrice: 12999,
        livePrice: 8499,
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        watchersCount: 3840,
        hostName: 'Neha Malhotra',
      } as CMSLiveDeal,
    },
    {
      id: 'electronics_strip',
      type: 'product_strip',
      visible: true,
      order: 13,
      title: '⚡ Top Tech & Electronics',
      config: {
        title: '⚡ Top Tech & Electronics',
        subtitle: 'Laptops, smartphones, audio & wearables from authorized brand flagships',
        productIds: ['ele-1', 'ele-2', 'ele-5', 'ele-6', 'ele-7', 'ele-13'],
        ctaText: 'View All Electronics',
        ctaUrl: '/categories/electronics'
      }
    },
    {
      id: 'fashion_strip',
      type: 'product_strip',
      visible: true,
      order: 14,
      title: '👗 Trending Fashion & Footwear',
      config: {
        title: '👗 Trending Fashion & Footwear',
        subtitle: 'Denim jackets, summer dresses, ethnic silk sherwanis & pro sneakers',
        productIds: ['fas-1', 'fas-2', 'fas-3', 'fas-4', 'fas-5'],
        ctaText: 'View All Fashion',
        ctaUrl: '/categories/fashion'
      }
    },
    {
      id: 'beauty_strip',
      type: 'product_strip',
      visible: true,
      order: 15,
      title: '💄 Beauty & Skincare Bestsellers',
      config: {
        title: '💄 Beauty & Skincare Bestsellers',
        subtitle: 'Brightening vitamin C serums, barrier relief creams & matte lipsticks',
        productIds: ['be-1', 'be-2', 'be-3', 'be-4'],
        ctaText: 'View All Beauty',
        ctaUrl: '/categories/beauty'
      }
    },
    {
      id: 'home_strip',
      type: 'product_strip',
      visible: true,
      order: 16,
      title: '🏠 Home & Kitchen Upgrades',
      config: {
        title: '🏠 Home & Kitchen Upgrades',
        subtitle: 'Smart drip coffee makers, copper motor blenders, armchairs & shelves',
        productIds: ['hom-1', 'hom-2', 'hom-3', 'hom-4'],
        ctaText: 'View All Home',
        ctaUrl: '/categories/home'
      }
    }
  ],
};

// ─── CMS Config Key for localStorage/Admin sync ────────────────────────────
export const CMS_STORAGE_KEY = 'auramart_cms_config_v2';

export function getCMSConfig(): CMSConfig {
  if (typeof window === 'undefined') return DEFAULT_CMS_CONFIG;
  try {
    const stored = localStorage.getItem(CMS_STORAGE_KEY);
    if (stored) return JSON.parse(stored) as CMSConfig;
  } catch {
    // fall through
  }
  return DEFAULT_CMS_CONFIG;
}

export function saveCMSConfig(config: CMSConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(config));
}

export function getVisibleSections(config: CMSConfig): CMSSection[] {
  return config.sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);
}
