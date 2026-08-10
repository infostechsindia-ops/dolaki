'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  FileText, 
  Calendar, 
  TrendingUp, 
  Filter, 
  RefreshCw, 
  CheckCircle 
} from 'lucide-react';
import styles from '../../crud.module.css';

export default function ReportsDashboard() {
  const [reportType, setReportType] = useState('Revenue Reports');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [surface, setSurface] = useState('All');
  const [region, setRegion] = useState('All');
  const [toast, setToast] = useState<string | null>(null);

  const reportTypes = [
    'Revenue Reports',
    'Customer Reports',
    'Vendor Reports',
    'Inventory Reports',
    'Marketing Reports',
    'Operational Reports'
  ];

  const dateRanges = ['Last 7 Days', 'Last 30 Days', 'Last Quarter', 'Custom'];
  
  const handleExport = (format: string) => {
    setToast(`Successfully generated ${format} export for ${reportType}.`);
    setTimeout(() => setToast(null), 3000);
  };

  const revenueSummary = [
    { label: 'Total Orders', value: '12,450', trend: '+5.2%', isUp: true },
    { label: 'Gross Merchandise Value (GMV)', value: '$450,200', trend: '+8.1%', isUp: true },
    { label: 'Total Revenue', value: '$45,020', trend: '+8.1%', isUp: true },
    { label: 'Avg. Commission Rate', value: '10.0%', trend: '0.0%', isUp: true },
    { label: 'Refunds & Adjustments', value: '$5,400', trend: '-1.2%', isUp: false },
    { label: 'Net Revenue', value: '$39,620', trend: '+9.4%', isUp: true },
  ];

  const topVendors = [
    { name: 'TechHaven Electronics', revenue: 120000, percentage: 100 },
    { name: 'FashionForward', revenue: 85000, percentage: 70 },
    { name: 'HomeEssentials', revenue: 60000, percentage: 50 },
    { name: 'BeautyGlow', revenue: 45000, percentage: 37.5 },
    { name: 'DailyGrocers', revenue: 30000, percentage: 25 },
  ];

  const topCategories = [
    { name: 'Electronics', gmv: 200000, percentage: 100 },
    { name: 'Apparel & Fashion', gmv: 120000, percentage: 60 },
    { name: 'Home & Living', gmv: 80000, percentage: 40 },
    { name: 'Health & Beauty', gmv: 30000, percentage: 15 },
    { name: 'Groceries', gmv: 20200, percentage: 10 },
  ];

  const scheduledReports = [
    { name: 'Daily Revenue Report', frequency: 'Daily (08:00 AM)', recipients: 'leadership@auramart.com', lastSent: 'Today, 08:00 AM' },
    { name: 'Weekly Vendor Settlements', frequency: 'Weekly (Monday)', recipients: 'finance@auramart.com', lastSent: 'Aug 3, 09:00 AM' },
    { name: 'Monthly Customer Cohort', frequency: 'Monthly (1st)', recipients: 'marketing@auramart.com', lastSent: 'Aug 1, 10:00 AM' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#10B981',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          zIndex: 1000
        }}>
          <CheckCircle size={20} />
          {toast}
        </div>
      )}

      {/* Header & Export Actions */}
      <div className={styles.pageHeader} style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div className={styles.pageTitleGroup}>
          <h1 className={styles.title}>Business Intelligence & Reporting</h1>
          <p className={styles.subtitle}>Comprehensive analytics and operational insights</p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className={styles.actionBtn} onClick={() => handleExport('CSV')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={16} /> Export CSV
          </button>
          <button className={styles.actionBtn} onClick={() => handleExport('Excel')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={16} /> Export Excel
          </button>
          <button className={styles.actionBtn} onClick={() => handleExport('PDF')} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#4F46E5', color: 'white' }}>
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
        {/* Main Content Area */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Top Controls: Report Type & Filters */}
          <div className={styles.tableCard} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
              {reportTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setReportType(type)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: reportType === type ? '#4F46E5' : '#E5E7EB',
                    backgroundColor: reportType === type ? '#EEF2FF' : 'white',
                    color: reportType === type ? '#4F46E5' : '#4B5563',
                    fontWeight: reportType === type ? '600' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={18} color="#6B7280" />
                <span style={{ fontWeight: '500', color: '#374151' }}>Filters:</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="#6B7280" />
                <select 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white' }}
                >
                  {dateRanges.map(range => <option key={range} value={range}>{range}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#6B7280', fontSize: '14px' }}>Surface:</span>
                <select 
                  value={surface}
                  onChange={(e) => setSurface(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white' }}
                >
                  <option value="All">All Surfaces</option>
                  <option value="Marketplace">Marketplace</option>
                  <option value="Flado">Flado (Q-Commerce)</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#6B7280', fontSize: '14px' }}>Region:</span>
                <select 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white' }}
                >
                  <option value="All">All Regions</option>
                  <option value="India">India</option>
                  <option value="UAE">UAE</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dynamic Report Content - Only showing Revenue for Phase 10 */}
          {reportType === 'Revenue Reports' ? (
            <>
              {/* Summary Metrics */}
              <div className={styles.metricsGrid}>
                {revenueSummary.map((metric, i) => (
                  <div key={i} className={styles.metricCard}>
                    <div className={styles.metricInfo}>
                      <span className={styles.metricLabel}>{metric.label}</span>
                      <span className={styles.metricValue}>{metric.value}</span>
                      <div className={styles.metricTrend}>
                        {metric.isUp ? <TrendingUp size={16} /> : <TrendingUp size={16} style={{ transform: 'scaleY(-1)' }}/>}
                        <span className={metric.isUp ? styles.trendUp : styles.trendDown}>
                          {metric.trend} vs previous
                        </span>
                      </div>
                    </div>
                    <div className={styles.metricIcon} style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
                      <BarChart3 size={24} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                {/* Top 5 Vendors */}
                <div className={styles.tableCard} style={{ padding: '20px' }}>
                  <h3 className={styles.tableTitle} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BarChart3 size={18} /> Top 5 Vendors by Revenue
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {topVendors.map((vendor, index) => (
                      <div key={index} style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px' }}>
                          <span style={{ fontWeight: '500', color: '#374151' }}>{vendor.name}</span>
                          <span style={{ color: '#4B5563' }}>${vendor.revenue.toLocaleString()}</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${vendor.percentage}%`, height: '100%', backgroundColor: '#4F46E5', borderRadius: '4px' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top 5 Categories */}
                <div className={styles.tableCard} style={{ padding: '20px' }}>
                  <h3 className={styles.tableTitle} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BarChart3 size={18} /> Top 5 Categories by GMV
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {topCategories.map((category, index) => (
                      <div key={index} style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px' }}>
                          <span style={{ fontWeight: '500', color: '#374151' }}>{category.name}</span>
                          <span style={{ color: '#4B5563' }}>${category.gmv.toLocaleString()}</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${category.percentage}%`, height: '100%', backgroundColor: '#10B981', borderRadius: '4px' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scheduled Reports Table */}
              <div className={styles.tableCard}>
                <div style={{ padding: '20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className={styles.tableTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <RefreshCw size={18} /> Scheduled Reports
                  </h3>
                  <button className={styles.actionBtn} style={{ fontSize: '14px' }}>+ New Schedule</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className={styles.table}>
                    <thead className={styles.tableHead}>
                      <tr>
                        <th className={styles.tableCell}>Report Name</th>
                        <th className={styles.tableCell}>Frequency</th>
                        <th className={styles.tableCell}>Recipients</th>
                        <th className={styles.tableCell}>Last Sent</th>
                        <th className={styles.tableCell}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduledReports.map((report, index) => (
                        <tr key={index} className={styles.tableRow}>
                          <td className={styles.tableCell} style={{ fontWeight: '500', color: '#111827' }}>
                            {report.name}
                          </td>
                          <td className={styles.tableCell}>{report.frequency}</td>
                          <td className={styles.tableCell}>{report.recipients}</td>
                          <td className={styles.tableCell}>{report.lastSent}</td>
                          <td className={styles.tableCell}>
                            <span className={styles.statusBadge} style={{ backgroundColor: '#DEF7EC', color: '#03543F' }}>Active</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.tableCard} style={{ padding: '64px 20px', textAlign: 'center', color: '#6B7280' }}>
              <BarChart3 size={48} style={{ margin: '0 auto 16px auto', opacity: 0.2 }} />
              <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>{reportType} View Coming Soon</h3>
              <p>Detailed analytics for {reportType.toLowerCase()} are currently under development.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
