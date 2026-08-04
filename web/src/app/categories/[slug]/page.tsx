'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiFilter, FiChevronDown, FiAlertCircle, FiStar, FiZap, FiPercent, FiAward, FiArrowRight, FiInfo } from 'react-icons/fi';
import { categoryThemesData, CategoryThemeConfig } from '@/data/categoryThemes';
import { products as localProducts, Product } from '@/data/products';
import { brandsData } from '@/data/brands';
import { categoryBrandingData } from '@/data/categoryBranding';
import CategoryRenderer from '@/components/CategoryRenderer';
import ProductCard from '@/components/ProductCard';
import Skeleton from '@/components/ui/Skeleton';
import styles from './page.module.css';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Helper to resolve common subcategories for pills
const getSubcategories = (categorySlug: string): string[] => {
  switch (categorySlug) {
    case 'electronics':
      return ['All', 'Smartphones', 'Laptops', 'Audio', 'Wearables', 'Gaming'];
    case 'fashion':
      return ['All', 'Mens Wear', 'Womens Wear', 'Ethnic Wear', 'Sneakers', 'Accessories'];
    case 'beauty':
      return ['All', 'Skincare', 'Serums', 'Creams', 'Cosmetics', 'Haircare'];
    case 'home':
      return ['All', 'Kitchenware', 'Furniture', 'Lighting', 'Decor', 'Utensils'];
    case 'groceries':
      return ['All', 'Fresh Fruits', 'Fresh Veggies', 'Dairy & Eggs', 'Bakery', 'Snacks'];
    case 'sports':
      return ['All', 'Fitness Equipment', 'Outdoor Gear', 'Footballs', 'Rackets', 'Athletic Wear'];
    default:
      return ['All', 'Best Sellers', 'New Arrivals', 'Clearance'];
  }
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);
  const [themeConfig, setThemeConfig] = useState<CategoryThemeConfig | null>(null);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubcat, setActiveSubcat] = useState('All');

  // Filter states
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyOffers, setOnlyOffers] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('relevance');

  // Available brands in this category
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  // Fetch category layout theme + live products
  useEffect(() => {
    const config = categoryThemesData.find((c) => c.categoryId === slug);
    if (!config) {
      setLoading(false);
      return;
    }
    setThemeConfig(config);

    const loadData = async () => {
      let fetchedProducts: Product[] = [];
      try {
        const res = await fetch('http://localhost:5000/api/products');
        if (res.ok) {
          const raw = await res.json();
          fetchedProducts = raw.map((bp: any) => ({
            ...bp,
            name: bp.title || '',
            price: bp.discountPrice ?? bp.basePrice,
            originalPrice: bp.basePrice,
            image: bp.imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
            rating: bp.rating ?? 4.5,
            reviewsCount: bp.reviewCount ?? 12,
            category: bp.category || 'groceries',
            subCategory: bp.subCategory || '',
            brand: bp.brand || ''
          }));
        } else {
          fetchedProducts = localProducts;
        }
      } catch (e) {
        console.log('Category page backend products load failed, falling back to mock.', e);
        fetchedProducts = localProducts;
      }

      // Filter to this category
      const categoryProducts = fetchedProducts.filter(p => p.category === slug);
      setProductsList(categoryProducts);

      // Extract brands
      const brands = Array.from(new Set(categoryProducts.map(p => p.brand).filter(Boolean)));
      setAvailableBrands(brands);

      // Set max price
      if (categoryProducts.length > 0) {
        const prices = categoryProducts.map(p => p.price);
        setMaxPrice(Math.max(...prices, 1000));
      }
      setLoading(false);
    };

    loadData();
  }, [slug]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const resetFilters = () => {
    setSelectedBrands([]);
    setMinRating(0);
    setOnlyOffers(false);
    if (productsList.length > 0) {
      setMaxPrice(Math.max(...productsList.map(p => p.price)));
    }
  };

  if (loading) {
    return (
      <div className={styles.categoryPage}>
        <div className={styles.categoryHeader} style={{ padding: '30px 0' }}>
          <div className="container">
            <Skeleton height={36} width={280} style={{ marginBottom: '12px' }} />
            <Skeleton height={18} width={160} style={{ marginBottom: '20px' }} />
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} height={32} width={100} style={{ borderRadius: '20px' }} />
              ))}
            </div>
          </div>
        </div>

        <div className="container" style={{ marginTop: '40px' }}>
          <div className={styles.layoutGrid}>
            <aside className={styles.sidebar} style={{ padding: '20px' }}>
              <Skeleton height={24} width={100} style={{ marginBottom: '24px' }} />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ marginBottom: '28px' }}>
                  <Skeleton height={16} width={80} style={{ marginBottom: '12px' }} />
                  <Skeleton height={12} width="100%" style={{ marginBottom: '6px' }} />
                  <Skeleton height={12} width="60%" />
                </div>
              ))}
            </aside>

            <main className={styles.mainContent}>
              <Skeleton height={28} width={220} style={{ marginBottom: '24px' }} />
              <div className={styles.productsGrid}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} style={{ border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px', backgroundColor: 'white' }}>
                    <Skeleton height={140} width="100%" style={{ marginBottom: '16px', borderRadius: '8px' }} />
                    <Skeleton height={16} width="90%" style={{ marginBottom: '8px' }} />
                    <Skeleton height={12} width="40%" style={{ marginBottom: '16px' }} />
                    <Skeleton height={24} width="50%" style={{ borderRadius: '4px' }} />
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (!themeConfig) {
    notFound();
  }

  // Get custom branding configuration
  const branding = categoryBrandingData[slug];

  // Filter products for the catalog grid
  let filteredProducts = productsList.filter(p => {
    // Subcategory pill filter
    if (activeSubcat !== 'All') {
      const pSub = (p.subCategory || '').toLowerCase();
      const match = pSub.includes(activeSubcat.toLowerCase()) || 
                    activeSubcat.toLowerCase().includes(pSub);
      if (!match) return false;
    }

    // Price Filter
    if (p.price > maxPrice) return false;

    // Brand Filter
    if (selectedBrands.length > 0) {
      if (!p.brand || !selectedBrands.some(b => b.toLowerCase().trim() === p.brand.toLowerCase().trim())) {
        return false;
      }
    }

    // Rating Filter
    if (p.rating < minRating) return false;

    // Offers Filter
    if (onlyOffers && (!p.originalPrice || p.originalPrice <= p.price)) {
      return false;
    }

    return true;
  });

  // Sort
  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  // Determine sponsored product
  const sponsoredProduct = productsList.find(p => p.rating >= 4.5);

  // New launches products list
  const newLaunchesList = branding 
    ? productsList.filter(p => branding.newLaunchIds.includes(p.id)) 
    : [];

  return (
    <div className={styles.categoryPage} style={{ backgroundColor: themeConfig.theme.backgroundColor }}>
      {/* Category Header Banner */}
      <div className={styles.categoryHeader}>
        <div className="container">
          <div className={styles.headerInner}>
            <div className={styles.titleInfo}>
              <h1 className={styles.categoryTitle} style={{ color: themeConfig.theme.primaryColor }}>
                {branding ? branding.heroTitle : themeConfig.title}
              </h1>
              <span className="section-label" style={{ background: `${themeConfig.theme.primaryColor}15`, color: themeConfig.theme.primaryColor }}>
                {branding ? branding.heroSubtitle : 'AuraMart Curated Flagship Mall'}
              </span>
            </div>
            
            <div className={styles.headerRight}>
              <div className={styles.sortWrapper}>
                <span className={styles.sortLabel}>Sort By:</span>
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
            </div>
          </div>

          {/* Sub-category Pills horizontal scroll */}
          <div className={styles.subcatPillsRow}>
            {getSubcategories(slug).map(pill => (
              <button
                key={pill}
                onClick={() => setActiveSubcat(pill)}
                className={`${styles.subcatPill} ${activeSubcat === pill ? styles.subcatPillActive : ''}`}
                style={{
                  '--pill-active-bg': themeConfig.theme.primaryColor,
                  '--pill-active-text': '#ffffff'
                } as React.CSSProperties}
              >
                {pill}
              </button>
            ))}
          </div>

          {/* TOP BRANDS / SPONSORS STRIP */}
          {branding && branding.sponsorBrands.length > 0 && (
            <div className={styles.topBrandsContainer}>
              <h4 className={styles.sectionLabelSmall}>Official Flagship Brand Partners</h4>
              <div className={styles.brandsListScroll}>
                {branding.sponsorBrands.map(b => (
                  <Link href={`/brands/${b.slug}`} key={b.slug} className={styles.brandLogoCard}>
                    <img src={b.logo} alt={b.name} />
                    <span>{b.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container">
        {/* OFFER STRIP ROWS */}
        {branding && branding.offerStrip.length > 0 && (
          <div className={styles.offersRowScroll}>
            {branding.offerStrip.map((offerText, i) => (
              <div key={i} className={styles.offerTextChip} style={{ borderLeftColor: themeConfig.theme.primaryColor }}>
                <FiPercent style={{ color: themeConfig.theme.primaryColor, marginRight: '6px' }} />
                <span>{offerText}</span>
              </div>
            ))}
          </div>
        )}

        {/* DUAL PROMO BANNER AD ROW */}
        {branding && branding.adBanners.length > 0 && (
          <div className={styles.dualBannersGrid}>
            {branding.adBanners.map((ad, i) => (
              <div 
                key={i} 
                className={styles.adBannerCard}
                style={{ 
                  backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.4) 100%), url(${ad.imageUrl})`,
                  borderLeftColor: ad.accentColor
                }}
              >
                <div className={styles.adCardContent}>
                  <h3>{ad.title}</h3>
                  <p>{ad.subtitle}</p>
                  <Link href={ad.link} className={styles.adCtaBtn} style={{ backgroundColor: ad.accentColor }}>
                    {ad.ctaText} <FiArrowRight style={{ marginLeft: '6px' }} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BRAND SPOTLIGHT SECTION */}
        {branding && branding.brandSpotlight && (
          <div 
            className={styles.spotlightContainer}
            style={{ 
              backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.5) 60%, transparent 100%), url(${branding.brandSpotlight.bannerUrl})`,
              borderLeftColor: branding.brandSpotlight.primaryColor
            }}
          >
            <div className={styles.spotlightDetails}>
              <div className={styles.spotlightHeader}>
                <img src={branding.brandSpotlight.logo} alt={branding.brandSpotlight.name} />
                <div>
                  <span className={styles.spotlightTag}>OFFICIAL BRAND SPOTLIGHT</span>
                  <h3>{branding.brandSpotlight.name}</h3>
                </div>
              </div>
              <p>{branding.brandSpotlight.tagline}</p>
              <Link href={`/brands/${branding.brandSpotlight.slug}`} className={styles.spotlightCta}>
                Enter Official Flagship Store <FiArrowRight style={{ marginLeft: '6px' }} />
              </Link>
            </div>
          </div>
        )}

        {/* NEW LAUNCHES SECTION */}
        {newLaunchesList.length > 0 && (
          <div className={styles.newLaunchesWrapper}>
            <div className={styles.launchesHeader}>
              <FiZap className={styles.zapIcon} style={{ color: themeConfig.theme.primaryColor }} />
              <div>
                <h3>✨ New Launches in {themeConfig.title}</h3>
                <p>Be the first to experience the latest releases from official channels.</p>
              </div>
            </div>
            <div className={styles.launchesScrollRow}>
              {newLaunchesList.map(prod => (
                <div key={prod.id} className={styles.launchCardWrapper}>
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MAIN LAYOUT: SIDEBAR + PRODUCTS CATALOG */}
        <div className={styles.layoutGrid}>
          {/* Filter Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h3>Filters</h3>
              <button onClick={resetFilters} className={styles.resetBtn}>Reset All</button>
            </div>

            {/* Price Filter */}
            <div className={styles.filterSection}>
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

            {/* Brands Filter */}
            {availableBrands.length > 0 && (
              <div className={styles.filterSection}>
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
            <div className={styles.filterSection}>
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

            {/* Offers Toggle */}
            <div className={styles.filterSection} style={{ borderBottom: 'none' }}>
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

            {/* Sponsored Ad Panel inside Sidebar */}
            {sponsoredProduct && (
              <div className={styles.sponsoredSidebarAd}>
                <span className={styles.adTag}>Sponsored Ad</span>
                <Link href={`/products/${sponsoredProduct.id}`} className={styles.adLink}>
                  <img src={sponsoredProduct.image || (sponsoredProduct.images && sponsoredProduct.images[0]) || ''} alt={sponsoredProduct.name} />
                  <h5>{sponsoredProduct.name}</h5>
                  <div className={styles.adPriceRow}>
                    <span className={styles.adPrice}>₹{sponsoredProduct.price}</span>
                    <span className={styles.adRating}>★ {sponsoredProduct.rating}</span>
                  </div>
                </Link>
              </div>
            )}
          </aside>

          {/* Main Content Area */}
          <main className={styles.mainContent}>
            {/* Category Blocks Renderer */}
            <CategoryRenderer 
              config={themeConfig} 
              filters={{
                maxPrice,
                selectedBrands,
                minRating,
                onlyOffers,
                sortBy
              }}
            />

            {/* Dynamic Products Catalog Grid */}
            <div className={styles.catalogBlock} style={{ marginTop: '30px' }}>
              <div className={styles.catalogHeadingRow}>
                <h3>Shop All {themeConfig.title} ({filteredProducts.length} Items)</h3>
                <p>Showing curated results matching your filters.</p>
              </div>
              
              {filteredProducts.length > 0 ? (
                <div className={styles.productsGrid}>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className={styles.noResultsBox}>
                  <FiAlertCircle size={28} />
                  <p>No products matching your search criteria were found in this category.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
