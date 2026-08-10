'use client';

import React from 'react';
import WishlistHeader, { WishlistHeaderProps } from './WishlistHeader';
import WishlistToolbar, { WishlistToolbarProps } from './WishlistToolbar';
import WishlistGrid, { WishlistGridProps } from './WishlistGrid';
import WishlistEmptyState, { WishlistEmptyStateProps } from './WishlistEmptyState';
import { WishlistItemData } from './WishlistItem';
import styles from './WishlistPage.module.css';

export interface WishlistPageProps {
  header: WishlistHeaderProps;
  toolbar?: WishlistToolbarProps;
  items: WishlistItemData[];
  onRemove?: WishlistGridProps['onRemove'];
  onMoveToCart?: WishlistGridProps['onMoveToCart'];
  onViewProduct?: WishlistGridProps['onViewProduct'];
  isEmpty?: boolean;
  emptyState?: WishlistEmptyStateProps;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function WishlistPage({
  header,
  toolbar,
  items = [],
  onRemove,
  onMoveToCart,
  onViewProduct,
  isEmpty = false,
  emptyState,
  surface = 'MARKETPLACE',
}: WishlistPageProps) {
  const isFlado = surface === 'QUICK_COMMERCE';
  const showEmpty = isEmpty || items.length === 0;

  return (
    <div
      className={`${styles.page} ${isFlado ? styles.flado : ''}`}
      data-testid="wishlist-page"
    >
      {/* Header with single H1 */}
      <WishlistHeader {...header} itemCount={items.length} />

      {/* Toolbar & Grid or Empty State */}
      {showEmpty ? (
        <div className={styles.emptyContainer}>
          <WishlistEmptyState {...emptyState} />
        </div>
      ) : (
        <main className={styles.content}>
          {toolbar && <WishlistToolbar {...toolbar} itemCount={items.length} />}

          <WishlistGrid
            items={items}
            onRemove={onRemove}
            onMoveToCart={onMoveToCart}
            onViewProduct={onViewProduct}
          />
        </main>
      )}
    </div>
  );
}
