'use client';

import React, { useState } from 'react';
import styles from '../../crud.module.css';
import {
  Megaphone,
  Tag,
  Mail,
  Bell,
  MessageSquare,
  TrendingUp,
  Target,
  Users,
  BarChart3,
  ArrowUpRight,
  Search,
  Filter
} from 'lucide-react';

const mockCampaigns = [
  { id: 'CAMP-001', name: 'Summer End Flash Sale', type: 'Flash Sale', reach: '2.5M', conversions: '18,400', revenue: '$1.2M', roi: '340%', status: 'Ended' },
  { id: 'CAMP-002', name: 'Back to School Push', type: 'Push', reach: '800K', conversions: '12,100', revenue: '$850K', roi: '450%', status: 'Active' },
  { id: 'CAMP-003', name: 'VIP Early Access', type: 'Email', reach: '150K', conversions: '8,900', revenue: '$620K', roi: '680%', status: 'Active' },
  { id: 'CAMP-004', name: 'Cart Abandonment', type: 'SMS', reach: '45K', conversions: '4,200', revenue: '$180K', roi: '520%', status: 'Active' },
  { id: 'CAMP-005', name: 'Black Friday Teaser', type: 'Email', reach: '3.1M', conversions: '0', revenue: '$0', roi: '0%', status: 'Scheduled' },
  { id: 'CAMP-006', name: 'Weekend Free Delivery', type: 'In-App', reach: '450K', conversions: '15,600', revenue: '$320K', roi: '180%', status: 'Active' },
];

const mockCoupons = [
  { code: 'SUMMER50', type: 'Fixed Amount ($50)', usage: '4,210', savings: '$210,500', expiry: '2026-08-31', status: 'Active' },
  { code: 'B2S20', type: 'Percentage (20%)', usage: '12,850', savings: '$480,200', expiry: '2026-09-15', status: 'Active' },
  { code: 'FREESHIP', type: 'Free Shipping', usage: '45,200', savings: '$316,400', expiry: '2026-12-31', status: 'Active' },
  { code: 'VIPONLY', type: 'Fixed Amount ($100)', usage: '1,420', savings: '$142,000', expiry: '2026-08-15', status: 'Active' },
  { code: 'WELCOME10', type: 'Percentage (10%)', usage: '84,100', savings: '$1.2M', expiry: 'Never', status: 'Active' },
  { code: 'WINBACK25', type: 'Percentage (25%)', usage: '3,800', savings: '$185,000', expiry: '2026-09-01', status: 'Active' },
  { code: 'APPFIRST', type: 'Fixed Amount ($20)', usage: '18,500', savings: '$370,000', expiry: '2026-12-31', status: 'Active' },
  { code: 'FLASH30', type: 'Percentage (30%)', usage: '22,400', savings: '$850,000', expiry: '2026-07-31', status: 'Expired' },
];

const mockChannels = [
  { name: 'Email', delivery: '99.2%', open: '38.2%', ctr: '4.1%', conversions: '14,200', icon: Mail },
  { name: 'Push', delivery: '95.4%', open: '12.8%', ctr: '6.4%', conversions: '28,500', icon: Bell },
  { name: 'SMS', delivery: '98.1%', open: '94.2%', ctr: '14.5%', conversions: '8,400', icon: MessageSquare },
  { name: 'In-App', delivery: '100%', open: '100%', ctr: '8.2%', conversions: '42,100', icon: Megaphone },
];

const mockSegments = [
  { name: 'VIP', count: '12,400', campaigns: 'VIP Early Access, Exclusive Offers' },
  { name: 'Frequent Buyers', count: '145,000', campaigns: 'Loyalty Points Multiplier' },
  { name: 'At-Risk', count: '84,200', campaigns: 'We Miss You (20% Off)' },
  { name: 'New Users', count: '210,000', campaigns: 'Welcome Series, App First Purchase' },
  { name: 'Win-Back', count: '320,000', campaigns: 'WINBACK25, Big Return Sale' },
];

