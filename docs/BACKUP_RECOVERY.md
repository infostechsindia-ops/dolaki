# AuraMart Commerce OS — Database Backup & Disaster Recovery Guide

## Overview
AuraMart provides automated database backup, restore, migration execution, and health check scripts under `scripts/`.

---

## 1. Automation Scripts

| Script | Path | Purpose |
|--------|------|---------|
| **Migration Runner** | [`scripts/run-migrations.sh`](file:///Users/arifalnukhbah/antigravity/AuraMart/scripts/run-migrations.sh) | Verifies DB health, creates pre-migration backup, runs TypeORM migrations. |
| **Database Backup** | [`scripts/backup-db.sh`](file:///Users/arifalnukhbah/antigravity/AuraMart/scripts/backup-db.sh) | Dumps database via `pg_dump` with timestamp and gzip compression. |
| **Database Restore** | [`scripts/restore-db.sh`](file:///Users/arifalnukhbah/antigravity/AuraMart/scripts/restore-db.sh) | Restores database snapshot using `pg_restore` or Docker fallback. |
| **Health Check** | [`scripts/check-db-health.sh`](file:///Users/arifalnukhbah/antigravity/AuraMart/scripts/check-db-health.sh) | Validates PostgreSQL connectivity. |

---

## 2. Backup Execution Example
```bash
# Create an on-demand database backup
./scripts/backup-db.sh "pre-release-v1.0"
```
