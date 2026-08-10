'use client';

import React from 'react';
import styles from './ResultsSummary.module.css';

export interface ResultsSummaryProps {
  query: string;
  totalResults: number;
  subtitle?: string;
}

export default function ResultsSummary({ query, totalResults, subtitle }: ResultsSummaryProps) {
  return (
    <div className={styles.root} data-testid="results-summary">
      <h1 className={styles.heading}>
        {query ? (
          <>
            Results for <mark className={styles.keyword}>"{query}"</mark>
          </>
        ) : (
          'All Products'
        )}
      </h1>
      <p className={styles.count} aria-live="polite">
        {totalResults.toLocaleString()} {totalResults === 1 ? 'result' : 'results'} found
      </p>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
