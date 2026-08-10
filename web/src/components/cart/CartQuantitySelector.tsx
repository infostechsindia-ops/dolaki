'use client';

import React from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import styles from './CartQuantitySelector.module.css';

export interface CartQuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (newValue: number) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

export default function CartQuantitySelector({
  value,
  min = 1,
  max = 99,
  onChange,
  disabled = false,
  ariaLabel = 'Item quantity',
}: CartQuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div
      className={styles.stepper}
      role="group"
      aria-label={ariaLabel}
      data-testid="cart-quantity-selector"
    >
      <button
        type="button"
        className={styles.stepBtn}
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
        data-testid="decrease-qty-btn"
      >
        <FiMinus aria-hidden="true" />
      </button>

      <span
        className={styles.value}
        aria-live="polite"
        aria-atomic="true"
        data-testid="cart-qty-value"
      >
        {value}
      </span>

      <button
        type="button"
        className={styles.stepBtn}
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
        data-testid="increase-qty-btn"
      >
        <FiPlus aria-hidden="true" />
      </button>
    </div>
  );
}
