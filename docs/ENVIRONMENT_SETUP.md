# AuraMart Commerce OS — Environment Setup & Configuration Guide

## 1. Quick Start
To set up AuraMart for local development:
```bash
# 1. Copy development environment template
cp .env.example .env

# 2. Start backend development server
cd backend && npm run start:dev

# 3. In separate terminal tabs, start web, vendor, and admin apps
cd web && npm run dev
cd vendor && npm run dev
cd admin && npm run dev
```

---

## 2. Production Environment Verification
Before deploying to cloud infrastructure:
1. Copy `.env.production.example` to `.env`.
2. Ensure `NODE_ENV=production` and `JWT_SECRET` is populated with a custom secret.
3. Configure `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
4. Run startup validation check: `validateEnvironment(true)` will verify all required secrets before allowing the process to bind to port 5000.
