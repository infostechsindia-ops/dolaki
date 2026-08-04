"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Menu, Search, Bell, ShieldAlert } from "lucide-react";
import styles from "./Header.module.css";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname();

  // Get human-readable page title based on pathname
  const getPageTitle = (path: string) => {
    if (path === "/") return "Dashboard Overview";
    const segment = path.split("/")[1];
    if (!segment) return "Dashboard Overview";
    
    // Replace hyphens with spaces and capitalize words
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button
          className={styles.menuButton}
          onClick={onMenuToggle}
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>
        <h1 className={styles.pageTitle}>{getPageTitle(pathname)}</h1>
      </div>

      <div className={styles.searchBar}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search products, orders, vendors..."
          className={styles.searchInput}
        />
      </div>

      <div className={styles.rightSection}>
        <div className={styles.statusPill}>
          <span className={styles.statusDot}></span>
          <span>Aura Engine Live</span>
        </div>

        <button className={styles.iconButton} aria-label="Notifications">
          <Bell size={18} />
          <span className={styles.badge}></span>
        </button>

        <div className={styles.divider}></div>

        <div className={styles.profileInfo}>
          <div className={styles.profilePic}>A</div>
        </div>
      </div>
    </header>
  );
}
