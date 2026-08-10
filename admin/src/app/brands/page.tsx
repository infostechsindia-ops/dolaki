"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Plus, Edit, Trash2, Tag, CheckCircle, XCircle, RefreshCw, AlertTriangle } from "lucide-react";
import styles from "../crud.module.css";

// FEAT-003: Admin Brand Management Console
// Connects directly to the BrandsController at /api/v1/brands.
// Requires SUPER_ADMIN or CATALOG_ADMIN role (enforced by backend).
// SUPER_ADMIN can deactivate brands; CATALOG_ADMIN can create/edit but NOT delete.

interface AdminBrandDto {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string | null;
  isActive: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const API = `${BASE_URL}/api/v1`;

function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token") || localStorage.getItem("token");
}

function authHeaders(): Record<string, string> {
  const token = getAdminToken();
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}

// ─── Brand Form Modal ─────────────────────────────────────────────────────────

interface BrandFormProps {
  brand: AdminBrandDto | null;
  onClose: () => void;
  onSaved: () => void;
}

function BrandFormModal({ brand, onClose, onSaved }: BrandFormProps) {
  const isEdit = !!brand;
  const [name, setName] = useState(brand?.name || "");
  const [slug, setSlug] = useState(brand?.slug || "");
  const [description, setDescription] = useState(brand?.description || "");
  const [logoUrl, setLogoUrl] = useState(brand?.logoUrl || "");
  const [isActive, setIsActive] = useState(brand?.isActive !== false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from name when creating
  useEffect(() => {
    if (!isEdit && name) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  }, [name, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) { setError("Brand name is required."); return; }
    if (!slug.trim()) { setError("Brand slug is required."); return; }
    if (!/^[a-z0-9-]+$/.test(slug)) { setError("Slug must contain only lowercase letters, digits, and hyphens."); return; }

    setSubmitting(true);
    try {
      const url = isEdit
        ? `${API}/brands/${brand!.slug}`
        : `${API}/brands`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify({ name: name.trim(), slug: slug.trim(), description: description.trim() || null, logoUrl: logoUrl.trim() || null, isActive }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Request failed with status ${res.status}`);
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save brand.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{isEdit ? "Edit Brand" : "Create New Brand"}</h2>
          <button className={styles.modalCloseBtn} onClick={onClose} aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          {error && (
            <div className={styles.errorBanner}>
              <AlertTriangle size={14} /> {error}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="brand-name">Brand Name *</label>
            <input
              id="brand-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. AuraTech, GlobalFood, NovaSports"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="brand-slug">
              Slug * <small style={{ color: "var(--text-light)", fontWeight: 400 }}>(URL-safe, lowercase-only)</small>
            </label>
            <input
              id="brand-slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              placeholder="e.g. auratech, global-food, nova-sports"
              className={styles.input}
              required
              disabled={isEdit} // Slug is immutable after creation to preserve SEO/URLs
            />
            {isEdit && (
              <small style={{ color: "var(--text-light)" }}>Slug cannot be changed after creation (SEO stability).</small>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="brand-desc">Description</label>
            <textarea
              id="brand-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the brand..."
              className={styles.textarea}
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="brand-logo">Logo URL</label>
            <input
              id="brand-logo"
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://cdn.example.com/brand-logo.png"
              className={styles.input}
            />
            {logoUrl && (
              <div style={{ marginTop: 8 }}>
                <img src={logoUrl} alt="Brand logo preview" style={{ height: 48, objectFit: "contain", borderRadius: 6, border: "1px solid var(--border-color)" }} onError={(e) => (e.currentTarget.style.display = "none")} />
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="brand-active" style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <input
                id="brand-active"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                style={{ width: 16, height: 16 }}
              />
              Active — brand is visible in customer-facing catalog
            </label>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.btnSecondary} onClick={onClose} disabled={submitting}>Cancel</button>
            <button type="submit" className={styles.btn} disabled={submitting}>
              {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Brand"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Brand Management Page ───────────────────────────────────────────────

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<AdminBrandDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [totalBrands, setTotalBrands] = useState(0);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [brandToEdit, setBrandToEdit] = useState<AdminBrandDto | null>(null);
  const [deactivating, setDeactivating] = useState<string | null>(null);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ pageSize: "100" });
      if (showInactive) params.set("includeInactive", "true");
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`${API}/brands?${params.toString()}`, {
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error(`Failed to fetch brands (${res.status})`);

      const body = await res.json();
      const list: AdminBrandDto[] = body.data ?? body ?? [];
      setBrands(list);
      setTotalBrands(body.meta?.total ?? list.length);
    } catch (err: any) {
      setError(err.message || "Could not load brands.");
    } finally {
      setLoading(false);
    }
  }, [showInactive, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(fetchBrands, 300);
    return () => clearTimeout(timer);
  }, [fetchBrands]);

  const handleOpenCreate = () => {
    setBrandToEdit(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (brand: AdminBrandDto) => {
    setBrandToEdit(brand);
    setModalOpen(true);
  };

  const handleDeactivate = async (brand: AdminBrandDto) => {
    if (!confirm(`Deactivate "${brand.name}"? It will be hidden from the customer catalog. Products remain but brand won't appear in /brands.`)) return;
    setDeactivating(brand.slug);
    try {
      const res = await fetch(`${API}/brands/${brand.slug}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Failed to deactivate brand (${res.status})`);
      }
      await fetchBrands();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setDeactivating(null);
    }
  };

  const handleReactivate = async (brand: AdminBrandDto) => {
    try {
      const res = await fetch(`${API}/brands/${brand.slug}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ isActive: true }),
      });
      if (!res.ok) throw new Error("Failed to reactivate brand");
      await fetchBrands();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.pageWrapper}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h1 className={styles.title}>Brand Management</h1>
          <p className={styles.subtitle}>
            FEAT-003 — {totalBrands} brand{totalBrands !== 1 ? "s" : ""} in catalog. Create, edit, or deactivate official brand stores.
          </p>
        </div>
        <button
          id="create-brand-btn"
          className={styles.btn}
          onClick={handleOpenCreate}
        >
          <Plus size={16} /> New Brand
        </button>
      </div>

      {/* Stats Bar */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <Tag size={20} />
          <span>{brands.filter(b => b.isActive).length} Active</span>
        </div>
        <div className={styles.statCard}>
          <XCircle size={20} />
          <span>{brands.filter(b => !b.isActive).length} Inactive</span>
        </div>
        <div className={styles.statCard}>
          <CheckCircle size={20} />
          <span>{brands.reduce((acc, b) => acc + (b.productCount || 0), 0)} Products Listed</span>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersRow}>
        <div className={styles.searchWrapper}>
          <Search size={15} className={styles.searchIcon} />
          <input
            id="brand-admin-search"
            type="text"
            placeholder="Search by name or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <label className={styles.checkboxLabel} htmlFor="show-inactive-toggle">
          <input
            id="show-inactive-toggle"
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
          />
          Show deactivated brands
        </label>

        <button
          className={styles.btnSecondary}
          onClick={fetchBrands}
          title="Refresh brands list"
          id="refresh-brands-btn"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className={styles.errorBanner}>
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      {/* Brands Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} id="brands-table">
          <thead>
            <tr>
              <th>Brand</th>
              <th>Slug</th>
              <th>Description</th>
              <th style={{ textAlign: "center" }}>Products</th>
              <th style={{ textAlign: "center" }}>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className={styles.skeletonRow}>
                  <td colSpan={6}>
                    <div className={styles.skeletonLine} style={{ width: "100%", height: 14 }} />
                  </td>
                </tr>
              ))
            ) : filteredBrands.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "40px 0", color: "var(--text-light)" }}>
                  {searchQuery ? `No brands found matching "${searchQuery}".` : "No brands found. Create your first brand above."}
                </td>
              </tr>
            ) : (
              filteredBrands.map((brand) => (
                <tr key={brand.id} id={`brand-row-${brand.slug}`} style={{ opacity: brand.isActive ? 1 : 0.55 }}>
                  <td>
                    <div className={styles.productCell}>
                      {brand.logoUrl ? (
                        <img
                          src={brand.logoUrl}
                          alt={brand.name}
                          className={styles.productImage}
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      ) : (
                        <div className={styles.productImagePlaceholder}>
                          <Tag size={14} />
                        </div>
                      )}
                      <div>
                        <span className={styles.productName}>{brand.name}</span>
                        <span className={styles.productId}>Created {new Date(brand.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <code style={{ fontSize: "0.78rem", background: "var(--bg-secondary, #F1F5F9)", padding: "2px 8px", borderRadius: 4 }}>
                      {brand.slug}
                    </code>
                  </td>
                  <td style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-light)" }}>
                    {brand.description || <em style={{ opacity: 0.5 }}>No description</em>}
                  </td>
                  <td style={{ textAlign: "center", fontWeight: 700 }}>
                    {brand.productCount}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {brand.isActive ? (
                      <span className={styles.badgeSuccess}>Active</span>
                    ) : (
                      <span className={styles.badgeDanger}>Inactive</span>
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className={styles.actions}>
                      <button
                        id={`edit-brand-${brand.slug}`}
                        className={styles.actionBtn}
                        onClick={() => handleOpenEdit(brand)}
                        title={`Edit ${brand.name}`}
                      >
                        <Edit size={14} />
                      </button>
                      {brand.isActive ? (
                        <button
                          id={`deactivate-brand-${brand.slug}`}
                          className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                          onClick={() => handleDeactivate(brand)}
                          disabled={deactivating === brand.slug}
                          title={`Deactivate ${brand.name}`}
                        >
                          {deactivating === brand.slug ? <RefreshCw size={14} className={styles.spinning} /> : <Trash2 size={14} />}
                        </button>
                      ) : (
                        <button
                          id={`reactivate-brand-${brand.slug}`}
                          className={`${styles.actionBtn} ${styles.actionBtnSuccess}`}
                          onClick={() => handleReactivate(brand)}
                          title={`Reactivate ${brand.name}`}
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Brand Form Modal */}
      {modalOpen && (
        <BrandFormModal
          brand={brandToEdit}
          onClose={() => setModalOpen(false)}
          onSaved={fetchBrands}
        />
      )}
    </div>
  );
}
