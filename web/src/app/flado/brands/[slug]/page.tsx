'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiChevronLeft, FiZap, FiInfo, FiPercent, FiAward } from 'react-icons/fi';
import { brandsData } from '@/data/brands';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

interface FladoBrandPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function FladoBrandPage({ params }: FladoBrandPageProps) {
  const { slug } = use(params);
  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState<any[]>([]);

  const brand = brandsData.find(b => b.slug === slug);
  if (!brand) {
    notFound();
  }

  useEffect(() => {
    const loadProducts = async () => {
      let items: any[] = [];
      try {
        const res = await fetch('http://localhost:5000/api/products');
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
            isFlado: bp.isQuickCommerce ?? false,
            category: bp.category || 'groceries',
            subCategory: bp.subCategory || '',
            brand: bp.brand || ''
          }));
        } else {
          items = products;
        }
      } catch (e) {
        console.log('Failed to load products for Flado brand page from API, using mock.', e);
        items = products;
      }
      // Filter to this brand and isFlado
      const brandItems = items.filter(
        p => p.isFlado && 
        (p.brand?.toLowerCase().trim() === brand.name.toLowerCase().trim() || 
         p.brand?.toLowerCase().trim() === brand.slug.toLowerCase().trim() ||
         p.name?.toLowerCase().includes(brand.name.toLowerCase()))
      );
      setProductList(brandItems);
      setLoading(false);
    };

    loadProducts();
  }, [slug]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading brand micro-store...</p>
      </div>
    );
  }

  const otherFladoBrands = brandsData
    .filter(b => b.slug !== slug && b.categories.some(c => ['groceries', 'dairy-bread', 'snacks-beverages'].includes(c)))
    .slice(0, 4);

  return (
    <div className={styles.fladoBrandPage} style={{ '--brand-primary': brand.primaryColor } as React.CSSProperties}>
      
      {/* Top navigation */}
      <div className={styles.miniHeader}>
        <div className="container">
          <div className={styles.miniHeaderInner}>
            <Link href="/flado" className={styles.backBtn}>
              <FiChevronLeft /> Back to Flado Express
            </Link>
            <div className={styles.etaBadge}>
              <FiZap className={styles.zapIcon} />
              <span>Instant Delivery in <strong>10 Mins</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Hero Banner */}
      <div 
        className={styles.brandHero}
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.6) 60%, rgba(15, 23, 42, 0.2) 100%), url(${brand.bannerUrl})` 
        }}
      >
        <div className="container">
          <div className={styles.brandInfoRow}>
            <div className={styles.logoBox} style={{ borderColor: brand.primaryColor }}>
              <img src={brand.logo} alt={brand.name} className={styles.brandLogo} />
            </div>
            <div className={styles.brandTitles}>
              <span className={styles.officialTag} style={{ backgroundColor: brand.primaryColor }}>
                <FiAward size={10} style={{ marginRight: '4px' }} /> Certified Partner Store
              </span>
              <h1>{brand.name}</h1>
              <p>{brand.tagline}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '35px' }}>
        <div className={styles.gridContainer}>
          
          {/* Main Content Column */}
          <div className={styles.mainCol}>
            {/* Story Card */}
            <div className={styles.aboutCard}>
              <h3>About the Brand</h3>
              <p>{brand.story}</p>
            </div>

            {/* Product Catalog list */}
            <div className={styles.sectionHeader}>
              <h2>Quick Commerce Catalog ({productList.length} Items)</h2>
              <p>In-stock and ready to dispatch instantly from local darkstores.</p>
            </div>

            {productList.length > 0 ? (
              <div className={styles.productsGrid}>
                {productList.map(prod => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            ) : (
              <div className={styles.noProducts}>
                <FiInfo size={32} />
                <p>No products are currently in stock for this brand in your local fulfillment zone.</p>
              </div>
            )}
          </div>

          {/* Sidebar recommendations */}
          <div className={styles.sidebarCol}>
            <div className={styles.couponWidget} style={{ borderLeftColor: brand.primaryColor }}>
              <div className={styles.couponHeader}>
                <FiPercent className={styles.percentIcon} style={{ color: brand.primaryColor }} />
                <h4>Exclusive Brand Coupon</h4>
              </div>
              <p>Save flat 10% on your purchases from this brand hub.</p>
              <div className={styles.couponCodeCard} style={{ borderColor: brand.primaryColor, borderStyle: 'dashed' }}>
                <span>Code: <strong>{brand.name.toUpperCase()}FLADO</strong></span>
              </div>
            </div>

            <div className={styles.similarBrandsCard}>
              <h3>Other Quick Brands</h3>
              <div className={styles.compactBrandsList}>
                {otherFladoBrands.map(ob => (
                  <Link href={`/flado/brands/${ob.slug}`} key={ob.slug} className={styles.brandRowItem}>
                    <img src={ob.logo} alt={ob.name} />
                    <div>
                      <h5>{ob.name}</h5>
                      <span>{ob.tagline}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
