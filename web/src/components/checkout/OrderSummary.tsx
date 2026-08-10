'use client';

import React from 'react';
import styles from './OrderSummary.module.css';

export interface OrderSummaryItem {
  id: string;
  title: string;
  quantity: number;
  priceText: string;
  image: string;
  variantText?: string;
}

export interface OrderSummaryProps {
  items: OrderSummaryItem[];
  title?: string;
}

export default function OrderSummary({
  items,
  title = 'Order Review',
}: OrderSummaryProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className={styles.container} data-testid="order-summary">
      <h3 className={styles.heading}>{title} ({items.length})</h3>

      <ul className={styles.itemList} aria-label="Order summary items">
        {items.map((item) => (
          <li key={item.id} className={styles.item} data-testid={`order-summary-item-${item.id}`}>
            <div className={styles.imageWrap}>
              <img src={item.image} alt={item.title} className={styles.thumbnail} />
            </div>

            <div className={styles.details}>
              <span className={styles.title}>{item.title}</span>
              {item.variantText && (
                <span className={styles.variant}>{item.variantText}</span>
              )}
              <span className={styles.qty}>Qty: {item.quantity}</span>
            </div>

            <span className={styles.price}>{item.priceText}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
