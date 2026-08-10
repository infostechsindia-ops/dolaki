"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "../dashboard.module.css";
import {
  PackageIcon,
  CheckIcon,
  SearchIcon,
  InfoIcon
} from "@/components/Icons";

interface VendorReturnSummaryDTO {
  returnId: string;
  orderId: string;
  productTitle: string;
  sku: string;
  requestedQuantity: number;
  reason: string;
  resolutionChoice: string;
  status: string;
  qcStatus: string;
  refundAmountMinor: number;
  formattedRefundAmount: string;
  createdAt: string;
}

interface VendorReturnDetailDTO {
  returnId: string;
  orderId: string;
  orderItemId: string;
  productTitle: string;
  sku: string;
  requestedQuantity: number;
  reason: string;
  description: string | null;
  resolutionChoice: string;
  fulfillmentType: string;
  evidenceUrls: string[];
  qcStatus: string;
  qcNotes: string | null;
  status: string;
  refundAmountMinor: number;
  formattedRefundAmount: string;
  payoutImpactMinor: number;
  formattedPayoutImpact: string;
  restocked: boolean;
  createdAt: string;
  timeline: Array<{
    eventType: string;
    statusText: string;
    description?: string;
    actorRole?: string;
    occurredAt: string;
  }>;
}

export default function VendorReturnsPage() {
  const [returns, setReturns] = useState<VendorReturnSummaryDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");

  const [activeDetail, setActiveDetail] = useState<VendorReturnDetailDTO | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [decisionNotes, setDecisionNotes] = useState<string>("");

  const fetchReturns = useCallback(async () => {
    const isDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO_FIXTURES === "true";
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    if (isDemo || !token) {
      setReturns([
        {
          returnId: "ret-101",
          orderId: "ord-101",
          productTitle: "Handwoven Silk Stole",
          sku: "SILK-STL-01",
          requestedQuantity: 1,
          reason: "Defective weave pattern",
          resolutionChoice: "REFUND",
          status: "REQUESTED",
          qcStatus: "PENDING_INSPECTION",
          refundAmountMinor: 150000,
          formattedRefundAmount: "₹1,500",
          createdAt: new Date().toISOString()
        }
      ]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/vendors/returns`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to load vendor return requests");
      let data = await res.json();
      if (data && typeof data === "object" && "data" in data) data = data.data;

      setReturns(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch returns");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  const handleOpenDetail = async (returnId: string) => {
    const isDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO_FIXTURES === "true";
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    if (isDemo || !token) {
      setActiveDetail({
        returnId: "ret-101",
        orderId: "ord-101",
        orderItemId: "item-101",
        productTitle: "Handwoven Silk Stole",
        sku: "SILK-STL-01",
        requestedQuantity: 1,
        reason: "Defective weave pattern",
        description: "Small tear near border stitch.",
        resolutionChoice: "REFUND",
        fulfillmentType: "PICKUP",
        evidenceUrls: ["https://images.unsplash.com/photo-1576092768241-dec231879fc3"],
        qcStatus: "PENDING_INSPECTION",
        qcNotes: null,
        status: "REQUESTED",
        refundAmountMinor: 150000,
        formattedRefundAmount: "₹1,500",
        payoutImpactMinor: 135840,
        formattedPayoutImpact: "₹1,358",
        restocked: false,
        createdAt: new Date().toISOString(),
        timeline: [
          {
            eventType: "REQUESTED",
            statusText: "Return Request Submitted",
            description: "Customer requested return for defective weave pattern",
            actorRole: "CUSTOMER",
            occurredAt: new Date().toISOString()
          }
        ]
      });
      setIsDetailModalOpen(true);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/v1/vendors/returns/${returnId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to load return details");
      let data = await res.json();
      if (data && typeof data === "object" && "data" in data) data = data.data;

      setActiveDetail(data);
      setIsDetailModalOpen(true);
    } catch (err: any) {
      setError(err?.message || "Return detail error");
    }
  };

  const handleDecisionAction = async (action: "APPROVE" | "REJECT" | "QC_PASS" | "QC_FAIL", restock: boolean = true) => {
    if (!activeDetail) return;

    const isDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO_FIXTURES === "true";
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    if (isDemo || !token) {
      setIsDetailModalOpen(false);
      fetchReturns();
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/v1/vendors/returns/${activeDetail.returnId}/decision`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ action, notes: decisionNotes, restock })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Decision action ${action} failed`);
      }

      setIsDetailModalOpen(false);
      setDecisionNotes("");
      fetchReturns();
    } catch (err: any) {
      setError(err?.message || "Return decision error");
    }
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

  const filteredReturns = returns.filter((ret) => {
    const matchesSearch =
      ret.returnId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ret.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ret.productTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === "all" || ret.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "1.5rem" }}>
        <div className={styles.searchFilterRow}>
          <div className={styles.searchBox} style={{ maxWidth: "450px" }}>
            <SearchIcon size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search returns by Return ID, Order ID, Title..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: "#FEF2F2", borderLeft: "4px solid #EF4444", color: "#991B1B", padding: "1rem", borderRadius: "4px", fontSize: "0.875rem" }}>
            <strong>Return Error:</strong> {error}
          </div>
        )}

        {/* Tab Controls */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border-color)", gap: "1.5rem", overflowX: "auto" }}>
          {(["all", "REQUESTED", "APPROVED", "RESOLVED_REFUND", "REJECTED"] as const).map((tab) => {
            const count = tab === "all" ? returns.length : returns.filter((r) => r.status === tab).length;
            const label = tab === "all" ? "All Returns" : tab === "REQUESTED" ? "Requested / New" : tab === "APPROVED" ? "Approved / QC Pending" : tab === "RESOLVED_REFUND" ? "Refunded / Resolved" : "Rejected";
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

      {/* Returns List Table */}
      {filteredReturns.length === 0 ? (
        <div style={{ padding: "4rem 2rem", textAlign: "center", backgroundColor: "var(--card-bg)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
          <InfoIcon size={48} style={{ color: "var(--text-light)", marginBottom: "1rem" }} />
          <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.25rem" }}>No Return Requests</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>There are no return requests matching this category.</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Return ID</th>
                <th>Order ID</th>
                <th>Product Title</th>
                <th>Reason</th>
                <th>Status</th>
                <th>QC Status</th>
                <th>Refund Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.map((ret) => (
                <tr key={ret.returnId}>
                  <td style={{ fontWeight: 700, fontFamily: "monospace" }}>{ret.returnId}</td>
                  <td>{ret.orderId}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{ret.productTitle}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>SKU: {ret.sku} (x{ret.requestedQuantity})</div>
                  </td>
                  <td>{ret.reason}</td>
                  <td>
                    <span className={`badge ${ret.status === "RESOLVED_REFUND" ? "badge-success" : ret.status === "REJECTED" ? "badge-warning" : "badge-info"}`}>
                      {ret.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: ret.qcStatus === "QC_PASSED" ? "#059669" : ret.qcStatus === "QC_FAILED" ? "#DC2626" : "#D97706" }}>
                      {ret.qcStatus}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700 }}>{ret.formattedRefundAmount}</td>
                  <td>
                    <button type="button" className={styles.secondaryBtn} onClick={() => handleOpenDetail(ret.returnId)} style={{ fontSize: "0.75rem", padding: "4px 8px" }}>
                      Inspect & Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail / QC Decision Modal */}
      {isDetailModalOpen && activeDetail && (
        <div className={styles.modalOverlay} onClick={() => setIsDetailModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "650px" }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Return Inspection & QC — {activeDetail.returnId}</h3>
              <button className={styles.closeBtn} onClick={() => setIsDetailModalOpen(false)}>✕</button>
            </div>

            <div className={styles.modalBody} style={{ fontSize: "0.875rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <div style={{ color: "#6B7280", fontSize: "0.75rem" }}>PRODUCT</div>
                  <div style={{ fontWeight: 700 }}>{activeDetail.productTitle}</div>
                  <div style={{ fontSize: "0.75rem", color: "#4B5563" }}>SKU: {activeDetail.sku} (Qty: {activeDetail.requestedQuantity})</div>
                </div>
                <div>
                  <div style={{ color: "#6B7280", fontSize: "0.75rem" }}>REFUND & PAYOUT DEDUCTION</div>
                  <div style={{ fontWeight: 800, color: "#DC2626", fontSize: "1rem" }}>{activeDetail.formattedRefundAmount}</div>
                  <div style={{ fontSize: "0.75rem", color: "#4B5563" }}>Net Settlement Deduction: <strong>{activeDetail.formattedPayoutImpact}</strong></div>
                </div>
              </div>

              <div style={{ backgroundColor: "#F3F4F6", padding: "10px", borderRadius: "4px", marginBottom: "1rem" }}>
                <div style={{ fontWeight: 700 }}>Reason: {activeDetail.reason}</div>
                {activeDetail.description && <div style={{ fontSize: "0.8125rem", color: "#4B5563", marginTop: "4px" }}>"{activeDetail.description}"</div>}
              </div>

              {activeDetail.evidenceUrls.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>CUSTOMER EVIDENCE PHOTOS</div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {activeDetail.evidenceUrls.map((url, idx) => (
                      <img key={idx} src={url} alt="Evidence" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px", border: "1px solid #E5E7EB" }} />
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>QC / INSPECTION NOTES</label>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Enter quality check notes..."
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.modalFooter} style={{ gap: "8px", flexWrap: "wrap" }}>
              {activeDetail.status === "REQUESTED" && (
                <>
                  <button type="button" className={styles.primaryBtn} onClick={() => handleDecisionAction("APPROVE")}>
                    ✓ Approve Return
                  </button>
                  <button type="button" className={styles.secondaryBtn} onClick={() => handleDecisionAction("REJECT")}>
                    ✕ Reject Return
                  </button>
                </>
              )}

              {(activeDetail.status === "APPROVED" || activeDetail.status === "QC_PENDING" || activeDetail.status === "REQUESTED") && (
                <>
                  <button type="button" className={styles.primaryBtn} style={{ backgroundColor: "#059669" }} onClick={() => handleDecisionAction("QC_PASS", true)}>
                    <CheckIcon size={16} /> QC Pass & Restock Stock
                  </button>
                  <button type="button" className={styles.secondaryBtn} style={{ color: "#DC2626", borderColor: "#FCA5A5" }} onClick={() => handleDecisionAction("QC_FAIL", false)}>
                    ⚠️ QC Fail (Damaged - No Restock)
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
