import React from 'react';
import { View } from 'react-native';

import { SDUISection } from '../hooks/useFladoSDUI';
import { FlashSaleStrip } from '../components/flado/FlashSaleStrip';
import { FladoHeroCarousel } from '../components/flado/FladoHeroCarousel';
import { PromoStripBanner } from '../components/flado/PromoStripBanner';
import { CategoryGrid } from '../components/flado/CategoryGrid';
import { ShopCarousel } from '../components/flado/ShopCarousel';
import { TrendingProducts } from '../components/flado/TrendingProducts';
import { CategorySpotlight } from '../components/flado/CategorySpotlight';
import { FestivalBanner } from '../components/flado/FestivalBanner';
import { LoyaltyHook } from '../components/flado/LoyaltyHook';
import { RecentlyOrdered } from '../components/flado/RecentlyOrdered';
import { BrandStrip } from '../components/flado/BrandStrip';
import { BundleDeals } from '../components/flado/BundleDeals';
import { NewArrivals } from '../components/flado/NewArrivals';

export interface SDUIContext {
  products: any[];
  nearbyStores: any[];
  selectedStoreId?: string;
  selectedCategory?: string | null;
  etaMinutes: number;
  rewardPoints: number;
  getItemQuantity: (id: string) => number;
  onAdjustQuantity: (product: any, delta: number) => void;
  onSelectCategory: (slug: string) => void;
  onSelectStore: (store: any) => void;
  onAddBundle: (productIds: string[]) => void;
  onNavigate: (route: string, params?: any) => void;
}

export function renderSDUISection(section: SDUISection, ctx: SDUIContext) {
  if (!section || !section.visible) return null;

  switch (section.type) {
    case 'top_flash_ticker':
      return (
        <FlashSaleStrip
          key={section.id}
          config={section.config}
          onPress={() => ctx.onNavigate('/flado/offers')}
        />
      );

    case 'flado_hero_carousel':
      return (
        <FladoHeroCarousel
          key={section.id}
          config={section.config}
          onBannerPress={(banner) => ctx.onNavigate('/flado')}
        />
      );

    case 'flado_promo_banner':
      return (
        <PromoStripBanner
          key={section.id}
          config={section.config}
          onPress={() => ctx.onNavigate('/flado/offers')}
        />
      );

    case 'flado_category_pills':
      return (
        <CategoryGrid
          key={section.id}
          categories={section.config?.categories}
          selectedCategory={ctx.selectedCategory}
          onSelectCategory={ctx.onSelectCategory}
        />
      );

    case 'flado_featured_shops':
      return (
        <ShopCarousel
          key={section.id}
          stores={ctx.nearbyStores}
          selectedStoreId={ctx.selectedStoreId}
          onSelectStore={ctx.onSelectStore}
        />
      );

    case 'flado_product_row':
      const rowTitle = section.config?.title || 'Products';
      const subCat = section.config?.subCategory;

      let filtered = ctx.products;
      if (subCat && subCat !== 'Trending') {
        const query = subCat.toLowerCase();
        filtered = ctx.products.filter((p) => {
          const cat = (p.category || '').toLowerCase();
          const sub = (p.subCategory || '').toLowerCase();
          const name = (p.name || '').toLowerCase();
          return (
            cat.includes(query) ||
            sub.includes(query) ||
            name.includes(query) ||
            (query.includes('fruit') && (cat.includes('fruit') || cat.includes('veg'))) ||
            (query.includes('veg') && (cat.includes('fruit') || cat.includes('veg'))) ||
            (query.includes('dairy') && (cat.includes('dairy') || cat.includes('milk') || cat.includes('bread'))) ||
            (query.includes('milk') && (cat.includes('dairy') || cat.includes('milk') || cat.includes('bread')))
          );
        });
      }

      if (!filtered || filtered.length === 0) {
        filtered = ctx.products;
      }

      if (subCat === 'Trending') {
        return (
          <TrendingProducts
            key={section.id}
            title={rowTitle}
            products={filtered.slice(0, 8)}
            etaMinutes={ctx.etaMinutes}
            getItemQuantity={ctx.getItemQuantity}
            onAdjustQuantity={ctx.onAdjustQuantity}
            onProductPress={(id) => ctx.onNavigate(`/products/${id}`)}
          />
        );
      }

      return (
        <CategorySpotlight
          key={section.id}
          title={rowTitle}
          emoji={section.config?.title?.split(' ')[0] || '🛒'}
          products={filtered.slice(0, 8)}
          etaMinutes={ctx.etaMinutes}
          getItemQuantity={ctx.getItemQuantity}
          onAdjustQuantity={ctx.onAdjustQuantity}
          onSeeAllPress={() => ctx.onNavigate('/(tabs)/search', { query: rowTitle })}
          onProductPress={(id) => ctx.onNavigate(`/products/${id}`)}
        />
      );

    case 'flado_loyalty_hook':
      return (
        <LoyaltyHook
          key={section.id}
          rewardPoints={ctx.rewardPoints}
          config={section.config}
          onPress={() => ctx.onNavigate('/account/wallet')}
        />
      );

    case 'flado_recently_ordered':
      return (
        <RecentlyOrdered
          key={section.id}
          products={ctx.products.slice(0, 4)}
          getItemQuantity={ctx.getItemQuantity}
          onAdjustQuantity={ctx.onAdjustQuantity}
        />
      );

    case 'flado_sponsor_row':
      return (
        <BrandStrip
          key={section.id}
          onBrandPress={(slug) => ctx.onNavigate('/(tabs)/search', { query: slug })}
        />
      );

    case 'flado_combo_bundles':
      return (
        <BundleDeals
          key={section.id}
          onAddBundle={ctx.onAddBundle}
        />
      );

    case 'flado_new_arrivals':
      return (
        <NewArrivals
          key={section.id}
          products={ctx.products.slice(2, 8)}
          getItemQuantity={ctx.getItemQuantity}
          onAdjustQuantity={ctx.onAdjustQuantity}
          onProductPress={(id) => ctx.onNavigate(`/products/${id}`)}
        />
      );

    default:
      return null;
  }
}

export default renderSDUISection;
