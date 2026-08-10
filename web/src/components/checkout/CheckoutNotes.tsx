'use client';

import React from 'react';
import styles from './CheckoutNotes.module.css';

export interface CheckoutNotesProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function CheckoutNotes({
  value,
  onChange,
  label = 'Delivery Instructions / Notes (Optional)',
  placeholder = 'Add any special instructions for the delivery driver or vendor...',
  disabled = false,
}: CheckoutNotesProps) {
  return (
    <div className={styles.container} data-testid="checkout-notes">
      <label htmlFor="checkout-notes-textarea" className={styles.label}>
        {label}
      </label>
      <textarea
        id="checkout-notes-textarea"
        className={styles.textarea}
        rows={3}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        data-testid="checkout-notes-input"
      />
    </div>
  );
}
