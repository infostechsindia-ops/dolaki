"use client";

import React from "react";
import { useVendor } from "@/context/VendorContext";
import styles from "../dashboard.module.css";
import {
  PayoutsIcon,
  CheckIcon,
  RefreshIcon,
  InfoIcon
} from "@/components/Icons";

export default function PayoutsPage() {
  const { profile, payouts, requestPayout } = useVendor();

  // Computations
  const settledPayouts = payouts.filter(p => p.status === "settled");
  const processingPayouts = payouts.filter(p => p.status === "processing");

  const totalSettledVal = settledPayouts.reduce((sum, p) => sum + p.netSettlement, 0);
  const totalProcessingVal = processingPayouts.reduce((sum, p) => sum + p.netSettlement, 0);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2
    }).format(val);
  };

  const handleRequestPayout = () => {
    if (processingPayouts.length === 0) {
      alert("No pending payouts available for instant settlement. Newly completed orders will appear here for payout.");
      return;
    }
    
    if (confirm(`Do you want to request immediate payout of ${formatINR(totalProcessingVal)} to your registered HDFC bank account?`)) {
      requestPayout();
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Overview Cards & Bank Destination Panel */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.5fr 1fr",
        gap: "1.5rem",
        marginBottom: "2rem"
      }}>
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
                  {formatINR(totalProcessingVal)}
                </span>
                <span style={{ fontSize: "0.7rem", color: "var(--text-light)", display: "block", marginTop: "0.5rem" }}>
                  {processingPayouts.length} orders pending clearance cycle.
                </span>
              </div>

              {/* Settled Balance Card */}
              <div style={{ padding: "1.5rem 1rem", backgroundColor: "var(--accent-green-light)", borderRadius: "var(--radius-md)", border: "1px solid var(--accent-green-border)" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--primary-green)", display: "block", marginBottom: "0.25rem", fontWeight: 700 }}>
                  TOTAL SETTLED FUNDS
                </span>
                <span style={{ fontSize: "1.6rem", fontWeight: 850, color: "var(--primary-dark-green)", display: "block" }}>
                  {formatINR(totalSettledVal)}
                </span>
                <span style={{ fontSize: "0.7rem", color: "var(--primary-green)", display: "block", marginTop: "0.5rem", fontWeight: 600 }}>
                  Dispatched to bank successfully.
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem", borderTop: "1px solid var(--border-color)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
              Weekly cycles run every Thursday. Instant settlement is enabled.
            </span>
            <button
              onClick={handleRequestPayout}
              className={styles.primaryBtn}
              disabled={processingPayouts.length === 0}
              style={{
                backgroundColor: processingPayouts.length === 0 ? "var(--text-light)" : "var(--primary-green)"
              }}
            >
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
            
            {profile?.bank ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>BANK NAME</span>
                  <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{profile.bank.bankName}</span>
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>ACCOUNT HOLDER NAME</span>
                  <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{profile.bank.accountHolder}</span>
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>ACCOUNT NUMBER</span>
                  <span style={{ fontWeight: 800, color: "var(--primary-dark-green)", fontFamily: "var(--font-mono)" }}>
                    •••• •••• {profile.bank.accountNumber.slice(-4)}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>NEFT / IFSC CODE</span>
                  <span style={{ fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{profile.bank.ifsc}</span>
                </div>
              </div>
            ) : (
              <div style={{ color: "var(--text-secondary)", fontSize: "0.8125rem", padding: "1rem 0" }}>
                No bank account linked. Setup details in the Profile tab to enable payouts.
              </div>
            )}
          </div>

          <a
            href="/dashboard/profile"
            className={styles.secondaryBtn}
            style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}
          >
            Modify Bank Information
          </a>
        </div>
      </div>

      {/* Transactions Ledger Ledger */}
      <div className={styles.dashboardBlock}>
        <div className={styles.blockTitle}>
          <span>Settlements & Commissions Ledger</span>
          <span className="badge badge-success">Commission: 8% + 18% GST</span>
        </div>

        {payouts.length === 0 ? (
          <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "var(--text-secondary)" }}>
            <PayoutsIcon size={40} style={{ color: "var(--text-light)", marginBottom: "0.75rem" }} />
            <p style={{ fontWeight: 600 }}>No transaction ledgers generated yet.</p>
            <p style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>Complete customer orders to trigger payout calculations.</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Payout ID</th>
                  <th>Date</th>
                  <th>Order ID</th>
                  <th>Gross sales (A)</th>
                  <th>AuraMart Fee (B)</th>
                  <th>Fee GST (18%) (C)</th>
                  <th style={{ color: "var(--primary-dark-green)" }}>Net Credit (A - B - C)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((txn) => {
                  return (
                    <tr key={txn.id}>
                      <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", fontWeight: 700 }}>
                        {txn.id}
                      </td>
                      <td style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                        {new Date(txn.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {txn.orderId}
                      </td>
                      <td>
                        {formatINR(txn.grossAmount)}
                      </td>
                      <td style={{ color: "#ef4444" }}>
                        -{formatINR(txn.fees)} <span style={{ fontSize: "0.7rem", color: "var(--text-light)" }}>(8%)</span>
                      </td>
                      <td style={{ color: "#ef4444" }}>
                        -{formatINR(txn.gst)} <span style={{ fontSize: "0.7rem", color: "var(--text-light)" }}>(18%)</span>
                      </td>
                      <td style={{ fontWeight: 800, color: "var(--primary-dark-green)" }}>
                        {formatINR(txn.netSettlement)}
                      </td>
                      <td>
                        {txn.status === "settled" ? (
                          <span className="badge badge-success">
                            <CheckIcon size={10} />
                            SETTLED
                          </span>
                        ) : (
                          <span className="badge badge-warning">
                            PROCESSING
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
