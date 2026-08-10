"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "../dashboard.module.css";
import {
  FladoIcon,
  CheckIcon,
  InfoIcon,
  RefreshIcon,
  OrdersIcon,
  InventoryIcon
} from "@/components/Icons";

interface DarkstoreDTO {
  id: string;
  name: string;
  approvalStatus: string;
  isOpen: boolean;
  address: string;
}

interface DashboardMetricsDTO {
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

interface InventoryItemDTO {
  id: string;
  productId: string | null;
  productTitle: string;
  sku: string;
  stockQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  categoryId?: string | null;
  tags?: string[];
  isFeatured?: boolean;
  featuredPriority?: number;
  fulfillmentSource: string;
  updatedAt: string;
}

interface OrderQueueItemDTO {
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

interface OrderBoardDTO {
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

interface RiderHandoffStatusDTO {
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

export default function MerchantDashboardPage() {
  const [shops, setShops] = useState<DarkstoreDTO[]>([]);
  const [selectedShopId, setSelectedShopId] = useState<string>("");
  const [dashboardData, setDashboardData] = useState<DashboardMetricsDTO | null>(null);
  const [inventoryList, setInventoryList] = useState<InventoryItemDTO[]>([]);
  const [orderQueue, setOrderQueue] = useState<OrderQueueItemDTO[]>([]);
  const [orderBoard, setOrderBoard] = useState<OrderBoardDTO | null>(null);

  const [activeTab, setActiveTab] = useState<'board' | 'queue' | 'inventory' | 'config'>('board');
  const [inventorySearch, setInventorySearch] = useState<string>("");
  const [filterLowStock, setFilterLowStock] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Rider Handoff State
  const [handoffOrder, setHandoffOrder] = useState<RiderHandoffStatusDTO | null>(null);
  const [handoffOtpInput, setHandoffOtpInput] = useState<string>("");
  const [generatedOtpDisplay, setGeneratedOtpDisplay] = useState<string | null>(null);

  // Store Configuration Form State
  const [configShopName, setConfigShopName] = useState<string>("");
  const [configAddress, setConfigAddress] = useState<string>("");
  const [configRadiusKm, setConfigRadiusKm] = useState<number>(3.0);
  const [configMinOrderRupees, setConfigMinOrderRupees] = useState<number>(0);
  const [configMaxCapacity, setConfigMaxCapacity] = useState<number>(50);
  const [configFeeType, setConfigFeeType] = useState<'FREE' | 'PAID'>('FREE');
  const [configFeeAmount, setConfigFeeAmount] = useState<number>(0);
  const [configScheduleJson, setConfigScheduleJson] = useState<string>('{\n  "mon": {"open": "08:00", "close": "22:00"},\n  "tue": {"open": "08:00", "close": "22:00"},\n  "wed": {"open": "08:00", "close": "22:00"},\n  "thu": {"open": "08:00", "close": "22:00"},\n  "fri": {"open": "08:00", "close": "22:00"},\n  "sat": {"open": "08:00", "close": "23:00"},\n  "sun": {"open": "08:00", "close": "23:00"}\n}');

  const fetchMerchantShops = useCallback(async () => {
    const isDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO_FIXTURES === "true";
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    if (isDemo || !token) {
      const demoShops: DarkstoreDTO[] = [
        { id: "shop-flado-001", name: "AuraMart Heritage Darkstore 01", approvalStatus: "APPROVED", isOpen: true, address: "Bandra West, Mumbai" }
      ];
      setShops(demoShops);
      setSelectedShopId("shop-flado-001");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/v1/flado/merchant/shops`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        let data = await res.json();
        if (data && typeof data === "object" && "data" in data) data = data.data;
        if (Array.isArray(data) && data.length > 0) {
          setShops(data);
          setSelectedShopId(data[0].id);
        }
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load merchant darkstores");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchShopDashboard = useCallback(async (shopId: string) => {
    if (!shopId) return;

    const isDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO_FIXTURES === "true";
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    setLoading(true);
    setError(null);
    try {
      if (isDemo || !token) {
        setDashboardData({
          shopId,
          shopName: "AuraMart Heritage Darkstore 01",
          approvalStatus: "APPROVED",
          isOpen: true,
          isOperational: true,
          operatingHoursJson: null,
          deliveryRadiusKm: 3.0,
          deliveryFeeType: "FREE",
          deliveryFeeAmount: 0,
          capacity: {
            maxCapacityOrdersPerHour: 50,
            currentHourlyOrderCount: 12,
            capacityUtilizationPercentage: 24,
            capacityWarning: null
          },
          queueSummary: {
            activeQueueCount: 3,
            ordersRequiringActionCount: 1,
            pendingShipmentCount: 2
          },
          inventorySummary: {
            totalSKUsCount: 45,
            inStockCount: 40,
            lowStockCount: 3,
            outOfStockCount: 2
          },
          salesSummary: {
            todayOrdersCount: 28,
            todayGrossRevenueMinor: 1450000,
            formattedTodayGrossRevenue: "₹14,500",
            avgDeliveryMinutes: null
          },
          slaWarnings: []
        });

        setConfigShopName("AuraMart Heritage Darkstore 01");
        setConfigAddress("Bandra West, Mumbai");
        setConfigRadiusKm(3.0);
        setConfigMinOrderRupees(0);
        setConfigMaxCapacity(50);
        setConfigFeeType("FREE");
        setConfigFeeAmount(0);

        setInventoryList([
          { id: "inv-1", productId: "p-101", productTitle: "Organic Cold Pressed Groundnut Oil", sku: "OIL-CP-1L", stockQuantity: 25, reservedQuantity: 2, availableQuantity: 23, lowStockThreshold: 5, isLowStock: false, isOutOfStock: false, categoryId: "cat-groceries", tags: ["organic", "oil"], isFeatured: true, featuredPriority: 10, fulfillmentSource: shopId, updatedAt: new Date().toISOString() },
          { id: "inv-2", productId: "p-102", productTitle: "Handcrafted Brass Diya Set", sku: "BRASS-DIYA-02", stockQuantity: 3, reservedQuantity: 1, availableQuantity: 2, lowStockThreshold: 5, isLowStock: true, isOutOfStock: false, categoryId: "cat-decor", tags: ["handicraft"], isFeatured: false, featuredPriority: 0, fulfillmentSource: shopId, updatedAt: new Date().toISOString() }
        ]);

        const sampleOrders: OrderQueueItemDTO[] = [
          {
            orderId: "ord-8801",
            orderNumber: "QORD-8801",
            status: "PLACED",
            paymentStatus: "PAID",
            paymentMethod: "ONLINE",
            createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
            receivedTimeAgo: "3m ago",
            items: [{ id: "i-1", title: "Organic Cold Pressed Groundnut Oil", quantity: 2, unitPriceMinor: 45000, formattedUnitPrice: "₹450", subtotalMinor: 90000, formattedSubtotal: "₹900" }],
            itemCount: 1,
            vendorTotalMinor: 90000,
            formattedVendorTotal: "₹900",
            slaWarning: null,
            substitutionAttention: false,
            isCancelled: false,
            availableFulfillmentActions: ["ACCEPT", "PACK"]
          },
          {
            orderId: "ord-8802",
            orderNumber: "QORD-8802",
            status: "PREPARING",
            paymentStatus: "PAID",
            paymentMethod: "ONLINE",
            createdAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
            receivedTimeAgo: "7m ago",
            items: [{ id: "i-2", title: "Handcrafted Brass Diya Set", quantity: 1, unitPriceMinor: 65000, formattedUnitPrice: "₹650", subtotalMinor: 65000, formattedSubtotal: "₹650" }],
            itemCount: 1,
            vendorTotalMinor: 65000,
            formattedVendorTotal: "₹650",
            slaWarning: { code: "SLA_WARN", severity: "WARNING", message: "SLA Warning (5-10m)" },
            substitutionAttention: false,
            isCancelled: false,
            availableFulfillmentActions: ["PACK", "SHIP"]
          }
        ];

        setOrderQueue(sampleOrders);

        setOrderBoard({
          shopId,
          shopName: "AuraMart Heritage Darkstore 01",
          isOperational: true,
          totalActiveOrdersCount: 2,
          columns: {
            newPlaced: [sampleOrders[0]],
            preparingPacking: [sampleOrders[1]],
            readyDispatch: [],
            completedHistory: []
          },
          slaSummary: {
            freshCount: 1,
            elevatedWarningCount: 1,
            criticalBreachCount: 0
          }
        });

        return;
      }

      const [dashRes, invRes, queueRes, boardRes] = await Promise.all([
        fetch(`${BASE_URL}/api/v1/flado/shops/${shopId}/dashboard`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${BASE_URL}/api/v1/flado/shops/${shopId}/inventory`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${BASE_URL}/api/v1/flado/shops/${shopId}/orders/queue`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${BASE_URL}/api/v1/flado/shops/${shopId}/orders/board`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (dashRes.ok) {
        let d = await dashRes.json();
        if (d && typeof d === "object" && "data" in d) d = d.data;
        setDashboardData(d);
        setConfigShopName(d.shopName || "");
        setConfigRadiusKm(d.deliveryRadiusKm || 3.0);
        setConfigFeeType(d.deliveryFeeType as any || "FREE");
        setConfigFeeAmount(d.deliveryFeeAmount || 0);
        if (d.operatingHoursJson) setConfigScheduleJson(d.operatingHoursJson);
      }

      if (invRes.ok) {
        let i = await invRes.json();
        if (i && typeof i === "object" && "data" in i) i = i.data;
        setInventoryList(i);
      }

      if (queueRes.ok) {
        let q = await queueRes.json();
        if (q && typeof q === "object" && "data" in q) q = q.data;
        setOrderQueue(q);
      }

      if (boardRes.ok) {
        let b = await boardRes.json();
        if (b && typeof b === "object" && "data" in b) b = b.data;
        setOrderBoard(b);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load darkstore dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMerchantShops();
  }, [fetchMerchantShops]);

  useEffect(() => {
    if (selectedShopId) {
      fetchShopDashboard(selectedShopId);
    }
  }, [selectedShopId, fetchShopDashboard]);

  const handleToggleStoreState = async () => {
    if (!dashboardData) return;
    const nextState = !dashboardData.isOpen;
    const actionText = nextState ? "OPEN store for live Quick-Commerce orders" : "CLOSE store and pause live serviceability";

    if (!confirm(`Are you sure you want to ${actionText}?`)) return;

    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/flado/shops/${dashboardData.shopId}/operational-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isOpen: nextState, reason: "Manual merchant dashboard toggle" })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Failed to toggle store operational state");
      }

      setActionSuccess(`Darkstore operational state updated to ${nextState ? "OPEN (Active Serviceability)" : "CLOSED (Serviceability Paused)"}.`);
      fetchShopDashboard(dashboardData.shopId);
    } catch (err: any) {
      setError(err?.message || "Operational state update error");
    }
  };

