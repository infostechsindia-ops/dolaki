"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAdmin, Category } from "@/context/AdminContext";
import styles from "./Modal.module.css";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: Category | null;
}

export default function CategoryModal({ isOpen, onClose, categoryToEdit }: CategoryModalProps) {
  const { addCategory, updateCategory } = useAdmin();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<Category["status"]>("active");

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setSlug(categoryToEdit.slug);
      setStatus(categoryToEdit.status);
    } else {
      setName("");
      setSlug("");
      setStatus("active");
    }
  }, [categoryToEdit, isOpen]);

  // Auto-generate slug when name changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!categoryToEdit) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
      );
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      alert("Please fill all required fields");
      return;
    }

    const categoryData = {
      name,
      slug,
      status,
    };

    if (categoryToEdit) {
      updateCategory(categoryToEdit.id, categoryData);
    } else {
      addCategory(categoryData);
    }

    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {categoryToEdit ? "Edit Category" : "Add New Category"}
          </h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {/* Category Name */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Category Name *</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="e.g. Snacks & Organic Foods"
                value={name}
                onChange={handleNameChange}
                required
              />
            </div>

            {/* Slug */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Slug (URL friendly) *</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="e.g. snacks-organic-foods"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>

            {/* Status */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Status *</label>
              <select
                className={styles.formSelect}
                value={status}
                onChange={(e) => setStatus(e.target.value as Category["status"])}
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={`${styles.btn} styles.btnSecondary`} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
              {categoryToEdit ? "Update Category" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
