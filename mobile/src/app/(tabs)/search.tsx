import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { Product } from '../../utils/mockData';
import { api } from '../../utils/api';

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ query?: string }>();
  const { addToCart } = useCart();
  
  const [searchQuery, setSearchQuery] = useState(params.query || '');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const trendingTags = ['Kurta', 'Milk', 'Mangoes', 'Cosmetics', 'Phones', 'Bread'];

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const data = await api.getProducts();
        setAllProducts(data);
        if (params.query) {
          filterProducts(params.query, data);
        } else {
          setFilteredProducts([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, [params.query]);

  const filterProducts = (query: string, productsList: Product[]) => {
    if (!query.trim()) {
      setFilteredProducts([]);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = productsList.filter(p => 
      p && (
        (p.name && p.name.toLowerCase().includes(lowerQuery)) || 
        (p.category && p.category.toLowerCase().includes(lowerQuery)) ||
        (p.description && p.description.toLowerCase().includes(lowerQuery))
      )
    );
    setFilteredProducts(filtered);
  };

  const handleTextChange = (text: string) => {
    setSearchQuery(text);
    filterProducts(text, allProducts);
  };

  const handleTagPress = (tag: string) => {
    setSearchQuery(tag);
    filterProducts(tag, allProducts);
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    return (
      <TouchableOpacity 
        style={styles.searchResultItem}
        activeOpacity={0.8}
        onPress={() => router.push(`/products/${item.id}`)}
      >
        <Image source={{ uri: item.image || (item.images && item.images[0]) || '' }} style={styles.productImage} />
        
        <View style={styles.productDetails}>
          {item.isFlado ? (
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

          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productCategory}>{item.category}</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{item.price}</Text>
            {item.originalPrice > item.price && (
              <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
            )}
            
            <TouchableOpacity 
              style={[styles.addBtn, { backgroundColor: item.isFlado ? '#059669' : '#8B5CF6' }]}
              onPress={() => addToCart(item, 1)}
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.inputWrapper}>
          <Ionicons name="search" size={18} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items, categories..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={handleTextChange}
            autoFocus={!params.query}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleTextChange('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#8B5CF6" style={{ flex: 1 }} />
      ) : searchQuery.trim().length === 0 ? (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.sectionTitle}>Trending Searches</Text>
          <View style={styles.tagsContainer}>
            {trendingTags.map((tag, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.tag}
                onPress={() => handleTagPress(tag)}
              >
                <Ionicons name="trending-up" size={12} color="#6B7280" style={{ marginRight: 4 }} />
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Ionicons name="search-outline" size={64} color="#D1D5DB" />
          <Text style={styles.noResultsTitle}>No results found</Text>
          <Text style={styles.noResultsSubtitle}>We couldn't find anything matching "{searchQuery}"</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={item => item.id}
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
    backgroundColor: '#FFFFFF',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
  },
  clearButton: {
    padding: 2,
  },
  suggestionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagText: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '500',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
  },
  noResultsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
  },
  listContent: {
    padding: 16,
  },
  searchResultItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
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
    backgroundColor: '#8B5CF6',
  },
  badgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  productCategory: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  originalPrice: {
    fontSize: 11,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  addBtn: {
    marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  addBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 11,
  },
});
