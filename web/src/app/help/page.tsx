'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiHelpCircle, FiSearch, FiMail, FiPhone, FiMessageSquare } from 'react-icons/fi';
import styles from './page.module.css';

interface FAQ {
  q: string;
  a: string;
  category: 'orders' | 'returns' | 'payments' | 'flado';
}

const mockFAQs: FAQ[] = [
  { q: 'How long does Flado delivery take?', a: 'Flado is our express quick commerce service. It delivers fresh groceries and daily household items in under 10 minutes directly from our nearest micro-warehouse darkstore.', category: 'flado' },
  { q: 'Can I change my delivery address after placing an order?', a: 'Addresses cannot be changed once an order has been dispatched. However, if the order is still in processing, you can update it via the order details card in your profile.', category: 'orders' },
  { q: 'How do I request a return or replacement?', a: 'Navigate to the Returns & Refunds page or tab, select your order ID, pick the item, select your reason, and request pickup. We schedule free pickups within 24 hours.', category: 'returns' },
  { q: 'What payment modes are supported on checkout?', a: 'We support all major Credit & Debit cards, net banking, UPI (Paytm, Google Pay, PhonePe), and Cash on Delivery (COD).', category: 'payments' },
  { q: 'How are refunds credited?', a: 'Refunds are credited instantly to your AuraPay Wallet upon successful item pickup. You can use wallet balance for future checkouts or request bank payouts.', category: 'returns' },
  { q: 'How do I earn AuraCoins?', a: 'You can earn AuraCoins by checking in daily consecutive times, completing daily/weekly AuraMissions challenges, and playing arcade games in the profile tab.', category: 'payments' }
];

export default function HelpSupportPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'orders' | 'returns' | 'payments' | 'flado'>('all');
  
  // Support ticket form
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDesc) return;
    setTicketSubmitted(true);
    setTicketSubject('');
    setTicketDesc('');
    setTimeout(() => setTicketSubmitted(false), 5000);
  };

  const filteredFAQs = mockFAQs.filter(faq => {
    const matchesSearch = faq.q.toLowerCase().includes(search.toLowerCase()) || 
                          faq.a.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.helpPage}>
      {/* Top Header Banner */}
      <div className={styles.topHeader}>
        <div className="container">
          <Link href="/" className={styles.backBtn}>
            <FiChevronLeft /> Back to Shopping
          </Link>
          <div className={styles.titleSec}>
            <h1>🆘 AuraSupport Center</h1>
            <p>Search self-help FAQs or raise a customer support ticket directly with our coordinators.</p>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '35px' }}>
        <div className={styles.workspaceGrid}>
          
          {/* Left panel: FAQs */}
          <div className={styles.faqsPanel}>
            <div className={styles.searchBoxWrapper}>
              <FiSearch className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search FAQs (e.g. returns, refund, delivery time)..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {/* Category Filter Pills */}
            <div className={styles.categoryRow}>
              {(['all', 'orders', 'returns', 'payments', 'flado'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`${styles.catPill} ${activeCategory === cat ? styles.activeCatPill : ''}`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* FAQ List */}
            <div className={styles.faqList}>
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq, i) => (
                  <div key={i} className={styles.faqItem}>
                    <h3>❓ {faq.q}</h3>
                    <p>{faq.a}</p>
                  </div>
                ))
              ) : (
                <div className={styles.noFAQs}>
                  <FiHelpCircle size={32} />
                  <p>No matching questions found. Try search keywords or contact support below.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Support Ticket Form */}
          <aside className={styles.formPanel}>
            <div className={styles.ticketCard}>
              <h3>Raise a Support Ticket</h3>
              <p>Cannot find answers? Send us a ticket and our support team will respond within 4 business hours.</p>
              
              {ticketSubmitted ? (
                <div className={styles.successBlock}>
                  <FiMessageSquare className={styles.successIcon} />
                  <h4>Ticket Submitted Successfully</h4>
                  <p>Your ticket reference code is: <strong>#AURA-TK-902</strong>. Follow updates in alert streams.</p>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className={styles.ticketForm}>
                  <div className={styles.formGroup}>
                    <label>Issue Subject</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Return delay, promo code not working" 
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Detailed Description</label>
                    <textarea 
                      required 
                      placeholder="Explain your issue in detail..." 
                      value={ticketDesc}
                      onChange={(e) => setTicketDesc(e.target.value)}
                      className={styles.formTextarea}
                    />
                  </div>
                  <button type="submit" className={styles.submitBtn}>Submit Ticket</button>
                </form>
              )}
            </div>

            {/* Hotline contacts */}
            <div className={styles.contactsCard}>
              <h3>Hotline Support Channels</h3>
              <div className={styles.contactItem}>
                <FiPhone className={styles.contactIcon} />
                <div>
                  <strong>Toll Free Helpline</strong>
                  <span>1800-AURA-HELP (1800-2872-4357)</span>
                </div>
              </div>
              <div className={styles.contactItem}>
                <FiMail className={styles.contactIcon} />
                <div>
                  <strong>Email Assistance</strong>
                  <span>support@auramart.in</span>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
