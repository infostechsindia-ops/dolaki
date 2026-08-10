'use client';

import React from 'react';
import styles from './SearchSection.module.css';

export interface SearchSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function SearchSection({
  title,
  subtitle,
  children
}: SearchSectionProps) {
  return (
    <section className={styles.section} aria-label={title}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </section>
  );
}
