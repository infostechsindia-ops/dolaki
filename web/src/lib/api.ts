/**
 * AuraMart Unified API Layer — Phase 16
 * Provides typed fetch wrappers with local-data fallback, error handling,
 * request caching, and loading state management.
 *
 * Usage:
 *   import { api } from '@/lib/api';
 *   const products = await api.products.getAll();
 *   const product  = await api.products.getById('ele-1');
 */

import { products as localProducts, Product } from '@/data/products';
import { fladoProductsData as localFladoProducts } from '@/data/fladoProducts';
import { brandsData as localBrands, Brand } from '@/data/brands';
import { promoPagesRegistry, PromoPageConfig } from '@/data/promoLayouts';
import { API_BASE_URL } from '@/lib/config';

// ─── Config ───────────────────────────────────────────────────────────────────
const BASE_URL = API_BASE_URL;
const DEFAULT_TIMEOUT_MS = 8000;

// ─── Request Cache (in-memory, TTL-based) ────────────────────────────────────
interface CacheEntry<T> { data: T; expiresAt: number; }
const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL_MS = 60_000; // 1 minute

function getCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { cache.delete(key); return null; }
  return entry.data;
}

function setCached<T>(key: string, data: T): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

// ─── Core Fetch Wrapper ───────────────────────────────────────────────────────
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}/api/v1${path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-AuraMart-Client': 'web-v2',
      },
      signal: controller.signal,
      ...options,
    });

    if (!res.ok) {
      throw new ApiError(`HTTP ${res.status}`, res.status, path);
    }

    const json = await res.json();
    if (json && typeof json === 'object' && 'data' in json) {
      return json.data as T;
    }
    return json as T;
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Error Class ─────────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly endpoint: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── Generic Query Helper (fetch → cache → local fallback) ───────────────────
async function query<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  fallback: () => T,
): Promise<T> {
  // 1. Return from cache if fresh
  const cached = getCached<T>(cacheKey);
  if (cached !== null) return cached;

  // 2. Try remote API if BASE_URL is configured
  if (BASE_URL) {
    try {
      const data = await fetchFn();
      setCached(cacheKey, data);
      return data;
    } catch (err) {
      console.warn(`[AuraMart API] "${cacheKey}" failed, using local fallback.`, err);
    }
  }

  // 3. Fall back to local mock data
  const local = fallback();
  setCached(cacheKey, local);
  return local;
}

// ─── Products API ─────────────────────────────────────────────────────────────
interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  limit?: number;
  search?: string;
}

function applyLocalFilters(prods: Product[], filters: ProductFilters): Product[] {
  let result = [...prods];

  if (filters.category)
    result = result.filter(p => (p.category ?? '').toLowerCase() === filters.category!.toLowerCase());
  if (filters.brand)
    result = result.filter(p => p.brand?.toLowerCase() === filters.brand!.toLowerCase());
  if (filters.minPrice !== undefined)
    result = result.filter(p => p.price >= filters.minPrice!);
  if (filters.maxPrice !== undefined)
    result = result.filter(p => p.price <= filters.maxPrice!);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      (p.category ?? '').toLowerCase().includes(q)
    );
  }

  switch (filters.sortBy) {
    case 'price_asc':  result.sort((a, b) => a.price - b.price); break;
    case 'price_desc': result.sort((a, b) => b.price - a.price); break;
    case 'rating':     result.sort((a, b) => b.rating - a.rating); break;
    case 'newest':
      result.sort((a, b) =>
        new Date(b.launchDate ?? '2020-01-01').getTime() -
        new Date(a.launchDate ?? '2020-01-01').getTime()
      );
      break;
  }

  if (filters.limit) result = result.slice(0, filters.limit);
  return result;
}

