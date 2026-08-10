'use client';

import React from 'react';
import styles from './ProductPrice.module.css';

export interface ProductPriceProps {
  formattedPrice: string;
  formattedCompareAtPrice?: string;
  discountPercent?: number;
  currency?: string;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function ProductPrice({
  formattedPrice,
  formattedCompareAtPrice,
  discountPercent,
  currency,
  surface = 'MARKETPLACE',
}: ProductPriceProps) {
  const isFlado = surface === 'QUICK_COMMERCE';

  return (
    <div className={styles.container} data-testid="product-price">
      <div className={styles.priceRow}>
        <span className={`${styles.price} ${isFlado ? styles.fladoPrice : ''}`}>
          {formattedPrice}
        </span>

        {formattedCompareAtPrice && (
          <span className={styles.comparePrice}>{formattedCompareAtPrice}</span>
        )}

        {discountPercent != null && discountPercent > 0 && (
          <span className={styles.discount}>{discountPercent}% OFF</span>
        )}
      </div>

      {currency && (
        <span className={styles.currency}>{currency}</span>
      )}
    </div>
  );
}
