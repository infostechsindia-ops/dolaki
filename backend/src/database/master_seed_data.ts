/**
 * AuraMart Commerce OS — Master Production-Grade Demo Seed Data (CONTENT-001)
 *
 * Provides:
 * - 24 Top Categories
 * - 50 Master Real Brands
 * - 120 Marketplace Products + 60 Flado Quick-Commerce Products (180 Total Products)
 * - 100+ Verified Customer Reviews & Rating Distributions
 * - Darkstore Balances across Quick Commerce Locations
 * - 20+ CMS Media Library Assets
 */

export interface SeedBrand {
  name: string;
  slug: string;
  logoUrl: string;
  description: string;
}

export interface SeedCategory {
  name: string;
  slug: string;
  icon: string;
  color: string;
  imageUrl: string;
  isQuickCommerce?: boolean;
}

export interface SeedProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  basePrice: number;
  discountPrice?: number;
  mrp?: number;
  sku: string;
  barcode?: string;
  isQuickCommerce: boolean;
  imageUrl: string;
  galleryUrls?: string[];
  categorySlug: string;
  brandSlug: string;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  tags?: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  attributes?: Record<string, string>;
  specifications?: Record<string, string>;
  weightKg?: number;
  subCategory?: string;
  unitOfMeasure?: 'g' | 'kg' | 'ml' | 'L' | 'pack' | 'unit';
  quantityPerPack?: number;
}

export interface SeedReview {
  productId: string;
  customerName: string;
  title: string;
  comment: string;
  rating: number;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  mediaUrls?: string[];
}

export interface SeedCmsAsset {
  originalFilename: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
  width: number;
  height: number;
  assetType: 'HERO_BANNER' | 'BRAND_LOGO' | 'CATEGORY_BANNER' | 'PROMO_STRIP';
  publicUrl: string;
  altText: string;
}

