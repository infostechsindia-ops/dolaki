'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReturn, setShowReturn] = useState(false);
  const [returnReason, setReturnReason] = useState('Damaged');
  const [returnDesc, setReturnDesc] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('aura_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:3000/orders/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        } else {
          mockOrder();
        }
      } catch (e) {
        mockOrder();
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [params.id, router]);

  const mockOrder = () => {
    setOrder({
      id: params.id,
      date: '2026-07-15',
      status: 'DELIVERED',
      items: [
        { name: 'AuraPods Pro ANC Earbuds', qty: 1, unitPrice: 8999, subtotal: 8999 }
      ],
      subtotal: 8999,
      delivery: 50,
      discount: 200,
      total: 8849,
      shippingAddress: 'Apt 402, Sea Green Apartments, Carter Road, Bandra West, Mumbai, 400050'
    });
  };

  const handleReturn = async () => {
    try {
      await fetch(`http://localhost:3000/orders/${params.id}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: returnReason, description: returnDesc })
      });
      alert('Return requested successfully!');
      setShowReturn(false);
    } catch(e) {
      alert('Failed to request return. Try again later.');
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!order) return <div className={styles.loading}>Order not found.</div>;

  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.breadcrumb}>
        <Link href="/">Home</Link> &gt; <Link href="/orders">Orders</Link> &gt; Order #{order.id}
      </div>
      
      <div className={styles.header}>
        <div>
          <h1>Order #{order.id}</h1>
          <p>Placed on {order.date}</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.invoiceBtn} onClick={() => alert('Invoice download coming soon')}>
            Download Invoice
          </button>
        </div>
      </div>

      <div className={styles.timeline}>
        {['PLACED', 'PREPARING', 'SHIPPED', 'DELIVERED'].map((step, idx) => (
          <div key={step} className={`${styles.step} ${order.status === step || order.status === 'DELIVERED' ? styles.stepActive : ''}`}>
            <div className={styles.stepCircle}>{idx + 1}</div>
            <span>{step}</span>
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        <div className={styles.mainCol}>
          <div className={styles.card}>
            <h3>Items</h3>
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item: any, i: number) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>₹{item.unitPrice}</td>
                    <td>₹{item.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {order.status === 'DELIVERED' && (
            <div className={styles.card}>
              <div className={styles.returnHeader}>
                <h3>Need to return an item?</h3>
                <button onClick={() => setShowReturn(!showReturn)} className={styles.returnBtn}>Request Return</button>
              </div>
              
              {showReturn && (
                <div className={styles.returnForm}>
                  <select value={returnReason} onChange={e => setReturnReason(e.target.value)} className={styles.input}>
                    <option value="Damaged">Damaged</option>
                    <option value="Wrong Item">Wrong Item</option>
                    <option value="Not as Described">Not as Described</option>
                    <option value="Changed Mind">Changed Mind</option>
                  </select>
                  <textarea value={returnDesc} onChange={e => setReturnDesc(e.target.value)} placeholder="Description" className={styles.input} rows={3}></textarea>
                  <button onClick={handleReturn} className={styles.submitReturnBtn}>Submit</button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className={styles.sideCol}>
          <div className={styles.card}>
            <h3>Order Summary</h3>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Delivery</span>
              <span>₹{order.delivery}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Discount</span>
              <span className={styles.discount}>-₹{order.discount}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>₹{order.total}</span>
            </div>
          </div>
          
          <div className={styles.card}>
            <h3>Shipping Address</h3>
            <p className={styles.addressText}>{order.shippingAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
