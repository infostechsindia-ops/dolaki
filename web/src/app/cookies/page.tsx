import React from 'react';
import { Metadata } from 'next';
import { getCmsPage } from '@/lib/content-data';
import { CmsPageRenderer } from '@/components/cms/CmsPageRenderer';

export const metadata: Metadata = {
  title: 'Cookie Policy — AuraMart',
  description: 'Official AuraMart Cookie Policy and tracking preference disclosures.',
};

export default function CookiesPage() {
  const page = getCmsPage('privacy-policy');
  return <CmsPageRenderer page={page} />;
}
