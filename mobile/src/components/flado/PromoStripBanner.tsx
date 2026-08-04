import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

interface PromoStripBannerProps {
  config?: {
    imageUrl?: string;
    title?: string;
    backgroundColor?: string;
    textColor?: string;
    ctaUrl?: string;
  };
  onPress?: () => void;
}

export function PromoStripBanner({ config, onPress }: PromoStripBannerProps) {
  return (
    <TouchableOpacity
      style={[styles.bannerCard, { backgroundColor: config?.backgroundColor || '#10B981' }]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <Image
        source={{ uri: config?.imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80' }}
        style={styles.bannerImg}
      />
      <View style={styles.overlay}>
        <Text style={styles.tagText}>⚡ SPECIAL PROMO</Text>
        <Text style={[styles.titleText, { color: config?.textColor || '#FFFFFF' }]} numberOfLines={2}>
          {config?.title || 'Craving snacks? Chilled beverages & chips delivered in 10 minutes!'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bannerCard: {
    marginHorizontal: 16,
    marginVertical: 10,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  bannerImg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  tagText: {
    color: '#FFD700',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  titleText: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
    lineHeight: 16,
  },
});
