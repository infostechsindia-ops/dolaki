import assert from 'node:assert';
import { test, describe } from 'node:test';
import { liveActivityEngine } from '../src/services/live_activities.ts';
import { widgetDataProvider } from '../src/services/widgets.ts';
import { handleDeepLink } from '../src/services/notifications.ts';

describe('MOBILE-003 Live Activities, Widgets & Real-Time Notifications Tests', () => {
  test('1. Live Activity engine starts and progresses order tracking state machine', () => {
    const activity = liveActivityEngine.startLiveActivity('ord-101', '12 mins');
    assert.strictEqual(activity.orderId, 'ord-101');
    assert.strictEqual(activity.state, 'OUT_FOR_DELIVERY');

    const updated = liveActivityEngine.updateLiveActivity('ord-101', 'DELIVERED', 100);
    assert.ok(updated);
    assert.strictEqual(updated.state, 'DELIVERED');
    assert.strictEqual(updated.progressPercent, 100);
  });

  test('2. Home Screen Widget Data Provider returns formatted widget payload', () => {
    const widgetData = widgetDataProvider.getWidgetPayload();
    assert.ok(widgetData.recentOrder);
    assert.strictEqual(widgetData.recentOrder.orderId, 'ord-101');
    assert.strictEqual(widgetData.auraCoinsBalance, 450);
    assert.strictEqual(widgetData.vipStatus, true);
  });

  test('3. Deep-link router handles whitelisted notification targets', () => {
    const productRoute = handleDeepLink({ type: 'product', id: 'p101' });
    assert.strictEqual(productRoute, '/products/p101');

    const brandRoute = handleDeepLink({ type: 'brand', id: 'apple' });
    assert.strictEqual(brandRoute, '/brands/apple');

    const vipRoute = handleDeepLink({ type: 'vip_pass', id: 'vip' });
    assert.strictEqual(vipRoute, '/flado/vip');

    const invalidRoute = handleDeepLink({ type: 'untrusted_malicious_type', id: 'test' });
    assert.strictEqual(invalidRoute, false);
  });
});
