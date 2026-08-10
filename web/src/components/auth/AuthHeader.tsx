'use client';

import React from 'react';
import styles from './AuthHeader.module.css';

export interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  logo?: React.ReactNode;
  brandName?: string;
}

export default function AuthHeader({
  title,
  subtitle,
  logo,
  brandName = 'AuraMart',
}: AuthHeaderProps) {
  return (
    <header className={styles.header} data-testid="auth-header">
      {logo ? (
        <div className={styles.logoWrap}>{logo}</div>
      ) : (
        <span className={styles.brandBadge}>{brandName}</span>
      )}

      <h1 className={styles.title}>{title}</h1>

      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
}
