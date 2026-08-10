'use client';

import React from 'react';
import ProductCard, { ProductCardData } from '@/components/ProductCard';
import styles from './SavedForLaterSection.module.css';

export interface SavedForLaterSectionProps {
  products: ProductCardData[];
  title?: string;
  onMoveToCart?: (id: string) => void;
  onRemoveFromSaved?: (id: string) => void;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function SavedForLaterSection({
  products,
  title = 'Saved for Later',
  onMoveToCart,
  onRemoveFromSaved,
  surface = 'MARKETPLACE',
}: SavedForLaterSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className={styles.section} data-testid="saved-for-later-section">
      <div className={styles.header}>
        <h2 className={styles.heading}>{title}</h2>
        <span className={styles.count}>({products.length})</span>
      </div>

      <div className={styles.grid}>
        {products.map((product) => (
          <div key={product.id} className={styles.cardItem}>
            <ProductCard product={{ ...product, surface }} />
            <div className={styles.cardActions}>
              {onMoveToCart && (
                <button
                  type="button"
                  className={styles.moveToCartBtn}
                  onClick={() => onMoveToCart(product.id)}
                  aria-label={`Move ${product.title} back to cart`}
                  data-testid={`move-to-cart-btn-${product.id}`}
                >
                  Move to Cart
                </button>
              )}
              {onRemoveFromSaved && (
                <button
                  type="button"
                  className={styles.removeSavedBtn}
                  onClick={() => onRemoveFromSaved(product.id)}
                  aria-label={`Remove ${product.title} from saved items`}
                  data-testid={`remove-saved-btn-${product.id}`}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
