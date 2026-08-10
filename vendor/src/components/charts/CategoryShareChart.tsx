"use client";

import React from "react";

export interface TopCategoryItem {
  categoryId: string;
  categoryName: string;
  revenueMinor: number;
  formattedRevenue: string;
  sharePercentage: number;
}

interface CategoryShareChartProps {
  topCategories: TopCategoryItem[];
  period: string;
}

export default function CategoryShareChart({ topCategories, period }: CategoryShareChartProps) {
  if (!topCategories || topCategories.length === 0) {
    return (
      <div style={{ padding: "2.5rem 1.5rem", textAlign: "center", backgroundColor: "var(--bg-color)", borderRadius: "8px", border: "1px dashed var(--border-color)" }}>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>
          No category sales breakdown recorded for selected period (<strong>{period}</strong>).
        </p>
      </div>
    );
  }

  const categoryColors = ["#059669", "#2563EB", "#D97706", "#7C3AED", "#EC4899", "#6B7280"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {topCategories.map((cat, index) => {
        const color = categoryColors[index % categoryColors.length];
        const barWidth = Math.max(5, Math.min(100, cat.sharePercentage || 0));

        return (
          <div key={cat.categoryId || index} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8125rem" }}>
              <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{cat.categoryName}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: color }}>
                  {cat.sharePercentage}% share
                </span>
                <span style={{ fontWeight: 700, color: "var(--text-secondary)" }}>{cat.formattedRevenue}</span>
              </div>
            </div>

            {/* Category Share Progress Bar */}
            <div style={{ width: "100%", height: "8px", backgroundColor: "#F3F4F6", borderRadius: "4px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${barWidth}%`,
                  height: "100%",
                  backgroundColor: color,
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
