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
    openGraph: {
      title: page.seo.metaTitle,
      description: page.seo.metaDescription,
      url: page.seo.canonicalUrl,
      type: 'article',
    },
  };
}

export default function CompanyPage({ params }: PageProps) {
  const page = getCmsPage(params.slug);
  return <CmsPageRenderer page={page} />;
}
