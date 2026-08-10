'use client';

import React from 'react';
import styles from './OrderSummary.module.css';

export interface OrderSummaryProps {
  subtotal: string;
  discount?: string;
  shipping?: string;
  tax?: string;
  grandTotal: string;
  title?: string;
}

export default function OrderSummary({
  subtotal,
  discount,
  shipping,
  tax,
  grandTotal,
  title = 'Order Amount Summary',
}: OrderSummaryProps) {
  return (
    <section className={styles.section} aria-label={title} data-testid="order-summary">
      <h3 className={styles.heading}>{title}</h3>

      <dl className={styles.dlList}>
        <div className={styles.row}>
          <dt className={styles.dt}>Items Subtotal</dt>
          <dd className={styles.dd} data-testid="order-summary-subtotal">{subtotal}</dd>
        </div>

        {discount && (
          <div className={styles.row}>
            <dt className={styles.dt}>Discount</dt>
            <dd className={`${styles.dd} ${styles.discount}`} data-testid="order-summary-discount">
              -{discount}
            </dd>
          </div>
        )}

        {shipping && (
          <div className={styles.row}>
            <dt className={styles.dt}>Shipping Fee</dt>
            <dd className={styles.dd} data-testid="order-summary-shipping">{shipping}</dd>
          </div>
        )}

        {tax && (
          <div className={styles.row}>
            <dt className={styles.dt}>Estimated Tax</dt>
            <dd className={styles.dd} data-testid="order-summary-tax">{tax}</dd>
          </div>
        )}

        <div className={`${styles.row} ${styles.totalRow}`}>
          <dt className={styles.totalDt}>Grand Total</dt>
          <dd className={styles.totalDd} data-testid="order-summary-grand-total">{grandTotal}</dd>
        </div>
      </dl>
    </section>
  );
}
