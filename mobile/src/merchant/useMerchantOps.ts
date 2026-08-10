import { useState, useEffect, useCallback, useRef } from 'react';
import {
  merchantApi,
  DarkstoreDTO,
  DashboardMetricsDTO,
  OrderBoardDTO,
  PickingSessionDTO,
  RiderHandoffStatusDTO,
  DarkstoreStaffDTO,
  MerchantReportDTO,
} from './api';

export type NetworkState = 'ONLINE' | 'OFFLINE' | 'RECONNECTING';

export function useMerchantOps() {
  const [shops, setShops] = useState<DarkstoreDTO[]>([]);
  const [selectedShopId, setSelectedShopId] = useState<string>('');
  const [dashboard, setDashboard] = useState<DashboardMetricsDTO | null>(null);
  const [orderBoard, setOrderBoard] = useState<OrderBoardDTO | null>(null);
  const [pickingSession, setPickingSession] = useState<PickingSessionDTO | null>(null);
  const [handoffStatus, setHandoffStatus] = useState<RiderHandoffStatusDTO | null>(null);
  const [staffList, setStaffList] = useState<DarkstoreStaffDTO[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [report, setReport] = useState<MerchantReportDTO | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [networkState, setNetworkState] = useState<NetworkState>('ONLINE');
  const [isStaleData, setIsStaleData] = useState<boolean>(false);
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<string | null>(null);

  const lastFetchTimeRef = useRef<number>(0);

  const loadShops = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await merchantApi.getMerchantShops();
      setShops(data);
      if (data && data.length > 0 && !selectedShopId) {
        setSelectedShopId(data[0].id);
      }
      setNetworkState('ONLINE');
      setIsStaleData(false);
      setLastSyncTimestamp(new Date().toLocaleTimeString());
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch darkstores');
      if (err?.message?.includes('Network') || err?.message?.includes('fetch') || err?.message?.includes('offline')) {
        setNetworkState('OFFLINE');
        setIsStaleData(true);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedShopId]);

  const loadDashboardAndBoard = useCallback(async (shopId: string) => {
    if (!shopId) return;

    // Storm Prevention: Debounce refetch if called within 2 seconds
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 2000) {
      return;
    }
    lastFetchTimeRef.current = now;

    try {
      setLoading(true);
      setError(null);
      const [dash, board] = await Promise.all([
        merchantApi.getShopDashboard(shopId),
        merchantApi.getOrderBoard(shopId),
      ]);
      setDashboard(dash);
      setOrderBoard(board);
      setNetworkState('ONLINE');
      setIsStaleData(false);
      setLastSyncTimestamp(new Date().toLocaleTimeString());
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch operational state');
      if (err?.message?.includes('Network') || err?.message?.includes('fetch') || err?.message?.includes('offline')) {
        setNetworkState('OFFLINE');
        setIsStaleData(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadShops();
  }, [loadShops]);

  useEffect(() => {
    if (selectedShopId) {
      loadDashboardAndBoard(selectedShopId);
    }
  }, [selectedShopId, loadDashboardAndBoard]);

  // Reconnection helper
  const handleReconnect = async () => {
    setNetworkState('RECONNECTING');
    await loadShops();
    if (selectedShopId) {
      await loadDashboardAndBoard(selectedShopId);
    }
  };

  // ─── STRICT OFFLINE MUTATION PROTECTION (FAIL FAST) ──────────────────────────

  const assertOnlineForMutation = (actionName: string): boolean => {
    if (networkState === 'OFFLINE') {
      setError(`Operation unavailable offline (${actionName}). Please reconnect to network to perform operational mutations.`);
      return false;
    }
    return true;
  };

  const toggleOperationalState = async (isOpen: boolean) => {
    if (!assertOnlineForMutation('Store Open/Close Toggle')) return;
    if (!selectedShopId) return;
    try {
      setLoading(true);
      setError(null);
      const updated = await merchantApi.toggleOperationalState(selectedShopId, isOpen);
      setDashboard(updated);
    } catch (err: any) {
      setError(err?.message || 'Store state toggle failed');
    } finally {
      setLoading(false);
    }
  };

  const transitionOrderStatus = async (orderId: string, action: 'ACCEPT' | 'PACK' | 'SHIP' | 'DELIVER') => {
    if (!assertOnlineForMutation('Order Transition')) return;
    if (!selectedShopId) return;
    try {
      setLoading(true);
      setError(null);
      await merchantApi.transitionOrderStatus(selectedShopId, orderId, action);
      await loadDashboardAndBoard(selectedShopId);
    } catch (err: any) {
      setError(err?.message || 'Order status transition failed');
    } finally {
      setLoading(false);
    }
  };

  const loadPickingSession = async (orderId: string) => {
    if (!selectedShopId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await merchantApi.getPickingSession(selectedShopId, orderId);
      setPickingSession(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to load picking session');
    } finally {
      setLoading(false);
    }
  };

  const updatePickingItem = async (
    orderId: string,
    itemId: string,
    dto: { pickedQuantity?: number; pickingItemStatus?: 'PENDING' | 'PICKED' | 'OUT_OF_STOCK' | 'SUBSTITUTED' },
  ) => {
    if (!assertOnlineForMutation('Picking Item Update')) return;
    if (!selectedShopId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await merchantApi.updatePickingItem(selectedShopId, orderId, itemId, dto);
      setPickingSession(res);
    } catch (err: any) {
      setError(err?.message || 'Picking item update failed');
    } finally {
      setLoading(false);
    }
  };

  const completePickingSession = async (orderId: string) => {
    if (!assertOnlineForMutation('Complete Picking Session')) return;
    if (!selectedShopId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await merchantApi.completePickingSession(selectedShopId, orderId);
      setPickingSession(res);
      await loadDashboardAndBoard(selectedShopId);
    } catch (err: any) {
      setError(err?.message || 'Picking session completion failed');
    } finally {
      setLoading(false);
    }
  };

  const loadHandoffStatus = async (orderId: string) => {
    if (!selectedShopId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await merchantApi.getRiderHandoffStatus(selectedShopId, orderId);
      setHandoffStatus(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to load rider handoff status');
    } finally {
      setLoading(false);
    }
  };

  const generatePickupChallenge = async (orderId: string) => {
    if (!assertOnlineForMutation('Generate OTP Challenge')) return;
    if (!selectedShopId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await merchantApi.generatePickupChallenge(selectedShopId, orderId);
      setHandoffStatus(res);
    } catch (err: any) {
      setError(err?.message || 'Pickup OTP challenge error');
    } finally {
      setLoading(false);
    }
  };

  const verifyRiderHandoff = async (orderId: string, otp: string) => {
    if (!assertOnlineForMutation('Verify Rider Handoff OTP')) return;
    if (!selectedShopId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await merchantApi.verifyRiderHandoff(selectedShopId, orderId, otp);
      setHandoffStatus(res);
      await loadDashboardAndBoard(selectedShopId);
    } catch (err: any) {
      setError(err?.message || 'OTP verification error');
    } finally {
      setLoading(false);
    }
  };

  const loadMerchantReport = async (startDate?: string, endDate?: string) => {
    if (!selectedShopId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await merchantApi.getMerchantReport(selectedShopId, startDate, endDate);
      setReport(res);
      setNetworkState('ONLINE');
      setIsStaleData(false);
      setLastSyncTimestamp(new Date().toLocaleTimeString());
    } catch (err: any) {
      setError(err?.message || 'Failed to load merchant report');
      if (err?.message?.includes('Network') || err?.message?.includes('fetch') || err?.message?.includes('offline')) {
        setNetworkState('OFFLINE');
        setIsStaleData(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const exportMerchantReportCsv = async (startDate?: string, endDate?: string): Promise<string | null> => {
    if (networkState === 'OFFLINE') {
      setError('CSV Report Export requires an active network connection.');
      return null;
    }
    if (!selectedShopId) return null;
    try {
      setLoading(true);
      setError(null);
      const csvData = await merchantApi.exportMerchantReportCsv(selectedShopId, startDate, endDate);
      return csvData;
    } catch (err: any) {
      setError(err?.message || 'Failed to export CSV report');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadDarkstoreStaff = async () => {
    if (!selectedShopId) return;
    try {
      setLoading(true);
      setError(null);
      const list = await merchantApi.getDarkstoreStaff(selectedShopId);
      setStaffList(list);
    } catch (err: any) {
      setError(err?.message || 'Failed to load staff directory');
    } finally {
      setLoading(false);
    }
  };

  const assignStaffToDarkstore = async (staffId: string, targetShopId: string) => {
    if (!assertOnlineForMutation('Assign Darkstore to Staff')) return;
    if (!selectedShopId) return;
    try {
      setLoading(true);
      setError(null);
      const updated = await merchantApi.assignStaffToDarkstore(selectedShopId, staffId, targetShopId);
      setStaffList(updated);
    } catch (err: any) {
      setError(err?.message || 'Failed to assign darkstore to staff');
    } finally {
      setLoading(false);
    }
  };

  const removeStaffFromDarkstore = async (staffId: string, targetShopId: string) => {
    if (!assertOnlineForMutation('Remove Darkstore from Staff')) return;
    if (!selectedShopId) return;
    try {
      setLoading(true);
      setError(null);
      const updated = await merchantApi.removeStaffFromDarkstore(selectedShopId, staffId, targetShopId);
      setStaffList(updated);
    } catch (err: any) {
      setError(err?.message || 'Failed to remove darkstore from staff');
    } finally {
      setLoading(false);
    }
  };

  const updateStaffRoleOrStatus = async (
    staffId: string,
    dto: { vendorRole?: 'OWNER' | 'MANAGER' | 'FULFILLMENT_STAFF'; status?: 'ACTIVE' | 'INACTIVE' },
  ) => {
    if (!assertOnlineForMutation('Update Staff Role or Status')) return;
    if (!selectedShopId) return;
    try {
      setLoading(true);
      setError(null);
      const updated = await merchantApi.updateStaffRoleOrStatus(selectedShopId, staffId, dto);
      setStaffList(updated);
    } catch (err: any) {
      setError(err?.message || 'Failed to update staff role/status');
    } finally {
      setLoading(false);
    }
  };

  const loadStaffActivity = async () => {
    if (!selectedShopId) return;
    try {
      setLoading(true);
      setError(null);
      const logs = await merchantApi.getDarkstoreStaffActivity(selectedShopId);
      setActivityLogs(logs);
    } catch (err: any) {
      setError(err?.message || 'Failed to load staff activity log');
    } finally {
      setLoading(false);
    }
  };

  const inviteStaff = async (email: string, vendorRole: 'OWNER' | 'MANAGER' | 'FULFILLMENT_STAFF') => {
    if (!assertOnlineForMutation('Invite Staff Member')) return;
    if (!selectedShopId) return;
    try {
      setLoading(true);
      setError(null);
      await merchantApi.inviteStaff(selectedShopId, email, vendorRole);
      await loadInvitations();
    } catch (err: any) {
      setError(err?.message || 'Failed to send staff invitation');
    } finally {
      setLoading(false);
    }
  };

  const loadInvitations = async () => {
    if (!selectedShopId) return;
    try {
      setLoading(true);
      setError(null);
      const invs = await merchantApi.getDarkstoreInvitations(selectedShopId);
      setInvitations(invs);
    } catch (err: any) {
      setError(err?.message || 'Failed to load staff invitations');
    } finally {
      setLoading(false);
    }
  };

  const revokeInvitation = async (invitationId: string) => {
    if (!assertOnlineForMutation('Revoke Staff Invitation')) return;
    if (!selectedShopId) return;
    try {
      setLoading(true);
      setError(null);
      const updated = await merchantApi.revokeInvitation(selectedShopId, invitationId);
      setInvitations(updated);
    } catch (err: any) {
      setError(err?.message || 'Failed to revoke invitation');
    } finally {
      setLoading(false);
    }
  };

  const changeSelectedShop = (newShopId: string) => {
    // Multi-Darkstore Isolation: Invalidate previous staff & report presentation immediately
    setReport(null);
    setDashboard(null);
    setOrderBoard(null);
    setPickingSession(null);
    setHandoffStatus(null);
    setStaffList([]);
    setActivityLogs([]);
    setInvitations([]);
    setSelectedShopId(newShopId);
  };

  return {
    shops,
    selectedShopId,
    setSelectedShopId: changeSelectedShop,
    dashboard,
    orderBoard,
    pickingSession,
    handoffStatus,
    staffList,
    activityLogs,
    invitations,
    report,
    loading,
    error,
    networkState,
    setNetworkState,
    isStaleData,
    lastSyncTimestamp,
    staleBadgeText: isStaleData ? `Offline Mode — Stale Cached Data from ${lastSyncTimestamp || 'recently'}` : null,
    loadShops,
    loadDashboardAndBoard,
    loadMerchantReport,
    exportMerchantReportCsv,
    loadDarkstoreStaff,
    assignStaffToDarkstore,
    removeStaffFromDarkstore,
    updateStaffRoleOrStatus,
    loadStaffActivity,
    inviteStaff,
    loadInvitations,
    revokeInvitation,
    handleReconnect,
    toggleOperationalState,
    transitionOrderStatus,
    loadPickingSession,
    updatePickingItem,
    completePickingSession,
    loadHandoffStatus,
    generatePickupChallenge,
    verifyRiderHandoff,
  };
}
