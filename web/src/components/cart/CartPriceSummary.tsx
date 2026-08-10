'use client';

import React from 'react';
import styles from './CartPriceSummary.module.css';

export interface CartPriceSummaryProps {
  subtotal: string;
  discount?: string;
  tax?: string;
  shipping?: string;
  grandTotal: string;
  title?: string;
}

export default function CartPriceSummary({
  subtotal,
  discount,
  tax,
  shipping,
  grandTotal,
  title = 'Order Summary',
}: CartPriceSummaryProps) {
  return (
    <section className={styles.section} aria-label={title} data-testid="cart-price-summary">
      <h2 className={styles.heading}>{title}</h2>

      <dl className={styles.dlList}>
        <div className={styles.row}>
          <dt className={styles.dt}>Subtotal</dt>
          <dd className={styles.dd} data-testid="summary-subtotal">{subtotal}</dd>
        </div>

        {discount && (
          <div className={styles.row}>
            <dt className={styles.dt}>Discount</dt>
            <dd className={`${styles.dd} ${styles.discount}`} data-testid="summary-discount">
              -{discount}
            </dd>
          </div>
        )}

        {shipping && (
          <div className={styles.row}>
            <dt className={styles.dt}>Estimated Shipping</dt>
            <dd className={styles.dd} data-testid="summary-shipping">{shipping}</dd>
          </div>
        )}

        {tax && (
          <div className={styles.row}>
            <dt className={styles.dt}>Tax</dt>
            <dd className={styles.dd} data-testid="summary-tax">{tax}</dd>
          </div>
        )}

        <div className={`${styles.row} ${styles.totalRow}`}>
          <dt className={styles.totalDt}>Grand Total</dt>
          <dd className={styles.totalDd} data-testid="summary-grand-total">{grandTotal}</dd>
        </div>
      </dl>
    </section>
  );
}
