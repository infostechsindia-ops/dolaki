'use client';

import React, { useState } from 'react';
import styles from '../../crud.module.css';
import { Store, TrendingUp, IndianRupee, ShoppingBag, Shield, FileText, AlertCircle, CheckCircle, Search, Star } from 'lucide-react';

const MOCK_VENDORS = [
  {
    id: 'VND-1001',
    name: 'TechZone Electronics',
    onboardingDate: '2023-01-15',
    qualityScore: 92,
    riskScore: 'Low',
    kpis: {
      ordersThisMonth: 1842,
      returnRate: '2.1%',
      onTimeDispatch: '96.8%',
      avgRating: 4.5,
      reviewsThisMonth: 384,
      pendingDisputes: 2,
    },
    revenue: [
      { month: 'Jul 2026', revenue: '₹4,50,000', commission: '₹45,000', payout: '₹4,05,000' },
      { month: 'Jun 2026', revenue: '₹4,20,000', commission: '₹42,000', payout: '₹3,78,000' },
      { month: 'May 2026', revenue: '₹3,90,000', commission: '₹39,000', payout: '₹3,51,000' },
      { month: 'Apr 2026', revenue: '₹4,10,000', commission: '₹41,000', payout: '₹3,69,000' },
      { month: 'Mar 2026', revenue: '₹3,80,000', commission: '₹38,000', payout: '₹3,42,000' },
    ],
    compliance: {
      gst: 'Verified',
      license: 'Verified',
      bank: 'Verified',
      agreement: 'Verified'
    },
    disputes: [
      { id: 'DSP-8821', complaint: 'Damaged item received', amount: '₹12,400', status: 'Under Review', daysOpen: 4 },
      { id: 'DSP-8822', complaint: 'Wrong color sent', amount: '₹3,200', status: 'Open', daysOpen: 2 }
    ]
  },
  {
    id: 'VND-1002',
    name: 'StyleHub Fashion',
    onboardingDate: '2023-03-22',
    qualityScore: 88,
    riskScore: 'Medium',
    kpis: {
      ordersThisMonth: 3420,
      returnRate: '8.4%',
      onTimeDispatch: '92.1%',
      avgRating: 4.2,
      reviewsThisMonth: 820,
      pendingDisputes: 5,
    },
    revenue: [
      { month: 'Jul 2026', revenue: '₹8,50,000', commission: '₹1,27,500', payout: '₹7,22,500' },
      { month: 'Jun 2026', revenue: '₹8,20,000', commission: '₹1,23,000', payout: '₹6,97,000' },
      { month: 'May 2026', revenue: '₹7,90,000', commission: '₹1,18,500', payout: '₹6,71,500' },
      { month: 'Apr 2026', revenue: '₹8,10,000', commission: '₹1,21,500', payout: '₹6,88,500' },
      { month: 'Mar 2026', revenue: '₹7,80,000', commission: '₹1,17,000', payout: '₹6,63,000' },
    ],
    compliance: {
      gst: 'Verified',
      license: 'Verified',
      bank: 'Verified',
      agreement: 'Verified'
    },
    disputes: [
      { id: 'DSP-8901', complaint: 'Size mismatch', amount: '₹1,500', status: 'Open', daysOpen: 1 },
    ]
  },
  {
    id: 'VND-1003',
    name: 'FreshMart Groceries',
    onboardingDate: '2024-05-10',
    qualityScore: 95,
    riskScore: 'Low',
    kpis: {
      ordersThisMonth: 12500,
      returnRate: '0.8%',
      onTimeDispatch: '99.2%',
      avgRating: 4.8,
      reviewsThisMonth: 1240,
      pendingDisputes: 0,
    },
    revenue: [
      { month: 'Jul 2026', revenue: '₹15,50,000', commission: '₹1,55,000', payout: '₹13,95,000' },
      { month: 'Jun 2026', revenue: '₹14,20,000', commission: '₹1,42,000', payout: '₹12,78,000' },
      { month: 'May 2026', revenue: '₹14,90,000', commission: '₹1,49,000', payout: '₹13,41,000' },
      { month: 'Apr 2026', revenue: '₹15,10,000', commission: '₹1,51,000', payout: '₹13,59,000' },
      { month: 'Mar 2026', revenue: '₹13,80,000', commission: '₹1,38,000', payout: '₹12,42,000' },
    ],
    compliance: {
      gst: 'Verified',
      license: 'Verified',
      bank: 'Verified',
      agreement: 'Verified'
    },
    disputes: []
  },
  {
    id: 'VND-1004',
    name: 'BeautyFirst',
    onboardingDate: '2023-11-05',
    qualityScore: 82,
    riskScore: 'Medium',
    kpis: {
      ordersThisMonth: 2150,
      returnRate: '4.5%',
      onTimeDispatch: '94.5%',
      avgRating: 4.0,
      reviewsThisMonth: 410,
      pendingDisputes: 3,
    },
    revenue: [
      { month: 'Jul 2026', revenue: '₹3,50,000', commission: '₹52,500', payout: '₹2,97,500' },
      { month: 'Jun 2026', revenue: '₹3,20,000', commission: '₹48,000', payout: '₹2,72,000' },
      { month: 'May 2026', revenue: '₹2,90,000', commission: '₹43,500', payout: '₹2,46,500' },
      { month: 'Apr 2026', revenue: '₹3,10,000', commission: '₹46,500', payout: '₹2,63,500' },
      { month: 'Mar 2026', revenue: '₹2,80,000', commission: '₹42,000', payout: '₹2,38,000' },
    ],
    compliance: {
      gst: 'Verified',
      license: 'Pending',
      bank: 'Verified',
      agreement: 'Verified'
    },
    disputes: [
      { id: 'DSP-8702', complaint: 'Expired product', amount: '₹800', status: 'Resolved', daysOpen: 7 }
    ]
  },
  {
    id: 'VND-1005',
    name: 'HomeEssentials',
    onboardingDate: '2022-08-18',
    qualityScore: 90,
    riskScore: 'Low',
    kpis: {
      ordersThisMonth: 950,
      returnRate: '3.2%',
      onTimeDispatch: '97.1%',
      avgRating: 4.6,
      reviewsThisMonth: 180,
      pendingDisputes: 1,
    },
    revenue: [
      { month: 'Jul 2026', revenue: '₹5,50,000', commission: '₹55,000', payout: '₹4,95,000' },
      { month: 'Jun 2026', revenue: '₹5,20,000', commission: '₹52,000', payout: '₹4,68,000' },
      { month: 'May 2026', revenue: '₹4,90,000', commission: '₹49,000', payout: '₹4,41,000' },
      { month: 'Apr 2026', revenue: '₹5,10,000', commission: '₹51,000', payout: '₹4,59,000' },
      { month: 'Mar 2026', revenue: '₹4,80,000', commission: '₹48,000', payout: '₹4,32,000' },
    ],
    compliance: {
      gst: 'Verified',
      license: 'Verified',
      bank: 'Verified',
      agreement: 'Verified'
    },
    disputes: [
      { id: 'DSP-8105', complaint: 'Item missing from package', amount: '₹4,500', status: 'Open', daysOpen: 3 }
    ]
  }
];

