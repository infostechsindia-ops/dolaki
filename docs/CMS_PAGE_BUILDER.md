# AuraMart Commerce OS — CMS Page Builder Guide

## Overview
The CMS Page Builder enables creation and composition of unlimited marketing, informational, and campaign pages without code changes.

---

## 1. Supported Block Types

| Block Type | Component Handler | Purpose |
|------------|-------------------|---------|
| `hero` | `<RenderBlock />` | High-impact campaign hero banner with CTA button |
| `stats` | `<RenderBlock />` | Metric counter grid (e.g. 10M+ Users, 1.2K Darkstores) |
| `features` / `cards` | `<RenderBlock />` | Multi-column feature grids |
| `timeline` | `<RenderBlock />` | Historical company milestones and roadmap |
| `faq` | `<RenderBlock />` | Accordion list with expandable answer panels |
| `rich_text` | `<RenderBlock />` | Free-form markdown and HTML content |

---

## 2. Rendering Engine
Pages are rendered by [`web/src/components/cms/CmsPageRenderer.tsx`](file:///Users/arifalnukhbah/antigravity/AuraMart/web/src/components/cms/CmsPageRenderer.tsx) with automatic breadcrumb navigation and JSON-LD schema generation.
