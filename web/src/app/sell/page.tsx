import React from 'react';
import { Metadata } from 'next';
import { getCmsPage } from '@/lib/content-data';
import { CmsPageRenderer } from '@/components/cms/CmsPageRenderer';

export const metadata: Metadata = {
  title: 'Sell on AuraMart Marketplace',
  description: 'Reach millions of active shoppers by becoming an authorized seller on AuraMart.',
};

export default function SellPage() {
  const page = getCmsPage('become-a-seller');
  return <CmsPageRenderer page={page} />;
}
