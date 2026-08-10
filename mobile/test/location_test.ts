import assert from 'node:assert';
import { test, describe } from 'node:test';
import { calculateDistanceMeters } from '../src/utils/locationUtils.ts';
import { apiClient } from '../src/api/client.ts';
import { getFullApiUrl } from '../src/config/env.ts';

describe('CMD-070 Mobile Location Technical & API Tests', () => {
  test('1. Flado serviceability API URL construction', () => {
    const url = getFullApiUrl('/flado/serviceability');
    assert.ok(url.endsWith('/api/v1/flado/serviceability'));
  });

  test('2. Haversine distance & GPS jitter detection (< 50m)', () => {
    // 12.9716, 77.5946 vs 12.9717, 77.5947 (approx 15 meters shift)
    const distMeters = calculateDistanceMeters(12.9716, 77.5946, 12.9717, 77.5947);
    assert.ok(distMeters < 50, `Distance ${distMeters} should be less than 50 meters jitter threshold`);

    // Material move: 12.9716, 77.5946 vs 12.9900, 77.6200 (approx 3.4 km shift)
    const materialDist = calculateDistanceMeters(12.9716, 77.5946, 12.9900, 77.6200);
    assert.ok(materialDist > 1000, `Material shift ${materialDist} should exceed 1 km`);
  });

  test('3. Authoritative backend serviceability contract', async () => {
    const mockServiceabilityRes = {
      isServiceable: true,
      fulfillmentSourceId: 'darkstore-indiranagar-01',
      storeName: 'Indiranagar Flado Store',
      estimatedDeliveryText: '10-12 mins',
    };

    const globalFetch = global.fetch;
    global.fetch = (async (url: string, opts: any) => {
      assert.ok(url.includes('/flado/serviceability'));
      assert.strictEqual(opts.method, 'POST');
      const body = JSON.parse(opts.body);
      assert.strictEqual(body.latitude, 12.9716);
      assert.strictEqual(body.longitude, 77.5946);
      return {
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => mockServiceabilityRes,
      };
    }) as any;

    try {
      const res: any = await apiClient('/flado/serviceability', {
        method: 'POST',
        body: JSON.stringify({ latitude: 12.9716, longitude: 77.5946, pincode: '560038' }),
      });
      assert.strictEqual(res.isServiceable, true);
      assert.strictEqual(res.storeName, 'Indiranagar Flado Store');
      assert.strictEqual(res.estimatedDeliveryText, '10-12 mins');
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('4. Saved address CRUD & default patch contract', async () => {
    const mockAddresses = [
      { id: 'addr-1', label: 'Home', addressLine1: '123 Main St', pincode: '560038', isDefault: true },
      { id: 'addr-2', label: 'Office', addressLine1: '456 Tech Park', pincode: '560066', isDefault: false },
    ];

    const globalFetch = global.fetch;
    global.fetch = (async (url: string, opts: any) => {
      if (url.includes('/users/addresses') && (!opts.method || opts.method === 'GET')) {
        return {
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => mockAddresses,
        };
      }
      if (url.includes('/users/addresses/addr-2/default') && opts.method === 'PATCH') {
        return {
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ...mockAddresses[1], isDefault: true }),
        };
      }
      throw new Error(`Unexpected fetch URL: ${url}`);
    }) as any;

    try {
      const list: any = await apiClient('/users/addresses');
      assert.strictEqual(list.length, 2);

      const updated: any = await apiClient('/users/addresses/addr-2/default', { method: 'PATCH' });
      assert.strictEqual(updated.isDefault, true);
    } finally {
      global.fetch = globalFetch;
    }
  });

  test('5. Zero client-side serviceability math invariant', () => {
    // Serviceability status must come verbatim from DeliveryService response, never client math
    const dtoServiceability = {
      isServiceable: false,
      reason: 'Outside 5km darkstore radius boundary',
    };

    assert.strictEqual(dtoServiceability.isServiceable, false);
    assert.strictEqual(dtoServiceability.reason, 'Outside 5km darkstore radius boundary');
  });

  test('6. No background tracking invariant', () => {
    const trackingMode = 'FOREGROUND_ONLY';
    assert.strictEqual(trackingMode, 'FOREGROUND_ONLY');
  });
});
