# ENTITY INVENTORY & PRIMARY/SECONDARY SOURCE MAPPING MATRIX — AuraMart Commerce OS
**Audit ID:** DATA-ARCHITECTURE-001  
**Date:** 2026-08-09  

---

## Master Entity Source Mapping Matrix

| Entity Name | Primary Authoritative Source | REST API Endpoint | Secondary / Cache Layer | Deprecated / Mock Status | Status |
|-------------|------------------------------|-------------------|--------------------------|--------------------------|--------|
| **Categories** | PostgreSQL `categories` table | `GET /api/v1/categories` | Redis 7 cache TTL 3600s | Static data removed | **AUTHORITATIVE** ✅ |
| **Products** | PostgreSQL `products` table | `GET /api/v1/products` | In-memory API query cache | Static array removed | **AUTHORITATIVE** ✅ |
| **Brands** | PostgreSQL `brands` table | `GET /api/v1/brands` | Redis 7 cache | Static data removed | **AUTHORITATIVE** ✅ |
| **Vendors** | PostgreSQL `vendors` table | `GET /api/v1/vendors` | Admin context | Hardcoded data removed | **AUTHORITATIVE** ✅ |
| **Collections** | PostgreSQL `collections` table | `GET /api/v1/collections` | Client query cache | Static array removed | **AUTHORITATIVE** ✅ |
| **Campaigns** | PostgreSQL `campaigns` table | `GET /api/v1/campaigns` | ISR 60s revalidation | Static array removed | **AUTHORITATIVE** ✅ |
| **CMS / SDUI** | PostgreSQL `sdui_layouts` table | `GET /api/v1/sdui/homepage` | ISR 60s revalidation | Static layout removed | **AUTHORITATIVE** ✅ |
| **Coupons** | PostgreSQL `coupons` table | `GET /api/v1/coupons` | Redis rate limiter | Mock array removed | **AUTHORITATIVE** ✅ |
| **Inventory** | PostgreSQL `inventory` table | `GET /api/v1/inventory` | Darkstore cache | Hardcoded stock removed | **AUTHORITATIVE** ✅ |
| **Orders** | PostgreSQL `orders` table | `GET /api/v1/orders` | User session store | Mock order list removed | **AUTHORITATIVE** ✅ |

---

## Data Flow Integrity Rules
1. **Single Database Table per Entity:** Each entity maps 1:1 to a single SQL table in PostgreSQL.
2. **Server-Authoritative Pricing:** Client components never compute raw prices, tax, or discounts locally.
