'use client';

import React from 'react';
import Link from 'next/link';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import styles from './CategoryBreadcrumbs.module.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface CategoryBreadcrumbsProps {
  items: BreadcrumbItem[];
  homeLabel?: string;
  homeHref?: string;
}

export default function CategoryBreadcrumbs({
  items,
  homeLabel = 'Home',
  homeHref = '/',
}: CategoryBreadcrumbsProps) {
  const allItems: BreadcrumbItem[] = [
    { label: homeLabel, href: homeHref },
    ...items,
  ];

  return (
    <nav aria-label="Breadcrumb" className={styles.nav} data-testid="category-breadcrumbs">
      <ol className={styles.list}>
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isHome = index === 0;

          return (
            <li key={index} className={styles.item}>
              {index > 0 && (
                <FiChevronRight className={styles.separator} aria-hidden="true" />
              )}
              {isLast || !item.href ? (
                <span
                  className={`${styles.current} ${isLast ? styles.active : ''}`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {isHome && <FiHome className={styles.homeIcon} aria-hidden="true" />}
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className={styles.link}>
                  {isHome && <FiHome className={styles.homeIcon} aria-hidden="true" />}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
