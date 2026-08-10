'use client';

import React, { useState, useEffect } from 'react';
import { Folder, Search, Tag, Image as ImageIcon, Trash2, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';

interface MediaAsset {
  id: string;
  originalFilename: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  assetType: string;
  publicUrl: string;
  altText?: string;
  usageCount: number;
  usedInLocations: string[];
  createdAt: string;
}

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMediaAssets();
  }, [search, selectedTag]);

  const fetchMediaAssets = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/api/v1/admin/cms/assets?search=${encodeURIComponent(search)}${selectedTag !== 'ALL' ? `&assetType=${selectedTag}` : ''}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } });
      if (res.ok) {
        const data = await res.json();
        setAssets(data.assets || []);
      }
    } catch {
      setError('Failed to load media assets from server');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAsset = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media asset?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/cms/assets/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
      });
      if (res.ok) {
        setAssets(assets.filter((a) => a.id !== id));
      } else {
        const errData = await res.json();
        alert(errData.message || 'Cannot delete referenced media asset');
      }
    } catch {
      alert('Error connecting to backend API');
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0F172A' }}>📁 Enterprise Media Library</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
            Manage promotional banners, brand logos, category images, and track asset usage across SDUI layouts.
          </p>
        </div>
        <button
          onClick={fetchMediaAssets}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#0F172A',
            color: 'white',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={16} /> Refresh Assets
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', backgroundColor: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search assets by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none' }}
          />
        </div>
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none' }}
        >
          <option value="ALL">All Asset Types</option>
          <option value="HERO_BANNER">Hero Banners</option>
          <option value="BRAND_LOGO">Brand Logos</option>
          <option value="CATEGORY_BANNER">Category Banners</option>
          <option value="PROMO_STRIP">Promo Strips</option>
        </select>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>Loading media assets...</div>
      ) : assets.length === 0 ? (
        <div style={{ padding: '48px', textAlign: 'center', backgroundColor: 'white', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
          <ImageIcon size={48} style={{ color: '#94A3B8', marginBottom: '12px' }} />
          <p style={{ color: '#64748B' }}>No media assets found in library matching criteria.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {assets.map((asset) => (
            <div key={asset.id} style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '160px', backgroundColor: '#F8FAFC', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src={asset.publicUrl} alt={asset.altText || asset.originalFilename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: '8px', right: '8px', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: asset.usageCount > 0 ? '#DCFCE7' : '#F1F5F9', color: asset.usageCount > 0 ? '#166534' : '#475569' }}>
                  {asset.usageCount > 0 ? `In Use (${asset.usageCount})` : 'Unused'}
                </span>
              </div>
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#0F172A', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={asset.originalFilename}>
                    {asset.originalFilename}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '8px' }}>
                    {(asset.sizeBytes / 1024).toFixed(1)} KB • {asset.mimeType}
                  </p>
                  {asset.usedInLocations && asset.usedInLocations.length > 0 && (
                    <div style={{ fontSize: '0.75rem', color: '#166534', backgroundColor: '#F0FDF4', padding: '4px 8px', borderRadius: '4px', marginBottom: '12px' }}>
                      📍 Used in: {asset.usedInLocations.join(', ')}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>ID: {asset.id.slice(0, 8)}</span>
                  <button
                    onClick={() => handleDeleteAsset(asset.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 12px',
                      backgroundColor: asset.usageCount > 0 ? '#F1F5F9' : '#FEE2E2',
                      color: asset.usageCount > 0 ? '#94A3B8' : '#DC2626',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      cursor: asset.usageCount > 0 ? 'not-allowed' : 'pointer',
                    }}
                    title={asset.usageCount > 0 ? 'Cannot delete asset referenced in active CMS layouts' : 'Delete asset'}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
