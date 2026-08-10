# MERCHANDISING_GAP.md

## AuraMart + Flado — Merchandising & CMS Audit Report

> **Audit Command:** MCH-001  
> **Type:** Read-Only Audit & Gap Analysis  
> **Date:** 2026-08-05  

This document compares the existing SDUI/CMS code, storefront pages, brand directories, new launch listings, and admin builder panel against the high-performance specifications outlined in `MERCHANDISING_CMS_EXTENSION.md`.

---

## 1. CAPABILITY CLASSIFICATION MATRIX

| Merchandising Domain | Status | Surface Evidence | Detailed Gap / Implementation Defect |
|---|---|---|---|
| **CMS / SDUI Core** | PARTIAL | Backend: `sdui/` module (`sdui.service.ts`). Web: `page.tsx:74`. Mobile: `index.tsx:302`. | **No DB backing**: CMS config reads/writes static JSON files (`sdui_homepage.json`, `sdui_flado.json`) directly on disk. Startup fallbacks are hardcoded in client source (`DEFAULT_MOBILE_CMS`, `DEFAULT_SDUI_SECTIONS`). |
| **Marketplace Home** | PARTIAL | Web: `web/src/app/page.tsx`. Mobile: `mobile/src/app/(tabs)/index.tsx`. | Homepage renders dynamic blocks from CMS configuration, but the underlying data sources (e.g. products, flash sales) are hardcoded lists of IDs rather than resolving live database entities. |
| **Quick-Commerce / Flado Home** | PARTIAL | Web: `web/src/app/flado/page.tsx`. Mobile: `mobile/src/app/(tabs)/flado.tsx` + `sduiRenderer.tsx`. | **Web Disconnect**: Web Flado page completely ignores the backend SDUI Flado endpoint, using hardcoded static data. Mobile fetches correctly via `useFladoSDUI` but relies heavily on local offline fallback. |
| **Customer Mobile Home** | PARTIAL | Mobile: `(tabs)/index.tsx`. | Renders layout from CMS JSON. However, it is deeply coupled to hardcoded mock lists and offline mock fallbacks. |
| **Category Merchandising** | MISSING | Backend: `sdui.service.ts:354`. | Backend `getCategoryLayout()` returns a simple static mockup. **Neither client uses this endpoint**; category landing pages are generated fully client-side. |
| **Brands Directory & Landing** | MOCK | Web: `/brands` & `/brands/[slug]`. | **No Database Entity**: Brands do not exist in the TypeORM schema. No brands API exists. Renders entirely from static mock array `web/src/data/brands.ts`. |
| **New Launches Experience** | MOCK | Web: `/new-launches`. | **Fully Simulated**: Upcoming drops list is loaded from hardcoded client-side array `UPCOMING_DROPS` inside `new-launches/page.tsx`. |
| **Deals and Campaigns** | PARTIAL | Backend: `CampaignsService`. Web: `/deals`. | Backend has `FlashSale` and `Banner` entities, but they are not connected to the SDUI layouts. Deals Hub page filters local products array client-side. |
| **Heroes, Banners & Sliders** | PARTIAL | Web: `page.tsx` (`hero_banners`). Mobile: `index.tsx` (`hero_banners`). | Components display details from layout JSON, but lack asset management, compression pipeline, aspect-ratio safety limits, or media CDN links (point directly to unsplash). |
| **Marketing/Ad/Promo Strips** | PARTIAL | Web/Mobile render announcement bars. | Announcement bars work from static layout JSON. However, they lack campaign rules, scheduling, and target audience restrictions. |
| **Product/Brand shelves** | PARTIAL | Web/Mobile render strips from lists of hardcoded string IDs. | Product sources do not resolve live from database. Stale or out-of-stock items will render and error out on click instead of collapsing cleanly. |
| **Admin Merchandising Controls** | PARTIAL | Admin: `/cms/page.tsx` (CMS Manager Panel). | Dnd builder exists and can save sections to backend. However, endpoints are **unguarded** (no JWT/Role check) and admin changes are easily overwritten on backend disk file restarts. |
| **Section Ordering / Positioning** | PARTIAL | Backend: `sdui.service.ts`. Clients: layout sorting. | Sorts layout lists by the `order` property, but lacks position priority rules, spacing control, and commercial placement limits (e.g. max consecutive ads). |
| **Scheduling & Targeting** | MISSING | Backend: `sdui.service.ts`. | **No Scheduling Engine**: No start/end dates, timezone filters, platform targeting, location targeting, or audience segments. Returns identical payload to all requests. |
| **Web/Mobile Rendering** | PARTIAL | Web/Mobile homepage component switch-cases. | Page components are massive inline switch blocks. Lacks error boundaries, skeleton screens, and graceful degradation for unknown block types. |
| **Deep Link System** | MISSING | Web & Mobile CTAs. | No central dynamic URL/deep link resolver exists. Navigation points to hardcoded absolute slug paths. |
| **Draft / Publish / Rollback** | MISSING | Backend: `sdui.service.ts`. | Saving immediately overwrites the active JSON file on disk. No draft versioning, no scheduler queue, no rollback capabilities. |

