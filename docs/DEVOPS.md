# AuraMart Commerce OS — Master DevOps Architecture Guide

## Overview
This document serves as the master guide for the DevOps foundation, containerization strategy, CI/CD automation, monitoring stack, database management, and deployment workflows for AuraMart Commerce OS.

---

## 1. System Architecture
```
                         +--------------------------+
                         |      Nginx Proxy         |
                         |   (Port 80/443, SSL)     |
                         +------------+-------------+
                                      |
         +----------------------------+----------------------------+
         |                            |                            |
         v                            v                            v
+------------------+        +------------------+        +------------------+
|   Customer Web   |        |  Vendor Portal   |        |  Admin Platform  |
|   (Next.js:3000) |        |  (Next.js:3001)  |        |  (Next.js:3003)  |
+------------------+        +------------------+        +------------------+
         |                            |                            |
         +----------------------------+----------------------------+
                                      |
                                      v
                         +--------------------------+
                         |     Backend NestJS       |
                         |        (Port 5000)       |
                         +------------+-------------+
                                      |
                      +---------------+---------------+
                      |                               |
                      v                               v
           +--------------------+           +--------------------+
           |  PostgreSQL DB     |           |     Redis Cache    |
           |    (Port 5432)     |           |     (Port 6379)    |
           +--------------------+           +--------------------+
```

---

## 2. Component Directory
- [`docker-compose.yml`](file:///Users/arifalnukhbah/antigravity/AuraMart/docker-compose.yml): Local multi-container development environment.
- [`docker-compose.prod.yml`](file:///Users/arifalnukhbah/antigravity/AuraMart/docker-compose.prod.yml): Production container orchestration template.
- [`docker/nginx/`](file:///Users/arifalnukhbah/antigravity/AuraMart/docker/nginx): Nginx reverse proxy configuration & virtual hosts.
- [`docker/postgres/`](file:///Users/arifalnukhbah/antigravity/AuraMart/docker/postgres): PostgreSQL performance tuning configuration.
- [`docker/redis/`](file:///Users/arifalnukhbah/antigravity/AuraMart/docker/redis): Redis persistence & memory management.
- [`docker/monitoring/`](file:///Users/arifalnukhbah/antigravity/AuraMart/docker/monitoring): Prometheus, Grafana, Loki, Alertmanager stack.
- [`scripts/`](file:///Users/arifalnukhbah/antigravity/AuraMart/scripts): Database backup, restore, migration, health check, blue/green deployment, and smoke testing scripts.
- [`.github/workflows/`](file:///Users/arifalnukhbah/antigravity/AuraMart/.github/workflows): GitHub Actions CI/CD workflows.

---

## 3. Production Constraints
> [!IMPORTANT]
> **LIVE PRODUCTION DEPLOYMENT IS PAUSED.**
> Do NOT connect to production infrastructure, provision cloud instances, change DNS records, or use live API credentials. All operational scripts run in repository-local simulation mode.
