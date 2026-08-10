import React from 'react';
import { Metadata } from 'next';
import { getCmsPage } from '@/lib/content-data';
import { CmsPageRenderer } from '@/components/cms/CmsPageRenderer';

export const metadata: Metadata = {
  title: 'Refund Policy & Credit SLAs — AuraMart',
  description: 'Understand instant AuraPay wallet credits and bank transfer refund SLAs.',
};

export default function RefundPage() {
  const page = getCmsPage('returns-refunds');
  return <CmsPageRenderer page={page} />;
}
