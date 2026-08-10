import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CheckoutPage from '../src/components/checkout/CheckoutPage';

const MOCK_PROGRESS = {
  currentStep: 'review' as const,
  steps: [
    { id: 'cart' as const, label: 'Cart' },
    { id: 'address' as const, label: 'Address' },
    { id: 'payment' as const, label: 'Payment' },
    { id: 'review' as const, label: 'Review' },
  ],
};

const MOCK_ADDRESS = {
  address: {
    name: 'Arif Al Nukhbah',
    phone: '+91 98765 43210',
    addressLine1: 'Apt 402, Sea Green Apartments',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    postalCode: '400050',
    isDefault: true,
  },
};

const MOCK_DELIVERY_METHODS = {
  methods: [
    {
      id: 'del-standard',
      name: 'AuraMart Standard Delivery',
      description: 'Standard Courier Delivery',
      etaText: '1-3 Business Days',
      priceText: '$40.00',
    },
  ],
  selectedId: 'del-standard',
  onSelectMethod: jest.fn(),
};

const MOCK_PAYMENT_METHODS = {
  methods: [
    { id: 'pay-upi', name: 'UPI / Instant Pay', description: 'Google Pay, PhonePe' },
    { id: 'pay-card', name: 'Credit / Debit Card', description: 'Visa, Mastercard' },
    { id: 'pay-cod', name: 'Cash on Delivery (COD)', description: 'Pay upon delivery' },
  ],
  selectedId: 'pay-upi',
  onSelectMethod: jest.fn(),
};

const MOCK_ORDER_SUMMARY = {
  items: [
    {
      id: 'item-1',
      title: 'Wireless Headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      priceText: '$299.00',
      quantity: 1,
    },
  ],
};

const MOCK_BILLING_SUMMARY = {
  subtotal: '$299.00',
  shipping: '$40.00',
  tax: '$53.82',
  discount: '$0.00',
  grandTotal: '$392.82',
};

const MOCK_PLACE_ORDER = {
  termsAccepted: true,
  onTermsChange: jest.fn(),
  onPlaceOrder: jest.fn(),
  buttonLabel: 'Review Order Preview',
};

