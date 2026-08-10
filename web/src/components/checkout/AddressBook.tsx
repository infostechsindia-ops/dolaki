'use client';

import React from 'react';
import { FiMapPin, FiEdit2, FiTrash2, FiStar, FiHome, FiBriefcase, FiMoreHorizontal } from 'react-icons/fi';
import styles from './AddressBook.module.css';

export interface AddressBookEntry {
  id: string;
  label: string; // 'Home' | 'Work' | 'Other'
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  lat?: number;
  lng?: number;
  isDefault: boolean;
}

export interface AddressBookProps {
  addresses: AddressBookEntry[];
  onAdd: () => void;
  onEdit: (address: AddressBookEntry) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  /** Optional loading state per address id (delete / set-default in flight) */
  loadingId?: string | null;
  /** Quick-Commerce mode — shows map pin coordinates */
  showCoordinates?: boolean;
}

function LabelIcon({ label }: { label: string }) {
  if (label === 'Work') return <FiBriefcase aria-hidden="true" />;
  if (label === 'Home') return <FiHome aria-hidden="true" />;
  return <FiMoreHorizontal aria-hidden="true" />;
}

export default function AddressBook({
  addresses,
  onAdd,
  onEdit,
  onDelete,
  onSetDefault,
  loadingId,
  showCoordinates = false,
}: AddressBookProps) {
  return (
    <section className={styles.root} aria-label="Saved Addresses">
      <div className={styles.header}>
        <h2 className={styles.heading}>Saved Addresses</h2>
        <button
          type="button"
          className={styles.addBtn}
          onClick={onAdd}
          data-testid="add-address-btn"
        >
          + Add New Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className={styles.empty} data-testid="address-book-empty">
          <FiMapPin className={styles.emptyIcon} aria-hidden="true" />
          <p className={styles.emptyText}>No saved addresses yet.</p>
          <button
            type="button"
            className={styles.addBtnLg}
            onClick={onAdd}
            data-testid="add-address-btn-empty"
          >
            Add Your First Address
          </button>
        </div>
      ) : (
        <ul className={styles.list} data-testid="address-list">
          {addresses.map((addr) => (
            <li
              key={addr.id}
              className={[
                styles.card,
                addr.isDefault ? styles.defaultCard : '',
                loadingId === addr.id ? styles.loading : '',
              ]
                .filter(Boolean)
                .join(' ')}
              data-testid="address-card"
              data-address-id={addr.id}
            >
              {/* Label badge row */}
              <div className={styles.labelRow}>
                <span
                  className={[styles.labelBadge, styles[`label${addr.label}`] || styles.labelOther].join(' ')}
                  data-testid="address-label"
                >
                  <LabelIcon label={addr.label} />
                  {addr.label}
                </span>
                {addr.isDefault && (
                  <span className={styles.defaultBadge} data-testid="address-default-badge">
                    <FiStar aria-hidden="true" />
                    Default
                  </span>
                )}
              </div>

              {/* Address body */}
              <div className={styles.body}>
                <p className={styles.name} data-testid="address-full-name">
                  {addr.fullName}
                </p>
                <p className={styles.phone} data-testid="address-phone">
                  {addr.phone}
                </p>
                <address className={styles.addressLines} data-testid="address-lines">
                  {addr.line1}
                  {addr.line2 && <>, {addr.line2}</>}
                  <br />
                  {addr.city}, {addr.state} – {addr.pincode}
                </address>

                {/* Quick-Commerce: show coordinates if available */}
                {showCoordinates && addr.lat != null && addr.lng != null && (
                  <p className={styles.coords} data-testid="address-coords">
                    <FiMapPin aria-hidden="true" />
                    {addr.lat.toFixed(5)}, {addr.lng.toFixed(5)}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className={styles.actions}>
                {!addr.isDefault && (
                  <button
                    type="button"
                    className={styles.defaultBtn}
                    onClick={() => onSetDefault(addr.id)}
                    disabled={loadingId === addr.id}
                    aria-label={`Set ${addr.fullName} as default address`}
                    data-testid="set-default-btn"
                  >
                    Set as Default
                  </button>
                )}
                <button
                  type="button"
                  className={styles.editBtn}
                  onClick={() => onEdit(addr)}
                  disabled={loadingId === addr.id}
                  aria-label={`Edit ${addr.label} address`}
                  data-testid="edit-address-btn"
                >
                  <FiEdit2 aria-hidden="true" />
                  Edit
                </button>
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={() => onDelete(addr.id)}
                  disabled={loadingId === addr.id}
                  aria-label={`Delete ${addr.label} address`}
                  data-testid="delete-address-btn"
                >
                  <FiTrash2 aria-hidden="true" />
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
