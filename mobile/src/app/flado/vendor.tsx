import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, Modal,
  Dimensions, Switch, Animated, RefreshControl, Image,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { api } from '../../utils/api';
import { Product } from '../../utils/mockData';
import { fladoProductsData } from '../../utils/fladoProducts';

const { width } = Dimensions.get('window');

const VENDOR_ID = 'vendor-muzaffarpur';
const SHOP_ID = 'shop-muzaffarpur-01';

// ─── COLOR SYSTEM ────────────────────────────────────────────────────────────
const C = {
  primary: '#059669',
  primaryDark: '#047857',
  primaryLight: '#ECFDF5',
  accent: '#F59E0B',
  accentLight: '#FFFBEB',
  danger: '#EF4444',
  dangerLight: '#FEF2F2',
  warning: '#F97316',
  blue: '#3B82F6',
  blueLight: '#EFF6FF',
  purple: '#8B5CF6',
  purpleLight: '#F5F3FF',
  dark: '#0F172A',
  darkCard: '#1E293B',
  text: '#1F2937',
  textLight: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  bg: '#F8FAFC',
  white: '#FFFFFF',
  headerGrad1: '#0A1628',
  headerGrad2: '#065F46',
};

// ─── TYPES ────────────────────────────────────────────────────────────────────
type BottomTab = 'dashboard' | 'orders' | 'store' | 'analytics' | 'earnings';
type StoreSubTab = 'inventory' | 'riders' | 'promos' | 'delivery' | 'credit' | 'profile';
type OrderFilter = 'all' | 'PLACED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
type AnalyticsPeriod = 'today' | 'week' | 'month';

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_ORDERS = [
  { id: 'ORD-2841', status: 'PLACED', totalAmount: 348, createdAt: new Date(Date.now() - 90000), shippingAddress: JSON.stringify({ name: 'Raju Prasad', phone: '9876511111', address: 'Station Road, Muzaffarpur' }), items: [{ name: 'Amul Gold Full Cream Milk', qty: 2, price: 66 }, { name: 'Britannia Digestive Biscuits', qty: 1, price: 40 }, { name: 'Tata Sampann Chana Dal', qty: 1, price: 176 }] },
  { id: 'ORD-2840', status: 'PREPARING', totalAmount: 189, createdAt: new Date(Date.now() - 480000), shippingAddress: JSON.stringify({ name: 'Meena Devi', phone: '9876522222', address: 'Ahiyapur Mandi, Muzaffarpur' }), items: [{ name: 'Farm Fresh Tomatoes', qty: 1, price: 49 }, { name: 'Haldiram Bhujia', qty: 1, price: 60 }, { name: 'Aashirvaad Atta 5kg', qty: 1, price: 80 }] },
  { id: 'ORD-2839', status: 'OUT_FOR_DELIVERY', totalAmount: 520, createdAt: new Date(Date.now() - 1200000), shippingAddress: JSON.stringify({ name: 'Suresh Kumar', phone: '9876533333', address: 'Chata Chowk, Club Road, Muzaffarpur' }), items: [{ name: 'A2 Gir Cow Desi Ghee 500ml', qty: 1, price: 420 }, { name: 'Himalaya Neem Face Wash', qty: 1, price: 100 }] },
  { id: 'ORD-2838', status: 'DELIVERED', totalAmount: 135, createdAt: new Date(Date.now() - 3600000), shippingAddress: JSON.stringify({ name: 'Priya Singh', phone: '9876544444', address: 'Brahmpura, Muzaffarpur' }), items: [{ name: 'Lay\'s Classic Salted Chips', qty: 2, price: 20 }, { name: 'Sprite 750ml PET Bottle', qty: 5, price: 19 }] },
  { id: 'ORD-2837', status: 'DELIVERED', totalAmount: 299, createdAt: new Date(Date.now() - 7200000), shippingAddress: JSON.stringify({ name: 'Anil Mehta', phone: '9876555555', address: 'Kanti Road, Muzaffarpur' }), items: [{ name: 'Nestlé Munch Chocolate Bar', qty: 3, price: 20 }, { name: 'Cadbury 5 Star 200g Pack', qty: 2, price: 50 }, { name: 'Mother Dairy Mishti Doi', qty: 1, price: 89 }] },
];

const MOCK_RIDERS = [
  { id: 'rider-1', name: 'Deepak Kumar', phone: '+91 97450 11001', vehicle: 'Bike', isAvailable: true, ordersToday: 7 },
  { id: 'rider-2', name: 'Santosh Yadav', phone: '+91 97450 22002', vehicle: 'Bike', isAvailable: false, ordersToday: 5 },
  { id: 'rider-3', name: 'Ravi Gupta', phone: '+91 97450 33003', vehicle: 'Cycle', isAvailable: true, ordersToday: 3 },
];

const MOCK_CREDIT_CUSTOMERS = [
  { id: 'cust-1', name: 'Raju Prasad', phone: '+91 98765 11111', creditLimit: 2000, outstanding: 800, status: 'ACTIVE' as const, transactions: [{ date: '2026-07-10', type: 'Credit', amount: 500, note: 'Rice & Dal' }, { date: '2026-07-15', type: 'Credit', amount: 300, note: 'Vegetables' }] },
  { id: 'cust-2', name: 'Meena Devi', phone: '+91 98765 22222', creditLimit: 1500, outstanding: 1500, status: 'FROZEN' as const, transactions: [{ date: '2026-07-01', type: 'Credit', amount: 1500, note: 'Monthly groceries' }] },
  { id: 'cust-3', name: 'Suresh Kumar', phone: '+91 98765 33333', creditLimit: 1000, outstanding: 0, status: 'SETTLED' as const, transactions: [{ date: '2026-06-25', type: 'Credit', amount: 600, note: 'Dairy items' }, { date: '2026-07-01', type: 'Payment', amount: 600, note: 'Full repayment' }] },
  { id: 'cust-4', name: 'Anita Sharma', phone: '+91 98765 44444', creditLimit: 3000, outstanding: 2100, status: 'ACTIVE' as const, transactions: [{ date: '2026-07-05', type: 'Credit', amount: 1200, note: 'Monthly kirana' }, { date: '2026-07-12', type: 'Credit', amount: 900, note: 'Festival items' }] },
];

const MOCK_PROMOS = [
  { id: 'promo-1', code: 'MYSTORE20', type: '% OFF', value: 20, minOrder: 199, validTill: '2026-08-15', isActive: true, uses: 14 },
  { id: 'promo-2', code: 'FLAT50', type: 'Flat OFF', value: 50, minOrder: 299, validTill: '2026-07-31', isActive: true, uses: 8 },
  { id: 'promo-3', code: 'FREEDEL', type: 'Free Delivery', value: 0, minOrder: 99, validTill: '2026-07-25', isActive: false, uses: 32 },
];

const MOCK_WEEKLY_REVENUE = [1240, 1890, 2100, 980, 2650, 3100, 1780];
const MOCK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MOCK_CATEGORY_SPLIT = [
  { label: 'Kirana & Staples', percent: 34, color: C.primary },
  { label: 'Fruits & Veggies', percent: 22, color: '#10B981' },
  { label: 'Dairy & Bread', percent: 18, color: C.blue },
  { label: 'Snacks & Bev', percent: 16, color: C.accent },
  { label: 'Personal Care', percent: 10, color: C.purple },
];
const MOCK_PAYOUTS = [
  { id: 'pay-1', date: '14 Jul 2026', amount: 8420, bank: '****4521', status: 'PAID' },
  { id: 'pay-2', date: '7 Jul 2026', amount: 7180, bank: '****4521', status: 'PAID' },
  { id: 'pay-3', date: '30 Jun 2026', amount: 9250, bank: '****4521', status: 'PAID' },
  { id: 'pay-4', date: '21 Jul 2026', amount: 11400, bank: '****4521', status: 'PENDING' },
];

