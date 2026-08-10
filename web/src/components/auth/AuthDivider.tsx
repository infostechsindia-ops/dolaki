'use client';

import React from 'react';
import styles from './AuthDivider.module.css';

export interface AuthDividerProps {
  label?: string;
}

export default function AuthDivider({ label = 'or continue with' }: AuthDividerProps) {
  return (
    <div className={styles.divider} role="separator" data-testid="auth-divider">
      <span className={styles.line} />
      <span className={styles.label}>{label}</span>
      <span className={styles.line} />
    </div>
  );
}
