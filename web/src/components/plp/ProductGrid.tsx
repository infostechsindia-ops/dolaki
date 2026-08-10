'use client';

import React from 'react';
import ProductCard, { ProductCardData } from '@/components/ProductCard';
import styles from './ProductGrid.module.css';

export interface ProductGridProps {
  products: ProductCardData[];
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
  viewMode?: 'grid' | 'list';
}

export default function ProductGrid({
  products,
  surface = 'MARKETPLACE',
  viewMode = 'grid',
}: ProductGridProps) {
  if (!products || products.length === 0) return null;

  return (
    <div
      className={`${styles.container} ${viewMode === 'list' ? styles.listView : styles.gridView}`}
      data-testid="product-grid"
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
