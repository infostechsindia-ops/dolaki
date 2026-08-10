'use client';

import React, { useState, useEffect } from 'react';
import DeliveryPromiseCard from '@/components/delivery/DeliveryPromiseCard';
import ProductGrid from '@/components/plp/ProductGrid';
import ProductSort from '@/components/plp/ProductSort';
import ProductPagination from '@/components/plp/ProductPagination';
import PromotionalBanner from '@/components/home/PromotionalBanner';
import { PageContainer, Container } from '@/components/layout/LayoutPrimitives';
import styles from './page.module.css';

export interface QuickCatalogPageProps {
  initialData?: any;
  locationPincode?: string;
  locationCoords?: { lat: number; lng: number };
}

export default function FladoQuickCatalogPage({
  initialData,
  locationPincode = '400050',
  locationCoords = { lat: 19.0596, lng: 72.8295 },
}: QuickCatalogPageProps) {
  const [catalog, setCatalog] = useState<any>(initialData || null);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [pincode, setPincode] = useState<string>(locationPincode);
  const [categorySlug, setCategorySlug] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortMode, setSortMode] = useState<string>('relevance');
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    if (initialData) return;

    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          lat: String(locationCoords.lat),
          lng: String(locationCoords.lng),
          pincode,
          sort: sortMode,
          page: String(currentPage),
          limit: '12',
        });
        if (categorySlug) params.set('categorySlug', categorySlug);
        if (searchQuery) params.set('q', searchQuery);

        const res = await fetch(`/api/v1/flado/catalog?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted) setCatalog(json.data || json);
        } else {
          if (isMounted) {
            setCatalog({
              deliveryPromise: {
                isServiceable: true,
                status: 'SERVICEABLE',
                fulfillmentNodeName: 'Bandra Organic Grocers',
              },
              activeShop: { id: 'shop-1', shopName: 'Bandra Organic Grocers', isOpen: true },
              categories: [
                { name: 'Veggies & Fruits', slug: 'fruits-vegetables', itemCount: 12 },
                { name: 'Dairy & Bread', slug: 'dairy-bread-eggs', itemCount: 8 },
              ],
              products: [],
              pagination: { total: 0, page: 1, pageSize: 12, totalPages: 0, hasNextPage: false },
              query: { sort: sortMode },
            });
          }
        }
      } catch (e) {
        if (isMounted) {
          setCatalog({
            deliveryPromise: { isServiceable: true, status: 'SERVICEABLE' },
            categories: [],
            products: [],
            pagination: { total: 0, page: 1, pageSize: 12, totalPages: 0, hasNextPage: false },
            query: { sort: sortMode },
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, [pincode, locationCoords.lat, locationCoords.lng, categorySlug, searchQuery, sortMode, currentPage, initialData]);

  const handleLocationSubmit = (newPincode: string) => {
    setPincode(newPincode);
  };

  const handleCategorySelect = (slug: string) => {
    setCategorySlug((prev) => (prev === slug ? '' : slug));
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSortMode(newSort);
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const isUnserviceable = catalog?.deliveryPromise && !catalog.deliveryPromise.isServiceable;
  const isStoreClosed = catalog?.deliveryPromise?.reasonCode === 'STORE_CLOSED';

  return (
    <PageContainer>
      <Container size="2xl">
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem', color: '#0F172A' }}>
          Flado Quick Grocery Catalog
        </h1>

        {/* 1. Delivery Promise Header & Location Selector */}
        <div style={{ marginBottom: '1.5rem' }}>
          <DeliveryPromiseCard
            promise={catalog?.deliveryPromise}
            surface="QUICK_COMMERCE"
            title="10-Minute Grocery Delivery Promise"
            locationSelector={{
              initialValue: pincode,
              onLocationSubmit: handleLocationSubmit,
              placeholder: 'Enter pincode for 10-min delivery...',
            }}
          />
        </div>

        {/* Unserviceable / Store Closed Banners */}
        {isUnserviceable && (
          <div style={{ marginBottom: '1.5rem' }}>
            <PromotionalBanner
              title="🛍️ Location Unserviceable for Quick Delivery — Explore AuraMart Mall"
              subtitle="Shop millions of products on AuraMart Marketplace with fast nationwide delivery."
              badgeText="Marketplace Fallback"
              ctaText="Go to Main Mall"
              ctaUrl="/"
              imageUrl="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&fit=crop"
              surface="QUICK_COMMERCE"
            />
          </div>
        )}

        {/* 2. Controls Toolbar: Search, Categories Filter, Sort */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            backgroundColor: '#FFFFFF',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            marginBottom: '1.5rem',
          }}
        >
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="search"
              aria-label="Search quick catalog"
              placeholder="Search fresh groceries in stock at local darkstore..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.875rem',
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#059669',
                color: '#FFFFFF',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                minHeight: '44px',
              }}
            >
              Search
            </button>
          </form>

          {/* Categories Filter Chips */}
          {catalog?.categories && catalog.categories.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#475569' }}>Category:</span>
              {catalog.categories.map((c: any) => {
                const isActive = categorySlug === c.slug;
                return (
                  <button
                    key={c.slug}
                    onClick={() => handleCategorySelect(c.slug)}
                    style={{
                      padding: '0.375rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.8125rem',
                      fontWeight: '600',
                      border: isActive ? '1.5px solid #059669' : '1px solid #CBD5E1',
                      backgroundColor: isActive ? '#ECFDF5' : '#FFFFFF',
                      color: isActive ? '#047857' : '#334155',
                      cursor: 'pointer',
                      minHeight: '44px',
                    }}
                  >
                    {c.name} ({c.itemCount})
                  </button>
                );
              })}
            </div>
          )}

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem' }}>
            <label htmlFor="quick-catalog-sort" style={{ fontSize: '0.875rem', fontWeight: '700', color: '#475569' }}>
              Sort by
            </label>
            <select
              id="quick-catalog-sort"
              aria-label="Sort by"
              value={sortMode}
              onChange={(e) => handleSortChange(e.target.value)}
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.875rem',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
                minHeight: '44px',
              }}
            >
              <option value="relevance">Popularity & Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* 3. Products Grid or Empty State */}
        {loading ? (
          <div data-testid="catalog-loading" style={{ padding: '2rem', textAlign: 'center' }}>
            Loading Quick Catalog...
          </div>
        ) : catalog?.products && catalog.products.length > 0 ? (
          <>
            <ProductGrid products={catalog.products} surface="QUICK_COMMERCE" />
            {catalog.pagination && catalog.pagination.totalPages > 1 && (
              <div style={{ marginTop: '2rem' }}>
                <ProductPagination
                  currentPage={catalog.pagination.page}
                  totalPages={catalog.pagination.totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}
          </>
        ) : (
          <div
            data-testid="catalog-empty-state"
            style={{
              padding: '3rem 1.5rem',
              textAlign: 'center',
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1E293B', marginBottom: '0.5rem' }}>
              {categorySlug
                ? 'No items currently available in this category at your local store.'
                : 'No quick-commerce items fit your search filter.'}
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
              Try adjusting your search terms or select another category.
            </p>
          </div>
        )}
      </Container>
    </PageContainer>
  );
}
