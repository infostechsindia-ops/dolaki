import { getFullApiUrl } from '../config/env';
import { getSecureItem, setSecureItem, removeSecureItem } from '../storage/secureStore';

export const MERCHANT_TOKEN_KEY = 'merchant_auth_token';

export async function getAuthToken(): Promise<string | null> {
  return await getSecureItem(MERCHANT_TOKEN_KEY);
}

export async function saveAuthToken(token: string): Promise<void> {
  await setSecureItem(MERCHANT_TOKEN_KEY, token);
}

export async function clearAuthCredentials(): Promise<void> {
  await removeSecureItem(MERCHANT_TOKEN_KEY);
}

export interface DarkstoreDTO {
  id: string;
  name?: string;
  shopName?: string;
  approvalStatus: string;
  isOpen: boolean;
  address: string;
}

export interface DashboardMetricsDTO {
  shopId: string;
  shopName: string;
  approvalStatus: string;
  isOpen: boolean;
  isOperational: boolean;
  operatingHoursJson: string | null;
  deliveryRadiusKm: number;
  deliveryFeeType: string;
  deliveryFeeAmount: number;
  capacity: {
    maxCapacityOrdersPerHour: number;
    currentHourlyOrderCount: number;
    capacityUtilizationPercentage: number;
    capacityWarning: string | null;
  };
  queueSummary: {
    activeQueueCount: number;
    ordersRequiringActionCount: number;
    pendingShipmentCount: number;
  };
  inventorySummary: {
    totalSKUsCount: number;
    inStockCount: number;
    lowStockCount: number;
    outOfStockCount: number;
  };
  salesSummary: {
    todayOrdersCount: number;
    todayGrossRevenueMinor: number;
    formattedTodayGrossRevenue: string;
    avgDeliveryMinutes: number | null;
  };
  slaWarnings: Array<{
    code: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    message: string;
  }>;
}

export interface OrderQueueItemDTO {
  orderId: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  receivedTimeAgo: string;
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    unitPriceMinor: number;
    formattedUnitPrice: string;
    subtotalMinor: number;
    formattedSubtotal: string;
  }>;
  itemCount: number;
  vendorTotalMinor: number;
  formattedVendorTotal: string;
  slaWarning: {
    code: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    message: string;
  } | null;
  substitutionAttention: boolean;
  isCancelled: boolean;
  availableFulfillmentActions: Array<'ACCEPT' | 'PACK' | 'SHIP'>;
}

export interface OrderBoardDTO {
  shopId: string;
  shopName: string;
  isOperational: boolean;
  totalActiveOrdersCount: number;
  columns: {
    newPlaced: OrderQueueItemDTO[];
    preparingPacking: OrderQueueItemDTO[];
    readyDispatch: OrderQueueItemDTO[];
    completedHistory: OrderQueueItemDTO[];
  };
  slaSummary: {
    freshCount: number;
    elevatedWarningCount: number;
    criticalBreachCount: number;
  };
}

export interface PickingSessionItemDTO {
  id: string;
  productId: string | null;
  title: string;
  sku: string | null;
  quantity: number;
  pickedQuantity: number;
  pickingItemStatus: 'PENDING' | 'PICKED' | 'OUT_OF_STOCK' | 'SUBSTITUTED';
  unitPriceMinor: number;
  formattedUnitPrice: string;
}

export interface PickingSessionDTO {
  orderId: string;
  orderNumber: string;
  shopId: string;
  pickerUserId: string | null;
  pickerName: string | null;
  pickingStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'PARTIAL_OOS';
  startedAt: string | null;
  completedAt: string | null;
  totalItemCount: number;
  pickedItemCount: number;
  outOfStockCount: number;
  items: PickingSessionItemDTO[];
}

export interface RiderHandoffStatusDTO {
  orderId: string;
  orderNumber: string;
  shopId: string;
  orderStatus: string;
  pickingStatus: string;
  isHandoffReady: boolean;
  blockedReason: string | null;
  rider: {
    riderId: string | null;
    riderName: string | null;
    riderPhone: string | null;
    isAssigned: boolean;
  };
  otpChallenge: {
    hasActiveChallenge: boolean;
    expiresAt: string | null;
    isExpired: boolean;
    isLocked: boolean;
    isUsed: boolean;
    attemptCount: number;
    maxAttempts: number;
  };
  handoffCompletedAt: string | null;
  rawOtpForMerchantDisplay?: string;
}

