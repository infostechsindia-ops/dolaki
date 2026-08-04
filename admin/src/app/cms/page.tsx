'use client';

import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Save, 
  Plus, 
  Trash2, 
  Check, 
  RefreshCw, 
  Tv, 
  Grid, 
  Image as ImageIcon, 
  ShoppingBag, 
  Sparkles, 
  Tag, 
  Zap, 
  AlertCircle
} from 'lucide-react';
import styles from './cms.module.css';

interface CMSSection {
  id: string;
  type: string;
  visible: boolean;
  order: number;
  title?: string;
  config: any;
}

interface CMSConfig {
  sections: CMSSection[];
  lastUpdated: string;
  publishedBy: string;
  version: number;
}

export default function CMSManagerPage() {
  const [config, setConfig] = useState<CMSConfig | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'homepage' | 'flado'>('homepage');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSectionType, setNewSectionType] = useState('');
  const [newSectionTitle, setNewSectionTitle] = useState('');

  // Fetch active layout from backend API when tab changes
  useEffect(() => {
    fetchLayout(activeTab);
  }, [activeTab]);

  const fetchLayout = async (tab: 'homepage' | 'flado') => {
    setLoading(true);
    const endpoint = tab === 'homepage' ? 'homepage' : 'flado';
    try {
      const res = await fetch(`http://localhost:5000/api/sdui/${endpoint}`);
      if (res.ok) {
        const data = await res.json();
        if (data.sections) {
          data.sections.sort((a: any, b: any) => a.order - b.order);
        }
        setConfig(data);
        if (data.sections && data.sections.length > 0) {
          setSelectedSectionId(data.sections[0].id);
        } else {
          setSelectedSectionId(null);
        }
      }
    } catch (e) {
      console.error('Failed to connect to backend api. Using local mockup storage.', e);
      const localMockKey = tab === 'homepage' ? 'auramart_cms_config_v2' : 'auramart_cms_config_flado';
      const localMock = localStorage.getItem(localMockKey);
      if (localMock) {
        setConfig(JSON.parse(localMock));
      } else {
        setConfig(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!config) return;
    setPublishing(true);
    setStatusMessage(null);
    const endpoint = activeTab === 'homepage' ? 'homepage' : 'flado';
    try {
      const res = await fetch(`http://localhost:5000/api/sdui/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          setConfig(result.config);
          const localMockKey = activeTab === 'homepage' ? 'auramart_cms_config_v2' : 'auramart_cms_config_flado';
          localStorage.setItem(localMockKey, JSON.stringify(result.config));
          window.dispatchEvent(new Event('cms-updated'));
          setStatusMessage({ type: 'success', text: `${activeTab === 'homepage' ? 'Homepage' : 'Flado'} layout successfully published! Now synced live on Web & App.` });
        } else {
          setStatusMessage({ type: 'error', text: result.error || 'Server rejected CMS save request.' });
        }
      }
    } catch (e) {
      console.error(e);
      const updated = {
        ...config,
        version: config.version + 1,
        lastUpdated: new Date().toISOString()
      };
      setConfig(updated);
      const localMockKey = activeTab === 'homepage' ? 'auramart_cms_config_v2' : 'auramart_cms_config_flado';
      localStorage.setItem(localMockKey, JSON.stringify(updated));
      setStatusMessage({ type: 'success', text: 'CMS saved locally! Start NestJS backend (port 5000) to sync across other servers.' });
    } finally {
      setPublishing(false);
    }
  };

  const addSection = () => {
    if (!config || !newSectionType) return;
    
    let defaultSectionConfig = {};
    switch (newSectionType) {
      case 'top_announcement':
        defaultSectionConfig = { text: 'New promo announcement text here', link: '', backgroundColor: '#7C3AED', textColor: '#FFFFFF' };
        break;
      case 'hero_banners':
        defaultSectionConfig = { autoPlayInterval: 4000, banners: [] };
        break;
      case 'flado_banner':
        defaultSectionConfig = { title: '⚡ Flado 10-Minute Delivery', subtitle: 'Groceries & snacks delivered instantly', ctaText: 'Order Now', ctaUrl: '/flado', backgroundColor: '#059669', imageUrl: '' };
        break;
      case 'category_grid':
        defaultSectionConfig = { categories: [] };
        break;
      case 'flash_sale':
        defaultSectionConfig = { title: '⚡ Hourly Lightning Deals', subtitle: 'Unmatched prices, closing real fast!', expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), deals: [] };
        break;
      case 'live_deal':
        defaultSectionConfig = { productId: '', productName: '', productImage: '', originalPrice: 1000, livePrice: 500, hostName: 'Host Name' };
        break;
      case 'product_strip':
        defaultSectionConfig = { title: 'Bestselling Items', subtitle: 'Curated list', productIds: [] };
        break;
      case 'brand_spotlight':
        defaultSectionConfig = { title: 'Exclusive Brand Spotlight', subtitle: 'Shop directly from flagship stores', brands: [] };
        break;
      case 'sponsor_strip':
        defaultSectionConfig = { title: 'Sponsored Brands', brands: [] };
        break;
      case 'new_launches':
      case 'trending_now':
        defaultSectionConfig = { title: 'New launches', subtitle: 'Hot stuff', productIds: [] };
        break;
      case 'collection_cards':
        defaultSectionConfig = { title: 'Curated Collections', collections: [] };
        break;
      case 'look_book':
        defaultSectionConfig = { title: 'AuraStudio Lookbooks', subtitle: 'Swipe', items: [] };
        break;
      case 'promo_strip':
        defaultSectionConfig = { title: 'Promo banner strip text', ctaUrl: '/profile', backgroundColor: '#F59E0B', textColor: '#1E293B' };
        break;

      // Flado quick commerce types
      case 'flado_hero_carousel':
        defaultSectionConfig = { autoPlayInterval: 4000, banners: [] };
        break;
      case 'flado_category_pills':
        defaultSectionConfig = { categories: [] };
        break;
      case 'flado_offers_strip':
        defaultSectionConfig = { offers: [] };
        break;
      case 'flado_promo_banner':
        defaultSectionConfig = { imageUrl: '', title: 'Snacks and beverages ad title', ctaUrl: '/flado', backgroundColor: '#D1FAE5', textColor: '#065F46' };
        break;
      case 'flado_sponsor_row':
        defaultSectionConfig = { title: 'Sponsored Deals', brands: [] };
        break;
      case 'flado_brand_zone':
        defaultSectionConfig = { brandName: 'Brand Store', bannerUrl: '', productSlug: '', tagline: 'Slogan text here', badgeColor: '#1E3A8A' };
        break;
      case 'flado_product_row':
        defaultSectionConfig = { title: 'Fruits & Vegetables', subCategory: 'Fruits & Vegetables' };
        break;
    }

    const newSectionId = `${newSectionType}_${Date.now()}`;
    const newSection = {
      id: newSectionId,
      type: newSectionType,
      visible: true,
      order: config.sections.length,
      title: newSectionTitle || getSectionName(newSectionType),
      config: defaultSectionConfig
    };

    const updatedSections = [...config.sections, newSection];
    setConfig({ ...config, sections: updatedSections });
    setSelectedSectionId(newSectionId);
    setShowAddModal(false);
    setNewSectionType('');
    setNewSectionTitle('');
  };

  const deleteSection = (id: string) => {
    if (!config) return;
    if (!confirm('Are you sure you want to delete this section block?')) return;
    const filtered = config.sections.filter(s => s.id !== id);
    filtered.forEach((s, idx) => {
      s.order = idx;
    });
    setConfig({ ...config, sections: filtered });
    if (selectedSectionId === id) {
      setSelectedSectionId(filtered.length > 0 ? filtered[0].id : null);
    }
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'top_announcement': return <Tag className="section-icon" />;
      case 'hero_banners': return <ImageIcon className="section-icon" />;
      case 'flado_banner': return <Zap className="section-icon" />;
      case 'category_grid': return <Grid className="section-icon" />;
      case 'flash_sale': return <AlertCircle className="section-icon" />;
      case 'live_deal': return <Tv className="section-icon" />;
      case 'product_strip': return <ShoppingBag className="section-icon" />;
      case 'brand_spotlight': return <Sparkles className="section-icon" />;
      case 'sponsor_strip': return <Tag className="section-icon" />;
      case 'new_launches': return <Sparkles className="section-icon" />;
      case 'trending_now': return <Zap className="section-icon" />;
      case 'collection_cards': return <ImageIcon className="section-icon" />;
      case 'look_book': return <Tv className="section-icon" />;
      case 'promo_strip': return <Tag className="section-icon" />;
      // Flado icons mapping
      case 'flado_hero_carousel': return <ImageIcon className="section-icon" />;
      case 'flado_category_pills': return <Grid className="section-icon" />;
      case 'flado_offers_strip': return <Tag className="section-icon" />;
      case 'flado_promo_banner': return <ImageIcon className="section-icon" />;
      case 'flado_sponsor_row': return <Sparkles className="section-icon" />;
      case 'flado_brand_zone': return <ShoppingBag className="section-icon" />;
      case 'flado_product_row': return <ShoppingBag className="section-icon" />;
      default: return <Grid className="section-icon" />;
    }
  };

  const getSectionName = (type: string) => {
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const selectedSection = config?.sections.find(s => s.id === selectedSectionId);

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (!config) return;
    const newSections = [...config.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    newSections.forEach((s, idx) => {
      s.order = idx;
    });

    setConfig({ ...config, sections: newSections });
  };

  const toggleVisibility = (id: string) => {
    if (!config) return;
    const newSections = config.sections.map(s => {
      if (s.id === id) return { ...s, visible: !s.visible };
      return s;
    });
    setConfig({ ...config, sections: newSections });
  };

  const handleConfigChange = (field: string, value: any) => {
    if (!config || !selectedSectionId) return;
    const newSections = config.sections.map(s => {
      if (s.id === selectedSectionId) {
        return {
          ...s,
          config: {
            ...s.config,
            [field]: value
          }
        };
      }
      return s;
    });
    setConfig({ ...config, sections: newSections });
  };

  const handleNestedConfigChange = (arrayField: string, index: number, field: string, value: any) => {
    if (!config || !selectedSectionId || !selectedSection) return;
    const items = [...(selectedSection.config[arrayField] || [])];
    items[index] = {
      ...items[index],
      [field]: value
    };
    handleConfigChange(arrayField, items);
  };

  const addArrayItem = (arrayField: string, defaultObject: any) => {
    if (!config || !selectedSectionId || !selectedSection) return;
    const items = [...(selectedSection.config[arrayField] || [])];
    items.push(defaultObject);
    handleConfigChange(arrayField, items);
  };

  const removeArrayItem = (arrayField: string, index: number) => {
    if (!config || !selectedSectionId || !selectedSection) return;
    const items = [...(selectedSection.config[arrayField] || [])].filter((_, i) => i !== index);
    handleConfigChange(arrayField, items);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <RefreshCw className={styles.spinner} />
        <p>Loading layout from SDUI engine...</p>
      </div>
    );
  }

  return (
    <div className={styles.cmsContainer}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Server-Driven UI (CMS)</h1>
          <p className={styles.subtitle}>Supercharge both AuraMart Customer Web & Mobile App homepage layout in real-time.</p>
        </div>
        <div className={styles.actions}>
          <div className={styles.metaInfo}>
            <span>Version {config?.version || 1}</span>
            <span>Last Published: {config?.lastUpdated ? new Date(config.lastUpdated).toLocaleTimeString() : 'Never'}</span>
          </div>
          <button 
            onClick={handlePublish}
            disabled={publishing}
            className={styles.publishBtn}
            style={{ backgroundColor: activeTab === 'homepage' ? '#7C3AED' : '#059669' }}
          >
            {publishing ? <RefreshCw className={styles.spinnerIcon} /> : <Save size={16} />}
            Publish {activeTab === 'homepage' ? 'Homepage' : 'Flado'} Layout 🚀
          </button>
        </div>
      </header>

      {/* Tabs Switcher */}
      <div style={{ display: 'flex', gap: '16px', margin: '0 0 20px 0', borderBottom: '1px solid #E5E7EB', paddingBottom: '10px' }}>
        <button 
          onClick={() => setActiveTab('homepage')} 
          style={{ 
            padding: '8px 16px', 
            fontWeight: 'bold', 
            borderRadius: '6px', 
            backgroundColor: activeTab === 'homepage' ? '#7C3AED' : '#F3F4F6', 
            color: activeTab === 'homepage' ? 'white' : '#374151',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Homepage Layout CMS
        </button>
        <button 
          onClick={() => setActiveTab('flado')} 
          style={{ 
            padding: '8px 16px', 
            fontWeight: 'bold', 
            borderRadius: '6px', 
            backgroundColor: activeTab === 'flado' ? '#059669' : '#F3F4F6', 
            color: activeTab === 'flado' ? 'white' : '#374151',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Flado Layout CMS ⚡
        </button>
      </div>

      {statusMessage && (
        <div className={`${styles.statusAlert} ${statusMessage.type === 'success' ? styles.successAlert : styles.errorAlert}`}>
          {statusMessage.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className={styles.workspace}>
        {/* Left Column: Sections List */}
        <div className={styles.sectionsPanel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #E5E7EB' }}>
            <div className={styles.panelTitle} style={{ margin: 0 }}>
              {activeTab === 'homepage' ? 'Homepage Blocks' : 'Flado Blocks'}
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                backgroundColor: activeTab === 'homepage' ? '#7C3AED' : '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              <Plus size={14} /> Add Block
            </button>
          </div>
          <div className={styles.sectionsList}>
            {config?.sections?.map((sec, idx) => (
              <div 
                key={sec.id}
                onClick={() => setSelectedSectionId(sec.id)}
                className={`${styles.sectionItem} ${selectedSectionId === sec.id ? styles.sectionItemActive : ''} ${!sec.visible ? styles.sectionItemHidden : ''}`}
              >
                <div className={styles.sectionHeader}>
                  {getSectionIcon(sec.type)}
                  <div>
                    <span className={styles.sectionLabel}>{getSectionName(sec.type)}</span>
                    <span className={styles.sectionId}>{sec.title || sec.id}</span>
                  </div>
                </div>

                <div className={styles.sectionActions} onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => toggleVisibility(sec.id)}
                    className={`${styles.visibilityBtn} ${sec.visible ? styles.visActive : ''}`}
                    title={sec.visible ? 'Hide section' : 'Show section'}
                  >
                    {sec.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button 
                    onClick={() => moveSection(idx, 'up')}
                    disabled={idx === 0}
                    className={styles.orderBtn}
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button 
                    onClick={() => moveSection(idx, 'down')}
                    disabled={idx === config.sections.length - 1}
                    className={styles.orderBtn}
                  >
                    <ArrowDown size={12} />
                  </button>
                  <button 
                    onClick={() => deleteSection(sec.id)}
                    className={styles.orderBtn}
                    style={{ marginLeft: '4px', color: '#EF4444' }}
                    title="Delete section"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Configuration Editor */}
        <div className={styles.editorPanel}>
          {selectedSection ? (
            <div className={styles.editorCard}>
              <div className={styles.editorHeader}>
                <div>
                  <span className={styles.badgeType}>{selectedSection.type}</span>
                  <h3 className={styles.editorTitle}>{getSectionName(selectedSection.type)} Settings</h3>
                </div>
                <div className={styles.editorHeaderControls}>
                  <label className={styles.toggleLabel}>
                    <input 
                      type="checkbox"
                      checked={selectedSection.visible}
                      onChange={() => toggleVisibility(selectedSection.id)}
                    />
                    <span>Visible on Homepage</span>
                  </label>
                </div>
              </div>

              <div className={styles.editorBody}>
                {/* 1. TOP ANNOUNCEMENT EDITOR */}
                {selectedSection.type === 'top_announcement' && (
                  <div className={styles.formGroup}>
                    <label>Announcement Text</label>
                    <textarea 
                      value={selectedSection.config.text || ''}
                      onChange={(e) => handleConfigChange('text', e.target.value)}
                      className={styles.textarea}
                      placeholder="Enter promo text..."
                    />
                    <div className={styles.inputRow}>
                      <div>
                        <label>Background Color</label>
                        <input 
                          type="color"
                          value={selectedSection.config.backgroundColor || '#7C3AED'}
                          onChange={(e) => handleConfigChange('backgroundColor', e.target.value)}
                          className={styles.colorInput}
                        />
                      </div>
                      <div>
                        <label>Text Color</label>
                        <input 
                          type="color"
                          value={selectedSection.config.textColor || '#FFFFFF'}
                          onChange={(e) => handleConfigChange('textColor', e.target.value)}
                          className={styles.colorInput}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. HERO BANNERS EDITOR */}
                {(selectedSection.type === 'hero_banners' || selectedSection.type === 'flado_hero_carousel') && (
                  <div className={styles.formGroup}>
                    <div className={styles.subHeaderRow}>
                      <label>Carousel Slides ({selectedSection.config.banners?.length || 0})</label>
                      <button 
                        onClick={() => addArrayItem('banners', {
                          id: `b-${Date.now()}`,
                          imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
                          title: 'New Campaign Banner',
                          subtitle: 'Write short promo taglines here',
                          ctaText: 'Shop Now',
                          ctaUrl: '/search',
                          backgroundColor: '#4C1D95'
                        })}
                        className={styles.addButton}
                      >
                        <Plus size={14} /> Add Slide
                      </button>
                    </div>

                    <div className={styles.itemsList}>
                      {selectedSection.config.banners?.map((banner: any, bIdx: number) => (
                        <div key={banner.id || bIdx} className={styles.itemRow}>
                          <div className={styles.itemRowHeader}>
                            <span>Slide #{bIdx + 1}</span>
                            <button 
                              onClick={() => removeArrayItem('banners', bIdx)}
                              className={styles.deleteBtn}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className={styles.formGrid}>
                            <div className={styles.field}>
                              <label>Image URL</label>
                              <input 
                                type="text"
                                value={banner.imageUrl}
                                onChange={(e) => handleNestedConfigChange('banners', bIdx, 'imageUrl', e.target.value)}
                                className={styles.input}
                              />
                            </div>
                            <div className={styles.field}>
                              <label>Main Title</label>
                              <input 
                                type="text"
                                value={banner.title}
                                onChange={(e) => handleNestedConfigChange('banners', bIdx, 'title', e.target.value)}
                                className={styles.input}
                              />
                            </div>
                            <div className={styles.field}>
                              <label>Subtitle Tagline</label>
                              <input 
                                type="text"
                                value={banner.subtitle}
                                onChange={(e) => handleNestedConfigChange('banners', bIdx, 'subtitle', e.target.value)}
                                className={styles.input}
                              />
                            </div>
                            <div className={styles.fieldRow}>
                              <div>
                                <label>CTA Button</label>
                                <input 
                                  type="text"
                                  value={banner.ctaText}
                                  onChange={(e) => handleNestedConfigChange('banners', bIdx, 'ctaText', e.target.value)}
                                  className={styles.input}
                                />
                              </div>
                              <div>
                                <label>Background Color</label>
                                <input 
                                  type="color"
                                  value={banner.backgroundColor || '#4C1D95'}
                                  onChange={(e) => handleNestedConfigChange('banners', bIdx, 'backgroundColor', e.target.value)}
                                  className={styles.colorInputCompact}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. FLADO BANNER EDITOR */}
                {selectedSection.type === 'flado_banner' && (
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label>Title</label>
                      <input 
                        type="text"
                        value={selectedSection.config.title || ''}
                        onChange={(e) => handleConfigChange('title', e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Subtitle</label>
                      <input 
                        type="text"
                        value={selectedSection.config.subtitle || ''}
                        onChange={(e) => handleConfigChange('subtitle', e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Background Image URL</label>
                      <input 
                        type="text"
                        value={selectedSection.config.imageUrl || ''}
                        onChange={(e) => handleConfigChange('imageUrl', e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.fieldRow}>
                      <div>
                        <label>Badge Text</label>
                        <input 
                          type="text"
                          value={selectedSection.config.badgeText || ''}
                          onChange={(e) => handleConfigChange('badgeText', e.target.value)}
                          className={styles.input}
                        />
                      </div>
                      <div>
                        <label>Background color</label>
                        <input 
                          type="color"
                          value={selectedSection.config.backgroundColor || '#059669'}
                          onChange={(e) => handleConfigChange('backgroundColor', e.target.value)}
                          className={styles.colorInputCompact}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. CATEGORY GRID EDITOR */}
                {(selectedSection.type === 'category_grid' || selectedSection.type === 'flado_category_pills') && (
                  <div className={styles.formGroup}>
                    <div className={styles.subHeaderRow}>
                      <label>Active Category Icons ({selectedSection.config.categories?.length || 0})</label>
                      <button 
                        onClick={() => addArrayItem('categories', {
                          name: 'New Cat',
                          slug: 'new-cat',
                          icon: '📦',
                          color: '#F1F5F9'
                        })}
                        className={styles.addButton}
                      >
                        <Plus size={14} /> Add Category
                      </button>
                    </div>

                    <div className={styles.itemsList}>
                      {selectedSection.config.categories?.map((cat: any, cIdx: number) => (
                        <div key={cIdx} className={styles.itemRowCompact}>
                          <input 
                            type="text"
                            placeholder="Emoji"
                            value={cat.icon}
                            onChange={(e) => handleNestedConfigChange('categories', cIdx, 'icon', e.target.value)}
                            className={styles.emojiInput}
                          />
                          <input 
                            type="text"
                            placeholder="Name"
                            value={cat.name}
                            onChange={(e) => handleNestedConfigChange('categories', cIdx, 'name', e.target.value)}
                            className={styles.input}
                          />
                          <input 
                            type="text"
                            placeholder="Slug"
                            value={cat.slug}
                            onChange={(e) => handleNestedConfigChange('categories', cIdx, 'slug', e.target.value)}
                            className={styles.input}
                          />
                          <input 
                            type="color"
                            value={cat.color || '#F1F5F9'}
                            onChange={(e) => handleNestedConfigChange('categories', cIdx, 'color', e.target.value)}
                            className={styles.colorInputCompact}
                          />
                          <button 
                            onClick={() => removeArrayItem('categories', cIdx)}
                            className={styles.deleteIconBtn}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. FLASH SALE Countdowns */}
                {selectedSection.type === 'flash_sale' && (
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label>Flash Sale Title</label>
                      <input 
                        type="text"
                        value={selectedSection.config.title || ''}
                        onChange={(e) => handleConfigChange('title', e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Expiration Date/Time</label>
                      <input 
                        type="datetime-local"
                        value={selectedSection.config.expiresAt ? selectedSection.config.expiresAt.substring(0,16) : ''}
                        onChange={(e) => handleConfigChange('expiresAt', new Date(e.target.value).toISOString())}
                        className={styles.input}
                      />
                    </div>
                  </div>
                )}

                {/* 6. AURALIVE DEAL (Simulated Live Streaming) */}
                {selectedSection.type === 'live_deal' && (
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label>Live Product Title</label>
                      <input 
                        type="text"
                        value={selectedSection.config.productName || ''}
                        onChange={(e) => handleConfigChange('productName', e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Live Host Name</label>
                      <input 
                        type="text"
                        value={selectedSection.config.hostName || ''}
                        onChange={(e) => handleConfigChange('hostName', e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.fieldRow}>
                      <div>
                        <label>Live Special Price (₹)</label>
                        <input 
                          type="number"
                          value={selectedSection.config.livePrice || 0}
                          onChange={(e) => handleConfigChange('livePrice', parseInt(e.target.value))}
                          className={styles.input}
                        />
                      </div>
                      <div>
                        <label>Watchers Counter</label>
                        <input 
                          type="number"
                          value={selectedSection.config.watchersCount || 100}
                          onChange={(e) => handleConfigChange('watchersCount', parseInt(e.target.value))}
                          className={styles.input}
                        />
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label>End Time</label>
                      <input 
                        type="datetime-local"
                        value={selectedSection.config.expiresAt ? selectedSection.config.expiresAt.substring(0,16) : ''}
                        onChange={(e) => handleConfigChange('expiresAt', new Date(e.target.value).toISOString())}
                        className={styles.input}
                      />
                    </div>
                  </div>
                )}

                {/* 7. PRODUCT STRIP EDITORS (Curated lists) */}
                {selectedSection.type === 'product_strip' && (
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label>Block Title</label>
                      <input 
                        type="text"
                        value={selectedSection.config.title || ''}
                        onChange={(e) => handleConfigChange('title', e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Block Subtitle</label>
                      <input 
                        type="text"
                        value={selectedSection.config.subtitle || ''}
                        onChange={(e) => handleConfigChange('subtitle', e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Curated Product IDs (comma-separated)</label>
                      <input 
                        type="text"
                        value={selectedSection.config.productIds ? selectedSection.config.productIds.join(', ') : ''}
                        onChange={(e) => handleConfigChange('productIds', e.target.value.split(',').map(s => s.trim()))}
                        className={styles.input}
                        placeholder="e.g. ele-1, be-5, fas-4"
                      />
                    </div>
                  </div>
                )}

                {/* 8. BRAND SPOTLIGHTS */}
                {selectedSection.type === 'brand_spotlight' && (
                  <div className={styles.formGroup}>
                    <div className={styles.subHeaderRow}>
                      <label>Featured Brands ({selectedSection.config.brands?.length || 0})</label>
                      <button 
                        onClick={() => addArrayItem('brands', {
                          name: 'New Brand',
                          slug: 'new-brand',
                          logoUrl: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=200',
                          bannerUrl: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=600',
                          tagline: 'Brand slogan tag line goes here',
                          badgeColor: '#1E293B'
                        })}
                        className={styles.addButton}
                      >
                        <Plus size={14} /> Add Brand
                      </button>
                    </div>

                    <div className={styles.itemsList}>
                      {selectedSection.config.brands?.map((brand: any, brIdx: number) => (
                        <div key={brIdx} className={styles.itemRow}>
                          <div className={styles.itemRowHeader}>
                            <span>Brand #{brIdx + 1}: {brand.name}</span>
                            <button 
                              onClick={() => removeArrayItem('brands', brIdx)}
                              className={styles.deleteBtn}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className={styles.formGrid}>
                            <div className={styles.field}>
                              <label>Brand Name</label>
                              <input 
                                type="text"
                                value={brand.name}
                                onChange={(e) => handleNestedConfigChange('brands', brIdx, 'name', e.target.value)}
                                className={styles.input}
                              />
                            </div>
                            <div className={styles.field}>
                              <label>Tagline</label>
                              <input 
                                type="text"
                                value={brand.tagline}
                                onChange={(e) => handleNestedConfigChange('brands', brIdx, 'tagline', e.target.value)}
                                className={styles.input}
                              />
                            </div>
                            <div className={styles.field}>
                              <label>Brand Logo URL</label>
                              <input 
                                type="text"
                                value={brand.logoUrl}
                                onChange={(e) => handleNestedConfigChange('brands', brIdx, 'logoUrl', e.target.value)}
                                className={styles.input}
                              />
                            </div>
                            <div className={styles.fieldRow}>
                              <div>
                                <label>Slug Link</label>
                                <input 
                                  type="text"
                                  value={brand.slug}
                                  onChange={(e) => handleNestedConfigChange('brands', brIdx, 'slug', e.target.value)}
                                  className={styles.input}
                                />
                              </div>
                              <div>
                                <label>Badge Color</label>
                                <input 
                                  type="color"
                                  value={brand.badgeColor || '#1E293B'}
                                  onChange={(e) => handleNestedConfigChange('brands', brIdx, 'badgeColor', e.target.value)}
                                  className={styles.colorInputCompact}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 9. SPONSOR BRAND STRIPS */}
                {(selectedSection.type === 'sponsor_strip' || selectedSection.type === 'flado_sponsor_row') && (
                  <div className={styles.formGroup}>
                    <div className={styles.subHeaderRow}>
                      <label>Sponsor Brands ({selectedSection.config.brands?.length || 0})</label>
                      <button 
                        onClick={() => addArrayItem('brands', {
                          name: 'New Sponsor',
                          logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100',
                          discountText: 'Flat 10% Off',
                          slug: 'new-slug'
                        })}
                        className={styles.addButton}
                      >
                        <Plus size={14} /> Add Sponsor
                      </button>
                    </div>

                    <div className={styles.itemsList}>
                      {selectedSection.config.brands?.map((brand: any, sIdx: number) => (
                        <div key={sIdx} className={styles.itemRowCompact}>
                          <input 
                            type="text"
                            placeholder="Brand Name"
                            value={brand.name}
                            onChange={(e) => handleNestedConfigChange('brands', sIdx, 'name', e.target.value)}
                            className={styles.input}
                          />
                          <input 
                            type="text"
                            placeholder="Discount tag"
                            value={brand.discountText}
                            onChange={(e) => handleNestedConfigChange('brands', sIdx, 'discountText', e.target.value)}
                            className={styles.input}
                          />
                          <input 
                            type="text"
                            placeholder="Slug Link"
                            value={brand.slug}
                            onChange={(e) => handleNestedConfigChange('brands', sIdx, 'slug', e.target.value)}
                            className={styles.input}
                          />
                          <button 
                            onClick={() => removeArrayItem('brands', sIdx)}
                            className={styles.deleteIconBtn}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 10. NEW LAUNCHES EDITOR */}
                {selectedSection.type === 'new_launches' && (
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label>Launch Section Title</label>
                      <input 
                        type="text"
                        value={selectedSection.config.title || ''}
                        onChange={(e) => handleConfigChange('title', e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Subtitle Tagline</label>
                      <input 
                        type="text"
                        value={selectedSection.config.subtitle || ''}
                        onChange={(e) => handleConfigChange('subtitle', e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Product IDs (comma-separated)</label>
                      <input 
                        type="text"
                        value={selectedSection.config.productIds ? selectedSection.config.productIds.join(', ') : ''}
                        onChange={(e) => handleConfigChange('productIds', e.target.value.split(',').map(s => s.trim()))}
                        className={styles.input}
                      />
                    </div>
                  </div>
                )}

                {/* 11. TRENDING NOW EDITOR */}
                {selectedSection.type === 'trending_now' && (
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label>Trending Title</label>
                      <input 
                        type="text"
                        value={selectedSection.config.title || ''}
                        onChange={(e) => handleConfigChange('title', e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Subtitle Tagline</label>
                      <input 
                        type="text"
                        value={selectedSection.config.subtitle || ''}
                        onChange={(e) => handleConfigChange('subtitle', e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Trending Product IDs (comma-separated)</label>
                      <input 
                        type="text"
                        value={selectedSection.config.productIds ? selectedSection.config.productIds.join(', ') : ''}
                        onChange={(e) => handleConfigChange('productIds', e.target.value.split(',').map(s => s.trim()))}
                        className={styles.input}
                      />
                    </div>
                  </div>
                )}

                {/* 12. CURATED COLLECTIONS CARDS */}
                {selectedSection.type === 'collection_cards' && (
                  <div className={styles.formGroup}>
                    <div className={styles.subHeaderRow}>
                      <label>Collections List ({selectedSection.config.collections?.length || 0})</label>
                      <button 
                        onClick={() => addArrayItem('collections', {
                          title: 'New Collection',
                          subtitle: 'Description',
                          imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600',
                          slug: 'sports',
                          tag: 'Offer Badge'
                        })}
                        className={styles.addButton}
                      >
                        <Plus size={14} /> Add Collection
                      </button>
                    </div>

                    <div className={styles.itemsList}>
                      {selectedSection.config.collections?.map((col: any, cIdx: number) => (
                        <div key={cIdx} className={styles.itemRow}>
                          <div className={styles.itemRowHeader}>
                            <span>Collection #{cIdx + 1}: {col.title}</span>
                            <button 
                              onClick={() => removeArrayItem('collections', cIdx)}
                              className={styles.deleteBtn}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className={styles.formGrid}>
                            <div className={styles.field}>
                              <label>Title</label>
                              <input 
                                type="text"
                                value={col.title}
                                onChange={(e) => handleNestedConfigChange('collections', cIdx, 'title', e.target.value)}
                                className={styles.input}
                              />
                            </div>
                            <div className={styles.field}>
                              <label>Subtitle</label>
                              <input 
                                type="text"
                                value={col.subtitle}
                                onChange={(e) => handleNestedConfigChange('collections', cIdx, 'subtitle', e.target.value)}
                                className={styles.input}
                              />
                            </div>
                            <div className={styles.field}>
                              <label>Image URL</label>
                              <input 
                                type="text"
                                value={col.imageUrl}
                                onChange={(e) => handleNestedConfigChange('collections', cIdx, 'imageUrl', e.target.value)}
                                className={styles.input}
                              />
                            </div>
                            <div className={styles.fieldRow}>
                              <div>
                                <label>Slug Link</label>
                                <input 
                                  type="text"
                                  value={col.slug}
                                  onChange={(e) => handleNestedConfigChange('collections', cIdx, 'slug', e.target.value)}
                                  className={styles.input}
                                />
                              </div>
                              <div>
                                <label>Offer Tag</label>
                                <input 
                                  type="text"
                                  value={col.tag}
                                  onChange={(e) => handleNestedConfigChange('collections', cIdx, 'tag', e.target.value)}
                                  className={styles.input}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 13. STYLE LOOKBOOKS */}
                {selectedSection.type === 'look_book' && (
                  <div className={styles.formGroup}>
                    <div className={styles.subHeaderRow}>
                      <label>Lookbooks List ({selectedSection.config.items?.length || 0})</label>
                      <button 
                        onClick={() => addArrayItem('items', {
                          id: `l-${Date.now()}`,
                          imageUrl: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=400',
                          title: 'New Street Look',
                          tags: ['Fashion', 'Oversized']
                        })}
                        className={styles.addButton}
                      >
                        <Plus size={14} /> Add Lookbook Item
                      </button>
                    </div>

                    <div className={styles.itemsList}>
                      {selectedSection.config.items?.map((item: any, iIdx: number) => (
                        <div key={item.id || iIdx} className={styles.itemRow}>
                          <div className={styles.itemRowHeader}>
                            <span>Lookbook #{iIdx + 1}: {item.title}</span>
                            <button 
                              onClick={() => removeArrayItem('items', iIdx)}
                              className={styles.deleteBtn}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className={styles.formGrid}>
                            <div className={styles.field}>
                              <label>Title</label>
                              <input 
                                type="text"
                                value={item.title}
                                onChange={(e) => handleNestedConfigChange('items', iIdx, 'title', e.target.value)}
                                className={styles.input}
                              />
                            </div>
                            <div className={styles.field}>
                              <label>Image URL</label>
                              <input 
                                type="text"
                                value={item.imageUrl}
                                onChange={(e) => handleNestedConfigChange('items', iIdx, 'imageUrl', e.target.value)}
                                className={styles.input}
                              />
                            </div>
                            <div className={styles.field}>
                              <label>Style Hashtags (comma-separated)</label>
                              <input 
                                type="text"
                                value={item.tags ? item.tags.join(', ') : ''}
                                onChange={(e) => handleNestedConfigChange('items', iIdx, 'tags', e.target.value.split(',').map((s: string) => s.trim()))}
                                className={styles.input}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 14. PROMO STRIP EDITOR */}
                {selectedSection.type === 'promo_strip' && (
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label>Banner Text Title</label>
                      <input 
                        type="text"
                        value={selectedSection.config.title || ''}
                        onChange={(e) => handleConfigChange('title', e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>CTA Page Link</label>
                      <input 
                        type="text"
                        value={selectedSection.config.ctaUrl || ''}
                        onChange={(e) => handleConfigChange('ctaUrl', e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.fieldRow}>
                      <div>
                        <label>Background color</label>
                        <input 
                          type="color"
                          value={selectedSection.config.backgroundColor || '#F59E0B'}
                          onChange={(e) => handleConfigChange('backgroundColor', e.target.value)}
                          className={styles.colorInputCompact}
                        />
                      </div>
                      <div>
                        <label>Text Color</label>
                        <input 
                          type="color"
                          value={selectedSection.config.textColor || '#1E293B'}
                          onChange={(e) => handleConfigChange('textColor', e.target.value)}
                          className={styles.colorInputCompact}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 15. FLADO OFFERS STRIP */}
                {selectedSection.type === 'flado_offers_strip' && (
                  <div className={styles.formGroup}>
                    <div className={styles.subHeaderRow}>
                      <label>Coupon Offers List ({selectedSection.config.offers?.length || 0})</label>
                      <button 
                        onClick={() => addArrayItem('offers', {
                          text: 'Get 10% Off | Use Code: AURA10',
                          code: 'AURA10'
                        })}
                        className={styles.addButton}
                      >
                        <Plus size={14} /> Add Offer
                      </button>
                    </div>

                    <div className={styles.itemsList}>
                      {selectedSection.config.offers?.map((offer: any, oIdx: number) => (
                        <div key={oIdx} className={styles.itemRowCompact}>
                          <input 
                            type="text"
                            placeholder="Offer promo text"
                            value={offer.text}
                            onChange={(e) => handleNestedConfigChange('offers', oIdx, 'text', e.target.value)}
                            className={styles.input}
                          />
                          <input 
                            type="text"
                            placeholder="Coupon Code"
                            value={offer.code}
                            onChange={(e) => handleNestedConfigChange('offers', oIdx, 'code', e.target.value)}
                            className={styles.input}
                          />
                          <button 
                            onClick={() => removeArrayItem('offers', oIdx)}
                            className={styles.deleteIconBtn}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 16. FLADO PROMO AD BANNER */}
                {selectedSection.type === 'flado_promo_banner' && (
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label>Title</label>
                      <input 
                        type="text"
                        value={selectedSection.config.title || ''}
                        onChange={(e) => handleConfigChange('title', e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>CTA Page Link</label>
                      <input 
                        type="text"
                        value={selectedSection.config.ctaUrl || ''}
                        onChange={(e) => handleConfigChange('ctaUrl', e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Image URL</label>
                      <input 
                        type="text"
                        value={selectedSection.config.imageUrl || ''}
                        onChange={(e) => handleConfigChange('imageUrl', e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.fieldRow}>
                      <div>
                        <label>Background color</label>
                        <input 
                          type="color"
                          value={selectedSection.config.backgroundColor || '#D1FAE5'}
                          onChange={(e) => handleConfigChange('backgroundColor', e.target.value)}
                          className={styles.colorInputCompact}
                        />
                      </div>
                      <div>
                        <label>Text Color</label>
                        <input 
                          type="color"
                          value={selectedSection.config.textColor || '#065F46'}
                          onChange={(e) => handleConfigChange('textColor', e.target.value)}
                          className={styles.colorInputCompact}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 17. FLADO BRAND ZONE */}
                {selectedSection.type === 'flado_brand_zone' && (
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label>Brand Name</label>
                      <input 
                        type="text"
                        value={selectedSection.config.brandName || ''}
                        onChange={(e) => handleConfigChange('brandName', e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Banner Image URL</label>
                      <input 
                        type="text"
                        value={selectedSection.config.bannerUrl || ''}
                        onChange={(e) => handleConfigChange('bannerUrl', e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Tagline</label>
                      <input 
                        type="text"
                        value={selectedSection.config.tagline || ''}
                        onChange={(e) => handleConfigChange('tagline', e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.fieldRow}>
                      <div>
                        <label>Product Slug Filter</label>
                        <input 
                          type="text"
                          value={selectedSection.config.productSlug || ''}
                          onChange={(e) => handleConfigChange('productSlug', e.target.value)}
                          className={styles.input}
                          placeholder="e.g. groceries, beauty"
                        />
                      </div>
                      <div>
                        <label>Badge Color</label>
                        <input 
                          type="color"
                          value={selectedSection.config.badgeColor || '#1E3A8A'}
                          onChange={(e) => handleConfigChange('badgeColor', e.target.value)}
                          className={styles.colorInputCompact}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 18. FLADO PRODUCT ROW */}
                {selectedSection.type === 'flado_product_row' && (
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label>Section Title</label>
                      <input 
                        type="text"
                        value={selectedSection.config.title || ''}
                        onChange={(e) => handleConfigChange('title', e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Filter Sub-Category</label>
                      <input 
                        type="text"
                        value={selectedSection.config.subCategory || ''}
                        onChange={(e) => handleConfigChange('subCategory', e.target.value)}
                        className={styles.input}
                        placeholder="e.g. Fruits & Vegetables, Dairy & Bread"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.emptyEditor}>
              <Grid size={48} className={styles.emptyIcon} />
              <p>Select a layout block from the left panel to configure its dynamic settings.</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '400px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px', color: '#1F2937' }}>Add New Layout Block</h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px', color: '#4B5563' }}>Block Type</label>
              <select 
                value={newSectionType} 
                onChange={(e) => setNewSectionType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #D1D5DB',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              >
                <option value="">-- Select Block Type --</option>
                {activeTab === 'homepage' ? (
                  <>
                    <option value="top_announcement">Top Announcement</option>
                    <option value="hero_banners">Hero Banners Carousel</option>
                    <option value="flado_banner">Flado Banner Link</option>
                    <option value="category_grid">Category Grid</option>
                    <option value="flash_sale">Flash Sale Countdown</option>
                    <option value="live_deal">AuraLive Deal</option>
                    <option value="product_strip">Product Strip</option>
                    <option value="brand_spotlight">Brand Spotlight</option>
                    <option value="sponsor_strip">Sponsor Strip</option>
                    <option value="new_launches">New Launches</option>
                    <option value="trending_now">Trending Now</option>
                    <option value="collection_cards">Curated Collection Cards</option>
                    <option value="look_book">AuraStudio Lookbook</option>
                    <option value="promo_strip">Promo Text Strip</option>
                  </>
                ) : (
                  <>
                    <option value="flado_hero_carousel">Flado Hero Carousel</option>
                    <option value="flado_category_pills">Flado Category Pills</option>
                    <option value="flado_offers_strip">Flado Offers Strip</option>
                    <option value="flado_promo_banner">Flado Promo Ad Banner</option>
                    <option value="flado_sponsor_row">Flado Sponsor Brand List</option>
                    <option value="flado_brand_zone">Flado Brand Spotlight Zone</option>
                    <option value="flado_product_row">Flado Category Product Row</option>
                  </>
                )}
              </select>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px', color: '#4B5563' }}>Block Title (Optional)</label>
              <input 
                type="text"
                placeholder="e.g. Fresh Veggies Spotlight"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #D1D5DB',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#F3F4F6',
                  color: '#4B5563',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={addSection}
                disabled={!newSectionType}
                style={{
                  padding: '8px 16px',
                  backgroundColor: activeTab === 'homepage' ? '#7C3AED' : '#059669',
                  color: 'white',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  opacity: !newSectionType ? 0.5 : 1
                }}
              >
                Add Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
