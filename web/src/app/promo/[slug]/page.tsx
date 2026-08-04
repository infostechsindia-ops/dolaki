'use client';

import React, { use, useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { promoPagesRegistry, PromoPageConfig } from '@/data/promoLayouts';
import MarketingSectionRenderer from '@/components/MarketingSectionRenderer';
import styles from './page.module.css';

interface PromoPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function PromoDynamicPage({ params }: PromoPageProps) {
  const { slug } = use(params);

  // Manage mutable layout configuration state
  const [pageConfig, setPageConfig] = useState<PromoPageConfig | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Check local storage first
    let customConfig: PromoPageConfig | null = null;
    try {
      const customPromosRaw = localStorage.getItem('auramart_custom_promos');
      if (customPromosRaw) {
        const customPromos = JSON.parse(customPromosRaw);
        if (customPromos[slug]) {
          customConfig = customPromos[slug];
        }
      }
    } catch (e) {
      console.error('Failed to load custom promos from localStorage', e);
    }

    // 2. Check registry
    const registryConfig = customConfig || promoPagesRegistry[slug];
    
    if (registryConfig) {
      setPageConfig(JSON.parse(JSON.stringify(registryConfig)));
    }
    setIsLoading(false);
  }, [slug]);

  if (isLoading) {
    return (
      <div style={{ padding: '100px 0', textAlign: 'center', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
        <div className="spinner" style={{ marginBottom: '16px' }} />
        <div>Loading campaign configuration...</div>
      </div>
    );
  }

  if (!pageConfig) {
    return (
      <div style={{ padding: '120px 24px', textAlign: 'center', background: '#fff', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🏷️</div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 850, marginBottom: '8px', color: 'var(--color-text-primary)' }}>Campaign Not Found</h2>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '440px', marginBottom: '24px', fontSize: '0.95rem', lineHeight: 1.6 }}>
          The campaign path <code style={{ background: 'var(--color-bg-alt)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.88rem' }}>/promo/{slug}</code> is not registered. You can design and activate it instantly using the Page Builder!
        </p>
        <Link href="/promo/builder" className="btn-primary" style={{ textDecoration: 'none' }}>
          Create Campaign in Builder
        </Link>
      </div>
    );
  }

  // Handle in-memory asset replacement via drops
  const handleUpdateItemImage = (sectionId: string, itemId: string, newImage: string) => {
    setPageConfig((prev) => {
      if (!prev) return null;

      const updated = { ...prev };
      updated.sections = updated.sections.map((section) => {
        if (section.id !== sectionId) return section;

        const updatedSection = { ...section };
        updatedSection.items = updatedSection.items.map((item) => {
          if (item.id !== itemId) return item;
          return { ...item, imageUrl: newImage };
        });
        return updatedSection;
      });

      return updated;
    });
  };

  // Reset mutations to offline fallback values
  const handleResetLayout = () => {
    if (window.confirm('Are you sure you want to discard your edits and reload default assets?')) {
      const originalRegistryConfig = promoPagesRegistry[slug];
      if (originalRegistryConfig) {
        setPageConfig(JSON.parse(JSON.stringify(originalRegistryConfig)));
      } else {
        try {
          const customPromosRaw = localStorage.getItem('auramart_custom_promos') || '{}';
          const customPromos = JSON.parse(customPromosRaw);
          delete customPromos[slug];
          localStorage.setItem('auramart_custom_promos', JSON.stringify(customPromos));
          window.location.reload();
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  // Save changes to localStorage
  const handleSaveToBrowser = () => {
    try {
      const customPromosRaw = localStorage.getItem('auramart_custom_promos') || '{}';
      const customPromos = JSON.parse(customPromosRaw);
      customPromos[slug] = pageConfig;
      localStorage.setItem('auramart_custom_promos', JSON.stringify(customPromos));
      alert('Campaign layout saved successfully to your browser!');
    } catch (e) {
      console.error(e);
      alert('Failed to save campaign layout.');
    }
  };

  return (
    <div className={styles.promoPage}>
      {/* Dynamic Content-Management Editor Panel */}
      <div className={styles.cmsToolbar}>
        <div className={styles.cmsTitle}>
          🔧 CMS Mode Panel: {isEditMode ? '🟢 Edit State Active' : '🔴 Preview State'}
        </div>
        <div className={styles.cmsActions}>
          <button 
            className={`${styles.btn} ${isEditMode ? styles.btnPrimary : ''}`}
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? 'Exit Editing' : 'Toggle Edit Mode'}
          </button>
          {isEditMode && (
            <>
              <button className={`${styles.btn} ${styles.btnSave}`} onClick={handleSaveToBrowser}>
                💾 Save Changes
              </button>
              <button className={styles.btn} onClick={() => setShowExportModal(true)}>
                Export JSON Layout
              </button>
              <button className={`${styles.btn} ${styles.btnDanger}`} onClick={handleResetLayout}>
                Reset
              </button>
            </>
          )}
        </div>
      </div>

      <div className="container">
        {/* Banner Headers */}
        <div className={styles.promoHeader}>
          <h1>{pageConfig.title}</h1>
          {pageConfig.description && <p>{pageConfig.description}</p>}
        </div>

        {/* Dynamic marketing strips list */}
        {pageConfig.sections.map((section) => (
          <MarketingSectionRenderer
            key={section.id}
            section={section}
            isEditMode={isEditMode}
            onUpdateItemImage={handleUpdateItemImage}
          />
        ))}
      </div>

      {/* Configuration export layout box modal */}
      {showExportModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Export CMS Layout Configurations</h3>
            <p>Copy this JSON payload to update the database values or registry objects directly.</p>
            <textarea 
              readOnly 
              value={JSON.stringify(pageConfig, null, 2)} 
              className={styles.jsonTextarea}
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            />
            <div className={styles.modalActions}>
              <button 
                className={styles.btn} 
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(pageConfig, null, 2));
                  alert('JSON configuration copied to clipboard!');
                }}
              >
                Copy JSON
              </button>
              <button 
                className={`${styles.btn} ${styles.btnPrimary}`} 
                onClick={() => setShowExportModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
