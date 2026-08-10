'use client';

import React, { useState } from 'react';
import styles from '../../crud.module.css';
import {
  User,
  ShoppingBag,
  Wallet,
  Shield,
  Star,
  Tag,
  MessageSquare,
  ChevronRight,
  Search,
  RotateCcw,
} from 'lucide-react';

const MOCK_CUSTOMERS = [
  {
    id: 'CUST-001',
    name: 'Rahul Sharma',
    email: 'rahul.s@example.com',
    phone: '+91 98765 43210',
    joinDate: '15-Mar-2023',
    segment: 'VIP',
    address: '14, Bandra West, Mumbai, MH, India',
    clv: '₹145,000',
    purchaseFrequency: '2.5 / month',
    preferredCategories: ['Electronics', 'Home Appliances'],
    auraPay: '₹12,500',
    auraCoins: 4500,
    riskScore: 'Low',
    refundAbuse: 'No',
    multipleAccounts: 'No',
    chargebacks: 0,
    vipTier: 'Platinum',
    vipExpiry: '15-Mar-2027',
    orders: [
      { id: 'ORD-991', date: '01-Aug-2026', amount: '₹4,500', status: 'Delivered', items: 3 },
      { id: 'ORD-982', date: '15-Jul-2026', amount: '₹12,000', status: 'Delivered', items: 1 },
      { id: 'ORD-975', date: '30-Jun-2026', amount: '₹1,200', status: 'Delivered', items: 2 },
    ]
  },
  {
    id: 'CUST-002',
    name: 'Priya Patel',
    email: 'priya.p@example.com',
    phone: '+91 91234 56789',
    joinDate: '10-Jan-2024',
    segment: 'Premium',
    address: '42, MG Road, Bengaluru, KA, India',
    clv: '₹85,000',
    purchaseFrequency: '1.2 / month',
    preferredCategories: ['Fashion', 'Beauty'],
    auraPay: '₹3,200',
    auraCoins: 1200,
    riskScore: 'Low',
    refundAbuse: 'No',
    multipleAccounts: 'No',
    chargebacks: 0,
    vipTier: 'Gold',
    vipExpiry: '10-Jan-2025',
    orders: [
      { id: 'ORD-881', date: '05-Aug-2026', amount: '₹2,500', status: 'Processing', items: 2 },
      { id: 'ORD-850', date: '20-Jun-2026', amount: '₹4,000', status: 'Delivered', items: 4 },
    ]
  },
  {
    id: 'CUST-003',
    name: 'Mohammed Al Mansoori',
    email: 'm.mansoori@example.ae',
    phone: '+971 50 123 4567',
    joinDate: '22-Nov-2025',
    segment: 'VIP',
    address: 'Villa 12, Jumeirah 3, Dubai, UAE',
    clv: '₹320,000',
    purchaseFrequency: '4.0 / month',
    preferredCategories: ['Luxury', 'Electronics'],
    auraPay: '₹45,000',
    auraCoins: 15000,
    riskScore: 'Low',
    refundAbuse: 'No',
    multipleAccounts: 'No',
    chargebacks: 0,
    vipTier: 'Platinum',
    vipExpiry: '22-Nov-2027',
    orders: [
      { id: 'ORD-1002', date: '08-Aug-2026', amount: '₹25,000', status: 'Shipped', items: 1 },
      { id: 'ORD-950', date: '12-Jul-2026', amount: '₹45,000', status: 'Delivered', items: 2 },
    ]
  },
  {
    id: 'CUST-004',
    name: 'Anita Desai',
    email: 'anita.d@example.com',
    phone: '+91 99887 76655',
    joinDate: '05-Feb-2026',
    segment: 'Regular',
    address: 'Flat 4B, Salt Lake, Kolkata, WB, India',
    clv: '₹12,000',
    purchaseFrequency: '0.5 / month',
    preferredCategories: ['Groceries', 'Home Essentials'],
    auraPay: '₹500',
    auraCoins: 200,
    riskScore: 'Medium',
    refundAbuse: 'No',
    multipleAccounts: 'Yes',
    chargebacks: 0,
    vipTier: 'None',
    vipExpiry: 'N/A',
    orders: [
      { id: 'ORD-1015', date: '02-Aug-2026', amount: '₹1,500', status: 'Delivered', items: 5 },
    ]
  },
  {
    id: 'CUST-005',
    name: 'Vikram Singh',
    email: 'vikram.s@example.com',
    phone: '+91 98765 12345',
    joinDate: '12-Dec-2024',
    segment: 'At-Risk',
    address: 'Sector 15, Chandigarh, India',
    clv: '₹45,000',
    purchaseFrequency: '0.2 / month',
    preferredCategories: ['Sports', 'Fitness'],
    auraPay: '₹0',
    auraCoins: 0,
    riskScore: 'High',
    refundAbuse: 'Yes',
    multipleAccounts: 'No',
    chargebacks: 1,
    vipTier: 'Silver',
    vipExpiry: 'Expired',
    orders: [
      { id: 'ORD-750', date: '10-Jan-2026', amount: '₹5,000', status: 'Returned', items: 1 },
      { id: 'ORD-700', date: '15-Dec-2025', amount: '₹8,000', status: 'Delivered', items: 2 },
    ]
  }
];

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'returns', label: 'Returns', icon: RotateCcw },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'vip', label: 'VIP', icon: Star },
  { id: 'coupons', label: 'Coupons', icon: Tag },
  { id: 'support', label: 'Support', icon: MessageSquare },
  { id: 'risk', label: 'Risk', icon: Shield },
];

