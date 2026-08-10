'use client';

import React from 'react';
import ProductCard from '@/components/ProductCard';
import styles from './SearchResultsGrid.module.css';

export interface SearchResultsGridProps {
  products: any[];
}

export default function SearchResultsGrid({ products }: SearchResultsGridProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className={styles.grid} data-testid="search-results-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
