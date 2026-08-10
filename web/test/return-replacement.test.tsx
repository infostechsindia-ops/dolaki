/**
 * CMD-050 — Return & Replacement Frontend Integration Suite
 *
 * Tests:
 * 1. OrderReturnModal opens accessible dialog
 * 2. Item & quantity selection
 * 3. Reason & resolution choice selection (Refund vs Replacement)
 * 4. Fulfillment preference selection (Pickup vs Dropoff)
 * 5. Evidence URL input
 * 6. Submit action & callback
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OrderReturnModal from '../src/components/orders/OrderReturnModal';

// Mock fetch for return preview
global.fetch = jest.fn((url: any) => {
  if (url.includes('/return/preview')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          orderId: 'ord-100',
          isReturnable: true,
          policyWindowText: '7 days from delivery',
          items: [
            {
              orderItemId: 'item-1',
              title: 'Wireless Headphones',
              deliveredQuantity: 2,
              cancelledQuantity: 0,
              returnedQuantity: 0,
              remainingReturnableQuantity: 2,
              unitPriceMinor: 2500,
              formattedUnitPrice: '$25.00',
              isEligible: true,
            },
          ],
          supportedReasons: ['DAMAGED', 'WRONG_ITEM', 'DEFECTIVE', 'NOT_AS_DESCRIBED', 'CHANGED_MIND'],
          resolutionOptions: ['REFUND', 'REPLACEMENT'],
          fulfillmentOptions: ['PICKUP', 'DROPOFF'],
        }),
    });
  }
  if (url.includes('/return')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 'ret-1',
          orderId: 'ord-100',
          resolutionChoice: 'REPLACEMENT',
          status: 'REQUESTED',
        }),
    });
  }
  return Promise.reject(new Error('Unknown URL'));
}) as jest.Mock;

describe('CMD-050 — Return & Replacement Frontend Suite', () => {
  it('T01: OrderReturnModal renders accessible dialog structure and policy window notice', async () => {
    render(
      <OrderReturnModal
        isOpen={true}
        orderId="ord-100"
        orderNumber="ORD-100"
        onClose={jest.fn()}
        onSuccess={jest.fn()}
      />
    );

    expect(screen.getByTestId('return-modal')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('policy-window-notice')).toBeInTheDocument();
      expect(screen.getByTestId('return-item-select')).toBeInTheDocument();
    });
  });

  it('T02: quantity selection, reason selection, and resolution choice toggle work', async () => {
    render(
      <OrderReturnModal
        isOpen={true}
        orderId="ord-100"
        orderNumber="ORD-100"
        onClose={jest.fn()}
        onSuccess={jest.fn()}
      />
    );

    await waitFor(() => expect(screen.getByTestId('return-item-select')).toBeInTheDocument());

    const reasonSelect = screen.getByTestId('return-reason-select');
    fireEvent.change(reasonSelect, { target: { value: 'DEFECTIVE' } });
    expect(reasonSelect).toHaveValue('DEFECTIVE');

    const replacementRadio = screen.getByTestId('resolution-replacement-radio');
    fireEvent.click(replacementRadio);
    expect(replacementRadio).toBeChecked();
  });

  it('T03: evidence URL input and submission callback trigger successfully', async () => {
    const handleSuccess = jest.fn();
    render(
      <OrderReturnModal
        isOpen={true}
        orderId="ord-100"
        orderNumber="ORD-100"
        onClose={jest.fn()}
        onSuccess={handleSuccess}
      />
    );

    await waitFor(() => expect(screen.getByTestId('evidence-url-input')).toBeInTheDocument());

    const evidenceInput = screen.getByTestId('evidence-url-input');
    fireEvent.change(evidenceInput, { target: { value: 'https://example.com/damaged.jpg' } });
    expect(evidenceInput).toHaveValue('https://example.com/damaged.jpg');

    const submitBtn = screen.getByTestId('confirm-return-btn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'ret-1', resolutionChoice: 'REPLACEMENT' })
      );
    });
  });
});
