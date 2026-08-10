# EXHAUSTIVE GAP ANALYSIS & POST-LAUNCH ROADMAP — AuraMart Commerce OS
**Audit ID:** FINAL-VERIFICATION-001  
**Date:** 2026-08-09  

---

## Executive Summary
Following the complete remediation of all P0 Launch Blockers (API Rate Limiting, Static Search Data Removal, Legal Terms Consent Default, and Payment Intent `useEffect` refactoring), **zero P0 critical defects remain in the platform**.

This document outlines all non-blocking minor gaps, optimizations, and post-launch enhancement opportunities identified during the final audit.

---

## Non-Blocking Minor Gaps & Post-Launch Recommendations

| Gap ID | Component | Severity | Description | Recommended Fix / Post-Launch Sprint | Estimated Effort |
|--------|-----------|----------|-------------|---------------------------------------|------------------|
| GAP-001 | Customer Web | LOW | `ProductCard` uses standard HTML `<img>` tag instead of `next/image` | Upgrade `ProductCard` to Next.js `<Image>` component for WebP/AVIF auto-format conversion | Sprint 1 (2 hours) |
| GAP-002 | Mobile App | LOW | Missing explicit `<SafeAreaProvider>` wrapper around Expo Router root stack | Add `<SafeAreaProvider>` in `mobile/src/app/_layout.tsx` for edge-to-edge notch handling on newer iPhones | Sprint 1 (1 hour) |
| GAP-003 | Mobile App | LOW | `OfflineManager` uses in-memory `Map` cache | Replace in-memory cache with `@react-native-async-storage/async-storage` for offline cart persistence across app restarts | Sprint 1 (3 hours) |
| GAP-004 | Customer Web | LOW | `sitemap.ts` does not dynamically enumerate dynamic `/flado/` quick-commerce categories | Fetch categories from `/api/v1/categories` dynamically inside `sitemap.ts` | Sprint 1 (1 hour) |
| GAP-005 | Admin Console | LOW | Root `error.tsx` boundary missing in Admin App Router | Create `admin/src/app/error.tsx` for graceful global admin error catching | Sprint 1 (1 hour) |
| GAP-006 | Backend | LOW | JWT `sign()` relies on module default `expiresIn` | Explicity pass `{ expiresIn: '15m' }` in `AuthService.login()` | Sprint 2 (1 hour) |
| GAP-007 | Backend DB | LOW | N+1 query pattern in legacy `computeAttributeSignature` | Add `relations: ['attributes']` to initial product query | Sprint 2 (2 hours) |

---

## Risk Assessment
- **P0 Blockers:** 0
- **P1 High Issues:** 0
- **P2 Medium Issues:** 0
- **P3 Low Issues:** 7 (non-blocking optimization opportunities)

**Verdict:** All 7 identified gaps are low-risk post-launch optimizations. None block commercial production deployment.
