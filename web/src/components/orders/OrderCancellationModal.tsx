'use client';

import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/config';
import styles from './OrderCancellationModal.module.css';

export interface OrderCancellationModalProps {
  isOpen: boolean;
  orderId: string;
  orderNumber?: string;
  onClose: () => void;
  onSuccess: (result: any) => void;
}

export default function OrderCancellationModal({
  isOpen,
  orderId,
  orderNumber,
  onClose,
  onSuccess,
}: OrderCancellationModalProps) {
  const [reasonCode, setReasonCode] = useState('CHANGED_MIND');
  const [reasonText, setReasonText] = useState('');
  const [preview, setPreview] = useState<any>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState('');

  // Fetch authoritative cancellation preview
  useEffect(() => {
    if (!isOpen || !orderId) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('aura_token') : null;
    if (!token) return;

    const fetchPreview = async () => {
      setLoadingPreview(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/cancel/preview`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reasonCode, reasonText }),
        });

        if (res.ok) {
          const data = await res.json();
          setPreview(data);
        } else {
          const errData = await res.json().catch(() => ({}));
          setError(errData.message || 'Unable to retrieve cancellation policy preview.');
        }
      } catch (e) {
        setError('Connection error — failed to fetch cancellation preview.');
      } finally {
        setLoadingPreview(false);
      }
    };

    fetchPreview();
  }, [isOpen, orderId, reasonCode]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !executing) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, executing, onClose]);

  if (!isOpen) return null;

  const handleConfirmCancel = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('aura_token') : null;
    if (!token) return;

    setExecuting(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reasonCode, reasonText }),
      });

      if (res.ok) {
        const data = await res.json();
        onSuccess(data);
        onClose();
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.message || 'Cancellation failed. Please try again.');
      }
    } catch (e) {
      setError('Connection error — failed to submit cancellation request.');
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div
      className={styles.backdrop}
      data-testid="cancellation-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-modal-title"
    >
      <div className={styles.dialog}>
        <header className={styles.header}>
          <h2 id="cancel-modal-title" className={styles.title}>
            Cancel Order #{orderNumber || orderId}
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            disabled={executing}
            aria-label="Close cancellation dialog"
          >
            ✕
          </button>
        </header>

        {error && (
          <div className={styles.errorAlert} role="alert" data-testid="cancellation-error-alert">
            {error}
          </div>
        )}

        <div className={styles.body}>
          {/* Reason Selection */}
          <div className={styles.fieldGroup}>
            <label htmlFor="cancel-reason-select" className={styles.label}>
              Reason for Cancellation
            </label>
            <select
              id="cancel-reason-select"
              className={styles.select}
              value={reasonCode}
              onChange={(e) => setReasonCode(e.target.value)}
              disabled={executing}
              data-testid="cancellation-reason-select"
            >
              <option value="CHANGED_MIND">Changed my mind</option>
              <option value="ORDERED_BY_MISTAKE">Ordered by mistake</option>
              <option value="WRONG_ITEM">Selected wrong item / variant</option>
              <option value="DELIVERY_TOO_LATE">Delivery taking too long</option>
              <option value="OTHER">Other reason</option>
            </select>
          </div>

          {reasonCode === 'OTHER' && (
            <div className={styles.fieldGroup}>
              <label htmlFor="cancel-reason-text" className={styles.label}>
                Additional Details (Optional)
              </label>
              <textarea
                id="cancel-reason-text"
                className={styles.textarea}
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder="Tell us why you are cancelling..."
                disabled={executing}
                data-testid="cancellation-reason-textarea"
              />
            </div>
          )}

          {/* Authoritative Preview Policy Card */}
          {loadingPreview ? (
            <div className={styles.loadingPreview} data-testid="cancellation-loading-preview">
              Evaluating cancellation policy...
            </div>
          ) : preview ? (
            <div className={styles.previewCard} data-testid="cancellation-preview-card">
              {!preview.canCancel ? (
                <div className={styles.ineligibleNotice} role="alert" data-testid="cancellation-ineligible-notice">
                  <strong>Cannot Cancel:</strong> {preview.reason}
                </div>
              ) : (
                <>
                  <div className={styles.previewRow}>
                    <span>Cancellation Type:</span>
                    <strong>{preview.cancellationType}</strong>
                  </div>
                  <div className={styles.previewRow}>
                    <span>Expected Refund:</span>
                    <strong className={styles.refundAmount} data-testid="expected-refund-amount">
                      {preview.formattedExpectedRefund}
                    </strong>
                  </div>
                  <div className={styles.previewRow}>
                    <span>Cancellation Fee:</span>
                    <span data-testid="cancellation-fee">{preview.formattedCancellationFee}</span>
                  </div>
                  <div className={styles.refundMethodNote} data-testid="refund-method-note">
                    {preview.refundMethodText}
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>

        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={executing}
            data-testid="cancel-dialog-close-btn"
          >
            Keep Order
          </button>
          <button
            type="button"
            className={styles.confirmBtn}
            onClick={handleConfirmCancel}
            disabled={executing || loadingPreview || (preview && !preview.canCancel)}
            data-testid="confirm-cancellation-btn"
          >
            {executing ? 'Processing...' : 'Confirm Cancellation'}
          </button>
        </footer>
      </div>
    </div>
  );
}
