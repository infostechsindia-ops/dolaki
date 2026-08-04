"use client";

import React, { useState } from "react";
import { BarChart3, TrendingUp, Users, ArrowUpRight, ArrowDownRight, Award, Flame, AlertCircle } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import styles from "./analytics.module.css";
import crudStyles from "../crud.module.css";

export default function AnalyticsPage() {
  const { vendors, products } = useAdmin();

  // Weekly volume data
  const weeklyVolume = [
    { day: "Week 22", value: 1420 },
    { day: "Week 23", value: 1890 },
    { day: "Week 24", value: 1650 },
    { day: "Week 25", value: 2420 },
    { day: "Week 26", value: 2980 },
    { day: "Week 27", value: 3840 },
  ];

  const maxWeeklyVol = Math.max(...weeklyVolume.map((w) => w.value));

  // Vendor leaderboard: Sort approved vendors by revenue
  const topVendors = [...vendors]
    .filter((v) => v.status === "approved")
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Top products leaderboard: Sort products by sales
  const topProducts = [...products]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Page Header */}
      <div className={crudStyles.pageHeader}>
        <div className={crudStyles.pageTitleGroup}>
          <h2 className={crudStyles.title}>Analytics & Growth</h2>
          <p className={crudStyles.subtitle}>Deep-dive business intelligence metrics, performance, and trends.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className={crudStyles.metricsGrid}>
        <div className={crudStyles.metricCard}>
          <div className={crudStyles.metricInfo}>
            <span className={crudStyles.metricLabel}>Avg Order Value</span>
            <span className={crudStyles.metricValue}>₹945.50</span>
            <span className={`${crudStyles.metricTrend} ${crudStyles.trendUp}`}>
              <ArrowUpRight size={14} /> +3.8% vs last month
            </span>
          </div>
          <div className={crudStyles.metricIcon}>
            <TrendingUp size={22} />
          </div>
        </div>

        <div className={crudStyles.metricCard}>
          <div className={crudStyles.metricInfo}>
            <span className={crudStyles.metricLabel}>Cust Acquisition Cost</span>
            <span className={crudStyles.metricValue}>₹108.20</span>
            <span className={`${crudStyles.metricTrend} ${crudStyles.trendDown}`}>
              <ArrowDownRight size={14} /> -12.4% optimization
            </span>
          </div>
          <div className={crudStyles.metricIcon}>
            <Users size={22} />
          </div>
        </div>

        <div className={crudStyles.metricCard}>
          <div className={crudStyles.metricInfo}>
            <span className={crudStyles.metricLabel}>ROAS (Ad Campaigns)</span>
            <span className={crudStyles.metricValue}>4.82x</span>
            <span className={`${crudStyles.metricTrend} ${crudStyles.trendUp}`}>
              <ArrowUpRight size={14} /> +0.45x conversion
            </span>
          </div>
          <div className={crudStyles.metricIcon} style={{ backgroundColor: "#ecfdf5", color: "#10b981" }}>
            <TrendingUp size={22} />
          </div>
        </div>

        <div className={crudStyles.metricCard}>
          <div className={crudStyles.metricInfo}>
            <span className={crudStyles.metricLabel}>Cart Abandonment</span>
            <span className={crudStyles.metricValue}>56.8%</span>
            <span className={`${crudStyles.metricTrend} ${crudStyles.trendDown}`}>
              <ArrowDownRight size={14} /> -2.1% recovery efforts
            </span>
          </div>
          <div className={crudStyles.metricIcon} style={{ backgroundColor: "#fef2f2", color: "#ef4444" }}>
            <AlertCircle size={22} />
          </div>
        </div>
      </div>

      {/* Visual Analytics Graphs Split */}
      <div className={crudStyles.splitGrid}>
        {/* Bar Chart card */}
        <div className={crudStyles.card}>
          <h3 className={crudStyles.cardTitle}>Weekly Order Volume</h3>
          <div className={styles.barChartWrapper}>
            {weeklyVolume.map((item, idx) => {
              const heightPct = (item.value / maxWeeklyVol) * 80; // Scale to max 80% to leave room for labels
              return (
                <div key={idx} className={styles.barCol}>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className={styles.barValueTooltip}>{item.value} orders</span>
                  </div>
                  <span className={styles.barLabel}>{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily active users line chart */}
        <div className={crudStyles.card}>
          <div className={crudStyles.pageHeader} style={{ marginBottom: 0, paddingBottom: 0 }}>
            <h3 className={crudStyles.cardTitle} style={{ borderBottom: "none", paddingBottom: 0 }}>
              Daily Active Customers
            </h3>
            <span className="badge badge-success">Live: 852 users</span>
          </div>

          <div style={{ position: "relative", width: "100%", height: "180px", display: "flex", alignItems: "flex-end" }}>
            {/* Custom line chart using SVG */}
            <svg width="100%" height="100%" viewBox="0 0 400 150" style={{ overflow: "visible" }}>
              <defs>
                <linearGradient id="dau-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Gridlines */}
              {[0, 0.5, 1].map((ratio, idx) => (
                <line
                  key={idx}
                  x1="0"
                  y1={15 + ratio * 100}
                  x2="400"
                  y2={15 + ratio * 100}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
              ))}
              {/* Path coordinates for DAUs (Mon-Sun: 450, 520, 490, 680, 710, 890, 920) mapped to 0-400 x 15-115 y */}
              <path
                d="M 10 115 L 75 105 L 140 110 L 205 80 L 270 75 L 335 45 L 390 40"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 10 115 L 75 105 L 140 110 L 205 80 L 270 75 L 335 45 L 390 40 L 390 130 L 10 130 Z"
                fill="url(#dau-grad)"
              />
              {/* Circles */}
              {[
                { x: 10, y: 115, val: "450" },
                { x: 75, y: 105, val: "520" },
                { x: 140, y: 110, val: "490" },
                { x: 205, y: 80, val: "680" },
                { x: 270, y: 75, val: "710" },
                { x: 335, y: 45, val: "890" },
                { x: 390, y: 40, val: "920" }
              ].map((pt, idx) => (
                <g key={idx}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="white"
                    stroke="var(--primary)"
                    strokeWidth="2"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 8}
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    fontSize="8"
                    fontWeight="700"
                  >
                    {pt.val}
                  </text>
                </g>
              ))}
              {/* Day Labels */}
              {[
                { x: 10, label: "Mon" },
                { x: 75, label: "Tue" },
                { x: 140, label: "Wed" },
                { x: 205, label: "Thu" },
                { x: 270, label: "Fri" },
                { x: 335, label: "Sat" },
                { x: 390, label: "Sun" }
              ].map((lbl, idx) => (
                <text
                  key={idx}
                  x={lbl.x}
                  y="145"
                  textAnchor="middle"
                  fill="var(--text-light)"
                  fontSize="9"
                  fontWeight="600"
                >
                  {lbl.label}
                </text>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Leaderboards Split Grid */}
      <div className={crudStyles.splitGrid}>
        {/* Top Vendors Leaderboard */}
        <div className={crudStyles.card}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Award size={20} style={{ color: "var(--primary)" }} />
            <h3 className={crudStyles.cardTitle} style={{ borderBottom: "none", paddingBottom: 0 }}>
              Top Performing Vendors
            </h3>
          </div>
          <div className={styles.leaderboardList}>
            {topVendors.map((vendor, index) => (
              <div key={vendor.id} className={styles.leaderboardItem}>
                <div className={styles.vendorRankGroup}>
                  <span className={styles.rankBadge}>#{index + 1}</span>
                  <div className={styles.vendorDetails}>
                    <span className={styles.vendorName}>{vendor.name}</span>
                    <span className={styles.vendorLocation}>{vendor.city}</span>
                  </div>
                </div>
                <div className={styles.vendorMetrics}>
                  <span className={styles.vendorSales}>₹{vendor.revenue.toLocaleString("en-IN")}</span>
                  <span className={styles.vendorVolume}>{vendor.productCount} products</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products Leaderboard */}
        <div className={crudStyles.card}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Flame size={20} style={{ color: "#ef4444" }} />
            <h3 className={crudStyles.cardTitle} style={{ borderBottom: "none", paddingBottom: 0 }}>
              Best Selling Grocery Items
            </h3>
          </div>
          <div className={styles.leaderboardList}>
            {topProducts.map((prod, index) => (
              <div key={prod.id} className={styles.leaderboardItem}>
                <div className={styles.vendorRankGroup}>
                  <span className={styles.rankBadge} style={{ backgroundColor: "#fef2f2", color: "#ef4444" }}>
                    #{index + 1}
                  </span>
                  <div className={styles.vendorDetails}>
                    <span className={styles.vendorName}>{prod.name}</span>
                    <span className={styles.vendorLocation}>{prod.category}</span>
                  </div>
                </div>
                <div className={styles.vendorMetrics}>
                  <span className={styles.vendorSales}>{prod.sales} Sold</span>
                  <span className={styles.vendorVolume}>Stock: {prod.stock} units</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
