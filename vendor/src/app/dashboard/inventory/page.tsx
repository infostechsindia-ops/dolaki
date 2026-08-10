"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useVendor, Product } from "@/context/VendorContext";
import styles from "../dashboard.module.css";
import {
  PlusIcon,
  TrashIcon,
  EditIcon,
  SearchIcon,
  FladoIcon,
  InfoIcon
} from "@/components/Icons";

interface LiveVendorProductDTO {
  id: string;
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  categoryName?: string;
  brandId?: string;
  sku: string;
  priceMinor: number;
  formattedPrice: string;
  compareAtPriceMinor?: number;
  stockQuantity: number;
  imageUrls: string[];
  status: "DRAFT" | "ACTIVE" | "INACTIVE";
  listOnFlado: boolean;
  createdAt: string;
}

export default function InventoryPage() {
  const { products, addProduct, updateProduct, deleteProduct, toggleFladoListing } = useVendor();

  const [liveProducts, setLiveProducts] = useState<LiveVendorProductDTO[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<LiveVendorProductDTO | null>(null);

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
  const [status, setStatus] = useState<"DRAFT" | "ACTIVE" | "INACTIVE">("ACTIVE");

  // FEAT-003: Brand assignment state
  const [brandId, setBrandId] = useState<string>("");
  const [availableBrands, setAvailableBrands] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  const fetchLiveProducts = useCallback(async () => {
    const isDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO_FIXTURES === "true";
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    if (isDemo || !token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/vendors/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to load vendor products");
      let data = await res.json();
      if (data && typeof data === "object" && "data" in data) data = data.data;

      setLiveProducts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch vendor catalog");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveProducts();
  }, [fetchLiveProducts]);

  // FEAT-003: Fetch active brands from /api/v1/brands for dropdown
  useEffect(() => {
    const fetchBrands = async () => {
      setBrandsLoading(true);
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
      const isDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO_FIXTURES === "true";
      try {
        const res = await fetch(`${BASE_URL}/api/v1/brands?pageSize=100`);
        if (!res.ok) throw new Error("Failed to fetch brands");
        const body = await res.json();
        const list = body.data ?? body ?? [];
        setAvailableBrands(Array.isArray(list) ? list : []);
      } catch {
        if (isDemo) {
          // Demo fallback — no brands available, brand field stays optional
          setAvailableBrands([]);
        }
      } finally {
        setBrandsLoading(false);
      }
    };
    fetchBrands();
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
    setBrandId("");
    setListOnFlado(true);
    setStatus("ACTIVE");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: LiveVendorProductDTO) => {
    setEditingProduct(product);
    setName(product.title);
    setCategory(product.categoryName || "Groceries & Beverages");
    setPrice((product.priceMinor / 100).toString());
    setCompareAtPrice(product.compareAtPriceMinor ? (product.compareAtPriceMinor / 100).toString() : "");
    setSku(product.sku);
    setStock(product.stockQuantity.toString());
    setDescription(product.description);
    setImageUrl(product.imageUrls[0] || "");
    setBrandId(product.brandId || "");
    setListOnFlado(product.listOnFlado);
    setStatus(product.status);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id: string, prodTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${prodTitle}"?`)) return;

    const isDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO_FIXTURES === "true";
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    setMutatingId(id);
    if (isDemo || !token) {
      deleteProduct(id);
      setMutatingId(null);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/v1/vendors/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete product");
      setSuccessMsg(`Deleted "${prodTitle}" successfully.`);
      fetchLiveProducts();
    } catch (err: any) {
      setError(err?.message || "Failed to delete product");
    } finally {
      setMutatingId(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
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

    const isDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO_FIXTURES === "true";
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    setMutatingId(editingProduct ? editingProduct.id : "new");
    if (isDemo || !token) {
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
      if (editingProduct) updateProduct(editingProduct.id, productPayload);
      else addProduct(productPayload);
      handleCloseModal();
      setMutatingId(null);
      return;
    }

    try {
      const endpoint = editingProduct
        ? `${BASE_URL}/api/v1/vendors/products/${editingProduct.id}`
        : `${BASE_URL}/api/v1/vendors/products`;
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: name,
          description,
          categoryId: "cat-1",
          brandId: brandId || undefined,
          sku,
          priceMinor: Math.round(priceNum * 100),
          compareAtPriceMinor: comparePriceNum ? Math.round(comparePriceNum * 100) : undefined,
          stockQuantity: stockNum,
          imageUrls: [imageUrl || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=60"],
          status
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Failed to save product listing");
      }

      setSuccessMsg(editingProduct ? "Product updated successfully!" : "Product listing created successfully!");
      handleCloseModal();
      fetchLiveProducts();
    } catch (err: any) {
      setError(err?.message || "Catalog error");
    } finally {
      setMutatingId(null);
    }
  };

  const displayList: LiveVendorProductDTO[] = liveProducts !== null
    ? liveProducts
    : products.map((p) => ({
        id: p.id,
        title: p.name,
        slug: p.name.toLowerCase().replace(/\s+/g, "-"),
        description: p.description,
        categoryId: "cat-1",
        categoryName: p.category,
        sku: p.sku,
        priceMinor: Math.round(p.price * 100),
        formattedPrice: `₹${p.price}`,
        stockQuantity: p.stock,
        imageUrls: [p.imageUrl],
        status: p.stock > 0 ? "ACTIVE" : "INACTIVE",
        listOnFlado: p.listOnFlado,
        createdAt: p.createdAt
      }));

  const filteredProducts = displayList.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.categoryName === selectedCategory;
    
    let matchesStatus = true;
    if (selectedStatus === "active") matchesStatus = product.status === "ACTIVE";
    if (selectedStatus === "draft") matchesStatus = product.status === "DRAFT";
    if (selectedStatus === "flado") matchesStatus = product.listOnFlado;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const isInitialLoad = loading && liveProducts === null;
  const isRefetching = loading && liveProducts !== null;

  return (
    <div className="animate-fade-in">
      {/* Top Header Actions */}
      <div className={styles.actionHeader}>
        <div className={styles.searchFilterRow}>
          <div className={styles.searchBox}>
            <SearchIcon size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by title, SKU..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select className={styles.filterSelect} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="Groceries & Beverages">Groceries & Beverages</option>
            <option value="Ethnic Wear">Ethnic Wear</option>
            <option value="Groceries & Gourmet">Groceries & Gourmet</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Personal Care">Personal Care</option>
          </select>

          <select className={styles.filterSelect} value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="all">All Listing Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="flado">Synced with Flado</option>
          </select>
        </div>

        <button className={styles.primaryBtn} onClick={handleOpenAddModal} disabled={mutatingId !== null}>
          <PlusIcon size={16} />
          <span>Add Product</span>
        </button>
      </div>

      {error && (
        <div style={{ backgroundColor: "#FEF2F2", borderLeft: "4px solid #EF4444", color: "#991B1B", padding: "1rem", marginBottom: "1.5rem", borderRadius: "4px", fontSize: "0.875rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong>Catalog Error:</strong> {error}
          </div>
          <button onClick={() => fetchLiveProducts()} className={styles.secondaryBtn} style={{ fontSize: "0.75rem", padding: "4px 10px", backgroundColor: "white", cursor: "pointer" }}>
            Retry Catalog Fetch
          </button>
        </div>
      )}

      {/* Background Refetch Indicator */}
      {isRefetching && (
        <div className={styles.refetchBanner} role="status" aria-live="polite">
          <span>⚡ Syncing live catalog data...</span>
        </div>
      )}

      {/* Flado Information Alert Banner */}
      <div className={styles.fladoPromoCard} style={{ marginBottom: "1.5rem" }}>
        <div className={styles.fladoPromoInfo}>
          <span className={styles.fladoPromoTitle}>
            <FladoIcon size={16} style={{ color: "var(--primary-green)" }} />
            Flado Hyperlocal Catalog Sync
          </span>
          <span className={styles.fladoPromoDesc}>
            Items toggled &ldquo;List on Flado&rdquo; are visible on our instant-delivery app. Darkstore availability requires active store inventory configuration.
          </span>
        </div>
      </div>

      {/* Inventory Listings Table / Skeleton / Empty State */}
      {isInitialLoad ? (
        <div className={styles.tableContainer} aria-busy="true" aria-label="Loading inventory catalog..." data-testid="inventory-table-skeleton">
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product Details</th>
                <th>Category</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock Level</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`skeleton-row-${idx}`} data-testid="inventory-skeleton-row" aria-hidden="true">
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div className={styles.skeletonPulse} style={{ width: "48px", height: "48px", borderRadius: "6px", flexShrink: 0 }} />
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", flexGrow: 1 }}>
                        <div className={styles.skeletonPulse} style={{ width: "60%", height: "14px" }} />
                        <div className={styles.skeletonPulse} style={{ width: "85%", height: "10px" }} />
                      </div>
                    </div>
                  </td>
                  <td><div className={styles.skeletonPulse} style={{ width: "70px", height: "20px", borderRadius: "4px" }} /></td>
                  <td><div className={styles.skeletonPulse} style={{ width: "65px", height: "14px" }} /></td>
                  <td><div className={styles.skeletonPulse} style={{ width: "55px", height: "16px" }} /></td>
                  <td><div className={styles.skeletonPulse} style={{ width: "90px", height: "20px", borderRadius: "12px" }} /></td>
                  <td><div className={styles.skeletonPulse} style={{ width: "60px", height: "20px", borderRadius: "12px" }} /></td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "8px" }}>
                      <div className={styles.skeletonPulse} style={{ width: "32px", height: "28px", borderRadius: "4px" }} />
                      <div className={styles.skeletonPulse} style={{ width: "32px", height: "28px", borderRadius: "4px" }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ padding: "4rem 2rem", textAlign: "center", backgroundColor: "var(--card-bg)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }} data-testid="inventory-empty-state">
          <InfoIcon size={48} style={{ color: "var(--text-light)", marginBottom: "1rem" }} />
          <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.25rem" }}>No Products Found</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Try adjusting your search query or filters.</p>
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
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <img
                        src={product.imageUrls[0] || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d"}
                        alt={product.title}
                        style={{ width: "48px", height: "48px", borderRadius: "6px", objectFit: "cover", backgroundColor: "#F3F4F6" }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.9rem" }}>{product.title}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>{product.description.substring(0, 75)}...</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-neutral" style={{ fontSize: "0.7rem", fontWeight: 600 }}>{product.categoryName || "General"}</span></td>
                  <td style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--text-secondary)" }}>{product.sku}</td>
                  <td><span style={{ fontWeight: 700 }}>{product.formattedPrice}</span></td>
                  <td>
                    {product.stockQuantity === 0 ? (
                      <span className="badge badge-danger">OUT OF STOCK</span>
                    ) : product.stockQuantity <= 5 ? (
                      <span className="badge badge-warning">LOW STOCK ({product.stockQuantity})</span>
                    ) : (
                      <span className="badge badge-success">IN STOCK ({product.stockQuantity})</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${product.status === "ACTIVE" ? "badge-success" : product.status === "DRAFT" ? "badge-warning" : "badge-neutral"}`}>
                      {product.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "8px" }}>
                      <button className={styles.secondaryBtn} style={{ padding: "6px 10px" }} onClick={() => handleOpenEditModal(product)} disabled={mutatingId === product.id} title="Edit Details"><EditIcon size={14} /></button>
                      <button className={styles.secondaryBtn} style={{ padding: "6px 10px", color: "#ef4444", borderColor: "rgba(239,68,68,0.2)" }} onClick={() => handleDelete(product.id, product.title)} disabled={mutatingId === product.id} title="Delete Product"><TrashIcon size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{editingProduct ? "Modify Listing Details" : "Create New Product Listing"}</h3>
              <button className={styles.closeBtn} onClick={handleCloseModal}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className={styles.modalBody}>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Product Title *</label>
                  <input type="text" className={styles.searchInput} value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                {/* FEAT-003: Brand dropdown — fetched from /api/v1/brands */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Brand <span style={{ fontWeight: 400, color: "var(--text-secondary)" }}>(optional)</span></label>
                  <select
                    id="product-brand-select"
                    className={styles.filterSelect}
                    style={{ width: "100%" }}
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                    disabled={brandsLoading}
                  >
                    <option value="">— No Brand / Unbranded —</option>
                    {availableBrands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                  {brandsLoading && <small style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>Loading brands...</small>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>SKU Code *</label>
                    <input type="text" className={styles.searchInput} value={sku} onChange={(e) => setSku(e.target.value)} required />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Listing Status</label>
                    <select className={styles.filterSelect} style={{ width: "100%" }} value={status} onChange={(e) => setStatus(e.target.value as any)}>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="DRAFT">DRAFT</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Selling Price (₹) *</label>
                    <input type="number" className={styles.searchInput} value={price} onChange={(e) => setPrice(e.target.value)} required />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Stock Qty *</label>
                    <input type="number" className={styles.searchInput} value={stock} onChange={(e) => setStock(e.target.value)} required />
                  </div>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Image URL</label>
                  <input type="url" className={styles.searchInput} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Description</label>
                  <textarea className={styles.searchInput} style={{ minHeight: "80px" }} value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.secondaryBtn} onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className={styles.primaryBtn}>{editingProduct ? "Save Changes" : "Create Listing"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
