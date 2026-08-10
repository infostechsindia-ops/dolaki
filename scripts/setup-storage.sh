#!/usr/bin/env bash
# =============================================================================
# DEPLOY-001 Phase 4 — Object Storage Setup (AWS S3 / Cloudflare R2)
# AuraMart Commerce OS v2.0.0-rc.1
# =============================================================================
# This script configures object storage for product images, media uploads,
# static exports, and backup storage.
#
# Supports: AWS S3 or Cloudflare R2 (S3-compatible)
# =============================================================================

set -euo pipefail
LOGFILE="/opt/auramart/logs/setup-storage.log"
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

: "${STORAGE_PROVIDER:=r2}"   # 'r2' or 's3'
: "${STORAGE_BUCKET:?STORAGE_BUCKET must be set}"
: "${STORAGE_ACCESS_KEY:?STORAGE_ACCESS_KEY must be set}"
: "${STORAGE_SECRET_KEY:?STORAGE_SECRET_KEY must be set}"

info "========================================================"
info " Phase 4 — Object Storage Setup"
info " Provider: $STORAGE_PROVIDER"
info " Bucket:   $STORAGE_BUCKET"
info " $(date)"
info "========================================================"

# ── Install AWS CLI v2 ────────────────────────────────────────────────────────
info "Installing AWS CLI v2..."
if ! command -v aws &>/dev/null; then
  ARCH=$(uname -m)
  if [ "$ARCH" = "aarch64" ]; then
    AWS_URL="https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip"
  else
    AWS_URL="https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip"
  fi
  curl -fsSL "$AWS_URL" -o /tmp/awscliv2.zip
  unzip -q /tmp/awscliv2.zip -d /tmp/awscli
  /tmp/awscli/aws/install --update
  rm -rf /tmp/awscliv2.zip /tmp/awscli
  success "AWS CLI $(aws --version 2>&1 | head -1) installed"
else
  success "AWS CLI already installed: $(aws --version 2>&1 | head -1)"
fi

# ── Configure AWS CLI profile ─────────────────────────────────────────────────
info "Configuring storage credentials..."
mkdir -p /home/auramart/.aws

if [ "$STORAGE_PROVIDER" = "r2" ]; then
  : "${CF_ACCOUNT_ID:?CF_ACCOUNT_ID must be set for Cloudflare R2}"
  ENDPOINT_URL="https://${CF_ACCOUNT_ID}.r2.cloudflarestorage.com"

  cat > /home/auramart/.aws/config << AWSEOF
[profile auramart-storage]
region = auto
output = json
endpoint_url = $ENDPOINT_URL
AWSEOF

  cat > /home/auramart/.aws/credentials << CREDEOF
[auramart-storage]
aws_access_key_id = $STORAGE_ACCESS_KEY
aws_secret_access_key = $STORAGE_SECRET_KEY
CREDEOF

  success "Cloudflare R2 credentials configured"
  info "R2 endpoint: $ENDPOINT_URL"
else
  : "${AWS_REGION:=ap-south-1}"  # Mumbai (closest to India)

  cat > /home/auramart/.aws/config << AWSEOF
[profile auramart-storage]
region = $AWS_REGION
output = json
AWSEOF

  cat > /home/auramart/.aws/credentials << CREDEOF
[auramart-storage]
aws_access_key_id = $STORAGE_ACCESS_KEY
aws_secret_access_key = $STORAGE_SECRET_KEY
CREDEOF

  success "AWS S3 credentials configured (region: $AWS_REGION)"
fi

chmod 600 /home/auramart/.aws/credentials
chown -R auramart:auramart /home/auramart/.aws

# Export alias for convenience
AWS_CMD="aws --profile auramart-storage"
[ "$STORAGE_PROVIDER" = "r2" ] && AWS_CMD="aws --profile auramart-storage --endpoint-url $ENDPOINT_URL"

# ── Verify connectivity ───────────────────────────────────────────────────────
info "Verifying storage connectivity..."
$AWS_CMD s3 ls "s3://$STORAGE_BUCKET" > /dev/null 2>&1 \
  && success "Bucket '$STORAGE_BUCKET' accessible" \
  || warn "Bucket '$STORAGE_BUCKET' not found — attempting to create..."

# ── Create buckets ────────────────────────────────────────────────────────────
info "Setting up AuraMart storage buckets..."

# Main media bucket
$AWS_CMD s3 mb "s3://$STORAGE_BUCKET" 2>/dev/null || true
success "Media bucket: s3://$STORAGE_BUCKET"

# Backups bucket
BACKUP_BUCKET="${STORAGE_BUCKET}-backups"
$AWS_CMD s3 mb "s3://$BACKUP_BUCKET" 2>/dev/null || true
success "Backup bucket: s3://$BACKUP_BUCKET"

# ── Apply bucket policies ─────────────────────────────────────────────────────
info "Applying public-read CORS policy to media bucket..."

# CORS policy for browser uploads
cat > /tmp/cors-policy.json << 'CORSEOF'
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}
CORSEOF

$AWS_CMD s3api put-bucket-cors \
  --bucket "$STORAGE_BUCKET" \
  --cors-configuration file:///tmp/cors-policy.json 2>/dev/null || true

