"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useVendor } from "@/context/VendorContext";
import styles from "./dashboard.module.css";
import {
  TrendingUpIcon,
  PackageIcon,
  OrdersIcon,
  FladoIcon,
  PlusIcon
} from "@/components/Icons";

interface VendorDashboardSummaryDTO {
  vendorId: string;
  storeName: string;
  isVerified: boolean;
  performanceScore: number;
  salesSummary: {
    grossRevenueMinor: number;
    formattedGrossRevenue: string;
    totalOrdersCount: number;
    avgOrderValueMinor: number;
    formattedAvgOrderValue: string;
    activeListingsCount: number;
  };
  ordersRequiringActionCount: number;
  ordersRequiringAction: Array<{
    id: string;
    customerName: string;
    totalAmountMinor: number;
    formattedTotalAmount: string;
    status: string;
    createdAt: string;
    itemCount: number;
  }>;
  lowStockAlertsCount: number;
  lowStockAlerts: Array<{
    id: string;
    productId: string;
    variantName?: string;
    stockQuantity: number;
  }>;
  pendingShipmentsCount: number;
  quickCommercePerformance: {
    fladoListingsCount: number;
    fladoActiveCount: number;
  };
  settlementSummary: {
    unclearedBalanceMinor: number;
    formattedUnclearedBalance: string;
    settledBalanceMinor: number;
    formattedSettledBalance: string;
    commissionRatePercentage: number;
    gstOnCommissionPercentage: number;
  };
}

