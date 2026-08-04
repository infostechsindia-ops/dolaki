import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

interface LoyaltyHookProps {
  rewardPoints?: number;
  config?: {
    title?: string;
    subtitle?: string;
    buttonText?: string;
  };
  onPress?: () => void;
}

export function LoyaltyHook({ rewardPoints = 120, config, onPress }: LoyaltyHookProps) {
  const monetaryValue = Math.floor(rewardPoints / 10);

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.leftContent}>
        <View style={styles.coinBadge}>
          <Text style={styles.coinIcon}>⭐</Text>
        </View>
        <View style={styles.textGroup}>
          <Text style={styles.title}>
            {config?.title || `You have ${rewardPoints} AuraCoins!`}
          </Text>
          <Text style={styles.subtitle}>
            {config?.subtitle || `Worth ₹${monetaryValue} OFF your next order (100 coins = ₹10)`}
          </Text>
        </View>
      </View>

      <View style={styles.ctaBtn}>
        <Text style={styles.ctaText}>{config?.buttonText || 'Use Coins →'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 10,
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  coinBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  coinIcon: {
    fontSize: 18,
  },
  textGroup: {
    flex: 1,
  },
  title: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '900',
  },
  subtitle: {
    color: '#B45309',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  ctaBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
});