export const productsApi = {
  getAll: (filters: ProductFilters = {}) =>
    query(
      `products:${JSON.stringify(filters)}`,
      () => apiFetch<Product[]>(`/products?${new URLSearchParams(filters as Record<string, string>)}`),
      () => applyLocalFilters(localProducts, filters),
    ),

  getById: (id: string) =>
    query(
      `product:${id}`,
      () => apiFetch<Product>(`/products/${id}`),
      () => localProducts.find(p => p.id === id) ?? null,
    ),

  getByCategory: (category: string, limit = 40) =>
    query(
      `products:cat:${category}:${limit}`,
      () => apiFetch<Product[]>(`/products?category=${category}&limit=${limit}`),
      () => localProducts.filter(p => p.category === category).slice(0, limit),
    ),

  getByBrand: (brand: string, limit = 40) =>
    query(
      `products:brand:${brand}:${limit}`,
      () => apiFetch<Product[]>(`/products?brand=${brand}&limit=${limit}`),
      () => localProducts.filter(p => p.brand?.toLowerCase() === brand.toLowerCase()).slice(0, limit),
    ),

  search: (query_: string, limit = 30) =>
    query(
      `search:${query_}:${limit}`,
      () => apiFetch<Product[]>(`/products/search?q=${encodeURIComponent(query_)}&limit=${limit}`),
      () => applyLocalFilters(localProducts, { search: query_, limit }),
    ),

  getNewLaunches: (limit = 24) =>
    query(
      `products:new:${limit}`,
      () => apiFetch<Product[]>(`/products?sort=newest&limit=${limit}`),
      () => [...localProducts]
        .filter((p: Product) => p.launchDate)
        .sort((a: Product, b: Product) => new Date(b.launchDate!).getTime() - new Date(a.launchDate!).getTime())
        .slice(0, limit),
    ),

  getFeatured: (limit = 12) =>
    query(
      `products:featured:${limit}`,
      () => apiFetch<Product[]>(`/products?featured=true&limit=${limit}`),
      () => [...localProducts].sort((a, b) => b.rating - a.rating).slice(0, limit),
    ),

  getRelated: (product: Product, limit = 8) =>
    query(
      `products:related:${product.id}`,
      () => apiFetch<Product[]>(`/products/${product.id}/related?limit=${limit}`),
      () => localProducts
        .filter(p => p.category === product.category && p.id !== product.id)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit),
    ),
};

// ─── Brands API ───────────────────────────────────────────────────────────────
export interface BrandApiDto {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string | null;
  isActive: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export const brandsApi = {
  /**
   * Fetch all active brands from dedicated /brands endpoint.
   * Supports optional search query and pagination.
   */
  getAll: (opts: { search?: string; page?: number; pageSize?: number } = {}) => {
    const params = new URLSearchParams();
    if (opts.search) params.set('search', opts.search);
    if (opts.page) params.set('page', String(opts.page));
    if (opts.pageSize) params.set('pageSize', String(opts.pageSize));
    const qs = params.toString();
    return query(
      `brands:all:${qs}`,
      () => apiFetch<{ data: BrandApiDto[]; meta: any }>(`/brands${qs ? `?${qs}` : ''}`).then(r => {
        // Server wraps response in { data, meta }
        if (r && typeof r === 'object' && 'data' in r) return r as { data: BrandApiDto[]; meta: any };
        return { data: r as unknown as BrandApiDto[], meta: { total: 0, page: 1, pageSize: 50, hasNextPage: false } };
      }),
      () => ({ data: localBrands.map(b => ({
        id: b.slug,
        name: b.name,
        slug: b.slug,
        logoUrl: b.logo || null,
        description: b.story || null,
        isActive: true,
        productCount: b.featuredProductIds?.length ?? 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })), meta: { total: localBrands.length, page: 1, pageSize: 50, hasNextPage: false } }),
    );
  },

  /**
   * Fetch a single brand by slug from /brands/:slug.
   * Returns null if not found (falls back to local data).
   */
  getBySlug: (slug: string) =>
    query(
      `brand:${slug}`,
      () => apiFetch<BrandApiDto>(`/brands/${slug}`),
      () => {
        const b = localBrands.find((b: Brand) => b.slug === slug);
        if (!b) return null;
        return {
          id: b.slug,
          name: b.name,
          slug: b.slug,
          logoUrl: b.logo || null,
          description: b.story || null,
          isActive: true,
          productCount: b.featuredProductIds?.length ?? 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as BrandApiDto;
      },
    ),

  /**
   * Fetch paginated products for a brand by slug.
   * Server returns products filtered by brand+optional category.
   */
  getProductsByBrand: (slug: string, opts: { category?: string; page?: number; pageSize?: number } = {}) => {
    const params = new URLSearchParams({ brand: slug });
    if (opts.category) params.set('category', opts.category);
    if (opts.page) params.set('page', String(opts.page));
    if (opts.pageSize) params.set('pageSize', String(opts.pageSize ?? 20));
    const qs = params.toString();
    return query(
      `brand-products:${slug}:${qs}`,
      () => apiFetch<{ data: Product[]; meta: any }>(`/products?${qs}`).then(r => {
        if (r && typeof r === 'object' && 'data' in r) return r as { data: Product[]; meta: any };
        return { data: r as unknown as Product[], meta: { total: 0, page: 1, pageSize: 20, hasNextPage: false } };
      }),
      () => {
        const filtered = localProducts.filter(p => p.brand?.toLowerCase() === slug.toLowerCase());
        const page = opts.page ?? 1;
        const pageSize = opts.pageSize ?? 20;
        const sliced = filtered.slice((page - 1) * pageSize, page * pageSize);
        return { data: sliced, meta: { total: filtered.length, page, pageSize, hasNextPage: page * pageSize < filtered.length } };
      },
    );
  },
};

// ─── Flado Products API ───────────────────────────────────────────────────────
export const fladoApi = {
  getProducts: (filters: ProductFilters = {}) =>
    query(
      `flado:products:${JSON.stringify(filters)}`,
      () => apiFetch<typeof localFladoProducts>('/flado/products'),
      () => localFladoProducts as unknown as typeof localFladoProducts,
    ),
};

// ─── Promo/CMS API ────────────────────────────────────────────────────────────
export const promoApi = {
  getPage: (slug: string) =>
    query<PromoPageConfig | null>(
      `promo:${slug}`,
      () => apiFetch<PromoPageConfig>(`/promo/${slug}`),
      () => promoPagesRegistry[slug] ?? null,
    ),

  getAllSlugs: () =>
    query(
      'promo:slugs',
      () => apiFetch<string[]>('/promo'),
      () => Object.keys(promoPagesRegistry),
    ),
};

// ─── Orders API (mock-ready) ──────────────────────────────────────────────────
interface Order {
  id: string;
  status: 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  items: { productId: string; qty: number; price: number }[];
  total: number;
  createdAt: string;
  estimatedDelivery: string;
  trackingId?: string;
  address: { line1: string; city: string; pincode: string; state: string };
}

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2026-001',
    status: 'delivered',
    items: [{ productId: 'ele-1', qty: 1, price: 79999 }],
    total: 79999,
    createdAt: '2026-06-20',
    estimatedDelivery: '2026-06-25',
    trackingId: 'BLR-TK-291847',
    address: { line1: '42, MG Road', city: 'Bengaluru', pincode: '560001', state: 'Karnataka' },
  },
  {
    id: 'ORD-2026-002',
    status: 'shipped',
    items: [
      { productId: 'fas-1', qty: 2, price: 1299 },
      { productId: 'bea-1', qty: 1, price: 1299 },
    ],
    total: 3897,
    createdAt: '2026-07-01',
    estimatedDelivery: '2026-07-04',
    trackingId: 'DEL-TK-887621',
    address: { line1: '7, Connaught Place', city: 'New Delhi', pincode: '110001', state: 'Delhi' },
  },
];

