#!/usr/bin/env bash
set -e

echo "=== AuraMart Database Migration Runner ==="

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"
DB_NAME="${DB_NAME:-auramart}"

echo "Step 1/3: Verifying Database Connectivity to ${DB_HOST}:${DB_PORT}..."
./scripts/check-db-health.sh || {
    echo "ERROR: Database connection failed. Aborting migration."
    exit 1
}

echo "Step 2/3: Executing Pre-Migration Automated Database Backup..."
./scripts/backup-db.sh "pre-migration-$(date +%Y%m%d%H%M%S)" || {
    echo "WARNING: Pre-migration backup step skipped or failed. Proceeding with caution..."
}

echo "Step 3/3: Running TypeORM Database Migrations..."
cd backend
npm run migration:run || {
    echo "ERROR: Database migration failed!"
    echo "To rollback, run: ./scripts/restore-db.sh <latest_backup_file>"
    exit 1
}

echo "SUCCESS: Database migrations executed successfully!"
