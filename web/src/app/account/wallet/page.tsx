'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function WalletPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('aura_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    
    // Mock API
    setData({
      balance: 1250,
      rewardPoints: 850,
      transactions: [
        { id: 1, type: 'earn', desc: 'Order reward (#AM-98274)', date: 'June 29, 2026', points: '+40' },
        { id: 2, type: 'earn', desc: 'Order reward (#AM-87361)', date: 'June 25, 2026', points: '+120' },
        { id: 3, type: 'earn', desc: 'Referral bonus', date: 'June 20, 2026', points: '+200' },
        { id: 4, type: 'earn', desc: 'Order reward (#AM-76291)', date: 'June 18, 2026', points: '+50' },
        { id: 5, type: 'earn', desc: 'First order bonus', date: 'June 10, 2026', points: '+100' },
      ]
    });
  }, [router]);

  if (!data) return <div className={styles.container}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h2>AuraPay & Rewards</h2>
      
      <div className={styles.cardsRow}>
        <div className={styles.balanceCard}>
          <h3>AuraMart Wallet</h3>
          <div className={styles.amount}>₹{data.balance}</div>
          <button className={styles.addMoneyBtn} title="Coming soon" disabled>Add Money</button>
        </div>
        
        <div className={styles.coinsCard}>
          <h3>AuraCoins</h3>
          <div className={styles.amount}>★ {data.rewardPoints}</div>
          <p>≈ ₹{data.rewardPoints / 10} Wallet Cash</p>
          <button className={styles.redeemBtn}>Redeem Info</button>
        </div>
      </div>
      
      <div className={styles.infoCard}>
        <h4>About AuraCoins</h4>
        <div className={styles.infoGrid}>
          <div>
            <strong>How to earn</strong>
            <p>Get 1% of every purchase back as AuraCoins.</p>
          </div>
          <div>
            <strong>How to redeem</strong>
            <p>100 coins = ₹10 off. Apply at checkout for instant discounts.</p>
          </div>
        </div>
      </div>

      <div className={styles.historySection}>
        <h3>Transaction History</h3>
        <div className={styles.txList}>
          {data.transactions.map((tx: any) => (
            <div key={tx.id} className={styles.txRow}>
              <div className={styles.txIcon}>{tx.type === 'earn' ? '★' : '💳'}</div>
              <div className={styles.txDetails}>
                <strong>{tx.desc}</strong>
                <span>{tx.date}</span>
              </div>
              <div className={styles.txPoints}>{tx.points}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
