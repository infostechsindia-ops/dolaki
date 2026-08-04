'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiChevronLeft, 
  FiPlus, 
  FiCreditCard, 
  FiAward, 
  FiTrendingUp, 
  FiArrowRight,
  FiActivity
} from 'react-icons/fi';
import styles from './page.module.css';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  desc: string;
  date: string;
}

export default function FladoWalletPage() {
  const [fladoCash, setFladoCash] = useState(750);
  const [fladoCoins, setFladoCoins] = useState(2400);
  const [topUpAmt, setTopUpAmt] = useState('');
  const [txs, setTxs] = useState<Transaction[]>([
    { id: 'TX-1082', type: 'credit', amount: 50, desc: 'Weekly checkout promo cashback credit', date: 'June 29, 2026' },
    { id: 'TX-1081', type: 'debit', amount: 548, desc: 'Payment for order #FLADO-98274', date: 'June 29, 2026' },
    { id: 'TX-1080', type: 'credit', amount: 500, desc: 'Wallet top-up secure UPI deposit', date: 'June 25, 2026' }
  ]);

  useEffect(() => {
    const savedCash = localStorage.getItem('flado_wallet_cash');
    const savedCoins = localStorage.getItem('flado_wallet_coins');
    if (savedCash) setFladoCash(parseInt(savedCash));
    if (savedCoins) setFladoCoins(parseInt(savedCoins));
  }, []);

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(topUpAmt);
    if (isNaN(amt) || amt <= 0) {
      alert('Enter a valid amount to top up.');
      return;
    }
    const newCash = fladoCash + amt;
    setFladoCash(newCash);
    localStorage.setItem('flado_wallet_cash', newCash.toString());

    // Add transaction
    const newTx: Transaction = {
      id: 'TX-' + Math.floor(1000 + Math.random() * 9000),
      type: 'credit',
      amount: amt,
      desc: 'Wallet top-up secure deposit',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    setTxs([newTx, ...txs]);
    setTopUpAmt('');
  };

  return (
    <div className={styles.walletPage}>
      <div className="container">
        
        {/* Header navigation */}
        <div style={{ marginBottom: '20px' }}>
          <Link href="/flado" className={styles.backBtn}>
            <FiChevronLeft /> Back to Groceries
          </Link>
        </div>

        <div className={styles.walletGrid}>
          
          {/* Left Column: Balances info */}
          <div className={styles.balanceColumn}>
            
            {/* FladoCash Card */}
            <div className={styles.cashCard}>
              <span className={styles.cardLabel}>Available FladoCash Balance</span>
              <h2 className={styles.cardValue}>₹{fladoCash.toLocaleString('en-IN')}</h2>
              <p className={styles.cardHelp}>100% safe, fast checkout payments with no OTP failures.</p>
              
              <form onSubmit={handleTopUp} className={styles.topUpForm}>
                <input
                  type="number"
                  placeholder="Enter top up amount (₹)"
                  value={topUpAmt}
                  onChange={(e) => setTopUpAmt(e.target.value)}
                  className={styles.topUpInput}
                />
                <button type="submit" className={styles.topUpBtn}>
                  <FiPlus /> Add Cash
                </button>
              </form>
            </div>

            {/* FladoCoins Card */}
            <div className={styles.coinsCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span className={styles.cardLabel} style={{ color: '#D97706' }}>FladoCoins Balance</span>
                  <h2 className={styles.cardValue} style={{ color: '#D97706' }}>{fladoCoins.toLocaleString('en-IN')}</h2>
                </div>
                <div className={styles.coinsIcon}>🪙</div>
              </div>
              <div style={{ borderTop: '1px solid #FEF3C7', marginTop: '16px', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: '#B45309', fontWeight: '800' }}>
                  ⭐ 10 Coins = ₹1 Cashback value. Use coins during checkouts to claim extra discount rates.
                </span>
              </div>
            </div>

            {/* Loyalty Tier Progress */}
            <div className={styles.tierCard}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiAward style={{ color: '#8B5CF6' }} /> Loyalty Member Status
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '750', marginBottom: '8px' }}>
                <span>Gold Member</span>
                <span>Platinum VIP (2,400 / 5,000 Coins)</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressBarFill} style={{ width: '48%' }}></div>
              </div>
            </div>

          </div>

          {/* Right Column: Transaction History */}
          <div className={styles.historyColumn}>
            <div className={styles.historyCard}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '1rem', fontWeight: '950', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiActivity /> Wallet Ledger Statements
              </h3>

              <div className={styles.txList}>
                {txs.map((tx) => (
                  <div key={tx.id} className={styles.txRow}>
                    <div style={{ flex: 1, marginRight: '16px' }}>
                      <strong style={{ fontSize: '0.82rem', fontWeight: '850', color: 'var(--color-text-primary)', display: 'block' }}>
                        {tx.desc}
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                        {tx.date} • ID: {tx.id}
                      </span>
                    </div>
                    <span 
                      style={{ 
                        fontSize: '0.9rem', 
                        fontWeight: '900', 
                        color: tx.type === 'credit' ? '#10B981' : '#EF4444' 
                      }}
                    >
                      {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
