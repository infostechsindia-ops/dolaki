'use client';

import React from 'react';
import { FiTruck, FiBox, FiClock, FiAlertCircle } from 'react-icons/fi';
import ServiceabilityBadge, { ServiceabilityStatusVariant } from './ServiceabilityBadge';
import LocationPincodeSelector, { LocationPincodeSelectorProps } from './LocationPincodeSelector';
import styles from './DeliveryPromiseCard.module.css';

export interface DeliveryPromiseData {
  isServiceable: boolean;
  status: ServiceabilityStatusVariant | string;
  reasonCode?: string;
  unserviceableReason?: string | null;
  nextOpeningText?: string | null;
  deliveryBadgeText?: string | null;
  estimatedDeliveryText?: string | null;
  shippingFeeText?: string | null;
  freeShippingThresholdRemainingText?: string | null;
  cutoffTimeText?: string | null;
  fulfillmentSourceId?: string | null;
  fulfillmentSourceName?: string | null;
  fulfillmentNodeName?: string | null;
}

export interface DeliveryPromiseCardProps {
  promise?: DeliveryPromiseData | null;
  locationSelector?: LocationPincodeSelectorProps;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
  title?: string;
}

export default function DeliveryPromiseCard({
  promise,
  locationSelector,
  surface = 'MARKETPLACE',
  title = 'Delivery & Fulfillment',
}: DeliveryPromiseCardProps) {
  const isFlado = surface === 'QUICK_COMMERCE';

  return (
    <div
      className={`${styles.card} ${isFlado ? styles.flado : ''}`}
      data-testid="delivery-promise-card"
    >
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <FiTruck className={styles.headerIcon} aria-hidden="true" />
          <h3 className={styles.heading}>{title}</h3>
        </div>

        {promise && (
          <ServiceabilityBadge
            status={promise.status}
            isServiceable={promise.isServiceable}
          />
        )}
      </header>

      {/* Location Selector Input */}
      {locationSelector && (
        <div className={styles.locationSection}>
          <LocationPincodeSelector {...locationSelector} />
        </div>
      )}

      {/* Authoritative Serviceability Result (aria-live polite) */}
      <div className={styles.resultArea} aria-live="polite" data-testid="delivery-result-area">
        {!promise ? (
          <p className={styles.hintText}>Enter location to check delivery serviceability.</p>
        ) : !promise.isServiceable ? (
          /* Unserviceable State */
          <div className={styles.unserviceableBlock} data-testid="delivery-unserviceable-block">
            <FiAlertCircle className={styles.alertIcon} aria-hidden="true" />
            <div className={styles.textGroup}>
              <span className={styles.unserviceableTitle}>Not Serviceable</span>
              <p className={styles.unserviceableReason} data-testid="unserviceable-reason">
                {promise.unserviceableReason || 'Selected location is outside delivery coverage area.'}
              </p>
              {promise.nextOpeningText && (
                <p className={styles.nextOpeningText} data-testid="next-opening-text">
                  {promise.nextOpeningText}
                </p>
              )}
            </div>
          </div>
        ) : promise.status === 'ESTIMATE_UNAVAILABLE' ? (
          /* Estimate Unavailable State */
          <div className={styles.estimateUnavailableBlock} data-testid="delivery-estimate-unavailable-block">
            <FiClock className={styles.infoIcon} aria-hidden="true" />
            <div className={styles.textGroup}>
              <span className={styles.infoTitle}>Delivery Estimate Unavailable</span>
              <p className={styles.infoDesc}>
                Item is available at{' '}
                <strong>{promise.fulfillmentNodeName || 'Fulfillment Node'}</strong>, but an authoritative delivery ETA cannot be calculated for this location yet.
              </p>
            </div>
          </div>
        ) : (
          /* Serviceable State with Authoritative Metadata */
          <div className={styles.serviceableBlock} data-testid="delivery-serviceable-block">
            {promise.fulfillmentNodeName && (
              <div className={styles.detailRow}>
                <FiBox className={styles.detailIcon} aria-hidden="true" />
                <span className={styles.detailText}>
                  Fulfillment Node: <strong>{promise.fulfillmentNodeName}</strong>
                </span>
              </div>
            )}

            {promise.estimatedDeliveryText && (
              <div className={styles.detailRow}>
                <FiTruck className={styles.detailIcon} aria-hidden="true" />
                <span className={styles.detailText} data-testid="delivery-eta-text">
                  Estimated Delivery: <strong>{promise.estimatedDeliveryText}</strong>
                </span>
              </div>
            )}

            {promise.shippingFeeText && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Shipping Fee:</span>
                <span className={styles.detailValue} data-testid="delivery-shipping-fee">
                  {promise.shippingFeeText}
                </span>
              </div>
            )}

            {promise.freeShippingThresholdRemainingText && (
              <div className={styles.thresholdRow} data-testid="delivery-free-threshold">
                <span>{promise.freeShippingThresholdRemainingText}</span>
              </div>
            )}

            {promise.cutoffTimeText && (
              <div className={styles.cutoffRow} data-testid="delivery-cutoff-text">
                <FiClock className={styles.clockIcon} aria-hidden="true" />
                <span>{promise.cutoffTimeText}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
