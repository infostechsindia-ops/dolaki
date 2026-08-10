'use client';

import React from 'react';
import { FiLock, FiShield, FiClock } from 'react-icons/fi';
import styles from './AccountSecurityCard.module.css';

export interface AccountSecurityData {
  passwordLastChanged?: string;
  twoFactorEnabled?: boolean;
  lastLoginText?: string;
}

export interface AccountSecurityCardProps {
  security: AccountSecurityData;
  onChangePassword?: () => void;
  onToggleTwoFactor?: () => void;
  title?: string;
}

export default function AccountSecurityCard({
  security,
  onChangePassword,
  onToggleTwoFactor,
  title = 'Account Security',
}: AccountSecurityCardProps) {
  const { passwordLastChanged, twoFactorEnabled = false, lastLoginText } = security;

  return (
    <div className={styles.card} data-testid="account-security-card">
      <div className={styles.header}>
        <h3 className={styles.heading}>{title}</h3>
      </div>

      <div className={styles.securityList}>
        {/* Password status */}
        <div className={styles.securityRow}>
          <div className={styles.infoGroup}>
            <FiLock className={styles.icon} aria-hidden="true" />
            <div className={styles.textGroup}>
              <span className={styles.label}>Password</span>
              <span className={styles.status} data-testid="password-status">
                {passwordLastChanged ? `Last changed ${passwordLastChanged}` : 'Password is set'}
              </span>
            </div>
          </div>

          {onChangePassword && (
            <button
              type="button"
              className={styles.actionBtn}
              onClick={onChangePassword}
              aria-label="Change password"
              data-testid="change-password-btn"
            >
              Change Password
            </button>
          )}
        </div>

        {/* Two-Factor status */}
        <div className={styles.securityRow}>
          <div className={styles.infoGroup}>
            <FiShield className={styles.icon} aria-hidden="true" />
            <div className={styles.textGroup}>
              <span className={styles.label}>Two-Factor Authentication (2FA)</span>
              <span className={styles.status} data-testid="2fa-status">
                Status: {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          {onToggleTwoFactor && (
            <button
              type="button"
              className={`${styles.actionBtn} ${twoFactorEnabled ? styles.disabledBtn : ''}`}
              onClick={onToggleTwoFactor}
              aria-label={twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              data-testid="toggle-2fa-btn"
            >
              {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          )}
        </div>

        {/* Last login status */}
        {lastLoginText && (
          <div className={styles.securityRow}>
            <div className={styles.infoGroup}>
              <FiClock className={styles.icon} aria-hidden="true" />
              <div className={styles.textGroup}>
                <span className={styles.label}>Last Active Login</span>
                <span className={styles.status} data-testid="last-login-status">
                  {lastLoginText}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
