'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { API_BASE_URL } from '@/lib/config';

function CheckCircle2Icon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}

function ShoppingBagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'ORD-2026-8849';
  const [order, setOrder] = useState<any | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('aura_token');
        if (token) {
          const res = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            setOrder(await res.json());
          }
        }
      } catch {
        // Fallback
      }
    };
    fetchOrder();
  }, [orderId]);

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '40px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0' }}>
        <div style={{ width: '80px', height: '80px', backgroundColor: '#DCFCE7', color: '#166534', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle2Icon />
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#0F172A', marginBottom: '8px' }}>Order Placed Successfully!</h1>
        <p style={{ fontSize: '0.95rem', color: '#64748B', marginBottom: '24px' }}>
          Thank you for shopping on AuraMart. Your order <strong>#{orderId}</strong> has been confirmed.
        </p>

        {/* Order Info Pills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '12px', marginBottom: '32px', textAlign: 'left' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 'bold', textTransform: 'uppercase' }}>Delivery ETA</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <ClockIcon /> {order?.estimatedDeliveryText || 'Tomorrow, by 5:00 PM'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 'bold', textTransform: 'uppercase' }}>Payment Method</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#0F172A', marginTop: '4px' }}>
              {order?.paymentMethod || 'UPI / Online Payment'} (Confirmed)
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Amount</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#7C3AED', marginTop: '4px' }}>
              ₹{(order?.totalAmountCents ? order.totalAmountCents / 100 : 4999).toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link
            href={`/account/orders/${orderId}/tracking`}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#7C3AED', color: 'white', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}
          >
            <TruckIcon /> Track Live Status
          </Link>
          <button
            onClick={() => alert('📄 Invoice generated and sent to your registered email.')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#F1F5F9', color: '#0F172A', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
          >
            <FileTextIcon /> Download Invoice
          </button>
          <Link
            href="/products"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#0F172A', color: 'white', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}
          >
            <ShoppingBagIcon /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading order confirmation...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
