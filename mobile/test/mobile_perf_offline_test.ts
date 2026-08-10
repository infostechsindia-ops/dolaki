import assert from 'node:assert';
import { test, describe } from 'node:test';
import { offlineManager } from '../src/services/offline.ts';
import { deviceIntegration } from '../src/services/device.ts';
import { performanceMonitor } from '../src/services/performance.ts';

describe('MOBILE-002 Native Performance, Offline & Device Integration Tests', () => {
  test('1. Offline Read Cache manager sets and retrieves SDUI layout', () => {
    const mockSdui = { sections: [{ id: 'hero_banners', type: 'hero_banners' }] };
    offlineManager.set('sdui_homepage', mockSdui);

    const cached = offlineManager.get<typeof mockSdui>('sdui_homepage');
    assert.ok(cached);
    assert.strictEqual(cached.sections.length, 1);
    assert.strictEqual(cached.sections[0].id, 'hero_banners');
  });

  test('2. Biometric Authentication abstraction returns success result', async () => {
    const result = await deviceIntegration.authenticateBiometric('Unlock AuraMart');
    assert.strictEqual(result.success, true);
  });

  test('3. Performance Monitor logs screen render timing metrics', () => {
    performanceMonitor.logScreenRenderTime('HomeScreen', 45);
    const metrics = performanceMonitor.getMetrics();
    assert.ok(metrics.some((m) => m.name === 'render:HomeScreen' && m.durationMs === 45));
  });
});
