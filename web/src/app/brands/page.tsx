'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiAward, FiArrowRight } from 'react-icons/fi';
import { brandsData as brands, Brand } from '@/data/brands';
import styles from './page.module.css';

export default function BrandsDirectoryPage() {
  const [searchVal, setSearchVal] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const categories = [
    { label: 'All Brands', value: 'all' },
    { label: 'Electronics', value: 'electronics' },
    { label: 'Fashion', value: 'fashion' },
    { label: 'Beauty', value: 'beauty' },
    { label: 'Groceries', value: 'groceries' },
    { label: 'Home', value: 'home' }
  ];

  const filteredBrands = brands.filter((b: Brand) => {
    const matchesSearch = b.name.toLowerCase().includes(searchVal.toLowerCase()) || 
                          b.tagline.toLowerCase().includes(searchVal.toLowerCase());
    const matchesCategory = activeTab === 'all' || b.categories.includes(activeTab);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.brandsPage}>
      {/* Banner */}
      <div className={styles.heroBanner}>
        <div className="container">
          <span className={styles.badge}><FiAward /> Verified Genuine</span>
          <h1>Official Flagship Brand Mall</h1>
          <p>Direct brand-to-consumer stores. Sourced directly from manufacturing hubs with 100% brand warranty.</p>
        </div>
      </div>

      <div className="container">
        {/* Search & Categories tab bar */}
        <div className={styles.filterRow}>
          <div className={styles.searchWrapper}>
            <FiSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search official brand stores..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.tabsRow}>
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setActiveTab(c.value)}
                className={`${styles.tabBtn} ${activeTab === c.value ? styles.activeTab : ''}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Brand Grid */}
        {filteredBrands.length > 0 ? (
          <div className={styles.brandsGrid}>
            {filteredBrands.map((brand: Brand) => (
              <Link href={`/brands/${brand.slug}`} key={brand.slug} className={styles.brandCard}>
                <div className={styles.brandLogoWrapper} style={{ backgroundColor: brand.primaryColor + '10' }}>
                  <img src={brand.logo} alt={brand.name} className={styles.brandLogo} />
                </div>
                <div className={styles.brandMeta}>
                  <h3 style={{ color: brand.primaryColor }}>{brand.name}</h3>
                  <p className={styles.brandTagline}>{brand.tagline}</p>
                  <p className={styles.brandStoryShort}>{brand.story.substring(0, 80)}...</p>
                  <div className={styles.visitCta} style={{ color: brand.primaryColor }}>
                    <span>Visit Store</span> <FiArrowRight />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <p>No official brand flagship stores match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
