'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import ReviewAuthor from './ReviewAuthor';
import ReviewRating from './ReviewRating';
import ReviewMedia, { ReviewMediaItem } from './ReviewMedia';
import ReviewHelpfulActions from './ReviewHelpfulActions';
import styles from './ReviewCard.module.css';

export interface ReviewData {
  id: string;
  authorName: string;
  authorAvatarUrl?: string;
  rating: number;
  title: string;
  body: string;
  dateText: string;
  isVerifiedPurchase?: boolean;
  variantInfo?: string;
  media?: ReviewMediaItem[];
  helpfulCount: number;
  isHelpful?: boolean;
  vendorResponse?: {
    vendorName?: string;
    text: string;
    dateText?: string;
  };
}

export interface ReviewCardProps {
  review: ReviewData;
  onHelpful?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
  onMediaClick?: (mediaItem: ReviewMediaItem, index: number) => void;
  className?: string;
}

export default function ReviewCard({
  review,
  onHelpful,
  onReport,
  onMediaClick,
  className = '',
}: ReviewCardProps) {
  const {
    id,
    authorName,
    authorAvatarUrl,
    rating,
    title,
    body,
    dateText,
    isVerifiedPurchase,
    variantInfo,
    media,
    helpfulCount,
    isHelpful,
    vendorResponse,
  } = review;

  return (
    <article
      className={`${styles.card} ${className}`}
      data-testid={`review-card-${id}`}
    >
      <div className={styles.cardHeader}>
        <div className={styles.authorWrapper}>
          <ReviewAuthor name={authorName} avatarUrl={authorAvatarUrl} />
          {isVerifiedPurchase && (
            <span data-testid="verified-badge">
              <Badge variant="success" text="Verified Purchase" />
            </span>
          )}
        </div>
        <div className={styles.metaInfo}>
          <time data-testid="review-date">{dateText}</time>
        </div>
      </div>

      <div className={styles.ratingRow}>
        <ReviewRating rating={rating} />
        {variantInfo && (
          <span className={styles.variantInfo} data-testid="review-variant">
            • {variantInfo}
          </span>
        )}
      </div>

      <h3 className={styles.title} data-testid="review-title">
        {title}
      </h3>

      <p className={styles.body} data-testid="review-body">
        {body}
      </p>

      {media && media.length > 0 && (
        <ReviewMedia media={media} onMediaClick={onMediaClick} />
      )}

      {/* Official Seller Response */}
      {vendorResponse && (
        <div className={styles.vendorResponseBlock} data-testid="review-vendor-response">
          <div className={styles.vendorResponseHeader}>
            <span className={styles.vendorTitle}>
              Response from {vendorResponse.vendorName || 'Seller'}
            </span>
            {vendorResponse.dateText && (
              <time className={styles.vendorDate}>{vendorResponse.dateText}</time>
            )}
          </div>
          <p className={styles.vendorText}>{vendorResponse.text}</p>
        </div>
      )}

      <div className={styles.cardFooter}>
        <ReviewHelpfulActions
          helpfulCount={helpfulCount}
          isHelpful={isHelpful}
          onHelpful={onHelpful ? () => onHelpful(id) : undefined}
          onReport={onReport ? () => onReport(id) : undefined}
        />
      </div>
    </article>
  );
}
