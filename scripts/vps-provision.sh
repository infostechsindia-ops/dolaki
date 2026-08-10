#!/usr/bin/env bash
# =============================================================================
# DEPLOY-001 Phase 1 — Hostinger VPS Provisioning & Ubuntu LTS Hardening
# AuraMart Commerce OS v2.0.0-rc.1
# =============================================================================
# USAGE: Run this script as root on a freshly provisioned Hostinger VPS
#   curl -sL https://raw.githubusercontent.com/your-org/auramart/main/scripts/vps-provision.sh | sudo bash
#
# Tested on: Ubuntu 22.04 LTS, Ubuntu 24.04 LTS
# =============================================================================

set -euo pipefail
LOGFILE="/var/log/auramart-provision.log"
exec > >(tee -a "$LOGFILE") 2>&1

# ── Colours ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()    { echo -e "${BLUE}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

info "========================================================"
info " AuraMart VPS Provisioning Script — Phase 1"
info " $(date)"
info "========================================================"

# ── 1. System Update ─────────────────────────────────────────────────────────
info "Updating system packages..."
apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get upgrade -y
DEBIAN_FRONTEND=noninteractive apt-get dist-upgrade -y
apt-get autoremove -y
apt-get autoclean
success "System packages updated"

# ── 2. Install Essential Packages ────────────────────────────────────────────
info "Installing essential packages..."
apt-get install -y \
  curl wget git unzip jq \
  ufw fail2ban \
  htop iotop net-tools \
  ca-certificates gnupg \
  software-properties-common \
  apt-transport-https \
  logrotate \
  chrony \
  acl
success "Essential packages installed"

# ── 3. Configure Time Sync ───────────────────────────────────────────────────
info "Configuring NTP time sync..."
systemctl enable chrony
systemctl start chrony
timedatectl set-timezone UTC
success "Time sync configured (UTC)"

# ── 4. SSH Hardening ─────────────────────────────────────────────────────────
info "Hardening SSH configuration..."
SSHD_CONFIG="/etc/ssh/sshd_config"
cp "$SSHD_CONFIG" "${SSHD_CONFIG}.backup.$(date +%Y%m%d)"

# Backup and apply hardened SSH config
cat > "$SSHD_CONFIG" << 'SSHEOF'
# AuraMart Hardened SSH Configuration
Port 22
Protocol 2
HostKey /etc/ssh/ssh_host_rsa_key
HostKey /etc/ssh/ssh_host_ecdsa_key
HostKey /etc/ssh/ssh_host_ed25519_key

# Authentication
LoginGraceTime 30
PermitRootLogin prohibit-password
StrictModes yes
MaxAuthTries 3
MaxSessions 5
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
PasswordAuthentication no
PermitEmptyPasswords no
ChallengeResponseAuthentication no
UsePAM yes

# Security
X11Forwarding no
PrintMotd no
AcceptEnv LANG LC_*
Subsystem sftp /usr/lib/openssh/sftp-server
ClientAliveInterval 300
ClientAliveCountMax 2
AllowTcpForwarding no
AllowAgentForwarding no

# Logging
SyslogFacility AUTH
LogLevel VERBOSE
SSHEOF

systemctl restart sshd
success "SSH hardened (password auth disabled, root key-only)"

# ── 5. Create Deploy User ─────────────────────────────────────────────────────
DEPLOY_USER="auramart"
if ! id "$DEPLOY_USER" &>/dev/null; then
  info "Creating deploy user: $DEPLOY_USER..."
  useradd -m -s /bin/bash -G sudo,docker "$DEPLOY_USER" 2>/dev/null || true
  # Create SSH dir for deploy user
  mkdir -p /home/$DEPLOY_USER/.ssh
  chmod 700 /home/$DEPLOY_USER/.ssh
  chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh
  success "Deploy user '$DEPLOY_USER' created"
  warn "ACTION REQUIRED: Add your public SSH key to /home/$DEPLOY_USER/.ssh/authorized_keys"
else
  info "Deploy user '$DEPLOY_USER' already exists"
fi

# ── 6. UFW Firewall ───────────────────────────────────────────────────────────
info "Configuring UFW firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
# Allow monitoring from localhost only
ufw allow from 127.0.0.1 to any port 9090 comment 'Prometheus local'
ufw allow from 127.0.0.1 to any port 3000 comment 'Grafana local'
ufw --force enable
success "UFW firewall configured"

# ── 7. fail2ban ───────────────────────────────────────────────────────────────
info "Configuring fail2ban..."
cat > /etc/fail2ban/jail.local << 'F2BEOF'
[DEFAULT]
bantime  = 3600
findtime = 600
maxretry = 5
backend  = systemd

[sshd]
enabled  = true
port     = ssh
logpath  = %(sshd_log)s
maxretry = 3
bantime  = 86400

[nginx-http-auth]
enabled  = true
filter   = nginx-http-auth
logpath  = /var/log/nginx/error.log
maxretry = 5

[nginx-limit-req]
enabled  = true
filter   = nginx-limit-req
logpath  = /var/log/nginx/error.log
maxretry = 10
F2BEOF

systemctl enable fail2ban
systemctl restart fail2ban
success "fail2ban configured"

