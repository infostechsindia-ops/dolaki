'use client';

import React from 'react';
import ProductCard, { ProductCardData } from '@/components/ProductCard';
import styles from './ProductGridSection.module.css';

export interface ProductGridSectionProps {
  products: ProductCardData[];
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function ProductGridSection({
  products,
  surface = 'MARKETPLACE',
}: ProductGridSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <div
      className={styles.grid}
      data-testid="product-grid-section"
      aria-label={`${products.length} products`}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={{ ...product, surface }}
        />
      ))}
    </div>
  );
}
