'use client';

import React from 'react';
import styles from './ReviewMedia.module.css';

export interface ReviewMediaItem {
  id?: string;
  url: string;
  type?: 'image' | 'video';
  alt: string;
  thumbnailUrl?: string;
}

export interface ReviewMediaProps {
  media: ReviewMediaItem[];
  onMediaClick?: (item: ReviewMediaItem, index: number) => void;
  className?: string;
}

export default function ReviewMedia({
  media,
  onMediaClick,
  className = '',
}: ReviewMediaProps) {
  if (!media || media.length === 0) return null;

  return (
    <div className={`${styles.root} ${className}`} data-testid="review-media-grid">
      {media.map((item, index) => {
        const isVideo = item.type === 'video';
        const displayUrl = item.thumbnailUrl || item.url;

        return (
          <button
            key={item.id || `media-${index}`}
            type="button"
            className={styles.item}
            onClick={() => onMediaClick?.(item, index)}
            aria-label={`${isVideo ? 'Play video' : 'View photo'}: ${item.alt}`}
            data-testid={`review-media-item-${index}`}
          >
            <img
              src={displayUrl}
              alt={item.alt}
              className={styles.image}
              loading="lazy"
            />
            {isVideo && (
              <span className={styles.videoBadge} aria-hidden="true">
                ▶
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
