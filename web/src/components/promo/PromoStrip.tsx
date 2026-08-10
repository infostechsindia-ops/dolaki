'use client';

import React from 'react';
import OfferCard, { OfferCardProps } from './OfferCard';
import styles from './PromoStrip.module.css';

export interface PromoStripProps {
  title?: string;
  offers: OfferCardProps[];
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function PromoStrip({
  title,
  offers,
  surface = 'MARKETPLACE'
}: PromoStripProps) {
  if (!offers || offers.length === 0) return null;

  const isFlado = surface === 'QUICK_COMMERCE';

  return (
    <section className={`${styles.section} ${isFlado ? styles.quickCommerce : ''}`} aria-label={title || 'Promotional Strip'}>
      {title && (
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>
      )}
      <div className={styles.grid}>
        {offers.map((offer, idx) => (
          <div key={idx} className={styles.gridItem}>
            <OfferCard {...offer} surface={surface} />
          </div>
        ))}
      </div>
    </section>
  );
}
