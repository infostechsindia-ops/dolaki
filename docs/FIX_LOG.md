# Automated Repair & Remediation Log
## AuraMart Commerce OS v2.0.0-rc.1 | Date: 2026-08-08

---

## Remediation Audit Summary

All runtime routes, SDUI endpoints, database queries, and service abstractions were audited during **DATAFLOW-001**.

| Item | Component / File | Issue Description | Fix Applied | Status |
|------|------------------|-------------------|-------------|--------|
| 1 | `web/src/data/cmsConfig.ts` | SDUI layout configuration missing brand spotlight fallback | Added default fallback config array | ✅ Repaired |
| 2 | `web/src/lib/content-data.ts` | Footer link path normalization for `/help/returns` | Aligned route with CMS page slug | ✅ Repaired |
| 3 | `backend/src/pricing/pricing.service.ts` | Tax inclusive rate extraction precision basis points | Enforced exact basis points formula | ✅ Repaired |
| 4 | `web/src/app/account/support/new/page.tsx` | Unhandled async state update on unmounted component during order fetch | Added `isMounted` guard flag in `useEffect` and `waitFor` wrapper in tests | ✅ Repaired |
| 5 | `backend/src/common/analytics/*.ts` | Event name logged as "undefined" when caller passes `name` instead of `eventName` | Added `eventName || name` property resolution fallback in all providers | ✅ Repaired |
| 6 | `web/src/app/checkout/page.tsx:23` | `termsAccepted` state initialized to `true` — bypasses legal consent requirement at checkout | Changed initial state to `false` | ✅ Repaired |
| 7 | `web/src/app/checkout/page.tsx:234` | Payment Intent creation, confirmation, and order placement orchestrated inside `useEffect` reacting to validation state — risk of duplicate orders in React StrictMode double-invocation | Moved payment orchestration into explicit `handlePlaceOrderPreview` async handler; removed dangerous `useEffect` | ✅ Repaired |
| 8 | `web/src/app/page.tsx` & `backend/src/products/products.service.ts` | Homepage product shelves rendered empty because SDUI sections were not dynamically mapped to product carousels and `findAll` ignored `query.limit` and `query.sort` | Implemented dynamic SDUI section parser with parallel server-authoritative product fetching in `page.tsx` and enhanced `findAll` in `products.service.ts` with `limit` and `sort` support | ✅ Repaired |
| 9 | `web/src/app/(categories|brands|seller|collections|deals|products|wishlist|cart|compare|new-launches|lookbook)/page.tsx` & `sitemap.ts` | Customer pages imported local static `@/data/products` arrays and fell back to static mock data | Removed static mock data imports across all 12 customer-facing app routes; refactored to fetch products live from backend REST endpoints with loading, empty, and error handling | ✅ Repaired |
| 10 | `web/src/app/categories/[slug]/page.tsx:8` | Duplicate `categoryThemesData` import causing Next.js Turbopack build error | Removed duplicate import line | ✅ Repaired |
| 11 | `web/src/app/categories/[slug]/page.tsx:90` | `TypeError: Failed to fetch` on category pages caused by unhandled `Promise.all` rejecting if secondary endpoints failed | Replaced `Promise.all` with resilient `Promise.allSettled`, added endpoint URL pre-logging, and added independent response handling | ✅ Repaired |
| 12 | `web/src/components/CategoryRenderer.tsx:196` | `ReferenceError: allProducts is not defined` in `ProductListingGrid` due to missing `products` prop wiring | Updated `ProductListingGrid`, `ProductListingCarousel`, `CategoryLayoutRenderer`, and `CategoryRenderer` to accept and thread `products` prop from backend API | ✅ Repaired |
| 13 | `web/src/app/products/[id]/page.tsx:74` | `TypeError: Failed to fetch` on PDP caused by unhandled network errors during product, Q&A, and buying guide fetches | Wrapped all PDP fetches in resilient try-catch blocks and added pre-fetch URL logging | ✅ Repaired |
| 14 | `admin/src/app/cms/page.tsx:71` | `TypeError: Failed to fetch` in admin CMS layout manager when backend SDUI service is offline | Added request URL logging (`[CMSManagerPage] Fetching SDUI layout...`) and safe local storage fallback | ✅ Repaired |
| 15 | `admin/src/app/marketing/page.tsx:280` | React style property conflict warning (`border` vs `borderBottom`) on tab buttons | Replaced shorthand `border: "none"` with explicit `borderTop`, `borderLeft`, `borderRight` non-shorthand styles | ✅ Repaired |
| 16 | `admin/src/context/AdminContext.tsx:150` | Empty category dropdown in Admin "Add Product" modal due to missing backend API fetch in `AdminContext` | Added live REST API category & vendor fetching (`GET /api/v1/categories?limit=100`) with non-empty default fallbacks | ✅ Repaired |

---

*Document updated for ADMIN-RUNTIME-001 fix.*
