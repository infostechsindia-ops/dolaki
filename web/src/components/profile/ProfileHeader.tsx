'use client';

import React from 'react';
import { FiEdit2, FiAward, FiCalendar } from 'react-icons/fi';
import styles from './ProfileHeader.module.css';

export interface ProfileHeaderProps {
  name: string;
  avatarUrl?: string;
  membershipLevel?: string;
  joinDate?: string;
  onEditProfile?: () => void;
  editLabel?: string;
}

export default function ProfileHeader({
  name,
  avatarUrl,
  membershipLevel = 'Gold Member',
  joinDate,
  onEditProfile,
  editLabel = 'Edit Profile',
}: ProfileHeaderProps) {
  const getInitials = (nameStr: string) => {
    return nameStr
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className={styles.header} data-testid="profile-header">
      <div className={styles.avatarSection}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className={styles.avatarImg} />
        ) : (
          <div className={styles.avatarInitials} aria-label={name}>
            {getInitials(name)}
          </div>
        )}
      </div>

      <div className={styles.infoSection}>
        <div className={styles.nameRow}>
          <h1 className={styles.name}>{name}</h1>
          {membershipLevel && (
            <span className={styles.badge} data-testid="membership-badge">
              <FiAward className={styles.badgeIcon} aria-hidden="true" />
              {membershipLevel}
            </span>
          )}
        </div>

        {joinDate && (
          <div className={styles.metaRow}>
            <FiCalendar className={styles.metaIcon} aria-hidden="true" />
            <span className={styles.joinDate}>Member since {joinDate}</span>
          </div>
        )}
      </div>

      {onEditProfile && (
        <button
          type="button"
          className={styles.editBtn}
          onClick={onEditProfile}
          aria-label={editLabel}
          data-testid="edit-profile-btn"
        >
          <FiEdit2 aria-hidden="true" />
          <span>{editLabel}</span>
        </button>
      )}
    </header>
  );
}
