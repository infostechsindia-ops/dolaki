'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  FiChevronLeft, 
  FiZap, 
  FiPercent, 
  FiArrowRight, 
  FiSliders, 
  FiFilter, 
  FiArrowUp, 
  FiArrowDown,
  FiInfo
} from 'react-icons/fi';
import { fladoCategoriesData } from '@/data/fladoCategories';
import { fladoProductsData } from '@/data/fladoProducts';
import { fladoOffersData } from '@/data/fladoOffers';
import { fladoBrandsData } from '@/data/fladoBrands';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

import { API_BASE_URL } from '@/lib/config';

interface FladoCategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function FladoCategoryStorePage({ params }: FladoCategoryPageProps) {
  const { slug } = use(params);
  const [loading, setLoading] = useState(true);
  const [activeSubcat, setActiveSubcat] = useState('All');
  const [productList, setProductList] = useState<any[]>([]);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('relevance'); // relevance, price-asc, price-desc, rating
  const [inStockOnly, setInStockOnly] = useState(false);

  const category = fladoCategoriesData.find(c => c.slug === slug);
  if (!category) {
    notFound();
  }

  const isDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO_FIXTURES === 'true';

  useEffect(() => {
    const loadProducts = async () => {
      let items: any[] = [];
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        if (res.ok) {
          const data = await res.json();
          items = data.map((bp: any) => ({
            ...bp,
            name: bp.title || '',
            price: bp.discountPrice ?? bp.basePrice,
            originalPrice: bp.basePrice,
            image: bp.imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
            rating: bp.rating ?? 4.5,
            reviewsCount: bp.reviewCount ?? 12,
            isFlado: true,
            category: bp.category || 'groceries',
            subCategory: bp.subCategory || '',
            brand: bp.brand || ''
          }));
        } else {
          items = isDemo ? fladoProductsData : [];
        }
      } catch (e) {
        console.log('Failed to fetch from backend', e);
        items = isDemo ? fladoProductsData : [];
      }
      
      // Filter by category slug
      const filtered = items.filter(p => p.isFlado && p.category === slug);
      setProductList(filtered);
      setLoading(false);
    };

    loadProducts();
  }, [slug]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Opening Flado Instant Hub...</p>
      </div>
    );
  }

  // Filter logic
  let filteredItems = productList;

  if (activeSubcat !== 'All') {
    filteredItems = filteredItems.filter(p => 
      (p.subCategory || '').toLowerCase().includes(activeSubcat.toLowerCase())
    );
  }

  if (inStockOnly) {
    filteredItems = filteredItems.filter(p => p.fladoStock && p.fladoStock > 0);
  }

  // Sort logic
  if (sortBy === 'price-asc') {
    filteredItems = [...filteredItems].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filteredItems = [...filteredItems].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredItems = [...filteredItems].sort((a, b) => b.rating - a.rating);
  }

  // Get matching brand stores
  const featuredBrands = fladoBrandsData.filter(b => b.category === slug);

  // Get matching coupons
  const matchingCoupons = fladoOffersData.filter(c => c.categoryConstraint === slug);

  return (
    <div className={styles.fladoCategoryPage} style={{ '--flado-primary': category.primaryColor } as React.CSSProperties}>
      
      {/* 1. STICKY SUB-HEADER */}
      <div className={styles.fladoMiniHeader}>
        <div className="container">
          <div className={styles.miniHeaderInner}>
            <Link href="/flado" className={styles.backBtn}>
              <FiChevronLeft /> Back to Flado Express
            </Link>
            <div className={styles.etaBadge}>
              <FiZap className={styles.zapIcon} />
              <span>Express Delivery in <strong>10 Mins</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY HERO BANNER */}
      <div 
        className={styles.heroBanner}
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.5) 60%, rgba(15, 23, 42, 0.2) 100%), url(${category.bannerUrl})` 
        }}
      >
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.categoryEmoji}>{category.emoji}</span>
            <h1 style={{ color: 'white' }}>{category.name}</h1>
            <p style={{ color: '#D1D5DB' }}>Fresh products sourced directly from premium certified suppliers & darkstores.</p>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '24px' }}>
        
        {/* 3. SUB-CATEGORY SELECTOR ROW */}
        <div className={styles.subcatPillsRow}>
          <button 
            onClick={() => setActiveSubcat('All')}
            className={`${styles.subcatPill} ${activeSubcat === 'All' ? styles.subcatPillActive : ''}`}
          >
            All Items
          </button>
          {category.subCategories.map(sub => (
            <button
              key={sub}
              onClick={() => setActiveSubcat(sub)}
              className={`${styles.subcatPill} ${activeSubcat === sub ? styles.subcatPillActive : ''}`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* 4. BRAND ZONE STRIP */}
        {featuredBrands.length > 0 && (
          <div style={{ marginBottom: '24px', backgroundColor: 'white', padding: '16px', borderRadius: '12px', border: '1.5px solid var(--color-border)' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '0.78rem', fontWeight: '800', color: 'var(--color-text-muted)' }}>
              OFFICIAL PARTNER STORES
            </p>
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto' }}>
              {featuredBrands.map((brand) => (
                <Link 
                  href={`/flado/brands/${brand.slug}`} 
                  key={brand.slug} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    textDecoration: 'none',
                    padding: '8px 16px',
                    backgroundColor: '#F9FAFB',
                    border: '1.5px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                >
                  <img src={brand.logoUrl} alt={brand.name} style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '50%' }} />
                  <div>
                    <h5 style={{ margin: 0, fontSize: '0.8rem', fontWeight: '800', color: 'var(--color-text-primary)' }}>{brand.name}</h5>
                    <span style={{ fontSize: '0.68rem', color: '#059669', fontWeight: '750' }}>{brand.offerText}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 5. OFFERS COUPON ROW */}
        {matchingCoupons.length > 0 && (
          <div className={styles.offersRow}>
            {matchingCoupons.map((coupon, idx) => (
              <div key={idx} className={styles.offerCard} style={{ borderColor: coupon.accentColor }}>
                <FiPercent className={styles.offerIcon} style={{ color: coupon.accentColor }} />
                <div>
                  <strong style={{ color: coupon.accentColor }}>{coupon.description}</strong>
                  <span>Use code <strong>{coupon.code}</strong> at checkout</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 6. FILTER & SORT CONTROLS BAR */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: '12px 20px',
          borderRadius: '12px',
          border: '1.5px solid var(--color-border)',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '800', color: 'var(--color-text-secondary)' }}>
              <FiFilter /> Filter:
            </span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={inStockOnly} 
                onChange={(e) => setInStockOnly(e.target.checked)} 
                style={{ width: '16px', height: '16px', accentColor: category.primaryColor }}
              />
              In Stock Only
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '800', color: 'var(--color-text-secondary)' }}>
              <FiSliders /> Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1.5px solid var(--color-border)',
                fontSize: '0.8rem',
                fontWeight: '750',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="relevance">Popularity</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Average Rating</option>
            </select>
          </div>
        </div>

        {/* 7. PRODUCT GRID */}
        <div className={styles.layoutGrid}>
          
          <div className={styles.mainGridCol}>
            <div className={styles.sectionHeader}>
              <h3>Available {category.name} ({filteredItems.length} items found)</h3>
              <p>Delivery time calculated dynamically based on darkstore coordinates.</p>
            </div>

            {filteredItems.length > 0 ? (
              <div className={styles.productsGrid}>
                {filteredItems.map((prod, idx) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            ) : (
              <div className={styles.noProducts}>
                <FiInfo size={32} />
                <p>No quick-commerce items fit the active filters.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
