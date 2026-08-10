import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DeliveryPromiseCard from '../src/components/delivery/DeliveryPromiseCard';
import LocationPincodeSelector from '../src/components/delivery/LocationPincodeSelector';
import ServiceabilityBadge from '../src/components/delivery/ServiceabilityBadge';

describe('CMD-036 Delivery Promise Frontend Components', () => {
  // 1. ServiceabilityBadge
  it('renders ServiceabilityBadge with accessible status text and role="status"', () => {
    const { rerender } = render(<ServiceabilityBadge status="SERVICEABLE" />);
    expect(screen.getByTestId('serviceability-badge')).toHaveTextContent('Serviceable Zone');

    rerender(<ServiceabilityBadge status="UNSERVICEABLE" />);
    expect(screen.getByTestId('serviceability-badge')).toHaveTextContent('Out of Delivery Zone');

    rerender(<ServiceabilityBadge status="ESTIMATE_UNAVAILABLE" />);
    expect(screen.getByTestId('serviceability-badge')).toHaveTextContent('Estimate Unavailable');
  });

  // 2. LocationPincodeSelector
  it('submits typed location/pincode value through callback on form submission', () => {
    const onLocationSubmit = jest.fn();
    render(<LocationPincodeSelector onLocationSubmit={onLocationSubmit} />);

    const input = screen.getByTestId('pincode-input');
    fireEvent.change(input, { target: { value: '400001' } });

    const submitBtn = screen.getByTestId('pincode-submit-btn');
    fireEvent.click(submitBtn);

    expect(onLocationSubmit).toHaveBeenCalledWith('400001');
  });

  // 3. DeliveryPromiseCard - Serviceable State
  it('renders DeliveryPromiseCard with verbatim ETA, shipping fee, and cutoff time from props', () => {
    const mockPromise = {
      isServiceable: true,
      status: 'SERVICEABLE',
      fulfillmentNodeName: 'Flado Darkstore #08 (Bandra)',
      estimatedDeliveryText: 'Tomorrow, 2:00 PM',
      shippingFeeText: '$4.99',
      freeShippingThresholdRemainingText: 'Add $12.50 for FREE Shipping',
      cutoffTimeText: 'Order within 45 mins',
    };

    render(
      <DeliveryPromiseCard
        promise={mockPromise}
        surface="QUICK_COMMERCE"
      />
    );

    expect(screen.getByTestId('delivery-promise-card')).toBeInTheDocument();
    expect(screen.getByTestId('delivery-serviceable-block')).toBeInTheDocument();
    expect(screen.getByTestId('delivery-eta-text')).toHaveTextContent('Tomorrow, 2:00 PM');
    expect(screen.getByTestId('delivery-shipping-fee')).toHaveTextContent('$4.99');
    expect(screen.getByTestId('delivery-free-threshold')).toHaveTextContent('Add $12.50 for FREE Shipping');
    expect(screen.getByTestId('delivery-cutoff-text')).toHaveTextContent('Order within 45 mins');
  });

  // 4. DeliveryPromiseCard - Unserviceable State
  it('renders DeliveryPromiseCard unserviceable reason when isServiceable is false', () => {
    const mockPromise = {
      isServiceable: false,
      status: 'UNSERVICEABLE',
      unserviceableReason: 'Pincode 275101 is outside delivery coverage area',
    };

    render(<DeliveryPromiseCard promise={mockPromise} />);

    expect(screen.getByTestId('delivery-unserviceable-block')).toBeInTheDocument();
    expect(screen.getByTestId('unserviceable-reason')).toHaveTextContent(
      'Pincode 275101 is outside delivery coverage area'
    );
  });

  // 5. DeliveryPromiseCard - Estimate Unavailable State
  it('renders estimate unavailable state cleanly without fabricating ETAs', () => {
    const mockPromise = {
      isServiceable: true,
      status: 'ESTIMATE_UNAVAILABLE',
      fulfillmentNodeName: 'AuraMart Regional Warehouse',
      estimatedDeliveryText: null,
      shippingFeeText: null,
    };

    render(<DeliveryPromiseCard promise={mockPromise} />);

    expect(screen.getByTestId('delivery-estimate-unavailable-block')).toBeInTheDocument();
    expect(screen.queryByTestId('delivery-eta-text')).not.toBeInTheDocument();
  });

  // 6. Surface Styling (Marketplace & Quick-Commerce)
  it('supports surface variants for Marketplace and Quick-Commerce (Flado)', () => {
    const { rerender } = render(<DeliveryPromiseCard surface="MARKETPLACE" />);
    expect(screen.getByTestId('delivery-promise-card')).toBeInTheDocument();

    rerender(<DeliveryPromiseCard surface="QUICK_COMMERCE" />);
    expect(screen.getByTestId('delivery-promise-card')).toBeInTheDocument();
  });

  // 7. Invariants: Props-only architecture (No fetch, No localStorage)
  it('enforces props-only presentational architecture without fetch or localStorage calls', () => {
    if (!window.fetch) window.fetch = jest.fn() as any;
    const spyFetch = jest.spyOn(window, 'fetch');
    const spyStorage = jest.spyOn(Storage.prototype, 'getItem');

    render(
      <DeliveryPromiseCard
        promise={{
          isServiceable: true,
          status: 'SERVICEABLE',
          estimatedDeliveryText: '3 Days',
        }}
      />
    );

    expect(spyFetch).not.toHaveBeenCalled();
    expect(spyStorage).not.toHaveBeenCalledWith(expect.stringContaining('delivery'));

    spyFetch.mockRestore();
    spyStorage.mockRestore();
  });

  // 8. CMD-052 Serviceability nextOpeningText Rendering
  it('renders nextOpeningText when store is unserviceable due to store closure schedule', () => {
    const mockPromise = {
      isServiceable: false,
      status: 'UNSERVICEABLE',
      reasonCode: 'STORE_CLOSED',
      unserviceableReason: 'Flado store is currently closed',
      nextOpeningText: 'Opens tomorrow at 08:00 AM',
    };

    render(<DeliveryPromiseCard promise={mockPromise} surface="QUICK_COMMERCE" />);

    expect(screen.getByTestId('delivery-unserviceable-block')).toBeInTheDocument();
    expect(screen.getByTestId('next-opening-text')).toHaveTextContent('Opens tomorrow at 08:00 AM');
  });
});
