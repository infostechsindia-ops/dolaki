# ENTERPRISE RATE LIMITING & API THROTTLING (BLOCKER-FIX-001)

## Overview
AuraMart Commerce OS implements enterprise-grade API rate limiting using NestJS `@nestjs/throttler` (v6) integrated globally into the backend application pipeline.

## Configuration & Architecture

### Global Configuration
- **Module:** `ThrottlerModule.forRoot(...)` registered in `backend/src/app.module.ts`.
- **Default TTL:** 60,000 ms (1 minute).
- **Default Limit:** 100 requests per minute per IP address.
- **Environment Overrides:** `THROTTLE_TTL` and `THROTTLE_LIMIT`.
- **Reverse Proxy Support:** Express `trust proxy` set to `1` in `backend/src/main.ts` for accurate client IP extraction when deployed behind AWS ALB, Cloudflare, NGINX, or Kubernetes ingress controllers.

### Global Guard Order
`ThrottlerGuard` is registered as the first `APP_GUARD` in `AppModule`. This ensures unauthenticated or malicious requests exceeding rate limits are rejected at the edge with HTTP 429 before invoking JWT validation, database queries, or resource-heavy operations.

## Endpoint-Specific Throttling Policies

| Route Group | Endpoint | Limit (Req / Min) | TTL | Decorator | Purpose |
|-------------|----------|-------------------|-----|-----------|---------|
| Health Probes | `/health`, `/ready`, `/` | Unlimited | N/A | `@SkipThrottle()` | Unrestricted status monitoring for k8s/AWS |
| Auth - Login | `/api/v1/auth/login` | 10 | 60s | `@Throttle({ default: { limit: 10, ttl: 60000 } })` | Prevents brute-force credential stuffing |
| Auth - Register | `/api/v1/auth/register` | 10 | 60s | `@Throttle({ default: { limit: 10, ttl: 60000 } })` | Prevents spam registration |
| Auth - OTP | `/api/v1/auth/send-otp` | 5 | 60s | `@Throttle({ default: { limit: 5, ttl: 60000 } })` | Prevents SMS gateway abuse & OTP spam |
| Auth - Verify OTP | `/api/v1/auth/verify-otp` | 5 | 60s | `@Throttle({ default: { limit: 5, ttl: 60000 } })` | Prevents OTP brute-force enumeration |
| Search API | `/api/v1/products/search` | 60 | 60s | `@Throttle({ default: { limit: 60, ttl: 60000 } })` | Protects DB search query engine |
| Checkout Preview | `/api/v1/checkout/preview` | 20 | 60s | `@Throttle({ default: { limit: 20, ttl: 60000 } })` | Protects pricing & serviceability calculators |
| Order Placement | `/api/v1/orders/place` | 15 | 60s | `@Throttle({ default: { limit: 15, ttl: 60000 } })` | Protects payment & order processing engine |

## Response Behavior & Headers

When a client exceeds the allocated request limit:
- **HTTP Status Code:** `429 Too Many Requests`
- **Response Body:**
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```
- **Response Headers:**
  - `Retry-After`: Seconds until request quota resets.
  - `X-RateLimit-Limit`: Maximum allowed requests in window.
  - `X-RateLimit-Remaining`: Remaining request quota.

## Automated Verification
Test suite in `backend/src/common/throttling.spec.ts` verifies:
- Global `ThrottlerGuard` provider instantiation
- `@SkipThrottle()` exclusion on health probes
- `@Throttle()` limit metadata registration on Auth, Search, and Checkout endpoints
