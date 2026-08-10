'use client';

import React from 'react';
import styles from './PaymentMethodSelector.module.css';

export interface PaymentMethodOption {
  id: string;
  name: string;
  description?: string;
  icon?: React.ReactNode;
  badgeText?: string;
  isEligible?: boolean;
  uneligibleReason?: string;
}

export interface PaymentMethodSelectorProps {
  methods: PaymentMethodOption[];
  selectedId?: string;
  onSelectMethod?: (id: string) => void;
  title?: string;
}

export default function PaymentMethodSelector({
  methods,
  selectedId,
  onSelectMethod,
  title = 'Payment Method',
}: PaymentMethodSelectorProps) {
  return (
    <fieldset className={styles.fieldset} data-testid="payment-method-selector">
      <legend className={styles.legend}>{title}</legend>

      <div className={styles.optionsList}>
        {methods.map((method) => {
          const isSelected = method.id === selectedId;
          const isEligible = method.isEligible ?? true;
          const inputId = `payment-method-${method.id}`;

          return (
            <label
              key={method.id}
              htmlFor={inputId}
              className={`${styles.optionLabel} ${isSelected ? styles.selected : ''} ${
                !isEligible ? styles.disabled : ''
              }`}
              data-testid={`payment-method-label-${method.id}`}
            >
              <input
                id={inputId}
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={isSelected}
                disabled={!isEligible}
                onChange={() => isEligible && onSelectMethod?.(method.id)}
                className={styles.radioInput}
                data-testid={`payment-radio-${method.id}`}
              />

              <div className={styles.methodInfo}>
                <div className={styles.nameRow}>
                  <div className={styles.iconNameGroup}>
                    {method.icon && <span className={styles.icon}>{method.icon}</span>}
                    <span className={styles.name}>{method.name}</span>
                  </div>

                  {method.badgeText && (
                    <span className={styles.badge}>{method.badgeText}</span>
                  )}
                </div>

                {method.description && (
                  <span className={styles.description}>{method.description}</span>
                )}

                {!isEligible && method.uneligibleReason && (
                  <span className={styles.uneligibleReason} data-testid={`uneligible-reason-${method.id}`}>
                    ⚠️ {method.uneligibleReason}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
