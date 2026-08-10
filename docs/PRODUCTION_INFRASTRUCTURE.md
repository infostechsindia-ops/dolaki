# AuraMart Platform — Production Infrastructure Architecture Specification (DEPLOY-004)

## Executive Summary
This document specifies the authoritative cloud production infrastructure architecture, PostgreSQL database requirements, secret injection policies, container hosting specifications, and user action steps required to launch the **AuraMart Backend API**.

---

## 1. Production Topology & Simplicity

```
   [ Client Apps (Web / Mobile / Admin / Vendor) ]
                           │
                           ▼ HTTPS / TLS (Port 443)
              ┌──────────────────────────┐
              │  AuraMart NestJS Backend │
              │   Container Service      │
              │  (Node 20 Alpine Runner) │
              └────────────┬─────────────┘
                           │
                           │ Encrypted Private Network / SSL (Port 5432)
                           ▼
              ┌──────────────────────────┐
              │ Managed PostgreSQL DB    │
              │  (RDS / Cloud SQL)       │
              └──────────────────────────┘
```

- **Operational Simplicity**: Initial launch topology uses a single containerized NestJS backend process connected over encrypted TLS (`DB_SSL=true`) to a managed PostgreSQL instance.
- **No Unnecessary Infrastructure**: Kubernetes, Kafka, Redis clusters, and service meshes are intentionally excluded for initial launch to maximize reliability and minimize operational complexity.

---

## 2. Managed PostgreSQL Production Requirements

1. **Database Sizing**: Minimum 2 vCPU, 4GB RAM, 20GB persistent SSD storage (e.g. AWS RDS `db.t4g.medium` or GCP Cloud SQL `db-custom-2-4096`).
2. **TLS/SSL Encryption**: Transport encryption mandatory (`DB_SSL=true`). Unencrypted connections are rejected.
3. **Automated Backups**: Minimum 30-day automated daily snapshot retention with Point-In-Time Recovery (PITR) enabled.
4. **Network Access**: Restricted private subnet access (VPC security group restricted to backend container IP range). Public internet access disabled.
5. **Connection Pooling**: Configured with `DB_POOL_MAX` (default: 20) and `DB_IDLE_TIMEOUT_MS` (default: 30,000ms).

---

## 3. Secret Injection Contract & Security

Secrets must be injected into the backend container at runtime via provider secret managers (AWS Secrets Manager, GCP Secret Manager, Railway/Render Secrets). **Secrets MUST NEVER be committed to Git or baked into Docker images.**

| Environment Variable | Required Value / Format | Security Directive |
|----------------------|-------------------------|-------------------|
| `NODE_ENV` | `production` | Enables production security & fail-fast checks |
| `PORT` | `5000` | HTTP port |
| `DATABASE_URL` / `DB_HOST` | Production PostgreSQL endpoint | Injected via Secret Manager |
| `DB_USER` / `DB_PASSWORD` | Production DB credentials | High-entropy random password |
| `DB_SSL` | `true` | Requires TLS connection |
| `JWT_SECRET` | 256-bit+ high-entropy string | Rejects dev default (`auramart-secret-key...`) |
| `JWT_EXPIRES_IN` | `7d` | Access token expiration |
| `CORS_ORIGINS` | Comma-separated production domains | Restricts cross-origin browser requests |

---

## 4. Execution Step for Database Migration & Go-Live

Once production infrastructure is provisioned and environment variables are injected:

```bash
# Step 1: Run explicit pre-rollout TypeORM migrations against production PostgreSQL
cd backend
npm run migration:run

# Step 2: Launch backend container image
docker run -d -p 5000:5000 --env-file .env.production auramart-backend:v1.0.0

# Step 3: Run non-destructive production HTTP smoke test
node scripts/production-smoke-test.js https://api.auramart.com/api/v1
```

---

## 5. External Infrastructure Access Status

- **AWS / GCP / Cloud Provider Credentials**: `EXTERNAL CONFIGURATION REQUIRED FROM USER`
- **Managed PostgreSQL Database Instance**: `EXTERNAL CONFIGURATION REQUIRED FROM USER`
- **Domain & SSL Certificate (`api.auramart.com`)**: `EXTERNAL CONFIGURATION REQUIRED FROM USER`
