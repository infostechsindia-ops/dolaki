'use client';

import React from 'react';
import styles from './PlaceOrderPanel.module.css';

export interface PlaceOrderPanelProps {
  termsAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
  onPlaceOrder: () => void;
  buttonLabel?: string;
  termsText?: string;
  disabled?: boolean;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
  isProcessingPayment?: boolean;
  paymentError?: string;
}

export default function PlaceOrderPanel({
  termsAccepted,
  onTermsChange,
  onPlaceOrder,
  buttonLabel = 'Place Order',
  termsText = 'I agree to the Terms of Service and Privacy Policy',
  disabled = false,
  surface = 'MARKETPLACE',
  isProcessingPayment = false,
  paymentError,
}: PlaceOrderPanelProps) {
  const isFlado = surface === 'QUICK_COMMERCE';
  const isBtnDisabled = disabled || !termsAccepted || isProcessingPayment;

  return (
    <div className={styles.panel} data-testid="place-order-panel">
      {paymentError && (
        <div className={styles.paymentErrorAlert} role="alert" data-testid="payment-error-alert">
          <span>⚠️ {paymentError}</span>
        </div>
      )}

      <label htmlFor="checkout-terms-checkbox" className={styles.termsLabel}>
        <input
          id="checkout-terms-checkbox"
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => onTermsChange(e.target.checked)}
          disabled={disabled || isProcessingPayment}
          className={styles.checkbox}
          data-testid="terms-checkbox"
        />
        <span className={styles.termsText}>{termsText}</span>
      </label>

      <button
        type="button"
        className={`${styles.placeOrderBtn} ${isFlado ? styles.fladoBtn : ''} ${
          isProcessingPayment ? styles.processing : ''
        }`}
        onClick={onPlaceOrder}
        disabled={isBtnDisabled}
        aria-label={isProcessingPayment ? 'Processing payment...' : buttonLabel}
        data-testid="place-order-btn"
      >
        {isProcessingPayment ? 'Processing Payment...' : buttonLabel}
      </button>
    </div>
  );
}
