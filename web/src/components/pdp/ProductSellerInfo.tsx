'use client';

import React from 'react';
import { FiStar, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import styles from './ProductSellerInfo.module.css';

export interface ProductSellerInfoProps {
  sellerName: string;
  sellerRating?: number;
  sellerBadge?: string;
  sellerLocation?: string;
  onViewStore?: () => void;
}

export default function ProductSellerInfo({
  sellerName,
  sellerRating,
  sellerBadge,
  sellerLocation,
  onViewStore,
}: ProductSellerInfoProps) {
  if (!sellerName) return null;

  return (
    <div className={styles.container} data-testid="product-seller-info">
      <div className={styles.header}>
        <div className={styles.nameGroup}>
          <h3 className={styles.name}>{sellerName}</h3>
          {sellerBadge && (
            <span className={styles.badge}>
              <FiCheckCircle className={styles.badgeIcon} aria-hidden="true" />
              {sellerBadge}
            </span>
          )}
        </div>

        {onViewStore && (
          <button
            type="button"
            className={styles.viewStoreBtn}
            onClick={onViewStore}
            aria-label={`Visit ${sellerName} store`}
          >
            Visit Store
          </button>
        )}
      </div>

      <div className={styles.metaRow}>
        {sellerRating != null && (
          <span className={styles.metaItem}>
            <FiStar className={styles.starIcon} aria-hidden="true" />
            <span className={styles.metaText}>{sellerRating.toFixed(1)} Seller Rating</span>
          </span>
        )}

        {sellerLocation && (
          <span className={styles.metaItem}>
            <FiMapPin className={styles.locationIcon} aria-hidden="true" />
            <span className={styles.metaText}>{sellerLocation}</span>
          </span>
        )}
      </div>
    </div>
  );
}
