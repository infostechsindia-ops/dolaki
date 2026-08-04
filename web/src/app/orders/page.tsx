'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const token = localStorage.getItem('aura_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:3000/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          mockOrders();
        }
      } catch (err) {
        mockOrders();
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [router]);

  const mockOrders = () => {
    setOrders([
      { id: '1001', date: '2026-07-15', itemsSummary: 'AuraPods Pro...', total: 8999, status: 'DELIVERED' },
      { id: '1002', date: '2026-07-18', itemsSummary: 'Organic Atta, Milk...', total: 548, status: 'SHIPPED' },
      { id: '1003', date: '2026-07-19', itemsSummary: 'Sneakers...', total: 2999, status: 'CANCELLED' }
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLACED': return '#3B82F6';
      case 'PREPARING': return '#F97316';
      case 'SHIPPED': return '#A855F7';
      case 'OUT_FOR_DELIVERY': return '#F59E0B';
      case 'DELIVERED': return '#10B981';
      case 'CANCELLED': return '#EF4444';
      case 'RETURNED': return '#9CA3AF';
      default: return '#000';
    }
  };

  const filteredOrders = orders.filter(o => {
    if (filter === 'All') return true;
    if (filter === 'Active') return ['PLACED', 'PREPARING', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(o.status);
    if (filter === 'Delivered') return o.status === 'DELIVERED';
    if (filter === 'Cancelled') return o.status === 'CANCELLED';
    return true;
  });

  return (
    <div className={`container ${styles.container}`}>
      <h1>Your Orders</h1>
      
      <div className={styles.tabs}>
        {['All', 'Active', 'Delivered', 'Cancelled'].map(f => (
          <button key={f} className={`${styles.tab} ${filter === f ? styles.activeTab : ''}`} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loading}>Loading orders...</div>
      ) : filteredOrders.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.date}</td>
                  <td>{order.itemsSummary}</td>
                  <td>₹{order.total}</td>
                  <td>
                    <span className={styles.badge} style={{ backgroundColor: getStatusColor(order.status) }}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <Link href={`/orders/${order.id}`} className={styles.viewBtn}>View Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIllustration}>📦</div>
          <h3>No orders found</h3>
          <p>Looks like you haven't placed any orders in this category.</p>
          <Link href="/" className={styles.shopBtn}>Start Shopping</Link>
        </div>
      )}
    </div>
  );
}
