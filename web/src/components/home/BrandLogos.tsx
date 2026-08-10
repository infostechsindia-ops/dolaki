'use client';

import React from 'react';
import Link from 'next/link';
import styles from './BrandLogos.module.css';

export interface BrandItem {
  name: string;
  slug: string;
  logoUrl: string;
}

export interface BrandLogosProps {
  brands: BrandItem[];
  title?: string;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function BrandLogos({
  brands,
  title = 'Our Brand Partners',
  surface = 'MARKETPLACE'
}: BrandLogosProps) {
  if (!brands || brands.length === 0) return null;

  const isFlado = surface === 'QUICK_COMMERCE';

  return (
    <section className={`${styles.section} ${isFlado ? styles.quickCommerce : ''}`} aria-label={title}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>{title}</h2>
      </div>
      <div className={styles.grid}>
        {brands.map((brand, idx) => (
          <Link
            key={idx}
            href={`/search?q=${brand.slug}`}
            className={styles.brandCard}
            aria-label={`Shop ${brand.name} items`}
          >
            <img src={brand.logoUrl} alt={`${brand.name} logo`} className={styles.logoImg} />
          </Link>
        ))}
      </div>
    </section>
  );
}
