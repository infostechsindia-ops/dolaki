'use client';

import React from 'react';
import Link from 'next/link';
import { FiChevronRight, FiGrid } from 'react-icons/fi';
import styles from './page.module.css';

interface CategoryItem {
  slug: string;
  name: string;
  count: number;
  description: string;
  gradient: string;
  emoji: string;
}

const categoriesList: CategoryItem[] = [
  {
    slug: 'electronics',
    name: 'Electronics & Gadgets',
    count: 6,
    description: 'Flagship smartphones, high performance laptops, ANC headphones and active smartwatches.',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)',
    emoji: '⚡'
  },
  {
    slug: 'fashion',
    name: 'Fashion & Apparel',
    count: 5,
    description: 'Trending seasonal clothing lines, original sneakers, and elegant ethnic wedding outfits.',
    gradient: 'linear-gradient(135deg, #E11D48 0%, #881337 100%)',
    emoji: '👕'
  },
  {
    slug: 'beauty',
    name: 'Beauty & Cosmetics',
    count: 4,
    description: 'Organic skin serums, long-wear matte lipsticks, and chemical-free wellness routines.',
    gradient: 'linear-gradient(135deg, #DB2777 0%, #701A75 100%)',
    emoji: '💄'
  },
  {
    slug: 'home',
    name: 'Home & Furnishings',
    count: 4,
    description: 'Democratic design shelves, comfortable birch-wood armchairs and smart room dividers.',
    gradient: 'linear-gradient(135deg, #059669 0%, #064E3B 100%)',
    emoji: '🛋️'
  },
  {
    slug: 'groceries',
    name: 'Groceries & Gourmet',
    count: 8,
    description: 'Fresh organic farm vegetables, milk, bakery breads and daily snacks delivered instantly.',
    gradient: 'linear-gradient(135deg, #10B981 0%, #065F46 100%)',
    emoji: '🍎'
  },
  {
    slug: 'sports',
    name: 'Sports & Athletics',
    count: 3,
    description: 'Carbon fiber badminton rackets, hand-stitched soccer balls and light training shoes.',
    gradient: 'linear-gradient(135deg, #D97706 0%, #78350F 100%)',
    emoji: '⚽'
  },
  {
    slug: 'appliances',
    name: 'Appliances',
    count: 1,
    description: 'Advanced cordless stick vacuum cleaners, air purifiers and intelligent digital tools.',
    gradient: 'linear-gradient(135deg, #0284C7 0%, #0B5394 100%)',
    emoji: '🧹'
  },
  {
    slug: 'toys',
    name: 'Toys & Hobbies',
    count: 1,
    description: 'Intricate space shuttle building sets, challenging blocks and puzzles for all ages.',
    gradient: 'linear-gradient(135deg, #DC2626 0%, #7F1D1D 100%)',
    emoji: '🧱'
  }
];

export default function CategoriesIndexPage() {
  return (
    <div className={styles.categoriesIndexPage}>
      <div className={styles.heroBanner}>
        <div className="container">
          <div className={styles.heroText}>
            <span className={styles.badge}>
              <FiGrid style={{ marginRight: '6px' }} /> AuraMart Departments
            </span>
            <h1>Browse Curated Categories</h1>
            <p>Direct official brand stores, secure checkout, and instant express delivery across all locations.</p>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '50px', marginBottom: '80px' }}>
        <div className={styles.grid}>
          {categoriesList.map((cat) => (
            <Link 
              href={`/categories/${cat.slug}`} 
              key={cat.slug} 
              className={styles.card}
              style={{ '--card-grad': cat.gradient } as React.CSSProperties}
            >
              <div className={styles.cardHeader}>
                <span className={styles.emojiBg}>{cat.emoji}</span>
                <span className={styles.itemsCount}>{cat.count} Categories</span>
              </div>
              <div className={styles.cardBody}>
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>
              </div>
              <div className={styles.cardFooter}>
                <span>Explore Department</span>
                <FiChevronRight className={styles.arrowIcon} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
