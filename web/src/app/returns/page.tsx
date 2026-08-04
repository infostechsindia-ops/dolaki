'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiRotateCcw, FiShield, FiTruck, FiCreditCard } from 'react-icons/fi';
import styles from './page.module.css';

interface ReturnRequest {
  id: string;
  date: string;
  orderId: string;
  status: string;
  amount: number;
  item: string;
}

const mockReturns: ReturnRequest[] = [
  { id: 'RET-736', date: 'June 10, 2026', orderId: 'AM-76291', status: 'Refund Completed', amount: 2499, item: 'Modern Loop Brass Table Lamp' }
];

export default function ReturnsRefundsPage() {
  const [returnHistory, setReturnHistory] = useState<ReturnRequest[]>(mockReturns);
  const [returnOrderId, setReturnOrderId] = useState('AM-87361');
  const [returnReason, setReturnReason] = useState('Item damaged');
  const [returnDesc, setReturnDesc] = useState('');

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRet = {
      id: `RET-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      orderId: returnOrderId,
      status: 'Pickup Scheduled',
      amount: returnOrderId === 'AM-87361' ? 8999 : 548,
      item: returnOrderId === 'AM-87361' ? 'AuraPods Pro ANC Earbuds' : 'Organic Whole Wheat Atta 5kg'
    };
    setReturnHistory([newRet, ...returnHistory]);
    setReturnDesc('');
    alert('🎉 Return request submitted successfully! Pickup will be scheduled.');
  };

  return (
    <div className={styles.returnsPage}>
      {/* Top Header */}
      <div className={styles.topHeader}>
        <div className="container">
          <Link href="/" className={styles.backBtn}>
            <FiChevronLeft /> Back to Shopping
          </Link>
          <div className={styles.titleSec}>
            <h1>🔁 Returns & Refunds Portal</h1>
            <p>File easy return requests for your standard and Flado purchases. Track refund status in real-time.</p>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '35px' }}>
        <div className={styles.returnsGrid}>
          
          {/* Main Return Form panel */}
          <div className={styles.formCol}>
            <form onSubmit={handleReturnSubmit} className={styles.returnForm}>
              <h2>File a Return Request</h2>
              <p>Pick a recent delivery to start. Pickup will be completed within 24 hours of approval.</p>
              
              <div className={styles.formGroup}>
                <label>Select Active Order ID</label>
                <select value={returnOrderId} onChange={(e) => setReturnOrderId(e.target.value)} className={styles.formInput}>
                  <option value="AM-87361">Order #AM-87361 (AuraPods Pro ANC Earbuds)</option>
                  <option value="AM-98274">Order #AM-98274 (Organic Wheat Atta & Avocado)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Reason for Return</label>
                <select value={returnReason} onChange={(e) => setReturnReason(e.target.value)} className={styles.formInput}>
                  <option value="Item damaged">Item damaged / defective on delivery</option>
                  <option value="Wrong size">Wrong size / color delivered</option>
                  <option value="Quality poor">Product quality poor / expired</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Elaborate reason details</label>
                <textarea 
                  value={returnDesc} 
                  onChange={(e) => setReturnDesc(e.target.value)} 
                  placeholder="Tell us more about the issue..." 
                  className={styles.formTextarea} 
                />
              </div>

              <button type="submit" className={styles.submitReturnBtn}>Submit Return Request</button>
            </form>

            {/* Return History */}
            <div className={styles.historySection}>
              <h2>Return History & Status</h2>
              <div className={styles.historyList}>
                {returnHistory.map(ret => (
                  <div key={ret.id} className={styles.returnHistoryCard}>
                    <div className={styles.cardHeader}>
                      <strong>Return ID: {ret.id}</strong>
                      <span className={styles.statusBadge}>{ret.status}</span>
                    </div>
                    <p className={styles.itemName}>Product: {ret.item}</p>
                    <div className={styles.cardFooter}>
                      <span>Date filed: {ret.date}</span>
                      <span>Refund amount: <strong>₹{ret.amount.toLocaleString('en-IN')}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Guidelines Panel */}
          <aside className={styles.sidebarCol}>
            <div className={styles.policyCard}>
              <h3>AuraMart Return Policies</h3>
              
              <div className={styles.policyItem}>
                <FiShield className={styles.policyIcon} />
                <div>
                  <h4>10-Day Easy Returns</h4>
                  <p>Standard catalog products can be returned/replaced within 10 days of delivery.</p>
                </div>
              </div>

              <div className={styles.policyItem}>
                <FiTruck className={styles.policyIcon} />
                <div>
                  <h4>Free Pickup service</h4>
                  <p>Our rider collects the return pack directly from your shipping address without fee.</p>
                </div>
              </div>

              <div className={styles.policyItem}>
                <FiCreditCard className={styles.policyIcon} />
                <div>
                  <h4>Instant AuraPay Refunds</h4>
                  <p>Funds are credited directly to your reward wallet immediately after pickup verification.</p>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
