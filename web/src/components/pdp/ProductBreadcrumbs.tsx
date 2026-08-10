'use client';

import React from 'react';
import CategoryBreadcrumbs, { BreadcrumbItem } from '@/components/category/CategoryBreadcrumbs';

export interface ProductBreadcrumbsProps {
  items: BreadcrumbItem[];
  homeLabel?: string;
  homeHref?: string;
}

export default function ProductBreadcrumbs({ items, homeLabel, homeHref }: ProductBreadcrumbsProps) {
  return (
    <CategoryBreadcrumbs
      items={items}
      homeLabel={homeLabel}
      homeHref={homeHref}
    />
  );
}
