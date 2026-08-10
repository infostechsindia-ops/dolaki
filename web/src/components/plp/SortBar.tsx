'use client';

import React from 'react';
import styles from './SortBar.module.css';

export type SortOption =
  | 'relevance'
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'popularity';

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance',   label: 'Relevance' },
  { value: 'newest',      label: 'Newest' },
  { value: 'price_asc',   label: 'Price: Low → High' },
  { value: 'price_desc',  label: 'Price: High → Low' },
  { value: 'popularity',  label: 'Popularity' },
];

export interface SortBarProps {
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalResults?: number;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function SortBar({
  selectedSort,
  onSortChange,
  totalResults,
  surface = 'MARKETPLACE',
}: SortBarProps) {
  const isFlado = surface === 'QUICK_COMMERCE';

  return (
    <div className={`${styles.root} ${isFlado ? styles.flado : ''}`} data-testid="sort-bar">
      {totalResults != null && (
        <span className={styles.count} aria-live="polite">
          {totalResults.toLocaleString()} items
        </span>
      )}

      <div className={styles.sortGroup} role="group" aria-label="Sort results by">
        <label htmlFor="sort-select" className={styles.sortLabel}>
          Sort by:
        </label>
        <select
          id="sort-select"
          className={`${styles.select} ${isFlado ? styles.fladoSelect : ''}`}
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          aria-label="Sort products by"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
