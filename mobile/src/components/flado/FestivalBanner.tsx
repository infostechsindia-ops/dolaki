import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

interface FestivalBannerProps {
  config?: {
    title?: string;
    subtitle?: string;
    backgroundColor?: string;
    ctaText?: string;
    badgeText?: string;
  };
  onPress?: () => void;
}

export function FestivalBanner({ config, onPress }: FestivalBannerProps) {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: config?.backgroundColor || '#059669' }]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{config?.badgeText || '🪔 FESTIVAL SPECIAL'}</Text>
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {config?.title || 'Monsoon Munchies: Hot Tea, Coffee & Crispy Sev'}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {config?.subtitle || 'Satisfy all your seasonal cravings with express delivery under 10 minutes.'}
        </Text>
      </View>

      <View style={styles.ctaBtn}>
        <Text style={styles.ctaText}>{config?.ctaText || 'Shop Now →'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    fontWeight: '500',
  },
  ctaBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ctaText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '900',
  },
});
