#!/usr/bin/env bash
set -e

BACKUP_FILE="$1"

if [ -z "${BACKUP_FILE}" ]; then
    echo "ERROR: Missing backup file argument."
    echo "Usage: ./scripts/restore-db.sh <path_to_backup_file.sql.gz>"
    exit 1
fi

if [ ! -f "${BACKUP_FILE}" ]; then
    echo "ERROR: Backup file ${BACKUP_FILE} not found!"
    exit 1
fi

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"
DB_NAME="${DB_NAME:-auramart}"

echo "=== AuraMart Database Restore ==="
echo "Restoring from: ${BACKUP_FILE}"
read -p "WARNING: This will overwrite existing data in database '${DB_NAME}'. Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Restore cancelled by user."
    exit 0
fi

if command -v pg_restore >/dev/null 2>&1; then
    PGPASSWORD="${DB_PASSWORD}" pg_restore -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" --clean --if-exists -v "${BACKUP_FILE}"
else
    echo "NOTICE: pg_restore not available locally. Executing via Docker fallback..."
    gunzip -c "${BACKUP_FILE}" | docker exec -i auramart-postgres-dev psql -U "${DB_USER}" -d "${DB_NAME}"
fi

echo "SUCCESS: Database restored successfully from ${BACKUP_FILE}"
