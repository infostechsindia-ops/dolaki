#!/usr/bin/env bash
# =============================================================================
# DEPLOY-001 Phase 3 — Nginx + SSL/TLS + HTTPS Setup
# AuraMart Commerce OS v2.0.0-rc.1
# =============================================================================
# Run as: sudo bash scripts/setup-nginx-ssl.sh
# Prerequisites: Phase 1 & 2 complete, DNS A records pointing to this VPS IP
# =============================================================================

set -euo pipefail
LOGFILE="/opt/auramart/logs/setup-nginx-ssl.log"
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

: "${DOMAIN:?DOMAIN must be set (e.g. DOMAIN=auramart.com)}"

info "========================================================"
info " Phase 3 — Nginx + SSL Setup"
info " Domain: $DOMAIN"
info " $(date)"
info "========================================================"

# ── Install Certbot ───────────────────────────────────────────────────────────
info "Installing Certbot (Let's Encrypt)..."
apt-get install -y certbot python3-certbot-nginx
success "Certbot installed"

# ── Generate DH Parameters ────────────────────────────────────────────────────
info "Generating 2048-bit DH parameters (may take a minute)..."
SSL_DIR="/etc/nginx/ssl"
mkdir -p "$SSL_DIR"
if [ ! -f "$SSL_DIR/dhparam.pem" ]; then
  openssl dhparam -out "$SSL_DIR/dhparam.pem" 2048
  success "DH parameters generated"
else
  success "DH parameters already exist"
fi

# ── Write Nginx snippets ──────────────────────────────────────────────────────
info "Writing Nginx SSL security snippet..."
mkdir -p /etc/nginx/snippets

cat > /etc/nginx/snippets/ssl-params.conf << 'SSLEOF'
# AuraMart SSL/TLS Hardening Snippet
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256;

ssl_session_timeout 1d;
ssl_session_cache shared:SSL:50m;
ssl_session_tickets off;

ssl_dhparam /etc/nginx/ssl/dhparam.pem;
ssl_stapling on;
ssl_stapling_verify on;
resolver 1.1.1.1 8.8.8.8 valid=300s;
resolver_timeout 5s;
SSLEOF

cat > /etc/nginx/snippets/security-headers.conf << 'SECEOF'
# AuraMart Security Headers Snippet
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(self), payment=(self)" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none';" always;
SECEOF

success "Security snippets written"

# ── Write Nginx Virtual Hosts ─────────────────────────────────────────────────
info "Writing Nginx virtual host configurations..."
CONF_DIR="/etc/nginx/conf.d"
mkdir -p "$CONF_DIR"

# Step 1: HTTP-only config for Certbot ACME challenge
cat > "$CONF_DIR/auramart.conf" << NGINXEOF
# AuraMart — HTTP (pre-SSL bootstrap)
# This file will be replaced by the full HTTPS config after cert issuance

# Redirect all HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN api.$DOMAIN admin.$DOMAIN vendor.$DOMAIN;

    # Let's Encrypt ACME challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Temporary HTTP response for health checks (pre-SSL)
    location /health {
        return 200 "AuraMart pre-SSL health check OK\n";
        add_header Content-Type text/plain;
    }

    # Block everything else until SSL is ready
    location / {
        return 301 https://\$host\$request_uri;
    }
}
NGINXEOF

success "Bootstrap Nginx config written"

# ── Install Nginx ─────────────────────────────────────────────────────────────
info "Installing Nginx..."
apt-get install -y nginx
systemctl enable nginx

# Write main nginx.conf
cat > /etc/nginx/nginx.conf << 'MAINNGINX'
user www-data;
worker_processes auto;
pid /run/nginx.pid;
worker_rlimit_nofile 65536;
error_log /var/log/nginx/error.log warn;

