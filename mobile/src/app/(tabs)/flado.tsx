import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Dimensions, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { Product } from '../../utils/mockData';
import { api } from '../../utils/api';
import { fladoCategoriesData } from '../../utils/fladoCategories';
import { fladoProductsData } from '../../utils/fladoProducts';
import { fladoOffersData } from '../../utils/fladoOffers';
import { fladoBrandsData } from '../../utils/fladoBrands';
import { fladoBundlesData } from '../../utils/fladoBundles';
import { fladoPassPlansData } from '../../utils/fladoPass';
import { findClosestStoreAndETA } from '../../utils/fladoDarkstores';
import { useFladoSDUI } from '../../hooks/useFladoSDUI';
import { renderSDUISection } from '../../utils/sduiRenderer';

const { width } = Dimensions.get('window');

const LOCATIONS = [
  { name: 'Muzaffarpur · Station Road (842001)', lat: 26.1209, lng: 85.3647 },
  { name: 'Muzaffarpur · Ahiyapur (842001)', lat: 26.1345, lng: 85.3891 },
  { name: 'Maunath Bhanjan · Civil Lines (275101)', lat: 25.9500, lng: 83.5620 },
  { name: 'Maunath Bhanjan · Rekabganj (275101)', lat: 25.9432, lng: 83.5558 },
  { name: 'Mumbai · Bandra West (400050)', lat: 19.0596, lng: 72.8295 },
];

const CITIES = ['Muzaffarpur', 'Maunath Bhanjan'];

const FILTER_CATEGORIES = [
  { emoji: '🥬', label: 'Veggies' },
  { emoji: '🥛', label: 'Dairy' },
  { emoji: '🥩', label: 'Meat' },
  { emoji: '💊', label: 'Medical' },
  { emoji: '🛒', label: 'Kirana' },
  { emoji: '🍞', label: 'Bakery' },
  { emoji: '🍕', label: 'Restaurant' },
  { emoji: '👗', label: 'Fashion' },
  { emoji: '📚', label: 'Books' },
  { emoji: '🔧', label: 'Tools' },
  { emoji: '🧴', label: 'Beauty' },
  { emoji: '🏠', label: 'Household' },
];

