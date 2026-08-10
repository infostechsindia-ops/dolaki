'use client';

import React from 'react';
import CartPriceSummary, { CartPriceSummaryProps } from './CartPriceSummary';
import CartCouponBox, { CartCouponBoxProps } from './CartCouponBox';
import CartDeliveryInfo, { CartDeliveryInfoProps } from './CartDeliveryInfo';
import styles from './CartSummary.module.css';

export interface CartSummaryProps {
  itemCount: number;
  priceSummary: CartPriceSummaryProps;
  savingsText?: string;
  taxLabel?: string;
  couponBox?: CartCouponBoxProps;
  deliveryInfo?: CartDeliveryInfoProps;
  onCheckout?: () => void;
  checkoutLabel?: string;
  disabled?: boolean;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function CartSummary({
  itemCount,
  priceSummary,
  savingsText,
  taxLabel = 'Taxes and shipping calculated at checkout',
  couponBox,
  deliveryInfo,
  onCheckout,
  checkoutLabel = 'Proceed to Checkout',
  disabled = false,
  surface = 'MARKETPLACE',
}: CartSummaryProps) {
  const isFlado = surface === 'QUICK_COMMERCE';

  return (
    <aside className={styles.sidebar} aria-label="Cart Summary" data-testid="cart-summary">
      {/* Price Summary Breakdown */}
      <CartPriceSummary {...priceSummary} />

      {/* Savings Banner */}
      {savingsText && (
        <div className={styles.savingsBanner} data-testid="cart-savings-banner">
          <span>🎉 {savingsText}</span>
        </div>
      )}

      {/* Tax note */}
      {taxLabel && <p className={styles.taxNote}>{taxLabel}</p>}

      {/* Coupon Box */}
      {couponBox && <CartCouponBox {...couponBox} />}

      {/* Delivery Info */}
      {deliveryInfo && <CartDeliveryInfo {...deliveryInfo} />}

      {/* Checkout Button */}
      {onCheckout && (
        <button
          type="button"
          className={`${styles.checkoutBtn} ${isFlado ? styles.fladoBtn : ''}`}
          onClick={onCheckout}
          disabled={disabled || itemCount === 0}
          aria-label={checkoutLabel}
          data-testid="proceed-checkout-btn"
        >
          {checkoutLabel}
        </button>
      )}
    </aside>
  );
}
