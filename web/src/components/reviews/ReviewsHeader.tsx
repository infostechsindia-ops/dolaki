'use client';

import React from 'react';
import styles from './ReviewsHeader.module.css';

export interface ReviewsHeaderProps {
  title?: string;
  totalReviews: number;
  onWriteReview?: () => void;
  className?: string;
}

export default function ReviewsHeader({
  title = 'Customer Reviews',
  totalReviews,
  onWriteReview,
  className = '',
}: ReviewsHeaderProps) {
  return (
    <div className={`${styles.root} ${className}`} data-testid="reviews-header">
      <div className={styles.headingWrapper}>
        <h2 className={styles.title} data-testid="reviews-header-title">
          {title}
        </h2>
        <span className={styles.count} data-testid="reviews-header-count">
          ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
        </span>
      </div>

      {onWriteReview && (
        <button
          type="button"
          className={styles.writeBtn}
          onClick={onWriteReview}
          data-testid="write-review-btn"
        >
          Write a Review
        </button>
      )}
    </div>
  );
}
