'use client';

import React from 'react';
import { FiZap, FiStar, FiPercent } from 'react-icons/fi';
import styles from './Badge.module.css';

export type BadgeVariant =
  | 'bestseller'
  | 'new'
  | 'trending'
  | 'special'
  | 'quick-delivery'
  | 'discount'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'flado';

export interface BadgeProps {
  variant: BadgeVariant;
  text?: string;
  className?: string;
}

const ICONS: Partial<Record<BadgeVariant, React.ReactNode>> = {
  bestseller: <FiStar />,
  'quick-delivery': <FiZap />,
  flado: <FiZap />,
  discount: <FiPercent />,
};

const DEFAULT_LABELS: Record<BadgeVariant, string> = {
  bestseller: 'Bestseller',
  new: 'New Arrival',
  trending: 'Trending',
  special: 'Special Deal',
  'quick-delivery': '10-Min Delivery',
  discount: 'Discount',
  success: 'Success',
  warning: 'Warning',
  danger: 'Danger',
  info: 'Info',
  flado: 'Flado',
};

export default function Badge({ variant, text, className = '' }: BadgeProps) {
  const icon = ICONS[variant];
  const label = text ?? DEFAULT_LABELS[variant];
  const cssClass = styles[variant.replace('-', '_')] ?? styles.new;

  return (
    <span className={`${styles.badge} ${cssClass} ${className}`}>
      {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      <span>{label}</span>
    </span>
  );
}
