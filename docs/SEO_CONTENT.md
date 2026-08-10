# AuraMart Commerce OS — SEO Content & Metadata Architecture Guide

## Overview
AuraMart enforces automated search engine optimization across all dynamic content routes.

---

## 1. Automated Metadata Features
- **Dynamic Meta Tags**: Title, Meta Description, Keywords, Canonical URLs via Next.js `generateMetadata`.
- **OpenGraph & Social Cards**: High-resolution preview image links for social sharing.
- **JSON-LD Schemas**: Automatic injection of `FAQPage`, `Article`, `BreadcrumbList`, and `Organization` schemas.
- **Sitemap & Robots**: Full indexability via `sitemap.ts` and `robots.ts`.
