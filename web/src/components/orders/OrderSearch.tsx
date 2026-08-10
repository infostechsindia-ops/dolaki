'use client';

import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import styles from './OrderSearch.module.css';

export interface OrderSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

export default function OrderSearch({
  value,
  onChange,
  onClear,
  placeholder = 'Search by order ID, item name, or brand...',
}: OrderSearchProps) {
  return (
    <div className={styles.container} data-testid="order-search">
      <label htmlFor="order-search-input" className={styles.label}>
        Search Orders
      </label>

      <div className={styles.inputWrap}>
        <FiSearch className={styles.searchIcon} aria-hidden="true" />
        <input
          id="order-search-input"
          type="search"
          className={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          data-testid="order-search-input"
        />

        {value && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => {
              onChange('');
              onClear?.();
            }}
            aria-label="Clear search input"
            data-testid="clear-search-btn"
          >
            <FiX aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
