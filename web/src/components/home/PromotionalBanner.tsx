'use client';

import React from 'react';
import Link from 'next/link';
import { FiArrowRight, FiZap } from 'react-icons/fi';
import styles from './PromotionalBanner.module.css';

export interface PromotionalBannerProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  ctaText?: string;
  ctaUrl: string;
  imageUrl: string;
  backgroundColor?: string;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function PromotionalBanner({
  title,
  subtitle,
  badgeText = 'Special Promo',
  ctaText = 'Explore Now',
  ctaUrl,
  imageUrl,
  backgroundColor,
  surface = 'MARKETPLACE'
}: PromotionalBannerProps) {
  const isFlado = surface === 'QUICK_COMMERCE';
  
  const bgStyle = backgroundColor 
    ? { background: backgroundColor } 
    : isFlado 
      ? { background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)' } // Deep indigo for Marketplace link on Flado
      : { background: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)' }; // Green for Flado link on Marketplace

  return (
    <section className={`${styles.section} ${isFlado ? styles.quickCommerce : ''}`} aria-label="Promotional Campaign">
      <div className={styles.bannerCard} style={bgStyle}>
        <div className={styles.content}>
          <span className={styles.badge}>
            <FiZap className={styles.badgeIcon} />
            <span>{badgeText}</span>
          </span>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
          <div className={styles.ctaWrapper}>
            <Link href={ctaUrl} className={styles.ctaLink}>
              <span>{ctaText}</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
        <div className={styles.imageCol}>
          <img src={imageUrl} alt={title} className={styles.bannerImg} />
        </div>
      </div>
    </section>
  );
}
