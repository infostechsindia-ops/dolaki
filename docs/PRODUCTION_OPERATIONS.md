# AuraMart Commerce OS — Production Operations & Maintenance Manual

## Overview
This document outlines standard operating procedures for cluster maintenance, secret rotation, certificate renewal, and incident response for AuraMart.

---

## 1. Operating Procedures

### Secret Rotation Procedure
1. Update database passwords or JWT secrets in production environment store.
2. Run `./scripts/deploy-blue-green.sh` to roll out updated secret environment variables without downtime.
3. Validate backend logs via Grafana/Loki.

### SSL Certificate Renewal
Nginx virtual host is configured for Let's Encrypt Certbot ACME webroot challenge:
```bash
docker run -it --rm --name certbot \
  -v "/etc/letsencrypt:/etc/nginx/ssl" \
  -v "/var/www/certbot:/var/www/certbot" \
  certbot/certbot renew
```

---

## 2. Emergency Incident Contacts & Runbooks
- **High Error Rate**: Check Loki logs -> Inspect backend stack via `docker logs auramart-backend-prod` -> If code defect, execute `./scripts/rollback.sh`.
- **Database Connection Pool Exhaustion**: Check `pg_stat_database` in Grafana -> Increase `max_connections` in `docker/postgres/postgresql.conf`.
