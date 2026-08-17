'use client';

import React from 'react';
import ProductImageViewer from './ProductImageViewer';
import styles from './ProductGallery.module.css';

export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductGalleryProps {
  images: ProductImage[];
  selectedIndex?: number;
  onSelectImage?: (index: number) => void;
  onZoomClick?: () => void;
}

export default function ProductGallery({
  images,
  selectedIndex = 0,
  onSelectImage,
  onZoomClick,
}: ProductGalleryProps) {
  return (
    <div className={styles.gallery} data-testid="product-gallery">
      <ProductImageViewer
        images={images}
        selectedIndex={selectedIndex}
        onZoomClick={onZoomClick}
      />

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className={styles.thumbnailStrip}
          role="tablist"
          aria-label="Product images"
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={idx === selectedIndex}
              className={`${styles.thumbnail} ${idx === selectedIndex ? styles.active : ''}`}
              onClick={() => onSelectImage?.(idx)}
              aria-label={`View image ${idx + 1}: ${img.alt}`}
            >
              <img src={img.src} alt={img.alt} className={styles.thumbImg} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
