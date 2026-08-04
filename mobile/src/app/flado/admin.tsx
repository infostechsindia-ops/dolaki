import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

type AdminTabType = 'approvals' | 'orders' | 'stats';

// Mock pending shops
const INITIAL_MOCK_PENDING_SHOPS = [
  {
    id: 'shop-pending-01',
    shopName: 'Mithila Kirana & General Store',
    ownerName: 'Ramesh Yadav',
    ownerPhone: '+91 98765 88888',
    address: 'Chata Chowk, Muzaffarpur, Bihar',
    city: 'Muzaffarpur',
    categoriesJson: '["Kirana", "Dairy", "Household"]',
    ownerStory: 'Selling local staples and spices for the last 15 years.',
  },
  {
    id: 'shop-pending-02',
    shopName: 'Mau Medical Agency',
    ownerName: 'Vikas Gupta',
    ownerPhone: '+91 98765 99999',
    address: 'Sadar Bazar, Maunath Bhanjan, Uttar Pradesh',
    city: 'Maunath Bhanjan',
    categoriesJson: '["Medical", "Beauty"]',
    ownerStory: '24/7 medicine delivery to nearby villages.',
  },
  {
    id: 'shop-pending-03',
    shopName: 'New Green Veggies',
    ownerName: 'Lalan Singh',
    ownerPhone: '+91 98765 77777',
    address: 'Ahiyapur Mandi, Muzaffarpur, Bihar',
    city: 'Muzaffarpur',
    categoriesJson: '["Veggies"]',
    ownerStory: 'Fresh farm-to-table vegetables sourced daily.',
  },
];

// Mock live orders
const MOCK_LIVE_ORDERS = [
  {
    id: '1001',
    shopName: 'Rahul Kirana Store',
    customerName: 'Aman Sharma',
    city: 'Muzaffarpur',
    totalAmount: 320,
    codFee: 3,
    deliveryFee: 20,
    paymentMethod: 'COD',
    status: 'PLACED',
    itemsSummary: 'Aashirvaad Atta 5kg x 1, Amul Butter 500g x 1',
    createdAt: '2026-07-05 03:00 AM',
  },
  {
    id: '1002',
    shopName: 'Mithila Kirana & General Store',
    customerName: 'Priya Verma',
    city: 'Muzaffarpur',
    totalAmount: 480,
    codFee: 0,
    deliveryFee: 0,
    paymentMethod: 'Razorpay UPI',
    status: 'PREPARING',
    itemsSummary: 'Fresh Litchi 1kg x 2, Organic Milk 1L x 1',
    createdAt: '2026-07-05 02:45 AM',
  },
  {
    id: '1003',
    shopName: 'Mau Medical Agency',
    customerName: 'Surendra Nath',
    city: 'Maunath Bhanjan',
    totalAmount: 150,
    codFee: 2,
    deliveryFee: 15,
    paymentMethod: 'COD',
    status: 'DELIVERED',
    itemsSummary: 'Paracetamol 650mg x 2, Hand Sanitizer x 1',
    createdAt: '2026-07-05 01:15 AM',
  },
];

