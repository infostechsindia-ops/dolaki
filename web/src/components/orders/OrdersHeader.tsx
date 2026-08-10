'use client';

import React from 'react';
import styles from './OrdersHeader.module.css';

export interface OrdersHeaderProps {
  title?: string;
  orderCount: number;
}

export default function OrdersHeader({
  title = 'My Orders',
  orderCount,
}: OrdersHeaderProps) {
  return (
    <header className={styles.header} data-testid="orders-header">
      <div className={styles.titleGroup}>
        <h1 className={styles.title}>{title}</h1>
        <span className={styles.countBadge} data-testid="orders-count-badge">
          ({orderCount} {orderCount === 1 ? 'order' : 'orders'})
        </span>
      </div>
    </header>
  );
}
