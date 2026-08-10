import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider } from '../src/context/CartContext';
import CartPage from '../src/components/cart/CartPage';
import CartHeader from '../src/components/cart/CartHeader';
import CartItem from '../src/components/cart/CartItem';
import CartQuantitySelector from '../src/components/cart/CartQuantitySelector';
import CartSummary from '../src/components/cart/CartSummary';
import CartPriceSummary from '../src/components/cart/CartPriceSummary';
import CartCouponBox from '../src/components/cart/CartCouponBox';
import CartDeliveryInfo from '../src/components/cart/CartDeliveryInfo';
import SavedForLaterSection from '../src/components/cart/SavedForLaterSection';
import CartEmptyState from '../src/components/cart/CartEmptyState';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

const MOCK_ITEMS = [
  {
    id: 'item-1',
    title: 'Wireless Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    price: '₹2,999',
    compareAtPrice: '₹4,999',
    brand: 'AudioTech',
    seller: 'AuraMart Direct',
    sku: 'AT-HP-01',
    quantity: 2,
  },
  {
    id: 'item-2',
    title: 'Smart Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    price: '₹1,499',
    brand: 'TechWear',
    quantity: 1,
  },
];

const MOCK_SAVED = [
  {
    id: 'saved-1',
    title: 'Bluetooth Speaker',
    price: 1999,
    rating: 4.3,
    reviewsCount: 45,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
  },
];

const MOCK_PRICE_SUMMARY = {
  subtotal: '₹7,497',
  discount: '₹500',
  tax: '₹180',
  shipping: 'FREE',
  grandTotal: '₹7,177',
};

