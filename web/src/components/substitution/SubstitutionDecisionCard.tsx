'use client';

import React from 'react';

export interface SubstitutionDecisionCardProps {
  originalTitle: string;
  originalPrice: string;
  substituteTitle: string;
  substitutePrice: string;
  priceDifferenceText: string;
  status: 'AWAITING_CUSTOMER' | 'APPROVED' | 'REJECTED' | 'AUTO_APPROVED' | 'FULFILLED' | string;
  onApprove?: () => void;
  onReject?: () => void;
}

export default function SubstitutionDecisionCard({
  originalTitle,
  originalPrice,
  substituteTitle,
  substitutePrice,
  priceDifferenceText,
  status,
  onApprove,
  onReject,
}: SubstitutionDecisionCardProps) {
  const isAwaiting = status === 'AWAITING_CUSTOMER' || status === 'PROPOSED';
  const isApproved = status === 'APPROVED' || status === 'AUTO_APPROVED' || status === 'FULFILLED';
  const isRejected = status === 'REJECTED';

  return (
    <div
      data-testid="substitution-decision-card"
      aria-live="polite"
      style={{
        padding: '1rem',
        borderRadius: '12px',
        border: '1px solid #CBD5E1',
        backgroundColor: isApproved ? '#F0FDF4' : isRejected ? '#FEF2F2' : '#FFFFFF',
      }}
    >
      <h4 style={{ fontSize: '0.9375rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1E293B' }}>
        Item Substitution Proposal
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>ORIGINAL ITEM (UNAVAILABLE)</span>
          <p style={{ fontWeight: '600', color: '#334155', margin: '0.25rem 0' }}>{originalTitle}</p>
          <span style={{ fontSize: '0.875rem', color: '#475569' }} data-testid="original-price">{originalPrice}</span>
        </div>

        <div style={{ padding: '0.75rem', backgroundColor: '#EFF6FF', borderRadius: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1D4ED8' }}>PROPOSED SUBSTITUTE</span>
          <p style={{ fontWeight: '600', color: '#1E40AF', margin: '0.25rem 0' }}>{substituteTitle}</p>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '700' }} data-testid="substitute-price">{substitutePrice}</span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '0.125rem 0.375rem',
                borderRadius: '4px',
                backgroundColor: priceDifferenceText.startsWith('-') ? '#DCFCE7' : '#FEF3C7',
                color: priceDifferenceText.startsWith('-') ? '#15803D' : '#B45309',
              }}
              data-testid="price-difference"
            >
              {priceDifferenceText}
            </span>
          </div>
        </div>
      </div>

      {isAwaiting && (
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onReject}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid #DC2626',
              backgroundColor: '#FFFFFF',
              color: '#DC2626',
              fontWeight: '700',
              cursor: 'pointer',
              minHeight: '44px',
            }}
          >
            Reject Substitute
          </button>

          <button
            type="button"
            onClick={onApprove}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#059669',
              color: '#FFFFFF',
              fontWeight: '700',
              cursor: 'pointer',
              minHeight: '44px',
            }}
          >
            Approve Substitute
          </button>
        </div>
      )}

      {isApproved && (
        <div style={{ color: '#15803D', fontWeight: '700', fontSize: '0.875rem' }} data-testid="substitution-status-approved">
          ✓ Substitute Approved & Reserved
        </div>
      )}

      {isRejected && (
        <div style={{ color: '#B91C1C', fontWeight: '700', fontSize: '0.875rem' }} data-testid="substitution-status-rejected">
          ✕ Substitute Rejected by Customer
        </div>
      )}
    </div>
  );
}
