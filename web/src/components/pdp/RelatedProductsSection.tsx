'use client';

import React from 'react';
import ProductCard, { ProductCardData } from '@/components/ProductCard';
import styles from './RelatedProductsSection.module.css';

export interface RelatedProductsSectionProps {
  products: ProductCardData[];
  title?: string;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function RelatedProductsSection({
  products,
  title = 'Related Products',
  surface = 'MARKETPLACE',
}: RelatedProductsSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className={styles.section} data-testid="related-products-section">
      <h2 className={styles.heading}>{title}</h2>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{ ...product, surface }}
          />
        ))}
      </div>
    </section>
  );
}
