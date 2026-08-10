'use client';

import React from 'react';
import { FiShoppingBag, FiHeart, FiMapPin, FiGift } from 'react-icons/fi';
import { ProfileTabId } from './ProfileSidebar';
import styles from './ProfileOverview.module.css';

export interface ProfileOverviewMetric {
  id: 'orders' | 'wishlist' | 'addresses' | 'rewards';
  label: string;
  value: string | number;
  subtext?: string;
  onClick?: () => void;
}

export interface ProfileOverviewProps {
  ordersCount: number;
  wishlistCount: number;
  addressesCount: number;
  rewardPoints: number;
  onNavigateTab?: (tabId: ProfileTabId | string) => void;
  title?: string;
}

export default function ProfileOverview({
  ordersCount,
  wishlistCount,
  addressesCount,
  rewardPoints,
  onNavigateTab,
  title = 'Account Overview',
}: ProfileOverviewProps) {
  const metrics: {
    id: string;
    label: string;
    value: string | number;
    subtext: string;
    icon: React.ReactNode;
    tabTarget: string;
  }[] = [
    {
      id: 'orders',
      label: 'Orders',
      value: ordersCount,
      subtext: 'Total orders placed',
      icon: <FiShoppingBag className={styles.icon} aria-hidden="true" />,
      tabTarget: 'orders',
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      value: wishlistCount,
      subtext: 'Saved items',
      icon: <FiHeart className={styles.icon} aria-hidden="true" />,
      tabTarget: 'wishlist',
    },
    {
      id: 'addresses',
      label: 'Saved Addresses',
      value: addressesCount,
      subtext: 'Delivery destinations',
      icon: <FiMapPin className={styles.icon} aria-hidden="true" />,
      tabTarget: 'addresses',
    },
    {
      id: 'rewards',
      label: 'Reward Points',
      value: rewardPoints.toLocaleString(),
      subtext: 'Available points',
      icon: <FiGift className={styles.icon} aria-hidden="true" />,
      tabTarget: 'loyalty',
    },
  ];

  return (
    <section className={styles.container} data-testid="profile-overview">
      <h2 className={styles.heading}>{title}</h2>

      <div className={styles.grid}>
        {metrics.map((m) => (
          <div
            key={m.id}
            className={`${styles.card} ${onNavigateTab ? styles.clickable : ''}`}
            onClick={() => onNavigateTab?.(m.tabTarget)}
            role={onNavigateTab ? 'button' : undefined}
            tabIndex={onNavigateTab ? 0 : undefined}
            onKeyDown={(e) => {
              if (onNavigateTab && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onNavigateTab(m.tabTarget);
              }
            }}
            data-testid={`overview-card-${m.id}`}
          >
            <div className={styles.cardHeader}>
              <span className={styles.iconWrap}>{m.icon}</span>
              <span className={styles.value}>{m.value}</span>
            </div>
            <div className={styles.cardBody}>
              <span className={styles.label}>{m.label}</span>
              <span className={styles.subtext}>{m.subtext}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
