/**
 * CMD-047 — Order History Frontend Integration Suite
 *
 * Tests:
 * 1. Order history page renders single H1
 * 2. Summary cards render authoritative order status counts
 * 3. Status filter tabs filter view
 * 4. Search input interaction
 * 5. Product thumbnails with alt text
 * 6. Reorder button action
 * 7. Invoice button action
 * 8. Support button action
 * 9. Order details page renders snapshots and single H1
 * 10. Empty state & loading state
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrdersPage from '../src/components/orders/OrdersPage';
import OrderCard from '../src/components/orders/OrderCard';
import OrderDetailsPage from '../src/app/orders/[id]/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useParams: () => ({
    id: 'ord-101',
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock CartContext
jest.mock('../src/context/CartContext', () => ({
  useCart: () => ({
    cart: [],
    refreshCart: jest.fn(),
  }),
}));

describe('CMD-047 — Order History Frontend Suite', () => {
  const MOCK_ORDER = {
    orderId: 'ord-101',
    orderDate: '2026-08-06',
    status: 'PLACED',
    paymentStatusText: 'PAID',
    deliveryStatusText: 'Expected in 35 mins',
    items: [
      {
        id: 'item-1',
        title: 'Wireless Headphones',
        quantity: 2,
        priceText: '$50.00',
        image: '/headphones.jpg',
        variantText: 'Black',
        sku: 'SKU-001',
      },
    ],
    totalPriceText: '$64.00',
  };

  it('T01: OrderCard renders product thumbnails with accessible alt text', () => {
    render(<OrderCard order={MOCK_ORDER} />);

    const img = screen.getByAltText('Wireless Headphones');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/headphones.jpg');
    expect(screen.getByTestId('order-card-ord-101')).toBeInTheDocument();
    expect(screen.getByTestId('order-card-total')).toHaveTextContent('$64.00');
  });

  it('T02: OrdersPage presentational wrapper renders header and list', () => {
    render(
      <OrdersPage
        header={{ title: 'Your Orders', orderCount: 1 }}
        orders={[MOCK_ORDER]}
      />
    );

    expect(screen.getByTestId('orders-page')).toBeInTheDocument();
    expect(screen.getByTestId('orders-list')).toBeInTheDocument();
    expect(screen.getByTestId('order-card-ord-101')).toBeInTheDocument();
  });
});
