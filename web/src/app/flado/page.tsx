'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiZap, 
  FiCheckCircle, 
  FiGrid, 
  FiTag, 
  FiArrowRight, 
  FiShoppingBag, 
  FiClock, 
  FiMapPin, 
  FiPercent,
  FiChevronRight,
  FiChevronLeft,
  FiTrendingUp,
  FiAward
} from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import { fladoCategoriesData } from '@/data/fladoCategories';
import { fladoProductsData } from '@/data/fladoProducts';
import { fladoOffersData } from '@/data/fladoOffers';
import { fladoBrandsData } from '@/data/fladoBrands';
import { fladoBundlesData } from '@/data/fladoBundles';
import { fladoPassPlansData } from '@/data/fladoPass';
import { findClosestStoreAndETA, fladoDarkstoresData } from '@/data/fladoDarkstores';
import MarketingSectionRenderer from '@/components/MarketingSectionRenderer';
import { promoPagesRegistry, PromoPageConfig } from '@/data/promoLayouts';
import styles from './page.module.css';

// Pre-configured locations for Muzaffarpur, Maunath Bhanjan and Mumbai
const LOCATIONS = [
  { name: 'Muzaffarpur · Station Road (842001)', lat: 26.1209, lng: 85.3647 },
  { name: 'Muzaffarpur · Ahiyapur (842001)', lat: 26.1345, lng: 85.3891 },
  { name: 'Maunath Bhanjan · Civil Lines (275101)', lat: 25.9500, lng: 83.5620 },
  { name: 'Maunath Bhanjan · Rekabganj (275101)', lat: 25.9432, lng: 83.5558 },
  { name: 'Mumbai · Bandra West (400050)', lat: 19.0596, lng: 72.8295 },
];

const CITIES = ['Muzaffarpur', 'Maunath Bhanjan', 'Mumbai'];

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

