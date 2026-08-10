'use client';

import React from 'react';
import { FiUser } from 'react-icons/fi';
import EmptyState from '@/components/ui/EmptyState';
import styles from './ProfileEmptyState.module.css';

export interface ProfileEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function ProfileEmptyState({
  title = 'No profile information found',
  description = 'Please log in or set up your account profile details.',
  actionLabel = 'Go to Home',
  onAction,
}: ProfileEmptyStateProps) {
  return (
    <div className={styles.container} data-testid="profile-empty-state">
      <EmptyState
        icon={<FiUser className={styles.icon} />}
        title={title}
        description={description}
        action={
          onAction
            ? {
                label: actionLabel,
                onClick: onAction,
              }
            : undefined
        }
      />
    </div>
  );
}
