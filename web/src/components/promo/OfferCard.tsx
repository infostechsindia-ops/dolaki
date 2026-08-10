'use client';

import React from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import styles from './OfferCard.module.css';

export interface OfferCardProps {
  title: string;
  description: string;
  imageUrl: string;
  badge?: string;
  ctaText?: string;
  ctaUrl: string;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function OfferCard({
  title,
  description,
  imageUrl,
  badge,
  ctaText = 'Claim Offer',
  ctaUrl,
  surface = 'MARKETPLACE'
}: OfferCardProps) {
  const isFlado = surface === 'QUICK_COMMERCE';

  return (
    <div className={`${styles.card} ${isFlado ? styles.quickCommerce : ''}`}>
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={title} className={styles.image} />
        {badge && <span className={styles.badge}>{badge}</span>}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <Link href={ctaUrl} className={styles.ctaLink}>
          <span>{ctaText}</span>
          <FiArrowRight className={styles.arrow} />
        </Link>
      </div>
    </div>
  );
}
