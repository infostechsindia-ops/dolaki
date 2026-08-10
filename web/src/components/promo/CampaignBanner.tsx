'use client';

import React from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import styles from './CampaignBanner.module.css';

export interface CampaignBannerProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText?: string;
  ctaUrl: string;
  badge?: string;
  backgroundColor?: string;
  gradient?: string;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function CampaignBanner({
  title,
  subtitle,
  imageUrl,
  ctaText = 'Shop Campaign',
  ctaUrl,
  badge,
  backgroundColor,
  gradient,
  surface = 'MARKETPLACE'
}: CampaignBannerProps) {
  const isFlado = surface === 'QUICK_COMMERCE';

  // Apply visual background patterns
  const bgStyle = gradient 
    ? { backgroundImage: gradient }
    : backgroundColor 
      ? { backgroundColor }
      : isFlado 
        ? { background: 'linear-gradient(135deg, #059669 0%, #064E3B 100%)' } // Flado Green
        : { background: 'linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)' }; // Marketplace Violet

  return (
    <section className={`${styles.section} ${isFlado ? styles.quickCommerce : ''}`} aria-label={title}>
      <div className={styles.card} style={bgStyle}>
        <div className={styles.content}>
          {badge && <span className={styles.badge}>{badge}</span>}
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
          <div className={styles.ctaWrapper}>
            <Link href={ctaUrl} className={styles.ctaBtn}>
              <span>{ctaText}</span>
              <FiArrowRight className={styles.arrow} />
            </Link>
          </div>
        </div>
        <div className={styles.imageCol}>
          <img src={imageUrl} alt={title} className={styles.image} />
        </div>
      </div>
    </section>
  );
}
