import React from 'react';
import { render, screen } from '@testing-library/react';
import MobileBottomNav from '../src/components/layout/MobileBottomNav';
import { CartProvider } from '../src/context/CartContext';

// Mock Next.js usePathname
const mockPathname = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname() {
    return mockPathname();
  },
}));

describe('CMD-018 Customer Web Mobile Bottom Navigation', () => {
  beforeEach(() => {
    mockPathname.mockReset();
    mockPathname.mockReturnValue('/');
  });

  // ─── Accessibility Semantics ────────────────────────────────────────────────
  it('renders with correct nav landmark and accessibility roles', () => {
    render(
      <CartProvider>
        <MobileBottomNav surface="MARKETPLACE" />
      </CartProvider>
    );

    const navElement = screen.getByRole('navigation', { name: /mobile navigation/i });
    expect(navElement).toBeInTheDocument();
  });

  // ─── Active Tab Highlighting ────────────────────────────────────────────────
  it('adds active class and aria-current to active home tab', () => {
    mockPathname.mockReturnValue('/');
    render(
      <CartProvider>
        <MobileBottomNav surface="MARKETPLACE" />
      </CartProvider>
    );

    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveClass('active');
    expect(homeLink).toHaveAttribute('aria-current', 'page');

    const categoriesLink = screen.getByRole('link', { name: 'Categories' });
    expect(categoriesLink).not.toHaveClass('active');
    expect(categoriesLink).not.toHaveAttribute('aria-current');
  });

  it('adds active class and aria-current to active categories tab', () => {
    mockPathname.mockReturnValue('/categories');
    render(
      <CartProvider>
        <MobileBottomNav surface="MARKETPLACE" />
      </CartProvider>
    );

    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).not.toHaveClass('active');

    const categoriesLink = screen.getByRole('link', { name: 'Categories' });
    expect(categoriesLink).toHaveClass('active');
    expect(categoriesLink).toHaveAttribute('aria-current', 'page');
  });

  // ─── Cart Count Badge ────────────────────────────────────────────────────────
  it('renders cart count badge when items are in cart', () => {
    // Initial: no items, badge absent
    const { unmount } = render(
      <CartProvider>
        <MobileBottomNav surface="MARKETPLACE" />
      </CartProvider>
    );

    expect(screen.queryByLabelText(/items in cart/i)).toBeNull();

    // Unmount to trigger reload on fresh render
    unmount();

    // Rerender with mocked local storage cart items to populate CartProvider items
    localStorage.setItem('auramart_cart', JSON.stringify([{ product: { id: 'prod-1', name: 'Product 1', price: 100, isFlado: false }, quantity: 3 }]));
    
    render(
      <CartProvider>
        <MobileBottomNav surface="MARKETPLACE" />
      </CartProvider>
    );

    const badge = screen.getByLabelText(/3 items in cart/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('3');
  });

  // ─── Surface Theme Rendering ────────────────────────────────────────────────
  it('renders marketplace navigation targets and toggles', () => {
    render(
      <CartProvider>
        <MobileBottomNav surface="MARKETPLACE" />
      </CartProvider>
    );

    // Marketplace Quick Commerce toggle leads to /flado
    const toggleLink = screen.getByRole('link', { name: /switch to flado/i });
    expect(toggleLink).toHaveAttribute('href', '/flado');
    expect(toggleLink).not.toHaveClass('quickToggleFlado');
  });

  it('renders quick commerce navigation targets and toggles', () => {
    render(
      <CartProvider>
        <MobileBottomNav surface="QUICK_COMMERCE" />
      </CartProvider>
    );

    // Quick Commerce toggle leads to /
    const toggleLink = screen.getByRole('link', { name: /switch to auramart/i });
    expect(toggleLink).toHaveAttribute('href', '/');
    expect(toggleLink).toHaveClass('quickToggleFlado');
  });
});
