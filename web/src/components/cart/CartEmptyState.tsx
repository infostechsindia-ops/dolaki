'use client';

import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import EmptyState from '@/components/ui/EmptyState';
import styles from './CartEmptyState.module.css';

export interface CartEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onContinueShopping?: () => void;
}

export default function CartEmptyState({
  title = 'Your cart is empty',
  description = 'Looks like you have not added anything to your cart yet.',
  actionLabel = 'Continue Shopping',
  onContinueShopping,
}: CartEmptyStateProps) {
  return (
    <div className={styles.container} data-testid="cart-empty-state">
      <EmptyState
        icon={<FiShoppingCart className={styles.icon} />}
        title={title}
        description={description}
        action={
          onContinueShopping
            ? {
                label: actionLabel,
                onClick: onContinueShopping,
              }
            : undefined
        }
      />
    </div>
  );
}