// ─── STORE HOURS INITIAL STATE ────────────────────────────────────────────────
const INITIAL_HOURS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => ({
  day, isOpen: true, openTime: '06:00', closeTime: i === 6 ? '22:00' : '23:00',
}));

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function FladoVendorDashboard() {
  const router = useRouter();

  // ── Nav State ──
  const [activeTab, setActiveTab] = useState<BottomTab>('dashboard');
  const [storeSubTab, setStoreSubTab] = useState<StoreSubTab>('inventory');
  const [orderFilter, setOrderFilter] = useState<OrderFilter>('all');
  const [analyticsPeriod, setAnalyticsPeriod] = useState<AnalyticsPeriod>('week');

  // ── Loading / Refresh ──
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [notifications, setNotifications] = useState(2);

  // ── Store Profile ──
  const [storeName, setStoreName] = useState('Flado Express · Station Road');
  const [address, setAddress] = useState('Station Road, Opposite Junction, Muzaffarpur 842001');
  const [lat, setLat] = useState('26.1209');
  const [lng, setLng] = useState('85.3647');
  const [rangeKm, setRangeKm] = useState(2.5);
  const [ownerName, setOwnerName] = useState('Ramesh Yadav');
  const [contactPhone, setContactPhone] = useState('+91 99999 11111');

  // ── Inventory ──
  const [products, setProducts] = useState<Product[]>(fladoProductsData);
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCatFilter, setInventoryCatFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDiscountPrice, setNewDiscountPrice] = useState('');
  const [newWeight, setNewWeight] = useState('500g');
  const [newCategory, setNewCategory] = useState('fruits-vegetables');
  const [newDescription, setNewDescription] = useState('');
  const [newStock, setNewStock] = useState('40');
  const [newImageUrl, setNewImageUrl] = useState('');

  // ── Orders ──
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectOrderId, setRejectOrderId] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showAssignRiderModal, setShowAssignRiderModal] = useState(false);
  const [assignOrderId, setAssignOrderId] = useState('');

  // ── Riders ──
  const [riders, setRiders] = useState(MOCK_RIDERS);
  const [showAddRiderModal, setShowAddRiderModal] = useState(false);
  const [riderName, setRiderName] = useState('');
  const [riderPhone, setRiderPhone] = useState('');
  const [riderVehicle, setRiderVehicle] = useState<'Bike' | 'Cycle'>('Bike');

  // ── Promos ──
  const [promos, setPromos] = useState(MOCK_PROMOS);
  const [showCreatePromoModal, setShowCreatePromoModal] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoType, setPromoType] = useState('% OFF');
  const [promoValue, setPromoValue] = useState('');
  const [promoMinOrder, setPromoMinOrder] = useState('');
  const [promoValidTill, setPromoValidTill] = useState('');

  // ── Credit ──
  const [creditCustomers, setCreditCustomers] = useState(MOCK_CREDIT_CUSTOMERS);
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
  const [showGrantCreditModal, setShowGrantCreditModal] = useState(false);
  const [grantName, setGrantName] = useState('');
  const [grantPhone, setGrantPhone] = useState('');
  const [grantLimit, setGrantLimit] = useState('');
  const [grantNotes, setGrantNotes] = useState('');

  // ── Delivery ──
  const [deliveryType, setDeliveryType] = useState<'FREE' | 'PAID'>('FREE');
  const [deliveryFeeAmount, setDeliveryFeeAmount] = useState('');
  const [storeHours, setStoreHours] = useState(INITIAL_HOURS);
  const [is247, setIs247] = useState(false);

  // ── Pulse Animation for NEW orders ──
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // ── Load Data ──
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const prods = await api.getStoreProducts(VENDOR_ID);
      if (prods && prods.length > 0) setProducts(prods);
    } catch (e) {
      // Keep local fladoProductsData
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => { loadData(); }, []);

  // ─── COMPUTED METRICS ─────────────────────────────────────────────────────
  const newOrders = orders.filter(o => o.status === 'PLACED');
  const preparingOrders = orders.filter(o => o.status === 'PREPARING');
  const dispatchedOrders = orders.filter(o => o.status === 'OUT_FOR_DELIVERY');
  const deliveredOrders = orders.filter(o => o.status === 'DELIVERED');
  const todayGMV = orders.reduce((s, o) => s + o.totalAmount, 0);
  const lowStockProducts = products.filter(p => (p.stock || 0) <= 5);
  const totalCreditOutstanding = creditCustomers.reduce((s, c) => s + c.outstanding, 0);

  // ─── FILTERED PRODUCTS ────────────────────────────────────────────────────
  const filteredProducts = products.filter(p => {
    const matchSearch = !inventorySearch || p.name.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchCat = inventoryCatFilter === 'all' || p.category === inventoryCatFilter;
    return matchSearch && matchCat;
  });

  const filteredOrders = orders.filter(o => orderFilter === 'all' || o.status === orderFilter);

  // ─── HANDLERS ─────────────────────────────────────────────────────────────

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.updateStoreRange(VENDOR_ID, rangeKm, Number(lat), Number(lng));
      Alert.alert('Saved! ✅', 'Store profile updated successfully.');
    } catch (e) {
      Alert.alert('Saved!', 'Store profile saved locally.');
    } finally { setSaving(false); }
  };

  const handleAddProduct = async () => {
    if (!newTitle || !newPrice) {
      Alert.alert('Required', 'Product name and price are required.');
      return;
    }
    const newProd: any = {
      id: `prod-${Date.now()}`,
      name: newTitle,
      price: Number(newDiscountPrice || newPrice),
      originalPrice: Number(newPrice),
      image: newImageUrl || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&fit=crop',
      category: newCategory,
      description: newDescription,
      rating: 4.5,
      reviews: [],
      isFlado: true,
      colors: [],
      sizes: [],
      stock: Number(newStock || 40),
      weight: newWeight,
    };
    setProducts(prev => [newProd, ...prev]);
    Alert.alert('Listed! 🎉', `${newTitle} added to your catalog.`);
    setShowAddModal(false);
    setNewTitle(''); setNewPrice(''); setNewDiscountPrice('');
    setNewWeight('500g'); setNewCategory('fruits-vegetables');
    setNewDescription(''); setNewStock('40'); setNewImageUrl('');
  };

  const handleAdjustStock = (productId: string, delta: number) => {
    setProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, stock: Math.max(0, (p.stock || 0) + delta) } : p
    ));
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    Alert.alert('Remove Listing', `Remove '${productName}' from your store?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setProducts(prev => prev.filter(p => p.id !== productId)) },
    ]);
  };

  const handleOrderAction = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (newStatus === 'PREPARING') Alert.alert('Order Accepted ✅', `Order #${orderId} is now being prepared.`);
    if (newStatus === 'OUT_FOR_DELIVERY') Alert.alert('Dispatched 🛵', `Order #${orderId} is out for delivery.`);
    if (newStatus === 'DELIVERED') Alert.alert('Delivered 🎉', `Order #${orderId} marked as delivered.`);
  };

  const handleRejectOrder = () => {
    if (!rejectReason) { Alert.alert('Select a reason', 'Please select a rejection reason.'); return; }
    setOrders(prev => prev.filter(o => o.id !== rejectOrderId));
    Alert.alert('Order Rejected', `Order #${rejectOrderId} rejected: ${rejectReason}`);
    setShowRejectModal(false); setRejectOrderId(''); setRejectReason('');
  };

  const handleAddRider = () => {
    if (!riderName || !riderPhone) { Alert.alert('Required', 'Name and phone are required.'); return; }
    setRiders(prev => [{ id: `rider-${Date.now()}`, name: riderName, phone: riderPhone, vehicle: riderVehicle, isAvailable: true, ordersToday: 0 }, ...prev]);
    Alert.alert('Rider Added ✅', `${riderName} added to your fleet.`);
    setShowAddRiderModal(false); setRiderName(''); setRiderPhone(''); setRiderVehicle('Bike');
  };

  const handleCreatePromo = () => {
    if (!promoCode || !promoValue) { Alert.alert('Required', 'Code and value are required.'); return; }
    setPromos(prev => [{ id: `promo-${Date.now()}`, code: promoCode.toUpperCase(), type: promoType, value: Number(promoValue), minOrder: Number(promoMinOrder || 99), validTill: promoValidTill || '2026-12-31', isActive: true, uses: 0 }, ...prev]);
    Alert.alert('Promo Created! 🎉', `Coupon ${promoCode.toUpperCase()} is now live.`);
    setShowCreatePromoModal(false); setPromoCode(''); setPromoValue(''); setPromoMinOrder(''); setPromoValidTill('');
  };

  const handleGrantCredit = () => {
    if (!grantName || !grantPhone || !grantLimit) { Alert.alert('Required', 'Name, phone, and limit are required.'); return; }
    setCreditCustomers(prev => [{ id: `cust-${Date.now()}`, name: grantName, phone: grantPhone, creditLimit: Number(grantLimit), outstanding: 0, status: 'ACTIVE' as const, transactions: [] }, ...prev]);
    Alert.alert('Credit Granted ✅', `Credit account created for ${grantName}.`);
    setShowGrantCreditModal(false); setGrantName(''); setGrantPhone(''); setGrantLimit(''); setGrantNotes('');
  };

  const handleCreditAction = (customerId: string, action: 'remind' | 'freeze' | 'settle') => {
    setCreditCustomers(prev => prev.map(c => {
      if (c.id !== customerId) return c;
      if (action === 'remind') { Alert.alert('Reminder Sent 📱', `SMS sent to ${c.phone}`); return c; }
      if (action === 'freeze') { const ns = c.status === 'FROZEN' ? 'ACTIVE' : 'FROZEN'; Alert.alert('Updated', `Account ${ns}`); return { ...c, status: ns as any }; }
      if (action === 'settle') { Alert.alert('Settled ✓', 'Account marked as fully settled.'); return { ...c, status: 'SETTLED' as const, outstanding: 0 }; }
      return c;
    }));
  };

  const handle247Toggle = (val: boolean) => {
    setIs247(val);
    if (val) setStoreHours(prev => prev.map(h => ({ ...h, isOpen: true, openTime: '00:00', closeTime: '23:59' })));
    else setStoreHours(INITIAL_HOURS);
  };

  // ─── RENDER HELPERS ───────────────────────────────────────────────────────

  const getOrderElapsed = (createdAt: Date) => {
    const mins = Math.floor((Date.now() - createdAt.getTime()) / 60000);
    return mins < 60 ? `${mins}m ago` : `${Math.floor(mins / 60)}h ago`;
  };

  const renderOrderStatusBadge = (status: string) => {
    const configs: any = {
      PLACED: { bg: '#FEF2F2', color: C.danger, label: '🔴 NEW' },
      PREPARING: { bg: '#FFFBEB', color: '#D97706', label: '🟡 PREPARING' },
      OUT_FOR_DELIVERY: { bg: '#EFF6FF', color: C.blue, label: '🔵 DISPATCHED' },
      DELIVERED: { bg: C.primaryLight, color: C.primary, label: '✅ DELIVERED' },
    };
    const cfg = configs[status] || { bg: '#F3F4F6', color: '#6B7280', label: status };
    return (
      <View style={[s.orderBadge, { backgroundColor: cfg.bg }]}>
        <Text style={[s.orderBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
      </View>
    );
  };

  // ─── TAB: DASHBOARD ───────────────────────────────────────────────────────
  const renderDashboard = () => {
    const maxRev = Math.max(...MOCK_WEEKLY_REVENUE);
    return (
      <ScrollView style={s.tabScroll} contentContainerStyle={s.tabScrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={C.primary} />}>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <TouchableOpacity style={s.alertBanner} onPress={() => { setActiveTab('store'); setStoreSubTab('inventory'); }}>
            <Ionicons name="warning" size={16} color="#92400E" />
            <Text style={s.alertBannerText}> ⚠️ {lowStockProducts.length} item{lowStockProducts.length > 1 ? 's' : ''} running low on stock — tap to restock</Text>
            <Ionicons name="chevron-forward" size={14} color="#92400E" />
          </TouchableOpacity>
        )}

        {/* Metric Cards 2×2 */}
        <View style={s.metricsGrid}>
          <View style={[s.metricCard, { borderLeftColor: C.primary }]}>
            <Text style={s.metricValue}>₹{todayGMV.toLocaleString('en-IN')}</Text>
            <Text style={s.metricLabel}>Today's Revenue</Text>
            <Ionicons name="trending-up" size={18} color={C.primary} style={s.metricIcon} />
          </View>
          <View style={[s.metricCard, { borderLeftColor: C.blue }]}>
            <Text style={s.metricValue}>{orders.length}</Text>
            <Text style={s.metricLabel}>Total Orders</Text>
            <Ionicons name="receipt" size={18} color={C.blue} style={s.metricIcon} />
          </View>
          <View style={[s.metricCard, { borderLeftColor: C.accent }]}>
            <Text style={s.metricValue}>4.8 ⭐</Text>
            <Text style={s.metricLabel}>Store Rating</Text>
            <Ionicons name="star" size={18} color={C.accent} style={s.metricIcon} />
          </View>
          <View style={[s.metricCard, { borderLeftColor: C.purple }]}>
            <Text style={s.metricValue}>~9 min</Text>
            <Text style={s.metricLabel}>Avg Prep Time</Text>
            <Ionicons name="timer" size={18} color={C.purple} style={s.metricIcon} />
          </View>
        </View>

        {/* Order Pipeline */}
        <View style={s.card}>
          <Text style={s.cardTitle}>📋 Live Order Pipeline</Text>
          <View style={s.pipelineRow}>
            {[
              { label: 'New', count: newOrders.length, color: C.danger, icon: 'alert-circle' },
              { label: 'Preparing', count: preparingOrders.length, color: C.accent, icon: 'time' },
              { label: 'Dispatched', count: dispatchedOrders.length, color: C.blue, icon: 'bicycle' },
              { label: 'Delivered', count: deliveredOrders.length, color: C.primary, icon: 'checkmark-circle' },
            ].map((stage, i) => (
              <TouchableOpacity key={i} style={s.pipelineStage}
                onPress={() => { setActiveTab('orders'); setOrderFilter(stage.label === 'New' ? 'PLACED' : stage.label === 'Preparing' ? 'PREPARING' : stage.label === 'Dispatched' ? 'OUT_FOR_DELIVERY' : 'DELIVERED'); }}>
                <View style={[s.pipelineCount, { backgroundColor: stage.color + '20', borderColor: stage.color }]}>
                  <Text style={[s.pipelineCountText, { color: stage.color }]}>{stage.count}</Text>
                </View>
                <Text style={s.pipelineLabel}>{stage.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 7-Day Revenue Chart */}
        <View style={s.card}>
          <View style={s.cardHeaderRow}>
            <Text style={s.cardTitle}>📊 7-Day Revenue</Text>
            <Text style={s.cardSubValue}>₹{MOCK_WEEKLY_REVENUE.reduce((a, b) => a + b, 0).toLocaleString('en-IN')} total</Text>
          </View>
          <View style={s.barChart}>
            {MOCK_WEEKLY_REVENUE.map((rev, i) => {
              const isToday = i === 6;
              const barH = Math.max(8, (rev / maxRev) * 80);
              return (
                <View key={i} style={s.barColumn}>
                  <Text style={[s.barValue, isToday && { color: C.primary, fontWeight: '800' }]}>
                    {rev >= 1000 ? `${(rev / 1000).toFixed(1)}k` : rev}
                  </Text>
                  <View style={[s.bar, { height: barH, backgroundColor: isToday ? C.primary : '#D1FAE5' }]} />
                  <Text style={[s.barDay, isToday && { color: C.primary, fontWeight: '800' }]}>{MOCK_DAYS[i]}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={s.card}>
          <Text style={s.cardTitle}>⚡ Quick Actions</Text>
          {[
            [
              { icon: 'add-circle', label: 'Add Product', color: C.primary, action: () => { setActiveTab('store'); setStoreSubTab('inventory'); setShowAddModal(true); } },
              { icon: 'power', label: isOnline ? 'Go Offline' : 'Go Online', color: isOnline ? C.danger : C.primary, action: () => { setIsOnline(!isOnline); Alert.alert(isOnline ? 'Store Offline' : 'Store Online ✅', isOnline ? 'Your store is now offline. No new orders.' : 'Your store is now accepting orders!'); } },
            ],
            [
              { icon: 'notifications', label: `Alerts (${notifications})`, color: C.accent, action: () => { setNotifications(0); Alert.alert('Alerts', 'No new alerts at this time.'); } },
              { icon: 'call', label: 'Flado Support', color: C.blue, action: () => Alert.alert('Support', 'Connecting to Flado Partner Support...') },
            ],
          ].map((row, rowIdx) => (
            <View key={rowIdx} style={s.quickActionsRow}>
              {row.map((action, i) => (
                <TouchableOpacity key={i} style={[s.quickActionBtn, { borderColor: action.color + '40', backgroundColor: action.color + '10' }]}
                  onPress={action.action} activeOpacity={0.7}>
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                  <Text style={[s.quickActionLabel, { color: action.color }]}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {/* Top Products Today */}
        <View style={s.card}>
          <Text style={s.cardTitle}>🏆 Top Products Today</Text>
          {products.slice(0, 5).map((p, i) => (
            <View key={p.id} style={s.topProductRow}>
              <View style={[s.topProductRank, { backgroundColor: i === 0 ? '#FEF3C7' : '#F3F4F6' }]}>
                <Text style={[s.topProductRankText, { color: i === 0 ? '#D97706' : '#6B7280' }]}>#{i + 1}</Text>
              </View>
              <Image source={{ uri: p.image }} style={s.topProductImg} />
              <View style={{ flex: 1 }}>
                <Text style={s.topProductName} numberOfLines={1}>{p.name}</Text>
                <Text style={s.topProductSales}>₹{p.price} · {Math.floor(Math.random() * 8) + 2} sold today</Text>
              </View>
              <Text style={s.topProductRevenue}>₹{(p.price * (Math.floor(Math.random() * 8) + 2)).toLocaleString('en-IN')}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  // ─── TAB: ORDERS ──────────────────────────────────────────────────────────
  const renderOrders = () => (
    <View style={{ flex: 1 }}>
      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterChipScroll} contentContainerStyle={s.filterChipContainer}>
        {(['all', 'PLACED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'] as OrderFilter[]).map(f => {
          const labels: any = { all: 'All Orders', PLACED: `🔴 New (${newOrders.length})`, PREPARING: `🟡 Preparing`, OUT_FOR_DELIVERY: `🔵 Dispatched`, DELIVERED: `✅ Delivered` };
          return (
            <TouchableOpacity key={f} style={[s.filterChip, orderFilter === f && s.filterChipActive]} onPress={() => setOrderFilter(f)}>
              <Text style={[s.filterChipText, orderFilter === f && s.filterChipTextActive]}>{labels[f]}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView style={s.tabScroll} contentContainerStyle={s.tabScrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={C.primary} />}>
        {filteredOrders.length === 0 && (
          <View style={s.emptyState}>
            <Ionicons name="receipt-outline" size={48} color={C.textMuted} />
            <Text style={s.emptyTitle}>No Orders Here</Text>
            <Text style={s.emptySub}>Incoming orders will appear here in real-time.</Text>
          </View>
        )}
        {filteredOrders.map(order => {
          let customerName = 'Customer', phone = '', deliveryAddress = 'Muzaffarpur';
          try { const a = JSON.parse(order.shippingAddress); customerName = a.name; phone = a.phone; deliveryAddress = a.address; } catch (e) {}
          const isNew = order.status === 'PLACED';
          const elapsed = getOrderElapsed(order.createdAt);

          return (
            <Animated.View key={order.id}
              style={[s.orderCard, isNew && { transform: [{ scale: pulseAnim }], borderColor: C.danger, borderWidth: 2, shadowColor: C.danger, shadowRadius: 8, shadowOpacity: 0.3, elevation: 6 }]}>
              {/* Order Header */}
              <View style={s.orderCardHeader}>
                <View>
                  <Text style={s.orderId}>Order {order.id}</Text>
                  <Text style={s.orderElapsed}>{elapsed}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  {renderOrderStatusBadge(order.status)}
                  <Text style={s.orderAmount}>₹{order.totalAmount}</Text>
                </View>
              </View>

              {/* Items List */}
              <View style={s.orderItemsList}>
                {order.items.map((item: any, i: number) => (
                  <View key={i} style={s.orderItemRow}>
                    <Text style={s.orderItemDot}>•</Text>
                    <Text style={s.orderItemText}>{item.qty}× {item.name}</Text>
                    <Text style={s.orderItemPrice}>₹{item.price * item.qty}</Text>
                  </View>
                ))}
              </View>

              {/* Customer Info */}
              <View style={s.orderCustomerRow}>
                <Ionicons name="person-circle-outline" size={14} color={C.textLight} />
                <Text style={s.orderCustomerText}> {customerName} · {phone}</Text>
              </View>
              <View style={s.orderCustomerRow}>
                <Ionicons name="location-outline" size={14} color={C.textLight} />
                <Text style={s.orderCustomerText}> {deliveryAddress}</Text>
              </View>

              <View style={s.divider} />

              {/* Actions */}
              <View style={s.orderActions}>
                {order.status === 'PLACED' && (
                  <>
                    <TouchableOpacity style={[s.orderActionBtn, { backgroundColor: C.primary, flex: 1 }]}
                      onPress={() => handleOrderAction(order.id, 'PREPARING')}>
                      <Ionicons name="checkmark" size={14} color="white" />
                      <Text style={s.orderActionBtnText}> Accept & Prepare</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[s.orderActionBtn, { backgroundColor: C.danger, marginLeft: 8 }]}
                      onPress={() => { setRejectOrderId(order.id); setShowRejectModal(true); }}>
                      <Ionicons name="close" size={14} color="white" />
                      <Text style={s.orderActionBtnText}> Reject</Text>
                    </TouchableOpacity>
                  </>
                )}
                {order.status === 'PREPARING' && (
                  <>
                    <TouchableOpacity style={[s.orderActionBtn, { backgroundColor: C.blue, flex: 1 }]}
                      onPress={() => handleOrderAction(order.id, 'OUT_FOR_DELIVERY')}>
                      <Ionicons name="bicycle" size={14} color="white" />
                      <Text style={s.orderActionBtnText}> Dispatch with Rider</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[s.orderActionBtn, { backgroundColor: '#F3F4F6', marginLeft: 8 }]}
                      onPress={() => { setAssignOrderId(order.id); setShowAssignRiderModal(true); }}>
                      <Ionicons name="person-add" size={14} color={C.text} />
                      <Text style={[s.orderActionBtnText, { color: C.text }]}> Rider</Text>
                    </TouchableOpacity>
                  </>
                )}
                {order.status === 'OUT_FOR_DELIVERY' && (
                  <TouchableOpacity style={[s.orderActionBtn, { backgroundColor: '#10B981', flex: 1 }]}
                    onPress={() => handleOrderAction(order.id, 'DELIVERED')}>
                    <Ionicons name="checkmark-done" size={14} color="white" />
                    <Text style={s.orderActionBtnText}> Mark Delivered</Text>
                  </TouchableOpacity>
                )}
                {order.status === 'DELIVERED' && (
                  <View style={s.deliveredTag}>
                    <Ionicons name="checkmark-circle" size={16} color={C.primary} />
                    <Text style={s.deliveredTagText}> Order Completed Successfully</Text>
                  </View>
                )}
              </View>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );

  // ─── TAB: STORE ───────────────────────────────────────────────────────────
  const STORE_SUBTABS: { key: StoreSubTab; label: string; icon: string }[] = [
    { key: 'inventory', label: 'Inventory', icon: 'cube' },
    { key: 'riders', label: 'Riders', icon: 'bicycle' },
    { key: 'promos', label: 'Promos', icon: 'pricetag' },
    { key: 'delivery', label: 'Delivery', icon: 'car' },
    { key: 'credit', label: 'Credit', icon: 'wallet' },
    { key: 'profile', label: 'Profile', icon: 'storefront' },
  ];

  const INV_CATS = [
    { key: 'all', label: 'All' },
    { key: 'fruits-vegetables', label: '🥬 Veggies' },
    { key: 'dairy-bread-eggs', label: '🥛 Dairy' },
    { key: 'kirana', label: '🛒 Kirana' },
    { key: 'snacks-beverages', label: '🍿 Snacks' },
    { key: 'pharmacy', label: '💊 Medical' },
  ];

  const renderInventory = () => (
    <>
      <View style={s.invHeaderRow}>
        <View style={s.searchBox}>
          <Ionicons name="search" size={16} color={C.textLight} />
          <TextInput style={s.searchInput} value={inventorySearch} onChangeText={setInventorySearch}
            placeholder="Search products..." placeholderTextColor={C.textMuted} />
          {!!inventorySearch && <TouchableOpacity onPress={() => setInventorySearch('')}><Ionicons name="close-circle" size={16} color={C.textLight} /></TouchableOpacity>}
        </View>
        <TouchableOpacity style={s.addProductBtn} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={18} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catFilterScroll} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {INV_CATS.map(c => (
          <TouchableOpacity key={c.key} style={[s.catChip, inventoryCatFilter === c.key && s.catChipActive]}
            onPress={() => setInventoryCatFilter(c.key)}>
            <Text style={[s.catChipText, inventoryCatFilter === c.key && s.catChipTextActive]}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredProducts.length === 0 && (
        <View style={s.emptyState}>
          <Ionicons name="cube-outline" size={48} color={C.textMuted} />
          <Text style={s.emptyTitle}>No Products Found</Text>
          <Text style={s.emptySub}>Try a different search or category.</Text>
        </View>
      )}
      {filteredProducts.map(item => {
        const isLowStock = (item.stock || 0) <= 5;
        const discount = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;
        return (
          <View key={item.id} style={s.invCard}>
            <Image source={{ uri: item.image || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200' }} style={s.invCardImg} />
            <View style={s.invCardBody}>
              <View style={s.invCardTitleRow}>
                <Text style={s.invCardName} numberOfLines={1}>{item.name}</Text>
                {isLowStock && <View style={s.lowStockBadge}><Text style={s.lowStockText}>LOW</Text></View>}
                {discount > 0 && <View style={s.discountBadge}><Text style={s.discountBadgeText}>{discount}% OFF</Text></View>}
              </View>
              <Text style={s.invCardMeta}>{item.weight || '500g'} · {item.category}</Text>
              <Text style={s.invCardPrice}>₹{item.price} <Text style={s.invCardOrigPrice}>₹{item.originalPrice}</Text></Text>
            </View>
            <View style={s.invCardActions}>
              <View style={s.stockStepper}>
                <TouchableOpacity style={s.stockStepBtn} onPress={() => handleAdjustStock(item.id, -1)}>
                  <Ionicons name="remove" size={13} color={C.text} />
                </TouchableOpacity>
                <Text style={[s.stockStepValue, isLowStock && { color: C.danger, fontWeight: '800' }]}>{item.stock || 0}</Text>
                <TouchableOpacity style={s.stockStepBtn} onPress={() => handleAdjustStock(item.id, 1)}>
                  <Ionicons name="add" size={13} color={C.text} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={s.deleteBtn} onPress={() => handleDeleteProduct(item.id, item.name)}>
                <Ionicons name="trash-outline" size={15} color={C.danger} />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </>
  );

  const renderRiders = () => (
    <>
      <View style={s.subTabActionRow}>
        <Text style={s.subTabTitle}>Rider Fleet ({riders.length})</Text>
        <TouchableOpacity style={s.addBtn} onPress={() => setShowAddRiderModal(true)}>
          <Ionicons name="add" size={16} color="white" />
          <Text style={s.addBtnText}> Add Rider</Text>
        </TouchableOpacity>
      </View>
      {riders.map(rider => (
        <View key={rider.id} style={s.riderCard}>
          <View style={[s.riderAvatar, { backgroundColor: rider.isAvailable ? C.primaryLight : '#F3F4F6' }]}>
            <Ionicons name="person" size={22} color={rider.isAvailable ? C.primary : C.textLight} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.riderName}>{rider.name}</Text>
            <Text style={s.riderPhone}>{rider.phone} · {rider.vehicle === 'Bike' ? '🛵 Bike' : '🚲 Cycle'}</Text>
            <Text style={s.riderStats}>{rider.ordersToday} deliveries today</Text>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 8 }}>
            <Switch value={rider.isAvailable}
              onValueChange={v => setRiders(prev => prev.map(r => r.id === rider.id ? { ...r, isAvailable: v } : r))}
              trackColor={{ false: '#E5E7EB', true: '#A7F3D0' }} thumbColor={rider.isAvailable ? C.primary : '#9CA3AF'} />
            <TouchableOpacity onPress={() => Alert.alert('Call Rider', `Calling ${rider.name} at ${rider.phone}`)}>
              <Ionicons name="call" size={18} color={C.blue} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </>
  );

  const renderPromos = () => (
    <>
      <View style={s.subTabActionRow}>
        <Text style={s.subTabTitle}>My Promotions</Text>
        <TouchableOpacity style={s.addBtn} onPress={() => setShowCreatePromoModal(true)}>
          <Ionicons name="add" size={16} color="white" />
          <Text style={s.addBtnText}> Create Promo</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={s.flashSaleBtn}
        onPress={() => { Alert.alert('⚡ Flash Sale Activated!', '20% OFF on all items for the next 1 hour!'); }}>
        <Ionicons name="flash" size={18} color="white" />
        <Text style={s.flashSaleBtnText}> ⚡ Start 1-Hour Flash Sale (20% OFF Store-Wide)</Text>
      </TouchableOpacity>
      {promos.map(promo => (
        <View key={promo.id} style={s.promoCard}>
          <View style={s.promoCardLeft}>
            <View style={[s.promoBadge, { backgroundColor: promo.isActive ? C.primaryLight : '#F3F4F6' }]}>
              <Text style={[s.promoBadgeText, { color: promo.isActive ? C.primary : C.textLight }]}>
                {promo.isActive ? 'ACTIVE' : 'PAUSED'}
              </Text>
            </View>
            <Text style={s.promoCode}>{promo.code}</Text>
            <Text style={s.promoDetails}>{promo.type}: {promo.type === '% OFF' ? `${promo.value}%` : promo.type === 'Flat OFF' ? `₹${promo.value}` : 'Free'} · Min ₹{promo.minOrder}</Text>
            <Text style={s.promoMeta}>Valid till {promo.validTill} · Used {promo.uses}×</Text>
          </View>
          <Switch value={promo.isActive}
            onValueChange={v => setPromos(prev => prev.map(p => p.id === promo.id ? { ...p, isActive: v } : p))}
            trackColor={{ false: '#E5E7EB', true: '#A7F3D0' }} thumbColor={promo.isActive ? C.primary : '#9CA3AF'} />
        </View>
      ))}
    </>
  );

  const renderDelivery = () => (
    <>
      <View style={s.card}>
        <Text style={s.cardTitle}>🚲 Delivery Fee</Text>
        <View style={s.segControl}>
          {(['FREE', 'PAID'] as const).map(t => (
            <TouchableOpacity key={t} style={[s.segBtn, deliveryType === t && s.segBtnActive]} onPress={() => setDeliveryType(t)}>
              <Text style={[s.segBtnText, deliveryType === t && s.segBtnTextActive]}>{t === 'FREE' ? '🎁 FREE' : '💰 PAID'}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {deliveryType === 'PAID' && (
          <>
            <Text style={s.label}>Delivery Fee (₹)</Text>
            <TextInput style={s.input} value={deliveryFeeAmount} onChangeText={setDeliveryFeeAmount} keyboardType="numeric" placeholder="e.g. 30" />
          </>
        )}
        {deliveryType === 'FREE' && (
          <View style={s.infoBanner}>
            <Ionicons name="checkmark-circle" size={16} color={C.primary} />
            <Text style={s.infoBannerText}> Customers get free delivery from your store.</Text>
          </View>
        )}
        <TouchableOpacity style={s.saveBtn} onPress={() => Alert.alert('Saved ✅', `Delivery set to ${deliveryType === 'FREE' ? 'FREE' : `₹${deliveryFeeAmount}`}`)}>
          <Ionicons name="save-outline" size={16} color="white" />
          <Text style={s.saveBtnText}> Save Delivery Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={s.card}>
        <View style={s.cardHeaderRow}>
          <Text style={s.cardTitle}>🕐 Store Hours</Text>
          <View style={s.row}>
            <Text style={[s.label, { marginBottom: 0, marginRight: 8 }]}>24/7</Text>
            <Switch value={is247} onValueChange={handle247Toggle}
              trackColor={{ false: '#E5E7EB', true: '#A7F3D0' }} thumbColor={is247 ? C.primary : '#9CA3AF'} />
          </View>
        </View>
        {storeHours.map((h, i) => (
          <View key={h.day} style={s.hoursRow}>
            <Text style={s.hoursDayLabel}>{h.day}</Text>
            <Switch value={h.isOpen} disabled={is247}
              onValueChange={v => setStoreHours(prev => prev.map((d, j) => j === i ? { ...d, isOpen: v } : d))}
              trackColor={{ false: '#E5E7EB', true: '#A7F3D0' }} thumbColor={h.isOpen ? C.primary : '#9CA3AF'} />
            {h.isOpen ? (
              <View style={s.hoursTimeRow}>
                <TextInput style={s.hoursInput} value={h.openTime}
                  onChangeText={v => setStoreHours(prev => prev.map((d, j) => j === i ? { ...d, openTime: v } : d))}
                  placeholder="06:00" editable={!is247} />
                <Text style={{ color: C.textLight, marginHorizontal: 4 }}>–</Text>
                <TextInput style={s.hoursInput} value={h.closeTime}
                  onChangeText={v => setStoreHours(prev => prev.map((d, j) => j === i ? { ...d, closeTime: v } : d))}
                  placeholder="22:00" editable={!is247} />
              </View>
            ) : (
              <Text style={{ color: C.textLight, fontSize: 12, marginLeft: 8 }}>Closed</Text>
            )}
          </View>
        ))}
        <TouchableOpacity style={[s.saveBtn, { marginTop: 12 }]} onPress={() => Alert.alert('Saved ✅', 'Store hours updated.')}>
          <Ionicons name="save-outline" size={16} color="white" />
          <Text style={s.saveBtnText}> Save Store Hours</Text>
        </TouchableOpacity>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>📡 Delivery Radius</Text>
        <Text style={s.label}>Selected: <Text style={{ color: C.primary, fontWeight: '800' }}>{rangeKm.toFixed(1)} km</Text></Text>
        <View style={s.radiusGrid}>
          {[0.5, 1.0, 1.5, 2.0, 2.5, 3.0].map(v => (
            <TouchableOpacity key={v} style={[s.radiusChip, rangeKm === v && s.radiusChipActive]} onPress={() => setRangeKm(v)}>
              <Text style={[s.radiusChipText, rangeKm === v && s.radiusChipTextActive]}>{v < 1 ? '500m' : `${v}km`}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );

  const renderCredit = () => (
    <>
      {/* Outstanding Summary */}
      <View style={[s.card, { backgroundColor: totalCreditOutstanding > 3000 ? '#FEF2F2' : C.primaryLight, borderColor: totalCreditOutstanding > 3000 ? C.danger : C.primary, borderWidth: 1 }]}>
        <View style={s.row}>
          <View>
            <Text style={s.cardTitle}>💳 Total Outstanding</Text>
            <Text style={[s.metricValue, { color: totalCreditOutstanding > 3000 ? C.danger : C.primary, fontSize: 28 }]}>₹{totalCreditOutstanding.toLocaleString('en-IN')}</Text>
          </View>
          <Ionicons name={totalCreditOutstanding > 3000 ? 'warning' : 'checkmark-circle'} size={36} color={totalCreditOutstanding > 3000 ? C.danger : C.primary} />
        </View>
        <Text style={s.helpText}>{creditCustomers.filter(c => c.status === 'FROZEN').length} frozen · {creditCustomers.filter(c => c.status === 'SETTLED').length} settled · {creditCustomers.filter(c => c.status === 'ACTIVE').length} active</Text>
      </View>

      <View style={s.disclaimerBanner}>
        <Ionicons name="warning" size={14} color="#92400E" />
        <Text style={s.disclaimerText}> Credit decisions are your responsibility. Flado is not liable for unpaid amounts.</Text>
      </View>

      <TouchableOpacity style={s.grantCreditBtn} onPress={() => setShowGrantCreditModal(true)}>
        <Ionicons name="add-circle-outline" size={18} color="white" />
        <Text style={s.grantCreditBtnText}> Grant Credit to Customer</Text>
      </TouchableOpacity>

      {creditCustomers.map(customer => (
        <View key={customer.id} style={s.creditCard}>
          <TouchableOpacity style={s.creditCardHeader}
            onPress={() => setExpandedCustomer(expandedCustomer === customer.id ? null : customer.id)}>
            <View style={s.creditAvatarCircle}>
              <Text style={s.creditAvatarText}>{customer.name[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.creditName}>{customer.name}</Text>
              <Text style={s.creditPhone}>{customer.phone}</Text>
              <View style={s.row}>
                <Text style={s.creditLimitText}>Limit: ₹{customer.creditLimit} | </Text>
                <Text style={[s.creditDueText, { color: customer.outstanding > 0 ? C.danger : C.primary }]}>Due: ₹{customer.outstanding}</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <View style={[s.statusPill, customer.status === 'ACTIVE' ? s.statusActive : customer.status === 'FROZEN' ? s.statusFrozen : s.statusSettled]}>
                <Text style={s.statusPillText}>{customer.status}</Text>
              </View>
              <Ionicons name={expandedCustomer === customer.id ? 'chevron-up' : 'chevron-down'} size={14} color={C.textMuted} style={{ marginTop: 6 }} />
            </View>
          </TouchableOpacity>
          <View style={s.creditActionsRow}>
            <TouchableOpacity style={s.creditActionBtn} onPress={() => handleCreditAction(customer.id, 'remind')}>
              <Text style={s.creditActionText}>📱 Remind</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.creditActionBtn, { borderColor: customer.status === 'FROZEN' ? C.primary : C.blue }]}
              onPress={() => handleCreditAction(customer.id, 'freeze')}>
              <Text style={[s.creditActionText, { color: customer.status === 'FROZEN' ? C.primary : C.blue }]}>
                {customer.status === 'FROZEN' ? '♻️ Restore' : '❄️ Freeze'}
              </Text>
            </TouchableOpacity>
            {customer.status !== 'SETTLED' && (
              <TouchableOpacity style={[s.creditActionBtn, { borderColor: C.primary }]} onPress={() => handleCreditAction(customer.id, 'settle')}>
                <Text style={[s.creditActionText, { color: C.primary }]}>✓ Settle</Text>
              </TouchableOpacity>
            )}
          </View>
          {expandedCustomer === customer.id && (
            <View style={s.txnHistory}>
              <Text style={s.txnHistoryTitle}>Transaction History</Text>
              {customer.transactions.map((txn, i) => (
                <View key={i} style={s.txnRow}>
                  <View>
                    <Text style={s.txnDate}>{txn.date}</Text>
                    <Text style={s.txnNote}>{txn.note}</Text>
                  </View>
                  <Text style={[s.txnAmount, { color: txn.type === 'Payment' ? C.primary : C.danger }]}>
                    {txn.type === 'Payment' ? '-' : '+'}₹{txn.amount}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </>
  );

  const renderProfile = () => (
    <>
      <View style={s.card}>
        <Text style={s.cardTitle}>🏪 Store Details</Text>
        <Text style={s.label}>Shop Name</Text>
        <TextInput style={s.input} value={storeName} onChangeText={setStoreName} placeholder="Shop name" />
        <Text style={s.label}>Physical Address</Text>
        <TextInput style={[s.input, { height: 60 }]} value={address} onChangeText={setAddress} placeholder="Full address" multiline />
        <View style={s.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={s.label}>Owner Name</Text>
            <TextInput style={s.input} value={ownerName} onChangeText={setOwnerName} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.label}>Contact Phone</Text>
            <TextInput style={s.input} value={contactPhone} onChangeText={setContactPhone} keyboardType="phone-pad" />
          </View>
        </View>
      </View>
      <View style={s.card}>
        <Text style={s.cardTitle}>📍 GPS Coordinates</Text>
        <View style={s.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={s.label}>Latitude</Text>
            <TextInput style={s.input} value={lat} onChangeText={setLat} keyboardType="numeric" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.label}>Longitude</Text>
            <TextInput style={s.input} value={lng} onChangeText={setLng} keyboardType="numeric" />
          </View>
        </View>
        <TouchableOpacity style={s.gpsBtn} onPress={() => { setLat('26.1209'); setLng('85.3647'); Alert.alert('GPS Captured 📡', 'Muzaffarpur Station Road coordinates set.'); }}>
          <Ionicons name="locate" size={16} color="white" />
          <Text style={s.gpsBtnText}> Capture Current GPS Location</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={[s.saveBtn, { margin: 16 }]} onPress={handleSaveProfile} disabled={saving}>
        {saving ? <ActivityIndicator size="small" color="white" /> : (
          <><Ionicons name="checkmark-circle-outline" size={18} color="white" /><Text style={s.saveBtnText}> Save Store Profile</Text></>
        )}
      </TouchableOpacity>
    </>
  );

  const renderStore = () => (
    <View style={{ flex: 1 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.subTabScroll} contentContainerStyle={s.subTabContainer}>
        {STORE_SUBTABS.map(tab => (
          <TouchableOpacity key={tab.key} style={[s.subTabBtn, storeSubTab === tab.key && s.subTabBtnActive]}
            onPress={() => setStoreSubTab(tab.key)}>
            <Ionicons name={tab.icon as any} size={14} color={storeSubTab === tab.key ? C.primary : C.textLight} />
            <Text style={[s.subTabText, storeSubTab === tab.key && s.subTabTextActive]}> {tab.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView style={s.tabScroll} contentContainerStyle={s.tabScrollContent}>
        {storeSubTab === 'inventory' && renderInventory()}
        {storeSubTab === 'riders' && renderRiders()}
        {storeSubTab === 'promos' && renderPromos()}
        {storeSubTab === 'delivery' && renderDelivery()}
        {storeSubTab === 'credit' && renderCredit()}
        {storeSubTab === 'profile' && renderProfile()}
      </ScrollView>
    </View>
  );

  // ─── TAB: ANALYTICS ───────────────────────────────────────────────────────
  const renderAnalytics = () => {
    const maxRev = Math.max(...MOCK_WEEKLY_REVENUE);
    const PEAK_HOURS = Array.from({ length: 24 }, (_, h) => {
      const density = h >= 7 && h <= 9 ? 0.8 : h >= 12 && h <= 14 ? 0.9 : h >= 18 && h <= 21 ? 1.0 : h >= 6 && h <= 22 ? 0.3 : 0.05;
      return { hour: h, density };
    });
    return (
      <ScrollView style={s.tabScroll} contentContainerStyle={s.tabScrollContent}>
        {/* Period Selector */}
        <View style={s.periodSelector}>
          {(['today', 'week', 'month'] as AnalyticsPeriod[]).map(p => (
            <TouchableOpacity key={p} style={[s.periodBtn, analyticsPeriod === p && s.periodBtnActive]} onPress={() => setAnalyticsPeriod(p)}>
              <Text style={[s.periodBtnText, analyticsPeriod === p && s.periodBtnTextActive]}>
                {p === 'today' ? 'Today' : p === 'week' ? 'This Week' : 'This Month'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Stat Cards */}
        <View style={s.analyticsStatsRow}>
          {[
            { label: 'Revenue', value: analyticsPeriod === 'today' ? '₹1,780' : analyticsPeriod === 'week' ? '₹13,740' : '₹52,180', color: C.primary },
            { label: 'Orders', value: analyticsPeriod === 'today' ? '14' : analyticsPeriod === 'week' ? '98' : '374', color: C.blue },
            { label: 'Avg Order', value: '₹314', color: C.accent },
          ].map((stat, i) => (
            <View key={i} style={[s.analyticsStatCard, { borderBottomColor: stat.color }]}>
              <Text style={[s.analyticsStatValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={s.analyticsStatLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Revenue Bar Chart */}
        <View style={s.card}>
          <Text style={s.cardTitle}>📊 Daily Revenue</Text>
          <View style={s.barChart}>
            {MOCK_WEEKLY_REVENUE.map((rev, i) => {
              const isToday = i === 6;
              const barH = Math.max(8, (rev / maxRev) * 90);
              return (
                <View key={i} style={s.barColumn}>
                  <Text style={[s.barValue, isToday && { color: C.primary, fontWeight: '800' }]}>
                    {rev >= 1000 ? `${(rev / 1000).toFixed(1)}k` : rev}
                  </Text>
                  <View style={[s.bar, { height: barH, backgroundColor: isToday ? C.primary : '#BBF7D0', borderRadius: 4 }]} />
                  <Text style={[s.barDay, isToday && { color: C.primary, fontWeight: '800' }]}>{MOCK_DAYS[i]}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={s.card}>
          <Text style={s.cardTitle}>🏷️ Revenue by Category</Text>
          {MOCK_CATEGORY_SPLIT.map(cat => (
            <View key={cat.label} style={s.catBreakRow}>
              <Text style={s.catBreakLabel}>{cat.label}</Text>
              <View style={s.catBreakBar}>
                <View style={[s.catBreakFill, { width: `${cat.percent}%` as any, backgroundColor: cat.color }]} />
              </View>
              <Text style={[s.catBreakPercent, { color: cat.color }]}>{cat.percent}%</Text>
            </View>
          ))}
        </View>

        {/* Peak Hours Heatmap */}
        <View style={s.card}>
          <Text style={s.cardTitle}>⏰ Peak Hours</Text>
          <View style={s.heatmapGrid}>
            {PEAK_HOURS.map(({ hour, density }) => (
              <View key={hour} style={[s.heatCell, { backgroundColor: `rgba(5, 150, 105, ${density})` }]}>
                <Text style={[s.heatCellText, { color: density > 0.5 ? 'white' : C.textMuted }]}>{hour}</Text>
              </View>
            ))}
          </View>
          <View style={s.heatmapLegend}>
            <Text style={s.heatLegendText}>Low</Text>
            {[0.1, 0.3, 0.6, 0.9].map(d => (
              <View key={d} style={[s.heatLegendBox, { backgroundColor: `rgba(5,150,105,${d})` }]} />
            ))}
            <Text style={s.heatLegendText}>Peak</Text>
          </View>
        </View>

        {/* Top 5 Products */}
        <View style={s.card}>
          <Text style={s.cardTitle}>🏆 Top Products by Revenue</Text>
          {products.slice(0, 5).map((p, i) => {
            const rev = p.price * (6 - i);
            const maxPRev = products[0].price * 6;
            return (
              <View key={p.id} style={s.topProdRow}>
                <Text style={[s.topProdRank, { color: i === 0 ? '#D97706' : C.textLight }]}>#{i + 1}</Text>
                <Image source={{ uri: p.image }} style={s.topProdImg} />
                <View style={{ flex: 1 }}>
                  <Text style={s.topProdName} numberOfLines={1}>{p.name}</Text>
                  <View style={s.topProdBarBg}>
                    <View style={[s.topProdBarFill, { width: `${(rev / maxPRev) * 100}%` as any }]} />
                  </View>
                </View>
                <Text style={s.topProdRev}>₹{rev.toLocaleString('en-IN')}</Text>
              </View>
            );
          })}
        </View>

        {/* Retention Rate */}
        <View style={[s.card, { flexDirection: 'row', alignItems: 'center' }]}>
          <View style={[s.retentionRing, { borderColor: C.primary }]}>
            <Text style={s.retentionPercent}>68%</Text>
            <Text style={s.retentionLabel}>Repeat</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={s.cardTitle}>Customer Retention</Text>
            <Text style={s.helpText}>68% of your orders come from repeat customers. Industry avg is 45%.</Text>
            <View style={[s.infoBanner, { marginTop: 8 }]}>
              <Ionicons name="trending-up" size={14} color={C.primary} />
              <Text style={[s.infoBannerText, { color: C.primary }]}> Above average! Keep it up 🎉</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  // ─── TAB: EARNINGS ────────────────────────────────────────────────────────
  const renderEarnings = () => {
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 23);
    const daysLeft = 23;
    const subscRingProgress = daysLeft / 30;

    return (
      <ScrollView style={s.tabScroll} contentContainerStyle={s.tabScrollContent}>
        {/* Subscription Renewal */}
        <View style={s.card}>
          <View style={s.row}>
            <View>
              <Text style={s.cardTitle}>⭐ Flado Partner Pro</Text>
              <View style={[s.statusPill, s.statusActive, { alignSelf: 'flex-start', marginTop: 4 }]}>
                <Text style={s.statusPillText}>ACTIVE</Text>
              </View>
              <Text style={[s.helpText, { marginTop: 8 }]}>Monthly Fee: ₹1,000 / month</Text>
              <Text style={s.helpText}>Billing: Paid ✅</Text>
              <Text style={s.helpText}>Valid Until: {validUntil.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
            </View>
            <View style={s.renewalRingOuter}>
              <View style={[s.renewalRingInner, { borderColor: C.primary }]}>
                <Text style={s.renewalDaysText}>{daysLeft}</Text>
                <Text style={s.renewalDaysLabel}>days left</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Commission Breakdown */}
        <View style={s.card}>
          <Text style={s.cardTitle}>💸 Commission Breakdown (This Week)</Text>
          {[
            { label: 'Gross Revenue', value: '₹13,740', color: C.text },
            { label: 'Flado Platform Fee (8%)', value: '− ₹1,099', color: C.danger },
            { label: 'Payment Gateway (1.5%)', value: '− ₹206', color: C.warning },
            { label: 'Net Payout', value: '₹12,435', color: C.primary, bold: true },
          ].map((row, i) => (
            <View key={i} style={[s.commissionRow, i > 0 && { borderTopColor: '#F3F4F6', borderTopWidth: 1 }]}>
              <Text style={[s.commissionLabel, row.bold && { fontWeight: '800' }]}>{row.label}</Text>
              <Text style={[s.commissionValue, { color: row.color }, row.bold && { fontWeight: '800', fontSize: 16 }]}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* Revenue Bar Chart */}
        <View style={s.card}>
          <Text style={s.cardTitle}>📈 Weekly Payout Trend</Text>
          <View style={s.barChart}>
            {[8420, 7180, 9250, 6800, 11200, 10450, 12435].map((v, i) => {
              const maxV = 12435;
              const h = Math.max(8, (v / maxV) * 80);
              const isLatest = i === 6;
              return (
                <View key={i} style={s.barColumn}>
                  <Text style={[s.barValue, isLatest && { color: C.primary, fontWeight: '800' }]}>
                    {(v / 1000).toFixed(1)}k
                  </Text>
                  <View style={[s.bar, { height: h, backgroundColor: isLatest ? C.primary : '#BBF7D0', borderRadius: 4 }]} />
                  <Text style={[s.barDay, isLatest && { color: C.primary, fontWeight: '800' }]}>W{i + 1}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Payout History */}
        <View style={s.card}>
          <Text style={s.cardTitle}>💳 Payout History</Text>
          {MOCK_PAYOUTS.map(payout => (
            <View key={payout.id} style={s.payoutRow}>
              <View style={[s.payoutIconBox, { backgroundColor: payout.status === 'PAID' ? C.primaryLight : '#FFFBEB' }]}>
                <Ionicons name={payout.status === 'PAID' ? 'checkmark-circle' : 'time'} size={20} color={payout.status === 'PAID' ? C.primary : C.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.payoutDate}>{payout.date}</Text>
                <Text style={s.payoutBank}>Bank ···{payout.bank.slice(-4)}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[s.payoutAmount, { color: payout.status === 'PAID' ? C.primary : C.accent }]}>₹{payout.amount.toLocaleString('en-IN')}</Text>
                <View style={[s.statusPill, payout.status === 'PAID' ? s.statusActive : { backgroundColor: '#FFFBEB' }]}>
                  <Text style={[s.statusPillText, payout.status !== 'PAID' && { color: '#D97706' }]}>{payout.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Bank Account Config */}
        <View style={s.card}>
          <Text style={s.cardTitle}>🏦 Bank & Payout Account</Text>
          {[
            { label: 'Account Number', value: 'XXXX XXXX 4521' },
            { label: 'IFSC Code', value: 'SBIN0005043' },
            { label: 'Bank Name', value: 'State Bank of India' },
            { label: 'UPI ID', value: 'ramesh.yadav@upi' },
          ].map((row, i) => (
            <View key={i} style={s.bankRow}>
              <Text style={s.bankLabel}>{row.label}</Text>
              <Text style={s.bankValue}>{row.value}</Text>
            </View>
          ))}
          <TouchableOpacity style={[s.saveBtn, { marginTop: 12, backgroundColor: C.dark }]}
            onPress={() => Alert.alert('Edit Bank Details', 'To update bank details, contact Flado Partner Support.')}>
            <Ionicons name="pencil" size={16} color="white" />
            <Text style={s.saveBtnText}> Edit Bank Details</Text>
          </TouchableOpacity>
        </View>

        {/* Invoice Downloads */}
        <View style={s.card}>
          <Text style={s.cardTitle}>📄 Invoices & Reports</Text>
          {[
            { icon: 'download-outline', label: 'Download Monthly Invoice (July 2026)', color: C.primary },
            { icon: 'document-text-outline', label: 'Download GST Report (Q2 2026)', color: C.blue },
            { icon: 'bar-chart-outline', label: 'Download Annual Sales Report', color: C.purple },
          ].map((doc, i) => (
            <TouchableOpacity key={i} style={[s.invoiceBtn, i > 0 && { marginTop: 10 }]}
              onPress={() => Alert.alert('Downloaded! 📥', `${doc.label} saved.`)}>
              <Ionicons name={doc.icon as any} size={18} color={doc.color} />
              <Text style={[s.invoiceBtnText, { color: doc.color }]}> {doc.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };

  // ─── MAIN RENDER ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={[s.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={[s.helpText, { marginTop: 12 }]}>Loading Merchant Portal...</Text>
      </SafeAreaView>
    );
  }

  const BOTTOM_TABS = [
    { key: 'dashboard' as BottomTab, label: 'Dashboard', icon: 'grid' },
    { key: 'orders' as BottomTab, label: 'Orders', icon: 'receipt', badge: newOrders.length },
    { key: 'store' as BottomTab, label: 'Store', icon: 'storefront', badge: lowStockProducts.length },
    { key: 'analytics' as BottomTab, label: 'Analytics', icon: 'bar-chart' },
    { key: 'earnings' as BottomTab, label: 'Earnings', icon: 'cash' },
  ];

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      {/* ─── PREMIUM DARK HEADER ─── */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={22} color="white" />
        </TouchableOpacity>

        <View style={s.headerCenter}>
          <View style={s.storeAvatarContainer}>
            <View style={s.storeAvatar}>
              <Text style={s.storeAvatarText}>{storeName[0] || 'F'}</Text>
            </View>
            {isOnline && <View style={s.onlineDot} />}
          </View>
          <View>
            <Text style={s.headerStoreName} numberOfLines={1}>{storeName}</Text>
            <View style={s.headerMeta}>
              <Ionicons name="shield-checkmark" size={10} color="#34D399" />
              <Text style={s.headerVerified}> Verified Partner</Text>
              <Text style={s.headerDot}> · </Text>
              <Text style={[s.headerOnlineStatus, { color: isOnline ? '#34D399' : '#F87171' }]}>
                {isOnline ? '🟢 OPEN' : '🔴 CLOSED'}
              </Text>
            </View>
          </View>
        </View>

        <View style={s.headerRight}>
          <TouchableOpacity style={s.headerIconBtn} onPress={() => setIsOnline(!isOnline)}>
            <Switch value={isOnline} onValueChange={setIsOnline}
              trackColor={{ false: '#4B5563', true: '#059669' }}
              thumbColor="white"
              style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }} />
          </TouchableOpacity>
          <TouchableOpacity style={s.headerIconBtn} onPress={() => setNotifications(0)}>
            <Ionicons name="notifications" size={20} color="white" />
            {notifications > 0 && (
              <View style={s.notifBadge}>
                <Text style={s.notifBadgeText}>{notifications}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── TAB CONTENT ─── */}
      <View style={{ flex: 1 }}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'store' && renderStore()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'earnings' && renderEarnings()}
      </View>

      {/* ─── BOTTOM NAV BAR ─── */}
      <View style={s.bottomNav}>
        {BOTTOM_TABS.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity key={tab.key} style={s.bottomNavItem} onPress={() => setActiveTab(tab.key)} activeOpacity={0.7}>
              <View style={[s.bottomNavIconContainer, isActive && s.bottomNavIconActive]}>
                <Ionicons name={tab.icon as any} size={20} color={isActive ? C.primary : C.textMuted} />
                {tab.badge && tab.badge > 0 ? (
                  <View style={s.bottomNavBadge}><Text style={s.bottomNavBadgeText}>{tab.badge}</Text></View>
                ) : null}
              </View>
              <Text style={[s.bottomNavLabel, isActive && s.bottomNavLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ─── MODALS ─── */}

      {/* Add Product Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={s.modalOverlay}>
            <View style={s.modalSheet}>
              <View style={s.modalHandle} />
              <View style={s.modalHeader}>
                <Text style={s.modalTitle}>📦 List New Product</Text>
                <TouchableOpacity onPress={() => setShowAddModal(false)}><Ionicons name="close" size={24} color={C.text} /></TouchableOpacity>
              </View>
              <ScrollView style={s.modalScroll} showsVerticalScrollIndicator={false}>
                <Text style={s.label}>Product Name *</Text>
                <TextInput style={s.input} value={newTitle} onChangeText={setNewTitle} placeholder="e.g. Fresh Litchi 500g" />
                <View style={s.row}>
                  <View style={{ flex: 1, marginRight: 8 }}><Text style={s.label}>MRP (₹) *</Text><TextInput style={s.input} value={newPrice} onChangeText={setNewPrice} keyboardType="numeric" placeholder="120" /></View>
                  <View style={{ flex: 1 }}><Text style={s.label}>Sale Price (₹)</Text><TextInput style={s.input} value={newDiscountPrice} onChangeText={setNewDiscountPrice} keyboardType="numeric" placeholder="99" /></View>
                </View>
                <View style={s.row}>
                  <View style={{ flex: 1, marginRight: 8 }}><Text style={s.label}>Weight / Pack</Text><TextInput style={s.input} value={newWeight} onChangeText={setNewWeight} placeholder="500g" /></View>
                  <View style={{ flex: 1 }}><Text style={s.label}>Stock Units</Text><TextInput style={s.input} value={newStock} onChangeText={setNewStock} keyboardType="numeric" placeholder="40" /></View>
                </View>
                <Text style={s.label}>Category</Text>
                <TextInput style={s.input} value={newCategory} onChangeText={setNewCategory} placeholder="fruits-vegetables" />
                <Text style={s.label}>Image URL</Text>
                <TextInput style={s.input} value={newImageUrl} onChangeText={setNewImageUrl} placeholder="https://images.unsplash.com/..." />
                <Text style={s.label}>Description</Text>
                <TextInput style={[s.input, { height: 60 }]} value={newDescription} onChangeText={setNewDescription} placeholder="Brief product description" multiline />
                <TouchableOpacity style={[s.saveBtn, { margin: 0, marginTop: 16 }]} onPress={handleAddProduct}>
                  <Ionicons name="add-circle-outline" size={18} color="white" />
                  <Text style={s.saveBtnText}> List on Flado</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Reject Order Modal */}
      <Modal visible={showRejectModal} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={[s.modalSheet, { maxHeight: 400 }]}>
            <View style={s.modalHandle} />
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>❌ Reject Order</Text>
              <TouchableOpacity onPress={() => { setShowRejectModal(false); setRejectReason(''); }}><Ionicons name="close" size={24} color={C.text} /></TouchableOpacity>
            </View>
            <Text style={[s.label, { marginHorizontal: 16 }]}>Select reason for rejection:</Text>
            {['Item out of stock', 'Store closing soon', 'Unable to deliver to address', 'Order too large', 'Technical issue'].map(reason => (
              <TouchableOpacity key={reason} style={[s.rejectOption, rejectReason === reason && s.rejectOptionActive]}
                onPress={() => setRejectReason(reason)}>
                <Ionicons name={rejectReason === reason ? 'radio-button-on' : 'radio-button-off'} size={18} color={rejectReason === reason ? C.danger : C.textLight} />
                <Text style={[s.rejectOptionText, rejectReason === reason && { color: C.danger }]}> {reason}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[s.saveBtn, { margin: 16, backgroundColor: C.danger }]} onPress={handleRejectOrder}>
              <Text style={s.saveBtnText}>Confirm Rejection</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Assign Rider Modal */}
      <Modal visible={showAssignRiderModal} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={[s.modalSheet, { maxHeight: 400 }]}>
            <View style={s.modalHandle} />
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>🛵 Assign Rider</Text>
              <TouchableOpacity onPress={() => setShowAssignRiderModal(false)}><Ionicons name="close" size={24} color={C.text} /></TouchableOpacity>
            </View>
            {riders.filter(r => r.isAvailable).map(rider => (
              <TouchableOpacity key={rider.id} style={s.riderPickRow}
                onPress={() => { Alert.alert('Rider Assigned ✅', `${rider.name} assigned to Order ${assignOrderId}`); setShowAssignRiderModal(false); }}>
                <View style={s.riderAvatar}><Ionicons name="person" size={20} color={C.primary} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={s.riderName}>{rider.name}</Text>
                  <Text style={s.riderPhone}>{rider.vehicle} · {rider.ordersToday} orders today</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={C.textLight} />
              </TouchableOpacity>
            ))}
            {riders.filter(r => r.isAvailable).length === 0 && (
              <Text style={[s.helpText, { textAlign: 'center', padding: 24 }]}>No riders available. Add riders in Store → Riders.</Text>
            )}
          </View>
        </View>
      </Modal>

      {/* Add Rider Modal */}
      <Modal visible={showAddRiderModal} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={s.modalOverlay}>
            <View style={[s.modalSheet, { maxHeight: 450 }]}>
              <View style={s.modalHandle} />
              <View style={s.modalHeader}>
                <Text style={s.modalTitle}>🛵 Add New Rider</Text>
                <TouchableOpacity onPress={() => setShowAddRiderModal(false)}><Ionicons name="close" size={24} color={C.text} /></TouchableOpacity>
              </View>
              <ScrollView style={s.modalScroll}>
                <Text style={s.label}>Rider Name *</Text>
                <TextInput style={s.input} value={riderName} onChangeText={setRiderName} placeholder="e.g. Deepak Kumar" />
                <Text style={s.label}>Phone Number *</Text>
                <TextInput style={s.input} value={riderPhone} onChangeText={setRiderPhone} keyboardType="phone-pad" placeholder="+91 97450 XXXXX" />
                <Text style={s.label}>Vehicle Type</Text>
                <View style={s.segControl}>
                  {(['Bike', 'Cycle'] as const).map(v => (
                    <TouchableOpacity key={v} style={[s.segBtn, riderVehicle === v && s.segBtnActive]} onPress={() => setRiderVehicle(v)}>
                      <Text style={[s.segBtnText, riderVehicle === v && s.segBtnTextActive]}>{v === 'Bike' ? '🛵 Motorbike' : '🚲 Cycle'}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity style={[s.saveBtn, { marginTop: 8 }]} onPress={handleAddRider}>
                  <Text style={s.saveBtnText}>Add Rider</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Create Promo Modal */}
      <Modal visible={showCreatePromoModal} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={s.modalOverlay}>
            <View style={[s.modalSheet, { maxHeight: 520 }]}>
              <View style={s.modalHandle} />
              <View style={s.modalHeader}>
                <Text style={s.modalTitle}>🏷️ Create Promotion</Text>
                <TouchableOpacity onPress={() => setShowCreatePromoModal(false)}><Ionicons name="close" size={24} color={C.text} /></TouchableOpacity>
              </View>
              <ScrollView style={s.modalScroll}>
                <Text style={s.label}>Coupon Code *</Text>
                <TextInput style={s.input} value={promoCode} onChangeText={t => setPromoCode(t.toUpperCase())} placeholder="e.g. SAVE30" autoCapitalize="characters" />
                <Text style={s.label}>Type</Text>
                <View style={s.segControl}>
                  {['% OFF', 'Flat OFF', 'Free Delivery'].map(t => (
                    <TouchableOpacity key={t} style={[s.segBtn, promoType === t && s.segBtnActive]} onPress={() => setPromoType(t)}>
                      <Text style={[s.segBtnText, promoType === t && s.segBtnTextActive]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {promoType !== 'Free Delivery' && (
                  <><Text style={s.label}>Discount Value {promoType === '% OFF' ? '(%)' : '(₹)'} *</Text>
                  <TextInput style={s.input} value={promoValue} onChangeText={setPromoValue} keyboardType="numeric" placeholder="e.g. 20" /></>
                )}
                <View style={s.row}>
                  <View style={{ flex: 1, marginRight: 8 }}><Text style={s.label}>Min Order (₹)</Text><TextInput style={s.input} value={promoMinOrder} onChangeText={setPromoMinOrder} keyboardType="numeric" placeholder="199" /></View>
                  <View style={{ flex: 1 }}><Text style={s.label}>Valid Till</Text><TextInput style={s.input} value={promoValidTill} onChangeText={setPromoValidTill} placeholder="2026-12-31" /></View>
                </View>
                <TouchableOpacity style={[s.saveBtn, { marginTop: 8 }]} onPress={handleCreatePromo}>
                  <Text style={s.saveBtnText}>Launch Promotion</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Grant Credit Modal */}
      <Modal visible={showGrantCreditModal} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={s.modalOverlay}>
            <View style={[s.modalSheet, { maxHeight: 480 }]}>
              <View style={s.modalHandle} />
              <View style={s.modalHeader}>
                <Text style={s.modalTitle}>💳 Grant Credit</Text>
                <TouchableOpacity onPress={() => setShowGrantCreditModal(false)}><Ionicons name="close" size={24} color={C.text} /></TouchableOpacity>
              </View>
              <ScrollView style={s.modalScroll}>
                <View style={s.disclaimerBanner}>
                  <Ionicons name="warning" size={14} color="#92400E" />
                  <Text style={s.disclaimerText}> You are fully responsible for credit decisions. Flado bears no liability.</Text>
                </View>
                <Text style={s.label}>Customer Name *</Text>
                <TextInput style={s.input} value={grantName} onChangeText={setGrantName} placeholder="e.g. Ramesh Kumar" />
                <Text style={s.label}>Phone Number *</Text>
                <TextInput style={s.input} value={grantPhone} onChangeText={setGrantPhone} keyboardType="phone-pad" placeholder="+91 98765 XXXXX" />
                <Text style={s.label}>Credit Limit (₹) *</Text>
                <TextInput style={s.input} value={grantLimit} onChangeText={setGrantLimit} keyboardType="numeric" placeholder="e.g. 1000" />
                <Text style={s.label}>Notes (optional)</Text>
                <TextInput style={s.input} value={grantNotes} onChangeText={setGrantNotes} placeholder="e.g. Regular monthly customer" />
                <TouchableOpacity style={[s.saveBtn, { marginTop: 8 }]} onPress={handleGrantCredit}>
                  <Text style={s.saveBtnText}>Grant Credit</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}

// ─── STYLESHEET ───────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, backgroundColor: C.dark, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  backBtn: { padding: 4, marginRight: 4 },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  storeAvatarContainer: { position: 'relative' },
  storeAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#34D399' },
  storeAvatarText: { color: 'white', fontWeight: '800', fontSize: 16 },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: '#34D399', borderWidth: 1.5, borderColor: C.dark },
  headerStoreName: { color: 'white', fontWeight: '800', fontSize: 13, letterSpacing: 0.2, maxWidth: width * 0.38 },
  headerMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 1 },
  headerVerified: { color: '#34D399', fontSize: 9.5, fontWeight: '700' },
  headerDot: { color: '#475569', fontSize: 9 },
  headerOnlineStatus: { fontSize: 9.5, fontWeight: '800' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerIconBtn: { padding: 6, position: 'relative' },
  notifBadge: { position: 'absolute', top: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: C.danger, alignItems: 'center', justifyContent: 'center' },
  notifBadgeText: { color: 'white', fontSize: 8, fontWeight: '900' },

  // Bottom Nav
  bottomNav: { flexDirection: 'row', backgroundColor: 'white', borderTopWidth: 1, borderTopColor: C.border, paddingBottom: 6, paddingTop: 4, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 12 },
  bottomNavItem: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  bottomNavIconContainer: { position: 'relative', padding: 4, borderRadius: 10 },
  bottomNavIconActive: { backgroundColor: C.primaryLight },
  bottomNavBadge: { position: 'absolute', top: 0, right: 0, minWidth: 14, height: 14, borderRadius: 7, backgroundColor: C.danger, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
  bottomNavBadgeText: { color: 'white', fontSize: 8, fontWeight: '900' },
  bottomNavLabel: { fontSize: 9.5, color: C.textMuted, fontWeight: '600', marginTop: 2 },
  bottomNavLabelActive: { color: C.primary, fontWeight: '800' },

  // Scroll containers
  tabScroll: { flex: 1 },
  tabScrollContent: { padding: 16, paddingBottom: 32, gap: 12 },

  // Cards
  card: { backgroundColor: 'white', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  cardTitle: { fontSize: 13.5, fontWeight: '800', color: C.text, marginBottom: 12, letterSpacing: 0.2 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardSubValue: { fontSize: 12, color: C.primary, fontWeight: '800' },

  // Metrics
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metricCard: { backgroundColor: 'white', borderRadius: 12, padding: 14, width: (width - 42) / 2, borderLeftWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3, position: 'relative' },
  metricValue: { fontSize: 20, fontWeight: '800', color: C.text, letterSpacing: -0.5 },
  metricLabel: { fontSize: 10.5, color: C.textLight, fontWeight: '600', marginTop: 2 },
  metricIcon: { position: 'absolute', top: 12, right: 12, opacity: 0.4 },

  // Pipeline
  pipelineRow: { flexDirection: 'row', justifyContent: 'space-around' },
  pipelineStage: { alignItems: 'center', gap: 6 },
  pipelineCount: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  pipelineCountText: { fontSize: 18, fontWeight: '900' },
  pipelineLabel: { fontSize: 10, color: C.textLight, fontWeight: '700' },

  // Bar Chart
  barChart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 110, marginTop: 8 },
  barColumn: { flex: 1, alignItems: 'center', gap: 3 },
  bar: { width: '65%', borderRadius: 4 },
  barValue: { fontSize: 8.5, color: C.textLight, fontWeight: '700' },
  barDay: { fontSize: 9, color: C.textLight, fontWeight: '700' },

  // Quick Actions
  quickActionsRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  quickActionBtn: { flex: 1, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 10, borderWidth: 1.5, alignItems: 'center', gap: 8 },
  quickActionLabel: { fontSize: 11.5, fontWeight: '800', textAlign: 'center' },

  // Top Products (Dashboard)
  topProductRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  topProductRank: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  topProductRankText: { fontSize: 11, fontWeight: '800' },
  topProductImg: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#F3F4F6' },
  topProductName: { fontSize: 12, fontWeight: '700', color: C.text },
  topProductSales: { fontSize: 10.5, color: C.textLight },
  topProductRevenue: { fontSize: 12, fontWeight: '800', color: C.primary },

  // Alert Banner
  alertBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FDE68A', borderRadius: 10, padding: 12, gap: 6 },
  alertBannerText: { flex: 1, fontSize: 12, color: '#92400E', fontWeight: '600' },

  // Order Cards
  orderCard: { backgroundColor: 'white', borderRadius: 14, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  orderCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  orderId: { fontSize: 13, fontWeight: '800', color: C.text },
  orderElapsed: { fontSize: 10.5, color: C.textLight, marginTop: 1 },
  orderBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  orderBadgeText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.3 },
  orderAmount: { fontSize: 16, fontWeight: '900', color: C.text, marginTop: 4 },
  orderItemsList: { backgroundColor: '#F8FAFC', borderRadius: 8, padding: 10, marginBottom: 8, gap: 4 },
  orderItemRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  orderItemDot: { color: C.textMuted, fontSize: 12 },
  orderItemText: { flex: 1, fontSize: 11.5, color: C.text, fontWeight: '600' },
  orderItemPrice: { fontSize: 11.5, color: C.textLight, fontWeight: '700' },
  orderCustomerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  orderCustomerText: { fontSize: 11, color: C.textLight },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 10 },
  orderActions: { flexDirection: 'row', alignItems: 'center' },
  orderActionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
  orderActionBtnText: { color: 'white', fontWeight: '800', fontSize: 12 },
  deliveredTag: { flexDirection: 'row', alignItems: 'center' },
  deliveredTagText: { color: C.primary, fontWeight: '700', fontSize: 12 },

  // Filter Chips
  filterChipScroll: { maxHeight: 46, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: C.border },
  filterChipContainer: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F3F4F6' },
  filterChipActive: { backgroundColor: C.primaryLight },
  filterChipText: { fontSize: 11.5, fontWeight: '700', color: C.textLight },
  filterChipTextActive: { color: C.primary },

  // Sub Tabs
  subTabScroll: { maxHeight: 46, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: C.border },
  subTabContainer: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  subTabBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F3F4F6' },
  subTabBtnActive: { backgroundColor: C.primaryLight },
  subTabText: { fontSize: 11.5, fontWeight: '700', color: C.textLight },
  subTabTextActive: { color: C.primary },
  subTabActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  subTabTitle: { fontSize: 14, fontWeight: '800', color: C.text },

  // Inventory
  invHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 10, borderWidth: 1, borderColor: C.border, paddingHorizontal: 10, paddingVertical: 8, gap: 6 },
  searchInput: { flex: 1, fontSize: 13, color: C.text, fontWeight: '600' },
  addProductBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  catFilterScroll: { maxHeight: 38, marginBottom: 4 },
  catChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F3F4F6', height: 30 },
  catChipActive: { backgroundColor: C.primaryLight },
  catChipText: { fontSize: 11, fontWeight: '700', color: C.textLight },
  catChipTextActive: { color: C.primary },
  invCard: { backgroundColor: 'white', borderRadius: 12, flexDirection: 'row', alignItems: 'center', padding: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, gap: 10 },
  invCardImg: { width: 52, height: 52, borderRadius: 10, backgroundColor: '#F3F4F6' },
  invCardBody: { flex: 1 },
  invCardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  invCardName: { flex: 1, fontSize: 12.5, fontWeight: '800', color: C.text },
  lowStockBadge: { backgroundColor: '#FEF2F2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  lowStockText: { fontSize: 9, fontWeight: '900', color: C.danger },
  discountBadge: { backgroundColor: '#ECFDF5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  discountBadgeText: { fontSize: 9, fontWeight: '900', color: C.primary },
  invCardMeta: { fontSize: 10, color: C.textLight, marginBottom: 2 },
  invCardPrice: { fontSize: 13, fontWeight: '800', color: C.text },
  invCardOrigPrice: { fontSize: 10, fontWeight: '600', color: C.textMuted, textDecorationLine: 'line-through' },
  invCardActions: { alignItems: 'center', gap: 8 },
  stockStepper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.border, borderRadius: 8 },
  stockStepBtn: { width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },
  stockStepValue: { width: 28, textAlign: 'center', fontSize: 13, fontWeight: '800', color: C.text },
  deleteBtn: { padding: 6 },

  // Riders
  riderCard: { backgroundColor: 'white', borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  riderAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  riderName: { fontSize: 13, fontWeight: '800', color: C.text },
  riderPhone: { fontSize: 11, color: C.textLight, marginTop: 1 },
  riderStats: { fontSize: 10, color: C.primary, fontWeight: '700', marginTop: 2 },
  riderPickRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },

  // Promos
  flashSaleBtn: { backgroundColor: '#FF4500', borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, marginBottom: 4 },
  flashSaleBtnText: { color: 'white', fontWeight: '800', fontSize: 13 },
  promoCard: { backgroundColor: 'white', borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  promoCardLeft: { flex: 1, gap: 4 },
  promoBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  promoBadgeText: { fontSize: 9, fontWeight: '900' },
  promoCode: { fontSize: 16, fontWeight: '900', color: C.text, letterSpacing: 1 },
  promoDetails: { fontSize: 11, color: C.textLight },
  promoMeta: { fontSize: 10, color: C.textMuted },

  // Delivery / Hours
  hoursRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  hoursDayLabel: { width: 36, fontSize: 12, fontWeight: '800', color: C.text },
  hoursTimeRow: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  hoursInput: { flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5, fontSize: 12, fontWeight: '700', color: C.text, textAlign: 'center' },
  radiusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  radiusChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6', borderWidth: 1.5, borderColor: 'transparent' },
  radiusChipActive: { backgroundColor: C.primaryLight, borderColor: C.primary },
  radiusChipText: { fontSize: 12, fontWeight: '700', color: C.textLight },
  radiusChipTextActive: { color: C.primary },

  // Credit
  creditCard: { backgroundColor: 'white', borderRadius: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3, overflow: 'hidden' },
  creditCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  creditAvatarCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  creditAvatarText: { fontSize: 18, fontWeight: '900', color: C.primary },
  creditName: { fontSize: 13.5, fontWeight: '800', color: C.text },
  creditPhone: { fontSize: 11, color: C.textLight, marginTop: 1 },
  creditLimitText: { fontSize: 11, color: C.textLight },
  creditDueText: { fontSize: 11, fontWeight: '800' },
  creditActionsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 14, paddingBottom: 12 },
  creditActionBtn: { flex: 1, paddingVertical: 7, borderRadius: 8, borderWidth: 1.5, borderColor: C.border, alignItems: 'center' },
  creditActionText: { fontSize: 11.5, fontWeight: '800', color: C.textLight },
  txnHistory: { backgroundColor: '#F8FAFC', padding: 12, borderTopWidth: 1, borderTopColor: C.border },
  txnHistoryTitle: { fontSize: 11.5, fontWeight: '800', color: C.text, marginBottom: 8 },
  txnRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  txnDate: { fontSize: 11, fontWeight: '700', color: C.text },
  txnNote: { fontSize: 10, color: C.textLight },
  txnAmount: { fontSize: 13, fontWeight: '900' },

  // Analytics
  periodSelector: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 10, padding: 3 },
  periodBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  periodBtnActive: { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  periodBtnText: { fontSize: 12, fontWeight: '700', color: C.textLight },
  periodBtnTextActive: { color: C.text, fontWeight: '800' },
  analyticsStatsRow: { flexDirection: 'row', gap: 10 },
  analyticsStatCard: { flex: 1, backgroundColor: 'white', borderRadius: 12, padding: 14, alignItems: 'center', borderBottomWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 },
  analyticsStatValue: { fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
  analyticsStatLabel: { fontSize: 10, color: C.textLight, fontWeight: '700', marginTop: 2 },
  catBreakRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  catBreakLabel: { width: 120, fontSize: 11, color: C.text, fontWeight: '700' },
  catBreakBar: { flex: 1, height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, overflow: 'hidden' },
  catBreakFill: { height: '100%', borderRadius: 4 },
  catBreakPercent: { width: 32, fontSize: 11, fontWeight: '800', textAlign: 'right' },
  heatmapGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  heatCell: { width: (width - 72) / 8, height: 28, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  heatCellText: { fontSize: 9, fontWeight: '700' },
  heatmapLegend: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  heatLegendText: { fontSize: 10, color: C.textLight },
  heatLegendBox: { width: 16, height: 10, borderRadius: 2 },
  topProdRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  topProdRank: { width: 24, fontSize: 13, fontWeight: '800', textAlign: 'center' },
  topProdImg: { width: 34, height: 34, borderRadius: 8, backgroundColor: '#F3F4F6' },
  topProdName: { fontSize: 11.5, fontWeight: '700', color: C.text, marginBottom: 4 },
  topProdBarBg: { height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden' },
  topProdBarFill: { height: '100%', backgroundColor: C.primary, borderRadius: 3 },
  topProdRev: { fontSize: 12, fontWeight: '800', color: C.primary, width: 56, textAlign: 'right' },
  retentionRing: { width: 80, height: 80, borderRadius: 40, borderWidth: 5, alignItems: 'center', justifyContent: 'center' },
  retentionPercent: { fontSize: 18, fontWeight: '900', color: C.primary },
  retentionLabel: { fontSize: 9, color: C.textLight, fontWeight: '700' },

  // Earnings
  commissionRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  commissionLabel: { fontSize: 12.5, color: C.text },
  commissionValue: { fontSize: 12.5, fontWeight: '700' },
  payoutRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  payoutIconBox: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  payoutDate: { fontSize: 13, fontWeight: '700', color: C.text },
  payoutBank: { fontSize: 11, color: C.textLight },
  payoutAmount: { fontSize: 14, fontWeight: '900' },
  bankRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  bankLabel: { fontSize: 12, color: C.textLight },
  bankValue: { fontSize: 12, fontWeight: '700', color: C.text },
  renewalRingOuter: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center' },
  renewalRingInner: { width: 64, height: 64, borderRadius: 32, borderWidth: 5, alignItems: 'center', justifyContent: 'center' },
  renewalDaysText: { fontSize: 18, fontWeight: '900', color: C.primary },
  renewalDaysLabel: { fontSize: 8, color: C.textLight, fontWeight: '700' },
  invoiceBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: C.border, borderRadius: 10, padding: 12 },
  invoiceBtnText: { fontSize: 12, fontWeight: '700' },

  // Common
  row: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 11.5, fontWeight: '700', color: C.textLight, marginBottom: 6, letterSpacing: 0.3 },
  helpText: { fontSize: 11, color: C.textLight },
  input: { borderWidth: 1.5, borderColor: C.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: C.text, fontWeight: '600', backgroundColor: '#FAFAFA', marginBottom: 12 },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.primary, borderRadius: 12, paddingVertical: 13, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 5 },
  saveBtnText: { color: 'white', fontWeight: '800', fontSize: 14 },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.primary, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  addBtnText: { color: 'white', fontWeight: '800', fontSize: 12 },
  gpsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.blue, borderRadius: 10, paddingVertical: 11, marginTop: 4 },
  gpsBtnText: { color: 'white', fontWeight: '800', fontSize: 13 },
  segControl: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 10, padding: 4, marginBottom: 14 },
  segBtn: { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  segBtnActive: { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 2 },
  segBtnText: { fontSize: 12, fontWeight: '700', color: C.textLight },
  segBtnTextActive: { color: C.primary, fontWeight: '800' },
  infoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.primaryLight, borderRadius: 8, padding: 10 },
  infoBannerText: { fontSize: 12, fontWeight: '600', color: C.primary },
  disclaimerBanner: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFFBEB', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#FDE68A', gap: 6 },
  disclaimerText: { flex: 1, fontSize: 11.5, color: '#92400E', fontWeight: '600' },
  grantCreditBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.primary, borderRadius: 12, paddingVertical: 13 },
  grantCreditBtnText: { color: 'white', fontWeight: '800', fontSize: 13 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusActive: { backgroundColor: '#D1FAE5' },
  statusFrozen: { backgroundColor: '#BFDBFE' },
  statusSettled: { backgroundColor: '#F3F4F6' },
  statusPillText: { fontSize: 9, fontWeight: '900', color: '#065F46', letterSpacing: 0.5 },

  // Empty State
  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 8 },
  emptyTitle: { fontSize: 15, fontWeight: '800', color: C.text },
  emptySub: { fontSize: 12, color: C.textLight, textAlign: 'center' },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' },
  modalHandle: { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 4 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  modalTitle: { fontSize: 16, fontWeight: '900', color: C.text },
  modalScroll: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 20 },
  rejectOption: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  rejectOptionActive: { backgroundColor: '#FEF2F2' },
  rejectOptionText: { fontSize: 13, fontWeight: '600', color: C.text },
});
