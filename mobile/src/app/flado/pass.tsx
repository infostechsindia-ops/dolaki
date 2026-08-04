import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface PassPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  savingsDesc: string;
  badge?: string;
}

const PLANS: PassPlan[] = [
  { id: 'monthly', name: 'Monthly Superpass', price: 39, period: '1 Month', savingsDesc: 'Saves ₹250/mo on avg' },
  { id: 'quarterly', name: 'Quarterly Valuepass', price: 99, period: '3 Months', savingsDesc: 'Saves ₹900/mo on avg', badge: 'Popular' },
  { id: 'annual', name: 'Annual VIP pass', price: 299, period: '1 Year', savingsDesc: 'Saves ₹4,200/yr on avg', badge: 'Best Value' }
];

export default function MobilePassScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string>('quarterly');
  const [isActivating, setIsActivating] = useState(false);
  const [isPassActive, setIsPassActive] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');

  // Simulating retrieval
  useEffect(() => {
    // In real app we use AsyncStorage. For mock we use simple states.
  }, []);

  const handleActivate = () => {
    setIsActivating(true);

    setTimeout(() => {
      const future = new Date();
      if (selectedPlan === 'monthly') future.setMonth(future.getMonth() + 1);
      else if (selectedPlan === 'quarterly') future.setMonth(future.getMonth() + 3);
      else future.setFullYear(future.getFullYear() + 1);

      const formatted = future.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      setIsPassActive(true);
      setExpiryDate(formatted);
      setIsActivating(false);
      Alert.alert('Welcome Elite! 🎉', 'Your Flado Pass is now active. Free shipping enabled.');
    }, 2000);
  };

  const handleCancel = () => {
    setIsPassActive(false);
    setExpiryDate('');
    Alert.alert('Subscription Cancelled', 'Your pass has been cancelled successfully.');
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
            Unlock unlimited free deliveries above ₹99 and extra discounts on top groceries.
          </Text>

          <View style={styles.divider} />

          <View style={styles.perksList}>
            <View style={styles.perkRow}>
              <Ionicons name="checkmark-circle" size={16} color="#A7F3D0" />
              <Text style={styles.perkText}>Unlimited FREE delivery on orders over ₹99</Text>
            </View>
            <View style={styles.perkRow}>
              <Ionicons name="star" size={16} color="#A7F3D0" />
              <Text style={styles.perkText}>Extra 5% discount on dairy, veggies & fruits</Text>
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
            
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelBtnText}>Cancel Membership</Text>
            </TouchableOpacity>
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
                      <View style={[styles.badge, { backgroundColor: plan.id === 'annual' ? '#EF4444' : '#059669' }]}>
                        <Text style={styles.badgeText}>{plan.badge}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.planDetails}>
                    <Text style={styles.planPrice}>₹{plan.price}</Text>
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
              Cancel anytime. Fees are simulated mock transactions deducted from wallet cash points.
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
    marginBottom: 10,
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
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1F2937',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  planDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F2937',
  },
  planDesc: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '700',
  },
  activateBtn: {
    backgroundColor: '#059669',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  activateBtnText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 13,
  },
  termsText: {
    fontSize: 9,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 14,
    fontWeight: '600',
  },
  activeCard: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    borderRadius: 16,
    margin: 16,
    padding: 24,
    alignItems: 'center',
  },
  activeTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#047857',
  },
  activeExpiry: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 20,
  },
  cancelBtn: {
    padding: 8,
  },
  cancelBtnText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '800',
    textDecorationLine: 'underline',
  }
});
