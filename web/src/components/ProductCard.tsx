'use client';

import React from 'react';
import Link from 'next/link';
import { FiStar, FiShoppingCart, FiPlus, FiMinus, FiZap, FiHeart } from 'react-icons/fi';
import styles from './ProductCard.module.css';

/**
 * Authoritative pricing output from CMD-014 Price Engine.
 * All price math is done server-side — this component only renders.
 *
 * Backward-compatible with the legacy `Product` shape that pre-CMD-015
 * pages produce. New pages should pass the named fields explicitly.
 */
export interface ProductCardData {
  id: string;
  sellerListingId?: string;

  // New canonical fields
  title?: string;
  category?: string;
  image?: string;
  rating?: number;
  reviewsCount?: number;

  // Legacy aliases (accepted from old Product type)
  name?: string;            // alias for title
  price?: number | string;  // alias for formattedPrice (raw value)

  // CMD-014 authoritative price output — rendered as-is, no client math
  formattedPrice?: string;
  formattedCompareAtPrice?: string | null;
  compareAtPrice?: number | null; // legacy raw value
  discountPercent?: number;
  discount?: number | null; // legacy

  // Upstream surface & stock metadata — no delivery promises invented here
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
  isFlado?: boolean;
  deliveryBadgeText?: string | null;
  inStock?: boolean;
  stock?: number | null; // legacy stock count
  quantityInCart?: number;
}

export interface ProductCardProps {
  product: ProductCardData;

  // Pure presentational callbacks — no cart/reservation/checkout logic inside
  onAdd?: () => void;
  onWishlist?: () => void;
  onQuantityChange?: (newQuantity: number) => void;
  isWishlisted?: boolean;
}

export default function ProductCard({
  product,
  onAdd,
  onWishlist,
  onQuantityChange,
  isWishlisted = false,
}: ProductCardProps) {
  // Resolve canonical + legacy fields for backward compatibility
  const displayTitle = product.title ?? (product.name as string | undefined) ?? 'Product';
  const displayPrice = product.formattedPrice
    ?? (product.price != null ? `₹${product.price}` : undefined);
  const displayCompareAtPrice = product.formattedCompareAtPrice
    ?? (product.compareAtPrice != null ? `₹${product.compareAtPrice}` : null);
  const displayDiscount = product.discountPercent ?? (product.discount as number | undefined);
  const isInStock = product.inStock ?? (product.stock != null ? product.stock > 0 : true);
  const isQuickCommerce = product.surface === 'QUICK_COMMERCE' || product.isFlado;
  const quantityInCart = product.quantityInCart ?? 0;

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantityInCart > 0) onQuantityChange?.(quantityInCart - 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantityInCart === 0) {
      onAdd?.();
    } else {
      onQuantityChange?.(quantityInCart + 1);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onWishlist?.();
  };

  return (
    <article
      className={`${styles.card} ${isQuickCommerce ? styles.fladoCard : ''}`}
      aria-label={displayTitle}
    >
      {/* Wishlist */}
      <button
        type="button"
        onClick={handleWishlist}
        className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlisted : ''}`}
        aria-label={isWishlisted ? `Remove ${displayTitle} from wishlist` : `Add ${displayTitle} to wishlist`}
        aria-pressed={isWishlisted}
      >
        <FiHeart className={styles.heartIcon} aria-hidden="true" />
      </button>

      <Link href={`/products/${product.id}`} className={styles.link}>
        <div className={styles.imageWrapper}>
          {/* Delivery badge — only renders upstream metadata, never fabricates */}
          {product.deliveryBadgeText && (
            <span className={`${styles.badge} ${isQuickCommerce ? styles.fladoBadge : ''}`}>
              {isQuickCommerce && <FiZap className={styles.badgeIcon} aria-hidden="true" />}
              {product.deliveryBadgeText}
            </span>
          )}

          {/* Out-of-stock overlay */}
          {!isInStock && (
            <div className={styles.outOfStockOverlay}>
              <span className={styles.outOfStockLabel}>Out of Stock</span>
            </div>
          )}

          <img
            src={product.image || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600'}
            alt={displayTitle}
            className={styles.image}
            loading="lazy"
          />
        </div>

        <div className={styles.info}>
          {product.category && (
            <span className={styles.category}>{product.category}</span>
          )}
          <h3 className={styles.name}>{displayTitle}</h3>

          {/* Rating */}
          {product.rating != null && (
            <div className={styles.ratingRow}>
              <FiStar className={styles.starIcon} aria-hidden="true" />
              <span className={styles.ratingVal}>{(product.rating as number).toFixed(1)}</span>
              {product.reviewsCount != null && (
                <span className={styles.reviews}>({product.reviewsCount as number})</span>
              )}
            </div>
          )}

          {/* Price — renders CMD-014 output directly, no client math */}
          <div className={styles.priceRow}>
            {displayPrice && <span className={styles.price}>{displayPrice}</span>}
            {displayCompareAtPrice && (
              <span className={styles.comparePrice}>{displayCompareAtPrice}</span>
            )}
            {displayDiscount != null && displayDiscount > 0 && (
              <span className={styles.discountBadge}>{displayDiscount}% OFF</span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to cart controls */}
      <div className={styles.actionWrapper}>
        {quantityInCart > 0 ? (
          <div className={styles.quantityControls}>
            <button
              type="button"
              onClick={handleDecrement}
              className={`${styles.qtyBtn} ${isQuickCommerce ? styles.fladoQtyBtn : ''}`}
              aria-label="Decrease quantity"
            >
              <FiMinus aria-hidden="true" />
            </button>
            <span className={styles.qtyText} aria-live="polite" aria-atomic="true">
              {quantityInCart}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              className={`${styles.qtyBtn} ${isQuickCommerce ? styles.fladoQtyBtn : ''}`}
              aria-label="Increase quantity"
              disabled={!isInStock}
            >
              <FiPlus aria-hidden="true" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleIncrement}
            className={`${styles.addToCartBtn} ${isQuickCommerce ? styles.fladoAddBtn : ''}`}
            disabled={!isInStock}
            aria-label={isInStock ? `Add ${displayTitle} to cart` : 'Out of stock'}
          >
            <FiShoppingCart className={styles.cartIcon} aria-hidden="true" />
            <span>{isInStock ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        )}
      </div>
    </article>
  );
}
