import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryTree, { CategoryNode } from '../src/components/category/CategoryTree';
import CategorySidebar from '../src/components/category/CategorySidebar';
import CategoryBreadcrumbs from '../src/components/category/CategoryBreadcrumbs';
import CategoryCard from '../src/components/category/CategoryCard';
import CategoryGrid from '../src/components/category/CategoryGrid';
import CategoryEmptyState from '../src/components/category/CategoryEmptyState';
import CategoryNavigationLayout from '../src/components/category/CategoryNavigationLayout';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

const MOCK_TREE_CATEGORIES: CategoryNode[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    children: [
      { id: 'smartphones', name: 'Smartphones', slug: 'smartphones' },
      { id: 'laptops', name: 'Laptops', slug: 'laptops' },
    ],
  },
  {
    id: 'fashion',
    name: 'Fashion',
    slug: 'fashion',
    children: [
      { id: 'mens', name: 'Mens Wear', slug: 'mens-wear' },
    ],
  },
];

const MOCK_GRID_CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Smartphones & Tablets',
    slug: 'smartphones-tablets',
    subtitle: 'Latest mobile devices',
    productCount: 142,
    badgeText: 'HOT',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
  },
  {
    id: 'cat-2',
    name: 'Audio & Headphones',
    slug: 'audio-headphones',
    subtitle: 'Wireless earphones',
    productCount: 89,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
  },
];

const MOCK_BREADCRUMBS = [
  { label: 'Electronics', href: '/categories/electronics' },
  { label: 'Audio', href: '/categories/electronics/audio' },
  { label: 'Headphones' },
];

