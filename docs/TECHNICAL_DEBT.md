# TECHNICAL DEBT — AuraMart Commerce OS
**Audit ID:** MASTER-AUDIT-001 | **Date:** 2026-08-09

## Critical Priority (Pre-Launch)

| ID | Debt | File | Effort |
|----|------|------|--------|
| TD-001 | Rate limiting not configured | backend/src/main.ts | 2h |
| TD-002 | Search uses 256KB static mock data file | web/src/app/search/page.tsx | 4h |

## High Priority (Post-Launch Sprint 1)

| ID | Debt | File | Effort |
|----|------|------|--------|
| TD-003 | N+1 DB query in computeAttributeSignature | products.service.ts:110 | 1h |
| TD-004 | OfflineManager in-memory cache (mobile) | offline.ts:8 | 3h |
| TD-005 | img tag in ProductCard — no next/image | ProductCard.tsx:129 | 2h |
| TD-006 | Missing SafeAreaProvider in mobile layout | _layout.tsx:21 | 30m |
| TD-007 | CSP not enforced in web middleware | middleware.ts | 1h |
| TD-008 | Sitemap missing /flado/ routes | sitemap.ts | 2h |

## Medium Priority (Sprint 2)

| ID | Debt | File | Effort |
|----|------|------|--------|
| TD-009 | Font loading via CSS @import | globals.css:1 | 1h |
| TD-010 | payments.service silent provider fallback | payments.service.ts:49 | 30m |
| TD-011 | JWT sign without explicit TTL | auth.service.ts:66 | 15m |
| TD-012 | checkout.service missing transaction isolation | checkout.service.ts:39 | 2h |
| TD-013 | Admin app missing error.tsx root boundary | admin/src/app/ | 30m |
| TD-014 | No loading.tsx on homepage | web/src/app/ | 30m |
| TD-015 | Canonical URL not set | layout.tsx | 15m |
| TD-016 | Sitemap using hardcoded arrays | sitemap.ts | 1h |

## Low Priority (Backlog)

| ID | Debt | File | Effort |
|----|------|------|--------|
| TD-017 | not-found.tsx uses inline styles | not-found.tsx | 1h |
| TD-018 | Legacy Android permissions | app.json | 15m |
| TD-019 | CORS !origin bypass | main.ts:74 | 30m |
| TD-020 | PostHog provider unused | posthog-analytics.provider.ts | 15m |
| TD-021 | Soft delete missing deletedAt column on Product | entities.ts | 1h |
| TD-022 | hreflang not configured | layout.tsx | 30m |
| TD-023 | backend_reference/ and web_reference/ dead folders | repo root | 5m |

## Future Improvements
- Elasticsearch/Algolia integration for real-time search
- AI-powered recommendation ML models
- Multi-region deployment with hreflang
- GraphQL API layer for mobile clients
- A/B testing infrastructure

*LIVE PRODUCTION DEPLOYMENT remains PAUSED.*
