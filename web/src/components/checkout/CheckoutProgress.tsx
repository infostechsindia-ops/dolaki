'use client';

import React from 'react';
import { FiCheck } from 'react-icons/fi';
import styles from './CheckoutProgress.module.css';

export type CheckoutStep = 'cart' | 'address' | 'payment' | 'review';

export interface CheckoutProgressStep {
  id: CheckoutStep;
  label: string;
}

export interface CheckoutProgressProps {
  currentStep: CheckoutStep;
  steps?: CheckoutProgressStep[];
  onStepClick?: (stepId: CheckoutStep) => void;
}

const DEFAULT_STEPS: CheckoutProgressStep[] = [
  { id: 'cart', label: 'Cart' },
  { id: 'address', label: 'Address' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

export default function CheckoutProgress({
  currentStep,
  steps = DEFAULT_STEPS,
  onStepClick,
}: CheckoutProgressProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <nav className={styles.nav} aria-label="Checkout progress" data-testid="checkout-progress">
      <ol className={styles.stepper}>
        {steps.map((step, idx) => {
          const isCurrent = step.id === currentStep;
          const isCompleted = idx < currentIndex;
          const isInteractive = onStepClick && isCompleted;

          return (
            <li
              key={step.id}
              className={`${styles.stepItem} ${isCurrent ? styles.current : ''} ${
                isCompleted ? styles.completed : ''
              }`}
              aria-current={isCurrent ? 'step' : undefined}
              data-testid={`checkout-step-${step.id}`}
            >
              {isInteractive ? (
                <button
                  type="button"
                  className={styles.stepBtn}
                  onClick={() => onStepClick(step.id)}
                  aria-label={`Go to ${step.label} step`}
                >
                  <span className={styles.badge}>
                    {isCompleted ? <FiCheck aria-hidden="true" /> : idx + 1}
                  </span>
                  <span className={styles.label}>{step.label}</span>
                </button>
              ) : (
                <div className={styles.stepContent}>
                  <span className={styles.badge}>
                    {isCompleted ? <FiCheck aria-hidden="true" /> : idx + 1}
                  </span>
                  <span className={styles.label}>{step.label}</span>
                </div>
              )}

              {idx < steps.length - 1 && <span className={styles.connector} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
