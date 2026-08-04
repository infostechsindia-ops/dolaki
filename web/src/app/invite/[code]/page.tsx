'use client';

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiGift, FiShoppingBag, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import styles from './page.module.css';

interface InviteCodePageProps {
  params: Promise<{
    code: string;
  }>;
}

export default function InviteCodePage({ params }: InviteCodePageProps) {
  const { code } = use(params);
  const router = useRouter();
  const [claimed, setClaimed] = useState(false);

  const handleClaimReward = () => {
    setClaimed(true);
    
    // Simulate setting initial wallet balance credit of ₹50 reward in localStorage
    localStorage.setItem('auramart_referral_reward_claimed', 'true');
    localStorage.setItem('aurapay_wallet_balance', '1300'); // Increases balance from 1250 to 1300

    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  return (
    <div className={styles.claimContainer}>
      <div className="container">
        <div className={styles.claimCard}>
          <div className={styles.giftIconWrapper}>
            <FiGift className={styles.giftIcon} />
          </div>

          <span className={styles.inviteBadge}>Exclusive Invitation</span>
          <h1 className={styles.title}>You are invited to join AuraMart!</h1>
          <p className={styles.subtitle}>
            Your friend has shared code <strong>{code}</strong> with you. 
            Sign up below to claim your free <strong>₹50 AuraPay cash</strong> instantly to spend on groceries, fashion, or gadgets!
          </p>

          {claimed ? (
            <div className={styles.successReveal}>
              <FiCheckCircle className={styles.successIcon} />
              <h4>₹50 Reward Activated! 🎉</h4>
              <p>Redirecting you to the AuraMart marketplace...</p>
            </div>
          ) : (
            <button 
              onClick={handleClaimReward}
              className={styles.claimBtn}
            >
              Claim ₹50 Cash & Shop Now <FiArrowRight />
            </button>
          )}

          <div className={styles.trustFooter}>
            <span>Over 1M+ active shoppers in India trust AuraMart.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
