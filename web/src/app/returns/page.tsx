import React from 'react';
import { Metadata } from 'next';
import { getCmsPage } from '@/lib/content-data';
import { CmsPageRenderer } from '@/components/cms/CmsPageRenderer';

export const metadata: Metadata = {
  title: 'Returns & Refund Policy — AuraMart',
  description: 'Learn about return eligibility, pickup scheduling, and refund SLAs.',
};

export default function ReturnsPage() {
  const page = getCmsPage('returns-refunds');
  return <CmsPageRenderer page={page} />;
}
