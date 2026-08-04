"use client";

import React, { useState } from "react";
import { Search, Users, UserCheck, UserX, Heart, AlertTriangle } from "lucide-react";
import { useAdmin, User } from "@/context/AdminContext";
import styles from "../crud.module.css";

export default function UsersPage() {
  const { users, updateUserStatus } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Stats
  const totalUsersCount = users.length;
  const activeCount = users.filter((u) => u.status === "active").length;
  const blockedCount = users.filter((u) => u.status === "blocked").length;
  const totalSpend = users.reduce((acc, curr) => acc + curr.totalSpent, 0);

  // Filter
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm) ||
      u.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || u.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, status: User["status"]) => {
    updateUserStatus(id, status);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Page Title */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h2 className={styles.title}>Customer Accounts</h2>
          <p className={styles.subtitle}>Audit, restrict, or check shopping statistics of registered grocery buyers.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Total Customers</span>
            <span className={styles.metricValue}>{totalUsersCount}</span>
          </div>
          <div className={styles.metricIcon}>
            <Users size={22} />
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Active Customers</span>
            <span className={styles.metricValue}>{activeCount}</span>
          </div>
          <div className={styles.metricIcon} style={{ backgroundColor: "#ecfdf5", color: "#10b981" }}>
            <UserCheck size={22} />
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Restricted Accounts</span>
            <span className={styles.metricValue}>{blockedCount}</span>
          </div>
          <div className={styles.metricIcon} style={{ backgroundColor: "#fef2f2", color: "#ef4444" }}>
            <UserX size={22} />
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Average Customer LTV</span>
            <span className={styles.metricValue}>
              ₹{totalUsersCount > 0 ? Math.round(totalSpend / totalUsersCount).toLocaleString("en-IN") : 0}
            </span>
          </div>
          <div className={styles.metricIcon} style={{ backgroundColor: "#ecfeff", color: "#06b6d4" }}>
            <Heart size={22} />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search customer name, email, phone, city..."
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
            <option value="all">All Accounts</option>
            <option value="active">Active Only</option>
            <option value="blocked">Blocked Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className={styles.tableContainer}>
        {filteredUsers.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>City</th>
                <th>Join Date</th>
                <th>Total Orders</th>
                <th>Customer Value</th>
                <th>Status</th>
                <th>Restraints</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600, color: "var(--primary)" }}>{u.id}</td>
                  <td style={{ fontWeight: 600, color: "var(--text-main)" }}>{u.name}</td>
                  <td style={{ fontSize: "0.85rem" }}>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>{u.city}</td>
                  <td>{u.joinDate}</td>
                  <td style={{ fontWeight: 500 }}>{u.ordersCount} orders</td>
                  <td style={{ fontWeight: 600, color: "var(--text-main)" }}>
                    ₹{u.totalSpent.toLocaleString("en-IN")}
                  </td>
                  <td>
                    <span className={`badge ${u.status === "active" ? "badge-success" : "badge-danger"}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className={styles.filterSelect}
                      style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                      value={u.status}
                      onChange={(e) => handleStatusChange(u.id, e.target.value as User["status"])}
                      aria-label="Toggle user status"
                    >
                      <option value="active">Activate</option>
                      <option value="blocked">Block User</option>
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
            <h3 className={styles.emptyStateTitle}>No customers found</h3>
            <p>Modify search filters to find registered customers.</p>
          </div>
        )}
      </div>
    </div>
  );
}