export default function FladoAdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTabType>('approvals');
  const [loading, setLoading] = useState(false);

  // Pending shops state
  const [pendingShops, setPendingShops] = useState(INITIAL_MOCK_PENDING_SHOPS);
  const [selectedShopForApprove, setSelectedShopForApprove] = useState<typeof INITIAL_MOCK_PENDING_SHOPS[0] | null>(null);
  
  // Form states for approval
  const [monthlyFee, setMonthlyFee] = useState('1000');
  const [approvalNote, setApprovalNote] = useState('');
  const [approving, setApproving] = useState(false);

  // Form states for rejection
  const [selectedShopForReject, setSelectedShopForReject] = useState<typeof INITIAL_MOCK_PENDING_SHOPS[0] | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejecting, setRejecting] = useState(false);

  // Stats State
  const [totalShopsCount, setTotalShopsCount] = useState(14);
  const [approvedSubscriptionSum, setApprovedSubscriptionSum] = useState(12000);

  const fetchPendingShops = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/flado/admin/shops/pending');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setPendingShops(data);
      }
    } catch (e) {
      // Keep mock data as fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingShops();
  }, []);

  const handleApproveShop = async () => {
    if (!selectedShopForApprove) return;
    if (!monthlyFee || isNaN(Number(monthlyFee))) {
      Alert.alert('Error', 'Please enter a valid monthly subscription fee.');
      return;
    }

    setApproving(true);
    try {
      await fetch(`http://localhost:3000/flado/admin/shops/${selectedShopForApprove.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyFee: Number(monthlyFee),
          note: approvalNote,
        }),
      });
    } catch (e) {
      // Mock success on network failure
    }

    Alert.alert(
      'Shop Approved',
      `✅ '${selectedShopForApprove.shopName}' is now live on Flado.\nMonthly subscription fee set to ₹${monthlyFee}.`
    );

    // Update state
    setPendingShops(prev => prev.filter(s => s.id !== selectedShopForApprove.id));
    setTotalShopsCount(prev => prev + 1);
    setApprovedSubscriptionSum(prev => prev + Number(monthlyFee));

    // Reset
    setSelectedShopForApprove(null);
    setMonthlyFee('1000');
    setApprovalNote('');
    setApproving(false);
  };

  const handleRejectShop = async () => {
    if (!selectedShopForReject) return;
    if (!rejectReason) {
      Alert.alert('Error', 'Please specify a reason for rejection.');
      return;
    }

    setRejecting(true);
    try {
      await fetch(`http://localhost:3000/flado/admin/shops/${selectedShopForReject.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: rejectReason,
        }),
      });
    } catch (e) {
      // Mock success on network failure
    }

    Alert.alert(
      'Application Rejected',
      `❌ '${selectedShopForReject.shopName}' registration has been rejected.`
    );

    // Update state
    setPendingShops(prev => prev.filter(s => s.id !== selectedShopForReject.id));

    // Reset
    setSelectedShopForReject(null);
    setRejectReason('');
    setRejecting(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>🛡️ Flado Admin Control Panel</Text>
          <Text style={styles.headerSubtitle}>Muzaffarpur & Maunath Bhanjan Operations</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={fetchPendingShops}>
          <Ionicons name="refresh" size={20} color="#059669" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {[
          { key: 'approvals', label: `Approvals (${pendingShops.length})`, icon: 'checkbox-outline' },
          { key: 'orders', label: 'Live Orders', icon: 'pulse-outline' },
          { key: 'stats', label: 'Quick Stats', icon: 'analytics-outline' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab.key as AdminTabType)}
          >
            <Ionicons name={tab.icon as any} size={16} color={activeTab === tab.key ? '#059669' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#059669" style={{ flex: 1 }} />
      ) : (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          
          {/* TAB 1: PENDING APPROVALS */}
          {activeTab === 'approvals' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Pending Partner Shop Approvals</Text>
              
              {pendingShops.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="checkmark-circle-outline" size={48} color="#10B981" />
                  <Text style={styles.emptyTitle}>All Caught Up!</Text>
                  <Text style={styles.emptySub}>No pending grocery shop registration applications found.</Text>
                </View>
              ) : (
                pendingShops.map((shop) => {
                  let cats = [];
                  try {
                    cats = JSON.parse(shop.categoriesJson || '[]');
                  } catch (e) {
                    cats = [shop.categoriesJson];
                  }

                  return (
                    <View key={shop.id} style={styles.shopCard}>
                      <View style={styles.shopCardHeader}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.shopName}>{shop.shopName}</Text>
                          <Text style={styles.ownerText}>👤 {shop.ownerName} ({shop.ownerPhone})</Text>
                          <Text style={styles.addressText}>📍 {shop.address}</Text>
                        </View>
                        <View style={styles.cityBadge}>
                          <Text style={styles.cityBadgeText}>{shop.city}</Text>
                        </View>
                      </View>

                      <View style={styles.categoriesRow}>
                        {cats.map((cat: string, idx: number) => (
                          <View key={idx} style={styles.catBadge}>
                            <Text style={styles.catBadgeText}>{cat}</Text>
                          </View>
                        ))}
                      </View>

                      {shop.ownerStory ? (
                        <View style={styles.storyBox}>
                          <Text style={styles.storyTitle}>Shop Story / Description:</Text>
                          <Text style={styles.storyText}>"{shop.ownerStory}"</Text>
                        </View>
                      ) : null}

                      <View style={styles.divider} />

                      <View style={styles.actionRow}>
                        <TouchableOpacity
                          style={[styles.actionBtn, styles.rejectBtn]}
                          onPress={() => setSelectedShopForReject(shop)}
                        >
                          <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Reject</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={[styles.actionBtn, styles.approveBtn]}
                          onPress={() => setSelectedShopForApprove(shop)}
                        >
                          <Text style={[styles.actionBtnText, { color: 'white' }]}>Approve & Set Fee</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}

          {/* TAB 2: LIVE ORDERS */}
          {activeTab === 'orders' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Real-time Order Monitoring</Text>
              
              {MOCK_LIVE_ORDERS.map((order) => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderCardHeader}>
                    <View>
                      <Text style={styles.orderIdText}>Order #{order.id}</Text>
                      <Text style={styles.orderStoreText}>Store: {order.shopName}</Text>
                    </View>
                    <View style={styles.orderMetaCol}>
                      <Text style={styles.orderAmountText}>₹{order.totalAmount}</Text>
                      <View style={[
                        styles.statusBadge,
                        order.status === 'DELIVERED' ? styles.statusDelivered :
                        order.status === 'PREPARING' ? styles.statusPreparing :
                        styles.statusPlaced
                      ]}>
                        <Text style={styles.statusBadgeText}>{order.status}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.orderDetailBox}>
                    <Text style={styles.orderSummaryText}><Text style={{ fontWeight: '700' }}>Items:</Text> {order.itemsSummary}</Text>
                    <Text style={styles.orderUserText}>👤 Customer: {order.customerName} ({order.city})</Text>
                    <Text style={styles.orderPayText}>💳 Payment: {order.paymentMethod} {order.codFee > 0 ? `(COD Fee: ₹${order.codFee})` : ''}</Text>
                    <Text style={styles.orderTimeText}>🕒 Time: {order.createdAt}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* TAB 3: QUICK STATS */}
          {activeTab === 'stats' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Marketplace Operations Overview</Text>

              {/* Stats Cards */}
              <View style={styles.statsCardGrid}>
                <View style={styles.statsCard}>
                  <Text style={styles.statsValue}>{totalShopsCount}</Text>
                  <Text style={styles.statsLabel}>Approved Shops</Text>
                </View>
                <View style={styles.statsCard}>
                  <Text style={styles.statsValue}>₹{approvedSubscriptionSum.toLocaleString('en-IN')}</Text>
                  <Text style={styles.statsLabel}>Monthly Subscriptions (MRR)</Text>
                </View>
              </View>

              <View style={[styles.statsCardGrid, { marginTop: 12 }]}>
                <View style={styles.statsCard}>
                  <Text style={styles.statsValue}>Muzaffarpur</Text>
                  <Text style={styles.statsLabel}>Active Launch Zone 1</Text>
                </View>
                <View style={styles.statsCard}>
                  <Text style={styles.statsValue}>Maunath Bhanjan</Text>
                  <Text style={styles.statsLabel}>Active Launch Zone 2</Text>
                </View>
              </View>

              <View style={[styles.card, { marginTop: 16 }]}>
                <Text style={styles.cardHeader}>🚨 Commission & Surcharge Ledger</Text>
                <View style={styles.ledgerRow}>
                  <Text style={styles.ledgerLabel}>Platform COD Convenience Fee Surcharges</Text>
                  <Text style={styles.ledgerValue}>₹1,240</Text>
                </View>
                <View style={styles.ledgerRow}>
                  <Text style={styles.ledgerLabel}>Total Marketplace Orders Processed</Text>
                  <Text style={styles.ledgerValue}>182 orders</Text>
                </View>
                <View style={styles.ledgerRow}>
                  <Text style={styles.ledgerLabel}>Average Delivery Turnaround (Instant)</Text>
                  <Text style={styles.ledgerValue}>16.4 mins</Text>
                </View>
              </View>
            </View>
          )}

        </ScrollView>
      )}

      {/* APPROVAL MODAL */}
      <Modal visible={selectedShopForApprove !== null} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Approve Store Application</Text>
              <TouchableOpacity onPress={() => setSelectedShopForApprove(null)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalLabel}>Set Monthly Subscription Fee (₹) *</Text>
              <TextInput
                style={styles.modalInput}
                value={monthlyFee}
                onChangeText={setMonthlyFee}
                keyboardType="numeric"
                placeholder="e.g. 1000"
              />
              <Text style={styles.helpText}>This monthly fee is manually set at approval time based on shop size, categories, and volume.</Text>

              <Text style={styles.modalLabel}>Approval Notes / Special Agreements</Text>
              <TextInput
                style={[styles.modalInput, { height: 60 }]}
                value={approvalNote}
                onChangeText={setApprovalNote}
                placeholder="e.g. First 3 months free trial, standard kirana rate applied."
                multiline
              />

              <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleApproveShop} disabled={approving}>
                {approving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.modalSubmitBtnText}>Approve Partner Shop</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* REJECTION MODAL */}
      <Modal visible={selectedShopForReject !== null} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reject Application</Text>
              <TouchableOpacity onPress={() => setSelectedShopForReject(null)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalLabel}>Specify Reason for Rejection *</Text>
              <TextInput
                style={[styles.modalInput, { height: 80 }]}
                value={rejectReason}
                onChangeText={setRejectReason}
                placeholder="e.g. Shop categories not compatible, address could not be verified by field agent."
                multiline
              />

              <TouchableOpacity style={[styles.modalSubmitBtn, { backgroundColor: '#EF4444' }]} onPress={handleRejectShop} disabled={rejecting}>
                {rejecting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.modalSubmitBtnText}>Reject Application</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
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
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    padding: 4,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14.5,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '600',
  },
  refreshBtn: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#059669',
  },
  tabText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#059669',
    fontWeight: '800',
  },
  scrollContainer: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10B981',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 16,
  },
  shopCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  shopCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  shopName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  ownerText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
    marginTop: 4,
  },
  addressText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  cityBadge: {
    backgroundColor: '#EEF2F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cityBadgeText: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  catBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  catBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#065F46',
  },
  storyBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  storyTitle: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  storyText: {
    fontSize: 11,
    color: '#4B5563',
    fontStyle: 'italic',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 14,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtn: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  approveBtn: {
    borderColor: '#059669',
    backgroundColor: '#059669',
  },
  actionBtnText: {
    fontSize: 11.5,
    fontWeight: 'bold',
  },
  orderCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderIdText: {
    fontSize: 13.5,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  orderStoreText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
    marginTop: 2,
  },
  orderMetaCol: {
    alignItems: 'flex-end',
  },
  orderAmountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  statusPlaced: {
    backgroundColor: '#FEF3C7',
  },
  statusPreparing: {
    backgroundColor: '#DBEAFE',
  },
  statusDelivered: {
    backgroundColor: '#D1FAE5',
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  orderDetailBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    gap: 6,
  },
  orderSummaryText: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 16,
  },
  orderUserText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  orderPayText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  orderTimeText: {
    fontSize: 10.5,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  statsCardGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statsCard: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  statsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  statsLabel: {
    fontSize: 10.5,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 16,
  },
  cardHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  ledgerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  ledgerLabel: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
  },
  ledgerValue: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1F2937',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalScroll: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#4B5563',
    marginBottom: 6,
    marginTop: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1F2937',
    marginBottom: 10,
    backgroundColor: '#F9FAFB',
  },
  helpText: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 10,
    lineHeight: 14,
  },
  modalSubmitBtn: {
    backgroundColor: '#059669',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  modalSubmitBtnText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
