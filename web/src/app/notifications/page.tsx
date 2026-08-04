'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiBell, FiShoppingBag, FiTag, FiCreditCard, FiTrash2 } from 'react-icons/fi';
import styles from './page.module.css';

interface Notif {
  id: number;
  title: string;
  body: string;
  time: string;
  type: 'order' | 'deal' | 'system';
  read: boolean;
}

const mockNotifs: Notif[] = [
  { id: 1, title: '📦 Order Out For Delivery', body: 'Your Flado Express order #AM-98274 is out with courier Ramesh K. Share OTP: 7281 on arrival.', time: '2 hours ago', type: 'order', read: false },
  { id: 2, title: '🔥 Monsoon Mega Sale Live!', body: 'Up to 70% off on street styles + extra 15% code student discount is active. Browse catalog.', time: '5 hours ago', type: 'deal', read: false },
  { id: 3, title: '🪙 Daily Bonus Claimed', body: 'Checked in today! Successfully claimed +40 AuraCoins. Balance updated.', time: '1 day ago', type: 'system', read: true },
  { id: 4, title: '💳 Top-up Confirmation', body: 'Added ₹500 to AuraPay Wallet successfully via HDFC Bank Card ending 4522.', time: '2 days ago', type: 'system', read: true }
];

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notif[]>(mockNotifs);
  const [activeTab, setActiveTab] = useState<'all' | 'orders' | 'deals'>('all');

  const handleMarkAllRead = () => {
    setNotifs(notifs.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifs([]);
  };

  const filtered = notifs.filter(n => {
    if (activeTab === 'orders') return n.type === 'order';
    if (activeTab === 'deals') return n.type === 'deal';
    return true;
  });

  return (
    <div className={styles.notifPage}>
      {/* Top Header */}
      <div className={styles.topHeader}>
        <div className="container">
          <Link href="/" className={styles.backBtn}>
            <FiChevronLeft /> Back to Shopping
          </Link>
          <div className={styles.headerFlex}>
            <div className={styles.titleSec}>
              <h1>🔔 Alert Notifications Hub</h1>
              <p>Stay updated on order processing, special deal events, and wallet rewards details.</p>
            </div>
            {notifs.length > 0 && (
              <div className={styles.headerActions}>
                <button onClick={handleMarkAllRead} className={styles.actionBtn}>Mark All Read</button>
                <button onClick={handleClearAll} className={styles.clearBtn}><FiTrash2 /> Clear All</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '35px' }}>
        {/* Tab Filters */}
        <div className={styles.tabsRow}>
          <button onClick={() => setActiveTab('all')} className={`${styles.tabBtn} ${activeTab === 'all' ? styles.activeTab : ''}`}>All Alerts</button>
          <button onClick={() => setActiveTab('orders')} className={`${styles.tabBtn} ${activeTab === 'orders' ? styles.activeTab : ''}`}>Orders</button>
          <button onClick={() => setActiveTab('deals')} className={`${styles.tabBtn} ${activeTab === 'deals' ? styles.activeTab : ''}`}>Offers</button>
        </div>

        {/* Notifications list */}
        {filtered.length > 0 ? (
          <div className={styles.notifList}>
            {filtered.map(n => (
              <div key={n.id} className={`${styles.notifCard} ${!n.read ? styles.unreadCard : ''}`}>
                <div className={styles.cardHeader}>
                  <div className={styles.titleRow}>
                    {n.type === 'order' ? (
                      <FiShoppingBag className={styles.iconOrder} />
                    ) : n.type === 'deal' ? (
                      <FiTag className={styles.iconDeal} />
                    ) : (
                      <FiCreditCard className={styles.iconSystem} />
                    )}
                    <h3>{n.title}</h3>
                  </div>
                  <span className={styles.notifTime}>{n.time}</span>
                </div>
                <p className={styles.notifBody}>{n.body}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FiBell size={48} className={styles.emptyIcon} />
            <h3>No Alerts Found</h3>
            <p>You have cleared all alerts. Check back later for shipping updates and deals.</p>
          </div>
        )}
      </div>
    </div>
  );
}
