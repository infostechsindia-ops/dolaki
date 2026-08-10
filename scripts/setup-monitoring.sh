#!/usr/bin/env bash
# =============================================================================
# DEPLOY-001 Phase 5 — Monitoring Stack (Prometheus, Grafana, Loki, Alertmanager)
# AuraMart Commerce OS v2.0.0-rc.1
# =============================================================================
# Run as: sudo -u auramart bash scripts/setup-monitoring.sh
# =============================================================================

set -euo pipefail
LOGFILE="/opt/auramart/logs/setup-monitoring.log"
mkdir -p "$(dirname "$LOGFILE")"
exec > >(tee -a "$LOGFILE") 2>&1

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()    { echo -e "${BLUE}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

APP_DIR="/opt/auramart"
ENV_FILE="$APP_DIR/.env.production"
[ -f "$ENV_FILE" ] && source "$ENV_FILE"

: "${GRAFANA_ADMIN_PASSWORD:?GRAFANA_ADMIN_PASSWORD must be set in $ENV_FILE}"

info "========================================================"
info " Phase 5 — Monitoring Stack Provisioning"
info " Prometheus, Grafana, Loki, Alertmanager, Exporters"
info " $(date)"
info "========================================================"

info "Starting monitoring docker compose stack..."
docker compose -f "$APP_DIR/docker-compose.monitoring.yml" up -d

info "Waiting for monitoring stack containers to become healthy..."
sleep 10

containers=(
  "auramart-prometheus"
  "auramart-grafana"
  "auramart-loki"
  "auramart-alertmanager"
  "auramart-postgres-exporter"
  "auramart-redis-exporter"
  "auramart-nginx-exporter"
  "auramart-node-exporter"
)

for c in "${containers[@]}"; do
  if docker ps --format '{{.Names}}' | grep -q "^${c}$"; then
    success "Container ${c} is running"
  else
    warn "Container ${c} is not running!"
  fi
done

success "========================================================"
success " Phase 5 — Monitoring Stack Complete"
success "========================================================"
echo ""
info "Monitoring URLs (Bound to 127.0.0.1 - Use SSH Tunnel to access):"
echo "  📊 Grafana:      http://127.0.0.1:3100 (User: admin / Pass: configured in .env.production)"
echo "  🔥 Prometheus:   http://127.0.0.1:9090"
echo "  📋 Loki:         http://127.0.0.1:3101"
echo "  🚨 Alertmanager: http://127.0.0.1:9093"
echo ""
warn "NEXT STEPS: Run scripts/validate-secrets.sh"
