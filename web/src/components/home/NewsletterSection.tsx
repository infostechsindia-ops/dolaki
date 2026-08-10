'use client';

import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import styles from './NewsletterSection.module.css';

export interface NewsletterSectionProps {
  title?: string;
  subtitle?: string;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function NewsletterSection({
  title = 'Subscribe to our Newsletter',
  subtitle = 'Get early updates on discount clearance events, exclusive coupons, and fresh arrivals.',
  surface = 'MARKETPLACE'
}: NewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const isFlado = surface === 'QUICK_COMMERCE';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className={`${styles.section} ${isFlado ? styles.quickCommerce : ''}`} aria-label="Newsletter Subscription">
      <div className={styles.newsletterCard}>
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <div className={styles.actionCol}>
          {subscribed ? (
            <span className={styles.successMsg}>✓ Thank you for subscribing!</span>
          ) : (
            <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
              <input
                type="email"
                required
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.newsletterInput}
                aria-label="Email address for newsletter"
              />
              <button type="submit" className={styles.newsletterBtn} aria-label="Subscribe">
                <FiSend />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
