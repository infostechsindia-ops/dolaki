'use client';

import React from 'react';
import styles from './NotificationPreferencesCard.module.css';

export interface NotificationPreferencesData {
  email: boolean;
  sms: boolean;
  push: boolean;
  promotions: boolean;
  orderUpdates: boolean;
}

export interface NotificationPreferencesCardProps {
  preferences: NotificationPreferencesData;
  onPreferenceChange?: (key: keyof NotificationPreferencesData, enabled: boolean) => void;
  title?: string;
  disabled?: boolean;
}

export default function NotificationPreferencesCard({
  preferences,
  onPreferenceChange,
  title = 'Notification Preferences',
  disabled = false,
}: NotificationPreferencesCardProps) {
  const settings: { key: keyof NotificationPreferencesData; label: string; desc: string }[] = [
    {
      key: 'email',
      label: 'Email Notifications',
      desc: 'Receive order receipts, account updates, and announcements via email.',
    },
    {
      key: 'sms',
      label: 'SMS Notifications',
      desc: 'Receive delivery updates and security OTPs via SMS.',
    },
    {
      key: 'push',
      label: 'Push Notifications',
      desc: 'Get instant alerts on device for order dispatch and live rider tracking.',
    },
    {
      key: 'orderUpdates',
      label: 'Order Updates',
      desc: 'Real-time notifications regarding order placement, shipping, and delivery.',
    },
    {
      key: 'promotions',
      label: 'Promotions & Deals',
      desc: 'Stay notified about seasonal sales, discount coupons, and exclusive offers.',
    },
  ];

  return (
    <div className={styles.card} data-testid="notification-preferences-card">
      <div className={styles.header}>
        <h3 className={styles.heading}>{title}</h3>
      </div>

      <div className={styles.prefList}>
        {settings.map((s) => {
          const isChecked = Boolean(preferences[s.key]);
          const inputId = `notif-pref-${s.key}`;

          return (
            <div key={s.key} className={styles.prefRow}>
              <div className={styles.textGroup}>
                <label htmlFor={inputId} className={styles.prefLabel}>
                  {s.label}
                </label>
                <span className={styles.prefDesc}>{s.desc}</span>
              </div>

              <label htmlFor={inputId} className={styles.switchWrap}>
                <input
                  id={inputId}
                  type="checkbox"
                  className={styles.checkbox}
                  checked={isChecked}
                  onChange={(e) => onPreferenceChange?.(s.key, e.target.checked)}
                  disabled={disabled}
                  data-testid={`notif-switch-${s.key}`}
                />
                <span className={styles.toggleSlider} aria-hidden="true" />
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
