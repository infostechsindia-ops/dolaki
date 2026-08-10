'use client';

import React, { useId } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
}

/**
 * Native HTML checkbox — preserves browser focus/toggle semantics.
 * No redundant ARIA attributes (aria-checked, role="checkbox").
 */
export default function Checkbox({ label, id, className = '', ...props }: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id || generatedId;

  return (
    <label htmlFor={checkboxId} className={`${styles.wrapper} ${className}`}>
      <input
        type="checkbox"
        id={checkboxId}
        className={styles.checkbox}
        {...props}
      />
      <span className={styles.indicator} aria-hidden="true" />
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
