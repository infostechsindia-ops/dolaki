"use client";

import React from "react";

export type OrderStatusType =
  | "PLACED"
  | "CONFIRMED"
  | "PROCESSING"
  | "PREPARING"
  | "PACKED"
  | "READY_FOR_PICKUP"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURN_REQUESTED"
  | "RETURNED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | string;

export interface OrderStatusBadgeProps {
  status: OrderStatusType;
  className?: string;
  style?: React.CSSProperties;
}

export interface StatusDesignToken {
  label: string;
  variant: "success" | "warning" | "danger" | "info" | "neutral" | "purple";
  backgroundColor: string;
  textColor: string;
  borderColor: string;
}

export const STATUS_TOKEN_MAP: Record<string, StatusDesignToken> = {
  // Delivered
  DELIVERED: {
    label: "Delivered",
    variant: "success",
    backgroundColor: "#ECFDF5",
    textColor: "#047857",
    borderColor: "#A7F3D0",
  },
  Delivered: {
    label: "Delivered",
    variant: "success",
    backgroundColor: "#ECFDF5",
    textColor: "#047857",
    borderColor: "#A7F3D0",
  },

  // In Transit / Out for delivery / Shipped
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    variant: "info",
    backgroundColor: "#EFF6FF",
    textColor: "#1D4ED8",
    borderColor: "#BFDBFE",
  },
  SHIPPED: {
    label: "Shipped",
    variant: "info",
    backgroundColor: "#EFF6FF",
    textColor: "#1D4ED8",
    borderColor: "#BFDBFE",
  },
  Shipped: {
    label: "Shipped",
    variant: "info",
    backgroundColor: "#EFF6FF",
    textColor: "#1D4ED8",
    borderColor: "#BFDBFE",
  },
  READY_FOR_PICKUP: {
    label: "Ready for Pickup",
    variant: "info",
    backgroundColor: "#EFF6FF",
    textColor: "#1D4ED8",
    borderColor: "#BFDBFE",
  },
  PACKED: {
    label: "Packed",
    variant: "info",
    backgroundColor: "#F0FDFA",
    textColor: "#0F766E",
    borderColor: "#99F6E4",
  },

  // Active / Processing / Pending
  PROCESSING: {
    label: "Processing",
    variant: "warning",
    backgroundColor: "#FFFBEB",
    textColor: "#B45309",
    borderColor: "#FDE68A",
  },
  Processing: {
    label: "Processing",
    variant: "warning",
    backgroundColor: "#FFFBEB",
    textColor: "#B45309",
    borderColor: "#FDE68A",
  },
  PENDING: {
    label: "Pending",
    variant: "warning",
    backgroundColor: "#FFFBEB",
    textColor: "#B45309",
    borderColor: "#FDE68A",
  },
  Pending: {
    label: "Pending",
    variant: "warning",
    backgroundColor: "#FFFBEB",
    textColor: "#B45309",
    borderColor: "#FDE68A",
  },
  PREPARING: {
    label: "Preparing",
    variant: "warning",
    backgroundColor: "#FFFBEB",
    textColor: "#B45309",
    borderColor: "#FDE68A",
  },
  PLACED: {
    label: "Placed",
    variant: "warning",
    backgroundColor: "#FEF3C7",
    textColor: "#92400E",
    borderColor: "#FDE68A",
  },
  CONFIRMED: {
    label: "Confirmed",
    variant: "warning",
    backgroundColor: "#FEF3C7",
    textColor: "#92400E",
    borderColor: "#FDE68A",
  },

  // Cancelled / Danger
  CANCELLED: {
    label: "Cancelled",
    variant: "danger",
    backgroundColor: "#FEF2F2",
    textColor: "#B91C1C",
    borderColor: "#FCA5A5",
  },
  Cancelled: {
    label: "Cancelled",
    variant: "danger",
    backgroundColor: "#FEF2F2",
    textColor: "#B91C1C",
    borderColor: "#FCA5A5",
  },

  // Return & Refund Statuses
  RETURN_REQUESTED: {
    label: "Return Requested",
    variant: "purple",
    backgroundColor: "#F3E8FF",
    textColor: "#6B21A8",
    borderColor: "#E9D5FF",
  },
  RETURNED: {
    label: "Returned",
    variant: "purple",
    backgroundColor: "#F3E8FF",
    textColor: "#6B21A8",
    borderColor: "#E9D5FF",
  },
  Returned: {
    label: "Returned",
    variant: "purple",
    backgroundColor: "#F3E8FF",
    textColor: "#6B21A8",
    borderColor: "#E9D5FF",
  },
  REFUNDED: {
    label: "Refunded",
    variant: "purple",
    backgroundColor: "#F3E8FF",
    textColor: "#6B21A8",
    borderColor: "#E9D5FF",
  },
  PARTIALLY_REFUNDED: {
    label: "Partially Refunded",
    variant: "purple",
    backgroundColor: "#FFE4E6",
    textColor: "#9F1239",
    borderColor: "#FECDD3",
  },
};

export function getStatusToken(status: string): StatusDesignToken {
  if (!status) {
    return {
      label: "Unknown",
      variant: "neutral",
      backgroundColor: "#F3F4F6",
      textColor: "#374151",
      borderColor: "#D1D5DB",
    };
  }

  const exactMatch = STATUS_TOKEN_MAP[status];
  if (exactMatch) return exactMatch;

  const upperMatch = STATUS_TOKEN_MAP[status.toUpperCase()];
  if (upperMatch) return upperMatch;

  // Unknown status safety fallback: normalize underscores and title-case text
  const normalizedLabel = status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    label: normalizedLabel,
    variant: "neutral",
    backgroundColor: "#F3F4F6",
    textColor: "#374151",
    borderColor: "#D1D5DB",
  };
}

export default function OrderStatusBadge({ status, className = "", style }: OrderStatusBadgeProps) {
  const token = getStatusToken(status);

  return (
    <span
      className={`admin-status-badge ${className}`}
      aria-label={`Order status: ${token.label}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: "12px",
        fontSize: "0.75rem",
        fontWeight: 700,
        textTransform: "none",
        letterSpacing: "0.01em",
        backgroundColor: token.backgroundColor,
        color: token.textColor,
        border: `1px solid ${token.borderColor}`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {token.label}
    </span>
  );
}
