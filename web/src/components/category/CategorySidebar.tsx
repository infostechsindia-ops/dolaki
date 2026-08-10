'use client';

import React from 'react';
import CategoryTree, { CategoryNode } from './CategoryTree';
import SearchInput from '@/components/ui/SearchInput';
import styles from './CategorySidebar.module.css';

export interface CategorySidebarProps {
  title?: string;
  searchPlaceholder?: string;
  categories: CategoryNode[];
  expandedIds?: string[];
  activeId?: string;
  onToggleExpand?: (id: string) => void;
  onSelectCategory?: (category: CategoryNode) => void;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function CategorySidebar({
  title = 'Categories',
  searchPlaceholder = 'Filter categories...',
  categories,
  expandedIds = [],
  activeId,
  onToggleExpand,
  onSelectCategory,
  searchValue = '',
  onSearchChange,
  isCollapsed = false,
  onToggleCollapse,
}: CategorySidebarProps) {
  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}
      aria-label="Category navigation sidebar"
      data-testid="category-sidebar"
    >
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {onToggleCollapse && (
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={onToggleCollapse}
            aria-expanded={!isCollapsed}
            aria-controls="category-sidebar-content"
          >
            {isCollapsed ? 'Show' : 'Hide'}
          </button>
        )}
      </div>

      <div
        id="category-sidebar-content"
        className={styles.content}
        hidden={isCollapsed}
      >
        {onSearchChange && (
          <div className={styles.searchWrapper}>
            <SearchInput
              value={searchValue}
              placeholder={searchPlaceholder}
              onChange={(e) => onSearchChange(e.target.value)}
              onClear={() => onSearchChange('')}
            />
          </div>
        )}

        <div className={styles.treeWrapper}>
          <CategoryTree
            categories={categories}
            expandedIds={expandedIds}
            activeId={activeId}
            onToggleExpand={onToggleExpand}
            onSelectCategory={onSelectCategory}
          />
        </div>
      </div>
    </aside>
  );
}
