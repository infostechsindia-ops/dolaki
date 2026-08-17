'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiSearch, FiX, FiTrendingUp, FiClock, FiGrid, FiArrowRight } from 'react-icons/fi';
import { fladoProductsData } from '@/data/fladoProducts';
import { fladoCategoriesData } from '@/data/fladoCategories';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

const TRENDING_KEYWORDS = [
  'Milk', 'Organic Banana', 'Tomato', 'Coriander', 'Atta', 'Lays Chips', 'Eggs', 'boAt Earphones', 'Lego'
];

export default function FladoSearchPage() {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    const saved = localStorage.getItem('flado_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Filter items as user types
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const filtered = fladoProductsData.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      (p.brand ?? '').toLowerCase().includes(query.toLowerCase()) ||
      (p.subCategory ?? '').toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query]);

  const handleSearchTrigger = (searchVal: string) => {
    setQuery(searchVal);
    
    // Save to recents
    const list = [searchVal, ...recentSearches.filter(s => s !== searchVal)].slice(0, 5);
    setRecentSearches(list);
    localStorage.setItem('flado_recent_searches', JSON.stringify(list));
  };

  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('flado_recent_searches');
  };

  return (
    <div className={styles.fladoSearchPage}>
      
      {/* 1. HEADER SEARCH BAR */}
      <div className={styles.searchBarHeader}>
        <div className="container">
          <div className={styles.headerInner}>
            <Link href="/flado" className={styles.backBtn}>
              <FiChevronLeft size={20} /> Back
            </Link>
            
            <div className={styles.searchFieldWrapper}>
              <FiSearch className={styles.searchFieldIcon} />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for groceries, snacks, household items, tech & electronics..."
                className={styles.searchFieldInput}
              />
              {query.length > 0 && (
                <button onClick={handleClearSearch} className={styles.clearFieldBtn}>
                  <FiX size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '24px' }}>
        
        {/* If search query is empty: show Trending & Recents */}
        {!query.trim() ? (
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '800', color: 'var(--color-text-muted)' }}>
                    <FiClock /> RECENT SEARCHES
                  </span>
                  <button 
                    onClick={clearRecentSearches}
                    style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}
                  >
                    Clear All
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {recentSearches.map((keyword, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearchTrigger(keyword)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: '1.5px solid var(--color-border)',
                        backgroundColor: 'white',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Keywords */}
            <div style={{ marginBottom: '32px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '800', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                <FiTrendingUp style={{ color: '#059669' }} /> TRENDING SEARCHES
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {TRENDING_KEYWORDS.map((keyword, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearchTrigger(keyword)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: '1.5px solid var(--color-border)',
                      backgroundColor: 'white',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      color: 'var(--color-text-primary)',
                      cursor: 'pointer'
                    }}
                  >
                    🚀 {keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Link Categories Grid */}
            <div>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '800', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                <FiGrid /> EXPLORE DEPARTMENTS
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {fladoCategoriesData.slice(0, 6).map((cat, idx) => (
                  <Link
                    key={idx}
                    href={`/flado/categories/${cat.slug}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px',
                      backgroundColor: 'white',
                      border: '1.5px solid var(--color-border)',
                      borderRadius: '12px',
                      textDecoration: 'none'
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{cat.emoji}</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                      {cat.name.split(',')[0]}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* Search Results Grid */
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '900', margin: 0 }}>
                Search Results for &quot;{query}&quot;
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                Found {results.length} quick-commerce items delivered in 10-minutes.
              </p>
            </div>

            {results.length > 0 ? (
              <div className={styles.resultsGrid}>
                {results.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            ) : (
              <div className={styles.emptyStateCard}>
                <p style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--color-text-primary)' }}>
                  No matches found for &quot;{query}&quot;
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: '0 0 20px 0' }}>
                  Double check spelling or search by departments category instead.
                </p>
                <Link href="/flado/categories" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#059669',
                  color: 'white',
                  fontWeight: '850',
                  fontSize: '0.8rem',
                  padding: '10px 20px',
                  borderRadius: '30px',
                  textDecoration: 'none'
                }}>
                  Browse All Categories <FiArrowRight />
                </Link>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
