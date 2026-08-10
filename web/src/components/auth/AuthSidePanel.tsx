'use client';

import React from 'react';
import { FiCheckCircle, FiShield, FiZap, FiShoppingBag } from 'react-icons/fi';
import styles from './AuthSidePanel.module.css';

export interface AuthSidePanelProps {
  headline?: string;
  subheadline?: string;
  features?: string[];
  illustrationUrl?: string;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

const DEFAULT_FEATURES_MARKETPLACE = [
  'Access millions of verified products',
  'Track orders in real-time',
  'Exclusive discounts and daily deals',
];

const DEFAULT_FEATURES_FLADO = [
  'Ultra-fast 10-minute grocery delivery',
  'Live rider tracking on interactive map',
  'Fresh quality items guaranteed',
];

export default function AuthSidePanel({
  headline,
  subheadline,
  features,
  illustrationUrl,
  surface = 'MARKETPLACE',
}: AuthSidePanelProps) {
  const isFlado = surface === 'QUICK_COMMERCE';

  const defaultHeadline = isFlado
    ? 'Lightning Fast Delivery to Your Doorstep'
    : 'Welcome to AuraMart Marketplace';

  const defaultSubheadline = isFlado
    ? 'Order groceries and everyday essentials delivered in under 10 minutes.'
    : 'Discover top brands, best prices, and seamless shopping experience.';

  const featureList =
    features ?? (isFlado ? DEFAULT_FEATURES_FLADO : DEFAULT_FEATURES_MARKETPLACE);

  return (
    <div
      className={`${styles.panel} ${isFlado ? styles.fladoPanel : ''}`}
      data-testid="auth-side-panel"
    >
      <div className={styles.content}>
        <div className={styles.brandIconWrap}>
          {isFlado ? (
            <FiZap className={styles.brandIcon} aria-hidden="true" />
          ) : (
            <FiShoppingBag className={styles.brandIcon} aria-hidden="true" />
          )}
        </div>

        <h2 className={styles.headline}>{headline ?? defaultHeadline}</h2>
        <p className={styles.subheadline}>{subheadline ?? defaultSubheadline}</p>

        {featureList.length > 0 && (
          <ul className={styles.featureList} aria-label="Key features">
            {featureList.map((feature, idx) => (
              <li key={idx} className={styles.featureItem}>
                <FiCheckCircle className={styles.checkIcon} aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {illustrationUrl && (
        <div className={styles.illustrationWrap}>
          <img src={illustrationUrl} alt="Authentication illustration" className={styles.illustration} />
        </div>
      )}
    </div>
  );
}
