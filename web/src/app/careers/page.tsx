import React from 'react';
import { Metadata } from 'next';
import { getCmsPage } from '@/lib/content-data';
import { CmsPageRenderer } from '@/components/cms/CmsPageRenderer';

export const metadata: Metadata = {
  title: 'Careers — AuraMart',
  description: 'Explore engineering, product, and logistics careers at AuraMart.',
};

export default function CareersPage() {
  const page = getCmsPage('careers');
  return <CmsPageRenderer page={page} />;
}