export interface DarkstoreStaffDTO {
  id: string;
  userId: string;
  email: string;
  vendorRole: 'OWNER' | 'MANAGER' | 'FULFILLMENT_STAFF';
  status: 'ACTIVE' | 'INACTIVE';
  assignedShopIds: string[];
  isDarkstoreOwner: boolean;
}

export interface DailySalesSummaryDTO {
  date: string;
  orderCount: number;
  grossSalesMinor: number;
  formattedGrossSales: string;
  refundsMinor: number;
  formattedRefunds: string;
  netSalesMinor: number;
  formattedNetSales: string;
  totalUnitsSold: number;
}

export interface SlaPerformanceMetricsDTO {
  totalOrdersAnalyzed: number;
  avgAcceptanceMins: number | null;
  avgPickingMins: number | null;
  avgHandoffMins: number | null;
  avgTotalFulfillmentMins: number | null;
  slaBreachCount: number;
  slaBreachRatePercentage: number;
  fulfillmentSlaHealthPercentage: number;
}

export interface OosProductTrendDTO {
  productId: string;
  title: string;
  sku: string;
  oosCount: number;
  substitutionAcceptedCount: number;
  substitutionRejectedCount: number;
  shortageRefundCount: number;
}

export interface MultiStoreComparisonDTO {
  shopId: string;
  shopName: string;
  orderCount: number;
  grossSalesMinor: number;
  formattedGrossSales: string;
  slaBreachRatePercentage: number;
  oosEventCount: number;
}

export interface MerchantReportDTO {
  shopId: string;
  shopName: string;
  startDate: string;
  endDate: string;
  salesSummary: {
    totalOrders: number;
    totalUnitsSold: number;
    grossSalesMinor: number;
    formattedGrossSales: string;
    refundsMinor: number;
    formattedRefunds: string;
    netSalesMinor: number;
    formattedNetSales: string;
  };
  dailyBreakdown: DailySalesSummaryDTO[];
  slaMetrics: SlaPerformanceMetricsDTO;
  oosTrends: {
    totalOosEvents: number;
    topOosProducts: OosProductTrendDTO[];
    unresolvedShortageCount: number;
  };
  performance: {
    completedOrdersCount: number;
    cancelledOrdersCount: number;
    completionRatePercentage: number;
    cancellationRatePercentage: number;
  };
  multiStoreComparison: MultiStoreComparisonDTO[];
}

export async function fetchMerchantApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const fullUrl = getFullApiUrl(endpoint);
  const token = await getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    throw new Error('401 Session expired. Please log in again.');
  }

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    throw new Error(errorJson.message || `API error ${response.status}`);
  }

  let data = await response.json();
  if (data && typeof data === 'object' && 'data' in data) {
    data = data.data;
  }
  return data as T;
}

