'use client';

import React from 'react';
import styles from './RatingDistribution.module.css';

export interface RatingDistributionItem {
  rating: number; // 5, 4, 3, 2, 1
  count: number;
  percentage: number; // 0 to 100
}

export interface RatingDistributionProps {
  distribution: RatingDistributionItem[];
  className?: string;
}

export default function RatingDistribution({
  distribution,
  className = '',
}: RatingDistributionProps) {
  // Ordered 5 to 1
  const sorted = [...distribution].sort((a, b) => b.rating - a.rating);

  return (
    <div
      className={`${styles.root} ${className}`}
      data-testid="rating-distribution"
      aria-label="Rating distribution summary"
    >
      {sorted.map((item) => (
        <div
          key={`rating-row-${item.rating}`}
          className={styles.row}
          data-testid={`distribution-row-${item.rating}`}
        >
          <span className={styles.label}>
            <span>{item.rating}</span>
            <span aria-hidden="true" style={{ color: 'var(--color-star, #f59e0b)' }}>★</span>
          </span>

          <progress
            className={styles.barTrack}
            value={item.percentage}
            max={100}
            aria-label={`${item.rating} star reviews: ${item.percentage}% (${item.count})`}
            data-testid={`distribution-progress-${item.rating}`}
          />

          <span className={styles.countCol} data-testid={`distribution-count-${item.rating}`}>
            {item.count}
          </span>
        </div>
      ))}
    </div>
  );
}
