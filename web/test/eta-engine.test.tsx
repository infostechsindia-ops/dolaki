import React from 'react';
import { render, screen } from '@testing-library/react';
import DeliveryPromiseCard from '../src/components/delivery/DeliveryPromiseCard';
import FladoExpressPage from '../src/app/flado/page';
import FladoQuickCatalogPage from '../src/app/flado/catalog/page';

describe('CMD-055 Delivery ETA Engine Frontend Integration', () => {
  it('1. DeliveryPromiseCard renders Quick-Commerce server ETA verbatim without client calculation', () => {
    const mockPromise = {
      isServiceable: true,
      status: 'SERVICEABLE',
      fulfillmentNodeName: 'Bandra Darkstore #01',
      estimatedDeliveryText: '10–14 mins',
      deliveryBadgeText: '10 MINS',
      shippingFeeText: 'FREE',
    };

    render(
      <DeliveryPromiseCard
        promise={mockPromise}
        surface="QUICK_COMMERCE"
        title="10-Minute Grocery Delivery"
      />,
    );

    expect(screen.getByTestId('delivery-promise-card')).toBeInTheDocument();
    expect(screen.getByTestId('delivery-eta-text')).toHaveTextContent('Estimated Delivery: 10–14 mins');
  });

  it('2. DeliveryPromiseCard renders Marketplace server ETA verbatim without client calculation', () => {
    const mockPromise = {
      isServiceable: true,
      status: 'SERVICEABLE',
      fulfillmentNodeName: 'AuraMart Regional Warehouse',
      estimatedDeliveryText: 'Delivered in 4–6 business days',
      deliveryBadgeText: '4–6 DAYS',
      shippingFeeText: 'FREE',
      cutoffTimeText: 'Order before 2 PM for same-day dispatch',
    };

    render(
      <DeliveryPromiseCard
        promise={mockPromise}
        surface="MARKETPLACE"
        title="Standard Nationwide Shipping"
      />,
    );

    expect(screen.getByTestId('delivery-eta-text')).toHaveTextContent('Estimated Delivery: Delivered in 4–6 business days');
    expect(screen.getByTestId('delivery-cutoff-text')).toHaveTextContent('Order before 2 PM for same-day dispatch');
  });

  it('3. Flado Quick Home renders server ETA from initialFeed DTO', () => {
    const mockFeed = {
      deliveryPromise: {
        isServiceable: true,
        status: 'SERVICEABLE',
        fulfillmentNodeName: 'Bandra Darkstore #01',
        estimatedDeliveryText: '12–16 mins',
        shippingFeeText: 'FREE',
      },
      activeShop: { id: 'shop-1', shopName: 'Bandra Darkstore #01', isOpen: true },
      categories: [],
      popularNearby: [],
      essentials: [],
      offers: [],
      brands: [],
    };

    render(<FladoExpressPage initialFeed={mockFeed} locationPincode="400050" />);

    expect(screen.getByTestId('delivery-eta-text')).toHaveTextContent('Estimated Delivery: 12–16 mins');
  });

  it('4. Flado Quick Catalog renders server ETA from initialData DTO', () => {
    const mockCatalog = {
      deliveryPromise: {
        isServiceable: true,
        status: 'SERVICEABLE',
        fulfillmentNodeName: 'Bandra Darkstore #01',
        estimatedDeliveryText: '8–12 mins',
      },
      activeShop: { id: 'shop-1', shopName: 'Bandra Darkstore #01', isOpen: true },
      categories: [],
      products: [],
      pagination: { total: 0, page: 1, pageSize: 12, totalPages: 0, hasNextPage: false },
      query: { sort: 'relevance' },
    };

    render(<FladoQuickCatalogPage initialData={mockCatalog} locationPincode="400050" />);

    expect(screen.getByTestId('delivery-eta-text')).toHaveTextContent('Estimated Delivery: 8–12 mins');
  });

  it('5. Unavailable ETA renders unserviceable reason and nextOpeningText verbatim', () => {
    const mockUnserviceablePromise = {
      isServiceable: false,
      status: 'UNSERVICEABLE',
      reasonCode: 'STORE_CLOSED',
      unserviceableReason: 'Flado darkstore is currently closed',
      nextOpeningText: 'Opens tomorrow at 08:00 AM',
    };

    render(
      <DeliveryPromiseCard
        promise={mockUnserviceablePromise}
        surface="QUICK_COMMERCE"
      />,
    );

    expect(screen.getByTestId('delivery-unserviceable-block')).toBeInTheDocument();
    expect(screen.getByTestId('next-opening-text')).toHaveTextContent('Opens tomorrow at 08:00 AM');
  });
});
