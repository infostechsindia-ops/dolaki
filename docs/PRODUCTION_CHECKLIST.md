# AuraMart Commerce OS — Production Go-Live Checklist
## Version 2.0.0-rc.1 | RELEASE-002

This checklist must be completed by the operations team before executing
DEPLOY-004B (Live Production Deployment).

---

## SECTION 1 — Infrastructure Provisioning

### 1.1 Database
- [ ] Provision PostgreSQL 16 cluster (minimum: 4 vCPU, 16GB RAM, 500GB SSD)
- [ ] Configure automated daily backups with 30-day retention
- [ ] Configure point-in-time recovery (PITR)
- [ ] Create `auramart` production database
- [ ] Create `auramart_app` database user with limited permissions
- [ ] Verify connection pooling (PgBouncer recommended, min 20 connections)
- [ ] Test failover with replica
- [ ] Run TypeORM migrations: `npm run migration:run`

### 1.2 Redis
- [ ] Provision Redis 7 cluster (minimum: 2 vCPU, 8GB RAM)
- [ ] Configure persistence (AOF + RDB)
- [ ] Configure maxmemory-policy: allkeys-lru
- [ ] Enable Redis AUTH password
- [ ] Test connection from backend container

### 1.3 Container Infrastructure
- [ ] Provision Kubernetes cluster OR Docker Swarm / ECS
- [ ] Build and push Docker images to private registry:
  - `auramart/backend:v2.0.0`
  - `auramart/web:v2.0.0`
  - `auramart/admin:v2.0.0`
  - `auramart/vendor:v2.0.0`
- [ ] Configure image vulnerability scanning in registry
- [ ] Set up Nginx/Traefik reverse proxy
- [ ] Configure resource limits (CPU/memory) per container
- [ ] Configure horizontal pod autoscaling