events {
    worker_connections 4096;
    multi_accept on;
    use epoll;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # JSON access log format for Loki ingestion
    log_format json_combined escape=json
      '{"time":"$time_iso8601",'
      '"remote_addr":"$remote_addr",'
      '"method":"$request_method",'
      '"uri":"$request_uri",'
      '"status":$status,'
      '"bytes_sent":$body_bytes_sent,'
      '"request_time":$request_time,'
      '"upstream_time":"$upstream_response_time",'
      '"referrer":"$http_referer",'
      '"user_agent":"$http_user_agent",'
      '"x_forwarded_for":"$http_x_forwarded_for"}';

    access_log /var/log/nginx/access.log json_combined;

    # Optimisations
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;
    client_max_body_size 50M;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 1000;
    gzip_types
        text/plain text/css application/json application/javascript
        text/xml application/xml application/xml+rss text/javascript
        image/svg+xml font/woff font/woff2;

    # Rate-limiting zones
    limit_req_zone $binary_remote_addr zone=api:20m rate=60r/s;
    limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;
    limit_req_zone $binary_remote_addr zone=checkout:10m rate=10r/m;
    limit_conn_zone $binary_remote_addr zone=addr:10m;

    # Real-IP restoration (Cloudflare / LB)
    real_ip_header X-Forwarded-For;
    real_ip_recursive on;

    # Include virtual hosts
    include /etc/nginx/conf.d/*.conf;
}
MAINNGINX

nginx -t && systemctl restart nginx
success "Nginx started"

# ── Obtain SSL Certificate ────────────────────────────────────────────────────
info "Requesting Let's Encrypt SSL certificate..."
mkdir -p /var/www/certbot

certbot certonly \
  --nginx \
  --non-interactive \
  --agree-tos \
  --email "devops@${DOMAIN}" \
  -d "$DOMAIN" \
  -d "www.${DOMAIN}" \
  -d "api.${DOMAIN}" \
  -d "admin.${DOMAIN}" \
  -d "vendor.${DOMAIN}" \
  || warn "Certbot failed — check DNS records are pointing to this IP before retrying"

CERT_PATH="/etc/letsencrypt/live/${DOMAIN}"
if [ -d "$CERT_PATH" ]; then
  success "SSL certificate obtained for $DOMAIN"

  # ── Write Full HTTPS Virtual Host Config ───────────────────────────────────
  info "Writing production HTTPS virtual host configurations..."

  cat > "$CONF_DIR/auramart.conf" << FULLNGINX
# ──────────────────────────────────────────────────────────────────────────────
# AuraMart Commerce OS — Production Nginx Virtual Hosts
# Generated by DEPLOY-001 Phase 3 on $(date)
# ──────────────────────────────────────────────────────────────────────────────

# Global upstream definitions
upstream backend_upstream {
    server 127.0.0.1:5000;
    keepalive 64;
}
upstream web_upstream {
    server 127.0.0.1:3000;
    keepalive 32;
}
upstream admin_upstream {
    server 127.0.0.1:3003;
    keepalive 16;
}
upstream vendor_upstream {
    server 127.0.0.1:3001;
    keepalive 16;
}

# ── HTTP → HTTPS Redirect ────────────────────────────────────────────────────
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN api.$DOMAIN admin.$DOMAIN vendor.$DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

# ── Main Customer Website: https://$DOMAIN ─────────────────────────────────
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    ssl_certificate $CERT_PATH/fullchain.pem;
    ssl_certificate_key $CERT_PATH/privkey.pem;
    ssl_trusted_certificate $CERT_PATH/chain.pem;

    include /etc/nginx/snippets/ssl-params.conf;
    include /etc/nginx/snippets/security-headers.conf;

    limit_conn addr 50;

    # Static assets — long cache
    location /_next/static/ {
        proxy_pass http://web_upstream;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Vary Accept-Encoding;
    }

    location /api/v1/ {
        limit_req zone=api burst=80 nodelay;
        proxy_pass http://backend_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 30s;
        proxy_connect_timeout 5s;
    }

    location /api/v1/auth/ {
        limit_req zone=auth burst=5 nodelay;
        proxy_pass http://backend_upstream;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /api/v1/checkout/ {
        limit_req zone=checkout burst=10 nodelay;
        proxy_pass http://backend_upstream;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location / {
        proxy_pass http://web_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 30s;
    }
}

# ── API: https://api.$DOMAIN ────────────────────────────────────────────────
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.$DOMAIN;

    ssl_certificate $CERT_PATH/fullchain.pem;
    ssl_certificate_key $CERT_PATH/privkey.pem;
    ssl_trusted_certificate $CERT_PATH/chain.pem;

    include /etc/nginx/snippets/ssl-params.conf;
    include /etc/nginx/snippets/security-headers.conf;

    limit_conn addr 100;

    location /api/v1/ {
        limit_req zone=api burst=120 nodelay;
        proxy_pass http://backend_upstream;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 30s;
    }

    location /api/v1/auth/ {
        limit_req zone=auth burst=5 nodelay;
        proxy_pass http://backend_upstream;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /health {
        proxy_pass http://backend_upstream/api/v1/health/liveness;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
    }
}

# ── Admin Console: https://admin.$DOMAIN ────────────────────────────────────
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name admin.$DOMAIN;

    ssl_certificate $CERT_PATH/fullchain.pem;
    ssl_certificate_key $CERT_PATH/privkey.pem;
    ssl_trusted_certificate $CERT_PATH/chain.pem;

    include /etc/nginx/snippets/ssl-params.conf;
    include /etc/nginx/snippets/security-headers.conf;

    # Restrict admin to known IP ranges (configure per deployment)
    # allow 203.0.113.0/24;  # Office IP range
    # deny all;

    location / {
        proxy_pass http://admin_upstream;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}

# ── Vendor Portal: https://vendor.$DOMAIN ───────────────────────────────────
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name vendor.$DOMAIN;

    ssl_certificate $CERT_PATH/fullchain.pem;
    ssl_certificate_key $CERT_PATH/privkey.pem;
    ssl_trusted_certificate $CERT_PATH/chain.pem;

    include /etc/nginx/snippets/ssl-params.conf;
    include /etc/nginx/snippets/security-headers.conf;

    location / {
        proxy_pass http://vendor_upstream;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
FULLNGINX

  nginx -t && systemctl reload nginx
  success "Full HTTPS configuration applied"
else
  warn "Certificate not obtained — running in HTTP-only mode"
  warn "Ensure DNS records point to this server's IP, then re-run Phase 3"
fi

# ── Auto-renewal Cron ─────────────────────────────────────────────────────────
info "Setting up Certbot auto-renewal..."
RENEW_CRON="0 3 * * 0 certbot renew --quiet --post-hook 'nginx -s reload' >> /var/log/letsencrypt-renew.log 2>&1"
(crontab -l 2>/dev/null | grep -q "certbot renew") \
  || (crontab -l 2>/dev/null; echo "$RENEW_CRON") | crontab -
success "SSL auto-renewal scheduled (weekly, 03:00 UTC)"

success "========================================================"
success " Phase 3 — Nginx + SSL Complete"
success "========================================================"
echo ""
info "Endpoints:"
echo "  🌐  https://$DOMAIN             — Customer Website"
echo "  🔌  https://api.$DOMAIN         — REST API"
echo "  🛡️   https://admin.$DOMAIN       — Admin Console"
echo "  🏪  https://vendor.$DOMAIN      — Vendor Portal"
echo ""
warn "NEXT STEPS: Run scripts/setup-storage.sh"
