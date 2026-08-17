'use client';

import React, { useState, useEffect } from 'react';
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
  const [localMin, setLocalMin] = useState<number | string>(currentMin);
  const [localMax, setLocalMax] = useState<number | string>(currentMax);

  useEffect(() => {
    setLocalMin(currentMin);
  }, [currentMin]);

  useEffect(() => {
    setLocalMax(currentMax);
  }, [currentMax]);

  const numMin = Number(localMin);
  const numMax = Number(localMax);
  const isInvalid = !isNaN(numMin) && !isNaN(numMax) && numMin > numMax;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalMin(val);
    const nMin = Number(val);
    const nMax = Number(localMax);
    if (!isNaN(nMin) && !isNaN(nMax) && nMin <= nMax) {
      onPriceChange?.(nMin, nMax);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalMax(val);
    const nMin = Number(localMin);
    const nMax = Number(val);
    if (!isNaN(nMin) && !isNaN(nMax) && nMin <= nMax) {
      onPriceChange?.(nMin, nMax);
    }
  };

  const handleApply = () => {
    if (!isInvalid) {
      onPriceChange?.(Number(localMin), Number(localMax));
    }
  };

  return (
    <FilterSection title={title}>
      <div className={styles.container}>
        <div className={styles.rangeDisplay}>
          <span className={styles.priceLabel}>
            {currencySymbol}{(numMin || 0).toLocaleString()}
          </span>
          <span className={styles.dash}>-</span>
          <span className={styles.priceLabel}>
            {currencySymbol}{(numMax || 0).toLocaleString()}
          </span>
        </div>

        {/* Presentational price range sliders */}
        <div className={styles.inputsRow}>
          <label className={styles.inputGroup}>
            <span className={styles.inputMeta}>Min</span>
            <input
              type="number"
              min={minPrice}
              max={maxPrice}
              value={localMin}
              onChange={handleMinChange}
              className={styles.numInput}
              aria-label="Minimum price"
            />
          </label>

          <label className={styles.inputGroup}>
            <span className={styles.inputMeta}>Max</span>
            <input
              type="number"
              min={minPrice}
              max={maxPrice}
              value={localMax}
              onChange={handleMaxChange}
              className={styles.numInput}
              aria-label="Maximum price"
            />
          </label>
        </div>

        {isInvalid && (
          <div className={styles.errorMessage} role="alert" data-testid="price-range-error">
            Min price cannot be greater than max price
          </div>
        )}

        <button
          type="button"
          className={styles.applyBtn}
          onClick={handleApply}
          disabled={isInvalid}
          data-testid="apply-filter-btn"
        >
          Apply Filter
        </button>

        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={numMax || maxPrice}
          onChange={(e) => {
            const val = Number(e.target.value);
            setLocalMax(val);
            if (Number(localMin) <= val) {
              onPriceChange?.(Number(localMin), val);
            }
          }}
          className={styles.rangeSlider}
          aria-label="Price range slider"
        />
      </div>
    </FilterSection>
  );
}

