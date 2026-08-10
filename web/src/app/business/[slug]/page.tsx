import React from 'react';
import { Metadata } from 'next';
import { getCmsPage } from '@/lib/content-data';
import { CmsPageRenderer } from '@/components/cms/CmsPageRenderer';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = getCmsPage(params.slug);
  return {
    title: page.seo.metaTitle,
    description: page.seo.metaDescription,
    keywords: page.seo.keywords,
    alternates: { canonical: page.seo.canonicalUrl },
  };
}

export default function BusinessPage({ params }: PageProps) {
  const page = getCmsPage(params.slug);
  return <CmsPageRenderer page={page} />;
}
