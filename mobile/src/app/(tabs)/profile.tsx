import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Modal, Animated, TextInput, Alert, Dimensions, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCart } from '../../context/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const SPIN_ITEMS = [
  { text: '50 Coins', value: 50 },
  { text: 'Try Again', value: 0 },
  { text: '250 Coins', value: 250 },
  { text: 'Better Luck', value: 0 },
  { text: '100 Coins', value: 100 },
  { text: '500 Coins', value: 500 },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { 
    rewardWalletBalance, 
    creditRewardWallet, 
    addresses, 
    addAddress, 
    orders 
  } = useCart();

  // Active section for modal display
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<{name: string; email: string} | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const checkAuth = async () => {
        const token = await AsyncStorage.getItem('aura_token');
        const user = await AsyncStorage.getItem('aura_user');
        if (token && user) {
          setIsLoggedIn(true);
          setUserProfile(JSON.parse(user));
        } else {
          setIsLoggedIn(false);
          setUserProfile(null);
        }
      };
      checkAuth();
    }, [])
  );

  // Address form
  const [newAddr, setNewAddr] = useState('');

  // Spin Wheel Game State
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const spinAnim = useRef(new Animated.Value(0)).current;

  // Scratch Card Game State
  const [scratched, setScratched] = useState(false);
  const [scratchResult, setScratchResult] = useState<{ code: string; text: string } | null>(null);

  // Refer & Earn state
  const referralCode = 'AURA-ARIF2025';

  // Settings states
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);

  // FAQ support list
  const faqs = [
    { q: 'How long does Flado delivery take?', a: 'Flado is our instant quick commerce service. It delivers fresh groceries and essentials under 10 minutes directly from our nearest micro-warehouse darkstore.' },
    { q: 'What are AuraCoins?', a: 'AuraCoins are our loyalty currency. 10 AuraCoins = ₹1 Wallet cash. They apply dynamically at checkout for discounts.' },
    { q: 'How do I request returns?', a: 'Returns are picked up free within 24 hours of filing a request. You can request returns under the Returns tab.' }
  ];

  // Add Address Handler
  const handleAddAddress = () => {
    if (!newAddr.trim()) {
      Alert.alert('Error', 'Please enter a valid address');
      return;
    }
    addAddress(newAddr.trim());
    setNewAddr('');
    Alert.alert('Success', 'Address saved successfully!');
  };

  // Spin Wheel Trigger
  const handleSpinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setSpinResult(null);

    const randomIndex = Math.floor(Math.random() * SPIN_ITEMS.length);
    const degreesToIndex = 360 - (randomIndex * (360 / SPIN_ITEMS.length));
    const totalSpinDegrees = 5 * 360 + degreesToIndex;

    spinAnim.setValue(0);
    Animated.timing(spinAnim, {
      toValue: totalSpinDegrees,
      duration: 3000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setSpinning(false);
      const won = SPIN_ITEMS[randomIndex];
      if (won.value > 0) {
        creditRewardWallet(won.value / 10); // convert coins to wallet balance
        setSpinResult(`🎉 Congratulations! You won ${won.text} credited as ₹${won.value / 10} to your wallet!`);
      } else {
        setSpinResult(`Oops! ${won.text}. Try again next time.`);
      }
    });
  };

  const handleScratchReveal = () => {
    if (scratched) return;
    setScratched(true);
    const rewardsList = [
      { code: 'AURA50', text: '₹50 OFF coupon code!' },
      { code: 'FLADO100', text: '₹100 OFF coupon code!' },
      { code: 'CASH25', text: '₹25 Wallet Cash credited!' },
    ];
    const chosen = rewardsList[Math.floor(Math.random() * rewardsList.length)];
    setScratchResult(chosen);
    if (chosen.code === 'CASH25') {
      creditRewardWallet(25);
    }
  };

  const rotateWheel = spinAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const renderMenuItem = (icon: string, label: string, modalKey: string, provider: 'ionicons' | 'material' = 'ionicons') => (
    <TouchableOpacity 
      style={styles.menuRow} 
      onPress={() => {
        if (modalKey === 'flado-pass') {
          router.push('/flado/pass');
        } else if (modalKey === 'flado-stores') {
          router.push('/flado/stores');
        } else if (modalKey === 'flado-vendor') {
          router.push('/flado/vendor');
        } else if (modalKey === 'flado-admin') {
          router.push('/flado/admin');
        } else if (modalKey === 'orders') {
          router.push('/orders');
        } else if (modalKey === 'addresses') {
          router.push('/account/addresses');
        } else if (modalKey === 'wallet') {
          router.push('/account/wallet');
        } else if (modalKey === 'settings' || modalKey === 'notifications') {
          router.push('/account/notifications');
        } else {
          setActiveModal(modalKey);
        }
      }}
    >
      <View style={styles.menuRowLeft}>
        {provider === 'ionicons' ? (
          <Ionicons name={icon as any} size={18} color="#4B5563" style={styles.menuIcon} />
        ) : (
          <MaterialCommunityIcons name={icon as any} size={18} color="#4B5563" style={styles.menuIcon} />
        )}
        <Text style={styles.menuRowLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Card Header */}
        <View style={styles.profileHeader}>
          {isLoggedIn ? (
            <>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{userProfile?.name?.substring(0, 2).toUpperCase() || 'U'}</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userProfile?.name || 'User'}</Text>
                <Text style={styles.profileEmail}>{userProfile?.email || ''}</Text>
                <View style={styles.tierContainer}>
                  <Text style={styles.tierText}>✨ Aura Platinum</Text>
                </View>
              </View>
            </>
          ) : (
            <View style={[styles.profileInfo, { alignItems: 'center', paddingVertical: 10 }]}>
              <Text style={[styles.profileName, { marginBottom: 10 }]}>Welcome to AuraMart</Text>
              <TouchableOpacity style={{ backgroundColor: '#10B981', paddingHorizontal: 30, paddingVertical: 10, borderRadius: 8 }} onPress={() => router.push('/auth')}>
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Login / Register</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Wallet balance and Coins summary */}
        <View style={styles.walletCoinsRow}>
          <View style={styles.walletCard}>
            <Text style={styles.cardHeaderSmall}>AuraPay Cash</Text>
            <Text style={styles.cardVal}>₹{rewardWalletBalance + 1250}</Text>
          </View>
          <View style={styles.coinsCard}>
            <Text style={styles.cardHeaderSmall}>AuraCoins</Text>
            <Text style={styles.cardVal}>🪙 1,280</Text>
          </View>
        </View>

        {/* Group 1: My Shopping */}
        <View style={styles.menuGroup}>
          <Text style={styles.groupHeader}>My Shopping</Text>
          {renderMenuItem('receipt-outline', 'Order History', 'orders')}
          {renderMenuItem('heart-outline', 'My Wishlist', 'wishlist')}
          {renderMenuItem('refresh-outline', 'Returns & Refunds', 'returns')}
        </View>

        {/* Group Flado: Quick Commerce */}
        <View style={styles.menuGroup}>
          <Text style={styles.groupHeader}>Flado Quick Commerce</Text>
          {renderMenuItem('ribbon-outline', 'Flado Pass Membership', 'flado-pass')}
          {renderMenuItem('location-outline', 'Nearby Partner Grocery Shops', 'flado-stores')}
        </View>

        {/* Group 2: Account Details */}
        <View style={styles.menuGroup}>
          <Text style={styles.groupHeader}>Account Settings</Text>
          {renderMenuItem('location-outline', 'Saved Addresses', 'addresses')}
          {renderMenuItem('wallet-outline', 'My Wallet', 'wallet')}
          {renderMenuItem('card-outline', 'Payment Methods', 'payment')}
          {renderMenuItem('notifications-outline', 'Notification Settings', 'settings')}
        </View>

        {/* Group 3: Games & Referrals */}
        <View style={styles.menuGroup}>
          <Text style={styles.groupHeader}>Arcade & Referrals</Text>
          {renderMenuItem('aperture-outline', 'Aura Arcade (Games)', 'arcade')}
          {renderMenuItem('share-social-outline', 'Refer & Earn', 'refer')}
        </View>

        {/* Group 4: Support */}
        <View style={styles.menuGroup}>
          <Text style={styles.groupHeader}>Support</Text>
          {renderMenuItem('help-circle-outline', 'Help & Support', 'help')}
          {renderMenuItem('information-circle-outline', 'About AuraMart', 'about')}
        </View>

        {/* Log out button */}
        {isLoggedIn && (
          <TouchableOpacity 
            style={styles.logoutBtn} 
            onPress={() => Alert.alert('Log Out', 'Are you sure you want to log out?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Log Out', onPress: async () => {
                  await AsyncStorage.removeItem('aura_token');
                  await AsyncStorage.removeItem('aura_user');
                  setIsLoggedIn(false);
                  setUserProfile(null);
                  Alert.alert('Success', 'Logged out successfully');
              }}
            ])}
          >
            <Ionicons name="log-out-outline" size={18} color="#EF4444" style={{ marginRight: 8 }} />
            <Text style={styles.logoutBtnText}>Log Out</Text>
          </TouchableOpacity>
        )}

        {/* Merchant & Partner Center link */}
        <TouchableOpacity 
          style={{ marginTop: 24, marginBottom: 30, alignItems: 'center' }}
          onPress={() => Alert.alert(
            'Flado Business Center',
            'Select Portal:',
            [
              { text: '🏪 Flado Shop Owner Portal', onPress: () => router.push('/flado/vendor') },
              { text: '🛡️ Flado Operations Admin', onPress: () => router.push('/flado/admin') },
              { text: 'Cancel', style: 'cancel' }
            ]
          )}
        >
          <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '700' }}>
            Are you a local shop owner? <Text style={{ color: '#059669', fontWeight: '800' }}>Partner Portal Login →</Text>
          </Text>
        </TouchableOpacity>

      </ScrollView>

      {/* DYNAMIC MODALS HUB */}

      {/* 1. ORDERS HISTORY MODAL */}
      <Modal visible={activeModal === 'orders'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setActiveModal(null)}>
              <Ionicons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Order History</Text>
            
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {orders.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Ionicons name="receipt-outline" size={32} color="#9CA3AF" />
                  <Text style={styles.emptyText}>No past orders found.</Text>
                </View>
              ) : (
                orders.map(order => (
                  <View key={order.id} style={styles.orderCard}>
                    <View style={styles.orderCardHeader}>
                      <Text style={styles.orderCardId}>#{order.id}</Text>
                      <Text style={styles.orderCardDate}>{order.date}</Text>
                    </View>
                    <Text style={styles.orderCardTotal}>Total Paid: ₹{order.total}</Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 2. WISHLIST MODAL */}
      <Modal visible={activeModal === 'wishlist'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setActiveModal(null)}>
              <Ionicons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>My Wishlist</Text>
            
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {[
                { id: 'ele-1', name: 'AuraPods Pro ANC Earbuds', price: '₹8,999' },
                { id: 'gro-4', name: 'Hass Avocados (2 Pcs)', price: '₹299' }
              ].map(item => (
                <View key={item.id} style={styles.wishlistRow}>
                  <Text style={styles.wishlistName}>{item.name}</Text>
                  <Text style={styles.wishlistPrice}>{item.price}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 3. RETURNS MODAL */}
      <Modal visible={activeModal === 'returns'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setActiveModal(null)}>
              <Ionicons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Returns & Refunds</Text>
            <Text style={styles.modalSubtitle}>Current filings and requests</Text>
            
            <View style={styles.returnRow}>
              <Text style={styles.returnId}>Return ID: RET-831</Text>
              <Text style={styles.returnStatus}>Pickup Completed</Text>
            </View>
            <Text style={styles.returnDesc}>Refund of ₹2,499 will be credited to AuraPay Wallet within 24 hours.</Text>
          </View>
        </View>
      </Modal>

      {/* 4. ADDRESSES MODAL */}
      <Modal visible={activeModal === 'addresses'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setActiveModal(null)}>
              <Ionicons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Saved Addresses</Text>
            
            <View style={styles.addressForm}>
              <TextInput 
                style={styles.addressInput} 
                placeholder="Enter new address..." 
                value={newAddr} 
                onChangeText={setNewAddr} 
              />
              <TouchableOpacity style={styles.saveAddressBtn} onPress={handleAddAddress}>
                <Text style={styles.saveAddressBtnText}>Save Address</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {addresses.map((addr, i) => (
                <View key={i} style={styles.addressItem}>
                  <Ionicons name="location" size={16} color="#8B5CF6" />
                  <Text style={styles.addressText}>{addr}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 5. PAYMENT METHODS MODAL */}
      <Modal visible={activeModal === 'payment'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setActiveModal(null)}>
              <Ionicons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Saved Payment Modes</Text>
            
            <View style={styles.paymentCard}>
              <Ionicons name="card" size={20} color="#4B5563" />
              <Text style={styles.paymentCardText}>HDFC Credit Card (ending 4522)</Text>
            </View>
            <View style={styles.paymentCard}>
              <Ionicons name="card" size={20} color="#4B5563" />
              <Text style={styles.paymentCardText}>ICICI Debit Card (ending 8901)</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* 6. NOTIFICATION SETTINGS MODAL */}
      <Modal visible={activeModal === 'settings'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setActiveModal(null)}>
              <Ionicons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Notification Settings</Text>
            
            <TouchableOpacity 
              style={styles.toggleRow} 
              onPress={() => setEmailEnabled(!emailEnabled)}
            >
              <Text style={styles.toggleText}>Email Alerts</Text>
              <Ionicons 
                name={emailEnabled ? "checkbox" : "square-outline"} 
                size={22} 
                color="#8B5CF6" 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.toggleRow} 
              onPress={() => setPushEnabled(!pushEnabled)}
            >
              <Text style={styles.toggleText}>Push Notifications</Text>
              <Ionicons 
                name={pushEnabled ? "checkbox" : "square-outline"} 
                size={22} 
                color="#8B5CF6" 
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 7. ARCADE GAMES MODAL */}
      <Modal visible={activeModal === 'arcade'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setActiveModal(null)}>
              <Ionicons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Aura Arcade Wheel</Text>
            <Text style={styles.modalSubtitle}>Spin the wheel to win AuraCoins</Text>

            <View style={styles.wheelContainer}>
              <Animated.View style={[styles.wheel, { transform: [{ rotate: rotateWheel }] }]}>
                {SPIN_ITEMS.map((item, index) => {
                  const rotation = index * (360 / SPIN_ITEMS.length);
                  return (
                    <View 
                      key={index} 
                      style={[
                        styles.wheelSlice, 
                        { transform: [{ rotate: `${rotation}deg` }] },
                        index % 2 === 0 ? styles.wheelSliceEven : styles.wheelSliceOdd
                      ]}
                    >
                      <Text style={styles.wheelSliceText}>{item.text}</Text>
                    </View>
                  );
                })}
              </Animated.View>
              <View style={styles.wheelIndicator} />
            </View>

            <TouchableOpacity 
              style={[styles.spinBtn, spinning && styles.spinBtnDisabled]}
              onPress={handleSpinWheel}
              disabled={spinning}
            >
              <Text style={styles.spinBtnText}>{spinning ? 'SPINNING...' : 'SPIN WHEEL'}</Text>
            </TouchableOpacity>

            {spinResult && (
              <View style={styles.resultBox}>
                <Text style={styles.resultText}>{spinResult}</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* 8. REFER & EARN MODAL */}
      <Modal visible={activeModal === 'refer'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setActiveModal(null)}>
              <Ionicons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Refer & Earn</Text>
            <Text style={styles.modalSubtitle}>Earn ₹200 for each friend referral</Text>
            
            <View style={styles.referCodeCard}>
              <Text style={styles.referLabel}>Your Referral Code</Text>
              <Text style={styles.referCode}>{referralCode}</Text>
              <TouchableOpacity 
                style={styles.copyBtn}
                onPress={() => {
                  Alert.alert('Copied!', 'Referral code copied to clipboard.');
                }}
              >
                <Text style={styles.copyBtnText}>Copy Link</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 9. HELP & SUPPORT MODAL */}
      <Modal visible={activeModal === 'help'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setActiveModal(null)}>
              <Ionicons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Help & Support FAQ</Text>
            
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {faqs.map((faq, i) => (
                <View key={i} style={styles.faqCard}>
                  <Text style={styles.faqQ}>{faq.q}</Text>
                  <Text style={styles.faqA}>{faq.a}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 10. ABOUT AURAMART MODAL */}
      <Modal visible={activeModal === 'about'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setActiveModal(null)}>
              <Ionicons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>About AuraMart</Text>
            <Text style={styles.modalSubtitle}>Version 2.4.0 (Production)</Text>
            
            <Text style={styles.aboutText}>
              AuraMart is India's leading unified e-commerce platform, integrating superfast 10-minute grocery delivery via Flado and express shipping via AuraMart catalog stores.
            </Text>
            <Text style={styles.copyright}>© 2026 AuraMart Networks Inc.</Text>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  profileEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  tierContainer: {
    backgroundColor: '#F5F3FF',
    borderColor: '#C084FC',
    borderWidth: 0.5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  tierText: {
    fontSize: 10,
    color: '#7C3AED',
    fontWeight: 'bold',
  },
  walletCoinsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  walletCard: {
    flex: 1,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    padding: 14,
  },
  coinsCard: {
    flex: 1,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 14,
  },
  cardHeaderSmall: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
  },
  cardVal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 4,
  },
  menuGroup: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 6,
  },
  groupHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingVertical: 8,
    letterSpacing: 0.5,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F4F6',
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuRowLabel: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 24,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutBtnText: {
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Modals framework
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: width - 40,
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  closeModalBtn: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalScroll: {
    marginTop: 10,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 8,
  },

  // Order item card inside modal
  orderCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  orderCardId: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  orderCardDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  orderCardTotal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },

  // Wishlist rows
  wishlistRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  wishlistName: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '600',
    flex: 1,
  },
  wishlistPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },

  // Return tracker
  returnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
  },
  returnId: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  returnStatus: {
    color: '#059669',
    fontWeight: 'bold',
    fontSize: 12,
  },
  returnDesc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
    marginTop: 8,
  },

  // Address form modal
  addressForm: {
    marginBottom: 16,
    gap: 8,
  },
  addressInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 10,
    borderRadius: 8,
    fontSize: 13,
  },
  saveAddressBtn: {
    backgroundColor: '#8B5CF6',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveAddressBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 13,
  },
  addressItem: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F4F6',
  },
  addressText: {
    fontSize: 13,
    color: '#4B5563',
    flex: 1,
  },

  // Payments
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  paymentCardText: {
    fontSize: 13,
    color: '#1F2937',
  },

  // Settings
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F4F6',
  },
  toggleText: {
    fontSize: 14,
    color: '#1F2937',
  },

  // Spin wheel Arcade
  wheelContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    alignSelf: 'center',
  },
  wheel: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#1E293B',
    overflow: 'hidden',
    position: 'relative',
  },
  wheelSlice: {
    position: 'absolute',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelSliceEven: {
    backgroundColor: '#8B5CF6',
  },
  wheelSliceOdd: {
    backgroundColor: '#6D28D9',
  },
  wheelSliceText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    transform: [{ translateY: -50 }],
  },
  wheelIndicator: {
    position: 'absolute',
    top: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderLeftColor: 'transparent',
    borderRightWidth: 8,
    borderRightColor: 'transparent',
    borderTopWidth: 16,
    borderTopColor: '#EF4444',
  },
  spinBtn: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  spinBtnDisabled: {
    backgroundColor: '#C084FC',
  },
  spinBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 13,
  },
  resultBox: {
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 8,
  },
  resultText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '600',
  },

  // Referrals
  referCodeCard: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  referLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  referCode: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#1E293B',
    marginBottom: 16,
  },
  copyBtn: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  copyBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },

  // Help & Support faq
  faqCard: {
    marginBottom: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 10,
  },
  faqQ: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  faqA: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
  },

  // About info
  aboutText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  copyright: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 20,
  },
});
