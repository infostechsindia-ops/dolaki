# AuraMart Enterprise SEO Architecture (CONTENT-009)

## 1. Overview

The Enterprise SEO Module provides automated XML sitemap generation (`/sitemap.xml`), robots disallow rules (`/robots.txt`), Open Graph tags, Twitter Cards, and JSON-LD structured data schemas across all Customer Web routes.

---

## 2. Structured Data Schemas (JSON-LD)

- **Organization Schema:** Embedded in `RootLayout` (`web/src/app/layout.tsx`).
- **Product Schema:** Embedded in PDP (`web/src/app/products/[id]/page.tsx`).
- **Breadcrumb & Category Schema:** Embedded in PLP (`web/src/app/categories/[slug]/page.tsx`).
- **FAQ Schema:** Embedded in Support & Account hub pages.

---

## 3. Dynamic Sitemap Engine (`web/src/app/sitemap.ts`)

Automatically indexes static pages, dynamic categories, brand pages, seller storefronts, and products.
