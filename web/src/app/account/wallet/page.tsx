'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { API_BASE_URL } from '@/lib/config';

export default function WalletPage() {
  const router = useRouter();
  const [balance, setBalance] = useState<number | null>(null);
  const [rewardPoints, setRewardPoints] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('aura_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    
    const fetchWalletData = async () => {
      setError('');
      try {
        const token = localStorage.getItem('aura_token');
        const walletRes = await fetch(`${API_BASE_URL}/api/users/wallet`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (walletRes.ok) {
          const wData = await walletRes.json();
          setBalance(wData.balance);
          setRewardPoints(wData.rewardPoints);
        } else {
          setError(`Unable to load wallet (Server status: ${walletRes.status}).`);
        }

        const txRes = await fetch(`${API_BASE_URL}/api/users/wallet/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (txRes.ok) {
          setTransactions(await txRes.json());
        }
      } catch (err) {
        setError('Connection failure: Unable to contact wallet service. Please check if backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [router]);

  if (loading) return <div className={styles.container}>Loading wallet details...</div>;

  return (
    <div className={styles.container}>
      <div style={{ backgroundColor: '#FEF3C7', borderLeft: '4px solid #D97706', color: '#92400E', padding: '1rem', marginBottom: '1.5rem', borderRadius: '4px' }}>
        <strong>Wallet Ledger Under Construction:</strong> Wallet balances and transaction history are mock-blocked in production until a secure, immutable ledger is implemented under <strong>CMD-117 (Wallet)</strong> and <strong>CMD-116 (Loyalty)</strong>.
      </div>

      {error && <div style={{ backgroundColor: '#FEF2F2', color: '#B91C1C', padding: '10px 15px', borderRadius: '4px', marginBottom: '15px', borderLeft: '4px solid #EF4444' }}>{error}</div>}

      <h2>AuraPay & Rewards</h2>
      
      <div className={styles.cardsRow}>
        <div className={styles.balanceCard}>
          <h3>AuraMart Wallet</h3>
          <div className={styles.amount}>₹{balance !== null ? balance : '--'}</div>
          <button className={styles.addMoneyBtn} title="Coming soon" disabled>Add Money</button>
        </div>
        
        <div className={styles.coinsCard}>
          <h3>AuraCoins</h3>
          <div className={styles.amount}>★ {rewardPoints !== null ? rewardPoints : '--'}</div>
          <p>≈ ₹{rewardPoints !== null ? rewardPoints / 10 : 0} Wallet Cash</p>
          <button className={styles.redeemBtn} disabled>Redeem Info</button>
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
        {transactions.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '1rem' }}>No transaction history available.</p>
        ) : (
          <div className={styles.txList}>
            {transactions.map((tx: any) => (
              <div key={tx.id} className={styles.txRow}>
                <div className={styles.txIcon}>{tx.type === 'earn' ? '★' : '💳'}</div>
                <div className={styles.txDetails}>
                  <strong>{tx.description || tx.desc}</strong>
                  <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={styles.txPoints}>{tx.amount}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
