'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiChevronLeft, FiTag, FiClock, FiCheck, FiCopy } from 'react-icons/fi';
import { fladoProductsData } from '@/data/fladoProducts';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

interface CampaignConfig {
  slug: string;
  title: string;
  subtitle: string;
  categoryFilter: string;
  couponCode: string;
  discountDesc: string;
  primaryColor: string;
  accentGradient: string;
}

const CAMPAIGNS: CampaignConfig[] = [
  {
    slug: 'fresh-farm-drop',
    title: '🍎 Farm Fresh Drop Deals',
    subtitle: 'Direct orchard fruits & daily harvested farm veggies at flat 20% discount!',
    categoryFilter: 'fruits-vegetables',
    couponCode: 'ORGANIC20',
    discountDesc: 'Flat 20% OFF on min order of ₹299',
    primaryColor: '#10B981',
    accentGradient: 'linear-gradient(135deg, #10B981 0%, #064E3B 100%)'
  },
  {
    slug: 'midnight-munchies',
    title: '🍿 Midnight Munchies Carnival',
    subtitle: 'Craving snacks or carbonated soft drinks? Browse Cadet BOGOs now!',
    categoryFilter: 'snacks-beverages',
    couponCode: 'SWEET15',
    discountDesc: 'Flat 15% OFF on snacks, chocolates & sodas',
    primaryColor: '#F59E0B',
    accentGradient: 'linear-gradient(135deg, #F59E0B 0%, #78350F 100%)'
  },
  {
    slug: 'monsoon-cleaning',
    title: '🧹 Monsoon Deep Cleaning Specials',
    subtitle: 'Premium detergent liquid, sprays & surface disinfectants delivered instantly.',
    categoryFilter: 'household',
    couponCode: 'CLEAN50',
    discountDesc: 'Flat ₹50 OFF on household essentials',
    primaryColor: '#3B82F6',
    accentGradient: 'linear-gradient(135deg, #3B82F6 0%, #1E3A8A 100%)'
  }
];

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function FladoCampaignPage({ params }: PageProps) {
  const { slug } = use(params);
  const campaign = CAMPAIGNS.find(c => c.slug === slug);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 42, seconds: 19 });

  // Countdown timer loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        clearInterval(interval);
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!campaign) {
    notFound();
  }

  const filteredProducts = fladoProductsData.filter(
    p => p.isFlado && p.category === campaign.categoryFilter
  );

  const copyCoupon = () => {
    navigator.clipboard.writeText(campaign.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className={styles.campaignPage}>
      
      {/* 1. HERO GRADIENT BANNER */}
      <div 
        className={styles.campaignHero}
        style={{ backgroundImage: campaign.accentGradient }}
      >
        <div className="container">
          <Link href="/flado/offers" className={styles.backBtn}>
            <FiChevronLeft /> Back to Offers Hub
          </Link>
          <div className={styles.heroText}>
            <h1>{campaign.title}</h1>
            <p>{campaign.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '30px' }}>
        
        {/* 2. DYNAMIC GRID CONTROLS ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '40px' }}>
          
          {/* Coupon Info */}
          <div className={styles.infoCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <FiTag style={{ color: campaign.primaryColor, fontSize: '1.25rem' }} />
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '900' }}>Active Coupon Code</h3>
            </div>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              {campaign.discountDesc}
            </p>
            <button 
              onClick={copyCoupon}
              className={styles.copyCouponBtn}
              style={{ borderColor: campaign.primaryColor, color: campaign.primaryColor }}
            >
              {copied ? (
                <>
                  <FiCheck /> Copied Code!
                </>
              ) : (
                <>
                  <FiCopy /> Copy {campaign.couponCode}
                </>
              )}
            </button>
          </div>

          {/* Countdown Clock */}
          <div className={styles.infoCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <FiClock style={{ color: '#EF4444', fontSize: '1.25rem' }} />
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '900' }}>Deals Closing Soon</h3>
            </div>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              Grab discounts before this timed campaign session expires.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className={styles.timeUnit}>
                <strong>{timeLeft.hours.toString().padStart(2, '0')}</strong>
                <span>Hrs</span>
              </div>
              <div className={styles.timeUnit}>
                <strong>{timeLeft.minutes.toString().padStart(2, '0')}</strong>
                <span>Mins</span>
              </div>
              <div className={styles.timeUnit}>
                <strong>{timeLeft.seconds.toString().padStart(2, '0')}</strong>
                <span>Secs</span>
              </div>
            </div>
          </div>

        </div>

        {/* 3. PRODUCTS LISTING GRID */}
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '900', marginBottom: '24px' }}>
            Available Campaign Products
          </h2>
          <div className={styles.productsGrid}>
            {filteredProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
