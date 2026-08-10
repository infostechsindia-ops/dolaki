'use client';

import React from 'react';
import Link from 'next/link';
import { FiClock, FiArrowRight } from 'react-icons/fi';
import styles from './FlashDealBanner.module.css';

export interface FlashDealBannerProps {
  title: string;
  subtitle: string;
  expiryText: string;
  ctaText?: string;
  ctaUrl: string;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function FlashDealBanner({
  title,
  subtitle,
  expiryText,
  ctaText = 'View Deals',
  ctaUrl,
  surface = 'MARKETPLACE'
}: FlashDealBannerProps) {
  const isFlado = surface === 'QUICK_COMMERCE';

  return (
    <section className={`${styles.section} ${isFlado ? styles.quickCommerce : ''}`} aria-label="Flash Deals Alert">
      <div className={styles.container}>
        <div className={styles.leftCol}>
          <div className={styles.alertHeader}>
            <FiClock className={styles.clockIcon} />
            <span className={styles.expiryBadge}>{expiryText}</span>
          </div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <div className={styles.rightCol}>
          <Link href={ctaUrl} className={styles.ctaBtn}>
            <span>{ctaText}</span>
            <FiArrowRight className={styles.arrow} />
          </Link>
        </div>
      </div>
    </section>
  );
}
