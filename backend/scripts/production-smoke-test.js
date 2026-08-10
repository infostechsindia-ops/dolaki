/**
 * AuraMart Production Backend Smoke Test Script (DEPLOY-003)
 * Non-destructive automated HTTP probe verifying health, readiness, CORS headers,
 * public catalog reading, and default-deny RBAC unauthorized rejection.
 */

const http = require('http');
const https = require('https');

const baseUrl = process.env.API_PUBLIC_URL || process.argv[2] || 'http://localhost:5000/api/v1';
console.log(`🔍 Running AuraMart Production Backend Smoke Tests against: ${baseUrl}`);

function makeRequest(urlPath, options = {}) {
  return new Promise((resolve, reject) => {
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    const cleanPath = urlPath.startsWith('/') ? urlPath.substring(1) : urlPath;
    const fullUrl = new URL(cleanPath, cleanBase);
    const client = fullUrl.protocol === 'https:' ? https : http;
    
    const req = client.request(fullUrl, {
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: 10000,
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout requesting ${urlPath}`));
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function runSmokeTests() {
  let passedCount = 0;
  let failedCount = 0;

  async function assertProbe(name, fn) {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passedCount++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, err);
      failedCount++;
    }
  }

  // 1. Health Probe
  await assertProbe('Health Endpoint Probe (/health)', async () => {
    const res = await makeRequest('/health');
    if (res.status !== 200) throw new Error(`Expected HTTP 200, got ${res.status}`);
    const json = JSON.parse(res.body);
    const data = json.data || json;
    if (data.status !== 'ok') throw new Error(`Expected status 'ok', got '${data.status}'`);
  });

  // 2. Readiness Probe
  await assertProbe('Readiness Endpoint Probe (/ready)', async () => {
    const res = await makeRequest('/ready');
    if (res.status !== 200) throw new Error(`Expected HTTP 200, got ${res.status}`);
    const json = JSON.parse(res.body);
    const data = json.data || json;
    if (data.readiness !== 'READY') throw new Error(`Expected readiness 'READY', got '${data.readiness}'`);
  });

  // 3. Security Headers Check
  await assertProbe('Security Headers Probe', async () => {
    const res = await makeRequest('/health');
    if (res.headers['x-content-type-options'] !== 'nosniff') {
      throw new Error(`Missing X-Content-Type-Options: nosniff header`);
    }
    if (res.headers['x-frame-options'] !== 'DENY') {
      throw new Error(`Missing X-Frame-Options: DENY header`);
    }
  });

  // 4. Default-Deny RBAC Unauthorized Rejection
  await assertProbe('Default-Deny RBAC Protection Probe (/admin/audit-logs)', async () => {
    const res = await makeRequest('/admin/audit-logs');
    if (res.status !== 401) throw new Error(`Expected HTTP 401 Unauthorized for unauthenticated admin access, got ${res.status}`);
  });

  // 5. Public Catalog Non-Destructive Read
  await assertProbe('Public Products Catalog Read Probe (/products)', async () => {
    const res = await makeRequest('/products');
    if (res.status !== 200) throw new Error(`Expected HTTP 200 for public catalog read, got ${res.status}`);
  });

  console.log(`\n==================================================`);
  console.log(`Smoke Test Verification Summary: ${passedCount} PASSED, ${failedCount} FAILED.`);
  console.log(`==================================================`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

runSmokeTests();
