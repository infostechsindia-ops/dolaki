'use client';

import React from 'react';
import { FiMapPin, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import styles from './AddressBookCard.module.css';

export interface AddressItem {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface AddressBookCardProps {
  addresses: AddressItem[];
  onAddAddress?: () => void;
  onEditAddress?: (id: string) => void;
  onDeleteAddress?: (id: string) => void;
  title?: string;
}

export default function AddressBookCard({
  addresses = [],
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
  title = 'Saved Addresses',
}: AddressBookCardProps) {
  return (
    <div className={styles.card} data-testid="address-book-card">
      <div className={styles.header}>
        <h3 className={styles.heading}>{title} ({addresses.length})</h3>

        {onAddAddress && (
          <button
            type="button"
            className={styles.addBtn}
            onClick={onAddAddress}
            aria-label="Add new address"
            data-testid="add-address-btn"
          >
            <FiPlus aria-hidden="true" />
            <span>Add Address</span>
          </button>
        )}
      </div>

      {addresses.length === 0 ? (
        <p className={styles.emptyText}>No saved addresses yet.</p>
      ) : (
        <div className={styles.addressList}>
          {addresses.map((addr) => (
            <div key={addr.id} className={styles.addressItem} data-testid={`address-item-${addr.id}`}>
              <div className={styles.itemHeader}>
                <div className={styles.titleGroup}>
                  <FiMapPin className={styles.icon} aria-hidden="true" />
                  <span className={styles.name}>{addr.name}</span>
                  {addr.isDefault && (
                    <span className={styles.defaultBadge}>DEFAULT</span>
                  )}
                </div>

                <div className={styles.itemActions}>
                  {onEditAddress && (
                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={() => onEditAddress(addr.id)}
                      aria-label={`Edit address for ${addr.name}`}
                      data-testid={`edit-address-btn-${addr.id}`}
                    >
                      <FiEdit2 aria-hidden="true" />
                      <span>Edit</span>
                    </button>
                  )}

                  {onDeleteAddress && (
                    <button
                      type="button"
                      className={`${styles.iconBtn} ${styles.deleteBtn}`}
                      onClick={() => onDeleteAddress(addr.id)}
                      aria-label={`Delete address for ${addr.name}`}
                      data-testid={`delete-address-btn-${addr.id}`}
                    >
                      <FiTrash2 aria-hidden="true" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>

              <address className={styles.addressDetails}>
                <div>{addr.addressLine1}</div>
                {addr.addressLine2 && <div>{addr.addressLine2}</div>}
                <div>
                  {addr.city}, {addr.state} {addr.postalCode}
                </div>
                <div>{addr.country}</div>
                <div className={styles.phone}>Phone: {addr.phone}</div>
              </address>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
