'use client';

import React from 'react';
import styles from './BillingSummary.module.css';

export interface BillingSummaryProps {
  subtotal: string;
  discount?: string;
  shipping?: string;
  tax?: string;
  grandTotal: string;
  title?: string;
}

export default function BillingSummary({
  subtotal,
  discount,
  shipping,
  tax,
  grandTotal,
  title = 'Payment Breakdown',
}: BillingSummaryProps) {
  return (
    <section className={styles.section} aria-label={title} data-testid="billing-summary">
      <h3 className={styles.heading}>{title}</h3>

      <dl className={styles.dlList}>
        <div className={styles.row}>
          <dt className={styles.dt}>Items Subtotal</dt>
          <dd className={styles.dd} data-testid="billing-subtotal">{subtotal}</dd>
        </div>

        {discount && (
          <div className={styles.row}>
            <dt className={styles.dt}>Discount</dt>
            <dd className={`${styles.dd} ${styles.discount}`} data-testid="billing-discount">
              -{discount}
            </dd>
          </div>
        )}

        {shipping && (
          <div className={styles.row}>
            <dt className={styles.dt}>Delivery Fee</dt>
            <dd className={styles.dd} data-testid="billing-shipping">{shipping}</dd>
          </div>
        )}

        {tax && (
          <div className={styles.row}>
            <dt className={styles.dt}>Taxes</dt>
            <dd className={styles.dd} data-testid="billing-tax">{tax}</dd>
          </div>
        )}

        <div className={`${styles.row} ${styles.totalRow}`}>
          <dt className={styles.totalDt}>Grand Total</dt>
          <dd className={styles.totalDd} data-testid="billing-grand-total">{grandTotal}</dd>
        </div>
      </dl>
    </section>
  );
}
