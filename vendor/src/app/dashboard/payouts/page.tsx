"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useVendor } from "@/context/VendorContext";
import styles from "../dashboard.module.css";
import {
  PayoutsIcon,
  CheckIcon,
  RefreshIcon,
  InfoIcon
} from "@/components/Icons";

interface SettlementSummaryDTO {
  vendorId: string;
  storeName: string;
  bankAccountNumberMasked: string | null;
  bankIfsc: string | null;
  grossSalesMinor: number;
  formattedGrossSales: string;
  totalCommissionMinor: number;
  formattedTotalCommission: string;
  totalTaxWithholdingMinor: number;
  formattedTotalTaxWithholding: string;
  totalRefundsAdjustmentsMinor: number;
  formattedTotalRefundsAdjustments: string;
  unclearedBalanceMinor: number;
  formattedUnclearedBalance: string;
  settledBalanceMinor: number;
  formattedSettledBalance: string;
  payoutHistory: Array<{
    payoutId: string;
    grossAmountMinor: number;
    formattedGrossAmount: string;
    netPayoutMinor: number;
    formattedNetPayout: string;
    status: string;
    bankAccountNumberMasked: string | null;
    createdAt: string;
  }>;
  ledgerEntries: Array<{
    id: string;
    sourceType: string;
    sourceId: string;
    grossAmountMinor: number;
    formattedGrossAmount: string;
    netAmountMinor: number;
    formattedNetAmount: string;
    direction: string;
    description: string | null;
    createdAt: string;
  }>;
}

interface StatementDTO {
  statementId: string;
  periodStart: string;
  periodEnd: string;
  vendorStoreName: string;
  bankAccountNumberMasked: string | null;
  bankIfsc: string | null;
  grossSalesMinor: number;
  formattedGrossSales: string;
  commissionMinor: number;
  formattedCommission: string;
  taxWithholdingMinor: number;
  formattedTaxWithholding: string;
  adjustmentsMinor: number;
  formattedAdjustments: string;
  netPayoutMinor: number;
  formattedNetPayout: string;
  status: string;
  ledgerEntries: Array<{
    sourceType: string;
    sourceId: string;
    grossAmountMinor: number;
    netAmountMinor: number;
    direction: string;
    createdAt: string;
  }>;
}

