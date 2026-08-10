import React from 'react';
import { render, screen } from '@testing-library/react';
import QuickFeeBreakdown from '../src/components/cart/QuickFeeBreakdown';

describe('CMD-057 Quick Fees Frontend Integration', () => {
  it('1. & 4. QuickFeeBreakdown renders configured fee lines and amounts verbatim from server props', () => {
    const mockFeeLines = [
      { code: 'DELIVERY_FEE', label: '10-Minute Express Delivery', amountMinor: 250, formattedAmount: '$2.50', isWaived: false },
      { code: 'HANDLING_FEE', label: 'Handling & Cold Chain Fee', amountMinor: 100, formattedAmount: '$1.00', isWaived: false },
    ];

    render(<QuickFeeBreakdown feeLines={mockFeeLines} />);

    expect(screen.getByTestId('quick-fee-breakdown')).toBeInTheDocument();
    expect(screen.getByTestId('fee-line-delivery_fee')).toHaveTextContent('$2.50');
    expect(screen.getByTestId('fee-line-handling_fee')).toHaveTextContent('$1.00');
  });

  it('2. QuickFeeBreakdown renders waived delivery fee when free threshold is met', () => {
    const mockFeeLines = [
      { code: 'DELIVERY_FEE', label: '10-Minute Express Delivery', amountMinor: 0, formattedAmount: 'FREE', isWaived: true, waiverReason: 'Free delivery threshold met' },
    ];

    render(<QuickFeeBreakdown feeLines={mockFeeLines} />);

    expect(screen.getByTestId('fee-line-delivery_fee')).toHaveTextContent('FREE (Free delivery threshold met)');
  });

  it('3. QuickFeeBreakdown renders small basket surcharge when configured', () => {
    const mockFeeLines = [
      { code: 'SMALL_BASKET_FEE', label: 'Small Basket Surcharge', amountMinor: 150, formattedAmount: '$1.50', isWaived: false, description: 'Applies below minimum' },
    ];

    render(<QuickFeeBreakdown feeLines={mockFeeLines} />);

    expect(screen.getByTestId('fee-line-small_basket_fee')).toHaveTextContent('$1.50');
    expect(screen.getByText('Applies below minimum')).toBeInTheDocument();
  });

  it('6. Renders remaining amount banner for free delivery threshold', () => {
    const mockThreshold = {
      thresholdMinor: 500,
      formattedThreshold: '$5.00',
      remainingForFreeDeliveryMinor: 150,
      formattedRemainingForFreeDelivery: '$1.50',
      isEligibleForFreeDelivery: false,
    };

    render(<QuickFeeBreakdown feeLines={[]} freeDeliveryThreshold={mockThreshold} />);

    expect(screen.getByTestId('free-delivery-threshold-banner')).toHaveTextContent('Add $1.50 more for FREE delivery!');
  });

  it('9. Accessible aria-live region is present on fee breakdown container', () => {
    render(<QuickFeeBreakdown feeLines={[]} />);

    expect(screen.getByTestId('quick-fee-breakdown')).toHaveAttribute('aria-live', 'polite');
  });
});
