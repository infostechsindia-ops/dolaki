'use client';

import React from 'react';
import { FiEye, FiTruck, FiDownload, FiRotateCcw, FiRefreshCw, FiXCircle } from 'react-icons/fi';
import styles from './OrderActions.module.css';

export interface OrderActionsProps {
  orderId: string;
  onViewDetails?: (orderId: string) => void;
  onTrackOrder?: (orderId: string) => void;
  onDownloadInvoice?: (orderId: string) => void;
  onBuyAgain?: (orderId: string) => void;
  onReturnOrder?: (orderId: string) => void;
  onCancelOrder?: (orderId: string) => void;
  disabled?: boolean;
}

export default function OrderActions({
  orderId,
  onViewDetails,
  onTrackOrder,
  onDownloadInvoice,
  onBuyAgain,
  onReturnOrder,
  onCancelOrder,
  disabled = false,
}: OrderActionsProps) {
  return (
    <div className={styles.container} data-testid="order-actions">
      {onViewDetails && (
        <button
          type="button"
          className={`${styles.actionBtn} ${styles.primaryBtn}`}
          onClick={() => onViewDetails(orderId)}
          disabled={disabled}
          aria-label={`View details for order ${orderId}`}
          data-testid="view-details-btn"
        >
          <FiEye aria-hidden="true" />
          <span>View Details</span>
        </button>
      )}

      {onTrackOrder && (
        <button
          type="button"
          className={`${styles.actionBtn} ${styles.trackBtn}`}
          onClick={() => onTrackOrder(orderId)}
          disabled={disabled}
          aria-label={`Track shipment for order ${orderId}`}
          data-testid="track-order-btn"
        >
          <FiTruck aria-hidden="true" />
          <span>Track Order</span>
        </button>
      )}

      {onBuyAgain && (
        <button
          type="button"
          className={`${styles.actionBtn} ${styles.secondaryBtn}`}
          onClick={() => onBuyAgain(orderId)}
          disabled={disabled}
          aria-label={`Buy items again from order ${orderId}`}
          data-testid="buy-again-btn"
        >
          <FiRefreshCw aria-hidden="true" />
          <span>Buy Again</span>
        </button>
      )}

      {onDownloadInvoice && (
        <button
          type="button"
          className={`${styles.actionBtn} ${styles.secondaryBtn}`}
          onClick={() => onDownloadInvoice(orderId)}
          disabled={disabled}
          aria-label={`Download invoice for order ${orderId}`}
          data-testid="download-invoice-btn"
        >
          <FiDownload aria-hidden="true" />
          <span>Invoice</span>
        </button>
      )}

      {onCancelOrder && (
        <button
          type="button"
          className={`${styles.actionBtn} ${styles.outlineBtn}`}
          onClick={() => onCancelOrder(orderId)}
          disabled={disabled}
          aria-label={`Cancel order ${orderId}`}
          data-testid="cancel-order-btn"
        >
          <FiXCircle aria-hidden="true" />
          <span>Cancel Order</span>
        </button>
      )}

      {onReturnOrder && (
        <button
          type="button"
          className={`${styles.actionBtn} ${styles.outlineBtn}`}
          onClick={() => onReturnOrder(orderId)}
          disabled={disabled}
          aria-label={`Request return for order ${orderId}`}
          data-testid="return-order-btn"
        >
          <FiRotateCcw aria-hidden="true" />
          <span>Return</span>
        </button>
      )}
    </div>
  );
}
