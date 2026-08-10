import React from 'react';
import { Metadata } from 'next';
import { getCmsPage } from '@/lib/content-data';
import { CmsPageRenderer } from '@/components/cms/CmsPageRenderer';

export const metadata: Metadata = {
  title: 'Privacy Policy — AuraMart',
  description: 'Official AuraMart Privacy Policy & Data Protection guidelines.',
};

export default function PrivacyPage() {
  const page = getCmsPage('privacy-policy');
  return <CmsPageRenderer page={page} />;
}
