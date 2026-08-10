'use client';

import React from 'react';
import { FiShoppingCart, FiTrash2, FiEye } from 'react-icons/fi';
import styles from './WishlistActions.module.css';

export interface WishlistActionsProps {
  productId: string;
  onRemove?: (productId: string) => void;
  onMoveToCart?: (productId: string) => void;
  onViewProduct?: (productId: string) => void;
  inStock?: boolean;
  disabled?: boolean;
}

export default function WishlistActions({
  productId,
  onRemove,
  onMoveToCart,
  onViewProduct,
  inStock = true,
  disabled = false,
}: WishlistActionsProps) {
  return (
    <div className={styles.actions} data-testid="wishlist-actions">
      {onMoveToCart && (
        <button
          type="button"
          className={styles.cartBtn}
          onClick={() => onMoveToCart(productId)}
          disabled={disabled || !inStock}
          aria-label={`Move item ${productId} to shopping cart`}
          data-testid={`move-to-cart-btn-${productId}`}
        >
          <FiShoppingCart aria-hidden="true" />
          <span>{inStock ? 'Move to Cart' : 'Out of Stock'}</span>
        </button>
      )}

      <div className={styles.iconButtons}>
        {onViewProduct && (
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => onViewProduct(productId)}
            disabled={disabled}
            aria-label={`View product details for ${productId}`}
            data-testid={`view-product-btn-${productId}`}
          >
            <FiEye aria-hidden="true" />
          </button>
        )}

        {onRemove && (
          <button
            type="button"
            className={`${styles.iconBtn} ${styles.removeBtn}`}
            onClick={() => onRemove(productId)}
            disabled={disabled}
            aria-label={`Remove item ${productId} from wishlist`}
            data-testid={`remove-wishlist-btn-${productId}`}
          >
            <FiTrash2 aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
