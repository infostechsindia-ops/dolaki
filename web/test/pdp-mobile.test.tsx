import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductDetailPage from '../src/components/pdp/ProductDetailPage';
import ProductVariantExperience from '../src/components/pdp/ProductVariantExperience';
import ProductHighlights from '../src/components/pdp/ProductHighlights';
import ProductSpecifications from '../src/components/pdp/ProductSpecifications';

const MOCK_BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Electronics', href: '/category/electronics' },
  { label: 'Wireless Headphones' },
];

const MOCK_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', alt: 'Main black headphone view' },
  { src: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800', alt: 'Side earcups view' },
];

const MOCK_INFO = {
  title: 'AuraStudio Pro Noise-Canceling Wireless Headphones',
  brand: 'AuraSound',
  rating: 4.8,
  reviewCount: 128,
  sku: 'AURA-HEADPHONE-001',
};

const MOCK_PRICE = {
  formattedPrice: '$299.00',
  formattedCompareAtPrice: '$349.00',
  discountPercent: 14,
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

const MOCK_DELIVERY = {
  badgeText: 'FREE EXPRESS',
  estimatedDeliveryText: 'Delivered by Tomorrow, 2:00 PM',
  shippingInfoText: 'Ships from Central Warehouse',
  returnPolicyText: '30-Day Hassle Free Returns',
};

const MOCK_SELLER = {
  sellerName: 'AuraMart Flagship Store',
  rating: 4.9,
  ratingCount: 1420,
  badgeText: 'Verified Seller',
};

const MOCK_HIGHLIGHTS = [
  'Active Noise Cancellation (ANC) with Transparency Mode',
  'Up to 40 Hours Battery Life with Fast Charging',
  'Custom 40mm Dynamic Audio Drivers',
  'Multipoint Bluetooth 5.3 Connectivity',
];

const MOCK_SPECS = [
  { key: 'Connectivity', value: 'Bluetooth 5.3 / 3.5mm Aux' },
  { key: 'Battery Life', value: '40 Hours (ANC On)' },
  { key: 'Weight', value: '250 grams' },
];

describe('CMD-038 PDP Mobile Web Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Mobile PDP composition & Heading hierarchy
  it('renders PDP composition with exactly ONE H1 tag for product title', () => {
    render(
      <ProductDetailPage
        breadcrumbItems={MOCK_BREADCRUMBS}
        images={MOCK_IMAGES}
        info={MOCK_INFO}
        price={MOCK_PRICE}
        actions={MOCK_ACTIONS}
      />
    );

    expect(screen.getByTestId('product-detail-page')).toBeInTheDocument();
    const h1Tags = screen.getAllByRole('heading', { level: 1 });
    expect(h1Tags).toHaveLength(1);
    expect(h1Tags[0]).toHaveTextContent('AuraStudio Pro Noise-Canceling Wireless Headphones');
  });

  // 2. Sticky Mobile Purchase Bar
  it('renders sticky mobile purchase bar with price and CTA buttons', () => {
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

    const stickyBar = screen.getByTestId('sticky-mobile-purchase-bar');
    expect(stickyBar).toBeInTheDocument();
    expect(screen.getByTestId('sticky-price')).toHaveTextContent('$299.00');

    const cartBtn = screen.getByTestId('sticky-add-to-cart-btn');
    const buyBtn = screen.getByTestId('sticky-buy-now-btn');

    fireEvent.click(cartBtn);
    expect(MOCK_ACTIONS.onAddToCart).toHaveBeenCalledTimes(1);

    fireEvent.click(buyBtn);
    expect(MOCK_ACTIONS.onBuyNow).toHaveBeenCalledTimes(1);
  });

  // 3. Sticky Bar respects disabled state
  it('disables sticky purchase bar buttons when actions are disabled', () => {
    const disabledActions = { ...MOCK_ACTIONS, disabled: true };
    render(
      <ProductDetailPage
        breadcrumbItems={MOCK_BREADCRUMBS}
        images={MOCK_IMAGES}
        info={MOCK_INFO}
        price={MOCK_PRICE}
        actions={disabledActions}
        showStickyBar={true}
      />
    );

    expect(screen.getByTestId('sticky-add-to-cart-btn')).toBeDisabled();
    expect(screen.getByTestId('sticky-buy-now-btn')).toBeDisabled();
  });

  // 4. Progressive Disclosure for Highlights and Specifications
  it('supports progressive disclosure for long content via collapsible details', () => {
    render(
      <>
        <ProductHighlights highlights={MOCK_HIGHLIGHTS} collapsible={true} />
        <ProductSpecifications specs={MOCK_SPECS} collapsible={true} />
      </>
    );

    expect(screen.getByTestId('highlights-details')).toBeInTheDocument();
    expect(screen.getByTestId('specifications-details')).toBeInTheDocument();
  });

  // 5. Integration with Variant Experience
  it('integrates cleanly with ProductVariantExperience without bypassing validation', () => {
    const onAddToCartVariant = jest.fn();

    const variantOptions = [
      {
        id: 'color',
        name: 'Color',
        type: 'color' as const,
        values: [
          { id: 'black', label: 'Black', value: '#000000', inStock: true },
          { id: 'white', label: 'White', value: '#ffffff', inStock: false },
        ],
      },
    ];

    const variantCombinations = [
      {
        id: 'comb-black',
        attributeValues: { color: 'black' },
        price: 29900,
        formattedPrice: '$299.00',
        inStock: true,
        sku: 'SKU-BLACK',
      },
      {
        id: 'comb-white',
        attributeValues: { color: 'white' },
        price: 29900,
        formattedPrice: '$299.00',
        inStock: false,
        sku: 'SKU-WHITE',
      },
    ];

    render(
      <ProductVariantExperience
        breadcrumbItems={MOCK_BREADCRUMBS}
        images={MOCK_IMAGES}
        info={MOCK_INFO}
        price={MOCK_PRICE}
        variantOptions={variantOptions}
        variantCombinations={variantCombinations}
        actions={{ onAddToCart: onAddToCartVariant }}
        showStickyBar={true}
      />
    );

    const stickyCartBtn = screen.getByTestId('sticky-add-to-cart-btn');
    fireEvent.click(stickyCartBtn);

    expect(onAddToCartVariant).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'comb-black', sku: 'SKU-BLACK' })
    );
  });

  // 6. Surface Styling Support (Marketplace vs Flado Quick-Commerce)
  it('supports surface design tokens for Marketplace and Quick-Commerce (Flado)', () => {
    const { rerender } = render(
      <ProductDetailPage
        breadcrumbItems={MOCK_BREADCRUMBS}
        images={MOCK_IMAGES}
        info={MOCK_INFO}
        price={MOCK_PRICE}
        actions={MOCK_ACTIONS}
        surface="MARKETPLACE"
        showStickyBar={true}
      />
    );

    expect(screen.getByTestId('product-detail-page')).not.toHaveClass('flado');

    rerender(
      <ProductDetailPage
        breadcrumbItems={MOCK_BREADCRUMBS}
        images={MOCK_IMAGES}
        info={MOCK_INFO}
        price={MOCK_PRICE}
        actions={MOCK_ACTIONS}
        surface="QUICK_COMMERCE"
        showStickyBar={true}
      />
    );

    expect(screen.getByTestId('product-detail-page')).toHaveClass('flado');
  });

  // 7. No fetch/localStorage commerce authority
  it('enforces props-only presentational architecture without fetch or localStorage calls', () => {
    if (!window.fetch) window.fetch = jest.fn() as any;
    const spyFetch = jest.spyOn(window, 'fetch');
    const spyStorage = jest.spyOn(Storage.prototype, 'getItem');

    render(
      <ProductDetailPage
        breadcrumbItems={MOCK_BREADCRUMBS}
        images={MOCK_IMAGES}
        info={MOCK_INFO}
        price={MOCK_PRICE}
        actions={MOCK_ACTIONS}
        deliveryInfo={MOCK_DELIVERY}
        sellerInfo={MOCK_SELLER}
      />
    );

    expect(spyFetch).not.toHaveBeenCalled();
    expect(spyStorage).not.toHaveBeenCalledWith(expect.stringContaining('pdp_price'));

    spyFetch.mockRestore();
    spyStorage.mockRestore();
  });
});
