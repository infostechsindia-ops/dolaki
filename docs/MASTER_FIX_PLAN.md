# MASTER FIX PLAN — AuraMart Commerce OS
**Audit ID:** MASTER-AUDIT-001 | **Date:** 2026-08-09

## Pre-Launch (Must Fix Before Go-Live)

### FIX-P0-001: Add Rate Limiting
- **File:** backend/src/app.module.ts, backend/src/main.ts
- **Change:** Install @nestjs/throttler, add ThrottlerModule, apply @Throttle() on auth endpoints
- **Effort:** 2 hours
- **Severity:** CRITICAL

### FIX-P0-002: Wire Search to Backend API
- **File:** web/src/app/search/page.tsx
- **Change:** Remove `import { products } from '@/data/products'`. Replace with `fetch('/api/v1/products?search=${query}&limit=50')` call.
- **Effort:** 4 hours
- **Severity:** CRITICAL

## Already Fixed This Audit

### FIX-A001: termsAccepted Legal Consent
- **File:** web/src/app/checkout/page.tsx:23
- **Change:** Changed from `useState(true)` to `useState(false)`
- **Status:** DONE

### FIX-A002: Payment useEffect Anti-Pattern
- **File:** web/src/app/checkout/page.tsx:234
- **Change:** Moved payment orchestration from useEffect to handlePlaceOrderPreview async handler
- **Status:** DONE

## Sprint 1 (Post-Launch)

| Fix | File | Effort |
|-----|------|--------|
| Fix N+1 query in computeAttributeSignature | products.service.ts | 1h |
| Add SafeAreaProvider to mobile layout | _layout.tsx | 30m |
| Replace img with next/image in ProductCard | ProductCard.tsx | 2h |
| Persist OfflineManager with AsyncStorage | offline.ts | 3h |
| Add web middleware auth guard for /account/** | middleware.ts | 1h |
| Add /flado/ routes to sitemap | sitemap.ts | 2h |

## Sprint 2 (Quality Sprint)

| Fix | File | Effort |
|-----|------|--------|
| Migrate fonts to next/font/google | globals.css, layout.tsx | 1h |
| Add explicit JWT expiresIn | auth.service.ts | 15m |
| Wrap checkout preview in QueryRunner transaction | checkout.service.ts | 2h |
| Fix payments.service provider fallback | payments.service.ts | 30m |
| Add admin error.tsx root boundary | admin/src/app/ | 30m |
| Add loading.tsx to homepage | web/src/app/ | 30m |
| Set canonical URL in metadata | layout.tsx | 15m |

*LIVE PRODUCTION DEPLOYMENT remains PAUSED.*
