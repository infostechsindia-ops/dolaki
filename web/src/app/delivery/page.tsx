import React from 'react';
import { Metadata } from 'next';
import { getCmsPage } from '@/lib/content-data';
import { CmsPageRenderer } from '@/components/cms/CmsPageRenderer';

export const metadata: Metadata = {
  title: 'Delivery Information & SLAs — AuraMart',
  description: 'Learn about Flado 10-minute delivery SLAs and standard marketplace shipping.',
};

export default function DeliveryPage() {
  const page = getCmsPage('shipping-policy');
  return <CmsPageRenderer page={page} />;
}
