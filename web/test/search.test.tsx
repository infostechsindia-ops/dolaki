import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../src/components/search/SearchBar';
import SearchSuggestions from '../src/components/search/SearchSuggestions';
import SearchHistory from '../src/components/search/SearchHistory';
import SearchResultsGrid from '../src/components/search/SearchResultsGrid';
import SearchEmptyState from '../src/components/search/SearchEmptyState';
import SearchPageLayout from '../src/components/search/SearchPageLayout';
import { CartProvider } from '../src/context/CartContext';

// Mock Next.js Link
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
  usePathname() {
    return '/search';
  },
}));

describe('CMD-023 Customer Search UI Foundation', () => {

  const mockProducts = [
    {
      id: 'prod-1',
      name: 'Search Product 1',
      description: 'First mock search item',
      price: 299,
      originalPrice: 399,
      rating: 4.2,
      reviewsCount: 15,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'
    }
  ];

  // 1. SearchBar Renders
  it('renders SearchBar input element successfully with correct values', () => {
    const handleChange = jest.fn();
    const handleSubmit = jest.fn();

    render(
      <SearchBar
        value="headphones"
        placeholder="Search keywords..."
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    );

    const input = screen.getByRole('searchbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('headphones');
    expect(input).toHaveAttribute('placeholder', 'Search keywords...');
  });

  // 2. Suggestions Render & Keyboard Navigation & Escape
  it('renders Suggestions listbox and handles Arrow/Escape key movements', () => {
    const handleChange = jest.fn();
    const handleSubmit = jest.fn();
    const suggestions = ['boat headphones', 'sony noise canceling', 'apple airpods'];

    const { rerender } = render(
      <CartProvider>
        <SearchPageLayout
          query="head"
          suggestions={suggestions}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </CartProvider>
    );

    // Should render the suggestions dropdown
    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();

    const options = screen.getAllByRole('option');
    expect(options.length).toBe(3);

    const layout = screen.getByTestId('search-page-layout');

    // Arrow Down should highlight the first suggestion
    fireEvent.keyDown(layout, { key: 'ArrowDown' });
    expect(options[0]).toHaveAttribute('aria-selected', 'true');

    // Arrow Down again should highlight the second suggestion
    fireEvent.keyDown(layout, { key: 'ArrowDown' });
    expect(options[0]).toHaveAttribute('aria-selected', 'false');
    expect(options[1]).toHaveAttribute('aria-selected', 'true');

    // Arrow Up should highlight back to the first suggestion
    fireEvent.keyDown(layout, { key: 'ArrowUp' });
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    expect(options[1]).toHaveAttribute('aria-selected', 'false');

    // Escape should close the suggestions card
    fireEvent.keyDown(layout, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  // 3. SearchHistory Renders
  it('renders SearchHistory elements and reacts to clicks', () => {
    const handleSelect = jest.fn();
    const handleClear = jest.fn();

    render(
      <SearchHistory
        history={['shoes', 'watches', 'smartphones']}
        onSelect={handleSelect}
        onClearHistory={handleClear}
      />
    );

    expect(screen.getByText('shoes')).toBeInTheDocument();
    expect(screen.getByText('watches')).toBeInTheDocument();
    
    const clearBtn = screen.getByRole('button', { name: 'Clear all search history' });
    expect(clearBtn).toBeInTheDocument();
    clearBtn.click();
    expect(handleClear).toHaveBeenCalled();
  });

  // 4. SearchResultsGrid wraps ProductCard
  it('renders SearchResultsGrid and integrates ProductCard items', () => {
    render(
      <CartProvider>
        <SearchResultsGrid products={mockProducts} />
      </CartProvider>
    );

    expect(screen.getByText('Search Product 1')).toBeInTheDocument();
  });

  // 5. SearchEmptyState Renders
  it('renders SearchEmptyState alert headers and triggers clears actions', () => {
    const handleClear = jest.fn();

    render(
      <SearchEmptyState
        query="xyzabc"
        onClearSearch={handleClear}
      />
    );

    expect(screen.getByText(/No results found for "xyzabc"/i)).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: 'Clear Search' });
    expect(btn).toBeInTheDocument();
    btn.click();
    expect(handleClear).toHaveBeenCalled();
  });

  // 6. Presentational Invariants (no API calls or localStorage queries)
  it('excludes any fetch calls, local storage queries, or backend communication', () => {
    if (!window.fetch) {
      window.fetch = jest.fn() as any;
    }
    const spyFetch = jest.spyOn(window, 'fetch');
    const spyLocal = jest.spyOn(Storage.prototype, 'getItem');

    const handleChange = jest.fn();
    const handleSubmit = jest.fn();

    render(
      <CartProvider>
        <SearchPageLayout
          query=""
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </CartProvider>
    );

    expect(spyFetch).not.toHaveBeenCalled();
    // Allow cart context loading but verify no history/suggestions storage queries
    expect(spyLocal).not.toHaveBeenCalledWith(expect.stringContaining('history'));
    expect(spyLocal).not.toHaveBeenCalledWith(expect.stringContaining('suggestions'));

    spyFetch.mockRestore();
    spyLocal.mockRestore();
  });
});