export default function FladoScreen() {
  const router = useRouter();
  const { cart, addToCart, updateQuantity } = useCart();
  const { sections: sduiSections, loading: sduiLoading } = useFladoSDUI();
  const [selectedLoc, setSelectedLoc] = useState(LOCATIONS[0]);
  const [selectedCity, setSelectedCity] = useState('Muzaffarpur');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string | null>(null);
  const [nearbyStores, setNearbyStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [storeProducts, setStoreProducts] = useState<Product[]>([]);
  const [etaDetails, setEtaDetails] = useState({ storeName: '', distance: 0, eta: 10 });
  const [showLocModal, setShowLocModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timerText, setTimerText] = useState('00:00');
  const [loading, setLoading] = useState(false);

  // Fetch nearby registered shops dynamically from backend based on lat/lng distance
  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        console.log('Fetching nearby stores for coords:', selectedLoc.lat, selectedLoc.lng);
        const stores = await api.getNearbyStores(selectedLoc.lat, selectedLoc.lng);
        console.log('Fetched nearby stores from API count:', stores.length, JSON.stringify(stores));
        setNearbyStores(stores);
        if (stores.length > 0) {
          setSelectedStore(stores[0]);
          setEtaDetails({
            storeName: stores[0].name,
            distance: stores[0].distance,
            eta: stores[0].eta
          });
        } else {
          setSelectedStore(null);
          setEtaDetails({
            storeName: 'No Store Near You',
            distance: 0,
            eta: 15
          });
        }
      } catch (e) {
        console.log('Error fetching nearby stores:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, [selectedLoc]);

  // Fetch store-specific products when selectedStore changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedStore) {
        setStoreProducts([]);
        return;
      }
      try {
        const prods = await api.getStoreProducts(selectedStore.vendorId);
        setStoreProducts(prods);
      } catch (e) {
        console.log('Error fetching store products:', e);
      }
    };
    fetchProducts();

    if (selectedStore) {
      setEtaDetails({
        storeName: selectedStore.name,
        distance: selectedStore.distance,
        eta: selectedStore.eta
      });
    }
  }, [selectedStore]);

  // Flash Countdown Timer (Simulated 1 hour loop)
  useEffect(() => {
    const nextHour = new Date();
    nextHour.setHours(nextHour.getHours() + 1);
    nextHour.setMinutes(0);
    nextHour.setSeconds(0);

    const timer = setInterval(() => {
      const diff = +nextHour - +new Date();
      if (diff <= 0) {
        setTimerText('00:00');
        return;
      }
      const mins = Math.floor((diff / 1000 / 60) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      setTimerText(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Slide autoplay
  const banners = [
    {
      title: 'Monsoon Mega Sale!',
      subtitle: 'Flat 20% off snacks & hot drinks.',
      bg: '#1E3A8A',
      img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&fit=crop'
    },
    {
      title: 'Farm Fresh Produce',
      subtitle: '100% certified organic veggies.',
      bg: '#064E3B',
      img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&fit=crop'
    },
    {
      title: 'Bakery & Dairy Fresh',
      subtitle: 'Sourdough loaves delivered daily.',
      bg: '#78350F',
      img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&fit=crop'
    }
  ];

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [banners.length]);

  // Get quantities of items currently in cart
  const getItemQuantity = (productId: string) => {
    const cartItem = cart.find(item => item.product.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAdjustQuantity = (product: Product, delta: number) => {
    const currentQty = getItemQuantity(product.id);
    const cartItem = cart.find(item => item.product.id === product.id);
    
    if (currentQty === 0 && delta > 0) {
      addToCart(product, 1);
    } else if (cartItem) {
      updateQuantity(cartItem.itemId, currentQty + delta);
    }
  };

  const handleAddBundle = (pIds: string[]) => {
    pIds.forEach(id => {
      const prod = fladoProductsData.find(p => p.id === id);
      if (prod) addToCart(prod);
    });
  };

  // Cart Metrics
  const fladoCartItems = cart.filter(item => item.product.isFlado);
  const fladoCartCount = fladoCartItems.reduce((acc, item) => acc + item.quantity, 0);
  const fladoSubtotal = fladoCartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Mapped slices for mobile views
  const activeProducts = (storeProducts && storeProducts.length >= 15) ? storeProducts : fladoProductsData;
  const quickReorders = activeProducts.slice(0, 5);
  const flashSales = activeProducts.filter(p => p.price < p.originalPrice).slice(0, 4);
  const topSavings = activeProducts.filter(p => p.price < p.originalPrice).slice(4, 8);
  const fruitsVeggies = activeProducts.filter(p => p.category === 'fruits-vegetables').slice(0, 8);
  const dairyProducts = activeProducts.filter(p => p.category === 'dairy-bread-eggs').slice(0, 8);
  const sponsored = activeProducts.slice(0, 4);
  const trending = activeProducts.slice(0, 8);
  const inspired = activeProducts.slice(1, 4);

  const renderProductCard = (item: Product) => {
    const qty = getItemQuantity(item.id);
    const discountPercent = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;

    return (
      <View key={item.id} style={styles.productCard}>
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => router.push(`/products/${item.id}`)}
          style={styles.imagePress}
        >
          <Image source={{ uri: item.image }} style={styles.productImage} />
          {discountPercent > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountPercent}% OFF</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <View style={styles.productInfo}>
          <Text style={styles.etaBadge}>⚡ {etaDetails.eta} MINS</Text>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productWeight}>{item.weight || '500g'}</Text>
          
          <View style={styles.priceAndAction}>
            <View>
              <Text style={styles.price}>₹{item.price}</Text>
              {item.originalPrice > item.price && (
                <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
              )}
            </View>

            {qty > 0 ? (
              <View style={styles.quantitySelector}>
                <TouchableOpacity 
                  style={styles.qtyBtn} 
                  onPress={() => handleAdjustQuantity(item, -1)}
                >
                  <Ionicons name="remove" size={12} color="white" />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{qty}</Text>
                <TouchableOpacity 
                  style={styles.qtyBtn} 
                  onPress={() => handleAdjustQuantity(item, 1)}
                >
                  <Ionicons name="add" size={12} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addBtn}
                onPress={() => handleAdjustQuantity(item, 1)}
              >
                <Text style={styles.addBtnText}>ADD</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* ZONE 1: HEADER & LOCATION MODAL */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.fladoLogo}>
            <Ionicons name="flash" size={16} color="white" />
            <Text style={styles.fladoLogoText}>flado</Text>
          </View>
          <View style={styles.etaPill}>
            <Text style={styles.etaPillText}>🛵 ASAP {etaDetails.eta} MINS</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.addressRow}
          onPress={() => setShowLocModal(true)}
        >
          <Ionicons name="location" size={16} color="#059669" />
          <Text style={styles.addressText} numberOfLines={1}>
            {selectedLoc.name}
          </Text>
          <Ionicons name="chevron-down" size={14} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* LOCATION SELECTOR MODAL */}
      <Modal visible={showLocModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Delivery Location</Text>
            {LOCATIONS.map((loc, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.locOption,
                  selectedLoc.name === loc.name && styles.locOptionSelected
                ]}
                onPress={() => {
                  setSelectedLoc(loc);
                  setShowLocModal(false);
                }}
              >
                <Ionicons name="pin" size={16} color={selectedLoc.name === loc.name ? '#059669' : '#9CA3AF'} style={{ marginRight: 8 }} />
                <Text style={[styles.locOptionText, selectedLoc.name === loc.name && styles.locOptionTextSelected]}>
                  {loc.name}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowLocModal(false)}>
              <Text style={styles.closeBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {loading || sduiLoading ? (
        <ActivityIndicator size="large" color="#059669" style={{ flex: 1 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
          {/* ZONE 1.5: CITY SELECTOR CHIPS */}
          <View style={styles.citySelectorRow}>
            {CITIES.map((city) => (
              <TouchableOpacity
                key={city}
                style={[
                  styles.cityChip,
                  selectedCity === city && styles.cityChipActive,
                  { flexDirection: 'row', alignItems: 'center', gap: 6 }
                ]}
                onPress={() => {
                  setSelectedCity(city);
                  const matched = LOCATIONS.find(l => l.name.startsWith(city));
                  if (matched) setSelectedLoc(matched);
                }}
              >
                <Text style={{ fontSize: 13 }}>{city === 'Muzaffarpur' ? '📍' : '🗺️'}</Text>
                <Text style={[styles.cityChipText, selectedCity === city && styles.cityChipTextActive]}>
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* DYNAMIC SDUI SECTIONS RENDERER */}
          {(sduiSections || []).map((section) =>
            renderSDUISection(section, {
              products: activeProducts,
              nearbyStores: nearbyStores,
              selectedStoreId: selectedStore?.id,
              selectedCategory: selectedFilterCategory,
              etaMinutes: etaDetails.eta,
              rewardPoints: 120,
              getItemQuantity: getItemQuantity,
              onAdjustQuantity: handleAdjustQuantity,
              onSelectCategory: (slug) => setSelectedFilterCategory(slug === selectedFilterCategory ? null : slug),
              onSelectStore: (store) => setSelectedStore(store),
              onAddBundle: handleAddBundle,
              onNavigate: (route, params) => router.push({ pathname: route as any, params }),
            })
          )}
        </ScrollView>
      )}

      {/* STICKY BOTTOM BASKET DRAWER */}
      {fladoCartCount > 0 && (
        <View style={styles.cartOverlay}>
          <View style={styles.cartOverlayLeft}>
            <Text style={styles.cartOverlayQty}>{fladoCartCount} Item{fladoCartCount > 1 ? 's' : ''}</Text>
            <Text style={styles.cartOverlayPrice}>₹{fladoSubtotal} <Text style={styles.plusGst}>ASAP {etaDetails.eta}m</Text></Text>
          </View>
          <TouchableOpacity 
            style={styles.cartOverlayBtn}
            onPress={() => router.push('/(tabs)/cart')}
          >
            <Text style={styles.cartOverlayBtnText}>View Cart</Text>
            <Ionicons name="arrow-forward" size={14} color="#047857" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFDFB',
  },
  header: {
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  fladoLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  fladoLogoText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '900',
    marginLeft: 4,
  },
  etaPill: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  etaPillText: {
    color: '#047857',
    fontSize: 11,
    fontWeight: '800',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
  },
  addressText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '700',
    marginLeft: 6,
    flex: 1,
  },
  passBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 10,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  passBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  passBadgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  passText: {
    color: '#B45309',
    fontSize: 10,
    fontWeight: '800',
    flex: 1,
  },
  heroCard: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 110,
    overflow: 'hidden',
  },
  heroTextContainer: {
    flex: 1.2,
  },
  heroTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    fontSize: 8,
    fontWeight: '900',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  heroTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 2,
  },
  heroSubtitle: {
    color: '#D1FAE5',
    fontSize: 10,
  },
  heroImage: {
    width: 80,
    height: 70,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  categoryTile: {
    width: 84,
    aspectRatio: 0.95,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    marginRight: 10,
    padding: 4,
    backgroundColor: 'white',
  },
  tileEmoji: {
    fontSize: 22,
  },
  tileLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 4,
    textAlign: 'center',
  },
  reorderCardMini: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
    width: 200,
  },
  reorderImgMini: {
    width: 40,
    height: 40,
    borderRadius: 6,
    resizeMode: 'contain',
  },
  reorderNameMini: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1F2937',
  },
  reorderPriceMini: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 1,
  },
  reorderAddBtnMini: {
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reorderAddBtnTextMini: {
    color: 'white',
    fontSize: 9,
    fontWeight: '900',
  },
  reorderQtySelectorMini: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    borderRadius: 8,
    padding: 1,
  },
  reorderQtyBtnMini: {
    padding: 2,
  },
  reorderQtyTextMini: {
    color: 'white',
    fontSize: 9,
    fontWeight: '900',
    paddingHorizontal: 4,
  },
  flashHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
  },
  timerBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  timerText: {
    color: '#DC2626',
    fontSize: 10,
    fontWeight: '900',
  },
  sponsorCard: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    borderRadius: 12,
    padding: 8,
    marginRight: 10,
    width: 90,
    alignItems: 'center',
  },
  sponsorLogo: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
    marginBottom: 4,
  },
  sponsorText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#059669',
  },
  subcategoryRowSection: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  productCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    width: 156,
    marginRight: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  imagePress: {
    width: '100%',
    height: 105,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '82%',
    height: '82%',
    resizeMode: 'contain',
  },
  discountBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: 'white',
    fontSize: 8,
    fontWeight: '900',
  },
  productInfo: {
    padding: 8,
  },
  etaBadge: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#059669',
    marginBottom: 3,
  },
  productName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
    height: 34,
    lineHeight: 16,
  },
  productWeight: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 6,
  },
  priceAndAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
  },
  originalPrice: {
    fontSize: 9.5,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  addBtn: {
    borderWidth: 1.5,
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '900',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    borderRadius: 6,
    padding: 1.5,
  },
  qtyBtn: {
    padding: 2,
  },
  qtyText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 4,
  },
  promoBanner: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#D1FAE5',
  },
  promoTitle: {
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 16,
    marginBottom: 4,
  },
  promoCta: {
    fontSize: 10,
    fontWeight: '800',
  },
  bundleCard: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    borderRadius: 12,
    width: 220,
    marginRight: 12,
    overflow: 'hidden',
    paddingBottom: 8,
  },
  bundleImg: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  bundleName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  bundlePricing: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginVertical: 6,
    alignItems: 'center',
  },
  bundlePrice: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1F2937',
  },
  bundleSavings: {
    fontSize: 9,
    color: '#10B981',
    fontWeight: '800',
  },
  bundleAddBtn: {
    backgroundColor: '#059669',
    marginHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  bundleAddText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900',
  },
  cartOverlay: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#059669',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  cartOverlayLeft: {
    flexDirection: 'column',
  },
  cartOverlayQty: {
    color: '#A7F3D0',
    fontSize: 9,
    fontWeight: '800',
  },
  cartOverlayPrice: {
    color: 'white',
    fontSize: 14,
    fontWeight: '900',
  },
  plusGst: {
    fontSize: 9,
    fontWeight: '600',
    color: '#A7F3D0',
  },
  cartOverlayBtn: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartOverlayBtnText: {
    color: '#047857',
    fontSize: 11,
    fontWeight: '900',
  },
  // Modal Locations Styling
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: '85%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 8,
  },
  locOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  locOptionSelected: {
    backgroundColor: '#F0FDF4',
  },
  locOptionText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  locOptionTextSelected: {
    color: '#059669',
    fontWeight: '800',
  },
  closeBtn: {
    marginTop: 12,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
  },
  // Flado Grocery Shop Selector styles
  shopSelectorSection: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  noShopText: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: '600',
  },
  shopCard: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    width: 170,
  },
  shopCardSelected: {
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
  },
  shopCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  shopName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  shopNameSelected: {
    color: '#047857',
  },
  shopMeta: {
    fontSize: 9.5,
    color: '#6B7280',
    fontWeight: '700',
    marginBottom: 6,
  },
  shopRangeBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  shopRangeText: {
    fontSize: 8.5,
    color: '#4B5563',
    fontWeight: '800',
  },
  shopStatusBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  shopStatusOpen: {
    backgroundColor: '#D1FAE5',
  },
  shopStatusClosed: {
    backgroundColor: '#FEE2E2',
  },
  shopStatusText: {
    fontSize: 7.5,
    fontWeight: '900',
    color: '#065F46',
  },
  // City selector chips
  citySelectorRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    gap: 10,
  },
  cityChip: {
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: 'white',
  },
  cityChipActive: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  cityChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#4B5563',
  },
  cityChipTextActive: {
    color: '#065F46',
    fontWeight: '800',
  },
  // Top Urgent Flash Sale Ticker Strip
  topFlashTicker: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#FF4500',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#FF4500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  topFlashTickerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
    gap: 6,
  },
  topFlashTickerTitle: {
    color: 'white',
    fontSize: 11.5,
    fontWeight: '800',
    flex: 1,
  },
  topFlashTickerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topFlashTimerText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '900',
  },
  topFlashCtaBtn: {
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  topFlashCtaText: {
    color: '#FF4500',
    fontSize: 10,
    fontWeight: '900',
  },
  // Full Size Replaceable Promo Strip Banner
  promoStripBanner: {
    marginHorizontal: 16,
    marginVertical: 10,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#10B981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  promoStripImg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  promoStripOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  promoStripTag: {
    color: '#FFD700',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  promoStripTitle: {
    color: 'white',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  // Category filter strip
  categoryFilterStrip: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 4,
    gap: 8,
    flexDirection: 'row',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'white',
    gap: 4,
  },
  filterChipActive: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  filterChipEmoji: {
    fontSize: 14,
  },
  filterChipText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#4B5563',
  },
  filterChipTextActive: {
    color: '#065F46',
    fontWeight: '800',
  },
});
