'use client';

import React from 'react';
import Link from 'next/link';
import { CmsPageData, ContentBlock } from '@/lib/i18n';

interface CmsPageRendererProps {
  page: CmsPageData;
}

export function CmsPageRenderer({ page }: CmsPageRendererProps) {
  return (
    <article className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header Banner */}
      <header className="bg-gradient-to-r from-violet-900 via-indigo-900 to-purple-950 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-violet-200">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li>/</li>
              <li className="capitalize">{page.category}</li>
              <li>/</li>
              <li className="font-semibold text-white">{page.title}</li>
            </ol>
          </nav>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading">
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="mt-4 text-lg text-violet-100 max-w-3xl leading-relaxed">
              {page.subtitle}
            </p>
          )}
          <div className="mt-6 flex items-center gap-4 text-xs text-violet-300">
            <span>Last updated: {page.lastUpdated}</span>
            <span>•</span>
            <span>Server-Authoritative SDUI Content</span>
          </div>
        </div>
      </header>

      {/* Main Blocks Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
        {page.blocks.map((block: ContentBlock, idx: number) => (
          <RenderBlock key={idx} block={block} />
        ))}

        {/* Dynamic Articles Grid */}
        {page.articles && page.articles.length > 0 && (
          <section className="mt-12 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold font-heading mb-6">Featured Articles & Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {page.articles.map((art, aIdx) => (
                <div key={aIdx} className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-violet-400 transition-all">
                  <span className="text-xs font-semibold text-violet-600 uppercase tracking-wider">{art.author} • {art.readTime}</span>
                  <h3 className="text-xl font-bold mt-2 text-slate-900">{art.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{art.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                    <span>{art.date}</span>
                    <span className="font-semibold text-violet-700 hover:underline">Read Article →</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* JSON-LD Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: page.title,
            description: page.seo.metaDescription,
            url: page.seo.canonicalUrl,
          }),
        }}
      />
    </article>
  );
}

function RenderBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'hero':
      return (
        <section className="bg-white rounded-2xl p-8 md:p-12 border border-slate-200 shadow-sm">
          {block.data.badge && (
            <span className="inline-block px-3 py-1 bg-violet-100 text-violet-800 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
              {block.data.badge}
            </span>
          )}
          <h2 className="text-3xl font-extrabold text-slate-900 font-heading leading-tight">
            {block.data.heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
            {block.data.description}
          </p>
          {block.data.ctaText && (
            <div className="mt-6">
              <Link
                href={block.data.ctaLink || '#'}
                className="inline-flex items-center px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
              >
                {block.data.ctaText} →
              </Link>
            </div>
          )}
        </section>
      );

    case 'stats':
      return (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {block.data.items?.map((item: any, i: number) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-violet-600 font-heading">{item.value}</div>
              <div className="mt-2 text-sm font-medium text-slate-600">{item.label}</div>
            </div>
          ))}
        </section>
      );

    case 'features':
    case 'cards':
      return (
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          {block.data.heading && (
            <h2 className="text-2xl font-bold font-heading text-slate-900 mb-6">{block.data.heading}</h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {block.data.items?.map((item: any, idx: number) => (
              <div key={idx} className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.desc || item.text}</p>
              </div>
            ))}
          </div>
        </section>
      );

    case 'timeline':
      return (
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold font-heading text-slate-900 mb-8">Historical Milestones</h2>
          <div className="space-y-6 relative border-l-2 border-violet-200 ml-4 pl-6">
            {block.data.items?.map((item: any, idx: number) => (
              <div key={idx} className="relative">
                <span className="absolute -left-[31px] top-1 w-4 h-4 bg-violet-600 rounded-full border-4 border-white"></span>
                <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">{item.year}</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{item.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      );

    case 'faq':
      return (
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold font-heading text-slate-900 mb-6">{block.data.heading || 'Frequently Asked Questions'}</h2>
          <div className="space-y-4">
            {block.data.items?.map((item: any, idx: number) => (
              <details key={idx} className="group p-4 rounded-xl bg-slate-50 border border-slate-200 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between font-semibold text-slate-900 cursor-pointer">
                  <span>{item.question}</span>
                  <span className="transition group-open:rotate-180 text-violet-600">▼</span>
                </summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-3">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      );

    case 'rich_text':
    default:
      return (
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm prose max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
          {block.data.content}
        </section>
      );
  }
}
