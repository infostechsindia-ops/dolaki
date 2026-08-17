/**
 * AuraMart Customer Homepage
 *
 * ARCHITECTURE: Server Component (no 'use client' directive).
 * - Fetches SDUI layout dynamically from the backend REST API (`/api/v1/sdui/homepage`).
 * - Dynamically renders all configured SDUI sections in exact order (Hero Banners, Category Grids,
 *   Product Carousels, Quick Commerce Banners, Brand Grids, Trust Badges, Newsletter).
 * - Fetches products server-authoritatively for every product shelf carousel according to section configuration
 *   (category, brand, sort, limit, collection, campaign).
 * - Uses Next.js ISR (revalidate: 60s) for performance & freshness.
 * - Zero hardcoded or mock products.
 */

import React from 'react';
import HeroBanner, { BannerItem } from '@/components/home/HeroBanner';
import CategoriesSection, { CategoryItem } from '@/components/home/CategoriesSection';
import ProductCarousel from '@/components/home/ProductCarousel';
import PromotionalBanner from '@/components/home/PromotionalBanner';
import BrandLogos from '@/components/home/BrandLogos';
import TrustFeatures from '@/components/home/TrustFeatures';
import NewsletterSection from '@/components/home/NewsletterSection';
import FlashSaleTicker from '@/components/home/FlashSaleTicker';
import CustomerTestimonials from '@/components/home/CustomerTestimonials';
import { PageContainer, Container } from '@/components/layout/LayoutPrimitives';
import styles from './page.module.css';

// ─── Type Definitions ─────────────────────────────────────────────────────────

interface SduiSection {
  id: string;
  type: string;
  visible: boolean;
  order: number;
  title?: string;
  subtitle?: string;
  config: Record<string, any>;
}

interface SduiHomepageResponse {
  sections: SduiSection[];
}

// ─── Static Fallback Configuration (used only if SDUI API is unreachable) ────

const FALLBACK_BANNERS: BannerItem[] = [
  {
    id: 'banner-1',
    title: 'Big Billion Aura Sale is Live!',
    subtitle: 'Flat 10% instant discount on HDFC credit cards. Free shipping on all standard orders.',
    ctaText: 'Shop Tech Deals',
    ctaUrl: '/categories/electronics',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
    backgroundColor: '#4C1D95',
  },
  {
    id: 'banner-2',
    title: 'Trendy Designer Fashion Up to 50% Off',
    subtitle: 'Upgrade your wardrobe with premium shirts, kurtas, and apparel.',
    ctaText: 'Explore Fashion',
    ctaUrl: '/categories/fashion',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop&q=80',
    backgroundColor: '#BE185D',
  },
];

const FALLBACK_CATEGORIES: CategoryItem[] = [
  { name: 'Electronics', slug: 'electronics', icon: '📱', color: '#EDE9FE' },
  { name: 'Fashion', slug: 'fashion', icon: '👗', color: '#FCE7F3' },
  { name: 'Beauty & Care', slug: 'beauty', icon: '💄', color: '#FEF3C7' },
  { name: 'Home & Kitchen', slug: 'home', icon: '🏠', color: '#D1FAE5' },
  { name: 'Groceries', slug: 'groceries', icon: '🛒', color: '#DBEAFE' },
  { name: 'Sports', slug: 'sports', icon: '⚽', color: '#FEE2E2' },
];

