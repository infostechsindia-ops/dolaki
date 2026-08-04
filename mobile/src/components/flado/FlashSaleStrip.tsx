import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useCountdownTimer } from '../../hooks/useCountdownTimer';

interface FlashSaleStripProps {
  config?: {
    title?: string;
    expiresAt?: string;
    backgroundColor?: string;
    ctaText?: string;
  };
  onPress?: () => void;
}

export function FlashSaleStrip({ config, onPress }: FlashSaleStripProps) {
  const { hours, minutes, seconds } = useCountdownTimer(config?.expiresAt);

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: config?.backgroundColor || '#FF4500' }]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.leftGroup}>
        <Text style={styles.fireEmoji}>🔥</Text>
        <Text style={styles.titleText} numberOfLines={1}>
          {config?.title || 'FLASH SALE: Flat 40% OFF Farm Fresh Veggies!'}
        </Text>
      </View>

      <View style={styles.rightGroup}>
        <View style={styles.timerBadge}>
          <Text style={styles.timerDigit}>{hours}</Text>
          <Text style={styles.timerColon}>:</Text>
          <Text style={styles.timerDigit}>{minutes}</Text>
          <Text style={styles.timerColon}>:</Text>
          <Text style={styles.timerDigit}>{seconds}</Text>
        </View>
        <View style={styles.ctaBtn}>
          <Text style={styles.ctaText}>{config?.ctaText || 'Deals →'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#FF4500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
    gap: 6,
  },
  fireEmoji: {
    fontSize: 16,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    flex: 1,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  timerDigit: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  timerColon: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    marginHorizontal: 1,
  },
  ctaBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ctaText: {
    color: '#FF4500',
    fontSize: 10,
    fontWeight: '900',
  },
});
