'use client';

import React from 'react';
import { FiHeart, FiShare2, FiMinus, FiPlus } from 'react-icons/fi';
import styles from './ProductActions.module.css';

export interface ProductActionsProps {
  quantity?: number;
  maxQuantity?: number;
  onQuantityChange?: (qty: number) => void;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  onWishlist?: () => void;
  onShare?: () => void;
  isWishlisted?: boolean;
  addToCartLabel?: string;
  buyNowLabel?: string;
  disabled?: boolean;
  inStock?: boolean;
  stockBadgeText?: string;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function ProductActions({
  quantity = 1,
  maxQuantity = 99,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  onWishlist,
  onShare,
  isWishlisted = false,
  addToCartLabel = 'Add to Cart',
  buyNowLabel = 'Buy Now',
  disabled = false,
  inStock = true,
  stockBadgeText,
  surface = 'MARKETPLACE',
}: ProductActionsProps) {
  const isFlado = surface === 'QUICK_COMMERCE';

  const decrement = () => {
    if (quantity > 1) onQuantityChange?.(quantity - 1);
  };

  const increment = () => {
    if (quantity < maxQuantity) onQuantityChange?.(quantity + 1);
  };

  return (
    <div className={styles.container} data-testid="product-actions">
      {/* Stock Status Badge */}
      {stockBadgeText && (
        <div
          className={`${styles.stockStatus} ${inStock ? styles.inStock : styles.outOfStock}`}
          data-testid="pdp-stock-status"
        >
          <span aria-hidden="true">{inStock ? '●' : '○'}</span>
          <span>{stockBadgeText}</span>
        </div>
      )}
      {/* Quantity Selector */}
      <div className={styles.qtyRow}>
        <span className={styles.qtyLabel}>Quantity:</span>
        <div className={styles.qtyStepper} role="group" aria-label="Quantity selector">
          <button
            type="button"
            className={styles.qtyBtn}
            onClick={decrement}
            disabled={disabled || quantity <= 1}
            aria-label="Decrease quantity"
          >
            <FiMinus aria-hidden="true" />
          </button>
          <span className={styles.qtyValue} aria-live="polite" aria-atomic="true">
            {quantity}
          </span>
          <button
            type="button"
            className={styles.qtyBtn}
            onClick={increment}
            disabled={disabled || quantity >= maxQuantity}
            aria-label="Increase quantity"
          >
            <FiPlus aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className={styles.primaryActions}>
        <button
          type="button"
          className={`${styles.addToCartBtn} ${isFlado ? styles.fladoCart : ''}`}
          onClick={onAddToCart}
          disabled={disabled}
          aria-label={addToCartLabel}
          data-testid="add-to-cart-btn"
        >
          {addToCartLabel}
        </button>

        <button
          type="button"
          className={`${styles.buyNowBtn} ${isFlado ? styles.fladoBuy : ''}`}
          onClick={onBuyNow}
          disabled={disabled}
          aria-label={buyNowLabel}
          data-testid="buy-now-btn"
        >
          {buyNowLabel}
        </button>
      </div>

      {/* Secondary Actions */}
      <div className={styles.secondaryActions}>
        <button
          type="button"
          className={`${styles.iconBtn} ${isWishlisted ? styles.wishlisted : ''}`}
          onClick={onWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={isWishlisted}
          data-testid="wishlist-btn"
        >
          <FiHeart aria-hidden="true" />
          <span>{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
        </button>

        <button
          type="button"
          className={styles.iconBtn}
          onClick={onShare}
          aria-label="Share product"
          data-testid="share-btn"
        >
          <FiShare2 aria-hidden="true" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}
