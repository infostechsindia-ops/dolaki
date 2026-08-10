"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Check,
  X,
  RefreshCw,
  AlertCircle,
  FileText,
  Search,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/config";

export interface CmsMediaAssetDTO {
  id: string;
  originalFilename: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
  width?: number | null;
  height?: number | null;
  assetType: string;
  publicUrl: string;
  altText?: string | null;
  uploadedByUserId: string;
  createdAt: string;
}

interface BannerAssetPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (asset: { publicUrl: string; altText?: string; filename: string }) => void;
  currentImageUrl?: string;
  assetTypeFilter?: string;
}

export default function BannerAssetPicker({
  isOpen,
  onClose,
  onSelectAsset,
  currentImageUrl,
  assetTypeFilter = "HERO_BANNER",
}: BannerAssetPickerProps) {
  const [assets, setAssets] = useState<CmsMediaAssetDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || localStorage.getItem("token") : null;
      const url = `${API_BASE_URL}/api/v1/admin/cms/assets?search=${encodeURIComponent(search)}`;
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error("Failed to fetch media assets");
      let data = await res.json();
      if (data && typeof data === "object" && "data" in data) data = data.data;

      setAssets(data.assets || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load media library");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (isOpen) {
      fetchAssets();
    }
  }, [isOpen, fetchAssets]);

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    // 1. Client validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file format "${file.type}". Only JPG, PNG, and WebP are allowed.`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds maximum allowed limit of 5MB.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || localStorage.getItem("token") : null;

        const res = await fetch(`${API_BASE_URL}/api/v1/admin/cms/assets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            filename: file.name,
            mimeType: file.type,
            base64Data,
            assetType: assetTypeFilter,
            altText: altText || file.name.replace(/\.[^/.]+$/, ""),
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to upload image asset");
        }

        const uploadedAsset = await res.json();
        const assetData = uploadedAsset.data || uploadedAsset;
        setAssets((prev) => [assetData, ...prev]);
        setSelectedAssetId(assetData.id);
        setAltText(assetData.altText || "");
      };
    } catch (err: any) {
      setError(err?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAsset = async (assetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this media asset?")) return;

    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || localStorage.getItem("token") : null;
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/cms/assets/${assetId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Cannot delete asset");
      }

      setAssets((prev) => prev.filter((a) => a.id !== assetId));
      if (selectedAssetId === assetId) {
        setSelectedAssetId(null);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to delete asset");
    }
  };

  const handleConfirmSelect = () => {
    const asset = assets.find((a) => a.id === selectedAssetId);
    if (!asset) return;

    const fullUrl = asset.publicUrl.startsWith("http")
      ? asset.publicUrl
      : `${API_BASE_URL}${asset.publicUrl}`;

    onSelectAsset({
      publicUrl: fullUrl,
      altText: altText || asset.altText || asset.originalFilename,
      filename: asset.originalFilename,
    });
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          width: "850px",
          maxWidth: "100%",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid #E5E7EB",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#F9FAFB",
          }}
        >
          <div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#111827", margin: 0 }}>
              CMS Banner Media Asset Manager
            </h3>
            <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>
              Upload and select high-resolution banner assets for layout placement
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ border: "none", background: "none", cursor: "pointer", color: "#6B7280", padding: "4px" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Alert Display */}
        {error && (
          <div
            style={{
              padding: "0.875rem 1.5rem",
              backgroundColor: "#FEF2F2",
              borderBottom: "1px solid #FCA5A5",
              color: "#991B1B",
              fontSize: "0.8125rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AlertCircle size={16} />
            <span style={{ flex: 1 }}>{error}</span>
            <button
              onClick={() => setError(null)}
              style={{ border: "none", background: "none", cursor: "pointer", color: "#991B1B", fontWeight: 700 }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Content Body */}
        <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            style={{
              border: `2px dashed ${isDragOver ? "#4F46E5" : "#D1D5DB"}`,
              backgroundColor: isDragOver ? "#EEF2FF" : "#F9FAFB",
              borderRadius: "8px",
              padding: "1.5rem",
              textAlign: "center",
              transition: "all 0.2s ease-in-out",
            }}
          >
            {uploading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <RefreshCw size={24} style={{ animation: "spin 1s linear infinite", color: "#4F46E5" }} />
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#4B5563" }}>
                  Uploading & validating media asset...
                </span>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <Upload size={28} style={{ color: "#6B7280" }} />
                <div>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#111827" }}>
                    Drag and drop your banner image here
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#6B7280", display: "block", marginTop: "2px" }}>
                    Supports JPG, PNG, WebP up to 5MB (Server Authoritative Validation)
                  </span>
                </div>
                <label
                  style={{
                    marginTop: "8px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "#4F46E5",
                    color: "#FFFFFF",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <FileText size={14} /> Browse Local File
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Search & Media Grid Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 800, color: "#374151" }}>
              Media Library ({assets.length} assets)
            </span>
            <div style={{ position: "relative", width: "240px" }}>
              <Search size={14} style={{ position: "absolute", left: "10px", top: "10px", color: "#9CA3AF" }} />
              <input
                type="text"
                placeholder="Search filename..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 12px 6px 30px",
                  borderRadius: "6px",
                  border: "1px solid #D1D5DB",
                  fontSize: "0.8rem",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Media Grid */}
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#6B7280" }}>
              <RefreshCw size={20} style={{ animation: "spin 1s linear infinite", marginBottom: "8px" }} />
              <p style={{ margin: 0, fontSize: "0.85rem" }}>Loading media assets...</p>
            </div>
          ) : assets.length === 0 ? (
            <div style={{ padding: "3rem 1.5rem", textAlign: "center", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px dashed #E5E7EB" }}>
              <ImageIcon size={36} style={{ color: "#9CA3AF", marginBottom: "8px" }} />
              <p style={{ fontSize: "0.875rem", color: "#4B5563", fontWeight: 700, margin: "0 0 4px 0" }}>
                No media assets found
              </p>
              <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>
                Upload your first banner image using the dropzone above.
              </span>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "1rem",
                maxHeight: "320px",
                overflowY: "auto",
                paddingRight: "4px",
              }}
            >
              {assets.map((asset) => {
                const isSelected = selectedAssetId === asset.id;
                const fullUrl = asset.publicUrl.startsWith("http")
                  ? asset.publicUrl
                  : `${API_BASE_URL}${asset.publicUrl}`;

                return (
                  <div
                    key={asset.id}
                    onClick={() => {
                      setSelectedAssetId(asset.id);
                      setAltText(asset.altText || asset.originalFilename);
                    }}
                    style={{
                      border: `2px solid ${isSelected ? "#4F46E5" : "#E5E7EB"}`,
                      borderRadius: "8px",
                      overflow: "hidden",
                      cursor: "pointer",
                      backgroundColor: "#FFFFFF",
                      position: "relative",
                      transition: "all 0.15s ease",
                      boxShadow: isSelected ? "0 0 0 2px rgba(79, 70, 229, 0.2)" : "none",
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{ height: "100px", backgroundColor: "#F3F4F6", overflow: "hidden", position: "relative" }}>
                      <img
                        src={fullUrl}
                        alt={asset.altText || asset.originalFilename}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          // Fallback placeholder
                          (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300";
                        }}
                      />
                      {isSelected && (
                        <div
                          style={{
                            position: "absolute",
                            top: "6px",
                            right: "6px",
                            backgroundColor: "#4F46E5",
                            color: "#FFFFFF",
                            borderRadius: "50%",
                            padding: "2px",
                            display: "flex",
                          }}
                        >
                          <Check size={14} />
                        </div>
                      )}
                    </div>

                    {/* Meta info */}
                    <div style={{ padding: "8px" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "#111827",
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={asset.originalFilename}
                      >
                        {asset.originalFilename}
                      </span>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6875rem", color: "#6B7280", marginTop: "2px" }}>
                        <span>{formatFileSize(asset.sizeBytes)}</span>
                        <button
                          onClick={(e) => handleDeleteAsset(asset.id, e)}
                          style={{ border: "none", background: "none", color: "#EF4444", cursor: "pointer", padding: "0" }}
                          title="Delete asset"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Alt Text Field for Selected Asset */}
          {selectedAssetId && (
            <div style={{ padding: "1rem", backgroundColor: "#EEF2FF", borderRadius: "8px", border: "1px solid #C7D2FE" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#3730A3", display: "block", marginBottom: "4px" }}>
                Banner Accessible Alt-Text
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Descriptive alt text for screen readers..."
                style={{
                  width: "100%",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #A5B4FC",
                  fontSize: "0.8rem",
                  outline: "none",
                }}
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid #E5E7EB",
            backgroundColor: "#F9FAFB",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #D1D5DB",
              borderRadius: "6px",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#374151",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <div style={{ display: "flex", gap: "8px" }}>
            {currentImageUrl && (
              <button
                onClick={() => {
                  onSelectAsset({ publicUrl: "", filename: "" });
                  onClose();
                }}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#FEE2E2",
                  color: "#DC2626",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Unassign Image
              </button>
            )}

            <button
              onClick={handleConfirmSelect}
              disabled={!selectedAssetId}
              style={{
                padding: "8px 20px",
                backgroundColor: "#4F46E5",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: selectedAssetId ? "pointer" : "not-allowed",
                opacity: selectedAssetId ? 1 : 0.5,
              }}
            >
              Select & Bind Asset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
