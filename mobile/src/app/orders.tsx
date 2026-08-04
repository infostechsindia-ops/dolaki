import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Order = {
  id: string;
  date: string;
  totalAmount: number;
  status: string;
  itemsSummary: string;
};

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('aura_token');
      if (!token) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }
      setIsLoggedIn(true);

      const res = await fetch('http://localhost:3000/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        // Mock data fallback
        setOrders([
          { id: 'ORD-123456', date: '2026-07-20', totalAmount: 450, status: 'DELIVERED', itemsSummary: '2 items' },
          { id: 'ORD-123457', date: '2026-07-21', totalAmount: 1200, status: 'SHIPPED', itemsSummary: '5 items' }
        ]);
      }
    } catch (e) {
      setOrders([
        { id: 'ORD-123456', date: '2026-07-20', totalAmount: 450, status: 'DELIVERED', itemsSummary: '2 items' },
        { id: 'ORD-123457', date: '2026-07-21', totalAmount: 1200, status: 'SHIPPED', itemsSummary: '5 items' }
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PLACED': return '#3B82F6'; // blue
      case 'PREPARING': return '#F97316'; // orange
      case 'SHIPPED': return '#A855F7'; // purple
      case 'OUT_FOR_DELIVERY': return '#F59E0B'; // amber
      case 'DELIVERED': return '#10B981'; // green
      case 'CANCELLED': return '#EF4444'; // red
      case 'RETURNED': return '#6B7280'; // grey
      default: return '#6B7280';
    }
  };

  if (!loading && !isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Orders</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="lock-closed-outline" size={60} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>Login to view orders</Text>
          <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/auth')}>
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity 
      style={styles.orderCard} 
      onPress={() => router.push(`/orders/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>{item.id.substring(0, 12)}...</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      <View style={styles.cardMiddle}>
        <Text style={styles.summaryText}>{item.itemsSummary}</Text>
        <Text style={styles.totalText}>₹{item.totalAmount}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.badgeText}>{item.status.replace(/_/g, ' ')}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>
      
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={60} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList 
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFF',
    borderBottomWidth: 1, borderBottomColor: '#E5E7EB'
  },
  backBtn: { padding: 4, marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16, gap: 12 },
  orderCard: {
    backgroundColor: '#FFF', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000',
    shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  orderId: { fontWeight: 'bold', fontSize: 14, color: '#1F2937' },
  dateText: { fontSize: 12, color: '#6B7280' },
  cardMiddle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  summaryText: { fontSize: 14, color: '#4B5563' },
  totalText: { fontSize: 16, fontWeight: 'bold', color: '#10B981' },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyTitle: { fontSize: 18, color: '#4B5563', marginTop: 16, marginBottom: 24 },
  shopBtn: { backgroundColor: '#10B981', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  shopBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  loginBtn: { backgroundColor: '#10B981', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 8 },
  loginBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
