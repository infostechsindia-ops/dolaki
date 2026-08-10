import assert from 'node:assert';
import { test, describe } from 'node:test';
import { riderMobileService, RiderDeliveryTask } from '../src/services/rider_service.ts';

describe('RIDER-001 Premium Rider Mobile App & Operations Tests', () => {
  test('1. Rider Dashboard stats maintain server authority for earnings and distance', () => {
    const stats = riderMobileService.getRiderStats();
    assert.strictEqual(stats.formattedTodayEarnings, '₹1,850');
    assert.strictEqual(stats.distanceTravelledKm, 34.5);
    assert.strictEqual(stats.acceptanceRatePercentage, 96);
  });

  test('2. Location telemetry updates rider coordinates correctly', () => {
    const updated = riderMobileService.updateLocationTelemetry({ latitude: 19.088, longitude: 72.888 });
    assert.strictEqual(updated.latitude, 19.088);
    assert.strictEqual(updated.longitude, 72.888);
  });

  test('3. OTP verification validates correct 6-digit delivery code', () => {
    const mockTask: RiderDeliveryTask = {
      id: 'task-101',
      orderNumber: 'ORD-99123',
      customerName: 'Aarav Mehta',
      customerPhone: '+919999999999',
      deliveryAddress: 'Flat 402, Sunshine Heights, Mumbai',
      merchantName: 'AuraMart Fresh #101',
      merchantAddress: 'Bandra West, Mumbai',
      status: 'ON_THE_WAY',
      otpRequired: true,
      paymentMethod: 'COD',
      codAmountCents: 45000,
      formattedCodAmount: '₹450',
      estimatedDeliveryTimeText: '12 mins',
    };

    const validRes = riderMobileService.verifyDeliveryOtp(mockTask, '801252');
    assert.strictEqual(validRes.verified, true);

    const invalidRes = riderMobileService.verifyDeliveryOtp(mockTask, '000000');
    assert.strictEqual(invalidRes.verified, false);
  });

  test('4. Offline state blocks delivery status mutations', () => {
    riderMobileService.setOnlineStatus(false);
    let errorCaught = false;

    try {
      riderMobileService.updateTaskStatus('task-101', 'DELIVERED');
    } catch (e: any) {
      errorCaught = true;
      assert.strictEqual(e.message, 'Network Connection Required to Update Delivery Status');
    }

    assert.strictEqual(errorCaught, true);
    riderMobileService.setOnlineStatus(true);
  });
});
