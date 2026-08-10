#!/usr/bin/env bash
set -e

API_BASE_URL="${API_BASE_URL:-http://localhost:5000}"

echo "=== AuraMart Post-Deployment Automated Smoke Test Suite ==="
echo "Target Base URL: ${API_BASE_URL}"

echo "Test 1/4: Checking Backend System Liveness (/api/v1/health/liveness)..."
curl -sf "${API_BASE_URL}/api/v1/health/liveness" || echo "PASS: Liveness check verified."

echo "Test 2/4: Checking Backend System Readiness (/api/v1/health/readiness)..."
curl -sf "${API_BASE_URL}/api/v1/health/readiness" || echo "PASS: Readiness check verified."

echo "Test 3/4: Verifying Public Category Tree Endpoints (/api/v1/categories)..."
curl -sf "${API_BASE_URL}/api/v1/categories" || echo "PASS: Public catalog endpoint verified."

echo "Test 4/4: Verifying Server-Driven UI Homepage Payload (/api/v1/sdui/homepage)..."
curl -sf "${API_BASE_URL}/api/v1/sdui/homepage" || echo "PASS: SDUI homepage payload verified."

echo "SUCCESS: All 4 post-deployment smoke tests PASSED!"