export const ordersApi = {
  getAll: () =>
    query<Order[]>(
      'orders:all',
      () => apiFetch<Order[]>('/orders'),
      () => MOCK_ORDERS,
    ),

  getById: (id: string) =>
    query<Order | null>(
      `order:${id}`,
      () => apiFetch<Order>(`/orders/${id}`),
      () => MOCK_ORDERS.find(o => o.id === id) ?? null,
    ),

  track: (trackingId: string) =>
    query(
      `track:${trackingId}`,
      () => apiFetch<{ status: string; eta: string; events: { time: string; desc: string }[] }>(`/track/${trackingId}`),
      () => ({
        status: 'In Transit',
        eta: '2 hours',
        events: [
          { time: '10:00 AM', desc: 'Picked up from seller warehouse' },
          { time: '1:30 PM', desc: 'Arrived at sorting hub — Bengaluru' },
          { time: '4:00 PM', desc: 'Out for delivery — expected by 7 PM' },
        ],
      }),
    ),
};

// ─── User API (mock-ready) ────────────────────────────────────────────────────
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  auraCoins: number;
  tier: 'Silver' | 'Gold' | 'Platinum';
  addresses: { id: string; label: string; line1: string; city: string; pincode: string; state: string; isDefault: boolean }[];
}

const MOCK_USER: UserProfile = {
  id: 'usr-001',
  name: 'Arif Al-Nukhbah',
  email: 'arif@auramart.in',
  phone: '+91 98765 43210',
  auraCoins: 2480,
  tier: 'Gold',
  addresses: [
    { id: 'addr-1', label: 'Home', line1: '42, MG Road', city: 'Bengaluru', pincode: '560001', state: 'Karnataka', isDefault: true },
    { id: 'addr-2', label: 'Office', line1: '7th Floor, Prestige Tower', city: 'Bengaluru', pincode: '560025', state: 'Karnataka', isDefault: false },
  ],
};

