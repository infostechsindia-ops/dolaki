# RECOMMENDATIONS — AuraMart Commerce OS
**Audit ID:** MASTER-AUDIT-001 | **Date:** 2026-08-09

## Immediate Actions (Pre-Launch)

1. **Add rate limiting** — 2 hours work, eliminates BLOCKER-001
2. **Wire search to backend API** — 4 hours, eliminates BLOCKER-002

## Short-Term Recommendations (Sprint 1)

3. **Migrate ProductCard to next/image** — eliminates unoptimized images, improves LCP
4. **Add SafeAreaProvider to mobile root layout** — fixes notch/island overlap on iPhone
5. **Persist OfflineManager with AsyncStorage** — true offline support on mobile
6. **Add auth guard to web middleware** — protect /account/** and /checkout/** routes client-side
7. **Fix N+1 DB query in computeAttributeSignature** — batch load with In() query
8. **Add /flado/ routes to sitemap** — critical for SEO of quick-commerce surface

## Medium-Term Recommendations (Sprint 2)

9. **Migrate fonts to next/font/google** — eliminate render-blocking CSS @import
10. **Add loading.tsx skeleton to homepage** — prevent blank page while server fetches SDUI
11. **Set canonical URL in layout.tsx metadata** — improve SEO
12. **Wrap checkout service in QueryRunner transaction** — ensure data consistency
13. **Add admin error.tsx root boundary** — graceful error handling in admin
14. **Remove dead reference folders** (backend_reference/, web_reference/) — clean codebase

## Long-Term Recommendations

15. **Elasticsearch/Algolia integration** — real-time search with autocomplete, facets
16. **AI/ML recommendation engine** — replace scoring-based with collaborative filtering
17. **Multi-region CDN with hreflang** — international expansion support
18. **GraphQL API** — for mobile performance optimization (fewer round trips)
19. **A/B testing infrastructure** — for data-driven UX improvement
20. **Universal soft-delete** — add deletedAt columns to all entities

## Architectural Recommendations

- Keep server-authoritative architecture — do not add client-side business logic
- Do not return to useEffect-based API orchestration pattern
- Establish database transaction boundaries around multi-step operations (checkout, order placement)
- Consider moving to `next/font` for all web typography

*LIVE PRODUCTION DEPLOYMENT remains PAUSED.*
