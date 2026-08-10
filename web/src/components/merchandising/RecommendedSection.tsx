'use client';

import React from 'react';
import BestSellerSection from './BestSellerSection';

export interface RecommendedSectionProps {
  products: any[];
  title?: string;
  subtitle?: string;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function RecommendedSection({
  products,
  title = 'Recommended for You',
  subtitle = 'Curated items matching your interest',
  surface = 'MARKETPLACE'
}: RecommendedSectionProps) {
  return (
    <BestSellerSection
      products={products}
      title={title}
      subtitle={subtitle}
      surface={surface}
    />
  );
}
