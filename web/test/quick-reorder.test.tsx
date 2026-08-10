import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuickReorderSection, { QuickReorderItem } from '../src/components/flado/QuickReorderSection';

describe('CMD-058 Quick Reorder Frontend Integration', () => {
  it('1. & 3. renders reorderable items with current formatted price verbatim from props', () => {
    const mockItems: QuickReorderItem[] = [
      {
        productId: 'prod-milk-1',
        variantId: 'v-milk-1',
        sku: 'SKU-MILK',
        title: 'Organic Whole Milk 1L',
        historicalPriceMinor: 299,
        currentPriceMinor: 349,
        formattedCurrentPrice: '$3.49',
        isAvailable: true,
        availableStock: 8,
        fulfillmentSourceId: 'shop-101',
      },
    ];

    render(<QuickReorderSection reorderItems={mockItems} />);

    expect(screen.getByTestId('quick-reorder-section')).toBeInTheDocument();
    expect(screen.getByText('Organic Whole Milk 1L')).toBeInTheDocument();
    expect(screen.getByTestId('current-price')).toHaveTextContent('$3.49');
    expect(screen.getByTestId('quick-add-btn-v-milk-1')).toBeEnabled();
  });

  it('4. renders unavailable items with out-of-stock badge and disabled action button', () => {
    const mockItems: QuickReorderItem[] = [
      {
        productId: 'prod-bread-1',
        variantId: 'v-bread-1',
        sku: 'SKU-BREAD',
        title: 'Artisan Sourdough Bread',
        historicalPriceMinor: 499,
        currentPriceMinor: 499,
        formattedCurrentPrice: '$4.99',
        isAvailable: false,
        availableStock: 0,
        unavailableReasonCode: 'OUT_OF_STOCK',
        unavailableReason: 'Currently out of stock at this darkstore',
        fulfillmentSourceId: 'shop-101',
      },
    ];

    render(<QuickReorderSection reorderItems={mockItems} />);

    expect(screen.getByTestId('unavailable-reason-badge')).toHaveTextContent('Currently out of stock at this darkstore');
    expect(screen.getByTestId('quick-add-btn-v-bread-1')).toBeDisabled();
  });

  it('9. renders empty state when customer has no previous order history', () => {
    render(<QuickReorderSection reorderItems={[]} />);

    expect(screen.getByTestId('quick-reorder-empty')).toBeInTheDocument();
    expect(screen.getByText('No previous orders found')).toBeInTheDocument();
  });

  it('10. triggers onReorderItem callback when 1-tap add is clicked', () => {
    const mockItem: QuickReorderItem = {
      productId: 'prod-eggs-1',
      variantId: 'v-eggs-1',
      sku: 'SKU-EGGS',
      title: 'Free Range Eggs 12pk',
      historicalPriceMinor: 399,
      currentPriceMinor: 399,
      formattedCurrentPrice: '$3.99',
      isAvailable: true,
      availableStock: 12,
      fulfillmentSourceId: 'shop-101',
    };

    const handleReorder = jest.fn();
    render(<QuickReorderSection reorderItems={[mockItem]} onReorderItem={handleReorder} />);

    fireEvent.click(screen.getByTestId('quick-add-btn-v-eggs-1'));
    expect(handleReorder).toHaveBeenCalledWith(mockItem);
  });
});
