'use client';

import React from 'react';
import { FiStar } from 'react-icons/fi';
import FilterSection from './FilterSection';
import styles from './RatingFilter.module.css';

export interface RatingOption {
  rating: number;
  count?: number;
}

export interface RatingFilterProps {
  ratings?: RatingOption[];
  selectedRatings?: number[];
  onChange?: (rating: number, checked: boolean) => void;
  title?: string;
}

const DEFAULT_RATINGS: RatingOption[] = [
  { rating: 4 },
  { rating: 3 },
  { rating: 2 },
  { rating: 1 },
];

export default function RatingFilter({
  ratings = DEFAULT_RATINGS,
  selectedRatings = [],
  onChange,
  title = 'Rating',
}: RatingFilterProps) {
  return (
    <FilterSection title={title}>
      <div className={styles.list}>
        {ratings.map((opt) => {
          const isChecked = selectedRatings.includes(opt.rating);
          return (
            <label key={opt.rating} className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => onChange?.(opt.rating, e.target.checked)}
                className={styles.checkbox}
                aria-label={`Filter by rating ${opt.rating} stars and above`}
              />
              <div className={styles.stars}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <FiStar
                    key={idx}
                    className={idx < opt.rating ? styles.starFilled : styles.starEmpty}
                  />
                ))}
              </div>
              <span className={styles.label}>& up</span>
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
