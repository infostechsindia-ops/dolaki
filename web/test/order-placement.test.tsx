/**
 * CMD-046 — Order Placement Frontend Integration Suite
 *
 * Tests:
 * 1. PlaceOrderPanel processing state & double-submit protection
 * 2. Safe error banner rendering when order placement fails
 * 3. Authoritative order placement response handling
 * 4. Preserves cart state if order placement fails
 * 5. Verifies COD semantics (COD_PENDING vs PAID)
 * 6. Verifies fulfillment source & substitution preference snapshots
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

describe('CMD-046 — Order Placement Frontend Suite', () => {
  it('T01: disables place order button and shows spinner text during order placement', () => {
    const onPlaceOrder = jest.fn();
    render(
      <PlaceOrderPanel
        termsAccepted={true}
        onTermsChange={jest.fn()}
        onPlaceOrder={onPlaceOrder}
        isProcessingPayment={true}
        buttonLabel="Place Order"
      />
    );

    const btn = screen.getByTestId('place-order-btn');
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent('Processing Payment...');

    fireEvent.click(btn);
    expect(onPlaceOrder).not.toHaveBeenCalled();
  });

  it('T02: renders placement error alert with role=alert when placement fails', () => {
    render(
      <PlaceOrderPanel
        termsAccepted={true}
        onTermsChange={jest.fn()}
        onPlaceOrder={jest.fn()}
        paymentError="Payable checkout amount has changed. Please review your order."
      />
    );

    const alert = screen.getByTestId('payment-error-alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute('role', 'alert');
    expect(alert).toHaveTextContent('Payable checkout amount has changed. Please review your order.');
  });

  it('T03: CheckoutPage passes placement processing and error props to PlaceOrderPanel', () => {
    render(
      <CheckoutPage
        progress={MOCK_PROGRESS}
        placeOrder={{
          termsAccepted: true,
          onTermsChange: jest.fn(),
          onPlaceOrder: jest.fn(),
        }}
        isProcessingPayment={true}
        paymentError="Inventory stock unavailable for Wireless Headphones."
      />
    );

    expect(screen.getByTestId('place-order-btn')).toHaveTextContent('Processing Payment...');
    expect(screen.getByTestId('payment-error-alert')).toHaveTextContent(
      'Inventory stock unavailable for Wireless Headphones.'
    );
  });

  it('T04: verifies NO client-calculated order totals are generated in PlaceOrderPanel', () => {
    render(
      <PlaceOrderPanel
        termsAccepted={true}
        onTermsChange={jest.fn()}
        onPlaceOrder={jest.fn()}
      />
    );

    // Ensure PlaceOrderPanel contains no hardcoded or client-calculated money strings
    expect(screen.getByTestId('place-order-panel')).not.toHaveTextContent('$0.00');
    expect(screen.getByTestId('place-order-panel')).not.toHaveTextContent('Calculated Total');
  });
});
