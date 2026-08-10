'use client';

import React from 'react';
import styles from './ReviewHelpfulActions.module.css';

export interface ReviewHelpfulActionsProps {
  helpfulCount: number;
  isHelpful?: boolean;
  onHelpful?: () => void;
  onReport?: () => void;
  className?: string;
}

export default function ReviewHelpfulActions({
  helpfulCount,
  isHelpful = false,
  onHelpful,
  onReport,
  className = '',
}: ReviewHelpfulActionsProps) {
  return (
    <div className={`${styles.root} ${className}`} data-testid="review-helpful-actions">
      <button
        type="button"
        className={`${styles.helpfulBtn} ${isHelpful ? styles.helpfulBtnActive : ''}`}
        onClick={onHelpful}
        aria-label={`Mark review as helpful. Current helpful count is ${helpfulCount}`}
        data-testid="helpful-btn"
      >
        <span aria-hidden="true">👍</span>
        <span>Helpful ({helpfulCount})</span>
      </button>

      {onReport && (
        <button
          type="button"
          className={styles.reportBtn}
          onClick={onReport}
          aria-label="Report this review"
          data-testid="report-btn"
        >
          Report
        </button>
      )}
    </div>
  );
}
