'use client';

import React, { useState } from 'react';
import { FiCopy, FiShare2, FiGift, FiUsers, FiAward, FiCheckCircle } from 'react-icons/fi';
import styles from './page.module.css';

export default function InvitePage() {
  const referralCode = 'ARIF50';
  const inviteLink = `http://localhost:3000/invite/${referralCode}`;

  const [copied, setCopied] = useState(false);

  const referredUsers = [
    { name: 'Karan Sharma', date: 'June 29, 2026', status: 'completed', reward: '₹50 Credited' },
    { name: 'Neha Gupta', date: 'June 27, 2026', status: 'pending', reward: 'Pending First Order' }
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.inviteContainer}>
      <div className="container">
        <div className={styles.inviteCard}>
          <div className={styles.giftIconWrapper}>
            <FiGift className={styles.giftIcon} />
          </div>

          <span className={styles.promoTag}>INVITE & EARN</span>
          <h1 className={styles.title}>Get ₹50 Free Wallet Cash!</h1>
          <p className={styles.subtitle}>
            Share your unique invite link. When your friend signs up, they get <strong>₹50 credit</strong> instantly. 
            Once they place their first order, you get <strong>₹50 credit</strong> in your AuraPay wallet!
          </p>

          {/* Referral Code Box */}
          <div className={styles.shareBox}>
            <div className={styles.codeLabel}>YOUR UNIQUE INVITE LINK</div>
            <div className={styles.linkRow}>
              <span className={styles.linkText}>{inviteLink}</span>
              <button 
                onClick={handleCopyLink} 
                className={`${styles.copyBtn} ${copied ? styles.copyBtnSuccess : ''}`}
              >
                {copied ? <FiCheckCircle /> : <FiCopy />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Social share icons */}
          <div className={styles.shareButtons}>
            <a 
              href={`https://api.whatsapp.com/send?text=Hey!%20Join%20AuraMart%20using%20my%20link%20and%20get%20%E2%82%B950%20free%20wallet%20cash%20instantly%20%F0%9F%8E%81%20${inviteLink}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`${styles.shareLink} ${styles.waShare}`}
            >
              Share via WhatsApp
            </a>
          </div>
        </div>

        {/* Referred list */}
        <div className={styles.referralsListCard}>
          <h3 className={styles.listTitle}>
            <FiUsers /> Your Referrals Stats
          </h3>
          <div className={styles.referralsList}>
            {referredUsers.map((u, idx) => (
              <div key={idx} className={styles.referralRow}>
                <div>
                  <span className={styles.refName}>{u.name}</span>
                  <span className={styles.refDate}>Invited on {u.date}</span>
                </div>
                <span className={`${styles.refStatus} ${u.status === 'completed' ? styles.statusClaimed : styles.statusWait}`}>
                  {u.reward}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
