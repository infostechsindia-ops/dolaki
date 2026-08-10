'use client';

import React from 'react';
import styles from './ProductSort.module.css';

export type ProductSortOption =
  | 'featured'
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'highest_rated';

export const PRODUCT_SORT_OPTIONS: { value: ProductSortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'highest_rated', label: 'Highest Rated' },
];

export interface ProductSortProps {
  selectedSort: string;
  onSortChange: (sort: string) => void;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function ProductSort({
  selectedSort,
  onSortChange,
  surface = 'MARKETPLACE',
}: ProductSortProps) {
  const isFlado = surface === 'QUICK_COMMERCE';

  return (
    <div className={styles.root} data-testid="product-sort">
      <label htmlFor="plp-sort-select" className={styles.label}>
        Sort by:
      </label>
      <select
        id="plp-sort-select"
        className={`${styles.select} ${isFlado ? styles.fladoSelect : ''}`}
        value={selectedSort}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort products"
      >
        {PRODUCT_SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