export default function Customer360Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(MOCK_CUSTOMERS[0]);
  const [activeTab, setActiveTab] = useState('profile');

  const filteredCustomers = MOCK_CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h1 className={styles.title}>Customer 360 CRM</h1>
          <p className={styles.subtitle}>Comprehensive view of customer profiles, interactions, and metrics.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', marginTop: '24px' }}>
        {/* Sidebar / Customer List */}
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
            <div className={styles.searchBar} style={{ marginBottom: 0 }}>
              <Search className={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Search customers..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredCustomers.map(customer => (
              <div 
                key={customer.id} 
                onClick={() => setSelectedCustomer(customer)}
                style={{ 
                  padding: '16px', 
                  borderBottom: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  backgroundColor: selectedCustomer.id === customer.id ? '#f3f4f6' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: '#e0e7ff', 
                  color: '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  {customer.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{customer.name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{customer.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content / Customer Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Customer Header Card */}
          <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px', display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: '#e0e7ff', 
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 'bold',
              flexShrink: 0
            }}>
              {selectedCustomer.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
            
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#111827' }}>{selectedCustomer.name}</h2>
                <div style={{ color: '#4b5563', marginBottom: '4px' }}>{selectedCustomer.email} • {selectedCustomer.phone}</div>
                <div style={{ color: '#6b7280', fontSize: '14px' }}>Joined {selectedCustomer.joinDate}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: '8px' }}>
                <span className={`${styles.statusBadge} ${selectedCustomer.segment === 'VIP' || selectedCustomer.segment === 'Premium' ? styles.statusActive : selectedCustomer.segment === 'At-Risk' ? styles.statusInactive : ''}`}>
                  {selectedCustomer.segment}
                </span>
                <div style={{ fontWeight: '600', color: '#111827' }}>CLV: {selectedCustomer.clv}</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', overflowX: 'auto', background: '#fff', borderRadius: '8px 8px 0 0', padding: '0 16px' }}>
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '16px 20px',
                    border: 'none',
                    background: 'none',
                    borderBottom: activeTab === tab.id ? '2px solid #4f46e5' : '2px solid transparent',
                    color: activeTab === tab.id ? '#4f46e5' : '#6b7280',
                    fontWeight: activeTab === tab.id ? 600 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div style={{ background: '#fff', borderRadius: '0 0 8px 8px', border: '1px solid #e5e7eb', borderTop: 'none', padding: '24px', minHeight: '400px' }}>
            
            {activeTab === 'profile' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#111827' }}>Personal Information</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <div style={{ color: '#6b7280', fontSize: '13px' }}>Address</div>
                      <div style={{ color: '#111827', fontWeight: 500 }}>{selectedCustomer.address}</div>
                    </div>
                    <div>
                      <div style={{ color: '#6b7280', fontSize: '13px' }}>Preferred Categories</div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        {selectedCustomer.preferredCategories.map(cat => (
                          <span key={cat} style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#4b5563' }}>{cat}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#111827' }}>Shopping Metrics</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <div style={{ color: '#6b7280', fontSize: '13px' }}>Customer Lifetime Value (CLV)</div>
                      <div style={{ color: '#111827', fontWeight: 500, fontSize: '18px' }}>{selectedCustomer.clv}</div>
                    </div>
                    <div>
                      <div style={{ color: '#6b7280', fontSize: '13px' }}>Purchase Frequency</div>
                      <div style={{ color: '#111827', fontWeight: 500 }}>{selectedCustomer.purchaseFrequency}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#111827' }}>Recent Orders</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className={styles.table}>
                    <thead className={styles.tableHead}>
                      <tr>
                        <th className={styles.tableCell}>Order ID</th>
                        <th className={styles.tableCell}>Date</th>
                        <th className={styles.tableCell}>Amount</th>
                        <th className={styles.tableCell}>Items</th>
                        <th className={styles.tableCell}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCustomer.orders.map(order => (
                        <tr key={order.id} className={styles.tableRow}>
                          <td className={styles.tableCell} style={{ fontWeight: 500 }}>{order.id}</td>
                          <td className={styles.tableCell}>{order.date}</td>
                          <td className={styles.tableCell}>{order.amount}</td>
                          <td className={styles.tableCell}>{order.items}</td>
                          <td className={styles.tableCell}>
                            <span className={`${styles.statusBadge} ${order.status === 'Delivered' ? styles.statusActive : ''}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {selectedCustomer.orders.length === 0 && (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>No recent orders.</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'wallet' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#475569' }}>
                    <Wallet size={20} />
                    <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>AuraPay Balance</h3>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#0f172a' }}>{selectedCustomer.auraPay}</div>
                </div>
                <div style={{ background: '#fffbeb', padding: '24px', borderRadius: '8px', border: '1px solid #fef3c7' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#b45309' }}>
                    <Star size={20} />
                    <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>AuraCoins</h3>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#92400e' }}>{selectedCustomer.auraCoins.toLocaleString()}</div>
                </div>
              </div>
            )}

            {activeTab === 'risk' && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '24px', color: '#111827' }}>Risk Assessment</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                  <div style={{ padding: '16px', background: selectedCustomer.riskScore === 'Low' ? '#ecfdf5' : selectedCustomer.riskScore === 'High' ? '#fef2f2' : '#fffbeb', borderRadius: '8px', border: '1px solid', borderColor: selectedCustomer.riskScore === 'Low' ? '#d1fae5' : selectedCustomer.riskScore === 'High' ? '#fee2e2' : '#fef3c7' }}>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Overall Risk Score</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: selectedCustomer.riskScore === 'Low' ? '#059669' : selectedCustomer.riskScore === 'High' ? '#dc2626' : '#d97706' }}>
                      {selectedCustomer.riskScore}
                    </div>
                  </div>
                  <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Refund Abuse</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: selectedCustomer.refundAbuse === 'Yes' ? '#dc2626' : '#111827' }}>
                      {selectedCustomer.refundAbuse}
                    </div>
                  </div>
                  <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Multiple Accounts</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: selectedCustomer.multipleAccounts === 'Yes' ? '#d97706' : '#111827' }}>
                      {selectedCustomer.multipleAccounts}
                    </div>
                  </div>
                  <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Chargebacks</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: selectedCustomer.chargebacks > 0 ? '#dc2626' : '#111827' }}>
                      {selectedCustomer.chargebacks}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vip' && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '24px', color: '#111827' }}>VIP Status</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '24px', background: 'linear-gradient(to right, #1e293b, #0f172a)', borderRadius: '12px', color: 'white' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Star size={40} color={selectedCustomer.vipTier === 'Gold' ? '#fbbf24' : selectedCustomer.vipTier === 'Platinum' ? '#e2e8f0' : '#94a3b8'} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '4px' }}>Current Tier</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: selectedCustomer.vipTier === 'Gold' ? '#fbbf24' : selectedCustomer.vipTier === 'Platinum' ? '#e2e8f0' : selectedCustomer.vipTier === 'None' ? '#94a3b8' : '#cbd5e1' }}>
                      {selectedCustomer.vipTier}
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>
                      Expiry: {selectedCustomer.vipExpiry}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {['returns', 'coupons', 'support'].includes(activeTab) && (
              <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
                <div style={{ marginBottom: '16px' }}>
                  {activeTab === 'returns' && <RotateCcw size={48} style={{ margin: '0 auto', opacity: 0.5 }} />}
                  {activeTab === 'coupons' && <Tag size={48} style={{ margin: '0 auto', opacity: 0.5 }} />}
                  {activeTab === 'support' && <MessageSquare size={48} style={{ margin: '0 auto', opacity: 0.5 }} />}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#374151' }}>No data available</h3>
                <p>There is no information to display in the {activeTab} tab at the moment.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
