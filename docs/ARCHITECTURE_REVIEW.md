# ARCHITECTURE REVIEW — AuraMart Commerce OS
**Audit ID:** MASTER-AUDIT-001 | **Date:** 2026-08-09

## Backend Architecture

**Framework:** NestJS with TypeORM  
**Pattern:** Modular monolith, 25 modules  
**DI:** Full constructor injection throughout  
**Guards:** Global JWT (JwtAuthGuard) + RBAC (RolesGuard) applied via APP_GUARD  
**API Prefix:** /api/v1 with /api/* legacy rewrite  
**Database:** SQLite (dev/test) or PostgreSQL (production)  
**Security Middleware:** Manual headers (X-Frame-Options, X-Content-Type-Options, etc.)  

**Strengths:**
- Clean module boundaries
- Global exception filter + response interceptor
- Idempotency keys for payments
- Audit logging service integrated
- Environment validation on startup
- Graceful shutdown hooks

**Gaps:**
- No rate limiting (@nestjs/throttler missing)
- No global request tracing correlation ID
- Checkout flow lacks DB transaction wrapping

## Frontend Architecture

**Framework:** Next.js 14 App Router  
**Rendering:** Server Components + ISR (60s for homepage)  
**State:** React Context (CartContext, AuraCoinContext, ToastContext)  
**SDUI:** Server-driven homepage with fallback static defaults  

**Strengths:**
- Server Components for data fetching (no client bundle bloat from API calls)
- ISR for performance
- Graceful SDUI fallback
- Structured JSON-LD in layout

**Gaps:**
- Search bypasses server-authoritative architecture with 256KB static file
- Web middleware does not validate JWT for protected routes
- Font loading via CSS @import (not next/font)

## Mobile Architecture

**Framework:** Expo Router (SDK 56)  
**Navigation:** File-based routing with Stack navigator  
**State:** React Context (Auth, Cart, Surface, Offline, Location)  
**Error Handling:** ErrorBoundary at root  

**Gaps:**
- OfflineManager uses in-memory Map (non-persistent)
- No SafeAreaProvider wrapping Stack
- No font loading gate before splash screen

## SDUI Architecture

Server-Driven UI via `/api/v1/sdui/homepage` endpoint.  
Homepage sections: hero_banners, category_grid, sponsor_strip, flado_banner.  
Fallback: Static constants in page.tsx.  
CMS writes: SUPER_ADMIN / CATALOG_ADMIN only.  

*LIVE PRODUCTION DEPLOYMENT remains PAUSED.*
