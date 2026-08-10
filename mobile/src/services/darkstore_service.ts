export interface DarkstoreDashboardStats {
  activeOrdersCount: number;
  pickingQueueCount: number;
  packingQueueCount: number;
  dispatchQueueCount: number;
  riderQueueCount: number;
  lowStockItemsCount: number;
  outOfStockItemsCount: number;
  replenishmentQueueCount: number;
  slaCompliancePercentage: number;
  averagePickingTimeSeconds: number;
  averagePackingTimeSeconds: number;
  averageDeliveryTimeMinutes: number;
}

export interface DarkstoreBinLocation {
  sku: string;
  title: string;
  binLocation: string; // e.g. "Bin B-04-A"
  zone: string;
  quantityInBin: number;
  rotationPolicy: 'FIFO' | 'FEFO';
  expiryDate?: string;
  batchNumber: string;
}

export interface SlaMonitorStatus {
  orderId: string;
  pickingSlaSecondsRemaining: number;
  packingSlaSecondsRemaining: number;
  isLate: boolean;
  statusText: string;
}

export class DarkstoreService {
  private cache = new Map<string, any>();
  private isOnlineStatus = true;

  setOnlineStatus(online: boolean): void {
    this.isOnlineStatus = online;
  }

  isOnline(): boolean {
    return this.isOnlineStatus;
  }

  getDashboardStats(): DarkstoreDashboardStats {
    const stats: DarkstoreDashboardStats = {
      activeOrdersCount: 24,
      pickingQueueCount: 5,
      packingQueueCount: 3,
      dispatchQueueCount: 4,
      riderQueueCount: 8,
      lowStockItemsCount: 2,
      outOfStockItemsCount: 0,
      replenishmentQueueCount: 3,
      slaCompliancePercentage: 98.4,
      averagePickingTimeSeconds: 110, // 1 min 50 sec
      averagePackingTimeSeconds: 55,  // 55 sec
      averageDeliveryTimeMinutes: 8.5, // 8.5 mins
    };
    if (this.isOnlineStatus) {
      this.cache.set('darkstore_stats', stats);
    }
    return this.cache.get('darkstore_stats') || stats;
  }

  lookupBinLocation(barcodeOrSku: string): DarkstoreBinLocation | null {
    if (barcodeOrSku === '8901234567890' || barcodeOrSku === 'prod-milk-1') {
      return {
        sku: 'SKU-MILK-1L-001',
        title: 'Organic Milk 1L',
        binLocation: 'Bin B-04-A',
        zone: 'Cold Zone C1',
        quantityInBin: 60,
        rotationPolicy: 'FEFO',
        expiryDate: '2026-08-12',
        batchNumber: 'BATCH-MILK-9902',
      };
    }
    return null;
  }

  getSlaMonitor(orderId: string): SlaMonitorStatus {
    return {
      orderId,
      pickingSlaSecondsRemaining: 70,
      packingSlaSecondsRemaining: 120,
      isLate: false,
      statusText: 'ON_TRACK_FOR_10_MIN_DELIVERY',
    };
  }

  triggerReplenishmentRequest(sku: string, requestedQty: number, source: 'WAREHOUSE' | 'SUPPLIER'): { success: boolean; transferId: string } {
    if (!this.isOnlineStatus) {
      throw new Error('Network Connection Required to Trigger Replenishment Request');
    }
    return { success: true, transferId: `trf-${Date.now()}` };
  }
}

export const darkstoreService = new DarkstoreService();
