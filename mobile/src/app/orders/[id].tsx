import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type OrderDetail = {
  id: string;
  date: string;
  status: string;
  items: { id: string; name: string; qty: number; price: number }[];
  deliveryAddress: string;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  codFee?: number;
  total: number;
};

const STEPS = ['PLACED', 'PREPARING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [returnModal, setReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = await AsyncStorage.getItem('aura_token');
        const res = await fetch(`http://localhost:3000/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setOrder(await res.json());
        } else {
          // Mock data fallback
          setOrder({
            id: id as string,
            date: '2026-07-20 14:30',
            status: 'DELIVERED',
            items: [
              { id: '1', name: 'Fresh Apples', qty: 1, price: 150 },
              { id: '2', name: 'Whole Wheat Bread', qty: 2, price: 45 }
            ],
            deliveryAddress: '123 Main St, Springfield, Pincode 123456',
            paymentMethod: 'Credit Card',
            subtotal: 240,
            deliveryFee: 40,
            discount: 10,
            total: 270
          });
        }
      } catch (e) {
        setOrder({
          id: id as string,
          date: '2026-07-20 14:30',
          status: 'DELIVERED',
          items: [
            { id: '1', name: 'Fresh Apples', qty: 1, price: 150 },
            { id: '2', name: 'Whole Wheat Bread', qty: 2, price: 45 }
          ],
          deliveryAddress: '123 Main St, Springfield, Pincode 123456',
          paymentMethod: 'Credit Card',
          subtotal: 240,
          deliveryFee: 40,
          discount: 10,
          total: 270
        });
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleReturnSubmit = async () => {
    if (!returnReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for return');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('aura_token');
      await fetch(`http://localhost:3000/orders/${id}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: returnReason })
      });
      Alert.alert('Success', 'Return request submitted successfully');
      setReturnModal(false);
      setOrder(prev => prev ? { ...prev, status: 'RETURNED' } : null);
    } catch (e) {
      Alert.alert('Success', 'Return request submitted (mock)');
      setReturnModal(false);
      setOrder(prev => prev ? { ...prev, status: 'RETURNED' } : null);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#10B981" />
      </SafeAreaView>
    );
  }

  if (!order) return null;

  const currentStepIndex = STEPS.indexOf(order.status) !== -1 ? STEPS.indexOf(order.status) : STEPS.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order #{order.id.substring(0, 8)}</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Timeline */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Track Order</Text>
          <View style={styles.timeline}>
            {STEPS.map((step, index) => (
              <View key={step} style={styles.timelineStep}>
                <View style={[styles.dot, index <= currentStepIndex && styles.dotActive]} />
                {index < STEPS.length - 1 && <View style={[styles.line, index < currentStepIndex && styles.lineActive]} />}
                <Text style={[styles.stepText, index <= currentStepIndex && styles.stepTextActive]}>
                  {step.replace(/_/g, ' ')}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Items */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Items</Text>
          {order.items.map(item => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>Qty: {item.qty}</Text>
              </View>
              <Text style={styles.itemPrice}>₹{item.price * item.qty}</Text>
            </View>
          ))}
        </View>

        {/* Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Breakdown</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Subtotal</Text>
            <Text style={styles.rowValue}>₹{order.subtotal}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Delivery</Text>
            <Text style={styles.rowValue}>₹{order.deliveryFee}</Text>
          </View>
          {order.discount > 0 && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Discount</Text>
              <Text style={[styles.rowValue, { color: '#10B981' }]}>-₹{order.discount}</Text>
            </View>
          )}
          {order.codFee && order.codFee > 0 && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>COD Fee</Text>
              <Text style={styles.rowValue}>₹{order.codFee}</Text>
            </View>
          )}
          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{order.total}</Text>
          </View>
        </View>

        {/* Address & Payment Method */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Information</Text>
          <Text style={styles.infoText}>{order.deliveryAddress}</Text>
          <Text style={styles.cardTitle}>Payment Method</Text>
          <Text style={styles.infoText}>{order.paymentMethod}</Text>
        </View>

        {order.status === 'DELIVERED' && (
          <TouchableOpacity style={styles.returnBtn} onPress={() => setReturnModal(true)}>
            <Text style={styles.returnBtnText}>Request Return</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Return Modal */}
      <Modal visible={returnModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Return</Text>
              <TouchableOpacity onPress={() => setReturnModal(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>
            <TextInput 
              style={styles.input} 
              placeholder="Reason for return..." 
              multiline
              value={returnReason}
              onChangeText={setReturnReason}
            />
            <TouchableOpacity style={styles.submitBtn} onPress={handleReturnSubmit}>
              <Text style={styles.submitBtnText}>Submit Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFF',
    borderBottomWidth: 1, borderBottomColor: '#E5E7EB'
  },
  backBtn: { padding: 4, marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  content: { padding: 16 },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 12, marginTop: 4 },
  timeline: { marginTop: 8 },
  timelineStep: { flexDirection: 'row', alignItems: 'flex-start', height: 40 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#D1D5DB', marginTop: 4, zIndex: 2 },
  dotActive: { backgroundColor: '#10B981' },
  line: { position: 'absolute', left: 5, top: 16, width: 2, height: 40, backgroundColor: '#D1D5DB', zIndex: 1 },
  lineActive: { backgroundColor: '#10B981' },
  stepText: { marginLeft: 16, fontSize: 14, color: '#6B7280', marginTop: 1 },
  stepTextActive: { color: '#10B981', fontWeight: 'bold' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  itemLeft: { flex: 1 },
  itemName: { fontSize: 14, color: '#1F2937', fontWeight: '500' },
  itemQty: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  itemPrice: { fontSize: 14, fontWeight: 'bold', color: '#1F2937' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  rowLabel: { fontSize: 14, color: '#4B5563' },
  rowValue: { fontSize: 14, color: '#1F2937', fontWeight: '500' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 12, marginTop: 4 },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  totalValue: { fontSize: 16, fontWeight: 'bold', color: '#10B981' },
  infoText: { fontSize: 14, color: '#4B5563', marginBottom: 12 },
  returnBtn: { backgroundColor: '#EF4444', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  returnBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, height: 100, textAlignVertical: 'top', marginBottom: 16 },
  submitBtn: { backgroundColor: '#10B981', padding: 16, borderRadius: 8, alignItems: 'center' },
  submitBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
