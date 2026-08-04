import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart, CartItem } from '../../context/CartContext';

const { width } = Dimensions.get('window');

export default function CartScreen() {
  const router = useRouter();
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    calculations, 
    rewardWalletBalance, 
    couponDiscount, 
    setCouponDiscount,
    selectedAddress 
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [walletApplied, setWalletApplied] = useState(false);

  const fladoItems = cart.filter(item => item.product.isFlado);
  const auraMartItems = cart.filter(item => !item.product.isFlado);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === 'AURA50') {
      setCouponDiscount(50);
      Alert.alert('Success', 'Flat ₹50 discount applied!');
      setPromoInput('');
    } else if (code === 'FLADO100') {
      setCouponDiscount(100);
      Alert.alert('Success', 'Flat ₹100 discount applied!');
      setPromoInput('');
    } else {
      Alert.alert('Invalid Code', 'Try AURA50 or FLADO100');
    }
  };

  const handleApplyWallet = () => {
    if (walletApplied) {
      setCouponDiscount(0);
      setWalletApplied(false);
    } else {
      if (rewardWalletBalance <= 0) {
        Alert.alert('No Balance', 'Play games in the Profile tab to win reward cash!');
        return;
      }
      // Apply maximum 10% of cart total or wallet balance, whichever is smaller
      const maxDiscount = Math.min(rewardWalletBalance, Math.round(calculations.subtotal * 0.1));
      if (maxDiscount === 0) {
        Alert.alert('Cart Empty', 'Add items to cart to apply reward cash');
        return;
      }
      setCouponDiscount(maxDiscount);
      setWalletApplied(true);
      Alert.alert('Wallet Cash Applied', `Applied ₹${maxDiscount} from your reward cash!`);
    }
  };

  const renderCartItem = (item: CartItem, colorTheme: string) => {
    return (
      <View key={item.itemId} style={styles.cartItemCard}>
        <Image source={{ uri: item.product.image || (item.product.images && item.product.images[0]) || '' }} style={styles.itemImage} />
        
        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
          <Text style={styles.itemCategory}>{item.product.category}</Text>
          
          {(item.selectedColor || item.selectedSize) && (
            <View style={styles.attributesRow}>
              {item.selectedColor && (
                <View style={styles.attributeTag}>
                  <Text style={styles.attributeText}>{item.selectedColor}</Text>
                </View>
              )}
              {item.selectedSize && (
                <View style={styles.attributeTag}>
                  <Text style={styles.attributeText}>Size {item.selectedSize}</Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.priceRow}>
            <Text style={styles.itemPrice}>₹{item.product.price * item.quantity}</Text>
            
            <View style={styles.qtyContainer}>
              <TouchableOpacity 
                style={[styles.qtyBtn, { backgroundColor: colorTheme }]}
                onPress={() => updateQuantity(item.itemId, item.quantity - 1)}
              >
                <Ionicons name="remove" size={14} color="white" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity 
                style={[styles.qtyBtn, { backgroundColor: colorTheme }]}
                onPress={() => updateQuantity(item.itemId, item.quantity + 1)}
              >
                <Ionicons name="add" size={14} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.deleteBtn}
          onPress={() => removeFromCart(item.itemId)}
        >
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    );
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color="#D1D5DB" />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>Explore products and add them to your cart to see them here.</Text>
        <TouchableOpacity 
          style={styles.shopBtn}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.shopBtnText}>Start Shopping</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Address Selection Header */}
        <View style={styles.addressSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="location" size={18} color="#8B5CF6" />
            <Text style={styles.addressLabel}>Shipping to:</Text>
          </View>
          <Text style={styles.addressText} numberOfLines={1}>{selectedAddress}</Text>
        </View>

        {/* SPLIT CART Section 1: Flado (Green) */}
        {fladoItems.length > 0 && (
          <View style={styles.splitSection}>
            <View style={[styles.splitHeader, styles.fladoSplitHeader]}>
              <View style={styles.splitHeaderLeft}>
                <Ionicons name="flash" size={18} color="#059669" />
                <Text style={[styles.splitTitle, { color: '#059669' }]}>Flado Quick Delivery (10 mins)</Text>
              </View>
              <Text style={styles.splitBadge}>⚡ 10 mins</Text>
            </View>
            <View style={styles.itemsWrapper}>
              {fladoItems.map(item => renderCartItem(item, '#059669'))}
            </View>
          </View>
        )}

        {/* SPLIT CART Section 2: AuraMart (Violet) */}
        {auraMartItems.length > 0 && (
          <View style={styles.splitSection}>
            <View style={[styles.splitHeader, styles.auramartSplitHeader]}>
              <View style={styles.splitHeaderLeft}>
                <MaterialCommunityIcons name="truck-delivery" size={18} color="#8B5CF6" />
                <Text style={[styles.splitTitle, { color: '#8B5CF6' }]}>AuraMart Standard Delivery</Text>
              </View>
              <Text style={styles.splitBadge}>🚚 2-3 days</Text>
            </View>
            <View style={styles.itemsWrapper}>
              {auraMartItems.map(item => renderCartItem(item, '#8B5CF6'))}
            </View>
          </View>
        )}

        {/* Reward Wallet Offer / Promo Apply */}
        <View style={styles.promoSection}>
          <Text style={styles.promoSectionTitle}>Offers & Discounts</Text>
          
          {/* Reward Wallet Applied */}
          <TouchableOpacity 
            style={[styles.walletApplyCard, walletApplied && styles.walletAppliedCard]}
            onPress={handleApplyWallet}
          >
            <View style={styles.walletLeft}>
              <Ionicons name="wallet" size={24} color="#8B5CF6" />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.walletTitle}>Reward Cash Wallet</Text>
                <Text style={styles.walletBal}>Available Balance: ₹{rewardWalletBalance}</Text>
              </View>
            </View>
            <Text style={[styles.walletApplyBtnText, walletApplied && { color: '#EF4444' }]}>
              {walletApplied ? 'REMOVE' : 'APPLY 10%'}
            </Text>
          </TouchableOpacity>

          {/* Coupon Code Input */}
          <View style={styles.promoInputRow}>
            <TextInput
              style={styles.promoInput}
              placeholder="Enter Coupon (e.g. AURA50)"
              placeholderTextColor="#9CA3AF"
              value={promoInput}
              onChangeText={setPromoInput}
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.promoBtn} onPress={handleApplyPromo}>
              <Text style={styles.promoBtnText}>APPLY</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.promoHint}>Use AURA50 (Save ₹50) or FLADO100 (Save ₹100)</Text>
        </View>

        {/* Bill Summary */}
        <View style={styles.billSection}>
          <Text style={styles.billSectionTitle}>Bill Summary</Text>
          
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>AuraMart Subtotal</Text>
            <Text style={styles.billValue}>₹{calculations.auraMartSubtotal}</Text>
          </View>
          {calculations.fladoSubtotal > 0 && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Flado Subtotal</Text>
              <Text style={styles.billValue}>₹{calculations.fladoSubtotal}</Text>
            </View>
          )}
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>GST (18% rate)</Text>
            <Text style={styles.billValue}>₹{calculations.gst}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fees</Text>
            <Text style={styles.billValue}>
              {calculations.deliveryFee === 0 ? 'FREE' : `₹${calculations.deliveryFee}`}
            </Text>
          </View>
          
          {couponDiscount > 0 && (
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: '#059669' }]}>Discounts Applied</Text>
              <Text style={[styles.billValue, { color: '#059669' }]}>-₹{couponDiscount}</Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={[styles.billRow, { marginTop: 8 }]}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>₹{calculations.total}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button Footer */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.footerTotalLabel}>PAYABLE</Text>
          <Text style={styles.footerTotalValue}>₹{calculations.total}</Text>
        </View>
        <TouchableOpacity 
          style={styles.checkoutBtn}
          onPress={() => router.push('/checkout')}
        >
          <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
          <Ionicons name="arrow-forward" size={18} color="white" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  addressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  addressLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginLeft: 4,
  },
  addressText: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
    textAlign: 'right',
  },
  splitSection: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  splitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  fladoSplitHeader: {
    backgroundColor: '#ECFDF5',
  },
  auramartSplitHeader: {
    backgroundColor: '#F5F3FF',
  },
  splitHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  splitTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  splitBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  itemsWrapper: {
    paddingHorizontal: 16,
  },
  cartItemCard: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  itemCategory: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  attributesRow: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 6,
  },
  attributeTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  attributeText: {
    fontSize: 10,
    color: '#4B5563',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  deleteBtn: {
    padding: 6,
    justifyContent: 'center',
  },
  promoSection: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  promoSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  walletApplyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  walletAppliedCard: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F5F3FF',
  },
  walletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  walletBal: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  walletApplyBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  promoInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    height: 40,
    backgroundColor: '#F9FAFB',
  },
  promoBtn: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  promoBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  promoHint: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 6,
  },
  billSection: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  billSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  billLabel: {
    fontSize: 13,
    color: '#4B5563',
  },
  billValue: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  grandTotalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalContainer: {
    justifyContent: 'center',
  },
  footerTotalLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  footerTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  checkoutBtn: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  checkoutBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#FFFFFF',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
  },
  shopBtn: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shopBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
