"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Store,
  Users,
  Megaphone,
  Truck,
  BarChart3,
  Settings,
  X,
  Sliders
} from "lucide-react";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "CMS Manager", path: "/cms", icon: Sliders },
    { name: "Orders", path: "/orders", icon: ShoppingBag },
    { name: "Products", path: "/products", icon: Package },
    { name: "Vendors", path: "/vendors", icon: Store },
    { name: "Users", path: "/users", icon: Users },
    { name: "Marketing", path: "/marketing", icon: Megaphone },
    { name: "Flado Ops", path: "/flado-ops", icon: Truck },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
      <div className={styles.logoArea}>
        <div className={styles.logoIcon}>A</div>
        <div className={styles.logoText}>
          <span className={styles.brandName}>AuraMart</span>
          <span className={styles.brandSub}>Admin Portal</span>
        </div>
      </div>

      <nav className={styles.navSection}>
        {menuItems.map((item) => {
          const isActive =
            item.path === "/"
              ? pathname === "/"
              : pathname.startsWith(item.path);

          const IconComponent = item.icon;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`${styles.navLink} ${
                isActive ? styles.activeNavLink : ""
              }`}
              onClick={onClose}
            >
              <IconComponent className={styles.navIcon} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <div className={styles.avatar}>AM</div>
        <div className={styles.adminInfo}>
          <span className={styles.adminName}>Arif Al Nukhbah</span>
          <span className={styles.adminRole}>Super Admin</span>
        </div>
      </div>
    </aside>
  );
}