export default function FladoExpressPage() {
  const { cart, addToCart } = useCart();
  const [selectedLoc, setSelectedLoc] = useState(LOCATIONS[0]);
  const [selectedCity, setSelectedCity] = useState('Muzaffarpur');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string | null>(null);
  const [nearbyStores, setNearbyStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>(fladoProductsData);
  const [etaDetails, setEtaDetails] = useState({ storeName: '', distance: 0, eta: 10 });
  const [showLocDropdown, setShowLocDropdown] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timerText, setTimerText] = useState('00:00');
  
  // Simulated Recently Viewed State
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [marketingConfig, setMarketingConfig] = useState<PromoPageConfig | null>(null);

  // 1. Fetch nearby stores/shops dynamically based on selectedLoc lat/lng
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/flado/stores/nearby?lat=${selectedLoc.lat}&lng=${selectedLoc.lng}`);
        if (res.ok) {
          const data = await res.json();
          setNearbyStores(data);
          if (data.length > 0) {
            setSelectedStore(data[0]);
            setEtaDetails({
              storeName: data[0].name,
              distance: data[0].distance,
              eta: Math.round(5 + data[0].distance * 3)
            });
          } else {
            setSelectedStore(null);
            setEtaDetails({
              storeName: 'No Store Near You',
              distance: 0,
              eta: 15
            });
          }
        }
      } catch (e) {
        console.warn('Failed to fetch stores, falling back to static calculation:', e);
        const result = findClosestStoreAndETA(selectedLoc.lat, selectedLoc.lng);
        if (result) {
          setEtaDetails({
            storeName: result.store.name,
            distance: result.distance,
            eta: result.eta
          });
        }
      }
    };
    fetchStores();
  }, [selectedLoc]);

  // 2. Fetch products dynamically when selectedStore changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedStore) {
        setProducts(fladoProductsData);
        return;
      }
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/flado/products?vendorId=${selectedStore.vendorId}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map(item => ({
              id: item.id,
              name: item.title,
              description: item.description || '',
              price: item.discountPrice ?? item.basePrice,
              originalPrice: item.basePrice,
              rating: item.rating ?? 4.5,
              reviewsCount: item.reviewCount ?? 0,
              image: item.imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
              category: 'groceries',
              subCategory: item.subCategory || 'General',
              isFlado: true,
              fladoStock: 20,
              generalStock: 0,
              specifications: {},
              brand: 'Local Partner',
              weight: '1 unit'
            }));
            setProducts(mapped);
          } else {
            // Filter local mock data by subcategories/vendor
            setProducts(fladoProductsData);
          }
        }
      } catch (e) {
        console.warn('Failed to fetch products, using local mock data:', e);
        setProducts(fladoProductsData);
      }
    };
    fetchProducts();
  }, [selectedStore]);

  // 3. Flash Countdown Timer (Simulated 1 hour loop)
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

  // Load dynamic Flado campaign marketing promo config
  useEffect(() => {
    try {
      const stored = localStorage.getItem('auramart_custom_promos');
      let customConfig = null;
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed['flado-marketing']) {
          customConfig = parsed['flado-marketing'];
        }
      }
      setMarketingConfig(customConfig || promoPagesRegistry['flado-marketing']);
    } catch (e) {
      setMarketingConfig(promoPagesRegistry['flado-marketing']);
    }
  }, []);

  // 3. Carousel Auto-slide (5 banners)
  const banners = [
    {
      title: 'Monsoon Mega Sale is Live!',
      subtitle: 'Stock up snacks, hot beverages & umbrella essentials at flat 20% off.',
      cta: 'Shop Sale',
      url: '/promo/monsoon-clearance',
      bg: 'linear-gradient(135deg, #1D4ED8 0%, #1E3A8A 100%)',
      img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&fit=crop'
    },
    {
      title: 'Farm Fresh Organic Greens',
      subtitle: 'Straight from local fields to your kitchen. 100% certified organic veggies.',
      cta: 'Shop Produce',
      url: '/flado/categories/fruits-vegetables',
      bg: 'linear-gradient(135deg, #059669 0%, #064E3B 100%)',
      img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&fit=crop'
    },
    {
      title: 'Dairy & Morning Breads',
      subtitle: 'Amul, Mother Dairy & Freshly Baked Sourdough Loaves delivered daily.',
      cta: 'Explore Dairy',
      url: '/flado/categories/dairy-bread-eggs',
      bg: 'linear-gradient(135deg, #D97706 0%, #78350F 100%)',
      img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&fit=crop'
    },
    {
      title: '⚡ 10-Minute Electronics Essentials',
      subtitle: 'Earphones, charging adapters, spikes & batteries delivered when you need them.',
      cta: 'Order Tech',
      url: '/flado/categories/electronics-accessories',
      bg: 'linear-gradient(135deg, #4B5563 0%, #1F2937 100%)',
      img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&fit=crop'
    },
    {
      title: 'Invite Friends, Earn ₹100!',
      subtitle: 'Share your referral code. Get cashbacks credited directly into Flado Wallet.',
      cta: 'Invite Now',
      url: '/flado/profile',
      bg: 'linear-gradient(135deg, #DB2777 0%, #831843 100%)',
      img: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&fit=crop'
    }
  ];

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(slideTimer);
  }, [banners.length]);

  // Load simulated recently viewed items
  useEffect(() => {
    // Pick 3 random products to populate as recently viewed
    const items = [fladoProductsData[3], fladoProductsData[12], fladoProductsData[25]];
    setRecentlyViewed(items);
  }, []);

  // Quick reorder list (Zone 5)
  const quickReorderProducts = products.slice(0, 5);

  // Filter based on selected category chip if set
  const filteredProducts = selectedFilterCategory
    ? products.filter(p => 
        p.subCategory?.toLowerCase().includes(selectedFilterCategory.toLowerCase()) ||
        p.category?.toLowerCase().includes(selectedFilterCategory.toLowerCase()) ||
        p.name?.toLowerCase().includes(selectedFilterCategory.toLowerCase())
      )
    : products;

  // Flash Sale products (Zone 6)
  const flashSaleProducts = filteredProducts.filter(p => p.price < (p.originalPrice ?? p.price)).slice(0, 4);

  // Top Deals products (Zone 7)
  const topDealsProducts = filteredProducts.filter(p => p.badge === 'Special Price' || p.price < (p.originalPrice ?? p.price)).slice(0, 4);

  // Fruits & Vegetables (Zone 9)
  const fruitsVeggiesProducts = filteredProducts.filter(p => 
    p.category === 'fruits-vegetables' || 
    p.subCategory?.toLowerCase().includes('fruit') || 
    p.subCategory?.toLowerCase().includes('veg')
  ).slice(0, 8);

  // Dairy & Bread (Zone 10)
  const dairyProducts = filteredProducts.filter(p => 
    p.category === 'dairy-bread-eggs' || 
    p.subCategory?.toLowerCase().includes('dairy') || 
    p.subCategory?.toLowerCase().includes('milk') || 
    p.subCategory?.toLowerCase().includes('bread')
  ).slice(0, 8);

  // Sponsored Products (Zone 12)
  const sponsoredProducts = filteredProducts.filter(p => p.sponsored || p.id.includes('gro-1') || p.id.includes('gro-3')).slice(0, 4);

  // Trending (Zone 13)
  const trendingProducts = filteredProducts.slice(0, 8);

  // Cart Metrics
  const fladoCartItems = cart.filter(item => item.product.isFlado);
  const fladoCartCount = fladoCartItems.reduce((acc, item) => acc + item.quantity, 0);
  const fladoCartTotal = fladoCartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Multi-add helper for combos
  const handleAddBundle = (pIds: string[]) => {
    pIds.forEach(id => {
      const prod = fladoProductsData.find(p => p.id === id);
      if (prod) addToCart(prod);
    });
  };

  return (
    <div className={styles.fladoContainer}>
      
      {/* ZONE 1: STICKY DYNAMIC LOCATION HEADER */}
      <div className={styles.stickyEtaBanner}>
        <div className="container">
          <div className={styles.etaFlex}>
            <div className={styles.etaLeft}>
              <FiMapPin style={{ color: '#F59E0B', fontSize: '1.2rem' }} />
              <div>
                <p style={{ fontSize: '0.75rem', opacity: 0.85, margin: 0 }}>DELIVERING TO</p>
                <button 
                  onClick={() => setShowLocDropdown(!showLocDropdown)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontWeight: '850',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0
                  }}
                >
                  {selectedLoc.name} ▾
                </button>
              </div>
              
              {showLocDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '12px',
                  backgroundColor: 'white',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 999,
                  minWidth: '320px',
                  padding: '12px 0',
                  marginTop: '8px'
                }}>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: '800', padding: '0 16px 8px 16px', margin: 0, borderBottom: '1px solid #F1F5F9' }}>
                    SELECT DELIVERY AREA (Dynamic Coordinates)
                  </p>
                  {LOCATIONS.map((loc, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedLoc(loc);
                        setShowLocDropdown(false);
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '12px 16px',
                        background: 'none',
                        border: 'none',
                        fontSize: '0.85rem',
                        fontWeight: selectedLoc.name === loc.name ? '900' : '650',
                        color: selectedLoc.name === loc.name ? '#059669' : 'var(--color-text-primary)',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0FDF4'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      📍 {loc.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.etaRight}>
              <span className={styles.zapPill}>
                <FiZap /> DELIVERS IN {etaDetails.eta} MINS
              </span>
              <span className={styles.activeRiders} style={{ marginLeft: '12px' }}>
                🛵 {etaDetails.storeName} ({etaDetails.distance} km)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ZONE 2: FLADO PASS BANNER STRIP */}
      <div style={{
        backgroundColor: '#FEF3C7',
        borderBottom: '1px solid #FDE68A',
        padding: '12px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <Link href="/flado/pass" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#B45309',
            fontWeight: '850',
            fontSize: '0.85rem',
            textDecoration: 'none'
          }}>
            <span style={{ backgroundColor: '#F59E0B', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '900' }}>
              PASS
            </span>
            <span>⚡ Save ₹250+ this month with Flado Pass! Get unlimited Free Delivery. Join now for ₹39</span>
            <FiChevronRight />
          </Link>
        </div>
      </div>

      {/* ZONE 2.5: CITY SELECTOR & STORES LIST SECTION */}
      <div style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', padding: '20px 0' }}>
        <div className="container">
          
          {/* City Chips */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#4B5563', marginRight: '6px' }}>SELECT CITY:</span>
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => {
                  setSelectedCity(city);
                  const matched = LOCATIONS.find(l => l.name.startsWith(city));
                  if (matched) setSelectedLoc(matched);
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '1.5px solid',
                  borderColor: selectedCity === city ? '#059669' : '#D1D5DB',
                  backgroundColor: selectedCity === city ? '#ECFDF5' : 'white',
                  color: selectedCity === city ? '#065F46' : '#4B5563',
                  fontSize: '0.82rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{city === 'Muzaffarpur' ? '📍' : city === 'Maunath Bhanjan' ? '🗺️' : '🏙️'}</span>
                <span>{city}</span>
              </button>
            ))}
          </div>

          {/* Stores Row */}
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '850', color: '#1F2937', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🏪 Local Partner Shops Delivering to You ({nearbyStores.length})
            </h3>
            {nearbyStores.length === 0 ? (
              <div style={{ backgroundColor: 'white', border: '1.5px dashed #D1D5DB', borderRadius: '12px', padding: '16px', textAlign: 'center', color: '#6B7280', fontSize: '0.85rem' }}>
                No active partner shops found within delivery range of this address.
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
                {nearbyStores.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => setSelectedStore(store)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      textAlign: 'left',
                      minWidth: '260px',
                      backgroundColor: 'white',
                      border: '2px solid',
                      borderColor: selectedStore?.id === store.id ? '#059669' : '#E5E7EB',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      cursor: 'pointer',
                      boxShadow: selectedStore?.id === store.id ? '0 4px 12px rgba(5, 150, 105, 0.1)' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#1F2937' }}>{store.name}</span>
                      {store.isPhysicallyVerified && (
                        <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontSize: '0.65rem', fontWeight: '900', padding: '2px 6px', borderRadius: '4px' }}>
                          ✓ VERIFIED
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '2px' }}>{store.address}</span>
                    
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center', fontSize: '0.72rem', fontWeight: '750' }}>
                      <span style={{ color: '#059669', backgroundColor: '#ECFDF5', padding: '2px 6px', borderRadius: '4px' }}>
                        🛵 {Math.round(5 + store.distance * 3)} mins
                      </span>
                      <span style={{ color: '#3B82F6', backgroundColor: '#EFF6FF', padding: '2px 6px', borderRadius: '4px' }}>
                        📍 {store.distance} km away
                      </span>
                      <span style={{ color: '#F59E0B', backgroundColor: '#FFFBEB', padding: '2px 6px', borderRadius: '4px' }}>
                        ★ {store.rating || '4.5'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Filter strip */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
            {FILTER_CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setSelectedFilterCategory(selectedFilterCategory === cat.label ? null : cat.label)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  border: '1.5px solid',
                  borderColor: selectedFilterCategory === cat.label ? '#059669' : '#E5E7EB',
                  backgroundColor: selectedFilterCategory === cat.label ? '#ECFDF5' : 'white',
                  color: selectedFilterCategory === cat.label ? '#065F46' : '#4B5563',
                  fontSize: '0.78rem',
                  fontWeight: '750',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* ZONE 3: HERO BANNER CAROUSEL */}
      <section className={styles.heroSection}>
        <div className="container">
          <div style={{
            background: banners[currentSlide].bg,
            borderRadius: '16px',
            padding: '40px',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '260px'
          }}>
            <div style={{ flex: 1.3, zIndex: 2 }}>
              <span style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '900',
                textTransform: 'uppercase',
                marginBottom: '16px',
                display: 'inline-block'
              }}>
                Flado Quick Express
              </span>
              <h1 style={{ fontSize: '2.2rem', fontWeight: '900', margin: '0 0 12px 0', lineHeight: 1.2 }}>
                {banners[currentSlide].title}
              </h1>
              <p style={{ opacity: 0.9, fontSize: '0.95rem', margin: '0 0 24px 0', fontWeight: '500', lineHeight: 1.5 }}>
                {banners[currentSlide].subtitle}
              </p>
              <Link href={banners[currentSlide].url} style={{
                backgroundColor: 'white',
                color: '#1F2937',
                padding: '12px 28px',
                borderRadius: '30px',
                fontWeight: '850',
                fontSize: '0.88rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}>
                {banners[currentSlide].cta} <FiArrowRight />
              </Link>
            </div>
            
            <div style={{
              flex: 0.7,
              display: 'flex',
              justifyContent: 'flex-end',
              zIndex: 2
            }}>
              <img 
                src={banners[currentSlide].img} 
                alt="banner item" 
                style={{
                  width: '280px',
                  height: '180px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                }} 
              />
            </div>

            {/* Slider Dots */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '40px',
              display: 'flex',
              gap: '8px',
              zIndex: 10
            }}>
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  style={{
                    width: idx === currentSlide ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: idx === currentSlide ? 'white' : 'rgba(255, 255, 255, 0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ZONE 4: CATEGORY PILL ROW (15 Categories Horizontal Scroll) */}
      <section style={{ padding: '10px 0 20px 0' }}>
        <div className="container">
          <div className={styles.sectionHeaderFlex}>
            <div className={styles.sectionHeader}>
              <FiGrid className={styles.headerIcon} />
              <h2>Shop by Category</h2>
            </div>
            <Link href="/flado/categories" className={styles.shopAllCategoriesBtn}>
              See All 15 Categories <FiArrowRight />
            </Link>
          </div>
          <div style={{
            display: 'flex',
            gap: '16px',
            overflowX: 'auto',
            padding: '12px 0',
            scrollbarWidth: 'none'
          }}>
            {fladoCategoriesData.map((cat, idx) => (
              <Link
                key={idx}
                href={`/flado/categories/${cat.slug}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '100px',
                  padding: '16px 12px',
                  backgroundColor: 'white',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  textAlign: 'center',
                  transition: 'transform 0.2s, border-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = cat.primaryColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
              >
                <span style={{ fontSize: '2rem', marginBottom: '8px' }}>{cat.emoji}</span>
                <span style={{
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.2
                }}>
                  {cat.name.split(',')[0]}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Campaign Marketing Sections */}
      {marketingConfig && marketingConfig.sections && (
        <div className="container" style={{ margin: '20px auto 10px' }}>
          {marketingConfig.sections.map((section) => (
            <MarketingSectionRenderer key={section.id} section={section} />
          ))}
        </div>
      )}

      {/* ZONE 5: QUICK REORDER (Order Again In A Tap) */}
      <section style={{ padding: '20px 0', borderTop: '1px solid #F1F5F9' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <FiZap className={styles.headerIcon} style={{ color: '#F59E0B' }} />
            <h2>Order Again in a Tap</h2>
          </div>
          <div style={{
            display: 'flex',
            gap: '16px',
            overflowX: 'auto',
            padding: '10px 0'
          }}>
            {quickReorderProducts.map((prod) => (
              <div 
                key={prod.id} 
                style={{
                  backgroundColor: 'white',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  minWidth: '280px'
                }}
              >
                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  style={{ width: '56px', height: '56px', objectFit: 'contain', borderRadius: '8px' }} 
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--color-text-primary)', margin: '0 0 4px 0' }}>
                    {prod.name}
                  </h4>
                  <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', margin: '0 0 6px 0' }}>
                    {prod.weight}
                  </p>
                  <span style={{ fontSize: '0.85rem', fontWeight: '850', color: 'var(--color-text-primary)' }}>
                    ₹{prod.price}
                  </span>
                </div>
                <button
                  onClick={() => addToCart(prod)}
                  style={{
                    backgroundColor: '#059669',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontWeight: '850',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#047857'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                >
                  + Add
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ZONE 6: FLASH SALE COUNTDOWN (1-Hour Loop) */}
      <section style={{ padding: '20px 0', borderTop: '1px solid #F1F5F9' }}>
        <div className="container">
          <div className={styles.sectionHeaderFlex}>
            <div className={styles.sectionHeader}>
              <FiClock className={styles.headerIcon} style={{ color: '#EF4444' }} />
              <h2>Flash Deals of the Hour</h2>
              <span style={{
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                padding: '4px 10px',
                borderRadius: '6px',
                fontWeight: '900',
                fontSize: '0.75rem',
                letterSpacing: '0.05em'
              }}>
                ENDS IN {timerText}
              </span>
            </div>
            <Link href="/flado/offers" style={{ fontSize: '0.82rem', color: '#EF4444', fontWeight: '850', textDecoration: 'none' }}>
              View All BOGO & Flash Sales <FiArrowRight />
            </Link>
          </div>
          <div className={styles.rowGrid}>
            {flashSaleProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* ZONE 7: TOP DEALS OF THE DAY */}
      <section style={{ padding: '25px 0', borderTop: '1px solid #F1F5F9' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <FiPercent className={styles.headerIcon} style={{ color: '#F59E0B' }} />
            <h2>Top Savings Today</h2>
          </div>
          <div className={styles.rowGrid}>
            {topDealsProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* ZONE 8: BRAND SPOTLIGHT ROW */}
      <section style={{ padding: '25px 0', borderTop: '1px solid #F1F5F9' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <FiAward className={styles.headerIcon} style={{ color: '#8B5CF6' }} />
            <h2>Official Brand Storefronts</h2>
          </div>
          <div style={{
            display: 'flex',
            gap: '16px',
            overflowX: 'auto',
            padding: '10px 0'
          }}>
            {fladoBrandsData.slice(0, 8).map((brand, idx) => (
              <Link href={`/flado/brands/${brand.slug}`} key={idx} style={{ textDecoration: 'none' }}>
                <div style={{
                  backgroundColor: 'white',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '130px',
                  textAlign: 'center',
                  transition: 'border-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#8B5CF6'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                >
                  <img 
                    src={brand.logoUrl} 
                    alt={brand.name} 
                    style={{ width: '60px', height: '60px', objectFit: 'contain', marginBottom: '10px', borderRadius: '50%' }} 
                  />
                  <h4 style={{ fontSize: '0.8rem', fontWeight: '850', color: 'var(--color-text-primary)', margin: '0 0 4px 0' }}>
                    {brand.name}
                  </h4>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: '900',
                    color: '#8B5CF6',
                    backgroundColor: '#F3E8FF',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {brand.offerText.split('on')[0]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ZONE 9: FRESH FRUITS & VEGETABLES ROW */}
      <section className={styles.productRowSection} style={{ borderTop: '1px solid #F1F5F9' }}>
        <div className="container">
          <div className={styles.sectionHeaderFlex}>
            <div className={styles.sectionHeader}>
              <span style={{ fontSize: '1.35rem' }}>🍎</span>
              <h2>Fresh Fruits & Vegetables</h2>
            </div>
            <Link href="/flado/categories/fruits-vegetables" className={styles.shopAllCategoriesBtn}>
              See All <FiArrowRight />
            </Link>
          </div>
          <div className={styles.horizontalProductsGrid}>
            {fruitsVeggiesProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* ZONE 10: DAIRY & BREAKFAST ESSENTIALS */}
      <section className={styles.productRowSection} style={{ borderTop: '1px solid #F1F5F9' }}>
        <div className="container">
          <div className={styles.sectionHeaderFlex}>
            <div className={styles.sectionHeader}>
              <span style={{ fontSize: '1.35rem' }}>🥛</span>
              <h2>Dairy, Bread & Eggs</h2>
            </div>
            <Link href="/flado/categories/dairy-bread-eggs" className={styles.shopAllCategoriesBtn}>
              See All <FiArrowRight />
            </Link>
          </div>
          <div className={styles.horizontalProductsGrid}>
            {dairyProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* ZONE 11: SEASONAL PROMOTIONAL FULL-WIDTH BANNER */}
      <section style={{ padding: '25px 0' }}>
        <div className="container">
          <Link href="/flado/categories/snacks-beverages" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
              borderRadius: '16px',
              padding: '24px 40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'white',
              gap: '24px'
            }}>
              <div>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: '900', textTransform: 'uppercase' }}>
                  SEASONAL PICKS
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '900', margin: '6px 0 4px 0' }}>
                  Monsoon Munchies: Hot Tea, Coffee & Crispy Bhujia
                </h3>
                <p style={{ fontSize: '0.85rem', opacity: 0.9, margin: 0, fontWeight: '600' }}>
                  Keep the monsoon cravings satisfied with instant delivery under 10 minutes.
                </p>
              </div>
              <span style={{
                backgroundColor: 'white',
                color: '#059669',
                fontWeight: '900',
                fontSize: '0.82rem',
                padding: '10px 20px',
                borderRadius: '30px',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                Shop Combos <FiArrowRight />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ZONE 12: SPONSORED PRODUCTS ROW */}
      <section className={styles.productRowSection} style={{ borderTop: '1px solid #F1F5F9' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <FiZap className={styles.headerIcon} style={{ color: '#8B5CF6' }} />
            <h2>Sponsored Products</h2>
            <span style={{ fontSize: '0.68rem', backgroundColor: '#E5E7EB', padding: '2px 6px', borderRadius: '4px', color: '#6B7280', fontWeight: '700' }}>
              AD
            </span>
          </div>
          <div className={styles.horizontalProductsGrid}>
            {sponsoredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* ZONE 13: TRENDING NEAR YOU */}
      <section className={styles.productRowSection} style={{ borderTop: '1px solid #F1F5F9' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <FiTrendingUp className={styles.headerIcon} style={{ color: '#EF4444' }} />
            <h2>Trending in Your Neighborhood</h2>
          </div>
          <div className={styles.horizontalProductsGrid}>
            {trendingProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* ZONE 14: CURATED COMBO BUNDLES */}
      <section className={styles.productRowSection} style={{ borderTop: '1px solid #F1F5F9' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <FiTag className={styles.headerIcon} style={{ color: '#10B981' }} />
            <h2>Curated Value Bundles</h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {fladoBundlesData.slice(0, 4).map((bundle) => (
              <div 
                key={bundle.id}
                style={{
                  backgroundColor: 'white',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={bundle.imageUrl} 
                    alt={bundle.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  {bundle.badge && (
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: '#10B981',
                      color: 'white',
                      fontSize: '0.65rem',
                      fontWeight: '900',
                      padding: '4px 10px',
                      borderRadius: '20px'
                    }}>
                      {bundle.badge}
                    </span>
                  )}
                </div>
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '850', margin: '0 0 6px 0', color: 'var(--color-text-primary)' }}>
                      {bundle.name}
                    </h3>
                    <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', margin: '0 0 16px 0' }}>
                      Includes 3 essential matching groceries
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--color-text-primary)' }}>
                        ₹{bundle.totalPrice}
                      </span>
                      <span style={{ fontSize: '0.78rem', textDecoration: 'line-through', color: 'var(--color-text-muted)', marginLeft: '6px' }}>
                        ₹{bundle.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: '850', marginLeft: '6px' }}>
                        Save ₹{bundle.savings}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddBundle(bundle.productIds)}
                      style={{
                        backgroundColor: '#059669',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '30px',
                        fontWeight: '850',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#047857'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                    >
                      + Add Combo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ZONE 15: RECENTLY VIEWED PICKS */}
      {recentlyViewed.length > 0 && (
        <section className={styles.productRowSection} style={{ borderTop: '1px solid #F1F5F9' }}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <FiClock className={styles.headerIcon} style={{ color: '#6B7280' }} />
              <h2>Inspired by Your Browsing</h2>
            </div>
            <div className={styles.rowGrid}>
              {recentlyViewed.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STICKY BOTTOM BASKET OVERLAY DRAWER */}
      {fladoCartCount > 0 && (
        <div className={styles.stickyDrawer}>
          <div className="container">
            <div className={styles.drawerInner}>
              <div className={styles.drawerMeta}>
                <div className={styles.basketIconWrapper}>
                  <FiShoppingBag />
                  <span className={styles.itemCountBadge}>{fladoCartCount}</span>
                </div>
                <div className={styles.priceMeta}>
                  <span className={styles.totalVal}>₹{fladoCartTotal.toLocaleString('en-IN')}</span>
                  <span className={styles.itemCount}>Delivering to {selectedLoc.name.split('·')[1].split('(')[0].trim()}</span>
                </div>
              </div>
              <Link href="/cart" className={styles.drawerCta}>
                Proceed to Checkout <FiChevronRight />
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
