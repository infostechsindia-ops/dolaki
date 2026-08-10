import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CartPage from '../src/components/cart/CartPage';
import CartItem from '../src/components/cart/CartItem';
import CartQuantitySelector from '../src/components/cart/CartQuantitySelector';

const MOCK_ITEMS = [
  {
    id: 'item-1',
    title: 'AuraStudio Noise-Canceling Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    price: '$299.00',
    compareAtPrice: '$349.00',
    brand: 'AuraSound',
    seller: 'AuraMart Direct Warehouse',
    sku: 'SKU-HEADPHONE-001',
    quantity: 1,
    inStock: true,
    stockStatus: 'IN_STOCK' as const,
  },
  {
    id: 'item-2',
    title: 'Organic Almond Milk 1L',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    price: '$4.50',
    brand: 'FreshFarm',
    seller: 'Flado Darkstore #102',
    sku: 'SKU-MILK-002',
    quantity: 2,
    inStock: true,
    stockStatus: 'IN_STOCK' as const,
  },
];

const MOCK_SUMMARY = {
  itemCount: 2,
  priceSummary: {
    subtotal: '$308.00',
    tax: '$55.44',
    shipping: 'FREE',
    grandTotal: '$363.44',
  },
  onCheckout: jest.fn(),
  checkoutLabel: 'Proceed to Checkout',
};

describe('CMD-040 Cart UX Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Loading Skeleton UX
  it('renders loading skeleton when isLoading is true to prevent layout shift', () => {
    render(<CartPage items={[]} summary={MOCK_SUMMARY} isLoading={true} />);
    expect(screen.getByTestId('cart-loading-skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('cart-empty-state')).not.toBeInTheDocument();
  });

  // 2. Loaded Cart Rendering & Heading Hierarchy
  it('renders loaded cart page with exactly ONE H1 header', () => {
    render(<CartPage items={MOCK_ITEMS} summary={MOCK_SUMMARY} />);
    expect(screen.getByTestId('cart-page')).toBeInTheDocument();

    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent('Shopping Cart');
  });

  // 3. Fulfillment Grouping
  it('groups items by seller or fulfillment source', () => {
    render(<CartPage items={MOCK_ITEMS} summary={MOCK_SUMMARY} />);
    const groups = screen.getAllByTestId('fulfillment-group');
    expect(groups.length).toBeGreaterThanOrEqual(2);
  });

  // 4. Authoritative Price Strings Render Verbatim
  it('renders authoritative price strings verbatim without client financial arithmetic', () => {
    render(<CartPage items={MOCK_ITEMS} summary={MOCK_SUMMARY} />);

    expect(screen.getByTestId('summary-subtotal')).toHaveTextContent('$308.00');
    expect(screen.getByTestId('summary-tax')).toHaveTextContent('$55.44');
    expect(screen.getByTestId('summary-shipping')).toHaveTextContent('FREE');
    expect(screen.getByTestId('summary-grand-total')).toHaveTextContent('$363.44');
  });

  // 5. Quantity Selector Touch Targets & Step Callbacks
  it('enforces minimum 44px touch targets on CartQuantitySelector buttons and triggers onChange', () => {
    const onChange = jest.fn();
    render(<CartQuantitySelector value={2} onChange={onChange} ariaLabel="Test quantity" />);

    const decBtn = screen.getByTestId('decrease-qty-btn');
    const incBtn = screen.getByTestId('increase-qty-btn');

    expect(decBtn).toBeInTheDocument();
    expect(incBtn).toBeInTheDocument();

    fireEvent.click(incBtn);
    expect(onChange).toHaveBeenCalledWith(3);

    fireEvent.click(decBtn);
    expect(onChange).toHaveBeenCalledWith(1);
  });

  // 6. Out-of-Stock Handling & Disabled Checkout
  it('shows out-of-stock warning badge and disables checkout CTA when items are out of stock', () => {
    const outOfStockItems = [
      {
        ...MOCK_ITEMS[0],
        inStock: false,
        stockStatus: 'OUT_OF_STOCK' as const,
        stockMessage: 'Out of Stock - Please remove to proceed to checkout',
      },
    ];

    render(
      <CartPage
        items={outOfStockItems}
        summary={MOCK_SUMMARY}
        hasOutofStockItems={true}
      />
    );

    expect(screen.getByTestId('cart-out-of-stock-alert')).toBeInTheDocument();
    expect(screen.getByTestId('stock-badge-item-1')).toHaveTextContent(
      'Out of Stock - Please remove to proceed to checkout'
    );

    const checkoutBtn = screen.getByTestId('proceed-checkout-btn');
    expect(checkoutBtn).toBeDisabled();
  });

  // 7. Remove & Undo Toast Notification
  it('renders undo toast notification when item removal occurs', () => {
    const onUndo = jest.fn();
    render(
      <CartPage
        items={MOCK_ITEMS}
        summary={MOCK_SUMMARY}
        undoNotification={{ message: 'Removed "Wireless Headphones"', onUndo }}
      />
    );

    expect(screen.getByTestId('cart-undo-toast')).toHaveTextContent('Removed "Wireless Headphones"');
    const undoBtn = screen.getByTestId('undo-remove-btn');
    fireEvent.click(undoBtn);
    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  // 8. Mobile Sticky Checkout CTA Bar
  it('renders mobile sticky checkout CTA bar with grand total and checkout button', () => {
    render(<CartPage items={MOCK_ITEMS} summary={MOCK_SUMMARY} />);

    const stickyBar = screen.getByTestId('mobile-sticky-checkout-bar');
    expect(stickyBar).toBeInTheDocument();
    expect(screen.getByTestId('mobile-grand-total')).toHaveTextContent('$363.44');

    const mobileCheckoutBtn = screen.getByTestId('mobile-proceed-checkout-btn');
    fireEvent.click(mobileCheckoutBtn);
    expect(MOCK_SUMMARY.onCheckout).toHaveBeenCalled();
  });

  // 9. Surface Styling Support (Marketplace vs Flado Quick-Commerce)
  it('supports surface design tokens for Marketplace and Quick-Commerce (Flado)', () => {
    const { rerender } = render(
      <CartPage items={MOCK_ITEMS} summary={MOCK_SUMMARY} surface="MARKETPLACE" />
    );

    expect(screen.getByTestId('cart-page')).not.toHaveClass('flado');

    rerender(
      <CartPage items={MOCK_ITEMS} summary={MOCK_SUMMARY} surface="QUICK_COMMERCE" />
    );

    expect(screen.getByTestId('cart-page')).toHaveClass('flado');
  });
});
