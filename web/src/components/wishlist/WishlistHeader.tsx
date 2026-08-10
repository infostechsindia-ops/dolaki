'use client';

import React from 'react';
import styles from './WishlistHeader.module.css';

export interface WishlistHeaderProps {
  title?: string;
  itemCount: number;
  subtitle?: string;
}

export default function WishlistHeader({
  title = 'My Wishlist',
  itemCount,
  subtitle = 'Items you have saved to purchase or review later.',
}: WishlistHeaderProps) {
  return (
    <header className={styles.header} data-testid="wishlist-header">
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{title}</h1>
        <span className={styles.countBadge} data-testid="wishlist-count-badge">
          ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </span>
      </div>

      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
}
