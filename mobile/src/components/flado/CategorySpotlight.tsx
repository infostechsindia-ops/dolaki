import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../../utils/mockData';

interface CategorySpotlightProps {
  title: string;
  emoji?: string;
  products: Product[];
  etaMinutes?: number;
  getItemQuantity: (id: string) => number;
  onAdjustQuantity: (product: Product, delta: number) => void;
  onSeeAllPress?: () => void;
  onProductPress?: (id: string) => void;
}

export function CategorySpotlight({
  title,
  emoji = '🥬',
  products,
  etaMinutes = 10,
  getItemQuantity,
  onAdjustQuantity,
  onSeeAllPress,
  onProductPress,
}: CategorySpotlightProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>{emoji} {title}</Text>
        {onSeeAllPress && (
          <TouchableOpacity onPress={onSeeAllPress}>
            <Text style={styles.seeAllText}>SEE ALL →</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {products.map((item) => {
          const qty = getItemQuantity(item.id);
          const discountPercent = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;

          return (
            <View key={item.id} style={styles.card}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => onProductPress && onProductPress(item.id)}
                style={styles.imagePress}
              >
                <Image source={{ uri: item.image }} style={styles.productImage} />
                {discountPercent > 0 && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{discountPercent}% OFF</Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.productInfo}>
                <Text style={styles.etaBadge}>⚡ {etaMinutes} MINS</Text>
                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.productWeight}>{item.weight || '500g'}</Text>

                <View style={styles.priceAndAction}>
                  <View>
                    <Text style={styles.price}>₹{item.price}</Text>
                    {item.originalPrice > item.price && (
                      <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
                    )}
                  </View>

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
    paddingVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
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
  discountBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#059669',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  productInfo: {
    padding: 8,
  },
  etaBadge: {
    fontSize: 8,
    fontWeight: '800',
    color: '#059669',
    marginBottom: 2,
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
  originalPrice: {
    fontSize: 9.5,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
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
