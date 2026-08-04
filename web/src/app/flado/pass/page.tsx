'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiZap, 
  FiCheckCircle, 
  FiStar, 
  FiArrowRight, 
  FiChevronLeft,
  FiAward,
  FiGift
} from 'react-icons/fi';
import styles from './page.module.css';

interface PassPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  savingsDesc: string;
  badge?: string;
}

const PLANS: PassPlan[] = [
  { id: 'monthly', name: 'Monthly Superpass', price: 39, period: '1 Month', savingsDesc: 'Saves ₹250/mo on avg' },
  { id: 'quarterly', name: 'Quarterly Valuepass', price: 99, period: '3 Months', savingsDesc: 'Saves ₹900/mo on avg', badge: 'Popular' },
  { id: 'annual', name: 'Annual VIP pass', price: 299, period: '1 Year', savingsDesc: 'Saves ₹4,200/yr on avg', badge: 'Best Value' }
];

export default function FladoPassPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>('quarterly');
  const [isActivating, setIsActivating] = useState(false);
  const [isPassActive, setIsPassActive] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    const active = localStorage.getItem('flado_pass_active') === 'true';
    const expiry = localStorage.getItem('flado_pass_expiry') || '';
    setIsPassActive(active);
    setExpiryDate(expiry);
  }, []);

  const handleActivatePass = () => {
    setIsActivating(true);

    setTimeout(() => {
      const future = new Date();
      if (selectedPlan === 'monthly') future.setMonth(future.getMonth() + 1);
      else if (selectedPlan === 'quarterly') future.setMonth(future.getMonth() + 3);
      else future.setFullYear(future.getFullYear() + 1);

      const formattedDate = future.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      localStorage.setItem('flado_pass_active', 'true');
      localStorage.setItem('flado_pass_expiry', formattedDate);
      
      setIsPassActive(true);
      setExpiryDate(formattedDate);
      setIsActivating(false);

      // Trigger custom window event to notify Header/other modules of state update
      window.dispatchEvent(new Event('flado_pass_updated'));
    }, 2000);
  };

  const handleDeactivatePass = () => {
    localStorage.removeItem('flado_pass_active');
    localStorage.removeItem('flado_pass_expiry');
    setIsPassActive(false);
    setExpiryDate('');
    window.dispatchEvent(new Event('flado_pass_updated'));
  };

  return (
    <div className={styles.passPage}>
      {isActivating && (
        <div className={styles.paymentOverlay}>
          <div className={styles.processingCard}>
            <div className={styles.spinner}></div>
            <h3>Securing VIP Flado Pass...</h3>
            <p>Deducting pass fees from wallet balance.</p>
          </div>
        </div>
      )}

      <div className="container">
        
        {/* Navigation Header */}
        <div style={{ marginBottom: '24px' }}>
          <Link href="/flado" className={styles.backBtn}>
            <FiChevronLeft /> Back to Grocery Mall
          </Link>
        </div>

        <div className={styles.passGrid}>
          
          {/* Left Column: Perks List */}
          <div className={styles.perksColumn}>
            <div className={styles.perksCard}>
              <div className={styles.cardHeaderIcon}>
                <FiAward size={28} />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '950', margin: '16px 0 8px 0' }}>
                Join Flado Pass Elite
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#A7F3D0', fontWeight: '600', margin: '0 0 32px 0', lineHeight: 1.5 }}>
                Unlock unlimited free delivery benefits and extra discount percentages on 205+ items. Fulfill orders in 10-minutes instantly.
              </p>

              <div className={styles.perksList}>
                <div className={styles.perkRow}>
                  <FiCheckCircle className={styles.checkIcon} />
                  <div>
                    <strong>Unlimited Free Delivery</strong>
                    <span>Get FREE deliveries on all orders above ₹99. No codes needed.</span>
                  </div>
                </div>

                <div className={styles.perkRow}>
                  <FiStar className={styles.checkIcon} />
                  <div>
                    <strong>Extra 5% Member Savings</strong>
                    <span>Deduct additional 5% off automatically on checkout for dairy, breads & fresh greens.</span>
                  </div>
                </div>

                <div className={styles.perkRow}>
                  <FiGift className={styles.checkIcon} />
                  <div>
                    <strong>Priority Flash Dispatches</strong>
                    <span>Your grocery baskets are handled first at local darkstores. Priority rider matching.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Tier Cards */}
          <div className={styles.plansColumn}>
            
            {isPassActive ? (
              <div className={styles.activePassCard}>
                <div className={styles.sparkleDecoration}>🌟</div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#047857', margin: '0 0 8px 0' }}>
                  Your Flado Pass is Active!
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#065F46', fontWeight: '750', margin: '0 0 24px 0' }}>
                  Member benefits active. Expiry Date: <strong>{expiryDate}</strong>
                </p>

                <div className={styles.activePerksGrid}>
                  <div className={styles.activePerkBadge}>🚀 Free Delivery Active</div>
                  <div className={styles.activePerkBadge}>🔥 5% EXTRA Discount</div>
                  <div className={styles.activePerkBadge}>🛵 Speed Rider Match</div>
                </div>

                <button 
                  onClick={handleDeactivatePass}
                  className={styles.deactivateBtn}
                >
                  Cancel Subscription
                </button>
              </div>
            ) : (
              <div className={styles.plansCard}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', margin: '0 0 20px 0' }}>
                  Select Pass Duration Plan
                </h3>

                <div className={styles.plansList}>
                  {PLANS.map((plan) => {
                    const isSelected = selectedPlan === plan.id;
                    return (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`${styles.planOptionBtn} ${isSelected ? styles.planOptionActive : ''}`}
                        type="button"
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: '850' }}>{plan.name}</span>
                          {plan.badge && (
                            <span className={styles.popularBadge} style={{ backgroundColor: plan.id === 'annual' ? '#EF4444' : '#059669' }}>
                              {plan.badge}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                          <span style={{ fontSize: '1.5rem', fontWeight: '900' }}>₹{plan.price}</span>
                          <span style={{ fontSize: '0.76rem', color: 'var(--color-text-secondary)', fontWeight: '700' }}>
                            {plan.savingsDesc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button 
                  onClick={handleActivatePass}
                  className={styles.activateBtn}
                >
                  Activate Flado Pass <FiArrowRight />
                </button>

                <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '14px', lineHeight: 1.4 }}>
                  By activating, pass fees are debited mock from wallet tokens. Cancel anytime. Terms apply.
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