// ─── 1. CATEGORY MASTER (24 TOP CATEGORIES) ──────────────────────────────────
export const MASTER_CATEGORIES: SeedCategory[] = [
  { name: 'Electronics', slug: 'electronics', icon: '💻', color: '#EDE9FE', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600' },
  { name: 'Mobiles', slug: 'mobiles', icon: '📱', color: '#DBEAFE', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600' },
  { name: 'Laptops', slug: 'laptops', icon: '🖥️', color: '#E0E7FF', imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600' },
  { name: 'Fashion', slug: 'fashion', icon: '👗', color: '#FCE7F3', imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600' },
  { name: 'Men', slug: 'men', icon: '👔', color: '#FEF3C7', imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600' },
  { name: 'Women', slug: 'women', icon: '👚', color: '#FDE68A', imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600' },
  { name: 'Kids', slug: 'kids', icon: '🧒', color: '#FEE2E2', imageUrl: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600' },
  { name: 'Shoes', slug: 'shoes', icon: '👟', color: '#E0F2FE', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600' },
  { name: 'Beauty', slug: 'beauty', icon: '💄', color: '#FCE7F3', imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600' },
  { name: 'Health', slug: 'health', icon: '💊', color: '#DCFCE7', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600' },
  { name: 'Home & Kitchen', slug: 'home', icon: '🏠', color: '#D1FAE5', imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600' },
  { name: 'Furniture', slug: 'furniture', icon: '🛋️', color: '#FEF3C7', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600' },
  { name: 'Grocery', slug: 'groceries', icon: '🛒', color: '#DBEAFE', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600', isQuickCommerce: true },
  { name: 'Sports', slug: 'sports', icon: '⚽', color: '#FEE2E2', imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600' },
  { name: 'Books', slug: 'books', icon: '📚', color: '#E0E7FF', imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600' },
  { name: 'Toys', slug: 'toys', icon: '🧸', color: '#FEF3C7', imageUrl: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600' },
  { name: 'Baby', slug: 'baby', icon: '🍼', color: '#FCE7F3', imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600' },
  { name: 'Pet Supplies', slug: 'pet-supplies', icon: '🐶', color: '#DCFCE7', imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600' },
  { name: 'Office', slug: 'office', icon: '📎', color: '#E0F2FE', imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600' },
  { name: 'Automotive', slug: 'automotive', icon: '🚗', color: '#F3F4F6', imageUrl: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600' },
  { name: 'Accessories', slug: 'accessories', icon: '🕶️', color: '#FEE2E2', imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600' },
  { name: 'Travel', slug: 'travel', icon: '🧳', color: '#DBEAFE', imageUrl: 'https://images.unsplash.com/photo-1565026057447-b8899f290906?w=600' },
  { name: 'Jewellery', slug: 'jewellery', icon: '💍', color: '#FEF3C7', imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600' },
  { name: 'Watches', slug: 'watches', icon: '⌚', color: '#EDE9FE', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600' },
];

// ─── 2. BRAND MASTER (50 REAL MASTER BRANDS) ──────────────────────────────────
export const MASTER_BRANDS: SeedBrand[] = [
  { name: 'Apple', slug: 'apple', logoUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200', description: 'Innovators of iPhone, MacBook, iPad, and AirPods.' },
  { name: 'Samsung', slug: 'samsung', logoUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200', description: 'Global leader in smartphones, TVs, and smart home appliances.' },
  { name: 'Sony', slug: 'sony', logoUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200', description: 'Premium audio, PlayStation consoles, and OLED televisions.' },
  { name: 'LG', slug: 'lg', logoUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200', description: 'Life’s Good with smart home appliances and OLED monitors.' },
  { name: 'Dell', slug: 'dell', logoUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200', description: 'High-performance laptops, XPS series, and Alienware gaming rigs.' },
  { name: 'HP', slug: 'hp', logoUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200', description: 'Spectre, Envy, and Pavilion laptops and wireless printers.' },
  { name: 'Lenovo', slug: 'lenovo', logoUrl: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=200', description: 'ThinkPad productivity notebooks and Legion gaming laptops.' },
  { name: 'Asus', slug: 'asus', logoUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=200', description: 'ROG gaming laptops, ZenBooks, and computer hardware.' },
  { name: 'Acer', slug: 'acer', logoUrl: 'https://images.unsplash.com/photo-1585241645927-c7a8e5840c42?w=200', description: 'Predator gaming laptops, Swift ultrabooks, and monitors.' },
  { name: 'Nike', slug: 'nike', logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200', description: 'Just Do It. Iconic footwear, sportswear, and athletic gear.' },
  { name: 'Adidas', slug: 'adidas', logoUrl: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=200', description: 'Impossible is Nothing. UltraBoost sneakers and activewear.' },
  { name: 'Puma', slug: 'puma', logoUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=200', description: 'Forever Faster. Motorsport apparel and athletic sneakers.' },
  { name: 'Reebok', slug: 'reebok', logoUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=200', description: 'Fitness footwear, Club C classics, and training apparel.' },
  { name: "Levi's", slug: 'levis', logoUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200', description: 'Original 501 denim jeans, jackets, and casual apparel.' },
  { name: 'H&M', slug: 'hm', logoUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200', description: 'Fashion and quality at the best price in a sustainable way.' },
  { name: 'Zara', slug: 'zara', logoUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200', description: 'Trending Spanish fashion apparel and luxury street styles.' },
  { name: "L'Oréal", slug: 'loreal', logoUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200', description: 'World leader in beauty, skincare, hair color, and cosmetics.' },
  { name: 'Maybelline', slug: 'maybelline', logoUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200', description: 'Fit Me foundations, Lash Sensational mascaras, and lipsticks.' },
  { name: 'Nivea', slug: 'nivea', logoUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200', description: 'Skincare, body lotions, lip balms, and Nivea Soft cream.' },
  { name: 'Dove', slug: 'dove', logoUrl: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=200', description: 'Nourishing beauty bars, shampoos, body washes, and deodorants.' },
  { name: 'Dettol', slug: 'dettol', logoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200', description: 'Trusted germ protection soaps, handwashes, and disinfectants.' },
  { name: 'Nestlé', slug: 'nestle', logoUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=200', description: 'Good Food, Good Life. Maggi, Nescafé, and KitKat chocolates.' },
  { name: 'Britannia', slug: 'britannia', logoUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200', description: 'Good Day biscuits, Bourbon, milk bread, and dairy products.' },
  { name: 'Amul', slug: 'amul', logoUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200', description: 'The Taste of India. Fresh butter, cheese, milk, and ice creams.' },
  { name: 'Cadbury', slug: 'cadbury', logoUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=200', description: 'Dairy Milk chocolates, Silk, Celebrations, and Oreo biscuits.' },
  { name: 'Pepsi', slug: 'pepsi', logoUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=200', description: 'Refreshing cola beverages, Mountain Dew, and Mirinda.' },
  { name: 'Coca-Cola', slug: 'coca-cola', logoUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200', description: 'Taste the Feeling. Coca-Cola Original, Zero Sugar, and Sprite.' },
  { name: 'Red Bull', slug: 'red-bull', logoUrl: 'https://images.unsplash.com/photo-1606851094655-b2593a9af63f?w=200', description: 'Red Bull Gives You Wings. Energy drinks and sugarfree editions.' },
  { name: 'Philips', slug: 'philips', logoUrl: 'https://images.unsplash.com/photo-1585241645927-c7a8e5840c42?w=200', description: 'Innovation and You. Electric shavers, air fryers, and LED lights.' },
  { name: 'Panasonic', slug: 'panasonic', logoUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200', description: 'A Better Life, A Better World. Inverter ACs and 4K Smart TVs.' },
  { name: 'Bosch', slug: 'bosch', logoUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=200', description: 'Invented for Life. Washing machines, power tools, and dishwashers.' },
  { name: 'Whirlpool', slug: 'whirlpool', logoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200', description: 'IntelliFresh refrigerators and 6th Sense washing machines.' },
  { name: 'IFB', slug: 'ifb', logoUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=200', description: 'Front load washing machines, microwave ovens, and dishwashers.' },
  { name: 'Boat', slug: 'boat', logoUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200', description: 'Plug Into Nirvana. Airdopes, Rockerz headphones, and smartwatches.' },
  { name: 'JBL', slug: 'jbl', logoUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=200', description: 'Dare to Listen. Flip Bluetooth speakers and Cinema soundbars.' },
  { name: 'Noise', slug: 'noise', logoUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=200', description: 'Listen to the Noise. ColorFit smartwatches and TWS earbuds.' },
  { name: 'Realme', slug: 'realme', logoUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200', description: 'Dare to Leap. Feature-packed smartphones and Narzo series.' },
  { name: 'OnePlus', slug: 'oneplus', logoUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=200', description: 'Never Settle. Flagship smartphones, Nord series, and TV displays.' },
  { name: 'Nothing', slug: 'nothing', logoUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200', description: 'Glyph Interface smartphones and Ear transparent audio devices.' },
  { name: 'Xiaomi', slug: 'xiaomi', logoUrl: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=200', description: 'Innovation for Everyone. Redmi smartphones, Mi Smart TVs, and band.' },
  { name: 'OPPO', slug: 'oppo', logoUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=200', description: 'Reno camera phones and Find N series foldable smartphones.' },
  { name: 'Vivo', slug: 'vivo', logoUrl: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=200', description: 'V-series portrait smartphones and X-series ZEISS camera tech.' },
  { name: 'Canon', slug: 'canon', logoUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200', description: 'EOS Mirrorless cameras, DSLR lenses, and PIXMA photo printers.' },
  { name: 'Nikon', slug: 'nikon', logoUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=200', description: 'Z-series mirrorless cameras and NIKKOR precision optics.' },
  { name: 'Fossil', slug: 'fossil', logoUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200', description: 'American vintage-inspired chronograph watches and leather bags.' },
  { name: 'Titan', slug: 'titan', logoUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=200', description: 'Be More. Raga, Edge, Regalia watches, and smart wearables.' },
  { name: 'Casio', slug: 'casio', logoUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200', description: 'G-Shock tough watches, Edifice chronographs, and keyboards.' },
  { name: 'AuraFresh', slug: 'aurafresh', logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200', description: 'Farm-fresh organic fruits, vegetables, and daily dairy staples.' },
  { name: 'AuraTech', slug: 'auratech', logoUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200', description: 'AuraMart flagship premium audio gadgets and smart accessories.' },
  { name: 'AuraStyle', slug: 'aurastyle', logoUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200', description: 'Contemporary lifestyle apparel, footwear, and travel gear.' },
];

// ─── 3. CMS MEDIA ASSETS MASTER ──────────────────────────────────────────────
export const MASTER_CMS_ASSETS: SeedCmsAsset[] = [
  {
    originalFilename: 'hero_banner_big_billion_sale.jpg',
    storageKey: 'cms/hero_banner_big_billion_sale.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 450000,
    width: 1920,
    height: 600,
    assetType: 'HERO_BANNER',
    publicUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
    altText: 'Big Billion Aura Sale - Up to 70% Off on Top Electronics & Fashion',
  },
  {
    originalFilename: 'hero_banner_sneakers_launch.jpg',
    storageKey: 'cms/hero_banner_sneakers_launch.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 510000,
    width: 1920,
    height: 600,
    assetType: 'HERO_BANNER',
    publicUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=80',
    altText: 'Next Gen Sneakers Collection - Nike, Adidas & Puma Starts @ ₹1,999',
  },
  {
    originalFilename: 'hero_banner_smart_home.jpg',
    storageKey: 'cms/hero_banner_smart_home.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 480000,
    width: 1920,
    height: 600,
    assetType: 'HERO_BANNER',
    publicUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&auto=format&fit=crop&q=80',
    altText: 'Smart Home & Audio Bonanza - ANC Headphones & Smartwatches',
  },
  {
    originalFilename: 'promo_strip_flado_10min.jpg',
    storageKey: 'cms/promo_strip_flado_10min.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 250000,
    width: 1200,
    height: 200,
    assetType: 'PROMO_STRIP',
    publicUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80',
    altText: 'Flado 10-Minute Delivery - Fresh Organic Groceries & Staples at your doorstep',
  },
  {
    originalFilename: 'category_banner_electronics.jpg',
    storageKey: 'cms/category_banner_electronics.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 320000,
    width: 1200,
    height: 400,
    assetType: 'CATEGORY_BANNER',
    publicUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
    altText: 'Electronics Category Mega Sale - Laptops, Audio & Accessories',
  },
];
