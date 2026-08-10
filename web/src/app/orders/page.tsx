'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_BASE_URL } from '@/lib/config';
import { useCart } from '@/context/CartContext';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import OrderActions from '@/components/orders/OrderActions';
import styles from './page.module.css';

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshCart } = useCart();

  const [orders, setOrders] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({
    totalOrders: 0,
    activeOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('aura_token') : null;
    if (!token) {
      router.push('/auth/login');
      return;
    }

    setError('');
    setLoading(true);
    try {
      // 1. Fetch Summary Counts
      const summaryRes = await fetch(`${API_BASE_URL}/api/v1/orders/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (summaryRes.ok) {
        const summaryData = await summaryRes.json();
        setSummary(summaryData);
      }

      // 2. Fetch Filtered / Searched Orders
      const queryParts = [];
      if (filter && filter !== 'ALL') queryParts.push(`status=${encodeURIComponent(filter)}`);
      if (search && search.trim() !== '') queryParts.push(`search=${encodeURIComponent(search.trim())}`);
      const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

      const res = await fetch(`${API_BASE_URL}/api/v1/orders${queryString}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data.data || []);
      } else {
        setError(`Unable to load orders (Server status: ${res.status}).`);
      }
    } catch (err) {
      setError('Connection failure: Unable to contact order service. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  }, [filter, search, router]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleReorder = async (orderId: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('aura_token') : null;
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/reorder`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (refreshCart) await refreshCart();
        setToastMessage(`Reordered ${data.addedItems?.length || 0} item(s) to your cart!`);
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        alert('Failed to reorder items. Please try again.');
      }
    } catch (e) {
      alert('Error connecting to reorder service.');
    }
  };

  const handleDownloadInvoice = async (orderId: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('aura_token') : null;
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/invoice`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const invoiceData = await res.json();
        const win = window.open('', '_blank');
        if (win) {
          win.document.write(invoiceData.htmlContent);
          win.document.close();
        }
      } else {
        alert('Invoice generation failed.');
      }
    } catch (e) {
      alert('Could not download invoice.');
    }
  };

  const handleSupport = (orderId: string) => {
    router.push(`/support?orderId=${orderId}`);
  };

  return (
    <div className={`container ${styles.container}`} data-testid="orders-history-page">
      {toastMessage && (
        <div style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', fontWeight: 500 }} role="status">
          {toastMessage}
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: '#FEF2F2', color: '#B91C1C', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', borderLeft: '4px solid #EF4444' }} role="alert">
          {error}
        </div>
      )}

      <h1>Your Order History</h1>

      {/* Authoritative Order Status Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Total Orders</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#1E293B' }} data-testid="summary-total-orders">{summary.totalOrders}</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#EFF6FF', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
          <span style={{ fontSize: '12px', color: '#1E40AF', fontWeight: 600, textTransform: 'uppercase' }}>Active</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#1D4ED8' }} data-testid="summary-active-orders">{summary.activeOrders}</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#ECFDF5', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
          <span style={{ fontSize: '12px', color: '#065F46', fontWeight: 600, textTransform: 'uppercase' }}>Delivered</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#047857' }} data-testid="summary-delivered-orders">{summary.deliveredOrders}</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#FEF2F2', borderRadius: '8px', border: '1px solid #FECACA' }}>
          <span style={{ fontSize: '12px', color: '#991B1B', fontWeight: 600, textTransform: 'uppercase' }}>Cancelled</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#B91C1C' }} data-testid="summary-cancelled-orders">{summary.cancelledOrders}</div>
        </div>
      </div>

      {/* Control Bar: Search & Status Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Orders' },
            { id: 'PLACED', label: 'Placed' },
            { id: 'PREPARING', label: 'Preparing' },
            { id: 'SHIPPED', label: 'Shipped' },
            { id: 'DELIVERED', label: 'Delivered' },
            { id: 'CANCELLED', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: filter === tab.id ? '2px solid #6366F1' : '1px solid #E2E8F0',
                backgroundColor: filter === tab.id ? '#EEF2FF' : '#FFFFFF',
                color: filter === tab.id ? '#4F46E5' : '#475569',
                fontWeight: filter === tab.id ? 600 : 400,
                cursor: 'pointer',
              }}
              data-testid={`filter-tab-${tab.id.toLowerCase()}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ minWidth: '240px' }}>
          <input
            type="text"
            placeholder="Search by order # or item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 14px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px' }}
            data-testid="order-search-input"
          />
        </div>
      </div>

      {/* Orders List / Loading / Empty State */}
      {loading ? (
        <div className={styles.loading} data-testid="orders-loading-skeleton">Loading order history...</div>
      ) : orders.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} data-testid="orders-history-list">
          {orders.map((order) => (
            <article key={order.id} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px', backgroundColor: '#FFFFFF' }} data-testid={`order-card-${order.id}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#0F172A' }}>
                    Order #{order.orderNumber || order.id}
                  </h3>
                  <span style={{ fontSize: '13px', color: '#64748B' }}>
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              {/* Items Thumbnails & Titles */}
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '12px' }}>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#F8FAFC', padding: '6px 12px', borderRadius: '6px', flexShrink: 0 }}>
                      <img
                        src={item.image || '/placeholder.png'}
                        alt={item.title || 'Product item'}
                        style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>{item.title}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Qty: {item.quantity}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <span style={{ fontSize: '13px', color: '#64748B' }}>{order.itemsSummary || 'Multiple items'}</span>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>Payment: </span>
                  <strong style={{ fontSize: '13px', color: '#1E293B' }}>{order.paymentStatus || 'COMPLETED'}</strong>
                  <span style={{ margin: '0 8px', color: '#CBD5E1' }}>|</span>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>Total: </span>
                  <strong style={{ fontSize: '15px', color: '#0F172A' }}>
                    ${((order.totalAmountMinor || (order.totalAmount ? order.totalAmount * 100 : 0)) / 100).toFixed(2)}
                  </strong>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => router.push(`/orders/${order.id}`)}
                    style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#334155', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
                    data-testid={`view-details-${order.id}`}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleReorder(order.id)}
                    style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #6366F1', backgroundColor: '#EEF2FF', color: '#4F46E5', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
                    data-testid={`reorder-btn-${order.id}`}
                  >
                    Reorder
                  </button>
                  <button
                    onClick={() => handleDownloadInvoice(order.id)}
                    style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#334155', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
                    data-testid={`invoice-btn-${order.id}`}
                  >
                    Invoice
                  </button>
                  <button
                    onClick={() => handleSupport(order.id)}
                    style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#64748B', fontSize: '13px', cursor: 'pointer' }}
                    data-testid={`support-btn-${order.id}`}
                  >
                    Support
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState} data-testid="orders-empty-state">
          <div className={styles.emptyIllustration}>📦</div>
          <h3>No orders found</h3>
          <p>Looks like you haven't placed any orders matching your criteria.</p>
          <Link href="/" className={styles.shopBtn}>Start Shopping</Link>
        </div>
      )}
    </div>
  );
}
