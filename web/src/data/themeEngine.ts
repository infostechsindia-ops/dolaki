/**
 * AuraMart Enterprise Theme Engine Specification & Registry
 *
 * CMS-driven scheduled theme engine supporting seasonal, event, and regional brand themes.
 * Zero redeployment required. Overrides logo, colors, hero banners, splash screen, and campaign visibility.
 */

export type ThemePreset =
  | 'default'
  | 'independence-day'
  | 'republic-day'
  | 'holi'
  | 'ramadan'
  | 'eid'
  | 'diwali'
  | 'christmas'
  | 'new-year'
  | 'black-friday'
  | 'summer-sale'
  | 'back-to-school'
  | 'fashion-festival'
  | 'grocery-carnival'
  | 'electronics-week';

export interface ThemeConfig {
  id: ThemePreset;
  name: string;
  description: string;
  active: boolean;
  scheduledStart?: string;
  scheduledEnd?: string;
  targetRegions: string[]; // e.g. ["IN", "AE", "GLOBAL"]
  previewMode: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    bannerGradient: string;
    badgeBg: string;
    badgeText: string;
  };
  branding: {
    logoUrl?: string;
    appTitle: string;
    heroBannerUrl: string;
    splashBgColor: string;
    promoTagline: string;
  };
  campaignVisibility: {
    heroCarousel: boolean;
    flashSale: boolean;
    sponsoredStrip: boolean;
    lookbook: boolean;
    liveDeals: boolean;
  };
}

