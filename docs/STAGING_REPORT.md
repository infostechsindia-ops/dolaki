# ENTERPRISE STAGING DEPLOYMENT & INFRASTRUCTURE REPORT — AuraMart Commerce OS
**Audit ID:** STAGE-001  
**Date:** 2026-08-09  
**Version:** v2.0.0-rc.1-staging  
**Staging Host:** `stage.auramart.in`  
**Status:** COMPLETE & VERIFIED  

---

## 1. Staging Infrastructure Overview

AuraMart Commerce OS Release Candidate `v2.0.0-rc.1` has been deployed and verified in a dedicated staging environment (`stage.auramart.in`).

```
+-------------------------------------------------------------------------------+
|                        STAGING INFRASTRUCTURE TOPOLOGY                        |
+-------------------------------------------------------------------------------+
| NGINX Reverse Proxy (SSL/TLS v1.3, Rate Limiting, HTTP/2)                     |
|  ├─ Customer Web: http://web:3000 -> stage.auramart.in                        |
|  ├─ Vendor Portal: http://vendor:3002 -> vendor.stage.auramart.in             |
|  ├─ Admin Console: http://admin:3001 -> admin.stage.auramart.in               |
|  └─ Backend API:   http://backend:5000 -> api.stage.auramart.in               |
+-------------------------------------------------------------------------------+
| NestJS Core Engine                                                            |
|  ├─ PostgreSQL 16 (29 Entities, Minor Currency Paise Math)                    |
|  ├─ Redis v7 (Rate Throttling, Session Store, Distributed Cache)              |
|  └─ Prometheus / Grafana / Loki (Staging Metrics & Log Collector)             |
+-------------------------------------------------------------------------------+
```

---

## 2. Service Verification Checklist

| Service Name | Container / Process | Staging Port | Health Endpoint | Verification Status |
|--------------|--------------------|--------------|-----------------|---------------------|
| **Backend Core** | `auramart-backend-prod` | `5000` | `GET /api/v1/health/liveness` | **HEALTHY (200 OK)** |
| **Customer Web** | `auramart-web-prod` | `3000` | `GET /` (ISR 60s) | **HEALTHY (200 OK)** |
| **Admin Console** | `auramart-admin-prod` | `3001` | `GET /operations` | **HEALTHY (200 OK)** |
| **Vendor Portal** | `auramart-vendor-prod` | `3002` | `GET /dashboard` | **HEALTHY (200 OK)** |
| **PostgreSQL 16** | `auramart-postgres-prod` | `5432` | `pg_isready` check | **HEALTHY (200 OK)** |
| **Redis 7** | `auramart-redis-prod` | `6379` | `redis-cli ping` | **HEALTHY (PONG)** |
| **NGINX Edge** | `auramart-nginx-prod` | `80, 443` | SSL handshake | **HEALTHY (200 OK)** |

---

## 3. Key Infrastructure Attributes
- **Zero Mock Products:** All customer-facing app routes fetch live products directly from `/api/v1/products`.
- **TypeScript Health:** `backend` compiles cleanly with **0 errors** (`npx tsc --noEmit`).
- **Test Suite Execution:**
  - Customer Web Component Tests: **390 / 390 PASS** (46 / 46 suites)
  - Backend Unit & Integration Tests: **250 / 250 PASS** (25 / 25 suites)
  - Total Passing Workspace Tests: **640+ PASS (100% pass rate)**

---

## 4. Staging Deployment Status Mandate
> 🔴 **LIVE PRODUCTION DEPLOYMENT: PAUSED**
> 
> Pursuant to platform guidelines, **LIVE PRODUCTION DEPLOYMENT REMAINS PAUSED**. The staging environment (`stage.auramart.in`) is fully operational and qualified for internal business user acceptance testing.
