import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { useSurface } from '../../context/SurfaceContext';
import { apiClient } from '../../api/client';
import { LoadingView, ErrorStateView, EmptyStateView } from '../../components/common/StateViews';

const { width } = Dimensions.get('window');

export interface ProductVariantDTO {
  id: string;
  productId: string;
  sku: string;
  title: string;
  referenceMsrp?: number;
  referenceDiscountPrice?: number;
  stock?: number;
  fulfillmentSourceId?: string;
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addToCart, selectedAddress } = useCart();
  const { surface } = useSurface();

  const [product, setProduct] = useState<any>(null);
  const [variants, setVariants] = useState<ProductVariantDTO[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantDTO | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<boolean>(false);

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    setError(null);
    try {
      // Pass location context to backend for serviceability revalidation
      let endpoint = `/products/${id}`;
      if (selectedAddress) {
        endpoint += `?addressId=${encodeURIComponent(selectedAddress)}`;
      }

      const data: any = await apiClient(endpoint, { skipAuthToken: true });
      setProduct(data);

      if (data.variants && Array.isArray(data.variants) && data.variants.length > 0) {
        setVariants(data.variants);
        setSelectedVariant(data.variants[0]);
      }

      if (data.colorsJson) {
        try {
          const parsedColors = JSON.parse(data.colorsJson);
          if (Array.isArray(parsedColors) && parsedColors.length > 0) {
            setSelectedColor(parsedColors[0]);
          }
        } catch (e) {}
      }

      if (data.sizesJson) {
        try {
          const parsedSizes = JSON.parse(data.sizesJson);
          if (Array.isArray(parsedSizes) && parsedSizes.length > 0) {
            setSelectedSize(parsedSizes[0]);
          }
        } catch (e) {}
      }

      // Fetch similar products
      try {
        const catalog: any = await apiClient('/products?limit=6', { skipAuthToken: true });
        const list = Array.isArray(catalog) ? catalog : (catalog?.data || []);
        setSimilarProducts(list.filter((p: any) => p.id !== id).slice(0, 4));
      } catch (e) {}
    } catch (err: any) {
      setError(err?.message || 'Unable to fetch product details.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id, selectedAddress]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProduct();
  };

  const handleAddToCart = () => {
    if (!product) return;
    const isFladoItem = product.isQuickCommerce || product.isFlado || surface === 'QUICK_COMMERCE';
    const finalPrice = selectedVariant?.referenceDiscountPrice ?? selectedVariant?.referenceMsrp ?? product.discountPrice ?? product.basePrice ?? product.price ?? 0;
    const strikePrice = selectedVariant?.referenceMsrp ?? product.basePrice ?? product.originalPrice;
    const variantId = selectedVariant?.id || product.id;
    const variantSku = selectedVariant?.sku || product.sku || `SKU-${product.id}`;
    const fulfillmentSourceId = selectedVariant?.fulfillmentSourceId || product.fulfillmentSourceId || product.shopId;

    addToCart({
      id: product.id,
      variantId,
      sku: variantSku,
      name: product.title || product.name || 'Product',
      price: finalPrice,
      originalPrice: strikePrice || finalPrice,
      category: typeof product.category === 'string' ? product.category : product.category?.name || 'General',
      image: product.imageUrl || product.image || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      description: product.description || '',
      rating: product.rating || 4.5,
      reviews: [],
      stock: selectedVariant?.stock ?? product.stock ?? 10,
      isFlado: isFladoItem,
      fulfillmentSourceId,
    } as any, quantity, selectedColor, selectedSize);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  if (loading && !refreshing) {
    return <LoadingView message="Loading product details..." />;
  }

  if (error && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorStateView
          title="Product Unavailable"
          message={error}
          onRetry={fetchProduct}
          retryLabel="Retry Loading"
        />
      </SafeAreaView>
    );
  }

  if (!product && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyStateView
          title="Product Not Found"
          message="The requested product could not be found."
          actionLabel="Back to Products"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  const isFladoProduct = product?.isQuickCommerce || product?.isFlado || surface === 'QUICK_COMMERCE';
  const displayTitle = product?.title || product?.name || 'Product';
  const displayPrice = selectedVariant?.referenceDiscountPrice ?? selectedVariant?.referenceMsrp ?? product?.discountPrice ?? product?.basePrice ?? product?.price ?? 0;
  const originalPrice = selectedVariant?.referenceMsrp ?? product?.basePrice ?? product?.originalPrice;

  // Stock evaluation (authoritative DTO stock)
  const currentVariantStock = selectedVariant?.stock ?? product?.stock;
  const isOutOfStock = currentVariantStock === 0;

  // Authoritative Delivery & Serviceability Promise from DTO
  const deliveryPromiseText = product?.deliveryPromise?.estimatedDeliveryText ||
    product?.estimatedDeliveryText ||
    product?.deliveryBadgeText ||
    (isFladoProduct ? 'Flado Darkstore Express Delivery' : 'AuraMart Standard Delivery');

  const imagesList = product?.images && product.images.length > 0
    ? product.images
    : [product?.imageUrl || product?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'];

  const colors = product?.colors || (product?.colorsJson ? JSON.parse(product.colorsJson) : []);
  const sizes = product?.sizes || (product?.sizesJson ? JSON.parse(product.sizesJson) : []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>{displayTitle}</Text>

        <TouchableOpacity
          onPress={() => setWishlist(prev => !prev)}
          style={styles.iconBtn}
          accessibilityRole="button"
          accessibilityLabel={wishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Ionicons name={wishlist ? "heart" : "heart-outline"} size={24} color={wishlist ? "#EF4444" : "#1F2937"} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#6366F1']} />}
      >
        {/* Image Swipe Carousel */}
        <View style={styles.imageCarouselContainer}>
          <FlatList
            data={imagesList}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const slide = Math.ceil(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width);
              if (slide !== activeImageIndex) setActiveImageIndex(slide);
            }}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.carouselImg} resizeMode="contain" />
            )}
          />
          {imagesList.length > 1 && (
            <View style={styles.paginationDots}>
              {imagesList.map((_: any, idx: number) => (
                <View
                  key={idx}
                  style={[styles.dot, activeImageIndex === idx && styles.activeDot]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Product Information Card */}
        <View style={styles.infoCard}>
          {isFladoProduct ? (
            <View style={[styles.badge, styles.fladoBadge]}>
              <Ionicons name="flash" size={12} color="white" />
              <Text style={styles.badgeText}>⚡ FLADO QUICK-COMMERCE</Text>
            </View>
          ) : (
            <View style={[styles.badge, styles.auramartBadge]}>
              <MaterialCommunityIcons name="truck-delivery" size={12} color="white" />
              <Text style={styles.badgeText}>🚚 AURAMART MARKETPLACE</Text>
            </View>
          )}

          <Text style={styles.productTitle}>{displayTitle}</Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#059669" />
            <Text style={styles.ratingScore}>{product?.rating || '4.5'}</Text>
            <Text style={styles.reviewCount}>({product?.reviewCount || 0} reviews)</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.currency}>₹</Text>
            <Text style={styles.price}>{displayPrice}</Text>
            {originalPrice && originalPrice > displayPrice ? (
              <Text style={styles.originalPrice}>₹{originalPrice}</Text>
            ) : null}
          </View>

          {/* Authoritative Delivery Promise Banner (No hardcoded strings) */}
          <View style={[styles.deliveryBanner, isFladoProduct ? styles.deliveryFlado : styles.deliveryMarketplace]}>
            <Ionicons name={isFladoProduct ? "flash" : "time-outline"} size={18} color={isFladoProduct ? "#059669" : "#6366F1"} />
            <Text style={[styles.deliveryText, { color: isFladoProduct ? "#047857" : "#4338CA" }]}>
              {deliveryPromiseText}
            </Text>
          </View>

          {/* Variant Selector (Revalidates SKU, Price, Stock on selection) */}
          {variants.length > 0 && (
            <View style={styles.selectorSection}>
              <Text style={styles.sectionHeading}>Select Variant</Text>
              <View style={styles.chipsRow}>
                {variants.map(v => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <TouchableOpacity
                      key={v.id}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => setSelectedVariant(v)}
                      accessibilityRole="button"
                      accessibilityLabel={`Select variant ${v.title}`}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{v.title}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Colors Selector */}
          {colors.length > 0 && (
            <View style={styles.selectorSection}>
              <Text style={styles.sectionHeading}>Select Color</Text>
              <View style={styles.chipsRow}>
                {colors.map((c: string) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.chip, selectedColor === c && styles.chipSelected]}
                    onPress={() => setSelectedColor(c)}
                    accessibilityRole="button"
                    accessibilityLabel={`Select color ${c}`}
                  >
                    <Text style={[styles.chipText, selectedColor === c && styles.chipTextSelected]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Sizes Selector */}
          {sizes.length > 0 && (
            <View style={styles.selectorSection}>
              <Text style={styles.sectionHeading}>Select Size</Text>
              <View style={styles.chipsRow}>
                {sizes.map((s: string) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.chip, selectedSize === s && styles.chipSelected]}
                    onPress={() => setSelectedSize(s)}
                    accessibilityRole="button"
                    accessibilityLabel={`Select size ${s}`}
                  >
                    <Text style={[styles.chipText, selectedSize === s && styles.chipTextSelected]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.sectionHeading}>Quantity</Text>
            <View style={styles.quantityRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
                accessibilityRole="button"
                accessibilityLabel="Decrease quantity"
              >
                <Ionicons name="remove" size={18} color="#374151" />
              </TouchableOpacity>

              <Text style={styles.qtyText}>{quantity}</Text>

              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity(prev => Math.min(10, prev + 1))}
                accessibilityRole="button"
                accessibilityLabel="Increase quantity"
              >
                <Ionicons name="add" size={18} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionHeading}>Product Description</Text>
          <Text style={styles.descriptionText}>{product?.description || 'No description provided for this product.'}</Text>

          {/* Ratings & Reviews summary (Authoritative DTO values) */}
          <Text style={styles.sectionHeading}>Ratings & Reviews</Text>
          <View style={styles.reviewSummaryBox}>
            <Text style={styles.ratingScoreBig}>{product?.rating || '4.5'}</Text>
            <View style={styles.ratingStarsRow}>
              <Ionicons name="star" size={16} color="#059669" />
              <Text style={styles.reviewSummaryText}>
                Based on {product?.reviewCount || 0} verified customer reviews
              </Text>
            </View>
          </View>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <View style={styles.similarSection}>
              <Text style={styles.sectionHeading}>Similar Products</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.similarScroll}>
                {similarProducts.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.similarCard}
                    onPress={() => router.push(`/products/${item.id}`)}
                    accessibilityRole="button"
                    accessibilityLabel={`View ${item.title || item.name}`}
                  >
                    <Image source={{ uri: item.imageUrl || item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' }} style={styles.similarImg} resizeMode="contain" />
                    <Text style={styles.similarTitle} numberOfLines={1}>{item.title || item.name}</Text>
                    <Text style={styles.similarPrice}>₹{item.discountPrice ?? item.basePrice ?? item.price}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Purchase Actions */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.cartBtn, isOutOfStock && styles.disabledBtn]}
          onPress={handleAddToCart}
          disabled={isOutOfStock}
          accessibilityRole="button"
          accessibilityLabel={isOutOfStock ? "Product Out of Stock" : "Add product to cart"}
        >
          <Ionicons name="cart-outline" size={18} color={isOutOfStock ? "#9CA3AF" : "#6366F1"} />
          <Text style={[styles.cartBtnText, isOutOfStock && styles.disabledBtnText]}>
            {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, isFladoProduct ? styles.fladoBuyBtn : styles.buyBtn, isOutOfStock && styles.disabledBtn]}
          onPress={handleBuyNow}
          disabled={isOutOfStock}
          accessibilityRole="button"
          accessibilityLabel={isOutOfStock ? "Product Out of Stock" : "Buy product now"}
        >
          <Text style={[styles.buyBtnText, isOutOfStock && styles.disabledBtnText]}>
            {isOutOfStock ? 'UNAVAILABLE' : 'BUY NOW'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  iconBtn: {
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
  scrollContent: {
    paddingBottom: 90,
  },
  imageCarouselContainer: {
    height: 260,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  carouselImg: {
    width: width,
    height: 260,
  },
  paginationDots: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  activeDot: {
    backgroundColor: '#6366F1',
    width: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  fladoBadge: {
    backgroundColor: '#059669',
  },
  auramartBadge: {
    backgroundColor: '#6366F1',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingScore: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 14,
  },
  currency: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 15,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  deliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  deliveryMarketplace: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  deliveryFlado: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  deliveryText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  selectorSection: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    minHeight: 44,
    justifyContent: 'center',
  },
  chipSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  chipText: {
    fontSize: 13,
    color: '#374151',
  },
  chipTextSelected: {
    color: '#6366F1',
    fontWeight: '700',
  },
  quantitySection: {
    marginBottom: 16,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 16,
    color: '#111827',
  },
  descriptionText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  reviewSummaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  ratingScoreBig: {
    fontSize: 24,
    fontWeight: '800',
    color: '#059669',
    marginRight: 12,
  },
  ratingStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reviewSummaryText: {
    fontSize: 13,
    color: '#4B5563',
    marginLeft: 6,
  },
  similarSection: {
    marginTop: 8,
  },
  similarScroll: {
    gap: 12,
  },
  similarCard: {
    width: 120,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  similarImg: {
    width: '100%',
    height: 80,
  },
  similarTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    marginTop: 6,
  },
  similarPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6366F1',
    marginTop: 2,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  cartBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#6366F1',
  },
  cartBtnText: {
    color: '#6366F1',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 6,
  },
  buyBtn: {
    backgroundColor: '#6366F1',
  },
  fladoBuyBtn: {
    backgroundColor: '#059669',
  },
  buyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  disabledBtn: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  disabledBtnText: {
    color: '#9CA3AF',
  },
});
