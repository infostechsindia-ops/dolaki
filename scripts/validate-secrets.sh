#!/usr/bin/env bash
# =============================================================================
# DEPLOY-001 Phase 6 — Secrets & Environment Variables Validator
# AuraMart Commerce OS v2.0.0-rc.1
# =============================================================================
# Usage: bash scripts/validate-secrets.sh [.env.production]
# =============================================================================

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()    { echo -e "${BLUE}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*"; }

ENV_FILE="${1:-.env.production}"

if [ ! -f "$ENV_FILE" ]; then
  if [ -f "/opt/auramart/.env.production" ]; then
    ENV_FILE="/opt/auramart/.env.production"
  elif [ -f ".env.production.example" ]; then
    ENV_FILE=".env.production.example"
  fi
fi

info "Validating environment file: $ENV_FILE"

ERRORS=0
WARNINGS=0

check_secret() {
  local var_name="$1"
  local min_len="${2:-1}"
  local forbid_default="${3:-true}"
  local val
  val=$(grep -E "^${var_name}=" "$ENV_FILE" | cut -d'=' -f2- | tr -d '"' | tr -d "'" || true)

  if [ -z "$val" ]; then
    error "MISSING: $var_name is not set or empty"
    ERRORS=$((ERRORS + 1))
    return
  fi

  if [ "$forbid_default" = "true" ]; then
    if [[ "$val" == *"auramart-secret-key"* ]] || [[ "$val" == *"change_me"* ]] || [[ "$val" == *"postgrespassword"* ]]; then
      error "SECURITY RISK: $var_name contains default development placeholder value: '$val'"
      ERRORS=$((ERRORS + 1))
      return
    fi
  fi

  if [ "${#val}" -lt "$min_len" ]; then
    error "INVALID: $var_name length is ${#val}, required at least $min_len characters"
    ERRORS=$((ERRORS + 1))
    return
  fi

  success "VALID: $var_name"
}

# ── Core Backend & Database ──────────────────────────────────────────────────
check_secret "NODE_ENV" 3 false
check_secret "PORT" 2 false
check_secret "DB_HOST" 1 false
check_secret "DB_PORT" 2 false
check_secret "DB_USER" 1 false
check_secret "DB_PASSWORD" 12 true
check_secret "DB_NAME" 1 false
check_secret "REDIS_HOST" 1 false
check_secret "REDIS_PORT" 2 false
check_secret "REDIS_PASSWORD" 12 true
check_secret "JWT_SECRET" 32 true

# ── Storage & CDN ────────────────────────────────────────────────────────────
check_secret "STORAGE_PROVIDER" 2 false
check_secret "STORAGE_BUCKET" 3 false
check_secret "STORAGE_ACCESS_KEY" 8 true
check_secret "STORAGE_SECRET_KEY" 16 true

# ── Monitoring & Admin ───────────────────────────────────────────────────────
check_secret "GRAFANA_ADMIN_PASSWORD" 12 true

info "--------------------------------------------------------"
if [ "$ERRORS" -gt 0 ]; then
  echo -e "${RED}FAILED:${NC} $ERRORS validation error(s) found in $ENV_FILE."
  exit 1
else
  echo -e "${GREEN}PASSED:${NC} All required production secrets are valid and meet entropy requirements."
fi
