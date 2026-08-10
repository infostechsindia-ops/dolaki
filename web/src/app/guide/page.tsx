import React from 'react';
import { Metadata } from 'next';
import { getCmsPage } from '@/lib/content-data';
import { CmsPageRenderer } from '@/components/cms/CmsPageRenderer';

export const metadata: Metadata = {
  title: 'Marketplace Guide & Shopper Advice — AuraMart',
  description: 'Learn how to shop, place orders, and save on AuraMart Commerce OS.',
};

export default function MarketplaceGuidePage() {
  const page = getCmsPage('blog-home');
  return <CmsPageRenderer page={page} />;
}
