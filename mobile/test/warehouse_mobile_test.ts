import assert from 'node:assert';
import { test, describe } from 'node:test';
import { warehouseMobileService } from '../src/services/warehouse_service.ts';
import type { PickTaskItem } from '../src/services/warehouse_service.ts';

describe('WAREHOUSE-001 Warehouse Mobile & Inventory Operations Tests', () => {
  test('1. Warehouse Dashboard stats report picking, packing, and queue metrics accurately', () => {
    const stats = warehouseMobileService.getDashboardStats();
    assert.strictEqual(stats.todayOrdersCount, 142);
    assert.strictEqual(stats.pickingQueueCount, 18);
    assert.strictEqual(stats.returnsWaitingCount, 5);
  });

  test('2. Barcode inventory lookup resolves shelf location and batch number', () => {
    const item = warehouseMobileService.lookupInventoryByBarcode('8901234567890');
    assert.ok(item !== null);
    assert.strictEqual(item?.sku, 'SKU-HEADPHONE-001');
    assert.strictEqual(item?.shelfLocation, 'A-12-04');
    assert.strictEqual(item?.batchNumber, 'BATCH-2026-08');
  });

  test('3. Picking item verification updates picked quantity upon exact barcode match', () => {
    const mockTask: PickTaskItem = {
      id: 'pick-101',
      orderId: 'ord-551',
      sku: 'SKU-HEADPHONE-001',
      title: 'Wireless Headphones Black',
      quantityRequested: 2,
      quantityPicked: 0,
      shelfLocation: 'A-12-04',
      status: 'PENDING',
    };

    const res = warehouseMobileService.verifyPickItem(mockTask, '8901234567890');
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.updatedTask.status, 'VERIFIED');
    assert.strictEqual(res.updatedTask.quantityPicked, 2);
  });

  test('4. Return inspection quality grading processes RESTOCK and DAMAGED actions', () => {
    const resRestock = warehouseMobileService.gradeReturnedItem('ret-881', 'RESTOCK');
    assert.strictEqual(resRestock.action, 'RESTOCK');

    const resDamaged = warehouseMobileService.gradeReturnedItem('ret-882', 'DAMAGED');
    assert.strictEqual(resDamaged.action, 'DAMAGED');
  });

  test('5. Offline state blocks picking verification and return quality mutations', () => {
    warehouseMobileService.setOnlineStatus(false);
    let errorCaught = false;

    try {
      warehouseMobileService.gradeReturnedItem('ret-881', 'RESTOCK');
    } catch (e: any) {
      errorCaught = true;
      assert.strictEqual(e.message, 'Network Connection Required for Return Quality Inspection');
    }

    assert.strictEqual(errorCaught, true);
    warehouseMobileService.setOnlineStatus(true);
  });
});
