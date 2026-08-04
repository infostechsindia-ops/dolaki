"use client";

import React, { useState } from "react";
import styles from "./DashboardCharts.module.css";

interface SalesPoint {
  label: string;
  value: number;
}

interface CategoryShare {
  name: string;
  value: number;
  color: string;
}

export default function DashboardCharts() {
  const [hoveredPoint, setHoveredPoint] = useState<{
    index: number;
    x: number;
    y: number;
    value: number;
    label: string;
  } | null>(null);

  const [hoveredCategory, setHoveredCategory] = useState<CategoryShare | null>(null);

  const salesData: SalesPoint[] = [
    { label: "24 Jun", value: 18400 },
    { label: "25 Jun", value: 22100 },
    { label: "26 Jun", value: 19500 },
    { label: "27 Jun", value: 28400 },
    { label: "28 Jun", value: 25600 },
    { label: "29 Jun", value: 34200 },
    { label: "30 Jun", value: 38900 },
  ];

  const categoriesData: CategoryShare[] = [
    { name: "Groceries & Staples", value: 45200, color: "#7c3aed" }, // violet
    { name: "Snacks & Brands", value: 28300, color: "#a78bfa" }, // light violet
    { name: "Dairy & Bakery", value: 18900, color: "#06b6d4" }, // cyan
    { name: "Beverages", value: 12500, color: "#10b981" }, // emerald
    { name: "Others", value: 8400, color: "#f59e0b" }, // amber
  ];

  const totalSales = categoriesData.reduce((acc, curr) => acc + curr.value, 0);

  // Math for Area Chart
  const svgWidth = 500;
  const svgHeight = 200;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const maxVal = Math.max(...salesData.map((d) => d.value)) * 1.1; // Add 10% ceiling
  const minVal = 0;

  const points = salesData.map((d, index) => {
    const x = paddingLeft + (index / (salesData.length - 1)) * chartWidth;
    const y = svgHeight - paddingBottom - ((d.value - minVal) / (maxVal - minVal)) * chartHeight;
    return { x, y, label: d.label, value: d.value };
  });

  // Construct Area Path
  let linePath = "";
  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      linePath += ` L ${points[i].x} ${points[i].y}`;
    }
  }

  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${svgHeight - paddingBottom} L ${points[0].x} ${svgHeight - paddingBottom} Z` 
    : "";

  // Math for Donut Chart
  const radius = 55;
  const strokeWidth = 14;
  const center = 80;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercentage = 0;

  return (
    <div className={styles.chartsContainer}>
      {/* Revenue Area Chart */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <div>
            <h3 className={styles.chartTitle}>Revenue Growth</h3>
            <p className={styles.chartSubtitle}>Daily sales value trends in ₹</p>
          </div>
          <select className={styles.timeframeSelect} aria-label="Select timeframe">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>

        <div className={styles.chartBody}>
          <svg className={styles.svgWrapper} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
            <defs>
              <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = svgHeight - paddingBottom - ratio * chartHeight;
              const val = Math.round(minVal + ratio * (maxVal - minVal));
              return (
                <g key={idx}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={svgWidth - paddingRight}
                    y2={y}
                    className={styles.gridLine}
                  />
                  <text
                    x={paddingLeft - 10}
                    y={y + 4}
                    textAnchor="end"
                    className={styles.axisText}
                  >
                    ₹{val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                  </text>
                </g>
              );
            })}

            {/* Area and Line Paths */}
            {areaPath && (
              <path d={areaPath} fill="url(#area-grad)" />
            )}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}

            {/* Interactive Circles & Labels */}
            {points.map((pt, idx) => (
              <g key={idx}>
                <line
                  x1={pt.x}
                  y1={svgHeight - paddingBottom}
                  x2={pt.x}
                  y2={svgHeight - paddingBottom + 5}
                  className={styles.axisLine}
                />
                <text
                  x={pt.x}
                  y={svgHeight - paddingBottom + 18}
                  textAnchor="middle"
                  className={styles.axisText}
                >
                  {pt.label}
                </text>

                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  className={styles.chartPoint}
                  onMouseEnter={() =>
                    setHoveredPoint({
                      index: idx,
                      x: pt.x,
                      y: pt.y,
                      value: pt.value,
                      label: pt.label,
                    })
                  }
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            ))}
          </svg>

          {/* Interactive HTML Tooltip */}
          {hoveredPoint && (
            <div
              className={styles.tooltip}
              style={{
                left: `${(hoveredPoint.x / svgWidth) * 100}%`,
                top: `${(hoveredPoint.y / svgHeight) * 100 - 15}%`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <span className={styles.tooltipTitle}>{hoveredPoint.label}</span>
              <span>₹{hoveredPoint.value.toLocaleString("en-IN")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Category Breakout Donut Chart */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <div>
            <h3 className={styles.chartTitle}>Category Mix</h3>
            <p className={styles.chartSubtitle}>Revenue split by category</p>
          </div>
        </div>

        <div className={styles.donutContainer}>
          <div className={styles.donutWrapper}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke="#f1f5f9"
                strokeWidth={strokeWidth}
              />
              {categoriesData.map((category, idx) => {
                const percentage = category.value / totalSales;
                const strokeDasharray = `${percentage * circumference} ${circumference}`;
                const strokeDashoffset = -accumulatedPercentage * circumference;
                accumulatedPercentage += percentage;

                return (
                  <circle
                    key={idx}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={category.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className={styles.donutSegment}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHoveredCategory(category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  />
                );
              })}
            </svg>

            <div className={styles.donutCenterText}>
              <span className={styles.donutVal}>
                ₹{((hoveredCategory ? hoveredCategory.value : totalSales) / 1000).toFixed(0)}k
              </span>
              <span className={styles.donutLbl}>
                {hoveredCategory ? hoveredCategory.name.split(" ")[0] : "Total sales"}
              </span>
            </div>
          </div>

          <div className={styles.legendList}>
            {categoriesData.map((category, idx) => {
              const percentage = ((category.value / totalSales) * 100).toFixed(0);
              return (
                <div key={idx} className={styles.legendItem}>
                  <div className={styles.legendLabelGroup}>
                    <span
                      className={styles.legendColor}
                      style={{ backgroundColor: category.color }}
                    ></span>
                    <span>{category.name}</span>
                  </div>
                  <span className={styles.legendValue}>{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
