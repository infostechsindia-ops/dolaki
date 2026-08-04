import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StoreItem {
  id: string;
  name: string;
  address: string;
  distance: number;
  eta: number;
  isActive: boolean;
  serviceRadiusKm: number;
}

interface ShopCarouselProps {
  stores?: StoreItem[];
  selectedStoreId?: string;
  onSelectStore?: (store: StoreItem) => void;
}

export function ShopCarousel({ stores = [], selectedStoreId, onSelectStore }: ShopCarouselProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>🏪 Nearby Grocery Shops ({stores.length})</Text>
      {stores.length === 0 ? (
        <Text style={styles.noShopText}>No registered grocery shops delivering to your location.</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {stores.map((store) => {
            const isSelected = selectedStoreId === store.id;
            return (
              <TouchableOpacity
                key={store.id}
                style={[
                  styles.shopCard,
                  isSelected && styles.shopCardSelected,
                ]}
                onPress={() => onSelectStore && onSelectStore(store)}
                activeOpacity={0.8}
              >
                <View style={styles.shopCardHeader}>
                  <Ionicons name="storefront" size={16} color={isSelected ? '#059669' : '#4B5563'} />
                  <View style={[styles.shopStatusBadge, store.isActive ? styles.shopStatusOpen : styles.shopStatusClosed]}>
                    <Text style={styles.shopStatusText}>{store.isActive ? 'OPEN' : 'CLOSED'}</Text>
                  </View>
                </View>

                <Text style={[styles.shopName, isSelected && styles.shopNameSelected]} numberOfLines={1}>
                  {store.name}
                </Text>

                <Text style={styles.shopMeta}>
                  📍 {store.distance} km · 🛵 {store.eta} mins
                </Text>

                <View style={styles.shopRangeBadge}>
                  <Text style={styles.shopRangeText}>
                    Range: {Number(store.serviceRadiusKm || (store as any).deliveryRadiusKm || 5.0).toFixed(1)} km
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
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
  noShopText: {
    fontSize: 11,
    color: '#6B7280',
    paddingHorizontal: 16,
    fontStyle: 'italic',
  },
  scrollContent: {
    paddingLeft: 16,
    gap: 10,
    paddingBottom: 8,
  },
  shopCard: {
    width: 140,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  shopCardSelected: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  shopCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  shopName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  shopNameSelected: {
    color: '#047857',
  },
  shopMeta: {
    fontSize: 9.5,
    color: '#6B7280',
    fontWeight: '700',
    marginBottom: 6,
  },
  shopRangeBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  shopRangeText: {
    fontSize: 8.5,
    color: '#4B5563',
    fontWeight: '800',
  },
  shopStatusBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  shopStatusOpen: {
    backgroundColor: '#D1FAE5',
  },
  shopStatusClosed: {
    backgroundColor: '#FEE2E2',
  },
  shopStatusText: {
    fontSize: 7.5,
    fontWeight: '900',
    color: '#065F46',
  },
});
