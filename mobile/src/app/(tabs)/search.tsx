import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, Image, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { useSurface } from '../../context/SurfaceContext';
import { apiClient } from '../../api/client';
import { LoadingView, ErrorStateView, EmptyStateView } from '../../components/common/StateViews';
import { Product } from '../../utils/mockData';

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ query?: string }>();
  const { addToCart } = useCart();
  const { surface } = useSurface();
  
  const [searchQuery, setSearchQuery] = useState(params.query || '');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Milk', 'Kurta', 'Earbuds', 'Snacks', 'Sneakers'
  ]);

  const requestSequenceRef = useRef<number>(0);

  const executeSearch = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const currentSeq = ++requestSequenceRef.current;
    setLoading(true);
    setError(null);

    try {
      let endpoint = '';
      if (surface === 'QUICK_COMMERCE') {
        endpoint = `/flado/catalog?q=${encodeURIComponent(trimmed)}`;
      } else {
        endpoint = `/products?search=${encodeURIComponent(trimmed)}`;
      }

      const res: any = await apiClient(endpoint, { skipAuthToken: true });

      // Out-of-order sequence check to reject stale requests
      if (currentSeq !== requestSequenceRef.current) {
        return;
      }

      let items: Product[] = [];
      if (Array.isArray(res)) {
        items = res;
      } else if (res && Array.isArray(res.items)) {
        items = res.items;
      } else if (res && Array.isArray(res.data)) {
        items = res.data;
      }

      setSearchResults(items);

      // Save non-sensitive query to recent searches
      setRecentSearches(prev => {
        const filtered = prev.filter(q => q.toLowerCase() !== trimmed.toLowerCase());
        return [trimmed, ...filtered].slice(0, 8);
      });
    } catch (e: any) {
      if (currentSeq === requestSequenceRef.current) {
        setError(e?.message || 'Search service temporarily unavailable.');
        setSearchResults([]);
      }
    } finally {
      if (currentSeq === requestSequenceRef.current) {
        setLoading(false);
      }
    }
  }, [surface]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      executeSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, executeSearch]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
  };

  const handleRecentPress = (queryStr: string) => {
    setSearchQuery(queryStr);
    executeSearch(queryStr);
    Keyboard.dismiss();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const renderProductItem = ({ item }: { item: any }) => {
    const isFladoItem = item.isQuickCommerce || item.isFlado || surface === 'QUICK_COMMERCE';
    const displayTitle = item.title || item.name || 'Product';
    const displayCategory = item.category?.name || item.category || 'General';
    const displayImage = item.imageUrl || item.image || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
    const displayPrice = item.discountPrice ?? item.basePrice ?? item.price ?? 0;
    const originalPrice = item.basePrice && item.discountPrice ? item.basePrice : item.originalPrice;

    return (
      <TouchableOpacity 
        style={styles.searchResultItem}
        activeOpacity={0.8}
        onPress={() => router.push(`/products/${item.id}`)}
        accessibilityRole="button"
        accessibilityLabel={`View product ${displayTitle}`}
      >
        <Image source={{ uri: displayImage }} style={styles.productImage} resizeMode="contain" />
        
        <View style={styles.productDetails}>
          {isFladoItem ? (
            <View style={[styles.badge, styles.fladoBadge]}>
              <Ionicons name="flash" size={10} color="white" />
              <Text style={styles.badgeText}>⚡ 10 MINS FLADO</Text>
            </View>
          ) : (
            <View style={[styles.badge, styles.auramartBadge]}>
              <MaterialCommunityIcons name="truck-delivery" size={10} color="white" />
              <Text style={styles.badgeText}>🚚 AURAMART</Text>
            </View>
          )}

          <Text style={styles.productName} numberOfLines={2}>{displayTitle}</Text>
          <Text style={styles.productCategory}>{displayCategory}</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{displayPrice}</Text>
            {originalPrice > displayPrice && (
              <Text style={styles.originalPrice}>₹{originalPrice}</Text>
            )}
            
            <TouchableOpacity 
              style={[styles.addBtn, { backgroundColor: isFladoItem ? '#059669' : '#6366F1' }]}
              onPress={() => addToCart(item, 1)}
              accessibilityRole="button"
              accessibilityLabel={`Add ${displayTitle} to cart`}
            >
              <Text style={styles.addBtnText}>ADD</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Input Header */}
      <View style={styles.searchHeader}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        
        <View style={styles.inputWrapper}>
          <Ionicons name="search" size={18} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={surface === 'QUICK_COMMERCE' ? "Search 10-minute Flado items..." : "Search 1,00,000+ products on AuraMart..."}
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={() => executeSearch(searchQuery)}
            accessibilityLabel="Search input field"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={handleClearSearch} 
              style={styles.clearIcon}
              accessibilityRole="button"
              accessibilityLabel="Clear search text"
            >
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Mode Indicator Banner */}
      <View style={[styles.surfaceBanner, surface === 'QUICK_COMMERCE' ? styles.surfaceBannerFlado : styles.surfaceBannerMarketplace]}>
        <Ionicons name={surface === 'QUICK_COMMERCE' ? "flash" : "cart"} size={14} color="#FFF" />
        <Text style={styles.surfaceBannerText}>
          {surface === 'QUICK_COMMERCE' ? 'Searching active Flado 10-Min Darkstore' : 'Searching AuraMart Marketplace Catalog'}
        </Text>
      </View>

      {/* Main Content Area */}
      {loading ? (
        <LoadingView message="Searching products..." />
      ) : error ? (
        <ErrorStateView
          title="Search Failed"
          message={error}
          onRetry={() => executeSearch(searchQuery)}
          retryLabel="Retry Search"
        />
      ) : searchQuery.trim().length === 0 ? (
        <View style={styles.suggestionsContainer}>
          {recentSearches.length > 0 && (
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={clearRecentSearches} accessibilityRole="button" accessibilityLabel="Clear recent searches">
                <Text style={styles.clearRecentText}>Clear All</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.tagsContainer}>
            {recentSearches.map((tag, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={styles.tagPill}
                onPress={() => handleRecentPress(tag)}
                accessibilityRole="button"
                accessibilityLabel={`Search ${tag}`}
              >
                <Ionicons name="time-outline" size={14} color="#6B7280" style={{ marginRight: 4 }} />
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : searchResults.length === 0 ? (
        <EmptyStateView
          title="No products found"
          message={`We couldn't find any items matching "${searchQuery}". Please check spelling or try another term.`}
          actionLabel="Clear Search"
          onAction={handleClearSearch}
        />
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={renderProductItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  clearIcon: {
    padding: 4,
  },
  surfaceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  surfaceBannerMarketplace: {
    backgroundColor: '#6366F1',
  },
  surfaceBannerFlado: {
    backgroundColor: '#059669',
  },
  surfaceBannerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  suggestionsContainer: {
    padding: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  clearRecentText: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minHeight: 44,
  },
  tagText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
  },
  searchResultItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  fladoBadge: {
    backgroundColor: '#059669',
  },
  auramartBadge: {
    backgroundColor: '#6366F1',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    marginLeft: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  originalPrice: {
    fontSize: 13,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  addBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    minHeight: 36,
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
