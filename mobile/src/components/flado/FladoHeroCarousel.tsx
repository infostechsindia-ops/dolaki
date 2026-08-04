import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useKenBurns } from '../../hooks/useKenBurns';

const { width } = Dimensions.get('window');
const HERO_WIDTH = width - 32;

interface BannerItem {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  backgroundColor?: string;
  badgeText?: string;
}

interface FladoHeroCarouselProps {
  config?: {
    banners?: BannerItem[];
    autoPlayInterval?: number;
  };
  onBannerPress?: (banner: BannerItem) => void;
}

export function FladoHeroCarousel({ config, onBannerPress }: FladoHeroCarouselProps) {
  const banners = config?.banners || [
    {
      id: 'fb1',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80',
      title: 'Monsoon Mega Fresh Sale!',
      subtitle: '100% Organic Vegetables & Daily Dairy delivered in 10 mins.',
      ctaText: 'Shop Fresh',
      backgroundColor: '#059669',
      badgeText: '10 MIN EXPRESS'
    },
    {
      id: 'fb2',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80',
      title: 'Artisanal Bakery & Milk',
      subtitle: 'Fresh sourdough loaves & A2 Desi Cow Milk delivered daily.',
      ctaText: 'Explore Bakery',
      backgroundColor: '#065F46',
      badgeText: 'FARM DIRECT'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, config?.autoPlayInterval || 4000);
    return () => clearInterval(timer);
  }, [banners.length, config?.autoPlayInterval]);

  const activeBanner = banners[currentIndex] || banners[0];

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onBannerPress && onBannerPress(activeBanner)}
        style={[styles.card, { backgroundColor: activeBanner.backgroundColor || '#059669' }]}
      >
        <View style={styles.textContainer}>
          <Text style={styles.badge}>{activeBanner.badgeText || '⚡ 10-MIN EXPRESS'}</Text>
          <Text style={styles.title} numberOfLines={1}>{activeBanner.title}</Text>
          <Text style={styles.subtitle} numberOfLines={2}>{activeBanner.subtitle}</Text>
          <View style={styles.ctaBtn}>
            <Text style={styles.ctaText}>{activeBanner.ctaText || 'Shop Now →'}</Text>
          </View>
        </View>

        <Image source={{ uri: activeBanner.imageUrl }} style={styles.heroImg} />
      </TouchableOpacity>

      {/* Dots Indicator */}
      <View style={styles.dotsRow}>
        {banners.map((_, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => setCurrentIndex(idx)}
            style={[
              styles.dot,
              idx === currentIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginHorizontal: 16,
    marginVertical: 10,
  },
  card: {
    height: 160,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  textContainer: {
    flex: 1.3,
    marginRight: 12,
  },
  badge: {
    color: '#FFD700',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 10,
    lineHeight: 15,
  },
  ctaBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  ctaText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '900',
  },
  heroImg: {
    width: 110,
    height: 110,
    borderRadius: 12,
    objectFit: 'cover',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },
  activeDot: {
    width: 20,
    backgroundColor: '#059669',
  },
});
