'use client';

import React from 'react';
import styles from './FilterSidebar.module.css';

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface PriceRange {
  min: number;
  max: number;
  label: string;
}

export interface FilterSidebarProps {
  categories?: FilterOption[];
  brands?: FilterOption[];
  priceRanges?: PriceRange[];
  ratings?: FilterOption[];
  availabilityOptions?: FilterOption[];

  selectedCategories?: string[];
  selectedBrands?: string[];
  selectedPriceRange?: string | null;
  selectedRatings?: string[];
  selectedAvailability?: string[];

  onCategoryChange?: (id: string, checked: boolean) => void;
  onBrandChange?: (id: string, checked: boolean) => void;
  onPriceRangeChange?: (label: string) => void;
  onRatingChange?: (id: string, checked: boolean) => void;
  onAvailabilityChange?: (id: string, checked: boolean) => void;

  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.group}>
      <h3 className={styles.groupTitle}>{title}</h3>
      <div className={styles.groupContent}>{children}</div>
    </div>
  );
}

export default function FilterSidebar({
  categories = [],
  brands = [],
  priceRanges = [],
  ratings = [],
  availabilityOptions = [],
  selectedCategories = [],
  selectedBrands = [],
  selectedPriceRange = null,
  selectedRatings = [],
  selectedAvailability = [],
  onCategoryChange,
  onBrandChange,
  onPriceRangeChange,
  onRatingChange,
  onAvailabilityChange,
  isCollapsed = false,
  onToggleCollapse,
}: FilterSidebarProps) {
  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}
      aria-label="Product filters"
      data-testid="filter-sidebar"
    >
      <div className={styles.header}>
        <h2 className={styles.sidebarTitle}>Filters</h2>
        {onToggleCollapse && (
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={onToggleCollapse}
            aria-expanded={!isCollapsed}
            aria-controls="filter-sidebar-content"
          >
            {isCollapsed ? 'Show' : 'Hide'}
          </button>
        )}
      </div>

      <div
        id="filter-sidebar-content"
        className={styles.content}
        hidden={isCollapsed}
      >
        {/* Categories */}
        {categories.length > 0 && (
          <FilterGroup title="Category">
            {categories.map((cat) => (
              <label key={cat.id} className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.id)}
                  onChange={(e) => onCategoryChange?.(cat.id, e.target.checked)}
                  aria-label={`Filter by category ${cat.label}`}
                />
                <span className={styles.optionLabel}>{cat.label}</span>
                {cat.count != null && (
                  <span className={styles.optionCount}>({cat.count})</span>
                )}
              </label>
            ))}
          </FilterGroup>
        )}

        {/* Brands */}
        {brands.length > 0 && (
          <FilterGroup title="Brand">
            {brands.map((brand) => (
              <label key={brand.id} className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.id)}
                  onChange={(e) => onBrandChange?.(brand.id, e.target.checked)}
                  aria-label={`Filter by brand ${brand.label}`}
                />
                <span className={styles.optionLabel}>{brand.label}</span>
                {brand.count != null && (
                  <span className={styles.optionCount}>({brand.count})</span>
                )}
              </label>
            ))}
          </FilterGroup>
        )}

        {/* Price Ranges */}
        {priceRanges.length > 0 && (
          <FilterGroup title="Price Range">
            {priceRanges.map((range) => (
              <label key={range.label} className={styles.radioRow}>
                <input
                  type="radio"
                  name="price-range"
                  checked={selectedPriceRange === range.label}
                  onChange={() => onPriceRangeChange?.(range.label)}
                  aria-label={`Price range ${range.label}`}
                />
                <span className={styles.optionLabel}>{range.label}</span>
              </label>
            ))}
          </FilterGroup>
        )}

        {/* Ratings */}
        {ratings.length > 0 && (
          <FilterGroup title="Customer Rating">
            {ratings.map((rating) => (
              <label key={rating.id} className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={selectedRatings.includes(rating.id)}
                  onChange={(e) => onRatingChange?.(rating.id, e.target.checked)}
                  aria-label={`Filter by rating ${rating.label}`}
                />
                <span className={styles.optionLabel}>{rating.label}</span>
                {rating.count != null && (
                  <span className={styles.optionCount}>({rating.count})</span>
                )}
              </label>
            ))}
          </FilterGroup>
        )}

        {/* Availability */}
        {availabilityOptions.length > 0 && (
          <FilterGroup title="Availability">
            {availabilityOptions.map((opt) => (
              <label key={opt.id} className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={selectedAvailability.includes(opt.id)}
                  onChange={(e) => onAvailabilityChange?.(opt.id, e.target.checked)}
                  aria-label={`Filter by ${opt.label}`}
                />
                <span className={styles.optionLabel}>{opt.label}</span>
                {opt.count != null && (
                  <span className={styles.optionCount}>({opt.count})</span>
                )}
              </label>
            ))}
          </FilterGroup>
        )}
      </div>
    </aside>
  );
}
