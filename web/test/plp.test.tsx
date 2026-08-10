import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider } from '../src/context/CartContext';
import ResultsSummary from '../src/components/plp/ResultsSummary';
import ActiveFilters from '../src/components/plp/ActiveFilters';
import SortBar from '../src/components/plp/SortBar';
import FilterSidebar from '../src/components/plp/FilterSidebar';
import ProductGridSection from '../src/components/plp/ProductGridSection';
import NoResultsSection from '../src/components/plp/NoResultsSection';
import SearchResultsPage from '../src/components/plp/SearchResultsPage';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/search',
}));

const MOCK_PRODUCTS = [
  {
    id: 'p1',
    title: 'Test Headphones',
    price: 1999,
    rating: 4.3,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
  },
  {
    id: 'p2',
    title: 'Test Smartwatch',
    price: 5999,
    rating: 4.5,
    reviewsCount: 212,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
  },
];

const MOCK_CATEGORIES = [
  { id: 'electronics', label: 'Electronics', count: 42 },
  { id: 'fashion', label: 'Fashion', count: 17 },
];

const MOCK_BRANDS = [
  { id: 'boat', label: 'boAt', count: 12 },
  { id: 'sony', label: 'Sony', count: 9 },
];

const MOCK_FILTERS = [
  { id: 'cat-electronics', label: 'Electronics', group: 'category' },
  { id: 'brand-boat', label: 'boAt', group: 'brand' },
];

// ─── 1. ResultsSummary ────────────────────────────────────────────────────────
describe('CMD-024 PLP Foundation — ResultsSummary', () => {
  it('renders keyword and result count', () => {
    render(<ResultsSummary query="headphones" totalResults={128} />);
    expect(screen.getByText(/Results for/i)).toBeInTheDocument();
    expect(screen.getByText(/"headphones"/i)).toBeInTheDocument();
    expect(screen.getByText(/128 results found/i)).toBeInTheDocument();
  });

  it('renders "All Products" when query is empty', () => {
    render(<ResultsSummary query="" totalResults={300} />);
    expect(screen.getByText('All Products')).toBeInTheDocument();
  });
});

// ─── 2. ActiveFilters ─────────────────────────────────────────────────────────
describe('CMD-024 PLP Foundation — ActiveFilters', () => {
  it('renders filter chips with remove buttons', () => {
    const onRemove = jest.fn();
    render(<ActiveFilters filters={MOCK_FILTERS} onRemove={onRemove} />);
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('boAt')).toBeInTheDocument();
    const removeButtons = screen.getAllByRole('button', { name: /Remove/i });
    expect(removeButtons.length).toBe(2);
    fireEvent.click(removeButtons[0]);
    expect(onRemove).toHaveBeenCalledWith('cat-electronics');
  });

  it('renders nothing when filter list is empty', () => {
    const { container } = render(<ActiveFilters filters={[]} onRemove={jest.fn()} />);
    expect(container.firstChild).toBeNull();
  });
});

// ─── 3. SortBar ───────────────────────────────────────────────────────────────
describe('CMD-024 PLP Foundation — SortBar', () => {
  it('renders all sort options in the select element', () => {
    render(<SortBar selectedSort="relevance" onSortChange={jest.fn()} totalResults={54} />);
    expect(screen.getByTestId('sort-bar')).toBeInTheDocument();
    expect(screen.getByText('54 items')).toBeInTheDocument();
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Relevance' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Newest' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Price: Low → High' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Price: High → Low' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Popularity' })).toBeInTheDocument();
  });

  it('fires onSortChange when selection changes', () => {
    const onSortChange = jest.fn();
    render(<SortBar selectedSort="relevance" onSortChange={onSortChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'price_asc' } });
    expect(onSortChange).toHaveBeenCalledWith('price_asc');
  });
});

// ─── 4. FilterSidebar ─────────────────────────────────────────────────────────
describe('CMD-024 PLP Foundation — FilterSidebar', () => {
  it('renders category and brand filter options', () => {
    render(
      <FilterSidebar
        categories={MOCK_CATEGORIES}
        brands={MOCK_BRANDS}
      />
    );
    expect(screen.getByTestId('filter-sidebar')).toBeInTheDocument();
    expect(screen.getByLabelText(/Filter by category Electronics/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filter by brand Sony/i)).toBeInTheDocument();
  });

  it('fires callbacks when checkboxes are toggled', () => {
    const onCategoryChange = jest.fn();
    render(
      <FilterSidebar
        categories={MOCK_CATEGORIES}
        onCategoryChange={onCategoryChange}
      />
    );
    const electronicsCheckbox = screen.getByLabelText(/Filter by category Electronics/i);
    fireEvent.click(electronicsCheckbox);
    expect(onCategoryChange).toHaveBeenCalled();
  });
});

