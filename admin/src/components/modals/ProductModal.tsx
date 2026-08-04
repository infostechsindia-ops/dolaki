"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAdmin, Product } from "@/context/AdminContext";
import styles from "./Modal.module.css";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export default function ProductModal({ isOpen, onClose, productToEdit }: ProductModalProps) {
  const { addProduct, updateProduct, categories, vendors } = useAdmin();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [vendor, setVendor] = useState("");
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState<Product["status"]>("active");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setPrice(productToEdit.price.toString());
      setCategory(productToEdit.category);
      setVendor(productToEdit.vendor);
      setStock(productToEdit.stock.toString());
      setStatus(productToEdit.status);
      setImage(productToEdit.image || (productToEdit.images && productToEdit.images[0]) || "");
    } else {
      // Defaults
      setName("");
      setPrice("");
      setCategory(categories[0]?.name || "");
      setVendor(vendors[0]?.name || "");
      setStock("");
      setStatus("active");
      setImage("");
    }
  }, [productToEdit, isOpen, categories, vendors]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !price || !category || !vendor || !stock) {
      alert("Please fill all required fields");
      return;
    }

    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      alert("Please enter a valid price");
      return;
    }

    if (isNaN(parsedStock) || parsedStock < 0) {
      alert("Please enter a valid stock number");
      return;
    }

    const productData = {
      name,
      price: parsedPrice,
      category,
      vendor,
      stock: parsedStock,
      status,
      image: image || "/images/placeholder.jpg",
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, productData);
    } else {
      addProduct(productData);
    }

    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {productToEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {/* Name */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Product Name *</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="e.g. Aashirvaad Shudh Chakki Atta 5kg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Price and Stock */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Price (₹) *</label>
                <input
                  type="number"
                  className={styles.formInput}
                  placeholder="e.g. 250"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Inventory Stock *</label>
                <input
                  type="number"
                  className={styles.formInput}
                  placeholder="e.g. 50"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Category and Vendor */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Category *</label>
                <select
                  className={styles.formSelect}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Vendor *</label>
                <select
                  className={styles.formSelect}
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  required
                >
                  {vendors.map((v) => (
                    <option key={v.id} value={v.name}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status and Image Link */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Status *</label>
              <select
                className={styles.formSelect}
                value={status}
                onChange={(e) => setStatus(e.target.value as Product["status"])}
                required
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Image Link (Optional)</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="e.g. /images/products/my-product.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={`${styles.btn} styles.btnSecondary`} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
              {productToEdit ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