export default function PayoutsPage() {
  const { profile, payouts, requestPayout } = useVendor();

  const [settlements, setSettlements] = useState<SettlementSummaryDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [activeStatement, setActiveStatement] = useState<StatementDTO | null>(null);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState<boolean>(false);

  const fetchSettlements = useCallback(async () => {
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
      const res = await fetch(`${BASE_URL}/api/v1/vendors/settlements`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to load vendor settlement summary");
      let data = await res.json();
      if (data && typeof data === "object" && "data" in data) data = data.data;

      setSettlements(data);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch settlements");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettlements();
  }, [fetchSettlements]);

  const handleTriggerPayout = async () => {
    const isDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO_FIXTURES === "true";
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    if (isDemo || !token) {
      requestPayout();
      return;
    }

    if (!confirm("Are you sure you want to trigger immediate payout execution for your uncleared balance?")) {
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/v1/vendors/settlements/payout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Payout execution failed");
      }

      setSuccessMsg("Payout successfully executed and dispatched to your bank.");
      fetchSettlements();
    } catch (err: any) {
      setError(err?.message || "Payout trigger error");
    }
  };

  const handleViewStatement = async (payoutId: string) => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    try {
      const res = await fetch(`${BASE_URL}/api/v1/vendors/settlements/${payoutId}/statement`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to load payout statement");
      let data = await res.json();
      if (data && typeof data === "object" && "data" in data) data = data.data;

      setActiveStatement(data);
      setIsStatementModalOpen(true);
    } catch (err: any) {
      setError(err?.message || "Statement view error");
    }
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2
    }).format(val);
  };

  const formatDate = (isoStr: string) => {
    return new Date(isoStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const unclearedFormatted = settlements ? settlements.formattedUnclearedBalance : formatINR(payouts.filter(p => p.status === "processing").reduce((sum, p) => sum + p.netSettlement, 0));
  const settledFormatted = settlements ? settlements.formattedSettledBalance : formatINR(payouts.filter(p => p.status === "settled").reduce((sum, p) => sum + p.netSettlement, 0));
  const bankMasked = settlements ? settlements.bankAccountNumberMasked : (profile?.bank ? `•••• •••• ${profile.bank.accountNumber.slice(-4)}` : null);
  const bankIfsc = settlements ? settlements.bankIfsc : (profile?.bank ? profile.bank.ifsc : null);

  return (
    <div className="animate-fade-in">
      {error && (
        <div style={{ backgroundColor: "#FEF2F2", borderLeft: "4px solid #EF4444", color: "#991B1B", padding: "1rem", borderRadius: "4px", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
          <strong>Settlement Error:</strong> {error}
        </div>
      )}

      {successMsg && (
        <div style={{ backgroundColor: "#ECFDF5", borderLeft: "4px solid #10B981", color: "#065F46", padding: "1rem", borderRadius: "4px", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
          ✓ {successMsg}
        </div>
      )}

      {/* Overview Cards & Bank Destination Panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
        {/* Balances Block */}
        <div className={styles.dashboardBlock} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div className={styles.blockTitle}>
              <span>Settlement Accounts Balance</span>
              <PayoutsIcon size={18} style={{ color: "var(--primary-green)" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1rem" }}>
              {/* Processing Balance Card */}
              <div style={{ padding: "1.5rem 1rem", backgroundColor: "var(--bg-color)", borderRadius: "var(--radius-md)" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem", fontWeight: 700 }}>
                  UNCLEARED BALANCE
                </span>
                <span style={{ fontSize: "1.6rem", fontWeight: 850, color: "#d97706", display: "block" }}>
                  {unclearedFormatted}
                </span>
                <span style={{ fontSize: "0.7rem", color: "var(--text-light)", display: "block", marginTop: "0.5rem" }}>
                  Available for immediate payout settlement.
                </span>
              </div>

              {/* Settled Balance Card */}
              <div style={{ padding: "1.5rem 1rem", backgroundColor: "var(--accent-green-light)", borderRadius: "var(--radius-md)", border: "1px solid var(--accent-green-border)" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--primary-green)", display: "block", marginBottom: "0.25rem", fontWeight: 700 }}>
                  TOTAL SETTLED FUNDS
                </span>
                <span style={{ fontSize: "1.6rem", fontWeight: 850, color: "var(--primary-dark-green)", display: "block" }}>
                  {settledFormatted}
                </span>
                <span style={{ fontSize: "0.7rem", color: "var(--primary-green)", display: "block", marginTop: "0.5rem", fontWeight: 600 }}>
                  Dispatched to bank successfully.
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem", borderTop: "1px solid var(--border-color)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
              Weekly cycles run every Thursday. Server-authoritative payout execution enabled.
            </span>
            <button onClick={handleTriggerPayout} className={styles.primaryBtn}>
              <RefreshIcon size={14} />
              <span>Instant Payout Request</span>
            </button>
          </div>
        </div>

        {/* Bank Account Details Card */}
        <div className={styles.dashboardBlock} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--text-primary)" }}>
              Settlement Bank Info
            </h3>

            {bankMasked ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>STORE LEGAL NAME</span>
                  <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{settlements?.storeName || profile?.storeName || "Artisan Store"}</span>
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>MASKED ACCOUNT NUMBER</span>
                  <span style={{ fontWeight: 800, color: "var(--primary-dark-green)", fontFamily: "var(--font-mono)" }}>
                    {bankMasked}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>NEFT / IFSC CODE</span>
                  <span style={{ fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{bankIfsc || "HDFC0000123"}</span>
                </div>
              </div>
            ) : (
              <div style={{ color: "var(--text-secondary)", fontSize: "0.8125rem", padding: "1rem 0" }}>
                No bank account linked. Setup details in Onboarding tab to enable payouts.
              </div>
            )}
          </div>

          <a href="/dashboard/onboarding" className={styles.secondaryBtn} style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}>
            Modify Bank Information
          </a>
        </div>
      </div>

      {/* Financial Summary Breakdowns */}
      {settlements && (
        <div className={styles.dashboardBlock} style={{ marginBottom: "2rem" }}>
          <div className={styles.blockTitle}>
            <span>Authoritative Financial Summary</span>
            <span className="badge badge-success">Platform Fee: 8% Commission + 18% GST (9.44% Net Fee)</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginTop: "1rem" }}>
            <div style={{ padding: "1rem", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
              <span style={{ fontSize: "0.75rem", color: "#6B7280", display: "block" }}>GROSS SALES</span>
              <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#111827" }}>{settlements.formattedGrossSales}</span>
            </div>
            <div style={{ padding: "1rem", backgroundColor: "#FEF2F2", borderRadius: "6px" }}>
              <span style={{ fontSize: "0.75rem", color: "#991B1B", display: "block" }}>COMMISSIONS (8%)</span>
              <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#DC2626" }}>-{settlements.formattedTotalCommission}</span>
            </div>
            <div style={{ padding: "1rem", backgroundColor: "#FEF2F2", borderRadius: "6px" }}>
              <span style={{ fontSize: "0.75rem", color: "#991B1B", display: "block" }}>GST ON COMMISSION (18%)</span>
              <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#DC2626" }}>-{settlements.formattedTotalTaxWithholding}</span>
            </div>
            <div style={{ padding: "1rem", backgroundColor: "#FFFBEB", borderRadius: "6px" }}>
              <span style={{ fontSize: "0.75rem", color: "#92400E", display: "block" }}>REFUNDS & DEDUCTIONS</span>
              <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#D97706" }}>-{settlements.formattedTotalRefundsAdjustments}</span>
            </div>
          </div>
        </div>
      )}

      {/* Payout History & Statements */}
      <div className={styles.dashboardBlock} style={{ marginBottom: "2rem" }}>
        <div className={styles.blockTitle}>
          <span>Payout History & Statements</span>
        </div>

        {settlements && settlements.payoutHistory.length > 0 ? (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Payout ID</th>
                  <th>Date</th>
                  <th>Gross Amount</th>
                  <th>Net Dispatched Payout</th>
                  <th>Status</th>
                  <th>Bank Account</th>
                  <th>Statement</th>
                </tr>
              </thead>
              <tbody>
                {settlements.payoutHistory.map((p) => (
                  <tr key={p.payoutId}>
                    <td style={{ fontFamily: "monospace", fontWeight: 700 }}>{p.payoutId}</td>
                    <td style={{ fontSize: "0.8125rem", color: "#4B5563" }}>{formatDate(p.createdAt)}</td>
                    <td>{p.formattedGrossAmount}</td>
                    <td style={{ fontWeight: 800, color: "#059669" }}>{p.formattedNetPayout}</td>
                    <td>
                      <span className={`badge ${p.status === "PAID" ? "badge-success" : "badge-warning"}`}>{p.status}</span>
                    </td>
                    <td style={{ fontFamily: "monospace" }}>{p.bankAccountNumberMasked}</td>
                    <td>
                      <button type="button" className={styles.secondaryBtn} onClick={() => handleViewStatement(p.payoutId)} style={{ fontSize: "0.75rem", padding: "4px 8px" }}>
                        📄 View Statement
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: "2rem", textAlign: "center", color: "#6B7280" }}>
            No payouts executed yet. Trigger instant payout request to generate settlement statements.
          </div>
        )}
      </div>

      {/* Statement Export Modal */}
      {isStatementModalOpen && activeStatement && (
        <div className={styles.modalOverlay} onClick={() => setIsStatementModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Official Settlement Statement — {activeStatement.statementId}</h3>
              <button className={styles.closeBtn} onClick={() => setIsStatementModalOpen(false)}>✕</button>
            </div>

            <div className={styles.modalBody} style={{ fontSize: "0.875rem" }}>
              <div style={{ borderBottom: "1px solid #E5E7EB", paddingBottom: "8px", marginBottom: "12px" }}>
                <div style={{ fontWeight: 800, fontSize: "1rem" }}>{activeStatement.vendorStoreName}</div>
                <div style={{ color: "#4B5563" }}>Period: {formatDate(activeStatement.periodStart)} — {formatDate(activeStatement.periodEnd)}</div>
                <div style={{ color: "#4B5563" }}>Bank Destination: <strong>{activeStatement.bankAccountNumberMasked}</strong> ({activeStatement.bankIfsc})</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "1rem" }}>
                <div>
                  <div style={{ color: "#6B7280", fontSize: "0.75rem" }}>GROSS SALES</div>
                  <div style={{ fontWeight: 700 }}>{activeStatement.formattedGrossSales}</div>
                </div>
                <div>
                  <div style={{ color: "#6B7280", fontSize: "0.75rem" }}>NET DISPATCHED PAYOUT</div>
                  <div style={{ fontWeight: 800, color: "#059669", fontSize: "1.1rem" }}>{activeStatement.formattedNetPayout}</div>
                </div>
                <div>
                  <div style={{ color: "#6B7280", fontSize: "0.75rem" }}>COMMISSION (8%)</div>
                  <div style={{ color: "#DC2626" }}>-{activeStatement.formattedCommission}</div>
                </div>
                <div>
                  <div style={{ color: "#6B7280", fontSize: "0.75rem" }}>GST ON COMMISSION (18%)</div>
                  <div style={{ color: "#DC2626" }}>-{activeStatement.formattedTaxWithholding}</div>
                </div>
              </div>

              <div style={{ fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>STATEMENT LEDGER ITEMS ({activeStatement.ledgerEntries.length})</div>
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F3F4F6", textTransform: "uppercase", fontSize: "0.75rem" }}>
                    <th style={{ padding: "6px", textAlign: "left" }}>Source</th>
                    <th style={{ padding: "6px", textAlign: "left" }}>ID</th>
                    <th style={{ padding: "6px", textAlign: "right" }}>Gross</th>
                    <th style={{ padding: "6px", textAlign: "right" }}>Net Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {activeStatement.ledgerEntries.map((l, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #F3F4F6" }}>
                      <td style={{ padding: "6px" }}>{l.sourceType}</td>
                      <td style={{ padding: "6px", fontFamily: "monospace" }}>{l.sourceId}</td>
                      <td style={{ padding: "6px", textAlign: "right" }}>{formatINR(l.grossAmountMinor / 100)}</td>
                      <td style={{ padding: "6px", textAlign: "right", fontWeight: 700, color: l.direction === "DEBIT" ? "#DC2626" : "#059669" }}>
                        {l.direction === "DEBIT" ? "-" : ""}{formatINR(l.netAmountMinor / 100)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.modalFooter}>
              <button type="button" className={styles.secondaryBtn} onClick={() => window.print()}>🖨️ Print Statement</button>
              <button type="button" className={styles.primaryBtn} onClick={() => setIsStatementModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
