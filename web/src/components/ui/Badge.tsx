'use client';

import React from 'react';
import { FiZap, FiStar, FiPercent } from 'react-icons/fi';
import styles from './Badge.module.css';

interface BadgeProps {
  type: 'bestseller' | 'new' | 'trending' | 'special' | 'quick-delivery' | 'discount';
  text?: string;
  className?: string;
}

export default function Badge({ type, text, className = '' }: BadgeProps) {
  const getIcon = () => {
    switch (type) {
      case 'bestseller':
        return <FiStar className={styles.icon} />;
      case 'quick-delivery':
        return <FiZap className={styles.icon} />;
      case 'discount':
        return <FiPercent className={styles.icon} />;
      default:
        return null;
    }
  };

  const getLabel = () => {
    if (text) return text;
    switch (type) {
      case 'bestseller': return 'Bestseller';
      case 'new': return 'New Arrival';
      case 'trending': return 'Trending';
      case 'special': return 'Special Deal';
      case 'quick-delivery': return '10-Min Delivery';
      case 'discount': return 'Discount';
    }
  };

  const badgeClass = styles[type] || styles.new;

  return (
    <span className={`${styles.badge} ${badgeClass} ${className}`}>
      {getIcon()}
      <span>{getLabel()}</span>
    </span>
  );
}
