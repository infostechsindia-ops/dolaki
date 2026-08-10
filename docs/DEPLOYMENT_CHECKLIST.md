# AuraMart Platform — Production Deployment Gate Checklist (DEPLOY-001)

## Executive Summary
This document defines the production deployment gate checklist for launching the AuraMart platform.

---

## Production Gate Matrix

- [x] **Repository Environment Contract**: `backend/.env.production.example` created and documented.
- [x] **Fail-Fast Environment Validation**: Production backend rejects missing `JWT_SECRET` or `DATABASE_URL`/`DB_HOST` on startup.
- [x] **Production CORS Security**: Restricted origin checking active in `backend/src/main.ts`.
- [x] **Graceful Shutdown**: `app.enableShutdownHooks()` active for SIGTERM / SIGINT handling.
- [x] **Health & Readiness Endpoints**: `GET /api/v1/health` and `GET /api/v1/ready` implemented.
- [x] **TypeORM Production Safety**: `synchronize: false` in production; `migrationsRun: true` active.
- [x] **TypeORM Migration CLI**: `data-source.ts` created and `migration:run` scripts configured in `backend/package.json`.
- [x] **Secrets Scan**: 0 committed production API keys, passwords, or JWT secrets in source control.
- [x] **Gitignore Hardening**: `.env*` files ignored while preserving `.env.example` templates.
- [ ] **Production PostgreSQL Instance**: Provision managed PostgreSQL database (**EXTERNAL CONFIGURATION REQUIRED**).
- [ ] **Production PSP Webhook Credentials**: Configure Stripe/Razorpay live secret keys and webhook endpoints (**EXTERNAL CONFIGURATION REQUIRED**).
- [ ] **Production FCM Credentials**: Upload Firebase Cloud Messaging service account credentials to EAS (**EXTERNAL CONFIGURATION REQUIRED**).
- [ ] **EAS Release Build Compilation**: Execute `npm run build:android` on authenticated EAS runner (**EXTERNAL CONFIGURATION REQUIRED**).
- [ ] **Google Play / App Store Console Setup**: Complete store listings and review credentials (**EXTERNAL CONFIGURATION REQUIRED**).

---

## External Configuration Status Table

| Dependency | Required Configuration | Status |
|------------|-----------------------|--------|
| PostgreSQL | RDS / Managed DB with SSL | **EXTERNAL CONFIGURATION REQUIRED** |
| Payment Gateway | Stripe / Razorpay Webhooks | **EXTERNAL CONFIGURATION REQUIRED** |
| Push Notifications | FCM Service Account | **EXTERNAL CONFIGURATION REQUIRED** |
| Mobile Release Build | EAS Cloud Runner `.aab` | **EXTERNAL CONFIGURATION REQUIRED** |
| DNS / Domain / TLS | SSL Certificates & Subdomains | **EXTERNAL CONFIGURATION REQUIRED** |

---

## Verdict

**COMPLETE WITH EXTERNAL BLOCKERS**

Repository-level infrastructure and production configuration hardening is 100% complete and verified. External infrastructure provisioning is required before live deployment.
