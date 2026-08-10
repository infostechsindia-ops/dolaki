'use client';

import React, { useState } from 'react';
import { 
  ShoppingCart, Package, TrendingDown, Clock, 
  CheckCircle, AlertCircle, Search, ArrowUpRight 
} from 'lucide-react';
import styles from '../../crud.module.css';

const mockSuppliers = [
  { id: 'SUP-001', name: 'Samsung India Pvt Ltd', category: 'Electronics', rating: 4.8, activeOrders: 12, totalValue: 8400000, status: 'Active' },
  { id: 'SUP-002', name: 'Reliance Retail Ventures', category: 'FMCG & Grocery', rating: 4.6, activeOrders: 28, totalValue: 3200000, status: 'Active' },
  { id: 'SUP-003', name: 'Myntra Designs', category: 'Fashion & Apparel', rating: 4.5, activeOrders: 7, totalValue: 1800000, status: 'Active' },
  { id: 'SUP-004', name: 'Apple India', category: 'Electronics', rating: 4.9, activeOrders: 3, totalValue: 12400000, status: 'Active' },
  { id: 'SUP-005', name: 'Hindustan Unilever', category: 'FMCG & Beauty', rating: 4.7, activeOrders: 19, totalValue: 2600000, status: 'Active' },
];

const mockPurchaseOrders = [
  { id: 'PO-2026-1841', supplier: 'Samsung India Pvt Ltd', items: 24, value: 1840000, date: 'Aug 6, 2026', expectedDelivery: 'Aug 12, 2026', status: 'In Transit' },
  { id: 'PO-2026-1838', supplier: 'Hindustan Unilever', items: 186, value: 480000, date: 'Aug 5, 2026', expectedDelivery: 'Aug 9, 2026', status: 'Received' },
  { id: 'PO-2026-1832', supplier: 'Reliance Retail Ventures', items: 420, value: 920000, date: 'Aug 3, 2026', expectedDelivery: 'Aug 8, 2026', status: 'Received' },
  { id: 'PO-2026-1829', supplier: 'Apple India', items: 8, value: 4200000, date: 'Aug 1, 2026', expectedDelivery: 'Aug 15, 2026', status: 'Ordered' },
  { id: 'PO-2026-1821', supplier: 'Myntra Designs', items: 340, value: 680000, date: 'Jul 28, 2026', expectedDelivery: 'Aug 4, 2026', status: 'Received' },
];

const statusColors: Record<string, string> = {
  'In Transit': '#2563EB',
  'Received': '#059669',
  'Ordered': '#D97706',
  'Cancelled': '#DC2626',
};

