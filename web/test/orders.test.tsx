import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrdersPage from '../src/components/orders/OrdersPage';
import OrdersHeader from '../src/components/orders/OrdersHeader';
import OrderCard from '../src/components/orders/OrderCard';
import OrderStatusBadge from '../src/components/orders/OrderStatusBadge';
import OrderTimeline from '../src/components/orders/OrderTimeline';
import OrderItemsList from '../src/components/orders/OrderItemsList';
import OrderSummary from '../src/components/orders/OrderSummary';
import OrderActions from '../src/components/orders/OrderActions';
import OrderFilters from '../src/components/orders/OrderFilters';
import OrderSearch from '../src/components/orders/OrderSearch';
import OrderEmptyState from '../src/components/orders/OrderEmptyState';

const MOCK_ITEMS = [
  {
    id: 'item-1',
    title: 'Wireless Noise-Canceling Headphones',
    quantity: 1,
    priceText: '$199.99',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
    sku: 'AUDIO-001',
  },
];

const MOCK_ORDER = {
  orderId: 'ORD-2026-8891',
  orderDate: 'Aug 5, 2026',
  status: 'Delivered',
  paymentStatusText: 'Paid via Visa (•••• 4242)',
  deliveryStatusText: 'Delivered on Aug 5, 2026',
  items: MOCK_ITEMS,
  totalPriceText: '$215.99',
};

const MOCK_TIMELINE_EVENTS = [
  {
    id: 't-1',
    title: 'Order Placed',
    description: 'We have received your order.',
    timestamp: 'Aug 5, 09:00 AM',
    isCompleted: true,
  },
  {
    id: 't-2',
    title: 'Out for Delivery',
    description: 'Rider is on the way.',
    timestamp: 'Aug 5, 11:15 AM',
    isCompleted: true,
    isCurrent: true,
  },
];

