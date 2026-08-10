'use client';

import React from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import EmptyState from '@/components/ui/EmptyState';
import styles from './ReviewsEmptyState.module.css';

export interface ReviewsEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onWriteFirstReview?: () => void;
  className?: string;
}

export default function ReviewsEmptyState({
  title = 'No reviews yet',
  description = 'Be the first to share your thoughts and help other shoppers!',
  actionLabel = 'Write the first review',
  onWriteFirstReview,
  className = '',
}: ReviewsEmptyStateProps) {
  return (
    <div
      className={`${styles.container} ${className}`}
      data-testid="reviews-empty-state"
    >
      <EmptyState
        icon={<FiMessageSquare style={{ fontSize: '2rem' }} />}
        title={title}
        description={description}
        action={
          onWriteFirstReview
            ? {
                label: actionLabel,
                onClick: onWriteFirstReview,
              }
            : undefined
        }
      />
    </div>
  );
}
