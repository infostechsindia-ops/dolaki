import assert from 'node:assert';
import { test, describe } from 'node:test';
import { darkstoreService } from '../src/services/darkstore_service.ts';

describe('DARKSTORE-001 Darkstore Operations & Micro-Fulfillment Tests', () => {
  test('1. Darkstore Dashboard stats report active orders and sub-10 min SLAs accurately', () => {
    const stats = darkstoreService.getDashboardStats();
    assert.strictEqual(stats.activeOrdersCount, 24);
    assert.strictEqual(stats.slaCompliancePercentage, 98.4);
    assert.strictEqual(stats.averageDeliveryTimeMinutes, 8.5);
  });

  test('2. Bin location lookup resolves cold zone and FEFO rotation policy', () => {
    const bin = darkstoreService.lookupBinLocation('8901234567890');
    assert.ok(bin !== null);
    assert.strictEqual(bin?.binLocation, 'Bin B-04-A');
    assert.strictEqual(bin?.rotationPolicy, 'FEFO');
    assert.strictEqual(bin?.expiryDate, '2026-08-12');
  });

  test('3. SLA monitor calculates 10-minute quick-commerce fulfillment timers', () => {
    const sla = darkstoreService.getSlaMonitor('ord-9921');
    assert.strictEqual(sla.isLate, false);
    assert.strictEqual(sla.statusText, 'ON_TRACK_FOR_10_MIN_DELIVERY');
  });

  test('4. Replenishment trigger initiates stock transfer from warehouse', () => {
    const res = darkstoreService.triggerReplenishmentRequest('SKU-MILK-1L-001', 50, 'WAREHOUSE');
    assert.strictEqual(res.success, true);
    assert.ok(res.transferId.startsWith('trf-'));
  });

  test('5. Offline state blocks replenishment mutations', () => {
    darkstoreService.setOnlineStatus(false);
    let errorCaught = false;

    try {
      darkstoreService.triggerReplenishmentRequest('SKU-MILK-1L-001', 50, 'WAREHOUSE');
    } catch (e: any) {
      errorCaught = true;
      assert.strictEqual(e.message, 'Network Connection Required to Trigger Replenishment Request');
    }

    assert.strictEqual(errorCaught, true);
    darkstoreService.setOnlineStatus(true);
  });
});
