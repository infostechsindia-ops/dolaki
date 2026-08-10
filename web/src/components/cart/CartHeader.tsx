'use client';

import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import styles from './CartHeader.module.css';

export interface CartHeaderProps {
  title?: string;
  itemCount: number;
  onContinueShopping?: () => void;
  continueShoppingLabel?: string;
}

export default function CartHeader({
  title = 'Shopping Cart',
  itemCount,
  onContinueShopping,
  continueShoppingLabel = 'Continue Shopping',
}: CartHeaderProps) {
  return (
    <header className={styles.header} data-testid="cart-header">
      <div className={styles.titleGroup}>
        <h1 className={styles.title}>{title}</h1>
        <span className={styles.countBadge} data-testid="cart-item-count">
          ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </span>
      </div>

      {onContinueShopping && (
        <button
          type="button"
          className={styles.continueBtn}
          onClick={onContinueShopping}
          aria-label={continueShoppingLabel}
          data-testid="continue-shopping-btn"
        >
          <FiArrowLeft aria-hidden="true" />
          <span>{continueShoppingLabel}</span>
        </button>
      )}
    </header>
  );
}
