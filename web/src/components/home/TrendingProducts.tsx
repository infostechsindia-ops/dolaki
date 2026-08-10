'use client';

import React from 'react';
import FeaturedProducts from './FeaturedProducts';

export interface TrendingProductsProps {
  products: any[];
  title: string;
  subtitle?: string;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function TrendingProducts({
  products,
  title,
  subtitle,
  surface = 'MARKETPLACE'
}: TrendingProductsProps) {
  return (
    <FeaturedProducts
      products={products}
      title={title}
      subtitle={subtitle}
      surface={surface}
    />
  );
}