export default function MarketingOpsPage() {
  const [activeTab, setActiveTab] = useState('Campaigns');
  const tabs = ['Campaigns', 'Coupons', 'Channel Performance', 'Customer Segments', 'ROI'];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h1 className={styles.title}>Marketing Operations</h1>
          <p className={styles.subtitle}>Campaigns, Coupons, Channels & ROI</p>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Active Campaigns</span>
            <span className={styles.metricValue}>24</span>
            <span className={styles.metricTrend}><span className={styles.trendUp}>↑ 4</span> this month</span>
          </div>
          <Megaphone className={styles.metricIcon} size={24} />
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Coupons Issued</span>
            <span className={styles.metricValue}>184,200</span>
            <span className={styles.metricTrend}><span className={styles.trendUp}>↑ 12%</span> vs last month</span>
          </div>
          <Tag className={styles.metricIcon} size={24} />
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Coupons Redeemed</span>
            <span className={styles.metricValue}>91,420</span>
            <span className={styles.metricTrend}><span className={styles.trendUp}>↑ 49.6%</span> redemption rate</span>
          </div>
          <Target className={styles.metricIcon} size={24} />
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Email Open Rate</span>
            <span className={styles.metricValue}>38.2%</span>
            <span className={styles.metricTrend}><span className={styles.trendUp}>↑ 2.1%</span> vs industry avg</span>
          </div>
          <Mail className={styles.metricIcon} size={24} />
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Push CTR</span>
            <span className={styles.metricValue}>6.4%</span>
            <span className={styles.metricTrend}><span className={styles.trendDown}>↓ 0.2%</span> vs last month</span>
          </div>
          <Bell className={styles.metricIcon} size={24} />
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>SMS Delivery Rate</span>
            <span className={styles.metricValue}>98.1%</span>
            <span className={styles.metricTrend}><span className={styles.trendUp}>↑ 0.5%</span> vs last month</span>
          </div>
          <MessageSquare className={styles.metricIcon} size={24} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', overflowX: 'auto' }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              background: activeTab === tab ? '#eef2ff' : 'transparent',
              color: activeTab === tab ? '#4f46e5' : '#6b7280',
              borderRadius: '6px',
              fontWeight: activeTab === tab ? '600' : '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Campaigns' && (
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>Active Campaigns</h2>
            <div className={styles.tableActions}>
              <div className={styles.searchBar}>
                <Search size={18} className={styles.searchIcon} />
                <input type="text" placeholder="Search campaigns..." className={styles.searchInput} />
              </div>
              <button className={styles.actionBtn}>
                <Filter size={18} />
                Filter
              </button>
            </div>
          </div>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.tableCell}>Campaign Name</th>
                  <th className={styles.tableCell}>Type</th>
                  <th className={styles.tableCell}>Reach</th>
                  <th className={styles.tableCell}>Conversions</th>
                  <th className={styles.tableCell}>Revenue</th>
                  <th className={styles.tableCell}>ROI</th>
                  <th className={styles.tableCell}>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockCampaigns.map((camp) => (
                  <tr key={camp.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div style={{ fontWeight: '500', color: '#111827' }}>{camp.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{camp.id}</div>
                    </td>
                    <td className={styles.tableCell}>{camp.type}</td>
                    <td className={styles.tableCell}>{camp.reach}</td>
                    <td className={styles.tableCell}>{camp.conversions}</td>
                    <td className={styles.tableCell}>{camp.revenue}</td>
                    <td className={styles.tableCell} style={{ color: '#059669', fontWeight: '500' }}>{camp.roi}</td>
                    <td className={styles.tableCell}>
                      <span className={styles.statusBadge} data-status={camp.status.toLowerCase()}>
                        {camp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Coupons' && (
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>Coupon Management</h2>
            <div className={styles.tableActions}>
              <div className={styles.searchBar}>
                <Search size={18} className={styles.searchIcon} />
                <input type="text" placeholder="Search coupons..." className={styles.searchInput} />
              </div>
            </div>
          </div>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.tableCell}>Code</th>
                  <th className={styles.tableCell}>Discount Type</th>
                  <th className={styles.tableCell}>Usage Count</th>
                  <th className={styles.tableCell}>Total Savings</th>
                  <th className={styles.tableCell}>Expiry</th>
                  <th className={styles.tableCell}>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockCoupons.map((coupon) => (
                  <tr key={coupon.code} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div style={{ fontWeight: '600', color: '#111827', fontFamily: 'monospace', fontSize: '1.1rem' }}>{coupon.code}</div>
                    </td>
                    <td className={styles.tableCell}>{coupon.type}</td>
                    <td className={styles.tableCell}>{coupon.usage}</td>
                    <td className={styles.tableCell}>{coupon.savings}</td>
                    <td className={styles.tableCell}>{coupon.expiry}</td>
                    <td className={styles.tableCell}>
                      <span className={styles.statusBadge} data-status={coupon.status === 'Active' ? 'active' : 'inactive'}>
                        {coupon.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Channel Performance' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {mockChannels.map((channel) => (
            <div key={channel.name} className={styles.tableCard} style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#eef2ff', padding: '0.75rem', borderRadius: '8px', color: '#4f46e5' }}>
                  <channel.icon size={24} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#111827' }}>{channel.name}</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#6b7280' }}>Delivery Rate</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>{channel.delivery}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#6b7280' }}>Open Rate</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>{channel.open}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#6b7280' }}>CTR</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>{channel.ctr}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#6b7280' }}>Conversions</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>{channel.conversions}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Customer Segments' && (
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>Audience Segments</h2>
          </div>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.tableCell}>Segment Name</th>
                  <th className={styles.tableCell}>User Count</th>
                  <th className={styles.tableCell}>Recommended Campaigns</th>
                  <th className={styles.tableCell}>Action</th>
                </tr>
              </thead>
              <tbody>
                {mockSegments.map((segment) => (
                  <tr key={segment.name} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Users size={18} style={{ color: '#6b7280' }} />
                        <span style={{ fontWeight: '500', color: '#111827' }}>{segment.name}</span>
                      </div>
                    </td>
                    <td className={styles.tableCell}>{segment.count}</td>
                    <td className={styles.tableCell}>{segment.campaigns}</td>
                    <td className={styles.tableCell}>
                      <button className={styles.actionBtn}>Target Segment</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'ROI' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricInfo}>
                <span className={styles.metricLabel}>Total Marketing Spend (YTD)</span>
                <span className={styles.metricValue}>$450,000</span>
                <span className={styles.metricTrend}>Budget remaining: $150,000</span>
              </div>
              <BarChart3 className={styles.metricIcon} size={24} />
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricInfo}>
                <span className={styles.metricLabel}>Attributed Revenue (YTD)</span>
                <span className={styles.metricValue}>$3.2M</span>
                <span className={styles.metricTrend}><span className={styles.trendUp}>↑ 24%</span> vs last year</span>
              </div>
              <TrendingUp className={styles.metricIcon} size={24} />
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricInfo}>
                <span className={styles.metricLabel}>Blended ROI</span>
                <span className={styles.metricValue}>711%</span>
                <span className={styles.metricTrend}><span className={styles.trendUp}>↑ 42%</span> vs last year</span>
              </div>
              <ArrowUpRight className={styles.metricIcon} size={24} />
            </div>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <h2 className={styles.tableTitle}>ROI by Channel</h2>
            </div>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead className={styles.tableHead}>
                  <tr>
                    <th className={styles.tableCell}>Channel</th>
                    <th className={styles.tableCell}>Spend</th>
                    <th className={styles.tableCell}>Revenue</th>
                    <th className={styles.tableCell}>CPA</th>
                    <th className={styles.tableCell}>ROI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableCell} style={{ fontWeight: '500' }}>Email Marketing</td>
                    <td className={styles.tableCell}>$45,000</td>
                    <td className={styles.tableCell}>$850,000</td>
                    <td className={styles.tableCell}>$12.50</td>
                    <td className={styles.tableCell} style={{ color: '#059669', fontWeight: '600' }}>1,788%</td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableCell} style={{ fontWeight: '500' }}>Push Notifications</td>
                    <td className={styles.tableCell}>$15,000</td>
                    <td className={styles.tableCell}>$420,000</td>
                    <td className={styles.tableCell}>$4.20</td>
                    <td className={styles.tableCell} style={{ color: '#059669', fontWeight: '600' }}>2,700%</td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableCell} style={{ fontWeight: '500' }}>SMS Campaigns</td>
                    <td className={styles.tableCell}>$85,000</td>
                    <td className={styles.tableCell}>$680,000</td>
                    <td className={styles.tableCell}>$24.50</td>
                    <td className={styles.tableCell} style={{ color: '#059669', fontWeight: '600' }}>700%</td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableCell} style={{ fontWeight: '500' }}>Performance Ads</td>
                    <td className={styles.tableCell}>$305,000</td>
                    <td className={styles.tableCell}>$1.25M</td>
                    <td className={styles.tableCell}>$68.00</td>
                    <td className={styles.tableCell} style={{ color: '#059669', fontWeight: '600' }}>309%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
