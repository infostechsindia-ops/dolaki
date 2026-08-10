'use client';

import React from 'react';
import styles from './ProductSpecifications.module.css';

export interface SpecItem {
  key: string;
  value: string;
}

export interface ProductSpecificationsProps {
  specs: SpecItem[];
  title?: string;
  collapsible?: boolean;
}

export default function ProductSpecifications({
  specs,
  title = 'Specifications',
  collapsible = false,
}: ProductSpecificationsProps) {
  if (!specs || specs.length === 0) return null;

  const content = (
    <table className={styles.table}>
      <tbody>
        {specs.map((spec, idx) => (
          <tr key={idx} className={styles.row}>
            <th scope="row" className={styles.key}>{spec.key}</th>
            <td className={styles.value}>{spec.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (collapsible) {
    return (
      <section className={styles.section} data-testid="product-specifications">
        <details className={styles.details} data-testid="specifications-details">
          <summary className={styles.summary}>
            <h2 className={styles.heading}>{title}</h2>
          </summary>
          <div className={styles.detailsContent}>{content}</div>
        </details>
      </section>
    );
  }

  return (
    <section className={styles.section} data-testid="product-specifications">
      <h2 className={styles.heading}>{title}</h2>
      {content}
    </section>
  );
}
