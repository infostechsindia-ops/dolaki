'use client';

import React from 'react';
import styles from './DeliveryMethodSelector.module.css';

export interface DeliveryMethod {
  id: string;
  name: string;
  description?: string;
  priceText: string;
  etaText?: string;
}

export interface DeliveryMethodSelectorProps {
  methods: DeliveryMethod[];
  selectedId?: string;
  onSelectMethod?: (id: string) => void;
  title?: string;
}

export default function DeliveryMethodSelector({
  methods,
  selectedId,
  onSelectMethod,
  title = 'Delivery Method',
}: DeliveryMethodSelectorProps) {
  return (
    <fieldset className={styles.fieldset} data-testid="delivery-method-selector">
      <legend className={styles.legend}>{title}</legend>

      <div className={styles.optionsList}>
        {methods.map((method) => {
          const isSelected = method.id === selectedId;
          const inputId = `delivery-method-${method.id}`;

          return (
            <label
              key={method.id}
              htmlFor={inputId}
              className={`${styles.optionLabel} ${isSelected ? styles.selected : ''}`}
            >
              <input
                id={inputId}
                type="radio"
                name="deliveryMethod"
                value={method.id}
                checked={isSelected}
                onChange={() => onSelectMethod?.(method.id)}
                className={styles.radioInput}
                data-testid={`delivery-radio-${method.id}`}
              />

              <div className={styles.methodInfo}>
                <div className={styles.nameRow}>
                  <span className={styles.name}>{method.name}</span>
                  <span className={styles.price}>{method.priceText}</span>
                </div>

                {method.description && (
                  <span className={styles.description}>{method.description}</span>
                )}

                {method.etaText && (
                  <span className={styles.etaText}>Estimated Delivery: {method.etaText}</span>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
