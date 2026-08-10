'use client';

import React from 'react';
import SearchBar from '@/components/search/SearchBar';
import ResultsSummary from './ResultsSummary';
import ActiveFilters, { ActiveFilter } from './ActiveFilters';
import SortBar, { SortOption } from './SortBar';
import FilterSidebar, {
  FilterOption,
  PriceRange,
} from './FilterSidebar';
import ProductGridSection from './ProductGridSection';
import NoResultsSection from './NoResultsSection';
import { ProductCardData } from '@/components/ProductCard';
import styles from './SearchResultsPage.module.css';

export interface SearchResultsPageProps {
  /* Search bar */
  query: string;
  searchPlaceholder?: string;
  searchLoading?: boolean;
  onSearchChange: (val: string) => void;
  onSearchSubmit: (val: string) => void;
  onSearchClear?: () => void;

  /* Summary */
  totalResults: number;
  resultSubtitle?: string;

  /* Active filters */
  activeFilters?: ActiveFilter[];
  onRemoveFilter?: (id: string) => void;
  onClearAllFilters?: () => void;

  /* Sort */
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;

  /* Sidebar filter options */
  categories?: FilterOption[];
  brands?: FilterOption[];
  priceRanges?: PriceRange[];
  ratings?: FilterOption[];
  availabilityOptions?: FilterOption[];

  /* Sidebar selected state */
  selectedCategories?: string[];
  selectedBrands?: string[];
  selectedPriceRange?: string | null;
  selectedRatings?: string[];
  selectedAvailability?: string[];

  /* Sidebar callbacks */
  onCategoryChange?: (id: string, checked: boolean) => void;
  onBrandChange?: (id: string, checked: boolean) => void;
  onPriceRangeChange?: (label: string) => void;
  onRatingChange?: (id: string, checked: boolean) => void;
  onAvailabilityChange?: (id: string, checked: boolean) => void;

  /* Products */
  products: ProductCardData[];
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';

  /* Empty state */
  noResultsTitle?: string;
  noResultsDescription?: string;
  onClearSearch?: () => void;
}

export default function SearchResultsPage({
  query,
  searchPlaceholder,
  searchLoading = false,
  onSearchChange,
  onSearchSubmit,
  onSearchClear,

  totalResults,
  resultSubtitle,

  activeFilters = [],
  onRemoveFilter,
  onClearAllFilters,

  selectedSort,
  onSortChange,

  categories,
  brands,
  priceRanges,
  ratings,
  availabilityOptions,
  selectedCategories,
  selectedBrands,
  selectedPriceRange,
  selectedRatings,
  selectedAvailability,
  onCategoryChange,
  onBrandChange,
  onPriceRangeChange,
  onRatingChange,
  onAvailabilityChange,

  products,
  surface = 'MARKETPLACE',

  noResultsTitle,
  noResultsDescription,
  onClearSearch,
}: SearchResultsPageProps) {
  const isFlado = surface === 'QUICK_COMMERCE';

  return (
    <div
      className={`${styles.page} ${isFlado ? styles.flado : ''}`}
      data-testid="search-results-page"
    >
      {/* Search bar at top */}
      <div className={styles.searchBarRow}>
        <SearchBar
          value={query}
          placeholder={searchPlaceholder}
          loading={searchLoading}
          onChange={onSearchChange}
          onSubmit={() => onSearchSubmit(query)}
          onClear={onSearchClear}
        />
      </div>

      {/* Results summary */}
      <ResultsSummary
        query={query}
        totalResults={totalResults}
        subtitle={resultSubtitle}
      />

      {/* Active filter chips */}
      {activeFilters.length > 0 && onRemoveFilter && (
        <ActiveFilters
          filters={activeFilters}
          onRemove={onRemoveFilter}
          onClearAll={onClearAllFilters}
        />
      )}

      {/* Sort bar */}
      <SortBar
        selectedSort={selectedSort}
        onSortChange={onSortChange}
        totalResults={totalResults}
        surface={surface}
      />

      {/* Body: sidebar + grid */}
      <div className={styles.body}>
        <FilterSidebar
          categories={categories}
          brands={brands}
          priceRanges={priceRanges}
          ratings={ratings}
          availabilityOptions={availabilityOptions}
          selectedCategories={selectedCategories}
          selectedBrands={selectedBrands}
          selectedPriceRange={selectedPriceRange}
          selectedRatings={selectedRatings}
          selectedAvailability={selectedAvailability}
          onCategoryChange={onCategoryChange}
          onBrandChange={onBrandChange}
          onPriceRangeChange={onPriceRangeChange}
          onRatingChange={onRatingChange}
          onAvailabilityChange={onAvailabilityChange}
        />

        <div className={styles.gridArea}>
          {products.length > 0 ? (
            <ProductGridSection products={products} surface={surface} />
          ) : (
            !searchLoading && (
              <NoResultsSection
                title={noResultsTitle}
                description={noResultsDescription}
                action={onClearSearch ? { label: 'Clear search', onClick: onClearSearch } : undefined}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
