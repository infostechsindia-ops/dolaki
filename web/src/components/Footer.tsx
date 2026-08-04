'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiShield, FiTruck, FiRefreshCw, FiSmile, FiMail, FiSend } from 'react-icons/fi';
import styles from './Footer.module.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className={styles.footer}>
      {/* Trust Badges */}
      <div className={styles.trustBadges}>
        <div className="container">
          <div className={styles.badgesGrid}>
            <div className={styles.badgeItem}>
              <div className={styles.badgeIconWrapper}>
                <FiTruck className={styles.badgeIcon} />
              </div>
              <div className={styles.badgeText}>
                <h4>Instant & Free Delivery</h4>
                <p>10-min Flado grocery delivery & free standard shipping above ₹499</p>
              </div>
            </div>
            <div className={styles.badgeItem}>
              <div className={styles.badgeIconWrapper}>
                <FiShield className={styles.badgeIcon} />
              </div>
              <div className={styles.badgeText}>
                <h4>Secure Payments</h4>
                <p>Fully encrypted transactions via UPI, Credit/Debit cards & Netbanking</p>
              </div>
            </div>
            <div className={styles.badgeItem}>
              <div className={styles.badgeIconWrapper}>
                <FiRefreshCw className={styles.badgeIcon} />
              </div>
              <div className={styles.badgeText}>
                <h4>7-Day Easy Returns</h4>
                <p>Hassle-free, no-questions-asked returns and direct refunds</p>
              </div>
            </div>
            <div className={styles.badgeItem}>
              <div className={styles.badgeIconWrapper}>
                <FiSmile className={styles.badgeIcon} />
              </div>
              <div className={styles.badgeText}>
                <h4>24/7 Dedicated Support</h4>
                <p>Chat live or contact our helpline at any hour of the day</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className={styles.footerMain}>
        <div className="container">
          <div className={styles.linksGrid}>
            {/* Brand column */}
            <div className={styles.brandCol}>
              <Link href="/" className={styles.logo}>
                <span className={styles.logoAccent}>Aura</span>Mart
              </Link>
              <p className={styles.brandDesc}>
                India's premier multi-platform shopping hub. Sourcing top-tier electronics, fashion, beauty, home decor, and delivering instant daily groceries under 10 minutes via Flado Quick Commerce.
              </p>
              <div className={styles.appStoreLinks}>
                <a href="#" className={styles.appBadge} aria-label="Get it on Google Play">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" />
                </a>
                <a href="#" className={styles.appBadge} aria-label="Download on the App Store">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className={styles.linksCol}>
              <h4>Shop Categories</h4>
              <ul>
                <li><Link href="/categories/electronics">Electronics & Smart Gadgets</Link></li>
                <li><Link href="/categories/fashion">Fashion & Designer Lifestyle</Link></li>
                <li><Link href="/categories/beauty">Beauty & Premium Skincare</Link></li>
                <li><Link href="/categories/home">Modern Home & Kitchen</Link></li>
                <li><Link href="/flado">Flado 10-Min Groceries</Link></li>
              </ul>
            </div>

            {/* Customer Care */}
            <div className={styles.linksCol}>
              <h4>Customer Support</h4>
              <ul>
                <li><Link href="/profile">My Account Dashboard</Link></li>
                <li><Link href="/cart">View Basket / Cart</Link></li>
                <li><Link href="/profile">Track My Order Status</Link></li>
                <li><Link href="#">Terms of Service</Link></li>
                <li><Link href="#">Privacy & Cookie Policy</Link></li>
              </ul>
            </div>

            {/* Newsletter Subscription & Info */}
            <div className={styles.linksCol}>
              <h4>Stay Connected</h4>
              <p className={styles.newsletterDesc}>Subscribe to receive early sales announcements, coupons, and premium updates.</p>
              {subscribed ? (
                <div className={styles.subscriptionSuccess}>
                  <span>✓ Thank you for subscribing!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.newsletterInput}
                  />
                  <button type="submit" className={styles.newsletterButton} aria-label="Subscribe">
                    <FiSend />
                  </button>
                </form>
              )}

              <div className={styles.contactDetails}>
                <p><strong>Support Helpline:</strong> 1800-AURA-MART</p>
                <p><strong>Email Queries:</strong> support@auramart.in</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment methods and copyright */}
      <div className={styles.footerBottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p>&copy; {new Date().getFullYear()} AuraMart Private Limited. All rights reserved. Sourced & packaged with premium care.</p>
            <div className={styles.paymentMethods}>
              <span className={styles.paymentBadge}>UPI</span>
              <span className={styles.paymentBadge}>VISA</span>
              <span className={styles.paymentBadge}>MASTERCARD</span>
              <span className={styles.paymentBadge}>RUPAY</span>
              <span className={styles.paymentBadge}>NETBANKING</span>
            </div>
            <div className={styles.socials}>
              <Link href="#">Instagram</Link>
              <Link href="#">Twitter</Link>
              <Link href="#">Facebook</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
