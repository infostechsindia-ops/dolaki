'use client';

import React from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import ProductCard from '@/components/ProductCard';
import styles from './BestSellerSection.module.css';

export interface BestSellerSectionProps {
  title: string;
  subtitle?: string;
  products: any[];
  ctaText?: string;
  ctaUrl?: string;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function BestSellerSection({
  title,
  subtitle,
  products,
  ctaText = 'View All',
  ctaUrl,
  surface = 'MARKETPLACE'
}: BestSellerSectionProps) {
  if (!products || products.length === 0) return null;

  const isFlado = surface === 'QUICK_COMMERCE';

  return (
    <section className={`${styles.section} ${isFlado ? styles.quickCommerce : ''}`} aria-label={title}>
      <div className={styles.header}>
        <div className={styles.titleCol}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {ctaUrl && (
          <Link href={ctaUrl} className={styles.ctaLink}>
            <span>{ctaText}</span>
            <FiArrowRight className={styles.arrow} />
          </Link>
        )}
      </div>
      <div className={styles.grid} data-testid="bestseller-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
