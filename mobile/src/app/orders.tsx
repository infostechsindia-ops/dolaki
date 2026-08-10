import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { apiClient } from '../api/client';
import { useAuthContext } from '../context/AuthContext';
import { LoadingView, ErrorStateView, EmptyStateView } from '../components/common/StateViews';

export default function OrdersScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();

  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) return;
    setError(null);
    try {
      const data: any = await apiClient('/orders');
      const list = Array.isArray(data) ? data : (data?.data || []);
      setOrders(list);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch order history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleReorder = async (orderId: string) => {
    setReorderingId(orderId);
    try {
      await apiClient(`/orders/${orderId}/reorder`, {
        method: 'POST',
        headers: {
          'X-Idempotency-Key': `idemp-reorder-${orderId}-${Date.now()}`,
        },
      });
      router.push('/cart');
    } catch (err: any) {
      console.error('Reorder error:', err);
    } finally {
      setReorderingId(null);
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' };
      case 'OUT_FOR_DELIVERY':
      case 'SHIPPED':
        return { bg: '#EEF2FF', text: '#4338CA', border: '#C7D2FE' };
      case 'CANCELLED':
        return { bg: '#FEF2F2', text: '#B91C1C', border: '#FCA5A5' };
      default:
        return { bg: '#FFFBEB', text: '#B45309', border: '#FCD34D' };
    }
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Orders</Text>
          <View style={{ width: 44 }} />
        </View>
        <EmptyStateView
          title="Login to View Orders"
          message="Please log in to your AuraMart account to view your past purchases and track ongoing deliveries."
          actionLabel="Log In"
          onAction={() => router.push('/auth')}
        />
      </SafeAreaView>
    );
  }

  if (loading && !refreshing) {
    return <LoadingView message="Loading order history..." />;
  }

  if (error && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorStateView
          title="Unable to Load Orders"
          message={error}
          onRetry={fetchOrders}
          retryLabel="Retry"
        />
      </SafeAreaView>
    );
  }

  const filteredOrders = orders.filter(o => {
    if (!searchQuery) return true;
    const term = searchQuery.toLowerCase();
    const orderId = (o.id || o.orderNumber || '').toLowerCase();
    const itemsSummary = (o.itemsSummary || '').toLowerCase();
    return orderId.includes(term) || itemsSummary.includes(term);
  });

  const renderOrderItem = ({ item }: { item: any }) => {
    const badge = getStatusBadgeStyle(item.status);
    const orderDisplayId = item.orderNumber || item.id || 'ORD-000';
    const dateText = item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : (item.date || 'Recent');
    const displayTotal = item.formattedGrandTotal || `₹${item.totalAmount || item.total || 0}`;
    const firstItemImg = item.items?.[0]?.image || item.items?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => router.push(`/orders/${item.id}`)}
        accessibilityRole="button"
        accessibilityLabel={`View order details for ${orderDisplayId}`}
      >
        <View style={styles.cardTop}>
          <View style={styles.orderMeta}>
            <Text style={styles.orderIdText}>{orderDisplayId}</Text>
            <Text style={styles.dateText}>{dateText}</Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
            <Text style={[styles.statusText, { color: badge.text }]}>
              {item.status.replace(/_/g, ' ')}
            </Text>
          </View>
        </View>

        <View style={styles.cardMiddle}>
          <Image source={{ uri: firstItemImg }} style={styles.itemImg} resizeMode="contain" />
          <View style={styles.middleDetails}>
            <Text style={styles.itemsSummaryText} numberOfLines={2}>
              {item.itemsSummary || (item.items ? `${item.items.length} items purchased` : 'Order items')}
            </Text>
            <Text style={styles.surfaceLabel}>
              {item.isFlado ? '⚡ Flado Quick Commerce' : '🚚 AuraMart Marketplace'}
            </Text>
          </View>

          <Text style={styles.totalValue}>{displayTotal}</Text>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.reorderBtn}
            onPress={() => handleReorder(item.id)}
            disabled={reorderingId === item.id}
            accessibilityRole="button"
            accessibilityLabel={`Reorder items from ${orderDisplayId}`}
          >
            <Ionicons name="repeat" size={14} color="#6366F1" />
            <Text style={styles.reorderBtnText}>
              {reorderingId === item.id ? 'Reordering...' : 'Reorder Items'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.trackBtn}
            onPress={() => router.push(`/tracking/${item.id}`)}
            accessibilityRole="button"
            accessibilityLabel={`Track shipment for ${orderDisplayId}`}
          >
            <Ionicons name="navigate-outline" size={14} color="#059669" />
            <Text style={styles.trackBtnText}>Track Order</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Search Filter Box */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by order # or product name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        ) : null}
      </View>

      {filteredOrders.length === 0 ? (
        <EmptyStateView
          title="No Orders Found"
          message={searchQuery ? "No orders match your search term." : "You haven't placed any orders yet."}
          actionLabel="Explore Catalog"
          onAction={() => router.push('/')}
        />
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#6366F1']} />}
        />
      )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  clearBtn: {
    padding: 4,
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  orderMeta: {
    flex: 1,
  },
  orderIdText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardMiddle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  itemImg: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  middleDetails: {
    flex: 1,
    marginLeft: 10,
  },
  itemsSummaryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  surfaceLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginLeft: 8,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10,
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    backgroundColor: '#EEF2FF',
    minHeight: 44,
  },
  reorderBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6366F1',
    marginLeft: 4,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    backgroundColor: '#ECFDF5',
    minHeight: 44,
  },
  trackBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 4,
  },
});
