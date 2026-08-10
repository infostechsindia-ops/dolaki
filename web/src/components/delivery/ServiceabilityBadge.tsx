'use client';

import React from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import styles from './ServiceabilityBadge.module.css';

export type ServiceabilityStatusVariant = 'SERVICEABLE' | 'UNSERVICEABLE' | 'ESTIMATE_UNAVAILABLE';

export interface ServiceabilityBadgeProps {
  status: ServiceabilityStatusVariant | string;
  isServiceable?: boolean;
  label?: string;
}

export default function ServiceabilityBadge({
  status,
  isServiceable = true,
  label,
}: ServiceabilityBadgeProps) {
  const getVariant = (): ServiceabilityStatusVariant => {
    if (status === 'UNSERVICEABLE' || isServiceable === false) return 'UNSERVICEABLE';
    if (status === 'ESTIMATE_UNAVAILABLE') return 'ESTIMATE_UNAVAILABLE';
    return 'SERVICEABLE';
  };

  const variant = getVariant();

  const getDisplayText = () => {
    if (label) return label;
    switch (variant) {
      case 'SERVICEABLE':
        return 'Serviceable Zone';
      case 'UNSERVICEABLE':
        return 'Out of Delivery Zone';
      case 'ESTIMATE_UNAVAILABLE':
        return 'Estimate Unavailable';
    }
  };

  return (
    <span
      className={`${styles.badge} ${styles[variant.toLowerCase()]}`}
      data-testid="serviceability-badge"
      role="status"
    >
      {variant === 'SERVICEABLE' && <FiCheckCircle className={styles.icon} aria-hidden="true" />}
      {variant === 'UNSERVICEABLE' && <FiXCircle className={styles.icon} aria-hidden="true" />}
      {variant === 'ESTIMATE_UNAVAILABLE' && <FiAlertCircle className={styles.icon} aria-hidden="true" />}
      <span>{getDisplayText()}</span>
    </span>
  );
}