export default function VendorCRMPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendorId, setSelectedVendorId] = useState(MOCK_VENDORS[0].id);
  const [activeTab, setActiveTab] = useState('Performance');

  const filteredVendors = MOCK_VENDORS.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const selectedVendor = MOCK_VENDORS.find(v => v.id === selectedVendorId) || MOCK_VENDORS[0];

  return (
    <div style={{ padding: '2rem' }}>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h1 className={styles.title}>Vendor Intelligence CRM</h1>
          <p className={styles.subtitle}>Manage and monitor vendor performance, compliance, and disputes</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 150px)', marginTop: '2rem' }}>
        {/* Sidebar */}
        <div style={{ width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1rem', borderRight: '1px solid #eee', paddingRight: '1rem' }}>
          <div className={styles.searchBar} style={{ width: '100%', marginBottom: '1rem' }}>
            <Search className={styles.searchIcon} size={20} />
            <input 
              type="text" 
              placeholder="Search vendors..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredVendors.map(vendor => (
              <div 
                key={vendor.id}
                onClick={() => setSelectedVendorId(vendor.id)}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: selectedVendorId === vendor.id ? '#f0f7ff' : '#fff',
                  border: selectedVendorId === vendor.id ? '1px solid #cce3ff' : '1px solid #eee',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{vendor.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>{vendor.id}</div>
              </div>
            ))}
            {filteredVendors.length === 0 && (
              <div style={{ padding: '1rem', color: '#666', textAlign: 'center' }}>No vendors found</div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '1rem' }}>
          {/* Header Panel */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#0052cc', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
              {selectedVendor.name.substring(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{selectedVendor.name}</h2>
                <span className={styles.statusBadge} style={{ backgroundColor: '#e6f7ed', color: '#0d8246' }}>{selectedVendor.id}</span>
              </div>
              <div style={{ display: 'flex', gap: '2rem', color: '#666', fontSize: '0.9rem' }}>
                <span>Onboarded: {selectedVendor.onboardingDate}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Star size={16} color="#f5a623" fill="#f5a623" />
                  Quality: {selectedVendor.qualityScore}/100
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: selectedVendor.riskScore === 'Low' ? '#0d8246' : selectedVendor.riskScore === 'Medium' ? '#f5a623' : '#d93025' }}>
                  <Shield size={16} />
                  Risk: {selectedVendor.riskScore}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #eee', marginBottom: '2rem', overflowX: 'auto' }}>
            {['Performance', 'Revenue', 'Settlements', 'Returns', 'Inventory', 'Compliance', 'Disputes'].map(tab => (
              <div 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.75rem 1.5rem',
                  cursor: 'pointer',
                  borderBottom: activeTab === tab ? '2px solid #0052cc' : '2px solid transparent',
                  color: activeTab === tab ? '#0052cc' : '#666',
                  fontWeight: activeTab === tab ? '600' : '400',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'Performance' && (
            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <div className={styles.metricIcon} style={{ backgroundColor: '#e6f0ff', color: '#0052cc' }}>
                  <ShoppingBag size={24} />
                </div>
                <div className={styles.metricInfo}>
                  <div className={styles.metricLabel}>Orders This Month</div>
                  <div className={styles.metricValue}>{selectedVendor.kpis.ordersThisMonth.toLocaleString()}</div>
                </div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricIcon} style={{ backgroundColor: '#fff0e6', color: '#f5a623' }}>
                  <TrendingUp size={24} />
                </div>
                <div className={styles.metricInfo}>
                  <div className={styles.metricLabel}>Return Rate</div>
                  <div className={styles.metricValue}>{selectedVendor.kpis.returnRate}</div>
                </div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricIcon} style={{ backgroundColor: '#e6f7ed', color: '#0d8246' }}>
                  <CheckCircle size={24} />
                </div>
                <div className={styles.metricInfo}>
                  <div className={styles.metricLabel}>On-Time Dispatch Rate</div>
                  <div className={styles.metricValue}>{selectedVendor.kpis.onTimeDispatch}</div>
                </div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricIcon} style={{ backgroundColor: '#fff4e6', color: '#f5a623' }}>
                  <Star size={24} />
                </div>
                <div className={styles.metricInfo}>
                  <div className={styles.metricLabel}>Avg Rating</div>
                  <div className={styles.metricValue}>{selectedVendor.kpis.avgRating}</div>
                </div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricIcon} style={{ backgroundColor: '#f0f0f0', color: '#333' }}>
                  <FileText size={24} />
                </div>
                <div className={styles.metricInfo}>
                  <div className={styles.metricLabel}>Reviews This Month</div>
                  <div className={styles.metricValue}>{selectedVendor.kpis.reviewsThisMonth}</div>
                </div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricIcon} style={{ backgroundColor: '#ffe6e6', color: '#d93025' }}>
                  <AlertCircle size={24} />
                </div>
                <div className={styles.metricInfo}>
                  <div className={styles.metricLabel}>Pending Disputes</div>
                  <div className={styles.metricValue}>{selectedVendor.kpis.pendingDisputes}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Revenue' && (
            <div className={styles.tableCard}>
              <h3 className={styles.tableTitle}>Revenue & Settlements (Last 5 Months)</h3>
              <table className={styles.table}>
                <thead className={styles.tableHead}>
                  <tr className={styles.tableRow}>
                    <th className={styles.tableCell}>Month</th>
                    <th className={styles.tableCell}>Gross Revenue</th>
                    <th className={styles.tableCell}>Commission Deducted</th>
                    <th className={styles.tableCell}>Net Payout</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedVendor.revenue.map((rev, idx) => (
                    <tr key={idx} className={styles.tableRow}>
                      <td className={styles.tableCell}>{rev.month}</td>
                      <td className={styles.tableCell} style={{ fontWeight: '600' }}>{rev.revenue}</td>
                      <td className={styles.tableCell} style={{ color: '#d93025' }}>-{rev.commission}</td>
                      <td className={styles.tableCell} style={{ color: '#0d8246', fontWeight: 'bold' }}>{rev.payout}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {['Settlements', 'Returns', 'Inventory'].includes(activeTab) && (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#666', backgroundColor: '#fff', borderRadius: '12px', border: '1px dashed #ccc' }}>
              <p>Detailed {activeTab.toLowerCase()} data would be displayed here.</p>
            </div>
          )}

          {activeTab === 'Compliance' && (
            <div className={styles.tableCard}>
              <h3 className={styles.tableTitle}>Compliance Documents</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <FileText size={20} color="#666" />
                    <span style={{ fontWeight: '500' }}>GST Certificate</span>
                  </div>
                  <span className={styles.statusBadge} style={{ backgroundColor: selectedVendor.compliance.gst === 'Verified' ? '#e6f7ed' : '#fff4e6', color: selectedVendor.compliance.gst === 'Verified' ? '#0d8246' : '#f5a623' }}>
                    {selectedVendor.compliance.gst}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Store size={20} color="#666" />
                    <span style={{ fontWeight: '500' }}>Business License</span>
                  </div>
                  <span className={styles.statusBadge} style={{ backgroundColor: selectedVendor.compliance.license === 'Verified' ? '#e6f7ed' : '#fff4e6', color: selectedVendor.compliance.license === 'Verified' ? '#0d8246' : '#f5a623' }}>
                    {selectedVendor.compliance.license}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <IndianRupee size={20} color="#666" />
                    <span style={{ fontWeight: '500' }}>Bank Account</span>
                  </div>
                  <span className={styles.statusBadge} style={{ backgroundColor: selectedVendor.compliance.bank === 'Verified' ? '#e6f7ed' : '#fff4e6', color: selectedVendor.compliance.bank === 'Verified' ? '#0d8246' : '#f5a623' }}>
                    {selectedVendor.compliance.bank}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Shield size={20} color="#666" />
                    <span style={{ fontWeight: '500' }}>Signed Agreement</span>
                  </div>
                  <span className={styles.statusBadge} style={{ backgroundColor: selectedVendor.compliance.agreement === 'Verified' ? '#e6f7ed' : '#fff4e6', color: selectedVendor.compliance.agreement === 'Verified' ? '#0d8246' : '#f5a623' }}>
                    {selectedVendor.compliance.agreement}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Disputes' && (
            <div className={styles.tableCard}>
              <h3 className={styles.tableTitle}>Open Disputes</h3>
              {selectedVendor.disputes.length > 0 ? (
                <table className={styles.table}>
                  <thead className={styles.tableHead}>
                    <tr className={styles.tableRow}>
                      <th className={styles.tableCell}>Order ID / Ref</th>
                      <th className={styles.tableCell}>Customer Complaint</th>
                      <th className={styles.tableCell}>Amount</th>
                      <th className={styles.tableCell}>Days Open</th>
                      <th className={styles.tableCell}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedVendor.disputes.map((dispute, idx) => (
                      <tr key={idx} className={styles.tableRow}>
                        <td className={styles.tableCell} style={{ fontWeight: '500' }}>{dispute.id}</td>
                        <td className={styles.tableCell}>{dispute.complaint}</td>
                        <td className={styles.tableCell}>{dispute.amount}</td>
                        <td className={styles.tableCell}>{dispute.daysOpen} days</td>
                        <td className={styles.tableCell}>
                          <span className={styles.statusBadge} style={{ 
                            backgroundColor: dispute.status === 'Resolved' ? '#e6f7ed' : dispute.status === 'Under Review' ? '#f0f7ff' : '#fff4e6', 
                            color: dispute.status === 'Resolved' ? '#0d8246' : dispute.status === 'Under Review' ? '#0052cc' : '#f5a623'
                          }}>
                            {dispute.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
                  <CheckCircle size={48} color="#0d8246" style={{ marginBottom: '1rem', opacity: 0.5, display: 'inline-block' }} />
                  <p>No open disputes for this vendor. Good job!</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
