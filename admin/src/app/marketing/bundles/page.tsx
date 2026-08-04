"use client";

import React, { useState } from "react";
import { Plus, Tag, ShoppingBag, Trash2, Edit } from "lucide-react";
import styles from "../../crud.module.css";

export default function BundleBuilderPage() {
  const [bundles, setBundles] = useState([
    { id: "b1", name: "🌅 Morning Breakfast Bundle", items: ["A2 Milk 1L", "Brown Bread 400g", "Amul Butter 100g"], totalPrice: 120, originalPrice: 155, savings: 35, imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600" },
    { id: "b2", name: "🍿 Party Snack Pack", items: ["Lay's Potato Chips x2", "Coca Cola 750ml", "Salted Peanuts 200g"], totalPrice: 140, originalPrice: 185, savings: 45, imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600" },
    { id: "b3", name: "🍵 Evening Tea & Biscuits Combo", items: ["Red Label Tea 250g", "Britannia Good Day x2", "Full Cream Milk 500ml"], totalPrice: 110, originalPrice: 140, savings: 30, imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600" },
  ]);

  const [feedback, setFeedback] = useState<string | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.title}>🍱 Meal Combos & Saver Bundle Builder</h2>
          <p className={styles.subtitle}>Curate high-AOV grocery bundles that customers can add to cart in 1-tap.</p>
        </div>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={() => {
            setFeedback("✨ New Combo Pack Builder Modal Opened.");
            setTimeout(() => setFeedback(null), 3000);
          }}
        >
          <Plus size={16} /> Create Combo Bundle
        </button>
      </div>

      {feedback && (
        <div style={{ backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", color: "#065F46", padding: "12px 20px", borderRadius: "8px", fontWeight: 700 }}>
          {feedback}
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Bundle Name</th>
              <th>Included Products</th>
              <th>Bundle Price</th>
              <th>Original Total</th>
              <th>Savings</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bundles.map((b) => (
              <tr key={b.id}>
                <td style={{ fontWeight: 800, color: "var(--text-main)", display: "flex", alignItems: "center", gap: "10px" }}>
                  <img src={b.imageUrl} alt={b.name} style={{ width: "40px", height: "40px", borderRadius: "6px", objectFit: "cover" }} />
                  <span>{b.name}</span>
                </td>
                <td style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>
                  {b.items.join(" + ")}
                </td>
                <td style={{ fontWeight: 900, color: "var(--primary)" }}>₹{b.totalPrice}</td>
                <td style={{ textDecoration: "line-through", color: "var(--text-muted)" }}>₹{b.originalPrice}</td>
                <td>
                  <span className="badge badge-success">Save ₹{b.savings}</span>
                </td>
                <td>
                  <div className={styles.actions} style={{ justifyContent: "flex-end" }}>
                    <button className={`${styles.actionBtn} ${styles.actionBtnEdit}`}>
                      <Edit size={16} />
                    </button>
                    <button className={`${styles.actionBtn} ${styles.actionBtnDelete}`}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
