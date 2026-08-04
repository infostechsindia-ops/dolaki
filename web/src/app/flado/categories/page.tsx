'use client';

import React from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiZap, FiGrid } from 'react-icons/fi';
import { fladoCategoriesData } from '@/data/fladoCategories';
import styles from './[slug]/page.module.css';

export default function FladoCategoriesIndexPage() {
  return (
    <div className={styles.fladoCategoryPage}>
      <div className={styles.fladoMiniHeader}>
        <div className="container">
          <div className={styles.miniHeaderInner}>
            <Link href="/flado" className={styles.backBtn}>
              <FiChevronLeft /> Back to Flado Express
            </Link>
            <div className={styles.etaBadge}>
              <FiZap className={styles.zapIcon} style={{ color: '#059669' }} />
              <span>Instant Delivery in <strong>10 Mins</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <FiGrid size={24} style={{ color: '#059669' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: '900', margin: 0 }}>
            Shop by Department
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          {fladoCategoriesData.map((cat, idx) => (
            <Link 
              href={`/flado/categories/${cat.slug}`} 
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '24px',
                backgroundColor: 'white',
                border: '1.5px solid var(--color-border)',
                borderRadius: '16px',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = cat.primaryColor;
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>{cat.emoji}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '850', color: 'var(--color-text-primary)', margin: '0 0 6px 0' }}>
                  {cat.name}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: '0 0 16px 0', lineHeight: 1.4 }}>
                  {cat.subCategories.slice(0, 3).join(', ')}...
                </p>
              </div>

              {cat.offers && cat.offers.length > 0 && (
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: '900',
                  color: cat.primaryColor,
                  backgroundColor: `${cat.primaryColor}15`,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  alignSelf: 'flex-start'
                }}>
                  🔥 {cat.offers[0].text}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
