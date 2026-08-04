"use client";

import React from "react";
import Link from "next/navigation";
import { useVendor } from "@/context/VendorContext";
import styles from "./dashboard.module.css";
import {
  TrendingUpIcon,
  PackageIcon,
  OrdersIcon,
  PayoutsIcon,
  FladoIcon,
  PlusIcon
} from "@/components/Icons";

export default function DashboardOverview() {
  const { products, orders, payouts } = useVendor();

  // Computations
  const activeProducts = products.filter(p => p.status === "active").length;
  const pendingOrders = orders.filter(o => o.status === "pending");
  const processedOrders = orders.filter(o => o.status !== "pending");
  
  // Calculate total gross sales
  const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const avgOrderValue = orders.length > 0 ? Math.round(totalSales / orders.length) : 0;
  
  // Outstanding payout balance calculation (processing payouts)
  const outstandingPayout = payouts
    .filter(p => p.status === "processing")
    .reduce((sum, p) => sum + p.netSettlement, 0);

  // Sales trend data (mocked for last 6 months for chart display)
  const monthlyTrends = [
    { month: "Jan", sales: 28000, height: "35%" },
    { month: "Feb", sales: 34000, height: "42%" },
    { month: "Mar", sales: 48000, height: "60%" },
    { month: "Apr", sales: 42000, height: "52%" },
    { month: "May", sales: 65000, height: "80%" },
    { month: "Jun", sales: totalSales, height: "100%", current: true }
  ];

  // Formatting currency
  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="animate-fade-in">
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
          <div className={styles.statValue}>{formatINR(totalSales)}</div>
          <div className={styles.statTrend}>
            <span className={styles.trendUp}>+14.2%</span>
            <span style={{ color: "var(--text-light)" }}>from last month</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <span>TOTAL ORDERS</span>
            <OrdersIcon size={16} style={{ color: "var(--primary-green)" }} />
          </div>
          <div className={styles.statValue}>{orders.length}</div>
          <div className={styles.statTrend}>
            <span className={styles.trendUp}>+{pendingOrders.length} pending</span>
            <span style={{ color: "var(--text-light)" }}>awaiting pack</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <span>AVG ORDER VALUE</span>
            <span style={{ fontSize: "0.75rem", color: "var(--primary-green)", fontWeight: 700 }}>AOV</span>
          </div>
          <div className={styles.statValue}>{formatINR(avgOrderValue)}</div>
          <div className={styles.statTrend}>
            <span className={styles.trendUp}>+5.8%</span>
            <span style={{ color: "var(--text-light)" }}>basket optimization</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <span>ACTIVE LISTINGS</span>
            <PackageIcon size={16} style={{ color: "var(--primary-green)" }} />
          </div>
          <div className={styles.statValue}>{activeProducts}</div>
          <div className={styles.statTrend}>
            <span className={styles.trendUp}>
              {products.filter(p => p.listOnFlado).length} on Flado
            </span>
            <span style={{ color: "var(--text-light)" }}>quick commerce</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Sales Trends & Pending Orders */}
      <div className={styles.dashboardMainGrid}>
        {/* Sales Chart Block */}
        <div className={styles.dashboardBlock}>
          <div className={styles.blockTitle}>
            <span>Sales Growth Trend (INR)</span>
            <div className={styles.fladoLiveBadge}>
              <TrendingUpIcon size={12} />
              <span>MoM Upward</span>
            </div>
          </div>
          <div className={styles.chartContainer}>
            {monthlyTrends.map((trend) => (
              <div key={trend.month} className={styles.chartBarWrapper}>
                <div
                  className={styles.chartBar}
                  style={{
                    height: trend.height,
                    background: trend.current
                      ? "linear-gradient(180deg, var(--primary-green) 0%, rgba(16, 185, 129, 0.4) 100%)"
                      : "linear-gradient(180deg, var(--primary-dark-green) 0%, rgba(6, 78, 59, 0.3) 100%)"
                  }}
                >
                  <span className={styles.chartBarTooltip}>{formatINR(trend.sales)}</span>
                </div>
                <span className={styles.chartBarLabel} style={{ fontWeight: trend.current ? 700 : 500 }}>
                  {trend.month}
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              Data updated just now. Next settlement cycle triggers tomorrow.
            </span>
            <a href="/dashboard/payouts" style={{ fontSize: "0.8125rem", color: "var(--primary-green)", fontWeight: 700, textDecoration: "underline" }}>
              View Payout Ledger
            </a>
          </div>
        </div>

        {/* Payout & Flado Panel Summary */}
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
                {formatINR(outstandingPayout)}
              </span>
              <span style={{ fontSize: "0.7rem", color: "var(--text-light)", display: "block", marginTop: "0.25rem" }}>
                Will settle into your bank on next payout cycle.
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
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed var(--border-color)", paddingTop: "0.5rem" }}>
                <span>Platform charge:</span>
                <span style={{ fontWeight: 600, color: "var(--primary-green)" }}>Free Promo</span>
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
      </div>

      {/* Pending Orders Table Block */}
      <div className={styles.dashboardBlock}>
        <div className={styles.blockTitle}>
          <span>Pending Orders awaiting Packing ({pendingOrders.length})</span>
          <a href="/dashboard/orders" style={{ fontSize: "0.8125rem", color: "var(--primary-green)", fontWeight: 700 }}>
            Go to Fulfillment Screen &rarr;
          </a>
        </div>

        {pendingOrders.length === 0 ? (
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
                  <th>Destination</th>
                  <th>Items Details</th>
                  <th>Value</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 700, color: "var(--primary-dark-green)" }}>{order.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>{order.customerPhone}</div>
                    </td>
                    <td>
                      <div>{order.city}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>PIN {order.pincode}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: "0.8125rem" }}>
                        {order.items.map((item, idx) => (
                          <div key={idx}>
                            {item.productName} <span style={{ fontWeight: 700 }}>x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700 }}>{formatINR(order.totalAmount)}</td>
                    <td>
                      <span className={`badge ${order.paymentMethod === "COD" ? "badge-warning" : "badge-success"}`}>
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-info" style={{ textTransform: "uppercase" }}>Awaiting Pack</span>
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
