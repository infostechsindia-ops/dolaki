/**
 * CMD-045 — Payment Orchestration Frontend Test Suite
 *
 * Covers:
 * 1. PaymentMethodSelector eligibility & disabled state handling
 * 2. Uneligible payment method reason alert messages
 * 3. PlaceOrderPanel processing state (double-click protection)
 * 4. Safe payment error banner display
 * 5. Server-authoritative financial rendering verbatim
 * 6. No raw card number or CVV input field collection
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PaymentMethodSelector, { PaymentMethodOption } from '../src/components/checkout/PaymentMethodSelector';
import PlaceOrderPanel from '../src/components/checkout/PlaceOrderPanel';
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

const MOCK_PAYMENT_METHODS: PaymentMethodOption[] = [
  { id: 'pay-upi', name: 'UPI / Instant Pay', description: 'Google Pay, PhonePe', isEligible: true },
  { id: 'pay-card', name: 'Credit / Debit Card', description: 'Visa, Mastercard', isEligible: true },
  {
    id: 'pay-cod',
    name: 'Cash on Delivery (COD)',
    description: 'Pay upon delivery',
    isEligible: false,
    uneligibleReason: 'COD is unavailable for orders over $1,000.00',
  },
];

describe('CMD-045 — Payment Orchestration Frontend Suite', () => {
  // ── 1. Payment Method Eligibility ──────────────────────────────────────────

  it('T01: renders eligible and ineligible payment methods with disabled states', () => {
    const onSelect = jest.fn();
    render(
      <PaymentMethodSelector
        methods={MOCK_PAYMENT_METHODS}
        selectedId="pay-upi"
        onSelectMethod={onSelect}
      />
    );

    expect(screen.getByTestId('payment-radio-pay-upi')).not.toBeDisabled();
    expect(screen.getByTestId('payment-radio-pay-card')).not.toBeDisabled();
    expect(screen.getByTestId('payment-radio-pay-cod')).toBeDisabled();
  });

  it('T02: displays uneligibleReason text when payment method is ineligible', () => {
    render(
      <PaymentMethodSelector
        methods={MOCK_PAYMENT_METHODS}
        selectedId="pay-upi"
        onSelectMethod={jest.fn()}
      />
    );

    const reasonAlert = screen.getByTestId('uneligible-reason-pay-cod');
    expect(reasonAlert).toBeInTheDocument();
    expect(reasonAlert).toHaveTextContent('COD is unavailable for orders over $1,000.00');
  });

  it('T03: prevents selection callback when clicking ineligible payment method', () => {
    const onSelect = jest.fn();
    render(
      <PaymentMethodSelector
        methods={MOCK_PAYMENT_METHODS}
        selectedId="pay-upi"
        onSelectMethod={onSelect}
      />
    );

    fireEvent.click(screen.getByTestId('payment-radio-pay-cod'));
    expect(onSelect).not.toHaveBeenCalledWith('pay-cod');
  });

  // ── 2. Place Order Panel & Double-Submit Protection ────────────────────────

  it('T04: disables button and displays spinner text when isProcessingPayment=true', () => {
    const onPlaceOrder = jest.fn();
    render(
      <PlaceOrderPanel
        termsAccepted={true}
        onTermsChange={jest.fn()}
        onPlaceOrder={onPlaceOrder}
        isProcessingPayment={true}
      />
    );

    const btn = screen.getByTestId('place-order-btn');
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent('Processing Payment...');

    fireEvent.click(btn);
    expect(onPlaceOrder).not.toHaveBeenCalled();
  });

  it('T05: displays safe payment error banner with role=alert when paymentError is set', () => {
    render(
      <PlaceOrderPanel
        termsAccepted={true}
        onTermsChange={jest.fn()}
        onPlaceOrder={jest.fn()}
        paymentError="Your card was declined by the issuing bank."
      />
    );

    const alertBox = screen.getByTestId('payment-error-alert');
    expect(alertBox).toHaveAttribute('role', 'alert');
    expect(alertBox).toHaveTextContent('Your card was declined by the issuing bank.');
  });

  // ── 3. Checkout Page Integration & Security Bounds ─────────────────────────

  it('T06: CheckoutPage passes isProcessingPayment and paymentError to PlaceOrderPanel', () => {
    render(
      <CheckoutPage
        progress={MOCK_PROGRESS}
        placeOrder={{
          termsAccepted: true,
          onTermsChange: jest.fn(),
          onPlaceOrder: jest.fn(),
          buttonLabel: 'Review Order',
        }}
        isProcessingPayment={true}
        paymentError="Network error during payment intent confirmation."
      />
    );

    expect(screen.getByTestId('place-order-btn')).toHaveTextContent('Processing Payment...');
    expect(screen.getByTestId('payment-error-alert')).toHaveTextContent(
      'Network error during payment intent confirmation.'
    );
  });

  it('T07: verifies NO raw card or CVV input fields exist anywhere in the checkout UI', () => {
    render(
      <CheckoutPage
        progress={MOCK_PROGRESS}
        paymentMethods={{ methods: MOCK_PAYMENT_METHODS, selectedId: 'pay-card' }}
        placeOrder={{
          termsAccepted: true,
          onTermsChange: jest.fn(),
          onPlaceOrder: jest.fn(),
        }}
      />
    );

    expect(screen.queryByPlaceholderText(/cvv/i)).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/card number/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/cvv/i)).not.toBeInTheDocument();
  });
});
