import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';
import { Product, MOCK_PRODUCTS } from '@/utils/mockData';
import { fladoProductsData } from '@/utils/fladoProducts';
import { api } from '@/utils/api';

const { width } = Dimensions.get('window');

// Extended mock brands registry matching web
const BRANDS_REGISTRY: Record<string, { name: string; story: string; primaryColor: string; accentColor: string; bannerUrl: string; logoUrl: string; tagline: string }> = {
  apple: {
    name: 'Apple Flagship Store',
    story: 'Designed in California. Bringing you the ultimate innovative experience across iPhone, MacBook, and AirPods Pro.',
    primaryColor: '#000000',
    accentColor: '#A3A3A3',
    bannerUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600',
    logoUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=150',
    tagline: 'Think Different. Sourced directly from Apple.'
  },
  samsung: {
    name: 'Samsung Authorized Outlet',
    story: 'Inspiring the world with innovative consumer tech and devices. Sourced from Samsung regional hubs.',
    primaryColor: '#0A0A0A',
    accentColor: '#1D4ED8',
    bannerUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600',
    logoUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=150',
    tagline: 'Join the Flip Side. Ultimate screen innovations.'
  },
  nike: {
    name: 'Nike Premium Store',
    story: 'Bringing inspiration and innovation to every athlete in the world. Direct sportswear drops.',
    primaryColor: '#111827',
    accentColor: '#F97316',
    bannerUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    logoUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=150',
    tagline: 'Just Do It. Official premium sneakers.'
  },
  adidas: {
    name: 'Adidas Performance Mall',
    story: 'Through sport, we have the power to change lives. Innovative Ultraboost and activewear.',
    primaryColor: '#000000',
    accentColor: '#3B82F6',
    bannerUrl: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=600',
    logoUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=150',
    tagline: 'Impossible is Nothing. Elite running technologies.'
  },
  ikea: {
    name: 'IKEA Furniture Spotlight',
    story: 'Creating a better everyday life for the many people. Easy assemble minimalist furniture.',
    primaryColor: '#003399',
    accentColor: '#FFCC00',
    bannerUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600',
    logoUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150',
    tagline: 'Make Home Amazing. Living space optimizations.'
  }
};

export default function MobileBrandStoreScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { addToCart, cart, updateQuantity } = useCart();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [brandDetail, setBrandDetail] = useState<{ name: string; story: string; primaryColor: string; accentColor: string; bannerUrl: string; logoUrl: string; tagline: string } | null>(null);

  const defaultBrandInfo = BRANDS_REGISTRY[slug || ''] || {
    name: slug ? (slug.charAt(0).toUpperCase() + slug.slice(1) + ' Store') : 'Official Brand Store',
    story: 'Bringing authentic direct brand products with platform warranty seals.',
    primaryColor: '#1F2937',
    accentColor: '#8B5CF6',
    bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600',
    logoUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d296e?w=150',
    tagline: 'Authenticity Guaranteed.'
  };

  const brandInfo = brandDetail || defaultBrandInfo;

  useEffect(() => {
    const loadBrandData = async () => {
      if (!slug) return;
      try {
        // Fetch live brand metadata
        const liveBrand = await api.getBrandBySlug(slug);
        if (liveBrand) {
          setBrandDetail({
            name: liveBrand.name,
            story: liveBrand.description || defaultBrandInfo.story,
            primaryColor: '#1F2937',
            accentColor: '#8B5CF6',
            bannerUrl: defaultBrandInfo.bannerUrl,
            logoUrl: liveBrand.logoUrl || defaultBrandInfo.logoUrl,
            tagline: `${liveBrand.name} Flagship Store`
          });
        }

        // Fetch brand products
        const brandProds = await api.getProductsByBrand(slug);
        setProducts(brandProds);
      } catch (e) {
        // Fallback to local filtering
        const matched = [...MOCK_PRODUCTS, ...fladoProductsData].filter(
          (p) => p.brand && p.brand.toLowerCase() === (slug || '').toLowerCase()
        );
        setProducts(matched);
      } finally {
        setLoading(false);
      }
    };

    loadBrandData();
  }, [slug]);

  const renderProduct = ({ item }: { item: Product }) => {
    const cartItem = cart.find((c) => c.product.id === item.id);
    const qty = cartItem ? cartItem.quantity : 0;

    return (
      <TouchableOpacity 
        style={styles.productCard} 
        onPress={() => router.push(`/products/${item.id}`)}
      >
        <Image source={{ uri: item.image || (item.images && item.images[0]) || '' }} style={styles.productImage} />
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
        
        {qty > 0 ? (
          <View style={styles.qtyRow}>
            <TouchableOpacity onPress={() => updateQuantity(item.id, qty - 1)} style={styles.qtyBtn}>
              <Ionicons name="remove" size={14} color="white" />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{qty}</Text>
            <TouchableOpacity onPress={() => updateQuantity(item.id, qty + 1)} style={styles.qtyBtn}>
              <Ionicons name="add" size={14} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            onPress={() => addToCart(item, 1)} 
            style={[styles.addBtn, { backgroundColor: brandInfo.accentColor }]}
          >
            <Text style={styles.addBtnText}>ADD TO CART</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{brandInfo.name}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner Hero */}
        <View style={styles.bannerWrapper}>
          <Image source={{ uri: brandInfo.bannerUrl }} style={styles.bannerImage} />
          <View style={[styles.bannerOverlay, { backgroundColor: `${brandInfo.primaryColor}cc` }]} />
          <View style={styles.brandHeroContent}>
            <Image source={{ uri: brandInfo.logoUrl }} style={styles.brandLogo} />
            <Text style={styles.brandTagline}>{brandInfo.tagline}</Text>
          </View>
        </View>

        {/* Brand Story */}
        <View style={styles.storyCard}>
          <Text style={styles.storyHeader}>About the Brand</Text>
          <Text style={styles.storyText}>{brandInfo.story}</Text>
        </View>

        {/* Grid Title */}
        <Text style={styles.sectionTitle}>Shop all Products ({products.length} items)</Text>

        {/* Products Grid */}
        {products.length > 0 ? (
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.gridContainer}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="alert-circle-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No products currently listed for this brand.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 56,
    backgroundColor: '#111827',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backBtn: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  bannerWrapper: {
    height: 180,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  brandHeroContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  brandLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  brandTagline: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  storyCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  storyHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  storyText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  gridContainer: {
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
  gridRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  productCard: {
    width: (width - 48) / 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    height: 32,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  addBtn: {
    width: '100%',
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 32,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 16,
    paddingHorizontal: 8,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
});
