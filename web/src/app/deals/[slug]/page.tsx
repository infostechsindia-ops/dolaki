'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiClock, FiTag, FiCheck, FiCopy } from 'react-icons/fi';
import { campaignsData } from '@/data/campaigns';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';
import { API_BASE_URL } from '@/lib/config';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewsCount?: number;
  category?: string;
  brand?: string;
}

interface CampaignPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CampaignPage({ params }: CampaignPageProps) {
  const { slug } = use(params);
  const campaign = campaignsData.find((c) => c.slug === slug);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 23, minutes: 59, seconds: 59 });
  const [campaignProducts, setCampaignProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    if (!campaign) return;

    const loadProducts = async () => {
      setLoadingProducts(true);
      try {
        const cat = campaign.productCategory && campaign.productCategory !== 'all' ? `&category=${campaign.productCategory}` : '';
        const res = await fetch(`${API_BASE_URL}/api/v1/products?limit=24&sort=discount${cat}`);
        if (res.ok) {
          const json = await res.json();
          const list = json.data || [];
          setCampaignProducts(list.map((p: any) => ({
            id: p.id,
            name: p.title || p.name || 'Product',
            price: p.discountPrice ?? p.basePrice ?? 0,
            originalPrice: p.basePrice ?? 0,
            image: p.imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
            rating: p.rating ?? 4.5,
            reviewsCount: p.reviewCount ?? 12,
            category: p.category,
            brand: p.brand?.name || ''
          })));
        }
      } catch (e) {
        console.error('Deals page product load failed:', e);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();

    // Countdown logic
    const calculateTimeLeft = () => {
      const difference = +new Date(campaign.expiryDate) - +new Date();
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [campaign]);

  return (
    <div className={styles.campaignPage}>
      {/* Campaign Banner Header */}
      <div 
        className={styles.heroBanner}
        style={{ backgroundImage: `url(${campaign.bannerUrl})` }}
      >
        <div className={styles.heroOverlay} style={{ backgroundColor: `${campaign.accentColor}dd` }}></div>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroLeft}>
              <span className={styles.campaignBadge}>AuraMart Mega Event</span>
              <h1>{campaign.title}</h1>
              <p>{campaign.description}</p>
            </div>

            {/* Countdown timer */}
            <div className={styles.timerCard}>
              <span className={styles.timerTitle}><FiClock /> EVENT ENDING IN</span>
              <div className={styles.timerBox}>
                <div className={styles.timeUnit}>
                  <span className={styles.timeVal}>{String(timeLeft.days).padStart(2, '0')}</span>
                  <span className={styles.timeLbl}>Days</span>
                </div>
                <span className={styles.timerColon}>:</span>
                <div className={styles.timeUnit}>
                  <span className={styles.timeVal}>{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className={styles.timeLbl}>Hours</span>
                </div>
                <span className={styles.timerColon}>:</span>
                <div className={styles.timeUnit}>
                  <span className={styles.timeVal}>{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className={styles.timeLbl}>Mins</span>
                </div>
                <span className={styles.timerColon}>:</span>
                <div className={styles.timeUnit}>
                  <span className={styles.timeVal}>{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className={styles.timeLbl}>Secs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Coupon Strip */}
        <div className={styles.couponSec}>
          <div className={styles.couponLeft}>
            <h3>Apply Code & Save Extra {campaign.discountPercent}% OFF</h3>
            <p>Redeemable on all products shown below at checkout page.</p>
          </div>
          <div className={styles.couponBox}>
            <span className={styles.couponCode}>{campaign.couponCode}</span>
            <button className={styles.copyBtn} onClick={handleCopyCode} style={{ background: campaign.accentColor }}>
              {copied ? <FiCheck /> : <FiCopy />} {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
        </div>

        {/* Products List Grid */}
        {campaignProducts.length > 0 ? (
          <div className={styles.productsGrid}>
            {campaignProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.noProducts}>
            <p>No products currently found in this campaign.</p>
          </div>
        )}
      </div>
    </div>
  );
}
