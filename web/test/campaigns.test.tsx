import React from 'react';
import { render, screen } from '@testing-library/react';
import CampaignBanner from '../src/components/promo/CampaignBanner';
import OfferCard from '../src/components/promo/OfferCard';
import PromoStrip from '../src/components/promo/PromoStrip';
import FlashDealBanner from '../src/components/promo/FlashDealBanner';
import CouponBanner from '../src/components/promo/CouponBanner';
import DeliveryPromoBanner from '../src/components/promo/DeliveryPromoBanner';
import AppDownloadBanner from '../src/components/promo/AppDownloadBanner';

describe('CMD-021 Campaign & Promotional Content Blocks', () => {

  // 1. CampaignBanner Marketplace vs Flado Rendering
  it('renders CampaignBanner and applies Marketplace theme styling', () => {
    const { container } = render(
      <CampaignBanner
        title="Big Electronics Drop"
        subtitle="Gadgets at flat 30% off"
        imageUrl="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
        ctaUrl="/categories/electronics"
        badge="Tech Special"
        surface="MARKETPLACE"
      />
    );

    expect(screen.getByRole('heading', { name: 'Big Electronics Drop' })).toBeInTheDocument();
    expect(screen.getByText('Tech Special')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Shop Campaign' })).toBeInTheDocument();
    
    const sec = container.querySelector('section');
    expect(sec?.className).not.toContain('quickCommerce');
  });

  it('renders CampaignBanner and applies Flado theme styling', () => {
    const { container } = render(
      <CampaignBanner
        title="Farm Fresh Produce"
        subtitle="Organic veggies drop"
        imageUrl="https://images.unsplash.com/photo-1610832958506-aa56368176cf"
        ctaUrl="/flado/categories/fruits-vegetables"
        badge="Grocery Special"
        surface="QUICK_COMMERCE"
      />
    );

    expect(screen.getByRole('heading', { name: 'Farm Fresh Produce' })).toBeInTheDocument();
    expect(screen.getByText('Grocery Special')).toBeInTheDocument();
    
    const sec = container.querySelector('section');
    expect(sec?.className).toContain('quickCommerce');
  });

  // 2. OfferCard and PromoStrip Rendering
  it('renders OfferCard and PromoStrip components correctly', () => {
    const offers = [
      {
        title: 'Offer Item 1',
        description: 'First promotional block description',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        badge: '10% OFF',
        ctaUrl: '/offer-1'
      },
      {
        title: 'Offer Item 2',
        description: 'Second promotional block description',
        imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b',
        badge: 'BOGO',
        ctaUrl: '/offer-2'
      }
    ];

    render(
      <PromoStrip
        title="Hot Weekly Deals"
        offers={offers}
        surface="MARKETPLACE"
      />
    );

    expect(screen.getByRole('heading', { name: 'Hot Weekly Deals' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Offer Item 1' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Offer Item 2' })).toBeInTheDocument();
    expect(screen.getByText('First promotional block description')).toBeInTheDocument();
    expect(screen.getByText('Second promotional block description')).toBeInTheDocument();
  });

  // 3. FlashDealBanner Timer Invariant (static only)
  it('renders FlashDealBanner presentational values and does not calculate timers', () => {
    render(
      <FlashDealBanner
        title="Flash Sale Super Drop"
        subtitle="Top branded products at flat 50% discount"
        expiryText="Closes in 2 Hours 15 Mins"
        ctaUrl="/deals"
        surface="MARKETPLACE"
      />
    );

    expect(screen.getByRole('heading', { name: 'Flash Sale Super Drop' })).toBeInTheDocument();
    expect(screen.getByText('Closes in 2 Hours 15 Mins')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View Deals' })).toBeInTheDocument();
  });

  // 4. CouponBanner Presentational Check
  it('renders CouponBanner code details and triggers copy actions', () => {
    // Mock navigator.clipboard
    const mockCopy = jest.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: mockCopy
      }
    });

    render(
      <CouponBanner
        couponCode="AURAFEST20"
        description="Get flat 20% discount on clothing collections"
        surface="MARKETPLACE"
      />
    );

    expect(screen.getByText('AURAFEST20')).toBeInTheDocument();
    expect(screen.getByText('Get flat 20% discount on clothing collections')).toBeInTheDocument();
    
    const btn = screen.getByRole('button', { name: 'Copy Code' });
    expect(btn).toBeInTheDocument();
    
    // Wrap click in act because it triggers a state change (setCopied)
    const { act } = require('@testing-library/react');
    act(() => {
      btn.click();
    });
    
    expect(mockCopy).toHaveBeenCalledWith('AURAFEST20');
  });

  // 5. DeliveryPromoBanner Integrity Check (no fabrication)
  it('renders DeliveryPromoBanner message inputs without fabricating promises', () => {
    render(
      <DeliveryPromoBanner
        message="Free express shipping on all orders over ₹499"
        subMessage="Delivered securely by authorized courier partners"
        surface="MARKETPLACE"
      />
    );

    expect(screen.getByRole('heading', { name: 'Free express shipping on all orders over ₹499' })).toBeInTheDocument();
    expect(screen.getByText('Delivered securely by authorized courier partners')).toBeInTheDocument();
  });

  // 6. AppDownloadBanner Presentational Buttons
  it('renders AppDownloadBanner with App Store and Google Play redirection links', () => {
    render(
      <AppDownloadBanner
        title="Get our official mobile app"
        subtitle="Shop on the go"
        appStoreUrl="https://apple.co/real"
        playStoreUrl="https://google.com/real"
      />
    );

    expect(screen.getByRole('heading', { name: 'Get our official mobile app' })).toBeInTheDocument();
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(2);
    expect(links[0].closest('a')).toHaveAttribute('href', 'https://apple.co/real');
    expect(links[1].closest('a')).toHaveAttribute('href', 'https://google.com/real');
  });
});
