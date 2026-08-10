import React from 'react';
import { Metadata } from 'next';
import { getCmsPage } from '@/lib/content-data';
import { CmsPageRenderer } from '@/components/cms/CmsPageRenderer';

export const metadata: Metadata = {
  title: 'Press Center & Newsroom — AuraMart',
  description: 'Official press releases, media kits, and brand announcements from AuraMart.',
};

export default function PressPage() {
  const page = getCmsPage('about');
  return <CmsPageRenderer page={page} />;
}
