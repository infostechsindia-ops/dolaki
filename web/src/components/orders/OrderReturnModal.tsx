import React, { useState, useEffect } from 'react';
import styles from './OrderReturnModal.module.css';

export interface ReturnPreviewItem {
  orderItemId: string;
  productId?: string;
  title: string;
  deliveredQuantity: number;
  cancelledQuantity: number;
  returnedQuantity: number;
  remainingReturnableQuantity: number;
  unitPriceMinor: number;
  formattedUnitPrice: string;
  isEligible: boolean;
}

export interface ReturnPreviewResponse {
  orderId: string;
  isReturnable: boolean;
  reasonIfNotEligible?: string;
  policyWindowText: string;
  policyExpiresAt?: string;
  items: ReturnPreviewItem[];
  supportedReasons: string[];
  resolutionOptions: string[];
  fulfillmentOptions: string[];
}

export interface OrderReturnModalProps {
  isOpen: boolean;
  orderId: string;
  orderNumber?: string;
  onClose: () => void;
  onSuccess: (returnRequest: any) => void;
}

export default function OrderReturnModal({
  isOpen,
  orderId,
  orderNumber,
  onClose,
  onSuccess,
}: OrderReturnModalProps) {
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [preview, setPreview] = useState<ReturnPreviewResponse | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>('DAMAGED');
  const [description, setDescription] = useState<string>('');
  const [resolutionChoice, setResolutionChoice] = useState<'REFUND' | 'REPLACEMENT'>('REFUND');
  const [fulfillmentType, setFulfillmentType] = useState<'PICKUP' | 'DROPOFF'>('PICKUP');
  const [evidenceUrl, setEvidenceUrl] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && orderId) {
      fetchPreview();
    }
  }, [isOpen, orderId]);

  const fetchPreview = async () => {
    setLoadingPreview(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/orders/${orderId}/return/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to fetch return preview');
      }
      const data: ReturnPreviewResponse = await res.json();
      setPreview(data);
      const firstEligible = data.items.find((i) => i.isEligible);
      if (firstEligible) {
        setSelectedItemId(firstEligible.orderItemId);
        setQuantity(1);
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching return preview');
    } finally {
      setLoadingPreview(false);
    }
  };

  const selectedItem = preview?.items.find((i) => i.orderItemId === selectedItemId);
  const formattedExpectedRefund = selectedItem ? `${selectedItem.formattedUnitPrice} / unit` : '$0.00';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) {
      setError('Please select an item to return');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        orderItemId: selectedItemId,
        quantity,
        reason,
        description: description || undefined,
        resolutionChoice,
        fulfillmentType,
        evidenceUrls: evidenceUrl ? [evidenceUrl] : [],
      };

      const res = await fetch(`/api/v1/orders/${orderId}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to submit return request');
      }

      const returnData = await res.json();
      onSuccess(returnData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error submitting return request');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      data-testid="return-modal-overlay"
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="return-modal-title"
        aria-modal="true"
        data-testid="return-modal"
      >
        <div className={styles.header}>
          <h2 id="return-modal-title" className={styles.title}>
            Request Return / Replacement {orderNumber ? `(#${orderNumber})` : ''}
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close modal"
            data-testid="return-dialog-close-btn"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            {error && (
              <div className={`${styles.alert} ${styles.alertError}`} role="alert" data-testid="return-error-alert">
                {error}
              </div>
            )}

            {loadingPreview ? (
              <div className={styles.alertNotice} data-testid="loading-preview-indicator">
                Evaluating return policy eligibility...
              </div>
            ) : preview && !preview.isReturnable ? (
              <div className={`${styles.alert} ${styles.alertError}`} role="alert" data-testid="ineligible-return-notice">
                <strong>Return Window Closed:</strong> {preview.reasonIfNotEligible}
              </div>
            ) : preview ? (
              <>
                <div className={styles.alertNotice} data-testid="policy-window-notice">
                  <strong>Policy Window:</strong> {preview.policyWindowText}
                  {preview.policyExpiresAt && ` (Expires: ${new Date(preview.policyExpiresAt).toLocaleDateString()})`}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="return-item-select" className={styles.label}>
                    Select Item to Return / Replace
                  </label>
                  <select
                    id="return-item-select"
                    className={styles.select}
                    value={selectedItemId}
                    onChange={(e) => {
                      setSelectedItemId(e.target.value);
                      setQuantity(1);
                    }}
                    data-testid="return-item-select"
                  >
                    {preview.items.map((item) => (
                      <option
                        key={item.orderItemId}
                        value={item.orderItemId}
                        disabled={!item.isEligible}
                      >
                        {item.title} — {item.formattedUnitPrice} (Available to return: {item.remainingReturnableQuantity})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedItem && (
                  <div className={styles.formGroup}>
                    <label htmlFor="return-quantity-input" className={styles.label}>
                      Quantity (Max {selectedItem.remainingReturnableQuantity})
                    </label>
                    <input
                      id="return-quantity-input"
                      type="number"
                      min={1}
                      max={selectedItem.remainingReturnableQuantity}
                      className={styles.input}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.min(selectedItem.remainingReturnableQuantity, Math.max(1, Number(e.target.value))))}
                      data-testid="return-quantity-input"
                    />
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label htmlFor="return-reason-select" className={styles.label}>
                    Reason for Return
                  </label>
                  <select
                    id="return-reason-select"
                    className={styles.select}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    data-testid="return-reason-select"
                  >
                    <option value="DAMAGED">Damaged / Broken Item</option>
                    <option value="WRONG_ITEM">Wrong Item Received</option>
                    <option value="DEFECTIVE">Defective / Not Working</option>
                    <option value="NOT_AS_DESCRIBED">Item Not as Described</option>
                    <option value="CHANGED_MIND">Changed Mind</option>
                  </select>
                </div>

                <fieldset className={styles.fieldset}>
                  <legend className={styles.legend}>Resolution Choice</legend>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="resolutionChoice"
                        value="REFUND"
                        checked={resolutionChoice === 'REFUND'}
                        onChange={() => setResolutionChoice('REFUND')}
                        data-testid="resolution-refund-radio"
                      />
                      Refund to Payment Method ({formattedExpectedRefund})
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="resolutionChoice"
                        value="REPLACEMENT"
                        checked={resolutionChoice === 'REPLACEMENT'}
                        onChange={() => setResolutionChoice('REPLACEMENT')}
                        data-testid="resolution-replacement-radio"
                      />
                      Replacement Item Delivery
                    </label>
                  </div>
                </fieldset>

                <fieldset className={styles.fieldset}>
                  <legend className={styles.legend}>Fulfillment Preference</legend>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="fulfillmentType"
                        value="PICKUP"
                        checked={fulfillmentType === 'PICKUP'}
                        onChange={() => setFulfillmentType('PICKUP')}
                        data-testid="fulfillment-pickup-radio"
                      />
                      Courier Pickup from Address
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="fulfillmentType"
                        value="DROPOFF"
                        checked={fulfillmentType === 'DROPOFF'}
                        onChange={() => setFulfillmentType('DROPOFF')}
                        data-testid="fulfillment-dropoff-radio"
                      />
                      Store Dropoff
                    </label>
                  </div>
                </fieldset>

                <div className={styles.formGroup}>
                  <label htmlFor="evidence-url-input" className={styles.label}>
                    Evidence Image URL (Optional)
                  </label>
                  <input
                    id="evidence-url-input"
                    type="url"
                    className={styles.input}
                    placeholder="https://example.com/photo.jpg"
                    value={evidenceUrl}
                    onChange={(e) => setEvidenceUrl(e.target.value)}
                    data-testid="evidence-url-input"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="return-description-input" className={styles.label}>
                    Additional Details
                  </label>
                  <textarea
                    id="return-description-input"
                    className={styles.textarea}
                    rows={3}
                    placeholder="Describe any specific issues..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    data-testid="return-description-textarea"
                  />
                </div>
              </>
            ) : null}
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              data-testid="cancel-return-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={submitting || loadingPreview || (preview ? !preview.isReturnable : true)}
              data-testid="confirm-return-btn"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
