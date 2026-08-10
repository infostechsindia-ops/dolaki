'use client';

import React from 'react';
import { FiTrash2, FiBookmark, FiHeart } from 'react-icons/fi';
import CartItemImage from './CartItemImage';
import CartItemDetails from './CartItemDetails';
import CartQuantitySelector from './CartQuantitySelector';
import styles from './CartItem.module.css';

export type SubstitutionPreferenceType = 'ALLOW_SUBSTITUTION' | 'CONTACT_ME' | 'NO_SUBSTITUTION';

export interface CartItemData {
  id: string;
  title: string;
  image: string;
  price: string;
  compareAtPrice?: string;
  brand?: string;
  seller?: string;
  sku?: string;
  quantity: number;
  maxQuantity?: number;
  href?: string;
  isWishlisted?: boolean;
  inStock?: boolean;
  stockStatus?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  stockMessage?: string;
  isPending?: boolean;
  fulfillmentLabel?: string;
  substitutionPreference?: SubstitutionPreferenceType;
  isStoreUnavailable?: boolean;
  availabilityReason?: string;
  isFlado?: boolean;
}

export interface CartItemProps {
  item: CartItemData;
  onQuantityChange?: (id: string, newQty: number) => void;
  onRemove?: (id: string) => void;
  onMoveToSaved?: (id: string) => void;
  onWishlist?: (id: string) => void;
  onSubstitutionChange?: (id: string, preference: SubstitutionPreferenceType) => void;
}

export default function CartItem({
  item,
  onQuantityChange,
  onRemove,
  onMoveToSaved,
  onWishlist,
  onSubstitutionChange,
}: CartItemProps) {
  const {
    id,
    title,
    image,
    price,
    compareAtPrice,
    brand,
    seller,
    sku,
    quantity,
    maxQuantity = 99,
    href,
    isWishlisted = false,
    inStock = true,
    stockStatus = 'IN_STOCK',
    stockMessage,
    isPending = false,
    fulfillmentLabel,
    substitutionPreference = 'ALLOW_SUBSTITUTION',
    isStoreUnavailable = false,
    availabilityReason,
    isFlado = false,
  } = item;

  const isOutOfStock = inStock === false || stockStatus === 'OUT_OF_STOCK';
  const isLowStock = stockStatus === 'LOW_STOCK';
  const isUnavailable = isOutOfStock || isStoreUnavailable;

  return (
    <article
      className={`${styles.item} ${isUnavailable ? styles.outOfStockItem : ''}`}
      data-testid={`cart-item-${id}`}
      aria-busy={isPending}
    >
      {/* Product Image */}
      <CartItemImage src={image} alt={title} href={href} />

      {/* Main Content Area */}
      <div className={styles.content}>
        {/* Top: Details & Price */}
        <div className={styles.topRow}>
          <CartItemDetails
            title={title}
            brand={brand}
            seller={seller || fulfillmentLabel}
            sku={sku}
            href={href}
          />

          <div className={styles.priceGroup}>
            <span className={styles.price} data-testid="cart-item-price">
              {price}
            </span>
            {compareAtPrice && (
              <span className={styles.comparePrice}>{compareAtPrice}</span>
            )}
          </div>
        </div>

        {/* Store Unavailability or Stock Status Badge */}
        {(isStoreUnavailable || isOutOfStock || isLowStock || stockMessage) && (
          <div
            className={`${styles.stockBadge} ${isUnavailable ? styles.stockError : styles.stockWarning}`}
            role="status"
            aria-live="polite"
            data-testid={`stock-badge-${id}`}
          >
            {isStoreUnavailable
              ? availabilityReason || 'Store is currently closed - item unavailable'
              : isOutOfStock
              ? stockMessage || 'Out of Stock - Please remove to proceed to checkout'
              : stockMessage || 'Low Stock - Limited quantity available'}
          </div>
        )}

        {/* Substitution Preference Controls (Quick-Commerce / Flado Items) */}
        {(isFlado || onSubstitutionChange) && (
          <div className={styles.substitutionRow} data-testid={`substitution-row-${id}`}>
            <label htmlFor={`sub-pref-${id}`} className={styles.subLabel}>
              If item unavailable:
            </label>
            <select
              id={`sub-pref-${id}`}
              className={styles.subSelect}
              value={substitutionPreference}
              onChange={(e) =>
                onSubstitutionChange?.(id, e.target.value as SubstitutionPreferenceType)
              }
              disabled={isPending}
              aria-label={`Substitution preference for ${title}`}
              data-testid={`substitution-select-${id}`}
            >
              <option value="ALLOW_SUBSTITUTION">Best Match Substitution</option>
              <option value="CONTACT_ME">Contact Me First</option>
              <option value="NO_SUBSTITUTION">Don't Substitute (Refund)</option>
            </select>
          </div>
        )}

        {/* Bottom: Quantity Selector & Action Buttons */}
        <div className={styles.bottomRow}>
          <CartQuantitySelector
            value={quantity}
            max={maxQuantity}
            onChange={(newQty) => onQuantityChange?.(id, newQty)}
            disabled={isPending || isUnavailable}
            ariaLabel={`Quantity for ${title}`}
          />

          <div className={styles.actionButtons}>
            {onMoveToSaved && (
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => onMoveToSaved(id)}
                disabled={isPending}
                aria-label={`Save ${title} for later`}
                data-testid="move-to-saved-btn"
              >
                <FiBookmark aria-hidden="true" />
                <span>Save for later</span>
              </button>
            )}

            {onWishlist && (
              <button
                type="button"
                className={`${styles.actionBtn} ${isWishlisted ? styles.wishlisted : ''}`}
                onClick={() => onWishlist(id)}
                disabled={isPending}
                aria-label={isWishlisted ? `Remove ${title} from wishlist` : `Add ${title} to wishlist`}
                data-testid="cart-wishlist-btn"
              >
                <FiHeart aria-hidden="true" />
                <span>{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
              </button>
            )}

            {onRemove && (
              <button
                type="button"
                className={`${styles.actionBtn} ${styles.removeBtn}`}
                onClick={() => onRemove(id)}
                disabled={isPending}
                aria-label={`Remove ${title} from cart`}
                data-testid="remove-item-btn"
              >
                <FiTrash2 aria-hidden="true" />
                <span>Remove</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
