# AuraMart Commerce OS — Docker & Containerization Guide

## Overview
AuraMart uses multi-stage Docker builds based on Node 20 LTS. All production containers run as non-root users (`nestjs` / `nextjs`), expose standard application ports, and define automated healthchecks.

---

## 1. Container Inventory

| Application | Path | Base Image | Multi-Stage | Port | Healthcheck Target | User |
|-------------|------|------------|-------------|------|--------------------|------|
| **Backend API** | [`backend/Dockerfile`](file:///Users/arifalnukhbah/antigravity/AuraMart/backend/Dockerfile) | `node:20-alpine` | Yes (Builder -> Runner) | 5000 | `/api/v1/health/liveness` | `nestjs` |
| **Customer Web** | [`web/Dockerfile`](file:///Users/arifalnukhbah/antigravity/AuraMart/web/Dockerfile) | `node:20-alpine` | Yes (Deps -> Builder -> Runner) | 3000 | `/` | `nextjs` |
| **Vendor Portal** | [`vendor/Dockerfile`](file:///Users/arifalnukhbah/antigravity/AuraMart/vendor/Dockerfile) | `node:20-alpine` | Yes (Deps -> Builder -> Runner) | 3001 | `/` | `nextjs` |
| **Admin Platform** | [`admin/Dockerfile`](file:///Users/arifalnukhbah/antigravity/AuraMart/admin/Dockerfile) | `node:20-alpine` | Yes (Deps -> Builder -> Runner) | 3003 | `/` | `nextjs` |
| **Customer Mobile** | [`mobile/Dockerfile`](file:///Users/arifalnukhbah/antigravity/AuraMart/mobile/Dockerfile) | `nginx:1.25-alpine` | Yes (Expo Export -> Nginx) | 80 | `/` | `nginx` |

---

## 2. Docker Commands

### Local Development Stack
```bash
# Start full local stack
docker compose up -d

# View service logs
docker compose logs -f backend

# Stop local stack
docker compose down
```

### Production Orchestration Verification
```bash
# Validate production compose syntax
docker compose -f docker-compose.prod.yml config
```
