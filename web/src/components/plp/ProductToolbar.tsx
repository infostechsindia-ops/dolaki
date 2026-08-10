'use client';

import React from 'react';
import { FiGrid, FiList } from 'react-icons/fi';
import ProductSort from './ProductSort';
import styles from './ProductToolbar.module.css';

export interface ProductToolbarProps {
  title: string;
  totalResults: number;
  selectedSort: string;
  onSortChange: (sort: string) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function ProductToolbar({
  title,
  totalResults,
  selectedSort,
  onSortChange,
  viewMode = 'grid',
  onViewModeChange,
  surface = 'MARKETPLACE',
}: ProductToolbarProps) {
  return (
    <div className={styles.toolbar} data-testid="product-toolbar">
      <div className={styles.leftGroup}>
        <h1 className={styles.title}>{title}</h1>
        <span className={styles.count} aria-live="polite">
          ({totalResults.toLocaleString()} items)
        </span>
      </div>

      <div className={styles.rightGroup}>
        {onViewModeChange && (
          <div className={styles.viewToggle} role="group" aria-label="View mode toggle">
            <button
              type="button"
              className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => onViewModeChange('grid')}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <FiGrid aria-hidden="true" />
            </button>
            <button
              type="button"
              className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => onViewModeChange('list')}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <FiList aria-hidden="true" />
            </button>
          </div>
        )}

        <ProductSort
          selectedSort={selectedSort}
          onSortChange={onSortChange}
          surface={surface}
        />
      </div>
    </div>
  );
}
