'use client';

import React from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import styles from './FeaturedBrandSection.module.css';

export interface BrandItem {
  name: string;
  slug: string;
  logoUrl: string;
  tagline?: string;
}

export interface FeaturedBrandSectionProps {
  brands: BrandItem[];
  title?: string;
  ctaText?: string;
  ctaUrl?: string;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function FeaturedBrandSection({
  brands,
  title = 'Featured Brands',
  ctaText = 'View All Brands',
  ctaUrl,
  surface = 'MARKETPLACE'
}: FeaturedBrandSectionProps) {
  if (!brands || brands.length === 0) return null;

  const isFlado = surface === 'QUICK_COMMERCE';

  return (
    <section className={`${styles.section} ${isFlado ? styles.quickCommerce : ''}`} aria-label={title}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {ctaUrl && (
          <Link href={ctaUrl} className={styles.ctaLink}>
            <span>{ctaText}</span>
            <FiArrowRight className={styles.arrow} />
          </Link>
        )}
      </div>
      <div className={styles.grid}>
        {brands.map((brand, idx) => (
          <Link
            key={idx}
            href={`/search?q=${brand.slug}`}
            className={styles.card}
            aria-label={`View brand ${brand.name}`}
          >
            <div className={styles.logoWrapper}>
              <img src={brand.logoUrl} alt={`${brand.name} logo`} className={styles.logo} />
            </div>
            <div className={styles.brandInfo}>
              <h3 className={styles.brandName}>{brand.name}</h3>
              {brand.tagline && <p className={styles.tagline}>{brand.tagline}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
