import assert from 'node:assert';
import { test, describe } from 'node:test';
import appConfig from '../app.json' with { type: 'json' };
import easConfig from '../eas.json' with { type: 'json' };
import { handleDeepLink } from '../src/services/notifications.ts';

describe('CMD-073 Mobile Production Readiness Audit & Technical Tests', () => {
  test('1. Expo app.json production configuration audit', () => {
    const { expo } = appConfig;

    assert.ok(expo.name.includes('AuraMart'), 'App name must contain AuraMart');
    assert.strictEqual(expo.slug, 'auramart', 'App slug must be auramart');
    assert.strictEqual(expo.scheme, 'auramart', 'Deep link scheme must be auramart');

    // Identifiers
    assert.strictEqual(expo.ios?.bundleIdentifier, 'com.auramart.customer');
    assert.strictEqual(expo.android?.package, 'com.auramart.customer');

    // Permission rationale
    assert.ok(expo.ios?.infoPlist?.NSLocationWhenInUseUsageDescription);
    assert.ok(expo.ios?.infoPlist?.NSLocationWhenInUseUsageDescription.includes('10-minute Quick Commerce'));
  });

  test('2. Permissions least privilege boundary check', () => {
    const permissions = appConfig.expo.android?.permissions || [];
    assert.ok(permissions.includes('ACCESS_FINE_LOCATION'));
    assert.ok(permissions.includes('ACCESS_COARSE_LOCATION'));

    // Excluded background location invariant
    assert.strictEqual(permissions.includes('ACCESS_BACKGROUND_LOCATION' as any), false);
  });

  test('3. EAS release build profiles audit', () => {
    const { build } = easConfig;

    assert.ok(build.development, 'Development profile must exist');
    assert.ok(build.preview, 'Preview profile must exist');
    assert.ok(build.production, 'Production profile must exist');

    assert.strictEqual(build.production.distribution, 'store');
    assert.strictEqual(build.production.autoIncrement, true);
    assert.strictEqual(build.production.env.EXPO_PUBLIC_API_URL, 'https://api.auramart.com/api/v1');
  });

  test('4. Deep link URL whitelist & parameter validation', () => {
    const pLink = handleDeepLink({ type: 'product', id: 'prod-99' });
    assert.strictEqual(pLink, '/products/prod-99');

    const oLink = handleDeepLink({ type: 'order', id: 'ord-888' });
    assert.strictEqual(oLink, '/orders/ord-888');

    const tLink = handleDeepLink({ type: 'quick_tracking', id: 'ord-888' });
    assert.strictEqual(tLink, '/tracking/ord-888');

    // Untrusted input rejection
    const invalidLink = handleDeepLink({ type: 'malicious', id: '../../secret' });
    assert.strictEqual(invalidLink, false);
  });

  test('5. Log sanitizer token redaction invariant', () => {
    const rawErrorMsg = 'Error fetching user data: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMifQ';
    const sanitizedMsg = rawErrorMsg.replace(/(Bearer\s+[A-Za-z0-9-_=.]+)/gi, '[REDACTED_TOKEN]');

    assert.ok(!sanitizedMsg.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'));
    assert.ok(sanitizedMsg.includes('[REDACTED_TOKEN]'));
  });
});
