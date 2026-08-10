'use client';

import React, { useId } from 'react';
import styles from './Radio.module.css';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
}

/**
 * Native HTML radio — preserves browser focus and arrow-key group navigation.
 * No redundant ARIA attributes (role="radio", aria-checked).
 */
export default function Radio({ label, id, className = '', ...props }: RadioProps) {
  const generatedId = useId();
  const radioId = id || generatedId;

  return (
    <label htmlFor={radioId} className={`${styles.wrapper} ${className}`}>
      <input
        type="radio"
        id={radioId}
        className={styles.radio}
        {...props}
      />
      <span className={styles.indicator} aria-hidden="true" />
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
