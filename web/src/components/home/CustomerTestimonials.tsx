'use client';

import React from 'react';
import { FiStar } from 'react-icons/fi';
import styles from './CustomerTestimonials.module.css';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Priya Sharma',
    role: 'Verified Buyer • Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    quote: 'AuraMart delivers unmatched premium quality. The AuraBook arrived in pristine packaging within 24 hours, and the customer support was amazingly responsive!',
    rating: 5
  },
  {
    id: 't-2',
    name: 'Rohan Mehta',
    role: 'Flado Quick Pass Member • Mumbai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    quote: 'Flado 15-minute quick commerce is a total gamechanger for daily groceries. Organic avocados and fresh dairy delivered hot and fast every single morning.',
    rating: 5
  },
  {
    id: 't-3',
    name: 'Ananya Verma',
    role: 'Fashion Enthusiast • Delhi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    quote: 'The luxury brand collection on AuraMart is authentic and beautifully curated. Smooth returns and instant wallet refunds make shopping effortless!',
    rating: 5
  }
];

export default function CustomerTestimonials() {
  return (
    <section className={styles.section} aria-label="Customer Reviews">
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>Loved by Millions of Shoppers</h2>
        <p className={styles.sectionSubtitle}>See what our verified buyers have to say about their AuraMart experience</p>
      </div>

      <div className={styles.grid}>
        {TESTIMONIALS.map((t) => (
          <div key={t.id} className={styles.card}>
            <div className={styles.stars}>
              {[...Array(t.rating)].map((_, i) => (
                <FiStar key={i} fill="#F59E0B" color="#F59E0B" />
              ))}
            </div>
            <p className={styles.quote}>"{t.quote}"</p>
            <div className={styles.author}>
              <img src={t.avatar} alt={t.name} className={styles.avatar} />
              <div>
                <h4 className={styles.authorName}>{t.name}</h4>
                <span className={styles.authorRole}>{t.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