export const userApi = {
  getProfile: () =>
    query<UserProfile>(
      'user:profile',
      () => apiFetch<UserProfile>('/user/profile'),
      () => MOCK_USER,
    ),

  updateProfile: async (data: Partial<UserProfile>) => {
    if (BASE_URL) {
      return apiFetch<UserProfile>('/user/profile', { method: 'PATCH', body: JSON.stringify(data) });
    }
    // Local mock update
    Object.assign(MOCK_USER, data);
    cache.delete('user:profile');
    return { ...MOCK_USER, ...data };
  },
};

// ─── Reviews API ──────────────────────────────────────────────────────────────
interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  verified: boolean;
  helpful: number;
  images?: string[];
}

export const reviewsApi = {
  getForProduct: (productId: string) =>
    query<Review[]>(
      `reviews:${productId}`,
      () => apiFetch<Review[]>(`/reviews?productId=${productId}`),
      () => [
        {
          id: `rev-${productId}-1`,
          productId,
          userId: 'usr-a',
          userName: 'Verified Buyer',
          rating: 5,
          title: 'Exceeded all expectations',
          body: 'The product quality is outstanding. Packaging was secure and delivery was faster than estimated. Highly recommended.',
          createdAt: '2026-06-15',
          verified: true,
          helpful: 24,
        },
        {
          id: `rev-${productId}-2`,
          productId,
          userId: 'usr-b',
          userName: 'Happy Customer',
          rating: 4,
          title: 'Great value for money',
          body: 'Really happy with the purchase. Minor packaging issue but the product itself is perfect. Would buy again.',
          createdAt: '2026-06-10',
          verified: true,
          helpful: 12,
        },
      ],
    ),

  submit: async (review: Omit<Review, 'id' | 'createdAt' | 'helpful'>) => {
    if (BASE_URL) {
      return apiFetch<Review>('/reviews', { method: 'POST', body: JSON.stringify(review) });
    }
    return { ...review, id: `rev-${Date.now()}`, createdAt: new Date().toISOString(), helpful: 0 };
  },
};

// ─── Wishlist API ─────────────────────────────────────────────────────────────
export const wishlistApi = {
  get: (): string[] => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('auramart_wishlist') ?? '[]');
    } catch { return []; }
  },

  add: (productId: string): void => {
    if (typeof window === 'undefined') return;
    const list = wishlistApi.get();
    if (!list.includes(productId)) {
      localStorage.setItem('auramart_wishlist', JSON.stringify([...list, productId]));
    }
  },

  remove: (productId: string): void => {
    if (typeof window === 'undefined') return;
    const list = wishlistApi.get().filter(id => id !== productId);
    localStorage.setItem('auramart_wishlist', JSON.stringify(list));
  },

  toggle: (productId: string): boolean => {
    const list = wishlistApi.get();
    const exists = list.includes(productId);
    exists ? wishlistApi.remove(productId) : wishlistApi.add(productId);
    return !exists;
  },

  getProducts: () => {
    const ids = wishlistApi.get();
    return localProducts.filter(p => ids.includes(p.id));
  },
};

// ─── Delivery ETA API ─────────────────────────────────────────────────────────
interface ETAResponse {
  pincode: string;
  city: string;
  state: string;
  standardDays: number;
  expressDays: number;
  fladoAvailable: boolean;
  fladoMinutes?: number;
  codAvailable: boolean;
  estimatedDate: string;
}

export const deliveryApi = {
  getETA: (pincode: string) =>
    query<ETAResponse>(
      `eta:${pincode}`,
      () => apiFetch<ETAResponse>(`/delivery/eta?pincode=${pincode}`),
      () => {
        const metro = ['110001','400001','560001','600001','500001','700001'].includes(pincode);
        const now = new Date();
        now.setDate(now.getDate() + (metro ? 1 : 3));
        return {
          pincode,
          city: metro ? 'Metro City' : 'Your City',
          state: 'India',
          standardDays: metro ? 1 : 3,
          expressDays: metro ? 0 : 1,
          fladoAvailable: metro,
          fladoMinutes: metro ? 10 : undefined,
          codAvailable: true,
          estimatedDate: now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
        };
      },
    ),
};

// ─── Consolidated API Object ──────────────────────────────────────────────────
export const api = {
  products: productsApi,
  brands:   brandsApi,
  flado:    fladoApi,
  promo:    promoApi,
  orders:   ordersApi,
  user:     userApi,
  reviews:  reviewsApi,
  wishlist: wishlistApi,
  delivery: deliveryApi,
} as const;

export type { Product, Order, UserProfile, Review, ETAResponse, ProductFilters };
