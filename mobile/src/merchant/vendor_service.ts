export interface VendorDashboardStatsDto {
  todaySalesCents: number;
  formattedTodaySales: string;
  todayOrdersCount: number;
  pendingOrdersCount: number;
  lowStockItemsCount: number;
  outOfStockItemsCount: number;
  activeCampaignsCount: number;
  upcomingPayoutCents: number;
  formattedUpcomingPayout: string;
}

export interface VendorOrderQueueDto {
  id: string;
  orderNumber: string;
  status: 'NEW' | 'ACCEPTED' | 'PACKED' | 'READY' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  customerName: string;
  itemsCount: number;
  totalCents: number;
  formattedTotal: string;
  createdAt: string;
}

export class VendorMobileService {
  private cache = new Map<string, any>();
  private isOnlineStatus = true;

  setOnlineStatus(online: boolean): void {
    this.isOnlineStatus = online;
  }

  isOnline(): boolean {
    return this.isOnlineStatus;
  }

  getDashboardStats(): VendorDashboardStatsDto {
    const stats: VendorDashboardStatsDto = {
      todaySalesCents: 458000,
      formattedTodaySales: '₹4,580',
      todayOrdersCount: 18,
      pendingOrdersCount: 4,
      lowStockItemsCount: 3,
      outOfStockItemsCount: 1,
      activeCampaignsCount: 2,
      upcomingPayoutCents: 1245000,
      formattedUpcomingPayout: '₹12,450',
    };
    if (this.isOnlineStatus) {
      this.cache.set('dashboard_stats', stats);
    }
    return this.cache.get('dashboard_stats') || stats;
  }

  scanBarcode(barcode: string): { sku: string; found: boolean } {
    if (barcode === '8901234567890') {
      return { sku: 'SKU-HEADPHONE-001', found: true };
    }
    return { sku: '', found: false };
  }

  processOrderAction(orderId: string, action: 'ACCEPT' | 'PACK' | 'DISPATCH'): { success: boolean; newStatus: string } {
    if (!this.isOnlineStatus) {
      throw new Error('Internet Connection Required to Process Order Mutations');
    }
    const statusMap = {
      ACCEPT: 'ACCEPTED',
      PACK: 'PACKED',
      DISPATCH: 'SHIPPED',
    };
    return { success: true, newStatus: statusMap[action] };
  }
}

export const vendorMobileService = new VendorMobileService();
