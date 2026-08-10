'use client';

import React from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import styles from './SeasonalCollectionSection.module.css';

export interface SeasonalCollectionSectionProps {
  title: string;
  imageUrl: string;
  ctaUrl: string;
  ctaText?: string;
  badge?: string;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function SeasonalCollectionSection({
  title,
  imageUrl,
  ctaUrl,
  ctaText = 'Discover Collection',
  badge,
  surface = 'MARKETPLACE'
}: SeasonalCollectionSectionProps) {
  const isFlado = surface === 'QUICK_COMMERCE';

  return (
    <section className={`${styles.section} ${isFlado ? styles.quickCommerce : ''}`} aria-label={title}>
      <div className={styles.banner}>
        <img src={imageUrl} alt={title} className={styles.bgImage} />
        <div className={styles.overlayShadow}></div>
        <div className={styles.content}>
          {badge && <span className={styles.badge}>{badge}</span>}
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.ctaWrapper}>
            <Link href={ctaUrl} className={styles.ctaBtn}>
              <span>{ctaText}</span>
              <FiArrowRight className={styles.arrow} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
