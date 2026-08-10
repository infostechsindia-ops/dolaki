'use client';

import React from 'react';
import Chip from '@/components/ui/Chip';
import styles from './ActiveFilters.module.css';

export interface ActiveFilter {
  id: string;
  label: string;
  group?: string;
}

export interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onRemove: (id: string) => void;
  onClearAll?: () => void;
}

export default function ActiveFilters({ filters, onRemove, onClearAll }: ActiveFiltersProps) {
  if (!filters || filters.length === 0) return null;

  return (
    <div className={styles.root} data-testid="active-filters" aria-label="Active filters">
      <span className={styles.label}>Filtered by:</span>
      <div className={styles.chips} role="list">
        {filters.map((filter) => (
          <div key={filter.id} role="listitem">
            <Chip
              label={filter.label}
              variant="primary"
              selected
              onRemove={() => onRemove(filter.id)}
            />
          </div>
        ))}
      </div>
      {onClearAll && filters.length > 1 && (
        <button
          type="button"
          className={styles.clearAllBtn}
          onClick={onClearAll}
          aria-label="Clear all active filters"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
