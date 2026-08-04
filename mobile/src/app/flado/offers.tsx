import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Clipboard, ToastAndroid, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Coupon {
  code: string;
  discount: string;
  minOrder: number;
  description: string;
  category: 'all' | 'groceries' | 'snacks' | 'dairy' | 'household';
}

const mockCoupons: Coupon[] = [
  { code: 'FLADO50', discount: '₹50 OFF', minOrder: 399, description: 'Save ₹50 flat on your first quick-commerce order of the week.', category: 'all' },
  { code: 'ORGANIC20', discount: '20% OFF', minOrder: 299, description: 'Applicable on fresh organic farm greens and direct fruits.', category: 'groceries' },
  { code: 'DAIRY30', discount: '₹30 OFF', minOrder: 199, description: 'Applicable on milk, butter, cheese, and fresh bakery buns.', category: 'dairy' },
  { code: 'SWEET15', discount: '15% OFF', minOrder: 249, description: 'Save on Cadbury chocolates, Lay\'s chips, and tea combos.', category: 'snacks' },
  { code: 'CLEAN50', discount: '₹50 OFF', minOrder: 499, description: 'Get discounts on HUL household detergents and surface cleaners.', category: 'household' }
];

export default function MobileOffersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'groceries' | 'snacks' | 'dairy' | 'household'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    Clipboard.setString(code);
    setCopiedCode(code);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Coupon code copied!', ToastAndroid.SHORT);
    } else {
      Alert.alert('Copied', 'Coupon code copied to clipboard!');
    }
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const filteredCoupons = activeTab === 'all' 
    ? mockCoupons 
    : mockCoupons.filter(c => c.category === activeTab);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>⚡ Flado Offers & Coupons</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs Row */}
      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 16 }}>
          {(['all', 'groceries', 'snacks', 'dairy', 'household'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Coupons List */}
        <View style={styles.couponsList}>
          {filteredCoupons.map(coupon => (
            <View key={coupon.code} style={styles.couponCard}>
              <View style={styles.cardHeader}>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{coupon.discount}</Text>
                </View>
                <Text style={styles.minOrderText}>Min Order: ₹{coupon.minOrder}</Text>
              </View>
              
              <Text style={styles.codeText}>{coupon.code}</Text>
              <Text style={styles.descText}>{coupon.description}</Text>
              
              <View style={styles.divider} />
              
              <View style={styles.actionRow}>
                <TouchableOpacity 
                  style={[styles.copyBtn, copiedCode === coupon.code && styles.copyBtnActive]} 
                  onPress={() => handleCopy(coupon.code)}
                >
                  <Ionicons name={copiedCode === coupon.code ? 'checkmark-circle' : 'copy-outline'} size={14} color="#047857" />
                  <Text style={styles.copyBtnText}>
                    {copiedCode === coupon.code ? 'Copied!' : 'Copy Code'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.shopBtn}
                  onPress={() => {
                    const dest = coupon.category === 'all' ? 'fruits-vegetables' : coupon.category;
                    router.push(`/flado/category/${dest}`);
                  }}
                >
                  <Text style={styles.shopBtnText}>Shop Now</Text>
                  <Ionicons name="arrow-forward" size={12} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Campaign banners */}
        <View style={styles.campaignsContainer}>
          <Text style={styles.sectionTitle}>Featured Storewide Campaigns</Text>
          
          <TouchableOpacity 
            style={[styles.campaignCard, { backgroundColor: '#064E3B' }]}
            onPress={() => router.push('/flado/category/fruits-vegetables')}
          >
            <Text style={styles.campTitle}>🍎 Fresh Farm Drop Deals</Text>
            <Text style={styles.campSubtitle}>Direct orchard fruits and leafy greens with flat 20% discount.</Text>
            <Text style={styles.campAction}>Shop Fresh Drops &rsaquo;</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.campaignCard, { backgroundColor: '#78350F' }]}
            onPress={() => router.push('/flado/category/snacks-beverages')}
          >
            <Text style={styles.campTitle}>🍪 Midnight Munchies Carnival</Text>
            <Text style={styles.campSubtitle}>Chocolates, potato chips, carbonated sodas at special bundle prices.</Text>
            <Text style={styles.campAction}>Browse Midnight Snacks &rsaquo;</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFDFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: 'white',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  tabsWrapper: {
    backgroundColor: 'white',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  tabBtnActive: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  tabText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#047857',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  couponsList: {
    padding: 16,
    gap: 12,
  },
  couponCard: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    borderRadius: 14,
    padding: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  discountBadge: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    color: '#047857',
    fontSize: 10,
    fontWeight: '900',
  },
  minOrderText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
  },
  codeText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F2937',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  descText: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#059669',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  copyBtnActive: {
    backgroundColor: '#ECFDF5',
  },
  copyBtnText: {
    color: '#047857',
    fontSize: 10,
    fontWeight: '800',
  },
  shopBtn: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  shopBtnText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900',
  },
  campaignsContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 12,
  },
  campaignCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  campTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '900',
  },
  campSubtitle: {
    color: '#E5E7EB',
    fontSize: 10.5,
    fontWeight: '600',
    lineHeight: 15,
    marginTop: 4,
    marginBottom: 10,
  },
  campAction: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900',
  }
});
