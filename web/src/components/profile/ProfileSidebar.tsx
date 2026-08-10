'use client';

import React from 'react';
import {
  FiGrid,
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiShield,
  FiBell,
  FiGift,
} from 'react-icons/fi';
import styles from './ProfileSidebar.module.css';

export type ProfileTabId =
  | 'overview'
  | 'personal'
  | 'addresses'
  | 'payments'
  | 'security'
  | 'notifications'
  | 'loyalty';

export interface ProfileNavItem {
  id: ProfileTabId;
  label: string;
  icon?: React.ReactNode;
}

export interface ProfileSidebarProps {
  activeTab: ProfileTabId;
  onTabChange?: (tabId: ProfileTabId) => void;
  items?: ProfileNavItem[];
}

const DEFAULT_NAV_ITEMS: ProfileNavItem[] = [
  { id: 'overview', label: 'Overview', icon: <FiGrid aria-hidden="true" /> },
  { id: 'personal', label: 'Personal Information', icon: <FiUser aria-hidden="true" /> },
  { id: 'addresses', label: 'Addresses', icon: <FiMapPin aria-hidden="true" /> },
  { id: 'payments', label: 'Payment Methods', icon: <FiCreditCard aria-hidden="true" /> },
  { id: 'security', label: 'Account Security', icon: <FiShield aria-hidden="true" /> },
  { id: 'notifications', label: 'Notifications', icon: <FiBell aria-hidden="true" /> },
  { id: 'loyalty', label: 'Rewards & Loyalty', icon: <FiGift aria-hidden="true" /> },
];

export default function ProfileSidebar({
  activeTab,
  onTabChange,
  items = DEFAULT_NAV_ITEMS,
}: ProfileSidebarProps) {
  return (
    <nav className={styles.nav} aria-label="Profile Navigation" data-testid="profile-sidebar">
      <ul className={styles.navList}>
        {items.map((item) => {
          const isActive = item.id === activeTab;

          return (
            <li key={item.id} className={styles.navItem}>
              <button
                type="button"
                className={`${styles.navBtn} ${isActive ? styles.active : ''}`}
                onClick={() => onTabChange?.(item.id)}
                aria-current={isActive ? 'page' : undefined}
                data-testid={`profile-nav-${item.id}`}
              >
                {item.icon && <span className={styles.icon}>{item.icon}</span>}
                <span className={styles.label}>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