describe('CMD-028 Customer Shopping Cart Foundation', () => {
  // 1. CartHeader
  it('renders CartHeader with title H1, item count, and continue shopping button', () => {
    const onContinueShopping = jest.fn();
    render(
      <CartHeader
        itemCount={3}
        onContinueShopping={onContinueShopping}
      />
    );

    expect(screen.getByTestId('cart-header')).toBeInTheDocument();
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s.length).toBe(1);
    expect(h1s[0]).toHaveTextContent('Shopping Cart');
    expect(screen.getByTestId('cart-item-count')).toHaveTextContent('(3 items)');

    const continueBtn = screen.getByTestId('continue-shopping-btn');
    fireEvent.click(continueBtn);
    expect(onContinueShopping).toHaveBeenCalled();
  });

  // 2. CartItem
  it('renders CartItem displaying image, title, metadata, prices, and trigger action callbacks', () => {
    const onQuantityChange = jest.fn();
    const onRemove = jest.fn();
    const onMoveToSaved = jest.fn();
    const onWishlist = jest.fn();

    render(
      <CartItem
        item={MOCK_ITEMS[0]}
        onQuantityChange={onQuantityChange}
        onRemove={onRemove}
        onMoveToSaved={onMoveToSaved}
        onWishlist={onWishlist}
      />
    );

    expect(screen.getByTestId('cart-item-item-1')).toBeInTheDocument();
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    expect(screen.getByText('AudioTech')).toBeInTheDocument();
    expect(screen.getByText('AuraMart Direct')).toBeInTheDocument();
    expect(screen.getByText('₹2,999')).toBeInTheDocument();
    expect(screen.getByText('₹4,999')).toBeInTheDocument();

    const saveBtn = screen.getByTestId('move-to-saved-btn');
    fireEvent.click(saveBtn);
    expect(onMoveToSaved).toHaveBeenCalledWith('item-1');

    const removeBtn = screen.getByTestId('remove-item-btn');
    fireEvent.click(removeBtn);
    expect(onRemove).toHaveBeenCalledWith('item-1');
  });

  // 3. CartQuantitySelector
  it('renders CartQuantitySelector with minus, value, plus buttons and fires onChange', () => {
    const onChange = jest.fn();
    render(<CartQuantitySelector value={2} min={1} max={10} onChange={onChange} />);

    expect(screen.getByTestId('cart-quantity-selector')).toBeInTheDocument();
    expect(screen.getByTestId('cart-qty-value')).toHaveTextContent('2');

    const decBtn = screen.getByTestId('decrease-qty-btn');
    fireEvent.click(decBtn);
    expect(onChange).toHaveBeenCalledWith(1);

    const incBtn = screen.getByTestId('increase-qty-btn');
    fireEvent.click(incBtn);
    expect(onChange).toHaveBeenCalledWith(3);
  });

  // 4. CartPriceSummary
  it('renders CartPriceSummary using semantic dl/dt/dd displaying values received via props', () => {
    render(<CartPriceSummary {...MOCK_PRICE_SUMMARY} />);

    expect(screen.getByTestId('cart-price-summary')).toBeInTheDocument();
    expect(screen.getByTestId('summary-subtotal')).toHaveTextContent('₹7,497');
    expect(screen.getByTestId('summary-discount')).toHaveTextContent('-₹500');
    expect(screen.getByTestId('summary-tax')).toHaveTextContent('₹180');
    expect(screen.getByTestId('summary-shipping')).toHaveTextContent('FREE');
    expect(screen.getByTestId('summary-grand-total')).toHaveTextContent('₹7,177');
  });

  // 5. CartCouponBox
  it('renders CartCouponBox with associated input label and triggers apply callback', () => {
    const onCouponCodeChange = jest.fn();
    const onApplyCoupon = jest.fn();

    render(
      <CartCouponBox
        couponCode="SAVE500"
        onCouponCodeChange={onCouponCodeChange}
        onApplyCoupon={onApplyCoupon}
      />
    );

    expect(screen.getByTestId('cart-coupon-box')).toBeInTheDocument();
    const input = screen.getByTestId('coupon-input');
    expect(input).toHaveValue('SAVE500');
    expect(screen.getByLabelText(/Promo \/ Coupon Code/i)).toBeInTheDocument();

    const applyBtn = screen.getByTestId('apply-coupon-btn');
    fireEvent.click(applyBtn);
    expect(onApplyCoupon).toHaveBeenCalled();
  });

  // 6. CartDeliveryInfo
  it('renders CartDeliveryInfo displaying delivery message, return policy, and shipping text', () => {
    render(
      <CartDeliveryInfo
        deliveryMessage="Free Express Delivery by Tomorrow"
        returnPolicyText="30 Days Easy Returns"
        shippingText="Dispatched via AuraMart Logistics"
      />
    );

    expect(screen.getByTestId('cart-delivery-info')).toBeInTheDocument();
    expect(screen.getByText('Free Express Delivery by Tomorrow')).toBeInTheDocument();
    expect(screen.getByText('30 Days Easy Returns')).toBeInTheDocument();
    expect(screen.getByText('Dispatched via AuraMart Logistics')).toBeInTheDocument();
  });

  // 7. CartSummary
  it('renders CartSummary sidebar with price summary and checkout trigger button', () => {
    const onCheckout = jest.fn();

    render(
      <CartSummary
        itemCount={2}
        priceSummary={MOCK_PRICE_SUMMARY}
        savingsText="You are saving ₹500 on this order!"
        onCheckout={onCheckout}
      />
    );

    expect(screen.getByTestId('cart-summary')).toBeInTheDocument();
    expect(screen.getByTestId('cart-savings-banner')).toHaveTextContent('You are saving ₹500 on this order!');

    const checkoutBtn = screen.getByTestId('proceed-checkout-btn');
    fireEvent.click(checkoutBtn);
    expect(onCheckout).toHaveBeenCalled();
  });

  // 8. SavedForLaterSection
  it('renders SavedForLaterSection with ProductCard grid and action buttons', () => {
    const onMoveToCart = jest.fn();
    const onRemoveFromSaved = jest.fn();

    render(
      <CartProvider>
        <SavedForLaterSection
          products={MOCK_SAVED}
          onMoveToCart={onMoveToCart}
          onRemoveFromSaved={onRemoveFromSaved}
        />
      </CartProvider>
    );

    expect(screen.getByTestId('saved-for-later-section')).toBeInTheDocument();
    expect(screen.getByText('Bluetooth Speaker')).toBeInTheDocument();

    const moveBtn = screen.getByTestId('move-to-cart-btn-saved-1');
    fireEvent.click(moveBtn);
    expect(onMoveToCart).toHaveBeenCalledWith('saved-1');
  });

  // 9. CartEmptyState
  it('renders CartEmptyState when cart is empty reusing EmptyState UI primitive', () => {
    const onContinueShopping = jest.fn();
    render(
      <CartEmptyState onContinueShopping={onContinueShopping} />
    );

    expect(screen.getByTestId('cart-empty-state')).toBeInTheDocument();
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();

    const actionBtn = screen.getByRole('button', { name: /Continue Shopping/i });
    fireEvent.click(actionBtn);
    expect(onContinueShopping).toHaveBeenCalled();
  });

  // 10. Full CartPage composition
  it('composes full CartPage with items, summary, and saved for later section', () => {
    render(
      <CartProvider>
        <CartPage
          items={MOCK_ITEMS}
          summary={{
            itemCount: 2,
            priceSummary: MOCK_PRICE_SUMMARY,
          }}
          savedProducts={MOCK_SAVED}
        />
      </CartProvider>
    );

    expect(screen.getByTestId('cart-page')).toBeInTheDocument();
    expect(screen.getByTestId('cart-header')).toBeInTheDocument();
    expect(screen.getByTestId('cart-item-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('cart-item-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('cart-summary')).toBeInTheDocument();
    expect(screen.getByTestId('saved-for-later-section')).toBeInTheDocument();
  });

  // 11. Invariants: Props-only architecture (No fetch, No localStorage)
  it('enforces props-only architecture without fetch or localStorage calls', () => {
    if (!window.fetch) window.fetch = jest.fn() as any;
    const spyFetch = jest.spyOn(window, 'fetch');
    const spyStorage = jest.spyOn(Storage.prototype, 'getItem');

    render(
      <CartPage
        items={MOCK_ITEMS}
        summary={{
          itemCount: 2,
          priceSummary: MOCK_PRICE_SUMMARY,
        }}
      />
    );

    expect(spyFetch).not.toHaveBeenCalled();
    expect(spyStorage).not.toHaveBeenCalledWith(expect.stringContaining('cart'));

    spyFetch.mockRestore();
    spyStorage.mockRestore();
  });
});
