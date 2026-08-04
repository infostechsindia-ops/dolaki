import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateDistance, findClosestStoreAndETA } from '../../src/utils/fladoDarkstores';

describe('Flado Darkstores Geo-Location Utilities', () => {

  describe('calculateDistance()', () => {
    it('should return 0 km when calculating distance to the exact same point', () => {
      const distance = calculateDistance(19.0596, 72.8295, 19.0596, 72.8295);
      assert.strictEqual(distance, 0);
    });

    it('should correctly calculate the distance in km between two coordinate points', () => {
      const distance = calculateDistance(19.0596, 72.8295, 19.0178, 72.8173);
      assert.ok(distance > 4.5 && distance < 5.0);
    });
  });

  describe('findClosestStoreAndETA()', () => {
    it('should route to Bandra Darkstore for Bandra user location coordinates', () => {
      const routing = findClosestStoreAndETA(19.0596, 72.8295);
      assert.ok(routing);
      if (routing) {
        assert.strictEqual(routing.store.id, 'store-bandra');
        assert.strictEqual(routing.distance, 0);
        assert.strictEqual(routing.eta, 8);
      }
    });

    it('should route to Worli Darkstore for a user standing close to Worli', () => {
      const routing = findClosestStoreAndETA(19.015, 72.815);
      assert.ok(routing);
      if (routing) {
        assert.strictEqual(routing.store.id, 'store-worli');
        assert.ok(routing.distance < 1.0);
      }
    });

    it('should calculate realistic ETA based on base prep time + speed multiplier', () => {
      const routing = findClosestStoreAndETA(19.13, 72.87);
      assert.ok(routing);
      if (routing) {
        const expectedEta = Math.round(routing.store.basePrepTime + routing.distance * routing.store.etaSpeed);
        assert.strictEqual(routing.eta, expectedEta);
      }
    });
  });
});
