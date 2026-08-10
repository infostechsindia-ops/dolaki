"use client";

import React, { useEffect, useState, useCallback } from "react";
import styles from "../dashboard.module.css";
import { CheckIcon } from "@/components/Icons";

interface DocumentMeta {
  documentType: string;
  fileName: string;
  uploadedAt: string;
  accessUrl: string;
}

interface OnboardingStateDTO {
  vendorId: string;
  storeName: string;
  storeDescription: string | null;
  gstNumber: string | null;
  isVerified: boolean;
  onboardingStatus: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "RESUBMITTED";
  businessLegalName: string | null;
  panNumber: string | null;
  bankAccountName: string | null;
  bankAccountNumberMasked: string | null;
  bankIfsc: string | null;
  agreementsAccepted: boolean;
  agreementsAcceptedAt: string | null;
  rejectionReason: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  documents: DocumentMeta[];
}

export default function VendorOnboardingPage() {
  const [onboarding, setOnboarding] = useState<OnboardingStateDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [storeName, setStoreName] = useState<string>("");
  const [storeDescription, setStoreDescription] = useState<string>("");
  const [legalName, setLegalName] = useState<string>("");
  const [gstin, setGstin] = useState<string>("");
  const [pan, setPan] = useState<string>("");
  const [bankAccountName, setBankAccountName] = useState<string>("");
  const [bankAccountNumber, setBankAccountNumber] = useState<string>("");
  const [bankIfsc, setBankIfsc] = useState<string>("");
  const [agreementsAccepted, setAgreementsAccepted] = useState<boolean>(false);

  // Document upload state
  const [docType, setDocType] = useState<string>("GST_CERTIFICATE");
  const [docFile, setDocFile] = useState<string>("");

  const fetchOnboardingState = useCallback(async () => {
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
      const res = await fetch(`${BASE_URL}/api/v1/vendors/onboarding`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to load onboarding state");
      let data = await res.json();
      if (data && typeof data === "object" && "data" in data) data = data.data;

      setOnboarding(data);
      setStoreName(data.storeName || "");
      setStoreDescription(data.storeDescription || "");
      setLegalName(data.businessLegalName || "");
      setGstin(data.gstNumber || "");
      setPan(data.panNumber || "");
      setBankAccountName(data.bankAccountName || "");
      setBankAccountNumber(data.bankAccountNumberMasked || "");
      setBankIfsc(data.bankIfsc || "");
      setAgreementsAccepted(data.agreementsAccepted || false);
    } catch (err: any) {
      setError(err?.message || "Unable to fetch onboarding status");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOnboardingState();
  }, [fetchOnboardingState]);

  const handleSaveDraft = async () => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    setSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/vendors/onboarding/draft`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          storeName,
          storeDescription,
          businessLegalName: legalName,
          gstNumber: gstin,
          panNumber: pan,
          bankAccountName,
          bankAccountNumber: bankAccountNumber.includes("X") ? undefined : bankAccountNumber,
          bankIfsc,
          agreementsAccepted
        })
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Failed to save draft");
      }
      let updated = await res.json();
      if (updated && typeof updated === "object" && "data" in updated) updated = updated.data;

      setOnboarding(updated);
      setSuccessMsg("Onboarding draft saved successfully!");
    } catch (err: any) {
      setError(err?.message || "Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitOnboarding = async () => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);
    try {
      // Save latest fields first
      await handleSaveDraft();

      const res = await fetch(`${BASE_URL}/api/v1/vendors/onboarding/submit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Submission failed");
      }
      let submitted = await res.json();
      if (submitted && typeof submitted === "object" && "data" in submitted) submitted = submitted.data;

      setOnboarding(submitted);
      setSuccessMsg("Vendor onboarding application submitted for review!");
    } catch (err: any) {
      setError(err?.message || "Failed to submit onboarding application");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddDocument = async () => {
    if (!docFile) {
      setError("Please input a valid document filename/storage key.");
      return;
    }
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    try {
      const res = await fetch(`${BASE_URL}/api/v1/vendors/onboarding/documents`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          documentType: docType,
          storageKey: `docs/${Date.now()}_${docFile}`,
          fileName: docFile,
          mimeType: "application/pdf"
        })
      });
      if (!res.ok) throw new Error("Document upload metadata registration failed");
      let updated = await res.json();
      if (updated && typeof updated === "object" && "data" in updated) updated = updated.data;

      setOnboarding(updated);
      setDocFile("");
      setSuccessMsg("Document metadata attached securely.");
    } catch (err: any) {
      setError(err?.message || "Failed to attach document");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>
        <p style={{ fontWeight: 700 }}>Loading Vendor Onboarding & Verification Status...</p>
      </div>
    );
  }

  const currentStatus = onboarding?.onboardingStatus || "DRAFT";
  const isReadOnly = currentStatus === "SUBMITTED" || currentStatus === "UNDER_REVIEW" || currentStatus === "APPROVED";

  return (
    <div className="animate-fade-in" style={{ maxWidth: "840px" }}>
      {/* Header & Status Badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)" }}>Vendor Onboarding & KYC</h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Complete your legal, GST, PAN, bank details and agreements for marketplace selling.</p>
        </div>

        <div style={{ padding: "6px 14px", borderRadius: "20px", fontWeight: 800, fontSize: "0.75rem", backgroundColor: currentStatus === "APPROVED" ? "#D1FAE5" : currentStatus === "REJECTED" ? "#FEE2E2" : "#FEF3C7", color: currentStatus === "APPROVED" ? "#065F46" : currentStatus === "REJECTED" ? "#991B1B" : "#92400E" }}>
          STATUS: {currentStatus}
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div style={{ backgroundColor: "#D1FAE5", borderLeft: "4px solid #10B981", color: "#065F46", padding: "1rem", marginBottom: "1.5rem", borderRadius: "4px", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "8px" }}>
          <CheckIcon size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: "#FEF2F2", borderLeft: "4px solid #EF4444", color: "#991B1B", padding: "1rem", marginBottom: "1.5rem", borderRadius: "4px", fontSize: "0.875rem" }}>
          <strong>Onboarding Error:</strong> {error}
        </div>
      )}

      {currentStatus === "REJECTED" && (
        <div style={{ backgroundColor: "#FEF2F2", borderLeft: "4px solid #DC2626", color: "#991B1B", padding: "1rem", marginBottom: "1.5rem", borderRadius: "4px", fontSize: "0.875rem" }}>
          <strong style={{ fontSize: "0.9375rem", display: "block", marginBottom: "4px" }}>Onboarding Rejection Notice</strong>
          <span>Reason provided by verification team: </span>
          <span style={{ fontWeight: 700 }}>{onboarding?.rejectionReason || "Incomplete documentation"}</span>
          <p style={{ marginTop: "6px", fontSize: "0.8125rem", color: "#7F1D1D" }}>Please update your details below and submit your resubmission.</p>
        </div>
      )}

      {/* Form Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Section 1: Business Profile */}
        <div className={styles.dashboardBlock}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
            1. Business Identity & Profile
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Store Name *</label>
              <input type="text" className={styles.searchInput} value={storeName} onChange={(e) => setStoreName(e.target.value)} disabled={isReadOnly} />
            </div>
            <div>
              <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Legal Business Entity Name *</label>
              <input type="text" className={styles.searchInput} value={legalName} onChange={(e) => setLegalName(e.target.value)} disabled={isReadOnly} />
            </div>
          </div>
        </div>

        {/* Section 2: KYC & Tax Information */}
        <div className={styles.dashboardBlock}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
            2. Tax & Registration (GSTIN / PAN)
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>GSTIN *</label>
              <input type="text" className={styles.searchInput} value={gstin} onChange={(e) => setGstin(e.target.value)} style={{ textTransform: "uppercase" }} disabled={isReadOnly} />
            </div>
            <div>
              <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Permanent Account Number (PAN) *</label>
              <input type="text" className={styles.searchInput} value={pan} onChange={(e) => setPan(e.target.value)} style={{ textTransform: "uppercase" }} maxLength={10} disabled={isReadOnly} />
            </div>
          </div>
        </div>

        {/* Section 3: Bank Account for Payout Settlement */}
        <div className={styles.dashboardBlock}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
            3. Payout Settlement Bank Account
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Account Holder Name *</label>
              <input type="text" className={styles.searchInput} value={bankAccountName} onChange={(e) => setBankAccountName(e.target.value)} disabled={isReadOnly} />
            </div>
            <div>
              <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Account Number *</label>
              <input type="text" className={styles.searchInput} value={bankAccountNumber} onChange={(e) => setBankAccountNumber(e.target.value)} disabled={isReadOnly} />
            </div>
            <div>
              <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Bank IFSC *</label>
              <input type="text" className={styles.searchInput} value={bankIfsc} onChange={(e) => setBankIfsc(e.target.value)} style={{ textTransform: "uppercase" }} disabled={isReadOnly} />
            </div>
          </div>
        </div>

        {/* Section 4: Secure Document Uploads */}
        <div className={styles.dashboardBlock}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
            4. Secure KYC Document Verification
          </h3>
          
          {onboarding?.documents && onboarding.documents.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#374151" }}>Attached Verification Documents:</span>
              <ul style={{ listStyle: "none", padding: 0, marginTop: "6px" }}>
                {onboarding.documents.map((doc, idx) => (
                  <li key={idx} style={{ padding: "8px 12px", backgroundColor: "#F3F4F6", borderRadius: "6px", marginBottom: "6px", display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                    <span>📄 <strong>{doc.documentType}</strong> ({doc.fileName})</span>
                    <a href={doc.accessUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#6366F1", fontWeight: 700 }}>View Secure Doc</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!isReadOnly && (
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "10px" }}>
              <select className={styles.searchInput} value={docType} onChange={(e) => setDocType(e.target.value)} style={{ width: "200px" }}>
                <option value="GST_CERTIFICATE">GST Certificate</option>
                <option value="PAN_CARD">PAN Card Copy</option>
                <option value="CANCELLED_CHEQUE">Cancelled Cheque</option>
              </select>
              <input type="text" className={styles.searchInput} placeholder="Document Filename (e.g. gst_cert.pdf)" value={docFile} onChange={(e) => setDocFile(e.target.value)} style={{ flex: 1 }} />
              <button type="button" className={styles.secondaryBtn} onClick={handleAddDocument}>Attach Document</button>
            </div>
          )}
        </div>

        {/* Section 5: Agreements */}
        <div className={styles.dashboardBlock}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
            5. Marketplace Vendor Agreement
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
            <input type="checkbox" id="termsCheck" checked={agreementsAccepted} onChange={(e) => setAgreementsAccepted(e.target.checked)} disabled={isReadOnly} />
            <label htmlFor="termsCheck" style={{ fontSize: "0.875rem", color: "#1F2937" }}>
              I agree to the AuraMart Marketplace Vendor Agreement, Commission Fees (8.00%), and Fulfillment SLAs.
            </label>
          </div>
        </div>

        {/* Actions */}
        {!isReadOnly && (
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "1rem" }}>
            <button type="button" className={styles.secondaryBtn} onClick={handleSaveDraft} disabled={saving}>
              {saving ? "Saving Draft..." : "Save Draft"}
            </button>
            <button type="button" className={styles.primaryBtn} onClick={handleSubmitOnboarding} disabled={submitting}>
              {submitting ? "Submitting..." : currentStatus === "REJECTED" ? "Resubmit Application" : "Submit Onboarding Application"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