  const handleFulfillOrder = async (orderId: string, action: 'ACCEPT' | 'PACK' | 'SHIP' | 'DELIVER') => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    try {
      const res = await fetch(`${BASE_URL}/api/v1/flado/shops/${selectedShopId}/orders/${orderId}/transition`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Order status transition failed");
      }

      setActionSuccess(`Order ${orderId} successfully transitioned via action: ${action}.`);
      fetchShopDashboard(selectedShopId);
    } catch (err: any) {
      setError(err?.message || "Order transition action failed");
    }
  };

  const handleOpenHandoffModal = async (orderId: string) => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/flado/shops/${selectedShopId}/orders/${orderId}/handoff`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        let d = await res.json();
        if (d && typeof d === "object" && "data" in d) d = d.data;
        setHandoffOrder(d);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load rider handoff status");
    }
  };

  const handleGenerateHandoffOtp = async (orderId: string) => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/flado/shops/${selectedShopId}/orders/${orderId}/handoff/challenge`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Failed to generate pickup OTP challenge");
      }

      let d = await res.json();
      if (d && typeof d === "object" && "data" in d) d = d.data;
      setHandoffOrder(d);
      if (d.rawOtpForMerchantDisplay) {
        setGeneratedOtpDisplay(d.rawOtpForMerchantDisplay);
      }
      setActionSuccess("Cryptographically secure 6-digit Pickup OTP generated!");
    } catch (err: any) {
      setError(err?.message || "Pickup OTP challenge error");
    }
  };

  const handleVerifyHandoffOtp = async (orderId: string) => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    if (!handoffOtpInput || handoffOtpInput.length !== 6) {
      setError("Please enter the 6-digit pickup OTP code.");
      return;
    }

    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/flado/shops/${selectedShopId}/orders/${orderId}/handoff/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ otp: handoffOtpInput })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Pickup OTP verification failed");
      }

      let d = await res.json();
      if (d && typeof d === "object" && "data" in d) d = d.data;
      setHandoffOrder(d);
      setActionSuccess("✓ Rider pickup OTP verified! Order dispatched to rider.");
      fetchShopDashboard(selectedShopId);
    } catch (err: any) {
      setError(err?.message || "OTP verification error");
    }
  };

  const handleSaveStoreConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShopId) return;

    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    setError(null);
    setActionSuccess(null);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/flado/shops/${selectedShopId}/config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          shopName: configShopName,
          address: configAddress,
          deliveryRadiusKm: Number(configRadiusKm),
          minimumOrderAmount: Number(configMinOrderRupees),
          maxActiveOrders: Number(configMaxCapacity),
          deliveryFeeType: configFeeType,
          deliveryFeeAmount: Number(configFeeAmount),
          operatingHoursJson: configScheduleJson
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Failed to update store configuration");
      }

      setActionSuccess("Darkstore store configuration updated successfully. Propagated to CMD-052 Serviceability and CMD-057 Quick Fees engine.");
      fetchShopDashboard(selectedShopId);
    } catch (err: any) {
      setError(err?.message || "Store configuration update failed");
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Darkstore Header & Selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FladoIcon size={24} />
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)" }}>
              Quick-Commerce Darkstore Operational Console
            </h2>
          </div>
          <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
            Live darkstore order board, SLA tracking, per-SKU inventory, and store configuration.
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {shops.length > 1 && (
            <select
              value={selectedShopId}
              onChange={(e) => setSelectedShopId(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border-color)", fontWeight: 700, fontSize: "0.875rem" }}
            >
              {shops.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.isOpen ? "OPEN" : "CLOSED"})</option>
              ))}
            </select>
          )}

          {dashboardData && (
            <button
              onClick={handleToggleStoreState}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                fontWeight: 800,
                fontSize: "0.875rem",
                color: "#FFFFFF",
                backgroundColor: dashboardData.isOpen ? "#EF4444" : "#10B981",
                border: "none",
                cursor: "pointer"
              }}
            >
              {dashboardData.isOpen ? "Close Darkstore (Pause Serviceability)" : "Open Darkstore (Activate Serviceability)"}
            </button>
          )}

          <button className={styles.secondaryBtn} onClick={() => selectedShopId && fetchShopDashboard(selectedShopId)}>
            <RefreshIcon size={16} />
            <span>Refresh Live State</span>
          </button>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: "#FEF2F2", borderLeft: "4px solid #EF4444", color: "#991B1B", padding: "1rem", borderRadius: "4px", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
          <strong>Operational Error:</strong> {error}
        </div>
      )}

      {actionSuccess && (
        <div style={{ backgroundColor: "#ECFDF5", borderLeft: "4px solid #10B981", color: "#065F46", padding: "1rem", borderRadius: "4px", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
          ✓ {actionSuccess}
        </div>
      )}

      {/* Dashboard KPI Metric Cards */}
      {dashboardData && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          <div className={styles.dashboardBlock} style={{ marginBottom: 0 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>Store State</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: dashboardData.isOpen ? "#10B981" : "#EF4444", marginTop: "4px" }}>
              {dashboardData.isOpen ? "OPEN & ACTIVE" : "STORE CLOSED"}
            </div>
            <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "4px" }}>
              Radius: {dashboardData.deliveryRadiusKm} km | Fee: {dashboardData.deliveryFeeType === "FREE" ? "FREE" : `₹${dashboardData.deliveryFeeAmount}`}
            </div>
          </div>

          <div className={styles.dashboardBlock} style={{ marginBottom: 0 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>Capacity Load</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: dashboardData.capacity.capacityUtilizationPercentage >= 80 ? "#EF4444" : "var(--text-primary)", marginTop: "4px" }}>
              {dashboardData.capacity.capacityUtilizationPercentage}% Utilization
            </div>
            <div style={{ width: "100%", height: "6px", backgroundColor: "#E5E7EB", borderRadius: "3px", marginTop: "8px", overflow: "hidden" }}>
              <div style={{ width: `${dashboardData.capacity.capacityUtilizationPercentage}%`, height: "100%", backgroundColor: dashboardData.capacity.capacityUtilizationPercentage >= 80 ? "#EF4444" : "#10B981" }} />
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
              {dashboardData.capacity.currentHourlyOrderCount} / {dashboardData.capacity.maxCapacityOrdersPerHour} max active orders
            </div>
          </div>

          <div className={styles.dashboardBlock} style={{ marginBottom: 0 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>SLA Health Summary</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--primary-green)", marginTop: "4px" }}>
              {orderBoard?.slaSummary.freshCount || 0} Fresh
            </div>
            <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "4px" }}>
              <span style={{ color: "#F59E0B", fontWeight: 700 }}>{orderBoard?.slaSummary.elevatedWarningCount || 0} Warn</span> | <span style={{ color: "#EF4444", fontWeight: 700 }}>{orderBoard?.slaSummary.criticalBreachCount || 0} Breach</span>
            </div>
          </div>

          <div className={styles.dashboardBlock} style={{ marginBottom: 0 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>Darkstore SKUs</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--text-primary)", marginTop: "4px" }}>
              {dashboardData.inventorySummary.totalSKUsCount} Total SKUs
            </div>
            <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "4px" }}>
              <span style={{ color: "#10B981", fontWeight: 700 }}>{dashboardData.inventorySummary.inStockCount} In Stock</span> | <span style={{ color: "#EF4444", fontWeight: 700 }}>{dashboardData.inventorySummary.outOfStockCount} Out</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid var(--border-color)", marginBottom: "1.5rem" }}>
        <button
          onClick={() => setActiveTab('board')}
          style={{
            padding: "0.75rem 1rem",
            fontWeight: 700,
            fontSize: "0.875rem",
            color: activeTab === 'board' ? "var(--primary-green)" : "var(--text-secondary)",
            borderBottom: activeTab === 'board' ? "2px solid var(--primary-green)" : "none",
            background: "none",
            border: "none",
            cursor: "pointer"
          }}
        >
          Live Kanban Order Board ({orderBoard?.totalActiveOrdersCount || 0})
        </button>
        <button
          onClick={() => setActiveTab('queue')}
          style={{
            padding: "0.75rem 1rem",
            fontWeight: 700,
            fontSize: "0.875rem",
            color: activeTab === 'queue' ? "var(--primary-green)" : "var(--text-secondary)",
            borderBottom: activeTab === 'queue' ? "2px solid var(--primary-green)" : "none",
            background: "none",
            border: "none",
            cursor: "pointer"
          }}
        >
          Order Queue Table ({orderQueue.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          style={{
            padding: "0.75rem 1rem",
            fontWeight: 700,
            fontSize: "0.875rem",
            color: activeTab === 'inventory' ? "var(--primary-green)" : "var(--text-secondary)",
            borderBottom: activeTab === 'inventory' ? "2px solid var(--primary-green)" : "none",
            background: "none",
            border: "none",
            cursor: "pointer"
          }}
        >
          Live Darkstore Inventory ({inventoryList.length})
        </button>
        <button
          onClick={() => setActiveTab('config')}
          style={{
            padding: "0.75rem 1rem",
            fontWeight: 700,
            fontSize: "0.875rem",
            color: activeTab === 'config' ? "var(--primary-green)" : "var(--text-secondary)",
            borderBottom: activeTab === 'config' ? "2px solid var(--primary-green)" : "none",
            background: "none",
            border: "none",
            cursor: "pointer"
          }}
        >
          Store Settings
        </button>
      </div>

      {/* Live Kanban Order Board Tab (CMD-087 & CMD-089) */}
      {activeTab === 'board' && orderBoard && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
          {/* Column 1: New / Placed */}
          <div style={{ backgroundColor: "#F9FAFB", padding: "1rem", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontWeight: 800, fontSize: "0.875rem", color: "#374151" }}>NEW / PLACED</span>
              <span className="badge badge-warning">{orderBoard.columns.newPlaced.length}</span>
            </div>
            {orderBoard.columns.newPlaced.map((ord) => (
              <div key={ord.orderId} style={{ backgroundColor: "#FFFFFF", padding: "1rem", borderRadius: "6px", border: "1px solid #E5E7EB", marginBottom: "0.75rem", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "0.875rem" }}>
                  <span>{ord.orderNumber}</span>
                  <span style={{ color: "#3B82F6" }}>{ord.receivedTimeAgo}</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                  {ord.items.map((i) => `${i.quantity}x ${i.title}`).join(", ")}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                  <span style={{ fontWeight: 800, fontSize: "0.875rem" }}>{ord.formattedVendorTotal}</span>
                  <button type="button" className={styles.primaryBtn} onClick={() => handleFulfillOrder(ord.orderId, 'ACCEPT')} style={{ fontSize: "0.75rem", padding: "4px 8px" }}>
                    Accept Order
                  </button>
                </div>
              </div>
            ))}
            {orderBoard.columns.newPlaced.length === 0 && (
              <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", textAlign: "center", padding: "2rem 0" }}>No new incoming orders</div>
            )}
          </div>

          {/* Column 2: Preparing / Packing */}
          <div style={{ backgroundColor: "#F9FAFB", padding: "1rem", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontWeight: 800, fontSize: "0.875rem", color: "#374151" }}>PREPARING / PACKING</span>
              <span className="badge badge-info">{orderBoard.columns.preparingPacking.length}</span>
            </div>
            {orderBoard.columns.preparingPacking.map((ord) => (
              <div key={ord.orderId} style={{ backgroundColor: "#FFFFFF", padding: "1rem", borderRadius: "6px", border: "1px solid #E5E7EB", marginBottom: "0.75rem", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "0.875rem" }}>
                  <span>{ord.orderNumber}</span>
                  <span style={{ color: "#F59E0B" }}>{ord.receivedTimeAgo}</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                  {ord.items.map((i) => `${i.quantity}x ${i.title}`).join(", ")}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                  <span style={{ fontWeight: 800, fontSize: "0.875rem" }}>{ord.formattedVendorTotal}</span>
                  <button type="button" className={styles.primaryBtn} onClick={() => handleOpenHandoffModal(ord.orderId)} style={{ fontSize: "0.75rem", padding: "4px 8px" }}>
                    Rider Handoff
                  </button>
                </div>
              </div>
            ))}
            {orderBoard.columns.preparingPacking.length === 0 && (
              <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", textAlign: "center", padding: "2rem 0" }}>No orders currently packing</div>
            )}
          </div>

          {/* Column 3: Ready / Dispatch */}
          <div style={{ backgroundColor: "#F9FAFB", padding: "1rem", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontWeight: 800, fontSize: "0.875rem", color: "#374151" }}>READY / DISPATCH</span>
              <span className="badge badge-success">{orderBoard.columns.readyDispatch.length}</span>
            </div>
            {orderBoard.columns.readyDispatch.map((ord) => (
              <div key={ord.orderId} style={{ backgroundColor: "#FFFFFF", padding: "1rem", borderRadius: "6px", border: "1px solid #E5E7EB", marginBottom: "0.75rem", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "0.875rem" }}>
                  <span>{ord.orderNumber}</span>
                  <span style={{ color: "#10B981" }}>{ord.receivedTimeAgo}</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                  {ord.items.map((i) => `${i.quantity}x ${i.title}`).join(", ")}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                  <span style={{ fontWeight: 800, fontSize: "0.875rem" }}>{ord.formattedVendorTotal}</span>
                  <button type="button" className={styles.primaryBtn} onClick={() => handleFulfillOrder(ord.orderId, 'DELIVER')} style={{ fontSize: "0.75rem", padding: "4px 8px" }}>
                    Confirm Delivered
                  </button>
                </div>
              </div>
            ))}
            {orderBoard.columns.readyDispatch.length === 0 && (
              <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", textAlign: "center", padding: "2rem 0" }}>No orders awaiting dispatch</div>
            )}
          </div>

          {/* Column 4: Completed / History */}
          <div style={{ backgroundColor: "#F9FAFB", padding: "1rem", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontWeight: 800, fontSize: "0.875rem", color: "#374151" }}>COMPLETED / HISTORY</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{orderBoard.columns.completedHistory.length}</span>
            </div>
            {orderBoard.columns.completedHistory.map((ord) => (
              <div key={ord.orderId} style={{ backgroundColor: "#FFFFFF", padding: "1rem", borderRadius: "6px", border: "1px solid #E5E7EB", marginBottom: "0.75rem", opacity: 0.8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "0.875rem" }}>
                  <span>{ord.orderNumber}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{ord.receivedTimeAgo}</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                  Status: {ord.status} | Total: {ord.formattedVendorTotal}
                </div>
              </div>
            ))}
            {orderBoard.columns.completedHistory.length === 0 && (
              <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", textAlign: "center", padding: "2rem 0" }}>No completed orders</div>
            )}
          </div>
        </div>
      )}

      {/* Rider Handoff Modal (CMD-089) */}
      {handoffOrder && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "#FFFFFF", padding: "1.5rem", borderRadius: "8px", width: "90%", maxWidth: "500px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 800 }}>Rider Pickup Handoff — {handoffOrder.orderNumber}</h3>
              <button type="button" onClick={() => { setHandoffOrder(null); setGeneratedOtpDisplay(null); }} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 800 }}>✕</button>
            </div>

            {!handoffOrder.isHandoffReady && (
              <div style={{ backgroundColor: "#FEF2F2", color: "#991B1B", padding: "0.75rem", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.8125rem" }}>
                <strong>Dispatch Blocked:</strong> {handoffOrder.blockedReason}
              </div>
            )}

            <div style={{ fontSize: "0.875rem", marginBottom: "1rem" }}>
              <div><strong>Rider Assignment:</strong> {handoffOrder.rider.isAssigned ? `${handoffOrder.rider.riderName} (${handoffOrder.rider.riderPhone})` : "Unassigned"}</div>
              <div><strong>Picking Status:</strong> {handoffOrder.pickingStatus}</div>
            </div>

            {handoffOrder.isHandoffReady && (
              <div>
                {!handoffOrder.otpChallenge.hasActiveChallenge ? (
                  <button type="button" className={styles.primaryBtn} onClick={() => handleGenerateHandoffOtp(handoffOrder.orderId)} style={{ width: "100%", padding: "10px" }}>
                    Generate Secure 6-Digit Pickup OTP
                  </button>
                ) : (
                  <div>
                    {generatedOtpDisplay && (
                      <div style={{ backgroundColor: "#EFF6FF", border: "1px dashed #3B82F6", padding: "1rem", borderRadius: "6px", textAlign: "center", marginBottom: "1rem" }}>
                        <div style={{ fontSize: "0.75rem", color: "#1D4ED8", fontWeight: 700 }}>MERCHANT PICKUP OTP CODE</div>
                        <div style={{ fontSize: "2rem", fontWeight: 900, fontFamily: "monospace", letterSpacing: "4px", color: "#1E40AF" }}>{generatedOtpDisplay}</div>
                        <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px" }}>Show to express rider for verification</div>
                      </div>
                    )}

                    <div style={{ marginBottom: "1rem" }}>
                      <label style={{ fontSize: "0.8125rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Verify Rider Pickup OTP</label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter 6-digit OTP..."
                        value={handoffOtpInput}
                        onChange={(e) => setHandoffOtpInput(e.target.value)}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #D1D5DB", fontFamily: "monospace", fontSize: "1.125rem", textAlign: "center" }}
                      />
                    </div>

                    <button type="button" className={styles.primaryBtn} onClick={() => handleVerifyHandoffOtp(handoffOrder.orderId)} style={{ width: "100%", padding: "10px" }}>
                      Verify OTP & Execute Dispatch
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Order Queue Tab */}
      {activeTab === 'queue' && (
        <div className={styles.dashboardBlock}>
          <div className={styles.blockTitle}>
            <span>Real-Time Quick-Commerce Order Queue</span>
            <span className="badge badge-success">Priority Operational Feed</span>
          </div>

          {orderQueue.length > 0 ? (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Order # & Recd Time</th>
                    <th>Status & SLA</th>
                    <th>Items & Qty</th>
                    <th>Total</th>
                    <th style={{ textAlign: "right" }}>Fulfillment Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orderQueue.map((ord) => (
                    <tr key={ord.orderId}>
                      <td>
                        <div style={{ fontWeight: 800 }}>{ord.orderNumber}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{ord.receivedTimeAgo} ({new Date(ord.createdAt).toLocaleTimeString("en-IN")})</div>
                      </td>
                      <td>
                        <span className={`badge ${ord.status === "PLACED" ? "badge-warning" : ord.status === "PREPARING" ? "badge-info" : ord.status === "SHIPPED" ? "badge-success" : "badge-danger"}`}>
                          {ord.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: "0.8125rem", fontWeight: 700 }}>
                          {ord.items.map((i) => `${i.quantity}x ${i.title}`).join(", ")}
                        </div>
                      </td>
                      <td style={{ fontWeight: 800 }}>{ord.formattedVendorTotal}</td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                          {ord.availableFulfillmentActions.map((act) => (
                            <button
                              key={act}
                              type="button"
                              className={styles.primaryBtn}
                              onClick={() => handleFulfillOrder(ord.orderId, act as any)}
                              style={{ fontSize: "0.75rem", padding: "4px 8px" }}
                            >
                              {act === "ACCEPT" ? "Accept Order" : act === "PACK" ? "Confirm Packed" : "Mark Shipped"}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-secondary)" }}>
              No active Quick-Commerce orders in queue for this darkstore.
            </div>
          )}
        </div>
      )}

      {/* Live Darkstore Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className={styles.dashboardBlock}>
          <div className={styles.blockTitle}>
            <span>Darkstore Live Inventory</span>
            <span className="badge badge-info">Per-SKU Stock & Reservations</span>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Search by SKU or Product title..."
              value={inventorySearch}
              onChange={(e) => setInventorySearch(e.target.value)}
              style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border-color)" }}
            />
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={filterLowStock}
                onChange={(e) => setFilterLowStock(e.target.checked)}
              />
              <span>Low Stock Alerts Only</span>
            </label>
          </div>

          {inventoryList.length > 0 ? (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Product Title & SKU</th>
                    <th>Physical Stock</th>
                    <th>Reserved Qty</th>
                    <th>Available Qty</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryList
                    .filter((item) => !inventorySearch || item.productTitle.toLowerCase().includes(inventorySearch.toLowerCase()) || item.sku.toLowerCase().includes(inventorySearch.toLowerCase()))
                    .filter((item) => !filterLowStock || item.isLowStock || item.isOutOfStock)
                    .map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div style={{ fontWeight: 700 }}>{item.productTitle}</div>
                          <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "var(--text-secondary)" }}>SKU: {item.sku}</div>
                        </td>
                        <td style={{ fontWeight: 700 }}>{item.stockQuantity}</td>
                        <td style={{ color: "#6B7280" }}>{item.reservedQuantity}</td>
                        <td style={{ fontWeight: 800, color: item.availableQuantity === 0 ? "#EF4444" : "var(--text-primary)" }}>
                          {item.availableQuantity}
                        </td>
                        <td>
                          {item.isOutOfStock ? (
                            <span className="badge badge-danger">OUT OF STOCK</span>
                          ) : item.isLowStock ? (
                            <span className="badge badge-warning">LOW STOCK</span>
                          ) : (
                            <span className="badge badge-success">IN STOCK</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-secondary)" }}>
              No inventory records found for this darkstore.
            </div>
          )}
        </div>
      )}

      {/* Store Configuration Settings Tab (CMD-085) */}
      {activeTab === 'config' && (
        <div className={styles.dashboardBlock}>
          <div className={styles.blockTitle}>
            <span>Darkstore Store Configuration & Settings</span>
            <span className="badge badge-warning">Authoritative Platform Settings</span>
          </div>

          <form onSubmit={handleSaveStoreConfig} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <h4 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "1rem", color: "var(--text-primary)" }}>Store Profile</h4>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontSize: "0.8125rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                  Darkstore Name
                </label>
                <input
                  type="text"
                  required
                  value={configShopName}
                  onChange={(e) => setConfigShopName(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #D1D5DB" }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontSize: "0.8125rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                  Physical Address
                </label>
                <input
                  type="text"
                  required
                  value={configAddress}
                  onChange={(e) => setConfigAddress(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #D1D5DB" }}
                />
              </div>

              <h4 style={{ fontSize: "1rem", fontWeight: 800, margin: "1.5rem 0 1rem", color: "var(--text-primary)" }}>Delivery & Geofencing Boundaries</h4>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontSize: "0.8125rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                  Delivery Radius (km) [0.5 km to 5.0 km boundary]
                </label>
                <input
                  type="number"
                  required
                  min={0.5}
                  max={5.0}
                  step={0.1}
                  value={configRadiusKm}
                  onChange={(e) => setConfigRadiusKm(Number(e.target.value))}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #D1D5DB" }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontSize: "0.8125rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                  Minimum Order Amount (₹ INR)
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={configMinOrderRupees}
                  onChange={(e) => setConfigMinOrderRupees(Number(e.target.value))}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #D1D5DB" }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontSize: "0.8125rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                  Max Active Order Capacity (concurrent orders)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={200}
                  value={configMaxCapacity}
                  onChange={(e) => setConfigMaxCapacity(Number(e.target.value))}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #D1D5DB" }}
                />
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "1rem", color: "var(--text-primary)" }}>Fee Configuration (CMD-057 Integration)</h4>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontSize: "0.8125rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                  Delivery Fee Type
                </label>
                <select
                  value={configFeeType}
                  onChange={(e) => setConfigFeeType(e.target.value as 'FREE' | 'PAID')}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #D1D5DB" }}
                >
                  <option value="FREE">FREE Delivery for Customers</option>
                  <option value="PAID">PAID Fixed Delivery Fee</option>
                </select>
              </div>

              {configFeeType === "PAID" && (
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontSize: "0.8125rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                    Delivery Fee Amount (₹ INR)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={configFeeAmount}
                    onChange={(e) => setConfigFeeAmount(Number(e.target.value))}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #D1D5DB" }}
                  />
                </div>
              )}

              <h4 style={{ fontSize: "1rem", fontWeight: 800, margin: "1.5rem 0 1rem", color: "var(--text-primary)" }}>Operating Schedule (CMD-052 Serviceability)</h4>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontSize: "0.8125rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                  Weekly Hours Schedule (JSON format)
                </label>
                <textarea
                  rows={8}
                  value={configScheduleJson}
                  onChange={(e) => setConfigScheduleJson(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #D1D5DB", fontFamily: "monospace", fontSize: "0.8125rem" }}
                />
              </div>

              <div style={{ textAlign: "right", marginTop: "1.5rem" }}>
                <button type="submit" className={styles.primaryBtn} style={{ padding: "10px 20px" }}>
                  Save Configuration & Update Engines
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
