'use client';

import React from 'react';
import { FiShoppingBag } from 'react-icons/fi';
import EmptyState from '@/components/ui/EmptyState';
import styles from './OrderEmptyState.module.css';

export interface OrderEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onStartShopping?: () => void;
}

export default function OrderEmptyState({
  title = 'No orders found',
  description = 'You have not placed any orders yet, or no orders match your search filters.',
  actionLabel = 'Start Shopping',
  onStartShopping,
}: OrderEmptyStateProps) {
  return (
    <div className={styles.container} data-testid="order-empty-state">
      <EmptyState
        icon={<FiShoppingBag className={styles.icon} />}
        title={title}
        description={description}
        action={
          onStartShopping
            ? {
                label: actionLabel,
                onClick: onStartShopping,
              }
            : undefined
        }
      />
    </div>
  );
}
