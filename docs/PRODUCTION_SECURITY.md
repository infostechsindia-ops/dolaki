# AuraMart Production Security Runbook (SECURITY-001)

## 1. Pre-Deployment Secret Verification

Before unpausing live production deployment:

1. `JWT_SECRET`: Must be set to a cryptographically secure 64-character random string.
2. `DB_PASSWORD`: Must be set to a strong PostgreSQL cluster password.
3. `CORS_ORIGINS`: Must be limited strictly to production domain names e.g., `https://auramart.in`.
4. `NODE_ENV`: Must be set to `production`.
