'use client';

import React from 'react';
import { FiTruck } from 'react-icons/fi';
import styles from './DeliveryPromoBanner.module.css';

export interface DeliveryPromoBannerProps {
  message: string;
  subMessage?: string;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function DeliveryPromoBanner({
  message,
  subMessage,
  surface = 'MARKETPLACE'
}: DeliveryPromoBannerProps) {
  const isFlado = surface === 'QUICK_COMMERCE';

  return (
    <section className={`${styles.section} ${isFlado ? styles.quickCommerce : ''}`} aria-label="Delivery Promotion">
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <FiTruck className={styles.truckIcon} />
        </div>
        <div className={styles.textMeta}>
          <h2 className={styles.message}>{message}</h2>
          {subMessage && <p className={styles.subMessage}>{subMessage}</p>}
        </div>
      </div>
    </section>
  );
}
