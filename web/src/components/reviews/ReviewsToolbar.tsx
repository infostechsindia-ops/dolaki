'use client';

import React from 'react';
import styles from './ReviewsToolbar.module.css';

export interface ReviewsToolbarProps {
  sortBy?: string;
  ratingFilter?: string | number;
  verifiedOnly?: boolean;
  onSortChange?: (sortBy: string) => void;
  onRatingFilterChange?: (rating: string) => void;
  onVerifiedFilterChange?: (verifiedOnly: boolean) => void;
  className?: string;
}

export default function ReviewsToolbar({
  sortBy = 'MOST_RECENT',
  ratingFilter = 'ALL',
  verifiedOnly = false,
  onSortChange,
  onRatingFilterChange,
  onVerifiedFilterChange,
  className = '',
}: ReviewsToolbarProps) {
  return (
    <div className={`${styles.root} ${className}`} data-testid="reviews-toolbar">
      <div className={styles.controls}>
        {/* Sort Select */}
        <div className={styles.selectGroup}>
          <label htmlFor="reviews-sort-select" className={styles.label}>
            Sort by:
          </label>
          <select
            id="reviews-sort-select"
            className={styles.select}
            value={sortBy}
            onChange={(e) => onSortChange?.(e.target.value)}
            data-testid="reviews-sort-select"
          >
            <option value="MOST_RECENT">Most Recent</option>
            <option value="HIGHEST_RATING">Highest Rating</option>
            <option value="LOWEST_RATING">Lowest Rating</option>
            <option value="MOST_HELPFUL">Most Helpful</option>
          </select>
        </div>

        {/* Rating Filter Select */}
        <div className={styles.selectGroup}>
          <label htmlFor="reviews-rating-filter" className={styles.label}>
            Filter rating:
          </label>
          <select
            id="reviews-rating-filter"
            className={styles.select}
            value={String(ratingFilter)}
            onChange={(e) => onRatingFilterChange?.(e.target.value)}
            data-testid="reviews-rating-filter"
          >
            <option value="ALL">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        {/* Verified Purchase Checkbox */}
        <label className={styles.checkboxGroup} htmlFor="reviews-verified-filter">
          <input
            type="checkbox"
            id="reviews-verified-filter"
            className={styles.checkbox}
            checked={verifiedOnly}
            onChange={(e) => onVerifiedFilterChange?.(e.target.checked)}
            data-testid="reviews-verified-filter"
          />
          <span>Verified Purchases Only</span>
        </label>
      </div>
    </div>
  );
}
