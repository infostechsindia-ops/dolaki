'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity, User, Store, IndianRupee, RotateCcw,
  ShoppingCart, Archive, Megaphone, Shield, FileText,
  BarChart3, Search, ArrowUpRight, Building2
} from 'lucide-react';
import styles from '../crud.module.css';

const OPS_MODULES = [
  {
    title: 'Executive Dashboard',
    description: 'Live KPIs, GMV, revenue, SLA compliance, darkstore metrics, and platform-wide health monitoring.',
    href: '/operations',
    icon: Activity,
    color: '#7C3AED',
    bg: '#EDE9FE',
    tags: ['Revenue', 'GMV', 'KPIs', 'Live Alerts'],
  },
  {
    title: 'Customer 360 CRM',
    description: 'Full customer profile with orders, returns, wallet, AuraCoins, VIP status, risk flags, and CLV.',
    href: '/operations/crm',
    icon: User,
    color: '#2563EB',
    bg: '#DBEAFE',
    tags: ['Profile', 'Orders', 'Risk', 'CLV'],
  },
  {
    title: 'Vendor Intelligence',
    description: 'Vendor performance analytics, revenue, settlements, compliance, disputes, and quality scoring.',
    href: '/operations/vendor-crm',
    icon: Store,
    color: '#059669',
    bg: '#D1FAE5',
    tags: ['Performance', 'Revenue', 'Compliance'],
  },
  {
    title: 'Finance Center',
    description: 'Revenue tracking, commission, GST/VAT, payout queue, settlement ledger, and daily closing reports.',
    href: '/operations/finance',
    icon: IndianRupee,
    color: '#D97706',
    bg: '#FEF3C7',
    tags: ['Revenue', 'Tax', 'Settlements', 'Payouts'],
  },
  {
    title: 'Refund & Dispute Center',
    description: 'Refund dashboard, return pipeline, chargeback tracking, escalations, and SLA monitoring.',
    href: '/operations/refunds',
    icon: RotateCcw,
    color: '#DC2626',
    bg: '#FEE2E2',
    tags: ['Refunds', 'Disputes', 'SLA', 'Chargebacks'],
  },
  {
    title: 'Supplier & Procurement',
    description: 'Supplier registry, purchase orders, goods receipt workflows, and supplier performance analytics.',
    href: '/operations/procurement',
    icon: ShoppingCart,
    color: '#7C3AED',
    bg: '#EDE9FE',
    tags: ['Suppliers', 'POs', 'Goods Receipt'],
  },
  {
    title: 'Inventory Intelligence',
    description: 'ABC analysis, aging inventory, dead stock alerts, reorder queue, and darkstore replenishment.',
    href: '/operations/inventory',
    icon: Archive,
    color: '#0369A1',
    bg: '#E0F2FE',
    tags: ['ABC Analysis', 'Reorder', 'Forecast'],
  },
  {
    title: 'Marketing Operations',
    description: 'Campaign analytics, coupon performance, channel metrics (Email, Push, SMS), and ROI tracking.',
    href: '/operations/marketing-ops',
    icon: Megaphone,
    color: '#9D174D',
    bg: '#FCE7F3',
    tags: ['Campaigns', 'ROI', 'Segments'],
  },
  {
    title: 'Fraud & Risk Center',
    description: 'Suspicious order detection, refund/coupon abuse monitoring, risk scoring, and manual review queue.',
    href: '/operations/fraud',
    icon: Shield,
    color: '#991B1B',
    bg: '#FEF2F2',
    tags: ['Fraud', 'Risk Score', 'Review Queue'],
  },
  {
    title: 'Business Intelligence',
    description: 'Revenue, customer, vendor, and operational reports with CSV/Excel/PDF export and scheduling.',
    href: '/operations/reports',
    icon: FileText,
    color: '#065F46',
    bg: '#D1FAE5',
    tags: ['Reports', 'Export', 'Scheduled'],
  },
  {
    title: 'Audit & Compliance',
    description: 'Full audit trail of admin, vendor, and security events with export and compliance tracking.',
    href: '/operations/audit',
    icon: BarChart3,
    color: '#374151',
    bg: '#F3F4F6',
    tags: ['Audit Logs', 'Security', 'Compliance'],
  },
  {
    title: 'Enterprise Search',
    description: 'Global search across customers, orders, vendors, products, riders, warehouses, darkstores, and campaigns.',
    href: '/operations/search',
    icon: Search,
    color: '#4C1D95',
    bg: '#F5F3FF',
    tags: ['Search', 'Global', 'All Entities'],
  },
];

export default function OperationsHubPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Building2 size={28} color="#7C3AED" />
            <h2 className={styles.title} style={{ margin: 0 }}>Enterprise Operations Center</h2>
          </div>
          <p className={styles.subtitle}>
            Complete enterprise operations hub — comparable to Amazon Seller Central, Flipkart Commerce Cloud, and Salesforce Commerce Cloud.
            Access all 12 operation modules from this dashboard.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/operations/search" style={{ textDecoration: 'none' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: '1px solid #E5E7EB', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '0.875rem' }}>
              <Search size={15} /> Enterprise Search
            </button>
          </Link>
          <Link href="/operations/reports" style={{ textDecoration: 'none' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: 'none', borderRadius: '8px', background: '#7C3AED', color: 'white', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
              <FileText size={15} /> Run Report
            </button>
          </Link>
        </div>
      </div>

      {/* Status Banner */}
      <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)', borderRadius: '16px', padding: '1.5rem 2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Platform Status</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>🟢 All Systems Operational</div>
          <div style={{ fontSize: '0.85rem', opacity: 0.85, marginTop: '0.25rem' }}>12 Operations modules active · Live Production Deployment: PAUSED</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: '1.5rem', textAlign: 'center' }}>
          {[
            { label: 'Total Revenue', value: '₹48.2M' },
            { label: 'Active Orders', value: '14,821' },
            { label: 'NPS Score', value: '72' },
          ].map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Module Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {OPS_MODULES.map((mod) => {
          const IconComponent = mod.icon;
          return (
            <Link key={mod.href} href={mod.href} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '1.5rem',
                background: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                height: '100%',
                boxSizing: 'border-box',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = mod.color;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 24px ${mod.color}22`;
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLElement).style.transform = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '12px', background: mod.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconComponent size={24} color={mod.color} />
                  </div>
                  <ArrowUpRight size={18} color="#9CA3AF" />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem', margin: '0 0 0.5rem' }}>{mod.title}</h3>
                <p style={{ fontSize: '0.825rem', color: '#6B7280', lineHeight: 1.6, margin: '0 0 1rem' }}>{mod.description}</p>
                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                  {mod.tags.map(tag => (
                    <span key={tag} style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                      background: mod.bg,
                      color: mod.color,
                      fontSize: '0.7rem',
                      fontWeight: 600,
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
