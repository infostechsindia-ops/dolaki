'use client';

import React from 'react';
import BrandFilter, { BrandItem } from './BrandFilter';
import PriceFilter from './PriceFilter';
import RatingFilter, { RatingOption } from './RatingFilter';
import AvailabilityFilter, { AvailabilityOption } from './AvailabilityFilter';
import styles from './ProductFilters.module.css';

export interface ProductFiltersProps {
  brands?: BrandItem[];
  selectedBrandIds?: string[];
  onBrandChange?: (brandId: string, checked: boolean) => void;

  minPrice?: number;
  maxPrice?: number;
  currentMinPrice?: number;
  currentMaxPrice?: number;
  onPriceChange?: (min: number, max: number) => void;

  ratings?: RatingOption[];
  selectedRatings?: number[];
  onRatingChange?: (rating: number, checked: boolean) => void;

  availabilityOptions?: AvailabilityOption[];
  selectedAvailabilityIds?: string[];
  onAvailabilityChange?: (id: string, checked: boolean) => void;

  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onClearAll?: () => void;
}

export default function ProductFilters({
  brands = [],
  selectedBrandIds,
  onBrandChange,
  minPrice = 0,
  maxPrice = 10000,
  currentMinPrice,
  currentMaxPrice,
  onPriceChange,
  ratings,
  selectedRatings,
  onRatingChange,
  availabilityOptions,
  selectedAvailabilityIds,
  onAvailabilityChange,
  isCollapsed = false,
  onToggleCollapse,
  onClearAll,
}: ProductFiltersProps) {
  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}
      aria-label="Product filters"
      data-testid="product-filters"
    >
      <div className={styles.header}>
        <h2 className={styles.sidebarTitle}>Filters</h2>
        <div className={styles.headerActions}>
          {onClearAll && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={onClearAll}
              aria-label="Clear all filters"
            >
              Clear
            </button>
          )}
          {onToggleCollapse && (
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={onToggleCollapse}
              aria-expanded={!isCollapsed}
              aria-controls="product-filters-content"
            >
              {isCollapsed ? 'Show' : 'Hide'}
            </button>
          )}
        </div>
      </div>

      <div
        id="product-filters-content"
        className={styles.content}
        hidden={isCollapsed}
      >
        <BrandFilter
          brands={brands}
          selectedBrandIds={selectedBrandIds}
          onChange={onBrandChange}
        />

        <div className={styles.divider} />

        <PriceFilter
          minPrice={minPrice}
          maxPrice={maxPrice}
          currentMin={currentMinPrice}
          currentMax={currentMaxPrice}
          onPriceChange={onPriceChange}
        />

        <div className={styles.divider} />

        <RatingFilter
          ratings={ratings}
          selectedRatings={selectedRatings}
          onChange={onRatingChange}
        />

        <div className={styles.divider} />

        <AvailabilityFilter
          options={availabilityOptions}
          selectedIds={selectedAvailabilityIds}
          onChange={onAvailabilityChange}
        />
      </div>
    </aside>
  );
}
