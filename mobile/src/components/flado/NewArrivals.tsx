import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../../utils/mockData';

interface NewArrivalsProps {
  products: Product[];
  getItemQuantity: (id: string) => number;
  onAdjustQuantity: (product: Product, delta: number) => void;
  onProductPress?: (id: string) => void;
}

export function NewArrivals({ products, getItemQuantity, onAdjustQuantity, onProductPress }: NewArrivalsProps) {
  if (!products || products.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>✨ Fresh Additions at Local Shops</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {products.map((item) => {
          const qty = getItemQuantity(item.id);
          return (
            <View key={item.id} style={styles.card}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => onProductPress && onProductPress(item.id)}
                style={styles.imagePress}
              >
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>JUST ARRIVED</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.productWeight}>{item.weight || '1 unit'}</Text>

                <View style={styles.priceAndAction}>
                  <Text style={styles.price}>₹{item.price}</Text>

                  {qty > 0 ? (
                    <View style={styles.quantitySelector}>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => onAdjustQuantity(item, -1)}>
                        <Ionicons name="remove" size={12} color="white" />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{qty}</Text>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => onAdjustQuantity(item, 1)}>
                        <Ionicons name="add" size={12} color="white" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.addBtn} onPress={() => onAdjustQuantity(item, 1)}>
                      <Text style={styles.addBtnText}>ADD</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  scrollContent: {
    paddingLeft: 16,
    gap: 12,
  },
  card: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  imagePress: {
    height: 110,
    width: '100%',
    backgroundColor: '#F9FAFB',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  newBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 7.5,
    fontWeight: '900',
  },
  productInfo: {
    padding: 8,
  },
  productName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2937',
    height: 30,
  },
  productWeight: {
    fontSize: 9.5,
    color: '#6B7280',
    marginBottom: 6,
  },
  priceAndAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
  },
  addBtn: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  addBtnText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '900',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  qtyBtn: {
    padding: 2,
  },
  qtyText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    marginHorizontal: 6,
  },
});
