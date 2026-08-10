'use client';

import React from 'react';
import { FiCreditCard, FiPlus, FiTrash2 } from 'react-icons/fi';
import styles from './SavedPaymentMethodsCard.module.css';

export interface SavedPaymentMethod {
  id: string;
  brand: string;
  maskedNumber: string; // e.g. "•••• •••• •••• 4242"
  expiry?: string; // e.g. "12/28"
  isDefault?: boolean;
  type?: 'card' | 'upi' | 'wallet';
}

export interface SavedPaymentMethodsCardProps {
  methods: SavedPaymentMethod[];
  onAddMethod?: () => void;
  onRemoveMethod?: (id: string) => void;
  title?: string;
}

export default function SavedPaymentMethodsCard({
  methods = [],
  onAddMethod,
  onRemoveMethod,
  title = 'Saved Payment Methods',
}: SavedPaymentMethodsCardProps) {
  return (
    <div className={styles.card} data-testid="saved-payment-methods-card">
      <div className={styles.header}>
        <h3 className={styles.heading}>{title} ({methods.length})</h3>

        {onAddMethod && (
          <button
            type="button"
            className={styles.addBtn}
            onClick={onAddMethod}
            aria-label="Add new payment method"
            data-testid="add-payment-btn"
          >
            <FiPlus aria-hidden="true" />
            <span>Add Payment Method</span>
          </button>
        )}
      </div>

      {methods.length === 0 ? (
        <p className={styles.emptyText}>No saved payment methods yet.</p>
      ) : (
        <div className={styles.methodList}>
          {methods.map((method) => (
            <div key={method.id} className={styles.methodItem} data-testid={`payment-method-${method.id}`}>
              <div className={styles.itemLeft}>
                <div className={styles.iconWrap}>
                  <FiCreditCard className={styles.icon} aria-hidden="true" />
                </div>

                <div className={styles.details}>
                  <div className={styles.brandRow}>
                    <span className={styles.brand}>{method.brand}</span>
                    {method.isDefault && (
                      <span className={styles.defaultBadge}>DEFAULT</span>
                    )}
                  </div>

                  <span className={styles.maskedNumber}>{method.maskedNumber}</span>

                  {method.expiry && (
                    <span className={styles.expiry}>Expires {method.expiry}</span>
                  )}
                </div>
              </div>

              {onRemoveMethod && (
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => onRemoveMethod(method.id)}
                  aria-label={`Remove ${method.brand} ending in ${method.maskedNumber.slice(-4)}`}
                  data-testid={`remove-payment-btn-${method.id}`}
                >
                  <FiTrash2 aria-hidden="true" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
