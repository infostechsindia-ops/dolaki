'use client';

import React, { useState } from 'react';
import { Shield, AlertTriangle, AlertCircle, Eye, Ban, CheckCircle, Search, Clock } from 'lucide-react';
import styles from '../../crud.module.css';

export default function FraudAndRiskCenter() {
  const [activeTab, setActiveTab] = useState('suspicious_orders');
  const [searchQuery, setSearchQuery] = useState('');

  const summaryKPIs = [
    { label: 'Suspicious Orders Today', value: '23', trend: '+12%', isUp: true, icon: AlertTriangle },
    { label: 'Refund Abuse Cases', value: '8', trend: '-2%', isUp: false, icon: AlertCircle },
    { label: 'Coupon Abuse Alerts', value: '15', trend: '+5%', isUp: true, icon: Shield },
    { label: 'High-Risk Accounts', value: '42', trend: '+8%', isUp: true, icon: Ban },
  ];

  const suspiciousOrders = [
    { id: 'ORD-8921', customer: 'john.doe@example.com', amount: '₹45,000', riskScore: 'High', scoreVal: 92, flags: ['Multiple Devices', 'VPN Detected'], status: 'Pending Review' },
    { id: 'ORD-8922', customer: 'alice.m@example.com', amount: '₹12,500', riskScore: 'Medium', scoreVal: 75, flags: ['Rapid Orders', 'New Account'], status: 'Pending Review' },
    { id: 'ORD-8923', customer: 'suspicious.user@mail.com', amount: '₹1,20,000', riskScore: 'High', scoreVal: 98, flags: ['Card Mismatch', 'High Value', 'VPN Detected'], status: 'Pending Review' },
    { id: 'ORD-8924', customer: 'bob.builder@example.com', amount: '₹3,200', riskScore: 'Medium', scoreVal: 68, flags: ['Different Shipping/Billing'], status: 'Pending Review' },
    { id: 'ORD-8925', customer: 'jane.smith@example.com', amount: '₹55,000', riskScore: 'High', scoreVal: 88, flags: ['Multiple Failed Cards'], status: 'Pending Review' },
    { id: 'ORD-8926', customer: 'scammer123@example.com', amount: '₹8,900', riskScore: 'Medium', scoreVal: 71, flags: ['Velocity Check Failed'], status: 'Pending Review' },
  ];

  const manualReviewQueue = [
    { id: 'REV-001', orderId: 'ORD-8910', priority: 'P1', assignedAgent: 'Unassigned', slaTimer: '14 mins left', reason: 'High-value electronics + new account' },
    { id: 'REV-002', orderId: 'ORD-8911', priority: 'P2', assignedAgent: 'Sarah J.', slaTimer: '45 mins left', reason: 'Address verification failed' },
    { id: 'REV-003', orderId: 'ORD-8912', priority: 'P1', assignedAgent: 'Mike T.', slaTimer: '2 mins left (CRITICAL)', reason: 'Known fraud ring pattern' },
    { id: 'REV-004', orderId: 'ORD-8913', priority: 'P3', assignedAgent: 'Unassigned', slaTimer: '3 hours left', reason: 'Unusual bulk purchase' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h1 className={styles.title}>Fraud & Risk Center</h1>
          <p className={styles.subtitle}>Monitor, review, and mitigate fraudulent activities</p>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        {summaryKPIs.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className={styles.metricCard}>
              <div className={styles.metricInfo}>
                <span className={styles.metricLabel}>{kpi.label}</span>
                <span className={styles.metricValue}>{kpi.value}</span>
                <span className={kpi.isUp ? styles.trendUp : styles.trendDown}>
                  {kpi.trend}
                </span>
              </div>
              <div className={styles.metricIcon}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', marginTop: '24px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className={styles.tableCard} style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: 0 }}>
            {['suspicious_orders', 'refund_abuse', 'coupon_abuse', 'manual_review'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '16px 24px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab ? '2px solid #2563eb' : '2px solid transparent',
                  color: activeTab === tab ? '#2563eb' : '#6b7280',
                  fontWeight: activeTab === tab ? 600 : 400,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableHeader} style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
              <h2 className={styles.tableTitle}>
                {activeTab === 'suspicious_orders' && 'Suspicious Orders'}
                {activeTab === 'refund_abuse' && 'Refund Abuse Cases'}
                {activeTab === 'coupon_abuse' && 'Coupon Abuse Alerts'}
                {activeTab === 'manual_review' && 'Manual Review Queue'}
              </h2>
              <div className={styles.searchBar}>
                <Search size={18} style={{ color: '#9ca3af', marginLeft: '12px' }} />
                <input
                  type="text"
                  placeholder="Search by ID or customer..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {activeTab === 'suspicious_orders' && (
              <div style={{ overflowX: 'auto' }}>
                <table className={styles.table}>
                  <thead className={styles.tableHead}>
                    <tr>
                      <th className={styles.tableCell}>Order ID</th>
                      <th className={styles.tableCell}>Customer</th>
                      <th className={styles.tableCell}>Amount</th>
                      <th className={styles.tableCell}>Risk Score</th>
                      <th className={styles.tableCell}>Flags</th>
                      <th className={styles.tableCell}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suspiciousOrders.filter(o => o.id.includes(searchQuery) || o.customer.includes(searchQuery)).map((order) => (
                      <tr key={order.id} className={styles.tableRow}>
                        <td className={styles.tableCell} style={{ fontWeight: 500 }}>{order.id}</td>
                        <td className={styles.tableCell}>{order.customer}</td>
                        <td className={styles.tableCell}>{order.amount}</td>
                        <td className={styles.tableCell}>
                          <span className={styles.statusBadge} style={{
                            backgroundColor: order.riskScore === 'High' ? '#fee2e2' : '#fef3c7',
                            color: order.riskScore === 'High' ? '#991b1b' : '#92400e',
                          }}>
                            {order.riskScore} ({order.scoreVal})
                          </span>
                        </td>
                        <td className={styles.tableCell}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {order.flags.map((flag, i) => (
                              <span key={i} style={{ fontSize: '12px', background: '#f3f4f6', padding: '2px 8px', borderRadius: '12px', color: '#4b5563' }}>
                                {flag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className={styles.tableCell}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className={styles.actionBtn} title="Review"><Eye size={16} /></button>
                            <button className={styles.actionBtn} style={{ color: '#16a34a' }} title="Approve"><CheckCircle size={16} /></button>
                            <button className={styles.actionBtn} style={{ color: '#dc2626' }} title="Block"><Ban size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'manual_review' && (
              <div style={{ overflowX: 'auto' }}>
                <table className={styles.table}>
                  <thead className={styles.tableHead}>
                    <tr>
                      <th className={styles.tableCell}>Review ID</th>
                      <th className={styles.tableCell}>Order ID</th>
                      <th className={styles.tableCell}>Priority</th>
                      <th className={styles.tableCell}>Reason</th>
                      <th className={styles.tableCell}>Assigned Agent</th>
                      <th className={styles.tableCell}>SLA Timer</th>
                      <th className={styles.tableCell}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {manualReviewQueue.map((review) => (
                      <tr key={review.id} className={styles.tableRow}>
                        <td className={styles.tableCell} style={{ fontWeight: 500 }}>{review.id}</td>
                        <td className={styles.tableCell}>{review.orderId}</td>
                        <td className={styles.tableCell}>
                          <span className={styles.statusBadge} style={{
                            backgroundColor: review.priority === 'P1' ? '#fee2e2' : review.priority === 'P2' ? '#fef3c7' : '#e0f2fe',
                            color: review.priority === 'P1' ? '#991b1b' : review.priority === 'P2' ? '#92400e' : '#0369a1',
                          }}>
                            {review.priority}
                          </span>
                        </td>
                        <td className={styles.tableCell}>{review.reason}</td>
                        <td className={styles.tableCell}>{review.assignedAgent}</td>
                        <td className={styles.tableCell}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: review.slaTimer.includes('CRITICAL') ? '#dc2626' : '#d97706' }}>
                            <Clock size={14} />
                            <span style={{ fontSize: '13px', fontWeight: 500 }}>{review.slaTimer}</span>
                          </div>
                        </td>
                        <td className={styles.tableCell}>
                          <button className={styles.actionBtn} style={{ width: 'auto', padding: '6px 12px', background: '#2563eb', color: 'white', borderRadius: '6px' }}>
                            Start Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {(activeTab === 'refund_abuse' || activeTab === 'coupon_abuse') && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                <Shield size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <p>No active cases in this category at the moment.</p>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className={styles.tableCard} style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Fraud Prevention Stats</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#4b5563', fontSize: '14px' }}>Fraud prevented (Month)</span>
                <span style={{ fontWeight: 600, color: '#16a34a' }}>₹2.8M</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#4b5563', fontSize: '14px' }}>False positive rate</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>0.3%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#4b5563', fontSize: '14px' }}>Avg review time</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>4.2 min</span>
              </div>
            </div>
          </div>

          <div className={styles.tableCard} style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Risk Flags Legend</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#dc2626', marginTop: '4px', flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827', display: 'block' }}>High Risk (90-100)</span>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>Immediate block or priority review required.</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#d97706', marginTop: '4px', flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827', display: 'block' }}>Medium Risk (60-89)</span>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>Requires manual review within SLA.</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#16a34a', marginTop: '4px', flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827', display: 'block' }}>Low Risk (0-59)</span>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>Auto-approved unless triggered by rules.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
