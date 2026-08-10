# Production Deployment Runbook & Operational Procedures
## AuraMart Commerce OS v2.0.0-rc.1 | Date: 2026-08-08

---

## 1. Deployment Execution Workflow

```
[ENVIRONMENT VALIDATION] ──> [DATABASE MIGRATION] ──> [BLUE/GREEN DEPLOYMENT] ──> [SMOKE TESTING] ──> [TRAFFIC CUTOVER]
```

### Step 1: Execute Infrastructure Provisioning
```bash
# Provision VPS hardening, UFW firewall, fail2ban
bash scripts/vps-provision.sh

# Provision PostgreSQL 16 & Redis 7 databases
bash scripts/setup-databases.sh

# Configure Nginx SSL and Let's Encrypt certificates
bash scripts/setup-nginx-ssl.sh
```

### Step 2: Validate Production Environment Variables
```bash
# Execute fail-fast secret entropy validator
bash scripts/validate-secrets.sh
```

### Step 3: Zero-Downtime Blue/Green Deployment
```bash
# Build and spin up green containers alongside active blue environment
bash scripts/deploy-blue-green.sh
```

### Step 4: Health Check Verification
```bash
# Verify backend readiness & liveness probes
curl -f https://api.auramart.com/health/readiness
```

---

*Document generated for LAUNCH-001A.*
