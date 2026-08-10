# AuraMart Commerce OS — Content Model Specification

## Overview
Specifies the TypeScript interface structures for dynamic CMS pages, content blocks, articles, and SEO metadata.

```typescript
export interface CmsPageData {
  slug: string;
  title: string;
  subtitle?: string;
  category: 'company' | 'help' | 'policy' | 'legal' | 'business' | 'community' | 'trust' | 'discover';
  lastUpdated: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl: string;
    ogImage?: string;
  };
  blocks: ContentBlock[];
  faqs?: Array<{ question: string; answer: string; category?: string }>;
  articles?: Array<{ slug: string; title: string; excerpt: string; readTime: string; author: string; date: string }>;
}
```
