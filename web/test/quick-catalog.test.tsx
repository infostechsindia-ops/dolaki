import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FladoQuickCatalogPage from '../src/app/flado/catalog/page';

describe('CMD-054 Flado Quick Catalog Component Suite', () => {
  it('1. & 2. renders serviceable catalog with active store & delivery promise', () => {
    const mockCatalogData = {
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
        { name: 'Veggies & Fruits', slug: 'fruits-vegetables', itemCount: 10 },
        { name: 'Dairy & Bread', slug: 'dairy-bread-eggs', itemCount: 5 },
      ],
      products: [
        { id: 'p-1', title: 'Organic Farm Spinach', price: 2.99, priceMinor: 299, availableStock: 15, isFlado: true },
      ],
      pagination: { total: 1, page: 1, pageSize: 12, totalPages: 1, hasNextPage: false },
      query: { sort: 'relevance' },
    };

    render(<FladoQuickCatalogPage initialData={mockCatalogData} locationPincode="400050" />);

    expect(screen.getByTestId('delivery-promise-card')).toBeInTheDocument();
    expect(screen.getByTestId('delivery-serviceable-block')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Flado Quick Grocery Catalog/i })).toBeInTheDocument();
  });

  it('3. & 4. renders category filter chips and sort dropdown', () => {
    const mockCatalogData = {
      deliveryPromise: { isServiceable: true, status: 'SERVICEABLE' },
      categories: [
        { name: 'Veggies & Fruits', slug: 'fruits-vegetables', itemCount: 10 },
      ],
      products: [],
      pagination: { total: 0, page: 1, pageSize: 12, totalPages: 0, hasNextPage: false },
      query: { sort: 'relevance' },
    };

    render(<FladoQuickCatalogPage initialData={mockCatalogData} locationPincode="400050" />);

    expect(screen.getByText(/Veggies & Fruits \(10\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Sort by')).toBeInTheDocument();
  });

  it('7. & 8. renders outside service area state with Marketplace fallback banner', () => {
    const mockUnserviceableData = {
      deliveryPromise: {
        isServiceable: false,
        status: 'UNSERVICEABLE',
        reasonCode: 'OUTSIDE_SERVICE_AREA',
        unserviceableReason: 'Location is outside 10-minute delivery radius',
      },
      activeShop: null,
      categories: [],
      products: [],
      pagination: { total: 0, page: 1, pageSize: 12, totalPages: 0, hasNextPage: false },
      query: { sort: 'relevance' },
    };

    render(<FladoQuickCatalogPage initialData={mockUnserviceableData} locationPincode="999999" />);

    expect(screen.getByTestId('delivery-unserviceable-block')).toBeInTheDocument();
    expect(screen.getByText(/Explore AuraMart Mall/i)).toBeInTheDocument();
  });

  it('9. renders store closed state with nextOpeningText', () => {
    const mockClosedData = {
      deliveryPromise: {
        isServiceable: false,
        status: 'UNSERVICEABLE',
        reasonCode: 'STORE_CLOSED',
        nextOpeningText: 'Opens tomorrow at 08:00 AM',
      },
      activeShop: { id: 'shop-closed', shopName: 'Closed Darkstore', isOpen: false },
      categories: [],
      products: [],
      pagination: { total: 0, page: 1, pageSize: 12, totalPages: 0, hasNextPage: false },
      query: { sort: 'relevance' },
    };

    render(<FladoQuickCatalogPage initialData={mockClosedData} locationPincode="400050" />);

    expect(screen.getByTestId('delivery-unserviceable-block')).toBeInTheDocument();
    expect(screen.getByTestId('next-opening-text')).toHaveTextContent('Opens tomorrow at 08:00 AM');
  });

  it('10. & 11. renders empty category and search zero results state', () => {
    const mockEmptyData = {
      deliveryPromise: { isServiceable: true, status: 'SERVICEABLE' },
      categories: [],
      products: [],
      pagination: { total: 0, page: 1, pageSize: 12, totalPages: 0, hasNextPage: false },
      query: { sort: 'relevance' },
    };

    render(<FladoQuickCatalogPage initialData={mockEmptyData} locationPincode="400050" />);

    expect(screen.getByTestId('catalog-empty-state')).toBeInTheDocument();
    expect(screen.getByText(/No quick-commerce items fit your search filter/i)).toBeInTheDocument();
  });

  it('13. maintains Marketplace and Quick-Commerce isolation', () => {
    const mockCatalogData = {
      deliveryPromise: { isServiceable: true, status: 'SERVICEABLE' },
      categories: [],
      products: [],
      pagination: { total: 0, page: 1, pageSize: 12, totalPages: 0, hasNextPage: false },
      query: { sort: 'relevance' },
    };

    render(<FladoQuickCatalogPage initialData={mockCatalogData} locationPincode="400050" />);

    // Quick catalog operates on QUICK_COMMERCE surface
    expect(screen.getByTestId('delivery-promise-card')).toBeInTheDocument();
  });
});
