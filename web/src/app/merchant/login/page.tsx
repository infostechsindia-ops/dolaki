'use client';

import React from 'react';
import Link from 'next/link';
import { FiShoppingBag, FiArrowRight, FiZap } from 'react-icons/fi';

export default function MerchantLoginPage() {
  const vendorPortalUrl = process.env.NEXT_PUBLIC_VENDOR_PORTAL_URL || 'http://localhost:3002/login';

  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '100px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          backgroundColor: '#ECFDF5',
          color: '#059669',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          marginBottom: '16px'
        }}>
          <FiZap />
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '12px' }}>
          Flado Quick Commerce Merchant Access
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Manage your local darkstore inventory, 15-minute quick fulfillment queues, and instant rider dispatches.
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
        <a
          href={vendorPortalUrl}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#059669',
            color: '#FFFFFF',
            padding: '16px 36px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '1.05rem',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
          }}
        >
          Open Flado Merchant Dashboard <FiArrowRight />
        </a>

        <div style={{ marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Want to register a new darkstore location?{' '}
          <Link href="/merchant/apply" style={{ color: '#059669', fontWeight: 600, textDecoration: 'underline' }}>
            Apply for Flado Merchant Onboarding
          </Link>
        </div>
      </div>
    </div>
  );
}
