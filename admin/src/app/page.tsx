"use client";

import React, { useState } from "react";
import {
  IndianRupee,
  ShoppingBag,
  Package,
  Store,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  CheckCircle,
  Truck,
  RotateCcw
} from "lucide-react";
import { useAdmin, Order } from "@/context/AdminContext";
import DashboardCharts from "@/components/DashboardCharts";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import styles from "./crud.module.css";

export default function Dashboard() {
  const { orders, products, vendors, updateOrderStatus } = useAdmin();

  // Compute live statistics based on state
  const totalRevenue = orders
    .filter((o) => (o.status as string) === "Delivered" || (o.status as string) === "DELIVERED" || (o.status as string) === "Shipped" || (o.status as string) === "SHIPPED" || (o.status as string) === "Processing" || (o.status as string) === "PROCESSING")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingOrders = orders.filter((o) => (o.status as string) === "Pending" || (o.status as string) === "Processing" || (o.status as string) === "PLACED" || (o.status as string) === "PREPARING").length;
  const activeProducts = products.filter((p) => p.status === "active").length;
  const activeVendors = vendors.filter((v) => v.status === "approved").length;

  const handleStatusChange = (orderId: string, status: Order["status"]) => {
    updateOrderStatus(orderId, status);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h2 className={styles.title}>Dashboard Overview</h2>
          <p className={styles.subtitle}>Welcome back! Real-time operations and performance summary.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className={styles.metricsGrid}>
        {/* Metric 1 */}
        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Total Revenue</span>
            <span className={styles.metricValue}>₹{totalRevenue.toLocaleString("en-IN")}</span>
            <span className={`${styles.metricTrend} ${styles.trendUp}`}>
              <ArrowUpRight size={14} /> +12.4% vs last week
            </span>
          </div>
          <div className={styles.metricIcon}>
            <IndianRupee size={22} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Active Orders</span>
            <span className={styles.metricValue}>{orders.length}</span>
            <span className={`${styles.metricTrend} ${styles.trendUp}`}>
              <ArrowUpRight size={14} /> +4.2% vs yesterday
            </span>
          </div>
          <div className={styles.metricIcon}>
            <ShoppingBag size={22} />
          </div>
        </div>

        {/* Metric 3 */}
        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Live Products</span>
            <span className={styles.metricValue}>{activeProducts}</span>
            <span className={styles.metricLabel} style={{ fontSize: "0.7rem", marginTop: "2px" }}>
              {products.length - activeProducts} drafts / out of stock
            </span>
          </div>
          <div className={styles.metricIcon}>
            <Package size={22} />
          </div>
        </div>

        {/* Metric 4 */}
        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Active Vendors</span>
            <span className={styles.metricValue}>{activeVendors}</span>
            <span className={`${styles.metricTrend} ${styles.trendDown}`}>
              <ArrowDownRight size={14} /> -1.8% suspend rate
            </span>
          </div>
          <div className={styles.metricIcon}>
            <Store size={22} />
          </div>
        </div>
      </div>

      {/* Custom SVG Charts */}
      <DashboardCharts />

      {/* Recent Orders Section */}
      <div className={styles.card}>
        <div className={styles.chartHeader} style={{ marginBottom: "1rem" }}>
          <h3 className={styles.cardTitle} style={{ borderBottom: "none", paddingBottom: 0 }}>
            Recent Orders
          </h3>
          <span className="badge badge-info">{pendingOrders} Action Pending</span>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>City</th>
                <th>Date</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600, color: "var(--primary)" }}>{order.id}</td>
                  <td style={{ fontWeight: 500, color: "var(--text-main)" }}>{order.customerName}</td>
                  <td>{order.customerCity}</td>
                  <td>{order.orderDate}</td>
                  <td>{order.itemsCount}</td>
                  <td style={{ fontWeight: 600, color: "var(--text-main)" }}>
                    ₹{order.amount.toLocaleString("en-IN")}
                  </td>
                  <td>
                    <span className="badge badge-muted">{order.paymentMethod}</span>
                  </td>
                  <td>
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td>
                    <select
                      className={styles.filterSelect}
                      style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                      aria-label="Change status"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
