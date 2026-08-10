'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FiSearch, FiFrown, FiSliders, FiGrid, FiList, FiStar, FiRefreshCw, FiClock, FiTrendingUp, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

interface ProductItem {
  id: string;
  title: string;
  name?: string;
  slug?: string;
  description?: string;
  basePrice?: number;
  discountPrice?: number;
  price?: number;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  image?: string;
  category?: string;
  brand?: string;
  isQuickCommerce?: boolean;
  isFlado?: boolean;
  specifications?: Record<string, string>;
}

interface SearchResponse {
  query: string;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  products: ProductItem[];
}

interface SuggestionResponse {
  query: string;
  trending?: string[];
  categories?: string[];
  brands?: string[];
  products?: Array<{ id: string; title: string; category: string; price: number; imageUrl?: string }>;
}

const RECENT_SEARCHES_KEY = 'auramart_recent_searches_v1';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [productsList, setProductsList] = useState<ProductItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyOffers, setOnlyOffers] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('relevance');

  // UI States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Suggestions & Recent Searches
  const [suggestions, setSuggestions] = useState<SuggestionResponse | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>(['Apple', 'Samsung', 'Sony', 'Nike', 'boAt', 'L\'Oreal']);

  // Sync URL query when param changes
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    setSearchInput(q);
    setPage(1);
  }, [searchParams]);

  // Load recent searches on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Save query to recent searches
  const saveRecentSearch = useCallback((term: string) => {
    if (!term.trim()) return;
    const clean = term.trim();
    setRecentSearches((prev) => {
      const updated = [clean, ...prev.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  // Record Search Analytics (PHASE 5)
  const recordAnalytics = useCallback(async (searchTerm: string, resultsCount: number) => {
    if (!searchTerm) return;
    try {
      await fetch(`${API_BASE}/api/v1/products/search/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchTerm, resultCount: resultsCount }),
      });
    } catch {
      // Analytics failures should be silent
    }
  }, []);

  // Fetch search results from Backend API (PHASE 4)
  const executeSearch = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');

    try {
      const params = new URLSearchParams();
      if (query.trim()) params.append('q', query.trim());
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedBrands.length > 0) params.append('brand', selectedBrands.join(','));
      if (maxPrice < 150000) params.append('maxPrice', maxPrice.toString());
      if (minRating > 0) params.append('minRating', minRating.toString());
      
      // Map sort keys to backend API format
      let backendSort = 'relevance';
      if (sortBy === 'price-low') backendSort = 'price_asc';
      else if (sortBy === 'price-high') backendSort = 'price_desc';
      else if (sortBy === 'rating') backendSort = 'rating';
      else if (sortBy === 'newest') backendSort = 'newest';
      params.append('sortBy', backendSort);

      params.append('page', page.toString());
      params.append('limit', '12');

      const res = await fetch(`${API_BASE}/api/v1/products/search?${params.toString()}`);
      
      if (!res.ok) {
        throw new Error(`Search API returned HTTP ${res.status}`);
      }

      const data: SearchResponse = await res.json();
      
      let fetchedProducts = data.products || [];

      // Local client-side offer filter fallback if checked
      if (onlyOffers) {
        fetchedProducts = fetchedProducts.filter((p) => {
          const discount = p.discountPrice || 0;
          const base = p.basePrice || p.price || 0;
          return discount > 0 && discount < base;
        });
      }

      setProductsList(fetchedProducts);
      setTotalCount(data.total || fetchedProducts.length);
      setTotalPages(data.totalPages || Math.ceil((data.total || fetchedProducts.length) / 12) || 1);

      // Record analytics & recent search
      if (query.trim()) {
        saveRecentSearch(query.trim());
        recordAnalytics(query.trim(), data.total || fetchedProducts.length);
      }

      // Extract brands from results if available
      const brandsInResult = Array.from(
        new Set(fetchedProducts.map((p) => p.brand).filter(Boolean) as string[])
      );
      if (brandsInResult.length > 0) {
        setAvailableBrands(brandsInResult);
      }
    } catch (err: any) {
      console.warn('Backend search API failed, attempting catalog fallback:', err);
      // Fallback fetch to standard product list if search endpoint is unreachable
      try {
        const fallbackRes = await fetch(`${API_BASE}/api/v1/products?limit=12`);
        if (fallbackRes.ok) {
          const json = await fallbackRes.json();
          const fallbackData = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
          setProductsList(fallbackData);
          setTotalCount(fallbackData.length);
          setTotalPages(1);
        } else {
          setIsError(true);
          setErrorMessage('Could not connect to AuraMart search engine. Please check your network.');
        }
      } catch {
        setIsError(true);
        setErrorMessage('Could not connect to AuraMart search engine. Please check your network.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [query, selectedCategory, selectedBrands, maxPrice, minRating, onlyOffers, sortBy, page, saveRecentSearch, recordAnalytics]);

  // Debounced search trigger (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      executeSearch();
    }, 300);
    return () => clearTimeout(timer);
  }, [executeSearch]);

  // Fetch search suggestions when user types
  useEffect(() => {
    if (!searchInput.trim()) {
      setSuggestions(null);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/products/search/suggestions?q=${encodeURIComponent(searchInput.trim())}`);
        if (res.ok) {
          const data: SuggestionResponse = await res.json();
          setSuggestions(data);
        }
      } catch {
        // silent fallback
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const categories = [
    { name: 'All Categories', value: 'all' },
    { name: 'Electronics', value: 'electronics' },
    { name: 'Fashion', value: 'fashion' },
    { name: 'Beauty', value: 'beauty' },
    { name: 'Home & Kitchen', value: 'home' },
    { name: 'Flado Groceries', value: 'groceries' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setMaxPrice(150000);
    setSelectedBrands([]);
    setMinRating(0);
    setOnlyOffers(false);
    setSortBy('relevance');
    setPage(1);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  return (
    <div className={styles.searchPageContainer}>
      <div className="container">

        {/* Top Search Input & Autocomplete Bar */}
        <div style={{ marginBottom: '24px' }}>
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products, brands, categories..."
                style={{
                  width: '100%',
                  padding: '14px 44px 14px 18px',
                  borderRadius: '14px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '1rem',
                  outline: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748B',
                  }}
                >
                  <FiX size={18} />
                </button>
              )}
            </div>
            <button
              type="submit"
              style={{
                padding: '14px 28px',
                backgroundColor: '#7C3AED',
                color: 'white',
                border: 'none',
                borderRadius: '14px',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <FiSearch /> Search
            </button>
          </form>

          {/* Search Suggestions Dropdown */}
          {suggestions && (suggestions.categories?.length || suggestions.brands?.length || suggestions.products?.length) ? (
            <div
              style={{
                marginTop: '8px',
                padding: '16px',
                backgroundColor: 'white',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}
            >
              {suggestions.categories && suggestions.categories.length > 0 && (
                <div>
                  <h5 style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Categories
                  </h5>
                  {suggestions.categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setSelectedCategory(c);
                        setSuggestions(null);
                      }}
                      style={{
                        display: 'block',
                        background: 'none',
                        border: 'none',
                        color: '#7C3AED',
                        cursor: 'pointer',
                        padding: '4px 0',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}

              {suggestions.brands && suggestions.brands.length > 0 && (
                <div>
                  <h5 style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Brands
                  </h5>
                  {suggestions.brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => {
                        handleBrandChange(b);
                        setSuggestions(null);
                      }}
                      style={{
                        display: 'block',
                        background: 'none',
                        border: 'none',
                        color: '#0F172A',
                        cursor: 'pointer',
                        padding: '4px 0',
                        fontSize: '0.9rem',
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {/* Recent & Trending Searches Pill Bar */}
          {!query && (
            <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              {recentSearches.length > 0 && (
                <>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <FiClock /> Recent:
                  </span>
                  {recentSearches.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSearchInput(s);
                        router.push(`/search?q=${encodeURIComponent(s)}`);
                      }}
                      style={{
                        padding: '4px 12px',
                        backgroundColor: '#F1F5F9',
                        border: 'none',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        color: '#334155',
                        cursor: 'pointer',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                  <button
                    onClick={clearRecentSearches}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Clear
                  </button>
                </>
              )}

              <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: '12px' }}>
                <FiTrendingUp /> Trending:
              </span>
              {['AirPods', 'MacBook Air', 'Nike Shoes', 'Organic Milk', 'Smart TV'].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setSearchInput(t);
                    router.push(`/search?q=${encodeURIComponent(t)}`);
                  }}
                  style={{
                    padding: '4px 12px',
                    backgroundColor: '#F3E8FF',
                    color: '#6B21A8',
                    border: 'none',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Header Info */}
        <div className={styles.searchHeader}>
          <div className={styles.queryTitle}>
            <FiSearch className={styles.searchIcon} />
            <h1>
              Search results for <span>"{query || 'All Catalog'}"</span>
            </h1>
          </div>

          <div className={styles.headerControls}>
            <span className={styles.resultsCount}>{totalCount} items found</span>

            <div className={styles.viewToggleGroup}>
              <button
                onClick={() => setViewMode('grid')}
                className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.activeToggle : ''}`}
                aria-label="Grid View"
              >
                <FiGrid />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`${styles.toggleBtn} ${viewMode === 'list' ? styles.activeToggle : ''}`}
                aria-label="List View"
              >
                <FiList />
              </button>
            </div>
          </div>
        </div>

        {/* Main Search Layout */}
        <div className={styles.searchBody}>
          {/* Sidebar Filters */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h3><FiSliders /> Filters</h3>
              <button onClick={handleResetFilters} className={styles.resetBtn}>Reset All</button>
            </div>

            {/* Department Categories */}
            <div className={styles.filterGroup}>
              <h4>Categories</h4>
              <div className={styles.categoryPills}>
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    className={`${styles.categoryPill} ${selectedCategory === cat.value ? styles.activePill : ''}`}
                    onClick={() => {
                      setSelectedCategory(cat.value);
                      setPage(1);
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter range */}
            <div className={styles.filterGroup}>
              <h4>Max Price (₹)</h4>
              <div className={styles.priceFilterRange}>
                <input
                  type="range"
                  min="0"
                  max="150000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setPage(1);
                  }}
                  className={styles.rangeInput}
                />
                <div className={styles.priceValues}>
                  <span>₹0</span>
                  <span className={styles.currentPriceValue}>₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Sort Select */}
            <div className={styles.filterGroup}>
              <h4>Sort By</h4>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className={styles.sortSelect}
              >
                <option value="relevance">Popularity / Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>

            {/* Brands Checkbox List */}
            {availableBrands.length > 0 && (
              <div className={styles.filterGroup}>
                <h4>Brands</h4>
                <div className={styles.checkboxList}>
                  {availableBrands.map((brand) => (
                    <label key={brand} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                        className={styles.checkboxInput}
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Rating Filter */}
            <div className={styles.filterGroup}>
              <h4>Customer Rating</h4>
              <div className={styles.ratingList}>
                {[4, 3, 2].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => {
                      setMinRating(minRating === stars ? 0 : stars);
                      setPage(1);
                    }}
                    className={`${styles.ratingFilterBtn} ${minRating === stars ? styles.activeRatingFilter : ''}`}
                  >
                    <span>{stars}★ & above</span>
                    <div className={styles.starRow}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FiStar key={i} className={i < stars ? styles.starFilled : styles.starEmpty} />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Offers checkbox */}
            <div className={styles.filterGroup}>
              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  checked={onlyOffers}
                  onChange={(e) => {
                    setOnlyOffers(e.target.checked);
                    setPage(1);
                  }}
                  className={styles.toggleInput}
                />
                <span className={styles.toggleText}>Discounted Items Only</span>
              </label>
            </div>
          </aside>

          {/* Results Section */}
          <div className={styles.resultsGridWrapper}>
            {/* Loading Skeleton */}
            {isLoading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      height: '320px',
                      backgroundColor: '#F1F5F9',
                      borderRadius: '16px',
                      animation: 'pulse 1.5s infinite ease-in-out',
                    }}
                  />
                ))}
              </div>
            ) : isError ? (
              /* Error State */
              <div className={styles.emptyState}>
                <FiFrown className={styles.frownIcon} />
                <h2>Search Engine Communication Error</h2>
                <p>{errorMessage}</p>
                <button
                  onClick={executeSearch}
                  style={{
                    marginTop: '16px',
                    padding: '10px 20px',
                    backgroundColor: '#7C3AED',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <FiRefreshCw /> Retry Search
                </button>
              </div>
            ) : productsList.length > 0 ? (
              <>
                <div className={viewMode === 'grid' ? styles.resultsGrid : styles.resultsList}>
                  {productsList.map((product) => (
                    <div key={product.id} className={viewMode === 'list' ? styles.listItemWrapper : ''}>
                      <ProductCard product={product as any} />
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '32px' }}>
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: page <= 1 ? '#F1F5F9' : 'white',
                        cursor: page <= 1 ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <FiChevronLeft /> Previous
                    </button>
                    <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: '600' }}>
                      Page {page} of {totalPages}
                    </span>
                    <button
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: page >= totalPages ? '#F1F5F9' : 'white',
                        cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      Next <FiChevronRight />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className={styles.emptyState}>
                <FiFrown className={styles.frownIcon} />
                <h2>No results found matching your search</h2>
                <p>Verify spelling, adjust price filters, or select another department category.</p>
                <button
                  onClick={handleResetFilters}
                  style={{
                    marginTop: '16px',
                    padding: '10px 20px',
                    backgroundColor: '#0F172A',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading search query results...</p>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
