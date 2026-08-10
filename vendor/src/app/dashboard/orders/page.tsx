"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useVendor, Order, OrderStatus } from "@/context/VendorContext";
import styles from "../dashboard.module.css";
import {
  PackageIcon,
  ShipIcon,
  CheckIcon,
  SearchIcon,
  InfoIcon
} from "@/components/Icons";

interface LiveVendorOrderSummaryDTO {
  orderId: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  vendorItemCount: number;
  vendorTotalMinor: number;
  formattedVendorTotal: string;
  createdAt: string;
  slaWarning: {
    code: string;
    severity: "INFO" | "WARNING" | "CRITICAL";
    message: string;
  } | null;
}

interface PackingSlipDTO {
  orderId: string;
  orderNumber: string;
  orderDate: string;
  vendorStoreName: string;
  customerRecipientName: string;
  shippingAddressMin: string;
  items: Array<{
    sku: string;
    title: string;
    quantityToPack: number;
    unitPriceFormatted: string;
    lineSubtotalFormatted: string;
  }>;
  packingInstructions: string;
  barcodeRef: string;
}

export default function OrdersPage() {
  const { orders, updateOrderStatus } = useVendor();

  const [liveOrders, setLiveOrders] = useState<LiveVendorOrderSummaryDTO[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");

  const [activeSlip, setActiveSlip] = useState<PackingSlipDTO | null>(null);
  const [isSlipModalOpen, setIsSlipModalOpen] = useState<boolean>(false);

  const fetchLiveOrders = useCallback(async () => {
    const isDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO_FIXTURES === "true";
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    if (isDemo || !token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/vendors/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to load vendor orders");
      let data = await res.json();
      if (data && typeof data === "object" && "data" in data) data = data.data;

      setLiveOrders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch vendor orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveOrders();
  }, [fetchLiveOrders]);

  const handleFulfillAction = async (orderId: string, action: "ACCEPT" | "PACK" | "SHIP") => {
    const isDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO_FIXTURES === "true";
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    if (isDemo || !token) {
      let nextStatus: OrderStatus = "pending";
      if (action === "ACCEPT" || action === "PACK") nextStatus = "packed";
      else if (action === "SHIP") nextStatus = "shipped";
      updateOrderStatus(orderId, nextStatus);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/v1/vendors/orders/${orderId}/fulfill`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ action })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Fulfillment action ${action} failed`);
      }

      setSuccessMsg(`Fulfillment action "${action}" completed for order ${orderId}.`);
      fetchLiveOrders();
    } catch (err: any) {
      setError(err?.message || "Fulfillment transition error");
    }
  };

  const handleFetchPackingSlip = async (orderId: string) => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    try {
      const res = await fetch(`${BASE_URL}/api/v1/vendors/orders/${orderId}/packing-slip`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to generate packing slip");
      let data = await res.json();
      if (data && typeof data === "object" && "data" in data) data = data.data;

      setActiveSlip(data);
      setIsSlipModalOpen(true);
    } catch (err: any) {
      setError(err?.message || "Packing slip error");
    }
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatDate = (isoStr: string) => {
    return new Date(isoStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const displayOrders = liveOrders !== null
    ? liveOrders
    : orders.map((o) => ({
        orderId: o.id,
        orderNumber: o.id,
        status: o.status === "pending" ? "PLACED" : o.status === "packed" ? "PREPARING" : o.status === "shipped" ? "SHIPPED" : "DELIVERED",
        paymentStatus: o.paymentMethod === "COD" ? "COD_PENDING" : "PAID",
        vendorItemCount: o.items.length,
        vendorTotalMinor: Math.round(o.totalAmount * 100),
        formattedVendorTotal: formatINR(o.totalAmount),
        createdAt: o.createdAt,
        slaWarning: o.status === "pending" ? { code: "URGENT_PACKING", severity: "WARNING" as const, message: "Awaiting vendor packing confirmation" } : null
      }));

  const filteredOrders = displayOrders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === "all" || order.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="animate-fade-in">
      {/* Search and Tabs Filter Panel */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "1.5rem" }}>
        <div className={styles.searchFilterRow}>
          <div className={styles.searchBox} style={{ maxWidth: "450px" }}>
            <SearchIcon size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search orders by Order ID or Order Number..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: "#FEF2F2", borderLeft: "4px solid #EF4444", color: "#991B1B", padding: "1rem", borderRadius: "4px", fontSize: "0.875rem" }}>
            <strong>Fulfillment Error:</strong> {error}
          </div>
        )}

        {/* Tab Controls */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border-color)", gap: "1.5rem", overflowX: "auto" }}>
          {(["all", "PLACED", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"] as const).map((tab) => {
            const count = tab === "all" ? displayOrders.length : displayOrders.filter((o) => o.status === tab).length;
            const label = tab === "all" ? "All Orders" : tab === "PLACED" ? "Placed / Action Required" : tab === "PREPARING" ? "Preparing / Packed" : tab === "SHIPPED" ? "Shipped" : tab === "DELIVERED" ? "Delivered" : "Cancelled";
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "0.75rem 0.25rem",
                  background: "none",
                  border: "none",
                  borderBottom: isActive ? "3px solid var(--primary-green)" : "3px solid transparent",
                  color: isActive ? "var(--primary-dark-green)" : "var(--text-secondary)",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <span>{label}</span>
                <span style={{ fontSize: "0.7rem", background: isActive ? "var(--accent-green-light)" : "var(--bg-color)", color: isActive ? "var(--primary-green)" : "var(--text-secondary)", padding: "2px 6px", borderRadius: "10px", border: isActive ? "1px solid var(--accent-green-border)" : "1px solid var(--border-color)", fontWeight: 700 }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div style={{ padding: "4rem 2rem", textAlign: "center", backgroundColor: "var(--card-bg)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
          <InfoIcon size={48} style={{ color: "var(--text-light)", marginBottom: "1rem" }} />
          <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.25rem" }}>No Orders Located</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>There are no orders listed matching this status category.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {filteredOrders.map((order) => (
            <div key={order.orderId} style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
              {/* SLA Warning Banner */}
              {order.slaWarning && (
                <div style={{ backgroundColor: order.slaWarning.severity === "CRITICAL" ? "#FEE2E2" : "#FEF3C7", borderLeft: `4px solid ${order.slaWarning.severity === "CRITICAL" ? "#EF4444" : "#F59E0B"}`, color: order.slaWarning.severity === "CRITICAL" ? "#991B1B" : "#92400E", padding: "8px 12px", marginBottom: "1rem", borderRadius: "4px", fontSize: "0.8125rem", fontWeight: 700 }}>
                  ⚠️ {order.slaWarning.message}
                </div>
              )}

              {/* Order Header info */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", marginBottom: "1rem", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--primary-dark-green)" }}>{order.orderNumber}</span>
                    <span className={`badge ${order.status === "DELIVERED" ? "badge-success" : order.status === "PLACED" ? "badge-warning" : "badge-info"}`}>{order.status}</span>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px", display: "block" }}>Placed: {formatDate(order.createdAt)}</span>
                </div>

                <div style={{ textAlign: "right", display: "flex", gap: "10px", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>VENDOR VALUE</span>
                    <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-primary)" }}>{order.formattedVendorTotal}</span>
                  </div>
                  <button type="button" className={styles.secondaryBtn} onClick={() => handleFetchPackingSlip(order.orderId)} style={{ fontSize: "0.75rem", padding: "6px 12px" }}>
                    📄 Packing Slip
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                {order.status === "PLACED" && (
                  <button type="button" className={styles.primaryBtn} onClick={() => handleFulfillAction(order.orderId, "ACCEPT")}>
                    <PackageIcon size={16} /> Accept & Start Prep
                  </button>
                )}
                {order.status === "PREPARING" && (
                  <>
                    <button type="button" className={styles.secondaryBtn} onClick={() => handleFulfillAction(order.orderId, "PACK")}>
                      Pack Items
                    </button>
                    <button type="button" className={styles.primaryBtn} onClick={() => handleFulfillAction(order.orderId, "SHIP")}>
                      <ShipIcon size={16} /> Handover to Carrier (Ship)
                    </button>
                  </>
                )}
                {order.status === "SHIPPED" && (
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#2563EB", padding: "6px 12px", backgroundColor: "#EFF6FF", borderRadius: "4px" }}>
                    🚚 Dispatched with carrier (In Transit)
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Packing Slip Modal */}
      {isSlipModalOpen && activeSlip && (
        <div className={styles.modalOverlay} onClick={() => setIsSlipModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Official Packing Slip — {activeSlip.orderNumber}</h3>
              <button className={styles.closeBtn} onClick={() => setIsSlipModalOpen(false)}>✕</button>
            </div>
            <div className={styles.modalBody} style={{ fontSize: "0.875rem" }}>
              <div style={{ borderBottom: "1px solid #E5E7EB", paddingBottom: "8px", marginBottom: "12px" }}>
                <div style={{ fontWeight: 800, fontSize: "1rem" }}>{activeSlip.vendorStoreName}</div>
                <div style={{ color: "#4B5563" }}>Date: {formatDate(activeSlip.orderDate)}</div>
                <div style={{ color: "#4B5563" }}>Ship To: <strong>{activeSlip.customerRecipientName}</strong> ({activeSlip.shippingAddressMin})</div>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F3F4F6", textTransform: "uppercase", fontSize: "0.75rem" }}>
                    <th style={{ padding: "6px", textAlign: "left" }}>SKU</th>
                    <th style={{ padding: "6px", textAlign: "left" }}>Item Title</th>
                    <th style={{ padding: "6px", textAlign: "center" }}>Qty</th>
                    <th style={{ padding: "6px", textAlign: "right" }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {activeSlip.items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #F3F4F6" }}>
                      <td style={{ padding: "6px", fontFamily: "monospace" }}>{item.sku}</td>
                      <td style={{ padding: "6px" }}>{item.title}</td>
                      <td style={{ padding: "6px", textAlign: "center", fontWeight: 700 }}>{item.quantityToPack}</td>
                      <td style={{ padding: "6px", textAlign: "right" }}>{item.lineSubtotalFormatted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: "8px", backgroundColor: "#FEF3C7", borderRadius: "4px", fontSize: "0.8125rem", color: "#92400E" }}>
                📌 <strong>Instructions:</strong> {activeSlip.packingInstructions}
              </div>
              <div style={{ marginTop: "12px", textAlign: "center", fontFamily: "monospace", fontSize: "0.75rem", color: "#6B7280" }}>
                {activeSlip.barcodeRef}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.secondaryBtn} onClick={() => window.print()}>🖨️ Print Packing Slip</button>
              <button type="button" className={styles.primaryBtn} onClick={() => setIsSlipModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
