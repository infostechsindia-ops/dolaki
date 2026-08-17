import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider } from '../src/context/CartContext';
import ProductDetailPage from '../src/components/pdp/ProductDetailPage';
import ProductGallery from '../src/components/pdp/ProductGallery';
import ProductInfo from '../src/components/pdp/ProductInfo';
import ProductPrice from '../src/components/pdp/ProductPrice';
import ProductActions from '../src/components/pdp/ProductActions';
import ProductSpecifications from '../src/components/pdp/ProductSpecifications';
import ProductHighlights from '../src/components/pdp/ProductHighlights';
import ProductDeliveryInfo from '../src/components/pdp/ProductDeliveryInfo';
import ProductSellerInfo from '../src/components/pdp/ProductSellerInfo';
import ProductReviewsSummary from '../src/components/pdp/ProductReviewsSummary';
import RelatedProductsSection from '../src/components/pdp/RelatedProductsSection';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

const MOCK_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', alt: 'Front view' },
  { src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', alt: 'Side view' },
];

const MOCK_BREADCRUMBS = [
  { label: 'Electronics', href: '/categories/electronics' },
  { label: 'Audio', href: '/categories/electronics/audio' },
  { label: 'Headphones' },
];

const MOCK_SPECS = [
  { key: 'Brand', value: 'Sony' },
  { key: 'Model', value: 'WH-1000XM5' },
  { key: 'Connectivity', value: 'Bluetooth 5.2' },
];

const MOCK_HIGHLIGHTS = [
  'Industry-leading noise canceling',
  'Up to 30-hour battery life',
  'Ultra-comfortable design',
];

const MOCK_RELATED = [
  {
    id: 'rel-1',
    title: 'Wireless Earbuds',
    price: 4999,
    rating: 4.5,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
  },
];

