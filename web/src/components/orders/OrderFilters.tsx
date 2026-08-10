'use client';

import React from 'react';
import styles from './OrderFilters.module.css';

export interface OrderFiltersState {
  status: string;
  timeRange: string;
  paymentStatus: string;
}

export interface OrderFiltersProps {
  filters: OrderFiltersState;
  onFilterChange: (filters: OrderFiltersState) => void;
  statusOptions?: { value: string; label: string }[];
  timeRangeOptions?: { value: string; label: string }[];
  paymentOptions?: { value: string; label: string }[];
}

const DEFAULT_STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const DEFAULT_TIME_OPTIONS = [
  { value: 'ALL', label: 'Anytime' },
  { value: 'LAST_30_DAYS', label: 'Last 30 Days' },
  { value: 'LAST_6_MONTHS', label: 'Past 6 Months' },
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' },
];

const DEFAULT_PAYMENT_OPTIONS = [
  { value: 'ALL', label: 'All Payments' },
  { value: 'PAID', label: 'Paid' },
  { value: 'PENDING', label: 'Payment Pending' },
  { value: 'REFUNDED', label: 'Refunded' },
];

export default function OrderFilters({
  filters,
  onFilterChange,
  statusOptions = DEFAULT_STATUS_OPTIONS,
  timeRangeOptions = DEFAULT_TIME_OPTIONS,
  paymentOptions = DEFAULT_PAYMENT_OPTIONS,
}: OrderFiltersProps) {
  const handleSelect = (key: keyof OrderFiltersState, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className={styles.container} data-testid="order-filters">
      {/* Status Filter */}
      <div className={styles.filterGroup}>
        <label htmlFor="order-status-filter" className={styles.label}>
          Status:
        </label>
        <select
          id="order-status-filter"
          className={styles.select}
          value={filters.status}
          onChange={(e) => handleSelect('status', e.target.value)}
          data-testid="order-status-filter-select"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date / Time Range Filter */}
      <div className={styles.filterGroup}>
        <label htmlFor="order-timerange-filter" className={styles.label}>
          Date:
        </label>
        <select
          id="order-timerange-filter"
          className={styles.select}
          value={filters.timeRange}
          onChange={(e) => handleSelect('timeRange', e.target.value)}
          data-testid="order-timerange-filter-select"
        >
          {timeRangeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Payment Status Filter */}
      <div className={styles.filterGroup}>
        <label htmlFor="order-payment-filter" className={styles.label}>
          Payment:
        </label>
        <select
          id="order-payment-filter"
          className={styles.select}
          value={filters.paymentStatus}
          onChange={(e) => handleSelect('paymentStatus', e.target.value)}
          data-testid="order-payment-filter-select"
        >
          {paymentOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
