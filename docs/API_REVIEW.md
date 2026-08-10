# API REVIEW — AuraMart Commerce OS
**Audit ID:** MASTER-AUDIT-001 | **Date:** 2026-08-09

## API Configuration
- Base prefix: /api/v1
- Legacy rewrite: /api/* → /api/v1/*
- Authentication: Global JwtAuthGuard (deny-by-default)
- Authorization: RolesGuard with @Roles() decorator
- Validation: ValidationPipe (whitelist, forbidNonWhitelisted, transform)
- Error responses: HttpExceptionFilter + TransformInterceptor envelope
- Swagger: Enabled in non-production only

## Rate Limiting
STATUS: NOT CONFIGURED — LAUNCH BLOCKER

Impact: Login endpoint, OTP endpoint, and all APIs are unprotected against brute force and DDoS.

Fix: Install @nestjs/throttler, add ThrottlerModule to AppModule, configure:
- Login: 5 requests per minute
- OTP send: 1 request per 60 seconds (already has service-level cooldown)
- General API: 100 requests per minute per IP

## Modules and Endpoint Coverage

| Module | Endpoints | Auth | Notes |
|--------|-----------|------|-------|
| Auth | /auth/login, /auth/register, /auth/otp, /auth/refresh, /auth/logout | Public/JWT | ✅ |
| Products | /products, /products/:id, /products/:id/variants | Public | ✅ |
| Categories | /categories | Public | ✅ |
| Brands | /brands | Public | ✅ |
| Cart | /cart, /cart/sync | JWT | ✅ |
| Checkout | /checkout/preview | JWT | ✅ |
| Payments | /payments/intents, /payments/intents/:id/confirm | JWT | ✅ |
| Orders | /orders/place, /orders | JWT | ✅ |
| Coupons | /coupons/validate | JWT | ✅ |
| Flado | /flado/* | JWT/Public | ✅ |
| SDUI | /sdui/homepage, /sdui/flado | Public (GET) / Admin (POST) | ✅ |
| Support | /support/tickets | JWT | ✅ |
| Notifications | /notifications | JWT | ✅ |
| Vendors | /vendors | JWT/Vendor | ✅ |
| Users | /users/me, /users/addresses | JWT | ✅ |
| Search | /products?search= | Public | ✅ (but web uses mock) |

## Issues

| ID | Severity | Finding |
|----|----------|---------|
| API-001 | CRITICAL | No rate limiting on any endpoint |
| API-002 | MEDIUM | payments.service.getProvider() silent fallback for unknown methods |
| API-003 | LOW | JWT sign() without explicit expiresIn option |

*LIVE PRODUCTION DEPLOYMENT remains PAUSED.*