### 1.4 Networking & CDN
- [ ] Configure DNS A records for all subdomains
- [ ] Generate SSL/TLS certificates (Let's Encrypt or managed CA)
- [ ] Enable HTTPS redirect (HTTP → HTTPS)
- [ ] Configure CDN for `/public` and Next.js `_next/static`
- [ ] Set up WAF (Web Application Firewall) rules
- [ ] Configure DDoS protection
- [ ] Verify HSTS header is served

---

## SECTION 2 — Environment Configuration

### 2.1 Backend Secrets
- [ ] `JWT_SECRET` — minimum 256-bit random secret (NOT the dev placeholder)
- [ ] `DB_PASSWORD` — strong PostgreSQL password
- [ ] `REDIS_PASSWORD` — strong Redis AUTH password
- [ ] `SESSION_SECRET` — unique per environment

### 2.2 Payment Gateway
- [ ] Activate Razorpay production merchant account
  - [ ] `RAZORPAY_KEY_ID` set
  - [ ] `RAZORPAY_KEY_SECRET` set
  - [ ] Webhook endpoint registered at `/api/v1/payments/webhook`
  - [ ] Test with INR live payment (₹1 test transaction)
- [ ] OR activate Stripe production account
  - [ ] `STRIPE_SECRET_KEY` set (sk_live_)
  - [ ] `STRIPE_WEBHOOK_SECRET` set
  - [ ] Test with live card

### 2.3 Notification Services
- [ ] **Email**: Configure AWS SES / SendGrid
  - [ ] `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` set
  - [ ] Domain verification completed
  - [ ] SPF/DKIM/DMARC records added to DNS
  - [ ] Send test transactional email
- [ ] **SMS**: Configure Twilio or MSG91
  - [ ] `SMS_PROVIDER_KEY`, `SMS_PROVIDER_SECRET` set
  - [ ] `SMS_FROM_NUMBER` set
  - [ ] Test OTP SMS delivery
- [ ] **Push**: Configure Firebase (FCM)
  - [ ] `FIREBASE_PROJECT_ID` set
  - [ ] `FIREBASE_SERVICE_ACCOUNT_JSON` set
  - [ ] Register app in Firebase Console
  - [ ] Test push notification delivery to Android/iOS

### 2.4 Storage
- [ ] Configure AWS S3 / GCS / Cloudflare R2 for product images and media
  - [ ] `STORAGE_BUCKET` set
  - [ ] `STORAGE_ACCESS_KEY`, `STORAGE_SECRET_KEY` set
  - [ ] `CDN_BASE_URL` set
  - [ ] Test image upload through admin media library

### 2.5 Search
- [ ] (Optional) Configure Elasticsearch/Typesense for production search
  - [ ] `SEARCH_HOST` set
  - [ ] Test product search indexing

---

## SECTION 3 — Pre-Deployment Verification

### 3.1 Database
- [ ] Migrations run cleanly on production schema: `npm run migration:run`
- [ ] Seed essential reference data (categories, tax rates, shipping zones)
- [ ] Verify `SELECT 1` health check passes

### 3.2 Backend
- [ ] `NODE_ENV=production npm run build` succeeds
- [ ] `node dist/main` starts without errors
- [ ] `GET /api/v1/health` returns 200
- [ ] `GET /api/docs` returns 404 in production (Swagger disabled)
- [ ] Security headers present on all responses

### 3.3 Frontend Applications
- [ ] `NEXT_PUBLIC_API_URL` points to production backend
- [ ] `npm run build` completes for web, admin, vendor
- [ ] Sitemap.xml accessible at /sitemap.xml
- [ ] robots.txt accessible at /robots.txt
- [ ] Service worker registered for PWA

### 3.4 Smoke Tests
Execute smoke test suite against production:
```
POST /api/v1/auth/register — new account creation
POST /api/v1/auth/login — authentication
GET /api/v1/products?limit=10 — product catalog
GET /api/v1/categories — category tree
GET /api/v1/sdui/homepage — homepage CMS content
POST /api/v1/cart/items — add to cart
GET /api/v1/checkout/preview — checkout calculation
GET /api/v1/flado/darkstores — quick-commerce stores
```

---

## SECTION 4 — Monitoring & Alerting

- [ ] Set up application performance monitoring (Datadog / New Relic / Sentry)
- [ ] Configure error rate alerting (threshold: > 1% 5xx in 5 min)
- [ ] Configure latency alerting (P95 > 500ms for 5 min)
- [ ] Configure database CPU alerting (> 80%)
- [ ] Configure Redis memory alerting (> 90%)
- [ ] Configure disk space alerting (> 80%)
- [ ] Configure health check uptime monitoring (pingdom/UptimeRobot)
- [ ] Set up log aggregation (ELK / CloudWatch / Papertrail)
- [ ] Configure PagerDuty/Opsgenie for on-call rotation

---

## SECTION 5 — Security Final Check

- [ ] Run `npm audit` across all workspaces — no critical vulnerabilities
- [ ] Run Trivy container scan — no critical CVEs
- [ ] Verify production JWT_SECRET is NOT the development placeholder
- [ ] Verify CORS_ORIGINS is correctly restricted to production domains
- [ ] Verify admin routes require Admin role (test with Customer JWT)
- [ ] Verify vendor routes require Vendor role
- [ ] Verify file upload size limits enforced (10MB max)
- [ ] Verify rate limiting on `/api/v1/auth/login` (10 req/min)
- [ ] Enable WAF managed ruleset

---

## SECTION 6 — Backup & Recovery

- [ ] Verify automated backup script runs: `scripts/backup.sh`
- [ ] Verify restore procedure: `scripts/restore.sh`
- [ ] Test point-in-time restore to staging
- [ ] Document recovery time objective (RTO < 1 hour)
- [ ] Document recovery point objective (RPO < 15 minutes)
- [ ] Store backup encryption keys securely (separate from backups)

---

## SECTION 7 — Rollback Plan

In case of critical issues post-deployment:

1. Switch load balancer to maintenance page (ETA: < 2 min)
2. Rollback Kubernetes deployment to previous image tag (ETA: < 5 min)
3. Revert last TypeORM migration if schema change: `npm run migration:revert`
4. Restore Redis cache if corrupted (flush + warm)
5. Notify users via status page

---

## Sign-Off

| Checklist Section | Verified By | Date |
|------------------|-------------|------|
| Section 1 — Infrastructure | | |
| Section 2 — Environment | | |
| Section 3 — Pre-Deployment | | |
| Section 4 — Monitoring | | |
| Section 5 — Security | | |
| Section 6 — Backup | | |
| Section 7 — Rollback Plan | | |

---

> **IMPORTANT**: Do NOT proceed to live deployment until all sections above
> are signed off. LIVE PRODUCTION DEPLOYMENT is currently PAUSED.

---

*RELEASE-002 | AuraMart Commerce OS v2.0.0-rc.1 | 2026-08-08*
