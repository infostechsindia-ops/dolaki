# Production Rollback & Emergency Recovery Runbook
## AuraMart Commerce OS v2.0.0-rc.1 | Date: 2026-08-08

---

## 1. Automatic Rollback Triggers

Automatic rollback is triggered immediately under the following conditions:
1. Health check HTTP 5xx error rate $> 1.0\%$ over 2 consecutive minutes.
2. NestJS backend container crashing or failing liveness probe (`/health/liveness`).
3. Unhandled database migration lock error.

---

## 2. Emergency Rollback Execution

```bash
# Execute automated deployment rollback
bash scripts/rollback.sh

# Restore PostgreSQL database from latest verified snapshot
bash scripts/restore-db.sh /backups/postgres_20260808.dump
```

---

*Document generated for LAUNCH-001A.*
