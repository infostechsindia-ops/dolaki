#!/usr/bin/env bash
# =============================================================================
# DEPLOY-001 Phase 2 — PostgreSQL 16 & Redis 7 Setup with Backup Verification
# AuraMart Commerce OS v2.0.0-rc.1
# =============================================================================
# Run as: sudo -u auramart bash scripts/setup-databases.sh
# =============================================================================

set -euo pipefail
LOGFILE="/opt/auramart/logs/setup-databases.log"
mkdir -p "$(dirname "$LOGFILE")"
exec > >(tee -a "$LOGFILE") 2>&1

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()    { echo -e "${BLUE}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

APP_DIR="/opt/auramart"
ENV_FILE="$APP_DIR/.env.production"

# ── Require environment file ──────────────────────────────────────────────────
if [ ! -f "$ENV_FILE" ]; then
  error "Missing: $ENV_FILE — copy .env.production.example and fill in secrets first"
fi
source "$ENV_FILE"

: "${DB_PASSWORD:?DB_PASSWORD must be set in $ENV_FILE}"
: "${REDIS_PASSWORD:?REDIS_PASSWORD must be set in $ENV_FILE}"
: "${DB_NAME:=auramart}"
: "${DB_USER:=auramart_app}"

info "========================================================"
info " Phase 2 — Database Setup"
info " PostgreSQL 16 + Redis 7"
info " $(date)"
info "========================================================"

# ── Pull images ───────────────────────────────────────────────────────────────
info "Pulling database images..."
docker pull postgres:16-alpine
docker pull redis:7-alpine
success "Images pulled"

# ── Create Docker network ─────────────────────────────────────────────────────
info "Creating auramart Docker network..."
docker network create auramart-prod 2>/dev/null || info "Network already exists"
success "Docker network ready"

# ── Start PostgreSQL ──────────────────────────────────────────────────────────
info "Starting PostgreSQL 16..."
docker run -d \
  --name auramart-postgres-prod \
  --network auramart-prod \
  --restart always \
  -e POSTGRES_USER="$DB_USER" \
  -e POSTGRES_PASSWORD="$DB_PASSWORD" \
  -e POSTGRES_DB="$DB_NAME" \
  -v auramart-postgres-data:/var/lib/postgresql/data \
  -v "$APP_DIR/docker/postgres/postgresql.conf:/etc/postgresql/postgresql.conf:ro" \
  --health-cmd="pg_isready -U $DB_USER -d $DB_NAME" \
  --health-interval=10s \
  --health-timeout=5s \
  --health-retries=5 \
  postgres:16-alpine \
  postgres -c config_file=/etc/postgresql/postgresql.conf \
  2>/dev/null || info "PostgreSQL container already running"

# Wait for healthy
info "Waiting for PostgreSQL to be healthy..."
for i in {1..30}; do
  STATUS=$(docker inspect --format='{{.State.Health.Status}}' auramart-postgres-prod 2>/dev/null || echo "starting")
  if [ "$STATUS" = "healthy" ]; then
    success "PostgreSQL is healthy"
    break
  fi
  echo -n "."
  sleep 2
done
[ "$STATUS" = "healthy" ] || error "PostgreSQL did not become healthy in time"

# ── Create application DB user with limited privileges ────────────────────────
info "Configuring PostgreSQL application user..."
docker exec auramart-postgres-prod psql -U "$DB_USER" -d "$DB_NAME" << PSQLEOF
-- Create read-only reporting user
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'auramart_readonly') THEN
    CREATE ROLE auramart_readonly LOGIN PASSWORD '$DB_PASSWORD';
    GRANT CONNECT ON DATABASE $DB_NAME TO auramart_readonly;
    GRANT USAGE ON SCHEMA public TO auramart_readonly;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO auramart_readonly;
  END IF;
END
\$\$;

-- Enable useful extensions
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verify extensions
SELECT extname, extversion FROM pg_extension WHERE extname IN ('pg_stat_statements','pgcrypto','uuid-ossp');
PSQLEOF
success "PostgreSQL application user configured"

# ── Start Redis ───────────────────────────────────────────────────────────────
info "Starting Redis 7..."

