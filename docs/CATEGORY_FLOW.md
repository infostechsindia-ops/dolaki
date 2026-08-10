# END-TO-END CATEGORY DATA FLOW & SYNCHRONIZATION ARCHITECTURE — AuraMart Commerce OS
**Audit ID:** CATALOG-INTEGRITY-001  
**Date:** 2026-08-09  

---

## 1. End-to-End Category Data Flow

```
+----------------------------------------------------------------------------------------+
| Stage 1: Primary Database                                                              |
| PostgreSQL 16 Table `categories`                                                       |
|   (id, name, slug, path, depth, parentId, status, isMarketplace, isQuickCommerce)      |
+----------------------------------------------------------------------------------------+
                                           │
                                           ▼
+----------------------------------------------------------------------------------------+
| Stage 2: Business Service Layer                                                        |
| `CategoriesService` (`backend/src/categories/categories.service.ts`)                   |
|   - `getCategoriesTree({ surface, maxDepth })`                                         |
|   - `getCategoryBySlug(slug)`                                                          |
|   - `findAll(query)`                                                                   |
+----------------------------------------------------------------------------------------+
                                           │
                                           ▼
+----------------------------------------------------------------------------------------+
| Stage 3: REST API Gateway                                                              |
| `CategoriesController` (`backend/src/categories/categories.controller.ts`)             |
|   - `GET /api/v1/categories/tree`                                                      |
|   - `GET /api/v1/categories/slug/:slug`                                                |
|   - `GET /api/v1/categories`                                                           |
+----------------------------------------------------------------------------------------+
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    ▼                      ▼                      ▼
+-----------------------+  +-----------------------+  +-----------------------+
| Stage 4a: Admin       |  | Stage 4b: Web Client  |  | Stage 4c: Mobile      |
| Product Creator /     |  | Homepage SDUI Grid,   |  | Expo Category Drawer, |
| Category Tree Manager |  | PLP Filters, Breadcrumbs| Quick Commerce Modes|
+-----------------------+  +-----------------------+  +-----------------------+
```

---

## 2. Step-by-Step Data Flow Analysis

1. **Database Schema:** `Category` TypeORM entity defines hierarchical parent-child relationships via `parentId`, string path projections (`path`), and numeric depth (`depth`).
2. **NestJS Service Engine:** `CategoriesService.getCategoriesTree()` fetches active categories, prunes surfaces based on `isMarketplace`/`isQuickCommerce`, and constructs a clean nested JSON tree.
3. **REST Gateway:** `GET /api/v1/categories/tree` exposes the validated taxonomy JSON payload under `@Public()` access guard.
4. **Admin UI Dropdowns:** Admin product creation forms query `GET /api/v1/categories` to populate category select dropdowns.
5. **Customer Web PLP:** Category listing pages (`/categories/[slug]`) resolve category details and breadcrumbs using `GET /api/v1/categories/slug/:slug`.
6. **Mobile App Navigation:** Expo Router taxonomy drawers consume `GET /api/v1/categories/tree?surface=quick-commerce` for 15-minute quick commerce browsing.
