'use client';

import React from 'react';
import ReviewCard, { ReviewData } from './ReviewCard';
import { ReviewMediaItem } from './ReviewMedia';
import styles from './ReviewList.module.css';

export interface ReviewListProps {
  reviews: ReviewData[];
  onHelpful?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
  onMediaClick?: (mediaItem: ReviewMediaItem, index: number) => void;
  className?: string;
}

export default function ReviewList({
  reviews,
  onHelpful,
  onReport,
  onMediaClick,
  className = '',
}: ReviewListProps) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <div className={`${styles.root} ${className}`} data-testid="review-list">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          onHelpful={onHelpful}
          onReport={onReport}
          onMediaClick={onMediaClick}
        />
      ))}
    </div>
  );
}
