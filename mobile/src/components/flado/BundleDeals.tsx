import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { fladoBundlesData } from '../../utils/fladoBundles';

interface BundleDealsProps {
  onAddBundle?: (productIds: string[]) => void;
}

export function BundleDeals({ onAddBundle }: BundleDealsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>🍱 Curated Saver Bundles</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {fladoBundlesData.map((bundle) => (
          <View key={bundle.id} style={styles.card}>
            <Image source={{ uri: bundle.imageUrl }} style={styles.img} />
            <Text style={styles.name} numberOfLines={1}>{bundle.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>₹{bundle.totalPrice}</Text>
              <Text style={styles.originalPrice}>₹{bundle.originalPrice}</Text>
              <Text style={styles.savings}>Save ₹{bundle.savings}</Text>
            </View>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => onAddBundle && onAddBundle(bundle.productIds)}
            >
              <Text style={styles.addBtnText}>+ Add Combo</Text>
            </TouchableOpacity>
          </View>
        ))}
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
    width: 170,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 10,
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: 90,
    borderRadius: 8,
    objectFit: 'cover',
    marginBottom: 8,
  },
  name: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  price: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1F2937',
  },
  originalPrice: {
    fontSize: 9.5,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  savings: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#059669',
  },
  addBtn: {
    backgroundColor: '#059669',
    borderRadius: 20,
    paddingVertical: 6,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
});
