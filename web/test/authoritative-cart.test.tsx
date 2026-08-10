import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from '../src/context/CartContext';

// Dummy component to test useCart context
function TestCartConsumer() {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    mergeGuestCart,
    totalItems,
    formattedSubtotal,
    formattedGrandTotal,
    isServerCart,
  } = useCart();

  return (
    <div>
      <div data-testid="cart-count">{totalItems}</div>
      <div data-testid="is-server">{isServerCart ? 'YES' : 'NO'}</div>
      <div data-testid="formatted-subtotal">{formattedSubtotal || 'N/A'}</div>
      <div data-testid="formatted-grand-total">{formattedGrandTotal || 'N/A'}</div>
      <button
        data-testid="add-btn"
        onClick={() =>
          addToCart(
            {
              id: 'prod-1',
              name: 'Test Headphone',
              description: 'Test',
              price: 299,
              category: 'audio',
              subCategory: 'audio',
              brand: 'Test',
              isFlado: false,
              generalStock: 10,
              specifications: {},
              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
              rating: 4.5,
              reviewsCount: 10,
            },
            1,
            'SKU-HEADPHONE-001'
          )
        }
      >
        Add
      </button>
      <button data-testid="remove-btn" onClick={() => removeFromCart('prod-1')}>
        Remove
      </button>
      <button data-testid="update-btn" onClick={() => updateQuantity('prod-1', 3)}>
        Update
      </button>
      <button data-testid="clear-btn" onClick={() => clearCart()}>
        Clear
      </button>
      <button data-testid="merge-btn" onClick={() => mergeGuestCart()}>
        Merge
      </button>
      <ul>
        {cart.map((item) => (
          <li key={item.product.id} data-testid={`item-${item.product.id}`}>
            {item.product.name} - Qty: {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

describe('CMD-039 Authoritative Cart Frontend Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    if (!window.fetch) window.fetch = jest.fn() as any;
    jest.clearAllMocks();
  });

  // 1. Guest cart local intent storage
  it('maintains guest cart intent in localStorage when unauthenticated', async () => {
    render(
      <CartProvider>
        <TestCartConsumer />
      </CartProvider>
    );

    expect(screen.getByTestId('is-server')).toHaveTextContent('NO');
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');

    await act(async () => {
      fireEvent.click(screen.getByTestId('add-btn'));
    });

    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
    expect(localStorage.getItem('auramart_cart')).toContain('Test Headphone');
  });

  // 2. Authenticated cart fetches from backend GET /api/v1/cart
  it('fetches server cart when authenticated with aura_token', async () => {
    localStorage.setItem('aura_token', 'mock_jwt_token');

    const mockServerCart = {
      cartId: 'cart-123',
      customerId: 'cust-1',
      status: 'ACTIVE',
      items: [
        {
          id: 'item-1',
          sku: 'SKU-HEADPHONE-001',
          productId: 'prod-1',
          title: 'AuraStudio Headphones',
          quantity: 2,
          unitPrice: 29900,
          formattedUnitPrice: '$299.00',
          lineTotal: 59800,
          formattedLineTotal: '$598.00',
          inStock: true,
        },
      ],
      totalItems: 2,
      subtotal: 59800,
      formattedSubtotal: '$598.00',
      tax: 10764,
      formattedTax: '$107.64',
      shipping: 0,
      formattedShipping: 'FREE',
      grandTotal: 70564,
      formattedGrandTotal: '$705.64',
    };

    (window.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockServerCart,
    });

    await act(async () => {
      render(
        <CartProvider>
          <TestCartConsumer />
        </CartProvider>
      );
    });

    expect(screen.getByTestId('is-server')).toHaveTextContent('YES');
    expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
    expect(screen.getByTestId('formatted-subtotal')).toHaveTextContent('$598.00');
    expect(screen.getByTestId('formatted-grand-total')).toHaveTextContent('$705.64');
  });

  // 3. Guest -> Authenticated Cart Merge
  it('merges guest items on login and clears local guest cart only on success', async () => {
    // Setup local guest cart
    localStorage.setItem(
      'auramart_cart',
      JSON.stringify([
        {
          product: { id: 'prod-1', name: 'Guest Item' },
          quantity: 1,
          sku: 'SKU-GUEST',
        },
      ])
    );
    localStorage.setItem('aura_token', 'mock_jwt_token');

    const mockMergedCart = {
      cartId: 'cart-123',
      items: [
        {
          id: 'item-merged',
          sku: 'SKU-GUEST',
          title: 'Guest Item',
          quantity: 1,
          unitPrice: 1000,
          inStock: true,
        },
      ],
      totalItems: 1,
      subtotal: 1000,
      formattedSubtotal: '$10.00',
      tax: 180,
      shipping: 0,
      grandTotal: 1180,
      formattedGrandTotal: '$11.80',
    };

    (window.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockMergedCart,
    });

    await act(async () => {
      render(
        <CartProvider>
          <TestCartConsumer />
        </CartProvider>
      );
    });

    expect(window.fetch).toHaveBeenCalledWith(
      '/api/v1/cart/merge',
      expect.objectContaining({
        method: 'POST',
      })
    );

    // Guest cart cleared from localStorage after successful merge
    expect(localStorage.getItem('auramart_cart')).toBeNull();
  });

  // 4. Failed merge preserves guest cart
  it('preserves local guest cart if merge request fails', async () => {
    localStorage.setItem(
      'auramart_cart',
      JSON.stringify([
        {
          product: { id: 'prod-1', name: 'Guest Item' },
          quantity: 1,
          sku: 'SKU-GUEST',
        },
      ])
    );
    localStorage.setItem('aura_token', 'mock_jwt_token');

    (window.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await act(async () => {
      render(
        <CartProvider>
          <TestCartConsumer />
        </CartProvider>
      );
    });

    // Local guest cart must NOT be deleted if server merge fails
    expect(localStorage.getItem('auramart_cart')).not.toBeNull();
  });
});
