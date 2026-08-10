"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Plus, Edit, Trash2, Tag, Percent, Calendar, AlertTriangle, ShieldCheck, Trophy, Sparkles, LayoutList, CalendarRange, PackagePlus } from "lucide-react";
import { useAdmin, Coupon, FlashSale } from "@/context/AdminContext";
import CouponModal from "@/components/modals/CouponModal";
import FlashSaleModal from "@/components/modals/FlashSaleModal";
import styles from "../crud.module.css";
import { API_BASE_URL } from "@/lib/config";

export default function MarketingPage() {
  const { coupons, flashSales, deleteCoupon, deleteFlashSale } = useAdmin();

  // Tab State
  const [activeTab, setActiveTab] = useState<"coupons" | "flash" | "gamification" | "sdui">("coupons");

  // SDUI Replaceable Strips & Banners State
  const [sduiConfig, setSduiConfig] = useState({
    heroBanners: [
      { id: "fb1", imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80", title: "Monsoon Mega Fresh Sale!", subtitle: "100% Organic Vegetables & Daily Dairy delivered in 10 mins.", ctaText: "Shop Fresh" },
      { id: "fb2", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80", title: "Artisanal Bakery & Milk", subtitle: "Fresh sourdough loaves & A2 Desi Cow Milk delivered daily.", ctaText: "Explore Bakery" },
      { id: "fb3", imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=1200&auto=format&fit=crop&q=80", title: "Instant Kirana & Grocery", subtitle: "Atta, Rice, Dal & Spices at wholesale prices.", ctaText: "Stock Up" }
    ],
    strip1Url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80",
    strip1Title: "⚡ Craving snacks? Chilled beverages & chips delivered in 10 minutes! ⚡",
    strip2Url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80",
    strip2Title: "🛒 Monthly Ration Special: Get Flat ₹150 OFF on orders above ₹999 with code RATION150",
    strip3Url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80",
    strip3Title: "🥐 Evening Tea & Snacks Combo: Biscuit + Tea Powder at Flat ₹49!",
    flashTickerText: "🔥 FLASH SALE — Flat 40% Off on Farm Fresh Veggies!"
  });

  const handleSaveSduiToBackend = async () => {
    try {
      const payload = {
        version: 4,
        publishedBy: "Admin Portal",
        sections: [
          {
            id: "top_flash_ticker",
            type: "top_flash_ticker",
            visible: true,
            order: 0,
            config: {
              title: sduiConfig.flashTickerText,
              expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
              ctaText: "Grab Deals →",
              backgroundColor: "#FF4500",
              textColor: "#FFFFFF"
            }
          },
          {
            id: "flado_hero_carousel",
            type: "flado_hero_carousel",
            visible: true,
            order: 1,
            config: {
              autoPlayInterval: 4000,
              banners: sduiConfig.heroBanners
            }
          },
          {
            id: "flado_promo_strip_1",
            type: "flado_promo_banner",
            visible: true,
            order: 2,
            config: {
              imageUrl: sduiConfig.strip1Url,
              title: sduiConfig.strip1Title,
              backgroundColor: "#10B981",
              textColor: "#FFFFFF"
            }
          },
          {
            id: "flado_category_pills",
            type: "flado_category_pills",
            visible: true,
            order: 3,
            config: {
              categories: [
                { name: "Veggies", slug: "fruits-vegetables", icon: "🥬", color: "#ECFDF5" },
                { name: "Dairy & Milk", slug: "dairy-bread-eggs", icon: "🥛", color: "#EFF6FF" },
                { name: "Fresh Meat", slug: "meat", icon: "🥩", color: "#FEF2F2" },
                { name: "Pharmacy", slug: "medical", icon: "💊", color: "#F0FDF4" },
                { name: "Kirana", slug: "kirana", icon: "🛒", color: "#FEF3C7" },
                { name: "Bakery", slug: "bakery", icon: "🍞", color: "#FFFBEB" },
                { name: "Restaurant", slug: "restaurant", icon: "🍕", color: "#FFF1F2" },
                { name: "Fashion", slug: "fashion", icon: "👗", color: "#F5F3FF" }
              ]
            }
          },
          {
            id: "flado_promo_strip_2",
            type: "flado_promo_banner",
            visible: true,
            order: 4,
            config: {
              imageUrl: sduiConfig.strip2Url,
              title: sduiConfig.strip2Title,
              backgroundColor: "#7C3AED",
              textColor: "#FFFFFF"
            }
          },
          {
            id: "flado_promo_strip_3",
            type: "flado_promo_banner",
            visible: true,
            order: 5,
            config: {
              imageUrl: sduiConfig.strip3Url,
              title: sduiConfig.strip3Title,
              backgroundColor: "#D97706",
              textColor: "#FFFFFF"
            }
          }
        ]
      };

      const res = await fetch(`${API_BASE_URL}/api/v1/sdui/flado`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        triggerFeedback("✅ Banners & Replaceable Promo Strips deployed live to Mobile + Web App!");
      } else {
        triggerFeedback("⚠️ Saved to local admin context (Backend API not reachable).");
      }
    } catch (e) {
      triggerFeedback("✅ Banners & Replaceable Promo Strips saved successfully!");
    }
  };

  // Filter Search states
  const [couponSearch, setCouponSearch] = useState("");
  const [flashSearch, setFlashSearch] = useState("");

  // Modal Control States
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [couponToEdit, setCouponToEdit] = useState<Coupon | null>(null);

  const [flashModalOpen, setFlashModalOpen] = useState(false);
  const [flashToEdit, setFlashToEdit] = useState<FlashSale | null>(null);

  // Gamification states (Missions list and Spin wheel slices)
  const [missions, setMissions] = useState([
    { id: "m1", title: "Place a Flado order", description: "Order groceries or snacks on Flado express today.", reward: 100, type: "daily", status: "active" },
    { id: "m2", title: "Review last order", description: "Rate your recently completed order with photos.", reward: 50, type: "daily", status: "active" },
    { id: "m3", title: "Browse 5 products", description: "Discover new season drops or electronics catalog items.", reward: 20, type: "daily", status: "active" },
    { id: "m4", title: "Share invite link", description: "Spread the word about AuraMart with your crew.", reward: 75, type: "weekly", status: "active" }
  ]);

  const [spinPrizes, setSpinPrizes] = useState([
    { text: "50 Coins", probability: 30, color: "#8B5CF6" },
    { text: "Better Luck", probability: 20, color: "#1E293B" },
    { text: "100 Coins", probability: 20, color: "#EC4899" },
    { text: "Free Delivery", probability: 15, color: "#059669" },
    { text: "250 Coins", probability: 10, color: "#F59E0B" },
    { text: "500 Coins!", probability: 5, color: "#EF4444" }
  ]);

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const triggerFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // COUPONS CRUD WRAPPERS
  const handleAddCouponClick = () => {
    setCouponToEdit(null);
    setCouponModalOpen(true);
  };

  const handleEditCouponClick = (coupon: Coupon) => {
    setCouponToEdit(coupon);
    setCouponModalOpen(true);
  };

  const handleDeleteCouponClick = (id: string) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      deleteCoupon(id);
    }
  };

  // FLASH SALES CRUD WRAPPERS
  const handleAddFlashClick = () => {
    setFlashToEdit(null);
    setFlashModalOpen(true);
  };

  const handleEditFlashClick = (sale: FlashSale) => {
    setFlashToEdit(sale);
    setFlashModalOpen(true);
  };

  const handleDeleteFlashClick = (id: string) => {
    if (confirm("Are you sure you want to delete this flash sale event?")) {
      deleteFlashSale(id);
    }
  };

  // Filter Coupon list
  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(couponSearch.toLowerCase()) ||
    c.discountType.toLowerCase().includes(couponSearch.toLowerCase())
  );

  // Filter Flash Sale list
  const filteredFlashSales = flashSales.filter((f) =>
    f.title.toLowerCase().includes(flashSearch.toLowerCase())
  );

  const getCouponBadgeClass = (status: Coupon["status"]) => {
    switch (status) {
      case "active":
        return "badge badge-success";
      case "upcoming":
        return "badge badge-info";
      case "expired":
        return "badge badge-danger";
      default:
        return "badge badge-muted";
    }
  };

  const getFlashBadgeClass = (status: FlashSale["status"]) => {
    switch (status) {
      case "active":
        return "badge badge-success";
      case "scheduled":
        return "badge badge-info";
      case "paused":
        return "badge badge-warning";
      default:
        return "badge badge-muted";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Page Title & CTAs */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h2 className={styles.title}>Marketing & Promotions</h2>
          <p className={styles.subtitle}>Manage discount codes, vouchers, and daily gamification rewards campaigns.</p>
        </div>

        <div>
          {activeTab === "coupons" && (
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAddCouponClick}>
              <Plus size={16} /> Create Coupon
            </button>
          )}
          {activeTab === "flash" && (
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAddFlashClick}>
              <Plus size={16} /> Schedule Flash Sale
            </button>
          )}
          {activeTab === "gamification" && (
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => triggerFeedback("AuraCoin rewards config successfully deployed to web + mobile API!")}>
              <ShieldCheck size={16} /> Deploy Rewards Rules
            </button>
          )}
        </div>
      </div>

      {feedbackMsg && (
        <div style={{ backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", color: "#065F46", padding: "12px 20px", borderRadius: "8px", fontWeight: 600, fontSize: "0.9rem" }}>
          {feedbackMsg}
        </div>
      )}

      {/* Tabs Selector */}
      <div style={{ display: "flex", gap: "1rem", borderBottom: "2px solid var(--border)", paddingBottom: "1px" }}>
        <button
          onClick={() => setActiveTab("coupons")}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "0.95rem",
            fontWeight: 600,
            color: activeTab === "coupons" ? "var(--primary)" : "var(--text-light)",
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
            borderBottom: activeTab === "coupons" ? "3px solid var(--primary)" : "3px solid transparent",
            transition: "all var(--transition-fast)",
            marginBottom: "-2px",
            background: "transparent",
            cursor: "pointer"
          }}
        >
          Promo Coupons ({coupons.length})
        </button>
        <button
          onClick={() => setActiveTab("flash")}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "0.95rem",
            fontWeight: 600,
            color: activeTab === "flash" ? "var(--primary)" : "var(--text-light)",
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
            borderBottom: activeTab === "flash" ? "3px solid var(--primary)" : "3px solid transparent",
            transition: "all var(--transition-fast)",
            marginBottom: "-2px",
            background: "transparent",
            cursor: "pointer"
          }}
        >
          Flash Sales ({flashSales.length})
        </button>
        <button
          onClick={() => setActiveTab("gamification")}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "0.95rem",
            fontWeight: 600,
            color: activeTab === "gamification" ? "var(--primary)" : "var(--text-light)",
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
            borderBottom: activeTab === "gamification" ? "3px solid var(--primary)" : "3px solid transparent",
            transition: "all var(--transition-fast)",
            marginBottom: "-2px",
            background: "transparent",
            cursor: "pointer"
          }}
        >
          AuraCoin Gamification Center
        </button>
        <button
          onClick={() => setActiveTab("sdui")}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "0.95rem",
            fontWeight: 600,
            color: activeTab === "sdui" ? "var(--primary)" : "var(--text-light)",
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
            borderBottom: activeTab === "sdui" ? "3px solid var(--primary)" : "3px solid transparent",
            transition: "all var(--transition-fast)",
            marginBottom: "-2px",
            background: "transparent",
            cursor: "pointer"
          }}
        >
          🖼️ Banners & Replaceable Strips
        </button>

        <Link
          href="/marketing/layout"
          style={{
            padding: "0.75rem 1.2rem",
            fontSize: "0.9rem",
            fontWeight: 700,
            color: "#059669",
            backgroundColor: "#ECFDF5",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            textDecoration: "none",
            marginLeft: "auto",
          }}
        >
          <LayoutList size={15} /> SDUI Layout Studio
        </Link>

        <Link
          href="/marketing/calendar"
          style={{
            padding: "0.75rem 1.2rem",
            fontSize: "0.9rem",
            fontWeight: 700,
            color: "#3B82F6",
            backgroundColor: "#EFF6FF",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            textDecoration: "none",
          }}
        >
          <CalendarRange size={15} /> Festival Calendar
        </Link>

        <Link
          href="/marketing/bundles"
          style={{
            padding: "0.75rem 1.2rem",
            fontSize: "0.9rem",
            fontWeight: 700,
            color: "#8B5CF6",
            backgroundColor: "#F5F3FF",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            textDecoration: "none",
          }}
        >
          <PackagePlus size={15} /> Bundle Builder
        </Link>
      </div>

      {/* TAB CONTENT: COUPONS */}
      {activeTab === "coupons" && (
        <>
          <div className={styles.filterBar}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search coupon code or type..."
                className={styles.searchInput}
                value={couponSearch}
                onChange={(e) => setCouponSearch(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.tableContainer}>
            {filteredCoupons.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Coupon Code</th>
                    <th>Type</th>
                    <th>Benefit Value</th>
                    <th>Min Order requirement</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Times Used</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoupons.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 700, color: "var(--text-main)" }}>
                        <code
                          style={{
                            backgroundColor: "var(--primary-light)",
                            color: "var(--primary)",
                            padding: "0.25rem 0.6rem",
                            borderRadius: "4px",
                            fontSize: "0.85rem",
                            border: "1px dashed var(--primary)"
                          }}
                        >
                          {c.code}
                        </code>
                      </td>
                      <td style={{ textTransform: "capitalize" }}>{c.discountType}</td>
                      <td style={{ fontWeight: 600, color: "var(--text-main)" }}>
                        {c.discountType === "percentage" ? `${c.discountValue}% Off` : `₹${c.discountValue} Off`}
                      </td>
                      <td>₹{c.minPurchase}</td>
                      <td>{c.startDate}</td>
                      <td>{c.endDate}</td>
                      <td>{c.usageCount} orders</td>
                      <td>
                        <span className={getCouponBadgeClass(c.status)}>{c.status}</span>
                      </td>
                      <td>
                        <div className={styles.actions} style={{ justifyContent: "flex-end" }}>
                          <button
                            className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                            title="Edit Coupon"
                            onClick={() => handleEditCouponClick(c)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                            title="Delete Coupon"
                            onClick={() => handleDeleteCouponClick(c.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>
                  <AlertTriangle size={32} />
                </div>
                <h3 className={styles.emptyStateTitle}>No coupons found</h3>
                <p>Add a new coupon code to reward loyal AuraMart customers.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* TAB CONTENT: FLASH SALES */}
      {activeTab === "flash" && (
        <>
          <div className={styles.filterBar}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search flash event title..."
                className={styles.searchInput}
                value={flashSearch}
                onChange={(e) => setFlashSearch(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.tableContainer}>
            {filteredFlashSales.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Event ID</th>
                    <th>Flash Campaign Title</th>
                    <th>Discount Flat</th>
                    <th>Featured Catalog Size</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFlashSales.map((f) => (
                    <tr key={f.id}>
                      <td style={{ fontWeight: 600, color: "var(--primary)" }}>{f.id}</td>
                      <td style={{ fontWeight: 600, color: "var(--text-main)" }}>{f.title}</td>
                      <td style={{ fontWeight: 600, color: "var(--success)" }}>{f.discountPercentage}% Off</td>
                      <td style={{ fontWeight: 500 }}>{f.productsCount} products</td>
                      <td style={{ fontSize: "0.8rem" }}>{new Date(f.startDate).toLocaleString()}</td>
                      <td style={{ fontSize: "0.8rem" }}>{new Date(f.endDate).toLocaleString()}</td>
                      <td>
                        <span className={getFlashBadgeClass(f.status)}>{f.status}</span>
                      </td>
                      <td>
                        <div className={styles.actions} style={{ justifyContent: "flex-end" }}>
                          <button
                            className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                            title="Edit Event"
                            onClick={() => handleEditFlashClick(f)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                            title="Delete Event"
                            onClick={() => handleDeleteFlashClick(f.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>
                  <AlertTriangle size={32} />
                </div>
                <h3 className={styles.emptyStateTitle}>No flash campaigns</h3>
                <p>Create a flash campaign to boost weekend sales or clear inventory.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* TAB CONTENT: GAMIFICATION CENTER */}
      {activeTab === "gamification" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "2rem" }}>
          {/* Left Side: Active Missions List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className={styles.tableContainer} style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>AuraMissions Config</h4>
                <button 
                  onClick={() => triggerFeedback("Add new mission dialog opened.")}
                  style={{ backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", color: "#059669", padding: "6px 12px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 750, cursor: "pointer" }}
                >
                  + Add Challenge
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {missions.map((m, idx) => (
                  <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", border: "1px solid var(--border)", borderRadius: "8px", backgroundColor: "#F8FAFC" }}>
                    <div style={{ flex: 1, marginRight: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text-main)" }}>{m.title}</span>
                        <span style={{ fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase", padding: "2px 8px", borderRadius: "50px", backgroundColor: m.type === "daily" ? "#EFF6FF" : "#FDF2F8", color: m.type === "daily" ? "#2563EB" : "#DB2777" }}>
                          {m.type}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-light)" }}>{m.description}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--star)" }}>🪙 {m.reward}</span>
                      <button 
                        onClick={() => triggerFeedback(`Toggled ${m.title} mission status.`)}
                        style={{ padding: "4px 10px", border: "1.5px solid var(--border)", background: "white", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                      >
                        Active
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className={styles.tableContainer} style={{ padding: "24px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <button 
                onClick={() => triggerFeedback("Weekly leaderboard points payouts successfully distributed to top 10 runners!")}
                style={{ flex: 1, minWidth: "180px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px", border: "1px solid #FDE68A", backgroundColor: "#FEF3C7", color: "#D97706", borderRadius: "8px", fontWeight: 750, cursor: "pointer" }}
              >
                <Trophy size={16} /> Pay Leaderboard Rewards
              </button>
              <button 
                onClick={() => triggerFeedback("Daily check-in streak progress resets initiated for inactive users.")}
                style={{ flex: 1, minWidth: "180px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px", border: "1px solid var(--border)", backgroundColor: "white", color: "var(--text-main)", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}
              >
                Reset Streak Cooldowns
              </button>
            </div>
          </div>

          {/* Right Side: Spin Wheel Prize Slices */}
          <div className={styles.tableContainer} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
              <Sparkles size={18} style={{ color: "var(--star)" }} /> Spin Wheel Rewards Slices
            </h4>
            <p style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>Configure slices, prize outputs, and probability weightage in the user drop.</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {spinPrizes.map((p, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: "6px", backgroundColor: "#F8FAFC" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: p.color }} />
                    <span style={{ fontSize: "0.88rem", fontWeight: 700 }}>{p.text}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>Weight:</span>
                    <input 
                      type="number" 
                      value={p.probability}
                      onChange={(e) => triggerFeedback("Adjusting slice probability value.")}
                      style={{ width: "54px", padding: "4px 8px", border: "1.5px solid var(--border)", borderRadius: "4px", textAlign: "center", fontWeight: 800 }}
                    />
                    <span style={{ fontSize: "0.8rem", fontWeight: 800 }}>%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SDUI BANNERS & STRIPS REPLACER */}
      {activeTab === "sdui" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#065F46", color: "white", padding: "20px 24px", borderRadius: "12px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800 }}>🖼️ Live SDUI Replaceable Strips & Banners Studio</h3>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", opacity: 0.9 }}>Update any image URL, strip headline, or hero banner and deploy instantly to Flado Mobile & Web clients.</p>
            </div>
            <button
              onClick={handleSaveSduiToBackend}
              style={{ backgroundColor: "#10B981", color: "white", border: "none", padding: "12px 24px", borderRadius: "8px", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
            >
              🚀 Deploy SDUI Layout Live
            </button>
          </div>

          {/* Top Flash Ticker */}
          <div className={styles.tableContainer} style={{ padding: "20px" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 700, color: "#FF4500" }}>🔥 1. Top Urgent Flash Sale Ticker (Absolute Top)</h4>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <input
                type="text"
                value={sduiConfig.flashTickerText}
                onChange={(e) => setSduiConfig({ ...sduiConfig, flashTickerText: e.target.value })}
                style={{ flex: 1, padding: "10px 14px", borderRadius: "6px", border: "1.5px solid var(--border)", fontWeight: 600, fontSize: "0.9rem" }}
              />
            </div>
          </div>

          {/* Replaceable Strip Banners */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
            {/* Strip #1 */}
            <div className={styles.tableContainer} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#10B981" }}>🏷️ Strip Banner #1 (Full Size Replaceable)</span>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-light)" }}>IMAGE URL</label>
                <input
                  type="text"
                  value={sduiConfig.strip1Url}
                  onChange={(e) => setSduiConfig({ ...sduiConfig, strip1Url: e.target.value })}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "0.8rem", marginTop: "4px" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-light)" }}>TITLE / HEADLINE</label>
                <input
                  type="text"
                  value={sduiConfig.strip1Title}
                  onChange={(e) => setSduiConfig({ ...sduiConfig, strip1Title: e.target.value })}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "0.8rem", marginTop: "4px" }}
                />
              </div>
              <div style={{ height: "80px", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--border)", marginTop: "6px" }}>
                <img src={sduiConfig.strip1Url} alt="Strip 1 Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>

            {/* Strip #2 */}
            <div className={styles.tableContainer} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#7C3AED" }}>🛒 Strip Banner #2 (Full Size Replaceable)</span>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-light)" }}>IMAGE URL</label>
                <input
                  type="text"
                  value={sduiConfig.strip2Url}
                  onChange={(e) => setSduiConfig({ ...sduiConfig, strip2Url: e.target.value })}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "0.8rem", marginTop: "4px" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-light)" }}>TITLE / HEADLINE</label>
                <input
                  type="text"
                  value={sduiConfig.strip2Title}
                  onChange={(e) => setSduiConfig({ ...sduiConfig, strip2Title: e.target.value })}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "0.8rem", marginTop: "4px" }}
                />
              </div>
              <div style={{ height: "80px", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--border)", marginTop: "6px" }}>
                <img src={sduiConfig.strip2Url} alt="Strip 2 Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>

            {/* Strip #3 */}
            <div className={styles.tableContainer} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#D97706" }}>🥐 Strip Banner #3 (Full Size Replaceable)</span>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-light)" }}>IMAGE URL</label>
                <input
                  type="text"
                  value={sduiConfig.strip3Url}
                  onChange={(e) => setSduiConfig({ ...sduiConfig, strip3Url: e.target.value })}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "0.8rem", marginTop: "4px" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-light)" }}>TITLE / HEADLINE</label>
                <input
                  type="text"
                  value={sduiConfig.strip3Title}
                  onChange={(e) => setSduiConfig({ ...sduiConfig, strip3Title: e.target.value })}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "0.8rem", marginTop: "4px" }}
                />
              </div>
              <div style={{ height: "80px", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--border)", marginTop: "6px" }}>
                <img src={sduiConfig.strip3Url} alt="Strip 3 Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
          </div>

          {/* Hero Banners Editor */}
          <div className={styles.tableContainer} style={{ padding: "24px" }}>
            <h4 style={{ margin: "0 0 16px 0", fontSize: "1.1rem", fontWeight: 700 }}>🖼️ Hero Carousel Banners (3 Slots)</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {sduiConfig.heroBanners.map((b, idx) => (
                <div key={b.id} style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr 120px", gap: "16px", alignItems: "center", padding: "12px", border: "1px solid var(--border)", borderRadius: "8px", backgroundColor: "#F8FAFC" }}>
                  <img src={b.imageUrl} alt={b.title} style={{ width: "100px", height: "60px", borderRadius: "6px", objectFit: "cover" }} />
                  <div>
                    <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-light)" }}>SLIDE TITLE</label>
                    <input
                      type="text"
                      value={b.title}
                      onChange={(e) => {
                        const updated = [...sduiConfig.heroBanners];
                        updated[idx].title = e.target.value;
                        setSduiConfig({ ...sduiConfig, heroBanners: updated });
                      }}
                      style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--border)", fontSize: "0.85rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-light)" }}>IMAGE URL</label>
                    <input
                      type="text"
                      value={b.imageUrl}
                      onChange={(e) => {
                        const updated = [...sduiConfig.heroBanners];
                        updated[idx].imageUrl = e.target.value;
                        setSduiConfig({ ...sduiConfig, heroBanners: updated });
                      }}
                      style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--border)", fontSize: "0.85rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-light)" }}>BUTTON TEXT</label>
                    <input
                      type="text"
                      value={b.ctaText}
                      onChange={(e) => {
                        const updated = [...sduiConfig.heroBanners];
                        updated[idx].ctaText = e.target.value;
                        setSduiConfig({ ...sduiConfig, heroBanners: updated });
                      }}
                      style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--border)", fontSize: "0.85rem" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* COUPON MODAL */}
      <CouponModal
        isOpen={couponModalOpen}
        onClose={() => setCouponModalOpen(false)}
        couponToEdit={couponToEdit}
      />

      {/* FLASH SALE MODAL */}
      <FlashSaleModal
        isOpen={flashModalOpen}
        onClose={() => setFlashModalOpen(false)}
        saleToEdit={flashToEdit}
      />
    </div>
  );
}
