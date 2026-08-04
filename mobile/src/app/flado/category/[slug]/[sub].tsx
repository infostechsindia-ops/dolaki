import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';
import { Product } from '@/utils/mockData';
import { api } from '@/utils/api';
import { fladoCategoriesData } from '@/utils/fladoCategories';
import { fladoProductsData } from '@/utils/fladoProducts';

const { width } = Dimensions.get('window');

export default function MobileSubCategoryScreen() {
  const { slug, sub } = useLocalSearchParams<{ slug: string; sub: string }>();
  const router = useRouter();
  const { cart, addToCart, updateQuantity } = useCart();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  const category = fladoCategoriesData.find(c => c.slug === slug);

  // Format sub: e.g. "fresh-fruits" -> "Fresh Fruits"
  const formattedSub = sub
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

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
      // Filter by category slug and subCategory formatted name
      setProducts(
        items.filter(
          p => p.isFlado && 
          p.category === slug && 
          (p.subCategory || '').toLowerCase().includes(formattedSub.toLowerCase())
        )
      );
      setLoading(false);
    };
    loadProducts();
  }, [slug, formattedSub]);

  if (!category) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Category not found</Text>
      </SafeAreaView>
    );
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
          <Text style={[styles.etaBadge, { color: category.primaryColor }]}>⚡ 10 MINS</Text>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productWeight}>{item.weight || '500g'}</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{item.price}</Text>
            {qty > 0 ? (
              <View style={[styles.qtySelector, { backgroundColor: category.primaryColor }]}>
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
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerTitle}>{formattedSub}</Text>
          <Text style={styles.headerSubtitle}>{category.name}</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={category.primaryColor} style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProductItem}
          numColumns={2}
          contentContainerStyle={styles.flatlistContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No items currently in stock</Text>
            </View>
          }
        />
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
    fontSize: 14,
    color: '#374151',
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '700',
  },
  flatlistContent: {
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 40,
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
    paddingVertical: 60,
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
