import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../context/CartContext';
import { useSurface } from '../context/SurfaceContext';
import { apiClient } from '../api/client';
import { LoadingView, ErrorStateView } from '../components/common/StateViews';

export interface DeliveryOptionDto {
  id: string;
  label: string;
  description?: string;
  etaText?: string;
  priceCents: number;
  formattedPrice: string;
  isEligible: boolean;
  isSelected: boolean;
}

export interface PaymentMethodDto {
  id: string;
  type: 'UPI' | 'CARD' | 'COD' | 'WALLET';
  label: string;
  description?: string;
  isEligible: boolean;
  isSelected: boolean;
  uneligibleReason?: string;
}

export interface CheckoutPreviewResponseDto {
  cartId: string;
  customerId: string;
  addresses: any[];
  selectedAddress: any | null;
  deliveryOptions: DeliveryOptionDto[];
  selectedDeliveryOption: DeliveryOptionDto | null;
  paymentMethods: PaymentMethodDto[];
  selectedPaymentMethod: string | null;
  items: any[];
  totalItems: number;
  subtotal: number;
  formattedSubtotal: string;
  tax: number;
  formattedTax: string;
  shipping: number;
  formattedShipping: string;
  discount: number;
  formattedDiscount: string;
  grandTotal: number;
  formattedGrandTotal: string;
  minimumBasketAmount?: number | null;
  isMinimumBasketMet: boolean;
  formattedMinimumBasketShortfall?: string | null;
  storeAvailabilityStatus: 'OPEN' | 'CLOSED' | 'UNAVAILABLE' | 'SERVICED';
  storeName?: string | null;
  checkoutEligibility: {
    isEligible: boolean;
    blockers: string[];
  };
}