describe('CMD-025 Customer Category Navigation Foundation', () => {
  // 1. CategoryTree nested rendering
  it('renders nested categories in CategoryTree with correct WAI-ARIA tree roles', () => {
    render(
      <CategoryTree
        categories={MOCK_TREE_CATEGORIES}
        expandedIds={['electronics']}
        activeId="smartphones"
      />
    );

    const tree = screen.getByTestId('category-tree');
    expect(tree).toBeInTheDocument();
    expect(tree).toHaveAttribute('role', 'tree');

    const treeitems = screen.getAllByRole('treeitem');
    expect(treeitems.length).toBe(4); // Electronics, Smartphones, Laptops, Fashion

    const electronicsItem = treeitems.find(
      (item) => item.getAttribute('aria-label') === 'Electronics'
    );
    expect(electronicsItem).toHaveAttribute('aria-expanded', 'true');

    const smartphonesItem = treeitems.find(
      (item) => item.getAttribute('aria-label') === 'Smartphones'
    );
    expect(smartphonesItem).toHaveAttribute('aria-selected', 'true');
  });

  // 2. Expand/Collapse callbacks
  it('triggers onToggleExpand when expand button is clicked', () => {
    const onToggleExpand = jest.fn();
    render(
      <CategoryTree
        categories={MOCK_TREE_CATEGORIES}
        expandedIds={[]}
        onToggleExpand={onToggleExpand}
      />
    );

    const expandBtn = screen.getByRole('button', { name: /Expand Electronics/i });
    fireEvent.click(expandBtn);
    expect(onToggleExpand).toHaveBeenCalledWith('electronics');
  });

  // 3. Keyboard navigation in CategoryTree
  it('navigates treeitems using keyboard controls (ArrowDown, ArrowUp, Home, End)', () => {
    render(
      <CategoryTree
        categories={MOCK_TREE_CATEGORIES}
        expandedIds={['electronics']}
      />
    );

    const treeitems = screen.getAllByRole('treeitem');
    const firstItem = treeitems[0]; // Electronics
    const secondItem = treeitems[1]; // Smartphones

    firstItem.focus();
    expect(document.activeElement).toBe(firstItem);

    // ArrowDown
    fireEvent.keyDown(firstItem, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(secondItem);

    // ArrowUp
    fireEvent.keyDown(secondItem, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(firstItem);

    // End
    fireEvent.keyDown(firstItem, { key: 'End' });
    expect(document.activeElement).toBe(treeitems[treeitems.length - 1]);

    // Home
    fireEvent.keyDown(treeitems[treeitems.length - 1], { key: 'Home' });
    expect(document.activeElement).toBe(firstItem);
  });

  // 4. CategoryBreadcrumbs rendering
  it('renders CategoryBreadcrumbs with aria-label="Breadcrumb" and aria-current="page"', () => {
    render(<CategoryBreadcrumbs items={MOCK_BREADCRUMBS} />);

    const nav = screen.getByTestId('category-breadcrumbs');
    expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Audio')).toBeInTheDocument();

    const currentItem = screen.getByText('Headphones');
    expect(currentItem).toHaveAttribute('aria-current', 'page');
  });

  // 5. CategoryCard rendering & Flado surface theme
  it('renders CategoryCard details and applies Flado theme styles when surface="QUICK_COMMERCE"', () => {
    render(
      <CategoryCard
        category={MOCK_GRID_CATEGORIES[0]}
        surface="QUICK_COMMERCE"
      />
    );

    expect(screen.getByText('Smartphones & Tablets')).toBeInTheDocument();
    expect(screen.getByText('Latest mobile devices')).toBeInTheDocument();
    expect(screen.getByText('142 items')).toBeInTheDocument();
    expect(screen.getByText('HOT')).toBeInTheDocument();

    const article = screen.getByTestId('category-card');
    expect(article.className).toContain('fladoCard');
  });

  // 6. CategoryGrid rendering
  it('renders CategoryGrid with responsive columns', () => {
    render(<CategoryGrid categories={MOCK_GRID_CATEGORIES} />);

    const grid = screen.getByTestId('category-grid');
    expect(grid).toBeInTheDocument();
    const cards = screen.getAllByTestId('category-card');
    expect(cards.length).toBe(2);
  });

  // 7. CategoryEmptyState rendering
  it('renders CategoryEmptyState with custom titles and trigger callbacks', () => {
    const onReset = jest.fn();
    render(
      <CategoryEmptyState
        title="No categories found"
        description="Try resetting your filters"
        action={{ label: 'Reset Selection', onClick: onReset }}
      />
    );

    expect(screen.getByText('No categories found')).toBeInTheDocument();
    expect(screen.getByText('Try resetting your filters')).toBeInTheDocument();

    const actionBtn = screen.getByRole('button', { name: 'Reset Selection' });
    fireEvent.click(actionBtn);
    expect(onReset).toHaveBeenCalled();
  });

  // 8. CategoryNavigationLayout composition
  it('composes CategoryNavigationLayout with Sidebar, Grid, and Breadcrumbs', () => {
    render(
      <CategoryNavigationLayout
        breadcrumbItems={MOCK_BREADCRUMBS}
        treeCategories={MOCK_TREE_CATEGORIES}
        gridCategories={MOCK_GRID_CATEGORIES}
        expandedIds={['electronics']}
      />
    );

    expect(screen.getByTestId('category-navigation-layout')).toBeInTheDocument();
    expect(screen.getByTestId('category-breadcrumbs')).toBeInTheDocument();
    expect(screen.getByTestId('category-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('category-grid')).toBeInTheDocument();
  });

  // 9. Invariants: Props-only architecture (No fetch, No localStorage)
  it('enforces props-only architecture without calling fetch or accessing localStorage', () => {
    if (!window.fetch) window.fetch = jest.fn() as any;
    const spyFetch = jest.spyOn(window, 'fetch');
    const spyStorage = jest.spyOn(Storage.prototype, 'getItem');

    render(
      <CategoryNavigationLayout
        breadcrumbItems={MOCK_BREADCRUMBS}
        treeCategories={MOCK_TREE_CATEGORIES}
        gridCategories={MOCK_GRID_CATEGORIES}
      />
    );

    expect(spyFetch).not.toHaveBeenCalled();
    expect(spyStorage).not.toHaveBeenCalledWith(expect.stringContaining('category'));

    spyFetch.mockRestore();
    spyStorage.mockRestore();
  });
});
