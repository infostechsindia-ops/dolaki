"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useVendor } from "@/context/VendorContext";
import styles from "./login.module.css";
import { FladoIcon } from "@/components/Icons";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggedIn, isLoading } = useVendor();
  
  const [email, setEmail] = useState("");
  const [storeName, setStoreName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, isLoading, router]);

  const handleDemoFill = () => {
    setEmail("admin@auramarthandicrafts.in");
    setStoreName("AuraMart Heritage Crafts");
    setPassword("password123");
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email address is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      try {
        login(email, storeName || "My AuraMart Store");
        router.push("/dashboard");
      } catch (err: any) {
        setError(err.message || "Something went wrong. Please try again.");
        setIsSubmitting(false);
      }
    }, 800);
  };

  if (isLoading) {
    return (
      <div className={styles.authContainer}>
        <div style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
          Loading vendor environment...
        </div>
      </div>
    );
  }

  return (
    <main className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.header}>
          <div className={styles.logoArea}>
            <span>AuraMart</span>
            <span className={styles.logoDot}>Partner</span>
          </div>
          <h1 className={styles.title}>Vendor Portal</h1>
          <p className={styles.subtitle}>Manage your listings, orders & payouts</p>
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
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">Email Address</label>
            <input
              className={styles.input}
              id="email"
              type="email"
              placeholder="e.g. seller@auramart.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="storeName">Store Name (Optional)</label>
            <input
              className={styles.input}
              id="storeName"
              type="text"
              placeholder="e.g. AuraMart Heritage Crafts"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className={styles.label} htmlFor="password">Password</label>
              <a href="#" className={styles.link} style={{ fontSize: "0.75rem" }} onClick={(e) => { e.preventDefault(); alert("Use the Demo Login helper to bypass password!"); }}>Forgot?</a>
            </div>
            <input
              className={styles.input}
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.button} disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In to Vendor Dashboard"}
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
            Auto-fill Demo Credentials
          </button>
        </form>

        <p className={styles.footerText}>
          New to AuraMart?{" "}
          <Link href="/register" className={styles.link}>
            Register your business
          </Link>
        </p>
      </div>
    </main>
  );
}
