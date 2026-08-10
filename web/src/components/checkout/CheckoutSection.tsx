'use client';

import React from 'react';
import styles from './CheckoutSection.module.css';

export interface CheckoutSectionProps {
  title: string;
  stepNumber?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  children: React.ReactNode;
  /** CMD-043: Show green completion border when all required selections are made */
  isComplete?: boolean;
  /** CMD-043: Show red error border + inline validation message */
  hasError?: boolean;
  /** CMD-043: Inline validation message shown below section content when hasError=true */
  errorMessage?: string;
}

export default function CheckoutSection({
  title,
  stepNumber,
  action,
  children,
  isComplete = false,
  hasError = false,
  errorMessage,
}: CheckoutSectionProps) {
  const sectionClass = [
    styles.section,
    isComplete ? styles.complete : '',
    hasError ? styles.error : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section
      className={sectionClass}
      data-testid="checkout-section"
      data-complete={isComplete || undefined}
      data-error={hasError || undefined}
    >
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          {stepNumber != null && (
            <span className={styles.stepNum}>{stepNumber}</span>
          )}
          <h2 className={styles.heading}>{title}</h2>
        </div>

        {action && (
          <button
            type="button"
            className={styles.actionBtn}
            onClick={action.onClick}
            aria-label={action.label}
          >
            {action.label}
          </button>
        )}
      </div>

      <div className={styles.content}>{children}</div>

      {hasError && errorMessage && (
        <p
          className={styles.errorMessage}
          role="alert"
          data-testid="section-validation-error"
        >
          {errorMessage}
        </p>
      )}
    </section>
  );
}
