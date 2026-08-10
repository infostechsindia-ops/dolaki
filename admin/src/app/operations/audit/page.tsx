'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  Activity, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Search, 
  Download, 
  Filter, 
  Eye,
  Settings,
  XCircle,
  MoreVertical
} from 'lucide-react';
import styles from '../../crud.module.css';

// Mock Data
const auditEvents = [
  { id: 'EV-1001', timestamp: '2026-08-08 13:15:22', actor: 'Sarah Connor', actionType: 'LOGIN', resourceType: 'SYSTEM', resourceId: '-', ipAddress: '192.168.1.45', status: 'Success' },
  { id: 'EV-1002', timestamp: '2026-08-08 13:10:05', actor: 'John Smith', actionType: 'PRODUCT_UPDATE', resourceType: 'PRODUCT', resourceId: 'PRD-8422', ipAddress: '10.0.0.12', status: 'Success' },
  { id: 'EV-1003', timestamp: '2026-08-08 12:45:10', actor: 'Alice Johnson', actionType: 'ORDER_STATUS_CHANGE', resourceType: 'ORDER', resourceId: 'ORD-9912', ipAddress: '172.16.2.8', status: 'Success' },
  { id: 'EV-1004', timestamp: '2026-08-08 12:30:00', actor: 'System Admin', actionType: 'CMS_PUBLISH', resourceType: 'PAGE', resourceId: 'PAGE-HOME', ipAddress: '192.168.1.100', status: 'Success' },
  { id: 'EV-1005', timestamp: '2026-08-08 12:15:33', actor: 'Bob Wilson', actionType: 'VENDOR_APPROVE', resourceType: 'VENDOR', resourceId: 'VND-204', ipAddress: '192.168.1.55', status: 'Success' },
  { id: 'EV-1006', timestamp: '2026-08-08 11:55:20', actor: 'Marketing Team', actionType: 'COUPON_CREATE', resourceType: 'COUPON', resourceId: 'CPN-SUMMER', ipAddress: '10.0.0.42', status: 'Success' },
  { id: 'EV-1007', timestamp: '2026-08-08 11:30:45', actor: 'Security Bot', actionType: 'USER_BLOCK', resourceType: 'USER', resourceId: 'USR-8831', ipAddress: '127.0.0.1', status: 'Success' },
  { id: 'EV-1008', timestamp: '2026-08-08 11:10:12', actor: 'Tech Lead', actionType: 'CONFIG_CHANGE', resourceType: 'SETTINGS', resourceId: 'PAYMENT_GATEWAY', ipAddress: '192.168.1.120', status: 'Failed' },
  { id: 'EV-1009', timestamp: '2026-08-08 10:45:00', actor: 'Data Analyst', actionType: 'REPORT_EXPORT', resourceType: 'REPORT', resourceId: 'RPT-SALES-Q3', ipAddress: '172.16.2.45', status: 'Success' },
  { id: 'EV-1010', timestamp: '2026-08-08 10:20:15', actor: 'UX Designer', actionType: 'SDUI_LAYOUT_SAVE', resourceType: 'LAYOUT', resourceId: 'LAY-HOME-V2', ipAddress: '10.0.0.88', status: 'Success' },
];

const securityEvents = [
  { id: 'SEC-2001', type: 'FAILED_LOGIN', user: 'unknown@example.com', ip: '45.22.11.9', timestamp: '2026-08-08 13:05:11', severity: 'HIGH' },
  { id: 'SEC-2002', type: 'SUSPICIOUS_IP', user: 'admin@auramart.com', ip: '185.10.22.1', timestamp: '2026-08-08 12:22:45', severity: 'HIGH' },
  { id: 'SEC-2003', type: 'MFA_DISABLED', user: 'j.smith@auramart.com', ip: '10.0.0.12', timestamp: '2026-08-08 11:40:30', severity: 'MEDIUM' },
  { id: 'SEC-2004', type: 'RATE_LIMIT_EXCEEDED', user: 'api-client-xyz', ip: '192.168.1.150', timestamp: '2026-08-08 10:15:00', severity: 'LOW' },
  { id: 'SEC-2005', type: 'FAILED_LOGIN', user: 'vendor1@shop.com', ip: '8.8.4.4', timestamp: '2026-08-08 09:30:22', severity: 'MEDIUM' },
];

