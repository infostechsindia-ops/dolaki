'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiSearch, FiFrown, FiSliders, FiGrid, FiList, FiStar } from 'react-icons/fi';
import { products, Product } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevance');

  // Advanced filters
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyOffers, setOnlyOffers] = useState<boolean>(false);

  // View state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Unique brand lists matching query
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  // Filter products based on search query and advanced filters
  useEffect(() => {
    let results = products.filter((product) => {
      const matchName = product.name.toLowerCase().includes(query.toLowerCase());
      const matchDesc = product.description.toLowerCase().includes(query.toLowerCase());
      const matchCat = product.category.toLowerCase().includes(query.toLowerCase());
      const matchSub = product.subCategory.toLowerCase().includes(query.toLowerCase());
      return matchName || matchDesc || matchCat || matchSub;
    });

    // Extract unique brands matching query
    const brands = Array.from(new Set(results.map(p => p.specifications.Brand || p.specifications.BrandName || '').filter(Boolean)));
    setAvailableBrands(brands);

    // Apply category filter
    if (selectedCategory !== 'all') {
      results = results.filter((p) => p.category === selectedCategory);
    }

    // Apply advanced filters
    results = results.filter(p => p.price <= maxPrice);

    if (selectedBrands.length > 0) {
      results = results.filter(p => {
        const b = (p.specifications.Brand || p.specifications.BrandName || '').toLowerCase().trim();
        return selectedBrands.some(brand => brand.toLowerCase().trim() === b);
      });
    }

    if (minRating > 0) {
      results = results.filter(p => p.rating >= minRating);
    }

    if (onlyOffers) {
      results = results.filter(p => p.originalPrice && p.originalPrice > p.price);
    }

    // Apply sorting
    if (sortBy === 'price-low') {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      results.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(results);
  }, [query, selectedCategory, sortBy, maxPrice, selectedBrands, minRating, onlyOffers]);

  const categories = [
    { name: 'All Categories', value: 'all' },
    { name: 'Electronics', value: 'electronics' },
    { name: 'Fashion', value: 'fashion' },
    { name: 'Beauty', value: 'beauty' },
    { name: 'Home & Kitchen', value: 'home' },
    { name: 'Flado Groceries', value: 'groceries' },
  ];

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setMaxPrice(150000);
    setSelectedBrands([]);
    setMinRating(0);
    setOnlyOffers(false);
    setSortBy('relevance');
  };

  return (
    <div className={styles.searchPageContainer}>
      <div className="container">
        {/* Search Header Info */}
        <div className={styles.searchHeader}>
          <div className={styles.queryTitle}>
            <FiSearch className={styles.searchIcon} />
            <h1>
              Search results for <span>"{query || 'All Categories'}"</span>
            </h1>
          </div>
          
          <div className={styles.headerControls}>
            <span className={styles.resultsCount}>{filteredProducts.length} items found</span>
            
            {/* Grid / List View Toggle */}
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

        {/* Filters and Grid */}
        <div className={styles.searchBody}>
          {/* Sidebar Filters */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h3><FiSliders /> Filters</h3>
              <button onClick={handleResetFilters} className={styles.resetBtn}>Reset All</button>
            </div>

            {/* Department Category list */}
            <div className={styles.filterGroup}>
              <h4>Categories</h4>
              <div className={styles.categoryPills}>
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    className={`${styles.categoryPill} ${selectedCategory === cat.value ? styles.activePill : ''}`}
                    onClick={() => setSelectedCategory(cat.value)}
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
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
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
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
              >
                <option value="relevance">Popularity / Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
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

            {/* Rating Filter Selection */}
            <div className={styles.filterGroup}>
              <h4>Customer Rating</h4>
              <div className={styles.ratingList}>
                {[4, 3, 2].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setMinRating(stars)}
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
                  onChange={(e) => setOnlyOffers(e.target.checked)}
                  className={styles.toggleInput}
                />
                <span className={styles.toggleText}>Discounted Items Only</span>
              </label>
            </div>
          </aside>

          {/* Results Grid */}
          <div className={styles.resultsGridWrapper}>
            {filteredProducts.length > 0 ? (
              <div className={viewMode === 'grid' ? styles.resultsGrid : styles.resultsList}>
                {filteredProducts.map((product) => (
                  <div key={product.id} className={viewMode === 'list' ? styles.listItemWrapper : ''}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className={styles.emptyState}>
                <FiFrown className={styles.frownIcon} />
                <h2>No results found matching your search</h2>
                <p>Verify spelling, adjust price filters, or check out our recommended bestsellers below.</p>
                
                <div className={styles.recommendations}>
                  <h3>Popular Customer Bestsellers</h3>
                  <div className={styles.recGrid}>
                    {products
                      .filter((p) => p.rating >= 4.7 && p.category !== 'groceries')
                      .slice(0, 4)
                      .map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                  </div>
                </div>
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
    <Suspense fallback={
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading search query results...</p>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
