'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MarketingSection, MarketingItem } from '@/data/promoLayouts';
import styles from './MarketingSectionRenderer.module.css';

interface MarketingSectionRendererProps {
  section: MarketingSection;
  isEditMode?: boolean;
  onUpdateItemImage?: (sectionId: string, itemId: string, newImage: string) => void;
}

export default function MarketingSectionRenderer({
  section,
  isEditMode = false,
  onUpdateItemImage
}: MarketingSectionRendererProps) {
  // Carousel active slides index tracker
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto scroll for carousels
  useEffect(() => {
    if (section.type !== 'carousel-1' && section.type !== 'carousel-2') return;
    if (section.items.length <= 1) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % (section.type === 'carousel-2' ? Math.ceil(section.items.length / 2) : section.items.length));
    }, 4500);

    return () => clearInterval(interval);
  }, [section.items.length, section.type]);

  // Drag and drop event handlers
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    if (!isEditMode) return;
    setDragOverItemId(itemId);
  };

  const handleDragLeave = () => {
    setDragOverItemId(null);
  };

  const handleDrop = (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    setDragOverItemId(null);
    if (!isEditMode || !onUpdateItemImage) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.match('image.*')) {
        alert('Please drop an image file (PNG, JPG, JPEG, GIF, SVG).');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateItemImage(section.id, itemId, event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Build section background styling
  const containerStyle: React.CSSProperties = {
    backgroundColor: section.backgroundColor || 'transparent',
    backgroundImage: section.backgroundImageUrl ? `url(${section.backgroundImageUrl})` : undefined,
    backgroundSize: section.backgroundSize || 'cover',
  };

  // Map position tags to css layout anchors
  const getPositionClass = (pos?: string) => {
    switch (pos) {
      case 'top-left': return styles.topLeft;
      case 'top-right': return styles.topRight;
      case 'bottom-left': return styles.bottomLeft;
      case 'bottom-right': return styles.bottomRight;
      default: return styles.topRight;
    }
  };

  // Dropzone helper template
  const renderDropzone = (item: MarketingItem) => {
    if (!isEditMode) return null;

    const isHovered = dragOverItemId === item.id;

    return (
      <div className={`${styles.dropzoneOverlay} ${isHovered ? styles.visible : ''}`}>
        <div className={styles.dropzoneInfo}>
          <span>📥 Drop Image</span>
          <em>Recommended: {item.resolutionInfo}</em>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.sectionContainer} style={containerStyle}>
      {/* Festive accents / overlays */}
      {section.festiveHighlights && section.festiveHighlights.map((festive, i) => (
        <div 
          key={i} 
          className={`${styles.festiveOverlayElement} ${getPositionClass(festive.position)}`}
          style={{ opacity: festive.opacity ?? 0.8 }}
        >
          {festive.svgUrl || '🏮'}
        </div>
      ))}

      {/* Header section */}
      {(section.heading || section.subHeading) && (
        <div className={styles.sectionHeader}>
          {section.heading && (
            <h3 style={{ color: section.headingColor || 'var(--color-text-primary)' }}>
              {section.heading}
            </h3>
          )}
          {section.subHeading && <p>{section.subHeading}</p>}
        </div>
      )}

      {/* Render bubble grids */}
      {section.type === 'round-bubbles' && (
        <div className={styles.roundBubblesGrid}>
          {section.items.map((item) => (
            <div
              key={item.id}
              className={`${styles.bubbleItem} ${dragOverItemId === item.id ? styles.dragOver : ''}`}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, item.id)}
            >
              <Link href={item.linkUrl} className={styles.bubbleImageWrapper}>
                <img src={item.imageUrl} alt={item.title || ''} className={styles.bubbleImage} />
              </Link>
              {item.title && <span className={styles.bubbleTitle}>{item.title}</span>}
              {renderDropzone(item)}
            </div>
          ))}
        </div>
      )}

      {/* Render standard banner grids */}
      {(section.type === 'grid-2' || section.type === 'grid-3') && (
        <div className={`${styles.gridLayout} ${section.type === 'grid-2' ? styles.grid2 : styles.grid3}`}>
          {section.items.map((item) => (
            <div
              key={item.id}
              className={`${styles.editableItem} ${dragOverItemId === item.id ? styles.dragOver : ''}`}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, item.id)}
            >
              <Link href={item.linkUrl} className={styles.gridItem}>
                <img src={item.imageUrl} alt={item.title || ''} className={styles.gridImage} />
                {(item.title || item.subTitle) && (
                  <div className={styles.gridOverlay}>
                    {item.title && <h4>{item.title}</h4>}
                    {item.subTitle && <p>{item.subTitle}</p>}
                  </div>
                )}
              </Link>
              {renderDropzone(item)}
            </div>
          ))}
        </div>
      )}

      {/* Render carousels */}
      {(section.type === 'carousel-1' || section.type === 'carousel-2') && (
        <div className={`${styles.carouselLayout} ${section.type === 'carousel-1' ? styles.carousel1 : styles.carousel2}`}>
          <div 
            className={styles.carouselSlider}
            style={{ 
              transform: section.type === 'carousel-1' 
                ? `translateX(-${activeSlide * 100}%)`
                : `translateX(-${activeSlide * 50}%)`
            }}
          >
            {section.items.map((item) => (
              <div
                key={item.id}
                className={`${styles.carouselSlide} ${dragOverItemId === item.id ? styles.dragOver : ''}`}
                onDragOver={(e) => handleDragOver(e, item.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, item.id)}
              >
                <Link href={item.linkUrl}>
                  <img src={item.imageUrl} alt={item.title || ''} className={styles.carouselImage} />
                </Link>
                {renderDropzone(item)}
              </div>
            ))}
          </div>

          {/* Navigation dots */}
          {section.items.length > (section.type === 'carousel-2' ? 2 : 1) && (
            <div className={styles.carouselNav}>
              {Array.from({ 
                length: section.type === 'carousel-2' 
                  ? Math.ceil(section.items.length / 2) 
                  : section.items.length 
              }).map((_, i) => (
                <button
                  key={i}
                  className={`${styles.carouselDot} ${activeSlide === i ? styles.carouselActiveDot : ''}`}
                  onClick={() => setActiveSlide(i)}
                  aria-label={`Go to slide group ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
