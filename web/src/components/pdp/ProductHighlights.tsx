'use client';

import React from 'react';
import { FiCheck } from 'react-icons/fi';
import styles from './ProductHighlights.module.css';

export interface ProductHighlightsProps {
  highlights: string[];
  title?: string;
  collapsible?: boolean;
}

export default function ProductHighlights({
  highlights,
  title = 'Highlights',
  collapsible = false,
}: ProductHighlightsProps) {
  if (!highlights || highlights.length === 0) return null;

  const content = (
    <ul className={styles.list}>
      {highlights.map((item, idx) => (
        <li key={idx} className={styles.item}>
          <FiCheck className={styles.icon} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );

  if (collapsible) {
    return (
      <section className={styles.section} data-testid="product-highlights">
        <details className={styles.details} data-testid="highlights-details">
          <summary className={styles.summary}>
            <h2 className={styles.heading}>{title}</h2>
          </summary>
          <div className={styles.detailsContent}>{content}</div>
        </details>
      </section>
    );
  }

  return (
    <section className={styles.section} data-testid="product-highlights">
      <h2 className={styles.heading}>{title}</h2>
      {content}
    </section>
  );
}
