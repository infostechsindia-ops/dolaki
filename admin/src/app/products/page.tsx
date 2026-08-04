"use client";

import React, { useState } from "react";
import { Search, Plus, Edit, Trash2, ArrowUpDown, Tag, ShoppingBag, Eye, AlertTriangle } from "lucide-react";
import { useAdmin, Product, Category } from "@/context/AdminContext";
import ProductModal from "@/components/modals/ProductModal";
import CategoryModal from "@/components/modals/CategoryModal";
import styles from "../crud.module.css";

export default function ProductsPage() {
  const { products, categories, deleteProduct, deleteCategory } = useAdmin();

  // Tab State
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");

  // Product Search/Filter States
  const [productSearch, setProductSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  // Category Search State
  const [categorySearch, setCategorySearch] = useState("");

  // Modal Control States
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  // PRODUCT CRUD WRAPPERS
  const handleAddProductClick = () => {
    setProductToEdit(null);
    setProductModalOpen(true);
  };

  const handleEditProductClick = (product: Product) => {
    setProductToEdit(product);
    setProductModalOpen(true);
  };

  const handleDeleteProductClick = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  // CATEGORY CRUD WRAPPERS
  const handleAddCategoryClick = () => {
    setCategoryToEdit(null);
    setCategoryModalOpen(true);
  };

  const handleEditCategoryClick = (category: Category) => {
    setCategoryToEdit(category);
    setCategoryModalOpen(true);
  };

  const handleDeleteCategoryClick = (id: string) => {
    if (confirm("Are you sure you want to delete this category? Any products under it will remain but won't belong to a synchronized category.")) {
      deleteCategory(id);
    }
  };

  // Filters logic for products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.id.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.vendor.toLowerCase().includes(productSearch.toLowerCase());

    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;

    let matchesStock = true;
    if (stockFilter === "instock") matchesStock = p.stock > 10;
    else if (stockFilter === "lowstock") matchesStock = p.stock > 0 && p.stock <= 10;
    else if (stockFilter === "out") matchesStock = p.stock === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Filters logic for categories
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
    c.slug.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const getProductStatusBadge = (p: Product) => {
    if (p.stock === 0) return "badge badge-danger";
    if (p.status === "draft") return "badge badge-muted";
    if (p.stock <= 10) return "badge badge-warning";
    return "badge badge-success";
  };

  const getProductStatusLabel = (p: Product) => {
    if (p.stock === 0) return "Out of stock";
    if (p.status === "draft") return "Draft";
    if (p.stock <= 10) return `Low Stock (${p.stock})`;
    return "In Stock";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Page Title & CTAs */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h2 className={styles.title}>Catalog Management</h2>
          <p className={styles.subtitle}>Create, update and structure products and product categories.</p>
        </div>

        <div>
          {activeTab === "products" ? (
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAddProductClick}>
              <Plus size={16} /> Add Product
            </button>
          ) : (
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAddCategoryClick}>
              <Plus size={16} /> Add Category
            </button>
          )}
        </div>
      </div>

      {/* Tabs Selector */}
      <div style={{ display: "flex", gap: "1rem", borderBottom: "2px solid var(--border)", paddingBottom: "1px" }}>
        <button
          onClick={() => setActiveTab("products")}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "0.95rem",
            fontWeight: 600,
            color: activeTab === "products" ? "var(--primary)" : "var(--text-light)",
            borderBottom: activeTab === "products" ? "3px solid var(--primary)" : "3px solid transparent",
            transition: "all var(--transition-fast)",
            marginBottom: "-2px"
          }}
        >
          All Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "0.95rem",
            fontWeight: 600,
            color: activeTab === "categories" ? "var(--primary)" : "var(--text-light)",
            borderBottom: activeTab === "categories" ? "3px solid var(--primary)" : "3px solid transparent",
            transition: "all var(--transition-fast)",
            marginBottom: "-2px"
          }}
        >
          Categories ({categories.length})
        </button>
      </div>

      {/* TAB CONTENT: PRODUCTS */}
      {activeTab === "products" && (
        <>
          {/* Search & Filter Bar */}
          <div className={styles.filterBar}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search products by ID, name, vendor..."
                className={styles.searchInput}
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
            </div>

            <div className={styles.filtersGroup}>
              <select
                className={styles.filterSelect}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter category"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                className={styles.filterSelect}
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                aria-label="Filter stock"
              >
                <option value="all">All Inventory</option>
                <option value="instock">In Stock ({`>10`})</option>
                <option value="lowstock">Low Stock (1-10)</option>
                <option value="out">Out of Stock (0)</option>
              </select>
            </div>
          </div>

          {/* Products Table */}
          <div className={styles.tableContainer}>
            {filteredProducts.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Vendor</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Total Sales</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className={styles.productItem}>
                          <div className={styles.productImgPlaceholder}>
                            {p.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className={styles.productMeta}>
                            <span className={styles.productName}>{p.name}</span>
                            <span className={styles.productId}>{p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-muted" style={{ fontWeight: 500 }}>
                          {p.category}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.85rem", fontWeight: 500 }}>{p.vendor}</td>
                      <td style={{ fontWeight: 600, color: "var(--text-main)" }}>
                        ₹{p.price.toLocaleString("en-IN")}
                      </td>
                      <td style={{ fontWeight: 500 }}>{p.stock} units</td>
                      <td>{p.sales} units</td>
                      <td style={{ color: "#f59e0b", fontWeight: 600 }}>★ {p.rating.toFixed(1)}</td>
                      <td>
                        <span className={getProductStatusBadge(p)}>{getProductStatusLabel(p)}</span>
                      </td>
                      <td>
                        <div className={styles.actions} style={{ justifyContent: "flex-end" }}>
                          <button
                            className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                            title="Edit Product"
                            onClick={() => handleEditProductClick(p)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                            title="Delete Product"
                            onClick={() => handleDeleteProductClick(p.id)}
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
                <h3 className={styles.emptyStateTitle}>No products found</h3>
                <p>Add a new product or adjust filters.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* TAB CONTENT: CATEGORIES */}
      {activeTab === "categories" && (
        <>
          {/* Search bar */}
          <div className={styles.filterBar}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search categories by name or slug..."
                className={styles.searchInput}
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
              />
            </div>
          </div>

          {/* Categories Table */}
          <div className={styles.tableContainer}>
            {filteredCategories.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Category ID</th>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Connected Products</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600, color: "var(--primary)" }}>{c.id}</td>
                      <td style={{ fontWeight: 600, color: "var(--text-main)" }}>{c.name}</td>
                      <td>
                        <code
                          style={{
                            backgroundColor: "var(--background)",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "4px",
                            fontSize: "0.8rem",
                            color: "var(--primary)"
                          }}
                        >
                          /{c.slug}
                        </code>
                      </td>
                      <td style={{ fontWeight: 500 }}>{c.productCount} items</td>
                      <td>
                        <span className={`badge ${c.status === "active" ? "badge-success" : "badge-muted"}`}>
                          {c.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions} style={{ justifyContent: "flex-end" }}>
                          <button
                            className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                            title="Edit Category"
                            onClick={() => handleEditCategoryClick(c)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                            title="Delete Category"
                            onClick={() => handleDeleteCategoryClick(c.id)}
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
                <h3 className={styles.emptyStateTitle}>No categories found</h3>
                <p>Create a new category to organize your grocery items.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* PRODUCT MODAL */}
      <ProductModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        productToEdit={productToEdit}
      />

      {/* CATEGORY MODAL */}
      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        categoryToEdit={categoryToEdit}
      />
    </div>
  );
}
