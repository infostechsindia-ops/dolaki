'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiChevronLeft, FiShoppingBag, FiInfo, FiAward } from 'react-icons/fi';
import { brandsData } from '@/data/brands';
import { products as localProducts, Product } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

interface BrandStorePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function BrandStorePage({ params }: BrandStorePageProps) {
  const { slug } = use(params);
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const brand = brandsData.find(b => b.slug === slug);
  if (!brand) {
    notFound();
  }

  useEffect(() => {
    const loadBrandProducts = async () => {
      let items: Product[] = [];
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
            category: bp.category || 'groceries',
            subCategory: bp.subCategory || '',
            brand: bp.brand || ''
          }));
        } else {
          items = localProducts;
        }
      } catch (e) {
        items = localProducts;
      }
      setProductList(items);
      setLoading(false);
    };
    loadBrandProducts();
  }, []);

  // Filter products by brand name or slug
  const brandProducts = productList.filter(
    p => p.brand?.toLowerCase().trim() === brand.name.toLowerCase().trim() || 
         p.brand?.toLowerCase().trim() === brand.slug.toLowerCase().trim() ||
         p.name?.toLowerCase().includes(brand.name.toLowerCase())
  );

  // Featured bestseller products
  const bestsellerProducts = productList.filter(
    p => brand.featuredProductIds.includes(p.id)
  );

  // Recommendations of other brands
  const otherBrands = brandsData
    .filter(b => b.slug !== slug)
    .slice(0, 4);

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p>Loading {brand.name} official store...</p>
      </div>
    );
  }

  return (
    <div className={styles.brandStorePage} style={{ '--brand-primary': brand.primaryColor } as React.CSSProperties}>
      {/* Brand Header Hero Banner */}
      <div 
        className={styles.brandHero}
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.6) 60%, rgba(15, 23, 42, 0.2) 100%), url(${brand.bannerUrl})` 
        }}
      >
        <div className="container">
          <Link href="/brands" className={styles.backBtn}>
            <FiChevronLeft /> Return to Brands
          </Link>
          <div className={styles.brandInfoBlock}>
            <div className={styles.brandLogoBox} style={{ borderColor: brand.primaryColor }}>
              <img src={brand.logo} alt={brand.name} className={styles.brandLogo} />
            </div>
            <div className={styles.brandTitles}>
              <span className={styles.officialBadge} style={{ backgroundColor: brand.primaryColor }}>
                <FiAward size={10} style={{ marginRight: '4px' }} /> Flagship Brand Store
              </span>
              <h1>{brand.name}</h1>
              <p className={styles.tagline}>{brand.tagline}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '45px' }}>
        <div className={styles.gridContainer}>
          {/* Main Catalog Column */}
          <div className={styles.catalogCol}>
            
            {/* Brand Story Section */}
            <div className={styles.storyCard}>
              <h3>About {brand.name}</h3>
              <p>{brand.story}</p>
            </div>

            {/* Bestsellers carousel/row */}
            {bestsellerProducts.length > 0 && (
              <div className={styles.carouselSection}>
                <h3 className={styles.sectionTitle}>🏆 Bestsellers from {brand.name}</h3>
                <div className={styles.bestsellersList}>
                  {bestsellerProducts.map(product => (
                    <div key={product.id} className={styles.bestsellerCardWrapper}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Official Catalog Grid */}
            <div className={styles.catalogHeader}>
              <h2>Official Catalog ({brandProducts.length} Items)</h2>
              <p>Authentic products sourced directly from authorized brand channel distributors.</p>
            </div>

            {brandProducts.length > 0 ? (
              <div className={styles.productsGrid}>
                {brandProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className={styles.noProducts}>
                <FiInfo size={32} />
                <p>No products are currently listed in the {brand.name} official database storefront.</p>
              </div>
            )}
          </div>

          {/* Sidebar Recommendation Column */}
          <div className={styles.sidebarCol}>
            <div className={styles.promoWidget} style={{ background: `linear-gradient(135deg, ${brand.primaryColor}22 0%, ${brand.accentColor}11 100%)`, borderLeft: `4px solid ${brand.primaryColor}` }}>
              <h4>⚡ AuraMart Certified Partner</h4>
              <p>All items from {brand.name} store come with 100% replacement warranty and secure payments.</p>
              <span className={styles.couponTag}>Use Coupon Code: <strong>{brand.name.toUpperCase()}10</strong> for extra 10% off.</span>
            </div>

            <div className={styles.relatedBrandsWidget}>
              <h3>Similar Flagship Stores</h3>
              <div className={styles.brandsListCompact}>
                {otherBrands.map(b => (
                  <Link href={`/brands/${b.slug}`} key={b.slug} className={styles.brandRowItem}>
                    <img src={b.logo} alt={b.name} />
                    <div>
                      <h5>{b.name}</h5>
                      <span>{b.tagline}</span>
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
