'use client';

import React from 'react';
import styles from './ReviewRating.module.css';

export interface ReviewRatingProps {
  rating: number;
  maxRating?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export default function ReviewRating({
  rating,
  maxRating = 5,
  interactive = false,
  onChange,
  size = 'md',
  className = '',
  label,
}: ReviewRatingProps) {
  const roundedRating = Math.round(rating * 10) / 10;
  const fullStars = Math.floor(roundedRating);
  const hasHalfStar = roundedRating - fullStars >= 0.5;
  const emptyStars = Math.max(0, maxRating - fullStars - (hasHalfStar ? 1 : 0));
  const accessibleText = label || `${roundedRating} out of ${maxRating} stars`;

  if (interactive) {
    return (
      <div
        className={`${styles.radioGroup} ${styles[size]} ${className}`}
        role="radiogroup"
        aria-label={accessibleText}
        data-testid="review-rating-interactive"
      >
        {Array.from({ length: maxRating }, (_, i) => {
          const starValue = i + 1;
          const isSelected = Math.round(rating) >= starValue;
          return (
            <button
              key={`star-radio-${starValue}`}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${starValue} ${starValue === 1 ? 'star' : 'stars'}`}
              className={`${styles.radioItem} ${isSelected ? styles.radioItemActive : ''}`}
              onClick={() => onChange?.(starValue)}
              data-testid={`rating-star-btn-${starValue}`}
            >
              <span aria-hidden="true">{isSelected ? '★' : '☆'}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`${styles.root} ${styles[size]} ${className}`}
      role="img"
      aria-label={accessibleText}
      data-testid="review-rating"
    >
      <div className={styles.stars}>
        {Array.from({ length: fullStars }, (_, i) => (
          <span key={`full-${i}`} className={`${styles.star} ${styles.starFull}`} aria-hidden="true">★</span>
        ))}
        {hasHalfStar && (
          <span className={`${styles.star} ${styles.starHalf}`} aria-hidden="true">★</span>
        )}
        {Array.from({ length: emptyStars }, (_, i) => (
          <span key={`empty-${i}`} className={`${styles.star} ${styles.starEmpty}`} aria-hidden="true">☆</span>
        ))}
      </div>
      <span className={styles.srOnly}>{accessibleText}</span>
    </div>
  );
}
