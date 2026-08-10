import React from 'react';
import { Metadata } from 'next';
import { getCmsPage } from '@/lib/content-data';
import { CmsPageRenderer } from '@/components/cms/CmsPageRenderer';

export const metadata: Metadata = {
  title: 'Terms of Service — AuraMart',
  description: 'Official AuraMart Terms of Service and User Agreement.',
};

export default function TermsPage() {
  const page = getCmsPage('terms-of-service');
  return <CmsPageRenderer page={page} />;
}
