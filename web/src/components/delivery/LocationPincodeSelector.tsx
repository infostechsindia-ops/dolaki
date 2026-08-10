'use client';

import React, { useState } from 'react';
import { FiMapPin, FiSearch } from 'react-icons/fi';
import styles from './LocationPincodeSelector.module.css';

export interface LocationPincodeSelectorProps {
  initialValue?: string;
  onLocationSubmit?: (locationStr: string) => void;
  label?: string;
  placeholder?: string;
  buttonLabel?: string;
  disabled?: boolean;
}

export default function LocationPincodeSelector({
  initialValue = '',
  onLocationSubmit,
  label = 'Check Delivery & Serviceability',
  placeholder = 'Enter Pincode or Area (e.g. 400001)',
  buttonLabel = 'Check',
  disabled = false,
}: LocationPincodeSelectorProps) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onLocationSubmit?.(value.trim());
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} data-testid="location-pincode-selector">
      <label htmlFor="location-pincode-input" className={styles.label}>
        <FiMapPin className={styles.labelIcon} aria-hidden="true" />
        <span>{label}</span>
      </label>

      <div className={styles.inputGroup}>
        <input
          id="location-pincode-input"
          type="text"
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          data-testid="pincode-input"
        />

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={disabled || !value.trim()}
          data-testid="pincode-submit-btn"
        >
          <FiSearch aria-hidden="true" />
          <span>{buttonLabel}</span>
        </button>
      </div>
    </form>
  );
}