export default function DashboardOverview() {
  const { products, orders, payouts } = useVendor();

  const [liveSummary, setLiveSummary] = useState<VendorDashboardSummaryDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveDashboard = useCallback(async () => {
    const isDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO_FIXTURES === "true";
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    if (isDemo || !token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/vendors/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) {
        throw new Error(`Failed to load live vendor dashboard (HTTP ${res.status})`);
      }
      let data = await res.json();
      if (data && typeof data === "object" && "data" in data) {
        data = data.data;
      }
      setLiveSummary(data);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch live vendor metrics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveDashboard();
  }, [fetchLiveDashboard]);

  // Fallback context calculations for demo mode
  const activeProducts = products.filter(p => p.status === "active").length;
  const pendingOrders = orders.filter(o => o.status === "pending");
  const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const avgOrderValue = orders.length > 0 ? Math.round(totalSales / orders.length) : 0;
  const outstandingPayout = payouts
    .filter(p => p.status === "processing")
    .reduce((sum, p) => sum + p.netSettlement, 0);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const isDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO_FIXTURES === "true";

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>
        <p style={{ fontWeight: 700 }}>Loading Authoritative Vendor Dashboard...</p>
      </div>
    );
  }

  // Display live summary if available, else fallback to context metrics
  const displayRevenue = liveSummary ? liveSummary.salesSummary.formattedGrossRevenue : formatINR(totalSales);
  const displayTotalOrders = liveSummary ? liveSummary.salesSummary.totalOrdersCount : orders.length;
  const displayActionOrdersCount = liveSummary ? liveSummary.ordersRequiringActionCount : pendingOrders.length;
  const displayAOV = liveSummary ? liveSummary.salesSummary.formattedAvgOrderValue : formatINR(avgOrderValue);
  const displayActiveListings = liveSummary ? liveSummary.salesSummary.activeListingsCount : activeProducts;
  const displayUnclearedBalance = liveSummary ? liveSummary.settlementSummary.formattedUnclearedBalance : formatINR(outstandingPayout);
  const displayFladoCount = liveSummary ? liveSummary.quickCommercePerformance.fladoListingsCount : products.filter(p => p.listOnFlado).length;
  const displayLowStockCount = liveSummary ? liveSummary.lowStockAlertsCount : products.filter(p => p.stock <= 5).length;

  return (
    <div className="animate-fade-in">
      {error && (
        <div style={{ backgroundColor: "#FEF2F2", borderLeft: "4px solid #EF4444", color: "#991B1B", padding: "1rem", marginBottom: "1.5rem", borderRadius: "4px", fontSize: "0.875rem" }}>
          <strong>Dashboard Warning:</strong> {error}. Showing cached store data.
        </div>
      )}

      {/* Welcome Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)" }}>Growth Overview</h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Track your metrics, fulfill orders and monitor settlements.</p>
        </div>
        
        <a href="/dashboard/inventory?add=true" className={styles.primaryBtn}>
          <PlusIcon size={16} />
          <span>Add Product</span>
        </a>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <span>GROSS REVENUE</span>
            <TrendingUpIcon size={16} className={styles.trendUp} />
          </div>
          <div className={styles.statValue}>{displayRevenue}</div>
          <div className={styles.statTrend}>
            <span style={{ color: "var(--text-light)" }}>Authoritative backend total</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <span>TOTAL ORDERS</span>
            <OrdersIcon size={16} style={{ color: "var(--primary-green)" }} />
          </div>
          <div className={styles.statValue}>{displayTotalOrders}</div>
          <div className={styles.statTrend}>
            <span className={styles.trendUp}>+{displayActionOrdersCount} pending action</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <span>AVG ORDER VALUE</span>
            <span style={{ fontSize: "0.75rem", color: "var(--primary-green)", fontWeight: 700 }}>AOV</span>
          </div>
          <div className={styles.statValue}>{displayAOV}</div>
          <div className={styles.statTrend}>
            <span style={{ color: "var(--text-light)" }}>Basket performance</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <span>ACTIVE LISTINGS</span>
            <PackageIcon size={16} style={{ color: "var(--primary-green)" }} />
          </div>
          <div className={styles.statValue}>{displayActiveListings}</div>
          <div className={styles.statTrend}>
            <span className={styles.trendUp}>
              {displayFladoCount} on Flado
            </span>
            <span style={{ color: "var(--text-light)" }}>quick commerce</span>
          </div>
        </div>
      </div>

      {/* Action Banners & Low Stock Alerts */}
      {displayLowStockCount > 0 && (
        <div style={{ backgroundColor: "#FFFBEB", borderWidth: "1px", borderColor: "#FCD34D", borderRadius: "8px", padding: "12px 16px", marginBottom: "1.5rem", flexDirection: "row", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontWeight: 700, color: "#92400E", fontSize: "0.875rem" }}>Low Stock Alert: </span>
            <span style={{ color: "#B45309", fontSize: "0.875rem" }}>{displayLowStockCount} inventory items have 5 or fewer units remaining. Re-stock soon to avoid SLA penalties.</span>
          </div>
          <a href="/dashboard/inventory" style={{ color: "#D97706", fontWeight: 800, fontSize: "0.8125rem", textDecoration: "underline" }}>Update Stock &rarr;</a>
        </div>
      )}

      {/* Main Grid: Settlement & Flado Panel Summary */}
      <div className={styles.dashboardMainGrid}>
        {/* Payout & Settlement Block */}
        <div className={styles.dashboardBlock} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--text-primary)" }}>
              Settlement Status
            </h3>
            
            <div style={{ padding: "1.25rem 1rem", backgroundColor: "var(--bg-color)", borderRadius: "var(--radius-md)", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
                UNCLEARED BALANCE
              </span>
              <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--primary-dark-green)", display: "block" }}>
                {displayUnclearedBalance}
              </span>
              <span style={{ fontSize: "0.7rem", color: "var(--text-light)", display: "block", marginTop: "0.25rem" }}>
                Will settle into your registered bank account on next payout cycle.
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Commission fee:</span>
                <span style={{ fontWeight: 600 }}>Flat 8.00%</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>GST on Commission:</span>
                <span style={{ fontWeight: 600 }}>18%</span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "0.5rem" }}>
              <FladoIcon size={16} style={{ color: "var(--primary-green)" }} />
              <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>Flado Hyperlocal Integration</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.4, marginBottom: "0.75rem" }}>
              Toggled products are synced to Flado Quick-Commerce. Keep stock updated to prevent SLA penalties.
            </p>
            <a href="/dashboard/inventory" className={styles.secondaryBtn} style={{ width: "100%", justifyContent: "center" }}>
              Manage Sync Listings
            </a>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className={styles.dashboardBlock}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--text-primary)" }}>
            Vendor Action Quick Links
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "1rem" }}>
            <a href="/dashboard/orders" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB", textDecoration: "none" }}>
              <div>
                <span style={{ fontWeight: 700, color: "#111827", display: "block", fontSize: "0.875rem" }}>Pack Pending Orders ({displayActionOrdersCount})</span>
                <span style={{ color: "#6B7280", fontSize: "0.75rem" }}>Review orders awaiting packing & dispatch</span>
              </div>
              <span style={{ color: "#6366F1", fontWeight: 800 }}>&rarr;</span>
            </a>

            <a href="/dashboard/inventory" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB", textDecoration: "none" }}>
              <div>
                <span style={{ fontWeight: 700, color: "#111827", display: "block", fontSize: "0.875rem" }}>Catalog & Stock Management</span>
                <span style={{ color: "#6B7280", fontSize: "0.75rem" }}>Update stock, prices, or add new variants</span>
              </div>
              <span style={{ color: "#6366F1", fontWeight: 800 }}>&rarr;</span>
            </a>

            <a href="/dashboard/payouts" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB", textDecoration: "none" }}>
              <div>
                <span style={{ fontWeight: 700, color: "#111827", display: "block", fontSize: "0.875rem" }}>Payout Settlement History</span>
                <span style={{ color: "#6B7280", fontSize: "0.75rem" }}>View net settlements and bank transfers</span>
              </div>
              <span style={{ color: "#6366F1", fontWeight: 800 }}>&rarr;</span>
            </a>
          </div>
        </div>
      </div>

      {/* Pending Orders Table Block */}
      <div className={styles.dashboardBlock} style={{ marginTop: "1.5rem" }}>
        <div className={styles.blockTitle}>
          <span>Pending Orders awaiting Packing ({displayActionOrdersCount})</span>
          <a href="/dashboard/orders" style={{ fontSize: "0.8125rem", color: "var(--primary-green)", fontWeight: 700 }}>
            Go to Fulfillment Screen &rarr;
          </a>
        </div>

        {displayActionOrdersCount === 0 ? (
          <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "var(--text-secondary)" }}>
            <PackageIcon size={40} style={{ color: "var(--text-light)", marginBottom: "0.75rem" }} />
            <p style={{ fontWeight: 600 }}>All caught up! No pending orders to pack.</p>
            <p style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>New orders placed by customers will appear here immediately.</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(liveSummary ? liveSummary.ordersRequiringAction : pendingOrders.map(o => ({ id: o.id, customerName: o.customerName, formattedTotalAmount: formatINR(o.totalAmount), status: o.status }))).map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 700, color: "var(--primary-dark-green)" }}>{order.id}</td>
                    <td><div style={{ fontWeight: 600 }}>{order.customerName}</div></td>
                    <td style={{ fontWeight: 700 }}>{order.formattedTotalAmount}</td>
                    <td>
                      <span className="badge badge-info" style={{ textTransform: "uppercase" }}>{order.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
