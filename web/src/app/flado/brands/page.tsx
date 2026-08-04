'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiSearch } from 'react-icons/fi';
import { fladoBrandsData } from '@/data/fladoBrands';
import styles from './page.module.css';

export default function FladoBrandsIndexPage() {
  const [searchVal, setSearchVal] = useState('');

  const filtered = fladoBrandsData.filter(b => 
    b.name.toLowerCase().includes(searchVal.toLowerCase()) || 
    b.tagline.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <div className={styles.brandsIndexPage}>
      <div className={styles.topHeader}>
        <div className="container">
          <Link href="/flado" className={styles.backBtn}>
            <FiChevronLeft /> Back to Flado Express
          </Link>
          <div className={styles.titleSec}>
            <h1>🏷️ Flado Flagship Brand Stores</h1>
            <p>Direct authentic official item launches, coupons & deals from India's premium grocery brands.</p>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '35px' }}>
        
        {/* Brand Search Bar */}
        <div className={styles.searchWrapper}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search for official brands (Amul, Cadbury, Lays, Haldiram's...)"
            className={styles.searchInput}
          />
        </div>

        {/* Brand Cards Grid */}
        <div className={styles.brandsGrid}>
          {filtered.map(brand => {
            const getBrandColor = (slug: string) => {
              const colors: Record<string, string> = {
                amul: '#E8372C',
                'mother-dairy': '#0084C9',
                britannia: '#E31E24',
                aashirvaad: '#D82927',
                daawat: '#8C6C30',
                'tata-sampann': '#E28C27',
                haldirams: '#F59E0B',
                cadbury: '#4A0080',
                lays: '#FFD700',
                nestle: '#003087',
                'coca-cola': '#E60000',
                mccain: '#FFB800',
                hul: '#003087',
                reckitt: '#006C5B',
                colgate: '#C90000',
                lakme: '#B38B6D',
                mamaearth: '#8CC63F',
                pampers: '#00B2A9',
                himalaya: '#028A43',
                boat: '#FF0000',
                duracell: '#C56B27',
                fnp: '#006838'
              };
              return colors[slug] || '#059669';
            };
            const color = getBrandColor(brand.slug);

            return (
              <Link 
                key={brand.slug}
                href={`/flado/brands/${brand.slug}`}
                className={styles.brandCard}
                style={{ borderTopColor: color }}
              >
                <div 
                  className={styles.logoCircle}
                  style={{ backgroundColor: `${color}0d`, borderColor: color }}
                >
                  <span className={styles.logoInitial} style={{ color: color }}>
                    {brand.name.charAt(0)}
                  </span>
                </div>
                <h3 className={styles.brandName}>{brand.name}</h3>
                <p className={styles.brandTagline}>{brand.tagline}</p>
                <span className={styles.badge} style={{ color: color, backgroundColor: `${color}15` }}>
                  Official Store
                </span>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className={styles.emptyState}>
            <h3>No brands match your search query</h3>
            <p>Try searching for Amul, Haldirams, Nestle, Lays, or Cadbury.</p>
          </div>
        )}

      </div>
    </div>
  );
}
