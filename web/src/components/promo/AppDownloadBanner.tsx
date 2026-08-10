'use client';

import React from 'react';
import { FiDownload } from 'react-icons/fi';
import styles from './AppDownloadBanner.module.css';

export interface AppDownloadBannerProps {
  title?: string;
  subtitle?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function AppDownloadBanner({
  title = 'Shop Faster on the AuraMart Mobile App',
  subtitle = 'Get instant wallet cashback alerts, live rider location updates, and custom vouchers.',
  appStoreUrl = 'https://apple.co/mock',
  playStoreUrl = 'https://play.google.com/mock',
  surface = 'MARKETPLACE'
}: AppDownloadBannerProps) {
  const isFlado = surface === 'QUICK_COMMERCE';

  return (
    <section className={`${styles.section} ${isFlado ? styles.quickCommerce : ''}`} aria-label="Download App Banner">
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <div className={styles.downloadLinks}>
          <a
            href={appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.storeLink}
            aria-label="Download on the App Store"
          >
            <FiDownload className={styles.icon} />
            <div className={styles.btnText}>
              <span className={styles.btnSub}>Download on the</span>
              <span className={styles.btnMain}>App Store</span>
            </div>
          </a>
          <a
            href={playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.storeLink}
            aria-label="Get it on Google Play"
          >
            <FiDownload className={styles.icon} />
            <div className={styles.btnText}>
              <span className={styles.btnSub}>GET IT ON</span>
              <span className={styles.btnMain}>Google Play</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
