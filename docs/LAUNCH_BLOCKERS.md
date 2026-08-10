# LAUNCH BLOCKERS — AuraMart Commerce OS
**Audit ID:** MASTER-AUDIT-001 | **Date:** 2026-08-09

## Active Launch Blockers

### BLOCKER-001: Rate Limiting Not Configured

- **Severity:** CRITICAL
- **Evidence:** backend/src/main.ts — no @nestjs/throttler or equivalent
- **Risk:** Brute force login attacks, OTP enumeration, DDoS vulnerability
- **Root Cause:** Rate limiting was never added to the bootstrap configuration
- **Affected Files:** backend/src/main.ts, backend/src/app.module.ts
- **Recommended Fix:**
  1. `npm install --save @nestjs/throttler`
  2. Add `ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }])` to AppModule imports
  3. Decorate auth controller with `@Throttle({ default: { ttl: 60000, limit: 5 } })`
- **Priority:** P0 — Must fix before go-live
- **Estimated Effort:** 2 hours

### BLOCKER-002: Search Uses Static Mock Data

- **Severity:** CRITICAL
- **Evidence:** web/src/app/search/page.tsx:6 — `import { products } from '@/data/products'` (256KB static file)
- **Risk:** Search results are disconnected from real catalog; 256KB bundle overhead on every search page load
- **Root Cause:** Search was prototyped with local mock data and never connected to the backend
- **Affected Files:** web/src/app/search/page.tsx
- **Recommended Fix:**
  1. Remove the static `import { products }` line
  2. Replace the `useEffect` filter with a `fetch('/api/v1/products?search={query}&limit=50')` call
  3. Map backend response to component's `filteredProducts` state
- **Priority:** P0 — Must fix before go-live
- **Estimated Effort:** 4 hours

## Resolved Launch Blockers

| ID | Blocker | Resolved | Date |
|----|---------|----------|------|
| RESOLVED-001 | termsAccepted auto-consent legal violation | ✅ FIXED | 2026-08-09 |
| RESOLVED-002 | Payment useEffect double-fire risk | ✅ FIXED | 2026-08-09 |

## Not Launch Blockers (Post-Launch Improvements)

All HIGH/MEDIUM/LOW findings from MASTER_AUDIT_REPORT.md are post-launch improvements, not blockers.

*LIVE PRODUCTION DEPLOYMENT remains PAUSED until BLOCKER-001 and BLOCKER-002 are resolved.*
