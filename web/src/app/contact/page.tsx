import React from 'react';
import { Metadata } from 'next';
import { getCmsPage } from '@/lib/content-data';
import { CmsPageRenderer } from '@/components/cms/CmsPageRenderer';

export const metadata: Metadata = {
  title: 'Contact Us — AuraMart Customer Support',
  description: 'Reach AuraMart customer support via live chat, call, or email.',
};

export default function ContactPage() {
  const page = getCmsPage('help-home');
  return <CmsPageRenderer page={page} />;
}
