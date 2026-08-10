import React from 'react';
import { Metadata } from 'next';
import { getCmsPage } from '@/lib/content-data';
import { CmsPageRenderer } from '@/components/cms/CmsPageRenderer';

export const metadata: Metadata = {
  title: 'About Us — AuraMart Commerce OS',
  description: 'Reimagining the future of unified commerce & ultra-fast fulfillment.',
};

export default function AboutUsPage() {
  const page = getCmsPage('about');
  return <CmsPageRenderer page={page} />;
}
