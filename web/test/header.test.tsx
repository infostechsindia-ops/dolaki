import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../src/components/Header';
import { CartProvider } from '../src/context/CartContext';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: mockPush,
    };
  },
  usePathname() {
    return '/';
  },
}));

describe('CMD-017 Customer Web Header', () => {
  beforeEach(() => {
    mockPush.mockClear();
    localStorage.clear();
  });

  // ─── Landmark Count ─────────────────────────────────────────────────────────
  it('renders exactly one header landmark', () => {
    const { container } = render(
      <CartProvider>
        <Header surface="MARKETPLACE" />
      </CartProvider>
    );

    const headers = screen.getAllByRole('banner');
    expect(headers).toHaveLength(1);
    expect(container.querySelector('header')).toBeInTheDocument();
  });

  // ─── Surface Theme Rendering ────────────────────────────────────────────────
  it('renders Marketplace branding and default text', () => {
    render(
      <CartProvider>
        <Header surface="MARKETPLACE" />
      </CartProvider>
    );

    // Should show AuraMart brand logo
    expect(screen.getByLabelText('AuraMart Home')).toBeInTheDocument();
    expect(screen.getByText('Aura')).toBeInTheDocument();
    expect(screen.getByText('Mart')).toBeInTheDocument();
    expect(screen.getByText(/Big Billion Aura Sale/i)).toBeInTheDocument();
    expect(screen.queryByLabelText('Flado Grocery Home')).toBeNull();
  });

  it('renders Flado branding and removes delivery promises', () => {
    render(
      <CartProvider>
        <Header surface="QUICK_COMMERCE" />
      </CartProvider>
    );

    // Should show Flado brand logo and remove mock "10-Min" / "10-Min Delivery"
    expect(screen.getByLabelText('Flado Grocery Home')).toBeInTheDocument();
    expect(screen.getByText('Flado')).toBeInTheDocument();
    expect(screen.getByText('Express')).toBeInTheDocument();
    expect(screen.getByText(/Super value groceries/i)).toBeInTheDocument();
    
    // No hardcoded delivery ETA text
    expect(screen.queryByText(/10-Min Delivery/i)).toBeNull();
    expect(screen.queryByText(/10 Min/i)).toBeNull();
  });

  // ─── Absence of Mocks ───────────────────────────────────────────────────────
  it('contains no seeded delivery locations or hardcoded mock lists', () => {
    render(
      <CartProvider>
        <Header surface="MARKETPLACE" />
      </CartProvider>
    );

    // Initial state: No mock pincode text should be present
    expect(screen.getByText('Select Delivery Location')).toBeInTheDocument();
    expect(screen.queryByText('Mumbai, Bandra West')).toBeNull();
    expect(screen.queryByText('Bangalore, Indiranagar')).toBeNull();
  });

  // ─── Location Selector Modal ────────────────────────────────────────────────
  it('opens Modal, accepts text input preference, updates text, and restores focus', async () => {
    const { container } = render(
      <CartProvider>
        <Header surface="MARKETPLACE" />
      </CartProvider>
    );

    const triggerBtn = screen.getByRole('button', { name: /delivery location/i });
    expect(triggerBtn).toBeInTheDocument();

    // Click trigger to open Modal
    await userEvent.click(triggerBtn);

    // Modal elements should render
    expect(screen.getByRole('heading', { name: /delivery address preference/i })).toBeInTheDocument();
    const inputField = screen.getByRole('textbox', { name: /city name or pincode/i });
    expect(inputField).toBeInTheDocument();

    // Focus should be trapped/moved to first focusable element (close button) after animation frame
    const closeBtn = screen.getByRole('button', { name: /close dialog/i });
    await waitFor(() => {
      expect(document.activeElement).toBe(closeBtn);
    });

    // Focus input and type new preference and submit
    inputField.focus();
    await userEvent.type(inputField, 'Maunath Bhanjan, 275101');
    const submitBtn = screen.getByRole('button', { name: /apply preference/i });
    await userEvent.click(submitBtn);

    // Modal should close and header update text
    expect(screen.queryByRole('heading', { name: /delivery address preference/i })).toBeNull();
    expect(screen.getByText('Maunath Bhanjan, 275101')).toBeInTheDocument();

    // Local storage preference updated
    expect(localStorage.getItem('auramart_unverified_location_preference')).toBe('Maunath Bhanjan, 275101');

    // Focus restored to trigger button
    expect(document.activeElement).toBe(triggerBtn);
  });

  // ─── Departments Keyboard Accessibility ─────────────────────────────────────
  it('toggles departments dropdown on click/Enter/Space, handles focus list and Escape', async () => {
    render(
      <CartProvider>
        <Header surface="MARKETPLACE" />
      </CartProvider>
    );

    const menuBtn = screen.getByRole('button', { name: /departments menu/i });
    expect(menuBtn).toHaveAttribute('aria-expanded', 'false');

    // 1. Trigger open via keyboard space bar
    fireEvent.keyDown(menuBtn, { key: ' ', code: 'Space' });
    expect(menuBtn).toHaveAttribute('aria-expanded', 'true');

    // Link options should be visible
    const links = screen.getAllByRole('menuitem');
    expect(links).toHaveLength(8);

    // First item focused automatically
    await waitFor(() => {
      expect(document.activeElement).toBe(links[0]);
    });

    // 2. Navigate items using ArrowDown
    fireEvent.keyDown(links[0], { key: 'ArrowDown' });
    expect(document.activeElement).toBe(links[1]);

    fireEvent.keyDown(links[1], { key: 'ArrowUp' });
    expect(document.activeElement).toBe(links[0]);

    // 3. Escape key closes menu and restores trigger focus
    fireEvent.keyDown(links[0], { key: 'Escape' });
    expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
    expect(document.activeElement).toBe(menuBtn);
  });

  // ─── Sticky Compact State ──────────────────────────────────────────────────
  it('sets compact class on scroll past 50px threshold', () => {
    const { container } = render(
      <CartProvider>
        <Header surface="MARKETPLACE" />
      </CartProvider>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).not.toHaveClass('compact');

    // Scroll past threshold
    window.scrollY = 100;
    fireEvent.scroll(window);
    expect(wrapper).toHaveClass('compact');

    // Scroll back
    window.scrollY = 10;
    fireEvent.scroll(window);
    expect(wrapper).not.toHaveClass('compact');
  });

  // ─── Search Submission ──────────────────────────────────────────────────────
  it('submits search query and navigates to the search route', async () => {
    render(
      <CartProvider>
        <Header surface="MARKETPLACE" />
      </CartProvider>
    );

    const searchBox = screen.getByRole('searchbox', { name: /search products/i });
    expect(searchBox).toBeInTheDocument();

    // Type query and submit
    await userEvent.type(searchBox, 'headphones{enter}');

    expect(mockPush).toHaveBeenCalledWith('/search?q=headphones');
  });
});
