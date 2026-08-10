'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FiSearch, FiAward, FiArrowRight, FiGrid, FiPackage } from 'react-icons/fi';
import { brandsApi, BrandApiDto } from '@/lib/api';
import styles from './page.module.css';

// FEAT-003: Brands directory now fully dynamic — brands fetched from backend /brands endpoint.
// No more hardcoded brandsData; server-authoritative brand catalog.

const CATEGORY_TABS = [
  { label: 'All Brands', value: 'all' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Beauty', value: 'beauty' },
  { label: 'Groceries', value: 'groceries' },
  { label: 'Home', value: 'home' },
  { label: 'Sports', value: 'sports' },
];

export default function BrandsDirectoryPage() {
  const [brands, setBrands] = useState<BrandApiDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchVal, setSearchVal] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [meta, setMeta] = useState<{ total: number; hasNextPage: boolean }>({ total: 0, hasNextPage: false });
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 24;

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchVal), 300);
    return () => clearTimeout(timer);
  }, [searchVal]);

  // Reset to page 1 when search/tab changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeTab]);

  // Fetch brands from backend API (FEAT-003: server-authoritative)
  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await brandsApi.getAll({
        search: debouncedSearch || undefined,
        page,
        pageSize: PAGE_SIZE,
      });

      // Client-side tab filter (by category field in description or name heuristic)
      // The backend Brand entity doesn't have a categories field, so we filter
      // client-side on the result set using a name/description match heuristic.
      // Full category-brand taxonomy is served via /products?brand=X&category=Y.
      let filtered = result.data;
      if (activeTab !== 'all') {
        filtered = result.data.filter(b =>
          b.description?.toLowerCase().includes(activeTab) ||
          b.name?.toLowerCase().includes(activeTab)
        );
      }

      if (page === 1) {
        setBrands(filtered);
      } else {
        setBrands(prev => [...prev, ...filtered]);
      }
      setMeta({ total: result.meta.total, hasNextPage: result.meta.hasNextPage });
    } catch (err) {
      setError('Could not load brands. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page, activeTab]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

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
              id="brand-search-input"
              type="text"
              placeholder="Search official brand stores..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className={styles.searchInput}
              aria-label="Search brands"
            />
          </div>

          <div className={styles.tabsRow} role="tablist" aria-label="Brand categories">
            {CATEGORY_TABS.map((c) => (
              <button
                key={c.value}
                id={`brand-tab-${c.value}`}
                role="tab"
                aria-selected={activeTab === c.value}
                onClick={() => setActiveTab(c.value)}
                className={`${styles.tabBtn} ${activeTab === c.value ? styles.activeTab : ''}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && brands.length === 0 && (
          <div className={styles.brandsGrid} aria-busy="true" aria-label="Loading brands">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`${styles.brandCard} ${styles.skeletonCard}`}>
                <div className={styles.skeletonLogo} />
                <div className={styles.skeletonMeta}>
                  <div className={styles.skeletonLine} style={{ width: '60%' }} />
                  <div className={styles.skeletonLine} style={{ width: '80%' }} />
                  <div className={styles.skeletonLine} style={{ width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className={styles.noResults}>
            <p>{error}</p>
            <button className={styles.retryBtn} onClick={() => fetchBrands()}>Retry</button>
          </div>
        )}

        {/* Brand Grid */}
        {!loading || brands.length > 0 ? (
          <>
            {brands.length > 0 ? (
              <>
                <p className={styles.resultsCount}>
                  <FiGrid style={{ marginRight: 6 }} />
                  {meta.total} brand{meta.total !== 1 ? 's' : ''} available
                </p>
                <div className={styles.brandsGrid} id="brands-grid">
                  {brands.map((brand: BrandApiDto) => (
                    <Link
                      href={`/brands/${brand.slug}`}
                      key={brand.slug}
                      className={styles.brandCard}
                      id={`brand-card-${brand.slug}`}
                    >
                      <div className={styles.brandLogoWrapper}>
                        {brand.logoUrl ? (
                          <img src={brand.logoUrl} alt={brand.name} className={styles.brandLogo} />
                        ) : (
                          <div className={styles.brandLogoPlaceholder}>
                            <FiPackage size={32} />
                          </div>
                        )}
                      </div>
                      <div className={styles.brandMeta}>
                        <h3>{brand.name}</h3>
                        {brand.description && (
                          <p className={styles.brandStoryShort}>
                            {brand.description.length > 90
                              ? brand.description.substring(0, 90) + '...'
                              : brand.description}
                          </p>
                        )}
                        <div className={styles.brandProductCount}>
                          <FiPackage size={12} />
                          <span>{brand.productCount} product{brand.productCount !== 1 ? 's' : ''}</span>
                        </div>
                        <div className={styles.visitCta}>
                          <span>Visit Store</span> <FiArrowRight />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Load more pagination */}
                {meta.hasNextPage && (
                  <div className={styles.loadMoreWrapper}>
                    <button
                      id="brands-load-more"
                      className={styles.loadMoreBtn}
                      onClick={() => setPage(p => p + 1)}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Load More Brands'}
                    </button>
                  </div>
                )}
              </>
            ) : !loading && !error ? (
              <div className={styles.noResults}>
                <p>No official brand flagship stores match your filters.</p>
                {(searchVal || activeTab !== 'all') && (
                  <button
                    className={styles.retryBtn}
                    onClick={() => { setSearchVal(''); setActiveTab('all'); }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
