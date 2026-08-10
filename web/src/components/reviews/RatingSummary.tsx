'use client';

import React from 'react';
import ReviewRating from './ReviewRating';
import styles from './RatingSummary.module.css';

export interface RatingSummaryProps {
  averageRating: number;
  formattedAverageRating?: string;
  totalReviews: number;
  totalRatings: number;
  className?: string;
}

export default function RatingSummary({
  averageRating,
  formattedAverageRating,
  totalReviews,
  totalRatings,
  className = '',
}: RatingSummaryProps) {
  const displayAverage = formattedAverageRating ?? averageRating.toFixed(1);

  return (
    <div className={`${styles.root} ${className}`} data-testid="rating-summary">
      <div className={styles.average} data-testid="rating-summary-average">
        {displayAverage}
      </div>
      <div className={styles.starsRow}>
        <ReviewRating rating={averageRating} size="lg" />
      </div>
      <div className={styles.counts} data-testid="rating-summary-counts">
        Based on {totalRatings} ratings &amp; {totalReviews} reviews
      </div>
    </div>
  );
}
