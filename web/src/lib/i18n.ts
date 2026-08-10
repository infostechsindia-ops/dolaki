export type SupportedLocale = 'en' | 'ar' | 'hi';
export type SupportedCurrency = 'INR' | 'AED' | 'USD' | 'EUR' | 'GBP';

export interface MarketProfile {
  countryCode: string;
  countryName: string;
  defaultCurrency: SupportedCurrency;
  defaultLocale: SupportedLocale;
  vatRatePercent: number;
  codAvailable: boolean;
  phonePrefix: string;
}

export type { CmsPageData, ContentBlock } from './content-data';

export const MARKET_PROFILES: Record<string, MarketProfile> = {
  IN: {
    countryCode: 'IN',
    countryName: 'India',
    defaultCurrency: 'INR',
    defaultLocale: 'en',
    vatRatePercent: 18.0,
    codAvailable: true,
    phonePrefix: '+91',
  },
  AE: {
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    defaultCurrency: 'AED',
    defaultLocale: 'ar',
    vatRatePercent: 5.0,
    codAvailable: true,
    phonePrefix: '+971',
  },
  SA: {
    countryCode: 'SA',
    countryName: 'Saudi Arabia',
    defaultCurrency: 'USD',
    defaultLocale: 'ar',
    vatRatePercent: 15.0,
    codAvailable: true,
    phonePrefix: '+966',
  },
};

export const EXCHANGE_RATES: Record<SupportedCurrency, number> = {
  INR: 1.0,
  AED: 0.044,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0094,
};

export const TRANSLATIONS: Record<SupportedLocale, Record<string, string>> = {
  en: {
    welcome: 'Welcome to AuraMart',
    cart: 'Shopping Cart',
    checkout: 'Checkout',
    search_placeholder: 'Search 100,000+ products across electronics, fashion & groceries...',
    flado_tagline: '10-Minute Grocery Delivery',
  },
  ar: {
    welcome: 'مرحبا بكم في أورامارت',
    cart: 'عربة التسوق',
    checkout: 'الدفع الإلكتروني',
    search_placeholder: 'ابحث عن أكثر من 100,000 منتج في الإلكترونيات والأزياء...',
    flado_tagline: 'توصيل بقالة خلال 10 دقائق',
  },
  hi: {
    welcome: 'औरामार्ट में आपका स्वागत है',
    cart: 'शॉपिंग कार्ट',
    checkout: 'चेकआउट',
    search_placeholder: 'इलेक्ट्रॉनिक्स, फैशन और ग्रॉसरी के 1,00,000+ उत्पादों में खोजें...',
    flado_tagline: '10 मिनट में ग्रॉसरी डिलीवरी',
  },
};

export function isRtl(locale: SupportedLocale): boolean {
  return locale === 'ar';
}

export function formatCurrencyAmount(amountInBaseInr: number, currency: SupportedCurrency = 'INR'): string {
  const rate = EXCHANGE_RATES[currency] || 1.0;
  const converted = amountInBaseInr * rate;

  switch (currency) {
    case 'AED':
      return `AED ${converted.toFixed(2)}`;
    case 'USD':
      return `$${converted.toFixed(2)}`;
    case 'EUR':
      return `€${converted.toFixed(2)}`;
    case 'GBP':
      return `£${converted.toFixed(2)}`;
    case 'INR':
    default:
      return `₹${Math.round(converted).toLocaleString('en-IN')}`;
  }
}
