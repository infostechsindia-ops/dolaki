'use client';

import React, { useState } from 'react';
import { 
  IndianRupee, 
  TrendingUp, 
  ArrowUpRight, 
  CreditCard, 
  FileText, 
  Download, 
  AlertCircle, 
  CheckCircle,
  TrendingDown
} from 'lucide-react';
import styles from '../../crud.module.css';
import { useAdmin } from '@/context/AdminContext';

export default function FinanceCenterPage() {
  const { orders, products, vendors } = useAdmin();
  const [period, setPeriod] = useState('This Month');

  const periods = ['Today', 'This Week', 'This Month', 'This Quarter'];

  // Mock Data for Finance Center
  const kpis = [
    { label: 'Total Revenue', value: '₹48.2M', trend: '+12.4%', isPositive: true },
    { label: 'Marketplace Commission', value: '₹7.8M', trend: '+8.2%', isPositive: true },
    { label: 'Flado Earnings', value: '₹12.4M', trend: '+15.1%', isPositive: true },
    { label: 'Tax Collected (GST+VAT)', value: '₹4.2M', trend: '+5.4%', isPositive: true },
    { label: 'Net Revenue', value: '₹35.8M', trend: '+10.8%', isPositive: true },
  ];

  const payoutQueue = [
    { id: 'PQ-101', vendor: 'Techtronics India', amount: '₹12,45,000', bank: 'HDFC Bank', status: 'Processing', date: '2023-10-25' },
    { id: 'PQ-102', vendor: 'Aura Lifestyle', amount: '₹8,34,500', bank: 'ICICI Bank', status: 'Pending', date: '2023-10-26' },
    { id: 'PQ-103', vendor: 'Global Traders', amount: '₹4,12,000', bank: 'SBI', status: 'Pending', date: '2023-10-26' },
    { id: 'PQ-104', vendor: 'Smart Home App', amount: '₹15,67,000', bank: 'Axis Bank', status: 'Completed', date: '2023-10-24' },
    { id: 'PQ-105', vendor: 'FitGear India', amount: '₹2,45,000', bank: 'HDFC Bank', status: 'Pending', date: '2023-10-26' },
    { id: 'PQ-106', vendor: 'Organic Valley', amount: '₹1,12,000', bank: 'Kotak', status: 'Processing', date: '2023-10-25' },
    { id: 'PQ-107', vendor: 'Urban Fashion', amount: '₹9,80,000', bank: 'ICICI Bank', status: 'Completed', date: '2023-10-23' },
    { id: 'PQ-108', vendor: 'Toy Kingdom', amount: '₹3,45,000', bank: 'SBI', status: 'Pending', date: '2023-10-26' },
  ];

  const settlements = [
    { id: 'ST-501', date: '2023-10-24', vendor: 'Smart Home App', amount: '₹15,67,000', mode: 'NEFT', reference: 'N2948572049' },
    { id: 'ST-502', date: '2023-10-23', vendor: 'Urban Fashion', amount: '₹9,80,000', mode: 'IMPS', reference: 'I3958672049' },
    { id: 'ST-503', date: '2023-10-22', vendor: 'ElectroWorld', amount: '₹24,50,000', mode: 'RTGS', reference: 'R4958672049' },
    { id: 'ST-504', date: '2023-10-21', vendor: 'Beauty Bliss', amount: '₹5,10,000', mode: 'UPI', reference: 'U5958672049' },
    { id: 'ST-505', date: '2023-10-20', vendor: 'Sports Hub', amount: '₹1,20,000', mode: 'IMPS', reference: 'I6958672049' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return '#10b981';
      case 'Processing': return '#f59e0b';
      case 'Pending': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const revenueBreakdown = [
    { source: 'Marketplace', percentage: 58, color: '#3b82f6' },
    { source: 'Flado', percentage: 32, color: '#8b5cf6' },
    { source: 'VIP Subscriptions', percentage: 6, color: '#f59e0b' },
    { source: 'Advertising', percentage: 4, color: '#10b981' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h1 className={styles.title}>Finance Center</h1>
          <p className={styles.subtitle}>Manage revenue, payouts, settlements, and financial reports.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {periods.map(p => (
            <button 
              key={p}
              className={styles.actionBtn}
              style={{
                backgroundColor: period === p ? '#f3f4f6' : 'transparent',
                fontWeight: period === p ? '600' : '400',
                color: period === p ? '#111827' : '#4b5563',
                border: period === p ? '1px solid #d1d5db' : '1px solid transparent'
              }}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
          <button className={styles.actionBtn} style={{ marginLeft: '16px', backgroundColor: '#111827', color: 'white' }}>
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      <div className={styles.metricsGrid} style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: '32px' }}>
        {kpis.map((kpi, idx) => (
          <div key={idx} className={styles.metricCard}>
            <div className={styles.metricInfo}>
              <span className={styles.metricLabel}>{kpi.label}</span>
              <span className={styles.metricValue}>{kpi.value}</span>
              <span className={kpi.isPositive ? styles.trendUp : styles.trendDown} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {kpi.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {kpi.trend}
              </span>
            </div>
            <div className={styles.metricIcon}>
              <IndianRupee size={20} color="#4b5563" />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px', marginBottom: '24px' }}>
        
        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Payout Queue */}
          <div className={styles.tableCard}>
            <div className={styles.tableTitle} style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={18} />
                <h3 style={{ margin: 0, fontSize: '16px' }}>Payout Queue</h3>
              </div>
              <button className={styles.actionBtn}>Process All Pending</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className={styles.table}>
                <thead className={styles.tableHead}>
                  <tr>
                    <th className={styles.tableCell}>Vendor</th>
                    <th className={styles.tableCell}>Amount</th>
                    <th className={styles.tableCell}>Bank Info</th>
                    <th className={styles.tableCell}>Init Date</th>
                    <th className={styles.tableCell}>Status</th>
                    <th className={styles.tableCell}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payoutQueue.map((item, idx) => (
                    <tr key={idx} className={styles.tableRow}>
                      <td className={styles.tableCell}>
                        <div style={{ fontWeight: 500 }}>{item.vendor}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.id}</div>
                      </td>
                      <td className={styles.tableCell} style={{ fontWeight: 600 }}>{item.amount}</td>
                      <td className={styles.tableCell}>{item.bank}</td>
                      <td className={styles.tableCell}>{item.date}</td>
                      <td className={styles.tableCell}>
                        <span className={styles.statusBadge} style={{ 
                          backgroundColor: `${getStatusColor(item.status)}15`, 
                          color: getStatusColor(item.status),
                          border: `1px solid ${getStatusColor(item.status)}30`
                        }}>
                          {item.status}
                        </span>
                      </td>
                      <td className={styles.tableCell}>
                        {item.status === 'Pending' && (
                          <button className={styles.actionBtn} style={{ padding: '4px 8px', fontSize: '12px' }}>Approve</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Settlement Ledger */}
          <div className={styles.tableCard}>
            <div className={styles.tableTitle} style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} />
                <h3 style={{ margin: 0, fontSize: '16px' }}>Recent Settlements</h3>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className={styles.table}>
                <thead className={styles.tableHead}>
                  <tr>
                    <th className={styles.tableCell}>Date</th>
                    <th className={styles.tableCell}>Vendor</th>
                    <th className={styles.tableCell}>Amount</th>
                    <th className={styles.tableCell}>Mode</th>
                    <th className={styles.tableCell}>Reference ID</th>
                  </tr>
                </thead>
                <tbody>
                  {settlements.map((item, idx) => (
                    <tr key={idx} className={styles.tableRow}>
                      <td className={styles.tableCell}>{item.date}</td>
                      <td className={styles.tableCell} style={{ fontWeight: 500 }}>{item.vendor}</td>
                      <td className={styles.tableCell} style={{ fontWeight: 600 }}>{item.amount}</td>
                      <td className={styles.tableCell}>{item.mode}</td>
                      <td className={styles.tableCell} style={{ fontFamily: 'monospace', color: '#6b7280' }}>{item.reference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Sidebar Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Daily Closing Report */}
          <div className={styles.tableCard} style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={18} color="#10b981" />
              Daily Closing Report
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px dashed #e5e7eb' }}>
                <span style={{ color: '#4b5563' }}>Today's Total Sales</span>
                <span style={{ fontWeight: 600 }}>₹24,50,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px dashed #e5e7eb' }}>
                <span style={{ color: '#4b5563' }}>Commission Earned</span>
                <span style={{ fontWeight: 600, color: '#10b981' }}>+ ₹3,67,500</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px dashed #e5e7eb' }}>
                <span style={{ color: '#4b5563' }}>Tax (GST+VAT)</span>
                <span style={{ fontWeight: 600, color: '#ef4444' }}>- ₹1,45,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px' }}>
                <span style={{ fontWeight: 600 }}>Net Available</span>
                <span style={{ fontWeight: 700, fontSize: '18px' }}>₹2,22,500</span>
              </div>
              <button className={styles.actionBtn} style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}>
                Generate Closing Statement
              </button>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className={styles.tableCard} style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="#3b82f6" />
              Revenue Breakdown
            </h3>
            
            <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '20px' }}>
              {revenueBreakdown.map((item, idx) => (
                <div key={idx} style={{ width: `${item.percentage}%`, backgroundColor: item.color }} title={`${item.source}: ${item.percentage}%`} />
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {revenueBreakdown.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }} />
                    <span style={{ fontSize: '14px', color: '#4b5563' }}>{item.source}</span>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Refund Ledger Summary */}
          <div className={styles.tableCard} style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} color="#f59e0b" />
              Refund Ledger (Last 7 Days)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: '#fffbeb', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#b45309', marginBottom: '4px' }}>Total Amount</div>
                <div style={{ fontWeight: 600, color: '#92400e', fontSize: '16px' }}>₹4,25,000</div>
              </div>
              <div style={{ backgroundColor: '#fffbeb', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#b45309', marginBottom: '4px' }}>Refund Count</div>
                <div style={{ fontWeight: 600, color: '#92400e', fontSize: '16px' }}>142</div>
              </div>
            </div>
            <div style={{ fontSize: '14px', color: '#4b5563', display: 'flex', justifyContent: 'space-between' }}>
              <span>Avg. Processing Time</span>
              <span style={{ fontWeight: 500 }}>24 Hours</span>
            </div>
            <button className={styles.actionBtn} style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}>
              View Detailed Ledger <ArrowUpRight size={14} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
