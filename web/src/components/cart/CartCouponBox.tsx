'use client';

import React from 'react';
import styles from './CartCouponBox.module.css';

export interface CartCouponBoxProps {
  couponCode?: string;
  onCouponCodeChange?: (val: string) => void;
  onApplyCoupon?: () => void;
  appliedCoupon?: string;
  onRemoveCoupon?: () => void;
  message?: {
    type: 'success' | 'error' | 'info';
    text: string;
  };
  disabled?: boolean;
}

export default function CartCouponBox({
  couponCode = '',
  onCouponCodeChange,
  onApplyCoupon,
  appliedCoupon,
  onRemoveCoupon,
  message,
  disabled = false,
}: CartCouponBoxProps) {
  return (
    <div className={styles.container} data-testid="cart-coupon-box">
      <label htmlFor="cart-coupon-input" className={styles.label}>
        Promo / Coupon Code
      </label>

      {appliedCoupon ? (
        <div className={styles.appliedRow} data-testid="applied-coupon-tag">
          <span className={styles.appliedCode}>Applied: {appliedCoupon}</span>
          {onRemoveCoupon && (
            <button
              type="button"
              className={styles.removeBtn}
              onClick={onRemoveCoupon}
              aria-label={`Remove coupon ${appliedCoupon}`}
              data-testid="remove-coupon-btn"
            >
              Remove
            </button>
          )}
        </div>
      ) : (
        <div className={styles.inputGroup}>
          <input
            id="cart-coupon-input"
            type="text"
            className={styles.input}
            placeholder="Enter promo code"
            value={couponCode}
            onChange={(e) => onCouponCodeChange?.(e.target.value)}
            disabled={disabled}
            data-testid="coupon-input"
          />
          <button
            type="button"
            className={styles.applyBtn}
            onClick={onApplyCoupon}
            disabled={disabled || !couponCode.trim()}
            aria-label="Apply promo code"
            data-testid="apply-coupon-btn"
          >
            Apply
          </button>
        </div>
      )}

      {message && (
        <p
          className={`${styles.message} ${styles[message.type]}`}
          role="status"
          data-testid="coupon-message"
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
