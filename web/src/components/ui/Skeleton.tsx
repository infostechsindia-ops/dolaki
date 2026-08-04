'use client';

import React from 'react';
import styles from './Skeleton.module.css';

// ─── Base Skeleton ────────────────────────────────────────────────────────────
interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rect' | 'circle' | 'rounded';
  style?: React.CSSProperties;
  animate?: boolean;
}

export function Skeleton({
  className = '',
  width,
  height,
  variant = 'rect',
  style = {},
  animate = true,
}: SkeletonProps) {
  const variantClass = {
    text: styles.text,
    rect: styles.rect,
    circle: styles.circle,
    rounded: styles.rounded,
  }[variant];

  return (
    <div
      className={`${styles.skeleton} ${variantClass} ${animate ? styles.animate : ''} ${className}`}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  );
}

// ─── Product Card Skeleton ────────────────────────────────────────────────────
export function ProductCardSkeleton() {
  return (
    <div className={styles.productCard}>
      <Skeleton variant="rect" height={220} className={styles.productImage} />
      <div className={styles.productBody}>
        <Skeleton variant="text" width="60%" height={12} />
        <Skeleton variant="text" width="90%" height={16} className={styles.mt8} />
        <Skeleton variant="text" width="75%" height={14} className={styles.mt4} />
        <div className={styles.productFooter}>
          <Skeleton variant="text" width="40%" height={20} />
          <Skeleton variant="rounded" width={80} height={32} />
        </div>
      </div>
    </div>
  );
}

// ─── Product Grid Skeleton ────────────────────────────────────────────────────
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={styles.productGrid}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Hero Banner Skeleton ─────────────────────────────────────────────────────
export function HeroBannerSkeleton() {
  return (
    <div className={styles.heroBanner}>
      <div className={styles.heroContent}>
        <Skeleton variant="rounded" width={100} height={24} />
        <Skeleton variant="text" width="65%" height={40} className={styles.mt12} />
        <Skeleton variant="text" width="45%" height={32} className={styles.mt8} />
        <Skeleton variant="text" width="80%" height={16} className={styles.mt12} />
        <Skeleton variant="text" width="70%" height={16} className={styles.mt4} />
        <div className={styles.heroButtons}>
          <Skeleton variant="rounded" width={140} height={44} />
          <Skeleton variant="rounded" width={120} height={44} />
        </div>
      </div>
      <Skeleton variant="rect" className={styles.heroImage} />
    </div>
  );
}

// ─── Category Pills Skeleton ──────────────────────────────────────────────────
export function CategoryPillsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className={styles.pillsRow}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="rounded" width={80 + Math.random() * 40} height={36} />
      ))}
    </div>
  );
}

// ─── Brand Strip Skeleton ─────────────────────────────────────────────────────
export function BrandStripSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={styles.brandStrip}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.brandItem}>
          <Skeleton variant="circle" width={64} height={64} />
          <Skeleton variant="text" width={48} height={12} className={styles.mt8} />
        </div>
      ))}
    </div>
  );
}

// ─── PDP (Product Detail Page) Skeleton ──────────────────────────────────────
export function PDPSkeleton() {
  return (
    <div className={styles.pdpLayout}>
      {/* Left: Gallery */}
      <div className={styles.pdpGallery}>
        <Skeleton variant="rect" height={480} className={styles.pdpMainImage} />
        <div className={styles.pdpThumbs}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rect" width={72} height={72} className={styles.rounded8} />
          ))}
        </div>
      </div>

      {/* Right: Details */}
      <div className={styles.pdpDetails}>
        <Skeleton variant="rounded" width={80} height={22} />
        <Skeleton variant="text" width="85%" height={28} className={styles.mt12} />
        <Skeleton variant="text" width="70%" height={24} className={styles.mt4} />
        <Skeleton variant="text" width={120} height={16} className={styles.mt8} />
        <div className={styles.pdpPriceRow}>
          <Skeleton variant="text" width={100} height={36} />
          <Skeleton variant="text" width={80} height={22} />
          <Skeleton variant="rounded" width={60} height={22} />
        </div>
        <div className={styles.pdpVariants}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="circle" width={36} height={36} />
          ))}
        </div>
        <div className={styles.pdpSizes}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" width={52} height={36} />
          ))}
        </div>
        <Skeleton variant="rect" height={52} className={styles.pdpAddBtn} />
        <Skeleton variant="rect" height={48} className={styles.pdpBuyBtn} />
      </div>
    </div>
  );
}

// ─── Table Skeleton ───────────────────────────────────────────────────────────
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className={styles.tableWrap}>
      {/* Header */}
      <div className={styles.tableRow} style={{ background: '#f8fafc' }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} variant="text" height={14} style={{ flex: 1 }} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className={styles.tableRow}>
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} variant="text" height={14} style={{ flex: 1, opacity: 0.7 }} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Review Card Skeleton ─────────────────────────────────────────────────────
export function ReviewCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className={styles.reviewCards}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.reviewCard}>
          <div className={styles.reviewHeader}>
            <Skeleton variant="circle" width={40} height={40} />
            <div className={styles.reviewMeta}>
              <Skeleton variant="text" width={100} height={14} />
              <Skeleton variant="text" width={80} height={12} className={styles.mt4} />
            </div>
            <Skeleton variant="text" width={60} height={12} style={{ marginLeft: 'auto' }} />
          </div>
          <Skeleton variant="text" width="40%" height={14} className={styles.mt8} />
          <Skeleton variant="text" width="100%" height={13} className={styles.mt8} />
          <Skeleton variant="text" width="90%" height={13} className={styles.mt4} />
          <Skeleton variant="text" width="70%" height={13} className={styles.mt4} />
        </div>
      ))}
    </div>
  );
}

// ─── Section Header Skeleton ──────────────────────────────────────────────────
export function SectionHeaderSkeleton() {
  return (
    <div className={styles.sectionHead}>
      <Skeleton variant="text" width={200} height={24} />
      <Skeleton variant="text" width={100} height={14} className={styles.mt4} />
    </div>
  );
}

// ─── Seller Card Skeleton ─────────────────────────────────────────────────────
export function SellerCardSkeleton() {
  return (
    <div className={styles.sellerCard}>
      <Skeleton variant="rect" height={160} />
      <div className={styles.sellerCardBody}>
        <div className={styles.sellerCardHeader}>
          <Skeleton variant="rounded" width={60} height={60} />
          <div>
            <Skeleton variant="text" width={140} height={18} />
            <Skeleton variant="text" width={100} height={13} className={styles.mt4} />
          </div>
        </div>
        <div className={styles.sellerStats}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.statItem}>
              <Skeleton variant="text" width={50} height={22} />
              <Skeleton variant="text" width={60} height={12} className={styles.mt4} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Full Page Skeleton (generic) ─────────────────────────────────────────────
export function PageSkeleton() {
  return (
    <div className={styles.pageSkeleton}>
      <HeroBannerSkeleton />
      <div className={styles.pageSkeletonBody}>
        <SectionHeaderSkeleton />
        <ProductGridSkeleton count={8} />
        <SectionHeaderSkeleton />
        <BrandStripSkeleton count={8} />
      </div>
    </div>
  );
}

// ─── Default export (backwards compat) ───────────────────────────────────────
export default Skeleton;
