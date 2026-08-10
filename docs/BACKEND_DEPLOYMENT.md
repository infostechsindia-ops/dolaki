# AuraMart NestJS Backend — Production Deployment & Rollback Guide (DEPLOY-002)

## Executive Summary
This document specifies the containerized production deployment sequence, migration release procedures, disaster rollback strategies, and smoke-testing protocols for the **AuraMart NestJS Backend Service**.

---

## 1. Production Deployment Sequence

```
[CI/CD Build Pipeline] 
  → 1. Run Automated Unit & Integration Tests (146 tests)
  → 2. Compile TypeScript & Verify Build (`nest build`)
  → 3. Build Immutable Docker Image (`docker build -t auramart-backend:v1.0.0 backend/`)
  → 4. Push Image to Container Registry (ECR / GHCR / GAR)
  ↓
[Release Execution Step]
  → 5. Take PostgreSQL Database Snapshot / Pre-Migration Backup
  → 6. Execute Explicit Database Migrations (`npm run migration:run`)
  → 7. Verify Migration Success (`npm run migration:show`)
  ↓
[Application Container Rollout]
  → 8. Perform Rolling Update to Container Service (ECS / Cloud Run / K8s)
  → 9. Monitor Startup Log & Health Probe (`GET /api/v1/health`)
  → 10. Verify Database Readiness Probe (`GET /api/v1/ready`)
  → 11. Run Production Backend Smoke-Test Suite
```

---

## 2. Container Startup & Migration Architecture

- **Multi-Stage Build**: `backend/Dockerfile` uses a two-stage Alpine build (`builder` -> `runner`). Runtime dependencies are stripped of dev tooling.
- **Non-Root Execution**: Runs under unprivileged `node` user (UID 1000).
- **Explicit Migration Execution**: Production `migrationsRun` is set to `false` in NestJS `AppModule`. Migrations are executed as an explicit pre-rollout job (`npm run migration:run`) to prevent database schema lock contention in multi-instance horizontally scaled backend clusters.
- **Graceful Shutdown**: `app.enableShutdownHooks()` handles SIGTERM/SIGINT signals cleanly, allowing active HTTP requests and database connection pools (`DB_POOL_MAX`, `DB_IDLE_TIMEOUT_MS`) to close gracefully.

---

## 3. Comprehensive Rollback Procedures

### Scenario A: Application Boot or Health Probe Failure
- **Trigger**: New container fails health/readiness probe (`GET /api/v1/ready`) or crashes on startup.
- **Action**: 
  1. Immediately abort rolling update and revert container image tag to previous immutable release build (e.g. `v1.0.0-previous`).
  2. Inspect startup logs (`docker logs` or CloudWatch/Datadog) for environment validation failures.

### Scenario B: Migration Failure During Pre-Rollout Step
- **Trigger**: `npm run migration:run` exits with non-zero error before application deployment.
- **Action**:
  1. Halt release deployment immediately. Do NOT deploy new application image.
  2. If partial schema changes were applied, execute `npm run migration:revert` to restore schema state.
  3. If automatic revert fails, restore database from the pre-migration snapshot taken in Step 5.

### Scenario C: Post-Rollout Functional Defect (Schema Compatible)
- **Trigger**: Application deployed successfully, but operational defect detected in production.
- **Action**:
  1. Re-deploy previous immutable container image tag immediately.
  2. Do NOT run `migration:revert` unless schema changes break backward compatibility of the previous code release.

### Scenario D: Critical Data Corruption Emergency
- **Trigger**: Unrecoverable data corruption detected post-release.
- **Action**:
  1. Enable Emergency Maintenance Mode (set `emergencyShutdown = true` in admin portal / feature flags).
  2. Restore PostgreSQL database to verified Point-In-Time Recovery (PITR) timestamp prior to corruption event.
  3. Re-deploy baseline verified backend image and re-verify `/ready` probe.

---

## 4. Production Smoke-Test Checklist

| Test Item | Endpoint / Target | Expected Result | Verified Status |
|-----------|------------------|-----------------|-----------------|
| Health Probe | `GET /api/v1/health` | HTTP 200 `{ status: "ok", service: "auramart-backend" }` | ✅ VERIFIED |
| Readiness Probe | `GET /api/v1/ready` | HTTP 200 `{ status: "ok", readiness: "READY" }` (Database query `SELECT 1` PASS) | ✅ VERIFIED |
| Auth Security | `POST /api/v1/auth/login` | HTTP 200 with JWT tokens & HTTP-only cookies | ✅ VERIFIED |
| Default-Deny RBAC | `GET /api/v1/admin/audit-logs` | HTTP 401 Unauthorized without admin Bearer token | ✅ VERIFIED |
| Public Catalog | `GET /api/v1/products` | HTTP 200 list of active marketplace products | ✅ VERIFIED |
| Quick Serviceability | `POST /api/v1/delivery/serviceability` | HTTP 200 serviceability response for valid lat/lng | ✅ VERIFIED |
| Security Headers | HTTP Response Headers | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `HSTS` active | ✅ VERIFIED |
