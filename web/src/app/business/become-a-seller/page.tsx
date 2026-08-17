'use client';

import React from 'react';
import Link from 'next/link';
import { FiStore, FiArrowRight, FiShield, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';

export default function BecomeASellerPage() {
  const vendorPortalUrl = process.env.NEXT_PUBLIC_VENDOR_PORTAL_URL || 'http://localhost:3002/login';

  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '100px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 16px',
          backgroundColor: '#EFF6FF',
          color: '#2563EB',
          borderRadius: '20px',
          fontWeight: 700,
          fontSize: '0.85rem',
          marginBottom: '12px'
        }}>
          <FiStore /> AuraMart Merchant Partner Program
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '12px' }}>
          Sell on AuraMart Marketplace
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
          Reach millions of active online shoppers across India. Enjoy low commission rates, automated payouts, and fast shipping logistics.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        <div style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <FiTrendingUp style={{ color: '#2563EB', fontSize: '32px', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', margin: '0 0 8px 0' }}>High Volume Traffic</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
            Expose your products to high-intent shoppers searching across electronics, fashion, beauty, home and groceries.
          </p>
        </div>

        <div style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <FiShield style={{ color: '#10B981', fontSize: '32px', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', margin: '0 0 8px 0' }}>Timely Bank Settlements</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
            Weekly automated GST-compliant payouts directly into your registered merchant bank account.
          </p>
        </div>

        <div style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <FiCheckCircle style={{ color: '#7C3AED', fontSize: '32px', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', margin: '0 0 8px 0' }}>Fulfillment Network</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
            Leverage AuraMart Express delivery network or fulfill directly from your store warehouse.
          </p>
        </div>
      </div>

      <div style={{
        backgroundColor: '#F8FAFC',
        borderRadius: '20px',
        padding: '48px',
        textAlign: 'center',
        border: '1px solid var(--border)'
      }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>
          Ready to Grow Your Business?
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '28px', maxWidth: '500px', margin: '0 auto 28px auto' }}>
          Registration takes less than 5 minutes. Prepare your GSTIN, PAN, and active bank account details.
        </p>

        <a
          href={vendorPortalUrl}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            padding: '16px 36px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '1.05rem',
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
          }}
        >
          Register as Seller Now <FiArrowRight />
        </a>
      </div>
    </div>
  );
}
