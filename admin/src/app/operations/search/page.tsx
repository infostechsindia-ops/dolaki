'use client';

import React, { useState } from 'react';
import { Search, Users, ShoppingBag, Star, TrendingUp, ArrowUpRight } from 'lucide-react';
import styles from '../../crud.module.css';

const SEARCH_INDEX = [
  { type: 'Customer', icon: '👤', id: 'USR-48291', label: 'Priya Sharma', meta: 'priya.sharma@email.com • VIP Gold • CLV ₹82,400' },
  { type: 'Customer', icon: '👤', id: 'USR-48390', label: 'Mohammed Al-Rashid', meta: 'rashid@email.ae • Premium • CLV ₹41,200' },
  { type: 'Order', icon: '📦', id: 'ORD-2026-94821', label: 'Order #94821', meta: '₹2,840 • Delivered • Priya Sharma' },
  { type: 'Order', icon: '📦', id: 'ORD-2026-94819', label: 'Order #94819', meta: '₹8,200 • Processing • Rohit Verma' },
  { type: 'Vendor', icon: '🏪', id: 'VND-1024', label: 'TechZone Electronics', meta: 'Rating 4.6 • 2,841 orders this month' },
  { type: 'Product', icon: '🛒', id: 'PRD-88421', label: 'Samsung Galaxy S25 Ultra', meta: 'Electronics • ₹1,09,999 • 284 in stock' },
  { type: 'Brand', icon: '🏷️', id: 'BRN-042', label: 'Samsung', meta: '1,284 active products' },
  { type: 'Rider', icon: '🛵', id: 'RDR-2841', label: 'Suresh Kumar', meta: 'Active • Zone 4, Bangalore • 284 deliveries today' },
  { type: 'Darkstore', icon: '🏭', id: 'DS-BLR-04', label: 'Flado Bangalore Koramangala', meta: '12 active orders • SLA 98.4% • 420 SKUs' },
  { type: 'Ticket', icon: '🎫', id: 'TKT-28491', label: 'Support Ticket #28491', meta: 'Open • Refund Issue • Priya Sharma' },
  { type: 'Refund', icon: '↩️', id: 'RFD-8421', label: 'Refund #8421', meta: '₹2,840 • Pending • Order #94812' },
  { type: 'Campaign', icon: '📣', id: 'CMP-084', label: 'Independence Day Flash Sale', meta: 'Active • 84,200 reach • ₹4.2L revenue' },
  { type: 'Warehouse', icon: '🏬', id: 'WH-HYD-01', label: 'AuraMart Hyderabad Central', meta: '84% utilization • 1.2M sq ft • 84,000 SKUs' },
  { type: 'Category', icon: '📂', id: 'CAT-012', label: 'Smartphones', meta: '4,821 active products • Electronics > Smartphones' },
];

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  Customer: { bg: '#EDE9FE', color: '#7C3AED' },
  Order: { bg: '#DBEAFE', color: '#1D4ED8' },
  Vendor: { bg: '#D1FAE5', color: '#065F46' },
  Product: { bg: '#FEF3C7', color: '#92400E' },
  Brand: { bg: '#FCE7F3', color: '#9D174D' },
  Rider: { bg: '#FEE2E2', color: '#991B1B' },
  Darkstore: { bg: '#E0F2FE', color: '#0369A1' },
  Ticket: { bg: '#FFF7ED', color: '#C2410C' },
  Refund: { bg: '#FEF2F2', color: '#DC2626' },
  Campaign: { bg: '#F3F4F6', color: '#374151' },
  Warehouse: { bg: '#ECFDF5', color: '#064E3B' },
  Category: { bg: '#F5F3FF', color: '#4C1D95' },
};

