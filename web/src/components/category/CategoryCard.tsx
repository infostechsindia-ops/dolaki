'use client';

import React from 'react';
import Link from 'next/link';
import styles from './CategoryCard.module.css';

export interface CategoryCardData {
  id: string;
  name: string;
  slug: string;
  image?: string;
  icon?: string;
  subtitle?: string;
  productCount?: number;
  badgeText?: string;
}

export interface CategoryCardProps {
  category: CategoryCardData;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
  onClick?: () => void;
}

export default function CategoryCard({
  category,
  surface = 'MARKETPLACE',
  onClick,
}: CategoryCardProps) {
  const isFlado = surface === 'QUICK_COMMERCE';

  const content = (
    <div className={styles.cardContent}>
      {category.badgeText && (
        <span className={`${styles.badge} ${isFlado ? styles.fladoBadge : ''}`}>
          {category.badgeText}
        </span>
      )}

      <div className={styles.imageContainer}>
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={styles.fallbackIcon}>{category.icon || '📁'}</div>
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.titleRow}>
          {category.icon && category.image && (
            <span className={styles.icon}>{category.icon}</span>
          )}
          <h3 className={styles.title}>{category.name}</h3>
        </div>

        {category.subtitle && (
          <p className={styles.subtitle}>{category.subtitle}</p>
        )}

        {category.productCount != null && (
          <span className={styles.count}>
            {category.productCount.toLocaleString()} {category.productCount === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <article
      className={`${styles.card} ${isFlado ? styles.fladoCard : ''}`}
      aria-label={category.name}
      data-testid="category-card"
    >
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className={styles.cardBtn}
          aria-label={`Explore ${category.name}`}
        >
          {content}
        </button>
      ) : (
        <Link href={`/categories/${category.slug}`} className={styles.cardLink}>
          {content}
        </Link>
      )}
    </article>
  );
}
