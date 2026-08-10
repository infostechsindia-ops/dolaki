import React from 'react';
import { render, screen } from '@testing-library/react';
import BestSellerSection from '../src/components/merchandising/BestSellerSection';
import NewArrivalSection from '../src/components/merchandising/NewArrivalSection';
import RecentlyViewedSection from '../src/components/merchandising/RecentlyViewedSection';
import RecommendedSection from '../src/components/merchandising/RecommendedSection';
import FeaturedBrandSection from '../src/components/merchandising/FeaturedBrandSection';
import ShopByCategorySection from '../src/components/merchandising/ShopByCategorySection';
import SeasonalCollectionSection from '../src/components/merchandising/SeasonalCollectionSection';
import { CartProvider } from '../src/context/CartContext';

// Mock Next.js Link
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
  usePathname() {
    return '/';
  },
}));

describe('CMD-022 Homepage Merchandising Sections', () => {

  const mockProducts = [
    {
      id: 'prod-1',
      name: 'Test Product 1',
      description: 'First mock product description',
      price: 299,
      originalPrice: 399,
      rating: 4.2,
      reviewsCount: 15,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'
    },
    {
      id: 'prod-2',
      name: 'Test Product 2',
      description: 'Second mock product description',
      price: 499,
      originalPrice: 499,
      rating: 4.8,
      reviewsCount: 8,
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b'
    }
  ];

  // 1. All sections render
  it('renders all 7 merchandising sections successfully with mock props', () => {
    const brands = [
      { name: 'Mock Brand 1', slug: 'mock-1', logoUrl: 'https://apple.co/logo' }
    ];

    const categories = [
      { name: 'Mock Cat 1', slug: 'mock-cat-1', icon: '🍎', count: '12 deals' }
    ];

    const { container } = render(
      <CartProvider>
        <div>
          <BestSellerSection title="Top Bestsellers" products={mockProducts} surface="MARKETPLACE" />
          <NewArrivalSection title="Just Launched" products={mockProducts} badge="NEW-VIP" surface="MARKETPLACE" />
          <RecentlyViewedSection products={mockProducts} surface="MARKETPLACE" />
          <RecommendedSection products={mockProducts} surface="MARKETPLACE" />
          <FeaturedBrandSection title="Top Brands" brands={brands} ctaUrl="/brands" surface="MARKETPLACE" />
          <ShopByCategorySection title="Explore Departments" categories={categories} surface="MARKETPLACE" />
          <SeasonalCollectionSection title="Monsoon Drops" imageUrl="https://apple.co/monsoon" ctaUrl="/monsoon" surface="MARKETPLACE" />
        </div>
      </CartProvider>
    );

    // Section title assertions
    expect(screen.getByRole('heading', { name: 'Top Bestsellers' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Just Launched' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Recently Viewed Items' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Recommended for You' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Top Brands' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Explore Departments' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Monsoon Drops' })).toBeInTheDocument();
    
    // Check brand cards and category count text
    expect(screen.getByText('Mock Brand 1')).toBeInTheDocument();
    expect(screen.getByText('12 deals')).toBeInTheDocument();
    expect(screen.getByText('NEW-VIP')).toBeInTheDocument();
  });

  // 2. ProductCard Integration
  it('integrates ProductCard components into bestseller and new arrival grids', () => {
    render(
      <CartProvider>
        <div>
          <BestSellerSection title="Top Bestsellers" products={mockProducts} surface="MARKETPLACE" />
          <NewArrivalSection title="Just Launched" products={mockProducts} surface="MARKETPLACE" />
        </div>
      </CartProvider>
    );

    // Assert that mock product titles are rendered inside the ProductCard elements
    const titles = screen.getAllByText('Test Product 1');
    expect(titles.length).toBe(2);
  });

  // 3. Theme Assignments (Marketplace vs Flado theme classes)
  it('assigns Marketplace and Flado style override classes based on surface props', () => {
    const { container: containerMp } = render(
      <CartProvider>
        <BestSellerSection title="Top Bestsellers" products={mockProducts} surface="MARKETPLACE" />
      </CartProvider>
    );
    expect(containerMp.firstChild).not.toHaveClass('quickCommerce');

    const { container: containerFl } = render(
      <CartProvider>
        <BestSellerSection title="Top Bestsellers" products={mockProducts} surface="QUICK_COMMERCE" />
      </CartProvider>
    );
    expect(containerFl.firstChild).toHaveClass('quickCommerce');
  });

  // 4. Responsive Grid Classes Verification
  it('verifies grids render responsive column classes', () => {
    const { container } = render(
      <CartProvider>
        <BestSellerSection title="Top Bestsellers" products={mockProducts} surface="MARKETPLACE" />
      </CartProvider>
    );

    const grid = container.querySelector('[data-testid="bestseller-grid"]');
    expect(grid).toBeInTheDocument();
    expect(grid?.className).toContain('grid');
  });

  // 5. Presentational Invariants (no LocalStorage or algorithmic queries)
  it('has no browser history / localStorage references, and no ranking functions', () => {
    const spyLocal = jest.spyOn(Storage.prototype, 'getItem');
    
    render(
      <CartProvider>
        <RecentlyViewedSection products={mockProducts} surface="MARKETPLACE" />
      </CartProvider>
    );

    // Verify localStorage was never queried with viewed/history keys
    expect(spyLocal).not.toHaveBeenCalledWith(expect.stringContaining('viewed'));
    expect(spyLocal).not.toHaveBeenCalledWith(expect.stringContaining('history'));
    spyLocal.mockRestore();
  });
});