describe('CMD-032 Customer Orders UI', () => {
  // 1. OrdersHeader
  it('renders OrdersHeader with single H1 title and order count badge', () => {
    render(<OrdersHeader title="My Orders" orderCount={3} />);

    expect(screen.getByTestId('orders-header')).toBeInTheDocument();
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s.length).toBe(1);
    expect(h1s[0]).toHaveTextContent('My Orders');
    expect(screen.getByTestId('orders-count-badge')).toHaveTextContent('(3 orders)');
  });

  // 2. OrderStatusBadge
  it('renders OrderStatusBadge with variant styling and text label', () => {
    const { rerender } = render(<OrderStatusBadge status="Delivered" />);
    expect(screen.getByTestId('order-status-badge')).toHaveTextContent('Delivered');

    rerender(<OrderStatusBadge status="Out for Delivery" />);
    expect(screen.getByTestId('order-status-badge')).toHaveTextContent('Out for Delivery');

    rerender(<OrderStatusBadge status="Cancelled" />);
    expect(screen.getByTestId('order-status-badge')).toHaveTextContent('Cancelled');
  });

  // 3. OrderTimeline
  it('renders OrderTimeline displaying events in semantic ordered list', () => {
    render(<OrderTimeline events={MOCK_TIMELINE_EVENTS} />);

    expect(screen.getByTestId('order-timeline')).toBeInTheDocument();
    expect(screen.getByLabelText(/Order progress events/i)).toBeInTheDocument();
    expect(screen.getByTestId('timeline-event-t-1')).toHaveTextContent('Order Placed');
    expect(screen.getByTestId('timeline-event-t-2')).toHaveTextContent('Out for Delivery');
  });

  // 4. OrderItemsList
  it('renders OrderItemsList with item thumbnail, title, quantity, and priceText', () => {
    render(<OrderItemsList items={MOCK_ITEMS} title="Items Preview" />);

    expect(screen.getByTestId('order-items-list')).toBeInTheDocument();
    expect(screen.getByTestId('order-item-item-1')).toHaveTextContent('Wireless Noise-Canceling Headphones');
    expect(screen.getByTestId('order-item-item-1')).toHaveTextContent('Qty: 1');
    expect(screen.getByTestId('order-item-item-1')).toHaveTextContent('$199.99');
  });

  // 5. OrderSummary
  it('renders OrderSummary displaying subtotal, discount, shipping, tax, and grand total using dl/dt/dd', () => {
    render(
      <OrderSummary
        subtotal="$199.99"
        discount="$10.00"
        shipping="$15.00"
        tax="$11.00"
        grandTotal="$215.99"
      />
    );

    expect(screen.getByTestId('order-summary')).toBeInTheDocument();
    expect(screen.getByTestId('order-summary-subtotal')).toHaveTextContent('$199.99');
    expect(screen.getByTestId('order-summary-discount')).toHaveTextContent('-$10.00');
    expect(screen.getByTestId('order-summary-shipping')).toHaveTextContent('$15.00');
    expect(screen.getByTestId('order-summary-tax')).toHaveTextContent('$11.00');
    expect(screen.getByTestId('order-summary-grand-total')).toHaveTextContent('$215.99');
  });

  // 6. OrderActions
  it('renders OrderActions buttons with callbacks', () => {
    const onViewDetails = jest.fn();
    const onTrackOrder = jest.fn();
    const onBuyAgain = jest.fn();
    const onDownloadInvoice = jest.fn();
    const onReturnOrder = jest.fn();

    render(
      <OrderActions
        orderId="ORD-2026-8891"
        onViewDetails={onViewDetails}
        onTrackOrder={onTrackOrder}
        onBuyAgain={onBuyAgain}
        onDownloadInvoice={onDownloadInvoice}
        onReturnOrder={onReturnOrder}
      />
    );

    expect(screen.getByTestId('order-actions')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('view-details-btn'));
    expect(onViewDetails).toHaveBeenCalledWith('ORD-2026-8891');

    fireEvent.click(screen.getByTestId('track-order-btn'));
    expect(onTrackOrder).toHaveBeenCalledWith('ORD-2026-8891');

    fireEvent.click(screen.getByTestId('buy-again-btn'));
    expect(onBuyAgain).toHaveBeenCalledWith('ORD-2026-8891');

    fireEvent.click(screen.getByTestId('download-invoice-btn'));
    expect(onDownloadInvoice).toHaveBeenCalledWith('ORD-2026-8891');

    fireEvent.click(screen.getByTestId('return-order-btn'));
    expect(onReturnOrder).toHaveBeenCalledWith('ORD-2026-8891');
  });

  // 7. OrderFilters
  it('renders OrderFilters with native select controls and label associations', () => {
    const onFilterChange = jest.fn();
    render(
      <OrderFilters
        filters={{ status: 'ALL', timeRange: 'ALL', paymentStatus: 'ALL' }}
        onFilterChange={onFilterChange}
      />
    );

    expect(screen.getByTestId('order-filters')).toBeInTheDocument();

    const statusSelect = screen.getByTestId('order-status-filter-select');
    fireEvent.change(statusSelect, { target: { value: 'DELIVERED' } });
    expect(onFilterChange).toHaveBeenCalledWith({
      status: 'DELIVERED',
      timeRange: 'ALL',
      paymentStatus: 'ALL',
    });
  });

  // 8. OrderSearch
  it('renders OrderSearch input with associated label and search callbacks', () => {
    const onChange = jest.fn();
    const onClear = jest.fn();

    render(<OrderSearch value="Wireless" onChange={onChange} onClear={onClear} />);

    expect(screen.getByTestId('order-search')).toBeInTheDocument();
    expect(screen.getByLabelText(/Search Orders/i)).toHaveValue('Wireless');

    const clearBtn = screen.getByTestId('clear-search-btn');
    fireEvent.click(clearBtn);
    expect(onChange).toHaveBeenCalledWith('');
    expect(onClear).toHaveBeenCalled();
  });

  // 9. OrderEmptyState
  it('renders OrderEmptyState reusing EmptyState UI primitive', () => {
    const onStartShopping = jest.fn();
    render(<OrderEmptyState onStartShopping={onStartShopping} />);

    expect(screen.getByTestId('order-empty-state')).toBeInTheDocument();
    expect(screen.getByText('No orders found')).toBeInTheDocument();

    const btn = screen.getByRole('button', { name: /Start Shopping/i });
    fireEvent.click(btn);
    expect(onStartShopping).toHaveBeenCalled();
  });

  // 10. OrderCard
  it('renders OrderCard displaying order ID, date, status, items preview, total price, and actions', () => {
    const onViewDetails = jest.fn();
    render(
      <OrderCard
        order={MOCK_ORDER}
        actions={{ onViewDetails }}
      />
    );

    expect(screen.getByTestId('order-card-ORD-2026-8891')).toBeInTheDocument();
    expect(screen.getByTestId('order-card-id')).toHaveTextContent('Order #ORD-2026-8891');
    expect(screen.getByTestId('order-card-date')).toHaveTextContent('Placed on Aug 5, 2026');
    expect(screen.getByTestId('order-card-total')).toHaveTextContent('$215.99');
    expect(screen.getByTestId('view-details-btn')).toBeInTheDocument();
  });

  // 11. Full OrdersPage composition
  it('composes full OrdersPage with single H1 header, search, filters, and order card list', () => {
    const onFilterChange = jest.fn();
    const onSearchChange = jest.fn();

    render(
      <OrdersPage
        header={{ orderCount: 1, title: 'My Orders' }}
        search={{ value: '', onChange: onSearchChange }}
        filters={{
          filters: { status: 'ALL', timeRange: 'ALL', paymentStatus: 'ALL' },
          onFilterChange: onFilterChange,
        }}
        orders={[MOCK_ORDER]}
      />
    );

    expect(screen.getByTestId('orders-page')).toBeInTheDocument();
    expect(screen.getByTestId('orders-header')).toBeInTheDocument();
    expect(screen.getByTestId('orders-control-bar')).toBeInTheDocument();
    expect(screen.getByTestId('orders-list')).toBeInTheDocument();
    expect(screen.getByTestId('order-card-ORD-2026-8891')).toBeInTheDocument();

    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s.length).toBe(1);
    expect(h1s[0]).toHaveTextContent('My Orders');
  });

  // 12. Invariants: Props-only architecture (No fetch, No localStorage)
  it('enforces props-only architecture without fetch or localStorage calls', () => {
    if (!window.fetch) window.fetch = jest.fn() as any;
    const spyFetch = jest.spyOn(window, 'fetch');
    const spyStorage = jest.spyOn(Storage.prototype, 'getItem');

    render(
      <OrdersPage
        header={{ orderCount: 1 }}
        orders={[MOCK_ORDER]}
      />
    );

    expect(spyFetch).not.toHaveBeenCalled();
    expect(spyStorage).not.toHaveBeenCalledWith(expect.stringContaining('order'));

    spyFetch.mockRestore();
    spyStorage.mockRestore();
  });
});
