"use client";

import React from "react";

export interface InventoryHealthMetrics {
  totalSKUsCount: number;
  inStockSKUsCount: number;
  lowStockSKUsCount: number;
  outOfStockSKUsCount: number;
}

interface InventoryHealthChartProps {
  inventoryHealth?: InventoryHealthMetrics;
  fladoActiveListingsCount?: number;
}

export default function InventoryHealthChart({ inventoryHealth, fladoActiveListingsCount = 0 }: InventoryHealthChartProps) {
  const total = inventoryHealth?.totalSKUsCount ?? 0;
  const inStock = inventoryHealth?.inStockSKUsCount ?? 0;
  const lowStock = inventoryHealth?.lowStockSKUsCount ?? 0;
  const outOfStock = inventoryHealth?.outOfStockSKUsCount ?? 0;

  const inStockPct = total > 0 ? Math.round((inStock / total) * 100) : 0;
  const lowStockPct = total > 0 ? Math.round((lowStock / total) * 100) : 0;
  const outOfStockPct = total > 0 ? Math.round((outOfStock / total) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Visual Stock Distribution Stacked Bar */}
      {total > 0 && (
        <div style={{ width: "100%", height: "10px", backgroundColor: "#F3F4F6", borderRadius: "5px", overflow: "hidden", display: "flex" }}>
          <div style={{ width: `${inStockPct}%`, backgroundColor: "#059669" }} title={`In Stock: ${inStock} (${inStockPct}%)`} />
          <div style={{ width: `${lowStockPct}%`, backgroundColor: "#D97706" }} title={`Low Stock: ${lowStock} (${lowStockPct}%)`} />
          <div style={{ width: `${outOfStockPct}%`, backgroundColor: "#DC2626" }} title={`Out of Stock: ${outOfStock} (${outOfStockPct}%)`} />
        </div>
      )}

      {/* Grid Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
        <div style={{ padding: "0.875rem", backgroundColor: "#ECFDF5", borderRadius: "6px", border: "1px solid #A7F3D0", textAlign: "center" }}>
          <span style={{ fontSize: "0.7rem", color: "#065F46", fontWeight: 700, display: "block" }}>IN STOCK</span>
          <span style={{ fontSize: "1.4rem", fontWeight: 850, color: "#047857" }}>{inStock}</span>
          <span style={{ fontSize: "0.7rem", color: "#059669", display: "block" }}>{inStockPct}% of SKUs</span>
        </div>
        <div style={{ padding: "0.875rem", backgroundColor: "#FFFBEB", borderRadius: "6px", border: "1px solid #FDE68A", textAlign: "center" }}>
          <span style={{ fontSize: "0.7rem", color: "#92400E", fontWeight: 700, display: "block" }}>LOW STOCK</span>
          <span style={{ fontSize: "1.4rem", fontWeight: 850, color: "#B45309" }}>{lowStock}</span>
          <span style={{ fontSize: "0.7rem", color: "#D97706", display: "block" }}>{lowStockPct}% of SKUs</span>
        </div>
        <div style={{ padding: "0.875rem", backgroundColor: "#FEF2F2", borderRadius: "6px", border: "1px solid #FECACA", textAlign: "center" }}>
          <span style={{ fontSize: "0.7rem", color: "#991B1B", fontWeight: 700, display: "block" }}>OUT OF STOCK</span>
          <span style={{ fontSize: "1.4rem", fontWeight: 850, color: "#B91C1C" }}>{outOfStock}</span>
          <span style={{ fontSize: "0.7rem", color: "#DC2626", display: "block" }}>{outOfStockPct}% of SKUs</span>
        </div>
      </div>

      {/* Quick-Commerce & Total Summary */}
      <div style={{ paddingTop: "0.75rem", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
          Total Active SKUs: <strong>{total}</strong> | Flado Active Listings: <strong>{fladoActiveListingsCount}</strong>
        </div>
        <a href="/dashboard/inventory" style={{ fontSize: "0.75rem", padding: "6px 12px", color: "var(--primary-color)", fontWeight: 700, textDecoration: "none" }}>
          Manage Inventory →
        </a>
      </div>
    </div>
  );
}
