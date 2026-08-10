'use client';

import React from 'react';
import styles from './WishlistToolbar.module.css';

export interface WishlistToolbarProps {
  itemCount: number;
  sortBy: string;
  onSortChange: (sortVal: string) => void;
  inStockOnly?: boolean;
  onInStockToggle?: (inStockOnly: boolean) => void;
  sortOptions?: { value: string; label: string }[];
}

const DEFAULT_SORT_OPTIONS = [
  { value: 'DATE_ADDED_DESC', label: 'Recently Added' },
  { value: 'PRICE_LOW_HIGH', label: 'Price: Low to High' },
  { value: 'PRICE_HIGH_LOW', label: 'Price: High to Low' },
  { value: 'DISCOUNT_DESC', label: 'Highest Discount' },
];

export default function WishlistToolbar({
  itemCount,
  sortBy,
  onSortChange,
  inStockOnly = false,
  onInStockToggle,
  sortOptions = DEFAULT_SORT_OPTIONS,
}: WishlistToolbarProps) {
  return (
    <div className={styles.toolbar} data-testid="wishlist-toolbar">
      <div className={styles.countText} data-testid="wishlist-toolbar-count">
        Showing <strong>{itemCount}</strong> {itemCount === 1 ? 'saved item' : 'saved items'}
      </div>

      <div className={styles.controlsGroup}>
        {/* Availability Filter */}
        {onInStockToggle !== undefined && (
          <label htmlFor="wishlist-instock-toggle" className={styles.checkboxLabel}>
            <input
              id="wishlist-instock-toggle"
              type="checkbox"
              className={styles.checkbox}
              checked={inStockOnly}
              onChange={(e) => onInStockToggle(e.target.checked)}
              data-testid="wishlist-instock-filter"
            />
            <span>In Stock Only</span>
          </label>
        )}

        {/* Sort Select */}
        <div className={styles.sortGroup}>
          <label htmlFor="wishlist-sort-select" className={styles.sortLabel}>
            Sort By:
          </label>
          <select
            id="wishlist-sort-select"
            className={styles.select}
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort wishlist items"
            data-testid="wishlist-sort-select"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
