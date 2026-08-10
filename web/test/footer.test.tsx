import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../src/components/Footer';

describe('CMD-019 Customer Web Footer', () => {
  
  // ─── Landmark Checks ────────────────────────────────────────────────────────
  it('renders exactly one semantic footer landmark', () => {
    const { container } = render(<Footer surface="MARKETPLACE" />);

    const footers = screen.getAllByRole('contentinfo');
    expect(footers).toHaveLength(1);
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  // ─── Surface Variant Rendering ──────────────────────────────────────────────
  it('renders Marketplace surface layout styling', () => {
    const { container } = render(<Footer surface="MARKETPLACE" />);

    const footerElem = container.querySelector('footer');
    expect(footerElem).not.toHaveClass('quickCommerce');
  });

  it('renders Flado surface layout overrides', () => {
    const { container } = render(<Footer surface="QUICK_COMMERCE" />);

    const footerElem = container.querySelector('footer');
    expect(footerElem).toHaveClass('quickCommerce');
  });

  // ─── Footer Sections Presence ───────────────────────────────────────────────
  it('renders all required footer sections and contact details', () => {
    render(<Footer surface="MARKETPLACE" />);

    // Grid section headers
    expect(screen.getByRole('heading', { name: 'Company' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: 'Customer Support' })).toHaveLength(2);
    expect(screen.getByRole('heading', { name: 'Marketplace' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Flado' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Legal' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Contact Details' })).toBeInTheDocument();

    // Specific contact list links
    expect(screen.getByText('support@auramart.in')).toBeInTheDocument();
    expect(screen.getByText('1800-AURA-MART')).toBeInTheDocument();
    expect(screen.getByText('24/7 Dedicated Support')).toBeInTheDocument();
  });

  // ─── Trust Badges Sections ──────────────────────────────────────────────────
  it('renders all trust sections', () => {
    render(<Footer surface="MARKETPLACE" />);

    expect(screen.getByRole('heading', { name: 'Secure Payments' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Buyer Protection' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Trusted Sellers' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: 'Customer Support' })).toHaveLength(2);
  });

  // ─── Social Media Icons ─────────────────────────────────────────────────────
  it('renders all five social media links and reuses IconButton', () => {
    render(<Footer surface="MARKETPLACE" />);

    const facebookBtn = screen.getByRole('button', { name: /facebook link/i });
    expect(facebookBtn.closest('a')).toHaveAttribute('href', 'https://facebook.com');

    const instagramBtn = screen.getByRole('button', { name: /instagram link/i });
    expect(instagramBtn.closest('a')).toHaveAttribute('href', 'https://instagram.com');

    const twitterBtn = screen.getByRole('button', { name: /x link/i });
    expect(twitterBtn.closest('a')).toHaveAttribute('href', 'https://twitter.com');

    const linkedinBtn = screen.getByRole('button', { name: /linkedin link/i });
    expect(linkedinBtn.closest('a')).toHaveAttribute('href', 'https://linkedin.com');

    const youtubeBtn = screen.getByRole('button', { name: /youtube link/i });
    expect(youtubeBtn.closest('a')).toHaveAttribute('href', 'https://youtube.com');

    // Confirm IconButton buttons inside the links
    const buttons = screen.getAllByRole('button');
    // Newsletter submit button + 5 social buttons = 6 buttons total
    expect(buttons.length).toBeGreaterThanOrEqual(6);
  });
});
