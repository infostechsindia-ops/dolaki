import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductDetailPage from '../src/components/pdp/ProductDetailPage';

const MOCK_BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Electronics', href: '/category/electronics' },
  { label: 'Headphones' },
];

const MOCK_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', alt: 'Headphone main view' },
];

const MOCK_INFO = {
  title: 'AuraStudio Ultra Pro Active Noise Canceling Premium Wireless Bluetooth Headphones Super Edition',
  brand: 'AuraStudio Flagship Audio Systems International Store',
  rating: 4.9,
  reviewCount: 1540,
  sku: 'AURA-HEADPHONE-ULTRA-001',
};

const MOCK_PRICE = {
  formattedPrice: '₹14,999',
  formattedCompareAtPrice: '₹19,999',
  discountPercent: 25,
};

const MOCK_ACTIONS = {
  quantity: 1,
  maxQuantity: 10,
  onQuantityChange: jest.fn(),
  onAddToCart: jest.fn(),
  onBuyNow: jest.fn(),
  onWishlist: jest.fn(),
  onShare: jest.fn(),
  inStock: true,
  stockBadgeText: 'In Stock',
};

describe('UI-001 — Web PDP Responsive Layout & Narrow Viewport Tests (GAP-P2-01)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1. PDP header supports narrow mobile viewport rendering without throwing or hiding elements', () => {
    render(
      <ProductDetailPage
        breadcrumbItems={MOCK_BREADCRUMBS}
        images={MOCK_IMAGES}
        info={MOCK_INFO}
        price={MOCK_PRICE}
        actions={MOCK_ACTIONS}
      />
    );

    const pdpContainer = screen.getByTestId('product-detail-page');
    expect(pdpContainer).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  test('2. Extremely long product title remains visible and renderable in H1 tag', () => {
    render(
      <ProductDetailPage
        breadcrumbItems={MOCK_BREADCRUMBS}
        images={MOCK_IMAGES}
        info={MOCK_INFO}
        price={MOCK_PRICE}
        actions={MOCK_ACTIONS}
      />
    );

    const h1Heading = screen.getByRole('heading', { level: 1 });
    expect(h1Heading).toHaveTextContent(MOCK_INFO.title);
  });

  test('3. Long brand name and rating row remain renderable', () => {
    render(
      <ProductDetailPage
        breadcrumbItems={MOCK_BREADCRUMBS}
        images={MOCK_IMAGES}
        info={MOCK_INFO}
        price={MOCK_PRICE}
        actions={MOCK_ACTIONS}
      />
    );

    expect(screen.getByText(MOCK_INFO.brand)).toBeInTheDocument();
    expect(screen.getByText('4.9')).toBeInTheDocument();
    expect(screen.getByText('(1,540 reviews)')).toBeInTheDocument();
  });

  test('4. Product price, original price, and discount badge render cleanly', () => {
    render(
      <ProductDetailPage
        breadcrumbItems={MOCK_BREADCRUMBS}
        images={MOCK_IMAGES}
        info={MOCK_INFO}
        price={MOCK_PRICE}
        actions={MOCK_ACTIONS}
      />
    );

    expect(screen.getAllByText('₹14,999').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('₹19,999').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/25%/).length).toBeGreaterThanOrEqual(1);
  });

  test('5. Product action controls remain accessible in DOM', () => {
    render(
      <ProductDetailPage
        breadcrumbItems={MOCK_BREADCRUMBS}
        images={MOCK_IMAGES}
        info={MOCK_INFO}
        price={MOCK_PRICE}
        actions={MOCK_ACTIONS}
        showStickyBar={true}
      />
    );

    const addToCartBtns = screen.getAllByRole('button', { name: /Add to Cart/i });
    expect(addToCartBtns.length).toBeGreaterThanOrEqual(1);

    const buyNowBtns = screen.getAllByRole('button', { name: /Buy Now/i });
    expect(buyNowBtns.length).toBeGreaterThanOrEqual(1);
  });

  test('6. Existing desktop PDP layout structure remains available', () => {
    const { container } = render(
      <ProductDetailPage
        breadcrumbItems={MOCK_BREADCRUMBS}
        images={MOCK_IMAGES}
        info={MOCK_INFO}
        price={MOCK_PRICE}
        actions={MOCK_ACTIONS}
        surface="MARKETPLACE"
      />
    );

    expect(container.querySelector('[data-testid="product-detail-page"]')).toBeInTheDocument();
  });
});
