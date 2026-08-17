'use client';

import React from 'react';
import Link from 'next/link';
import { FiStore, FiArrowRight, FiShield, FiTrendingUp, FiLock } from 'react-icons/fi';
import styles from '../../page.module.css';

export default function VendorLoginPage() {
  const vendorPortalUrl = process.env.NEXT_PUBLIC_VENDOR_PORTAL_URL || 'http://localhost:3002/login';

  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '100px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          backgroundColor: '#EFF6FF',
          color: '#2563EB',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          marginBottom: '16px'
        }}>
          <FiStore />
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '12px' }}>
          AuraMart Vendor Portal Access
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Access your merchant dashboard, catalog manager, live order dispatch queue, and financial payout ledger.
        </p>
      </div>

      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '40px',
        border: '1px solid var(--border)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
        textAlign: 'center'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px', textAlign: 'left' }}>
          <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
            <FiTrendingUp style={{ color: '#2563EB', fontSize: '24px', marginBottom: '8px' }} />
            <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>Live Sales & Analytics</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Real-time GMV metrics, order volumes and conversion rates.</p>
          </div>
          <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
            <FiShield style={{ color: '#10B981', fontSize: '24px', marginBottom: '8px' }} />
            <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>Verified Payouts</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Automated GST settlements directly to your registered bank account.</p>
          </div>
          <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
            <FiLock style={{ color: '#7C3AED', fontSize: '24px', marginBottom: '8px' }} />
            <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>Secure Portal</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Multi-factor authentication and staff role-based permissions.</p>
          </div>
        </div>

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
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
          }}
        >
          Launch Merchant Portal <FiArrowRight />
        </a>

        <div style={{ marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have a merchant account yet?{' '}
          <Link href="/sell" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'underline' }}>
            Register as a Seller
          </Link>
        </div>
      </div>
    </div>
  );
}
