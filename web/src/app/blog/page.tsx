import React from 'react';
import { Metadata } from 'next';
import { getCmsPage } from '@/lib/content-data';
import { CmsPageRenderer } from '@/components/cms/CmsPageRenderer';

export const metadata: Metadata = {
  title: 'Blog & Journal — AuraMart',
  description: 'Tech guides, buying advice, fashion trends, and grocery tips from AuraMart editors.',
};

export default function BlogHomePage() {
  const page = getCmsPage('blog-home');
  return <CmsPageRenderer page={page} />;
}
