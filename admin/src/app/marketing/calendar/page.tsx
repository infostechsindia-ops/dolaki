"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, Plus, Sparkles, Tag, Check } from "lucide-react";
import styles from "../../crud.module.css";

export default function CampaignCalendarPage() {
  const [campaigns, setCampaigns] = useState([
    { id: "c1", title: "🌧️ Monsoon Snack Rush", theme: "Monsoon", startDate: "2026-07-01", endDate: "2026-07-31", status: "Active", bannerUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800" },
    { id: "c2", title: "🇮🇳 Freedom Independence Sale", theme: "Independence Day", startDate: "2026-08-10", endDate: "2026-08-16", status: "Scheduled", bannerUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800" },
    { id: "c3", title: "🪔 Grand Diwali Festival Sale", theme: "Diwali", startDate: "2026-10-20", endDate: "2026-10-26", status: "Draft", bannerUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800" },
  ]);

  const [feedback, setFeedback] = useState<string | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.title}>📅 Festival & Campaign Calendar Scheduler</h2>
          <p className={styles.subtitle}>Plan, schedule, and automate seasonal festival campaigns for Muzaffarpur & Maunath Bhanjan.</p>
        </div>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={() => {
            setFeedback("✨ New Festival Campaign Schedule Modal Created.");
            setTimeout(() => setFeedback(null), 3000);
          }}
        >
          <Plus size={16} /> Schedule Campaign
        </button>
      </div>

      {feedback && (
        <div style={{ backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", color: "#065F46", padding: "12px 20px", borderRadius: "8px", fontWeight: 700 }}>
          {feedback}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {campaigns.map((c) => (
          <div key={c.id} className={styles.tableContainer} style={{ padding: "0", overflow: "hidden", borderRadius: "12px" }}>
            <div style={{ height: "140px", overflow: "hidden", position: "relative" }}>
              <img src={c.bannerUrl} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <span
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  backgroundColor: c.status === "Active" ? "#10B981" : c.status === "Scheduled" ? "#3B82F6" : "#6B7280",
                  color: "white",
                  fontSize: "0.7rem",
                  fontWeight: 900,
                  padding: "4px 10px",
                  borderRadius: "20px",
                }}
              >
                {c.status}
              </span>
            </div>
            <div style={{ padding: "16px" }}>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "1.05rem", fontWeight: 800 }}>{c.title}</h3>
              <p style={{ margin: "0 0 12px 0", fontSize: "0.8rem", color: "var(--text-light)" }}>
                Theme: <strong style={{ color: "var(--text-main)" }}>{c.theme}</strong>
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", borderTop: "1px solid var(--border)", paddingTop: "10px" }}>
                <span>📅 {c.startDate}</span>
                <span>➔ {c.endDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