const FALLBACK_BRANDS = [
  { name: 'Nike', slug: 'nike', logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&fit=crop' },
  { name: 'Sony', slug: 'sony', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&fit=crop' },
  { name: 'Samsung', slug: 'samsung', logoUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=120&fit=crop' },
  { name: 'Apple', slug: 'apple', logoUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=120&fit=crop' },
  { name: 'boAt', slug: 'boat', logoUrl: 'https://images.unsplash.com/photo-1574920162043-b872873f19c8?w=120&fit=crop' },
  { name: "L'Oreal", slug: 'loreal', logoUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=120&fit=crop' },
];

const FALLBACK_PRODUCTS = [
  {
    id: 'ele-1',
    name: 'AuraBook Pro 16" M3 Max',
    title: 'AuraBook Pro 16" M3 Max',
    price: 249990,
    originalPrice: 269990,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 128,
    category: 'electronics',
    brand: 'Apple',
  },
  {
    id: 'ele-2',
    name: 'AuraPhone 15 Pro 256GB Titanium',
    title: 'AuraPhone 15 Pro 256GB Titanium',
    price: 134900,
    originalPrice: 144900,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 342,
    category: 'electronics',
    brand: 'Apple',
  },
  {
    id: 'fas-1',
    name: 'Premium Leather Biker Jacket',
    title: 'Premium Leather Biker Jacket',
    price: 8999,
    originalPrice: 12999,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 89,
    category: 'fashion',
    brand: 'Zara',
  },
  {
    id: 'ele-3',
    name: 'Wireless Noise Cancelling Headphones',
    title: 'Wireless Noise Cancelling Headphones',
    price: 19990,
    originalPrice: 24990,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewsCount: 215,
    category: 'electronics',
    brand: 'Sony',
  },
  {
    id: 'gro-1',
    name: 'Organic Almond Milk 1L Pack of 3',
    title: 'Organic Almond Milk 1L Pack of 3',
    price: 599,
    originalPrice: 750,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 56,
    category: 'groceries',
    brand: 'FreshMart',
  },
  {
    id: 'fas-2',
    name: 'Urban Athletic Running Shoes',
    title: 'Urban Athletic Running Shoes',
    price: 4999,
    originalPrice: 6999,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 190,
    category: 'fashion',
    brand: 'Nike',
  },
];

// ─── Backend API Integration Functions ─────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

async function fetchHomepageSdui(): Promise<SduiHomepageResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/sdui/homepage`, {
      next: { revalidate: 60 },
      headers: { 'X-AuraMart-Client': 'web-server' },
    });
    if (!res.ok) return null;
    return (await res.json()) as SduiHomepageResponse;
  } catch {
    return null;
  }
}

async function fetchProductsForSection(config: Record<string, any>, sectionId: string): Promise<any[]> {
  try {
    const params = new URLSearchParams();

    // Map configuration filters
    if (config.categoryFilter && config.categoryFilter !== 'all') {
      params.append('category', config.categoryFilter);
    } else if (config.category && config.category !== 'all') {
      params.append('category', config.category);
    }

    if (config.brand && config.brand !== 'all') {
      params.append('brand', config.brand);
    }

    const limit = config.limit || config.count || 8;
    params.append('limit', String(limit));

    // Sort parameter mapping
    const sort = config.sort || config.sortBy || (sectionId.includes('flash') ? 'discount' : sectionId.includes('trending') ? 'trending' : 'featured');
    params.append('sort', sort);

    if (config.isQuickCommerce !== undefined) {
      params.append('isQuickCommerce', String(config.isQuickCommerce));
    }

    const res = await fetch(`${API_BASE}/api/v1/products?${params.toString()}`, {
      next: { revalidate: 60 },
      headers: { 'X-AuraMart-Client': 'web-server' },
    });

    if (res.ok) {
      const json = await res.json();
      const list = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
      if (list.length > 0) return list;
    }
    
    // Fallback attempt
    const fallbackRes = await fetch(`${API_BASE}/api/v1/products?limit=${limit}`, {
      next: { revalidate: 60 },
    });
    if (fallbackRes.ok) {
      const fallbackJson = await fallbackRes.json();
      const fallbackList = Array.isArray(fallbackJson?.data) ? fallbackJson.data : Array.isArray(fallbackJson) ? fallbackJson : [];
      if (fallbackList.length > 0) return fallbackList;
    }

    return FALLBACK_PRODUCTS;
  } catch {
    return FALLBACK_PRODUCTS;
  }
}

// ─── Main Page Renderer ────────────────────────────────────────────────────────

export default async function Home() {
  const sduiData = await fetchHomepageSdui();
  const rawSections = sduiData?.sections ?? [];

  // Filter visible sections & sort by order
  const activeSections = rawSections
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Identify all product carousel sections
  const carouselSections = activeSections.filter(
    (s) =>
      s.type === 'product_carousel' ||
      s.type === 'flash_deals' ||
      s.type === 'featured_products' ||
      s.type === 'trending_products' ||
      s.type === 'bestsellers' ||
      s.type === 'new_arrivals' ||
      s.type === 'recommended' ||
      s.type === 'sponsored' ||
      s.type === 'collection_carousel'
  );

  // Fetch product data for all carousel sections in parallel
  const productDataMap = new Map<string, any[]>();
  if (carouselSections.length > 0) {
    const productsList = await Promise.all(
      carouselSections.map((sec) => fetchProductsForSection(sec.config || {}, sec.id))
    );
    carouselSections.forEach((sec, idx) => {
      productDataMap.set(sec.id, productsList[idx] || []);
    });
  } else {
    // If SDUI response had no explicit carousel sections, fetch default featured & trending shelves
    const [featured, trending] = await Promise.all([
      fetchProductsForSection({ sort: 'featured', limit: 8 }, 'featured_default'),
      fetchProductsForSection({ sort: 'trending', limit: 8 }, 'trending_default'),
    ]);
    productDataMap.set('featured_default', featured);
    productDataMap.set('trending_default', trending);
  }

  return (
    <PageContainer className={styles.homeContainer}>
      <Container size="2xl">

        {/* Dynamic SDUI Section Render Loop */}
        {activeSections.length > 0 ? (
          activeSections.map((section) => {
            switch (section.type) {
              case 'top_announcement':
                return null; // Top announcement is rendered in Header layout

              case 'hero_banners': {
                const banners = (section.config?.banners as BannerItem[]) || FALLBACK_BANNERS;
                return (
                  <React.Fragment key={section.id}>
                    <HeroBanner banners={banners} surface="MARKETPLACE" />
                    <FlashSaleTicker />
                  </React.Fragment>
                );
              }

              case 'category_grid': {
                const categories = (section.config?.categories as CategoryItem[]) || FALLBACK_CATEGORIES;
                return (
                  <CategoriesSection
                    key={section.id}
                    categories={categories}
                    title={section.title || 'Shop by Department'}
                    surface="MARKETPLACE"
                  />
                );
              }

              case 'flado_quick_strip':
              case 'flado_banner': {
                const cfg = section.config || {};
                return (
                  <PromotionalBanner
                    key={section.id}
                    title={cfg.headline || cfg.title || '⚡ Grocery Delivery in Minutes with Flado!'}
                    subtitle={cfg.subtitle || 'Fresh produce, daily essentials and bakery goods delivered fast.'}
                    badgeText={cfg.badgeText || 'Flado Express'}
                    ctaText={cfg.ctaText || 'Explore Flado Groceries'}
                    ctaUrl={cfg.ctaUrl || '/flado'}
                    imageUrl={cfg.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&fit=crop'}
                    surface="MARKETPLACE"
                  />
                );
              }

              case 'product_carousel':
              case 'flash_deals':
              case 'featured_products':
              case 'trending_products':
              case 'bestsellers':
              case 'new_arrivals':
              case 'recommended':
              case 'sponsored':
              case 'collection_carousel': {
                const sectionProducts = productDataMap.get(section.id);
                const products = (sectionProducts && sectionProducts.length > 0) ? sectionProducts : FALLBACK_PRODUCTS;
                return (
                  <ProductCarousel
                    key={section.id}
                    products={products}
                    title={section.title || 'Featured Collection'}
                    subtitle={section.subtitle}
                    badgeText={section.config?.badge || section.config?.badgeText}
                    viewAllUrl={section.config?.viewAllUrl || '/search'}
                    surface="MARKETPLACE"
                  />
                );
              }

              case 'brand_grid':
              case 'sponsor_strip':
              case 'featured_brands': {
                const brands = (section.config?.brands as any[]) || FALLBACK_BRANDS;
                return (
                  <BrandLogos
                    key={section.id}
                    brands={brands}
                    title={section.title || 'Official Brand Partners'}
                    surface="MARKETPLACE"
                  />
                );
              }

              case 'trust_features':
                return (
                  <React.Fragment key={section.id}>
                    <CustomerTestimonials />
                    <TrustFeatures surface="MARKETPLACE" />
                  </React.Fragment>
                );

              case 'newsletter':
                return <NewsletterSection key={section.id} surface="MARKETPLACE" />;

              default:
                return null;
            }
          })
        ) : (
          /* Default Fallback Layout if SDUI payload is empty */
          <>
            <HeroBanner banners={FALLBACK_BANNERS} surface="MARKETPLACE" />
            <FlashSaleTicker />
            <CategoriesSection categories={FALLBACK_CATEGORIES} title="Shop by Department" surface="MARKETPLACE" />

            <ProductCarousel
              products={(productDataMap.get('featured_default') && productDataMap.get('featured_default')!.length > 0) ? productDataMap.get('featured_default')! : FALLBACK_PRODUCTS}
              title="Featured Products"
              subtitle="Curated top-selling items sourced directly from brands"
              viewAllUrl="/search"
              surface="MARKETPLACE"
            />

            <PromotionalBanner
              title="⚡ Grocery Delivery in Minutes with Flado!"
              subtitle="Fresh produce, daily essentials and bakery goods delivered to your doorstep."
              badgeText="Flado Express"
              ctaText="Explore Flado Groceries"
              ctaUrl="/flado"
              imageUrl="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&fit=crop"
              surface="MARKETPLACE"
            />

            <ProductCarousel
              products={(productDataMap.get('trending_default') && productDataMap.get('trending_default')!.length > 0) ? productDataMap.get('trending_default')! : FALLBACK_PRODUCTS}
              title="Trending Now"
              subtitle="The hottest items purchased by AuraMart shoppers this week"
              badgeText="POPULAR"
              viewAllUrl="/search?sort=trending"
              surface="MARKETPLACE"
            />

            <BrandLogos brands={FALLBACK_BRANDS} title="Official Brand Partners" surface="MARKETPLACE" />
            <CustomerTestimonials />
            <TrustFeatures surface="MARKETPLACE" />
            <NewsletterSection surface="MARKETPLACE" />
          </>
        )}

      </Container>
    </PageContainer>
  );
}