# Lifecycle policy — delete temp uploads after 24h
cat > /tmp/lifecycle-policy.json << 'LIFECYCLEEOF'
{
  "Rules": [
    {
      "ID": "delete-temp-uploads",
      "Filter": {"Prefix": "temp/"},
      "Status": "Enabled",
      "Expiration": {"Days": 1}
    },
    {
      "ID": "archive-backups-90d",
      "Filter": {"Prefix": "backups/"},
      "Status": "Enabled",
      "Transition": {"Days": 30, "StorageClass": "STANDARD_IA"},
      "Expiration": {"Days": 90}
    }
  ]
}
LIFECYCLEEOF

$AWS_CMD s3api put-bucket-lifecycle-configuration \
  --bucket "$BACKUP_BUCKET" \
  --lifecycle-configuration file:///tmp/lifecycle-policy.json 2>/dev/null || true

rm -f /tmp/cors-policy.json /tmp/lifecycle-policy.json
success "Bucket policies applied"

# ── Create folder structure ───────────────────────────────────────────────────
info "Initialising bucket folder structure..."
for prefix in products/ brands/ categories/ cms/ avatars/ temp/; do
  echo "" | $AWS_CMD s3 cp - "s3://$STORAGE_BUCKET/${prefix}.gitkeep" 2>/dev/null || true
done
success "Folder structure initialised"

# ── Test upload ───────────────────────────────────────────────────────────────
info "Running upload/download verification test..."
TEST_FILE="/tmp/auramart-storage-test-$(date +%s).txt"
echo "AuraMart storage test — $(date)" > "$TEST_FILE"
$AWS_CMD s3 cp "$TEST_FILE" "s3://$STORAGE_BUCKET/temp/storage-test.txt"
$AWS_CMD s3 cp "s3://$STORAGE_BUCKET/temp/storage-test.txt" "/tmp/auramart-storage-verify.txt"
diff "$TEST_FILE" /tmp/auramart-storage-verify.txt \
  && success "Upload/download verification passed" \
  || error "Storage verification failed — uploaded and downloaded files differ"
$AWS_CMD s3 rm "s3://$STORAGE_BUCKET/temp/storage-test.txt" 2>/dev/null || true
rm -f "$TEST_FILE" /tmp/auramart-storage-verify.txt

# ── Update environment file with storage URLs ─────────────────────────────────
info "Writing storage configuration to environment..."
CDN_BASE="${CDN_BASE_URL:-https://$STORAGE_BUCKET.r2.dev}"
cat >> "$ENV_FILE" << STORAGEENV

# Object Storage — written by setup-storage.sh on $(date)
STORAGE_PROVIDER=$STORAGE_PROVIDER
STORAGE_BUCKET=$STORAGE_BUCKET
STORAGE_BACKUP_BUCKET=$BACKUP_BUCKET
CDN_BASE_URL=$CDN_BASE
STORAGEENV
success "Storage environment written"

# ── Update backup script to use S3 ───────────────────────────────────────────
info "Updating backup-db.sh to push backups to object storage..."
cat > "$APP_DIR/scripts/backup-db-s3.sh" << BACKUPS3
#!/usr/bin/env bash
# AuraMart — Database Backup to Object Storage
set -euo pipefail
source "$ENV_FILE"

TIMESTAMP=\$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="/tmp/auramart-db-\$TIMESTAMP.pgdump"

echo "[\$TIMESTAMP] Starting database backup..."
docker exec auramart-postgres-prod pg_dump \\
  -U "\$DB_USER" "\$DB_NAME" \\
  --format=custom --compress=9 > "\$BACKUP_FILE"

echo "[\$TIMESTAMP] Uploading to s3://\$STORAGE_BACKUP_BUCKET/postgres/..."
aws --profile auramart-storage \\
  s3 cp "\$BACKUP_FILE" "s3://\$STORAGE_BACKUP_BUCKET/postgres/\$TIMESTAMP.pgdump"

rm -f "\$BACKUP_FILE"
echo "[\$TIMESTAMP] Backup complete: s3://\$STORAGE_BACKUP_BUCKET/postgres/\$TIMESTAMP.pgdump"
BACKUPS3
chmod +x "$APP_DIR/scripts/backup-db-s3.sh"
success "Cloud backup script created"

# ── Schedule cloud backup ─────────────────────────────────────────────────────
S3_CRON="0 2 * * * $APP_DIR/scripts/backup-db-s3.sh >> $APP_DIR/logs/backup-s3.log 2>&1"
(crontab -l 2>/dev/null | grep -q "backup-db-s3.sh") \
  || (crontab -l 2>/dev/null; echo "$S3_CRON") | crontab -
success "Cloud backup cron scheduled: daily 02:00 UTC"

success "========================================================"
success " Phase 4 — Object Storage Complete"
success "========================================================"
echo ""
info "Buckets:"
echo "  📦  s3://$STORAGE_BUCKET         — Media uploads"
echo "  💾  s3://$BACKUP_BUCKET   — Database backups"
echo "  🌐  CDN: $CDN_BASE"
echo ""
warn "NEXT STEPS: Run scripts/setup-monitoring.sh"
