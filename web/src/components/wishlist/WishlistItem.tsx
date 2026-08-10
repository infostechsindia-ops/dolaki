'use client';

import React from 'react';
import WishlistActions, { WishlistActionsProps } from './WishlistActions';
import styles from './WishlistItem.module.css';

export interface WishlistItemData {
  id: string;
  title: string;
  category?: string;
  brand?: string;
  image: string;
  formattedPrice: string;
  formattedCompareAtPrice?: string | null;
  discountPercent?: number | null;
  inStock?: boolean;
  stockBadgeText?: string | null;
  deliveryBadgeText?: string | null;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export interface WishlistItemProps {
  item: WishlistItemData;
  onRemove?: (id: string) => void;
  onMoveToCart?: (id: string) => void;
  onViewProduct?: (id: string) => void;
  disabled?: boolean;
}

export default function WishlistItem({
  item,
  onRemove,
  onMoveToCart,
  onViewProduct,
  disabled = false,
}: WishlistItemProps) {
  const {
    id,
    title,
    category,
    brand,
    image,
    formattedPrice,
    formattedCompareAtPrice,
    discountPercent,
    inStock = true,
    stockBadgeText,
    deliveryBadgeText,
    surface = 'MARKETPLACE',
  } = item;

  const isFlado = surface === 'QUICK_COMMERCE';
  const brandOrCategory = brand || category;

  return (
    <article
      className={`${styles.card} ${isFlado ? styles.flado : ''}`}
      data-testid={`wishlist-item-${id}`}
    >
      {/* Media & Badges */}
      <div className={styles.imageWrap}>
        <img src={image} alt={title} className={styles.image} />

        {discountPercent != null && discountPercent > 0 && (
          <span className={styles.discountBadge} data-testid="wishlist-item-discount">
            -{discountPercent}%
          </span>
        )}

        {deliveryBadgeText && (
          <span className={styles.deliveryBadge} data-testid="wishlist-item-delivery">
            {deliveryBadgeText}
          </span>
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {brandOrCategory && (
          <span className={styles.brand} data-testid="wishlist-item-brand">
            {brandOrCategory}
          </span>
        )}

        <h3 className={styles.title} data-testid="wishlist-item-title">
          {title}
        </h3>

        {/* Pricing Block */}
        <div className={styles.priceBlock}>
          <span className={styles.price} data-testid="wishlist-item-price">
            {formattedPrice}
          </span>

          {formattedCompareAtPrice && (
            <span
              className={styles.comparePrice}
              data-testid="wishlist-item-compare-price"
            >
              {formattedCompareAtPrice}
            </span>
          )}
        </div>

        {/* Stock Status Badge */}
        <div className={styles.stockBlock}>
          <span
            className={`${styles.stockBadge} ${inStock ? styles.inStock : styles.outOfStock}`}
            data-testid="wishlist-item-stock"
          >
            {stockBadgeText ?? (inStock ? 'In Stock' : 'Out of Stock')}
          </span>
        </div>

        {/* Action Buttons */}
        <WishlistActions
          productId={id}
          onRemove={onRemove}
          onMoveToCart={onMoveToCart}
          onViewProduct={onViewProduct}
          inStock={inStock}
          disabled={disabled}
        />
      </div>
    </article>
  );
}
