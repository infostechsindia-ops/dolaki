"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAdmin, Coupon } from "@/context/AdminContext";
import styles from "./Modal.module.css";

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  couponToEdit?: Coupon | null;
}

export default function CouponModal({ isOpen, onClose, couponToEdit }: CouponModalProps) {
  const { addCoupon, updateCoupon } = useAdmin();

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<Coupon["discountType"]>("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minPurchase, setMinPurchase] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<Coupon["status"]>("active");

  useEffect(() => {
    if (couponToEdit) {
      setCode(couponToEdit.code);
      setDiscountType(couponToEdit.discountType);
      setDiscountValue(couponToEdit.discountValue.toString());
      setMinPurchase(couponToEdit.minPurchase.toString());
      setStartDate(couponToEdit.startDate);
      setEndDate(couponToEdit.endDate);
      setStatus(couponToEdit.status);
    } else {
      setCode("");
      setDiscountType("percentage");
      setDiscountValue("");
      setMinPurchase("");
      setStartDate("");
      setEndDate("");
      setStatus("active");
    }
  }, [couponToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!code || !discountValue || !minPurchase || !startDate || !endDate) {
      alert("Please fill all required fields");
      return;
    }

    const val = parseFloat(discountValue);
    const min = parseFloat(minPurchase);

    if (isNaN(val) || val <= 0) {
      alert("Please enter a valid discount value");
      return;
    }

    if (discountType === "percentage" && val > 100) {
      alert("Percentage discount cannot exceed 100%");
      return;
    }

    if (isNaN(min) || min < 0) {
      alert("Please enter a valid minimum purchase amount");
      return;
    }

    const couponData = {
      code: code.toUpperCase().replace(/\s+/g, ""),
      discountType,
      discountValue: val,
      minPurchase: min,
      startDate,
      endDate,
      status,
    };

    if (couponToEdit) {
      updateCoupon(couponToEdit.id, couponData);
    } else {
      addCoupon(couponData);
    }

    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {couponToEdit ? "Edit Coupon" : "Create Promotional Coupon"}
          </h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {/* Promo Code */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Coupon Code *</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="e.g. MONSOON30"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            {/* Discount Type and Value */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Discount Type *</label>
                <select
                  className={styles.formSelect}
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as Coupon["discountType"])}
                  required
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Flat Discount (₹)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  {discountType === "percentage" ? "Discount Percentage (%)" : "Flat Value (₹)"} *
                </label>
                <input
                  type="number"
                  className={styles.formInput}
                  placeholder={discountType === "percentage" ? "e.g. 20" : "e.g. 150"}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Min Purchase and Status */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Minimum Purchase (₹) *</label>
                <input
                  type="number"
                  className={styles.formInput}
                  placeholder="e.g. 299"
                  value={minPurchase}
                  onChange={(e) => setMinPurchase(e.target.value)}
                  min="0"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Coupon Status *</label>
                <select
                  className={styles.formSelect}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Coupon["status"])}
                  required
                >
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>

            {/* Start and End Dates */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Start Date *</label>
                <input
                  type="date"
                  className={styles.formInput}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>End Date *</label>
                <input
                  type="date"
                  className={styles.formInput}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={`${styles.btn} styles.btnSecondary`} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
              {couponToEdit ? "Update Coupon" : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