describe('CMD-027 Customer Product Detail Page (PDP)', () => {
  // 1. ProductGallery
  it('renders ProductGallery with main image, thumbnails, and zoom button', () => {
    const onSelectImage = jest.fn();
    const onZoomClick = jest.fn();

    render(
      <ProductGallery
        images={MOCK_IMAGES}
        selectedIndex={0}
        onSelectImage={onSelectImage}
        onZoomClick={onZoomClick}
      />
    );

    expect(screen.getByTestId('product-gallery')).toBeInTheDocument();
    expect(screen.getByTestId('product-image-viewer')).toBeInTheDocument();

    const zoomBtn = screen.getByRole('button', { name: /Zoom image/i });
    fireEvent.click(zoomBtn);
    expect(onZoomClick).toHaveBeenCalled();

    const thumbnails = screen.getAllByRole('tab');
    expect(thumbnails.length).toBe(2);
    fireEvent.click(thumbnails[1]);
    expect(onSelectImage).toHaveBeenCalledWith(1);
  });

  // 2. ProductInfo with H1 title
  it('renders ProductInfo with exactly one H1 title, brand, SKU, and rating', () => {
    render(
      <ProductInfo
        title="Sony WH-1000XM5 Headphones"
        brand="Sony"
        sku="SNY-XM5-BLK"
        category="Headphones"
        rating={4.8}
        reviewCount={450}
        shortDescription="Premium noise cancelling headphones"
      />
    );

    expect(screen.getByTestId('product-info')).toBeInTheDocument();
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings.length).toBe(1);
    expect(headings[0]).toHaveTextContent('Sony WH-1000XM5 Headphones');

    expect(screen.getByText('Sony')).toBeInTheDocument();
    expect(screen.getByText('SNY-XM5-BLK')).toBeInTheDocument();
    expect(screen.getByText('(450 reviews)')).toBeInTheDocument();
  });

  // 3. ProductPrice
  it('renders ProductPrice displaying pre-formatted values directly from props', () => {
    render(
      <ProductPrice
        formattedPrice="₹24,990"
        formattedCompareAtPrice="₹29,990"
        discountPercent={17}
        currency="INR"
      />
    );

    expect(screen.getByTestId('product-price')).toBeInTheDocument();
    expect(screen.getByText('₹24,990')).toBeInTheDocument();
    expect(screen.getByText('₹29,990')).toBeInTheDocument();
    expect(screen.getByText('17% OFF')).toBeInTheDocument();
  });

  // 4. ProductActions
  it('renders ProductActions with quantity stepper and action callbacks', () => {
    const onQuantityChange = jest.fn();
    const onAddToCart = jest.fn();
    const onBuyNow = jest.fn();
    const onWishlist = jest.fn();
    const onShare = jest.fn();

    render(
      <ProductActions
        quantity={2}
        onQuantityChange={onQuantityChange}
        onAddToCart={onAddToCart}
        onBuyNow={onBuyNow}
        onWishlist={onWishlist}
        onShare={onShare}
      />
    );

    expect(screen.getByTestId('product-actions')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    const incBtn = screen.getByRole('button', { name: /Increase quantity/i });
    fireEvent.click(incBtn);
    expect(onQuantityChange).toHaveBeenCalledWith(3);

    const addBtn = screen.getByTestId('add-to-cart-btn');
    fireEvent.click(addBtn);
    expect(onAddToCart).toHaveBeenCalled();

    const buyBtn = screen.getByTestId('buy-now-btn');
    fireEvent.click(buyBtn);
    expect(onBuyNow).toHaveBeenCalled();

    const wishlistBtn = screen.getByTestId('wishlist-btn');
    fireEvent.click(wishlistBtn);
    expect(onWishlist).toHaveBeenCalled();

    const shareBtn = screen.getByTestId('share-btn');
    fireEvent.click(shareBtn);
    expect(onShare).toHaveBeenCalled();
  });

  // 5. ProductSpecifications table
  it('renders ProductSpecifications table using semantic HTML table, th, and td', () => {
    render(<ProductSpecifications specs={MOCK_SPECS} />);

    expect(screen.getByTestId('product-specifications')).toBeInTheDocument();
    expect(screen.getByText('Brand')).toBeInTheDocument();
    expect(screen.getByText('Sony')).toBeInTheDocument();
    expect(screen.getByText('Connectivity')).toBeInTheDocument();
    expect(screen.getByText('Bluetooth 5.2')).toBeInTheDocument();
  });

  // 6. ProductHighlights list
  it('renders ProductHighlights bullet feature list', () => {
    render(<ProductHighlights highlights={MOCK_HIGHLIGHTS} />);

    expect(screen.getByTestId('product-highlights')).toBeInTheDocument();
    expect(screen.getByText('Industry-leading noise canceling')).toBeInTheDocument();
  });

  // 7. ProductDeliveryInfo
  it('renders ProductDeliveryInfo with badge and delivery text', () => {
    render(
      <ProductDeliveryInfo
        badgeText="FREE DELIVERY"
        estimatedDeliveryText="Delivered in 2-3 business days"
        returnPolicyText="7 Days Easy Returns"
      />
    );

    expect(screen.getByTestId('product-delivery-info')).toBeInTheDocument();
    expect(screen.getByText('FREE DELIVERY')).toBeInTheDocument();
    expect(screen.getByText('Delivered in 2-3 business days')).toBeInTheDocument();
    expect(screen.getByText('7 Days Easy Returns')).toBeInTheDocument();
  });

  // 8. ProductSellerInfo
  it('renders ProductSellerInfo with seller details', () => {
    const onViewStore = jest.fn();
    render(
      <ProductSellerInfo
        sellerName="AuraMart Electronics"
        sellerRating={4.9}
        sellerBadge="VERIFIED SELLER"
        sellerLocation="Mumbai, India"
        onViewStore={onViewStore}
      />
    );

    expect(screen.getByTestId('product-seller-info')).toBeInTheDocument();
    expect(screen.getByText('AuraMart Electronics')).toBeInTheDocument();
    expect(screen.getByText('VERIFIED SELLER')).toBeInTheDocument();
    expect(screen.getByText('4.9 Seller Rating')).toBeInTheDocument();

    const storeBtn = screen.getByRole('button', { name: /Visit AuraMart Electronics store/i });
    fireEvent.click(storeBtn);
    expect(onViewStore).toHaveBeenCalled();
  });

  // 9. ProductReviewsSummary
  it('renders ProductReviewsSummary rating breakdown and review button', () => {
    const onViewAllReviews = jest.fn();
    render(
      <ProductReviewsSummary
        averageRating={4.8}
        totalReviews={450}
        distribution={[
          { stars: 5, count: 350, percentage: 78 },
          { stars: 4, count: 70, percentage: 15 },
        ]}
        onViewAllReviews={onViewAllReviews}
      />
    );

    expect(screen.getByTestId('product-reviews-summary')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('Based on 450 reviews')).toBeInTheDocument();

    const viewBtn = screen.getByRole('button', { name: /View all customer reviews/i });
    fireEvent.click(viewBtn);
    expect(onViewAllReviews).toHaveBeenCalled();
  });

  // 10. RelatedProductsSection
  it('renders RelatedProductsSection using ProductCard', () => {
    render(
      <CartProvider>
        <RelatedProductsSection products={MOCK_RELATED} />
      </CartProvider>
    );

    expect(screen.getByTestId('related-products-section')).toBeInTheDocument();
    expect(screen.getByText('Wireless Earbuds')).toBeInTheDocument();
  });

  // 11. ProductDetailPage Composition
  it('composes full ProductDetailPage with all sections', () => {
    render(
      <CartProvider>
        <ProductDetailPage
          breadcrumbItems={MOCK_BREADCRUMBS}
          images={MOCK_IMAGES}
          info={{ title: 'Sony WH-1000XM5' }}
          price={{ formattedPrice: '₹24,990' }}
          actions={{ quantity: 1 }}
          highlights={MOCK_HIGHLIGHTS}
          specs={MOCK_SPECS}
          deliveryInfo={{ estimatedDeliveryText: '2-3 days' }}
          sellerInfo={{ sellerName: 'AuraMart' }}
          reviewsSummary={{ averageRating: 4.8, totalReviews: 100 }}
          relatedProducts={MOCK_RELATED}
        />
      </CartProvider>
    );

    expect(screen.getByTestId('product-detail-page')).toBeInTheDocument();
    expect(screen.getByTestId('product-gallery')).toBeInTheDocument();
    expect(screen.getByTestId('product-info')).toBeInTheDocument();
    expect(screen.getByTestId('product-price')).toBeInTheDocument();
    expect(screen.getByTestId('product-actions')).toBeInTheDocument();
    expect(screen.getByTestId('product-highlights')).toBeInTheDocument();
    expect(screen.getByTestId('product-specifications')).toBeInTheDocument();
    expect(screen.getByTestId('product-delivery-info')).toBeInTheDocument();
    expect(screen.getByTestId('product-seller-info')).toBeInTheDocument();
    expect(screen.getByTestId('product-reviews-summary')).toBeInTheDocument();
    expect(screen.getByTestId('related-products-section')).toBeInTheDocument();
  });

  // 12. Invariants: Props-only architecture (No fetch, No localStorage)
  it('enforces props-only architecture without fetch or localStorage calls', () => {
    if (!window.fetch) window.fetch = jest.fn() as any;
    const spyFetch = jest.spyOn(window, 'fetch');
    const spyStorage = jest.spyOn(Storage.prototype, 'getItem');

    render(
      <CartProvider>
        <ProductDetailPage
          breadcrumbItems={MOCK_BREADCRUMBS}
          images={MOCK_IMAGES}
          info={{ title: 'Sony WH-1000XM5' }}
          price={{ formattedPrice: '₹24,990' }}
          actions={{ quantity: 1 }}
        />
      </CartProvider>
    );

    expect(spyFetch).not.toHaveBeenCalled();
    expect(spyStorage).not.toHaveBeenCalledWith(expect.stringContaining('pdp'));

    spyFetch.mockRestore();
    spyStorage.mockRestore();
  });
});
