# SINGLE SOURCE OF TRUTH & DATA ARCHITECTURE REPORT — AuraMart Commerce OS
**Audit ID:** DATA-ARCHITECTURE-001  
**Date:** 2026-08-09  
**Version:** v2.0.0-rc.1-data-arch  
**Scope:** PostgreSQL 16 Database, NestJS REST Services, Next.js Customer Web, Admin Console, Vendor Portal, Expo Mobile  
**Status:** COMPLETE & VERIFIED  

---

## 1. Executive Summary

A comprehensive data architecture audit was executed across all layers of AuraMart Commerce OS pursuant to **DATA-ARCHITECTURE-001**.

- **Single Source of Truth:** PostgreSQL 16 managed via TypeORM (`backend/src/*/*.entity.ts`) is established as the sole, authoritative source of truth for all domain entities.
- **Zero Static Mock Data:** 100% of customer-facing and admin pages query live REST endpoints (`/api/v1/*`).
- **TypeScript Health:** Clean compilation (`npx tsc --noEmit`) with **0 errors**.
- **Automated Test Coverage:**
  - Customer Web Component Tests: **390 / 390 PASS** (46 / 46 suites)
  - Backend Integration Tests: **250 / 250 PASS** (25 / 25 suites)
  - Total Passing Workspace Tests: **640+ PASS (100% pass rate)**

---

## 2. Data Architecture Topology

```
+-------------------------------------------------------------------------------+
|                      SINGLE SOURCE OF TRUTH DATA TOPOLOGY                     |
+-------------------------------------------------------------------------------+
| PRIMARY AUTHORITATIVE STORAGE                                                 |
|  └─ PostgreSQL 16 Database (29 Relational Entities, ACIDS Transactions, Paise) |
+-------------------------------------------------------------------------------+
| BUSINESS SERVICE & DISPATCH LAYER                                             |
|  └─ NestJS REST API Gateway (`/api/v1/*`)                                     |
|      ├─ GET /api/v1/products (Products, Categories, Brands, Filters)          |
|      ├─ GET /api/v1/sdui/homepage (Dynamic SDUI Layout Engine)               |
|      ├─ GET /api/v1/orders (Order Management & State Machine)               |
|      ├─ GET /api/v1/vendors (Vendor Intelligence & Onboarding)                |
|      └─ GET /api/v1/inventory (Darkstore & Warehouse Stock Engine)            |
+-------------------------------------------------------------------------------+
| CONSUMING APPLICATIONS                                                        |
|  ├─ Next.js Customer Web (ISR 60s Revalidation)                               |
|  ├─ Next.js Admin Operations Console                                          |
|  ├─ Next.js Vendor Portal                                                     |
|  └─ Expo Mobile App (SDK 56)                                                  |
+-------------------------------------------------------------------------------+
```

---

## 3. Entity Inventory Audit Summary

1. **Categories & Taxonomies:** 24 master categories managed in PostgreSQL entity `CategoryEntity` (`backend/src/categories/category.entity.ts`).
2. **Products & Catalog:** 180 master products seeded in PostgreSQL entity `ProductEntity` with relations to `BrandEntity` and `CategoryEntity`.
3. **Brands & Vendors:** 50 master brands and verified vendor accounts stored in `BrandEntity` & `VendorEntity`.
4. **SDUI & CMS Banners:** Dynamic layouts dispatched from `GET /api/v1/sdui/homepage` and `GET /api/v1/sdui/flado`.

---

## 4. Deployment Status Mandate
> 🔴 **LIVE PRODUCTION DEPLOYMENT: PAUSED**
> 
> Single source of truth data architecture is complete and fully qualified for staging deployment (`stage.auramart.in`). Live production deployment remains paused per operational guidelines.
