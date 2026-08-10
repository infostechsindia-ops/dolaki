"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "../dashboard.module.css";
import { InfoIcon } from "@/components/Icons";
import RevenueTrendChart from "@/components/charts/RevenueTrendChart";
import TopProductsChart from "@/components/charts/TopProductsChart";
import CategoryShareChart from "@/components/charts/CategoryShareChart";
import OrderQualityCard from "@/components/charts/OrderQualityCard";
import InventoryHealthChart from "@/components/charts/InventoryHealthChart";

export interface VendorAnalyticsDTO {
  vendorId: string;
  storeName: string;
  period: '7D' | '30D' | '90D' | '1Y' | 'ALL';
  salesOverview: {
    totalOrdersCount: number;
    totalUnitsSold: number;
    grossRevenueMinor: number;
    formattedGrossRevenue: string;
    netPayoutMinor: number;
    formattedNetPayout: string;
    avgOrderValueMinor: number;
    formattedAvgOrderValue: string;
  };
  revenueTrends: Array<{
    date: string;
    grossRevenueMinor: number;
    formattedGrossRevenue: string;
    netPayoutMinor: number;
    formattedNetPayout: string;
    ordersCount: number;
  }>;
  topProducts: Array<{
    productId: string;
    title: string;
    sku: string;
    unitsSold: number;
    revenueMinor: number;
    formattedRevenue: string;
  }>;
  topCategories: Array<{
    categoryId: string;
    categoryName: string;
    revenueMinor: number;
    formattedRevenue: string;
    sharePercentage: number;
  }>;
  orderQuality: {
    totalOrders: number;
    cancelledOrdersCount: number;
    cancellationRatePercentage: number;
    returnedOrdersCount: number;
    returnRatePercentage: number;
    totalRefundsMinor: number;
    formattedTotalRefunds: string;
  };
  inventoryHealth: {
    totalSKUsCount: number;
    inStockSKUsCount: number;
    lowStockSKUsCount: number;
    outOfStockSKUsCount: number;
  };
  quickCommercePerformance: {
    fladoActiveListingsCount: number;
    fladoOrdersCount: number;
  };
  funnelMetrics: {
    tracked: boolean;
    message: string;
  };
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<VendorAnalyticsDTO | null>(null);
  const [period, setPeriod] = useState<string>("30D");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
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
      const res = await fetch(`${BASE_URL}/api/v1/vendors/analytics?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to fetch vendor analytics");
      let data = await res.json();
      if (data && typeof data === "object" && "data" in data) data = data.data;

      setAnalytics(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
      {/* Header & Period Selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
            Business & Revenue Performance Analytics
          </h2>
          <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
            Authoritative metrics for <strong>{analytics?.storeName || "your artisan store"}</strong>
          </span>
        </div>

        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {["7D", "30D", "90D", "1Y", "ALL"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              disabled={loading}
              className={period === p ? styles.primaryBtn : styles.secondaryBtn}
              style={{ fontSize: "0.75rem", padding: "6px 14px", cursor: loading ? "wait" : "pointer" }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert Banner with Retry Button */}
      {error && (
        <div style={{ backgroundColor: "#FEF2F2", borderLeft: "4px solid #EF4444", color: "#991B1B", padding: "1rem 1.25rem", borderRadius: "6px", marginBottom: "1.5rem", fontSize: "0.875rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong>Analytics Error:</strong> {error}
          </div>
          <button
            onClick={fetchAnalytics}
            style={{ backgroundColor: "#DC2626", color: "#FFFFFF", border: "none", padding: "6px 12px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Explicit Funnel Metric Availability Notice */}
      {analytics && !analytics.funnelMetrics?.tracked && (
        <div style={{ backgroundColor: "#EFF6FF", borderLeft: "4px solid #3B82F6", color: "#1E40AF", padding: "0.875rem 1.25rem", borderRadius: "6px", marginBottom: "1.5rem", fontSize: "0.8125rem", display: "flex", alignItems: "center", gap: "10px" }}>
          <InfoIcon size={18} />
          <span><strong>Funnel Status Notice:</strong> {analytics.funnelMetrics.message}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={styles.dashboardBlock} style={{ padding: "1.25rem", height: "80px", backgroundColor: "#F9FAFB", opacity: 0.7 }} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1.5rem" }}>
            <div className={styles.dashboardBlock} style={{ height: "300px", backgroundColor: "#F9FAFB" }} />
            <div className={styles.dashboardBlock} style={{ height: "300px", backgroundColor: "#F9FAFB" }} />
          </div>
        </div>
      ) : (
        <>
          {/* Overview Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            <div className={styles.dashboardBlock} style={{ padding: "1.25rem 1rem" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px", fontWeight: 700 }}>GROSS REVENUE</span>
              <span style={{ fontSize: "1.35rem", fontWeight: 850, color: "var(--text-primary)" }}>{analytics ? analytics.salesOverview.formattedGrossRevenue : "₹0"}</span>
            </div>
            <div className={styles.dashboardBlock} style={{ padding: "1.25rem 1rem" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--primary-green)", display: "block", marginBottom: "4px", fontWeight: 700 }}>ESTIMATED NET PAYOUT</span>
              <span style={{ fontSize: "1.35rem", fontWeight: 850, color: "var(--primary-dark-green)" }}>{analytics ? analytics.salesOverview.formattedNetPayout : "₹0"}</span>
            </div>
            <div className={styles.dashboardBlock} style={{ padding: "1.25rem 1rem" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px", fontWeight: 700 }}>TOTAL ORDERS</span>
              <span style={{ fontSize: "1.35rem", fontWeight: 850, color: "var(--text-primary)" }}>{analytics ? analytics.salesOverview.totalOrdersCount : 0}</span>
            </div>
            <div className={styles.dashboardBlock} style={{ padding: "1.25rem 1rem" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px", fontWeight: 700 }}>UNITS SOLD</span>
              <span style={{ fontSize: "1.35rem", fontWeight: 850, color: "var(--text-primary)" }}>{analytics ? analytics.salesOverview.totalUnitsSold : 0}</span>
            </div>
            <div className={styles.dashboardBlock} style={{ padding: "1.25rem 1rem" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px", fontWeight: 700 }}>AVG ORDER VALUE</span>
              <span style={{ fontSize: "1.35rem", fontWeight: 850, color: "var(--text-primary)" }}>{analytics ? analytics.salesOverview.formattedAvgOrderValue : "₹0"}</span>
            </div>
          </div>

          {/* Section 1: Revenue Trends & Order Quality Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
            {/* Revenue Trend Interactive SVG Chart */}
            <div className={styles.dashboardBlock}>
              <div className={styles.blockTitle} style={{ marginBottom: "1rem" }}>
                <span>Daily Revenue & Order Trends ({period})</span>
              </div>
              <RevenueTrendChart trends={analytics?.revenueTrends || []} period={period} />
            </div>

            {/* Order Quality & Health Rates */}
            <div className={styles.dashboardBlock}>
              <div className={styles.blockTitle} style={{ marginBottom: "1rem" }}>
                <span>Order Quality & Health Rates</span>
              </div>
              <OrderQualityCard orderQuality={analytics?.orderQuality} />
            </div>
          </div>

          {/* Section 2: Top Products & Category Performance */}
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
            {/* Top Products Visual Ranking Chart */}
            <div className={styles.dashboardBlock}>
              <div className={styles.blockTitle} style={{ marginBottom: "1rem" }}>
                <span>Top Performing Products</span>
              </div>
              <TopProductsChart topProducts={analytics?.topProducts || []} period={period} />
            </div>

            {/* Category Performance Share Chart */}
            <div className={styles.dashboardBlock}>
              <div className={styles.blockTitle} style={{ marginBottom: "1rem" }}>
                <span>Category Revenue Share</span>
              </div>
              <CategoryShareChart topCategories={analytics?.topCategories || []} period={period} />
            </div>
          </div>

          {/* Section 3: Inventory Health Status */}
          <div className={styles.dashboardBlock}>
            <div className={styles.blockTitle} style={{ marginBottom: "1rem" }}>
              <span>Inventory Health & Quick-Commerce Status</span>
            </div>
            <InventoryHealthChart
              inventoryHealth={analytics?.inventoryHealth}
              fladoActiveListingsCount={analytics?.quickCommercePerformance.fladoActiveListingsCount}
            />
          </div>
        </>
      )}
    </div>
  );
}
