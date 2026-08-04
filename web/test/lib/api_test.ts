import { describe, it, before } from 'node:test';
import assert from 'node:assert';

// ─── Mock localStorage for pure Node.js test environment ─────────────────────
const mockLocalStorage: Record<string, string> = {};
before(() => {
  global.window = {
    location: { href: 'http://localhost' }
  } as any;
  
  global.localStorage = {
    getItem: (key: string) => mockLocalStorage[key] || null,
    setItem: (key: string, val: string) => { mockLocalStorage[key] = val; },
    removeItem: (key: string) => { delete mockLocalStorage[key]; },
    clear: () => { Object.keys(mockLocalStorage).forEach(k => delete mockLocalStorage[k]); },
    length: 0,
    key: (i: number) => Object.keys(mockLocalStorage)[i] || null,
  };
});

// Import the API layer after the global mocks are established
import { api } from '../../src/lib/api';

describe('AuraMart Web Unified API Layer', () => {
  
  describe('Products API', () => {
    it('should retrieve all products when no filters are applied', async () => {
      const products = await api.products.getAll();
      assert.ok(Array.isArray(products));
      assert.ok(products.length > 0);
    });

    it('should correctly filter products by category', async () => {
      const electronics = await api.products.getAll({ category: 'electronics' });
      assert.ok(electronics.every(p => p.category === 'electronics'));
    });

    it('should correctly filter products by brand', async () => {
      const appleProds = await api.products.getAll({ brand: 'Apple' });
      assert.ok(appleProds.every(p => p.brand?.toLowerCase() === 'apple'));
    });

    it('should return matching items on search query', async () => {
      const results = await api.products.search('macbook');
      assert.ok(results.length > 0);
      assert.ok(results.some(p => p.name.toLowerCase().includes('macbook')));
    });

    it('should return a specific product by ID', async () => {
      const product = await api.products.getById('ele-1');
      assert.ok(product);
      assert.strictEqual(product.id, 'ele-1');
    });

    it('should return null if product ID does not exist', async () => {
      const product = await api.products.getById('non-existent-id');
      assert.strictEqual(product, null);
    });
  });

  describe('Delivery ETA API', () => {
    it('should return 1-day express delivery for metro pincodes', async () => {
      const eta = await api.delivery.getETA('560001'); // Bengaluru Metro
      assert.ok(eta.fladoAvailable);
      assert.strictEqual(eta.standardDays, 1);
      assert.strictEqual(eta.fladoMinutes, 10);
    });

    it('should return 3-day standard delivery for non-metro pincodes', async () => {
      const eta = await api.delivery.getETA('411001'); // Pune Non-Metro
      assert.strictEqual(eta.fladoAvailable, false);
      assert.strictEqual(eta.standardDays, 3);
      assert.strictEqual(eta.fladoMinutes, undefined);
    });
  });

  describe('Wishlist API (LocalStorage backed)', () => {
    it('should manage product additions and removals', () => {
      // Clear wishlist first
      localStorage.clear();
      
      // Check initial empty wishlist
      let list = api.wishlist.get();
      assert.strictEqual(list.length, 0);

      // Add product
      api.wishlist.add('ele-1');
      list = api.wishlist.get();
      assert.strictEqual(list.length, 1);
      assert.ok(list.includes('ele-1'));

      // Toggle off product
      const activeStateAfterToggleOff = api.wishlist.toggle('ele-1');
      assert.strictEqual(activeStateAfterToggleOff, false); // toggled off, so not in wishlist
      list = api.wishlist.get();
      assert.strictEqual(list.length, 0);

      // Toggle on product
      const activeStateAfterToggleOn = api.wishlist.toggle('ele-5');
      assert.strictEqual(activeStateAfterToggleOn, true); // toggled on
      list = api.wishlist.get();
      assert.strictEqual(list.length, 1);
      assert.ok(list.includes('ele-5'));
    });
  });
});