export default function AuditCenterPage() {
  const [activeTab, setActiveTab] = useState('All Events');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = ['All Events', 'Admin Actions', 'Vendor Activity', 'Security Events', 'CMS History', 'Config Changes'];

  return (
    <div>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h1 className={styles.title}>Audit & Compliance Center</h1>
          <p className={styles.subtitle}>Monitor system events, admin actions, and security alerts</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className={styles.actionBtn} style={{ background: 'white', color: '#333', border: '1px solid #ddd' }}>
            <Filter size={16} /> Filter
          </button>
          <button className={styles.actionBtn}>
            <Download size={16} /> Export Logs
          </button>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ background: '#e3f2fd', color: '#1976d2' }}>
            <Activity size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Total Events Today</span>
            <span className={styles.metricValue}>4,284</span>
          </div>
        </div>
        
        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ background: '#f3e5f5', color: '#7b1fa2' }}>
            <CheckCircle size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Admin Actions</span>
            <span className={styles.metricValue}>184</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ background: '#ffebee', color: '#d32f2f' }}>
            <Shield size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Security Events</span>
            <span className={styles.metricValue}>12</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ background: '#e8f5e9', color: '#388e3c' }}>
            <FileText size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>CMS Publish Events</span>
            <span className={styles.metricValue}>28</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ background: '#fff3e0', color: '#f57c00' }}>
            <Settings size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Configuration Changes</span>
            <span className={styles.metricValue}>6</span>
          </div>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px 4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeTab === tab ? '600' : '400',
                  color: activeTab === tab ? '#1976d2' : '#666',
                  borderBottom: activeTab === tab ? '2px solid #1976d2' : '2px solid transparent'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className={styles.searchBar}>
            <Search size={18} style={{ color: '#999', margin: '0 10px' }} />
            <input 
              type="text" 
              placeholder="Search actor or resource..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {activeTab !== 'Security Events' ? (
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th className={styles.tableCell}>Timestamp</th>
                <th className={styles.tableCell}>Actor</th>
                <th className={styles.tableCell}>Action Type</th>
                <th className={styles.tableCell}>Resource Type</th>
                <th className={styles.tableCell}>Resource ID</th>
                <th className={styles.tableCell}>IP Address</th>
                <th className={styles.tableCell}>Status</th>
                <th className={styles.tableCell}></th>
              </tr>
            </thead>
            <tbody>
              {auditEvents.map((event) => (
                <tr key={event.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={14} color="#666" />
                      <span style={{ fontSize: '13px', color: '#555' }}>{event.timestamp}</span>
                    </div>
                  </td>
                  <td className={styles.tableCell} style={{ fontWeight: '500' }}>{event.actor}</td>
                  <td className={styles.tableCell}>
                    <span style={{ 
                      padding: '4px 8px', 
                      background: '#f5f5f5', 
                      borderRadius: '4px', 
                      fontSize: '12px',
                      color: '#333'
                    }}>
                      {event.actionType}
                    </span>
                  </td>
                  <td className={styles.tableCell} style={{ fontSize: '13px', color: '#666' }}>{event.resourceType}</td>
                  <td className={styles.tableCell} style={{ fontSize: '13px' }}>{event.resourceId}</td>
                  <td className={styles.tableCell} style={{ fontSize: '13px', color: '#666' }}>{event.ipAddress}</td>
                  <td className={styles.tableCell}>
                    <span className={styles.statusBadge} style={{ 
                      background: event.status === 'Success' ? '#e8f5e9' : '#ffebee',
                      color: event.status === 'Success' ? '#2e7d32' : '#c62828',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {event.status === 'Success' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {event.status}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th className={styles.tableCell}>Timestamp</th>
                <th className={styles.tableCell}>Event Type</th>
                <th className={styles.tableCell}>Severity</th>
                <th className={styles.tableCell}>User/Identifier</th>
                <th className={styles.tableCell}>IP Address</th>
                <th className={styles.tableCell}></th>
              </tr>
            </thead>
            <tbody>
              {securityEvents.map((event) => (
                <tr key={event.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={14} color="#666" />
                      <span style={{ fontSize: '13px', color: '#555' }}>{event.timestamp}</span>
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    <span style={{ 
                      padding: '4px 8px', 
                      background: '#fff3e0', 
                      borderRadius: '4px', 
                      fontSize: '12px',
                      color: '#e65100',
                      fontWeight: '500'
                    }}>
                      {event.type}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    <span className={styles.statusBadge} style={{ 
                      background: event.severity === 'HIGH' ? '#ffebee' : event.severity === 'MEDIUM' ? '#fff8e1' : '#f5f5f5',
                      color: event.severity === 'HIGH' ? '#c62828' : event.severity === 'MEDIUM' ? '#f57f17' : '#616161',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {event.severity === 'HIGH' && <AlertTriangle size={12} />}
                      {event.severity}
                    </span>
                  </td>
                  <td className={styles.tableCell} style={{ fontWeight: '500' }}>{event.user}</td>
                  <td className={styles.tableCell} style={{ fontSize: '13px', color: '#666' }}>{event.ip}</td>
                  <td className={styles.tableCell}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
