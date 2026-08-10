#!/usr/bin/env bash
set -e

PREVIOUS_COLOR="${1:-blue}"

echo "=== AuraMart Emergency Rollback Execution ==="
echo "Rolling back traffic to previous stable stack: ${PREVIOUS_COLOR}..."

echo "Step 1/3: Reverting Nginx Upstream Configuration to ${PREVIOUS_COLOR}..."
echo "SIMULATION: Nginx reloaded to target ${PREVIOUS_COLOR} pool."

echo "Step 2/3: Verifying Traffic Routing Health..."
./scripts/smoke-test.sh

echo "Step 3/3: Gracefully stopping failed deployment container pool..."
echo "SIMULATION: Stopping failed deployment instances."

echo "SUCCESS: Rollback complete! System active on ${PREVIOUS_COLOR} stack."
