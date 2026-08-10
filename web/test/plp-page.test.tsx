import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider } from '../src/context/CartContext';
import ProductListingPage from '../src/components/plp/ProductListingPage';
import ProductToolbar from '../src/components/plp/ProductToolbar';
import ProductFilters from '../src/components/plp/ProductFilters';
import FilterSection from '../src/components/plp/FilterSection';
import BrandFilter from '../src/components/plp/BrandFilter';
import PriceFilter from '../src/components/plp/PriceFilter';
import RatingFilter from '../src/components/plp/RatingFilter';
import AvailabilityFilter from '../src/components/plp/AvailabilityFilter';
import ProductSort from '../src/components/plp/ProductSort';
import ProductPagination from '../src/components/plp/ProductPagination';
import ProductGrid from '../src/components/plp/ProductGrid';
import ProductGridSkeleton from '../src/components/plp/ProductGridSkeleton';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    title: 'Wireless Noise Cancelling Headphones',
    price: 14999,
    rating: 4.8,
    reviewsCount: 320,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
  },
  {
    id: 'prod-2',
    title: 'Smart Fitness Watch',
    price: 3999,
    rating: 4.4,
    reviewsCount: 150,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
  },
];

const MOCK_BRANDS = [
  { id: 'sony', name: 'Sony', count: 24 },
  { id: 'apple', name: 'Apple', count: 18 },
];

const MOCK_BREADCRUMBS = [
  { label: 'Electronics', href: '/categories/electronics' },
  { label: 'Headphones' },
];