export const THEME_REGISTRY: Record<ThemePreset, ThemeConfig> = {
  default: {
    id: 'default',
    name: 'AuraMart Enterprise Classic',
    description: 'Flagship slate & indigo theme for year-round retail operations.',
    active: true,
    targetRegions: ['GLOBAL'],
    previewMode: false,
    colors: {
      primary: '#6366F1',
      secondary: '#4F46E5',
      accent: '#F59E0B',
      background: '#0F172A',
      bannerGradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
      badgeBg: '#EEF2FF',
      badgeText: '#4338CA',
    },
    branding: {
      appTitle: 'AuraMart Commerce OS',
      heroBannerUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
      splashBgColor: '#6366F1',
      promoTagline: 'Everything You Need, Delivered Fast',
    },
    campaignVisibility: {
      heroCarousel: true,
      flashSale: true,
      sponsoredStrip: true,
      lookbook: true,
      liveDeals: true,
    },
  },
  diwali: {
    id: 'diwali',
    name: 'Diwali Lights Festival',
    description: 'Gold & crimson festive theme for grand Diwali shopping celebrations.',
    active: false,
    scheduledStart: '2026-10-20T00:00:00Z',
    scheduledEnd: '2026-11-05T23:59:59Z',
    targetRegions: ['IN', 'GLOBAL'],
    previewMode: false,
    colors: {
      primary: '#D97706',
      secondary: '#B45309',
      accent: '#EF4444',
      background: '#1F1907',
      bannerGradient: 'linear-gradient(135deg, #D97706 0%, #991B1B 100%)',
      badgeBg: '#FEF3C7',
      badgeText: '#92400E',
    },
    branding: {
      appTitle: 'AuraMart Diwali Grand Sale',
      heroBannerUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
      splashBgColor: '#D97706',
      promoTagline: 'Festival of Lights, Unbeatable Deals',
    },
    campaignVisibility: {
      heroCarousel: true,
      flashSale: true,
      sponsoredStrip: true,
      lookbook: true,
      liveDeals: true,
    },
  },
  ramadan: {
    id: 'ramadan',
    name: 'Ramadan & Eid Kareem',
    description: 'Emerald green & gold luxury theme for Middle East & global Eid sales.',
    active: false,
    scheduledStart: '2026-02-15T00:00:00Z',
    scheduledEnd: '2026-03-25T23:59:59Z',
    targetRegions: ['AE', 'GLOBAL'],
    previewMode: false,
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#F59E0B',
      background: '#022C22',
      bannerGradient: 'linear-gradient(135deg, #059669 0%, #B45309 100%)',
      badgeBg: '#D1FAE5',
      badgeText: '#065F46',
    },
    branding: {
      appTitle: 'AuraMart Ramadan Mubarak',
      heroBannerUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80',
      splashBgColor: '#059669',
      promoTagline: 'Ramadan Kareem — Blessings & Express Delivery',
    },
    campaignVisibility: {
      heroCarousel: true,
      flashSale: true,
      sponsoredStrip: true,
      lookbook: true,
      liveDeals: true,
    },
  },
  'black-friday': {
    id: 'black-friday',
    name: 'Black Friday Super Sale',
    description: 'Neon cyan & obsidian dark theme for global Black Friday discounts.',
    active: false,
    scheduledStart: '2026-11-20T00:00:00Z',
    scheduledEnd: '2026-11-30T23:59:59Z',
    targetRegions: ['GLOBAL'],
    previewMode: false,
    colors: {
      primary: '#06B6D4',
      secondary: '#0891B2',
      accent: '#F43F5E',
      background: '#090D16',
      bannerGradient: 'linear-gradient(135deg, #06B6D4 0%, #E11D48 100%)',
      badgeBg: '#CFFAFE',
      badgeText: '#155E75',
    },
    branding: {
      appTitle: 'AuraMart Black Friday Mega Sale',
      heroBannerUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
      splashBgColor: '#0891B2',
      promoTagline: 'Biggest Price Drops of the Year',
    },
    campaignVisibility: {
      heroCarousel: true,
      flashSale: true,
      sponsoredStrip: true,
      lookbook: true,
      liveDeals: true,
    },
  },
  'independence-day': {
    id: 'independence-day',
    name: 'Freedom Festival',
    description: 'Tricolor saffron, white & emerald theme for national sales.',
    active: false,
    targetRegions: ['IN'],
    previewMode: false,
    colors: { primary: '#EA580C', secondary: '#059669', accent: '#2563EB', background: '#0F172A', bannerGradient: 'linear-gradient(135deg, #EA580C 0%, #059669 100%)', badgeBg: '#FFEDD5', badgeText: '#C2410C' },
    branding: { appTitle: 'AuraMart Freedom Sale', heroBannerUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80', splashBgColor: '#EA580C', promoTagline: 'Celebrate Freedom with Mega Savings' },
    campaignVisibility: { heroCarousel: true, flashSale: true, sponsoredStrip: true, lookbook: true, liveDeals: true }
  },
  'republic-day': { id: 'republic-day', name: 'Republic Day Parade Sale', description: 'National tricolor celebration theme.', active: false, targetRegions: ['IN'], previewMode: false, colors: { primary: '#2563EB', secondary: '#059669', accent: '#EA580C', background: '#0F172A', bannerGradient: 'linear-gradient(135deg, #2563EB 0%, #059669 100%)', badgeBg: '#DBEAFE', badgeText: '#1E40AF' }, branding: { appTitle: 'AuraMart Republic Sale', heroBannerUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80', splashBgColor: '#2563EB', promoTagline: 'Grand Republic Offers' }, campaignVisibility: { heroCarousel: true, flashSale: true, sponsoredStrip: true, lookbook: true, liveDeals: true } },
  holi: { id: 'holi', name: 'Festival of Colors Holi Sale', description: 'Vibrant multi-color celebration theme.', active: false, targetRegions: ['IN'], previewMode: false, colors: { primary: '#EC4899', secondary: '#8B5CF6', accent: '#10B981', background: '#18181B', bannerGradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)', badgeBg: '#FCE7F3', badgeText: '#BE185D' }, branding: { appTitle: 'AuraMart Holi Fest', heroBannerUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80', splashBgColor: '#EC4899', promoTagline: 'Splash into Festive Discounts' }, campaignVisibility: { heroCarousel: true, flashSale: true, sponsoredStrip: true, lookbook: true, liveDeals: true } },
  eid: { id: 'eid', name: 'Eid Celebration Fest', description: 'Golden moon crescent celebration theme.', active: false, targetRegions: ['AE', 'IN', 'GLOBAL'], previewMode: false, colors: { primary: '#10B981', secondary: '#D97706', accent: '#6366F1', background: '#022C22', bannerGradient: 'linear-gradient(135deg, #10B981 0%, #D97706 100%)', badgeBg: '#D1FAE5', badgeText: '#047857' }, branding: { appTitle: 'AuraMart Eid Festive Sale', heroBannerUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80', splashBgColor: '#10B981', promoTagline: 'Eid Mubarak Shopping Extravaganza' }, campaignVisibility: { heroCarousel: true, flashSale: true, sponsoredStrip: true, lookbook: true, liveDeals: true } },
  christmas: { id: 'christmas', name: 'Merry Christmas Wonderland', description: 'Festive crimson & forest green winter holiday theme.', active: false, targetRegions: ['GLOBAL'], previewMode: false, colors: { primary: '#DC2626', secondary: '#15803D', accent: '#F59E0B', background: '#0F172A', bannerGradient: 'linear-gradient(135deg, #DC2626 0%, #15803D 100%)', badgeBg: '#FEE2E2', badgeText: '#991B1B' }, branding: { appTitle: 'AuraMart Christmas Wonders', heroBannerUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80', splashBgColor: '#DC2626', promoTagline: 'Holiday Gifting & Winter Magic' }, campaignVisibility: { heroCarousel: true, flashSale: true, sponsoredStrip: true, lookbook: true, liveDeals: true } },
  'new-year': { id: 'new-year', name: 'New Year Bash 2027', description: 'Sparkling silver & midnight violet theme.', active: false, targetRegions: ['GLOBAL'], previewMode: false, colors: { primary: '#8B5CF6', secondary: '#6366F1', accent: '#EC4899', background: '#0F172A', bannerGradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)', badgeBg: '#EDE9FE', badgeText: '#6D28D9' }, branding: { appTitle: 'AuraMart New Year Bonanza', heroBannerUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80', splashBgColor: '#8B5CF6', promoTagline: 'Ring in the New Year with Unmatched Savings' }, campaignVisibility: { heroCarousel: true, flashSale: true, sponsoredStrip: true, lookbook: true, liveDeals: true } },
  'summer-sale': { id: 'summer-sale', name: 'Summer Heatwave Deals', description: 'Sunny cyan & warm amber theme.', active: false, targetRegions: ['GLOBAL'], previewMode: false, colors: { primary: '#0284C7', secondary: '#F59E0B', accent: '#10B981', background: '#0F172A', bannerGradient: 'linear-gradient(135deg, #0284C7 0%, #F59E0B 100%)', badgeBg: '#E0F2FE', badgeText: '#0369A1' }, branding: { appTitle: 'AuraMart Summer Heatwave', heroBannerUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80', splashBgColor: '#0284C7', promoTagline: 'Beat the Heat with Cool Discounts' }, campaignVisibility: { heroCarousel: true, flashSale: true, sponsoredStrip: true, lookbook: true, liveDeals: true } },
  'back-to-school': { id: 'back-to-school', name: 'Back to School & Campus', description: 'Bright blue & yellow education campaign theme.', active: false, targetRegions: ['GLOBAL'], previewMode: false, colors: { primary: '#2563EB', secondary: '#EAB308', accent: '#10B981', background: '#0F172A', bannerGradient: 'linear-gradient(135deg, #2563EB 0%, #EAB308 100%)', badgeBg: '#FEF9C3', badgeText: '#854D0E' }, branding: { appTitle: 'AuraMart Campus Essentials', heroBannerUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80', splashBgColor: '#2563EB', promoTagline: 'Laptops, Gear & Campus Fashion' }, campaignVisibility: { heroCarousel: true, flashSale: true, sponsoredStrip: true, lookbook: true, liveDeals: true } },
  'fashion-festival': { id: 'fashion-festival', name: 'Fashion & Style Carnival', description: 'Rose gold & magenta couture theme.', active: false, targetRegions: ['GLOBAL'], previewMode: false, colors: { primary: '#E11D48', secondary: '#BE185D', accent: '#F59E0B', background: '#1F1216', bannerGradient: 'linear-gradient(135deg, #E11D48 0%, #BE185D 100%)', badgeBg: '#FFE4E6', badgeText: '#9F1239' }, branding: { appTitle: 'AuraStyle Fashion Carnival', heroBannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80', splashBgColor: '#E11D48', promoTagline: 'Runway Trends & Top Brands' }, campaignVisibility: { heroCarousel: true, flashSale: true, sponsoredStrip: true, lookbook: true, liveDeals: true } },
  'grocery-carnival': { id: 'grocery-carnival', name: 'Flado Super Grocery Fest', description: 'Fresh emerald & mint quick-commerce theme.', active: false, targetRegions: ['GLOBAL'], previewMode: false, colors: { primary: '#059669', secondary: '#10B981', accent: '#F59E0B', background: '#022C22', bannerGradient: 'linear-gradient(135deg, #059669 0%, #10B981 100%)', badgeBg: '#D1FAE5', badgeText: '#065F46' }, branding: { appTitle: 'Flado Super Grocery Carnival', heroBannerUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80', splashBgColor: '#059669', promoTagline: 'Fresh Vegetables, Fruits & Daily Essentials' }, campaignVisibility: { heroCarousel: true, flashSale: true, sponsoredStrip: true, lookbook: true, liveDeals: true } },
  'electronics-week': { id: 'electronics-week', name: 'Tech & Gaming Week', description: 'Electric violet & cyan tech theme.', active: false, targetRegions: ['GLOBAL'], previewMode: false, colors: { primary: '#7C3AED', secondary: '#06B6D4', accent: '#F59E0B', background: '#0F172A', bannerGradient: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)', badgeBg: '#EDE9FE', badgeText: '#5B21B6' }, branding: { appTitle: 'AuraTech Mega Electronics Week', heroBannerUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&auto=format&fit=crop&q=80', splashBgColor: '#7C3AED', promoTagline: 'Smartphones, Audio & Next-Gen Laptops' }, campaignVisibility: { heroCarousel: true, flashSale: true, sponsoredStrip: true, lookbook: true, liveDeals: true } }
};

export function getActiveTheme(): ThemeConfig {
  const active = Object.values(THEME_REGISTRY).find((t) => t.active);
  return active || THEME_REGISTRY.default;
}