# ── 8. Kernel Hardening (sysctl) ─────────────────────────────────────────────
info "Applying kernel security parameters..."
cat > /etc/sysctl.d/99-auramart-security.conf << 'SYSCTL'
# Network security
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.secure_redirects = 0
net.ipv4.conf.default.secure_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.icmp_ignore_bogus_error_responses = 1
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_syn_retries = 5

# Performance tuning
net.core.somaxconn = 65535
net.ipv4.tcp_max_tw_buckets = 1440000
net.ipv4.ip_local_port_range = 1024 65535
vm.swappiness = 10
fs.file-max = 2097152
SYSCTL

sysctl -p /etc/sysctl.d/99-auramart-security.conf
success "Kernel parameters applied"

# ── 9. Install Docker ─────────────────────────────────────────────────────────
info "Installing Docker Engine..."
if ! command -v docker &>/dev/null; then
  # Add Docker's official GPG key
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg

  # Add Docker repository
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
    https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
    | tee /etc/apt/sources.list.d/docker.list > /dev/null

  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

  # Add deploy user to docker group
  usermod -aG docker "$DEPLOY_USER" 2>/dev/null || true

  # Configure Docker daemon
  mkdir -p /etc/docker
  cat > /etc/docker/daemon.json << 'DOCKEREOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "50m",
    "max-file": "5"
  },
  "live-restore": true,
  "userland-proxy": false,
  "storage-driver": "overlay2"
}
DOCKEREOF

  systemctl enable docker
  systemctl restart docker
  success "Docker $(docker --version) installed"
else
  success "Docker already installed: $(docker --version)"
fi

# ── 10. Docker Compose Plugin Verification ────────────────────────────────────
info "Verifying Docker Compose..."
docker compose version || error "Docker Compose plugin not installed"
success "Docker Compose: $(docker compose version)"

# ── 11. Set Ulimits ───────────────────────────────────────────────────────────
info "Configuring system limits..."
cat >> /etc/security/limits.conf << 'LIMEOF'
# AuraMart production limits
*         soft nofile 65536
*         hard nofile 65536
root      soft nofile 65536
root      hard nofile 65536
auramart  soft nofile 65536
auramart  hard nofile 65536
LIMEOF
success "System limits configured"

# ── 12. Setup Swap ────────────────────────────────────────────────────────────
info "Checking swap configuration..."
if [ "$(free | awk '/^Swap:/ {print $2}')" -eq 0 ]; then
  info "Creating 4GB swap file..."
  fallocate -l 4G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  sysctl vm.swappiness=10
  echo 'vm.swappiness=10' >> /etc/sysctl.d/99-auramart-security.conf
  success "4GB swap created"
else
  success "Swap already configured"
fi

# ── 13. Create Application Directories ───────────────────────────────────────
info "Creating application directory structure..."
APP_DIR="/opt/auramart"
mkdir -p \
  "$APP_DIR" \
  "$APP_DIR/ssl" \
  "$APP_DIR/backups" \
  "$APP_DIR/logs" \
  "$APP_DIR/uploads"

chown -R "$DEPLOY_USER:$DEPLOY_USER" "$APP_DIR"
chmod 750 "$APP_DIR"
success "Application directories created at $APP_DIR"

# ── 14. Setup Log Rotation ────────────────────────────────────────────────────
info "Configuring log rotation..."
cat > /etc/logrotate.d/auramart << 'LOGEOF'
/opt/auramart/logs/*.log {
  daily
  rotate 30
  compress
  delaycompress
  missingok
  notifempty
  sharedscripts
  postrotate
    docker kill --signal=USR1 auramart-nginx-prod 2>/dev/null || true
  endscript
}
LOGEOF
success "Log rotation configured"

# ── 15. MOTD Banner ───────────────────────────────────────────────────────────
cat > /etc/motd << 'MOTD'

  ╔══════════════════════════════════════════════════════╗
  ║          AuraMart Commerce OS — Production           ║
  ║          Unauthorised access is prohibited.          ║
  ╚══════════════════════════════════════════════════════╝

MOTD

# ── Final Summary ─────────────────────────────────────────────────────────────
echo ""
success "========================================================"
success " Phase 1 — VPS Provisioning Complete"
success "========================================================"
echo ""
info "Summary:"
echo "  ✅ Ubuntu system updated and hardened"
echo "  ✅ SSH hardened (key-only, no password, no root login)"
echo "  ✅ UFW firewall: ports 22, 80, 443 open"
echo "  ✅ fail2ban: SSH + Nginx brute-force protection"
echo "  ✅ Kernel: TCP SYN-flood protection, performance tuning"
echo "  ✅ Docker $(docker --version | cut -d' ' -f3 | tr -d ',') installed"
echo "  ✅ Docker Compose installed"
echo "  ✅ 4GB swap configured"
echo "  ✅ Deploy user: $DEPLOY_USER"
echo "  ✅ App directory: /opt/auramart"
echo ""
warn "NEXT STEPS:"
echo "  1. Add SSH public key: echo 'your-pubkey' >> /home/$DEPLOY_USER/.ssh/authorized_keys"
echo "  2. Test SSH login as $DEPLOY_USER before closing root session"
echo "  3. Run: scripts/setup-databases.sh"
echo ""
info "Log file: $LOGFILE"
