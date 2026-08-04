import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../../utils/mockData';

interface RecentlyOrderedProps {
  products: Product[];
  getItemQuantity: (id: string) => number;
  onAdjustQuantity: (product: Product, delta: number) => void;
}

export function RecentlyOrdered({ products, getItemQuantity, onAdjustQuantity }: RecentlyOrderedProps) {
  if (!products || products.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="flash" size={14} color="#F59E0B" style={{ marginRight: 6 }} />
        <Text style={styles.sectionTitle}>⚡ Order Again</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {products.map((prod) => {
          const qty = getItemQuantity(prod.id);
          return (
            <View key={prod.id} style={styles.miniCard}>
              <Image source={{ uri: prod.image }} style={styles.img} />
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{prod.name}</Text>
                <Text style={styles.price}>₹{prod.price}</Text>
              </View>

              {qty > 0 ? (
                <View style={styles.qtySelector}>
                  <TouchableOpacity onPress={() => onAdjustQuantity(prod, -1)} style={styles.qtyBtn}>
                    <Ionicons name="remove" size={10} color="white" />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{qty}</Text>
                  <TouchableOpacity onPress={() => onAdjustQuantity(prod, 1)} style={styles.qtyBtn}>
                    <Ionicons name="add" size={10} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.addBtn} onPress={() => onAdjustQuantity(prod, 1)}>
                  <Text style={styles.addBtnText}>+ Add</Text>
                </TouchableOpacity>
              )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
  },
  scrollContent: {
    paddingLeft: 16,
    gap: 10,
  },
  miniCard: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    width: 44,
    height: 44,
    borderRadius: 6,
    objectFit: 'contain',
  },
  info: {
    flex: 1,
    marginLeft: 8,
  },
  name: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2937',
  },
  price: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
    marginTop: 2,
  },
  addBtn: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  addBtnText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '900',
  },
  qtySelector: {
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
    fontSize: 10,
    fontWeight: '900',
    marginHorizontal: 4,
  },
});
