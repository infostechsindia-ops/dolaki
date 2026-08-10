'use client';

import React, { useEffect, useState } from 'react';
import { PageSkeleton } from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import { FiWifiOff, FiInbox } from 'react-icons/fi';
import styles from './LayoutStateWrapper.module.css';

export interface LayoutStateWrapperProps {
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  isOffline?: boolean;
  onRetry?: () => void;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  loadingPlaceholder?: React.ReactNode;
  children: React.ReactNode;
}

export default function LayoutStateWrapper({
  isLoading = false,
  error = null,
  isEmpty = false,
  isOffline = false,
  onRetry,
  emptyStateTitle = 'No content available',
  emptyStateDescription = 'There is currently no data or content to display here.',
  emptyActionLabel,
  onEmptyAction,
  loadingPlaceholder,
  children,
}: LayoutStateWrapperProps) {
  // Local network online check fallback
  const [online, setOnline] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setOnline(window.navigator.onLine);

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 1. Offline presentation override
  if (isOffline || !online) {
    return (
      <div className={styles.stateContainer}>
        <ErrorState
          title="Network Connection Lost"
          message="You are currently offline. Please check your network connection and try again."
          onRetry={onRetry}
        />
      </div>
    );
  }

  // 2. Error presentation
  if (error) {
    return (
      <div className={styles.stateContainer}>
        <ErrorState
          title="Failed to load content"
          message={error}
          onRetry={onRetry}
        />
      </div>
    );
  }

  // 3. Loading presentation
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        {loadingPlaceholder ?? <PageSkeleton />}
      </div>
    );
  }

  // 4. Empty state presentation
  if (isEmpty) {
    return (
      <div className={styles.stateContainer}>
        <EmptyState
          icon={<FiInbox />}
          title={emptyStateTitle}
          description={emptyStateDescription}
          action={
            onEmptyAction && emptyActionLabel
              ? { label: emptyActionLabel, onClick: onEmptyAction }
              : undefined
          }
        />
      </div>
    );
  }

  // 5. Default content presentation
  return <>{children}</>;
}
