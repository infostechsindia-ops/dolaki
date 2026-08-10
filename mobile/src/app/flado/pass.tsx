import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../utils/api';

interface PassPlan {
  id: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  name: string;
  price: string;
  period: string;
  savingsDesc: string;
  badge?: string;
}

const PLANS: PassPlan[] = [
  { id: 'MONTHLY', name: 'Monthly Superpass', price: '$3.99', period: '1 Month', savingsDesc: 'Saves $15.00/mo on avg' },
  { id: 'QUARTERLY', name: 'Quarterly Valuepass', price: '$9.99', period: '3 Months', savingsDesc: 'Saves $45.00/mo on avg', badge: 'Popular' },
  { id: 'ANNUAL', name: 'Annual VIP Pass', price: '$29.99', period: '1 Year', savingsDesc: 'Saves $180.00/yr on avg', badge: 'Best Value' }
];

export default function MobilePassScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'MONTHLY' | 'QUARTERLY' | 'ANNUAL'>('QUARTERLY');
  const [isActivating, setIsActivating] = useState(false);
  const [isPassActive, setIsPassActive] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);

  const fetchStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('aura_token');
      if (!token) return;

      const res = await fetch(`${BASE_URL}/flado/vip/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setIsPassActive(data.isVip);
        if (data.isVip && data.expiresAt) {
          const date = new Date(data.expiresAt);
          setExpiryDate(date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }));
          setCancelAtPeriodEnd(!!data.cancelAtPeriodEnd);
        }
      }
    } catch {
      // Fallback ignore
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleActivate = async () => {
    const token = await AsyncStorage.getItem('aura_token');
    if (!token) {
      Alert.alert('Authentication Required', 'Please log in to activate Flado Pass.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log In', onPress: () => router.push('/auth') },
      ]);
      return;
    }

    setIsActivating(true);

    try {
      // 1. Initiate Subscription
      const subRes = await fetch(`${BASE_URL}/flado/vip/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Idempotency-Key': `idemp-mobile-pass-${Date.now()}`
        },
        body: JSON.stringify({ plan: selectedPlan })
      });

      if (!subRes.ok) {
        const err = await subRes.json();
        throw new Error(err.message || 'Failed to initiate subscription');
      }

      const subData = await subRes.json();

      // 2. Confirm Payment & Activate
      const confirmRes = await fetch(`${BASE_URL}/flado/vip/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ subscriptionId: subData.subscription.id })
      });

      if (!confirmRes.ok) {
        const err = await confirmRes.json();
        throw new Error(err.message || 'Failed to confirm payment');
      }

      const activeSub = await confirmRes.json();
      setIsPassActive(true);
      if (activeSub.expiresAt) {
        const date = new Date(activeSub.expiresAt);
        setExpiryDate(date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }));
      }

      Alert.alert('Welcome Elite! 🎉', 'Your Flado Pass is now active. Free 10-minute delivery and waived handling fees enabled.');
    } catch (err: any) {
      Alert.alert('Activation Failed', err.message || 'Unable to activate Flado Pass.');
    } finally {
      setIsActivating(false);
    }
  };

  const handleCancel = async () => {
    const token = await AsyncStorage.getItem('aura_token');
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/flado/vip/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setCancelAtPeriodEnd(true);
        Alert.alert('Subscription Cancelled', 'Your VIP renewal has been cancelled. Benefits remain active until expiry date.');
      } else {
        const err = await res.json();
        Alert.alert('Cancellation Failed', err.message || 'Failed to cancel subscription.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to cancel subscription.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>👑 Flado Pass Elite</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Intro Banner */}
        <View style={styles.introCard}>
          <View style={styles.crownWrapper}>
            <Ionicons name="ribbon" size={24} color="white" />
          </View>
          <Text style={styles.introTitle}>Join Flado Pass Elite</Text>
          <Text style={styles.introSubtitle}>
            Unlock unlimited free 10-minute deliveries above $5.00 and waived cold-chain handling fees.
          </Text>

          <View style={styles.divider} />

          <View style={styles.perksList}>
            <View style={styles.perkRow}>
              <Ionicons name="checkmark-circle" size={16} color="#A7F3D0" />
              <Text style={styles.perkText}>Unlimited FREE delivery on orders over $5.00</Text>
            </View>
            <View style={styles.perkRow}>
              <Ionicons name="star" size={16} color="#A7F3D0" />
              <Text style={styles.perkText}>100% Waived handling and packaging fees</Text>
            </View>
            <View style={styles.perkRow}>
              <Ionicons name="flash" size={16} color="#A7F3D0" />
              <Text style={styles.perkText}>Priority dispatches & speed rider match</Text>
            </View>
          </View>
        </View>

        {isPassActive ? (
          /* Active Card */
          <View style={styles.activeCard}>
            <Ionicons name="sparkles" size={32} color="#047857" style={{ marginBottom: 12 }} />
            <Text style={styles.activeTitle}>Active Pass Member</Text>
            <Text style={styles.activeExpiry}>Valid until: {expiryDate}</Text>

            {cancelAtPeriodEnd ? (
              <Text style={{ fontSize: 12, color: '#92400E', marginTop: 8, textAlign: 'center' }}>
                Cancellation requested. Benefits active until {expiryDate}.
              </Text>
            ) : (
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                <Text style={styles.cancelBtnText}>Cancel Membership Renewal</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          /* Plan Picker */
          <View style={styles.plansSection}>
            <Text style={styles.sectionTitle}>Choose Plan Duration</Text>
            
            {PLANS.map(plan => {
              const isSelected = selectedPlan === plan.id;
              return (
                <TouchableOpacity
                  key={plan.id}
                  style={[styles.planBtn, isSelected && styles.planBtnActive]}
                  onPress={() => setSelectedPlan(plan.id)}
                >
                  <View style={styles.planHeader}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    {plan.badge && (
                      <View style={[styles.badge, { backgroundColor: plan.id === 'ANNUAL' ? '#EF4444' : '#059669' }]}>
                        <Text style={styles.badgeText}>{plan.badge}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.planDetails}>
                    <Text style={styles.planPrice}>{plan.price}</Text>
                    <Text style={styles.planDesc}>{plan.savingsDesc}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            {isActivating ? (
              <ActivityIndicator size="large" color="#059669" style={{ marginTop: 20 }} />
            ) : (
              <TouchableOpacity style={styles.activateBtn} onPress={handleActivate}>
                <Text style={styles.activateBtnText}>Activate Pass Now</Text>
                <Ionicons name="arrow-forward" size={14} color="white" />
              </TouchableOpacity>
            )}

            <Text style={styles.termsText}>
              Authoritative server subscription. Cancel anytime. Terms apply.
            </Text>
          </View>
        )}
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
  scrollContent: {
    paddingBottom: 40,
  },
  introCard: {
    backgroundColor: '#064E3B',
    borderRadius: 16,
    margin: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  crownWrapper: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: 'white',
  },
  introSubtitle: {
    fontSize: 11.5,
    color: '#A7F3D0',
    lineHeight: 18,
    fontWeight: '600',
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 16,
  },
  perksList: {
    gap: 12,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  perkText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
  },
  plansSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 12,
  },
  planBtn: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  planBtnActive: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  planPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: '#064E3B',
  },
  planDesc: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  activateBtn: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  activateBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 12,
  },
  activeCard: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    borderRadius: 16,
    margin: 16,
    padding: 24,
    alignItems: 'center',
  },
  activeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#065F46',
  },
  activeExpiry: {
    fontSize: 13,
    color: '#047857',
    marginTop: 4,
    marginBottom: 16,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  cancelBtnText: {
    color: '#991B1B',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
