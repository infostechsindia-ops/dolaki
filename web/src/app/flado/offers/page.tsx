'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiPercent, FiCopy, FiCheck, FiShoppingBag } from 'react-icons/fi';
import styles from './page.module.css';

interface Coupon {
  code: string;
  discount: string;
  minOrder: number;
  description: string;
  category: 'all' | 'groceries' | 'snacks' | 'dairy' | 'household';
}

const mockCoupons: Coupon[] = [
  { code: 'FLADO50', discount: '₹50 OFF', minOrder: 399, description: 'Save ₹50 flat on your first quick-commerce order of the week.', category: 'all' },
  { code: 'ORGANIC20', discount: '20% OFF', minOrder: 299, description: 'Applicable on fresh organic farm greens and direct fruits.', category: 'groceries' },
  { code: 'DAIRY30', discount: '₹30 OFF', minOrder: 199, description: 'Applicable on milk, butter, cheese, and fresh bakery buns.', category: 'dairy' },
  { code: 'SWEET15', discount: '15% OFF', minOrder: 249, description: 'Save on Cadbury chocolates, Lay\'s chips, and tea combos.', category: 'snacks' },
  { code: 'CLEAN50', discount: '₹50 OFF', minOrder: 499, description: 'Get discounts on HUL household detergents and surface cleaners.', category: 'household' }
];

export default function FladoOffersPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'groceries' | 'snacks' | 'dairy' | 'household'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const filteredCoupons = activeTab === 'all' 
    ? mockCoupons 
    : mockCoupons.filter(c => c.category === activeTab);

  return (
    <div className={styles.offersPage}>
      {/* Top Header */}
      <div className={styles.topHeader}>
        <div className="container">
          <Link href="/flado" className={styles.backBtn}>
            <FiChevronLeft /> Back to Flado Express
          </Link>
          <div className={styles.titleSec}>
            <h1>🏷️ Flado Live Offers & Coupons</h1>
            <p>Claim active coupons, promo codes, and special discounts for your basket checkout.</p>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '35px' }}>
        
        {/* Category Tabs */}
        <div className={styles.tabsRow}>
          {(['all', 'groceries', 'snacks', 'dairy', 'household'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTabBtn : ''}`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Coupons Grid */}
        <div className={styles.couponsGrid}>
          {filteredCoupons.map(coupon => (
            <div key={coupon.code} className={styles.couponCard}>
              <div className={styles.cardAccent} />
              <div className={styles.cardBody}>
                <div className={styles.badgeRow}>
                  <span className={styles.discountBadge}>{coupon.discount}</span>
                  <span className={styles.minOrderText}>Min Order: ₹{coupon.minOrder}</span>
                </div>
                <h3 className={styles.couponCode}>{coupon.code}</h3>
                <p className={styles.couponDesc}>{coupon.description}</p>
                <div className={styles.actionRow}>
                  <button 
                    onClick={() => handleCopyCode(coupon.code)} 
                    className={`${styles.copyBtn} ${copiedCode === coupon.code ? styles.copied : ''}`}
                  >
                    {copiedCode === coupon.code ? (
                      <>
                        <FiCheck /> Code Copied!
                      </>
                    ) : (
                      <>
                        <FiCopy /> Copy Coupon Code
                      </>
                    )}
                  </button>
                  <Link href={`/flado/categories/${coupon.category === 'all' ? 'fruits-vegetables' : coupon.category}`} className={styles.shopBtn}>
                    <FiShoppingBag /> Shop Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Big Promo Banners */}
        <div className={styles.promoBannersSection}>
          <h3>Featured Storewide Campaigns</h3>
          <div className={styles.bannersGrid}>
            <div className={styles.promoBanner} style={{ backgroundImage: 'linear-gradient(135deg, #10B981 0%, #064E3B 100%)' }}>
              <h4>🍏 Fresh Farm Drop Deals</h4>
              <p>Direct orchard fruits and leafy veggies with flat 20% discount. Harvested daily.</p>
              <Link href="/flado/categories/fruits-vegetables" className={styles.bannerLink}>Shop Fresh Drops</Link>
            </div>
            <div className={styles.promoBanner} style={{ backgroundImage: 'linear-gradient(135deg, #F59E0B 0%, #78350F 100%)' }}>
              <h4>🍪 Midnight Munchies Carnival</h4>
              <p>Chocolates, potato crisps, chips, and carbonated beverages at special combo prices.</p>
              <Link href="/flado/categories/snacks-beverages" className={styles.bannerLink}>Browse Snacks</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
