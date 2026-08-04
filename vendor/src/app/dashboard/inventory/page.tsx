"use client";

import React, { useState, useEffect } from "react";
import { useVendor, Product } from "@/context/VendorContext";
import styles from "../dashboard.module.css";
import {
  PlusIcon,
  TrashIcon,
  EditIcon,
  SearchIcon,
  FilterIcon,
  FladoIcon,
  InfoIcon
} from "@/components/Icons";

export default function InventoryPage() {
  const { products, addProduct, updateProduct, deleteProduct, toggleFladoListing } = useVendor();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Groceries & Beverages");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [listOnFlado, setListOnFlado] = useState(false);

  // Check URL query parameters on mount to open modal if directed from overview
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("add") === "true") {
        handleOpenAddModal();
        // Clear query param
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName("");
    setCategory("Groceries & Beverages");
    setPrice("");
    setCompareAtPrice("");
    setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
    setStock("50");
    setDescription("");
    setImageUrl("https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=60");
    setListOnFlado(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setCategory(product.category);
    setPrice(product.price.toString());
    setCompareAtPrice(product.compareAtPrice?.toString() || "");
    setSku(product.sku);
    setStock(product.stock.toString());
    setDescription(product.description);
    setImageUrl(product.imageUrl);
    setListOnFlado(product.listOnFlado);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !sku || stock === "") {
      alert("Please fill in all required fields.");
      return;
    }

    const priceNum = parseFloat(price);
    const comparePriceNum = compareAtPrice ? parseFloat(compareAtPrice) : undefined;
    const stockNum = parseInt(stock);

    if (isNaN(priceNum) || priceNum <= 0) {
      alert("Please enter a valid price greater than 0.");
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      alert("Stock cannot be negative.");
      return;
    }

    const productPayload = {
      name,
      category,
      price: priceNum,
      compareAtPrice: comparePriceNum,
      sku,
      stock: stockNum,
      description,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=60",
      listOnFlado
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    handleCloseModal();
  };

  // Filter Products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    
    let matchesStatus = true;
    if (selectedStatus === "active") matchesStatus = product.stock > 0;
    if (selectedStatus === "out_of_stock") matchesStatus = product.stock === 0;
    if (selectedStatus === "flado") matchesStatus = product.listOnFlado;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ["all", "Groceries & Beverages", "Ethnic Wear", "Groceries & Gourmet", "Home & Kitchen", "Personal Care"];

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="animate-fade-in">
      {/* Top Header Actions */}
      <div className={styles.actionHeader}>
        <div className={styles.searchFilterRow}>
          {/* Search Box */}
          <div className={styles.searchBox}>
            <SearchIcon size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by name, SKU..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <select
            className={styles.filterSelect}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Groceries & Beverages">Groceries & Beverages</option>
            <option value="Ethnic Wear">Ethnic Wear</option>
            <option value="Groceries & Gourmet">Groceries & Gourmet</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Personal Care">Personal Care</option>
          </select>

          {/* Status Filter */}
          <select
            className={styles.filterSelect}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Inventory Status</option>
            <option value="active">Active (In Stock)</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="flado">Synced with Flado</option>
          </select>
        </div>

        <button className={styles.primaryBtn} onClick={handleOpenAddModal}>
          <PlusIcon size={16} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Flado Information Alert Banner */}
      <div className={styles.fladoPromoCard} style={{ marginBottom: "1.5rem" }}>
        <div className={styles.fladoPromoInfo}>
          <span className={styles.fladoPromoTitle}>
            <FladoIcon size={16} style={{ color: "var(--primary-green)" }} />
            Flado Hyperlocal Delivery Service
          </span>
          <span className={styles.fladoPromoDesc}>
            Items toggled &ldquo;List on Flado&rdquo; are visible on our instant-delivery app (15-min delivery). Ensure correct SKU and inventory counts are maintained to guarantee fast dispatch.
          </span>
        </div>
      </div>

      {/* Inventory Listings Table */}
      {filteredProducts.length === 0 ? (
        <div style={{ padding: "4rem 2rem", textAlign: "center", backgroundColor: "var(--card-bg)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
          <InfoIcon size={48} style={{ color: "var(--text-light)", marginBottom: "1rem" }} />
          <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.25rem" }}>No Products Found</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            {products.length === 0 ? "You haven't listed any products yet." : "Try adjusting your search query or filters."}
          </p>
          {products.length === 0 && (
            <button className={styles.primaryBtn} onClick={handleOpenAddModal} style={{ marginTop: "1rem" }}>
              <PlusIcon size={16} />
              <span>List Your First Product</span>
            </button>
          )}
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product Details</th>
                <th>Category</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock Level</th>
                <th style={{ textAlign: "center" }}>List on Flado</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const isOutOfStock = product.stock === 0;
                const isLowStock = product.stock > 0 && product.stock <= 15;

                return (
                  <tr key={product.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "var(--radius-sm)",
                            objectFit: "cover",
                            backgroundColor: "var(--bg-color)",
                            border: "1px solid var(--border-color)"
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.9rem" }}>
                            {product.name}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                            {product.description.substring(0, 75)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-neutral" style={{ fontSize: "0.7rem", fontWeight: 600 }}>
                        {product.category}
                      </span>
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      {product.sku}
                    </td>
                    <td>
                      <div>
                        <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                          {formatINR(product.price)}
                        </span>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <span style={{
                            fontSize: "0.75rem",
                            color: "var(--text-light)",
                            textDecoration: "line-through",
                            marginLeft: "6px"
                          }}>
                            {formatINR(product.compareAtPrice)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      {isOutOfStock ? (
                        <span className="badge badge-danger">OUT OF STOCK</span>
                      ) : isLowStock ? (
                        <div>
                          <span className="badge badge-warning">LOW STOCK ({product.stock})</span>
                        </div>
                      ) : (
                        <span className="badge badge-success">IN STOCK ({product.stock})</span>
                      )}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" }}>
                        <label className={styles.switch}>
                          <input
                            type="checkbox"
                            checked={product.listOnFlado}
                            onChange={() => toggleFladoListing(product.id)}
                          />
                          <span className={styles.slider} />
                        </label>
                        <span style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: product.listOnFlado ? "var(--primary-green)" : "var(--text-light)"
                        }}>
                          {product.listOnFlado ? "ON" : "OFF"}
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "8px" }}>
                        <button
                          className={styles.secondaryBtn}
                          style={{ padding: "6px 10px" }}
                          onClick={() => handleOpenEditModal(product)}
                          title="Edit Details"
                        >
                          <EditIcon size={14} />
                        </button>
                        <button
                          className={styles.secondaryBtn}
                          style={{ padding: "6px 10px", color: "#ef4444", borderColor: "rgba(239,68,68,0.2)" }}
                          onClick={() => handleDelete(product.id, product.name)}
                          title="Delete Product"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingProduct ? "Modify Listing Details" : "Create New Product Listing"}
              </h3>
              <button className={styles.closeBtn} onClick={handleCloseModal}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className={styles.modalBody}>
                {/* Product Name */}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "1rem" }}>
                  <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Product Title *</label>
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="e.g. Handmade Kashmiri Walnut Wood Bowl"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* SKU & Category */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Category *</label>
                    <select
                      className={styles.filterSelect}
                      style={{ width: "100%" }}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Groceries & Beverages">Groceries & Beverages</option>
                      <option value="Ethnic Wear">Ethnic Wear</option>
                      <option value="Groceries & Gourmet">Groceries & Gourmet</option>
                      <option value="Home & Kitchen">Home & Kitchen</option>
                      <option value="Personal Care">Personal Care</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>SKU Code *</label>
                    <input
                      type="text"
                      className={styles.searchInput}
                      placeholder="e.g. HND-WLT-BWL"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Pricing & Stock */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Selling Price (₹) *</label>
                    <input
                      type="number"
                      className={styles.searchInput}
                      placeholder="INR Price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>MRP / Compare (₹)</label>
                    <input
                      type="number"
                      className={styles.searchInput}
                      placeholder="MRP struckout"
                      value={compareAtPrice}
                      onChange={(e) => setCompareAtPrice(e.target.value)}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Stock Qty *</label>
                    <input
                      type="number"
                      className={styles.searchInput}
                      placeholder="Available stock"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "1rem" }}>
                  <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Product Image URL</label>
                  <input
                    type="url"
                    className={styles.searchInput}
                    placeholder="https://..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "1rem" }}>
                  <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Product Description</label>
                  <textarea
                    className={styles.searchInput}
                    style={{ minHeight: "80px", resize: "vertical" }}
                    placeholder="Describe product materials, benefits, dimensions..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Flado Sync Toggle inside Form */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "var(--bg-color)",
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--radius-sm)"
                }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <FladoIcon size={18} style={{ color: "var(--primary-green)" }} />
                    <div>
                      <div style={{ fontSize: "0.8125rem", fontWeight: 700 }}>Enable Flado Hyperlocal</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>Sync item for 15-min deliveries on Flado app</div>
                    </div>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={listOnFlado}
                      onChange={(e) => setListOnFlado(e.target.checked)}
                    />
                    <span className={styles.slider} />
                  </label>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.secondaryBtn} onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className={styles.primaryBtn}>
                  {editingProduct ? "Save Changes" : "Create Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
