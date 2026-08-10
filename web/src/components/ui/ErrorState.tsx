'use client';

import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import styles from './ErrorState.module.css';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div className={`${styles.root} ${className}`} role="alert" aria-live="assertive">
      <span className={styles.icon} aria-hidden="true">
        <FiAlertCircle />
      </span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button
          type="button"
          className={styles.retryBtn}
          onClick={onRetry}
        >
          Try again
        </button>
      )}
    </div>
  );
}