export default function CheckoutScreen() {
  const router = useRouter();
  const { surface } = useSurface();
  const { clearCart, selectedAddress: defaultAddressString } = useCart();
  const insets = useSafeAreaInsets();
  const bottomInsetPadding = Math.max(12, insets.bottom + 8);

  const [preview, setPreview] = useState<CheckoutPreviewResponseDto | null>(null);
  const [loadingPreview, setLoadingPreview] = useState<boolean>(true);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(undefined);
  const [selectedDeliveryOptionId, setSelectedDeliveryOptionId] = useState<string | undefined>(undefined);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('UPI');

  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const [placementError, setPlacementError] = useState<string | null>(null);

  // Stable Idempotency Key for current checkout session
  const idempotencyKeyRef = useRef<string>(`idemp-order-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);

  // Authoritative Checkout Preview Fetcher
  const fetchCheckoutPreview = useCallback(async (opts?: {
    addressId?: string;
    deliveryOptionId?: string;
    paymentMethod?: string;
  }) => {
    setLoadingPreview(true);
    setPreviewError(null);
    try {
      const data: CheckoutPreviewResponseDto = await apiClient('/checkout/preview', {
        method: 'POST',
        body: JSON.stringify({
          addressId: opts?.addressId ?? selectedAddressId,
          deliveryOptionId: opts?.deliveryOptionId ?? selectedDeliveryOptionId,
          paymentMethod: opts?.paymentMethod ?? selectedPaymentMethod,
        }),
      });
      setPreview(data);
      if (data.selectedAddress?.id && !selectedAddressId) {
        setSelectedAddressId(data.selectedAddress.id);
      }
      if (data.selectedDeliveryOption?.id && !selectedDeliveryOptionId) {
        setSelectedDeliveryOptionId(data.selectedDeliveryOption.id);
      }
      if (data.selectedPaymentMethod && !selectedPaymentMethod) {
        setSelectedPaymentMethod(data.selectedPaymentMethod);
      }
    } catch (err: any) {
      setPreviewError(err?.message || 'Failed to generate checkout preview');
    } finally {
      setLoadingPreview(false);
    }
  }, [selectedAddressId, selectedDeliveryOptionId, selectedPaymentMethod]);

  useEffect(() => {
    fetchCheckoutPreview();
  }, [fetchCheckoutPreview]);

  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    fetchCheckoutPreview({ addressId });
  };

  const handleSelectDeliveryOption = (deliveryOptionId: string) => {
    setSelectedDeliveryOptionId(deliveryOptionId);
    fetchCheckoutPreview({ deliveryOptionId });
  };

  const handleSelectPaymentMethod = (paymentMethod: string) => {
    setSelectedPaymentMethod(paymentMethod);
    fetchCheckoutPreview({ paymentMethod });
  };

  // Authoritative Order Placement Pipeline (CMD-045/CMD-046)
  const handlePlaceOrder = async () => {
    if (!preview || !preview.checkoutEligibility.isEligible) {
      Alert.alert('Checkout Blocked', preview?.checkoutEligibility.blockers?.[0] || 'Requirements not met');
      return;
    }

    setIsPlacingOrder(true);
    setPlacementError(null);

    const idempotencyKey = idempotencyKeyRef.current;

    try {
      // Step 1: Create PaymentIntent (Exact backend CreatePaymentIntentDto contract)
      const intentRes: any = await apiClient('/payments/intents', {
        method: 'POST',
        headers: {
          'X-Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          addressId: selectedAddressId || preview.selectedAddress?.id,
          deliveryOptionId: selectedDeliveryOptionId || preview.selectedDeliveryOption?.id,
          paymentMethod: selectedPaymentMethod,
        }),
      });

      const paymentIntentId = intentRes.id || intentRes.paymentIntentId;

      // Step 2: Confirm Payment Intent if required (CARD / UPI) using exact backend route POST /payments/intents/:id/confirm
      if (selectedPaymentMethod !== 'COD' && intentRes.status !== 'COD_PENDING') {
        await apiClient(`/payments/intents/${paymentIntentId}/confirm`, {
          method: 'POST',
          body: JSON.stringify({
            paymentMethod: selectedPaymentMethod,
          }),
        });
      }

      // Step 3: Authoritative Order Placement with Idempotency Guard
      const orderRes: any = await apiClient('/orders/place', {
        method: 'POST',
        headers: {
          'X-Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          paymentIntentId,
          addressId: selectedAddressId || preview.selectedAddress?.id || 'addr-default',
        }),
      });

      const orderId = orderRes.id || orderRes.orderNumber || 'ORD-SUCCESS';

      // Step 4: Clear Local Cart State & Route to Order Details (Preserving backend server cart state)
      clearCart();
      router.replace(`/orders/${orderId}`);
    } catch (err: any) {
      setPlacementError(err?.message || 'Failed to place order. Please try again.');
      Alert.alert('Order Placement Error', err?.message || 'Payment/order processing failed');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (loadingPreview && !preview) {
    return <LoadingView message="Preparing authoritative checkout preview..." />;
  }

  if (previewError && !preview) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorStateView
          title="Checkout Unavailable"
          message={previewError}
          onRetry={() => fetchCheckoutPreview()}
          retryLabel="Retry Preview"
        />
      </SafeAreaView>
    );
  }

  const isEligible = preview?.checkoutEligibility?.isEligible ?? false;
  const blockers = preview?.checkoutEligibility?.blockers || [];
  const primaryBlocker = blockers[0] || 'Cart requirements not met';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back to cart"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Checkout</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 110 + insets.bottom }]}
      >
        {/* Blocker Notification Banner if Ineligible */}
        {!isEligible && (
          <View style={styles.blockerBanner}>
            <Ionicons name="alert-circle" size={20} color="#DC2626" />
            <View style={styles.blockerContent}>
              <Text style={styles.blockerTitle}>Checkout Cannot Proceed</Text>
              {blockers.map((b, idx) => (
                <Text key={idx} style={styles.blockerText}>• {b}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Error placement banner */}
        {placementError && (
          <View style={styles.blockerBanner}>
            <Ionicons name="warning" size={20} color="#DC2626" />
            <Text style={styles.blockerText}>{placementError}</Text>
          </View>
        )}

        {/* Step 1: Saved Addresses Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={18} color="#6366F1" />
            <Text style={styles.sectionTitle}>1. Delivery Address</Text>
          </View>

          {preview?.addresses && preview.addresses.length > 0 ? (
            preview.addresses.map((addr: any) => {
              const isSelected = selectedAddressId === addr.id || preview.selectedAddress?.id === addr.id;
              return (
                <TouchableOpacity
                  key={addr.id}
                  style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                  onPress={() => handleSelectAddress(addr.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select address ${addr.addressLine1 || addr.name || addr.id}`}
                >
                  <Ionicons
                    name={isSelected ? "radio-button-on" : "radio-button-off"}
                    size={20}
                    color={isSelected ? "#6366F1" : "#9CA3AF"}
                  />
                  <View style={styles.optionDetails}>
                    <Text style={styles.optionTitle}>{addr.name || 'Delivery Address'}</Text>
                    <Text style={styles.optionSub}>{addr.addressLine1 || addr.pincode || defaultAddressString}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.addressFallbackBox}>
              <Ionicons name="location-outline" size={20} color="#4B5563" />
              <Text style={styles.addressFallbackText}>{defaultAddressString}</Text>
            </View>
          )}
        </View>

        {/* Step 2: Delivery Option Selection */}
        {preview?.deliveryOptions && preview.deliveryOptions.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="truck-delivery" size={18} color="#6366F1" />
              <Text style={styles.sectionTitle}>2. Delivery Mode & Speed</Text>
            </View>

            {preview.deliveryOptions.map((opt) => {
              const isSelected = selectedDeliveryOptionId === opt.id || opt.isSelected;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.optionRow, isSelected && styles.optionRowSelected, !opt.isEligible && styles.optionDisabled]}
                  onPress={() => opt.isEligible && handleSelectDeliveryOption(opt.id)}
                  disabled={!opt.isEligible}
                  accessibilityRole="button"
                  accessibilityLabel={`Select delivery option ${opt.label}`}
                >
                  <Ionicons
                    name={isSelected ? "radio-button-on" : "radio-button-off"}
                    size={20}
                    color={isSelected ? "#6366F1" : "#9CA3AF"}
                  />
                  <View style={styles.optionDetails}>
                    <Text style={styles.optionTitle}>{opt.label}</Text>
                    {opt.etaText ? <Text style={styles.etaBadge}>{opt.etaText}</Text> : null}
                  </View>
                  <Text style={styles.optionPrice}>{opt.formattedPrice}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Step 3: Payment Method Selection */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card" size={18} color="#6366F1" />
            <Text style={styles.sectionTitle}>3. Payment Method</Text>
          </View>

          {(preview?.paymentMethods || [
            { id: 'UPI', type: 'UPI', label: 'UPI Payment', isEligible: true, isSelected: true },
            { id: 'CARD', type: 'CARD', label: 'Credit / Debit Card', isEligible: true, isSelected: false },
            { id: 'COD', type: 'COD', label: 'Cash on Delivery (COD)', isEligible: true, isSelected: false },
          ]).map((pm: any) => {
            const isSelected = selectedPaymentMethod === pm.id || pm.isSelected;
            return (
              <TouchableOpacity
                key={pm.id}
                style={[styles.optionRow, isSelected && styles.optionRowSelected, !pm.isEligible && styles.optionDisabled]}
                onPress={() => pm.isEligible && handleSelectPaymentMethod(pm.id)}
                disabled={!pm.isEligible}
                accessibilityRole="button"
                accessibilityLabel={`Select payment method ${pm.label}`}
              >
                <Ionicons
                  name={isSelected ? "radio-button-on" : "radio-button-off"}
                  size={20}
                  color={isSelected ? "#6366F1" : "#9CA3AF"}
                />
                <View style={styles.optionDetails}>
                  <Text style={styles.optionTitle}>{pm.label}</Text>
                  {pm.description ? <Text style={styles.optionSub}>{pm.description}</Text> : null}
                  {!pm.isEligible && pm.uneligibleReason && (
                    <Text style={styles.uneligibleText}>{pm.uneligibleReason}</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Step 4: Authoritative Order Summary */}
        <View style={styles.sectionCard}>
          <Text style={styles.summaryTitle}>4. Authoritative Bill Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({preview?.totalItems || 0} items)</Text>
            <Text style={styles.summaryValue}>{preview?.formattedSubtotal || '₹0.00'}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taxes & GST</Text>
            <Text style={styles.summaryValue}>{preview?.formattedTax || '₹0.00'}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery & Fulfillment Charges</Text>
            <Text style={styles.summaryValue}>{preview?.formattedShipping || '₹0.00'}</Text>
          </View>

          {preview?.discount ? (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discounts & Coupon Savings</Text>
              <Text style={[styles.summaryValue, { color: '#059669' }]}>-{preview.formattedDiscount}</Text>
            </View>
          ) : null}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.grandTotalLabel}>Total Payable</Text>
            <Text style={styles.grandTotalValue}>{preview?.formattedGrandTotal || '₹0.00'}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Place Order CTA */}
      <View style={[styles.stickyFooter, { paddingBottom: bottomInsetPadding }]}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerLabel}>Total Amount</Text>
          <Text style={styles.footerValue}>{preview?.formattedGrandTotal || '₹0.00'}</Text>
        </View>

        <TouchableOpacity
          style={[styles.placeOrderBtn, (!isEligible || isPlacingOrder) && styles.disabledBtn]}
          onPress={handlePlaceOrder}
          disabled={!isEligible || isPlacingOrder}
          accessibilityRole="button"
          accessibilityLabel={isEligible ? "Place Order" : `Order blocked: ${primaryBlocker}`}
        >
          {isPlacingOrder ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.placeOrderText}>
                {isEligible ? 'PLACE ORDER' : primaryBlocker.toUpperCase()}
              </Text>
              {isEligible && <Ionicons name="lock-closed" size={16} color="white" />}
            </>
          )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  blockerBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginBottom: 16,
  },
  blockerContent: {
    marginLeft: 8,
    flex: 1,
  },
  blockerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#991B1B',
  },
  blockerText: {
    fontSize: 12,
    color: '#B91C1C',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
    minHeight: 48,
  },
  optionRowSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionDetails: {
    flex: 1,
    marginLeft: 10,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  optionSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  optionPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  etaBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    marginTop: 2,
  },
  uneligibleText: {
    fontSize: 11,
    color: '#DC2626',
    marginTop: 2,
  },
  addressFallbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  addressFallbackText: {
    fontSize: 13,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#4B5563',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 10,
  },
  grandTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  footerInfo: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  footerValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  placeOrderBtn: {
    flex: 1.8,
    height: 48,
    backgroundColor: '#6366F1',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  disabledBtn: {
    backgroundColor: '#9CA3AF',
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
