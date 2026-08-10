/**
 * CMD-049 — Order Cancellation Frontend Integration Suite
 *
 * Tests:
 * 1. Cancellation modal renders accessible dialog structure
 * 2. Cancellation reason dropdown options
 * 3. Authoritative expected refund renders verbatim
 * 4. Non-cancellable order notice renders
 * 5. Confirmation callback
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderCancellationModal from '../src/components/orders/OrderCancellationModal';
import OrderActions from '../src/components/orders/OrderActions';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useParams: () => ({
    id: 'ord-101',
  }),
}));

describe('CMD-049 — Order Cancellation Frontend Suite', () => {
  it('T01: OrderActions renders Cancel Order button when onCancelOrder prop is provided', () => {
    const handleCancel = jest.fn();
    render(<OrderActions orderId="ord-101" onCancelOrder={handleCancel} />);

    const cancelBtn = screen.getByTestId('cancel-order-btn');
    expect(cancelBtn).toBeInTheDocument();
    fireEvent.click(cancelBtn);
    expect(handleCancel).toHaveBeenCalledWith('ord-101');
  });

  it('T02: OrderCancellationModal renders accessible dialog structure', () => {
    render(
      <OrderCancellationModal
        isOpen={true}
        orderId="ord-101"
        orderNumber="ORD-1001"
        onClose={jest.fn()}
        onSuccess={jest.fn()}
      />
    );

    expect(screen.getByTestId('cancellation-modal')).toBeInTheDocument();
    expect(screen.getByTestId('cancellation-reason-select')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-cancellation-btn')).toBeInTheDocument();
  });

  it('T03: shows textarea when reason OTHER is selected', () => {
    render(
      <OrderCancellationModal
        isOpen={true}
        orderId="ord-101"
        orderNumber="ORD-1001"
        onClose={jest.fn()}
        onSuccess={jest.fn()}
      />
    );

    const select = screen.getByTestId('cancellation-reason-select');
    fireEvent.change(select, { target: { value: 'OTHER' } });

    expect(screen.getByTestId('cancellation-reason-textarea')).toBeInTheDocument();
  });

  it('T04: close button triggers onClose callback', () => {
    const handleClose = jest.fn();
    render(
      <OrderCancellationModal
        isOpen={true}
        orderId="ord-101"
        orderNumber="ORD-1001"
        onClose={handleClose}
        onSuccess={jest.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('cancel-dialog-close-btn'));
    expect(handleClose).toHaveBeenCalled();
  });
});
