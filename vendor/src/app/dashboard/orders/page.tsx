"use client";

import React, { useState } from "react";
import { useVendor, Order, OrderStatus } from "@/context/VendorContext";
import styles from "../dashboard.module.css";
import {
  PackageIcon,
  ShipIcon,
  CheckIcon,
  SearchIcon,
  InfoIcon
} from "@/components/Icons";

export default function OrdersPage() {
  const { orders, updateOrderStatus } = useVendor();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | OrderStatus>("all");

  const handleStatusTransition = (orderId: string, currentStatus: OrderStatus) => {
    let nextStatus: OrderStatus = "pending";
    if (currentStatus === "pending") nextStatus = "packed";
    else if (currentStatus === "packed") nextStatus = "shipped";
    else if (currentStatus === "shipped") nextStatus = "ready";

    updateOrderStatus(orderId, nextStatus);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <span className="badge badge-info">AWAITING PACK</span>;
      case "packed":
        return <span className="badge badge-warning">PACKED & READY</span>;
      case "shipped":
        return <span className="badge badge-info" style={{ backgroundColor: "rgba(59, 130, 246, 0.1)", color: "#2563eb", borderColor: "#bfdbfe" }}>SHIPPED / IN TRANSIT</span>;
      case "ready":
        return <span className="badge badge-success">READY / DELIVERED</span>;
      default:
        return null;
    }
  };

  const getFulfillmentAction = (order: Order) => {
    switch (order.status) {
      case "pending":
        return (
          <button
            className={styles.primaryBtn}
            onClick={() => handleStatusTransition(order.id, "pending")}
            style={{ width: "100%", justifyContent: "center" }}
          >
            <PackageIcon size={16} />
            <span>Pack Order (Generate Invoice)</span>
          </button>
        );
      case "packed":
        return (
          <button
            className={styles.primaryBtn}
            onClick={() => handleStatusTransition(order.id, "packed")}
            style={{
              width: "100%",
              justifyContent: "center",
              backgroundColor: "#d97706", // amber color for shipping
            }}
          >
            <ShipIcon size={16} />
            <span>Handover to Courier (Ship)</span>
          </button>
        );
      case "shipped":
        return (
          <button
            className={styles.primaryBtn}
            onClick={() => handleStatusTransition(order.id, "shipped")}
            style={{
              width: "100%",
              justifyContent: "center",
              backgroundColor: "var(--primary-green-hover)",
            }}
          >
            <CheckIcon size={16} />
            <span>Mark as Delivered (Ready)</span>
          </button>
        );
      case "ready":
        return (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            color: "var(--primary-green)",
            fontWeight: 700,
            fontSize: "0.875rem",
            padding: "0.5rem",
            backgroundColor: "var(--accent-green-light)",
            border: "1px solid var(--accent-green-border)",
            borderRadius: "var(--radius-sm)"
          }}>
            <CheckIcon size={16} />
            <span>Fulfillment Completed & Settled</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getStepClass = (orderStatus: OrderStatus, step: OrderStatus) => {
    const sequence: OrderStatus[] = ["pending", "packed", "shipped", "ready"];
    const orderIndex = sequence.indexOf(orderStatus);
    const stepIndex = sequence.indexOf(step);

    if (orderIndex >= stepIndex) {
      return {
        dotStyle: { backgroundColor: "var(--primary-green)", color: "white" },
        textStyle: { color: "var(--text-primary)", fontWeight: 700 }
      };
    }
    return {
      dotStyle: { backgroundColor: "var(--border-color)", color: "var(--text-light)" },
      textStyle: { color: "var(--text-light)", fontWeight: 500 }
    };
  };

  // Filter logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === "all" || order.status === activeTab;

    return matchesSearch && matchesTab;
  });

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

  return (
    <div className="animate-fade-in">
      {/* Search and Tabs Filter Panel */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "1.5rem" }}>
        <div className={styles.searchFilterRow}>
          <div className={styles.searchBox} style={{ maxWidth: "450px" }}>
            <SearchIcon size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search orders by ID, name, city..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tab Controls */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid var(--border-color)",
          gap: "1.5rem",
          overflowX: "auto"
        }}>
          {(["all", "pending", "packed", "shipped", "ready"] as const).map((tab) => {
            const count = tab === "all" ? orders.length : orders.filter(o => o.status === tab).length;
            const label = tab === "all" ? "All Orders" :
                          tab === "pending" ? "Pending Pack" :
                          tab === "packed" ? "Ready to Ship" :
                          tab === "shipped" ? "Shipped" : "Ready / Delivered";
            
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
                <span style={{
                  fontSize: "0.7rem",
                  background: isActive ? "var(--accent-green-light)" : "var(--bg-color)",
                  color: isActive ? "var(--primary-green)" : "var(--text-secondary)",
                  padding: "2px 6px",
                  borderRadius: "10px",
                  border: isActive ? "1px solid var(--accent-green-border)" : "1px solid var(--border-color)",
                  fontWeight: 700
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Pipeline List */}
      {filteredOrders.length === 0 ? (
        <div style={{ padding: "4rem 2rem", textAlign: "center", backgroundColor: "var(--card-bg)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
          <InfoIcon size={48} style={{ color: "var(--text-light)", marginBottom: "1rem" }} />
          <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.25rem" }}>No Orders Located</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            There are no orders listed matching this status category.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              style={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                padding: "1.5rem",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              {/* Order Header info */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                borderBottom: "1px solid var(--border-color)",
                paddingBottom: "1rem",
                marginBottom: "1rem",
                gap: "1rem",
                flexWrap: "wrap"
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--primary-dark-green)" }}>
                      {order.id}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px", display: "block" }}>
                    Placed: {formatDate(order.createdAt)}
                  </span>
                </div>
                
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>
                    PAYMENT TYPE
                  </span>
                  <span className={`badge ${order.paymentMethod === "COD" ? "badge-warning" : "badge-success"}`} style={{ marginTop: "4px" }}>
                    {order.paymentMethod} ({order.paymentMethod === "COD" ? "Collect on Delivery" : "Paid"})
                  </span>
                </div>
              </div>

              {/* Order content detail grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr 1fr",
                gap: "2rem",
                marginBottom: "1.5rem"
              }}>
                {/* Ship to Address */}
                <div>
                  <h4 style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                    Shipping Destination
                  </h4>
                  <div style={{ fontSize: "0.875rem" }}>
                    <div style={{ fontWeight: 700 }}>{order.customerName}</div>
                    <div style={{ color: "var(--text-secondary)", marginTop: "2px" }}>{order.shippingAddress}</div>
                    <div style={{ fontWeight: 600, marginTop: "2px" }}>
                      {order.city}, {order.state} - {order.pincode}
                    </div>
                    <div style={{ color: "var(--primary-green)", fontWeight: 600, marginTop: "6px" }}>
                      Phone: {order.customerPhone}
                    </div>
                  </div>
                </div>

                {/* Ordered Items details */}
                <div>
                  <h4 style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                    Ordered Items
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ fontSize: "0.875rem", display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-primary)" }}>
                          {item.productName} <span style={{ fontWeight: 700 }}>x{item.quantity}</span>
                        </span>
                        <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                          {formatINR(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                    <div style={{
                      borderTop: "1px dashed var(--border-color)",
                      paddingTop: "6px",
                      marginTop: "4px",
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      color: "var(--text-primary)"
                    }}>
                      <span>Total Value:</span>
                      <span>{formatINR(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Stepper Timeline & Action Area */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h4 style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
                      Fulfillment Progress
                    </h4>
                    
                    {/* Visual pipeline steps */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingLeft: "4px" }}>
                      {[
                        { step: "pending", label: "Awaiting Packing" },
                        { step: "packed", label: "Packed & Invoice Ready" },
                        { step: "shipped", label: "Dispatched (In Transit)" },
                        { step: "ready", label: "Delivered (Completed)" }
                      ].map((item, idx) => {
                        const stepStyles = getStepClass(order.status, item.step as OrderStatus);
                        return (
                          <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "9px",
                              transition: "all 0.3s",
                              ...stepStyles.dotStyle
                            }}>
                              ✓
                            </div>
                            <span style={{ fontSize: "0.75rem", transition: "all 0.3s", ...stepStyles.textStyle }}>
                              {item.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ marginTop: "1rem" }}>
                    {getFulfillmentAction(order)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
