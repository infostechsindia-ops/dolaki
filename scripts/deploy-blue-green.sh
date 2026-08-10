#!/usr/bin/env bash
set -e

echo "=== AuraMart Zero-Downtime Blue/Green Deployment ==="
echo "NOTE: LIVE PRODUCTION DEPLOYMENT IS PAUSED. Running in local simulation mode."

ACTIVE_COLOR="${ACTIVE_COLOR:-blue}"
NEW_COLOR="green"

if [ "${ACTIVE_COLOR}" = "green" ]; then
    NEW_COLOR="blue"
fi

echo "Active Environment: ${ACTIVE_COLOR}"
echo "Target Environment: ${NEW_COLOR}"

echo "Step 1/5: Running Database Pre-Migration Backup..."
./scripts/backup-db.sh "pre-deploy-${NEW_COLOR}"

echo "Step 2/5: Executing Database Migrations..."
./scripts/run-migrations.sh

echo "Step 3/5: Spin Up Target Container Stack (${NEW_COLOR})..."
echo "SIMULATION: docker-compose -f docker-compose.prod.yml up -d backend-${NEW_COLOR} web-${NEW_COLOR}"

echo "Step 4/5: Running Automated Smoke Test Suite on ${NEW_COLOR} stack..."
./scripts/smoke-test.sh || {
    echo "ERROR: Smoke tests failed on target stack! Triggering automatic rollback..."
    ./scripts/rollback.sh "${ACTIVE_COLOR}"
    exit 1
}

echo "Step 5/5: Switching Nginx Upstream Traffic to ${NEW_COLOR} stack..."
echo "SIMULATION: Reloading Nginx to route active traffic to ${NEW_COLOR}."

echo "SUCCESS: Zero-downtime Blue/Green deployment completed successfully!"
echo "Active container pool is now: ${NEW_COLOR}"
