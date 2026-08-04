import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, FlatList, Dimensions, Clipboard, ToastAndroid, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';
import { Product } from '@/utils/mockData';
import { api } from '@/utils/api';
import { fladoBrandsData } from '@/utils/fladoBrands';
import { fladoProductsData } from '@/utils/fladoProducts';

const { width } = Dimensions.get('window');

export default function MobileBrandDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { cart, addToCart, updateQuantity } = useCart();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const getBrandColor = (slugStr: string) => {
    const colors: Record<string, string> = {
      amul: '#E8372C',
      'mother-dairy': '#0084C9',
      britannia: '#E31E24',
      aashirvaad: '#D82927',
      daawat: '#8C6C30',
      'tata-sampann': '#E28C27',
      haldirams: '#F59E0B',
      cadbury: '#4A0080',
      lays: '#FFD700',
      nestle: '#003087',
      'coca-cola': '#E60000',
      mccain: '#FFB800',
      hul: '#003087',
      reckitt: '#006C5B',
      colgate: '#C90000',
      lakme: '#B38B6D',
      mamaearth: '#8CC63F',
      pampers: '#00B2A9',
      himalaya: '#028A43',
      boat: '#FF0000',
      duracell: '#C56B27',
      fnp: '#006838'
    };
    return colors[slugStr] || '#059669';
  };

  const brand = fladoBrandsData.find((b: any) => b.slug === slug);
  const brandColor = getBrandColor(slug || '');

  useEffect(() => {
    const loadProducts = async () => {
      let items: Product[] = [];
      try {
        const res = await api.getProducts();
        if (res && res.length > 0) {
          items = res;
        } else {
          items = fladoProductsData;
        }
      } catch (e) {
        items = fladoProductsData;
      }
      // Filter by brand name match
      if (brand) {
        setProducts(
          items.filter(
            p => p.isFlado && 
            p.name.toLowerCase().includes(brand.name.toLowerCase())
          )
        );
      }
      setLoading(false);
    };
    loadProducts();
  }, [brand]);

  if (!brand) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Brand not found</Text>
      </SafeAreaView>
    );
  }

  const handleCopy = (code: string) => {
    Clipboard.setString(code);
    setCopiedCode(code);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Coupon code copied!', ToastAndroid.SHORT);
    } else {
      Alert.alert('Copied', 'Coupon code copied to clipboard!');
    }
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const getItemQuantity = (productId: string) => {
    const cartItem = cart.find((item: any) => item.product.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAdjustQuantity = (product: Product, delta: number) => {
    const currentQty = getItemQuantity(product.id);
    const cartItem = cart.find((item: any) => item.product.id === product.id);
    
    if (currentQty === 0 && delta > 0) {
      addToCart(product, 1);
    } else if (cartItem) {
      updateQuantity(cartItem.itemId, currentQty + delta);
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const qty = getItemQuantity(item.id);
    return (
      <View style={styles.productCard}>
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => router.push(`/products/${item.id}`)}
          style={styles.imageWrapper}
        >
          <Image source={{ uri: item.image }} style={styles.productImage} />
        </TouchableOpacity>
        
        <View style={styles.infoWrapper}>
          <Text style={[styles.etaBadge, { color: brandColor }]}>⚡ 10 MINS</Text>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productWeight}>{item.weight || '1 unit'}</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{item.price}</Text>
            {qty > 0 ? (
              <View style={[styles.qtySelector, { backgroundColor: brandColor }]}>
                <TouchableOpacity onPress={() => handleAdjustQuantity(item, -1)} style={styles.qtyBtn}>
                  <Ionicons name="remove" size={10} color="white" />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{qty}</Text>
                <TouchableOpacity onPress={() => handleAdjustQuantity(item, 1)} style={styles.qtyBtn}>
                  <Ionicons name="add" size={10} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={[styles.addBtn, { borderColor: brandColor }]}
                onPress={() => handleAdjustQuantity(item, 1)}
              >
                <Text style={[styles.addBtnText, { color: brandColor }]}>ADD</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* Dynamic Header */}
      <View style={[styles.header, { borderBottomColor: brandColor, borderBottomWidth: 2 }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{brand.name} Store</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner Card info */}
        <View style={[styles.bannerCard, { backgroundColor: brandColor }]}>
          <View style={styles.logoBadge}>
            <Text style={[styles.logoText, { color: brandColor }]}>
              {brand.name.charAt(0)}
            </Text>
          </View>
          <Text style={styles.bannerTitle}>{brand.name}</Text>
          <Text style={styles.bannerSubtitle}>{brand.tagline}</Text>
        </View>

        {/* Coupons section */}
        <View style={styles.couponSection}>
          <Text style={styles.sectionTitle}>Exclusive Brand Deals</Text>
          <View style={styles.couponRow}>
            <View style={styles.couponDetails}>
              <Text style={styles.couponTitle}>BOGO & Combo discounts</Text>
              <Text style={styles.couponDesc}>Save extra 10% flat on {brand.name} grocery products.</Text>
            </View>
            <TouchableOpacity 
              style={[styles.copyBtn, copiedCode === 'BRAND10' && styles.copyBtnActive]}
              onPress={() => handleCopy('BRAND10')}
            >
              <Text style={styles.copyBtnText}>
                {copiedCode === 'BRAND10' ? 'Copied' : 'BRAND10'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Products Grid */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Shop Brand Products</Text>
          {loading ? (
            <ActivityIndicator size="large" color={brandColor} style={{ marginTop: 24 }} />
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item) => item.id}
              renderItem={renderProductItem}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.gridContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="cube-outline" size={48} color="#9CA3AF" />
                  <Text style={styles.emptyText}>No brand items available currently</Text>
                </View>
              }
            />
          )}
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFDFB',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  iconBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  bannerCard: {
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  bannerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
  },
  bannerSubtitle: {
    color: '#F3F4F6',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
  couponSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 12,
  },
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
  },
  couponDetails: {
    flex: 1,
    marginRight: 12,
  },
  couponTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1F2937',
  },
  couponDesc: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '600',
  },
  copyBtn: {
    borderWidth: 1.5,
    borderColor: '#059669',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'white',
  },
  copyBtnActive: {
    backgroundColor: '#ECFDF5',
  },
  copyBtnText: {
    color: '#047857',
    fontSize: 10,
    fontWeight: '900',
  },
  productsSection: {
    padding: 16,
  },
  gridContent: {
    paddingVertical: 8,
  },
  productCard: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    borderRadius: 12,
    width: (width - 40) / 2,
    marginRight: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
    height: 100,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '75%',
    height: '75%',
    resizeMode: 'contain',
  },
  infoWrapper: {
    padding: 8,
  },
  etaBadge: {
    fontSize: 8,
    fontWeight: '900',
    marginBottom: 2,
  },
  productName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2937',
    height: 30,
    lineHeight: 14,
  },
  productWeight: {
    fontSize: 8.5,
    color: '#9CA3AF',
    fontWeight: '700',
    marginTop: 1,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1F2937',
  },
  addBtn: {
    borderWidth: 1.5,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  addBtnText: {
    fontSize: 9.5,
    fontWeight: '900',
  },
  qtySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    padding: 1,
  },
  qtyBtn: {
    padding: 2,
  },
  qtyText: {
    color: 'white',
    fontSize: 9.5,
    fontWeight: '900',
    paddingHorizontal: 4,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '700',
    marginTop: 8,
  }
});
