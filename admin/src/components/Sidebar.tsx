"use client";

import React, { useState } from "react";
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
  Sliders,
  Tag,
  Activity,
  User,
  IndianRupee,
  RotateCcw,
  ShoppingCart,
  Archive,
  Shield,
  FileText,
  Search,
  ChevronDown,
  ChevronRight,
  Building2
} from "lucide-react";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [opsExpanded, setOpsExpanded] = useState(pathname.startsWith("/operations"));

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "CMS Manager", path: "/cms", icon: Sliders },
    { name: "Orders", path: "/orders", icon: ShoppingBag },
    { name: "Products", path: "/products", icon: Package },
    { name: "Brands", path: "/brands", icon: Tag },
    { name: "Vendors", path: "/vendors", icon: Store },
    { name: "Users", path: "/users", icon: Users },
    { name: "Marketing", path: "/marketing", icon: Megaphone },
    { name: "Flado Ops", path: "/flado-ops", icon: Truck },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const opsItems = [
    { name: "Exec Dashboard", path: "/operations", icon: Activity },
    { name: "Customer CRM", path: "/operations/crm", icon: User },
    { name: "Vendor CRM", path: "/operations/vendor-crm", icon: Store },
    { name: "Finance Center", path: "/operations/finance", icon: IndianRupee },
    { name: "Refunds & Disputes", path: "/operations/refunds", icon: RotateCcw },
    { name: "Procurement", path: "/operations/procurement", icon: ShoppingCart },
    { name: "Inventory Intel", path: "/operations/inventory", icon: Archive },
    { name: "Marketing Ops", path: "/operations/marketing-ops", icon: Megaphone },
    { name: "Fraud & Risk", path: "/operations/fraud", icon: Shield },
    { name: "BI & Reports", path: "/operations/reports", icon: FileText },
    { name: "Audit Logs", path: "/operations/audit", icon: BarChart3 },
    { name: "Enterprise Search", path: "/operations/search", icon: Search },
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
              : pathname.startsWith(item.path) && !pathname.startsWith("/operations");

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

        {/* Operations Center Section */}
        <button
          onClick={() => setOpsExpanded(!opsExpanded)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            width: '100%',
            padding: '0.625rem 1rem',
            background: opsExpanded ? 'rgba(124,58,237,0.12)' : 'transparent',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            color: opsExpanded ? '#7C3AED' : 'inherit',
            fontSize: '0.875rem',
            fontWeight: 700,
            marginTop: '0.5rem',
            textAlign: 'left',
          }}
        >
          <Building2 size={18} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1 }}>Operations</span>
          {opsExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        {opsExpanded && (
          <div style={{ paddingLeft: '0.5rem' }}>
            {opsItems.map((item) => {
              const isActive = item.path === "/operations"
                ? pathname === "/operations"
                : pathname.startsWith(item.path);
              const IconComponent = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`${styles.navLink} ${isActive ? styles.activeNavLink : ""}`}
                  onClick={onClose}
                  style={{ fontSize: '0.8rem' }}
                >
                  <IconComponent className={styles.navIcon} size={15} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}
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

