'use client';

import React from 'react';
import Skeleton from '@/components/ui/Skeleton';
import styles from './ProductGridSkeleton.module.css';

export interface ProductGridSkeletonProps {
  count?: number;
}

export default function ProductGridSkeleton({ count = 10 }: ProductGridSkeletonProps) {
  return (
    <div
      className={styles.grid}
      data-testid="product-grid-skeleton"
      aria-label="Loading products"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className={styles.cardSkeleton}>
          <Skeleton height="180px" variant="rounded" />
          <div className={styles.metaGroup}>
            <Skeleton height="14px" width="40%" variant="text" />
            <Skeleton height="18px" width="85%" variant="text" />
            <Skeleton height="16px" width="60%" variant="text" />
            <Skeleton height="36px" variant="rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
