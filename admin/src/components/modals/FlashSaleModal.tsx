"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAdmin, FlashSale } from "@/context/AdminContext";
import styles from "./Modal.module.css";

interface FlashSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  saleToEdit?: FlashSale | null;
}

export default function FlashSaleModal({ isOpen, onClose, saleToEdit }: FlashSaleModalProps) {
  const { addFlashSale, updateFlashSale } = useAdmin();

  const [title, setTitle] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [productsCount, setProductsCount] = useState("0");
  const [status, setStatus] = useState<FlashSale["status"]>("scheduled");

  useEffect(() => {
    if (saleToEdit) {
      setTitle(saleToEdit.title);
      setDiscountPercentage(saleToEdit.discountPercentage.toString());
      
      // format datetime-local input (YYYY-MM-DDThh:mm)
      const formatDT = (dtStr: string) => {
        try {
          const d = new Date(dtStr);
          if (isNaN(d.getTime())) return "";
          return d.toISOString().substring(0, 16);
        } catch {
          return "";
        }
      };

      setStartDate(formatDT(saleToEdit.startDate));
      setEndDate(formatDT(saleToEdit.endDate));
      setProductsCount(saleToEdit.productsCount.toString());
      setStatus(saleToEdit.status);
    } else {
      setTitle("");
      setDiscountPercentage("");
      setStartDate("");
      setEndDate("");
      setProductsCount("0");
      setStatus("scheduled");
    }
  }, [saleToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !discountPercentage || !startDate || !endDate) {
      alert("Please fill all required fields");
      return;
    }

    const pct = parseInt(discountPercentage, 10);
    const count = parseInt(productsCount, 10);

    if (isNaN(pct) || pct <= 0 || pct > 100) {
      alert("Please enter a valid discount percentage (1-100)");
      return;
    }

    if (isNaN(count) || count < 0) {
      alert("Please enter a valid number of products");
      return;
    }

    const saleData = {
      title,
      discountPercentage: pct,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      productsCount: count,
      status,
    };

    if (saleToEdit) {
      updateFlashSale(saleToEdit.id, saleData);
    } else {
      addFlashSale(saleData);
    }

    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {saleToEdit ? "Edit Flash Sale" : "Schedule Flash Sale"}
          </h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {/* Sale Title */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Flash Sale Event Title *</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="e.g. Midnight Dairy Rush"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Discount and Product count */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Flat Discount (%) *</label>
                <input
                  type="number"
                  className={styles.formInput}
                  placeholder="e.g. 30"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  min="1"
                  max="100"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Featured Products Count</label>
                <input
                  type="number"
                  className={styles.formInput}
                  value={productsCount}
                  onChange={(e) => setProductsCount(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            {/* Start and End Times */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Start Time *</label>
                <input
                  type="datetime-local"
                  className={styles.formInput}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>End Time *</label>
                <input
                  type="datetime-local"
                  className={styles.formInput}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Status */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Event Status *</label>
              <select
                className={styles.formSelect}
                value={status}
                onChange={(e) => setStatus(e.target.value as FlashSale["status"])}
                required
              >
                <option value="scheduled">Scheduled</option>
                <option value="active">Active (Live)</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={`${styles.btn} styles.btnSecondary`} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
              {saleToEdit ? "Update Event" : "Schedule Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
