import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CheckoutPage from '../src/components/checkout/CheckoutPage';
import CheckoutProgress from '../src/components/checkout/CheckoutProgress';
import ShippingAddressCard from '../src/components/checkout/ShippingAddressCard';
import DeliveryMethodSelector from '../src/components/checkout/DeliveryMethodSelector';
import PaymentMethodSelector from '../src/components/checkout/PaymentMethodSelector';
import BillingSummary from '../src/components/checkout/BillingSummary';
import OrderSummary from '../src/components/checkout/OrderSummary';
import CheckoutNotes from '../src/components/checkout/CheckoutNotes';
import PlaceOrderPanel from '../src/components/checkout/PlaceOrderPanel';
import CheckoutEmptyState from '../src/components/checkout/CheckoutEmptyState';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

const MOCK_ADDRESS = {
  name: 'John Doe',
  phone: '+91 98765 43210',
  addressLine1: '123 Market Street',
  addressLine2: 'Apt 4B',
  city: 'Mumbai',
  state: 'Maharashtra',
  country: 'India',
  postalCode: '400001',
  isDefault: true,
};

const MOCK_DELIVERY_METHODS = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    description: 'Delivered in 3-5 business days',
    priceText: 'FREE',
    etaText: '3-5 days',
  },
  {
    id: 'express',
    name: 'Express Delivery',
    description: 'Delivered tomorrow by 12 PM',
    priceText: '₹99',
    etaText: 'Tomorrow',
  },
];

const MOCK_PAYMENT_METHODS = [
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay cash when your order arrives',
  },
  {
    id: 'upi',
    name: 'UPI / Google Pay',
    description: 'Instant payment via UPI app',
    badgeText: 'INSTANT',
  },
];

const MOCK_ORDER_ITEMS = [
  {
    id: 'item-1',
    title: 'Wireless Headphones',
    quantity: 2,
    priceText: '₹2,999',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
  },
];

const MOCK_BILLING_SUMMARY = {
  subtotal: '₹5,998',
  discount: '₹500',
  shipping: 'FREE',
  tax: '₹180',
  grandTotal: '₹5,678',
};

