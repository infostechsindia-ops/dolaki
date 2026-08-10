'use client';

import React from 'react';
import Link from 'next/link';
import styles from './CategoriesSection.module.css';

export interface CategoryItem {
  name: string;
  slug: string;
  icon: string;
  color?: string;
}

export interface CategoriesSectionProps {
  categories: CategoryItem[];
  title?: string;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function CategoriesSection({
  categories,
  title = 'Shop by Category',
  surface = 'MARKETPLACE'
}: CategoriesSectionProps) {
  if (!categories || categories.length === 0) return null;

  const isFlado = surface === 'QUICK_COMMERCE';

  return (
    <section className={`${styles.section} ${isFlado ? styles.quickCommerce : ''}`} aria-label={title}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>{title}</h2>
      </div>
      <div className={styles.grid}>
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            href={cat.slug === 'groceries' || isFlado ? `/flado/categories/${cat.slug}` : `/categories/${cat.slug}`}
            className={styles.card}
          >
            <div className={styles.iconBox} style={{ backgroundColor: cat.color || 'var(--color-disabled-bg)' }}>
              <span className={styles.emoji}>{cat.icon}</span>
            </div>
            <div className={styles.meta}>
              <h3 className={styles.catName}>{cat.name}</h3>
              <span className={styles.offerText}>View Offers</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
