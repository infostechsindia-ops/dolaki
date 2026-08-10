'use client';

import React from 'react';
import styles from './OrderItemsList.module.css';

export interface OrderItemData {
  id: string;
  title: string;
  quantity: number;
  priceText: string;
  image: string;
  variantText?: string;
  sku?: string;
}

export interface OrderItemsListProps {
  items: OrderItemData[];
  title?: string;
}

export default function OrderItemsList({
  items = [],
  title,
}: OrderItemsListProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className={styles.container} data-testid="order-items-list">
      {title && <h3 className={styles.heading}>{title} ({items.length})</h3>}

      <ul className={styles.list} aria-label="Order items">
        {items.map((item) => (
          <li key={item.id} className={styles.item} data-testid={`order-item-${item.id}`}>
            <div className={styles.imageWrap}>
              <img src={item.image} alt={item.title} className={styles.thumbnail} />
            </div>

            <div className={styles.details}>
              <span className={styles.title}>{item.title}</span>
              {item.variantText && (
                <span className={styles.meta}>{item.variantText}</span>
              )}
              {item.sku && (
                <span className={styles.meta}>SKU: {item.sku}</span>
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
