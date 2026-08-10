'use client';

import React from 'react';
import FilterSection from './FilterSection';
import styles from './PriceFilter.module.css';

export interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  currentMin?: number;
  currentMax?: number;
  currencySymbol?: string;
  onPriceChange?: (min: number, max: number) => void;
  title?: string;
}

export default function PriceFilter({
  minPrice,
  maxPrice,
  currentMin = minPrice,
  currentMax = maxPrice,
  currencySymbol = '₹',
  onPriceChange,
  title = 'Price Range',
}: PriceFilterProps) {
  return (
    <FilterSection title={title}>
      <div className={styles.container}>
        <div className={styles.rangeDisplay}>
          <span className={styles.priceLabel}>
            {currencySymbol}{currentMin.toLocaleString()}
          </span>
          <span className={styles.dash}>-</span>
          <span className={styles.priceLabel}>
            {currencySymbol}{currentMax.toLocaleString()}
          </span>
        </div>

        {/* Presentational price range sliders */}
        <div className={styles.inputsRow}>
          <label className={styles.inputGroup}>
            <span className={styles.inputMeta}>Min</span>
            <input
              type="number"
              min={minPrice}
              max={currentMax}
              value={currentMin}
              onChange={(e) =>
                onPriceChange?.(Number(e.target.value) || minPrice, currentMax)
              }
              className={styles.numInput}
              aria-label="Minimum price"
            />
          </label>

          <label className={styles.inputGroup}>
            <span className={styles.inputMeta}>Max</span>
            <input
              type="number"
              min={currentMin}
              max={maxPrice}
              value={currentMax}
              onChange={(e) =>
                onPriceChange?.(currentMin, Number(e.target.value) || maxPrice)
              }
              className={styles.numInput}
              aria-label="Maximum price"
            />
          </label>
        </div>

        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={currentMax}
          onChange={(e) => onPriceChange?.(currentMin, Number(e.target.value))}
          className={styles.rangeSlider}
          aria-label="Price range slider"
        />
      </div>
    </FilterSection>
  );
}
