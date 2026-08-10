# AuraMart Commerce OS — Enterprise Platform
## Version 2.0.0-rc.1 — Release Candidate

AuraMart Commerce OS is an enterprise commerce operating system architected for multi-surface retail and quick-commerce operations. Built with NestJS 11, TypeORM, Next.js 16, and React Native (Expo).

---

## Workspace Structure

```
AuraMart Commerce OS v2.0.0-rc.1
├── backend/            NestJS 11 + TypeORM + PostgreSQL 16 + Redis 7
├── web/                Next.js 16 + React 19 Customer Web Application
├── admin/              Next.js 16 + React 19 Executive & Operations Console
├── vendor/             Next.js 16 + React 19 Vendor Portal
├── mobile/             React Native (Expo) — Customer, Rider, Warehouse, Darkstore
├── docker/             Production Docker & Nginx configurations
├── scripts/            Provisioning, backup, restore, and monitoring scripts
└── docs/               150+ Technical & Architectural Documentation Guides
```

---

## Quick Start (Development)

1. **Environment Setup**:
   Copy `.env.example` to `.env` in the root and configure database credentials.

2. **Database & Infrastructure**:
   ```bash
   docker compose up -d postgres redis
   ```

3. **Backend Service**:
   ```bash
   cd backend
   npm install
   npm run migration:run
   npm run start:dev
   ```

4. **Frontend Applications**:
   - Customer Web: `cd web && npm run dev` (http://localhost:3000)
   - Admin Console: `cd admin && npm run dev` (http://localhost:3003)
   - Vendor Portal: `cd vendor && npm run dev` (http://localhost:3001)

---

## Production Deployment

> **NOTE: LIVE PRODUCTION DEPLOYMENT IS CURRENTLY PAUSED.**

Refer to [`docs/PRODUCTION_CHECKLIST.md`](docs/PRODUCTION_CHECKLIST.md) and [`docs/DEPLOYMENT_MANIFEST.md`](docs/DEPLOYMENT_MANIFEST.md) for full operator activation procedures.

To provision a target Hostinger VPS server:
```bash
sudo bash scripts/vps-provision.sh
sudo -u auramart bash scripts/setup-databases.sh
sudo bash scripts/setup-nginx-ssl.sh
```

---

## Architecture & Documentation Index

See [`docs/ARCHITECTURE_INDEX.md`](docs/ARCHITECTURE_INDEX.md) for the master index of all 150+ architecture specifications and system guides.

---

## License

Copyright © 2026 AuraMart Commerce OS. All rights reserved.
See [LICENSE](LICENSE) for terms.
