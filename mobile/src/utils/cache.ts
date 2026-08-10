// Bounded Safe Read-Only LRU Cache Manager for Mobile (CMD-071 / CMD-072)

export interface CachedItem<T = any> {
  data: T;
  cachedAt: number;
  isStale: boolean;
}

const MAX_CACHE_ENTRIES = 50;
const safeMemoryCache = new Map<string, { data: any; cachedAt: number }>();

// Whitelist safe read-only endpoints suitable for caching (NO sensitive/financial/user data)
const SAFE_READ_PATTERNS = [
  /\/sdui\/homepage/,
  /\/products$/,
  /\/products\?/,
  /\/categories/,
  /\/brands/,
];

export function isSafeReadEndpoint(endpoint: string, method: string = 'GET'): boolean {
  if (method.toUpperCase() !== 'GET') return false;
  return SAFE_READ_PATTERNS.some((pattern) => pattern.test(endpoint));
}

export function setSafeReadCache(endpoint: string, data: any): void {
  if (!data) return;

  // Bounded LRU Eviction: Remove oldest entry when limit reached
  if (safeMemoryCache.size >= MAX_CACHE_ENTRIES && !safeMemoryCache.has(endpoint)) {
    const oldestKey = safeMemoryCache.keys().next().value;
    if (oldestKey) {
      safeMemoryCache.delete(oldestKey);
    }
  }

  // Re-insert to refresh LRU position
  safeMemoryCache.delete(endpoint);
  safeMemoryCache.set(endpoint, {
    data,
    cachedAt: Date.now(),
  });
}

export function getSafeReadCache<T>(endpoint: string): CachedItem<T> | null {
  const cached = safeMemoryCache.get(endpoint);
  if (!cached) return null;

  // Refresh LRU position on access
  safeMemoryCache.delete(endpoint);
  safeMemoryCache.set(endpoint, cached);

  return {
    data: cached.data as T,
    cachedAt: cached.cachedAt,
    isStale: true,
  };
}

export function getSafeReadCacheSize(): number {
  return safeMemoryCache.size;
}

export function clearSafeReadCache(): void {
  safeMemoryCache.clear();
}
