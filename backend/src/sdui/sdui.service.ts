import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SduiService {
  private readonly configPath = path.join(process.cwd(), 'sdui_homepage.json');
  private readonly fladoConfigPath = path.join(process.cwd(), 'sdui_flado.json');

  // Default configuration corresponding to AuraMart 2.0 SDUI Specs (Flipkart/Noon layout)
  private readonly defaultConfig = {
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
          textColor: '#FFFFFF'
        }
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
              backgroundColor: '#4C1D95'
            },
            {
              id: 'b2',
              imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
              title: 'New Generation Sneakers',
              subtitle: 'Steal deals on Nike & AuraWear starts at just ₹1,999!',
              ctaText: 'View Kicks',
              ctaUrl: '/categories/fashion',
              backgroundColor: '#1D4ED8'
            },
            {
              id: 'b3',
              imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&auto=format&fit=crop&q=80',
              title: 'The Premium Tech Hub',
              subtitle: 'Noise Cancelling Earbuds & Smartwatches with AuraPay Cashbacks.',
              ctaText: 'Browse Gadgets',
              ctaUrl: '/categories/electronics',
              backgroundColor: '#065F46'
            }
          ]
        }
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
            { name: 'Toys', slug: 'toys', icon: '🎮', color: '#FEF9C3' }
          ]
        }
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
            { productId: 'hom-1', label: 'Smart Coffee Maker', discount: 37 }
          ]
        }
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
          badgeText: 'Instant Delivery: Bandra West'
        }
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
            { name: 'LEGO', logoUrl: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=100&auto=format&fit=crop&q=80', discountText: 'Flat 15% Off', slug: 'lego' }
          ]
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
          productIds: ['toy-1', 'spo-2', 'ele-2']
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
              badgeColor: '#111827'
            },
            {
              name: 'boAt Official Store',
              logoUrl: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=100&auto=format&fit=crop&q=80',
              bannerUrl: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600&auto=format&fit=crop&q=80',
              slug: 'boat',
              tagline: 'Plug into Nirvana. Sleek sound tech & wear.',
              badgeColor: '#EF4444'
            },
            {
              name: 'Clinique Organics',
              logoUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=100&auto=format&fit=crop&q=80',
              bannerUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80',
              slug: 'clinique',
              tagline: 'Allergy tested. 100% Fragrance Free skin health.',
              badgeColor: '#047857'
            }
          ]
        }
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
          ]
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
          productIds: ['ele-1', 'fas-1', 'be-1', 'spo-1', 'app-1']
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
          ]
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
          hostName: 'Neha Malhotra'
        }
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
    ]
  };

  async getHomepageLayout() {
    try {
      if (fs.existsSync(this.configPath)) {
        const fileContent = fs.readFileSync(this.configPath, 'utf8');
        return JSON.parse(fileContent);
      }
    } catch (e) {
      console.error('Failed to read SDUI homepage config file, serving default.', e);
    }
    return this.defaultConfig;
  }

  async saveHomepageLayout(config: any) {
    try {
      config.lastUpdated = new Date().toISOString();
      config.version = (config.version || 0) + 1;
      fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2), 'utf8');
      return { success: true, config };
    } catch (e) {
      console.error('Failed to save SDUI homepage config file.', e);
      return { success: false, error: e.message };
    }
  }

  async getCategoryLayout(categorySlug: string) {
    return {
      category: categorySlug,
      themeColor: categorySlug === 'fashion' ? '#8B5CF6' : categorySlug === 'electronics' ? '#3B82F6' : '#10B981',
      sections: [
        {
          id: `${categorySlug}-hero`,
          type: 'BANNER',
          config: {
            title: `Exclusive ${categorySlug} Collection`,
            imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600'
          }
        },
        {
          id: `${categorySlug}-grid`,
          type: 'PRODUCT_GRID',
          config: {
            columns: 2
          }
        }
      ]
    };
  }

  // Default configuration for Flado quick-commerce (Zepto/Blinkit layout)
  private readonly defaultFladoConfig = {
    version: 3,
    lastUpdated: new Date().toISOString(),
    publishedBy: 'Admin',
    sections: [
      // 1. Top Urgent Flash Sale Ticker (Placed at absolute top below header for maximum impulse urgency)
      {
        id: 'top_flash_ticker',
        type: 'top_flash_ticker',
        visible: true,
        order: 0,
        title: 'Top Flash Sale Ticker',
        config: {
          title: '🔥 FLASH SALE — Flat 40% Off on Farm Fresh Veggies!',
          subtitle: 'Ends in',
          expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          ctaText: 'Grab Deals →',
          ctaUrl: '/flado',
          backgroundColor: '#FF4500',
          textColor: '#FFFFFF'
        }
      },
      // 2. Hero Banners Carousel (Full Bleed)
      {
        id: 'flado_hero_carousel',
        type: 'flado_hero_carousel',
        visible: true,
        order: 1,
        title: 'Hero Banners Carousel',
        config: {
          autoPlayInterval: 4000,
          banners: [
            {
              id: 'fb1',
              imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80',
              title: 'Monsoon Mega Fresh Sale!',
              subtitle: '100% Organic Vegetables & Daily Dairy delivered in 10 mins.',
              ctaText: 'Shop Fresh',
              ctaUrl: '/flado',
              backgroundColor: '#059669',
              badgeText: '10 MIN EXPRESS'
            },
            {
              id: 'fb2',
              imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80',
              title: 'Artisanal Bakery & Milk',
              subtitle: 'Fresh sourdough loaves & A2 Desi Cow Milk delivered daily.',
              ctaText: 'Explore Bakery',
              ctaUrl: '/flado',
              backgroundColor: '#065F46',
              badgeText: 'FARM DIRECT'
            },
            {
              id: 'fb3',
              imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=1200&auto=format&fit=crop&q=80',
              title: 'Instant Kirana & Grocery',
              subtitle: 'Atta, Rice, Dal & Spices at wholesale prices.',
              ctaText: 'Stock Up',
              ctaUrl: '/flado',
              backgroundColor: '#1E3A8A',
              badgeText: 'BEST VALUE'
            }
          ]
        }
      },
      // 3. Full Size Replaceable Promo Strip Banner #1 (Admin Replaceable)
      {
        id: 'flado_promo_strip_1',
        type: 'flado_promo_banner',
        visible: true,
        order: 2,
        title: 'Full Size Promo Strip #1',
        config: {
          imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
          title: '⚡ Craving snacks? Chilled beverages & chips delivered in 10 minutes! ⚡',
          ctaUrl: '/flado',
          backgroundColor: '#10B981',
          textColor: '#FFFFFF'
        }
      },
      // 4. Quick Category Grid (12 Emoji Chips)
      {
        id: 'flado_category_pills',
        type: 'flado_category_pills',
        visible: true,
        order: 3,
        title: 'Quick Categories Grid',
        config: {
          categories: [
            { name: 'Veggies', slug: 'fruits-vegetables', icon: '🥬', color: '#ECFDF5' },
            { name: 'Dairy & Milk', slug: 'dairy-bread-eggs', icon: '🥛', color: '#EFF6FF' },
            { name: 'Fresh Meat', slug: 'meat', icon: '🥩', color: '#FEF2F2' },
            { name: 'Pharmacy', slug: 'medical', icon: '💊', color: '#F0FDF4' },
            { name: 'Kirana', slug: 'kirana', icon: '🛒', color: '#FEF3C7' },
            { name: 'Bakery', slug: 'bakery', icon: '🍞', color: '#FFFBEB' },
            { name: 'Restaurant', slug: 'restaurant', icon: '🍕', color: '#FFF1F2' },
            { name: 'Fashion', slug: 'fashion', icon: '👗', color: '#F5F3FF' },
            { name: 'Books', slug: 'books', icon: '📚', color: '#EEF2FF' },
            { name: 'Tools', slug: 'tools', icon: '🔧', color: '#F1F5F9' },
            { name: 'Beauty', slug: 'beauty', icon: '🧴', color: '#FDF2F8' },
            { name: 'Household', slug: 'household', icon: '🏠', color: '#ECFDF5' }
          ]
        }
      },
      // 5. Trending Products Shelf
      {
        id: 'flado_trending',
        type: 'flado_product_row',
        visible: true,
        order: 4,
        title: 'Trending Products Shelf',
        config: {
          title: '🔥 Trending Now Near You',
          subCategory: 'Trending',
          badgeText: 'MOST POPULAR'
        }
      },
      // 6. Full Size Replaceable Promo Strip Banner #2 (Admin Replaceable)
      {
        id: 'flado_promo_strip_2',
        type: 'flado_promo_banner',
        visible: true,
        order: 5,
        title: 'Full Size Promo Strip #2',
        config: {
          imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80',
          title: '🛒 Monthly Ration Special: Get Flat ₹150 OFF on orders above ₹999 with code RATION150',
          ctaUrl: '/flado',
          backgroundColor: '#7C3AED',
          textColor: '#FFFFFF'
        }
      },
      // 7. Featured Local Shops Near You
      {
        id: 'flado_featured_shops',
        type: 'flado_featured_shops',
        visible: true,
        order: 6,
        title: 'Local Shops Near You',
        config: {
          title: '🏪 Verified Local Kirana Stores',
          subtitle: 'Support neighborhood shopkeepers in Muzaffarpur & Maunath Bhanjan'
        }
      },
      // 8. Category Spotlight: Fresh Veggies
      {
        id: 'flado_row_fruits',
        type: 'flado_product_row',
        visible: true,
        order: 7,
        title: 'Fresh Vegetables & Fruits Shelf',
        config: {
          title: '🥬 Fresh Vegetables & Fruits',
          subCategory: 'Fruits & Vegetables'
        }
      },
      // 9. Category Spotlight: Dairy & Bread
      {
        id: 'flado_row_dairy',
        type: 'flado_product_row',
        visible: true,
        order: 8,
        title: 'Dairy & Bread Shelf',
        config: {
          title: '🥛 Dairy, Milk & Fresh Bread',
          subCategory: 'Dairy & Bread'
        }
      },
      // 10. AuraCoins Loyalty Cash Back Hook Strip
      {
        id: 'flado_loyalty_hook',
        type: 'flado_loyalty_hook',
        visible: true,
        order: 9,
        title: 'AuraCoins Loyalty Banner',
        config: {
          title: '✨ Earn 1% AuraCoins on Every Order',
          subtitle: 'Redeem 100 coins = ₹10 discount at checkout!',
          buttonText: 'View Wallet →'
        }
      },
      // 11. Full Size Replaceable Promo Strip Banner #3 (Admin Campaign Replaceable)
      {
        id: 'flado_promo_strip_3',
        type: 'flado_promo_banner',
        visible: true,
        order: 10,
        title: 'Full Size Promo Strip #3',
        config: {
          imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80',
          title: '🥐 Evening Tea & Snacks Combo: Biscuit + Tea Powder at Flat ₹49!',
          ctaUrl: '/flado',
          backgroundColor: '#D97706',
          textColor: '#FFFFFF'
        }
      },
      // 12. Sponsor Brand Logos Row
      {
        id: 'flado_sponsor_row',
        type: 'flado_sponsor_row',
        visible: true,
        order: 11,
        title: 'Sponsor Brand Zone',
        config: {
          title: '⭐ Partner Brands Spotlights',
          brands: [
            { name: 'Amul', logoUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=100&auto=format&fit=crop&q=80', discountText: 'Up to 20% Off', slug: 'groceries' },
            { name: 'Lay\'s', logoUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=100&auto=format&fit=crop&q=80', discountText: 'Flat 10% Off', slug: 'groceries' },
            { name: 'Patanjali', logoUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&auto=format&fit=crop&q=80', discountText: 'Organic Pure', slug: 'beauty' },
            { name: 'Britannia', logoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&auto=format&fit=crop&q=80', discountText: 'Buy 2 Get 1', slug: 'groceries' }
          ]
        }
      },
      // 13. Curated Meal Combos / Bundles
      {
        id: 'flado_combo_bundles',
        type: 'flado_combo_bundles',
        visible: true,
        order: 12,
        title: 'Curated Combo Bundles',
        config: {
          title: '🍱 Curated Saver Bundles',
          bundles: [
            { name: 'Morning Breakfast Bundle', items: ['A2 Milk 1L', 'Brown Bread 400g', 'Butter 100g'], price: 120, originalPrice: 155, discountText: 'Save ₹35' },
            { name: 'Party Snack Pack', items: ['Lay\'s Potato Chips x2', 'Coca Cola 750ml', 'Salted Peanuts'], price: 140, originalPrice: 185, discountText: 'Save ₹45' }
          ]
        }
      },
      // 14. Recently Ordered (Personalized Repeat Orders)
      {
        id: 'flado_recently_ordered',
        type: 'flado_recently_ordered',
        visible: true,
        order: 13,
        title: 'Recently Ordered Shelf',
        config: {
          title: '🔄 Order Again',
          subtitle: 'Your usual essentials delivered in 10 minutes'
        }
      },
      // 15. New Arrivals at Local Shops
      {
        id: 'flado_new_arrivals',
        type: 'flado_new_arrivals',
        visible: true,
        order: 14,
        title: 'New Arrivals Shelf',
        config: {
          title: '✨ Fresh Additions at Local Shops',
          badgeText: 'JUST ARRIVED'
        }
      }
    ]
  };

  async getFladoLayout() {
    try {
      if (fs.existsSync(this.fladoConfigPath)) {
        const fileContent = fs.readFileSync(this.fladoConfigPath, 'utf8');
        return JSON.parse(fileContent);
      }
    } catch (e) {
      console.error('Failed to read SDUI Flado config file, serving default.', e);
    }
    return this.defaultFladoConfig;
  }

  async saveFladoLayout(config: any) {
    try {
      config.lastUpdated = new Date().toISOString();
      config.version = (config.version || 0) + 1;
      fs.writeFileSync(this.fladoConfigPath, JSON.stringify(config, null, 2), 'utf8');
      return { success: true, config };
    } catch (e) {
      console.error('Failed to save SDUI Flado config file.', e);
      return { success: false, error: e.message };
    }
  }
}
