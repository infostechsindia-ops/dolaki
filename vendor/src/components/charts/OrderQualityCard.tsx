"use client";

import React from "react";

export interface OrderQualityMetrics {
  totalOrders: number;
  cancelledOrdersCount: number;
  cancellationRatePercentage: number;
  returnedOrdersCount: number;
  returnRatePercentage: number;
  totalRefundsMinor: number;
  formattedTotalRefunds: string;
}

interface OrderQualityCardProps {
  orderQuality?: OrderQualityMetrics;
}

export default function OrderQualityCard({ orderQuality }: OrderQualityCardProps) {
  const totalOrders = orderQuality?.totalOrders ?? 0;
  const cancelledCount = orderQuality?.cancelledOrdersCount ?? 0;
  const returnedCount = orderQuality?.returnedOrdersCount ?? 0;

  // Zero-order safety calculation guards
  const cancellationRate = totalOrders > 0 ? (orderQuality?.cancellationRatePercentage ?? 0) : 0;
  const returnRate = totalOrders > 0 ? (orderQuality?.returnRatePercentage ?? 0) : 0;
  const formattedRefunds = orderQuality?.formattedTotalRefunds || "₹0";

  const isCancellationHigh = cancellationRate > 5;
  const isReturnHigh = returnRate > 5;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Cancellation Rate Block */}
      <div
        style={{
          padding: "1.125rem",
          backgroundColor: isCancellationHigh ? "#FEF2F2" : "#ECFDF5",
          borderRadius: "8px",
          border: `1px solid ${isCancellationHigh ? "#FECACA" : "#A7F3D0"}`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: isCancellationHigh ? "#991B1B" : "#065F46" }}>
            CANCELLATION RATE
          </span>
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 800,
              padding: "2px 8px",
              borderRadius: "12px",
              backgroundColor: isCancellationHigh ? "#FEE2E2" : "#D1FAE5",
              color: isCancellationHigh ? "#DC2626" : "#059669",
            }}
          >
            {isCancellationHigh ? "High Alert" : "Healthy"}
          </span>
        </div>

        <span style={{ fontSize: "1.6rem", fontWeight: 850, color: isCancellationHigh ? "#DC2626" : "#059669" }}>
          {cancellationRate}%
        </span>
        <span style={{ fontSize: "0.75rem", color: isCancellationHigh ? "#B91C1C" : "#047857", display: "block", marginTop: "2px" }}>
          {cancelledCount} cancelled of {totalOrders} total {totalOrders === 1 ? "order" : "orders"}
        </span>
      </div>

      {/* Return & QC Refund Rate Block */}
      <div
        style={{
          padding: "1.125rem",
          backgroundColor: isReturnHigh ? "#FEF2F2" : "#ECFDF5",
          borderRadius: "8px",
          border: `1px solid ${isReturnHigh ? "#FECACA" : "#A7F3D0"}`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: isReturnHigh ? "#991B1B" : "#065F46" }}>
            RETURN & QC REFUND RATE
          </span>
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 800,
              padding: "2px 8px",
              borderRadius: "12px",
              backgroundColor: isReturnHigh ? "#FEE2E2" : "#D1FAE5",
              color: isReturnHigh ? "#DC2626" : "#059669",
            }}
          >
            {isReturnHigh ? "High Alert" : "Healthy"}
          </span>
        </div>

        <span style={{ fontSize: "1.6rem", fontWeight: 850, color: isReturnHigh ? "#DC2626" : "#059669" }}>
          {returnRate}%
        </span>
        <span style={{ fontSize: "0.75rem", color: isReturnHigh ? "#B91C1C" : "#047857", display: "block", marginTop: "2px" }}>
          {returnedCount} returned ({formattedRefunds} total refunds)
        </span>
      </div>
    </div>
  );
}
