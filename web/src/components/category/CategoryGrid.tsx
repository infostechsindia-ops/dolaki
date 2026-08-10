'use client';

import React from 'react';
import CategoryCard, { CategoryCardData } from './CategoryCard';
import styles from './CategoryGrid.module.css';

export interface CategoryGridProps {
  categories: CategoryCardData[];
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
  onCategoryClick?: (category: CategoryCardData) => void;
}

export default function CategoryGrid({
  categories,
  surface = 'MARKETPLACE',
  onCategoryClick,
}: CategoryGridProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div
      className={styles.grid}
      data-testid="category-grid"
      aria-label={`${categories.length} categories`}
    >
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          surface={surface}
          onClick={onCategoryClick ? () => onCategoryClick(category) : undefined}
        />
      ))}
    </div>
  );
}
