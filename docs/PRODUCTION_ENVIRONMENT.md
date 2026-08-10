# AuraMart Platform — Production Environment & Architecture Specification (DEPLOY-001)

## Executive Summary
This document specifies the authoritative production environment contract, database configuration, transport security policies, secret management rules, and deployment procedures for the **AuraMart Commerce OS Platform**.

---

## 1. Production Environment Variables Contract

| Variable Name | Required Scope | Environment | Description / Security Policy |
|---------------|----------------|-------------|-------------------------------|
| `NODE_ENV` | Backend, Client Apps | `production` | Enables production mode (`synchronize: false`, Swagger UI disabled, fail-fast env validation). |
| `PORT` | Backend | `5000` | HTTP application port for NestJS backend listener. |
| `API_PUBLIC_URL` | Backend, Mobile | `https://api.auramart.com/api/v1` | Public HTTPS base URL for production API endpoints. |
| `FRONTEND_URL` | Web Client | `https://auramart.com` | Customer web application domain. |
| `VENDOR_URL` | Vendor Client | `https://vendor.auramart.com` | Marketplace vendor web portal domain. |
| `ADMIN_URL` | Admin Client | `https://admin.auramart.com` | Super Admin platform domain. |
| `CORS_ORIGINS` | Backend | Comma-separated domains | Whitelist of allowed web origins for production CORS. |
| `JWT_SECRET` | Backend | High-entropy secret | Mandatory 256-bit+ secret key for signing JWT auth tokens. Rejects defaults in production. |
| `JWT_EXPIRES_IN` | Backend | `7d` | Access token expiration window. |
| `REFRESH_TOKEN_SECRET` | Backend | High-entropy secret | Dedicated secret key for signing refresh tokens. |
| `DB_HOST` | Backend Database | Hostname / RDS Endpoint | Production PostgreSQL database host. |
| `DB_PORT` | Backend Database | `5432` | PostgreSQL port. |
| `DB_USER` | Backend Database | Username | PostgreSQL production role. |
| `DB_PASSWORD` | Backend Database | High-entropy password | PostgreSQL user password. |
| `DB_NAME` | Backend Database | `auramart_prod` | Production database schema name. |
| `DB_SSL` | Backend Database | `true` | Requires TLS/SSL encrypted connection to PostgreSQL database. |
| `STRIPE_SECRET_KEY` | Backend Payments | `sk_live_...` | Live Stripe API secret key (**EXTERNAL CONFIGURATION REQUIRED**). |
| `STRIPE_WEBHOOK_SECRET` | Backend Payments | `whsec_...` | Live Stripe webhook signing secret (**EXTERNAL CONFIGURATION REQUIRED**). |
| `RAZORPAY_KEY_ID` | Backend Payments | `rzp_live_...` | Live Razorpay key ID (**EXTERNAL CONFIGURATION REQUIRED**). |
| `RAZORPAY_KEY_SECRET` | Backend Payments | Secret key | Live Razorpay key secret (**EXTERNAL CONFIGURATION REQUIRED**). |
| `RAZORPAY_WEBHOOK_SECRET` | Backend Payments | Secret string | Live Razorpay webhook secret (**EXTERNAL CONFIGURATION REQUIRED**). |
| `FCM_SERVICE_ACCOUNT_JSON` | Backend Push | JSON path or string | Production Firebase Cloud Messaging credentials (**EXTERNAL CONFIGURATION REQUIRED**). |
| `STORAGE_BUCKET` | Backend / Media | Bucket name | Production AWS S3 or GCS bucket for KYC/product media (**EXTERNAL CONFIGURATION REQUIRED**). |

---

## 2. Production Database & Migration Safety Policy

1. **Auto-Synchronization Prohibited (`synchronize: false`)**:
   In production (`NODE_ENV === 'production'`), TypeORM automatic schema synchronization (`synchronize`) is **strictly disabled** to prevent destructive data loss or schema alterations.

2. **Database Migration Deployment Strategy**:
   Production database schema evolution is performed exclusively through explicit, versioned, idempotent TypeORM migration files (`backend/src/database/migrations/`).
   - `migrationsRun: isProd` is configured in NestJS `AppModule`. Migrations execute automatically on backend container startup.
   - Manual migration verification commands:
     ```bash
     cd backend
     npm run migration:run      # Run pending migrations
     npm run migration:show     # Check migration status
     npm run migration:revert   # Revert last migration
     ```

3. **Database Connection Security**:
   - Production PostgreSQL connections require TLS (`DB_SSL=true`).
   - Database connection failures trigger immediate startup failure without logging connection passwords.

---

## 3. Database Backup & Disaster Recovery Policy

- **Automated Daily Backups**: Production PostgreSQL instance must be configured with automated daily snapshots and 30-day point-in-time recovery (PITR).
- **Pre-Migration Snapshot**: A full database backup MUST be taken prior to executing any production migration.
- **Rollback Procedure**: In the event of a failed migration, run `npm run migration:revert` or restore database to pre-migration snapshot.
- **Infrastructure Status**: `EXTERNAL CONFIGURATION REQUIRED` (AWS RDS / GCP Cloud SQL managed backup service).

---

## 4. Transport & CORS Security

1. **HTTPS Enforcement**: All client communication (Web, Mobile, Vendor, Admin) in production targets strictly encrypted `https://` endpoints. Unencrypted `http://` or `localhost` fallbacks are prohibited in release builds.
2. **Production CORS Whitelist**: Production CORS dynamically restricts requests to `FRONTEND_URL`, `VENDOR_URL`, `ADMIN_URL`, or explicit `CORS_ORIGINS`. Wildcard `origin: '*'` is disabled.

---

## 5. Health, Readiness & Shutdown Lifecycle

- **Health Endpoint**: `GET /api/v1/health` returns `{ status: "ok", service: "auramart-backend", timestamp: "..." }`.
- **Readiness Endpoint**: `GET /api/v1/ready` returns `{ status: "ok", readiness: "READY" }`.
- **Graceful Shutdown**: `app.enableShutdownHooks()` is active in `main.ts`, ensuring clean SIGTERM / SIGINT termination of database connection pools and active HTTP requests during container rolling updates.
