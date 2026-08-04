import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Alert, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../context/CartContext';

const { width, height } = Dimensions.get('window');

type PaymentMethod = 'upi' | 'card' | 'wallet' | 'cod';

export default function CheckoutScreen() {
  const router = useRouter();
  const { 
    cart, 
    calculations, 
    addresses, 
    selectedAddress, 
    setSelectedAddress, 
    placeOrder, 
    rewardWalletBalance, 
    deductRewardWallet 
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [razorpayStatus, setRazorpayStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [placedOrderId, setPlacedOrderId] = useState<string>('');
  const [fladoSlot, setFladoSlot] = useState<'asap' | 'scheduled'>('asap');
  const [riderTip, setRiderTip] = useState(0);

  const isFladoOnly = cart.every(item => item.product.isFlado);

  const codFee = paymentMethod === 'cod' ? Math.min(Math.round(calculations.total * 0.01), 10) : 0;
  const totalPayable = calculations.total + riderTip + codFee;

  const handlePayment = async () => {
    // If wallet option is chosen, verify balance
    if (paymentMethod === 'wallet' && rewardWalletBalance < totalPayable) {
      Alert.alert('Insufficient Balance', 'Your reward wallet cash is lower than the payable amount. Please select UPI or Card.');
      return;
    }

    setShowRazorpay(true);
    setRazorpayStatus('processing');

    // Simulate payment gateway delay (2.5 seconds)
    setTimeout(async () => {
      try {
        // Place the order in Context order history and clear cart
        const orderId = await placeOrder();
        setPlacedOrderId(orderId);

        // Deduct from reward wallet if selected
        if (paymentMethod === 'wallet') {
          deductRewardWallet(totalPayable);
        }

        setRazorpayStatus('success');

        // Redirect to tracking page after showing success animation
        setTimeout(() => {
          setShowRazorpay(false);
          router.replace(`/tracking/${orderId}`);
        }, 2000);
      } catch (error) {
        setRazorpayStatus('failed');
        console.error(error);
      }
    }, 2500);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Step 1: Address Picker */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>1. Select Delivery Address</Text>
          <View style={styles.addressesContainer}>
            {addresses.map((addr, idx) => {
              const isSelected = selectedAddress === addr;
              return (
                <TouchableOpacity 
                  key={idx}
                  style={[styles.addressOption, isSelected && styles.selectedAddressOption]}
                  onPress={() => setSelectedAddress(addr)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.radioButton, isSelected && styles.radioButtonSelected]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.addressText}>{addr}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Step 1B: Choose Delivery Speed (Flado items only) */}
        {cart.some(item => item.product.isFlado) && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>1.5 Choose Delivery Time Slot</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 4 }}>
              <TouchableOpacity
                style={[styles.slotOptionBtn, fladoSlot === 'asap' && styles.slotOptionBtnActive]}
                onPress={() => setFladoSlot('asap')}
              >
                <Text style={[styles.slotOptionText, fladoSlot === 'asap' && styles.slotOptionTextActive]}>⚡ ASAP (10 min)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.slotOptionBtn, fladoSlot === 'scheduled' && styles.slotOptionBtnActive]}
                onPress={() => setFladoSlot('scheduled')}
              >
                <Text style={[styles.slotOptionText, fladoSlot === 'scheduled' && styles.slotOptionTextActive]}>📅 Tomorrow Morning</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Step 1C: Delivery Partner Tip Selection */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>1.6 Support Delivery Partner Tip</Text>
          <Text style={{ fontSize: 11, color: '#6B7280', marginBottom: 10, fontWeight: '600' }}>
            100% of tips go directly to the rider. Show appreciation for their fast service.
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {[0, 10, 20, 30].map(tip => (
              <TouchableOpacity
                key={tip}
                style={[styles.tipBtn, riderTip === tip && styles.tipBtnActive]}
                onPress={() => setRiderTip(tip)}
              >
                <Text style={[styles.tipBtnText, riderTip === tip && styles.tipBtnTextActive]}>
                  {tip === 0 ? 'No Tip' : `₹${tip}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Step 2: Payment Method */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>2. Choose Payment Method</Text>
          
          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'upi' && styles.selectedPaymentOption]}
            onPress={() => setPaymentMethod('upi')}
          >
            <Ionicons name="logo-bitcoin" size={22} color="#059669" />
            <View style={styles.paymentTextCol}>
              <Text style={styles.paymentName}>Razorpay UPI (Google Pay, PhonePe)</Text>
              <Text style={styles.paymentDesc}>Pay securely via instant mobile UPI</Text>
            </View>
            <View style={[styles.radioButton, paymentMethod === 'upi' && styles.radioButtonSelected]}>
              {paymentMethod === 'upi' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'card' && styles.selectedPaymentOption]}
            onPress={() => setPaymentMethod('card')}
          >
            <Ionicons name="card" size={22} color="#8B5CF6" />
            <View style={styles.paymentTextCol}>
              <Text style={styles.paymentName}>Razorpay Card (Visa, MasterCard, RuPay)</Text>
              <Text style={styles.paymentDesc}>Credit/Debit cards processed securely</Text>
            </View>
            <View style={[styles.radioButton, paymentMethod === 'card' && styles.radioButtonSelected]}>
              {paymentMethod === 'card' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'wallet' && styles.selectedPaymentOption]}
            onPress={() => setPaymentMethod('wallet')}
          >
            <Ionicons name="wallet" size={22} color="#D97706" />
            <View style={styles.paymentTextCol}>
              <Text style={styles.paymentName}>Use Reward Wallet Balance (₹{rewardWalletBalance})</Text>
              <Text style={styles.paymentDesc}>Deduct directly from earned arcade cash</Text>
            </View>
            <View style={[styles.radioButton, paymentMethod === 'wallet' && styles.radioButtonSelected]}>
              {paymentMethod === 'wallet' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'cod' && styles.selectedPaymentOption]}
            onPress={() => setPaymentMethod('cod')}
          >
            <Ionicons name="cash-outline" size={22} color="#6B7280" />
            <View style={styles.paymentTextCol}>
              <Text style={styles.paymentName}>Cash on Delivery (COD)</Text>
              <Text style={styles.paymentDesc}>Pay cash when your order arrives</Text>
            </View>
            <View style={[styles.radioButton, paymentMethod === 'cod' && styles.radioButtonSelected]}>
              {paymentMethod === 'cod' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>

          {/* COD Warning Banner */}
          {paymentMethod === 'cod' && (
            <View style={styles.codWarningBanner}>
              <Text style={styles.codWarningTitle}>⚠️ COD Fee applies</Text>
              <Text style={styles.codWarningText}>
                You are paying ₹{Math.min(Math.round(calculations.total * 0.01), 10)} extra as COD Fee. Pay online to remove this fee.
              </Text>
            </View>
          )}
        </View>

        {/* Step 3: Billing & Items Summary */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>3. Order & Billing Summary</Text>
          
          <View style={styles.itemsBrief}>
            {cart.map((item) => (
              <View key={item.itemId} style={styles.itemSummaryRow}>
                <Text style={styles.itemSummaryName} numberOfLines={1}>
                  {item.product.name} (x{item.quantity})
                </Text>
                <Text style={styles.itemSummaryPrice}>₹{item.product.price * item.quantity}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.billingRow}>
            <Text style={styles.billLabel}>Subtotal</Text>
            <Text style={styles.billVal}>₹{calculations.subtotal}</Text>
          </View>
          <View style={styles.billingRow}>
            <Text style={styles.billLabel}>GST (18%)</Text>
            <Text style={styles.billVal}>₹{calculations.gst}</Text>
          </View>
          <View style={styles.billingRow}>
            <Text style={styles.billLabel}>Delivery Charges</Text>
            <Text style={styles.billVal}>
              {calculations.deliveryFee === 0 ? 'FREE' : `₹${calculations.deliveryFee}`}
            </Text>
          </View>
          {calculations.discount > 0 && (
            <View style={styles.billingRow}>
              <Text style={[styles.billLabel, { color: '#059669' }]}>Discounts Applied</Text>
              <Text style={[styles.billVal, { color: '#059669' }]}>-₹{calculations.discount}</Text>
            </View>
          )}

          {riderTip > 0 && (
            <View style={styles.billingRow}>
              <Text style={styles.billLabel}>Rider Tip</Text>
              <Text style={styles.billVal}>₹{riderTip}</Text>
            </View>
          )}

          {codFee > 0 && (
            <View style={styles.billingRow}>
              <Text style={[styles.billLabel, { color: '#B45309' }]}>COD Fee</Text>
              <Text style={[styles.billVal, { color: '#B45309' }]}>₹{codFee}</Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.totalPayableRow}>
            <Text style={styles.payableLabel}>Amount Payable</Text>
            <Text style={styles.payableValue}>₹{totalPayable}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Checkout Trigger */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerLabel}>Total Amount</Text>
          <Text style={styles.footerPrice}>₹{totalPayable}</Text>
        </View>
        <TouchableOpacity 
          style={styles.payBtn}
          onPress={handlePayment}
        >
          <Text style={styles.payBtnText}>Pay Securely</Text>
          <Ionicons name="lock-closed" size={16} color="white" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>

      {/* RAZORPAY SECURE GATEWAY SIMULATOR */}
      <Modal visible={showRazorpay} transparent={true} animationType="fade">
        <View style={styles.razorpayBackdrop}>
          <View style={styles.razorpayContainer}>
            {/* Razorpay Branding Header */}
            <View style={styles.razorpayHeader}>
              <View style={styles.razorpayLogoRow}>
                <Ionicons name="shield-checkmark" size={20} color="white" />
                <Text style={styles.razorpayBrandName}>Razorpay Secure</Text>
              </View>
              <View>
                <Text style={styles.razorpayAmountLabel}>PAYING AURAMART</Text>
                <Text style={styles.razorpayAmountValue}>₹{totalPayable}</Text>
              </View>
            </View>

            {/* Simulated Processing Body */}
            <View style={styles.razorpayBody}>
              {razorpayStatus === 'processing' && (
                <View style={styles.centerCol}>
                  <ActivityIndicator size="large" color="#0052FF" />
                  <Text style={styles.processingText}>Processing payment securely...</Text>
                  <Text style={styles.processingSub}>Connecting with bank gateways. Do not press back or refresh.</Text>
                </View>
              )}

              {razorpayStatus === 'success' && (
                <View style={styles.centerCol}>
                  <Ionicons name="checkmark-circle" size={80} color="#059669" />
                  <Text style={styles.successText}>Payment Successful!</Text>
                  <Text style={styles.successSub}>Order Created Successfully. Order ID: {placedOrderId}</Text>
                </View>
              )}

              {razorpayStatus === 'failed' && (
                <View style={styles.centerCol}>
                  <Ionicons name="close-circle" size={80} color="#EF4444" />
                  <Text style={styles.errorText}>Payment Failed</Text>
                  <Text style={styles.errorSub}>The transaction was declined by bank gateway.</Text>
                </View>
              )}
            </View>

            <View style={styles.razorpayFooter}>
              <Ionicons name="lock-closed" size={12} color="#9CA3AF" />
              <Text style={styles.razorpayFooterText}>PCI-DSS Compliant • 128-bit SSL Encrypted</Text>
            </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  addressesContainer: {
    gap: 10,
  },
  addressOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#F9FAFB',
  },
  selectedAddressOption: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F5F3FF',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    borderColor: '#8B5CF6',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8B5CF6',
  },
  addressText: {
    flex: 1,
    fontSize: 12,
    color: '#374151',
    lineHeight: 18,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    backgroundColor: '#F9FAFB',
  },
  selectedPaymentOption: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F5F3FF',
  },
  paymentTextCol: {
    flex: 1,
    marginLeft: 12,
  },
  paymentName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  paymentDesc: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  itemsBrief: {
    gap: 8,
  },
  itemSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemSummaryName: {
    fontSize: 13,
    color: '#4B5563',
    flex: 1,
    marginRight: 16,
  },
  itemSummaryPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  billLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  billVal: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '500',
  },
  totalPayableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  payableLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  payableValue: {
    fontSize: 18,
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
  footerInfo: {
    justifyContent: 'center',
  },
  footerLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  footerPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  payBtn: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  payBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Razorpay simulator backdrop
  razorpayBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  razorpayContainer: {
    backgroundColor: '#FFFFFF',
    width: width - 32,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  razorpayHeader: {
    backgroundColor: '#0F1E36',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  razorpayLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  razorpayBrandName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  razorpayAmountLabel: {
    color: '#9CA3AF',
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  razorpayAmountValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  razorpayBody: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 220,
  },
  centerCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  processingSub: {
    marginTop: 8,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  successText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  successSub: {
    marginTop: 6,
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center',
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  errorSub: {
    marginTop: 6,
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center',
  },
  razorpayFooter: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  razorpayFooterText: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '500',
  },
  slotOptionBtn: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  slotOptionBtnActive: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5'
  },
  slotOptionText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#6B7280'
  },
  slotOptionTextActive: {
    color: '#047857'
  },
  tipBtn: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 60,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  tipBtnActive: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5'
  },
  tipBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280'
  },
  tipBtnTextActive: {
    color: '#047857'
  },
  codWarningBanner: {
    backgroundColor: '#FFF9C4',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  codWarningTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#92400E',
    marginBottom: 4,
  },
  codWarningText: {
    fontSize: 11,
    color: '#B45309',
    fontWeight: '600',
    lineHeight: 16,
  },
});
