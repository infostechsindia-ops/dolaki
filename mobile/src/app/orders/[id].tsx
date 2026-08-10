import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { apiClient } from '../../api/client';
import { LoadingView, ErrorStateView } from '../../components/common/StateViews';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cancellation state (CMD-049)
  const [cancelModalOpen, setCancelModalOpen] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [cancelPreview, setCancelPreview] = useState<any>(null);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  // Return state (CMD-050)
  const [returnModalOpen, setReturnModalOpen] = useState<boolean>(false);
  const [returnReason, setReturnReason] = useState<string>('');
  const [returnChoice, setReturnChoice] = useState<'REFUND' | 'REPLACEMENT'>('REFUND');
  const [returnPreview, setReturnPreview] = useState<any>(null);
  const [isSubmittingReturn, setIsSubmittingReturn] = useState<boolean>(false);

  const fetchOrderDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data: any = await apiClient(`/orders/${id}`);
      setOrder(data);
    } catch (err: any) {
      setError(err?.message || 'Unable to fetch order details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  // Open Cancellation Modal & Preview
  const handleOpenCancel = async () => {
    setCancelModalOpen(true);
    try {
      const prev: any = await apiClient(`/orders/${id}/cancel/preview`, {
        method: 'POST',
        body: JSON.stringify({ reason: cancelReason }),
      });
      setCancelPreview(prev);
    } catch (e) {
      console.log('Cancel preview notice:', e);
    }
  };

  // Submit Authoritative Cancellation
  const handleConfirmCancellation = async () => {
    if (!cancelReason.trim()) {
      Alert.alert('Reason Required', 'Please select or type a cancellation reason.');
      return;
    }
    setIsCancelling(true);
    try {
      const res: any = await apiClient(`/orders/${id}/cancel`, {
        method: 'POST',
        headers: {
          'X-Idempotency-Key': `idemp-cancel-${id}-${Date.now()}`,
        },
        body: JSON.stringify({ reason: cancelReason }),
      });
      Alert.alert('Order Cancelled', 'Your order cancellation request has been executed.');
      setCancelModalOpen(false);
      fetchOrderDetails();
    } catch (err: any) {
      Alert.alert('Cancellation Error', err?.message || 'Failed to cancel order.');
    } finally {
      setIsCancelling(false);
    }
  };

  // Open Return Modal & Preview
  const handleOpenReturn = async () => {
    setReturnModalOpen(true);
    try {
      const prev: any = await apiClient(`/orders/${id}/return/preview`, {
        method: 'POST',
      });
      setReturnPreview(prev);
    } catch (e) {
      console.log('Return preview notice:', e);
    }
  };

  // Submit Authoritative Return Request
  const handleConfirmReturn = async () => {
    if (!returnReason.trim()) {
      Alert.alert('Reason Required', 'Please provide a return reason.');
      return;
    }
    setIsSubmittingReturn(true);
    try {
      await apiClient(`/orders/${id}/return`, {
        method: 'POST',
        headers: {
          'X-Idempotency-Key': `idemp-return-${id}-${Date.now()}`,
        },
        body: JSON.stringify({
          reasonText: returnReason,
          choice: returnChoice,
        }),
      });
      Alert.alert('Return Requested', 'Your return request has been submitted to customer service.');
      setReturnModalOpen(false);
      fetchOrderDetails();
    } catch (err: any) {
      Alert.alert('Return Request Error', err?.message || 'Failed to submit return request.');
    } finally {
      setIsSubmittingReturn(false);
    }
  };

  if (loading) {
    return <LoadingView message="Loading order details..." />;
  }

  if (error || !order) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorStateView
          title="Order Details Unavailable"
          message={error || "Order not found."}
          onRetry={fetchOrderDetails}
          retryLabel="Retry Loading"
        />
      </SafeAreaView>
    );
  }

  const orderDisplayId = order.orderNumber || order.id;
  const isDelivered = order.status === 'DELIVERED';
  const isCancelled = order.status === 'CANCELLED';

  // Refund status mapping (CMD-051)
  const refundStatusText = order.refundStatus || (order.paymentMethod === 'COD' ? 'NOT_REQUIRED' : 'NONE');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order #{orderDisplayId}</Text>
        <TouchableOpacity onPress={() => router.push(`/tracking/${order.id}`)} style={styles.trackBtnHeader}>
          <Ionicons name="navigate" size={18} color="#6366F1" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Order Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Order Status</Text>
            <Text style={[styles.statusValue, isCancelled && styles.statusCancelled]}>
              {order.status.replace(/_/g, ' ')}
            </Text>
          </View>

          {/* Refund Status Banner (CMD-051) */}
          <View style={styles.refundBox}>
            <Ionicons name="cash-outline" size={16} color="#059669" />
            <Text style={styles.refundText}>
              Refund Status: <Text style={{ fontWeight: '700' }}>{refundStatusText}</Text>
            </Text>
          </View>

          {!isDelivered && !isCancelled && (
            <TouchableOpacity style={styles.cancelLinkBtn} onPress={handleOpenCancel}>
              <Ionicons name="close-circle-outline" size={16} color="#EF4444" />
              <Text style={styles.cancelLinkText}>Cancel Order</Text>
            </TouchableOpacity>
          )}

          {isDelivered && (
            <TouchableOpacity style={styles.returnLinkBtn} onPress={handleOpenReturn}>
              <Ionicons name="refresh-circle-outline" size={16} color="#6366F1" />
              <Text style={styles.returnLinkText}>Request Return / Replacement</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Purchased Items List */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Items in Order ({order.items?.length || 0})</Text>
          {order.items?.map((item: any, idx: number) => (
            <View key={item.id || idx} style={styles.itemRow}>
              <Image
                source={{ uri: item.image || item.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' }}
                style={styles.itemImg}
                resizeMode="contain"
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>{item.title || item.name}</Text>
                {item.sku ? <Text style={styles.itemSku}>SKU: {item.sku}</Text> : null}
                <Text style={styles.itemQtyText}>Quantity: {item.quantity || item.qty || 1}</Text>
              </View>
              <Text style={styles.itemPriceText}>
                {item.formattedLineTotal || `₹${(item.price || item.unitPrice || 0) * (item.quantity || item.qty || 1)}`}
              </Text>
            </View>
          ))}
        </View>

        {/* Financial Summary */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Authoritative Financial Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{order.formattedSubtotal || `₹${order.subtotal || 0}`}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taxes & GST</Text>
            <Text style={styles.summaryValue}>{order.formattedTax || `₹${order.gst || 0}`}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery & Shipping</Text>
            <Text style={styles.summaryValue}>{order.formattedShipping || `₹${order.deliveryFee || 0}`}</Text>
          </View>

          {order.discount ? (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discounts</Text>
              <Text style={[styles.summaryValue, { color: '#059669' }]}>-{order.formattedDiscount || `₹${order.discount}`}</Text>
            </View>
          ) : null}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.grandTotalLabel}>Total Paid</Text>
            <Text style={styles.grandTotalValue}>{order.formattedGrandTotal || `₹${order.grandTotal || order.total || 0}`}</Text>
          </View>
        </View>

        {/* Address & Payment Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Delivery & Payment Information</Text>
          <Text style={styles.infoLabel}>Shipping Address:</Text>
          <Text style={styles.infoValue}>{order.deliveryAddress || order.shippingAddress || 'Customer Address'}</Text>

          <Text style={[styles.infoLabel, { marginTop: 10 }]}>Payment Method:</Text>
          <Text style={styles.infoValue}>{order.paymentMethod || 'Online Payment'}</Text>
        </View>
      </ScrollView>

      {/* Cancellation Modal (CMD-049) */}
      <Modal visible={cancelModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cancel Order #{orderDisplayId}</Text>
              <TouchableOpacity onPress={() => setCancelModalOpen(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            {cancelPreview?.formattedExpectedRefund && (
              <View style={styles.previewBox}>
                <Text style={styles.previewText}>
                  Expected Refund: <Text style={{ fontWeight: '800', color: '#059669' }}>{cancelPreview.formattedExpectedRefund}</Text>
                </Text>
              </View>
            )}

            <TextInput
              style={styles.modalInput}
              placeholder="Reason for cancellation..."
              value={cancelReason}
              onChangeText={setCancelReason}
              multiline
            />

            <TouchableOpacity
              style={[styles.modalSubmitBtn, isCancelling && styles.disabledBtn]}
              onPress={handleConfirmCancellation}
              disabled={isCancelling}
            >
              <Text style={styles.modalSubmitText}>
                {isCancelling ? 'Executing Cancellation...' : 'Confirm Cancellation'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Return Modal (CMD-050) */}
      <Modal visible={returnModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Return Request #{orderDisplayId}</Text>
              <TouchableOpacity onPress={() => setReturnModalOpen(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            <View style={styles.choiceRow}>
              <TouchableOpacity
                style={[styles.choiceChip, returnChoice === 'REFUND' && styles.choiceChipSelected]}
                onPress={() => setReturnChoice('REFUND')}
              >
                <Text style={[styles.choiceText, returnChoice === 'REFUND' && styles.choiceTextSelected]}>Refund</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.choiceChip, returnChoice === 'REPLACEMENT' && styles.choiceChipSelected]}
                onPress={() => setReturnChoice('REPLACEMENT')}
              >
                <Text style={[styles.choiceText, returnChoice === 'REPLACEMENT' && styles.choiceTextSelected]}>Replacement</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Reason for return request..."
              value={returnReason}
              onChangeText={setReturnReason}
              multiline
            />

            <TouchableOpacity
              style={[styles.modalSubmitBtn, isSubmittingReturn && styles.disabledBtn]}
              onPress={handleConfirmReturn}
              disabled={isSubmittingReturn}
            >
              <Text style={styles.modalSubmitText}>
                {isSubmittingReturn ? 'Submitting Request...' : 'Submit Return Request'}
              </Text>
            </TouchableOpacity>
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
  backBtn: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  trackBtnHeader: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#059669',
  },
  statusCancelled: {
    color: '#DC2626',
  },
  refundBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  refundText: {
    fontSize: 13,
    color: '#047857',
    marginLeft: 6,
  },
  cancelLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },
  cancelLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
    marginLeft: 4,
  },
  returnLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },
  returnLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6366F1',
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemImg: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  itemSku: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  itemQtyText: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 2,
  },
  itemPriceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
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
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 13,
    color: '#111827',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  previewBox: {
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  previewText: {
    fontSize: 13,
    color: '#047857',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    height: 80,
    textAlignVertical: 'top',
    fontSize: 13,
    marginBottom: 16,
  },
  choiceRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  choiceChip: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  choiceChipSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  choiceText: {
    fontSize: 13,
    color: '#374151',
  },
  choiceTextSelected: {
    color: '#6366F1',
    fontWeight: '700',
  },
  modalSubmitBtn: {
    height: 48,
    backgroundColor: '#6366F1',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#9CA3AF',
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
