import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';
import { Product } from '@/utils/mockData';
import { api } from '@/utils/api';
import { fladoCategoriesData } from '@/utils/fladoCategories';
import { fladoProductsData } from '@/utils/fladoProducts';

const { width } = Dimensions.get('window');

export default function MobileCategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { cart, addToCart, updateQuantity } = useCart();

  const [loading, setLoading] = useState(true);
  const [activeSubcat, setActiveSubcat] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc'>('relevance');

  const category = fladoCategoriesData.find(c => c.slug === slug);

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
      setProducts(items.filter(p => p.isFlado && p.category === slug));
      setLoading(false);
    };
    loadProducts();
  }, [slug]);

  if (!category) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Category not found</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Filter items
  let filtered = products;

  if (activeSubcat !== 'All') {
    filtered = filtered.filter(p => 
      (p.subCategory || '').toLowerCase().includes(activeSubcat.toLowerCase())
    );
  }

  if (inStockOnly) {
    filtered = filtered.filter(p => p.stock > 0);
  }

  // Sort items
  if (sortBy === 'price-asc') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  const getItemQuantity = (productId: string) => {
    const cartItem = cart.find(item => item.product.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAdjustQuantity = (product: Product, delta: number) => {
    const currentQty = getItemQuantity(product.id);
    const cartItem = cart.find(item => item.product.id === product.id);
    
    if (currentQty === 0 && delta > 0) {
      addToCart(product, 1);
    } else if (cartItem) {
      updateQuantity(cartItem.itemId, currentQty + delta);
    }
  };

  // Cart Metrics
  const fladoCartItems = cart.filter(item => item.product.isFlado);
  const fladoCartCount = fladoCartItems.reduce((acc, item) => acc + item.quantity, 0);
  const fladoSubtotal = fladoCartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const renderProductItem = ({ item }: { item: Product }) => {
    const qty = getItemQuantity(item.id);
    const discountPercent = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;

    return (
      <View style={styles.productCard}>
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => router.push(`/products/${item.id}`)}
          style={styles.imageWrapper}
        >
          <Image source={{ uri: item.image }} style={styles.productImage} />
          {discountPercent > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountPercent}% OFF</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <View style={styles.infoWrapper}>
          <Text style={[styles.etaBadge, { color: category.primaryColor }]}>⚡ 10 MINS</Text>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productWeight}>{item.weight || '500g'}</Text>
          
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.price}>₹{item.price}</Text>
              {item.originalPrice > item.price && (
                <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
              )}
            </View>

            {qty > 0 ? (
              <View style={[styles.qtySelector, { backgroundColor: category.primaryColor }]}>
                <TouchableOpacity onPress={() => handleAdjustQuantity(item, -1)} style={styles.qtyBtn}>
                  <Ionicons name="remove" size={12} color="white" />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{qty}</Text>
                <TouchableOpacity onPress={() => handleAdjustQuantity(item, 1)} style={styles.qtyBtn}>
                  <Ionicons name="add" size={12} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={[styles.addBtn, { borderColor: category.primaryColor }]}
                onPress={() => handleAdjustQuantity(item, 1)}
              >
                <Text style={[styles.addBtnText, { color: category.primaryColor }]}>ADD</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* SUB-CATEGORY PILLS ROW */}
      <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', backgroundColor: 'white' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 16 }}>
          <TouchableOpacity 
            style={[
              styles.subcatPill,
              activeSubcat === 'All' && [styles.subcatPillActive, { backgroundColor: category.primaryColor, borderColor: category.primaryColor }]
            ]}
            onPress={() => setActiveSubcat('All')}
          >
            <Text style={[styles.subcatText, activeSubcat === 'All' && styles.subcatTextActive]}>All Items</Text>
          </TouchableOpacity>
          {category.subCategories.map((sub, idx) => (
            <TouchableOpacity 
              key={idx}
              style={[
                styles.subcatPill,
                activeSubcat === sub && [styles.subcatPillActive, { backgroundColor: category.primaryColor, borderColor: category.primaryColor }]
              ]}
              onPress={() => setActiveSubcat(sub)}
            >
              <Text style={[styles.subcatText, activeSubcat === sub && styles.subcatTextActive]}>{sub}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* FILTERS & SORT ROW */}
      <View style={styles.filterBar}>
        <TouchableOpacity 
          style={[
            styles.filterPill,
            inStockOnly && [styles.filterPillActive, { borderColor: category.primaryColor }]
          ]}
          onPress={() => setInStockOnly(!inStockOnly)}
        >
          <Ionicons name="checkbox" size={14} color={inStockOnly ? category.primaryColor : '#9CA3AF'} style={{ marginRight: 4 }} />
          <Text style={[styles.filterText, inStockOnly && { color: category.primaryColor }]}>In Stock Only</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity 
            style={[styles.sortBtn, sortBy === 'price-asc' && { borderColor: category.primaryColor }]}
            onPress={() => setSortBy(sortBy === 'price-asc' ? 'relevance' : 'price-asc')}
          >
            <Text style={[styles.sortText, sortBy === 'price-asc' && { color: category.primaryColor }]}>Price Low-High</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sortBtn, sortBy === 'price-desc' && { borderColor: category.primaryColor }]}
            onPress={() => setSortBy(sortBy === 'price-desc' ? 'relevance' : 'price-desc')}
          >
            <Text style={[styles.sortText, sortBy === 'price-desc' && { color: category.primaryColor }]}>Price High-Low</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={category.primaryColor} style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderProductItem}
          numColumns={2}
          contentContainerStyle={styles.flatlistContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No items found in this section</Text>
            </View>
          }
        />
      )}

      {/* STICKY BOTTOM BASKET OVERLAY */}
      {fladoCartCount > 0 && (
        <View style={styles.cartOverlay}>
          <View style={styles.cartOverlayLeft}>
            <Text style={styles.cartOverlayQty}>{fladoCartCount} Item{fladoCartCount > 1 ? 's' : ''}</Text>
            <Text style={styles.cartOverlayPrice}>₹{fladoSubtotal}</Text>
          </View>
          <TouchableOpacity 
            style={styles.cartOverlayBtn}
            onPress={() => router.push('/(tabs)/cart')}
          >
            <Text style={styles.cartOverlayBtnText}>View Cart</Text>
            <Ionicons name="arrow-forward" size={14} color="#047857" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>
      )}

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
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  backBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#059669',
    borderRadius: 8,
  },
  backBtnText: {
    color: 'white',
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
  subcatPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    marginRight: 8,
  },
  subcatPillActive: {
    borderWidth: 1.5,
  },
  subcatText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  subcatTextActive: {
    color: 'white',
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: 'white',
  },
  filterPillActive: {
    borderWidth: 1.5,
  },
  filterText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
  },
  sortBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: 'white',
  },
  sortText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
  },
  flatlistContent: {
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 120,
  },
  productCard: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    borderRadius: 12,
    width: (width - 32) / 2,
    marginHorizontal: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
    height: 110,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  productImage: {
    width: '75%',
    height: '75%',
    resizeMode: 'contain',
  },
  discountBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: 'white',
    fontSize: 8,
    fontWeight: '900',
  },
  infoWrapper: {
    padding: 8,
  },
  etaBadge: {
    fontSize: 8.5,
    fontWeight: '900',
    marginBottom: 2,
  },
  productName: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1F2937',
    height: 32,
    lineHeight: 16,
  },
  productWeight: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 6,
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
  originalPrice: {
    fontSize: 9.5,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  addBtn: {
    borderWidth: 1.5,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  addBtnText: {
    fontSize: 10,
    fontWeight: '900',
  },
  qtySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    padding: 1.5,
  },
  qtyBtn: {
    padding: 3,
  },
  qtyText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 4,
  },
  cartOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#059669',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  cartOverlayLeft: {
    flexDirection: 'column',
  },
  cartOverlayQty: {
    color: '#A7F3D0',
    fontSize: 9,
    fontWeight: '800',
  },
  cartOverlayPrice: {
    color: 'white',
    fontSize: 14,
    fontWeight: '900',
  },
  cartOverlayBtn: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartOverlayBtnText: {
    color: '#047857',
    fontSize: 11,
    fontWeight: '900',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '700',
    marginTop: 8,
  }
});
