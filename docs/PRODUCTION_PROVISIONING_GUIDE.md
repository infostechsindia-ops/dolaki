# AuraMart Platform — Production Infrastructure Provisioning Guide (DEPLOY-004A)

## Executive Summary
This document provides exact, non-sensitive step-by-step instructions for provisioning production cloud infrastructure (Managed PostgreSQL & Container Runtime) for the **AuraMart Commerce OS Backend Service**.

---

## 1. Selected Production Architecture

```
   [ Client Apps (Web / Mobile / Admin / Vendor) ]
                           │
                           ▼ HTTPS / TLS
              ┌──────────────────────────┐
              │  AuraMart NestJS Backend │
              │   Container Service      │
              │  (Node 20 Alpine Runner) │
              └────────────┬─────────────┘
                           │
                           │ Encrypted TLS / SSL (Port 5432)
                           ▼
              ┌──────────────────────────┐
              │ Managed PostgreSQL DB    │
              │  (RDS / Neon / Supabase) │
              └──────────────────────────┘
```

---

## 2. Step-by-Step User Provisioning Action Items

### Option A: Railway / Render / Fly.io (Recommended for Fast Launch)
1. **Create Managed PostgreSQL Instance**:
   - Create a new PostgreSQL database (PostgreSQL 15+).
   - Copy the connection string (`DATABASE_URL`).

2. **Deploy Container Service**:
   - Connect repository `backend/Dockerfile` to the service.
   - Inject environment variables in provider dashboard:
     - `NODE_ENV=production`
     - `PORT=5000`
     - `DATABASE_URL=postgres://...`
     - `DB_SSL=true`
     - `JWT_SECRET=<Generate 256-bit cryptographically secure key>`
     - `FRONTEND_URL=https://auramart.com`
     - `VENDOR_URL=https://vendor.auramart.com`
     - `ADMIN_URL=https://admin.auramart.com`
     - `CORS_ORIGINS=https://auramart.com,https://vendor.auramart.com,https://admin.auramart.com`

3. **Execute Production Database Migrations**:
   - Run build command / release phase: `npm run migration:run`.

4. **Verify Health & Readiness**:
   - Test `GET https://your-app.up.railway.app/api/v1/health`
   - Test `GET https://your-app.up.railway.app/api/v1/ready`

---

### Option B: AWS Infrastructure (RDS PostgreSQL & AWS ECS / App Runner)
1. **Provision AWS RDS PostgreSQL**:
   - Create PostgreSQL 15+ RDS instance in private subnet (`DB_NAME=auramart_prod`).
   - Enable Automated Daily Snapshots (7+ day retention).
   - Configure Security Group allowing inbound port 5432 from ECS task security group.

2. **Configure AWS Secrets Manager**:
   - Store `DATABASE_URL` and `JWT_SECRET` in AWS Secrets Manager.

3. **Build & Push ECR Image**:
   ```bash
   aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <aws-account-id>.dkr.ecr.ap-south-1.amazonaws.com
   docker build -t auramart-backend:v1.0.0 backend/
   docker tag auramart-backend:v1.0.0 <aws-account-id>.dkr.ecr.ap-south-1.amazonaws.com/auramart-backend:v1.0.0
   docker push <aws-account-id>.dkr.ecr.ap-south-1.amazonaws.com/auramart-backend:v1.0.0
   ```

4. **Execute Pre-Rollout Migration**:
   ```bash
   DATABASE_URL="postgres://..." npm run migration:run
   ```

---

## 3. Cryptographic JWT Secret Generation

Run this command in your terminal to generate a production-grade 256-bit JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the generated hex string directly into your cloud provider's secret manager under `JWT_SECRET`. **Do NOT output or paste this key into source code or chat logs.**
