'use client';

import React from 'react';
import { FiMapPin, FiEdit2, FiPhone, FiUser } from 'react-icons/fi';
import styles from './ShippingAddressCard.module.css';

export interface ShippingAddressData {
  id?: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault?: boolean;
  label?: string;
  lat?: number;
  lng?: number;
}

export interface ShippingAddressCardProps {
  address: ShippingAddressData;
  onEdit?: () => void;
  title?: string;
  showCoordinates?: boolean;
}

export default function ShippingAddressCard({
  address,
  onEdit,
  title = 'Shipping Address',
  showCoordinates = false,
}: ShippingAddressCardProps) {
  const {
    name,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    country,
    postalCode,
    isDefault,
    label,
    lat,
    lng,
  } = address;

  return (
    <div className={styles.card} data-testid="shipping-address-card">
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <FiMapPin className={styles.icon} aria-hidden="true" />
          <h3 className={styles.heading}>{title}</h3>
          {isDefault && <span className={styles.defaultBadge}>DEFAULT</span>}
        </div>

        {onEdit && (
          <button
            type="button"
            className={styles.editBtn}
            onClick={onEdit}
            aria-label={`Edit shipping address for ${name}`}
            data-testid="edit-address-btn"
          >
            <FiEdit2 aria-hidden="true" />
            <span>Edit</span>
          </button>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.infoRow}>
          <FiUser className={styles.metaIcon} aria-hidden="true" />
          <span className={styles.name} data-testid="address-name">{name}</span>
        </div>

        <div className={styles.infoRow}>
          <FiPhone className={styles.metaIcon} aria-hidden="true" />
          <span className={styles.phone} data-testid="address-phone">{phone}</span>
        </div>

        <address className={styles.addressBlock} data-testid="address-lines">
          <div>{addressLine1}</div>
          {addressLine2 && <div>{addressLine2}</div>}
          <div>
            {city}, {state} {postalCode}
          </div>
          <div>{country}</div>
          {showCoordinates && lat != null && lng != null && (
            <div style={{ marginTop: 4, fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }} data-testid="address-coords">
              📍 {lat.toFixed(5)}, {lng.toFixed(5)}
            </div>
          )}
        </address>
      </div>
    </div>
  );
}
