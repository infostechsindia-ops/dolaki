import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { useSurface } from '../../context/SurfaceContext';
import { apiClient } from '../../api/client';
import { LoadingView, ErrorStateView, EmptyStateView } from '../../components/common/StateViews';

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'rating';

export interface ProductPLPItem {
  id: string;
  title?: string;
  name?: string;
  basePrice?: number;
  discountPrice?: number;
  price?: number;
  originalPrice?: number;
  imageUrl?: string;
  image?: string;
  images?: string[];
  rating?: number;
  reviewsCount?: number;
  isQuickCommerce?: boolean;
  isFlado?: boolean;
  category?: any;
}

export default function ProductListingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string; categorySlug?: string; title?: string; sort?: string }>();
  const { addToCart } = useCart();
  const { surface } = useSurface();

  const activeCategory = params.category || params.categorySlug || '';
  const displayTitle = params.title || (activeCategory ? activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1) : 'All Products');

  const [products, setProducts] = useState<ProductPLPItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedSort, setSelectedSort] = useState<SortOption>((params.sort as SortOption) || 'newest');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const requestSequenceRef = useRef<number>(0);
  const loadedPagesRef = useRef<Set<number>>(new Set());

  const fetchPLPData = useCallback(async (targetPage: number, isRefresh = false) => {
    if (loadedPagesRef.current.has(targetPage) && !isRefresh) {
      return;
    }

    const currentSeq = ++requestSequenceRef.current;

    if (targetPage === 1) {
      if (!isRefresh) setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      let endpoint = '';
      if (surface === 'QUICK_COMMERCE') {
        endpoint = `/flado/catalog?page=${targetPage}&limit=12&sort=${selectedSort}`;
        if (activeCategory) {
          endpoint += `&categorySlug=${encodeURIComponent(activeCategory)}`;
        }
      } else {
        endpoint = `/products?page=${targetPage}&limit=12&sort=${selectedSort}`;
        if (activeCategory) {
          endpoint += `&category=${encodeURIComponent(activeCategory)}`;
        }
      }

      const res: any = await apiClient(endpoint, { skipAuthToken: true });

      if (currentSeq !== requestSequenceRef.current) {
        return; // Stale request protection
      }

      let newItems: ProductPLPItem[] = [];
      let totalPages = 1;

      if (Array.isArray(res)) {
        newItems = res;
        setHasMore(res.length >= 12);
      } else if (res && typeof res === 'object') {
        newItems = res.items || res.data || [];
        totalPages = res.totalPages || Math.ceil((res.total || 0) / 12) || 1;
        setHasMore(targetPage < totalPages && newItems.length > 0);
      }

      loadedPagesRef.current.add(targetPage);

      if (targetPage === 1 || isRefresh) {
        setProducts(newItems);
        setPage(1);
      } else {
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueItems = newItems.filter(p => !existingIds.has(p.id));
          return [...prev, ...uniqueItems];
        });
        setPage(targetPage);
      }
    } catch (e: any) {
      if (currentSeq === requestSequenceRef.current) {
        setError(e?.message || 'Unable to load products.');
      }
    } finally {
      if (currentSeq === requestSequenceRef.current) {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    }
  }, [surface, activeCategory, selectedSort]);

  useEffect(() => {
    loadedPagesRef.current.clear();
    fetchPLPData(1);
  }, [fetchPLPData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadedPagesRef.current.clear();
    fetchPLPData(1, true);
  };

  const handleEndReached = () => {
    if (!loading && !loadingMore && hasMore && !error) {
      fetchPLPData(page + 1);
    }
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const renderProductCard = ({ item }: { item: ProductPLPItem }) => {
    const isFladoItem = item.isQuickCommerce || item.isFlado || surface === 'QUICK_COMMERCE';
    const displayTitle = item.title || item.name || 'Product';
    const displayImage = item.imageUrl || item.image || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
    const finalPrice = item.discountPrice ?? item.basePrice ?? item.price ?? 0;
    const strikePrice = item.basePrice && item.discountPrice ? item.basePrice : item.originalPrice;
    const isWishlisted = wishlist.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        activeOpacity={0.9}
        onPress={() => router.push(`/products/${item.id}`)}
        accessibilityRole="button"
        accessibilityLabel={`View ${displayTitle}`}
      >
        <View style={styles.imageWrapper}>
          <Image source={{ uri: displayImage }} style={styles.productImg} resizeMode="contain" />
          <TouchableOpacity
            style={styles.heartIconBtn}
            onPress={() => toggleWishlist(item.id)}
            accessibilityRole="button"
            accessibilityLabel={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Ionicons name={isWishlisted ? "heart" : "heart-outline"} size={18} color={isWishlisted ? "#EF4444" : "#6B7280"} />
          </TouchableOpacity>
        </View>

        <View style={styles.cardInfo}>
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

          <Text style={styles.productTitle} numberOfLines={2}>{displayTitle}</Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color="#059669" />
            <Text style={styles.ratingText}>{item.rating || '4.5'}</Text>
          </View>

          <View style={styles.priceRow}>
            <View style={styles.priceContainer}>
              <Text style={styles.finalPrice}>₹{finalPrice}</Text>
              {strikePrice && strikePrice > finalPrice ? (
                <Text style={styles.strikePrice}>₹{strikePrice}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: isFladoItem ? '#059669' : '#6366F1' }]}
              onPress={() => addToCart({
                id: item.id,
                name: displayTitle,
                price: finalPrice,
                originalPrice: strikePrice || finalPrice,
                category: typeof item.category === 'string' ? item.category : item.category?.name || 'General',
                image: displayImage,
                description: displayTitle,
                rating: item.rating || 4.5,
                reviews: [],
                stock: 10,
                isFlado: isFladoItem,
              }, 1)}
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
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>{displayTitle}</Text>

        <TouchableOpacity
          onPress={() => setSortModalVisible(true)}
          style={styles.sortBtn}
          accessibilityRole="button"
          accessibilityLabel="Filter and sort products"
        >
          <Ionicons name="options-outline" size={22} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {/* Surface Bar */}
      <View style={[styles.surfaceBar, surface === 'QUICK_COMMERCE' ? styles.surfaceFlado : styles.surfaceMarketplace]}>
        <Ionicons name={surface === 'QUICK_COMMERCE' ? "flash" : "storefront-outline"} size={14} color="#FFF" />
        <Text style={styles.surfaceText}>
          {surface === 'QUICK_COMMERCE' ? 'Flado 10-Minute Darkstore Assortment' : 'AuraMart Marketplace Catalog'}
        </Text>
      </View>

      {/* Content States */}
      {loading && !refreshing ? (
        <LoadingView message="Fetching products..." />
      ) : error && products.length === 0 ? (
        <ErrorStateView
          title="Unable to Load Products"
          message={error}
          onRetry={() => {
            loadedPagesRef.current.clear();
            fetchPLPData(1);
          }}
          retryLabel="Retry Catalog"
        />
      ) : products.length === 0 ? (
        <EmptyStateView
          title="No products available"
          message="There are currently no products available in this category."
          actionLabel="Go to Home"
          onAction={() => router.push('/(tabs)')}
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProductCard}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#6366F1']} />
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#6366F1" />
                <Text style={styles.footerText}>Loading more items...</Text>
              </View>
            ) : null
          }
        />
      )}

      {/* Sort Options Modal */}
      <Modal
        visible={sortModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSortModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort Products</Text>

            {(['newest', 'price_asc', 'price_desc', 'rating'] as SortOption[]).map((sortOpt) => {
              const labels: Record<SortOption, string> = {
                newest: 'Newest Arrivals',
                price_asc: 'Price: Low to High',
                price_desc: 'Price: High to Low',
                rating: 'Customer Rating',
              };

              const isSelected = selectedSort === sortOpt;

              return (
                <TouchableOpacity
                  key={sortOpt}
                  style={[styles.sortOptionRow, isSelected && styles.sortOptionSelected]}
                  onPress={() => {
                    setSelectedSort(sortOpt);
                    setSortModalVisible(false);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Sort by ${labels[sortOpt]}`}
                >
                  <Text style={[styles.sortOptionText, isSelected && styles.sortOptionTextSelected]}>
                    {labels[sortOpt]}
                  </Text>
                  {isSelected && <Ionicons name="checkmark" size={20} color="#6366F1" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  sortBtn: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  surfaceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  surfaceMarketplace: {
    backgroundColor: '#6366F1',
  },
  surfaceFlado: {
    backgroundColor: '#059669',
  },
  surfaceText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  listContent: {
    padding: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardContainer: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  imageWrapper: {
    height: 130,
    backgroundColor: '#F3F4F6',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImg: {
    width: '90%',
    height: '90%',
  },
  heartIconBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 6,
    elevation: 2,
  },
  cardInfo: {
    padding: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
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
  productTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    height: 36,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flexDirection: 'column',
  },
  finalPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  strikePrice: {
    fontSize: 11,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  addBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minHeight: 32,
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerText: {
    marginTop: 6,
    fontSize: 12,
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  sortOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    minHeight: 48,
  },
  sortOptionSelected: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  sortOptionText: {
    fontSize: 15,
    color: '#374151',
  },
  sortOptionTextSelected: {
    fontWeight: '700',
    color: '#6366F1',
  },
});
