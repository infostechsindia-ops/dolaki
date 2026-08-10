import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WishlistPage from '../src/components/wishlist/WishlistPage';
import WishlistHeader from '../src/components/wishlist/WishlistHeader';
import WishlistToolbar from '../src/components/wishlist/WishlistToolbar';
import WishlistGrid from '../src/components/wishlist/WishlistGrid';
import WishlistItem from '../src/components/wishlist/WishlistItem';
import WishlistActions from '../src/components/wishlist/WishlistActions';
import WishlistEmptyState from '../src/components/wishlist/WishlistEmptyState';

const MOCK_ITEM_1 = {
  id: 'w-1',
  title: 'Organic Almond Milk 1L',
  category: 'Dairy & Beverages',
  brand: 'PureOrganics',
  image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300',
  formattedPrice: '$4.99',
  formattedCompareAtPrice: '$5.99',
  discountPercent: 17,
  inStock: true,
  stockBadgeText: 'In Stock (12 left)',
  deliveryBadgeText: '15 MINS',
  surface: 'QUICK_COMMERCE' as const,
};

const MOCK_ITEM_2 = {
  id: 'w-2',
  title: 'Wireless Mechanical Keyboard',
  category: 'Electronics',
  brand: 'Keycraft',
  image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300',
  formattedPrice: '$129.00',
  inStock: false,
  stockBadgeText: 'Out of Stock',
  surface: 'MARKETPLACE' as const,
};

