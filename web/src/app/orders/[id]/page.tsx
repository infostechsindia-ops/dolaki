'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/config';
import { useCart } from '@/context/CartContext';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import OrderCancellationModal from '@/components/orders/OrderCancellationModal';
import OrderReturnModal from '@/components/orders/OrderReturnModal';
import styles from './page.module.css';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { refreshCart } = useCart();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('aura_token') : null;
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const fetchOrder = async () => {
      setError('');
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/orders/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        } else {
          if (res.status === 404) {
            setError('Order details not found (404).');
          } else {
            setError(`Unable to load order details (Server status: ${res.status}).`);
          }
        }
      } catch (e) {
        setError('Connection failure: Unable to contact order service. Please check if backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [params.id, router]);

  const handleReorder = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('aura_token') : null;
    if (!token || !order) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/orders/${order.id}/reorder`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (refreshCart) await refreshCart();
        setToastMessage(`Reordered ${data.addedItems?.length || 0} item(s) to your cart!`);
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        alert('Failed to reorder items.');
      }
    } catch (e) {
      alert('Error connecting to reorder service.');
    }
  };

  const handleDownloadInvoice = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('aura_token') : null;
    if (!token || !order) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/orders/${order.id}/invoice`, {
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

  if (loading) return <div className={styles.loading} data-testid="order-details-loading">Loading order details...</div>;
  if (error) return <div className={styles.loading} style={{ color: '#EF4444' }} role="alert">{error}</div>;
  if (!order) return <div className={styles.loading}>Order not found.</div>;

  let shippingAddressParsed: any = {};
  try {
    shippingAddressParsed = typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : order.shippingAddress || {};
  } catch (e) {}

  return (
    <div className={`container ${styles.container}`} data-testid="order-details-page">
      {toastMessage && (
        <div style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', fontWeight: 500 }} role="status">
          {toastMessage}
        </div>
      )}

      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link> &gt; <Link href="/orders">Orders</Link> &gt; Order #{order.orderNumber || order.id}
      </nav>

      {/* Single H1 on the page */}
      <div className={styles.header}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#0F172A' }}>
            Order #{order.orderNumber || order.id}
          </h1>
          <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '14px' }}>
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className={styles.headerActions} style={{ display: 'flex', gap: '8px' }}>
          <OrderStatusBadge status={order.status} />
          <button
            onClick={handleDownloadInvoice}
            style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#334155', fontWeight: 500, cursor: 'pointer' }}
            data-testid="invoice-details-btn"
          >
            Invoice
          </button>
          <button
            onClick={handleReorder}
            style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #6366F1', backgroundColor: '#EEF2FF', color: '#4F46E5', fontWeight: 500, cursor: 'pointer' }}
            data-testid="reorder-details-btn"
          >
            Reorder
          </button>
          {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && order.status !== 'RETURNED' && (
            <button
              onClick={() => setShowCancelModal(true)}
              style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2', color: '#B91C1C', fontWeight: 500, cursor: 'pointer' }}
              data-testid="cancel-order-details-btn"
            >
              Cancel Order
            </button>
          )}
          {order.status === 'DELIVERED' && (
            <button
              onClick={() => setShowReturnModal(true)}
              style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #818CF8', backgroundColor: '#EEF2FF', color: '#3730A3', fontWeight: 500, cursor: 'pointer' }}
              data-testid="return-order-details-btn"
            >
              Return / Replace
            </button>
          )}
          <button
            onClick={() => router.push(`/support?orderId=${order.id}`)}
            style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#64748B', cursor: 'pointer' }}
            data-testid="support-details-btn"
          >
            Support
          </button>
        </div>
      </div>

      <OrderCancellationModal
        isOpen={showCancelModal}
        orderId={order.id}
        orderNumber={order.orderNumber || order.id}
        onClose={() => setShowCancelModal(false)}
        onSuccess={(result) => {
          setOrder((prev: any) => ({ ...prev, status: result.orderStatus || 'CANCELLED' }));
          setToastMessage(`Order cancelled. Expected refund: ${result.formattedExpectedRefund}`);
          setTimeout(() => setToastMessage(null), 5000);
        }}
      />

      <OrderReturnModal
        isOpen={showReturnModal}
        orderId={order.id}
        orderNumber={order.orderNumber || order.id}
        onClose={() => setShowReturnModal(false)}
        onSuccess={(result) => {
          setToastMessage(`Return request submitted successfully (${result.resolutionChoice}).`);
          setTimeout(() => setToastMessage(null), 5000);
        }}
      />

      {/* Fulfillment Status Timeline */}
      <div className={styles.timeline} data-testid="order-timeline">
        {['PLACED', 'PREPARING', 'SHIPPED', 'DELIVERED'].map((step, idx) => {
          const isActive =
            order.status === step ||
            (order.status === 'DELIVERED' && step !== 'CANCELLED') ||
            (order.status === 'SHIPPED' && ['PLACED', 'PREPARING', 'SHIPPED'].includes(step)) ||
            (order.status === 'PREPARING' && ['PLACED', 'PREPARING'].includes(step));

          return (
            <div key={step} className={`${styles.step} ${isActive ? styles.stepActive : ''}`}>
              <div className={styles.stepCircle}>{idx + 1}</div>
              <span>{step}</span>
            </div>
          );
        })}
      </div>

      <div className={styles.grid}>
        <div className={styles.mainCol}>
          <div className={styles.card} data-testid="order-items-card">
            <h2 style={{ fontSize: '18px', margin: '0 0 16px', color: '#1E293B' }}>
              Ordered Items ({order.items?.length || 0})
            </h2>
            <table className={styles.itemsTable} style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E2E8F0', textTransform: 'uppercase', fontSize: '12px', color: '#64748B' }}>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Product</th>
                  <th style={{ textAlign: 'center', padding: '8px' }}>Qty</th>
                  <th style={{ textAlign: 'right', padding: '8px' }}>Unit Price</th>
                  <th style={{ textAlign: 'right', padding: '8px' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item: any, i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }} data-testid={`order-item-row-${item.id || i}`}>
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={item.image || '/placeholder.png'}
                            alt={item.title || 'Product'}
                            style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: '#0F172A' }}>{item.title}</div>
                            {item.variantTitle && <div style={{ fontSize: '12px', color: '#64748B' }}>Variant: {item.variantTitle}</div>}
                            {item.sku && <div style={{ fontSize: '12px', color: '#64748B' }}>SKU: {item.sku}</div>}
                            {item.substitutionPreference && (
                              <div style={{ fontSize: '11px', color: '#4F46E5', backgroundColor: '#EEF2FF', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>
                                Preference: {item.substitutionPreference}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', padding: '12px 8px', color: '#334155' }}>{item.quantity}</td>
                      <td style={{ textAlign: 'right', padding: '12px 8px', color: '#334155' }}>
                        ${((item.unitPriceMinor || (item.unitPrice ? item.unitPrice * 100 : 0)) / 100).toFixed(2)}
                      </td>
                      <td style={{ textAlign: 'right', padding: '12px 8px', fontWeight: 600, color: '#0F172A' }}>
                        ${((item.subtotalMinor || (item.subtotal ? item.subtotal * 100 : 0)) / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ padding: '16px', textAlign: 'center', color: '#64748B' }}>
                      {order.itemsSummary || 'Order items summary'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {order.status === 'DELIVERED' && (
            <div className={styles.card} data-testid="order-return-card">
              <div className={styles.returnHeader}>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#1E293B' }}>Need to return or replace an item?</h3>
                <button onClick={() => setShowReturnModal(true)} className={styles.returnBtn} data-testid="request-return-btn">Request Return / Replacement</button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.sideCol}>
          <div className={styles.card} data-testid="order-summary-card">
            <h2 style={{ fontSize: '18px', margin: '0 0 16px', color: '#1E293B' }}>Financial Summary</h2>
            <div className={styles.summaryRow}>
              <span>Items Subtotal</span>
              <span>${((order.itemsSubtotalMinor || 0) / 100).toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Delivery Fee</span>
              <span>${((order.feeAmountMinor || 0) / 100).toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Tax</span>
              <span>${((order.taxAmountMinor || 0) / 100).toFixed(2)}</span>
            </div>
            {order.discountAmountMinor > 0 && (
              <div className={styles.summaryRow}>
                <span>Discount</span>
                <span className={styles.discount}>-${(order.discountAmountMinor / 100).toFixed(2)}</span>
              </div>
            )}
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total Paid</span>
              <span data-testid="order-details-total">${((order.totalAmountMinor || (order.totalAmount ? order.totalAmount * 100 : 0)) / 100).toFixed(2)}</span>
            </div>
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', fontSize: '13px' }}>
              <div><strong>Payment Method:</strong> {order.paymentMethod || 'Online'}</div>
              <div><strong>Payment Status:</strong> {order.paymentStatus || 'PAID'}</div>
            </div>
          </div>

          <div className={styles.card} data-testid="order-address-card">
            <h2 style={{ fontSize: '18px', margin: '0 0 12px', color: '#1E293B' }}>Shipping Address</h2>
            {shippingAddressParsed.fullName && <div style={{ fontWeight: 600 }}>{shippingAddressParsed.fullName}</div>}
            <div>{shippingAddressParsed.line1 || shippingAddressParsed}</div>
            {shippingAddressParsed.line2 && <div>{shippingAddressParsed.line2}</div>}
            {shippingAddressParsed.city && <div>{shippingAddressParsed.city}, {shippingAddressParsed.pincode}</div>}
            {shippingAddressParsed.phone && <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Phone: {shippingAddressParsed.phone}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
