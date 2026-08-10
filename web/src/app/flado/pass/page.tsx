'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FiCheckCircle, 
  FiStar, 
  FiArrowRight, 
  FiChevronLeft,
  FiAward,
  FiGift
} from 'react-icons/fi';
import styles from './page.module.css';

interface PassPlan {
  id: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  name: string;
  price: string;
  period: string;
  savingsDesc: string;
  badge?: string;
}

const PLANS: PassPlan[] = [
  { id: 'MONTHLY', name: 'Monthly Superpass', price: '$3.99', period: '1 Month', savingsDesc: 'Saves $15.00/mo on avg' },
  { id: 'QUARTERLY', name: 'Quarterly Valuepass', price: '$9.99', period: '3 Months', savingsDesc: 'Saves $45.00/mo on avg', badge: 'Popular' },
  { id: 'ANNUAL', name: 'Annual VIP Pass', price: '$29.99', period: '1 Year', savingsDesc: 'Saves $180.00/yr on avg', badge: 'Best Value' }
];

export default function FladoPassPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'MONTHLY' | 'QUARTERLY' | 'ANNUAL'>('QUARTERLY');
  const [isActivating, setIsActivating] = useState(false);
  const [isPassActive, setIsPassActive] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [activePlanName, setActivePlanName] = useState('');
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchVipStatus = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('aura_token') : null;
      if (!token) {
        setIsPassActive(false);
        return;
      }

      const res = await fetch('/api/v1/flado/vip/status', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setIsPassActive(data.isVip);
        if (data.isVip && data.expiresAt) {
          const date = new Date(data.expiresAt);
          setExpiryDate(date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }));
          setActivePlanName(data.plan || 'VIP Pass');
          setCancelAtPeriodEnd(!!data.cancelAtPeriodEnd);
        }
      }
    } catch {
      // Ignore initial check errors for anonymous shoppers
    }
  };

  useEffect(() => {
    fetchVipStatus();
  }, []);

  const handleActivatePass = async () => {
    setErrorMsg('');
    const token = typeof window !== 'undefined' ? localStorage.getItem('aura_token') : null;

    if (!token) {
      router.push('/auth/login?redirect=/flado/pass');
      return;
    }

    setIsActivating(true);

    try {
      // 1. Subscribe (Create pending subscription & payment intent)
      const subRes = await fetch('/api/v1/flado/vip/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Idempotency-Key': `idemp-pass-${Date.now()}`
        },
        body: JSON.stringify({ plan: selectedPlan })
      });

      if (!subRes.ok) {
        const err = await subRes.json();
        throw new Error(err.message || 'Failed to initiate subscription');
      }

      const subData = await subRes.json();

      // 2. Confirm Payment & Activate Subscription
      const confirmRes = await fetch('/api/v1/flado/vip/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ subscriptionId: subData.subscription.id })
      });

      if (!confirmRes.ok) {
        const err = await confirmRes.json();
        throw new Error(err.message || 'Failed to confirm payment');
      }

      const activeSub = await confirmRes.json();
      setIsPassActive(true);
      if (activeSub.expiresAt) {
        const date = new Date(activeSub.expiresAt);
        setExpiryDate(date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }));
      }
      setActivePlanName(activeSub.plan);

      // Trigger custom window event to notify Header/other modules of state update
      window.dispatchEvent(new Event('flado_pass_updated'));
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during VIP Pass activation.');
    } finally {
      setIsActivating(false);
    }
  };

  const handleDeactivatePass = async () => {
    setErrorMsg('');
    const token = typeof window !== 'undefined' ? localStorage.getItem('aura_token') : null;
    if (!token) return;

    try {
      const res = await fetch('/api/v1/flado/vip/cancel', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setCancelAtPeriodEnd(true);
        window.dispatchEvent(new Event('flado_pass_updated'));
      } else {
        const err = await res.json();
        setErrorMsg(err.message || 'Failed to cancel subscription.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error cancelling subscription.');
    }
  };

  return (
    <div className={styles.passPage}>
      {isActivating && (
        <div className={styles.paymentOverlay}>
          <div className={styles.processingCard}>
            <div className={styles.spinner}></div>
            <h3>Securing Flado VIP Pass...</h3>
            <p>Processing payment confirmation.</p>
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

        {errorMsg && (
          <div style={{
            padding: '14px 20px',
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            borderRadius: '12px',
            color: '#991B1B',
            fontWeight: '600',
            marginBottom: '24px',
            fontSize: '0.9rem'
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

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
                Unlock unlimited free 10-minute deliveries and waived cold-chain handling fees on all Flado Quick orders.
              </p>

              <div className={styles.perksList}>
                <div className={styles.perkRow}>
                  <FiCheckCircle className={styles.checkIcon} />
                  <div>
                    <strong>Unlimited Free Delivery</strong>
                    <span>Get FREE 10-minute deliveries on all orders above $5.00. No codes needed.</span>
                  </div>
                </div>

                <div className={styles.perkRow}>
                  <FiStar className={styles.checkIcon} />
                  <div>
                    <strong>100% Waived Handling Fees</strong>
                    <span>Handling and cold-chain packaging fees are completely waived at checkout.</span>
                  </div>
                </div>

                <div className={styles.perkRow}>
                  <FiGift className={styles.checkIcon} />
                  <div>
                    <strong>Priority Flash Dispatches</strong>
                    <span>Your grocery baskets are handled first at local darkstores with priority rider matching.</span>
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
                  Active Plan: <strong>{activePlanName}</strong> | Benefits Active Until: <strong>{expiryDate}</strong>
                </p>

                {cancelAtPeriodEnd && (
                  <div style={{
                    backgroundColor: '#FEF3C7',
                    border: '1px solid #FCD34D',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '0.8rem',
                    color: '#92400E',
                    marginBottom: '16px',
                    fontWeight: '600'
                  }}>
                    ℹ️ Cancellation requested. Your VIP benefits remain active until {expiryDate}.
                  </div>
                )}

                <div className={styles.activePerksGrid}>
                  <div className={styles.activePerkBadge}>🚀 Free Delivery Active</div>
                  <div className={styles.activePerkBadge}>🔥 Waived Handling Fees</div>
                  <div className={styles.activePerkBadge}>🛵 Speed Rider Match</div>
                </div>

                {!cancelAtPeriodEnd && (
                  <button 
                    onClick={handleDeactivatePass}
                    className={styles.deactivateBtn}
                  >
                    Cancel Renewal
                  </button>
                )}
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
                            <span className={styles.popularBadge} style={{ backgroundColor: plan.id === 'ANNUAL' ? '#EF4444' : '#059669' }}>
                              {plan.badge}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                          <span style={{ fontSize: '1.5rem', fontWeight: '900' }}>{plan.price}</span>
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
                  Authoritative server subscription. Cancel anytime. Terms apply.
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
