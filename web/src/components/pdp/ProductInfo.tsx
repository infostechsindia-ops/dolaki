'use client';

import React from 'react';
import { FiStar } from 'react-icons/fi';
import styles from './ProductInfo.module.css';

export interface ProductInfoProps {
  title: string;
  brand?: string;
  sku?: string;
  category?: string;
  shortDescription?: string;
  rating?: number;
  reviewCount?: number;
  badges?: string[];
}

export default function ProductInfo({
  title,
  brand,
  sku,
  category,
  shortDescription,
  rating,
  reviewCount,
  badges = [],
}: ProductInfoProps) {
  return (
    <div className={styles.container} data-testid="product-info">
      {/* Badges */}
      {badges.length > 0 && (
        <div className={styles.badges}>
          {badges.map((badge) => (
            <span key={badge} className={styles.badge}>{badge}</span>
          ))}
        </div>
      )}

      {/* Product Title — H1 for PDP */}
      <h1 className={styles.title}>{title}</h1>

      {/* Brand / Category meta */}
      <div className={styles.meta}>
        {brand && (
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>Brand: </span>
            <span className={styles.metaValue}>{brand}</span>
          </span>
        )}
        {category && (
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>Category: </span>
            <span className={styles.metaValue}>{category}</span>
          </span>
        )}
        {sku && (
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>SKU: </span>
            <span className={styles.metaValue}>{sku}</span>
          </span>
        )}
      </div>

      {/* Rating */}
      {rating != null && (
        <div className={styles.ratingRow} aria-label={`Rating: ${rating} out of 5`}>
          <div className={styles.stars}>
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar
                key={i}
                className={i < Math.round(rating) ? styles.starFilled : styles.starEmpty}
                aria-hidden="true"
              />
            ))}
          </div>
          <span className={styles.ratingNum}>{rating.toFixed(1)}</span>
          {reviewCount != null && (
            <span className={styles.reviewCount}>
              ({reviewCount.toLocaleString()} reviews)
            </span>
          )}
        </div>
      )}

      {/* Short description */}
      {shortDescription && (
        <p className={styles.description}>{shortDescription}</p>
      )}
    </div>
  );
}
