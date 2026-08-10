"use client";

import React from "react";

export interface TopProductItem {
  productId: string;
  title: string;
  sku: string;
  unitsSold: number;
  revenueMinor: number;
  formattedRevenue: string;
}

interface TopProductsChartProps {
  topProducts: TopProductItem[];
  period: string;
}

export default function TopProductsChart({ topProducts, period }: TopProductsChartProps) {
  if (!topProducts || topProducts.length === 0) {
    return (
      <div style={{ padding: "2.5rem 1.5rem", textAlign: "center", backgroundColor: "var(--bg-color)", borderRadius: "8px", border: "1px dashed var(--border-color)" }}>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>
          No product sales recorded for selected period (<strong>{period}</strong>).
        </p>
      </div>
    );
  }

  const maxRevenue = Math.max(...topProducts.map((p) => p.revenueMinor), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {topProducts.map((item, index) => {
        const percentage = Math.max(8, Math.round((item.revenueMinor / maxRevenue) * 100));

        return (
          <div key={item.productId || index} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8125rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: index === 0 ? "#FEF3C7" : index === 1 ? "#E5E7EB" : index === 2 ? "#FFEDD5" : "#F3F4F6",
                    color: index === 0 ? "#D97706" : index === 1 ? "#4B5563" : index === 2 ? "#C2410C" : "#6B7280",
                    fontWeight: 800,
                    fontSize: "0.7rem",
                    flexShrink: 0,
                  }}
                >
                  #{index + 1}
                </span>
                <span style={{ fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.title}
                </span>
                <span style={{ fontFamily: "monospace", fontSize: "0.725rem", color: "var(--text-light)", flexShrink: 0 }}>
                  ({item.sku})
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  {item.unitsSold} {item.unitsSold === 1 ? "unit" : "units"}
                </span>
                <span style={{ fontWeight: 800, color: "var(--primary-dark-green)" }}>
                  {item.formattedRevenue}
                </span>
              </div>
            </div>

            {/* Relative Bar */}
            <div style={{ width: "100%", height: "8px", backgroundColor: "#F3F4F6", borderRadius: "4px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${percentage}%`,
                  height: "100%",
                  backgroundColor: index === 0 ? "#4F46E5" : index === 1 ? "#6366F1" : "#818CF8",
                  borderRadius: "4px",
                  transition: "width 0.4s ease-out",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
