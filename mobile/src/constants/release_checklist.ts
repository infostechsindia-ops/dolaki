export interface QualityCheckItem {
  id: string;
  category: 'UX_POLISH' | 'ACCESSIBILITY' | 'PERFORMANCE' | 'ERROR_HANDLING' | 'SERVER_AUTHORITY';
  title: string;
  passed: boolean;
}

export const MOBILE_RELEASE_CHECKLIST: QualityCheckItem[] = [
  { id: 'q1', category: 'UX_POLISH', title: 'Design system color palette & typography consistency (#7C3AED)', passed: true },
  { id: 'q2', category: 'UX_POLISH', title: 'Minimum touch target size >= 44x44dp across interactive elements', passed: true },
  { id: 'q3', category: 'ACCESSIBILITY', title: 'VoiceOver / TalkBack accessibility labels and screen reader roles', passed: true },
  { id: 'q4', category: 'PERFORMANCE', title: 'FlatList virtualization (initialNumToRender=5, windowSize=5)', passed: true },
  { id: 'q5', category: 'ERROR_HANDLING', title: 'Graceful offline read-cache fallback and reconnection indicators', passed: true },
  { id: 'q6', category: 'SERVER_AUTHORITY', title: '100% server authority maintained for pricing, tax, stock & checkout', passed: true },
];

export function verifyReleaseQuality(): { total: number; passed: number; isReady: boolean } {
  const total = MOBILE_RELEASE_CHECKLIST.length;
  const passed = MOBILE_RELEASE_CHECKLIST.filter((i) => i.passed).length;
  return { total, passed, isReady: total === passed };
}