describe('CMD-042 Checkout Preview Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Loading Skeleton UX
  it('renders loading skeleton when isLoading is true', () => {
    render(<CheckoutPage progress={MOCK_PROGRESS} placeOrder={MOCK_PLACE_ORDER} isLoading={true} />);
    expect(screen.getByTestId('checkout-loading-skeleton')).toBeInTheDocument();
  });

  // 2. Heading Hierarchy & Loaded Preview Layout
  it('renders checkout preview page with exactly ONE H1 header', () => {
    render(
      <CheckoutPage
        progress={MOCK_PROGRESS}
        address={MOCK_ADDRESS}
        deliveryMethods={MOCK_DELIVERY_METHODS}
        paymentMethods={MOCK_PAYMENT_METHODS}
        orderSummary={MOCK_ORDER_SUMMARY}
        billingSummary={MOCK_BILLING_SUMMARY}
        placeOrder={MOCK_PLACE_ORDER}
      />
    );

    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent('Checkout Preview');
  });

  // 3. Authoritative Billing Summary Rendered Verbatim
  it('renders authoritative billing summary strings verbatim without client financial arithmetic', () => {
    render(
      <CheckoutPage
        progress={MOCK_PROGRESS}
        address={MOCK_ADDRESS}
        deliveryMethods={MOCK_DELIVERY_METHODS}
        paymentMethods={MOCK_PAYMENT_METHODS}
        orderSummary={MOCK_ORDER_SUMMARY}
        billingSummary={MOCK_BILLING_SUMMARY}
        placeOrder={MOCK_PLACE_ORDER}
      />
    );

    expect(screen.getByTestId('billing-subtotal')).toHaveTextContent('$299.00');
    expect(screen.getByTestId('billing-tax')).toHaveTextContent('$53.82');
    expect(screen.getByTestId('billing-shipping')).toHaveTextContent('$40.00');
    expect(screen.getByTestId('billing-grand-total')).toHaveTextContent('$392.82');
  });

  // 4. Blocker Alert Banner & Disabled Action Panel
  it('renders blocker alert banner and disables place order CTA when blockers exist', () => {
    render(
      <CheckoutPage
        progress={MOCK_PROGRESS}
        address={MOCK_ADDRESS}
        deliveryMethods={MOCK_DELIVERY_METHODS}
        paymentMethods={MOCK_PAYMENT_METHODS}
        orderSummary={MOCK_ORDER_SUMMARY}
        billingSummary={MOCK_BILLING_SUMMARY}
        placeOrder={MOCK_PLACE_ORDER}
        blockers={['Minimum order requirement not met', 'Selected address is unserviceable']}
      />
    );

    const alert = screen.getByTestId('checkout-blocker-alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Minimum order requirement not met');
    expect(alert).toHaveTextContent('Selected address is unserviceable');

    const placeOrderBtn = screen.getByTestId('place-order-btn');
    expect(placeOrderBtn).toBeDisabled();
  });

  // 5. Saved Address Card & Delivery Method Options
  it('renders saved address card and interactive delivery/payment selectors', () => {
    render(
      <CheckoutPage
        progress={MOCK_PROGRESS}
        address={MOCK_ADDRESS}
        deliveryMethods={MOCK_DELIVERY_METHODS}
        paymentMethods={MOCK_PAYMENT_METHODS}
        orderSummary={MOCK_ORDER_SUMMARY}
        billingSummary={MOCK_BILLING_SUMMARY}
        placeOrder={MOCK_PLACE_ORDER}
      />
    );

    expect(screen.getByTestId('shipping-address-card')).toHaveTextContent('Arif Al Nukhbah');
    expect(screen.getByTestId('delivery-method-selector')).toBeInTheDocument();
    expect(screen.getByTestId('payment-method-selector')).toBeInTheDocument();
  });

  // 6. Mobile Sticky Bar & Order Review CTA
  it('renders mobile sticky bar with payable grand total', () => {
    render(
      <CheckoutPage
        progress={MOCK_PROGRESS}
        address={MOCK_ADDRESS}
        deliveryMethods={MOCK_DELIVERY_METHODS}
        paymentMethods={MOCK_PAYMENT_METHODS}
        orderSummary={MOCK_ORDER_SUMMARY}
        billingSummary={MOCK_BILLING_SUMMARY}
        placeOrder={MOCK_PLACE_ORDER}
        grandTotalFormatted="$392.82"
      />
    );

    const stickyBar = screen.getByTestId('mobile-checkout-sticky-bar');
    expect(stickyBar).toBeInTheDocument();
    expect(screen.getByTestId('mobile-checkout-grand-total')).toHaveTextContent('$392.82');

    const mobileBtn = screen.getByTestId('mobile-place-order-btn');
    fireEvent.click(mobileBtn);
    expect(MOCK_PLACE_ORDER.onPlaceOrder).toHaveBeenCalled();
  });

  // 7. Surface Styling Support (Marketplace vs Flado Quick Commerce)
  it('supports surface design tokens for Marketplace and Quick Commerce', () => {
    const { rerender } = render(
      <CheckoutPage
        progress={MOCK_PROGRESS}
        placeOrder={MOCK_PLACE_ORDER}
        surface="MARKETPLACE"
      />
    );
    expect(screen.getByTestId('checkout-page')).not.toHaveClass('flado');

    rerender(
      <CheckoutPage
        progress={MOCK_PROGRESS}
        placeOrder={MOCK_PLACE_ORDER}
        surface="QUICK_COMMERCE"
      />
    );
    expect(screen.getByTestId('checkout-page')).toHaveClass('flado');
  });
});
