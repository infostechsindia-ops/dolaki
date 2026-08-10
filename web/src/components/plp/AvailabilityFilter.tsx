'use client';

import React from 'react';
import FilterSection from './FilterSection';
import styles from './AvailabilityFilter.module.css';

export interface AvailabilityOption {
  id: string;
  label: string;
  count?: number;
}

export interface AvailabilityFilterProps {
  options?: AvailabilityOption[];
  selectedIds?: string[];
  onChange?: (id: string, checked: boolean) => void;
  title?: string;
}

const DEFAULT_AVAILABILITY: AvailabilityOption[] = [
  { id: 'in_stock', label: 'In Stock' },
  { id: 'out_of_stock', label: 'Out of Stock' },
  { id: 'preorder', label: 'Preorder' },
];

export default function AvailabilityFilter({
  options = DEFAULT_AVAILABILITY,
  selectedIds = [],
  onChange,
  title = 'Availability',
}: AvailabilityFilterProps) {
  return (
    <FilterSection title={title}>
      <div className={styles.list}>
        {options.map((opt) => {
          const isChecked = selectedIds.includes(opt.id);
          return (
            <label key={opt.id} className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => onChange?.(opt.id, e.target.checked)}
                className={styles.checkbox}
                aria-label={`Filter by ${opt.label}`}
              />
              <span className={styles.label}>{opt.label}</span>
              {opt.count != null && (
                <span className={styles.count}>({opt.count})</span>
              )}
            </label>
          );
        })}
      </div>
    </FilterSection>
  );
}
