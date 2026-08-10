'use client';

import React from 'react';
import { FiTruck, FiRotateCcw, FiShield } from 'react-icons/fi';
import styles from './CartDeliveryInfo.module.css';

export interface CartDeliveryInfoProps {
  deliveryMessage?: string;
  returnPolicyText?: string;
  shippingText?: string;
}

export default function CartDeliveryInfo({
  deliveryMessage,
  returnPolicyText,
  shippingText,
}: CartDeliveryInfoProps) {
  if (!deliveryMessage && !returnPolicyText && !shippingText) {
    return null;
  }

  return (
    <div className={styles.container} data-testid="cart-delivery-info">
      {deliveryMessage && (
        <div className={styles.infoRow}>
          <FiTruck className={styles.icon} aria-hidden="true" />
          <span className={styles.text}>{deliveryMessage}</span>
        </div>
      )}

      {shippingText && (
        <div className={styles.infoRow}>
          <FiShield className={styles.icon} aria-hidden="true" />
          <span className={styles.text}>{shippingText}</span>
        </div>
      )}

      {returnPolicyText && (
        <div className={styles.infoRow}>
          <FiRotateCcw className={styles.icon} aria-hidden="true" />
          <span className={styles.text}>{returnPolicyText}</span>
        </div>
      )}
    </div>
  );
}
