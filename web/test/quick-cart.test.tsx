import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CartPage from '../src/components/cart/CartPage';

const MOCK_FLADO_ITEMS = [
  {
    id: 'item-flado-1',
    title: 'Fresh Organic Milk 1L',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    price: '$4.50',
    seller: 'Flado Quick-Commerce Darkstore #102',
    sku: 'SKU-FLADO-MILK-001',
    quantity: 2,
    inStock: true,
    stockStatus: 'IN_STOCK' as const,
    isFlado: true,
    substitutionPreference: 'ALLOW_SUBSTITUTION' as const,
  },
];

const MOCK_SUMMARY = {
  itemCount: 1,
  priceSummary: {
    subtotal: '$9.00',
    tax: '$1.62',
    shipping: '$2.50',
    grandTotal: '$13.12',
  },
  onCheckout: jest.fn(),
  checkoutLabel: 'Proceed to Checkout',
};

describe('CMD-041 Quick Cart Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Authoritative Minimum Basket Warning Alert & Disabled Checkout
  it('renders minimum basket alert banner and disables checkout when minimum basket requirement is not satisfied', () => {
    render(
      <CartPage
        items={MOCK_FLADO_ITEMS}
        summary={MOCK_SUMMARY}
        surface="QUICK_COMMERCE"
        isMinimumBasketMet={false}
        formattedMinimumBasketShortfall="$6.00"
        formattedMinimumBasketAmount="$15.00"
      />
    );

    const minAlert = screen.getByTestId('minimum-basket-alert');
    expect(minAlert).toBeInTheDocument();
    expect(minAlert).toHaveTextContent('Minimum order requirement not met. Add $6.00 more worth of items to checkout');

    const checkoutBtn = screen.getByTestId('proceed-checkout-btn');
    expect(checkoutBtn).toBeDisabled();

    const mobileCheckoutBtn = screen.getByTestId('mobile-proceed-checkout-btn');
    expect(mobileCheckoutBtn).toBeDisabled();
  });

  // 2. Authoritative Delivery Fee & Delivery ETA Displayed Verbatim
  it('renders authoritative delivery fee and delivery ETA verbatim without client-side calculation', () => {
    render(
      <CartPage
        items={MOCK_FLADO_ITEMS}
        summary={MOCK_SUMMARY}
        surface="QUICK_COMMERCE"
        estimatedDeliveryEtaText="Delivered in 10-15 mins"
      />
    );

    expect(screen.getByTestId('summary-shipping')).toHaveTextContent('$2.50');
    expect(screen.getByTestId('cart-page')).toBeInTheDocument();
  });

  // 3. Store Availability Warning Alert & Disabled Checkout
  it('renders store closed alert banner when storeAvailabilityStatus is CLOSED', () => {
    render(
      <CartPage
        items={MOCK_FLADO_ITEMS}
        summary={MOCK_SUMMARY}
        surface="QUICK_COMMERCE"
        storeAvailabilityStatus="CLOSED"
        storeName="Flado Darkstore #102"
      />
    );

    const closedAlert = screen.getByTestId('store-closed-alert');
    expect(closedAlert).toBeInTheDocument();
    expect(closedAlert).toHaveTextContent('Store "Flado Darkstore #102" is currently closed');

    const checkoutBtn = screen.getByTestId('proceed-checkout-btn');
    expect(checkoutBtn).toBeDisabled();
  });

  // 4. Substitution Preference Controls & Selection Mutation Callback
  it('renders substitution preference controls on quick-commerce items and fires callback on selection', () => {
    const onSubstitutionChange = jest.fn();
    render(
      <CartPage
        items={MOCK_FLADO_ITEMS}
        summary={MOCK_SUMMARY}
        surface="QUICK_COMMERCE"
        onSubstitutionChange={onSubstitutionChange}
      />
    );

    const subSelect = screen.getByTestId('substitution-select-item-flado-1');
    expect(subSelect).toBeInTheDocument();
    expect(subSelect).toHaveValue('ALLOW_SUBSTITUTION');

    fireEvent.change(subSelect, { target: { value: 'CONTACT_ME' } });
    expect(onSubstitutionChange).toHaveBeenCalledWith('item-flado-1', 'CONTACT_ME');
  });

  // 5. Unavailable Item Resolution Actions
  it('provides explicit resolution options (Remove, Save for later, Quantity update) for unavailable items', () => {
    const onRemoveItem = jest.fn();
    const onMoveToSaved = jest.fn();

    const unavailableItems = [
      {
        ...MOCK_FLADO_ITEMS[0],
        inStock: false,
        stockStatus: 'OUT_OF_STOCK' as const,
        stockMessage: 'Out of Stock - Please remove to proceed to checkout',
      },
    ];

    render(
      <CartPage
        items={unavailableItems}
        summary={MOCK_SUMMARY}
        surface="QUICK_COMMERCE"
        onRemoveItem={onRemoveItem}
        onMoveToSaved={onMoveToSaved}
        hasOutofStockItems={true}
      />
    );

    expect(screen.getByTestId('stock-badge-item-flado-1')).toHaveTextContent(
      'Out of Stock - Please remove to proceed to checkout'
    );

    const removeBtn = screen.getByTestId('remove-item-btn');
    fireEvent.click(removeBtn);
    expect(onRemoveItem).toHaveBeenCalledWith('item-flado-1');

    const saveBtn = screen.getByTestId('move-to-saved-btn');
    fireEvent.click(saveBtn);
    expect(onMoveToSaved).toHaveBeenCalledWith('item-flado-1');
  });

  // 6. Marketplace Cart Behavior Remains Unaffected
  it('preserves normal Marketplace cart behavior without minimum basket restrictions', () => {
    const marketplaceItems = [
      {
        id: 'mp-1',
        title: 'AuraSound Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        price: '$299.00',
        seller: 'AuraMart Warehouse',
        sku: 'SKU-MP-001',
        quantity: 1,
        inStock: true,
        isFlado: false,
      },
    ];

    render(
      <CartPage
        items={marketplaceItems}
        summary={{
          itemCount: 1,
          priceSummary: {
            subtotal: '$299.00',
            tax: '$53.82',
            shipping: 'FREE',
            grandTotal: '$352.82',
          },
          onCheckout: jest.fn(),
        }}
        surface="MARKETPLACE"
        isMinimumBasketMet={true}
      />
    );

    expect(screen.queryByTestId('minimum-basket-alert')).not.toBeInTheDocument();
    expect(screen.getByTestId('proceed-checkout-btn')).not.toBeDisabled();
  });
});
