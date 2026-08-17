'use client';

import React, { use, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiChevronLeft, FiShoppingBag, FiInfo, FiAward, FiChevronRight, FiChevronDown, FiPackage } from 'react-icons/fi';
import { brandsApi, BrandApiDto } from '@/lib/api';
import { Product } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

// FEAT-003: Brand store page is now fully dynamic.
// Brand is fetched via GET /brands/:slug (server-authoritative).
// Products are fetched via GET /products?brand=:slug&page=X with real pagination.
// Nonexistent/inactive brand slugs result in 404 (notFound()).

interface BrandStorePageProps {
  params: Promise<{ slug: string }>;
}

const CATEGORY_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Beauty', value: 'beauty' },
  { label: 'Groceries', value: 'groceries' },
  { label: 'Home', value: 'home' },
  { label: 'Sports', value: 'sports' },
];

const PAGE_SIZE = 16;

export default function BrandStorePage({ params }: BrandStorePageProps) {
  const { slug } = use(params);

  const [brand, setBrand] = useState<BrandApiDto | null>(null);
  const [brandNotFound, setBrandNotFound] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productMeta, setProductMeta] = useState<{ total: number; hasNextPage: boolean; page: number }>({
    total: 0,
    hasNextPage: false,
    page: 1,
  });
  const [categoryFilter, setCategoryFilter] = useState('');
  const [productPage, setProductPage] = useState(1);
  const [loadingBrand, setLoadingBrand] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [otherBrands, setOtherBrands] = useState<BrandApiDto[]>([]);

  // Load brand from backend (server-authoritative — 404 if inactive or nonexistent)
  useEffect(() => {
    const fetchBrand = async () => {
      setLoadingBrand(true);
      try {
        const result = await brandsApi.getBySlug(slug);
        if (!result) {
          setBrandNotFound(true);
        } else {
          setBrand(result as BrandApiDto);
        }
      } catch (err: any) {
        // 404 from backend = brand not found or inactive
        if (err?.statusCode === 404 || err?.message?.includes('404')) {
          setBrandNotFound(true);
        } else {
          // Network/unknown error — brand might exist; fail open with not-found
          setBrandNotFound(true);
        }
      } finally {
        setLoadingBrand(false);
      }
    };
    fetchBrand();
  }, [slug]);

  // Load products with brand + optional category filter, pagination
  const fetchProducts = useCallback(async (page: number, category: string, append = false) => {
    setLoadingProducts(true);
    try {
      const result = await brandsApi.getProductsByBrand(slug, {
        category: category || undefined,
        page,
        pageSize: PAGE_SIZE,
      });
      const mapped = (result.data || []).map((bp: any) => ({
        ...bp,
        id: bp.id,
        name: bp.title || bp.name || '',
        price: bp.discountPrice ?? bp.basePrice ?? 0,
        originalPrice: bp.basePrice ?? 0,
        image: bp.imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
        rating: bp.rating ?? 4.5,
        reviewsCount: bp.reviewCount ?? 0,
        category: bp.category || '',
        brand: bp.brandId || slug,
      }));

      if (append) {
        setProducts(prev => [...prev, ...mapped]);
      } else {
        setProducts(mapped);
      }
      setProductMeta({
        total: result.meta?.total ?? mapped.length,
        hasNextPage: result.meta?.hasNextPage ?? false,
        page,
      });
    } catch {
      if (!append) setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, [slug]);

  // Reset and reload when category filter changes
  useEffect(() => {
    setProductPage(1);
    setProducts([]);
    if (!loadingBrand) fetchProducts(1, categoryFilter, false);
  }, [categoryFilter, loadingBrand]);

  // Load more products
  const handleLoadMore = () => {
    const nextPage = productPage + 1;
    setProductPage(nextPage);
    fetchProducts(nextPage, categoryFilter, true);
  };

  // Load other brands for sidebar
  useEffect(() => {
    brandsApi.getAll({ pageSize: 5 }).then(result => {
      setOtherBrands((result.data || []).filter((b: BrandApiDto) => b.slug !== slug).slice(0, 4));
    }).catch(() => {});
  }, [slug]);

  // Not found
  if (!loadingBrand && brandNotFound) {
    notFound();
  }

  // Loading state
  if (loadingBrand || !brand) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p>Loading brand store...</p>
      </div>
    );
  }

  return (
    <div className={styles.brandStorePage}>
      {/* Brand Header Hero Banner */}
      <div className={styles.brandHero}>
        <div className="container">
          <Link href="/brands" className={styles.backBtn}>
            <FiChevronLeft /> Return to Brands
          </Link>
          <div className={styles.brandInfoBlock}>
            <div className={styles.brandLogoBox}>
              {brand.logoUrl ? (
                <img src={brand.logoUrl} alt={brand.name} className={styles.brandLogo} />
              ) : (
                <div className={styles.brandLogoPlaceholder}><FiPackage size={40} /></div>
              )}
            </div>
            <div className={styles.brandTitles}>
              <span className={styles.officialBadge}>
                <FiAward size={10} style={{ marginRight: '4px' }} /> Flagship Brand Store
              </span>
              <h1>{brand.name}</h1>
              {brand.description && <p className={styles.tagline}>{brand.description}</p>}
              <p className={styles.productCountBadge}>
                <FiShoppingBag size={13} style={{ marginRight: 5 }} />
                {brand.productCount} product{brand.productCount !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '45px' }}>
        <div className={styles.gridContainer}>
          {/* Main Catalog Column */}
          <div className={styles.catalogCol}>

            {/* Category filter chips */}
            <div className={styles.filterChips} role="group" aria-label="Filter by category">
              {CATEGORY_FILTERS.map(f => (
                <button
                  key={f.value}
                  id={`brand-cat-filter-${f.value || 'all'}`}
                  className={`${styles.filterChip} ${categoryFilter === f.value ? styles.activeChip : ''}`}
                  onClick={() => setCategoryFilter(f.value)}
                  aria-pressed={categoryFilter === f.value}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Catalog header */}
            <div className={styles.catalogHeader}>
              <h2 id="catalog-heading">
                {brand.name} Catalog
                {categoryFilter && ` — ${CATEGORY_FILTERS.find(f => f.value === categoryFilter)?.label}`}
                {' '}({productMeta.total} Items)
              </h2>
              <p>Authentic products sourced directly from authorized brand channel distributors.</p>
            </div>

            {/* Product grid */}
            {loadingProducts && products.length === 0 ? (
              <div className={styles.loadingGrid}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={styles.skeletonProductCard} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className={styles.productsGrid} aria-labelledby="catalog-heading">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {productMeta.hasNextPage && (
                  <div className={styles.loadMoreWrapper}>
                    <button
                      id="brand-products-load-more"
                      className={styles.loadMoreBtn}
                      onClick={handleLoadMore}
                      disabled={loadingProducts}
                    >
                      {loadingProducts ? 'Loading...' : (
                        <><FiChevronDown style={{ marginRight: 6 }} /> Load More Products</>
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.noProducts}>
                <FiInfo size={32} />
                <p>
                  No products are currently listed in the {brand.name} official{categoryFilter ? ` ${categoryFilter}` : ''} catalog.
                </p>
                {categoryFilter && (
                  <button
                    className={styles.clearFilterBtn}
                    onClick={() => setCategoryFilter('')}
                  >
                    Show all {brand.name} products
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className={styles.sidebarCol}>
            <div className={styles.promoWidget}>
              <h4>⚡ AuraMart Certified Partner</h4>
              <p>All items from {brand.name} store come with 100% replacement warranty and secure payments.</p>
              <span className={styles.couponTag}>
                Use Coupon Code: <strong>{brand.name.toUpperCase().replace(/\s+/g, '')}10</strong> for extra 10% off.
              </span>
            </div>

            {/* Related brands */}
            {otherBrands.length > 0 && (
              <div className={styles.relatedBrandsWidget}>
                <h3>Other Official Stores</h3>
                <div className={styles.brandsListCompact}>
                  {otherBrands.map(b => (
                    <Link href={`/brands/${b.slug}`} key={b.slug} className={styles.brandRowItem} id={`sidebar-brand-${b.slug}`}>
                      {b.logoUrl ? (
                        <img src={b.logoUrl} alt={b.name} />
                      ) : (
                        <div className={styles.sidebarBrandPlaceholder}><FiPackage size={18} /></div>
                      )}
                      <div>
                        <h5>{b.name}</h5>
                        <span>{b.productCount} products</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
