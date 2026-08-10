'use client';

import React from 'react';
import CategoryBreadcrumbs, { BreadcrumbItem } from '@/components/category/CategoryBreadcrumbs';
import ResultsSummary from './ResultsSummary';
import ProductToolbar from './ProductToolbar';
import ProductFilters, { ProductFiltersProps } from './ProductFilters';
import ProductGrid from './ProductGrid';
import ProductGridSkeleton from './ProductGridSkeleton';
import ProductPagination from './ProductPagination';
import NoResultsSection from './NoResultsSection';
import { ProductCardData } from '@/components/ProductCard';
import styles from './ProductListingPage.module.css';

export interface ProductListingPageProps {
  /* Breadcrumbs */
  breadcrumbItems: BreadcrumbItem[];

  /* Page title & Summary */
  title: string;
  totalResults: number;
  resultQuery?: string;
  resultSubtitle?: string;

  /* Toolbar & Sort */
  selectedSort: string;
  onSortChange: (sort: string) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;

  /* Filters */
  filters: ProductFiltersProps;

  /* Products */
  products: ProductCardData[];
  isLoading?: boolean;

  /* Pagination */
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  /* Theme surface */
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';

  /* Empty state callbacks */
  onClearFilters?: () => void;
}

export default function ProductListingPage({
  breadcrumbItems,
  title,
  totalResults,
  resultQuery = '',
  resultSubtitle,
  selectedSort,
  onSortChange,
  viewMode = 'grid',
  onViewModeChange,
  filters,
  products,
  isLoading = false,
  currentPage,
  totalPages,
  onPageChange,
  surface = 'MARKETPLACE',
  onClearFilters,
}: ProductListingPageProps) {
  const isFlado = surface === 'QUICK_COMMERCE';

  return (
    <div
      className={`${styles.page} ${isFlado ? styles.flado : ''}`}
      data-testid="product-listing-page"
    >
      {/* Breadcrumbs */}
      <div className={styles.breadcrumbRow}>
        <CategoryBreadcrumbs items={breadcrumbItems} />
      </div>

      {/* Results Summary Header */}
      <ResultsSummary
        query={resultQuery}
        totalResults={totalResults}
        subtitle={resultSubtitle}
      />

      {/* Product Toolbar */}
      <ProductToolbar
        title={title}
        totalResults={totalResults}
        selectedSort={selectedSort}
        onSortChange={onSortChange}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        surface={surface}
      />

      {/* Body: Sidebar Filters + Main Product Grid */}
      <div className={styles.body}>
        <ProductFilters {...filters} />

        <div className={styles.contentArea}>
          {isLoading ? (
            <ProductGridSkeleton count={10} />
          ) : products.length > 0 ? (
            <>
              <ProductGrid
                products={products}
                surface={surface}
                viewMode={viewMode}
              />
              <ProductPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </>
          ) : (
            <NoResultsSection
              title="No products found"
              description="Try resetting your filters or adjusting your selection."
              action={onClearFilters ? { label: 'Clear Filters', onClick: onClearFilters } : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}
