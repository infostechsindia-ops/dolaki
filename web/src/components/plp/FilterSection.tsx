'use client';

import React from 'react';
import styles from './FilterSection.module.css';

export interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function FilterSection({
  title,
  children,
  className = '',
}: FilterSectionProps) {
  return (
    <fieldset className={`${styles.section} ${className}`}>
      <legend className={styles.legend}>{title}</legend>
      <div className={styles.content}>{children}</div>
    </fieldset>
  );
}
