'use client';

import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import EmptyState from '@/components/ui/EmptyState';
import styles from './CheckoutEmptyState.module.css';

export interface CheckoutEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onReturnToCart?: () => void;
}

export default function CheckoutEmptyState({
  title = 'No items to checkout',
  description = 'Your cart is currently empty. Add items to your cart before proceeding to checkout.',
  actionLabel = 'Return to Cart',
  onReturnToCart,
}: CheckoutEmptyStateProps) {
  return (
    <div className={styles.container} data-testid="checkout-empty-state">
      <EmptyState
        icon={<FiCheckCircle className={styles.icon} />}
        title={title}
        description={description}
        action={
          onReturnToCart
            ? {
                label: actionLabel,
                onClick: onReturnToCart,
              }
            : undefined
        }
      />
    </div>
  );
}
