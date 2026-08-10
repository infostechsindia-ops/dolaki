'use client';

import React, { useState } from 'react';
import styles from '../../crud.module.css';
import { 
  RotateCcw, 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  X, 
  ArrowUpRight, 
  Shield, 
  FileText, 
  Search 
} from 'lucide-react';

export default function RefundsPage() {
  const [activeTab, setActiveTab] = useState('refunds');

  const kpis = [
    { title: 'Total Refunds Today', value: '₹8.4L', info: '284 orders', trend: 'down', icon: <RotateCcw size={20} /> },
    { title: 'Pending Investigation', value: '42', info: 'Needs review', trend: 'up', icon: <Search size={20} /> },
    { title: 'Escalated Cases', value: '8', info: 'P1 & P2', trend: 'up', icon: <AlertCircle size={20} /> },
    { title: 'Avg Resolution Time', value: '18.4 hrs', info: 'SLA target: 24h', trend: 'down', icon: <Clock size={20} /> },
    { title: 'Chargeback Rate', value: '0.08%', info: 'Industry avg: 0.12%', trend: 'down', icon: <Shield size={20} /> }
  ];

  const refunds = [
    { id: 'ORD-12345', customer: 'Alice Smith', amount: '₹1,200', reason: 'Defective', date: '2026-08-08 10:30', status: 'Approved' },
    { id: 'ORD-12346', customer: 'Bob Jones', amount: '₹4,500', reason: 'Not as Described', date: '2026-08-08 09:15', status: 'Pending' },
    { id: 'ORD-12347', customer: 'Charlie Brown', amount: '₹850', reason: 'Damaged in Transit', date: '2026-08-08 08:45', status: 'Approved' },
    { id: 'ORD-12348', customer: 'Diana Prince', amount: '₹2,300', reason: 'Wrong Item', date: '2026-08-07 16:20', status: 'Rejected' },
    { id: 'ORD-12349', customer: 'Ethan Hunt', amount: '₹12,000', reason: 'Not Received', date: '2026-08-07 14:10', status: 'Pending' },
    { id: 'ORD-12350', customer: 'Fiona Gallagher', amount: '₹500', reason: 'Defective', date: '2026-08-07 11:05', status: 'Approved' },
    { id: 'ORD-12351', customer: 'George Miller', amount: '₹3,400', reason: 'Not as Described', date: '2026-08-06 15:30', status: 'Pending' },
    { id: 'ORD-12352', customer: 'Hannah Abbott', amount: '₹1,100', reason: 'Damaged in Transit', date: '2026-08-06 09:25', status: 'Rejected' },
  ];

  const escalations = [
    { id: 'ESC-001', priority: 'P1', customer: 'Isaac Newton', issue: 'Repeated defective items', daysOpen: 3, agent: 'Sarah J.', status: 'Investigating' },
    { id: 'ESC-002', priority: 'P2', customer: 'Jane Doe', issue: 'Refund not received after 10 days', daysOpen: 11, agent: 'Mike T.', status: 'Awaiting Finance' },
    { id: 'ESC-003', priority: 'P1', customer: 'Kevin Hart', issue: 'High-value missing package', daysOpen: 2, agent: 'Sarah J.', status: 'Contacting Courier' },
    { id: 'ESC-004', priority: 'P2', customer: 'Laura Croft', issue: 'Aggressive behavior on call', daysOpen: 1, agent: 'Manager', status: 'Reviewing call' },
    { id: 'ESC-005', priority: 'P1', customer: 'Mark Twain', issue: 'Fraudulent return suspected', daysOpen: 5, agent: 'Risk Team', status: 'Blocked account' },
  ];

  const chargebacks = [
    { id: 'CB-991', gateway: 'Stripe', amount: '₹5,000', orderId: 'ORD-11111', dueDate: '2026-08-15', status: 'Evidence Required' },
    { id: 'CB-992', gateway: 'Razorpay', amount: '₹12,500', orderId: 'ORD-11122', dueDate: '2026-08-12', status: 'Processing' },
    { id: 'CB-993', gateway: 'Stripe', amount: '₹8,200', orderId: 'ORD-11133', dueDate: '2026-08-10', status: 'Evidence Required' },
    { id: 'CB-994', gateway: 'PayPal', amount: '₹3,100', orderId: 'ORD-11144', dueDate: '2026-08-20', status: 'Under Review' },
  ];

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'approved': return <span className={`${styles.statusBadge} ${styles.approved}`} style={{backgroundColor: '#e6f4ea', color: '#1e8e3e', padding: '4px 8px', borderRadius: '4px'}}>Approved</span>;
      case 'pending': return <span className={`${styles.statusBadge} ${styles.pending}`} style={{backgroundColor: '#fef7e0', color: '#b06000', padding: '4px 8px', borderRadius: '4px'}}>Pending</span>;
      case 'rejected': return <span className={`${styles.statusBadge} ${styles.rejected}`} style={{backgroundColor: '#fce8e6', color: '#d93025', padding: '4px 8px', borderRadius: '4px'}}>Rejected</span>;
      case 'p1': return <span className={`${styles.statusBadge}`} style={{backgroundColor: '#fce8e6', color: '#d93025', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold'}}>P1</span>;
      case 'p2': return <span className={`${styles.statusBadge}`} style={{backgroundColor: '#fef7e0', color: '#b06000', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold'}}>P2</span>;
      default: return <span className={styles.statusBadge}>{status}</span>;
    }
  };

  const getSLABand = (daysOpen: number) => {
    if (daysOpen < 1) return { color: '#1e8e3e', text: '0-12hrs (Green)' }; // Simulating < 1 day as green
    if (daysOpen <= 2) return { color: '#f9ab00', text: '12-24hrs (Yellow)' }; // Simulating 1-2 days as yellow
    return { color: '#d93025', text: '24+hrs (Red)' };
  };

  return (
    <div style={{ padding: '24px' }}>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h1 className={styles.title}>Refund & Dispute Center</h1>
          <p className={styles.subtitle}>Manage refunds, returns, chargebacks, and escalations.</p>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        {kpis.map((kpi, idx) => (
          <div key={idx} className={styles.metricCard}>
            <div className={styles.metricIcon}>{kpi.icon}</div>
            <div className={styles.metricLabel}>{kpi.title}</div>
            <div className={styles.metricValue}>{kpi.value}</div>
            <div className={styles.metricInfo}>{kpi.info}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>
        {['Refund Dashboard', 'Return Dashboard', 'Chargeback Tracking', 'Escalations', 'Investigation Queue'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.split(' ')[0].toLowerCase())}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: activeTab === tab.split(' ')[0].toLowerCase() ? '#e8f0fe' : 'transparent',
              color: activeTab === tab.split(' ')[0].toLowerCase() ? '#1a73e8' : '#5f6368',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: activeTab === tab.split(' ')[0].toLowerCase() ? 'bold' : 'normal'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'refund' && (
        <>
          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            <div className={styles.tableCard} style={{ flex: 1, padding: '20px' }}>
               <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#202124' }}>Status Breakdown</h3>
               <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                 <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px' }}>
                      <span>Approved</span><span>68%</span>
                    </div>
                    <div style={{ height: '8px', background: '#e6f4ea', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '68%', height: '100%', background: '#1e8e3e' }}></div>
                    </div>
                 </div>
                 <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px' }}>
                      <span>Pending</span><span>24%</span>
                    </div>
                    <div style={{ height: '8px', background: '#fef7e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '24%', height: '100%', background: '#f9ab00' }}></div>
                    </div>
                 </div>
                 <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px' }}>
                      <span>Rejected</span><span>8%</span>
                    </div>
                    <div style={{ height: '8px', background: '#fce8e6', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '8%', height: '100%', background: '#d93025' }}></div>
                    </div>
                 </div>
               </div>
            </div>
          </div>
          
          <div className={styles.tableCard}>
            <div className={styles.tableHeader} style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between' }}>
              <h2 className={styles.tableTitle} style={{ margin: 0 }}>Refund Requests</h2>
              <div className={styles.searchBar}>
                <Search size={16} color="#5f6368" />
                <input type="text" placeholder="Search orders..." className={styles.searchInput} style={{ border: 'none', outline: 'none', marginLeft: '8px' }} />
              </div>
            </div>
            <table className={styles.table} style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead className={styles.tableHead}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: '#5f6368', fontWeight: 500 }}>Order ID</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: '#5f6368', fontWeight: 500 }}>Customer</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: '#5f6368', fontWeight: 500 }}>Amount</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: '#5f6368', fontWeight: 500 }}>Reason</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: '#5f6368', fontWeight: 500 }}>Requested Date</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: '#5f6368', fontWeight: 500 }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: '#5f6368', fontWeight: 500 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {refunds.map((refund, i) => (
                  <tr key={i} className={styles.tableRow} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <td className={styles.tableCell} style={{ padding: '12px 16px' }}>{refund.id}</td>
                    <td className={styles.tableCell} style={{ padding: '12px 16px' }}>{refund.customer}</td>
                    <td className={styles.tableCell} style={{ padding: '12px 16px' }}>{refund.amount}</td>
                    <td className={styles.tableCell} style={{ padding: '12px 16px' }}>{refund.reason}</td>
                    <td className={styles.tableCell} style={{ padding: '12px 16px' }}>{refund.date}</td>
                    <td className={styles.tableCell} style={{ padding: '12px 16px' }}>{getStatusBadge(refund.status)}</td>
                    <td className={styles.tableCell} style={{ padding: '12px 16px' }}>
                      <button className={styles.actionBtn} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#1a73e8' }}>Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'escalations' && (
        <div className={styles.tableCard}>
          <div className={styles.tableHeader} style={{ padding: '16px', borderBottom: '1px solid #e0e0e0' }}>
            <h2 className={styles.tableTitle} style={{ margin: 0 }}>Escalated Cases</h2>
          </div>
          <table className={styles.table} style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead className={styles.tableHead}>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: '#5f6368', fontWeight: 500 }}>Case ID</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: '#5f6368', fontWeight: 500 }}>Priority</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: '#5f6368', fontWeight: 500 }}>Customer</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: '#5f6368', fontWeight: 500 }}>Issue</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: '#5f6368', fontWeight: 500 }}>SLA Status</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: '#5f6368', fontWeight: 500 }}>Assigned Agent</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: '#5f6368', fontWeight: 500 }}>Resolution Status</th>
              </tr>
            </thead>
            <tbody>
              {escalations.map((esc, i) => {
                const sla = getSLABand(esc.daysOpen);
                return (
                  <tr key={i} className={styles.tableRow} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <td className={styles.tableCell} style={{ padding: '12px 16px' }}>{esc.id}</td>
                    <td className={styles.tableCell} style={{ padding: '12px 16px' }}>{getStatusBadge(esc.priority)}</td>
                    <td className={styles.tableCell} style={{ padding: '12px 16px' }}>{esc.customer}</td>
                    <td className={styles.tableCell} style={{ padding: '12px 16px' }}>{esc.issue}</td>
                    <td className={styles.tableCell} style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: sla.color }}></div>
                         <span style={{ fontSize: '13px', color: '#5f6368' }}>{esc.daysOpen}d ({sla.text})</span>
                      </div>
                    </td>
                    <td className={styles.tableCell} style={{ padding: '12px 16px' }}>{esc.agent}</td>
                    <td className={styles.tableCell} style={{ padding: '12px 16px' }}>{esc.status}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'chargeback' && (
        <div className={styles.tableCard}>
          <div className={styles.tableHeader} style={{ padding: '16px', borderBottom: '1px solid #e0e0e0' }}>
            <h2 className={styles.tableTitle} style={{ margin: 0 }}>Chargeback Tracking</h2>
          </div>
          <table className={styles.table} style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead className={styles.tableHead}>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: '#5f6368', fontWeight: 500 }}>Case ID</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: '#5f6368', fontWeight: 500 }}>Gateway</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: '#5f6368', fontWeight: 500 }}>Amount</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: '#5f6368', fontWeight: 500 }}>Order ID</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: '#5f6368', fontWeight: 500 }}>Due Date</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: '#5f6368', fontWeight: 500 }}>Status</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: '#5f6368', fontWeight: 500 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {chargebacks.map((cb, i) => (
                <tr key={i} className={styles.tableRow} style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <td className={styles.tableCell} style={{ padding: '12px 16px' }}>{cb.id}</td>
                  <td className={styles.tableCell} style={{ padding: '12px 16px' }}>{cb.gateway}</td>
                  <td className={styles.tableCell} style={{ padding: '12px 16px' }}>{cb.amount}</td>
                  <td className={styles.tableCell} style={{ padding: '12px 16px', color: '#1a73e8', cursor: 'pointer' }}>{cb.orderId}</td>
                  <td className={styles.tableCell} style={{ padding: '12px 16px', color: '#d93025' }}>{cb.dueDate}</td>
                  <td className={styles.tableCell} style={{ padding: '12px 16px' }}>{cb.status}</td>
                  <td className={styles.tableCell} style={{ padding: '12px 16px' }}>
                    <button className={styles.actionBtn} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#1a73e8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FileText size={16} /> Submit Evidence
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(activeTab === 'return' || activeTab === 'investigation') && (
        <div style={{ padding: '40px', textAlign: 'center', color: '#5f6368', background: '#f8f9fa', borderRadius: '8px' }}>
          <h3>{activeTab === 'return' ? 'Return Dashboard' : 'Investigation Queue'}</h3>
          <p>This module is currently under development.</p>
        </div>
      )}
    </div>
  );
}
