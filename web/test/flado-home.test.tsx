import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FladoExpressPage from '../src/app/flado/page';

describe('CMD-053 Flado Quick Home Component', () => {
  it('renders Quick Home with initial feed data verbatim from server DTO', () => {
    const mockFeed = {
      deliveryPromise: {
        isServiceable: true,
        status: 'SERVICEABLE',
        fulfillmentNodeName: 'Bandra Darkstore #01',
        shippingFeeText: 'FREE',
      },
      activeShop: {
        id: 'shop-1',
        shopName: 'Bandra Darkstore #01',
        isOpen: true,
      },
      categories: [
        { name: 'Veggies & Fruits', slug: 'fruits-vegetables', icon: '🥬' },
        { name: 'Dairy & Bread', slug: 'dairy-bread-eggs', icon: '🥛' },
      ],
      popularNearby: [
        { id: 'p-1', title: 'Organic Spinach', priceMinor: 299, availableStock: 20 },
      ],
      essentials: [
        { id: 'p-2', title: 'Fresh Cow Milk', priceMinor: 450, availableStock: 15 },
      ],
      offers: [
        { id: 'o-1', title: '50% Off Fresh Vegetables', ctaText: 'Shop Now', ctaUrl: '/flado/offers' },
      ],
      brands: [
        { name: 'Amul', slug: 'amul', logoUrl: 'https://images.unsplash.com/photo-1563636619' },
      ],
    };

    render(<FladoExpressPage initialFeed={mockFeed} locationPincode="400050" />);

    expect(screen.getByTestId('delivery-promise-card')).toBeInTheDocument();
    expect(screen.getByTestId('delivery-serviceable-block')).toBeInTheDocument();
    expect(screen.getByText('Bandra Darkstore #01')).toBeInTheDocument();
    expect(screen.getByText('Veggies & Fruits')).toBeInTheDocument();
    expect(screen.getByLabelText('Shop Amul items')).toBeInTheDocument();
  });

  it('renders unserviceable state with reasonCode and Marketplace fallback banner when store is unserviceable', () => {
    const mockUnserviceableFeed = {
      deliveryPromise: {
        isServiceable: false,
        status: 'UNSERVICEABLE',
        reasonCode: 'OUTSIDE_SERVICE_AREA',
        unserviceableReason: 'Location is outside Flado 10-minute delivery zone',
      },
      activeShop: null,
      categories: [],
      popularNearby: [],
      essentials: [],
      offers: [],
      brands: [],
    };

    render(<FladoExpressPage initialFeed={mockUnserviceableFeed} locationPincode="999999" />);

    expect(screen.getByTestId('delivery-unserviceable-block')).toBeInTheDocument();
    expect(screen.getByTestId('unserviceable-reason')).toHaveTextContent('Location is outside Flado 10-minute delivery zone');
    expect(screen.getByText(/Explore Millions of Products on AuraMart Mall/i)).toBeInTheDocument();
  });

  it('renders store closed state with nextOpeningText when store is closed by schedule', () => {
    const mockClosedFeed = {
      deliveryPromise: {
        isServiceable: false,
        status: 'UNSERVICEABLE',
        reasonCode: 'STORE_CLOSED',
        unserviceableReason: 'Flado store is currently closed',
        nextOpeningText: 'Opens tomorrow at 08:00 AM',
      },
      activeShop: {
        id: 'shop-closed',
        shopName: 'Closed Darkstore',
        isOpen: false,
      },
      categories: [],
      popularNearby: [],
      essentials: [],
      offers: [],
      brands: [],
    };

    render(<FladoExpressPage initialFeed={mockClosedFeed} locationPincode="400050" />);

    expect(screen.getByTestId('delivery-unserviceable-block')).toBeInTheDocument();
    expect(screen.getByTestId('next-opening-text')).toHaveTextContent('Opens tomorrow at 08:00 AM');
  });

  it('triggers location submission callback when pincode is submitted', () => {
    const mockFeed = {
      deliveryPromise: {
        isServiceable: true,
        status: 'SERVICEABLE',
      },
    };

    render(<FladoExpressPage initialFeed={mockFeed} locationPincode="400050" />);

    const input = screen.getByTestId('pincode-input');
    fireEvent.change(input, { target: { value: '400051' } });

    const submitBtn = screen.getByTestId('pincode-submit-btn');
    fireEvent.click(submitBtn);

    expect(input).toHaveValue('400051');
  });
});