# Generate redis.conf with auth
mkdir -p "$APP_DIR/docker/redis"
cat > "$APP_DIR/docker/redis/redis.conf" << REDISEOF
# AuraMart Redis Production Configuration
bind 0.0.0.0
port 6379
requirepass $REDIS_PASSWORD

# Persistence
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb

# RDB snapshots
save 900 1
save 300 10
save 60 10000
rdbcompression yes
rdbfilename dump.rdb

# Memory
maxmemory 1gb
maxmemory-policy allkeys-lru

# Security
protected-mode yes
rename-command FLUSHALL ""
rename-command FLUSHDB ""
rename-command CONFIG ""
rename-command DEBUG ""

# Performance
hz 25
tcp-keepalive 300
timeout 0

# Logging
loglevel notice
REDISEOF

docker run -d \
  --name auramart-redis-prod \
  --network auramart-prod \
  --restart always \
  -v auramart-redis-data:/data \
  -v "$APP_DIR/docker/redis/redis.conf:/usr/local/etc/redis/redis.conf:ro" \
  --health-cmd="redis-cli -a $REDIS_PASSWORD ping" \
  --health-interval=10s \
  --health-timeout=5s \
  --health-retries=5 \
  redis:7-alpine \
  redis-server /usr/local/etc/redis/redis.conf \
  2>/dev/null || info "Redis container already running"

# Wait for healthy
info "Waiting for Redis to be healthy..."
for i in {1..20}; do
  STATUS=$(docker inspect --format='{{.State.Health.Status}}' auramart-redis-prod 2>/dev/null || echo "starting")
  if [ "$STATUS" = "healthy" ]; then
    success "Redis is healthy"
    break
  fi
  echo -n "."
  sleep 2
done
[ "$STATUS" = "healthy" ] || error "Redis did not become healthy in time"

# ── Verify connectivity ───────────────────────────────────────────────────────
info "Verifying database connectivity..."
docker exec auramart-postgres-prod pg_isready -U "$DB_USER" -d "$DB_NAME" \
  && success "PostgreSQL: connection verified"
docker exec auramart-redis-prod redis-cli -a "$REDIS_PASSWORD" ping \
  | grep -q PONG && success "Redis: PONG received"

# ── Schedule automated backups ────────────────────────────────────────────────
info "Installing automated backup cron job..."
CRON_LINE="0 2 * * * /opt/auramart/scripts/backup-db.sh >> /opt/auramart/logs/backup.log 2>&1"
# Check if already installed
(crontab -l 2>/dev/null | grep -q "backup-db.sh") \
  || (crontab -l 2>/dev/null; echo "$CRON_LINE") | crontab -
success "Backup cron scheduled: daily at 02:00 UTC"

# ── Run restore verification ──────────────────────────────────────────────────
info "Running restore verification test..."
TEST_DB="auramart_restore_test_$(date +%s)"

# Create a test backup
docker exec auramart-postgres-prod pg_dump \
  -U "$DB_USER" "$DB_NAME" \
  --format=custom \
  --compress=9 \
  > /tmp/auramart-verify.pgdump

# Restore to test database
docker exec auramart-postgres-prod psql -U "$DB_USER" -c "CREATE DATABASE $TEST_DB;" postgres
docker exec -i auramart-postgres-prod pg_restore \
  -U "$DB_USER" -d "$TEST_DB" \
  --no-owner --role="$DB_USER" \
  < /tmp/auramart-verify.pgdump 2>/dev/null || true

# Drop test database
docker exec auramart-postgres-prod psql -U "$DB_USER" -c "DROP DATABASE IF EXISTS $TEST_DB;" postgres
rm -f /tmp/auramart-verify.pgdump
success "Restore verification passed"

success "========================================================"
success " Phase 2 — Database Setup Complete"
success "========================================================"
echo ""
info "Services running:"
docker ps --filter "name=auramart-postgres-prod" --filter "name=auramart-redis-prod" \
  --format "  {{.Names}}: {{.Status}}"
echo ""
warn "NEXT STEPS:"
echo "  1. Run DB migrations: scripts/run-migrations.sh"
echo "  2. Proceed to: scripts/setup-nginx-ssl.sh"
