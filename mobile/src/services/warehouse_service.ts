export interface WarehouseDashboardStats {
  todayOrdersCount: number;
  pickingQueueCount: number;
  packingQueueCount: number;
  dispatchQueueCount: number;
  incomingShipmentsCount: number;
  lowStockItemsCount: number;
  outOfStockItemsCount: number;
  damagedItemsCount: number;
  returnsWaitingCount: number;
}

export interface InventoryItemLocation {
  sku: string;
  title: string;
  quantityOnHand: number;
  quantityReserved: number;
  shelfLocation: string;
  zone: string;
  barcode: string;
  batchNumber: string;
  expiryDate?: string;
}

export interface PickTaskItem {
  id: string;
  orderId: string;
  sku: string;
  title: string;
  quantityRequested: number;
  quantityPicked: number;
  shelfLocation: string;
  status: 'PENDING' | 'VERIFIED' | 'SHORTAGE';
}

export class WarehouseMobileService {
  private cache = new Map<string, any>();
  private isOnlineStatus = true;

  setOnlineStatus(online: boolean): void {
    this.isOnlineStatus = online;
  }

  isOnline(): boolean {
    return this.isOnlineStatus;
  }

  getDashboardStats(): WarehouseDashboardStats {
    const stats: WarehouseDashboardStats = {
      todayOrdersCount: 142,
      pickingQueueCount: 18,
      packingQueueCount: 9,
      dispatchQueueCount: 6,
      incomingShipmentsCount: 3,
      lowStockItemsCount: 4,
      outOfStockItemsCount: 1,
      damagedItemsCount: 2,
      returnsWaitingCount: 5,
    };
    if (this.isOnlineStatus) {
      this.cache.set('warehouse_stats', stats);
    }
    return this.cache.get('warehouse_stats') || stats;
  }

  lookupInventoryByBarcode(barcode: string): InventoryItemLocation | null {
    if (barcode === '8901234567890' || barcode === 'SKU-HEADPHONE-001') {
      return {
        sku: 'SKU-HEADPHONE-001',
        title: 'Wireless Headphones Black',
        quantityOnHand: 45,
        quantityReserved: 5,
        shelfLocation: 'A-12-04',
        zone: 'Zone A',
        barcode: '8901234567890',
        batchNumber: 'BATCH-2026-08',
      };
    }
    return null;
  }

  verifyPickItem(task: PickTaskItem, scannedBarcode: string): { success: boolean; updatedTask: PickTaskItem } {
    if (!this.isOnlineStatus) {
      throw new Error('Network Connection Required for Picking Verification');
    }
    if (scannedBarcode === '8901234567890') {
      const updatedTask = { ...task, quantityPicked: task.quantityRequested, status: 'VERIFIED' as const };
      return { success: true, updatedTask };
    }
    return { success: false, updatedTask: task };
  }

  gradeReturnedItem(returnId: string, action: 'RESTOCK' | 'DAMAGED' | 'REPAIR' | 'DISPOSE'): { success: boolean; action: string } {
    if (!this.isOnlineStatus) {
      throw new Error('Network Connection Required for Return Quality Inspection');
    }
    return { success: true, action };
  }
}

export const warehouseMobileService = new WarehouseMobileService();
