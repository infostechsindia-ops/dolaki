'use client';

import React from 'react';
import ProductCard from '@/components/ProductCard';
import styles from './FeaturedProducts.module.css';

export interface FeaturedProductsProps {
  products: any[];
  title: string;
  subtitle?: string;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function FeaturedProducts({
  products,
  title,
  subtitle,
  surface = 'MARKETPLACE'
}: FeaturedProductsProps) {
  if (!products || products.length === 0) return null;

  const isFlado = surface === 'QUICK_COMMERCE';

  return (
    <section className={`${styles.section} ${isFlado ? styles.quickCommerce : ''}`} aria-label={title}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
      </div>
      <div className={styles.homeProductGrid} data-testid="featured-products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
