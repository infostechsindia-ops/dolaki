import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  FlatList, 
  ActivityIndicator, 
  Dimensions, 
  RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { Product } from '../../utils/mockData';
import { api } from '../../utils/api';

const { width } = Dimensions.get('window');

// Local default CMS fallback config matching web & backend layout structure
const DEFAULT_MOBILE_CMS = {
  sections: [
    {
      id: 'top_announcement',
      type: 'top_announcement',
      visible: true,
      config: {
        text: '🎉 Big Billion Aura Sale is Live! Flat 10% Off with HDFC Cards | Free Express Delivery over ₹499',
        backgroundColor: '#7C3AED',
      }
    },
    {
      id: 'hero_banners',
      type: 'hero_banners',
      visible: true,
      config: {
        banners: [
          {
            id: 'b1',
            imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
            title: 'Galaxy Book4 Edge',
            subtitle: 'Hello students! Carry light, study smart. From ₹4,583/M*',
            backgroundColor: '#1E293B',
            ctaText: 'Shop Now',
            ctaUrl: '/(tabs)/search'
          },
          {
            id: 'b2',
            imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
            title: 'New Generation Sneakers',
            subtitle: 'Steal deals on Nike & Adidas starting at ₹1,999!',
            backgroundColor: '#1D4ED8',
            ctaText: 'View Kicks',
            ctaUrl: '/(tabs)/search'
          },
          {
            id: 'b3',
            imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
            title: 'The Premium Tech Hub',
            subtitle: 'Noise Cancelling Earbuds & Smartwatches with AuraPay Cashbacks.',
            backgroundColor: '#065F46',
            ctaText: 'Explore Gadgets',
            ctaUrl: '/(tabs)/search'
          },
          {
            id: 'b4',
            imageUrl: 'https://images.unsplash.com/photo-1514790193030-c89d266d5a9d?w=800',
            title: 'Shubh Diwali Bazaar',
            subtitle: 'Ethnic silk wear, sherwanis & traditional jewelry up to 60% off!',
            backgroundColor: '#B45309',
            ctaText: 'Explore Festive',
            ctaUrl: '/(tabs)/search'
          }
        ]
      }
    },
    {
      id: 'recent_looking',
      type: 'recent_looking',
      visible: true,
      config: {
        title: 'Arif, still looking for these?'
      }
    },
    {
      id: 'offers_for_you',
      type: 'offers_for_you',
      visible: true,
      config: {
        title: 'Offers for you'
      }
    },
    {
      id: 'campaign_spotlight',
      type: 'campaign_spotlight',
      visible: true,
      config: {}
    },
    {
      id: 'category_grid',
      type: 'category_grid',
      visible: true,
      config: {
        categories: [
          { name: 'Electronics', icon: 'phone-portrait-outline', slug: 'electronics', color: '#EDE9FE' },
          { name: 'Fashion', icon: 'shirt-outline', slug: 'fashion', color: '#FCE7F3' },
          { name: 'Beauty', icon: 'rose-outline', slug: 'beauty', color: '#FEF3C7' },
          { name: 'Home & Kitchen', icon: 'home-outline', slug: 'home', color: '#D1FAE5' },
          { name: 'Groceries', icon: 'basket-outline', slug: 'groceries', color: '#DBEAFE' },
          { name: 'Sports', icon: 'football-outline', slug: 'sports', color: '#FEE2E2' },
          { name: 'Appliances', icon: 'tv-outline', slug: 'appliances', color: '#E0E7FF' },
          { name: 'Toys', icon: 'game-controller-outline', slug: 'toys', color: '#FEF9C3' }
        ]
      }
    },
    {
      id: 'flado_banner',
      type: 'flado_banner',
      visible: true,
      config: {
        title: '⚡ Flado 10-Minute Delivery',
        subtitle: 'Groceries, fresh fruits & daily essentials delivered instantly!',
        backgroundColor: '#059669',
      }
    },
    {
      id: 'flash_sale',
      type: 'flash_sale',
      visible: true,
      config: {
        title: '⚡ Hourly Lightning Deals',
        deals: [
          { productId: 'ele-1', label: 'AuraPods Pro' },
          { productId: 'be-1', label: 'Vit C Serum' },
          { productId: 'spo-1', label: 'Match Football' },
          { productId: 'hom-1', label: 'Coffee Maker' },
          { productId: 'ele-5', label: 'iPhone 15 Pro' },
          { productId: 'fas-3', label: 'Run Pro Sneakers' }
        ]
      }
    },
    {
      id: 'ad_banner_1',
      type: 'full_ad_banner',
      visible: true,
      config: {
        imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800',
        title: 'Add more life to your years — WHOOP 4.0 Fitness Tracker'
      }
    },
    {
      id: 'sponsor_strip',
      type: 'sponsor_strip',
      visible: true,
      config: {
        title: '⭐ Featured Brand Deals',
        brands: [
          { name: 'Nike', logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100', discountText: 'Up to 40% Off' },
          { name: 'Sony', logoUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=100', discountText: 'No Cost EMI' },
          { name: 'Dyson', logoUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=100', discountText: 'Extra ₹1,500 Off' },
          { name: 'LEGO', logoUrl: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=100', discountText: 'Flat 15% Off' },
          { name: 'Apple', logoUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=100', discountText: 'Instant Cashback' },
          { name: 'Samsung', logoUrl: 'https://images.unsplash.com/photo-1574756568262-b911776b6b5c?w=100', discountText: 'Free Earbuds' }
        ]
      }
    },
    {
      id: 'new_launches',
      type: 'new_launches',
      visible: true,
      config: {
        title: '🚀 Hot New Launches',
        productIds: ['toy-1', 'spo-2', 'ele-2', 'ele-5', 'ele-6', 'fas-4']
      }
    },
    {
      id: 'brand_spotlight',
      type: 'brand_spotlight',
      visible: true,
      config: {
        title: '🏆 Exclusive Brand Spotlight',
        brands: [
          { name: 'Nike Premium Store', logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100', slug: 'nike' },
          { name: 'boAt Official Store', logoUrl: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=100', slug: 'boat' },
          { name: 'Clinique Organics', logoUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=100', slug: 'clinique' },
          { name: 'Apple Flagship', logoUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=100', slug: 'apple' }
        ]
      }
    },
    {
      id: 'collection_cards',
      type: 'collection_cards',
      visible: true,
      config: {
        title: '🎨 Curated Lifestyle Collections',
        collections: [
          { title: 'The Monsoon Setup', subtitle: 'Dry gear & rain protective wear', imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600', slug: 'sports' },
          { title: 'Ultimate Desk Vibe', subtitle: 'Ergonomic layouts & sound setups', imageUrl: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=600', slug: 'home' },
          { title: 'Gen-Z Style Book', subtitle: 'Trending street looks & oversized tees', imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600', slug: 'fashion' },
          { title: 'Smart Home Automation', subtitle: 'Voice control & robotic vacuum pods', imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600', slug: 'appliances' }
        ]
      }
    },
    {
      id: 'trending_now',
      type: 'trending_now',
      visible: true,
      config: {
        title: '🔥 Trending Now on AuraMart',
        productIds: ['ele-1', 'fas-1', 'be-1', 'spo-1', 'ele-5', 'fas-3', 'hom-1']
      }
    },
    {
      id: 'look_book',
      type: 'look_book',
      visible: true,
      config: {
        title: '📸 Style Studio & Lookbooks',
        items: [
          { id: 'l1', imageUrl: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=400', title: 'Street Casual', tags: ['Denim', 'Sneakers'] },
          { id: 'l2', imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', title: 'Summer Breeze', tags: ['Linen', 'Glow'] },
          { id: 'l3', imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400', title: 'Festive Silk', tags: ['Sherwani', 'Ethnic'] },
          { id: 'l4', imageUrl: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=400', title: 'Active Run', tags: ['Ultraboost', 'Fitness'] }
        ]
      }
    },
    {
      id: 'live_deal',
      type: 'live_deal',
      visible: true,
      config: {
        productId: 'ele-1',
        productName: 'AuraPods Pro ANC Earbuds',
        productImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600',
        originalPrice: 12999,
        livePrice: 8499,
        hostName: 'Neha Malhotra'
      }
    },
    {
      id: 'electronics_strip',
      type: 'product_strip',
      visible: true,
      config: {
        title: '⚡ Top Tech & Electronics',
        productIds: ['ele-1', 'ele-2', 'ele-5', 'ele-6', 'ele-7', 'ele-13']
      }
    },
    {
      id: 'fashion_strip',
      type: 'product_strip',
      visible: true,
      config: {
        title: '👗 Trending Fashion & Footwear',
        productIds: ['fas-1', 'fas-2', 'fas-3', 'fas-4', 'fas-5']
      }
    },
    {
      id: 'beauty_strip',
      type: 'product_strip',
      visible: true,
      config: {
        title: '💄 Beauty & Skincare Bestsellers',
        productIds: ['be-1', 'be-2', 'be-3', 'be-4']
      }
    },
    {
      id: 'home_strip',
      type: 'product_strip',
      visible: true,
      config: {
        title: '🏠 Home & Kitchen Upgrades',
        productIds: ['hom-1', 'hom-2', 'hom-3', 'hom-4']
      }
    }
  ]
};

export default function HomeScreen() {
  const router = useRouter();
  const { addToCart, selectedAddress } = useCart();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [cmsConfig, setCmsConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('For You');
  const [wishlist, setWishlist] = useState<string[]>(['ele-1', 'fas-1']);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 59, seconds: 59 });
  const [liveWatchers, setLiveWatchers] = useState(2847);

  const loadData = async () => {
    try {
      const prods = await api.getProducts();
      setAllProducts(prods);

      const layout = await api.getSduiLayout();
      if (layout && layout.sections) {
        layout.sections.sort((a: any, b: any) => a.order - b.order);
        setCmsConfig(layout);
      } else {
        setCmsConfig(DEFAULT_MOBILE_CMS);
      }
    } catch (e) {
      console.error(e);
      setCmsConfig(DEFAULT_MOBILE_CMS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 3, minutes: 59, seconds: 59 };
      });
      setLiveWatchers(prev => prev + (Math.random() > 0.6 ? Math.floor(Math.random() * 5) - 2 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSearch = () => {
    router.push({
      pathname: '/(tabs)/search',
      params: { query: searchQuery }
    });
  };

  // Flipkart & Noon style Product Card Renderer
  const renderProductItem = ({ item }: { item: Product }) => {
    const discountPercent = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;
    const isWishlisted = wishlist.includes(item.id);

    return (
      <TouchableOpacity 
        style={styles.noonProductCard} 
        activeOpacity={0.9}
        onPress={() => router.push(`/products/${item.id}`)}
      >
        <View style={styles.noonImageContainer}>
          <Image 
            source={{ uri: item.image || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' }} 
            style={styles.noonProductImage} 
            resizeMode="contain" 
          />
          
          {/* Wishlist Heart Icon */}
          <TouchableOpacity style={styles.heartBtn} onPress={() => toggleWishlist(item.id)}>
            <Ionicons name={isWishlisted ? "heart" : "heart-outline"} size={16} color={isWishlisted ? "#EF4444" : "#6B7280"} />
          </TouchableOpacity>

          {/* Floating Overlay Plus Button */}
          <TouchableOpacity style={styles.noonAddPlusBtn} onPress={() => addToCart(item, 1)}>
            <Ionicons name="add" size={18} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <View style={styles.noonProductInfo}>
          <Text style={styles.noonProductName} numberOfLines={2}>{item.name}</Text>
          
          <View style={styles.noonRatingRow}>
            <View style={styles.starBadge}>
              <Ionicons name="star" size={10} color="#059669" />
              <Text style={styles.starRatingText}>{item.rating || '4.5'}</Text>
            </View>
            <Text style={styles.reviewCountText}>({item.reviews?.length || 120})</Text>
          </View>

          <View style={styles.noonPriceRow}>
            <Text style={styles.noonCurrency}>₹</Text>
            <Text style={styles.noonPrice}>{item.price}</Text>
            {item.originalPrice > item.price && (
              <>
                <Text style={styles.noonOriginalPrice}>₹{item.originalPrice}</Text>
                <Text style={styles.noonDiscountText}>{discountPercent}%</Text>
              </>
            )}
          </View>

          <View style={styles.noonBadgeRow}>
            <View style={styles.expressTag}>
              <Ionicons name="flash" size={10} color="#000" />
              <Text style={styles.expressTagText}>express</Text>
              <Text style={styles.todayText}>Today</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getProductById = (id: string): Product | undefined => {
    return allProducts.find(p => p.id === id);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading AuraMart Super-App...</Text>
      </View>
    );
  }

  const activeSections = cmsConfig?.sections?.filter((s: any) => s.visible) || [];

  return (
    <SafeAreaView style={styles.container}>
      
      {/* 1. TOP BRAND SWITCHER PILLS BAR (Flipkart/Noon Top App Row) */}
      <View style={styles.topPillBar}>
        <TouchableOpacity style={[styles.appPill, styles.appPillYellow]} activeOpacity={0.8}>
          <Ionicons name="cart" size={14} color="#111827" />
          <Text style={styles.appPillYellowText}>AuraMart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.appPillWhite} onPress={() => router.push('/flado')} activeOpacity={0.8}>
          <Ionicons name="flash" size={13} color="#E11D48" />
          <Text style={styles.appPillPinkText}>Minutes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.appPillWhite} onPress={() => router.push('/(tabs)/search')} activeOpacity={0.8}>
          <Ionicons name="airplane" size={13} color="#EA580C" />
          <Text style={styles.appPillOrangeText}>Travel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.appPillWhite} onPress={() => router.push('/account/wallet')} activeOpacity={0.8}>
          <Ionicons name="wallet" size={13} color="#2563EB" />
          <Text style={styles.appPillBlueText}>Loans</Text>
        </TouchableOpacity>
      </View>

      {/* 2. LOCATION & AURAGOINS HEADER BAR */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.locationContainer} onPress={() => router.push('/account/addresses')} activeOpacity={0.8}>
          <Ionicons name="home" size={16} color="#1F2937" />
          <Text style={styles.locationTitle}>HOME</Text>
          <Text style={styles.locationAddress} numberOfLines={1}>
            {selectedAddress || 'Bulaqi pura, nai basti, maunath bhan...'}
          </Text>
          <Ionicons name="chevron-down" size={14} color="#4B5563" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.coinsBadge} onPress={() => router.push('/account/wallet')} activeOpacity={0.8}>
          <Ionicons name="flash" size={14} color="#F59E0B" />
          <Text style={styles.coinsText}>350</Text>
        </TouchableOpacity>
      </View>

      {/* 3. ENHANCED SEARCH BAR WITH VOICE & QR ACTION ICONS */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search mobiles, laptops, fashion..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchActionBtn} onPress={handleSearch}>
          <Ionicons name="mic-outline" size={19} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchActionBtn} onPress={handleSearch}>
          <Ionicons name="qr-code-outline" size={19} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* 4. FLIPKART STYLE CATEGORY SUB-TABS STRIP */}
      <View style={styles.subTabStrip}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subTabContent}>
          {['For You', 'Fashion', 'Mobiles', 'Electronics', 'Beauty', 'Home', 'Groceries', 'Appliances'].map((tab, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={[styles.subTabItem, activeSubTab === tab && styles.subTabItemActive]}
              onPress={() => setActiveSubTab(tab)}
              activeOpacity={0.8}
            >
              {tab === 'For You' && <Ionicons name="bag-handle-outline" size={16} color={activeSubTab === tab ? '#2563EB' : '#6B7280'} style={{ marginBottom: 2 }} />}
              {tab === 'Fashion' && <Ionicons name="shirt-outline" size={16} color={activeSubTab === tab ? '#2563EB' : '#6B7280'} style={{ marginBottom: 2 }} />}
              {tab === 'Mobiles' && <Ionicons name="phone-portrait-outline" size={16} color={activeSubTab === tab ? '#2563EB' : '#6B7280'} style={{ marginBottom: 2 }} />}
              {tab === 'Electronics' && <Ionicons name="desktop-outline" size={16} color={activeSubTab === tab ? '#2563EB' : '#6B7280'} style={{ marginBottom: 2 }} />}
              {tab === 'Beauty' && <Ionicons name="sparkles-outline" size={16} color={activeSubTab === tab ? '#2563EB' : '#6B7280'} style={{ marginBottom: 2 }} />}
              {tab === 'Home' && <Ionicons name="home-outline" size={16} color={activeSubTab === tab ? '#2563EB' : '#6B7280'} style={{ marginBottom: 2 }} />}
              {tab === 'Groceries' && <Ionicons name="basket-outline" size={16} color={activeSubTab === tab ? '#2563EB' : '#6B7280'} style={{ marginBottom: 2 }} />}
              {tab === 'Appliances' && <Ionicons name="tv-outline" size={16} color={activeSubTab === tab ? '#2563EB' : '#6B7280'} style={{ marginBottom: 2 }} />}
              
              <Text style={[styles.subTabText, activeSubTab === tab && styles.subTabTextActive]}>{tab}</Text>
              {activeSubTab === tab && <View style={styles.activeUnderline} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {activeSections.map((section: any, sIdx: number) => {
          switch (section.type) {
            
            // 1. ANNOUNCEMENT RIBBON
            case 'top_announcement':
              return (
                <View 
                  key={section.id || sIdx} 
                  style={[styles.announcementStrip, { backgroundColor: section.config.backgroundColor || '#7C3AED' }]}
                >
                  <Ionicons name="gift-outline" size={14} color="white" />
                  <Text style={styles.announcementText} numberOfLines={1}>{section.config.text}</Text>
                </View>
              );

            // 2. HERO SLIDESHOW CAROUSEL WITH AD BADGE & PAGINATION DOTS
            case 'hero_banners': {
              const banners = section.config.banners || [];
              if (banners.length === 0) return null;
              return (
                <View key={section.id || sIdx} style={styles.heroContainer}>
                  <ScrollView 
                    horizontal 
                    pagingEnabled 
                    showsHorizontalScrollIndicator={false} 
                    style={styles.bannerScroll}
                    onScroll={(e) => {
                      const offset = e.nativeEvent.contentOffset.x;
                      const index = Math.round(offset / (width - 32));
                      setActiveBannerIdx(index);
                    }}
                    scrollEventThrottle={16}
                  >
                    {banners.map((banner: any, bIdx: number) => (
                      <TouchableOpacity 
                        key={bIdx} 
                        activeOpacity={0.95}
                        style={[styles.banner, { backgroundColor: banner.backgroundColor || '#1E293B' }]}
                        onPress={() => router.push(banner.ctaUrl || '/(tabs)/search')}
                      >
                        <View style={styles.bannerText}>
                          <Text style={styles.bannerTitle}>{banner.title}</Text>
                          <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                          <View style={styles.bannerButton}>
                            <Text style={styles.bannerButtonText}>{banner.ctaText || 'Shop Now'}</Text>
                          </View>
                        </View>
                        <Image source={{ uri: banner.imageUrl }} style={styles.bannerImage} resizeMode="cover" />
                        
                        {/* AD Badge */}
                        <View style={styles.adBadgeTag}>
                          <Text style={styles.adBadgeText}>AD</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  {/* Pagination Dots */}
                  <View style={styles.dotsRow}>
                    {banners.map((_: any, dIdx: number) => (
                      <View 
                        key={dIdx} 
                        style={[styles.dot, activeBannerIdx === dIdx ? styles.dotActive : styles.dotInactive]} 
                      />
                    ))}
                  </View>
                </View>
              );
            }

            // 3. "ARIF, STILL LOOKING FOR THESE?" PERSONALIZED RECOMMENDATIONS
            case 'recent_looking':
              return (
                <View key={section.id || sIdx} style={styles.recentLookingContainer}>
                  <Text style={styles.recentLookingTitle}>Arif, still looking for these?</Text>
                  <View style={styles.recentGrid}>
                    <TouchableOpacity style={styles.recentCard} onPress={() => router.push({ pathname: '/(tabs)/search', params: { query: 'motherboard' } })}>
                      <Image source={{ uri: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300' }} style={styles.recentCardImg} />
                      <Text style={styles.recentCardTitle} numberOfLines={1}>Motherboards</Text>
                      <Text style={styles.recentCardCta}>View Store</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.recentCard} onPress={() => router.push({ pathname: '/(tabs)/search', params: { query: 'RAM' } })}>
                      <Image source={{ uri: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=300' }} style={styles.recentCardImg} />
                      <Text style={styles.recentCardTitle} numberOfLines={1}>RAMs</Text>
                      <Text style={styles.recentCardCta}>View Store</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.recentCard} onPress={() => router.push({ pathname: '/(tabs)/search', params: { query: 'shirt' } })}>
                      <Image source={{ uri: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300' }} style={styles.recentCardImg} />
                      <Text style={styles.recentCardTitle} numberOfLines={1}>Casual Shirts</Text>
                      <Text style={styles.recentCardCta}>View Store</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.recentCard} onPress={() => router.push({ pathname: '/(tabs)/search', params: { query: 'stroller' } })}>
                      <Image source={{ uri: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=300' }} style={styles.recentCardImg} />
                      <Text style={styles.recentCardTitle} numberOfLines={1}>Baby Strollers</Text>
                      <Text style={styles.recentCardCta}>View Store</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );

            case 'offers_for_you':
              return (
                <View key={section.id || sIdx} style={styles.offersSection}>
                  <Text style={styles.sectionTitle}>Offers for you</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                    <TouchableOpacity style={[styles.offerCard, { borderColor: '#F472B6', backgroundColor: '#FDF2F8' }]} onPress={() => router.push('/deals' as any)}>
                      <Text style={{ fontSize: 15, fontWeight: '900', color: '#BE185D' }}>AuraPay OUT</Text>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1F2937', marginTop: 6 }}>Up To 40% Off</Text>
                      <Text style={{ fontSize: 10, color: '#4B5563' }}>on your dining bill</Text>
                      <View style={styles.offerCtaBtn}>
                        <Text style={styles.offerCtaText}>Explore Now ›</Text>
                      </View>
                    </TouchableOpacity>
 
                    <TouchableOpacity style={[styles.offerCard, { borderColor: '#FBBF24', backgroundColor: '#FFFBEB' }]} onPress={() => router.push('/deals' as any)}>
                      <Text style={{ fontSize: 15, fontWeight: '900', color: '#D97706' }}>AuraMart</Text>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1F2937', marginTop: 6 }}>Up To ₹250 Cashback</Text>
                      <View style={styles.codeBadge}>
                        <Text style={styles.codeText}>Code: EXTRA250</Text>
                      </View>
                      <View style={styles.offerCtaBtn}>
                        <Text style={styles.offerCtaText}>Shop Now ›</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.offerCard, { borderColor: '#38BDF8', backgroundColor: '#F0F9FF' }]} onPress={() => router.push('/flado')}>
                      <Text style={{ fontSize: 15, fontWeight: '900', color: '#0284C7' }}>Flado Express</Text>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1F2937', marginTop: 6 }}>Extra 10% Off</Text>
                      <Text style={{ fontSize: 10, color: '#4B5563' }}>orders over ₹499</Text>
                      <View style={styles.offerCtaBtn}>
                        <Text style={styles.offerCtaText}>Shop Now ›</Text>
                      </View>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              );

            // 5. CAMPAIGN SPOTLIGHT CARDS
            case 'campaign_spotlight':
              return (
                <View key={section.id || sIdx} style={{ paddingHorizontal: 16, marginVertical: 8 }}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity 
                      activeOpacity={0.9}
                      style={{ width: width * 0.72, height: 120, borderRadius: 16, overflow: 'hidden', marginRight: 12, backgroundColor: '#1E293B', padding: 14, justifyContent: 'space-between' }}
                      onPress={() => router.push({ pathname: '/(tabs)/search', params: { query: 'sports' } })}
                    >
                      <View style={{ backgroundColor: '#2563EB', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 }}>
                        <Text style={{ color: 'white', fontSize: 9, fontWeight: '900' }}>ACTIVE CAMPAIGN</Text>
                      </View>
                      <View>
                        <Text style={{ color: 'white', fontSize: 15, fontWeight: '900' }}>☔ Monsoon Clearance</Text>
                        <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '600', marginTop: 2 }}>Up to 60% off on outdoor gear</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      activeOpacity={0.9}
                      style={{ width: width * 0.72, height: 120, borderRadius: 16, overflow: 'hidden', marginRight: 16, backgroundColor: '#431407', padding: 14, justifyContent: 'space-between' }}
                      onPress={() => router.push({ pathname: '/(tabs)/search', params: { query: 'fashion' } })}
                    >
                      <View style={{ backgroundColor: '#EA580C', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 }}>
                        <Text style={{ color: 'white', fontSize: 9, fontWeight: '900' }}>FESTIVE BAZAAR</Text>
                      </View>
                      <View>
                        <Text style={{ color: 'white', fontSize: 15, fontWeight: '900' }}>🏮 Shubh Diwali Bazaar</Text>
                        <Text style={{ color: '#FDBA74', fontSize: 11, fontWeight: '600', marginTop: 2 }}>Traditional ethnic wear & home decors</Text>
                      </View>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              );

            // 6. FLADO PROMO ENTRY GATE
            case 'flado_banner':
              return (
                <TouchableOpacity 
                  key={section.id || sIdx} 
                  style={[styles.fladoPromoCard, { backgroundColor: section.config.backgroundColor ? `${section.config.backgroundColor}15` : '#ECFDF5', borderColor: section.config.backgroundColor || '#A7F3D0' }]}
                  onPress={() => router.push('/flado')}
                >
                  <View style={styles.fladoPromoText}>
                    <View style={[styles.fladoTag, { backgroundColor: section.config.backgroundColor || '#059669' }]}>
                      <Ionicons name="flash" size={12} color="white" />
                      <Text style={styles.fladoTagText}>FLADO</Text>
                    </View>
                    <Text style={[styles.fladoPromoTitle, { color: section.config.backgroundColor || '#065F46' }]}>{section.config.title}</Text>
                    <Text style={[styles.fladoPromoSubtitle, { color: section.config.backgroundColor || '#047857' }]}>{section.config.subtitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward-circle" size={32} color={section.config.backgroundColor || '#059669'} />
                </TouchableOpacity>
              );

            // 7. CATEGORY GRID BAR
            case 'category_grid': {
              const categories = section.config.categories || [];
              return (
                <View key={section.id || sIdx}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{section.title || 'Shop by Category'}</Text>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                    {categories.map((cat: any, cIdx: number) => (
                      <TouchableOpacity 
                        key={cIdx} 
                        style={styles.categoryItem}
                        onPress={() => router.push({ pathname: '/(tabs)/search', params: { query: cat.name } })}
                      >
                        <View style={[styles.categoryIconCircle, { backgroundColor: cat.color || '#F5F3FF' }]}>
                          <Ionicons name={(cat.icon || 'grid-outline') as any} size={24} color="#2563EB" />
                        </View>
                        <Text style={styles.categoryText}>{cat.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              );
            }

            // 8. FLASH COUNTDOWN DEALS
            case 'flash_sale': {
              const deals = section.config.deals || [];
              if (deals.length === 0) return null;
              const saleProducts = deals.map((d: any) => getProductById(d.productId)).filter(Boolean) as Product[];
              return (
                <View key={section.id || sIdx} style={styles.flashSaleContainer}>
                  <View style={styles.flashHeader}>
                    <View style={styles.flashTitleBox}>
                      <Ionicons name="flash" size={18} color="#D97706" />
                      <Text style={styles.flashTitle}>{section.config.title || 'Lightning Deals'}</Text>
                      <View style={styles.timerBox}>
                        <Text style={styles.timerText}>
                          {String(timeLeft.hours).padStart(2,'0')}:{String(timeLeft.minutes).padStart(2,'0')}:{String(timeLeft.seconds).padStart(2,'0')}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <FlatList
                    data={saleProducts}
                    renderItem={renderProductItem}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    scrollEnabled={false}
                    columnWrapperStyle={styles.productRow}
                    contentContainerStyle={styles.productsGrid}
                  />
                </View>
              );
            }

            // 9. FULL WIDTH BRAND AD BANNER
            case 'full_ad_banner':
              return (
                <View key={section.id || sIdx} style={styles.fullAdCard}>
                  <Image source={{ uri: section.config.imageUrl }} style={styles.fullAdImg} resizeMode="cover" />
                  <View style={styles.adTag}>
                    <Text style={styles.adTagText}>Ad</Text>
                  </View>
                </View>
              );

            // 10. AURALIVE INTERACTIVE LIVE CARD
            case 'live_deal': {
              const liveDeal = section.config;
              if (!liveDeal) return null;
              const discount = liveDeal.originalPrice ? Math.round(((liveDeal.originalPrice - liveDeal.livePrice) / liveDeal.originalPrice) * 100) : 0;
              return (
                <View key={section.id || sIdx} style={styles.liveDealCard}>
                  <View style={styles.liveVideoBox}>
                    <Image source={{ uri: liveDeal.productImage }} style={styles.liveImage} />
                    <View style={styles.liveIndicatorBadge}>
                      <View style={styles.liveDot} />
                      <Text style={styles.liveIndicatorText}>LIVE</Text>
                    </View>
                    <View style={styles.watchersBadge}>
                      <Ionicons name="people" size={10} color="white" />
                      <Text style={styles.watchersText}>{liveWatchers} watching</Text>
                    </View>
                    <Text style={styles.hostName}>Host: {liveDeal.hostName}</Text>
                  </View>
                  <View style={styles.liveDetails}>
                    <Text style={styles.liveDealTitle}>⚡ AuraLive Special Drop!</Text>
                    <Text style={styles.liveProductName} numberOfLines={1}>{liveDeal.productName}</Text>
                    <View style={styles.livePricing}>
                      <Text style={styles.livePrice}>₹{liveDeal.livePrice}</Text>
                      <Text style={styles.liveOriginalPrice}>₹{liveDeal.originalPrice}</Text>
                      <View style={styles.liveDiscountBadge}>
                        <Text style={styles.liveDiscountText}>{discount}% OFF</Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      style={styles.claimBtn}
                      onPress={() => router.push(`/products/${liveDeal.productId}`)}
                    >
                      <Text style={styles.claimBtnText}>Claim Live Offer</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }

            // 11. PRODUCT STRIP
            case 'product_strip': {
              const productIds = section.config.productIds || [];
              const stripProducts = productIds.map((id: string) => getProductById(id)).filter(Boolean) as Product[];
              if (stripProducts.length === 0) return null;
              return (
                <View key={section.id || sIdx}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{section.config.title}</Text>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/search')}>
                      <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={stripProducts.slice(0, 4)}
                    renderItem={renderProductItem}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    scrollEnabled={false}
                    columnWrapperStyle={styles.productRow}
                    contentContainerStyle={styles.productsGrid}
                  />
                </View>
              );
            }

            // 12. BRAND SPOTLIGHT
            case 'brand_spotlight': {
              const brands = section.config.brands || [];
              return (
                <View key={section.id || sIdx}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{section.config.title || 'Brand Spotlight'}</Text>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                    {brands.map((brand: any, bIdx: number) => (
                      <TouchableOpacity 
                        key={bIdx} 
                        style={styles.categoryItem}
                        onPress={() => router.push({ pathname: '/(tabs)/search', params: { query: brand.name } })}
                      >
                        <View style={[styles.categoryIconCircle, { backgroundColor: '#F3F4F6' }]}>
                          <Image source={{ uri: brand.logoUrl }} style={{ width: 32, height: 32, borderRadius: 16 }} />
                        </View>
                        <Text style={styles.categoryText} numberOfLines={1}>{brand.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              );
            }

            // 13. SPONSOR BRAND STRIP
            case 'sponsor_strip': {
              const brands = section.config.brands || [];
              return (
                <View key={section.id || sIdx}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{section.config.title || 'Sponsored Deals'}</Text>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                    {brands.map((brand: any, bIdx: number) => (
                      <TouchableOpacity 
                        key={bIdx} 
                        style={[styles.categoryItem, { padding: 8 }]}
                        onPress={() => router.push({ pathname: '/(tabs)/search', params: { query: brand.name } })}
                      >
                        <View style={[styles.categoryIconCircle, { backgroundColor: '#EEF2FF', width: 64, height: 64 }]}>
                          <Image source={{ uri: brand.logoUrl }} style={{ width: 44, height: 44, borderRadius: 22 }} />
                        </View>
                        <Text style={[styles.categoryText, { color: '#059669', fontWeight: 'bold' }]}>{brand.discountText}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              );
            }

            // 14. NEW LAUNCHES
            case 'new_launches': {
              const productIds = section.config.productIds || [];
              const launchProducts = productIds.map((id: string) => getProductById(id)).filter(Boolean) as Product[];
              if (launchProducts.length === 0) return null;
              return (
                <View key={section.id || sIdx}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{section.config.title || 'Hot Launches'}</Text>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                    {launchProducts.map((item) => (
                      <TouchableOpacity 
                        key={item.id} 
                        style={[styles.noonProductCard, { width: 160, marginRight: 16 }]} 
                        onPress={() => router.push(`/products/${item.id}`)}
                      >
                        <Image source={{ uri: item.image || (item.images && item.images[0]) || '' }} style={[styles.noonProductImage, { height: 110 }]} resizeMode="contain" />
                        <View style={styles.noonProductInfo}>
                          <Text style={styles.noonProductName} numberOfLines={1}>{item.name}</Text>
                          <Text style={styles.noonPrice}>₹{item.price}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              );
            }

            // 15. TRENDING NOW
            case 'trending_now': {
              const productIds = section.config.productIds || [];
              const trendProducts = productIds.map((id: string) => getProductById(id)).filter(Boolean) as Product[];
              if (trendProducts.length === 0) return null;
              return (
                <View key={section.id || sIdx}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{section.config.title || 'Trending Now'}</Text>
                  </View>
                  <FlatList
                    data={trendProducts.slice(0, 4)}
                    renderItem={renderProductItem}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    scrollEnabled={false}
                    columnWrapperStyle={styles.productRow}
                    contentContainerStyle={styles.productsGrid}
                  />
                </View>
              );
            }

            // 16. CURATED COLLECTIONS
            case 'collection_cards': {
              const collections = section.config.collections || [];
              return (
                <View key={section.id || sIdx}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{section.config.title || 'Lifestyle Rooms'}</Text>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                    {collections.map((col: any, cIdx: number) => (
                      <TouchableOpacity 
                        key={cIdx} 
                        style={{ width: 220, marginRight: 16, borderRadius: 12, backgroundColor: 'white', overflow: 'hidden', borderWidth: 1, borderColor: '#F3F4F6' }}
                        onPress={() => router.push({ pathname: '/(tabs)/search', params: { query: col.slug } })}
                      >
                        <Image source={{ uri: col.imageUrl }} style={{ width: '100%', height: 110 }} />
                        <View style={{ padding: 12 }}>
                          <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1F2937' }}>{col.title}</Text>
                          <Text style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{col.subtitle}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              );
            }

            // 17. STYLE LOOKBOOK STUDIO
            case 'look_book': {
              const items = section.config.items || [];
              return (
                <View key={section.id || sIdx}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{section.config.title || 'Lookbook Trends'}</Text>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                    {items.map((item: any, iIdx: number) => (
                      <View key={iIdx} style={{ width: 140, marginRight: 16, borderRadius: 12, overflow: 'hidden' }}>
                        <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: 170, borderRadius: 12 }} />
                        <View style={{ paddingVertical: 8 }}>
                          <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1F2937' }}>{item.title}</Text>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              );
            }

            default:
              return null;
          }
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  
  // 1. TOP BRAND SWITCHER PILLS BAR
  topPillBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
    backgroundColor: '#93C5FD',
  },
  appPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 6,
  },
  appPillYellow: {
    backgroundColor: '#FFEB3B',
  },
  appPillYellowText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#111827',
    marginLeft: 4,
    fontStyle: 'italic',
  },
  appPillWhite: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 6,
    backgroundColor: '#FFFFFF',
  },
  appPillPinkText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E11D48',
    marginLeft: 4,
    fontStyle: 'italic',
  },
  appPillOrangeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EA580C',
    marginLeft: 4,
    fontStyle: 'italic',
  },
  appPillBlueText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
    marginLeft: 4,
    fontStyle: 'italic',
  },

  // 2. LOCATION & AURAGOINS HEADER BAR
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#93C5FD',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  locationTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#111827',
    marginLeft: 4,
    marginRight: 4,
  },
  locationAddress: {
    fontSize: 11,
    color: '#374151',
    flex: 1,
    marginRight: 4,
  },
  coinsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE047',
  },
  coinsText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1F2937',
    marginLeft: 2,
  },

  // 3. ENHANCED SEARCH BAR
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginVertical: 6,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1F2937',
    height: '100%',
  },
  searchActionBtn: {
    padding: 4,
    marginLeft: 6,
  },

  // 4. CATEGORY SUB-TABS STRIP
  subTabStrip: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  subTabContent: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  subTabItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 6,
    position: 'relative',
  },
  subTabItemActive: {},
  subTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  subTabTextActive: {
    color: '#2563EB',
    fontWeight: '900',
  },
  activeUnderline: {
    position: 'absolute',
    bottom: -6,
    left: 8,
    right: 8,
    height: 3,
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  // 5. HERO CAROUSEL
  heroContainer: {
    marginVertical: 10,
  },
  bannerScroll: {
    paddingHorizontal: 16,
  },
  banner: {
    width: width - 32,
    height: 160,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  bannerText: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    zIndex: 2,
  },
  bannerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: '#E2E8F0',
    fontSize: 11,
    marginBottom: 12,
  },
  bannerButton: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#1E293B',
    fontSize: 11,
    fontWeight: '900',
  },
  bannerImage: {
    width: 140,
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
  adBadgeTag: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adBadgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  dot: {
    height: 5,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  dotActive: {
    width: 18,
    backgroundColor: '#1E293B',
  },
  dotInactive: {
    width: 6,
    backgroundColor: '#CBD5E1',
  },

  // 6. "ARIF, STILL LOOKING FOR THESE?"
  recentLookingContainer: {
    backgroundColor: '#EFF6FF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  recentLookingTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1E3A8A',
    marginBottom: 12,
  },
  recentGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recentCard: {
    width: (width - 76) / 4,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 6,
    alignItems: 'center',
  },
  recentCardImg: {
    width: '100%',
    height: 60,
    borderRadius: 6,
    marginBottom: 6,
  },
  recentCardTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
  },
  recentCardCta: {
    fontSize: 9,
    fontWeight: '900',
    color: '#111827',
    marginTop: 2,
  },

  // 7. "OFFERS FOR YOU" 3-COLUMN CARDS
  offersSection: {
    marginVertical: 8,
  },
  offerCard: {
    width: 150,
    height: 130,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 12,
    marginRight: 12,
    justifyContent: 'space-between',
  },
  codeBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  codeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#92400E',
  },
  offerCtaBtn: {
    marginTop: 8,
  },
  offerCtaText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#111827',
  },

  // FLIPKART & NOON PRODUCT CARD STYLING
  noonProductCard: {
    width: (width - 40) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  noonImageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: '#F9FAFB',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noonProductImage: {
    width: '85%',
    height: '85%',
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  noonAddPlusBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'white',
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  noonProductInfo: {
    padding: 10,
  },
  noonProductName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    height: 32,
    lineHeight: 16,
  },
  noonRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginRight: 4,
  },
  starRatingText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#059669',
    marginLeft: 2,
  },
  reviewCountText: {
    fontSize: 10,
    color: '#6B7280',
  },
  noonPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 6,
  },
  noonCurrency: {
    fontSize: 11,
    fontWeight: '900',
    color: '#111827',
    marginRight: 1,
  },
  noonPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
  },
  noonOriginalPrice: {
    fontSize: 10,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },
  noonDiscountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#059669',
    marginLeft: 4,
  },
  noonBadgeRow: {
    marginTop: 6,
  },
  expressTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF08A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  expressTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#000',
    fontStyle: 'italic',
  },
  todayText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 3,
  },

  // FULL AD BANNER
  fullAdCard: {
    marginHorizontal: 16,
    marginVertical: 10,
    height: 110,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  fullAdImg: {
    width: '100%',
    height: '100%',
  },
  adTag: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adTagText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },

  // FLADO PROMO CARD
  fladoPromoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  fladoPromoText: {
    flex: 1,
  },
  fladoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 4,
  },
  fladoTagText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  fladoPromoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  fladoPromoSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },

  // COMMON SECTION HEADERS
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 68,
  },
  categoryIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 11,
    color: '#4B5563',
    textAlign: 'center',
    fontWeight: '500',
  },

  // FLASH SALE
  flashSaleContainer: {
    backgroundColor: '#FEF3C7',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 16,
    paddingVertical: 12,
  },
  flashHeader: {
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  flashTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flashTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
    marginLeft: 4,
    marginRight: 8,
  },
  timerBox: {
    backgroundColor: '#D97706',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  timerText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },

  // LIVE DEAL CARD
  liveDealCard: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    padding: 12,
  },
  liveVideoBox: {
    width: 110,
    height: 110,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  liveImage: {
    width: '100%',
    height: '100%',
  },
  liveIndicatorBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'white',
    marginRight: 4,
  },
  liveIndicatorText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
  watchersBadge: {
    position: 'absolute',
    bottom: 20,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  watchersText: {
    color: 'white',
    fontSize: 8,
    marginLeft: 2,
  },
  hostName: {
    position: 'absolute',
    bottom: 4,
    left: 6,
    color: '#94A3B8',
    fontSize: 8,
  },
  liveDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  liveDealTitle: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: 'bold',
  },
  liveProductName: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  livePricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  livePrice: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  liveOriginalPrice: {
    color: '#94A3B8',
    fontSize: 11,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  liveDiscountBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
  },
  liveDiscountText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
  claimBtn: {
    backgroundColor: '#F59E0B',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  claimBtnText: {
    color: '#1E293B',
    fontSize: 11,
    fontWeight: 'bold',
  },

  productsGrid: {
    paddingHorizontal: 16,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  announcementStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  announcementText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#4B5563',
  },
});
