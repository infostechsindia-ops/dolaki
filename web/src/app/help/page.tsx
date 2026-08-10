import React from 'react';
import { Metadata } from 'next';
import { getCmsPage } from '@/lib/content-data';
import { CmsPageRenderer } from '@/components/cms/CmsPageRenderer';

export const metadata: Metadata = {
  title: 'Help Center & Customer Support — AuraMart',
  description: 'Get instant help with order tracking, returns, refunds, payments, and account settings.',
};

export default function HelpCenterPage() {
  const page = getCmsPage('help-home');
  return <CmsPageRenderer page={page} />;
}
