'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiZap, FiClock } from 'react-icons/fi';
import styles from './FlashSaleTicker.module.css';

export interface FlashDealItem {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  image: string;
  category: string;
}

const SAMPLE_FLASH_DEALS: FlashDealItem[] = [
  {
    id: 'ele-1',
    title: 'AuraBook Pro 16" M3 Max',
    price: 249990,
    originalPrice: 269990,
    discountPercent: 7,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    category: 'electronics'
  },
  {
    id: 'ele-2',
    title: 'AuraPhone 15 Pro 256GB Titanium',
    price: 134900,
    originalPrice: 144900,
    discountPercent: 7,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    category: 'electronics'
  },
  {
    id: 'fas-1',
    title: 'Premium Leather Biker Jacket',
    price: 8999,
    originalPrice: 12999,
    discountPercent: 30,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
    category: 'fashion'
  },
  {
    id: 'bea-1',
    title: 'Advanced Botanical Facial Serum',
    price: 2499,
    originalPrice: 3299,
    discountPercent: 24,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
    category: 'beauty'
  }
];

export default function FlashSaleTicker() {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 5, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles.flashSaleSection} aria-label="Flash Deals">
      <div className={styles.flashHeader}>
        <div className={styles.titleGroup}>
          <FiZap className={styles.flashIcon} />
          <h2 className={styles.flashTitle}>Lightning Flash Deals</h2>
        </div>

        <div className={styles.timerBox}>
          <FiClock />
          <span>Ends In</span>
          <span className={styles.timerUnit}>{String(timeLeft.hours).padStart(2, '0')}h</span>
          <span className={styles.timerUnit}>{String(timeLeft.minutes).padStart(2, '0')}m</span>
          <span className={styles.timerUnit}>{String(timeLeft.seconds).padStart(2, '0')}s</span>
        </div>
      </div>

      <div className={styles.dealsGrid}>
        {SAMPLE_FLASH_DEALS.map((deal) => (
          <Link key={deal.id} href={`/products/${deal.id}`} className={styles.dealCard}>
            <div className={styles.imageWrapper}>
              <img src={deal.image} alt={deal.title} className={styles.dealImage} />
              <span className={styles.discountBadge}>{deal.discountPercent}% OFF</span>
            </div>
            <h3 className={styles.dealTitle}>{deal.title}</h3>
            <div className={styles.priceGroup}>
              <span className={styles.currentPrice}>₹{deal.price.toLocaleString()}</span>
              <span className={styles.originalPrice}>₹{deal.originalPrice.toLocaleString()}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
