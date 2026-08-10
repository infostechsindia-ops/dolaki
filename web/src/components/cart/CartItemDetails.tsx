'use client';

import React from 'react';
import styles from './CartItemDetails.module.css';

export interface CartItemDetailsProps {
  title: string;
  brand?: string;
  seller?: string;
  sku?: string;
  variantText?: string;
  href?: string;
}

export default function CartItemDetails({
  title,
  brand,
  seller,
  sku,
  variantText,
  href,
}: CartItemDetailsProps) {
  return (
    <div className={styles.details} data-testid="cart-item-details">
      {href ? (
        <a href={href} className={styles.titleLink}>
          <h2 className={styles.title}>{title}</h2>
        </a>
      ) : (
        <h2 className={styles.title}>{title}</h2>
      )}

      <div className={styles.metaRow}>
        {brand && (
          <span className={styles.metaItem}>
            <span className={styles.label}>Brand: </span>
            <span className={styles.val}>{brand}</span>
          </span>
        )}
        {seller && (
          <span className={styles.metaItem}>
            <span className={styles.label}>Seller: </span>
            <span className={styles.val}>{seller}</span>
          </span>
        )}
        {sku && (
          <span className={styles.metaItem}>
            <span className={styles.label}>SKU: </span>
            <span className={styles.val}>{sku}</span>
          </span>
        )}
      </div>

      {variantText && (
        <span className={styles.variantText}>{variantText}</span>
      )}
    </div>
  );
}
