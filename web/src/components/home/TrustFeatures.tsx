'use client';

import React from 'react';
import { FiAward, FiShield, FiUsers, FiSmile } from 'react-icons/fi';
import styles from './TrustFeatures.module.css';

export interface TrustItem {
  icon: 'award' | 'shield' | 'users' | 'smile';
  title: string;
  description: string;
}

export interface TrustFeaturesProps {
  features?: TrustItem[];
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

const defaultFeatures: TrustItem[] = [
  {
    icon: 'shield',
    title: 'Secure Payments',
    description: 'Fully encrypted transactions via UPI, Credit/Debit cards & Netbanking.'
  },
  {
    icon: 'award',
    title: 'Buyer Protection',
    description: 'Hassle-free direct refunds and 7-day easy return query policies.'
  },
  {
    icon: 'users',
    title: 'Trusted Sellers',
    description: '100% verified merchant channels and premium product standards.'
  },
  {
    icon: 'smile',
    title: 'Customer Support',
    description: 'Helpful assistance available at any hour for shopping needs.'
  }
];

export default function TrustFeatures({
  features = defaultFeatures,
  surface = 'MARKETPLACE'
}: TrustFeaturesProps) {
  const isFlado = surface === 'QUICK_COMMERCE';

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'award': return <FiAward className={styles.icon} />;
      case 'shield': return <FiShield className={styles.icon} />;
      case 'users': return <FiUsers className={styles.icon} />;
      case 'smile': return <FiSmile className={styles.icon} />;
      default: return <FiShield className={styles.icon} />;
    }
  };

  return (
    <section className={`${styles.section} ${isFlado ? styles.quickCommerce : ''}`} aria-label="Trust Guarantees">
      <div className={styles.grid}>
        {features.map((feat, idx) => (
          <div key={idx} className={styles.card}>
            <div className={styles.iconWrapper}>
              {renderIcon(feat.icon)}
            </div>
            <div className={styles.textMeta}>
              <h3 className={styles.cardTitle}>{feat.title}</h3>
              <p className={styles.cardDesc}>{feat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