// ─── 5. ProductGridSection ────────────────────────────────────────────────────
describe('CMD-024 PLP Foundation — ProductGridSection', () => {
  it('renders ProductCard items for each product', () => {
    render(
      <CartProvider>
        <ProductGridSection products={MOCK_PRODUCTS} />
      </CartProvider>
    );
    expect(screen.getByTestId('product-grid-section')).toBeInTheDocument();
    expect(screen.getByText('Test Headphones')).toBeInTheDocument();
    expect(screen.getByText('Test Smartwatch')).toBeInTheDocument();
  });

  it('returns null when products array is empty', () => {
    const { container } = render(
      <CartProvider>
        <ProductGridSection products={[]} />
      </CartProvider>
    );
    expect(container.firstChild).toBeNull();
  });
});

// ─── 6. NoResultsSection ─────────────────────────────────────────────────────
describe('CMD-024 PLP Foundation — NoResultsSection', () => {
  it('renders default empty state title and description', () => {
    render(<NoResultsSection />);
    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(screen.getByText(/Try adjusting your search/i)).toBeInTheDocument();
  });

  it('renders custom title and triggers action callback', () => {
    const onAction = jest.fn();
    render(
      <NoResultsSection
        title="Nothing matched"
        action={{ label: 'Reset filters', onClick: onAction }}
      />
    );
    expect(screen.getByText('Nothing matched')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Reset filters' }));
    expect(onAction).toHaveBeenCalled();
  });
});

// ─── 7. SearchResultsPage (full compositor) ───────────────────────────────────
describe('CMD-024 PLP Foundation — SearchResultsPage', () => {
  const baseProps = {
    query: 'laptop',
    totalResults: 42,
    selectedSort: 'relevance' as const,
    products: MOCK_PRODUCTS,
    onSearchChange: jest.fn(),
    onSearchSubmit: jest.fn(),
    onSortChange: jest.fn(),
  };

  it('renders full page with SearchBar, ResultsSummary, SortBar, and product grid', () => {
    render(
      <CartProvider>
        <SearchResultsPage {...baseProps} />
      </CartProvider>
    );
    expect(screen.getByTestId('search-results-page')).toBeInTheDocument();
    expect(screen.getByTestId('results-summary')).toBeInTheDocument();
    expect(screen.getByTestId('sort-bar')).toBeInTheDocument();
    expect(screen.getByTestId('filter-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('product-grid-section')).toBeInTheDocument();
    expect(screen.getByText('Test Headphones')).toBeInTheDocument();
  });

  it('shows NoResultsSection when products array is empty', () => {
    render(
      <CartProvider>
        <SearchResultsPage
          {...baseProps}
          products={[]}
          totalResults={0}
        />
      </CartProvider>
    );
    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(screen.queryByTestId('product-grid-section')).toBeNull();
  });

  it('shows ActiveFilters when active filters are provided', () => {
    const onRemove = jest.fn();
    render(
      <CartProvider>
        <SearchResultsPage
          {...baseProps}
          activeFilters={MOCK_FILTERS}
          onRemoveFilter={onRemove}
        />
      </CartProvider>
    );
    expect(screen.getByTestId('active-filters')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('enforces props-only architecture: no fetch, no localStorage', () => {
    if (!window.fetch) window.fetch = jest.fn() as any;
    const spyFetch = jest.spyOn(window, 'fetch');
    const spyStorage = jest.spyOn(Storage.prototype, 'getItem');

    render(
      <CartProvider>
        <SearchResultsPage {...baseProps} />
      </CartProvider>
    );

    expect(spyFetch).not.toHaveBeenCalled();
    expect(spyStorage).not.toHaveBeenCalledWith(expect.stringContaining('filter'));
    expect(spyStorage).not.toHaveBeenCalledWith(expect.stringContaining('sort'));

    spyFetch.mockRestore();
    spyStorage.mockRestore();
  });
});
