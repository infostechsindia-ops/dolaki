import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { fladoBrandsData } from '../../utils/fladoBrands';

interface BrandStripProps {
  onBrandPress?: (slug: string) => void;
}

export function BrandStrip({ onBrandPress }: BrandStripProps) {
  const brands = fladoBrandsData.slice(0, 8);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>⭐️ Featured Partner Brands</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {brands.map((brand, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => onBrandPress && onBrandPress(brand.slug)}
          >
            <Image source={{ uri: brand.logoUrl }} style={styles.logo} />
            <Text style={styles.name} numberOfLines={1}>{brand.name}</Text>
            <View style={styles.offerBadge}>
              <Text style={styles.offerText}>{brand.offerText.split('on')[0]}</Text>
            </View>
          </TouchableOpacity>
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
    gap: 10,
  },
  card: {
    width: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 10,
    alignItems: 'center',
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    objectFit: 'contain',
    marginBottom: 6,
  },
  name: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  offerBadge: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  offerText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#8B5CF6',
  },
});
