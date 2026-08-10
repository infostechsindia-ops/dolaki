'use client';

import React from 'react';
import Link from 'next/link';
import { Section, Grid } from '@/components/layout/LayoutPrimitives';
import styles from './ShopByCategorySection.module.css';

export interface CategoryCardItem {
  name: string;
  slug: string;
  icon: string;
  color?: string;
  count?: string;
}

export interface ShopByCategorySectionProps {
  categories: CategoryCardItem[];
  title?: string;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function ShopByCategorySection({
  categories,
  title = 'Explore Category Deals',
  surface = 'MARKETPLACE'
}: ShopByCategorySectionProps) {
  if (!categories || categories.length === 0) return null;

  const isFlado = surface === 'QUICK_COMMERCE';

  return (
    <Section className={`${styles.section} ${isFlado ? styles.quickCommerce : ''}`} aria-label={title}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </div>
      <Grid className={styles.categoryGrid}>
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            href={cat.slug === 'groceries' || isFlado ? `/flado/categories/${cat.slug}` : `/categories/${cat.slug}`}
            className={styles.card}
            style={{ backgroundColor: cat.color || '#F3F4F6' }}
          >
            <div className={styles.iconBox}>
              <span className={styles.emoji}>{cat.icon}</span>
            </div>
            <div className={styles.meta}>
              <h3 className={styles.catName}>{cat.name}</h3>
              {cat.count && <span className={styles.countText}>{cat.count}</span>}
            </div>
          </Link>
        ))}
      </Grid>
    </Section>
  );
}
