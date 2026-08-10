import React from 'react';
import { render, screen } from '@testing-library/react';

function RefundStatusWidget({ refund }: { refund: any }) {
  if (!refund) return null;

  if (refund.status === 'NOT_REQUIRED' || refund.destination === 'NOT_REQUIRED') {
    return (
      <div data-testid="refund-widget">
        <span data-testid="refund-status">NOT_REQUIRED</span>
        <p data-testid="refund-notice">No online payment was captured for Cash on Delivery.</p>
      </div>
    );
  }

  return (
    <div data-testid="refund-widget">
      <span data-testid="refund-status">{refund.status}</span>
      <span data-testid="refund-amount">{refund.formattedAmount}</span>
      <span data-testid="refund-destination">{refund.destination}</span>
      {refund.providerReference && (
        <span data-testid="refund-reference">{refund.providerReference}</span>
      )}
    </div>
  );
}

describe('CMD-051 Frontend Refund UX', () => {
  it('T01: renders authoritative refund status badge and formatted amount verbatim', () => {
    const mockRefund = {
      id: 'ref-101',
      status: 'SUCCEEDED',
      formattedAmount: '$25.00',
      destination: 'ORIGINAL_PAYMENT_METHOD',
      providerReference: 'gtw_ref_998877',
    };

    render(<RefundStatusWidget refund={mockRefund} />);

    expect(screen.getByTestId('refund-status')).toHaveTextContent('SUCCEEDED');
    expect(screen.getByTestId('refund-amount')).toHaveTextContent('$25.00');
    expect(screen.getByTestId('refund-reference')).toHaveTextContent('gtw_ref_998877');
  });

  it('T02: renders COD notice for non-online refund required status', () => {
    const mockCodRefund = {
      id: 'ref-cod',
      status: 'NOT_REQUIRED',
      destination: 'NOT_REQUIRED',
      formattedAmount: '$0.00',
    };

    render(<RefundStatusWidget refund={mockCodRefund} />);

    expect(screen.getByTestId('refund-status')).toHaveTextContent('NOT_REQUIRED');
    expect(screen.getByTestId('refund-notice')).toHaveTextContent('No online payment was captured for Cash on Delivery.');
  });
});
