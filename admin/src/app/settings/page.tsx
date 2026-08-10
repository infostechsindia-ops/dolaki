"use client";

import React, { useState } from "react";
import { Settings, Shield, CreditCard, Bell, Save, AlertTriangle, ToggleLeft, ToggleRight, Check } from "lucide-react";
import crudStyles from "../crud.module.css";

export default function SettingsPage() {
  // Config state variables
  const [storeName, setStoreName] = useState("AuraMart Retail Central");
  const [supportEmail, setSupportEmail] = useState("support@auramart.in");
  const [phone, setPhone] = useState("+91 1800 248 2901");
  
  const [minOrder, setMinOrder] = useState("99");
  const [maxDistance, setMaxDistance] = useState("6");
  
  const [razorpayKey, setRazorpayKey] = useState("");
  const [paytmMerchantId, setPaytmMerchantId] = useState("");
  
  // Toggles
  const [razorpayActive, setRazorpayActive] = useState(true);
  const [paytmActive, setPaytmActive] = useState(false);
  const [codActive, setCodActive] = useState(true);
  const [surgeActive, setSurgeActive] = useState(false);
  const [emergencyShutdown, setEmergencyShutdown] = useState(false);

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Page Header */}
      <div className={crudStyles.pageHeader}>
        <div className={crudStyles.pageTitleGroup}>
          <h2 className={crudStyles.title}>System Settings</h2>
          <p className={crudStyles.subtitle}>Configure operating variables, payment channels, and emergency parameters.</p>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div className={crudStyles.splitGrid}>
          {/* General Store configuration */}
          <div className={crudStyles.card}>
            <h3 className={crudStyles.cardTitle}>Store Operations Profile</h3>
            
            <div className={crudStyles.formGroup}>
              <label className={crudStyles.formLabel}>Registered Merchant Name</label>
              <input
                type="text"
                className={crudStyles.filterSelect}
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
              />
            </div>

            <div className={crudStyles.formRow}>
              <div className={crudStyles.formGroup}>
                <label className={crudStyles.formLabel}>Operations Email</label>
                <input
                  type="email"
                  className={crudStyles.filterSelect}
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  required
                />
              </div>

              <div className={crudStyles.formGroup}>
                <label className={crudStyles.formLabel}>Toll-Free Helpline</label>
                <input
                  type="text"
                  className={crudStyles.filterSelect}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={crudStyles.formRow}>
              <div className={crudStyles.formGroup}>
                <label className={crudStyles.formLabel}>Minimum Order Dispatch (₹)</label>
                <input
                  type="number"
                  className={crudStyles.filterSelect}
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  min="0"
                  required
                />
              </div>

              <div className={crudStyles.formGroup}>
                <label className={crudStyles.formLabel}>Maximum Rider Range (km)</label>
                <input
                  type="number"
                  className={crudStyles.filterSelect}
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Integrations */}
          <div className={crudStyles.card}>
            <h3 className={crudStyles.cardTitle}>Payment Processing Channels</h3>

            {/* Razorpay Option */}
            <div style={{ border: "1px solid var(--border)", padding: "1rem", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, color: "var(--text-main)" }}>Razorpay PG (Cards, NetBanking, UPI)</span>
                <button
                  type="button"
                  onClick={() => setRazorpayActive(!razorpayActive)}
                  aria-label={razorpayActive ? "Disable Razorpay" : "Enable Razorpay"}
                >
                  {razorpayActive ? (
                    <ToggleRight size={32} style={{ color: "var(--primary)" }} />
                  ) : (
                    <ToggleLeft size={32} style={{ color: "var(--text-light)" }} />
                  )}
                </button>
              </div>
              {razorpayActive && (
                <div className={crudStyles.formGroup}>
                  <label className={crudStyles.formLabel} style={{ fontSize: "0.75rem" }}>Razorpay Live Public Key API</label>
                  <input
                    type="text"
                    className={crudStyles.filterSelect}
                    value={razorpayKey}
                    onChange={(e) => setRazorpayKey(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Paytm Option */}
            <div style={{ border: "1px solid var(--border)", padding: "1rem", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, color: "var(--text-main)" }}>Paytm for Business (Wallet, Gateway)</span>
                <button
                  type="button"
                  onClick={() => setPaytmActive(!paytmActive)}
                  aria-label={paytmActive ? "Disable Paytm" : "Enable Paytm"}
                >
                  {paytmActive ? (
                    <ToggleRight size={32} style={{ color: "var(--primary)" }} />
                  ) : (
                    <ToggleLeft size={32} style={{ color: "var(--text-light)" }} />
                  )}
                </button>
              </div>
              {paytmActive && (
                <div className={crudStyles.formGroup}>
                  <label className={crudStyles.formLabel} style={{ fontSize: "0.75rem" }}>Paytm Merchant ID (MID)</label>
                  <input
                    type="text"
                    className={crudStyles.filterSelect}
                    value={paytmMerchantId}
                    onChange={(e) => setPaytmMerchantId(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Cash on Delivery option */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid var(--border)", padding: "1rem", borderRadius: "8px" }}>
              <span style={{ fontWeight: 700, color: "var(--text-main)" }}>Cash on Delivery (COD) Enabled</span>
              <button
                type="button"
                onClick={() => setCodActive(!codActive)}
                aria-label={codActive ? "Disable COD" : "Enable COD"}
              >
                {codActive ? (
                  <ToggleRight size={32} style={{ color: "var(--primary)" }} />
                ) : (
                  <ToggleLeft size={32} style={{ color: "var(--text-light)" }} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Safety & Dispatch variables */}
        <div className={crudStyles.splitGrid}>
          {/* Dispatch Surges */}
          <div className={crudStyles.card}>
            <h3 className={crudStyles.cardTitle}>Dynamic Pricing & Dispatch Policy</h3>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: 700, color: "var(--text-main)" }}>Peak Hour Surge Pricing</span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>
                  Auto-adjusts delivery fees based on weather or rider deficit.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSurgeActive(!surgeActive)}
                aria-label={surgeActive ? "Disable Surge" : "Enable Surge"}
              >
                {surgeActive ? (
                  <ToggleRight size={32} style={{ color: "var(--primary)" }} />
                ) : (
                  <ToggleLeft size={32} style={{ color: "var(--text-light)" }} />
                )}
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: 700, color: "var(--text-main)" }}>Auto-Assign Dispatch Protocol</span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>
                  Assign nearest free rider automatically without admin approval.
                </span>
              </div>
              <ToggleRight size={32} style={{ color: "var(--primary)" }} />
            </div>
          </div>

          {/* Emergency parameters */}
          <div className={crudStyles.card} style={{ borderColor: emergencyShutdown ? "var(--danger-border)" : "var(--border)" }}>
            <h3 className={crudStyles.cardTitle} style={{ color: emergencyShutdown ? "var(--danger)" : "var(--text-main)" }}>
              Emergency Operations Control
            </h3>
            
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", backgroundColor: "var(--danger-bg)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--danger-border)" }}>
              <AlertTriangle size={24} style={{ color: "var(--danger)", flexShrink: 0 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span style={{ fontWeight: 700, color: "#991b1b" }}>Emergency Store Shutdown</span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Warning: Enabling this parameter instantly pauses customer order placements, stops rider dispatch, and triggers maintenance warning flags on client apps.
                </span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
              <span style={{ fontWeight: 700, color: emergencyShutdown ? "var(--danger)" : "var(--text-main)" }}>
                Shutdown Store Front & Operations
              </span>
              <button
                type="button"
                onClick={() => setEmergencyShutdown(!emergencyShutdown)}
                aria-label={emergencyShutdown ? "Disable Emergency Shutdown" : "Enable Emergency Shutdown"}
              >
                {emergencyShutdown ? (
                  <ToggleRight size={32} style={{ color: "var(--danger)" }} />
                ) : (
                  <ToggleLeft size={32} style={{ color: "var(--text-light)" }} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer save banner */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
          {saved && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--success)", fontWeight: 600, fontSize: "0.95rem" }}>
              <Check size={18} /> Settings saved successfully!
            </div>
          )}
          <button type="submit" className={`${crudStyles.btn} ${crudStyles.btnPrimary}`}>
            <Save size={16} /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
