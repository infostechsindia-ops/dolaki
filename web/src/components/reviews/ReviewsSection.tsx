'use client';

import React from 'react';
import ReviewsHeader, { ReviewsHeaderProps } from './ReviewsHeader';
import RatingSummary, { RatingSummaryProps } from './RatingSummary';
import RatingDistribution, { RatingDistributionItem } from './RatingDistribution';
import ReviewsToolbar, { ReviewsToolbarProps } from './ReviewsToolbar';
import ReviewList from './ReviewList';
import ReviewCard, { ReviewData } from './ReviewCard';
import ReviewsEmptyState from './ReviewsEmptyState';
import WriteReviewForm, { WriteReviewFormProps } from './WriteReviewForm';
import { ReviewMediaItem } from './ReviewMedia';
import styles from './ReviewsSection.module.css';

export interface ReviewsSectionProps {
  header?: Partial<ReviewsHeaderProps>;
  summary: RatingSummaryProps;
  distribution: RatingDistributionItem[];
  toolbar?: ReviewsToolbarProps;
  reviews?: ReviewData[];
  writeFormProps?: WriteReviewFormProps;
  isWritingReview?: boolean;
  onWriteReviewToggle?: () => void;
  onHelpful?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
  onMediaClick?: (mediaItem: ReviewMediaItem, index: number) => void;
  onWriteFirstReview?: () => void;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
  className?: string;
}

export default function ReviewsSection({
  header,
  summary,
  distribution,
  toolbar,
  reviews = [],
  writeFormProps,
  isWritingReview = false,
  onWriteReviewToggle,
  onHelpful,
  onReport,
  onMediaClick,
  onWriteFirstReview,
  surface = 'MARKETPLACE',
  className = '',
}: ReviewsSectionProps) {
  const surfaceClass = surface === 'QUICK_COMMERCE' ? styles.quickCommerce : styles.marketplace;
  const dataSurfaceAttr = surface === 'QUICK_COMMERCE' ? 'quick-commerce' : 'marketplace';

  return (
    <section
      className={`${styles.section} ${surfaceClass} ${className}`}
      data-surface={dataSurfaceAttr}
      data-testid="reviews-section"
      aria-label="Customer Reviews Section"
    >
      <ReviewsHeader
        title={header?.title}
        totalReviews={summary.totalReviews}
        onWriteReview={header?.onWriteReview || onWriteReviewToggle}
      />

      <div className={styles.summaryDistributionGrid}>
        <RatingSummary {...summary} />
        <RatingDistribution distribution={distribution} />
      </div>

      {isWritingReview && writeFormProps && (
        <WriteReviewForm {...writeFormProps} onCancel={writeFormProps.onCancel || onWriteReviewToggle} />
      )}

      {toolbar && <ReviewsToolbar {...toolbar} />}

      <div className={styles.mainContent}>
        {reviews.length > 0 ? (
          <ReviewList
            reviews={reviews}
            onHelpful={onHelpful}
            onReport={onReport}
            onMediaClick={onMediaClick}
          />
        ) : (
          <ReviewsEmptyState
            onWriteFirstReview={onWriteFirstReview || header?.onWriteReview || onWriteReviewToggle}
          />
        )}
      </div>
    </section>
  );
}

export {
  ReviewsHeader,
  RatingSummary,
  RatingDistribution,
  ReviewsToolbar,
  ReviewList,
  ReviewCard,
  ReviewsEmptyState,
  WriteReviewForm,
};
