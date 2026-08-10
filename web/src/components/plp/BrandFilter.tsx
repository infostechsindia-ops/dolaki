'use client';

import React from 'react';
import FilterSection from './FilterSection';
import styles from './BrandFilter.module.css';

export interface BrandItem {
  id: string;
  name: string;
  count?: number;
}

export interface BrandFilterProps {
  brands: BrandItem[];
  selectedBrandIds?: string[];
  onChange?: (brandId: string, checked: boolean) => void;
  title?: string;
}

export default function BrandFilter({
  brands,
  selectedBrandIds = [],
  onChange,
  title = 'Brand',
}: BrandFilterProps) {
  if (!brands || brands.length === 0) return null;

  return (
    <FilterSection title={title}>
      <div className={styles.list}>
        {brands.map((brand) => {
          const isChecked = selectedBrandIds.includes(brand.id);
          return (
            <label key={brand.id} className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => onChange?.(brand.id, e.target.checked)}
                className={styles.checkbox}
                aria-label={`Filter by brand ${brand.name}`}
              />
              <span className={styles.label}>{brand.name}</span>
              {brand.count != null && (
                <span className={styles.count}>({brand.count})</span>
              )}
            </label>
          );
        })}
      </div>
    </FilterSection>
  );
}
