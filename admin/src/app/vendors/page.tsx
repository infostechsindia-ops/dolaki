"use client";

import React, { useState } from "react";
import { Search, Store, CheckCircle, Clock, AlertTriangle, ShieldAlert } from "lucide-react";
import { useAdmin, Vendor } from "@/context/AdminContext";
import styles from "../crud.module.css";

export default function VendorsPage() {
  const { vendors, updateVendorStatus } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Stats
  const totalVendors = vendors.length;
  const approvedCount = vendors.filter((v) => v.status === "approved").length;
  const pendingCount = vendors.filter((v) => v.status === "pending").length;
  const suspendedCount = vendors.filter((v) => v.status === "suspended").length;
  const totalRevenue = vendors.reduce((acc, curr) => acc + curr.revenue, 0);

  // Filter
  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || v.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Vendor["status"]) => {
    switch (status) {
      case "approved":
        return "badge badge-success";
      case "pending":
        return "badge badge-warning";
      case "suspended":
        return "badge badge-danger";
      default:
        return "badge badge-muted";
    }
  };

  const handleStatusChange = (id: string, status: Vendor["status"]) => {
    updateVendorStatus(id, status);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Page Title */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h2 className={styles.title}>Vendor Management</h2>
          <p className={styles.subtitle}>Audit, approve, suspend and view revenue contributions of merchant stores.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Total Vendors</span>
            <span className={styles.metricValue}>{totalVendors}</span>
          </div>
          <div className={styles.metricIcon}>
            <Store size={22} />
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Approved Partners</span>
            <span className={styles.metricValue}>{approvedCount}</span>
          </div>
          <div className={styles.metricIcon} style={{ backgroundColor: "#ecfdf5", color: "#10b981" }}>
            <CheckCircle size={22} />
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Verification Pending</span>
            <span className={styles.metricValue}>{pendingCount}</span>
          </div>
          <div className={styles.metricIcon} style={{ backgroundColor: "#fffbeb", color: "#f59e0b" }}>
            <Clock size={22} />
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Suspended Shops</span>
            <span className={styles.metricValue}>{suspendedCount}</span>
          </div>
          <div className={styles.metricIcon} style={{ backgroundColor: "#fef2f2", color: "#ef4444" }}>
            <ShieldAlert size={22} />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search vendor name, owner, city..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filtersGroup}>
          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter status"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending Review</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Vendors Table */}
      <div className={styles.tableContainer}>
        {filteredVendors.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Vendor ID</th>
                <th>Store / Business</th>
                <th>Owner Name</th>
                <th>City</th>
                <th>Catalog Size</th>
                <th>Seller Rating</th>
                <th>Total Revenue</th>
                <th>Status</th>
                <th>Action Controls</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map((v) => (
                <tr key={v.id}>
                  <td style={{ fontWeight: 600, color: "var(--primary)" }}>{v.id}</td>
                  <td style={{ fontWeight: 600, color: "var(--text-main)" }}>{v.name}</td>
                  <td>{v.ownerName}</td>
                  <td>{v.city}</td>
                  <td style={{ fontWeight: 500 }}>{v.productCount} items</td>
                  <td style={{ color: "#f59e0b", fontWeight: 600 }}>★ {v.rating.toFixed(1)}</td>
                  <td style={{ fontWeight: 600, color: "var(--text-main)" }}>
                    ₹{v.revenue.toLocaleString("en-IN")}
                  </td>
                  <td>
                    <span className={getStatusBadge(v.status)}>{v.status}</span>
                  </td>
                  <td>
                    <select
                      className={styles.filterSelect}
                      style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                      value={v.status}
                      onChange={(e) => handleStatusChange(v.id, e.target.value as Vendor["status"])}
                      aria-label="Change status"
                    >
                      <option value="approved">Approve</option>
                      <option value="pending">Set Pending</option>
                      <option value="suspended">Suspend</option>
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
            <h3 className={styles.emptyStateTitle}>No vendors match search</h3>
            <p>Try searching for a different shop title or owner name.</p>
          </div>
        )}
      </div>
    </div>
  );
}
