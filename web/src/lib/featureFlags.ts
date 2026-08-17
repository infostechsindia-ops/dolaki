export interface FeatureFlags {
  enableFlashSales: boolean;
  enableAiSearch: boolean;
  enableQuickCommerce: boolean;
  enableWallet: boolean;
  enableRewards: boolean;
  enableReferrals: boolean;
  enableLiveChat: boolean;
  enableSeasonalThemes: boolean;
  enablePromotionalBanners: boolean;
}

export const defaultFeatureFlags: FeatureFlags = {
  enableFlashSales: process.env.NEXT_PUBLIC_FLAG_FLASH_SALES !== 'false',
  enableAiSearch: process.env.NEXT_PUBLIC_FLAG_AI_SEARCH !== 'false',
  enableQuickCommerce: process.env.NEXT_PUBLIC_FLAG_QUICK_COMMERCE !== 'false',
  enableWallet: process.env.NEXT_PUBLIC_FLAG_WALLET !== 'false',
  enableRewards: process.env.NEXT_PUBLIC_FLAG_REWARDS !== 'false',
  enableReferrals: process.env.NEXT_PUBLIC_FLAG_REFERRALS !== 'false',
  enableLiveChat: process.env.NEXT_PUBLIC_FLAG_LIVE_CHAT !== 'false',
  enableSeasonalThemes: process.env.NEXT_PUBLIC_FLAG_SEASONAL_THEMES !== 'false',
  enablePromotionalBanners: process.env.NEXT_PUBLIC_FLAG_PROMOTIONAL_BANNERS !== 'false',
};

export function isFeatureEnabled(flagName: keyof FeatureFlags, customFlags?: Partial<FeatureFlags>): boolean {
  if (customFlags && customFlags[flagName] !== undefined) {
    return Boolean(customFlags[flagName]);
  }
  return Boolean(defaultFeatureFlags[flagName]);
}
