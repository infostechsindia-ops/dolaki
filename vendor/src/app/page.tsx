"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useVendor } from "@/context/VendorContext";

export default function RootPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useVendor();

  useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [isLoggedIn, isLoading, router]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-sans)",
      color: "var(--text-secondary)",
      backgroundColor: "var(--bg-color)"
    }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ marginBottom: "1rem" }}>Connecting to AuraMart Partner Network...</p>
        <div style={{
          width: "30px",
          height: "30px",
          border: "3px solid var(--border-color)",
          borderTopColor: "var(--primary-green)",
          borderRadius: "50%",
          display: "inline-block",
          animation: "spin 1s linear infinite"
        }} />
        <style jsx global>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
