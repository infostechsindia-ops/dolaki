'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function FladoOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('aura_user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  useEffect(() => {
    if (user?.phone) {
      // Mock Flado fetch
      setOrders([
        { id: 'FL-9912', shop: 'Flado Darkstore #4', time: '10 mins ago', items: 'Milk, Bread, Eggs', total: 240, status: 'DELIVERED' }
      ]);
    }
  }, [user]);

  if (!user?.phone) {
    return (
      <div className={`container ${styles.container}`}>
        <div className={styles.messageCard}>
          <h2>No Phone Linked</h2>
          <p>Please link a phone number to your profile or use the mobile app to view Flado orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.container}`}>
      <h1>Flado Quick Orders</h1>
      <div className={styles.list}>
        {orders.map(order => (
          <div key={order.id} className={styles.card}>
            <div className={styles.header}>
              <h3>{order.shop}</h3>
              <span className={styles.status}>{order.status}</span>
            </div>
            <p className={styles.items}>{order.items}</p>
            <div className={styles.footer}>
              <span>{order.time}</span>
              <span>₹{order.total}</span>
              <Link href={`/tracking/${order.id}`} className={styles.trackBtn}>Track</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
