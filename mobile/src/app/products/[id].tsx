import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert, Dimensions, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { Product, Review, MOCK_PRODUCTS } from '../../utils/mockData';
import { fladoProductsData } from '../../utils/fladoProducts';
import { api } from '../../utils/api';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addToCart, cart, updateQuantity } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      try {
        const data = await api.getProductById(id);
        setProduct(data);
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }

        // Get similar products
        const rawList = await api.getProducts();
        const related = rawList
          .filter(p => p.category === data.category && p.id !== data.id)
          .slice(0, 4);
        setSimilarProducts(related);
      } catch (error) {
        console.error(error);
        // Fallback
        const localFound = MOCK_PRODUCTS.find(p => p.id === id) || fladoProductsData.find(p => p.id === id);
        if (localFound) {
          setProduct(localFound);
          if (localFound.colors && localFound.colors.length > 0) {
            setSelectedColor(localFound.colors[0]);
          }
          if (localFound.sizes && localFound.sizes.length > 0) {
            setSelectedSize(localFound.sizes[0]);
          }
          const related = [...MOCK_PRODUCTS, ...fladoProductsData]
            .filter(p => p.category === localFound.category && p.id !== localFound.id)
            .slice(0, 4);
          setSimilarProducts(related);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const brandColor = product.isFlado ? '#059669' : '#8B5CF6';
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Prepare images array
  const imageGallery = [
    product.image || '',
    ...(product.images || [])
  ].filter(Boolean);

  const cartItem = cart.find(item => item.product.id === product.id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;

  const handleIncrement = () => {
    if (qtyInCart > 0) {
      updateQuantity(product.id, qtyInCart + 1);
    } else {
      addToCart(product, 1, selectedColor, selectedSize);
    }
  };

  const handleDecrement = () => {
    if (qtyInCart > 0) {
      updateQuantity(product.id, qtyInCart - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconCircle}>
          <Ionicons name="arrow-back" size={20} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{product.name}</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/cart')} style={styles.iconCircle}>
          <Ionicons name="cart-outline" size={20} color="#1F2937" />
          {qtyInCart > 0 && (
            <View style={styles.badgeCount}>
              <Text style={styles.badgeText}>{qtyInCart}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Horizontal Image Swipe Gallery */}
        <View style={styles.imageWrapper}>
          <FlatList
            data={imageGallery}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            onMomentumScrollEnd={(e) => {
              const slide = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveImageIndex(slide);
            }}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.productImage} />
            )}
          />
          {discountPercent > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountPercent}% OFF</Text>
            </View>
          )}
          {/* Indicators */}
          {imageGallery.length > 1 && (
            <View style={styles.indicatorContainer}>
              {imageGallery.map((_, i) => (
                <View 
                  key={i} 
                  style={[
                    styles.indicatorDot, 
                    activeImageIndex === i ? { backgroundColor: brandColor, width: 14 } : { backgroundColor: '#D1D5DB' }
                  ]} 
                />
              ))}
            </View>
          )}
        </View>

        {/* Product Info Section */}
        <View style={styles.detailsSection}>
          <View style={styles.categoryRow}>
            <Text style={[styles.categoryName, { color: brandColor }]}>{product.category} &rsaquo; {product.subCategory}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingText}>{product.rating}</Text>
            </View>
          </View>

          <Text style={styles.productName}>{product.name}</Text>

          {/* Pricing */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{product.price}</Text>
            {product.originalPrice && product.originalPrice > product.price && (
              <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
            )}
          </View>

          {/* Delivery speed badge */}
          {product.isFlado ? (
            <View style={[styles.deliveryBanner, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
              <Ionicons name="flash" size={18} color="#059669" />
              <Text style={[styles.deliveryBannerText, { color: '#047857' }]}>
                ⚡ Flado 10-Minute Instant Delivery Eligible
              </Text>
            </View>
          ) : (
            <View style={[styles.deliveryBanner, { backgroundColor: '#F5F3FF', borderColor: '#C084FC' }]}>
              <MaterialCommunityIcons name="truck-delivery" size={18} color="#8B5CF6" />
              <Text style={[styles.deliveryBannerText, { color: '#6D28D9' }]}>
                🚚 AuraMart Express Standard Delivery (2-3 days)
              </Text>
            </View>
          )}

          {/* Color Swatch selector */}
          {product.colors && product.colors.length > 0 && (
            <View style={styles.selectorWrapper}>
              <Text style={styles.sectionHeading}>Select Color Option</Text>
              <View style={styles.chipsRow}>
                {product.colors.map((c: string) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.colorSwatchBtn,
                      selectedColor === c && { borderColor: brandColor, borderWidth: 2 }
                    ]}
                    onPress={() => setSelectedColor(c)}
                  >
                    <View style={[styles.colorBubble, { backgroundColor: c.toLowerCase() }]} />
                    <Text style={[styles.chipText, selectedColor === c && { color: brandColor, fontWeight: 'bold' }]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Size swatch selector */}
          {product.sizes && product.sizes.length > 0 && (
            <View style={styles.selectorWrapper}>
              <Text style={styles.sectionHeading}>Select Size Option</Text>
              <View style={styles.chipsRow}>
                {product.sizes.map((s: string) => (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.chip,
                      selectedSize === s && { borderColor: brandColor, backgroundColor: product.isFlado ? '#ECFDF5' : '#F5F3FF' }
                    ]}
                    onPress={() => setSelectedSize(s)}
                  >
                    <Text style={[styles.chipText, selectedSize === s && { color: brandColor, fontWeight: 'bold' }]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Description */}
          <Text style={styles.sectionHeading}>Key Product Details</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>

          {/* Review breakdown visual section */}
          <Text style={styles.sectionHeading}>Verified Customer Reviews</Text>
          <View style={styles.breakdownCard}>
            <Text style={styles.breakdownScore}>{product.rating} ★</Text>
            <View style={styles.breakdownList}>
              {[5, 4, 3, 2, 1].map(stars => {
                const countMap: Record<number, number> = { 5: 60, 4: 25, 3: 10, 2: 3, 1: 2 };
                const pct = countMap[stars] || 0;
                return (
                  <View key={stars} style={styles.breakdownRow}>
                    <Text style={styles.breakdownRowText}>{stars} ★</Text>
                    <View style={styles.breakdownBarOutline}>
                      <View style={[styles.breakdownBarFill, { width: `${pct}%`, backgroundColor: '#F59E0B' }]} />
                    </View>
                    <Text style={styles.breakdownRowText}>{pct}%</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Similar Products Recommendation */}
          {similarProducts.length > 0 && (
            <View style={styles.selectorWrapper}>
              <Text style={styles.sectionHeading}>Similar Products You May Like</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.similarScroll}>
                {similarProducts.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      setLoading(true);
                      router.push(`/products/${item.id}`);
                    }}
                    style={styles.similarCard}
                  >
                    <Image source={{ uri: item.image || (item.images && item.images[0]) || '' }} style={styles.similarCardImage} />
                    <Text style={styles.similarCardName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.similarCardPrice}>₹{item.price}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions footer bar */}
      <View style={styles.footer}>
        {qtyInCart > 0 ? (
          <View style={[styles.footerBtn, styles.qtySelectorContainer, { borderColor: brandColor }]}>
            <TouchableOpacity onPress={handleDecrement} style={styles.qtyFooterBtn}>
              <Ionicons name="remove" size={18} color={brandColor} />
            </TouchableOpacity>
            <Text style={[styles.qtyFooterVal, { color: brandColor }]}>{qtyInCart} in Basket</Text>
            <TouchableOpacity onPress={handleIncrement} style={styles.qtyFooterBtn}>
              <Ionicons name="add" size={18} color={brandColor} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.footerBtn, styles.buyBtn, { backgroundColor: brandColor, flex: 1 }]}
            onPress={handleIncrement}
          >
            <Ionicons name="cart-outline" size={18} color="white" style={{ marginRight: 6 }} />
            <Text style={styles.buyBtnText}>Add to Basket</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: 'bold',
  },
  backBtn: {
    marginTop: 16,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badgeCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    marginHorizontal: 12,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  imageWrapper: {
    width: width,
    height: 300,
    backgroundColor: '#F9FAFB',
    position: 'relative',
  },
  productImage: {
    width: width,
    height: 280,
    resizeMode: 'contain',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 12,
    width: width,
    gap: 6,
  },
  indicatorDot: {
    height: 6,
    width: 6,
    borderRadius: 3,
  },
  detailsSection: {
    padding: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  originalPrice: {
    fontSize: 16,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginLeft: 10,
  },
  deliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  deliveryBannerText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 4,
  },
  descriptionText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
  },
  selectorWrapper: {
    marginTop: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  colorSwatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  colorBubble: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 0.5,
    borderColor: '#9CA3AF',
  },
  chip: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  chipText: {
    fontSize: 13,
    color: '#4B5563',
  },
  breakdownCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F9FAFB',
    gap: 16,
  },
  breakdownScore: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  breakdownList: {
    flex: 1,
    gap: 6,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  breakdownRowText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
  },
  breakdownBarOutline: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  breakdownBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  similarScroll: {
    paddingVertical: 8,
    gap: 12,
  },
  similarCard: {
    width: 120,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#FFFFFF',
  },
  similarCardImage: {
    width: '100%',
    height: 80,
    resizeMode: 'contain',
  },
  similarCardName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    marginTop: 6,
  },
  similarCardPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
  },
  footerBtn: {
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buyBtn: {
    backgroundColor: '#8B5CF6',
  },
  buyBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  qtySelectorContainer: {
    flex: 1,
    borderWidth: 1.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  qtyFooterBtn: {
    padding: 8,
  },
  qtyFooterVal: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});
