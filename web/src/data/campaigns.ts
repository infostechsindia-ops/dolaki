export interface Campaign {
  slug: string;
  title: string;
  subtitle: string;
  bannerUrl: string;
  accentColor: string;
  productCategory: string;
  expiryDate: string;
  couponCode: string;
  discountPercent: number;
  description: string;
}

export const campaignsData: Campaign[] = [
  {
    slug: 'monsoon-mega-sale',
    title: '☔ Monsoon Mega Sale',
    subtitle: 'Washed out prices on premium catalog!',
    bannerUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1200&h=400&fit=crop',
    accentColor: '#1E40AF',
    productCategory: 'fashion',
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    couponCode: 'RAIN30',
    discountPercent: 30,
    description: 'Get extra discounts on fashion and outdoor essentials this rainy season. Pick the best styles with verified rain protection and windbreaks.'
  },
  {
    slug: 'back-to-school',
    title: '🎒 Back to School Deal Week',
    subtitle: 'Top gear for smart minds',
    bannerUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&h=400&fit=crop',
    accentColor: '#047857',
    productCategory: 'electronics',
    expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    couponCode: 'STUDENT15',
    discountPercent: 15,
    description: 'Upgrade your tech workspace with high performance laptops, headphones, smartwatches and accessories. Exclusive discounts for student accounts.'
  },
  {
    slug: 'festive-edition',
    title: '🪔 Sparkling Festive Bazaar',
    subtitle: 'Celebrate in style, save in grandeur',
    bannerUrl: 'https://images.unsplash.com/photo-1514790193030-c89d266d5a9d?w=1200&h=400&fit=crop',
    accentColor: '#B91C1C',
    productCategory: 'home',
    expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    couponCode: 'FESTIVE20',
    discountPercent: 20,
    description: 'Beautiful decorative table lamps, mixers, home appliances, and ethnic fashion lines to bring absolute joy and sparks to your home gatherings.'
  },
  {
    slug: 'electronics-fest',
    title: '⚡ Electronics Fest Peak Deals',
    subtitle: 'Unbeatable tech values, closing fast',
    bannerUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=400&fit=crop',
    accentColor: '#7C3AED',
    productCategory: 'electronics',
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    couponCode: 'AURA100',
    discountPercent: 10,
    description: 'Save flat amount on headphones, earbuds, smartwatches, and flagship gadgets. Certified brand warranties apply to all orders.'
  },
  {
    slug: 'beauty-week',
    title: '💄 Natural Beauty & Care Week',
    subtitle: 'Healthy skin, beautiful shine',
    bannerUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=400&fit=crop',
    accentColor: '#EC4899',
    productCategory: 'beauty',
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    couponCode: 'GLOW25',
    discountPercent: 25,
    description: 'Organic creams, vitamin serums, skincare kits and luxury beauty routines. Dermatologically tested natural products from certified brand stores.'
  },
  {
    slug: 'sports-carnival',
    title: '⚽ Ultimate Sports & Health Carnival',
    subtitle: 'Unleash the athlete inside you',
    bannerUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1200&h=400&fit=crop',
    accentColor: '#D97706',
    productCategory: 'sports',
    expiryDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    couponCode: 'FITSPORTS',
    discountPercent: 20,
    description: 'Premium soccer balls, pro badminton rackets, and durable sport shoes. Geared for optimal friction, control, power, and high performance.'
  }
];
