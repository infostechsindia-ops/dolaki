'use client';

import React from 'react';
import { FiStar } from 'react-icons/fi';
import styles from './ProductReviewsSummary.module.css';

export interface RatingBreakdown {
  stars: number; // 5, 4, 3, 2, 1
  count: number;
  percentage: number; // 0 - 100
}

export interface ProductReviewsSummaryProps {
  averageRating: number;
  totalReviews: number;
  distribution?: RatingBreakdown[];
  onViewAllReviews?: () => void;
  title?: string;
}

export default function ProductReviewsSummary({
  averageRating,
  totalReviews,
  distribution = [],
  onViewAllReviews,
  title = 'Customer Reviews',
}: ProductReviewsSummaryProps) {
  return (
    <section className={styles.container} data-testid="product-reviews-summary">
      <h2 className={styles.heading}>{title}</h2>

      <div className={styles.body}>
        {/* Main rating score */}
        <div className={styles.scoreBlock}>
          <span className={styles.scoreNum}>{averageRating.toFixed(1)}</span>
          <div className={styles.stars}>
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar
                key={i}
                className={i < Math.round(averageRating) ? styles.starFilled : styles.starEmpty}
                aria-hidden="true"
              />
            ))}
          </div>
          <span className={styles.totalText}>Based on {totalReviews.toLocaleString()} reviews</span>

          {onViewAllReviews && (
            <button
              type="button"
              className={styles.viewBtn}
              onClick={onViewAllReviews}
              aria-label="View all customer reviews"
            >
              View All Reviews
            </button>
          )}
        </div>

        {/* Rating distribution breakdown bars */}
        {distribution.length > 0 && (
          <div className={styles.distributionBlock}>
            {distribution.map((item) => (
              <div key={item.stars} className={styles.distRow}>
                <span className={styles.starLabel}>{item.stars} ★</span>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${Math.min(Math.max(item.percentage, 0), 100)}%` }}
                  />
                </div>
                <span className={styles.distCount}>({item.count})</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
