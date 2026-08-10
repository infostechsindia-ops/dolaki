'use client';

import React, { useState } from 'react';
import { Package, TrendingUp, TrendingDown, AlertTriangle, BarChart3, RefreshCw, Truck, ArrowUpRight, Search, Filter } from 'lucide-react';
import styles from '../../crud.module.css';

const TABS = [
  { id: 'abc', label: 'ABC Analysis' },
  { id: 'aging', label: 'Aging Inventory' },
  { id: 'fast', label: 'Fast Moving' },
  { id: 'slow', label: 'Slow Moving' },
  { id: 'reorder', label: 'Reorder Queue' },
  { id: 'darkstore', label: 'Darkstore Replenishment' }
];

const ABC_SAMPLE_DATA = [
  { id: 'PRD-001', name: 'Amul Taaza Milk 1L', category: 'Dairy', stock: 1200, velocity: '8,400/mo', revenue: '4.2%' },
  { id: 'PRD-002', name: 'Aashirvaad Atta 5kg', category: 'Staples', stock: 450, velocity: '3,200/mo', revenue: '3.8%' },
  { id: 'PRD-003', name: 'Maggi 2-Minute Noodles', category: 'Snacks', stock: 3200, velocity: '15,000/mo', revenue: '3.5%' },
  { id: 'PRD-004', name: 'Fortune Sunflower Oil 1L', category: 'Staples', stock: 800, velocity: '5,100/mo', revenue: '2.9%' },
  { id: 'PRD-005', name: 'Tata Salt 1kg', category: 'Staples', stock: 2100, velocity: '11,000/mo', revenue: '2.1%' },
  { id: 'PRD-006', name: 'Red Label Tea 500g', category: 'Beverages', stock: 600, velocity: '4,200/mo', revenue: '1.8%' },
];

const REORDER_QUEUE_DATA = [
  { id: 'PRD-111', name: 'Dettol Handwash 200ml', currentStock: 45, minStock: 100, reorderQty: 300, supplier: 'Reckitt Benckiser', leadTime: '3 Days' },
  { id: 'PRD-112', name: 'Britannia Good Day 600g', currentStock: 12, minStock: 50, reorderQty: 200, supplier: 'Britannia Ind.', leadTime: '2 Days' },
  { id: 'PRD-113', name: 'Surf Excel Matic 1kg', currentStock: 28, minStock: 80, reorderQty: 250, supplier: 'HUL', leadTime: '4 Days' },
  { id: 'PRD-114', name: 'Parle-G 800g', currentStock: 15, minStock: 120, reorderQty: 500, supplier: 'Parle Products', leadTime: '2 Days' },
  { id: 'PRD-115', name: 'Lays Classic Salted 50g', currentStock: 4, minStock: 200, reorderQty: 800, supplier: 'PepsiCo', leadTime: '1 Day' },
  { id: 'PRD-116', name: 'Colgate MaxFresh 150g', currentStock: 35, minStock: 60, reorderQty: 150, supplier: 'Colgate-Palmolive', leadTime: '3 Days' },
  { id: 'PRD-117', name: 'Amul Butter 500g', currentStock: 10, minStock: 40, reorderQty: 100, supplier: 'GCMMF (Amul)', leadTime: '1 Day' },
  { id: 'PRD-118', name: 'Pampers Active Baby (L)', currentStock: 5, minStock: 20, reorderQty: 50, supplier: 'P&G', leadTime: '5 Days' },
];

const DARKSTORES_DATA = [
  { id: 'DS-01', name: 'Koramangala Hub', belowPar: 142, batchesPending: 3, lastReplenished: '2 hours ago' },
  { id: 'DS-02', name: 'Indiranagar Hub', belowPar: 89, batchesPending: 1, lastReplenished: '45 mins ago' },
  { id: 'DS-03', name: 'HSR Layout Hub', belowPar: 215, batchesPending: 5, lastReplenished: '4 hours ago' },
  { id: 'DS-04', name: 'Whitefield Hub', belowPar: 45, batchesPending: 0, lastReplenished: '15 mins ago' },
  { id: 'DS-05', name: 'Jayanagar Hub', belowPar: 110, batchesPending: 2, lastReplenished: '1 hour ago' },
];

