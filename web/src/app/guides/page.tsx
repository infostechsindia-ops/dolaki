import React from 'react';
import { Metadata } from 'next';
import { getCmsPage } from '@/lib/content-data';
import { CmsPageRenderer } from '@/components/cms/CmsPageRenderer';

export const metadata: Metadata = {
  title: 'Buying & Shopping Guides — AuraMart',
  description: 'Expert buying guides for electronics, fashion, beauty, home, and groceries.',
};

export default function GuidesHomePage() {
  const page = getCmsPage('blog-home');
  return <CmsPageRenderer page={page} />;
}
