'use client';

import React, { useState } from 'react';
import { FiZoomIn, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './ProductImageViewer.module.css';

export interface ProductImageViewerProps {
  images: { src: string; alt: string }[];
  selectedIndex: number;
  onZoomClick?: () => void;
}

export default function ProductImageViewer({
  images,
  selectedIndex,
  onZoomClick,
}: ProductImageViewerProps) {
  const image = images[selectedIndex] ?? images[0];

  return (
    <div className={styles.viewer} data-testid="product-image-viewer">
      <div className={styles.mainImageWrap}>
        {image && (
          <img
            src={image.src}
            alt={image.alt}
            className={styles.mainImage}
          />
        )}
        {onZoomClick && (
          <button
            type="button"
            className={styles.zoomBtn}
            onClick={onZoomClick}
            aria-label="Zoom image"
          >
            <FiZoomIn aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
