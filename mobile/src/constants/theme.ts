/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

let Platform: any = {
  OS: 'web',
  select: (obj: any) => obj.web || obj.default || obj.ios || obj.android,
};
try {
  Platform = require('react-native').Platform || Platform;
} catch (e) {
  // Fallback in Node test context
}

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

// ─── CMD-060 Surface Themes ───────────────────────────────────────────────────

export interface ColorPalette {
  primary: string;
  primaryDark: string;
  accent: string;
  background: string;
  cardBackground: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  badgeBackground: string;
  badgeText: string;
  error: string;
  success: string;
}

export const MARKETPLACE_THEME: ColorPalette = {
  primary: '#6366F1', // Indigo
  primaryDark: '#4F46E5',
  accent: '#F59E0B',
  background: '#F9FAFB',
  cardBackground: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  badgeBackground: '#EEF2FF',
  badgeText: '#4338CA',
  error: '#EF4444',
  success: '#10B981',
};

export const FLADO_QUICK_THEME: ColorPalette = {
  primary: '#10B981', // Emerald Quick Green
  primaryDark: '#059669',
  accent: '#F59E0B',
  background: '#0F172A', // Dark Charcoal background for 10-min mode
  cardBackground: '#1E293B',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  border: '#334155',
  badgeBackground: '#064E3B',
  badgeText: '#6EE7B7',
  error: '#F87171',
  success: '#34D399',
};

export type CommerceSurface = 'MARKETPLACE' | 'QUICK_COMMERCE';

export function getThemeForSurface(surface: CommerceSurface): ColorPalette {
  return surface === 'QUICK_COMMERCE' ? FLADO_QUICK_THEME : MARKETPLACE_THEME;
}

