'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiChevronLeft, FiZap, FiInfo } from 'react-icons/fi';
import { fladoCategoriesData } from '@/data/fladoCategories';
import { fladoProductsData } from '@/data/fladoProducts';
import ProductCard from '@/components/ProductCard';
import styles from '../page.module.css';

interface FladoSubCategoryPageProps {
  params: Promise<{
    slug: string;
    sub: string;
  }>;
}

export default function FladoSubCategoryPage({ params }: FladoSubCategoryPageProps) {
  const { slug, sub } = use(params);
  const [productList, setProductList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const category = fladoCategoriesData.find(c => c.slug === slug);
  if (!category) {
    notFound();
  }

  // Format sub slug: e.g. "fresh-fruits" -> "Fresh Fruits"
  const formattedSub = sub
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

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
            isFlado: true,
            category: bp.category || 'groceries',
            subCategory: bp.subCategory || '',
            brand: bp.brand || ''
          }));
        } else {
          items = fladoProductsData;
        }
      } catch (e) {
        items = fladoProductsData;
      }
      
      const filtered = items.filter(p => 
        p.isFlado && 
        p.category === slug && 
        (p.subCategory || '').toLowerCase().includes(formattedSub.toLowerCase())
      );
      setProductList(filtered);
      setLoading(false);
    };

    loadProducts();
  }, [slug, formattedSub]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading {formattedSub}...</p>
      </div>
    );
  }

  return (
    <div className={styles.fladoCategoryPage} style={{ '--flado-primary': category.primaryColor } as React.CSSProperties}>
      <div className={styles.fladoMiniHeader}>
        <div className="container">
          <div className={styles.miniHeaderInner}>
            <Link href={`/flado/categories/${slug}`} className={styles.backBtn}>
              <FiChevronLeft /> Back to {category.name}
            </Link>
            <div className={styles.etaBadge}>
              <FiZap className={styles.zapIcon} />
              <span>Instant Dispatch in <strong>10 Mins</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '30px' }}>
        <div className={styles.sectionHeader} style={{ marginBottom: '24px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--flado-primary)', fontWeight: '900', textTransform: 'uppercase' }}>
            {category.name}  ▸ {formattedSub}
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '900', margin: '4px 0 0 0', color: 'var(--color-text-primary)' }}>
            Shop {formattedSub} ({productList.length} Items)
          </h2>
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
            <p>No products are currently in stock in this sub-category.</p>
            <Link href={`/flado/categories/${slug}`} style={{ fontSize: '0.85rem', color: 'var(--flado-primary)', fontWeight: '850' }}>
              View all {category.name}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
