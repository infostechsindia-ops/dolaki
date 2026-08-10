'use client';

import React from 'react';

export interface QuickReorderItem {
  productId: string;
  variantId: string;
  sku: string;
  title: string;
  description?: string;
  imageUrl?: string | null;
  historicalPriceMinor: number;
  currentPriceMinor: number;
  formattedCurrentPrice: string;
  isAvailable: boolean;
  availableStock: number;
  unavailableReasonCode?: string | null;
  unavailableReason?: string | null;
  fulfillmentSourceId: string;
  lastOrderedAt?: string;
}

export interface QuickReorderSectionProps {
  reorderItems: QuickReorderItem[];
  onReorderItem?: (item: QuickReorderItem) => void;
  onReorderAll?: () => void;
  isLoading?: boolean;
}

export default function QuickReorderSection({
  reorderItems = [],
  onReorderItem,
  onReorderAll,
  isLoading = false,
}: QuickReorderSectionProps) {
  if (isLoading) {
    return (
      <section data-testid="quick-reorder-loading" style={{ padding: '1rem', color: '#64748B' }}>
        Loading previous order history...
      </section>
    );
  }

  if (!reorderItems || reorderItems.length === 0) {
    return (
      <section
        data-testid="quick-reorder-empty"
        style={{
          padding: '1.5rem',
          textAlign: 'center',
          backgroundColor: '#F8FAFC',
          borderRadius: '8px',
          color: '#64748B',
        }}
      >
        <p style={{ margin: 0, fontWeight: '600' }}>No previous orders found</p>
        <span style={{ fontSize: '0.875rem' }}>Items from past Quick-Commerce orders will appear here for fast 1-tap reordering.</span>
      </section>
    );
  }

  const availableItems = reorderItems.filter((i) => i.isAvailable);

  return (
    <section
      aria-label="Quick Reorder"
      data-testid="quick-reorder-section"
      style={{ margin: '1.5rem 0' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#0F172A' }}>
          Buy Again — Quick Reorder
        </h3>

        {onReorderAll && availableItems.length > 0 && (
          <button
            type="button"
            data-testid="reorder-all-btn"
            onClick={onReorderAll}
            style={{
              padding: '0.375rem 0.75rem',
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '0.8125rem',
              cursor: 'pointer',
            }}
          >
            Reorder All Available ({availableItems.length})
          </button>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {reorderItems.map((item) => (
          <div
            key={item.variantId}
            data-testid={`reorder-item-card-${item.variantId}`}
            style={{
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              backgroundColor: item.isAvailable ? '#FFFFFF' : '#F8FAFC',
              opacity: item.isAvailable ? 1 : 0.75,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9375rem', fontWeight: '600', color: '#1E293B' }}>
                {item.title}
              </h4>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span data-testid="current-price" style={{ fontWeight: '700', color: '#0F172A', fontSize: '1rem' }}>
                  {item.formattedCurrentPrice}
                </span>

                {item.historicalPriceMinor > 0 && Math.round(item.historicalPriceMinor) !== Math.round(item.currentPriceMinor) && (
                  <span style={{ fontSize: '0.75rem', color: '#64748B', textDecoration: 'line-through' }}>
                    was ${(item.historicalPriceMinor / 100).toFixed(2)}
                  </span>
                )}
              </div>

              {!item.isAvailable && (
                <span
                  data-testid="unavailable-reason-badge"
                  style={{
                    display: 'inline-block',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    backgroundColor: '#FEE2E2',
                    color: '#991B1B',
                    marginBottom: '0.5rem',
                  }}
                >
                  {item.unavailableReason || item.unavailableReasonCode || 'Unavailable'}
                </span>
              )}
            </div>

            <button
              type="button"
              data-testid={`quick-add-btn-${item.variantId}`}
              disabled={!item.isAvailable}
              onClick={() => onReorderItem && onReorderItem(item)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: item.isAvailable ? '#0F172A' : '#CBD5E1',
                color: item.isAvailable ? '#FFFFFF' : '#64748B',
                fontWeight: '600',
                fontSize: '0.8125rem',
                cursor: item.isAvailable ? 'pointer' : 'not-allowed',
                marginTop: '0.5rem',
              }}
            >
              {item.isAvailable ? '+ Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
