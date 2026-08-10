# ROUTING REPORT — AuraMart Commerce OS
**Audit ID:** MASTER-AUDIT-001 | **Date:** 2026-08-09

## Customer Web Routes (45 directories)

| Route | Status |
|-------|--------|
| / | ✅ |
| /products/[slug] | ✅ |
| /categories/[slug] | ✅ |
| /brands/[slug] | ✅ |
| /cart | ✅ |
| /checkout | ✅ |
| /orders | ✅ |
| /wishlist | ✅ |
| /search | ✅ (data issue) |
| /flado | ✅ |
| /flado/categories/[slug] | ✅ |
| /flado/brands/[slug] | ✅ |
| /flado/orders | ✅ |
| /flado/tracking | ✅ |
| /flado/search | ✅ |
| /account/addresses | ✅ |
| /account/wallet | ✅ |
| /account/support | ✅ |
| /auth/login | ✅ |
| /auth/register | ✅ |
| /blog | ✅ |
| /help | ✅ |
| /legal | ✅ |
| /policies | ✅ |
| /privacy | ✅ |
| /terms | ✅ |
| /cookies | ✅ |
| /seller/[slug] | ✅ |
| /deals | ✅ |
| /collections | ✅ |
| /not-found (404) | ✅ |

## Route Gaps

| Issue | Severity |
|-------|----------|
| /account/orders missing from /account/ directory (it is at /orders/) | LOW |
| /account/profile missing from /account/ directory (it is at /profile/) | LOW |

## Mobile Routes

| Route | Status |
|-------|--------|
| (tabs) | ✅ |
| products/[id] | ✅ |
| checkout | ✅ |
| tracking/[id] | ✅ |
| orders | ✅ |
| orders/[id] | ✅ |
| account/addresses | ✅ |
| account/wallet | ✅ |
| auth (modal) | ✅ |

## Broken Links
Zero 404 routes detected in route directory structure.

*LIVE PRODUCTION DEPLOYMENT remains PAUSED.*
