"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useVendor } from "@/context/VendorContext";
import styles from "./dashboard.module.css";
import {
  DashboardIcon,
  InventoryIcon,
  OrdersIcon,
  PayoutsIcon,
  ProfileIcon,
  LogoutIcon,
  FladoIcon
} from "@/components/Icons";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, isLoggedIn, logout, isLoading } = useVendor();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Authenticate checks
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading) {
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
        <div>Loading vendor metrics...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Prevents flashing dashboard screen
  }

  const navLinks = [
    { name: "Overview", href: "/dashboard", icon: <DashboardIcon size={18} /> },
    { name: "Inventory", href: "/dashboard/inventory", icon: <InventoryIcon size={18} /> },
    { name: "Orders & Fulfillment", href: "/dashboard/orders", icon: <OrdersIcon size={18} /> },
    { name: "Settlements & Payouts", href: "/dashboard/payouts", icon: <PayoutsIcon size={18} /> },
    { name: "Business Details", href: "/dashboard/profile", icon: <ProfileIcon size={18} /> }
  ];

  const handleLogout = () => {
    if (confirm("Are you sure you want to sign out?")) {
      logout();
      router.push("/login");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Seller Overview";
    if (pathname === "/dashboard/inventory") return "Manage Inventory";
    if (pathname === "/dashboard/orders") return "Fulfillment & Orders";
    if (pathname === "/dashboard/payouts") return "Payouts & Settlements";
    if (pathname === "/dashboard/profile") return "Business Profile";
    return "Partner Console";
  };

  return (
    <div className={styles.layoutContainer}>
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 90
          }}
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.brand}>
            <span>AuraMart</span>
            <span className={styles.brandDot}>Partner</span>
          </div>
        </div>

        <nav className={styles.navMenu}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogoutIcon size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainContainer}>
        <header className={styles.topHeader}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button className={styles.mobileMenuBtn} onClick={toggleSidebar} aria-label="Toggle Sidebar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
          </div>

          <div className={styles.headerMeta}>
            <div className={styles.storeIndicator}>
              <span className={styles.storeName}>{profile?.storeName || "AuraMart Store"}</span>
              <span className={styles.storeGstin}>GSTIN: {profile?.business?.gstin || "Not setup"}</span>
            </div>
            
            <div className={styles.fladoLiveBadge}>
              <FladoIcon size={12} />
              <span>Live on Flado</span>
            </div>
          </div>
        </header>

        <main className={styles.contentArea}>
          {children}
        </main>
      </div>
    </div>
  );
}
