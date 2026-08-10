'use client';

import React from 'react';
import WishlistItem, { WishlistItemData, WishlistItemProps } from './WishlistItem';
import styles from './WishlistGrid.module.css';

export interface WishlistGridProps {
  items: WishlistItemData[];
  onRemove?: WishlistItemProps['onRemove'];
  onMoveToCart?: WishlistItemProps['onMoveToCart'];
  onViewProduct?: WishlistItemProps['onViewProduct'];
  disabled?: boolean;
}

export default function WishlistGrid({
  items = [],
  onRemove,
  onMoveToCart,
  onViewProduct,
  disabled = false,
}: WishlistGridProps) {
  if (!items || items.length === 0) return null;

  return (
    <div
      className={styles.grid}
      role="region"
      aria-label="Wishlist items grid"
      data-testid="wishlist-grid"
    >
      {items.map((item) => (
        <div key={item.id} className={styles.gridItem}>
          <WishlistItem
            item={item}
            onRemove={onRemove}
            onMoveToCart={onMoveToCart}
            onViewProduct={onViewProduct}
            disabled={disabled}
          />
        </div>
      ))}
    </div>
  );
}
