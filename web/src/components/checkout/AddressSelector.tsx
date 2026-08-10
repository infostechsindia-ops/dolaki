'use client';

import React, { useState } from 'react';
import { FiMapPin, FiPlus, FiCheckCircle } from 'react-icons/fi';
import { AddressBookEntry } from './AddressBook';
import AddressForm, { AddressFormData } from './AddressForm';
import styles from './AddressSelector.module.css';

export interface AddressSelectorProps {
  addresses: AddressBookEntry[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onAddNew: (data: AddressFormData) => Promise<void> | void;
  showCoordinates?: boolean;
}

export default function AddressSelector({
  addresses,
  selectedId,
  onSelect,
  onAddNew,
  showCoordinates = false,
}: AddressSelectorProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateNew = async (data: AddressFormData) => {
    setIsSubmitting(true);
    try {
      await onAddNew(data);
      setIsAddingNew(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAddingNew) {
    return (
      <AddressForm
        onSubmit={handleCreateNew}
        onCancel={() => setIsAddingNew(false)}
        isSubmitting={isSubmitting}
        title="Add Delivery Address"
      />
    );
  }

  return (
    <div className={styles.container} data-testid="address-selector">
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Select Delivery Address</legend>

        <div className={styles.optionsList} role="radiogroup" aria-label="Delivery Addresses">
          {addresses.map((addr) => {
            const isSelected = addr.id === selectedId;
            return (
              <label
                key={addr.id}
                className={[
                  styles.optionCard,
                  isSelected ? styles.selectedCard : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                data-testid={`address-option-${addr.id}`}
              >
                <input
                  type="radio"
                  name="selectedAddress"
                  value={addr.id}
                  checked={isSelected}
                  onChange={() => onSelect(addr.id)}
                  className={styles.radioInput}
                  data-testid={`address-radio-${addr.id}`}
                />

                <div className={styles.optionContent}>
                  <div className={styles.headerRow}>
                    <span className={styles.name}>{addr.fullName}</span>
                    <span className={styles.labelBadge}>{addr.label}</span>
                    {addr.isDefault && <span className={styles.defaultTag}>Default</span>}
                  </div>

                  <p className={styles.phone}>{addr.phone}</p>
                  <p className={styles.lines}>
                    {addr.line1}
                    {addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} – {addr.pincode}
                  </p>

                  {showCoordinates && addr.lat != null && addr.lng != null && (
                    <p className={styles.coords} data-testid="address-coords">
                      <FiMapPin aria-hidden="true" /> Map Pin: {addr.lat.toFixed(5)}, {addr.lng.toFixed(5)}
                    </p>
                  )}
                </div>

                {isSelected && (
                  <FiCheckCircle className={styles.checkIcon} aria-hidden="true" data-testid="selected-check-icon" />
                )}
              </label>
            );
          })}
        </div>
      </fieldset>

      <button
        type="button"
        className={styles.addInlineBtn}
        onClick={() => setIsAddingNew(true)}
        data-testid="add-new-address-inline-btn"
      >
        <FiPlus aria-hidden="true" />
        Add New Address
      </button>
    </div>
  );
}
