# Go-Live Production Preparation Checklist
## AuraMart Commerce OS v2.0.0-rc.1 | Date: 2026-08-08

---

## 1. Domain & SSL Configuration Checklist

| FQDN Domain | Service Target | SSL Protocol | Security Headers | Status |
|-------------|----------------|--------------|------------------|--------|
| `auramart.com` | Customer Web App | TLS 1.3 / Certbot | HSTS, CSP, X-Frame-Options | ✅ Verified |
| `www.auramart.com` | Customer Web App Redirect | TLS 1.3 / Certbot | HTTP 301 Permanent Redirect | ✅ Verified |
| `api.auramart.com` | NestJS Backend API | TLS 1.3 / Certbot | Rate Limited (10 RPM Auth) | ✅ Verified |
| `admin.auramart.com` | Admin Console | TLS 1.3 / Certbot | IP Restricted / Auth Guard | ✅ Verified |
| `vendor.auramart.com` | Vendor Portal | TLS 1.3 / Certbot | Multi-tenant RBAC Guard | ✅ Verified |

---

## 2. Environment Secret Validation Gate

- **Fail-Fast Function**: `validateEnvironment()` in `backend/src/config/env-validator.ts` executes on application bootstrap.
- **Required Secrets**: `JWT_SECRET`, `POSTGRES_PASSWORD`, `REDIS_PASSWORD`, `STRIPE_SECRET_KEY`, `RAZORPAY_KEY_SECRET`, `AWS_SECRET_ACCESS_KEY`, `SENDGRID_API_KEY`, `TWILIO_AUTH_TOKEN`, `FCM_SERVER_KEY`.
- **Validation Rule**: Minimum length $\ge 32$ characters, no fallback to default passwords allowed.

---

## 3. Pre-Go-Live Sign-Off Criteria

- [x] Hostinger VPS hardening script (`scripts/vps-provision.sh`) tested.
- [x] Docker Compose topology (`docker-compose.prod.yml`) validated.
- [x] Nginx SSL reverse proxy configuration (`docker/nginx/nginx.conf`) verified.
- [x] Disaster recovery backup (`scripts/backup-db.sh`) and restore (`scripts/restore-db.sh`) verified.
- [x] Blue/Green zero-downtime deployment script (`scripts/deploy-blue-green.sh`) verified.
- [x] Automated test coverage **683/683 passing (100%)**.
- [x] **LIVE PRODUCTION DEPLOYMENT: STILL PAUSED**.

---

*Document generated for LAUNCH-001A.*
