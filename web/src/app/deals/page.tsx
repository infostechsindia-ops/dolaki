'use client';

import React, { useState, useEffect } from 'react';
import { FiClock, FiZap, FiTag } from 'react-icons/fi';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

export default function DealsHubPage() {
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        else if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        else if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 3, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter products by discount
  const dealProducts = products.filter(p => p.originalPrice && p.originalPrice > p.price);

  return (
    <div className={styles.dealsPage}>
      {/* Banner */}
      <div className={styles.heroBanner}>
        <div className="container">
          <div className={styles.heroLayout}>
            <div className={styles.heroLeft}>
              <span className={styles.badge}><FiZap /> Limited Offers</span>
              <h1>Hourly Lightning Deals Hub</h1>
              <p>Flash discounts on top electronics, street fashion, beauty, and home essentials. Prices increase when timer hits zero!</p>
            </div>
            
            <div className={styles.timerCard}>
              <span className={styles.timerTitle}><FiClock /> DEALS RESET IN</span>
              <div className={styles.timerBox}>
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
        {/* Deal Products Grid */}
        <div className={styles.gridHeader}>
          <FiTag style={{ color: '#EF4444', fontSize: '1.2rem' }} />
          <h2>All Live Deals ({dealProducts.length} Active Deals)</h2>
        </div>

        {dealProducts.length > 0 ? (
          <div className={styles.productsGrid}>
            {dealProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.noDeals}>
            <p>Check back later for fresh hourly deals!</p>
          </div>
        )}
      </div>
    </div>
  );
}