---

## 2. DETAILED AUDIT FINDINGS

### A. The Web Flado Page Disconnect
The Customer Web Flado page (`web/src/app/flado/page.tsx`) contains **zero** API calls to the backend SDUI Flado layout endpoint (`/api/sdui/flado`). Instead, it builds the entire storefront using static data imported from `@/data/fladoCategories.ts`, `@/data/fladoProducts.ts`, `@/data/fladoOffers.ts`, and `@/data/fladoBrands.ts`. Changes published from the Admin CMS manager will never display on the customer website.

### B. Flat JSON Files on Disk
The backend SDUI module (`sdui.service.ts`) persists configurations to flat JSON files in the process working directory:
- `sdui_homepage.json`
- `sdui_flado.json`

This approach presents severe production risks:
- Restarts in containerized environments (Docker/Kubernetes) will wipe out all admin changes, reverting to code defaults.
- Simultaneous save requests from multiple administrators will corrupt the JSON structures.
- Flat files lack transaction logs, making audits and rollback history impossible.

### C. Unguarded Write Endpoints
The SDUI controller (`sdui.controller.ts`) allows open access to layout modification:
```typescript
  @Post('homepage')
  saveHomepage(@Body() config: any) {
    return this.sduiService.saveHomepageLayout(config);
  }

  @Post('flado')
  saveFlado(@Body() config: any) {
    return this.sduiService.saveFladoLayout(config);
  }
```
Any public client or bot can issue `POST /api/sdui/homepage` with empty contents, instantly destroying the storefront.

### D. Hardcoded Product ID Lists in Layout
In the layout configurations (e.g. `sdui.service.ts:131`), flash sales, new launches, and strips reference hardcoded arrays of product ID strings:
```json
"deals": [
  { "productId": "ele-1", "label": "AuraPods Pro" },
  { "productId": "be-1", "label": "Vit C Serum" }
]
```
If a product is deleted from the database, or becomes out of stock, the home page will continue to display it, causing customer errors upon clicking.

---

## 3. ARCHITECTURAL PATH TO TARGET COMPOSER

To transition to the target **Merchandising Page Composer** schema from `MERCHANDISING_CMS_EXTENSION.md`, the following changes are required:

1. **Database Persistence**: Migrating SDUI layouts into database tables (`page_definitions`, `page_placements`, `content_blocks`).
2. **Dynamic Resolvers**: Redesigning product blocks to point to query schemas (e.g. category slug, highest-discount filter, tag) rather than static ID arrays, resolving live database stock levels at load time.
3. **Targeting Middlewares**: Adding a backend engine to filter content blocks dynamically according to client geolocation (city/zone), user authentication status, platform (web/mobile), and active date schedule.
4. **Security Integration**: Restricting all CMS write/publish endpoints via JWT auth and Admin Role guards.

---
*MCH-001 Complete. No production code was modified.*
