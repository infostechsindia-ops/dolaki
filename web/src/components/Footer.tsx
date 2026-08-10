'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FiShield,
  FiSmile,
  FiMail,
  FiSend,
  FiCheckCircle,
  FiUsers,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiLinkedin,
  FiYoutube,
  FiPhone,
  FiClock
} from 'react-icons/fi';
import { Container, Grid, Stack, Inline } from '@/components/layout/LayoutPrimitives';
import IconButton from '@/components/ui/IconButton';
import styles from './Footer.module.css';

export interface FooterProps {
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function Footer({ surface = 'MARKETPLACE' }: FooterProps) {
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
    <footer className={`${styles.footer} ${isFlado ? styles.quickCommerce : ''}`} aria-label="AuraMart Site Footer">
      
      {/* STEP 4 — Trust Section */}
      <div className={styles.trustSection}>
        <Container size="2xl">
          <Grid columns={4} gap="6" className={styles.trustGrid}>
            <div className={styles.trustItem}>
              <div className={styles.trustIconWrapper}>
                <FiShield className={styles.trustIcon} />
              </div>
              <div className={styles.trustText}>
                <h4>Secure Payments</h4>
                <p>Fully encrypted transactions via UPI, Credit/Debit cards & Netbanking</p>
              </div>
            </div>

            <div className={styles.trustItem}>
              <div className={styles.trustIconWrapper}>
                <FiCheckCircle className={styles.trustIcon} />
              </div>
              <div className={styles.trustText}>
                <h4>Buyer Protection</h4>
                <p>Hassle-free direct refunds and 7-day easy return query policies</p>
              </div>
            </div>

            <div className={styles.trustItem}>
              <div className={styles.trustIconWrapper}>
                <FiUsers className={styles.trustIcon} />
              </div>
              <div className={styles.trustText}>
                <h4>Trusted Sellers</h4>
                <p>100% verified merchant channels and premium product standards</p>
              </div>
            </div>

            <div className={styles.trustItem}>
              <div className={styles.trustIconWrapper}>
                <FiSmile className={styles.trustIcon} />
              </div>
              <div className={styles.trustText}>
                <h4>Customer Support</h4>
                <p>Helpful assistance available at any hour for shopping needs</p>
              </div>
            </div>
          </Grid>
        </Container>
      </div>

      {/* STEP 3 — Footer Links Sections */}
      <div className={styles.footerMain}>
        <Container size="2xl">
          <div className={styles.footerGrid}>
            
            {/* Column 1: Company */}
            <div className={styles.linksCol}>
              <h4>Company</h4>
              <ul className={styles.linkList}>
                <li><Link href="/company/about">About Us</Link></li>
                <li><Link href="/company/our-story">Our Story</Link></li>
                <li><Link href="/company/careers">Careers</Link></li>
                <li><Link href="/blog">Blog & Guides</Link></li>
                <li><Link href="/company/sustainability">Sustainability</Link></li>
              </ul>
            </div>

            {/* Column 2: Customer Support */}
            <div className={styles.linksCol}>
              <h4>Customer Support</h4>
              <ul className={styles.linkList}>
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/help/contact">Contact Us</Link></li>
                <li><Link href="/policies/returns-refunds">Returns & Refunds</Link></li>
                <li><Link href="/policies/shipping-policy">Shipping Policy</Link></li>
              </ul>
            </div>

            {/* Column 3: Marketplace */}
            <div className={styles.linksCol}>
              <h4>Marketplace</h4>
              <ul className={styles.linkList}>
                <li><Link href="/business/become-a-seller">Become a Seller</Link></li>
                <li><Link href="/vendor/login">Seller Dashboard</Link></li>
                <li><Link href="/discover/best-sellers">Best Sellers</Link></li>
              </ul>
            </div>

            {/* Column 4: Flado */}
            <div className={styles.linksCol}>
              <h4>Flado</h4>
              <ul className={styles.linkList}>
                <li><Link href="/merchant/apply">Become Merchant</Link></li>
                <li><Link href="/merchant/login">Merchant Dashboard</Link></li>
                <li><Link href="/policies/shipping-policy">Delivery SLA</Link></li>
              </ul>
            </div>

            {/* Column 5: Legal */}
            <div className={styles.linksCol}>
              <h4>Legal</h4>
              <ul className={styles.linkList}>
                <li><Link href="/legal/privacy-policy">Privacy Policy</Link></li>
                <li><Link href="/legal/terms-of-service">Terms of Service</Link></li>
                <li><Link href="/legal/cookie-policy">Cookie Policy</Link></li>
                <li><Link href="/policies/returns-refunds">Refund Policy</Link></li>
              </ul>
            </div>

            {/* Column 6: Contact Info */}
            <div className={styles.linksCol}>
              <h4>Contact Details</h4>
              <ul className={styles.contactList}>
                <li>
                  <FiMail className={styles.contactIcon} />
                  <span>support@auramart.in</span>
                </li>
                <li>
                  <FiPhone className={styles.contactIcon} />
                  <span>1800-AURA-MART</span>
                </li>
                <li>
                  <FiClock className={styles.contactIcon} />
                  <span>24/7 Dedicated Support</span>
                </li>
              </ul>

              {/* Newsletter subscribe form */}
              <div className={styles.newsletterSection}>
                <span className={styles.newsletterTitle}>Newsletter</span>
                {subscribed ? (
                  <span className={styles.subSuccess}>✓ Subscribed successfully!</span>
                ) : (
                  <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
                    <input
                      type="email"
                      required
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={styles.newsletterInput}
                      aria-label="Subscribe to newsletter"
                    />
                    <button type="submit" className={styles.newsletterBtn} aria-label="Subscribe submit">
                      <FiSend />
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </Container>
      </div>

      {/* Bottom bar & socials */}
      <div className={styles.footerBottom}>
        <Container size="2xl">
          <div className={styles.bottomInner}>
            <p className={styles.copyright}>
              &copy; {new Date().getFullYear()} AuraMart Private Limited. All rights reserved. Sourced & packaged with premium care.
            </p>

            {/* STEP 5 — Social Icons */}
            <div className={styles.socials} aria-label="Social Media Connections">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <IconButton
                  icon={<FiFacebook />}
                  aria-label="Facebook Link"
                  variant={isFlado ? "flado" : "primary"}
                  size="sm"
                />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <IconButton
                  icon={<FiInstagram />}
                  aria-label="Instagram Link"
                  variant={isFlado ? "flado" : "primary"}
                  size="sm"
                />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <IconButton
                  icon={<FiTwitter />}
                  aria-label="X Link"
                  variant={isFlado ? "flado" : "primary"}
                  size="sm"
                />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <IconButton
                  icon={<FiLinkedin />}
                  aria-label="LinkedIn Link"
                  variant={isFlado ? "flado" : "primary"}
                  size="sm"
                />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <IconButton
                  icon={<FiYoutube />}
                  aria-label="YouTube Link"
                  variant={isFlado ? "flado" : "primary"}
                  size="sm"
                />
              </a>
            </div>
          </div>
        </Container>
      </div>

    </footer>
  );
}
