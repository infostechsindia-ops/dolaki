'use client';

import React from 'react';
import { FiTruck, FiRotateCcw, FiShield } from 'react-icons/fi';
import styles from './ProductDeliveryInfo.module.css';

export interface ProductDeliveryInfoProps {
  badgeText?: string;
  estimatedDeliveryText?: string;
  shippingInfoText?: string;
  returnPolicyText?: string;
}

export default function ProductDeliveryInfo({
  badgeText,
  estimatedDeliveryText,
  shippingInfoText,
  returnPolicyText,
}: ProductDeliveryInfoProps) {
  if (!badgeText && !estimatedDeliveryText && !shippingInfoText && !returnPolicyText) {
    return null;
  }

  return (
    <div className={styles.container} data-testid="product-delivery-info">
      {badgeText && <span className={styles.badge}>{badgeText}</span>}

      <div className={styles.infoList}>
        {estimatedDeliveryText && (
          <div className={styles.infoItem}>
            <FiTruck className={styles.icon} aria-hidden="true" />
            <div className={styles.textGroup}>
              <span className={styles.title}>Estimated Delivery</span>
              <span className={styles.desc}>{estimatedDeliveryText}</span>
            </div>
          </div>
        )}

        {shippingInfoText && (
          <div className={styles.infoItem}>
            <FiShield className={styles.icon} aria-hidden="true" />
            <div className={styles.textGroup}>
              <span className={styles.title}>Shipping Info</span>
              <span className={styles.desc}>{shippingInfoText}</span>
            </div>
          </div>
        )}

        {returnPolicyText && (
          <div className={styles.infoItem}>
            <FiRotateCcw className={styles.icon} aria-hidden="true" />
            <div className={styles.textGroup}>
              <span className={styles.title}>Return Policy</span>
              <span className={styles.desc}>{returnPolicyText}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