describe('CMD-033 Customer Wishlist Foundation', () => {
  // 1. WishlistHeader
  it('renders WishlistHeader with single H1 title and count badge', () => {
    render(<WishlistHeader title="My Saved Items" itemCount={5} />);

    expect(screen.getByTestId('wishlist-header')).toBeInTheDocument();
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s.length).toBe(1);
    expect(h1s[0]).toHaveTextContent('My Saved Items');
    expect(screen.getByTestId('wishlist-count-badge')).toHaveTextContent('(5 items)');
  });

  // 2. WishlistToolbar
  it('renders WishlistToolbar with sort select, in-stock filter, and callbacks', () => {
    const onSortChange = jest.fn();
    const onInStockToggle = jest.fn();

    render(
      <WishlistToolbar
        itemCount={2}
        sortBy="DATE_ADDED_DESC"
        onSortChange={onSortChange}
        inStockOnly={false}
        onInStockToggle={onInStockToggle}
      />
    );

    expect(screen.getByTestId('wishlist-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('wishlist-toolbar-count')).toHaveTextContent('2 saved items');

    const sortSelect = screen.getByTestId('wishlist-sort-select');
    fireEvent.change(sortSelect, { target: { value: 'PRICE_LOW_HIGH' } });
    expect(onSortChange).toHaveBeenCalledWith('PRICE_LOW_HIGH');

    const checkInput = screen.getByTestId('wishlist-instock-filter');
    fireEvent.click(checkInput);
    expect(onInStockToggle).toHaveBeenCalledWith(true);
  });

  // 3. WishlistItem & Product information rendering
  it('renders WishlistItem with verbatim formattedPrice, stock metadata, and delivery text from props', () => {
    render(<WishlistItem item={MOCK_ITEM_1} />);

    expect(screen.getByTestId('wishlist-item-w-1')).toBeInTheDocument();
    expect(screen.getByTestId('wishlist-item-title')).toHaveTextContent('Organic Almond Milk 1L');
    expect(screen.getByTestId('wishlist-item-brand')).toHaveTextContent('PureOrganics');
    expect(screen.getByTestId('wishlist-item-price')).toHaveTextContent('$4.99');
    expect(screen.getByTestId('wishlist-item-compare-price')).toHaveTextContent('$5.99');
    expect(screen.getByTestId('wishlist-item-discount')).toHaveTextContent('-17%');
    expect(screen.getByTestId('wishlist-item-stock')).toHaveTextContent('In Stock (12 left)');
    expect(screen.getByTestId('wishlist-item-delivery')).toHaveTextContent('15 MINS');
  });

  // 4. WishlistActions callbacks
  it('triggers onRemove, onMoveToCart, and onViewProduct callbacks', () => {
    const onRemove = jest.fn();
    const onMoveToCart = jest.fn();
    const onViewProduct = jest.fn();

    render(
      <WishlistActions
        productId="w-1"
        onRemove={onRemove}
        onMoveToCart={onMoveToCart}
        onViewProduct={onViewProduct}
        inStock={true}
      />
    );

    expect(screen.getByTestId('wishlist-actions')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('move-to-cart-btn-w-1'));
    expect(onMoveToCart).toHaveBeenCalledWith('w-1');

    fireEvent.click(screen.getByTestId('view-product-btn-w-1'));
    expect(onViewProduct).toHaveBeenCalledWith('w-1');

    fireEvent.click(screen.getByTestId('remove-wishlist-btn-w-1'));
    expect(onRemove).toHaveBeenCalledWith('w-1');
  });

  // 5. WishlistGrid responsive structure
  it('renders WishlistGrid containing item cards', () => {
    render(
      <WishlistGrid
        items={[MOCK_ITEM_1, MOCK_ITEM_2]}
      />
    );

    expect(screen.getByTestId('wishlist-grid')).toBeInTheDocument();
    expect(screen.getByTestId('wishlist-item-w-1')).toBeInTheDocument();
    expect(screen.getByTestId('wishlist-item-w-2')).toBeInTheDocument();
  });

  // 6. WishlistEmptyState
  it('renders WishlistEmptyState reusing EmptyState UI primitive', () => {
    const onContinueShopping = jest.fn();
    render(<WishlistEmptyState onContinueShopping={onContinueShopping} />);

    expect(screen.getByTestId('wishlist-empty-state')).toBeInTheDocument();
    expect(screen.getByText('Your wishlist is empty')).toBeInTheDocument();

    const btn = screen.getByRole('button', { name: /Continue Shopping/i });
    fireEvent.click(btn);
    expect(onContinueShopping).toHaveBeenCalled();
  });

  // 7. Full WishlistPage composition (Marketplace & Quick-Commerce)
  it('composes full WishlistPage with single H1, toolbar, and items grid for Marketplace & Flado surfaces', () => {
    const onSortChange = jest.fn();
    const onRemove = jest.fn();
    const onMoveToCart = jest.fn();

    const { rerender } = render(
      <WishlistPage
        header={{ title: 'My Wishlist', itemCount: 2 }}
        toolbar={{
          itemCount: 2,
          sortBy: 'DATE_ADDED_DESC',
          onSortChange,
        }}
        items={[MOCK_ITEM_1, MOCK_ITEM_2]}
        onRemove={onRemove}
        onMoveToCart={onMoveToCart}
        surface="MARKETPLACE"
      />
    );

    expect(screen.getByTestId('wishlist-page')).toBeInTheDocument();
    expect(screen.getByTestId('wishlist-header')).toBeInTheDocument();
    expect(screen.getByTestId('wishlist-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('wishlist-grid')).toBeInTheDocument();

    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s.length).toBe(1);
    expect(h1s[0]).toHaveTextContent('My Wishlist');

    // Rerender as Quick-Commerce surface
    rerender(
      <WishlistPage
        header={{ title: 'Flado Quick Saved Items', itemCount: 2 }}
        items={[MOCK_ITEM_1]}
        surface="QUICK_COMMERCE"
      />
    );
    expect(screen.getByTestId('wishlist-page')).toBeInTheDocument();
  });

  // 8. Invariants: Props-only architecture (No fetch, No localStorage)
  it('enforces props-only architecture without fetch or localStorage calls', () => {
    if (!window.fetch) window.fetch = jest.fn() as any;
    const spyFetch = jest.spyOn(window, 'fetch');
    const spyStorage = jest.spyOn(Storage.prototype, 'getItem');

    render(
      <WishlistPage
        header={{ title: 'My Wishlist', itemCount: 1 }}
        items={[MOCK_ITEM_1]}
      />
    );

    expect(spyFetch).not.toHaveBeenCalled();
    expect(spyStorage).not.toHaveBeenCalledWith(expect.stringContaining('wishlist'));

    spyFetch.mockRestore();
    spyStorage.mockRestore();
  });
});
