'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/config';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import OrderTimeline from '@/components/orders/OrderTimeline';
import styles from './page.module.css';

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();

  const [tracking, setTracking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('aura_token') : null;
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const fetchTracking = async () => {
      setError('');
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/orders/${params.id}/tracking`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setTracking(data);
        } else {
          setError(`Unable to load tracking details (Server status: ${res.status}).`);
        }
      } catch (e) {
        setError('Connection error — failed to contact tracking service.');
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px 16px', textAlign: 'center' }} data-testid="tracking-loading">
        Loading live tracking status...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '40px 16px', color: '#B91C1C' }} role="alert">
        {error}
      </div>
    );
  }

  if (!tracking) {
    return (
      <div className="container" style={{ padding: '40px 16px', textAlign: 'center' }} data-testid="tracking-empty">
        Tracking information is not available yet.
      </div>
    );
  }

  const isFlado = tracking.surface === 'QUICK_COMMERCE';
  const formattedEvents = (tracking.events || []).map((evt: any, idx: number) => ({
    id: evt.id || `evt-${idx}`,
    title: evt.statusText || evt.type,
    description: evt.description || undefined,
    timestamp: evt.occurredAt ? new Date(evt.occurredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
    isCompleted: true,
    isCurrent: idx === (tracking.events.length - 1),
  }));

  return (
    <div
      className={`container ${styles.container}`}
      style={{ padding: '32px 16px', maxWidth: '800px', margin: '0 auto' }}
      data-testid="order-tracking-page"
    >
      <nav aria-label="Breadcrumb" style={{ marginBottom: '16px', fontSize: '14px', color: '#64748B' }}>
        <Link href="/">Home</Link> &gt; <Link href="/orders">Orders</Link> &gt; <Link href={`/orders/${params.id}`}>Order #{tracking.orderNumber}</Link> &gt; Tracking
      </nav>

      {/* Single H1 on the page */}
      <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: isFlado ? '#059669' : '#4F46E5' }}>
            {isFlado ? '⚡ Quick-Commerce Track (Flado)' : '📦 Marketplace Shipment Track (AuraMart)'}
          </span>
          <h1 style={{ margin: '4px 0 0', fontSize: '24px', color: '#0F172A' }}>
            Tracking for Order #{tracking.orderNumber}
          </h1>
        </div>
        <OrderStatusBadge status={tracking.currentStatus} />
      </header>

      {/* Delivery ETA Card */}
      <section style={{ backgroundColor: isFlado ? '#ECFDF5' : '#EEF2FF', border: `1px solid ${isFlado ? '#A7F3D0' : '#C7D2FE'}`, borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', color: isFlado ? '#065F46' : '#3730A3', fontWeight: 600, textTransform: 'uppercase' }}>Delivery Promise</div>
        <div style={{ fontSize: '20px', fontWeight: 700, color: isFlado ? '#047857' : '#312E81', marginTop: '4px' }} data-testid="tracking-eta-text">
          {tracking.estimatedDeliveryText}
        </div>
      </section>

      {/* Sanitized Rider Info (Flado Quick Commerce) */}
      {tracking.rider && (
        <section style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', marginBottom: '24px', backgroundColor: '#FFFFFF' }} data-testid="tracking-rider-card">
          <h2 style={{ fontSize: '16px', margin: '0 0 8px', color: '#1E293B' }}>Assigned Delivery Partner</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🛵</div>
            <div>
              <div style={{ fontWeight: 600, color: '#0F172A' }} data-testid="rider-display-name">{tracking.rider.displayName}</div>
              <div style={{ fontSize: '13px', color: '#64748B' }}>Vehicle: {tracking.rider.vehicleType}</div>
            </div>
          </div>
        </section>
      )}

      {/* Carrier Shipment Info (Marketplace) */}
      {tracking.shipment && (
        <section style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', marginBottom: '24px', backgroundColor: '#FFFFFF' }} data-testid="tracking-shipment-card">
          <h2 style={{ fontSize: '16px', margin: '0 0 8px', color: '#1E293B' }}>Shipment Details</h2>
          <div style={{ fontSize: '14px', color: '#334155' }}>
            <div><strong>Carrier:</strong> <span data-testid="carrier-name">{tracking.shipment.carrierName}</span></div>
            <div><strong>Tracking Number:</strong> <span data-testid="carrier-tracking-number">{tracking.shipment.trackingNumber}</span></div>
          </div>
        </section>
      )}

      {/* Authoritative Timeline */}
      <section style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px', backgroundColor: '#FFFFFF' }}>
        {formattedEvents.length > 0 ? (
          <OrderTimeline events={formattedEvents} title="Status Events" />
        ) : (
          <div style={{ textAlign: 'center', color: '#64748B', padding: '20px' }}>
            No status events recorded yet.
          </div>
        )}
      </section>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button
          onClick={() => router.push(`/orders/${params.id}`)}
          style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#334155', fontWeight: 500, cursor: 'pointer', minHeight: '44px' }}
          data-testid="back-to-order-btn"
        >
          View Full Order Details
        </button>
      </div>
    </div>
  );
}
