'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiPlus, FiTrash2, FiArrowUp, FiArrowDown, FiCopy, 
  FiSave, FiEye, FiSettings, FiLayers, FiImage, 
  FiLink, FiCheck, FiFileText, FiRefreshCw, FiExternalLink
} from 'react-icons/fi';
import { 
  promoPagesRegistry, PromoPageConfig, 
  MarketingSection, MarketingItem, SectionType, FestiveOverlay 
} from '@/data/promoLayouts';
import MarketingSectionRenderer from '@/components/MarketingSectionRenderer';
import styles from './page.module.css';

// ─── Default Resolutions Guideline Map ────────────────────────────────────────
const RESOLUTIONS: Record<SectionType, string> = {
  'round-bubbles': '150px X 150px',
  'grid-2': '600px X 300px',
  'grid-3': '400px X 210px',
  'carousel-1': '1200px X 400px',
  'carousel-2': '580px X 320px',
};

const DEFAULT_ITEM_TEMPLATES: Record<SectionType, MarketingItem[]> = {
  'round-bubbles': [
    { id: 'b-1', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop', linkUrl: '/brands/nike', title: 'Nike', resolutionInfo: '150px X 150px' },
    { id: 'b-2', imageUrl: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=150&h=150&fit=crop', linkUrl: '/brands/adidas', title: 'Adidas', resolutionInfo: '150px X 150px' },
    { id: 'b-3', imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=150&h=150&fit=crop', linkUrl: '/brands/boat', title: 'boAt', resolutionInfo: '150px X 150px' },
  ],
  'grid-2': [
    { id: 'g2-1', imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&h=300&fit=crop', linkUrl: '/categories/home', title: 'Lamps & Lighting', subTitle: 'Min. 30% Off', resolutionInfo: '600px X 300px' },
    { id: 'g2-2', imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=300&fit=crop', linkUrl: '/categories/home', title: 'Living Room Mats', subTitle: 'Buy 1 Get 1 Free', resolutionInfo: '600px X 300px' },
  ],
  'grid-3': [
    { id: 'g3-1', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=210&fit=crop', linkUrl: '/categories/electronics', title: 'Tech Essentials', subTitle: 'Up to 30% Off', resolutionInfo: '400px X 210px' },
    { id: 'g3-2', imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=210&fit=crop', linkUrl: '/categories/fashion', title: 'Rain Apparel', subTitle: 'Min. 40% Off', resolutionInfo: '400px X 210px' },
    { id: 'g3-3', imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=210&fit=crop', linkUrl: '/categories/beauty', title: 'Waterproof Make-up', subTitle: 'Special Combos', resolutionInfo: '400px X 210px' },
  ],
  'carousel-1': [
    { id: 'c1-1', imageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1200&h=400&fit=crop', linkUrl: '/categories/fashion', title: 'Waterproof Outdoors Apparel', resolutionInfo: '1200px X 400px' },
    { id: 'c1-2', imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1200&h=400&fit=crop', linkUrl: '/categories/electronics', title: 'IPX7 Certified Audio Gear', resolutionInfo: '1200px X 400px' },
  ],
  'carousel-2': [
    { id: 'c2-1', imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=580&h=320&fit=crop', linkUrl: '/lookbook/festive-elegance', title: 'Festive Silk Sherwanis', subTitle: 'Flat 20% Off', resolutionInfo: '580px X 320px' },
    { id: 'c2-2', imageUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=580&h=320&fit=crop', linkUrl: '/categories/jewellery', title: '24K Gold Necklaces', subTitle: 'No Making Charges', resolutionInfo: '580px X 320px' },
  ],
};

const FESTIVE_OPTIONS = [
  { label: 'None', emoji: '' },
  { label: 'Diwali Lights 🏮', emoji: '🏮' },
  { label: 'Festive Sparks ✨', emoji: '✨' },
  { label: 'Holi Colors 🎨', emoji: '🎨' },
  { label: 'Monsoon Clouds 🌧️', emoji: '🌧️' },
  { label: 'Snowflakes ❄️', emoji: '❄️' },
  { label: 'Flower Garlands 🌸', emoji: '🌸' },
];

export default function PromoCampaignBuilder() {
  const [promos, setPromos] = useState<Record<string, PromoPageConfig>>({});
  const [selectedSlug, setSelectedSlug] = useState<string>('monsoon-clearance');
  const [activePage, setActivePage] = useState<PromoPageConfig | null>(null);
  
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showJsonExport, setShowJsonExport] = useState(false);

  // Initialize: Load default registry configs and localStorage configs
  useEffect(() => {
    let storedConfigs: Record<string, PromoPageConfig> = {};
    try {
      const storedRaw = localStorage.getItem('auramart_custom_promos');
      if (storedRaw) {
        storedConfigs = JSON.parse(storedRaw);
      }
    } catch (e) {
      console.error(e);
    }

    // Merge default registry configs with localstorage configs
    const merged = { ...promoPagesRegistry, ...storedConfigs };
    setPromos(merged);

    // Set active campaign to edit
    const firstSlug = Object.keys(merged)[0] || 'monsoon-clearance';
    setSelectedSlug(firstSlug);
    if (merged[firstSlug]) {
      setActivePage(JSON.parse(JSON.stringify(merged[firstSlug])));
    }
  }, []);

  // Update active config when changing slug selector
  const handleSelectSlug = (slug: string) => {
    setSelectedSlug(slug);
    if (promos[slug]) {
      setActivePage(JSON.parse(JSON.stringify(promos[slug])));
      setActiveSectionId(null);
    }
  };

  // Create a brand new campaign page
  const handleCreateNewCampaign = () => {
    const slugName = prompt('Enter a unique URL slug for your new campaign (e.g. summer-splash):');
    if (!slugName) return;

    const formattedSlug = slugName.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    if (!formattedSlug) {
      alert('Invalid slug format.');
      return;
    }

    if (promos[formattedSlug]) {
      alert('A campaign with this slug already exists.');
      return;
    }

    const newCampaign: PromoPageConfig = {
      slug: formattedSlug,
      title: '🌟 New Campaign Page',
      description: 'Customize this landing page sections, banners and brand spotlights.',
      themeColor: '#7C3AED',
      sections: [
        {
          id: `sec-${Date.now()}-1`,
          type: 'carousel-1',
          heading: '🔥 Welcome to our Grand Launch',
          subHeading: 'Browse top featured promotions',
          items: [
            {
              id: `item-${Date.now()}-1`,
              imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop',
              linkUrl: '/categories/fashion',
              title: 'Launch Discount 20% Off',
              resolutionInfo: '1200px X 400px',
            }
          ]
        }
      ]
    };

    const nextPromos = { ...promos, [formattedSlug]: newCampaign };
    setPromos(nextPromos);
    setSelectedSlug(formattedSlug);
    setActivePage(newCampaign);
    setActiveSectionId(newCampaign.sections[0]?.id || null);
    
    // Save to localStorage
    saveToLocalStorage(nextPromos);
  };

  // Helper to persist custom configs only (do not duplicate default file configs unless modified)
  const saveToLocalStorage = (allPromos: Record<string, PromoPageConfig>) => {
    const customOnly: Record<string, PromoPageConfig> = {};
    Object.keys(allPromos).forEach(key => {
      // Always save to allow overrides of defaults too
      customOnly[key] = allPromos[key];
    });
    localStorage.setItem('auramart_custom_promos', JSON.stringify(customOnly));
  };

  // Save current active config to registry list
  const handleSavePage = () => {
    if (!activePage) return;
    
    // Verify slug changed checking
    if (activePage.slug !== selectedSlug) {
      const nextPromos = { ...promos };
      delete nextPromos[selectedSlug];
      nextPromos[activePage.slug] = activePage;
      setPromos(nextPromos);
      setSelectedSlug(activePage.slug);
      saveToLocalStorage(nextPromos);
    } else {
      const nextPromos = { ...promos, [selectedSlug]: activePage };
      setPromos(nextPromos);
      saveToLocalStorage(nextPromos);
    }

    alert('Campaign saved to browser memory! Test it live at /promo/' + activePage.slug);
  };

  // Delete Campaign
  const handleDeleteCampaign = () => {
    if (!window.confirm(`Are you sure you want to delete the campaign "${activePage?.title}"?`)) return;
    
    const nextPromos = { ...promos };
    delete nextPromos[selectedSlug];
    setPromos(nextPromos);
    
    const remainingSlugs = Object.keys(nextPromos);
    if (remainingSlugs.length > 0) {
      setSelectedSlug(remainingSlugs[0]);
      setActivePage(JSON.parse(JSON.stringify(nextPromos[remainingSlugs[0]])));
    } else {
      setActivePage(null);
    }
    
    saveToLocalStorage(nextPromos);
  };

  // Reset to default presets
  const handleResetDefaults = () => {
    if (!window.confirm('Reset all builder pages to original default registry values? This will discard your custom changes.')) return;
    localStorage.removeItem('auramart_custom_promos');
    window.location.reload();
  };

  // Section managers
  const handleAddSection = (type: SectionType) => {
    if (!activePage) return;

    const newSection: MarketingSection = {
      id: `sec-${Date.now()}`,
      type,
      heading: `✨ New ${type.replace('-', ' ')} block`,
      subHeading: 'Subtitle promotion info guidelines',
      items: JSON.parse(JSON.stringify(DEFAULT_ITEM_TEMPLATES[type])),
    };

    const updated = { ...activePage };
    updated.sections.push(newSection);
    setActivePage(updated);
    setActiveSectionId(newSection.id);
  };

  const handleRemoveSection = (sectionId: string) => {
    if (!activePage) return;
    const updated = { ...activePage };
    updated.sections = updated.sections.filter(s => s.id !== sectionId);
    setActivePage(updated);
    if (activeSectionId === sectionId) {
      setActiveSectionId(updated.sections[0]?.id || null);
    }
  };

  const handleDuplicateSection = (section: MarketingSection) => {
    if (!activePage) return;
    const updated = { ...activePage };
    const duplicated: MarketingSection = {
      ...JSON.parse(JSON.stringify(section)),
      id: `sec-${Date.now()}`,
      heading: `${section.heading} (Copy)`,
    };
    const index = updated.sections.findIndex(s => s.id === section.id);
    updated.sections.splice(index + 1, 0, duplicated);
    setActivePage(updated);
    setActiveSectionId(duplicated.id);
  };

  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    if (!activePage) return;
    const updated = { ...activePage };
    const index = updated.sections.findIndex(s => s.id === sectionId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === updated.sections.length - 1) return;

    const swapTarget = direction === 'up' ? index - 1 : index + 1;
    const temp = updated.sections[index];
    updated.sections[index] = updated.sections[swapTarget];
    updated.sections[swapTarget] = temp;
    setActivePage(updated);
  };

  // Update item level variables directly inside sections
  const handleUpdateItem = (sectionId: string, itemId: string, fields: Partial<MarketingItem>) => {
    if (!activePage) return;
    const updated = { ...activePage };
    updated.sections = updated.sections.map(sec => {
      if (sec.id !== sectionId) return sec;
      const updatedSec = { ...sec };
      updatedSec.items = updatedSec.items.map(item => {
        if (item.id !== itemId) return item;
        return { ...item, ...fields };
      });
      return updatedSec;
    });
    setActivePage(updated);
  };

  // Add Item to a section
  const handleAddItemToSection = (sectionId: string) => {
    if (!activePage) return;
    const updated = { ...activePage };
    updated.sections = updated.sections.map(sec => {
      if (sec.id !== sectionId) return sec;
      const updatedSec = { ...sec };
      const res = RESOLUTIONS[sec.type];
      const newItem: MarketingItem = {
        id: `item-${Date.now()}-${updatedSec.items.length + 1}`,
        imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop',
        linkUrl: '/categories/fashion',
        title: 'New Spotlight Slot',
        subTitle: 'Promo discount description',
        resolutionInfo: res,
      };
      updatedSec.items.push(newItem);
      return updatedSec;
    });
    setActivePage(updated);
  };

  // Remove Item from a section
  const handleRemoveItemFromSection = (sectionId: string, itemId: string) => {
    if (!activePage) return;
    const updated = { ...activePage };
    updated.sections = updated.sections.map(sec => {
      if (sec.id !== sectionId) return sec;
      const updatedSec = { ...sec };
      if (updatedSec.items.length <= 1) {
        alert('Sections must contain at least 1 promotion image card.');
        return sec;
      }
      updatedSec.items = updatedSec.items.filter(item => item.id !== itemId);
      return updatedSec;
    });
    setActivePage(updated);
  };

  // Update active section configs
  const handleUpdateSectionConfig = (sectionId: string, fields: Partial<MarketingSection>) => {
    if (!activePage) return;
    const updated = { ...activePage };
    updated.sections = updated.sections.map(sec => {
      if (sec.id !== sectionId) return sec;
      return { ...sec, ...fields };
    });
    setActivePage(updated);
  };

  // Update festive highlight overlay
  const handleUpdateFestiveOverlay = (sectionId: string, emoji: string) => {
    if (!activePage) return;
    const updated = { ...activePage };
    updated.sections = updated.sections.map(sec => {
      if (sec.id !== sectionId) return sec;
      if (!emoji) {
        const { festiveHighlights, ...rest } = sec;
        return rest;
      }
      const highlight: FestiveOverlay = {
        svgUrl: emoji,
        position: 'top-right',
        opacity: 0.9,
      };
      return { ...sec, festiveHighlights: [highlight] };
    });
    setActivePage(updated);
  };

  // File Upload Drag Drop handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, sectionId: string, itemId: string) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleUpdateItem(sectionId, itemId, { imageUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const activeSection = activePage?.sections.find(s => s.id === activeSectionId);

  return (
    <div className={styles.builderPage}>
      {/* ── Top Bar Control Panel ─────────────────── */}
      <div className={styles.builderTopbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.builderIcon}>⚙️</span>
          <div>
            <h1 className={styles.builderTitle}>AuraMart Promo & Campaign Builder</h1>
            <p className={styles.builderSub}>Configure custom sponsor strips, brand spots, and pages instantly</p>
          </div>
        </div>

        <div className={styles.topbarActions}>
          <button className={styles.btnReset} onClick={handleResetDefaults} title="Clear localStorage customizations">
            <FiRefreshCw /> Reset Default Presets
          </button>
          <button className={styles.btnExport} onClick={() => setShowJsonExport(true)}>
            <FiFileText /> Export JSON Schema
          </button>
          <button className={styles.btnSave} onClick={handleSavePage}>
            <FiSave /> Save Campaign
          </button>
          {activePage && (
            <Link href={`/promo/${activePage.slug}`} target="_blank" className={styles.btnPreview}>
              <FiEye /> Test Live Page <FiExternalLink />
            </Link>
          )}
        </div>
      </div>

      {/* ── Main Layout ────────────────────────────── */}
      <div className={styles.builderContainer}>
        
        {/* ── Left Sidebar: Campaigns & Sections ───── */}
        <aside className={styles.sidebarLeft}>
          
          {/* Campaign Selector */}
          <div className={styles.panelBlock}>
            <h2 className={styles.panelTitle}><FiSettings /> Select Campaign</h2>
            <div className={styles.campaignSelectRow}>
              <select 
                className={styles.selectInput}
                value={selectedSlug} 
                onChange={e => handleSelectSlug(e.target.value)}
              >
                {Object.keys(promos).map(slug => (
                  <option key={slug} value={slug}>{promos[slug].title} ({slug})</option>
                ))}
              </select>
              <button className={styles.btnAddCampaign} onClick={handleCreateNewCampaign} title="New Campaign Page">
                <FiPlus />
              </button>
            </div>

            {activePage && (
              <div className={styles.campaignSettingsForm}>
                <div className={styles.formGroup}>
                  <label>Slug URL (path /promo/[slug])</label>
                  <input 
                    type="text" 
                    value={activePage.slug} 
                    onChange={e => setActivePage({ ...activePage, slug: e.target.value.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-') })}
                    placeholder="slug-path"
                    className={styles.inputField}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Page Header Title</label>
                  <input 
                    type="text" 
                    value={activePage.title} 
                    onChange={e => setActivePage({ ...activePage, title: e.target.value })}
                    placeholder="Diwali Festival Sells"
                    className={styles.inputField}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Page Description</label>
                  <textarea 
                    value={activePage.description || ''} 
                    onChange={e => setActivePage({ ...activePage, description: e.target.value })}
                    placeholder="Short description of the sales..."
                    className={styles.textareaField}
                  />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Theme Color</label>
                    <input 
                      type="color" 
                      value={activePage.themeColor || '#7C3AED'} 
                      onChange={e => setActivePage({ ...activePage, themeColor: e.target.value })}
                      className={styles.colorPicker}
                    />
                  </div>
                  <button className={styles.btnDeleteCampaign} onClick={handleDeleteCampaign}>
                    <FiTrash2 /> Delete Page
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Page Sections Layout Manager */}
          {activePage && (
            <div className={styles.panelBlock}>
              <h2 className={styles.panelTitle}><FiLayers /> Layout Sections ({activePage.sections.length})</h2>
              
              <div className={styles.sectionsList}>
                {activePage.sections.map((section, idx) => (
                  <div 
                    key={section.id} 
                    className={`${styles.sectionItemCard} ${activeSectionId === section.id ? styles.activeSectionCard : ''}`}
                    onClick={() => setActiveSectionId(section.id)}
                  >
                    <div className={styles.sectionCardHeader}>
                      <span className={styles.sectionBadge} style={{ background: activePage.themeColor }}>
                        {section.type}
                      </span>
                      <div className={styles.sectionHeaderControl}>
                        <button disabled={idx === 0} onClick={(e) => { e.stopPropagation(); handleMoveSection(section.id, 'up'); }} title="Move up"><FiArrowUp /></button>
                        <button disabled={idx === activePage.sections.length - 1} onClick={(e) => { e.stopPropagation(); handleMoveSection(section.id, 'down'); }} title="Move down"><FiArrowDown /></button>
                      </div>
                    </div>
                    <span className={styles.sectionCardHeading}>
                      {section.heading || 'No Heading Section'}
                    </span>
                    <div className={styles.sectionCardActions}>
                      <button onClick={(e) => { e.stopPropagation(); handleDuplicateSection(section); }} title="Duplicate Section"><FiCopy /> Duplicate</button>
                      <button onClick={(e) => { e.stopPropagation(); handleRemoveSection(section.id); }} className={styles.deleteText} title="Delete Section"><FiTrash2 /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Section Controls */}
              <div className={styles.addSectionGrid}>
                <h3 className={styles.addSectionTitle}>➕ Add Marketing Layout Section</h3>
                <div className={styles.addBtnsRow}>
                  {[
                    { type: 'round-bubbles', label: 'Bubbles Strip' },
                    { type: 'grid-2', label: '2-Grid Banners' },
                    { type: 'grid-3', label: '3-Grid Spotlight' },
                    { type: 'carousel-1', label: '1-Column Slider' },
                    { type: 'carousel-2', label: '2-Column Slider' },
                  ].map(btn => (
                    <button 
                      key={btn.type} 
                      className={styles.btnAddSectionType} 
                      onClick={() => handleAddSection(btn.type as SectionType)}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}
        </aside>

        {/* ── Middle Area: Live Visual Preview ─────── */}
        <main className={styles.previewPanel}>
          <div className={styles.previewHeaderBar}>
            <span className={styles.previewBadge}>👁️ Live Visual Render View</span>
            <div className={styles.deviceToggles}>
              <button 
                className={`${styles.deviceBtn} ${previewDevice === 'desktop' ? styles.deviceActive : ''}`}
                onClick={() => setPreviewDevice('desktop')}
              >
                🖥️ Desktop
              </button>
              <button 
                className={`${styles.deviceBtn} ${previewDevice === 'mobile' ? styles.deviceActive : ''}`}
                onClick={() => setPreviewDevice('mobile')}
              >
                📱 Mobile
              </button>
            </div>
          </div>

          <div className={`${styles.previewViewport} ${previewDevice === 'mobile' ? styles.viewportMobile : ''}`}>
            {activePage ? (
              <div className={styles.previewContent} style={{ '--theme-accent': activePage.themeColor } as React.CSSProperties}>
                <div className={styles.promoHeaderMock}>
                  <h1 style={{ color: activePage.themeColor }}>{activePage.title}</h1>
                  {activePage.description && <p>{activePage.description}</p>}
                </div>

                {activePage.sections.map(section => (
                  <div 
                    key={section.id} 
                    className={`${styles.sectionWrapperMock} ${activeSectionId === section.id ? styles.wrapperActiveHighlight : ''}`}
                    onClick={() => setActiveSectionId(section.id)}
                  >
                    <MarketingSectionRenderer section={section} />
                    {activeSectionId === section.id && (
                      <div className={styles.selectedOverlay}>Editing this Section</div>
                    )}
                  </div>
                ))}

                {activePage.sections.length === 0 && (
                  <div className={styles.emptySectionsPlaceholder}>
                    📭 No layout sections. Add a section from the left panel to begin.
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.emptyState}>
                🏷️ Select or Create a campaign on the left to start customizing!
              </div>
            )}
          </div>
        </main>

        {/* ── Right Sidebar: Customize Selected Section ── */}
        <aside className={styles.sidebarRight}>
          {activeSection ? (
            <div className={styles.panelBlock}>
              <h2 className={styles.panelTitle}><FiSettings /> Customize Selected Block</h2>
              
              <div className={styles.sectionSettingsForm}>
                <div className={styles.formGroup}>
                  <label>Section Grid Type</label>
                  <select 
                    value={activeSection.type} 
                    onChange={e => handleUpdateSectionConfig(activeSection.id, { type: e.target.value as SectionType })}
                    className={styles.selectInput}
                  >
                    <option value="round-bubbles">Round Image Bubbles (150x150)</option>
                    <option value="grid-2">2 Columns Banner (600x300)</option>
                    <option value="grid-3">3 Columns Spotlight (400x210)</option>
                    <option value="carousel-1">1 Grid Banner Slider (1200x400)</option>
                    <option value="carousel-2">2 Grid Banners Slider (580x320)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Section Heading Title</label>
                  <input 
                    type="text"
                    value={activeSection.heading || ''} 
                    onChange={e => handleUpdateSectionConfig(activeSection.id, { heading: e.target.value })}
                    className={styles.inputField}
                    placeholder="Sponsor Spotlight"
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Heading Text Color</label>
                    <input 
                      type="color"
                      value={activeSection.headingColor || '#0F172A'} 
                      onChange={e => handleUpdateSectionConfig(activeSection.id, { headingColor: e.target.value })}
                      className={styles.colorPicker}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Block BG Color</label>
                    <input 
                      type="color"
                      value={activeSection.backgroundColor || '#ffffff'} 
                      onChange={e => handleUpdateSectionConfig(activeSection.id, { backgroundColor: e.target.value })}
                      className={styles.colorPicker}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Section Backdrop Image URL (.jpg, .png, .gif, .svg)</label>
                  <input 
                    type="text"
                    value={activeSection.backgroundImageUrl || ''} 
                    onChange={e => handleUpdateSectionConfig(activeSection.id, { backgroundImageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... or Base64"
                    className={styles.inputField}
                  />
                </div>

                {/* Festival Highlights */}
                <div className={styles.formGroup}>
                  <label>Festival Highlights Overlay</label>
                  <select 
                    value={activeSection.festiveHighlights?.[0]?.svgUrl || ''}
                    onChange={e => handleUpdateFestiveOverlay(activeSection.id, e.target.value)}
                    className={styles.selectInput}
                  >
                    {FESTIVE_OPTIONS.map(opt => (
                      <option key={opt.label} value={opt.emoji}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Item List Settings */}
                <div className={styles.sectionItemsHeader}>
                  <h3 className={styles.itemsSubTitle}>Promotion Cards ({activeSection.items.length})</h3>
                  <button className={styles.btnNewItemSlot} onClick={() => handleAddItemToSection(activeSection.id)}>
                    <FiPlus /> Add Card Slot
                  </button>
                </div>

                <div className={styles.itemsScrollList}>
                  {activeSection.items.map((item, idx) => (
                    <div key={item.id} className={styles.itemEditCard}>
                      <div className={styles.itemCardTop}>
                        <strong>Card #{idx + 1}</strong>
                        <button 
                          className={styles.btnRemoveItem} 
                          onClick={() => handleRemoveItemFromSection(activeSection.id, item.id)}
                          title="Remove card"
                        >
                          <FiTrash2 />
                        </button>
                      </div>

                      {/* Image Upload Input with Resolution Info */}
                      <div className={styles.formGroup}>
                        <label className={styles.resolutionLabel}>
                          Promo Image <span className={styles.resHighlight}>(Resolution: {RESOLUTIONS[activeSection.type]})</span>
                        </label>
                        <div className={styles.imageSelectorRow}>
                          <input 
                            type="text" 
                            value={item.imageUrl}
                            onChange={e => handleUpdateItem(activeSection.id, item.id, { imageUrl: e.target.value })}
                            placeholder="Direct URL or Base64 upload"
                            className={styles.inputField}
                          />
                          <label className={styles.fileInputLabel}>
                            <FiImage /> Upload
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={e => handleFileUpload(e, activeSection.id, item.id)}
                              className={styles.hiddenFileInput}
                            />
                          </label>
                        </div>
                        <div className={styles.builderDropzoneLabel}>
                          Drag & drop PNG/JPG/GIF onto card in edit mode to replace.
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label>Promo Action Link URL</label>
                        <input 
                          type="text" 
                          value={item.linkUrl}
                          onChange={e => handleUpdateItem(activeSection.id, item.id, { linkUrl: e.target.value })}
                          placeholder="/categories/fashion or product ID link"
                          className={styles.inputField}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>Card Heading Title</label>
                        <input 
                          type="text" 
                          value={item.title || ''}
                          onChange={e => handleUpdateItem(activeSection.id, item.id, { title: e.target.value })}
                          placeholder="Card Title"
                          className={styles.inputField}
                        />
                      </div>

                      {activeSection.type !== 'round-bubbles' && activeSection.type !== 'carousel-1' && (
                        <div className={styles.formGroup}>
                          <label>Card Subtitle / Badges</label>
                          <input 
                            type="text" 
                            value={item.subTitle || ''}
                            onChange={e => handleUpdateItem(activeSection.id, item.id, { subTitle: e.target.value })}
                            placeholder="Card Subtitle text"
                            className={styles.inputField}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            </div>
          ) : (
            <div className={styles.emptyRightPanel}>
              👈 Select a layout section from the list to customize background colors, headings, items, and target image resolutions!
            </div>
          )}
        </aside>

      </div>

      {/* ── JSON Schema Export Modal ──────────────── */}
      {showJsonExport && activePage && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>JSON Campaign Schema Export</h3>
            <p className={styles.modalDesc}>
              Copy this JSON schema definition to save to database registries or hardcoded file systems directly.
            </p>
            <textarea 
              readOnly 
              value={JSON.stringify(activePage, null, 2)} 
              className={styles.textareaExport}
              onClick={e => (e.target as HTMLTextAreaElement).select()}
            />
            <div className={styles.modalActions}>
              <button 
                className={styles.btnAction} 
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(activePage, null, 2));
                  alert('JSON Schema copied to clipboard!');
                }}
              >
                Copy to Clipboard
              </button>
              <button className={styles.btnActionSecondary} onClick={() => setShowJsonExport(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
