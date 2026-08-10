"use client";

import React, { useState } from "react";

export interface RevenueTrendItem {
  date: string;
  grossRevenueMinor: number;
  formattedGrossRevenue: string;
  netPayoutMinor: number;
  formattedNetPayout: string;
  ordersCount: number;
}

interface RevenueTrendChartProps {
  trends: RevenueTrendItem[];
  period: string;
}

export default function RevenueTrendChart({ trends, period }: RevenueTrendChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<RevenueTrendItem | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  if (!trends || trends.length === 0) {
    return (
      <div style={{ padding: "3rem 1.5rem", textAlign: "center", backgroundColor: "var(--bg-color)", borderRadius: "8px", border: "1px dashed var(--border-color)" }}>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>
          No order revenue trend data recorded for selected period (<strong>{period}</strong>).
        </p>
      </div>
    );
  }

  // Dimensions & Padding for responsive SVG viewBox
  const width = 600;
  const height = 220;
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Max values for auto-scaling
  const maxRevenue = Math.max(...trends.map((t) => Math.max(t.grossRevenueMinor, t.netPayoutMinor)), 1);

  // Y-axis tick steps (5 ticks)
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => Math.round(maxRevenue * ratio));

  // Compute point coordinates
  const points = trends.map((item, index) => {
    const x =
      trends.length > 1
        ? paddingLeft + (index / (trends.length - 1)) * chartWidth
        : paddingLeft + chartWidth / 2;
    const yGross = height - paddingBottom - (item.grossRevenueMinor / maxRevenue) * chartHeight;
    const yNet = height - paddingBottom - (item.netPayoutMinor / maxRevenue) * chartHeight;
    return { ...item, x, yGross, yNet };
  });

  // SVG Path generation
  const grossPathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? "M" : "L"} ${p.x} ${p.yGross}`, "");
  const netPathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? "M" : "L"} ${p.x} ${p.yNet}`, "");

  // Area path under Gross Revenue line
  const areaGrossD = points.length > 0
    ? `${grossPathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`
    : "";

  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px", marginBottom: "12px", fontSize: "0.75rem", fontWeight: 600 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: "#4F46E5" }} />
          <span style={{ color: "var(--text-secondary)" }}>Gross Revenue</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: "#059669" }} />
          <span style={{ color: "var(--text-secondary)" }}>Net Payout</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
        <defs>
          <linearGradient id="grossAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Y-Axis Grid Lines & Labels */}
        {yTicks.map((tick, i) => {
          const y = height - paddingBottom - (tick / maxRevenue) * chartHeight;
          const formattedLabel = tick >= 100000 ? `₹${(tick / 100000).toFixed(1)}k` : `₹${Math.round(tick / 100)}`;
          return (
            <g key={i}>
              <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#E5E7EB" strokeDasharray="3 3" strokeWidth="1" />
              <text x={paddingLeft - 8} y={y + 4} textAnchor="end" fontSize="9" fill="#9CA3AF" fontWeight="600">
                {formattedLabel}
              </text>
            </g>
          );
        })}

        {/* Area under Gross Line */}
        {areaGrossD && <path d={areaGrossD} fill="url(#grossAreaGrad)" />}

        {/* Net Payout Line */}
        {netPathD && <path d={netPathD} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

        {/* Gross Revenue Line */}
        {grossPathD && <path d={grossPathD} fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

        {/* Data Points & Interactive Circles */}
        {points.map((p, i) => (
          <g key={i}>
            {/* Net Payout Point */}
            <circle cx={p.x} cy={p.yNet} r="3.5" fill="#059669" stroke="#FFFFFF" strokeWidth="1.5" />

            {/* Gross Revenue Point & Hover Trigger */}
            <circle
              cx={p.x}
              cy={p.yGross}
              r="4.5"
              fill="#4F46E5"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              style={{ cursor: "pointer" }}
              onMouseEnter={(e) => {
                setHoveredPoint(p);
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
              }}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          </g>
        ))}

        {/* X-Axis Date Labels */}
        {points.map((p, i) => {
          // Show label if <= 10 points, or skip intermediate labels for longer series
          const showLabel = points.length <= 10 || i === 0 || i === points.length - 1 || i % Math.ceil(points.length / 6) === 0;
          if (!showLabel) return null;

          const dateLabel = p.date.length > 5 ? p.date.substring(5) : p.date;
          return (
            <text key={i} x={p.x} y={height - 12} textAnchor="middle" fontSize="10" fill="#6B7280" fontWeight="600">
              {dateLabel}
            </text>
          );
        })}
      </svg>

      {/* Tooltip Overlay */}
      {hoveredPoint && (
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "12px",
            backgroundColor: "#1F2937",
            color: "#FFFFFF",
            padding: "8px 12px",
            borderRadius: "6px",
            fontSize: "0.75rem",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: "4px", color: "#F3F4F6", borderBottom: "1px solid #374151", paddingBottom: "3px" }}>
            Date: {hoveredPoint.date} ({hoveredPoint.ordersCount} {hoveredPoint.ordersCount === 1 ? "order" : "orders"})
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
            <span style={{ color: "#A5B4FC" }}>Gross Revenue:</span>
            <span style={{ fontWeight: 700 }}>{hoveredPoint.formattedGrossRevenue}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
            <span style={{ color: "#6EE7B7" }}>Est. Net Payout:</span>
            <span style={{ fontWeight: 700 }}>{hoveredPoint.formattedNetPayout}</span>
          </div>
        </div>
      )}
    </div>
  );
}
