'use client';

import React from 'react';
import styles from './CartPriceSummary.module.css';

export interface QuickFeeLine {
  code: string;
  label: string;
  amountMinor: number;
  formattedAmount: string;
  isWaived?: boolean;
  waiverReason?: string;
  description?: string;
}

export interface FreeDeliveryThresholdInfo {
  thresholdMinor: number;
  formattedThreshold: string;
  remainingForFreeDeliveryMinor: number;
  formattedRemainingForFreeDelivery: string;
  isEligibleForFreeDelivery: boolean;
}

export interface QuickFeeBreakdownProps {
  feeLines: QuickFeeLine[];
  freeDeliveryThreshold?: FreeDeliveryThresholdInfo | null;
  formattedTotalFees?: string;
}

export default function QuickFeeBreakdown({
  feeLines = [],
  freeDeliveryThreshold,
  formattedTotalFees,
}: QuickFeeBreakdownProps) {
  return (
    <div
      data-testid="quick-fee-breakdown"
      aria-live="polite"
      style={{
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        backgroundColor: '#F8FAFC',
        border: '1px solid #E2E8F0',
        marginBottom: '1rem',
      }}
    >
      <h4 style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#475569', marginBottom: '0.5rem' }}>
        Flado Quick Delivery Fees
      </h4>

      <dl style={{ margin: 0, padding: 0 }}>
        {feeLines.map((fee) => (
          <div
            key={fee.code}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.8125rem',
              margin: '0.25rem 0',
            }}
          >
            <dt style={{ color: '#334155' }}>
              {fee.label}
              {fee.description && (
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B' }}>
                  {fee.description}
                </span>
              )}
            </dt>
            <dd
              style={{
                fontWeight: '700',
                color: fee.isWaived ? '#059669' : '#1E293B',
                margin: 0,
              }}
              data-testid={`fee-line-${fee.code.toLowerCase()}`}
            >
              {fee.isWaived ? `FREE (${fee.waiverReason || 'Waived'})` : fee.formattedAmount}
            </dd>
          </div>
        ))}
      </dl>

      {freeDeliveryThreshold && !freeDeliveryThreshold.isEligibleForFreeDelivery && (
        <div
          data-testid="free-delivery-threshold-banner"
          style={{
            marginTop: '0.5rem',
            padding: '0.375rem 0.5rem',
            backgroundColor: '#ECFDF5',
            borderRadius: '6px',
            fontSize: '0.75rem',
            color: '#047857',
            fontWeight: '600',
          }}
        >
          Add {freeDeliveryThreshold.formattedRemainingForFreeDelivery} more for FREE delivery!
        </div>
      )}
    </div>
  );
}