export default function EnterpriseSearchPage() {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedResult, setSelectedResult] = useState<any | null>(null);

  const types = [...new Set(SEARCH_INDEX.map(r => r.type))];

  const results = SEARCH_INDEX.filter(r => {
    const matchQuery = query === '' || r.label.toLowerCase().includes(query.toLowerCase()) ||
      r.meta.toLowerCase().includes(query.toLowerCase()) ||
      r.id.toLowerCase().includes(query.toLowerCase());
    const matchType = selectedType === null || r.type === selectedType;
    return matchQuery && matchType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h2 className={styles.title}>Enterprise Operations Search</h2>
          <p className={styles.subtitle}>Global search across customers, orders, vendors, products, riders, warehouses, darkstores, and campaigns.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {[
          { label: 'Indexed Customers', value: '892,431', icon: <Users size={22} /> },
          { label: 'Indexed Orders', value: '4.2M', icon: <ShoppingBag size={22} /> },
          { label: 'Indexed Products', value: '42,841', icon: <Star size={22} /> },
          { label: 'Search Queries Today', value: '18,420', icon: <TrendingUp size={22} /> },
        ].map((s, i) => (
          <div key={i} className={styles.metricCard}>
            <div className={styles.metricInfo}>
              <span className={styles.metricLabel}>{s.label}</span>
              <span className={styles.metricValue}>{s.value}</span>
            </div>
            <div className={styles.metricIcon}>{s.icon}</div>
          </div>
        ))}
      </div>

      {/* Search Interface */}
      <div className={styles.tableCard}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div className={styles.searchBar} style={{ flex: 1, minWidth: '300px' }}>
            <Search size={16} />
            <input
              className={styles.searchInput}
              placeholder="Search orders, customers, vendors, products, riders, darkstores..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Type Filter Chips */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setSelectedType(null)}
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              border: '1px solid',
              borderColor: selectedType === null ? '#7C3AED' : '#E5E7EB',
              background: selectedType === null ? '#7C3AED' : 'white',
              color: selectedType === null ? 'white' : '#374151',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            All ({SEARCH_INDEX.length})
          </button>
          {types.map(type => {
            const colors = TYPE_COLORS[type] || { bg: '#F3F4F6', color: '#374151' };
            const count = SEARCH_INDEX.filter(r => r.type === type).length;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(selectedType === type ? null : type)}
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  border: '1px solid',
                  borderColor: selectedType === type ? colors.color : '#E5E7EB',
                  background: selectedType === type ? colors.bg : 'white',
                  color: selectedType === type ? colors.color : '#374151',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {type} ({count})
              </button>
            );
          })}
        </div>

        {/* Results */}
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>
                <Search size={48} style={{ margin: '0 auto 1rem' }} />
                <p>No results found for "{query}"</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '0.25rem' }}>{results.length} results</p>
                {results.map(r => {
                  const colors = TYPE_COLORS[r.type] || { bg: '#F3F4F6', color: '#374151' };
                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedResult(r)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.875rem 1rem',
                        background: selectedResult?.id === r.id ? '#F5F3FF' : '#F9FAFB',
                        border: `1px solid ${selectedResult?.id === r.id ? '#7C3AED' : '#E5E7EB'}`,
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      <span style={{ fontSize: '1.25rem' }}>{r.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.label}</span>
                          <span style={{
                            padding: '0.1rem 0.5rem',
                            borderRadius: '999px',
                            background: colors.bg,
                            color: colors.color,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                          }}>{r.type}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '0.1rem' }}>{r.meta}</div>
                      </div>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#9CA3AF' }}>{r.id}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detail Panel */}
          {selectedResult && (
            <div style={{ width: '280px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem', flexShrink: 0 }}>
              <div style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '0.75rem' }}>{selectedResult.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', textAlign: 'center', marginBottom: '0.5rem' }}>{selectedResult.label}</h3>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <span style={{
                  padding: '0.2rem 0.75rem',
                  borderRadius: '999px',
                  background: (TYPE_COLORS[selectedResult.type] || { bg: '#F3F4F6' }).bg,
                  color: (TYPE_COLORS[selectedResult.type] || { color: '#374151' }).color,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}>{selectedResult.type}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '1rem', lineHeight: 1.6 }}>{selectedResult.meta}</div>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF', fontFamily: 'monospace', marginBottom: '1.5rem' }}>{selectedResult.id}</div>
              <button className={styles.actionBtn} style={{ width: '100%', background: '#7C3AED', color: 'white', border: 'none', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <ArrowUpRight size={14} /> Open Record
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