describe('CMD-029 Customer Checkout Foundation', () => {
  // 1. CheckoutProgress
  it('renders CheckoutProgress displaying steps with current step highlighted', () => {
    render(<CheckoutProgress currentStep="address" />);

    expect(screen.getByTestId('checkout-progress')).toBeInTheDocument();
    expect(screen.getByTestId('checkout-step-address')).toHaveAttribute('aria-current', 'step');
    expect(screen.getByTestId('checkout-step-cart')).toBeInTheDocument();
    expect(screen.getByTestId('checkout-step-payment')).toBeInTheDocument();
    expect(screen.getByTestId('checkout-step-review')).toBeInTheDocument();
  });

  // 2. ShippingAddressCard
  it('renders ShippingAddressCard with full address details and triggers edit callback', () => {
    const onEdit = jest.fn();
    render(<ShippingAddressCard address={MOCK_ADDRESS} onEdit={onEdit} />);

    expect(screen.getByTestId('shipping-address-card')).toBeInTheDocument();
    expect(screen.getByTestId('address-name')).toHaveTextContent('John Doe');
    expect(screen.getByTestId('address-phone')).toHaveTextContent('+91 98765 43210');
    expect(screen.getByTestId('address-lines')).toHaveTextContent('123 Market Street');
    expect(screen.getByTestId('address-lines')).toHaveTextContent('Mumbai, Maharashtra 400001');

    const editBtn = screen.getByTestId('edit-address-btn');
    fireEvent.click(editBtn);
    expect(onEdit).toHaveBeenCalled();
  });

  // 3. DeliveryMethodSelector
  it('renders DeliveryMethodSelector inside fieldset/legend with radio buttons', () => {
    const onSelectMethod = jest.fn();
    render(
      <DeliveryMethodSelector
        methods={MOCK_DELIVERY_METHODS}
        selectedId="standard"
        onSelectMethod={onSelectMethod}
      />
    );

    expect(screen.getByTestId('delivery-method-selector')).toBeInTheDocument();
    expect(screen.getByText('Delivery Method')).toBeInTheDocument();

    const expressRadio = screen.getByTestId('delivery-radio-express');
    fireEvent.click(expressRadio);
    expect(onSelectMethod).toHaveBeenCalledWith('express');
  });

  // 4. PaymentMethodSelector
  it('renders PaymentMethodSelector inside fieldset/legend with radio buttons', () => {
    const onSelectMethod = jest.fn();
    render(
      <PaymentMethodSelector
        methods={MOCK_PAYMENT_METHODS}
        selectedId="cod"
        onSelectMethod={onSelectMethod}
      />
    );

    expect(screen.getByTestId('payment-method-selector')).toBeInTheDocument();
    expect(screen.getByText('Payment Method')).toBeInTheDocument();

    const upiRadio = screen.getByTestId('payment-radio-upi');
    fireEvent.click(upiRadio);
    expect(onSelectMethod).toHaveBeenCalledWith('upi');
  });

  // 5. BillingSummary
  it('renders BillingSummary using semantic dl/dt/dd displaying values from props', () => {
    render(<BillingSummary {...MOCK_BILLING_SUMMARY} />);

    expect(screen.getByTestId('billing-summary')).toBeInTheDocument();
    expect(screen.getByTestId('billing-subtotal')).toHaveTextContent('₹5,998');
    expect(screen.getByTestId('billing-discount')).toHaveTextContent('-₹500');
    expect(screen.getByTestId('billing-shipping')).toHaveTextContent('FREE');
    expect(screen.getByTestId('billing-tax')).toHaveTextContent('₹180');
    expect(screen.getByTestId('billing-grand-total')).toHaveTextContent('₹5,678');
  });

  // 6. OrderSummary
  it('renders OrderSummary displaying cart items, quantity, price, and thumbnail', () => {
    render(<OrderSummary items={MOCK_ORDER_ITEMS} />);

    expect(screen.getByTestId('order-summary')).toBeInTheDocument();
    expect(screen.getByTestId('order-summary-item-item-1')).toBeInTheDocument();
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    expect(screen.getByText('Qty: 2')).toBeInTheDocument();
    expect(screen.getByText('₹2,999')).toBeInTheDocument();
  });

  // 7. CheckoutNotes
  it('renders CheckoutNotes textarea with associated label and fires onChange', () => {
    const onChange = jest.fn();
    render(<CheckoutNotes value="Gate code 1234" onChange={onChange} />);

    expect(screen.getByTestId('checkout-notes')).toBeInTheDocument();
    expect(screen.getByLabelText(/Delivery Instructions/i)).toBeInTheDocument();
    const textarea = screen.getByTestId('checkout-notes-input');
    expect(textarea).toHaveValue('Gate code 1234');

    fireEvent.change(textarea, { target: { value: 'Leave at front desk' } });
    expect(onChange).toHaveBeenCalledWith('Leave at front desk');
  });

  // 8. PlaceOrderPanel
  it('renders PlaceOrderPanel with terms checkbox and place order button', () => {
    const onTermsChange = jest.fn();
    const onPlaceOrder = jest.fn();

    render(
      <PlaceOrderPanel
        termsAccepted={true}
        onTermsChange={onTermsChange}
        onPlaceOrder={onPlaceOrder}
      />
    );

    expect(screen.getByTestId('place-order-panel')).toBeInTheDocument();
    const checkbox = screen.getByTestId('terms-checkbox');
    expect(checkbox).toBeChecked();

    const placeOrderBtn = screen.getByTestId('place-order-btn');
    fireEvent.click(placeOrderBtn);
    expect(onPlaceOrder).toHaveBeenCalled();
  });

  // 9. CheckoutEmptyState
  it('renders CheckoutEmptyState reusing EmptyState UI primitive when empty', () => {
    const onReturnToCart = jest.fn();
    render(<CheckoutEmptyState onReturnToCart={onReturnToCart} />);

    expect(screen.getByTestId('checkout-empty-state')).toBeInTheDocument();
    expect(screen.getByText('No items to checkout')).toBeInTheDocument();

    const returnBtn = screen.getByRole('button', { name: /Return to Cart/i });
    fireEvent.click(returnBtn);
    expect(onReturnToCart).toHaveBeenCalled();
  });

  // 10. Full CheckoutPage composition
  it('composes full CheckoutPage with single H1, progress, address, methods, and sidebar', () => {
    render(
      <CheckoutPage
        progress={{ currentStep: 'address' }}
        address={{ address: MOCK_ADDRESS }}
        deliveryMethods={{ methods: MOCK_DELIVERY_METHODS, selectedId: 'standard' }}
        paymentMethods={{ methods: MOCK_PAYMENT_METHODS, selectedId: 'cod' }}
        notes={{ value: '', onChange: jest.fn() }}
        orderSummary={{ items: MOCK_ORDER_ITEMS }}
        billingSummary={MOCK_BILLING_SUMMARY}
        placeOrder={{
          termsAccepted: true,
          onTermsChange: jest.fn(),
          onPlaceOrder: jest.fn(),
        }}
      />
    );

    expect(screen.getByTestId('checkout-page')).toBeInTheDocument();
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s.length).toBe(1);
    expect(h1s[0]).toHaveTextContent('Checkout');

    expect(screen.getByTestId('checkout-progress')).toBeInTheDocument();
    expect(screen.getByTestId('shipping-address-card')).toBeInTheDocument();
    expect(screen.getByTestId('delivery-method-selector')).toBeInTheDocument();
    expect(screen.getByTestId('payment-method-selector')).toBeInTheDocument();
    expect(screen.getByTestId('checkout-notes')).toBeInTheDocument();
    expect(screen.getByTestId('order-summary')).toBeInTheDocument();
    expect(screen.getByTestId('billing-summary')).toBeInTheDocument();
    expect(screen.getByTestId('place-order-panel')).toBeInTheDocument();
  });

  // 11. Invariants: Props-only architecture (No fetch, No localStorage)
  it('enforces props-only architecture without fetch or localStorage calls', () => {
    if (!window.fetch) window.fetch = jest.fn() as any;
    const spyFetch = jest.spyOn(window, 'fetch');
    const spyStorage = jest.spyOn(Storage.prototype, 'getItem');

    render(
      <CheckoutPage
        progress={{ currentStep: 'address' }}
        placeOrder={{
          termsAccepted: true,
          onTermsChange: jest.fn(),
          onPlaceOrder: jest.fn(),
        }}
      />
    );

    expect(spyFetch).not.toHaveBeenCalled();
    expect(spyStorage).not.toHaveBeenCalledWith(expect.stringContaining('checkout'));

    spyFetch.mockRestore();
    spyStorage.mockRestore();
  });
});