export default function ProcurementPage() {
  const [activeTab, setActiveTab] = useState<'suppliers' | 'orders' | 'goods-receipt' | 'analytics'>('suppliers');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSuppliers = mockSuppliers.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h2 className={styles.title}>Supplier & Procurement Center</h2>
          <p className={styles.subtitle}>Manage supplier registry, purchase orders, and goods receipt workflows.</p>
        </div>
        <button className={styles.actionBtn} style={{ background: '#7C3AED', color: '#fff', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '8px', cursor: 'pointer' }}>
          + New Purchase Order
        </button>
      </div>

      {/* KPI Metrics */}
      <div className={styles.metricsGrid}>
        {[
          { label: 'Active Suppliers', value: '84', icon: <Package size={22} />, trend: '+3' },
          { label: 'Open Purchase Orders', value: '47', icon: <ShoppingCart size={22} />, trend: '+8 this week' },
          { label: 'PO Value (This Month)', value: '₹4.82Cr', icon: <ArrowUpRight size={22} />, trend: '+12.4%' },
          { label: 'Avg Lead Time', value: '4.8 days', icon: <Clock size={22} />, trend: '-0.4d vs last month' },
        ].map((metric, i) => (
          <div key={i} className={styles.metricCard}>
            <div className={styles.metricInfo}>
              <span className={styles.metricLabel}>{metric.label}</span>
              <span className={styles.metricValue}>{metric.value}</span>
              <span className={`${styles.metricTrend} ${styles.trendUp}`}>{metric.trend}</span>
            </div>
            <div className={styles.metricIcon}>{metric.icon}</div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #E5E7EB', paddingBottom: '0' }}>
        {[
          { id: 'suppliers', label: 'Supplier Registry' },
          { id: 'orders', label: 'Purchase Orders' },
          { id: 'goods-receipt', label: 'Goods Receipt' },
          { id: 'analytics', label: 'Supplier Analytics' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '0.5rem 1rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #7C3AED' : '2px solid transparent',
              color: activeTab === tab.id ? '#7C3AED' : '#6B7280',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              marginBottom: '-2px',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'suppliers' && (
        <div className={styles.tableCard}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 className={styles.tableTitle}>Approved Supplier Registry</h3>
            <div className={styles.searchBar}>
              <Search size={16} />
              <input
                className={styles.searchInput}
                placeholder="Search suppliers..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHead}>
                <th className={styles.tableCell}>Supplier</th>
                <th className={styles.tableCell}>Category</th>
                <th className={styles.tableCell}>Rating</th>
                <th className={styles.tableCell}>Active POs</th>
                <th className={styles.tableCell}>Total Value</th>
                <th className={styles.tableCell}>Status</th>
                <th className={styles.tableCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map(s => (
                <tr key={s.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#EDE9FE', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.name}</div>
                        <div style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>{s.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className={styles.tableCell}>{s.category}</td>
                  <td className={styles.tableCell}>
                    <span style={{ color: '#F59E0B', fontWeight: 700 }}>★ {s.rating}</span>
                  </td>
                  <td className={styles.tableCell}>{s.activeOrders}</td>
                  <td className={styles.tableCell}>₹{(s.totalValue / 100000).toFixed(1)}L</td>
                  <td className={styles.tableCell}>
                    <span className={styles.statusBadge} style={{ background: '#D1FAE5', color: '#065F46' }}>{s.status}</span>
                  </td>
                  <td className={styles.tableCell}>
                    <button className={styles.actionBtn}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className={styles.tableCard}>
          <h3 className={styles.tableTitle}>Recent Purchase Orders</h3>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHead}>
                <th className={styles.tableCell}>PO Number</th>
                <th className={styles.tableCell}>Supplier</th>
                <th className={styles.tableCell}>Items</th>
                <th className={styles.tableCell}>Value</th>
                <th className={styles.tableCell}>Order Date</th>
                <th className={styles.tableCell}>Expected Delivery</th>
                <th className={styles.tableCell}>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockPurchaseOrders.map(po => (
                <tr key={po.id} className={styles.tableRow}>
                  <td className={styles.tableCell} style={{ fontFamily: 'monospace', fontWeight: 600 }}>{po.id}</td>
                  <td className={styles.tableCell}>{po.supplier}</td>
                  <td className={styles.tableCell}>{po.items}</td>
                  <td className={styles.tableCell} style={{ fontWeight: 600 }}>₹{(po.value / 100000).toFixed(1)}L</td>
                  <td className={styles.tableCell}>{po.date}</td>
                  <td className={styles.tableCell}>{po.expectedDelivery}</td>
                  <td className={styles.tableCell}>
                    <span className={styles.statusBadge} style={{ background: statusColors[po.status] + '22', color: statusColors[po.status] }}>
                      {po.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'goods-receipt' && (
        <div className={styles.tableCard}>
          <h3 className={styles.tableTitle}>Goods Receipt & Quality Check</h3>
          <div style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF' }}>
            <CheckCircle size={48} style={{ margin: '0 auto 1rem', color: '#059669' }} />
            <p>3 POs awaiting goods receipt confirmation today</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>PO-2026-1841, PO-2026-1829, PO-2026-1838</p>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className={styles.tableCard}>
          <h3 className={styles.tableTitle}>Supplier Performance Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', padding: '1rem 0' }}>
            {mockSuppliers.map(s => (
              <div key={s.id} style={{ padding: '1.25rem', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{s.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#6B7280' }}>
                  <span>Rating: <strong style={{ color: '#F59E0B' }}>★ {s.rating}</strong></span>
                  <span>POs: <strong>{s.activeOrders}</strong></span>
                </div>
                <div style={{ marginTop: '0.75rem', height: 6, background: '#E5E7EB', borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${(s.rating / 5) * 100}%`, background: '#7C3AED', borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
