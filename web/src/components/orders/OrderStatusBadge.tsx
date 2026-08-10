'use client';

import React from 'react';
import styles from './OrderStatusBadge.module.css';

export type OrderStatusVariant =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'
  | 'Refunded';

export interface OrderStatusBadgeProps {
  status: OrderStatusVariant | string;
  label?: string;
}

export default function OrderStatusBadge({
  status,
  label,
}: OrderStatusBadgeProps) {
  const displayLabel = label ?? status;

  const getStyleClass = (st: string) => {
    switch (st.toLowerCase()) {
      case 'delivered':
      case 'confirmed':
      case 'packed':
        return styles.success;
      case 'shipped':
      case 'out for delivery':
      case 'processing':
        return styles.info;
      case 'pending':
        return styles.warning;
      case 'cancelled':
      case 'returned':
      case 'refunded':
        return styles.error;
      default:
        return styles.neutral;
    }
  };

  return (
    <span
      className={`${styles.badge} ${getStyleClass(status)}`}
      data-testid="order-status-badge"
    >
      <span className={styles.dot} aria-hidden="true" />
      <span>{displayLabel}</span>
    </span>
  );
}
