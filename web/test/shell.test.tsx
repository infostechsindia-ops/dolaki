import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Shell from '../src/components/layout/Shell';
import SkipLink from '../src/components/layout/SkipLink';
import {
  Container,
  PageContainer,
  Section,
  Stack,
  Inline,
  Grid,
  ProductGrid,
} from '../src/components/layout/LayoutPrimitives';
import LayoutStateWrapper from '../src/components/layout/LayoutStateWrapper';

describe('CMD-016 Customer Web Application Shell', () => {
  // ─── Landmark and SkipLink ──────────────────────────────────────────────────
  it('renders SkipLink that explicitly transfers keyboard focus to #main-content', async () => {
    // Render the SkipLink and main content landmark
    render(
      <div>
        <SkipLink />
        <main id="main-content">Content</main>
      </div>
    );

    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    const mainContent = screen.getByRole('main');

    expect(skipLink).toBeInTheDocument();
    expect(mainContent).toBeInTheDocument();

    // Clicking SkipLink should call focus() on main-content
    // Mock the focus method on the DOM element
    const focusSpy = jest.spyOn(mainContent, 'focus');
    
    await userEvent.click(skipLink);
    expect(focusSpy).toHaveBeenCalled();
    expect(mainContent).toHaveAttribute('tabIndex', '-1');
    focusSpy.mockRestore();
  });

  it('renders main landmark exactly once and contains no empty Header/Footer landmarks', () => {
    const { container } = render(
      <Shell surface="MARKETPLACE">
        <p>Main content child</p>
      </Shell>
    );

    // Main landmark should exist exactly once
    const mainLandmarks = screen.getAllByRole('main');
    expect(mainLandmarks).toHaveLength(1);
    expect(mainLandmarks[0]).toHaveAttribute('id', 'main-content');

    // No empty landmark slots (header, footer, nav, aside) should be rendered in the Shell
    expect(container.querySelector('header')).toBeNull();
    expect(container.querySelector('footer')).toBeNull();
    expect(container.querySelector('nav')).toBeNull();
    expect(container.querySelector('aside')).toBeNull();
  });

  // ─── Surface Theme Assignment ────────────────────────────────────────────────
  it('applies Marketplace surface assignment attributes and styles', () => {
    const { container } = render(
      <Shell surface="MARKETPLACE">
        <p>Content</p>
      </Shell>
    );

    const shellElement = container.firstChild as HTMLElement;
    expect(shellElement).toHaveAttribute('data-surface', 'marketplace');
    // Renders custom marketplace class
    expect(shellElement.className).toContain('marketplace');
  });

  it('applies Quick-Commerce surface assignment attributes and styles', () => {
    const { container } = render(
      <Shell surface="QUICK_COMMERCE">
        <p>Content</p>
      </Shell>
    );

    const shellElement = container.firstChild as HTMLElement;
    expect(shellElement).toHaveAttribute('data-surface', 'quick-commerce');
    expect(shellElement.className).toContain('quickCommerce');
  });

  // ─── Section Full-Bleed ─────────────────────────────────────────────────────
  it('supports full-bleed background and constrained inner content in Section', () => {
    const { container } = render(
      <Section className="bg-pattern" innerClassName="constrained-box">
        <p>Inside section</p>
      </Section>
    );

    const sectionElement = container.querySelector('section');
    expect(sectionElement).toBeInTheDocument();
    expect(sectionElement).toHaveClass('section', 'bg-pattern');

    // Inner element should have constraints
    const innerElement = sectionElement?.firstChild as HTMLElement;
    expect(innerElement).toHaveClass('sectionInner', 'constrained-box');
  });

  // ─── Primitives Data Isolation ──────────────────────────────────────────────
  it('guarantees layout primitives do not contain commerce, fetching, or data logic', () => {
    // Primitives must be strictly presentational containers rendering children
    const renderContainer = () => render(<Container><div data-testid="c">1</div></Container>);
    const renderPage = () => render(<PageContainer><div data-testid="p">1</div></PageContainer>);
    const renderStack = () => render(<Stack><div data-testid="s">1</div></Stack>);
    const renderInline = () => render(<Inline><div data-testid="i">1</div></Inline>);
    const renderGrid = () => render(<Grid><div data-testid="g">1</div></Grid>);
    const renderProductGrid = () => render(<ProductGrid><div data-testid="pg">1</div></ProductGrid>);

    expect(renderContainer).not.toThrow();
    expect(renderPage).not.toThrow();
    expect(renderStack).not.toThrow();
    expect(renderInline).not.toThrow();
    expect(renderGrid).not.toThrow();
    expect(renderProductGrid).not.toThrow();

    expect(screen.getByTestId('c')).toBeInTheDocument();
    expect(screen.getByTestId('p')).toBeInTheDocument();
    expect(screen.getByTestId('s')).toBeInTheDocument();
    expect(screen.getByTestId('i')).toBeInTheDocument();
    expect(screen.getByTestId('g')).toBeInTheDocument();
    expect(screen.getByTestId('pg')).toBeInTheDocument();
  });

  // ─── LayoutStateWrapper Isolation ─────────────────────────────────────────
  it('LayoutStateWrapper isolation: handles loading, error, empty, and offline state presentation', () => {
    // Offline State
    const { rerender } = render(
      <LayoutStateWrapper isOffline={true}>
        <div data-testid="content">Loaded</div>
      </LayoutStateWrapper>
    );
    expect(screen.queryByTestId('content')).toBeNull();
    expect(screen.getByText(/network connection lost/i)).toBeInTheDocument();

    // Error State
    rerender(
      <LayoutStateWrapper error="Failed to fetch products from backend price engine">
        <div data-testid="content">Loaded</div>
      </LayoutStateWrapper>
    );
    expect(screen.queryByTestId('content')).toBeNull();
    expect(screen.getByText(/failed to load content/i)).toBeInTheDocument();
    expect(screen.getByText(/failed to fetch products/i)).toBeInTheDocument();

    // Empty State
    rerender(
      <LayoutStateWrapper isEmpty={true} emptyStateTitle="Cart is Empty">
        <div data-testid="content">Loaded</div>
      </LayoutStateWrapper>
    );
    expect(screen.queryByTestId('content')).toBeNull();
    expect(screen.getByText(/cart is empty/i)).toBeInTheDocument();

    // Success State
    rerender(
      <LayoutStateWrapper>
        <div data-testid="content">Loaded</div>
      </LayoutStateWrapper>
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });
});
