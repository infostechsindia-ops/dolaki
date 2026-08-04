import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api';

const SDUI_CACHE_KEY = 'flado_sdui_cache_v2';

export interface SDUISection {
  id: string;
  type: string;
  visible: boolean;
  order: number;
  title?: string;
  config: any;
}

const DEFAULT_SDUI_SECTIONS: SDUISection[] = [
  { id: 'top_flash_ticker', type: 'top_flash_ticker', visible: true, order: 0, title: '🔥 Top Flash Sale Ticker', config: { title: '🔥 FLASH SALE: Flat 40% OFF Farm Fresh Veggies!' } },
  { id: 'flado_hero_carousel', type: 'flado_hero_carousel', visible: true, order: 1, title: '🖼️ Hero Banners Carousel', config: {} },
  { id: 'flado_promo_strip_1', type: 'flado_promo_banner', visible: true, order: 2, title: '⚡ Replaceable Promo Strip Banner #1', config: { title: 'Craving snacks? Chilled beverages & chips in 10 mins!' } },
  { id: 'flado_category_pills', type: 'flado_category_pills', visible: true, order: 3, title: '🥬 12 Quick Emoji Category Chips', config: {} },
  { id: 'flado_trending', type: 'flado_product_row', visible: true, order: 4, title: '🔥 Trending Products Near You', config: { title: '🔥 Trending Now Near You', subCategory: 'Trending' } },
  { id: 'flado_promo_strip_2', type: 'flado_promo_banner', visible: true, order: 5, title: '🛒 Replaceable Promo Strip Banner #2', config: { title: 'Monthly Ration Special: Get Flat ₹150 OFF with code RATION150' } },
  { id: 'flado_featured_shops', type: 'flado_featured_shops', visible: true, order: 6, title: '🏪 Nearby Grocery Shops', config: {} },
  { id: 'flado_row_fruits', type: 'flado_product_row', visible: true, order: 7, title: '🍎 Fresh Fruits & Vegetables', config: { title: '🍎 Fresh Fruits & Vegetables', subCategory: 'Fruits & Vegetables' } },
  { id: 'flado_row_dairy', type: 'flado_product_row', visible: true, order: 8, title: '🥛 Dairy, Bread & Eggs', config: { title: '🥛 Dairy, Bread & Eggs', subCategory: 'Dairy, Bread & Eggs' } },
  { id: 'flado_loyalty_hook', type: 'flado_loyalty_hook', visible: true, order: 9, title: '✨ AuraCoins Loyalty Cash Back', config: {} },
  { id: 'flado_promo_strip_3', type: 'flado_promo_banner', visible: true, order: 10, title: '🥐 Replaceable Promo Strip Banner #3', config: { title: 'Bakery Morning Special: Fresh croissants & sourdough loaves in 10 mins!' } },
  { id: 'flado_sponsor_row', type: 'flado_sponsor_row', visible: true, order: 11, title: '⭐️ Featured Partner Brands', config: {} },
  { id: 'flado_combo_bundles', type: 'flado_combo_bundles', visible: true, order: 12, title: '🍱 Curated Saver Bundles', config: {} },
  { id: 'flado_recently_ordered', type: 'flado_recently_ordered', visible: true, order: 13, title: '🔄 Recently Ordered Repeat Shelf', config: {} },
  { id: 'flado_new_arrivals', type: 'flado_new_arrivals', visible: true, order: 14, title: '✨ Fresh Additions at Local Shops', config: {} },
];

export function useFladoSDUI() {
  const [sections, setSections] = useState<SDUISection[]>(DEFAULT_SDUI_SECTIONS);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadSDUI = async () => {
    try {
      const cached = await AsyncStorage.getItem(SDUI_CACHE_KEY);
      if (cached) {
        const { data } = JSON.parse(cached);
        if (data && Array.isArray(data.sections) && data.sections.length > 0) {
          setSections(data.sections.filter((s: SDUISection) => s.visible));
        }
      }

      setIsRefreshing(true);
      const res = await api.getFladoLayout();
      if (res && Array.isArray(res.sections) && res.sections.length > 0) {
        const activeSections = res.sections.filter((s: SDUISection) => s.visible);
        setSections(activeSections);
        await AsyncStorage.setItem(
          SDUI_CACHE_KEY,
          JSON.stringify({ data: res, timestamp: Date.now() })
        );
      }
    } catch (error) {
      console.log('Using default SDUI layout fallback', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadSDUI();
  }, []);

  return { sections, loading, isRefreshing, refetch: loadSDUI };
}
