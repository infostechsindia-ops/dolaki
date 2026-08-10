'use client';

import React from 'react';
import CategoryBreadcrumbs, { BreadcrumbItem } from './CategoryBreadcrumbs';
import CategorySidebar from './CategorySidebar';
import { CategoryNode } from './CategoryTree';
import CategoryGrid from './CategoryGrid';
import { CategoryCardData } from './CategoryCard';
import CategoryEmptyState from './CategoryEmptyState';
import styles from './CategoryNavigationLayout.module.css';

export interface CategoryNavigationLayoutProps {
  /* Breadcrumbs */
  breadcrumbItems: BreadcrumbItem[];

  /* Sidebar tree options */
  treeCategories: CategoryNode[];
  expandedIds?: string[];
  activeId?: string;
  onToggleExpand?: (id: string) => void;
  onSelectTreeCategory?: (category: CategoryNode) => void;
  sidebarTitle?: string;
  sidebarSearchPlaceholder?: string;
  sidebarSearchValue?: string;
  onSidebarSearchChange?: (val: string) => void;

  /* Category grid items */
  gridCategories: CategoryCardData[];
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
  onCategoryClick?: (category: CategoryCardData) => void;

  /* Empty state */
  emptyTitle?: string;
  emptyDescription?: string;
  onReset?: () => void;
}

export default function CategoryNavigationLayout({
  breadcrumbItems,
  treeCategories,
  expandedIds = [],
  activeId,
  onToggleExpand,
  onSelectTreeCategory,
  sidebarTitle,
  sidebarSearchPlaceholder,
  sidebarSearchValue,
  onSidebarSearchChange,
  gridCategories,
  surface = 'MARKETPLACE',
  onCategoryClick,
  emptyTitle,
  emptyDescription,
  onReset,
}: CategoryNavigationLayoutProps) {
  const isFlado = surface === 'QUICK_COMMERCE';

  return (
    <div
      className={`${styles.layout} ${isFlado ? styles.flado : ''}`}
      data-testid="category-navigation-layout"
    >
      {/* Breadcrumb Navigation */}
      <div className={styles.breadcrumbRow}>
        <CategoryBreadcrumbs items={breadcrumbItems} />
      </div>

      {/* Main Content Area */}
      <div className={styles.body}>
        {/* Sidebar */}
        <CategorySidebar
          title={sidebarTitle}
          searchPlaceholder={sidebarSearchPlaceholder}
          categories={treeCategories}
          expandedIds={expandedIds}
          activeId={activeId}
          onToggleExpand={onToggleExpand}
          onSelectCategory={onSelectTreeCategory}
          searchValue={sidebarSearchValue}
          onSearchChange={onSidebarSearchChange}
        />

        {/* Category Grid or Empty State */}
        <div className={styles.gridArea}>
          {gridCategories.length > 0 ? (
            <CategoryGrid
              categories={gridCategories}
              surface={surface}
              onCategoryClick={onCategoryClick}
            />
          ) : (
            <CategoryEmptyState
              title={emptyTitle}
              description={emptyDescription}
              action={onReset ? { label: 'Reset Selection', onClick: onReset } : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}
