'use client';

import React from 'react';
import { FiHeart } from 'react-icons/fi';
import EmptyState from '@/components/ui/EmptyState';
import styles from './WishlistEmptyState.module.css';

export interface WishlistEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onContinueShopping?: () => void;
}

export default function WishlistEmptyState({
  title = 'Your wishlist is empty',
  description = 'Explore our catalog and save your favorite items for later!',
  actionLabel = 'Continue Shopping',
  onContinueShopping,
}: WishlistEmptyStateProps) {
  return (
    <div className={styles.container} data-testid="wishlist-empty-state">
      <EmptyState
        icon={<FiHeart className={styles.icon} />}
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