const AGING_DATA = [
  { id: 'PRD-301', name: 'Exotic Dragon Fruit', age0_30: 0, age31_60: 45, age61_90: 120, age90plus: 85, valueAtRisk: '₹24,500' },
  { id: 'PRD-302', name: 'Premium Matcha Tea', age0_30: 10, age31_60: 25, age61_90: 40, age90plus: 115, valueAtRisk: '₹85,000' },
  { id: 'PRD-303', name: 'Organic Quinoa 1kg', age0_30: 5, age31_60: 15, age61_90: 30, age90plus: 210, valueAtRisk: '₹62,400' },
  { id: 'PRD-304', name: 'Imported Avocados', age0_30: 0, age31_60: 0, age61_90: 8, age90plus: 42, valueAtRisk: '₹14,200' },
];

export default function InventoryIntelligencePage() {
  const [activeTab, setActiveTab] = useState('abc');

  return (
    <div style={{ padding: '24px' }}>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h1 className={styles.title}>Inventory Intelligence</h1>
          <p className={styles.subtitle}>Optimize stock levels and manage replenishment across the network</p>
        </div>
      </div>

      <div className={styles.metricsGrid} style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: '24px' }}>
        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Total SKUs Active</span>
            <span className={styles.metricValue}>42,841</span>
          </div>
          <Package className={styles.metricIcon} />
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Inventory Value</span>
            <span className={styles.metricValue}>₹24.8M</span>
          </div>
          <BarChart3 className={styles.metricIcon} />
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Low Stock Items</span>
            <span className={styles.metricValue} style={{ color: '#f59e0b' }}>284</span>
          </div>
          <AlertTriangle className={styles.metricIcon} style={{ color: '#f59e0b' }} />
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Dead Stock Items</span>
            <span className={styles.metricValue} style={{ color: '#ef4444' }}>1,842</span>
          </div>
          <TrendingDown className={styles.metricIcon} style={{ color: '#ef4444' }} />
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Reorder Suggested</span>
            <span className={styles.metricValue} style={{ color: '#3b82f6' }}>412</span>
          </div>
          <RefreshCw className={styles.metricIcon} style={{ color: '#3b82f6' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #e5e7eb', marginBottom: '24px', overflowX: 'auto' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 16px',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === tab.id ? '2px solid #0f172a' : '2px solid transparent',
              color: activeTab === tab.id ? '#0f172a' : '#64748b',
              fontWeight: activeTab === tab.id ? '600' : '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'abc' && (
        <div>
          <div className={styles.tableCard} style={{ marginBottom: '24px', padding: '24px' }}>
            <h2 className={styles.tableTitle} style={{ marginBottom: '8px' }}>ABC Classification</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
              <strong>A items</strong> = 80% revenue (top 20% products) | <strong>B items</strong> = 15% revenue | <strong>C items</strong> = 5% revenue
            </p>
            <div className={styles.metricsGrid} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className={styles.metricCard} style={{ borderLeft: '4px solid #10b981' }}>
                <div className={styles.metricInfo}>
                  <span className={styles.metricLabel}>A Items (80% Revenue)</span>
                  <span className={styles.metricValue}>8,568 SKUs</span>
                </div>
              </div>
              <div className={styles.metricCard} style={{ borderLeft: '4px solid #3b82f6' }}>
                <div className={styles.metricInfo}>
                  <span className={styles.metricLabel}>B Items (15% Revenue)</span>
                  <span className={styles.metricValue}>8,568 SKUs</span>
                </div>
              </div>
              <div className={styles.metricCard} style={{ borderLeft: '4px solid #94a3b8' }}>
                <div className={styles.metricInfo}>
                  <span className={styles.metricLabel}>C Items (5% Revenue)</span>
                  <span className={styles.metricValue}>25,705 SKUs</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.tableCard}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 className={styles.tableTitle}>Top A-Category Products</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className={styles.table}>
                <thead className={styles.tableHead}>
                  <tr>
                    <th className={styles.tableCell}>Product Name</th>
                    <th className={styles.tableCell}>Category</th>
                    <th className={styles.tableCell}>Stock Units</th>
                    <th className={styles.tableCell}>Monthly Velocity</th>
                    <th className={styles.tableCell}>Revenue %</th>
                  </tr>
                </thead>
                <tbody>
                  {ABC_SAMPLE_DATA.map((item) => (
                    <tr key={item.id} className={styles.tableRow}>
                      <td className={styles.tableCell}>
                        <div style={{ fontWeight: '500' }}>{item.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{item.id}</div>
                      </td>
                      <td className={styles.tableCell}>{item.category}</td>
                      <td className={styles.tableCell}>{item.stock}</td>
                      <td className={styles.tableCell}>{item.velocity}</td>
                      <td className={styles.tableCell}>
                        <span className={styles.statusBadge} style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
                          {item.revenue}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reorder' && (
        <div className={styles.tableCard}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className={styles.tableTitle}>Reorder Queue</h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className={styles.searchBar}>
                <Search className={styles.searchIcon} size={18} style={{ position: 'absolute', left: '12px', top: '9px', color: '#94a3b8' }} />
                <input type="text" placeholder="Search queue..." className={styles.searchInput} style={{ paddingLeft: '36px' }} />
              </div>
              <button className={styles.actionBtn}>
                <Filter size={16} /> Filter
              </button>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.tableCell}>Product</th>
                  <th className={styles.tableCell}>Current Stock</th>
                  <th className={styles.tableCell}>Min Stock</th>
                  <th className={styles.tableCell}>Reorder Qty</th>
                  <th className={styles.tableCell}>Supplier</th>
                  <th className={styles.tableCell}>Lead Time</th>
                  <th className={styles.tableCell}>Action</th>
                </tr>
              </thead>
              <tbody>
                {REORDER_QUEUE_DATA.map((item) => (
                  <tr key={item.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div style={{ fontWeight: '500' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{item.id}</div>
                    </td>
                    <td className={styles.tableCell}>
                      <span style={{ color: '#ef4444', fontWeight: '600' }}>{item.currentStock}</span>
                    </td>
                    <td className={styles.tableCell}>{item.minStock}</td>
                    <td className={styles.tableCell}>{item.reorderQty}</td>
                    <td className={styles.tableCell}>{item.supplier}</td>
                    <td className={styles.tableCell}>{item.leadTime}</td>
                    <td className={styles.tableCell}>
                      <button className={styles.actionBtn} style={{ backgroundColor: '#0f172a', color: '#fff', border: 'none' }}>
                        Create PO
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'darkstore' && (
        <div className={styles.tableCard}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
            <h2 className={styles.tableTitle}>Darkstore Replenishment Status</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.tableCell}>Darkstore</th>
                  <th className={styles.tableCell}>Items Below Par</th>
                  <th className={styles.tableCell}>Batches Pending</th>
                  <th className={styles.tableCell}>Last Replenished</th>
                  <th className={styles.tableCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {DARKSTORES_DATA.map((item) => (
                  <tr key={item.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Truck size={16} style={{ color: '#64748b' }} />
                        {item.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginLeft: '24px' }}>{item.id}</div>
                    </td>
                    <td className={styles.tableCell}>
                      <span style={{ color: item.belowPar > 100 ? '#ef4444' : '#f59e0b', fontWeight: '500' }}>
                        {item.belowPar} items
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <span className={styles.statusBadge} style={{ backgroundColor: item.batchesPending > 0 ? '#fef3c7' : '#f3f4f6', color: item.batchesPending > 0 ? '#b45309' : '#4b5563' }}>
                        {item.batchesPending} pending
                      </span>
                    </td>
                    <td className={styles.tableCell}>{item.lastReplenished}</td>
                    <td className={styles.tableCell}>
                      <button className={styles.actionBtn}>
                        Dispatch <ArrowUpRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'aging' && (
        <div className={styles.tableCard}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
            <h2 className={styles.tableTitle}>Aging Inventory & Value at Risk</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.tableCell}>Product</th>
                  <th className={styles.tableCell}>0-30 Days</th>
                  <th className={styles.tableCell}>31-60 Days</th>
                  <th className={styles.tableCell}>61-90 Days</th>
                  <th className={styles.tableCell}>90+ Days</th>
                  <th className={styles.tableCell}>Value at Risk (90+)</th>
                </tr>
              </thead>
              <tbody>
                {AGING_DATA.map((item) => (
                  <tr key={item.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div style={{ fontWeight: '500' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{item.id}</div>
                    </td>
                    <td className={styles.tableCell}>{item.age0_30}</td>
                    <td className={styles.tableCell}>{item.age31_60}</td>
                    <td className={styles.tableCell}>{item.age61_90}</td>
                    <td className={styles.tableCell}>
                      <span style={{ color: '#ef4444', fontWeight: '500' }}>{item.age90plus}</span>
                    </td>
                    <td className={styles.tableCell}>
                      <span style={{ fontWeight: '600' }}>{item.valueAtRisk}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(activeTab === 'fast' || activeTab === 'slow') && (
        <div className={styles.tableCard}>
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2 className={styles.tableTitle} style={{ marginBottom: '8px' }}>
              {activeTab === 'fast' ? 'Fast Moving Inventory' : 'Slow Moving Inventory'}
            </h2>
            <p style={{ color: '#64748b' }}>Detailed analytics coming soon.</p>
          </div>
        </div>
      )}
    </div>
  );
}
