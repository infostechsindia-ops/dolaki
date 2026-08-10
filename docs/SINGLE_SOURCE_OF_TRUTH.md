# AUTHORITATIVE SINGLE SOURCE OF TRUTH MANDATE — AuraMart Commerce OS
**Audit ID:** DATA-ARCHITECTURE-001  
**Date:** 2026-08-09  

---

## 1. Architectural Mandate

```
========================================================================
                  AUTHORITATIVE SINGLE SOURCE OF TRUTH
========================================================================
 PostgreSQL 16 Database Engine is the ONLY primary source of truth.
 
 ❌ NO static mock arrays in client code.
 ❌ NO local price calculations in frontend components.
 ❌ NO hardcoded stock counts in darkstore UI.
 
 ✅ ALL product cards fetch from GET /api/v1/products.
 ✅ ALL categories fetch from GET /api/v1/categories.
 ✅ ALL orders process server-authoritatively via POST /api/v1/orders.
========================================================================
```

---

## 2. Admin & Frontend Data Synchronization
- **Admin Console:** All dropdown selectors (Categories, Brands, Sellers, Collections, Campaigns, Coupons, Darkstores) fetch dynamic options from NestJS REST API endpoints (`/api/v1/*`).
- **Customer Web & Mobile:** Every page route (Homepage, PLP, PDP, Search, Wishlist, Cart, Checkout, Flado) consumes backend API data.
- **Fail-Safe Fallbacks:** Component fallbacks exist strictly to prevent white-screen crashes during network drops, but live API payloads always take precedence.