describe('CMD-026 Customer Product Listing Page (PLP)', () => {
  // 1. FilterSection fieldset & legend semantics
  it('renders FilterSection using fieldset and legend HTML elements', () => {
    render(
      <FilterSection title="Brand Filter">
        <span>Filter Content</span>
      </FilterSection>
    );

    const legend = screen.getByText('Brand Filter');
    expect(legend.tagName.toLowerCase()).toBe('legend');
    const fieldset = legend.closest('fieldset');
    expect(fieldset).toBeInTheDocument();
  });

  // 2. Individual Filter components (Brand, Price, Rating, Availability)
  it('renders Brand, Price, Rating, and Availability filters with callbacks', () => {
    const onBrandChange = jest.fn();
    const onPriceChange = jest.fn();
    const onRatingChange = jest.fn();
    const onAvailabilityChange = jest.fn();

    render(
      <div>
        <BrandFilter brands={MOCK_BRANDS} selectedBrandIds={['sony']} onChange={onBrandChange} />
        <PriceFilter minPrice={0} maxPrice={10000} currentMin={500} currentMax={5000} onPriceChange={onPriceChange} />
        <RatingFilter selectedRatings={[4]} onChange={onRatingChange} />
        <AvailabilityFilter selectedIds={['in_stock']} onChange={onAvailabilityChange} />
      </div>
    );

    // Brand
    const sonyCheckbox = screen.getByLabelText(/Filter by brand Sony/i);
    expect(sonyCheckbox).toBeChecked();
    fireEvent.click(sonyCheckbox);
    expect(onBrandChange).toHaveBeenCalledWith('sony', false);

    // Price
    const minInput = screen.getByLabelText(/Minimum price/i);
    expect(minInput).toHaveValue(500);
    fireEvent.change(minInput, { target: { value: '1000' } });
    expect(onPriceChange).toHaveBeenCalledWith(1000, 5000);

    // Rating
    const ratingCheckbox = screen.getByLabelText(/Filter by rating 4 stars and above/i);
    expect(ratingCheckbox).toBeChecked();

    // Availability
    const inStockCheckbox = screen.getByLabelText(/Filter by In Stock/i);
    expect(inStockCheckbox).toBeChecked();
  });

  // 3. ProductToolbar & ProductSort
  it('renders ProductToolbar with title, count, view toggle, and sort selection', () => {
    const onSortChange = jest.fn();
    const onViewModeChange = jest.fn();

    render(
      <ProductToolbar
        title="Headphones"
        totalResults={120}
        selectedSort="featured"
        onSortChange={onSortChange}
        viewMode="grid"
        onViewModeChange={onViewModeChange}
      />
    );

    expect(screen.getByTestId('product-toolbar')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Headphones' })).toBeInTheDocument();
    expect(screen.getByText('(120 items)')).toBeInTheDocument();

    // Sort select
    const select = screen.getByRole('combobox', { name: /Sort products/i });
    fireEvent.change(select, { target: { value: 'price_asc' } });
    expect(onSortChange).toHaveBeenCalledWith('price_asc');

    // View toggle
    const listBtn = screen.getByRole('button', { name: /List view/i });
    fireEvent.click(listBtn);
    expect(onViewModeChange).toHaveBeenCalledWith('list');
  });

  // 4. ProductPagination accessibility
  it('renders ProductPagination with nav aria-label="Pagination" and aria-current="page"', () => {
    const onPageChange = jest.fn();
    render(
      <ProductPagination
        currentPage={2}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    const nav = screen.getByTestId('product-pagination');
    expect(nav).toHaveAttribute('aria-label', 'Pagination');

    const activePage = screen.getByRole('button', { name: 'Page 2' });
    expect(activePage).toHaveAttribute('aria-current', 'page');

    const nextBtn = screen.getByRole('button', { name: /Go to next page/i });
    fireEvent.click(nextBtn);
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  // 5. ProductGrid & ProductGridSkeleton
  it('renders ProductGrid and ProductGridSkeleton appropriately', () => {
    const { rerender } = render(
      <CartProvider>
        <ProductGrid products={MOCK_PRODUCTS} />
      </CartProvider>
    );

    expect(screen.getByTestId('product-grid')).toBeInTheDocument();
    expect(screen.getByText('Wireless Noise Cancelling Headphones')).toBeInTheDocument();

    rerender(
      <CartProvider>
        <ProductGridSkeleton count={6} />
      </CartProvider>
    );

    expect(screen.getByTestId('product-grid-skeleton')).toBeInTheDocument();
  });

  // 6. ProductListingPage Compositor
  it('composes full ProductListingPage with breadcrumbs, filters, toolbar, grid, and pagination', () => {
    render(
      <CartProvider>
        <ProductListingPage
          breadcrumbItems={MOCK_BREADCRUMBS}
          title="Headphones"
          totalResults={2}
          selectedSort="featured"
          onSortChange={jest.fn()}
          filters={{ brands: MOCK_BRANDS }}
          products={MOCK_PRODUCTS}
          currentPage={1}
          totalPages={1}
          onPageChange={jest.fn()}
        />
      </CartProvider>
    );

    expect(screen.getByTestId('product-listing-page')).toBeInTheDocument();
    expect(screen.getByTestId('product-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('product-filters')).toBeInTheDocument();
    expect(screen.getByTestId('product-grid')).toBeInTheDocument();
  });

  // 7. Invariants: Props-only architecture (No fetch, No localStorage)
  it('enforces props-only architecture without triggering fetch or accessing localStorage', () => {
    if (!window.fetch) window.fetch = jest.fn() as any;
    const spyFetch = jest.spyOn(window, 'fetch');
    const spyStorage = jest.spyOn(Storage.prototype, 'getItem');

    render(
      <CartProvider>
        <ProductListingPage
          breadcrumbItems={MOCK_BREADCRUMBS}
          title="Headphones"
          totalResults={2}
          selectedSort="featured"
          onSortChange={jest.fn()}
          filters={{ brands: MOCK_BRANDS }}
          products={MOCK_PRODUCTS}
          currentPage={1}
          totalPages={1}
          onPageChange={jest.fn()}
        />
      </CartProvider>
    );

    expect(spyFetch).not.toHaveBeenCalled();
    expect(spyStorage).not.toHaveBeenCalledWith(expect.stringContaining('plp'));

    spyFetch.mockRestore();
    spyStorage.mockRestore();
  });
});
