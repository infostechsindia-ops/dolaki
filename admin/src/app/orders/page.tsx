"use client";

import React, { useState } from "react";
import { Search, ShoppingBag, CheckCircle, Clock, AlertTriangle, Filter } from "lucide-react";
import { useAdmin, Order } from "@/context/AdminContext";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import styles from "../crud.module.css";

export default function OrdersPage() {
  const { orders, updateOrderStatus } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // Calculate order stats
  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter((o) => (o.status as string) === "Pending" || (o.status as string) === "Processing" || (o.status as string) === "PLACED" || (o.status as string) === "PREPARING").length;
  const shippedCount = orders.filter((o) => (o.status as string) === "Shipped" || (o.status as string) === "SHIPPED" || (o.status as string) === "OUT_FOR_DELIVERY").length;
  const deliveredCount = orders.filter((o) => (o.status as string) === "Delivered" || (o.status as string) === "DELIVERED").length;

  const handleStatusChange = (orderId: string, status: Order["status"]) => {
    updateOrderStatus(orderId, status);
  };

  // Filter logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerCity.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesPayment = paymentFilter === "all" || order.paymentMethod === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Page Title */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h2 className={styles.title}>Order Management</h2>
          <p className={styles.subtitle}>Track, approve, dispatch, and manage all customer grocery orders.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Total Orders</span>
            <span className={styles.metricValue}>{totalOrdersCount}</span>
          </div>
          <div className={styles.metricIcon}>
            <ShoppingBag size={22} />
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Active (Pending/Proc)</span>
            <span className={styles.metricValue}>{pendingCount}</span>
          </div>
          <div className={styles.metricIcon} style={{ backgroundColor: "#fffbeb", color: "#f59e0b" }}>
            <Clock size={22} />
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>In Transit (Shipped)</span>
            <span className={styles.metricValue}>{shippedCount}</span>
          </div>
          <div className={styles.metricIcon} style={{ backgroundColor: "#ecfeff", color: "#06b6d4" }}>
            <Clock size={22} />
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Delivered</span>
            <span className={styles.metricValue}>{deliveredCount}</span>
          </div>
          <div className={styles.metricIcon} style={{ backgroundColor: "#ecfdf5", color: "#10b981" }}>
            <CheckCircle size={22} />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search Order ID, name, or city..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filtersGroup}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Filter size={16} style={{ color: "var(--text-light)" }} />
            <select
              className={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter status"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <select
            className={styles.filterSelect}
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            aria-label="Filter payment"
          >
            <option value="all">All Payments</option>
            <option value="UPI">UPI Only</option>
            <option value="Card">Card Only</option>
            <option value="NetBanking">NetBanking Only</option>
            <option value="COD">COD Only</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className={styles.tableContainer}>
        {filteredOrders.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>City</th>
                <th>Date</th>
                <th>Items Count</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600, color: "var(--primary)" }}>{order.id}</td>
                  <td style={{ fontWeight: 500, color: "var(--text-main)" }}>{order.customerName}</td>
                  <td>{order.customerCity}</td>
                  <td>{order.orderDate}</td>
                  <td>{order.itemsCount} items</td>
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
                      aria-label="Update status"
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
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <AlertTriangle size={32} />
            </div>
            <h3 className={styles.emptyStateTitle}>No orders match filters</h3>
            <p>Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
