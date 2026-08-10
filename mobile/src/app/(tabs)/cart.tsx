import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart, FormattedCartItem } from '../../context/CartContext';
import { useSurface } from '../../context/SurfaceContext';
import { LoadingView, ErrorStateView, EmptyStateView } from '../../components/common/StateViews';

export default function CartScreen() {
  const router = useRouter();
  const { surface } = useSurface();
  const {
    cart,
    authoritativeCart,
    isLoadingCart,
    cartError,
    fetchAuthoritativeCart,
    updateCartItemQuantity,
    removeCartItem,
    updateSubstitutionPreference,
    updateQuantity,
    removeFromCart,
    calculations,
  } = useCart();

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeSubstitutionItemId, setActiveSubstitutionItemId] = useState<string | null>(null);

  useEffect(() => {
    fetchAuthoritativeCart();
  }, [fetchAuthoritativeCart]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAuthoritativeCart();
    setRefreshing(false);
  };

  // Determine items list & grouping
  const hasAuthoritative = !!authoritativeCart;
  const authItems: FormattedCartItem[] = authoritativeCart?.items || [];
  
  const fladoAuthItems = authItems.filter(item => item.isFlado);
  const auraMartAuthItems = authItems.filter(item => !item.isFlado);

  const localFladoItems = cart.filter(item => item.product.isFlado);
  const localAuraMartItems = cart.filter(item => !item.product.isFlado);

  const isCartEmpty = hasAuthoritative ? authItems.length === 0 : cart.length === 0;

  if (isLoadingCart && !refreshing && !authoritativeCart) {
    return <LoadingView message="Loading authoritative cart..." />;
  }

  if (cartError && !refreshing && !authoritativeCart && cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorStateView
          title="Cart Unavailable"
          message={cartError}
          onRetry={fetchAuthoritativeCart}
          retryLabel="Reload Cart"
        />
      </SafeAreaView>
    );
  }

  if (isCartEmpty && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyStateView
          title="Your Cart is Empty"
          message="Explore products across AuraMart Marketplace and Flado Quick Commerce."
          actionLabel="Start Shopping"
          onAction={() => router.push('/')}
        />
      </SafeAreaView>
    );
  }

  // Verbatim financial totals from DTO
  const subtotalDisplay = authoritativeCart?.formattedSubtotal || `₹${calculations.subtotal}`;
  const taxDisplay = authoritativeCart?.formattedTax || `₹${calculations.gst}`;
  const shippingDisplay = authoritativeCart?.formattedShipping || `₹${calculations.deliveryFee}`;
  const discountDisplay = authoritativeCart?.formattedDiscount || `₹${calculations.discount}`;
  const grandTotalDisplay = authoritativeCart?.formattedGrandTotal || `₹${calculations.total}`;

  // Eligibility evaluation
  const isEligible = authoritativeCart?.checkoutEligibility?.isEligible ?? true;
  const blockerReason = authoritativeCart?.checkoutEligibility?.blockers?.[0] || 'Cart requirements not met';

  const renderAuthCartItem = (item: FormattedCartItem, isFladoGroup: boolean) => {
    const isSubstitutionOpen = activeSubstitutionItemId === item.id;
    return (
      <View key={item.id} style={styles.cartItemCard}>
        <Image
          source={{ uri: item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' }}
          style={styles.itemImage}
          resizeMode="contain"
        />

        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.itemSku}>SKU: {item.sku}</Text>

          {!item.inStock && (
            <View style={styles.warningBadge}>
              <Ionicons name="warning" size={12} color="#DC2626" />
              <Text style={styles.warningText}>Out of stock at active store</Text>
            </View>
          )}

          {item.isStoreUnavailable && (
            <View style={styles.warningBadge}>
              <Ionicons name="alert-circle" size={12} color="#D97706" />
              <Text style={styles.warningText}>{item.availabilityReason || 'Store unavailable'}</Text>
            </View>
          )}

          {/* Substitution Preference for Flado items */}
          {isFladoGroup && (
            <View style={styles.substitutionContainer}>
              <TouchableOpacity
                style={styles.substitutionBtn}
                onPress={() => setActiveSubstitutionItemId(isSubstitutionOpen ? null : item.id)}
                accessibilityRole="button"
                accessibilityLabel="Change substitution preference"
              >
                <Ionicons name="swap-horizontal" size={14} color="#059669" />
                <Text style={styles.substitutionText}>
                  Sub: {item.substitutionPreference || 'ALLOW_SUBSTITUTION'}
                </Text>
                <Ionicons name="chevron-down" size={14} color="#059669" />
              </TouchableOpacity>

              {isSubstitutionOpen && (
                <View style={styles.substitutionMenu}>
                  {(['ALLOW_SUBSTITUTION', 'CONTACT_ME', 'NO_SUBSTITUTION'] as const).map(pref => (
                    <TouchableOpacity
                      key={pref}
                      style={[styles.prefOption, item.substitutionPreference === pref && styles.prefOptionSelected]}
                      onPress={() => {
                        updateSubstitutionPreference(item.id, pref);
                        setActiveSubstitutionItemId(null);
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`Set substitution preference to ${pref}`}
                    >
                      <Text style={[styles.prefOptionText, item.substitutionPreference === pref && styles.prefOptionTextSelected]}>
                        {pref.replace('_', ' ')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          <View style={styles.priceRow}>
            <Text style={styles.itemPrice}>{item.formattedLineTotal}</Text>

            <View style={styles.qtyContainer}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                accessibilityRole="button"
                accessibilityLabel="Decrease item quantity"
              >
                <Ionicons name="remove" size={14} color="#374151" />
              </TouchableOpacity>

              <Text style={styles.qtyText}>{item.quantity}</Text>

              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                accessibilityRole="button"
                accessibilityLabel="Increase item quantity"
              >
                <Ionicons name="add" size={14} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => removeCartItem(item.id)}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${item.title} from cart`}
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#6366F1']} />}
      >
        {/* Flado Delivery ETA & Store Status Banner */}
        {authoritativeCart?.estimatedDeliveryEtaText && (
          <View style={[styles.etaBanner, { backgroundColor: surface === 'QUICK_COMMERCE' ? '#ECFDF5' : '#EEF2FF', borderColor: surface === 'QUICK_COMMERCE' ? '#A7F3D0' : '#C7D2FE' }]}>
            <Ionicons name={surface === 'QUICK_COMMERCE' ? "flash" : "time-outline"} size={18} color={surface === 'QUICK_COMMERCE' ? "#059669" : "#6366F1"} />
            <Text style={[styles.etaText, { color: surface === 'QUICK_COMMERCE' ? "#047857" : "#4338CA" }]}>
              {authoritativeCart.estimatedDeliveryEtaText}
            </Text>
          </View>
        )}

        {/* Minimum Basket Shortfall Warning */}
        {authoritativeCart?.isMinimumBasketMet === false && authoritativeCart.formattedMinimumBasketShortfall && (
          <View style={styles.shortfallBanner}>
            <Ionicons name="alert-circle" size={18} color="#D97706" />
            <Text style={styles.shortfallText}>
              Add {authoritativeCart.formattedMinimumBasketShortfall} more for minimum order requirement.
            </Text>
          </View>
        )}

        {/* Flado Quick Commerce Group */}
        {(hasAuthoritative ? fladoAuthItems.length > 0 : localFladoItems.length > 0) && (
          <View style={styles.groupCard}>
            <View style={styles.groupHeader}>
              <Ionicons name="flash" size={16} color="#059669" />
              <Text style={[styles.groupTitle, { color: '#059669' }]}>⚡ Flado Quick Commerce</Text>
            </View>
            {hasAuthoritative
              ? fladoAuthItems.map(item => renderAuthCartItem(item, true))
              : localFladoItems.map(item => (
                  <View key={item.itemId} style={styles.cartItemCard}>
                    <Image source={{ uri: item.product.image }} style={styles.itemImage} resizeMode="contain" />
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
                      <Text style={styles.itemPrice}>₹{item.product.price * item.quantity}</Text>
                    </View>
                    <TouchableOpacity onPress={() => removeFromCart(item.itemId)} style={styles.removeBtn}>
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
          </View>
        )}

        {/* AuraMart Marketplace Group */}
        {(hasAuthoritative ? auraMartAuthItems.length > 0 : localAuraMartItems.length > 0) && (
          <View style={styles.groupCard}>
            <View style={styles.groupHeader}>
              <MaterialCommunityIcons name="truck-delivery" size={16} color="#6366F1" />
              <Text style={[styles.groupTitle, { color: '#6366F1' }]}>🚚 AuraMart Marketplace (Standard Express)</Text>
            </View>
            {hasAuthoritative
              ? auraMartAuthItems.map(item => renderAuthCartItem(item, false))
              : localAuraMartItems.map(item => (
                  <View key={item.itemId} style={styles.cartItemCard}>
                    <Image source={{ uri: item.product.image }} style={styles.itemImage} resizeMode="contain" />
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
                      <Text style={styles.itemPrice}>₹{item.product.price * item.quantity}</Text>
                    </View>
                    <TouchableOpacity onPress={() => removeFromCart(item.itemId)} style={styles.removeBtn}>
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
          </View>
        )}

        {/* Bill Details Summary (Authoritative Verbatim DTO) */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Bill Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Item Subtotal</Text>
            <Text style={styles.summaryValue}>{subtotalDisplay}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taxes & GST</Text>
            <Text style={styles.summaryValue}>{taxDisplay}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery & Quick Fees</Text>
            <Text style={styles.summaryValue}>{shippingDisplay}</Text>
          </View>

          {authoritativeCart?.discount ? (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discounts & Savings</Text>
              <Text style={[styles.summaryValue, { color: '#059669' }]}>-{discountDisplay}</Text>
            </View>
          ) : null}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.grandTotalLabel}>To Pay</Text>
            <Text style={styles.grandTotalValue}>{grandTotalDisplay}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Checkout Footer */}
      <View style={styles.stickyFooter}>
        <View style={styles.totalBox}>
          <Text style={styles.footerTotalLabel}>Total Amount</Text>
          <Text style={styles.footerTotalValue}>{grandTotalDisplay}</Text>
        </View>

        <TouchableOpacity
          style={[styles.checkoutBtn, !isEligible && styles.disabledCheckoutBtn]}
          onPress={() => router.push('/checkout')}
          disabled={!isEligible}
          accessibilityRole="button"
          accessibilityLabel={isEligible ? "Proceed to Checkout" : `Checkout disabled: ${blockerReason}`}
        >
          <Text style={styles.checkoutBtnText}>
            {isEligible ? 'PROCEED TO CHECKOUT' : blockerReason.toUpperCase()}
          </Text>
          {isEligible && <Ionicons name="arrow-forward" size={18} color="white" />}
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  etaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  etaText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  shortfallBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCD34D',
    backgroundColor: '#FFFBEB',
    marginBottom: 12,
  },
  shortfallText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B45309',
    marginLeft: 8,
    flex: 1,
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  cartItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  itemSku: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  warningText: {
    fontSize: 11,
    color: '#DC2626',
    marginLeft: 4,
    fontWeight: '600',
  },
  substitutionContainer: {
    marginTop: 6,
  },
  substitutionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  substitutionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    marginHorizontal: 4,
  },
  substitutionMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 4,
    padding: 4,
  },
  prefOption: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  prefOptionSelected: {
    backgroundColor: '#ECFDF5',
  },
  prefOptionText: {
    fontSize: 11,
    color: '#374151',
  },
  prefOptionTextSelected: {
    color: '#059669',
    fontWeight: '700',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 8,
    color: '#111827',
  },
  removeBtn: {
    padding: 8,
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  totalBox: {
    flex: 1,
  },
  footerTotalLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  footerTotalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  checkoutBtn: {
    flex: 1.8,
    height: 48,
    backgroundColor: '#6366F1',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  disabledCheckoutBtn: {
    backgroundColor: '#9CA3AF',
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
