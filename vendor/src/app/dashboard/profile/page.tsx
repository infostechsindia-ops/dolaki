"use client";

import React, { useState } from "react";
import { useVendor, VendorProfile } from "@/context/VendorContext";
import styles from "../dashboard.module.css";
import {
  ProfileIcon,
  CheckIcon
} from "@/components/Icons";

export default function ProfilePage() {
  const { profile, register } = useVendor();

  // Basic info state
  const [storeName, setStoreName] = useState(profile?.storeName || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [phone, setPhone] = useState(profile?.phone || "");

  // Business info state
  const [legalName, setLegalName] = useState(profile?.business?.legalName || "");
  const [gstin, setGstin] = useState(profile?.business?.gstin || "");
  const [pan, setPan] = useState(profile?.business?.pan || "");
  const [address, setAddress] = useState(profile?.business?.address || "");
  const [city, setCity] = useState(profile?.business?.city || "");
  const [state, setState] = useState(profile?.business?.state || "");
  const [pincode, setPincode] = useState(profile?.business?.pincode || "");

  // Bank info state
  const [bankName, setBankName] = useState(profile?.bank?.bankName || "");
  const [accountHolder, setAccountHolder] = useState(profile?.bank?.accountHolder || "");
  const [accountNumber, setAccountNumber] = useState(profile?.bank?.accountNumber || "");
  const [ifsc, setIfsc] = useState(profile?.bank?.ifsc || "");

  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");

  const validateGstin = (val: string) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val);
  const validatePan = (val: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val);
  const validateIfsc = (val: string) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(val);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(false);
    setError("");

    const cleanedGstin = gstin.trim().toUpperCase();
    const cleanedPan = pan.trim().toUpperCase();
    const cleanedIfsc = ifsc.trim().toUpperCase();

    if (!storeName || !email || !phone) {
      setError("Please fill in contact display details.");
      return;
    }

    if (!cleanedGstin || !validateGstin(cleanedGstin)) {
      setError("Invalid GSTIN registration format (e.g. 27AAAAA1111A1Z1).");
      return;
    }

    if (!cleanedPan || !validatePan(cleanedPan)) {
      setError("Invalid PAN Card format (e.g. ABCDE1234F).");
      return;
    }

    if (!cleanedIfsc || !validateIfsc(cleanedIfsc)) {
      setError("Invalid Bank IFSC code (e.g. HDFC0000123).");
      return;
    }

    if (!accountNumber || accountNumber.length < 9) {
      setError("Please input a valid bank account number.");
      return;
    }

    const updatedProfile: VendorProfile = {
      email,
      storeName,
      phone,
      isRegistered: true,
      business: {
        legalName,
        gstin: cleanedGstin,
        pan: cleanedPan,
        address,
        city,
        state,
        pincode
      },
      bank: {
        bankName,
        accountHolder,
        accountNumber,
        ifsc: cleanedIfsc
      }
    };

    // Reuse register context action to update profile persistently
    register(updatedProfile);
    setIsSaved(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "800px" }}>
      {/* Alert Notices */}
      {isSaved && (
        <div className="badge badge-success" style={{
          width: "100%",
          padding: "1rem",
          borderRadius: "var(--radius-sm)",
          fontSize: "0.875rem",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "1.5rem"
        }}>
          <CheckIcon size={16} />
          <span>Vendor credentials and bank account profiles updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="badge badge-danger" style={{
          width: "100%",
          padding: "1rem",
          borderRadius: "var(--radius-sm)",
          fontSize: "0.875rem",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "1.5rem"
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleUpdateProfile}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Section 1: Store profile */}
          <div className={styles.dashboardBlock}>
            <div className={styles.blockTitle} style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem" }}>
              <span>Storefront Profile</span>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Store Name *</label>
                  <input
                    type="text"
                    className={styles.searchInput}
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Support Mobile *</label>
                  <input
                    type="text"
                    className={styles.searchInput}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Primary Business Email *</label>
                <input
                  type="email"
                  className={styles.searchInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Business details */}
          <div className={styles.dashboardBlock}>
            <div className={styles.blockTitle} style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem" }}>
              <span>GSTIN & Tax Information</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Legal Business Name *</label>
                  <input
                    type="text"
                    className={styles.searchInput}
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>GSTIN *</label>
                  <input
                    type="text"
                    className={styles.searchInput}
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    style={{ textTransform: "uppercase" }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Permanent Account Number (PAN) *</label>
                  <input
                    type="text"
                    className={styles.searchInput}
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                    style={{ textTransform: "uppercase" }}
                    maxLength={10}
                    required
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Business Pincode *</label>
                  <input
                    type="text"
                    className={styles.searchInput}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Corporate Registered Office Address *</label>
                <textarea
                  className={styles.searchInput}
                  style={{ minHeight: "80px", resize: "vertical" }}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>City *</label>
                  <input
                    type="text"
                    className={styles.searchInput}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>State *</label>
                  <input
                    type="text"
                    className={styles.searchInput}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Bank Account details */}
          <div className={styles.dashboardBlock}>
            <div className={styles.blockTitle} style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem" }}>
              <span>Payout Settlement Bank Account</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Settlement Bank Name *</label>
                  <input
                    type="text"
                    className={styles.searchInput}
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>IFSC Code *</label>
                  <input
                    type="text"
                    className={styles.searchInput}
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    style={{ textTransform: "uppercase" }}
                    maxLength={11}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Account Beneficiary Holder *</label>
                  <input
                    type="text"
                    className={styles.searchInput}
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Beneficiary Account Number *</label>
                  <input
                    type="text"
                    className={styles.searchInput}
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button type="submit" className={styles.primaryBtn} style={{ padding: "0.75rem 2rem" }}>
              Save Profile Updates
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
