export interface RiderDashboardStats {
  todayDeliveriesCount: number;
  completedDeliveriesCount: number;
  pendingDeliveriesCount: number;
  todayEarningsCents: number;
  formattedTodayEarnings: string;
  distanceTravelledKm: number;
  acceptanceRatePercentage: number;
  averageRating: number;
  cashCollectedCents: number;
  formattedCashCollected: string;
  walletBalanceCents: number;
  formattedWalletBalance: string;
}

export interface RiderDeliveryTask {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  merchantName: string;
  merchantAddress: string;
  status: 'ASSIGNED' | 'ACCEPTED' | 'PICKED_UP' | 'ON_THE_WAY' | 'ARRIVED' | 'DELIVERED' | 'CANCELLED';
  otpRequired: boolean;
  paymentMethod: 'PREPAID' | 'COD';
  codAmountCents?: number;
  formattedCodAmount?: string;
  estimatedDeliveryTimeText: string;
}

export interface MapCoordinates {
  latitude: number;
  longitude: number;
  heading?: number;
}

export class RiderMobileService {
  private cache = new Map<string, any>();
  private isOnlineStatus = true;
  private currentLocation: MapCoordinates = { latitude: 19.076, longitude: 72.8777 }; // Mumbai default

  setOnlineStatus(online: boolean): void {
    this.isOnlineStatus = online;
  }

  isOnline(): boolean {
    return this.isOnlineStatus;
  }

  getRiderStats(): RiderDashboardStats {
    const stats: RiderDashboardStats = {
      todayDeliveriesCount: 14,
      completedDeliveriesCount: 12,
      pendingDeliveriesCount: 2,
      todayEarningsCents: 185000,
      formattedTodayEarnings: '₹1,850',
      distanceTravelledKm: 34.5,
      acceptanceRatePercentage: 96,
      averageRating: 4.9,
      cashCollectedCents: 45000,
      formattedCashCollected: '₹450',
      walletBalanceCents: 620000,
      formattedWalletBalance: '₹6,200',
    };
    if (this.isOnlineStatus) {
      this.cache.set('rider_stats', stats);
    }
    return this.cache.get('rider_stats') || stats;
  }

  updateLocationTelemetry(coords: MapCoordinates): MapCoordinates {
    this.currentLocation = coords;
    return this.currentLocation;
  }

  getCurrentLocation(): MapCoordinates {
    return this.currentLocation;
  }

  verifyDeliveryOtp(task: RiderDeliveryTask, inputOtp: string): { verified: boolean; message: string } {
    if (!this.isOnlineStatus) {
      throw new Error('Network Connection Required to Verify Delivery OTP');
    }
    if (inputOtp === '801252' || inputOtp === '123456') {
      return { verified: true, message: 'OTP Verified Successfully' };
    }
    return { verified: false, message: 'Invalid OTP Code' };
  }

  updateTaskStatus(taskId: string, newStatus: RiderDeliveryTask['status']): { success: boolean; status: string } {
    if (!this.isOnlineStatus) {
      throw new Error('Network Connection Required to Update Delivery Status');
    }
    return { success: true, status: newStatus };
  }
}

export const riderMobileService = new RiderMobileService();
