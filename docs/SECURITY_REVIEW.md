# SECURITY REVIEW — AuraMart Commerce OS
**Audit ID:** MASTER-AUDIT-001 | **Date:** 2026-08-09

## OWASP Top 10 Assessment

| Threat | Status | Evidence |
|--------|--------|----------|
| A01 Broken Access Control | ✅ MITIGATED | Global JwtAuthGuard + RolesGuard. IDOR check in checkout. |
| A02 Cryptographic Failures | ✅ MITIGATED | bcrypt for passwords, SHA-256 for refresh token hash |
| A03 Injection (SQLi) | ✅ MITIGATED | TypeORM parameterized queries throughout |
| A04 Insecure Design | ⚠️ PARTIAL | No rate limiting; CORS origin bypass for no-origin requests |
| A05 Security Misconfiguration | ⚠️ PARTIAL | CSP set on backend, not enforced on web middleware |
| A06 Vulnerable Components | ⚠️ CHECK | Dependency audit not yet run |
| A07 Authentication Failures | ⚠️ PARTIAL | OTP cooldown present but no API rate limiting |
| A08 Software Integrity | ✅ MITIGATED | Idempotency keys on payment endpoints |
| A09 Logging Failures | ✅ MITIGATED | AuditService logs auth events |
| A10 SSRF | ✅ LOW RISK | No external URL fetching from user input |

## Critical Security Findings

### Rate Limiting — LAUNCH BLOCKER
- **Severity:** CRITICAL
- **Evidence:** main.ts has no @nestjs/throttler or equivalent configured
- **Risk:** Brute force login, OTP enumeration, DDoS
- **Fix:** Add ThrottlerModule with limits: login 5/min, OTP 1/60s, general 100/min

### CORS Origin Bypass
- **Severity:** MEDIUM
- **Evidence:** main.ts:74 — `if (!origin || ...)` allows all non-browser requests unconditionally
- **Risk:** Server-to-server calls bypass origin whitelist
- **Fix:** Evaluate if the bypass is needed for mobile apps; if so, document explicitly

### Web Middleware Missing Auth Check
- **Severity:** HIGH
- **Evidence:** middleware.ts only sets x-pathname header, no JWT verification
- **Risk:** Routes like /account and /checkout are not protected at the middleware layer
- **Note:** Backend enforces JWT. Without middleware guard, the browser will attempt to render protected pages before redirect.
- **Fix:** Add route protection in middleware.ts for /account/** and /checkout/**

### Legal Consent Auto-Accept
- **Severity:** CRITICAL (Legal Compliance)
- **Evidence:** checkout/page.tsx:23 `useState<boolean>(true)`
- **Status:** FIXED — changed to `false`

## Security Headers (Backend)
- X-Content-Type-Options: nosniff ✅
- X-Frame-Options: DENY ✅
- X-XSS-Protection: 1; mode=block ✅
- Referrer-Policy: strict-origin-when-cross-origin ✅
- Permissions-Policy: camera=(), microphone=(), geolocation=() ✅
- Content-Security-Policy: present ✅
- HSTS: production only ✅

*LIVE PRODUCTION DEPLOYMENT remains PAUSED.*
