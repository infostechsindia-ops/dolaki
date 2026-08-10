'use client';

import React, { useState } from 'react';
import { FiGift, FiCopy, FiCheck } from 'react-icons/fi';
import styles from './CouponBanner.module.css';

export interface CouponBannerProps {
  couponCode: string;
  description: string;
  ctaText?: string;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function CouponBanner({
  couponCode,
  description,
  ctaText = 'Copy Code',
  surface = 'MARKETPLACE'
}: CouponBannerProps) {
  const [copied, setCopied] = useState(false);
  const isFlado = surface === 'QUICK_COMMERCE';

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className={`${styles.section} ${isFlado ? styles.quickCommerce : ''}`} aria-label={`Coupon ${couponCode}`}>
      <div className={styles.container}>
        <div className={styles.badgeWrapper}>
          <FiGift className={styles.giftIcon} />
        </div>
        <div className={styles.textMeta}>
          <div className={styles.couponCodeWrapper}>
            <span className={styles.couponLabel}>USE CODE:</span>
            <code className={styles.couponCode}>{couponCode}</code>
          </div>
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.actionCol}>
          <button onClick={handleCopy} className={styles.copyBtn} aria-label={copied ? 'Code copied' : ctaText}>
            {copied ? (
              <>
                <FiCheck className={styles.successIcon} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <FiCopy />
                <span>{ctaText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
