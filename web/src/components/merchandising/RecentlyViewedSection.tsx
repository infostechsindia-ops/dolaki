'use client';

import React from 'react';
import BestSellerSection from './BestSellerSection';

export interface RecentlyViewedSectionProps {
  products: any[];
  title?: string;
  subtitle?: string;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function RecentlyViewedSection({
  products,
  title = 'Recently Viewed Items',
  subtitle = 'Products you looked at recently on this device',
  surface = 'MARKETPLACE'
}: RecentlyViewedSectionProps) {
  return (
    <BestSellerSection
      products={products}
      title={title}
      subtitle={subtitle}
      surface={surface}
    />
  );
}