export const merchantApi = {
  getMerchantShops: () => fetchMerchantApi<DarkstoreDTO[]>('/api/v1/flado/merchant/shops'),
  getShopDashboard: (shopId: string) => fetchMerchantApi<DashboardMetricsDTO>(`/api/v1/flado/shops/${shopId}/dashboard`),
  toggleOperationalState: (shopId: string, isOpen: boolean, reason?: string) =>
    fetchMerchantApi<DashboardMetricsDTO>(`/api/v1/flado/shops/${shopId}/operational-state`, {
      method: 'PUT',
      body: JSON.stringify({ isOpen, reason }),
    }),
  getOrderBoard: (shopId: string) => fetchMerchantApi<OrderBoardDTO>(`/api/v1/flado/shops/${shopId}/orders/board`),
  transitionOrderStatus: (shopId: string, orderId: string, action: 'ACCEPT' | 'PACK' | 'SHIP' | 'DELIVER') =>
    fetchMerchantApi<OrderQueueItemDTO>(`/api/v1/flado/shops/${shopId}/orders/${orderId}/transition`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    }),
  getPickingSession: (shopId: string, orderId: string) =>
    fetchMerchantApi<PickingSessionDTO>(`/api/v1/flado/shops/${shopId}/orders/${orderId}/picking`),
  assignPicker: (shopId: string, orderId: string, pickerUserId: string) =>
    fetchMerchantApi<PickingSessionDTO>(`/api/v1/flado/shops/${shopId}/orders/${orderId}/picking/assign`, {
      method: 'POST',
      body: JSON.stringify({ pickerUserId }),
    }),
  updatePickingItem: (
    shopId: string,
    orderId: string,
    itemId: string,
    dto: { pickedQuantity?: number; pickingItemStatus?: 'PENDING' | 'PICKED' | 'OUT_OF_STOCK' | 'SUBSTITUTED' },
  ) =>
    fetchMerchantApi<PickingSessionDTO>(`/api/v1/flado/shops/${shopId}/orders/${orderId}/picking/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    }),
  completePickingSession: (shopId: string, orderId: string) =>
    fetchMerchantApi<PickingSessionDTO>(`/api/v1/flado/shops/${shopId}/orders/${orderId}/picking/complete`, {
      method: 'POST',
    }),
  getRiderHandoffStatus: (shopId: string, orderId: string) =>
    fetchMerchantApi<RiderHandoffStatusDTO>(`/api/v1/flado/shops/${shopId}/orders/${orderId}/handoff`),
  assignRider: (shopId: string, orderId: string, riderId: string) =>
    fetchMerchantApi<RiderHandoffStatusDTO>(`/api/v1/flado/shops/${shopId}/orders/${orderId}/handoff/assign-rider`, {
      method: 'POST',
      body: JSON.stringify({ riderId }),
    }),
  generatePickupChallenge: (shopId: string, orderId: string) =>
    fetchMerchantApi<RiderHandoffStatusDTO>(`/api/v1/flado/shops/${shopId}/orders/${orderId}/handoff/challenge`, {
      method: 'POST',
    }),
  verifyRiderHandoff: (shopId: string, orderId: string, otp: string) =>
    fetchMerchantApi<RiderHandoffStatusDTO>(`/api/v1/flado/shops/${shopId}/orders/${orderId}/handoff/verify`, {
      method: 'POST',
      body: JSON.stringify({ otp }),
    }),
  getDarkstoreStaff: (shopId: string) =>
    fetchMerchantApi<DarkstoreStaffDTO[]>(`/api/v1/flado/shops/${shopId}/staff`),
  assignStaffToDarkstore: (shopId: string, staffId: string, targetShopId: string) =>
    fetchMerchantApi<DarkstoreStaffDTO[]>(`/api/v1/flado/shops/${shopId}/staff/${staffId}/assign-shop`, {
      method: 'POST',
      body: JSON.stringify({ targetShopId }),
    }),
  removeStaffFromDarkstore: (shopId: string, staffId: string, targetShopId: string) =>
    fetchMerchantApi<DarkstoreStaffDTO[]>(`/api/v1/flado/shops/${shopId}/staff/${staffId}/assign-shop/${targetShopId}`, {
      method: 'DELETE',
    }),
  updateStaffRoleOrStatus: (
    shopId: string,
    staffId: string,
    dto: { vendorRole?: 'OWNER' | 'MANAGER' | 'FULFILLMENT_STAFF'; status?: 'ACTIVE' | 'INACTIVE' },
  ) =>
    fetchMerchantApi<DarkstoreStaffDTO[]>(`/api/v1/flado/shops/${shopId}/staff/${staffId}/role-status`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    }),
  getDarkstoreStaffActivity: (shopId: string) =>
    fetchMerchantApi<any[]>(`/api/v1/flado/shops/${shopId}/staff/activity`),
  inviteStaff: (shopId: string, email: string, vendorRole: 'OWNER' | 'MANAGER' | 'FULFILLMENT_STAFF') =>
    fetchMerchantApi<any>(`/api/v1/flado/shops/${shopId}/staff/invite`, {
      method: 'POST',
      body: JSON.stringify({ email, vendorRole }),
    }),
  getDarkstoreInvitations: (shopId: string) =>
    fetchMerchantApi<any[]>(`/api/v1/flado/shops/${shopId}/staff/invitations`),
  revokeInvitation: (shopId: string, invitationId: string) =>
    fetchMerchantApi<any[]>(`/api/v1/flado/shops/${shopId}/staff/invitations/${invitationId}`, {
      method: 'DELETE',
    }),
  getMerchantReport: (shopId: string, startDate?: string, endDate?: string) => {
    const query = new URLSearchParams();
    if (startDate) query.append('startDate', startDate);
    if (endDate) query.append('endDate', endDate);
    const qStr = query.toString();
    return fetchMerchantApi<MerchantReportDTO>(`/api/v1/flado/shops/${shopId}/reports${qStr ? `?${qStr}` : ''}`);
  },
  exportMerchantReportCsv: async (shopId: string, startDate?: string, endDate?: string) => {
    const query = new URLSearchParams();
    if (startDate) query.append('startDate', startDate);
    if (endDate) query.append('endDate', endDate);
    const qStr = query.toString();
    return fetchMerchantApi<string>(`/api/v1/flado/shops/${shopId}/reports/export${qStr ? `?${qStr}` : ''}`);
  },
};
