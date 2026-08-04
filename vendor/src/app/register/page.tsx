"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useVendor, VendorProfile } from "@/context/VendorContext";
import styles from "../login/login.module.css";
import { FladoIcon } from "@/components/Icons";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoggedIn, isLoading } = useVendor();

  // Basic info
  const [email, setEmail] = useState("");
  const [storeName, setStoreName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Business info
  const [legalName, setLegalName] = useState("");
  const [gstin, setGstin] = useState("");
  const [pan, setPan] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  // Bank info
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, isLoading, router]);

  const validateGstin = (val: string) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val);
  const validatePan = (val: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val);
  const validateIfsc = (val: string) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(val);

  const handleDemoFill = () => {
    setEmail("info@shankaricrafts.in");
    setStoreName("Shankari Handlooms");
    setPhone("+91 94440 12345");
    setPassword("shankari123");
    
    setLegalName("Shankari Weaver Artisans Co-operative");
    setGstin("33AAAAS1234C1Z9");
    setPan("AAAAS1234C");
    setAddress("24, Weavers Street, Pillayar Palayam");
    setCity("Kanchipuram");
    setState("Tamil Nadu");
    setPincode("631501");

    setBankName("State Bank of India");
    setAccountHolder("Shankari Weaver Artisans Co-operative");
    setAccountNumber("30123456789");
    setIfsc("SBIN0000847");
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // GSTIN/PAN/IFSC validation checks
    const cleanedGstin = gstin.trim().toUpperCase();
    const cleanedPan = pan.trim().toUpperCase();
    const cleanedIfsc = ifsc.trim().toUpperCase();

    if (!cleanedGstin) {
      setError("GSTIN is required for tax settlements.");
      return;
    }
    if (!validateGstin(cleanedGstin)) {
      setError("Invalid GSTIN format. Standard Indian GSTIN is 15 characters (e.g., 27AAAAA1111A1Z1).");
      return;
    }

    if (!cleanedPan) {
      setError("PAN Card is required.");
      return;
    }
    if (!validatePan(cleanedPan)) {
      setError("Invalid PAN format. Standard Indian PAN is 10 alphanumeric characters (e.g., ABCDE1234F).");
      return;
    }

    if (!cleanedIfsc) {
      setError("Bank IFSC is required.");
      return;
    }
    if (!validateIfsc(cleanedIfsc)) {
      setError("Invalid IFSC format. Should be 11 characters, fifth character 0 (e.g. SBIN0000847).");
      return;
    }

    if (!accountNumber || accountNumber.length < 9) {
      setError("Please provide a valid bank account number.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const registrationData: VendorProfile = {
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
        register(registrationData);
        router.push("/dashboard");
      } catch (err: any) {
        setError(err.message || "Registration failed. Please verify details.");
        setIsSubmitting(false);
      }
    }, 1200);
  };

  return (
    <main className={styles.authContainer}>
      <div className={styles.authCard} style={{ maxWidth: "700px" }}>
        <div className={styles.header}>
          <div className={styles.logoArea}>
            <span>AuraMart</span>
            <span className={styles.logoDot}>Partner</span>
          </div>
          <h1 className={styles.title}>Artisan & Seller Registration</h1>
          <p className={styles.subtitle}>Register your business to start selling across India</p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Section 1: Store & Login */}
          <div className={styles.formSection} style={{ borderTop: "none", paddingTop: 0 }}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionTitleNumber}>1</span> Store & Contact Details
            </h3>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Store Display Name *</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="e.g. Shankari Handlooms"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Business Email *</label>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="e.g. contact@shankari.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className={styles.row} style={{ marginTop: "1rem" }}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Mobile Number *</label>
                <input
                  className={styles.input}
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Password *</label>
                <input
                  className={styles.input}
                  type="password"
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Business & GST */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionTitleNumber}>2</span> Business & GST Details
            </h3>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Legal Entity Name *</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="e.g. Shankari Weaver Artisans Co-op"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>GSTIN (15-Digit Indian GST) *</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="e.g. 33AAAAS1234C1Z9"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  style={{ textTransform: "uppercase" }}
                  required
                />
              </div>
            </div>
            <div className={styles.row} style={{ marginTop: "1rem" }}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>PAN Card Number *</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="e.g. AAAAS1234C"
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                  maxLength={10}
                  style={{ textTransform: "uppercase" }}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Pincode *</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="600001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
            </div>
            <div className={styles.inputGroup} style={{ marginTop: "1rem" }}>
              <label className={styles.label}>Registered Business Address *</label>
              <textarea
                className={styles.textarea}
                placeholder="Full office/shop address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className={styles.row} style={{ marginTop: "1rem" }}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>City *</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="e.g. Kanchipuram"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>State *</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="e.g. Tamil Nadu"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Bank Details */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionTitleNumber}>3</span> Bank Settlement Account
            </h3>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Bank Name *</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="e.g. HDFC Bank, SBI"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>IFSC Code (11-Digit Code) *</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="e.g. SBIN0000847"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value)}
                  maxLength={11}
                  style={{ textTransform: "uppercase" }}
                  required
                />
              </div>
            </div>
            <div className={styles.row} style={{ marginTop: "1rem" }}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Account Holder Name *</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Name as in Bank Passbook"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Bank Account Number *</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className={styles.button} disabled={isSubmitting} style={{ marginTop: "1.5rem" }}>
            {isSubmitting ? "Submitting Registration..." : "Complete Registration & Get Started"}
          </button>

          <button
            type="button"
            className={styles.button}
            onClick={handleDemoFill}
            style={{
              backgroundColor: "var(--accent-green-light)",
              color: "var(--primary-green)",
              border: "1px solid var(--accent-green-border)",
              marginTop: "0.25rem"
            }}
          >
            <FladoIcon size={16} />
            Fill Demo Business & Bank Info
          </button>
        </form>

        <p className={styles.footerText}>
          Already registered?{" "}
          <Link href="/login" className={styles.link}>
            Sign In here
          </Link>
        </p>
      </div>
    </main>
  );
}
